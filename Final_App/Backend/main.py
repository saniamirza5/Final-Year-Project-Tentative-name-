from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from rag_handler import RAGHandler
from ai_handler import AIHandler
from mock_data import seed_mock_data
from sendData import stream_router

load_dotenv()

app = FastAPI(
    title="AI RAG API",
    description="FastAPI application for AI responses and RAG using Hugging Face Inference API",
    version="1.0.0"
)

# ---------------------------------------------------------------------------
# CORS — allow the frontend origins
# ---------------------------------------------------------------------------
frontend_origins = [
    origin.strip()
    for origin in os.getenv(
        "FRONTEND_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,http://localhost:8082,http://127.0.0.1:8082",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize handlers
rag_handler = RAGHandler()
hf_model_id = os.getenv("HF_MODEL_ID", "deepseek-ai/DeepSeek-V4-Pro")
ai_handler = AIHandler(model=hf_model_id)  # Will use mock mode if API fails

# Models
class QueryRequest(BaseModel):
    query: str
    use_rag: bool = True
    top_k: int = 3

class QueryResponse(BaseModel):
    response: str
    sources: Optional[List[str]] = None
    confidence: Optional[float] = None

class DocumentUploadResponse(BaseModel):
    message: str
    documents_count: int

# ---------------------------------------------------------------------------
# Mock-connection helpers
# ---------------------------------------------------------------------------
def is_mock_connection_query(query: str) -> bool:
    """Return True if the prompt contains any mock-trigger word."""
    lowered = query.lower()
    trigger_words = ("mock", "connection", "test", "backend")
    return any(word in lowered for word in trigger_words)


def build_mock_connection_response(query: str) -> QueryResponse:
    """Return a deterministic mock response for connection verification."""
    return QueryResponse(
        response=(
            "MOCK_BACKEND_CONNECTION_OK: FastAPI received your frontend request. "
            f"Echoed query: '{query}'. Dashboard sample: 4 late shipments, "
            "91% forecast confidence, 2 critical inventory alerts."
        ),
        sources=[
            "mock://backend/connection-check",
            "mock://shipments/late-count=4",
            "mock://inventory/critical-alerts=2",
        ],
        confidence=0.99,
    )


# ---------------------------------------------------------------------------
# Startup — seed mock supply-chain documents into the RAG store
# ---------------------------------------------------------------------------
@app.on_event("startup")
async def startup_seed_mock_data():
    """Load mock documents into ChromaDB on first boot (idempotent)."""
    try:
        seed_mock_data(rag_handler)
    except Exception as exc:
        print(f"[startup] Could not seed mock data: {exc}")


# Routes
@app.get("/", tags=["Health"])
async def root():
    """Health check endpoint"""
    return {
        "message": "AI RAG API is running",
        "status": "healthy",
        "version": "1.0.0",
        "mock_trigger": "POST /query with a prompt containing mock, connection, test, or backend",
    }

app.include_router(stream_router, prefix="/api/stream", tags=["Streaming"])

@app.post("/query", response_model=QueryResponse, tags=["AI Queries"])
async def query(request: QueryRequest):
    """
    Process a query with optional RAG.
    
    - **query**: The input query string
    - **use_rag**: Whether to use RAG for retrieval (default: True)
    - **top_k**: Number of top documents to retrieve (default: 3)
    """
    try:
        # --- mock-connection short-circuit ---
        if is_mock_connection_query(request.query):
            return build_mock_connection_response(request.query)

        if request.use_rag:
            # Retrieve relevant documents from vector store
            relevant_docs = rag_handler.retrieve(request.query, top_k=request.top_k)
            
            # Generate response using retrieved context
            response, confidence = ai_handler.generate_response(
                query=request.query,
                context=relevant_docs
            )
            
            # Extract sources
            sources = [doc.get("source", "Unknown") for doc in relevant_docs]
            
            return QueryResponse(
                response=response,
                sources=sources,
                confidence=confidence
            )
        else:
            # Generate response without RAG
            response, confidence = ai_handler.generate_response(query=request.query)
            
            return QueryResponse(
                response=response,
                confidence=confidence
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload-documents", response_model=DocumentUploadResponse, tags=["Document Management"])
async def upload_documents(files: List[UploadFile] = File(...)):
    """
    Upload documents for RAG indexing.
    Supports .txt, .pdf, and .md files.
    """
    try:
        documents = []
        
        for file in files:
            content = await file.read()
            
            # Simple text extraction (extend for PDF support)
            if file.filename.endswith(('.txt', '.md')):
                text = content.decode('utf-8')
                documents.append({
                    "content": text,
                    "source": file.filename
                })
        
        if not documents:
            raise HTTPException(status_code=400, detail="No valid documents provided")
        
        # Add documents to vector store
        count = rag_handler.add_documents(documents)
        
        return DocumentUploadResponse(
            message="Documents uploaded and indexed successfully",
            documents_count=count
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/clear-documents", tags=["Document Management"])
async def clear_documents():
    """Clear all documents from the vector store"""
    try:
        rag_handler.clear()
        return {"message": "Vector store cleared successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/documents-status", tags=["Document Management"])
async def get_documents_status():
    """Get the status of stored documents"""
    try:
        status = rag_handler.get_status()
        return status
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
