import { inject, Injectable } from '@angular/core';
import { IServicioCRUD } from '../compartidos/interfaces/IServicioCRUD';
import { CineCreacionDTO, CineDTO } from './cines';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginacionDTO } from '../compartidos/modelo/PaginacionDTO';
import { environment } from '../../environments/environment';
import { contruirQueryParams } from '../compartidos/funciones/contruirQueryParams';

@Injectable({
  providedIn: 'root'
})
export class CinesService implements IServicioCRUD<CineDTO, CineCreacionDTO>{

  private http = inject(HttpClient);
  private urlBase = environment.apiUrl + '/cines';


  constructor() { }
  obtenerPaginado(paginacion: PaginacionDTO): Observable<HttpResponse<CineDTO[]>> {
    let queryParams = contruirQueryParams(paginacion);
    return this.http.get<CineDTO[]>(this.urlBase, {params: queryParams, observe: 'response'});
  }
  obtenerPorId(id: number): Observable<CineDTO> {
    return this.http.get<CineDTO>(`${this.urlBase}/${id}`);
  }
  actualizar(id: number, entidad: CineCreacionDTO): Observable<any> {
    return this.http.put(`${this.urlBase}/${id}`, entidad);
  }
  crear(entidad: CineCreacionDTO): Observable<any> {
    return this.http.post(this.urlBase, entidad);
  }
  borrar(id: number): Observable<any> {
    return this.http.delete(`${this.urlBase}/${id}`);
  }
}
