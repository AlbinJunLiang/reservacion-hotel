import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from '../../helpers/services/auth.service';

const ENDPOINT = environment.servidor + "/api/usr";
export interface IPassw {
  passw: string,
  passwN: string
}
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly http = inject(HttpClient);
  private readonly srvAuth = inject(AuthService);
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'Application/json'
    })
  };
  constructor() { }



  savePassw(datos: IPassw): Observable<any> {
    return this.http.patch<any>(`${ENDPOINT}/change/passw/${this.srvAuth.valorUsrActual.idUsuario}`, datos)
      .pipe(
        map(() => true),
        catchError((error) => {
          return of(error.status);
        })
      );
  }
  
  resetPassw(idUsuario: string): Observable<any> {
    return this.http.patch<any>(`${ENDPOINT}/reset/passw/${idUsuario}`, {})
      .pipe(
        map(() => true),
        catchError((error) => {
          return of(error.status);
        })
      );
  }
}
