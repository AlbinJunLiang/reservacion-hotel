import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const srvToken = inject(TokenService); // Asegúrate de que TokenService está bien configurado
  const token = srvToken.token; // Asegúrate de que srvToken.token devuelve el token correcto
  const cloneReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}` // Asegúrate de que el token está en el formato correcto
    }
  });
  return next(cloneReq);
};
