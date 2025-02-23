import axios from "axios";

// Base URL for the backend (Update with your actual backend URL)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://your-backend-url.com/api";

// Create an axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // Timeout after 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});


export default api;
