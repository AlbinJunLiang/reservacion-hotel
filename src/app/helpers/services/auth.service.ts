import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, retry, tap } from 'rxjs';
import { Token } from '../models/interfaces';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { User } from '../models/user';

const _SERVER = environment.servidor;
const LIMITE_REFERSH = 20;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private srvToken = inject(TokenService);
  private router = inject(Router);
  private usrActualSubject = new BehaviorSubject<User>(new User());
  public usrActual = this.usrActualSubject.asObservable();
  private readonly http = inject(HttpClient);

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'Application/json'
    })
  };
  constructor() { }

  public get valorUsrActual(): User {
    return this.usrActualSubject.value;
  }

  public login(datos: { usuario: '', passw: '' }): Observable<any> {
    return this.http.post<any>(`${_SERVER}/api/auth/iniciar`, datos)
      .pipe(
        retry(1),
        // Login guardar tokens
        tap((tokens) => {
          this.doLogin(tokens);
          this.router.navigate([`/home`]);
        }),
        map(() => true),
        catchError((error) => {
          return of(error.status);
        })
      );
  }

  public logout() {
    if (this.isLogged()) {
      this.http
        .patch(`${_SERVER}/api/auth/cerrar/${this.valorUsrActual.idUsuario}`, {}) // falta del id Usuario
        .subscribe();
      this.doLogout();
    }
  }

  private doLogin(tokens: Token) {
    this.srvToken.setTokens(tokens);
    this.usrActualSubject.next(this.getUserActual());
    // COMPARTIR DATOS DE LA SESION A TODA LA APLICACION
  }



  private doLogout() {
    if (this.srvToken.token) {
      this.srvToken.eliminarTokens();
    }
    // Limpiar los datos compartidos por el usuario
    this.usrActualSubject.next(this.getUserActual());
    this.router.navigate(['/login']);
  }

  public isLogged(): boolean {
    return !!this.srvToken.token && !this.srvToken.jwtTokenExp();
  }

  getUserActual(): User {
    if (!this.srvToken.token) {
      return new User();
    }
    const tokenD = this.srvToken.decodeToken();
    return { idUsuario: tokenD.sub, nombre: tokenD.nom, rol: tokenD.rol }
  }


  public verificarRefresh(): boolean {
    if (this.isLogged()) {
      const tiempo = this.srvToken.tiempoExpToken();
      if (tiempo <= 0) {
        this.logout();
        return false;
      }
      if (tiempo > 0 && tiempo <= LIMITE_REFERSH) {
        this.srvToken.refreshTokens();
      }
      return true;
    } else {
      this.logout();
      return false;
    }
  }
}
