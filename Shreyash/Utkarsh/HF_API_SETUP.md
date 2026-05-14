# Setup Guide: Hugging Face Inference API

## What Changed?

The FastAPI application now uses **Hugging Face Inference API** instead of downloading and running models locally. This means:

✅ **No Model Downloads** - All processing on Hugging Face servers  
✅ **No GPU Needed** - No local hardware requirements  
✅ **No Storage** - Save disk space, no model files  
✅ **Instant Startup** - API starts immediately  
✅ **Always Up-to-date** - Auto-updated models on Hugging Face  

## Prerequisites

1. **Hugging Face Account** (free) - https://huggingface.co
2. **API Token** - From https://huggingface.co/settings/tokens

## Step-by-Step Setup

### 1. Create Hugging Face Account
- Visit https://huggingface.co
- Sign up (free account)
- Verify your email

### 2. Generate API Token
- Go to https://huggingface.co/settings/tokens
- Click "New token"
- Give it a name (e.g., "FastAPI-RAG")
- Select "Read" access
- Click "Generate"
- Copy the token

### 3. Configure Environment
```bash
# In your Utkarsh folder
cp .env.example .env
```

Edit `.env`:
```
HF_API_TOKEN=hf_paste_your_token_here
HF_MODEL_ID=deepseek-ai/DeepSeek-V4-Pro
```

### 4. Install Dependencies
```bash
pip install -r requirements.txt
```

### 5. Run API
```bash
python main.py
```

### 6. Test It
```bash
curl -X POST "http://localhost:8000/query" \
  -H "Content-Type: application/json" \
  -d '{"query": "Hello!", "use_rag": false}'
```

## Using Different Models

Change `HF_MODEL_ID` in `.env`:

**Fast Models:**
```
HF_MODEL_ID=distilgpt2
HF_MODEL_ID=gpt2
```

**Balanced:**
```
HF_MODEL_ID=EleutherAI/gpt-neo-2.7B
```

**High Quality:**
```
HF_MODEL_ID=deepseek-ai/DeepSeek-V4-Pro
HF_MODEL_ID=meta-llama/Llama-2-7b-hf
```

## API Limits

Hugging Face Inference API has usage limits:
- **Free tier**: Limited requests per day
- **Pro subscription**: Higher limits
- **Enterprise**: Custom limits

Check your quota at: https://huggingface.co/settings/billing/overview

## Troubleshooting

### "API token not found"
- Make sure `HF_API_TOKEN` is set in `.env`
- Token should start with `hf_`

### "PermissionError" on model
- Some models require acceptance of terms
- Visit model page on Hugging Face and click "I have read and agree..."

### "Rate limit exceeded"
- You've hit your API quota
- Wait or upgrade your Hugging Face plan
- Use a faster model (fewer tokens)

### "Connection timeout"
- Check internet connection
- Verify Hugging Face API status
- Try a different model

## Cost

- **Free Tier**: Limited free requests
- **Pro**: $9/month for higher limits
- **Enterprise**: Custom pricing

Most development/testing works fine on free tier.

## Security

- API token is sensitive - never commit `.env` to git
- Use environment variables or secret management in production
- Never share your token publicly

## Next Steps

1. Upload documents: `POST /upload-documents`
2. Query with RAG: `POST /query` with `use_rag: true`
3. Check docs: http://localhost:8000/docs

## Resources

- Hugging Face Hub: https://huggingface.co
- Inference API Docs: https://huggingface.co/docs/api-inference
- API Status: https://status.huggingface.co
