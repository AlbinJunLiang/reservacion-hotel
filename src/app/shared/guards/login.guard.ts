import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../helpers/services/auth.service';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = (route, state) => {
  const authSrv = inject(AuthService);
  const router = inject(Router);
  if (authSrv.isLogged()) {
    router.navigate(['/home']);
  }
  return !authSrv.isLogged();
};
