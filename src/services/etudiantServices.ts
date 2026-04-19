import type { Etudiant } from "../models/Etudiant";

const API_URL = "http://localhost:8080/etudiant";

// GET ALL
export async function getAllEtudiants(): Promise<Etudiant[]> {
  const res = await fetch(`${API_URL}/`);
  return res.json();
}

// GET ONE
export async function getEtudiant(cin: number): Promise<Etudiant> {
  const res = await fetch(`${API_URL}/${cin}`);
  return res.json();
}

// CREATE
export async function createEtudiant(etudiant: Etudiant): Promise<Response> {
  return fetch(`${API_URL}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(etudiant)
  });
}

// UPDATE
export async function updateEtudiant(etudiant: Etudiant): Promise<Response> {
  return fetch(`${API_URL}/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(etudiant)
  });
}

// DELETE
export async function deleteEtudiant(cin: number){
  return fetch(`${API_URL}/${cin}`, {
    method: "DELETE"
  });
}