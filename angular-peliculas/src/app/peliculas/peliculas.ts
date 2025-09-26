import { ActorAutoCompleteDTO } from "../actores/actores"

export interface PeliculaDTO {
    id: number,
    titulo: string,
    fechaLanzamiento: Date,
    trailer: string,
    poster?: string, //porque va a ser una url
}

export interface PeliculaCreacionDTO {
    titulo: string,
    fechaLanzamiento: Date,
    trailer: string,
    poster?: File //para insertar la foto
    generosIds?: number[],
    cinesIds?: number[],
    actores?: ActorAutoCompleteDTO[], 
}