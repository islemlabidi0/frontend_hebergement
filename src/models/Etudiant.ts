import type { Reservation } from "./Reservation";
export interface Etudiant {
  cin: number;
  nom: string;
  prenom: string;
  dateNaissance: string; 
  ecole: string;
  reservations?: Reservation[];
}