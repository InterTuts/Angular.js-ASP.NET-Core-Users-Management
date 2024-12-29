// System Utils
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Installed Utils
import {
  BehaviorSubject,
  Observable,
  catchError,
  distinctUntilChanged,
  take,
  tap,
} from 'rxjs';

// App Utils
import type { CreateUser, UserInfo } from '../models/user.model';
import type ApiResponse from '../models/api-response.model';
import List from '../models/list.model';
import { environment } from '../../environment';

// Configuration
@Injectable({
  providedIn: 'root',
})

// Logic
export class UsersService {
  private usersListSubject = new BehaviorSubject<List<UserInfo[]> | null>(null);
  public usersList = this.usersListSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  constructor(private httpClient: HttpClient) {}

  // Other methods
  createUser(user: CreateUser): Observable<ApiResponse<null>> {
    // Try to save the user
    return this.httpClient.post<ApiResponse<null>>(
      environment.apiUrl + `api/v1.0/account/users/create`,
      user
    );
  }

  getUsers(page: number, search: string = '') {
    search = search ? '&search=' + encodeURIComponent(search) : '';
    // Get the users list
    this.httpClient
      .get<ApiResponse<List<UserInfo[]>>>(
        environment.apiUrl +
          `api/v1.0/account/users/list?page=${page}${search}`,
      )
      .pipe(
        tap((response) => {
          this.updateUsersList(response);
        }),
        take(1),
        catchError(async (error) => this.handleErrors(error)),
      )
      .subscribe();
  }

  deleteUser(id: number) {
    // Try to delete the user
    return this.httpClient.delete<ApiResponse<null>>(
      environment.apiUrl + `api/v1.0/account/users/${id}/delete`,
    );
  }

  // Private methods

  private updateUsersList(response: ApiResponse<List<UserInfo[]>>) {
    this.usersListSubject.next(response.content?.items ? response.content : null);
  }

  private handleErrors(error: unknown) {
    console.error('Error occurred:', error);
    this.usersListSubject.next(null);
  }
}
