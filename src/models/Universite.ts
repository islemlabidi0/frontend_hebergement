// src/models/Universite.ts

export interface Foyer {
  idFoyer?: number
  nomFoyer: string
  capaciteFoyer: number
}

export interface Universite {
  idUniversite?: number
  nomUniversite: string
  adresse: string
  foyer?: Foyer   
}
