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

export const deleteUniversite = (id: number) => {
  return axios.delete(`${API_URL}/delete/${id}`)
}

// ✅ CORRIGÉ : appelle maintenant /universite/affecterFoyerAUniversite (pas /foyer/...)
export const affecterFoyerAUniversite = (idFoyer: number, nomUniversite: string) => {
  return axios.put(
    `${API_URL}/affecterFoyerAUniversite`,
    null,
    { params: { idFoyer, nomUniversite } }
  )
}
