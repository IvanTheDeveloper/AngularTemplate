import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const unauthenticatedUsersGuard: CanActivateFn = (route, state) => {

  const login = inject(AuthService)
  const router = inject(Router)

  if (login.isAuthenticated()) {
    router.navigateByUrl('/main')
    return false
  } else {
    return true
  }
  
}