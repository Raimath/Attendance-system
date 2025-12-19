import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios';
import './index.css'
import App from './App.jsx'

// Set the base URL for API calls. 
// In development, it uses localhost:5000. In production, it uses your Render backend URL.
axios.defaults.baseURL = import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://attendance-system-server-5okt.onrender.com');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
