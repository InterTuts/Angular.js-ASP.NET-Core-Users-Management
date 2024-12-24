// System Utils
import { Injectable } from '@angular/core';

// Installed Utils
import { CookieService } from 'ngx-cookie-service';

// Configuration
@Injectable({
  providedIn: 'root',
})

// Login
export class TokensService {
  constructor(private cookieService: CookieService) {}

  // Accessors

  get getToken(): string {
    return this.cookieService.get('jwt');
  }

  // Other methods

  saveToken(token: string, rememberMe: boolean): void {

    // Save jwt token
    this.cookieService.set('jwt', token, {
      path: '/',
      expires: 14,
      secure: true,
      sameSite: 'Strict',
    });

    // Verify if rememberMe is false
    if ( !rememberMe ) {

      // Save temporary mark to delete the jwt after reload
      this.cookieService.set('jwtTemp', token, {
        path: '/',
        expires: 14,
        secure: true,
        sameSite: 'Strict',
      });

    }

  }

  deleteToken(): void {
    this.cookieService.delete('jwt', '/');
  }
}
