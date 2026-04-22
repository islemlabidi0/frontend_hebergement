import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export interface ChatRequest {
  message: string
}

export interface ChatResponse {
  response: string
}

export const sendChatMessage = async (message: string): Promise<string> => {
  try {
    const { data } = await axios.post<ChatResponse>(
      `${API_BASE_URL}/chatbot`,
      { message },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 90000  // ← bumped to 90s to match Ollama response time
      }
    )

    return data.response || "Aucune réponse reçue."

  } catch (error) {
    console.error("Erreur API chatbot:", error)
    throw error
  }
}