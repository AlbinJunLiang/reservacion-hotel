import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, retry, throwError } from 'rxjs';
import { TipoUsuario } from '../models/interfaces';
import { environment } from '../../../environments/environment';

const _SERVER = environment.servidor;
@Injectable({
  providedIn: 'root'
})
export class AdministradorService {

  private readonly http = inject(HttpClient);
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'Application/json'
    })
  };
  constructor() { }

  getAll(): Observable<TipoUsuario[]> {
    return this.http.get<any>(`${_SERVER}/api/administrador/read`);
  }

  getAdministrador(id: number): Observable<TipoUsuario> {
    return this.http.get<any>(`${_SERVER}/api/administrador/read/${id}`);
  }


  guardarAdministrador(datos: TipoUsuario, id?: number): Observable<any> {
    if (id) {
      return this.http.put<any>(`${_SERVER}/api/administrador/${id}`, datos);

    }
    return this.http.post<any>(`${_SERVER}/api/administrador`, datos);
  }


  eliminarAdministrador(id: number): any {
    return this.http.delete<any>(`${_SERVER}/api/administrador/${id}`)
    .pipe(
      retry(1),
        map(()=>true),
        catchError(this.handleError)
    );
  }

  filtrarAdministrador(parametros: any) {
    let params = new HttpParams();
    for (const prop in parametros) {
      if (prop) {
        params = params.append(prop, parametros[prop]);
      }
    }
    return this.http.get<any>(`${_SERVER}/api/administrador/filtro`, { params: params });
  }

  private handleError(error: any) {
    return throwError(() => {
      return error.status;
    })
  }
}
