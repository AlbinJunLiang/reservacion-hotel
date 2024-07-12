import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, retry, throwError } from 'rxjs';
import { IHabitacion } from '../models/interfaces';
import { environment } from '../../../environments/environment';

const _SERVER = environment.servidor;
@Injectable({
  providedIn: 'root'
})
export class HabitacionService {

  private readonly http = inject(HttpClient);
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'Application/json'
    })
  };
  constructor() { }

  getAll(): Observable<IHabitacion[]> {
    return this.http.get<any>(`${_SERVER}/api/habitacion/read`);
  }

  getDisponible(): Observable<IHabitacion[]> {
    return this.http.get<any>(`${_SERVER}/api/habitacion/searchroom`);
  }

  getHabitacion(id: number): Observable<IHabitacion> {
    return this.http.get<any>(`${_SERVER}/api/habitacion/read/${id}`);
  }


  guardarHabitacion(datos: IHabitacion, id?: number): Observable<any> {
    if (id) {
      return this.http.put<any>(`${_SERVER}/api/habitacion/${id}`, datos);

    }
    return this.http.post<any>(`${_SERVER}/api/habitacion`, datos);
  }




/**
 * Todas las habitaciones de las reservaciones expiradas seran desocupadas
 * @returns 
 */
  liberarHabitaciones(): Observable<any> {
    return this.http.patch<any>(`${_SERVER}/api/habitacion/release`, {})
      .pipe(
        map(() => true),
        catchError((error) => {
          return of(error.status);
        })
      );
  }


  eliminarHabitacion(id: number): any {
    return this.http.delete<any>(`${_SERVER}/api/habitacion/${id}`)
    .pipe(
      retry(1),
        map(()=>true),
        catchError(this.handleError)
    );
  }

  filtrarHabitacion(parametros: any) {
    let params = new HttpParams();
    for (const prop in parametros) {
      if (prop) {
        params = params.append(prop, parametros[prop]);
      }
    }
    return this.http.get<any>(`${_SERVER}/api/habitacion/filtro`, { params: params });
  }

  private handleError(error: any) {
    return throwError(() => {
      return error.status;
    })
  }
}
