# AI RAG API

A simple FastAPI application for AI-powered responses with Retrieval-Augmented Generation (RAG) capabilities.

## Features

- **FastAPI** - Modern, fast web framework
- **RAG (Retrieval-Augmented Generation)** - Retrieve relevant documents and generate contextual responses
- **Vector Store** - Chroma database for document embeddings
- **Hugging Face Inference API** - Use models via API without downloading (no model storage needed)
- **Document Management** - Upload, index, and manage documents
- **No Local Model Storage** - All processing on Hugging Face servers
- **DeepSeek V4 Pro** - State-of-the-art model for intelligent responses

## Project Structure

```
.
├── main.py              # FastAPI application and routes
├── rag_handler.py       # RAG and vector store logic
├── ai_handler.py        # AI response generation
├── requirements.txt     # Python dependencies
├── .env.example         # Environment configuration template
└── README.md            # This file
```

## Prerequisites

- Python 3.8+
- pip (Python package manager)

## Installation

### 1. Clone or navigate to the project directory

```bash
cd Utkarsh
```

### 2. Create a virtual environment (recommended)

```bash
python -m venv venv
```

### 3. Activate virtual environment

**On macOS/Linux:**
```bash
source venv/bin/activate
```

**On Windows:**
```bash
venv\Scripts\activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Configure Hugging Face API Token

Copy the example environment file and set your Hugging Face API token:

```bash
cp .env.example .env
```

Edit `.env` and add your Hugging Face API token:
```
HF_API_TOKEN=hf_your_actual_token_here
HF_MODEL_ID=deepseek-ai/DeepSeek-V4-Pro
```

**To get your Hugging Face API token:**
1. Go to [Hugging Face Settings](https://huggingface.co/settings/tokens)
2. Create a new token with "read" access
3. Copy and paste it in `.env`

## Running the Application

### Start the server

```bash
python main.py
```

The API will be available at `http://localhost:8000`

Expected output:
```
Initializing Hugging Face Inference API for model: deepseek-ai/DeepSeek-V4-Pro
✓ Connection to Hugging Face Inference API successful
Hugging Face Inference API initialized successfully!
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Access the interactive documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### 1. Health Check

```bash
GET /
```

**Response:**
```json
{
  "message": "AI RAG API is running",
  "status": "healthy",
  "version": "1.0.0"
}
```

### 2. Query with AI (with optional RAG)

```bash
POST /query
```

**Request Body:**
```json
{
  "query": "What is machine learning?",
  "use_rag": true,
  "top_k": 3
}
```

**Response:**
```json
{
  "response": "Machine learning is a subset of artificial intelligence...",
  "sources": ["document1.txt", "document2.txt"],
  "confidence": 0.85
}
```

### 3. Upload Documents

```bash
POST /upload-documents
```

Upload one or more text/markdown files to index them for RAG:

```bash
curl -F "files=@document1.txt" -F "files=@document2.txt" http://localhost:8000/upload-documents
```

**Response:**
```json
{
  "message": "Documents uploaded and indexed successfully",
  "documents_count": 2
}
```

### 4. Get Document Status

```bash
GET /documents-status
```

**Response:**
```json
{
  "status": "active",
  "documents_count": 5,
  "collection_name": "documents",
  "embedding_model": "all-MiniLM-L6-v2"
}
```

### 5. Clear Vector Store

```bash
DELETE /clear-documents
```

**Response:**
```json
{
  "message": "Vector store cleared successfully"
}
```

## Usage Examples

### Example 1: Query without RAG

```bash
curl -X POST "http://localhost:8000/query" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Explain quantum computing",
    "use_rag": false
  }'
```

### Example 2: Upload documents and query with RAG

1. **Upload documents:**
```bash
curl -F "files=@my_document.txt" http://localhost:8000/upload-documents
```

2. **Query with RAG:**
```bash
curl -X POST "http://localhost:8000/query" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What is discussed in the documents?",
    "use_rag": true,
    "top_k": 5
  }'
```

## Configuration

### Environment Variables

Edit `.env` file to configure:

- `OPENAI_API_KEY` - Your OpenAI API key (required for real responses)
- `HOST` - API host (default: 0.0.0.0)
- `PORT` - API port (default: 8000)
- `RELOAD` - Auto-reload on code changes (default: True)
- `PERSIST_DIRECTORY` - Vector store location (default: ./chroma_db)

## Vector Store

The application uses **Chroma** for vector storage with:
- **Embedding Model**: all-MiniLM-L6-v2 (lightweight, efficient)
- **Persistence**: Automatically saves to `./chroma_db` directory
- **Similarity Search**: Uses cosine similarity for document retrieval

## Dependencies

- **fastapi** - Web framework
- **uvicorn** - ASGI server
- **pydantic** - Data validation
- **langchain** - LLM framework
- **langchain-huggingface** - Hugging Face integration
- **huggingface-hub** - Hugging Face Inference API client
- **chromadb** - Vector database
- **sentence-transformers** - Embedding generation
- **python-dotenv** - Environment configuration
- **requests** - HTTP client

## Notes

- **API Key Required**: Requires Hugging Face API token (free account available)
- **No Model Download**: All processing happens on Hugging Face servers
- **No Storage**: No disk space needed for models
- **Fast Startup**: API starts immediately without downloading models
- **No GPU Needed**: No local GPU required (Hugging Face handles it)
- **Performance**: Queries are processed on Hugging Face infrastructure
- **File Formats**: Currently supports `.txt` and `.md` files (extend `main.py` for PDF support)

## Extending the Application

### Add PDF Support

Install `pypdf`:
```bash
pip install pypdf
```

Modify the `upload_documents` function in `main.py` to handle PDF files.

### Use Different Hugging Face Models

Edit `.env` to change the model ID:

```
HF_API_TOKEN=hf_your_token_here
HF_MODEL_ID=meta-llama/Llama-2-7b-hf
```

Popular models available via Hugging Face Inference API:
- **Fast**: `distilgpt2`, `gpt2`
- **Balanced**: `EleutherAI/gpt-neo-2.7B`, `EleutherAI/gpt-j-6B`
- **High Quality**: `deepseek-ai/DeepSeek-V4-Pro`, `meta-llama/Llama-2-7b-hf`

### Use Different Embedding Models

In `rag_handler.py`, change:
```python
self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
```

Other options: `all-mpnet-base-v2` (larger but more accurate), `paraphrase-MiniLM-L6-v2`

## Troubleshooting

**Issue**: `ModuleNotFoundError: No module named 'huggingface_hub'`
- **Solution**: Install dependencies: `pip install -r requirements.txt`

**Issue**: `ValueError: Hugging Face API token not found`
- **Solution**: Set `HF_API_TOKEN` in `.env` file. Get token from https://huggingface.co/settings/tokens

**Issue**: `PermissionError` when accessing model
- **Solution**: Model may require acceptance of terms. Visit https://huggingface.co/ and accept model terms

**Issue**: Vector store not persisting
- **Solution**: Ensure `./chroma_db` directory exists and has write permissions

**Issue**: API connection timeout
- **Solution**: Check your internet connection and Hugging Face API status

## License

MIT License

## Support

For issues or questions, please refer to the project documentation or contact the development team.
