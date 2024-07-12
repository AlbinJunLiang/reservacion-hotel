import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../helpers/services/auth.service';
import { TokenService } from '../../helpers/services/token.service';

export const authGuard: CanActivateFn = (route, state) => {
  const srvAuth = inject(AuthService);
  const router =  inject(Router);

  if(srvAuth.isLogged()){
   // console.log(inject(TokenService).tiempoExpToken());

    if(Object.keys(route.data).length !== 0 && route.data['roles'].indexOf(srvAuth.valorUsrActual.rol)===-1){
      router.navigate(['/error403']);
      return false;
    }
    return true;
  }
  srvAuth.logout();
  router.navigate(['/login']);
  return false;
};
