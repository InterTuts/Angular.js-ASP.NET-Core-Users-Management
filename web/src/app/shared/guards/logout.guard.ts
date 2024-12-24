// System Utils
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

// Installed Utils
import { Observable, of, switchMap } from 'rxjs';

// App Utils
import { UserService } from '../services/user.service';

// Configuration
@Injectable({
  providedIn: 'root'
})

// Logic
export class LogoutGuard implements CanActivate {

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.userService.logout().pipe(
      switchMap(() => {
        return of(this.router.parseUrl('/'));
      })
    );
  }
}
