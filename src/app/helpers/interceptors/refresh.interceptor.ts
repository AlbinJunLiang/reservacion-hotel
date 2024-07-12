import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { finalize } from 'rxjs';

export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  const srvAuth = inject(AuthService);

  return next(req)
  .pipe(
    finalize(
() =>{
  if(srvAuth.isLogged()){
    srvAuth.verificarRefresh();
  }
}
    )
  );
};
