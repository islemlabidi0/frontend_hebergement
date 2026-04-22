import axios from "axios";

const API_URL = "http://localhost:8080/foyer";

export interface Foyer {
  idFoyer?: number;
  nomFoyer: string;
  capaciteFoyer: number;
}

export const getAllFoyers = () =>
  axios.get<Foyer[]>(API_URL + "/all");

export const searchFoyers = (keyword: string) =>
  axios.get<Foyer[]>(`${API_URL}/search`, { params: { keyword } });

export const addFoyer = (foyer: Foyer) =>
  axios.post<Foyer>(API_URL + "/add", foyer);

export const updateFoyer = (foyer: Foyer) =>
  axios.put<Foyer>(API_URL + "/update", foyer);

export const deleteFoyer = (id: number) =>
  axios.delete(`${API_URL}/${id}`);
