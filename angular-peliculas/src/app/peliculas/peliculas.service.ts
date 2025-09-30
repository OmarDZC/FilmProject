import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, ObservableNotification } from 'rxjs';
import { landingPageDTO, PeliculaCreacionDTO, PeliculaDTO, PeliculasPostGetDTO, PeliculasPutGetDTO } from './peliculas';
import { Form } from '@angular/forms';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';

@Injectable({
  providedIn: 'root'
})
export class PeliculasService {

  constructor() { }

  http = inject(HttpClient);
  private urlBase = environment.apiUrl + '/peliculas';


  public obtenerLangingPage() : Observable<landingPageDTO>{
    return this.http.get<landingPageDTO>(`${this.urlBase}/landing`);
  }

  //para obtener detalles de las peliculas
  public obtenerPorId(id : number) : Observable<PeliculaDTO>{
    return this.http.get<PeliculaDTO>(`${this.urlBase}/${id}`);
  }

  public crearGet() : Observable<PeliculasPostGetDTO>{
    return this.http.get<PeliculasPostGetDTO>(`${this.urlBase}/postget`);
  }

  //va a retornar peliculaDTO
  public crear(pelicula: PeliculaCreacionDTO) : Observable<PeliculaDTO> {
    const formData = this.construirFormData(pelicula);
    return this.http.post<PeliculaDTO>(this.urlBase, formData);
  }

  public actualizarGet(id: number) : Observable<PeliculasPutGetDTO>{
    return this.http.get<PeliculasPutGetDTO>(`${this.urlBase}/putget/${id}`);
  }

  public actualizar(id: number, pelicula: PeliculaCreacionDTO){
    const formData = this.construirFormData(pelicula);
    return this.http.put(`${this.urlBase}/${id}`, formData);
  }

  public borrar(id: number){
    return this.http.delete(`${this.urlBase}/${id}`);
  }

  //construir formData
  private construirFormData(pelicula: PeliculaCreacionDTO) : FormData{
    const formData = new FormData();
    formData.append('titulo', pelicula.titulo);
    formData.append('fechaLanzamiento', pelicula.fechaLanzamiento.toISOString().split('T')[0]);
    
    if(pelicula.poster){
      formData.append('poster', pelicula.poster);
    }
    if(pelicula.trailer){
      formData.append('trailer', pelicula.trailer);
    }

    formData.append('generosIds', JSON.stringify(pelicula.generosIds));
    formData.append('cinesIds', JSON.stringify(pelicula.cinesIds));
    formData.append('actores', JSON.stringify(pelicula.actores));

    return formData;
  }











}
