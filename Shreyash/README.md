Run the connected Sania frontend and Utkarsh backend:

1. Start the backend:
   ```powershell
   cd Utkarsh
   pip install -r requirements.txt
   python main.py
   ```

2. Start the frontend in a second terminal:
   ```powershell
   cd Sania\Frontend
   npm install
   npm run dev
   ```

3. Keep testing the connection:
   ```powershell
   cd Sania\Frontend
   npm run test:connection
   ```

   Or run it continuously while developing:
   ```powershell
   npm run test:connection:watch
   ```

   To test the frontend/backend contract without starting Python:
   ```powershell
   npm run test:connection:mock
   ```

The frontend uses `VITE_API_BASE_URL` and defaults to `http://localhost:8000`.
