// System Utils
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Installed Utils
import { Observable, tap } from 'rxjs';

// App Utils
import type ApiResponse from '../models/api-response.model';
import { environment } from '../../environment';

// Configuration
@Injectable({
  providedIn: 'root',
})

// Logic
export class SidebarStatusService {
  // Sidebar status container
  public sidebarStatus: boolean = false;

  // Inject the services
  constructor(private httpClient: HttpClient) {}

  // Accessors

  changeSidebarStatus(newStatus: boolean) {
    this.sidebarStatus = newStatus;
  }

  // Other Methods
  changeStatus(params: unknown): Observable<ApiResponse<null>> {
    return this.httpClient
      .put<
        ApiResponse<null>
      >(environment.apiUrl + 'api/v1.0/account/update', params)
      .pipe(
        tap(({ success }) => {
          this.changeSidebarStatus(success);
        }
      )
    );
  }
}
