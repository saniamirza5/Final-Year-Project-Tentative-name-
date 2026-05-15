"""
Example usage of the AI RAG API with Hugging Face Inference API
This script demonstrates how to interact with the API programmatically

Before running:
1. Set HF_API_TOKEN in .env
2. Start the API with: python main.py
"""

import requests
import json
from typing import Dict, Any

# API base URL
BASE_URL = "http://localhost:8000"

def health_check():
    """Check if the API is running"""
    print("\n=== Health Check ===")
    response = requests.get(f"{BASE_URL}/")
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))

def upload_documents(file_paths: list):
    """Upload documents to the vector store"""
    print("\n=== Upload Documents ===")
    
    with open(file_paths[0], 'rb') as f:
        files = [('files', (file_paths[0], f))]
        response = requests.post(f"{BASE_URL}/upload-documents", files=files)
    
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))

def query_with_rag(query: str, top_k: int = 3):
    """Query with RAG enabled"""
    print(f"\n=== Query with RAG ===")
    print(f"Query: {query}")
    
    payload = {
        "query": query,
        "use_rag": True,
        "top_k": top_k
    }
    
    response = requests.post(f"{BASE_URL}/query", json=payload)
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))

def query_without_rag(query: str):
    """Query without RAG"""
    print(f"\n=== Query without RAG ===")
    print(f"Query: {query}")
    
    payload = {
        "query": query,
        "use_rag": False
    }
    
    response = requests.post(f"{BASE_URL}/query", json=payload)
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))

def get_documents_status():
    """Get status of documents in vector store"""
    print("\n=== Documents Status ===")
    
    response = requests.get(f"{BASE_URL}/documents-status")
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))

def clear_documents():
    """Clear all documents from vector store"""
    print("\n=== Clear Documents ===")
    
    response = requests.delete(f"{BASE_URL}/clear-documents")
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))

if __name__ == "__main__":
    print("AI RAG API - Example Usage")
    print("=" * 50)
    
    # 1. Health check
    health_check()
    
    # 2. Create a sample document for testing
    print("\n=== Creating Sample Document ===")
    sample_content = """
    Machine Learning is a subset of Artificial Intelligence that focuses on 
    enabling computer systems to learn and improve from experience without being 
    explicitly programmed. It involves algorithms that can analyze data, identify 
    patterns, and make decisions with minimal human intervention.
    
    Key concepts in Machine Learning:
    1. Supervised Learning - Learning from labeled data
    2. Unsupervised Learning - Finding patterns in unlabeled data
    3. Reinforcement Learning - Learning through interaction and feedback
    4. Deep Learning - Using neural networks with multiple layers
    """
    
    with open("sample_document.txt", "w") as f:
        f.write(sample_content)
    
    print("Sample document created: sample_document.txt")
    
    # 3. Upload documents
    # Note: Uncomment when API is running and modify file path if needed
    # upload_documents(["sample_document.txt"])
    
    # 4. Get documents status
    # get_documents_status()
    
    # 5. Query without RAG
    query_without_rag("What is machine learning?")
    
    # 6. Query with RAG (uncomment after uploading documents)
    # query_with_rag("Explain the key concepts in machine learning", top_k=2)
    
    print("\n" + "=" * 50)
    print("Examples completed. Uncomment additional examples to test with running API.")
