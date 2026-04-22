// src/services/universiteServices.ts
import axios from 'axios'
import type { Universite } from '../models/Universite'

const API_URL = 'http://localhost:8080/universite'

export const getAllUniversites = () => {
  return axios.get<Universite[]>(`${API_URL}/getAll`)
}

export const getUniversiteById = (id: number) => {
  return axios.get<Universite>(`${API_URL}/get/${id}`)
}

export const addUniversite = (universite: Universite) => {
  return axios.post(`${API_URL}/add`, universite)
}

export const updateUniversite = (universite: Universite) => {
  return axios.put<Universite>(`${API_URL}/update`, universite)
}

export const deleteUniversite = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${id}`)
    return response
  } catch (error: any) {
    // Personnaliser le message d'erreur
    if (error.response?.status === 409 || error.response?.data?.includes('foreign key')) {
      throw new Error('Cette université est associée à des étudiants et ne peut pas être supprimée.')
    }
    throw error
  }}


export const affecterFoyerAUniversite = (idFoyer: number, nomUniversite: string) => {
  return axios.put(
    `${API_URL}/affecterFoyerAUniversite`,
    null,
    { params: { idFoyer, nomUniversite } }
  )
}
