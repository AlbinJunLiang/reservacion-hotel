import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, retry, throwError } from 'rxjs';
import { TipoUsuario } from '../models/interfaces';
import { environment } from '../../../environments/environment';

const _SERVER = environment.servidor;
@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private readonly http = inject(HttpClient);
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'Application/json'
    })
  };
  constructor() { }

  getAll(): Observable<TipoUsuario[]> {
    return this.http.get<any>(`${_SERVER}/api/cliente/read`);
  }

  getCliente(id: number): Observable<TipoUsuario> {
    return this.http.get<any>(`${_SERVER}/api/cliente/read/${id}`);
  }


  guardarCliente(datos: TipoUsuario, id?: number): Observable<any> {
    if (id) {
      return this.http.put<any>(`${_SERVER}/api/cliente/${id}`, datos);

    }
    return this.http.post<any>(`${_SERVER}/api/cliente`, datos);
  }


  eliminarCliente(id: number): any {
    return this.http.delete<any>(`${_SERVER}/api/cliente/${id}`)
    .pipe(
      retry(1),
        map(()=>true),
        catchError(this.handleError)
    );
  }

  filtrarCliente(parametros: any) {
    let params = new HttpParams();
    for (const prop in parametros) {
      if (prop) {
        params = params.append(prop, parametros[prop]);
      }
    }
    return this.http.get<any>(`${_SERVER}/api/cliente/filtro`, { params: params });
  }

  private handleError(error: any) {
    return throwError(() => {
      return error.status;
    })
  }
}
