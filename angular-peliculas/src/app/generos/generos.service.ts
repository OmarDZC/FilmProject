import { inject, Injectable } from '@angular/core';
import { GeneroCreacionDTO, GeneroDTO } from './generos';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PaginacionDTO } from '../compartidos/modelo/PaginacionDTO';
import { contruirQueryParams } from '../compartidos/funciones/contruirQueryParams';
import { IServicioCRUD } from '../compartidos/interfaces/IServicioCRUD';

@Injectable({
  providedIn: 'root'
})
export class GenerosService implements IServicioCRUD<GeneroDTO, GeneroCreacionDTO> {

  private http = inject(HttpClient);
  private urlBase = environment.apiUrl + '/generos';

  constructor() { }

  //para obtener el listado de generos => observable es como promise (trae algo en el futuro)
  public obtenerPaginado(paginacion: PaginacionDTO): Observable<HttpResponse<GeneroDTO[]>> {
    let queryParams = contruirQueryParams(paginacion);
    return this.http.get<GeneroDTO[]>(this.urlBase, { params: queryParams, observe: 'response' }); //construye la url con los queryParams y observa la respuesta completa
  }

  public crear(genero: GeneroCreacionDTO): Observable<any> {
    return this.http.post(this.urlBase, genero, { observe: 'response' });
  }

  public obtenerTodos(): Observable<GeneroDTO[]>{
    return this.http.get<GeneroDTO[]>(`${this.urlBase}/todos`);
  }

  //obtiene un genero por su id
  public obtenerPorId(id: number): Observable<GeneroDTO> {

    return this.http.get<GeneroDTO>(`${this.urlBase}/${id}`);
  }

  //actualiza un genero
  public actualizar(id: number, genero: GeneroCreacionDTO): Observable<any> {
    return this.http.put(`${this.urlBase}/${id}`, genero);
  }

  public borrar(id: number): Observable<any> {
    return this.http.delete(`${this.urlBase}/${id}`);
  }







}
