import type { Reservation } from "./Reservation";
import type { Universite } from "./Universite";
export interface Etudiant {
  cin: number;
  nom: string;
  prenom: string;
  dateNaissance: string; 
  universite?: Universite;
  reservations?: Reservation[];
}