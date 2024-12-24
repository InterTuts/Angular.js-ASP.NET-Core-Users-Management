// System Utils
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Installed Utils
import { Observable, tap } from 'rxjs';

// App Utils
import { environment } from '../../environment';
import { User, UserSocial } from '../models/user.model';
import { UserService } from './user.service';

// Configuration
@Injectable({
  providedIn: 'root'
})

// Logic
export class GoogleService {

  // Inject services
  constructor(
    private httpClient: HttpClient,
    private userService: UserService
  ) { }

  register(credentials: {
    socialId: string;
    email: string;
    password: string;
  }): Observable<UserSocial> {
    return this.httpClient
      .post<UserSocial>(
        environment.apiUrl + `api/v1.0/auth/google-register`,
        {
          socialId: credentials.socialId,
          email: credentials.email,
          password: credentials.password
        }
      )
      .pipe(tap(({ content }) => {
        if ( typeof content?.token === 'string' ) {
          this.userService.rememberMe = true;
          this.userService.saveUser(content);
          const user: User = {
            userId: content.userId,
            email: content.email,
            token: content.token
          };
          this.userService.currentUserSubject.next(user);
          this.userService.isAuthenticated = true;
        }
      }));
  }

  authorizeCode(credentials: {
    code: string;
  }): Observable<UserSocial> {
    return this.httpClient
      .post<UserSocial>(
        environment.apiUrl + `api/v1.0/auth/google-token`,
        {
          code: credentials.code
        }
      )
      .pipe(tap(({ content }) => {
        if ( typeof content?.token === 'string' ) {
          this.userService.rememberMe = true;
          this.userService.saveUser(content);
          const user: User = {
            userId: content.userId,
            email: content.email,
            token: content.token
          };
          this.userService.currentUserSubject.next(user);
          this.userService.isAuthenticated = true;
        }
      }));
  }

  getConnectUrl(): Observable<{success: boolean; message?: string; redirectUrl?: string}> {
    return this.httpClient.get<{success: boolean; message?: string; redirectUrl?: string}>(
      environment.apiUrl + `api/v1.0/auth/google-connect`
    );
  }

}
