from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from rag_handler import RAGHandler
from ai_handler import AIHandler

load_dotenv()

app = FastAPI(
    title="AI RAG API",
    description="FastAPI application for AI responses and RAG using Hugging Face Inference API",
    version="1.0.0"
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

# Routes
@app.get("/", tags=["Health"])
async def root():
    """Health check endpoint"""
    return {
        "message": "AI RAG API is running",
        "status": "healthy",
        "version": "1.0.0"
    }

@app.post("/query", response_model=QueryResponse, tags=["AI Queries"])
async def query(request: QueryRequest):
    """
    Process a query with optional RAG.
    
    - **query**: The input query string
    - **use_rag**: Whether to use RAG for retrieval (default: True)
    - **top_k**: Number of top documents to retrieve (default: 3)
    """
    try:
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
