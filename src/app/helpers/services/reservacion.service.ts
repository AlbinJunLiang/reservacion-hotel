import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, retry, throwError } from 'rxjs';
import { IReservacion } from '../models/interfaces';
import { environment } from '../../../environments/environment';

const _SERVER = environment.servidor;
@Injectable({
  providedIn: 'root'
})
export class ReservacionService {

  private readonly http = inject(HttpClient);
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'Application/json'
    })
  };
  constructor() { }

  getAll(): Observable<IReservacion[]> {
    return this.http.get<any>(`${_SERVER}/api/reservacion/read`);
  }

  getReservacion(id: number): Observable<IReservacion> {
    return this.http.get<any>(`${_SERVER}/api/reservacion/read/${id}`);
  }


  guardarReservacion(datos: IReservacion, id?: number): Observable<any> {
    if (id) {
      return this.http.put<any>(`${_SERVER}/api/reservacion/${id}`, datos);

    }
    return this.http.post<any>(`${_SERVER}/api/reservacion`, datos);
  }


  eliminarReservacion(id: number): any {
    return this.http.delete<any>(`${_SERVER}/api/reservacion/${id}`)
    .pipe(
      retry(1),
        map(()=>true),
        catchError(this.handleError)
    );
  }

  /**
   * Libera la habitacion que fue ocupada y el registro de reservacion queda en estado CANCELADO
   * @param id 
   * @returns 
   */
  cancelarReservacion(id: number): any {
    return this.http.patch<any>(`${_SERVER}/api/reservacion/cancel/${id}`,{})
    .pipe(
      retry(1),
        map(()=>true),
        catchError(this.handleError)
    );
  }

  filtrarReservacion(parametros: any) {
    let params = new HttpParams();
    for (const prop in parametros) {
      if (prop) {
        params = params.append(prop, parametros[prop]);
      }
    }
    return this.http.get<any>(`${_SERVER}/api/reservacion/filtro`, { params: params });
  }


/**
 * Se ocupa de una habitacion y se crea un registro en la tabla reservacion 
 * @param datos 
 * @returns 
 */  
  reservarHabitacion(datos: any): Observable<any> {
    return this.http.post<any>(`${_SERVER}/api/reservacion/reserve`, datos);
  }

  private handleError(error: any) {
    return throwError(() => {
      return error.status;
    })
  }
}
