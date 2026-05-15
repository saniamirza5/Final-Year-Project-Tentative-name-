from typing import List, Dict, Any
import chromadb
from sentence_transformers import SentenceTransformer
import os

class RAGHandler:
    """
    Handles Retrieval-Augmented Generation using Chroma vector database
    """
    
    def __init__(self, persist_directory: str = "./chroma_db"):
        """
        Initialize RAG handler with Chroma vector store
        
        Args:
            persist_directory: Directory to persist the vector database
        """
        self.persist_directory = persist_directory
        
        # Create directory if it doesn't exist
        os.makedirs(persist_directory, exist_ok=True)
        
        # Initialize Chroma client with persistence (new API for 0.5.x)
        self.client = chromadb.PersistentClient(path=persist_directory)
        
        # Get or create collection
        self.collection = self.client.get_or_create_collection(
            name="documents",
            metadata={"hnsw:space": "cosine"}
        )
        
        # Initialize embedding model
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Document counter
        self.doc_count = 0
    
    def add_documents(self, documents: List[Dict[str, Any]]) -> int:
        """
        Add documents to the vector store
        
        Args:
            documents: List of document dictionaries with 'content' and 'source'
        
        Returns:
            Number of documents added
        """
        try:
            ids = []
            embeddings = []
            metadatas = []
            documents_text = []
            
            for i, doc in enumerate(documents):
                doc_id = f"doc_{self.doc_count}_{i}"
                content = doc.get("content", "")
                source = doc.get("source", "unknown")
                
                # Generate embedding
                embedding = self.embedding_model.encode(content).tolist()
                
                ids.append(doc_id)
                embeddings.append(embedding)
                metadatas.append({"source": source})
                documents_text.append(content)
            
            # Add to collection
            self.collection.add(
                ids=ids,
                embeddings=embeddings,
                metadatas=metadatas,
                documents=documents_text
            )
            
            # Data is automatically persisted with PersistentClient
            self.doc_count += len(documents)
            
            return len(documents)
        
        except Exception as e:
            raise Exception(f"Error adding documents: {str(e)}")
    
    def retrieve(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        """
        Retrieve relevant documents for a query
        
        Args:
            query: The query string
            top_k: Number of top documents to retrieve
        
        Returns:
            List of relevant documents with metadata
        """
        try:
            # Generate query embedding
            query_embedding = self.embedding_model.encode(query).tolist()
            
            # Query the collection
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k
            )
            
            # Format results
            documents = []
            if results and results['documents']:
                for i, doc in enumerate(results['documents'][0]):
                    metadata = results['metadatas'][0][i] if results['metadatas'] else {}
                    distance = results['distances'][0][i] if results['distances'] else 0
                    
                    documents.append({
                        "content": doc,
                        "source": metadata.get("source", "unknown"),
                        "similarity": 1 - distance  # Convert distance to similarity
                    })
            
            return documents
        
        except Exception as e:
            raise Exception(f"Error retrieving documents: {str(e)}")
    
    def clear(self) -> None:
        """Clear all documents from the vector store"""
        try:
            self.client.delete_collection(name="documents")
            self.collection = self.client.get_or_create_collection(
                name="documents",
                metadata={"hnsw:space": "cosine"}
            )
            # PersistentClient auto-persists — no manual persist needed
            self.doc_count = 0
        except Exception as e:
            raise Exception(f"Error clearing documents: {str(e)}")
    
    def get_status(self) -> Dict[str, Any]:
        """Get the status of the vector store"""
        try:
            count = self.collection.count()
            return {
                "status": "active",
                "documents_count": count,
                "collection_name": "documents",
                "embedding_model": "all-MiniLM-L6-v2"
            }
        except Exception as e:
            raise Exception(f"Error getting status: {str(e)}")
