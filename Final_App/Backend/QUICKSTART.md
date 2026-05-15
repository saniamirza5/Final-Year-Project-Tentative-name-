# Quick Start Guide

## 5-Minute Setup

### Step 1: Install Dependencies
```bash
cd Utkarsh
pip install -r requirements.txt
```

### Step 2: Configure Hugging Face API Token
```bash
cp .env.example .env
```

Edit `.env` and add your API token:
```
HF_API_TOKEN=hf_your_token_here
HF_MODEL_ID=deepseek-ai/DeepSeek-V4-Pro
```

**Get your token:**
1. Visit https://huggingface.co/settings/tokens
2. Create a new token with "read" access
3. Paste it in `.env`

### Step 3: Run the Server
```bash
python main.py
```

You should see:
```
Initializing Hugging Face Inference API for model: deepseek-ai/DeepSeek-V4-Pro
✓ Connection to Hugging Face Inference API successful
Hugging Face Inference API initialized successfully!
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Step 4: Test the API

Open your browser and go to:
- **Interactive Docs**: http://localhost:8000/docs

Or use curl:
```bash
# Simple query without RAG
curl -X POST "http://localhost:8000/query" \
  -H "Content-Type: application/json" \
  -d '{"query": "Hello, how are you?", "use_rag": false}'
```

## Common Tasks

### Upload a Document
```bash
curl -F "files=@myfile.txt" http://localhost:8000/upload-documents
```

### Query with RAG
```bash
curl -X POST "http://localhost:8000/query" \
  -H "Content-Type: application/json" \
  -d '{"query": "What is in my documents?", "use_rag": true, "top_k": 3}'
```

### Check What's Stored
```bash
curl http://localhost:8000/documents-status
```

### Clear All Documents
```bash
curl -X DELETE http://localhost:8000/clear-documents
```

## Without Local Model Storage?

Perfect! The API uses Hugging Face Inference API - no models are downloaded locally. Just set your API token and you're ready.

## Next Steps

1. **Upload Your Documents**: Add .txt or .md files to enable RAG
2. **Switch Models**: Edit `.env` to use different Hugging Face models
3. **Extend Functionality**: Add new endpoints or features
4. **Production Deployment**: Use Gunicorn and a reverse proxy (Nginx)

## Troubleshooting

**Can't connect to localhost:8000?**
- Make sure the server is running: `python main.py`
- Check if port 8000 is available: `lsof -i :8000`

**Getting "API token not found" error?**
- Set `HF_API_TOKEN` in `.env`
- Get your token from https://huggingface.co/settings/tokens

**Getting import errors?**
- Reinstall dependencies: `pip install -r requirements.txt --force-reinstall`

**API connection timeout?**
- Check your internet connection
- Verify Hugging Face API status
- Make sure your token is valid

## Documentation

See `README.md` for full documentation and API reference.
