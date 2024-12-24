// System Utils
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

// Installed Utils
import { Observable, of, switchMap } from 'rxjs';

// App Utils
import { UserService } from '../services/user.service';
import { isPlatformBrowser } from '@angular/common';

// Configuration
@Injectable({
  providedIn: 'root'
})

// Logic
export class AuthGuard implements CanActivate {

  constructor(
    private userService: UserService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (isPlatformBrowser(this.platformId)) {
      // Check the authentication status
      return this.userService.check.pipe(
        switchMap((authenticated) => {
          if (authenticated) {
            this.router.navigate(['/account/dashboard']);
            return of(false);
          }
          return of(true);
        })
      );
    } else {
      return of(true);
    }
  }
}
