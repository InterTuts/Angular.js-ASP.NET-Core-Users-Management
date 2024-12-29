// System Utils
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

// Installed Utils
import {
  Observable,
  BehaviorSubject,
  distinctUntilChanged,
  tap,
  of,
  switchMap,
  catchError,
} from 'rxjs';

// App Utils
import type ApiResponse from '../models/api-response.model';
import type { User, CreateUser } from '../models/user.model';
import { environment } from '../../environment';
import { TokensService } from './tokens.service';

// Configuration
@Injectable({
  providedIn: 'root',
})

// Logic
export class UserService {
  public currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  public isAuthenticated: boolean = false;
  public rememberMe: boolean = false;

  // Inject services
  constructor(
    private httpClient: HttpClient,
    private tokensService: TokensService
  ) {}

  // Accessors

  get check(): Observable<boolean> {

    // Verify if the user is authenticated
    if (this.isAuthenticated) return of(true);

    // Verify if token exists
    if (!this.tokensService.getToken) return of(false);

    // Get user
    return this.getUser();

  }

  set saveMe(status: boolean) {
    this.rememberMe = status;
  }

  // Other Methods

  register(credentials: {
    email: string;
    password: string;
  }): Observable<{ success: boolean; message: string }> {
    return this.httpClient.post<{ success: boolean; message: string }>(
      environment.apiUrl + `api/v1.0/auth/registration`,
      {
        email: credentials.email,
        password: credentials.password
      }
    );
  }

  getUser(): Observable<boolean> {
    return this.httpClient
      .get(environment.apiUrl + `api/v1.0/account/info`, {})
      .pipe(
        switchMap((response: unknown) => {
          const res = response as ApiResponse<User>;
          this.currentUserSubject.next(res.content);
          this.isAuthenticated = true;
          return of(true);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error(error.message);
          return of(false);
        })
      );
  }

  saveUser(user?: any) {
    if (typeof user !== 'undefined') {
      this.tokensService.saveToken(user.token, this.rememberMe);
      this.currentUserSubject.next(user);
    }
  }

  login(credentials: {
    email: string;
    password: string;
  }): Observable<{ success: boolean; message: string; content?: User }> {
    return this.httpClient
      .post<{ success: boolean; message: string }>(
        environment.apiUrl + `api/v1.0/auth/signin`,
        {
          email: credentials.email,
          password: credentials.password
        }
      )
      .pipe(tap(({ content }) => this.saveUser(content)));
  }

  reset(credentials: {
    email: string;
  }): Observable<{ success: boolean; message: string; }> {
    return this.httpClient
      .post<{ success: boolean; message: string }>(
        environment.apiUrl + `api/v1.0/auth/reset`,
        {
          email: credentials.email
        }
      );
  }

  newPassword(credentials: {
    code: string;
    password: string;
  }): Observable<{ success: boolean; message: string; }> {
    return this.httpClient
      .post<{ success: boolean; message: string }>(
        environment.apiUrl + `api/v1.0/auth/new-password`,
        {
          code: credentials.code,
          password: credentials.password
        }
      );
  }

  logout() {
    this.isAuthenticated = false;
    this.currentUserSubject.next(null);
    this.tokensService.deleteToken();
    return of(true);
  }

}
