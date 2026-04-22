import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export interface ChatRequest {
  message: string
}

export interface ChatResponse {
  response: string
}

/**
 * Sends the user's message to Spring Boot which calls Grok AI.
 * Returns the AI-generated response string.
 */
export const sendChatMessage = async (message: string): Promise<string> => {
  const { data } = await axios.post<ChatResponse>(
    `${API_BASE_URL}/chatbot`,
    { message } as ChatRequest,
    { headers: { 'Content-Type': 'application/json' }, timeout: 30000 }
  )
  return data.response
}