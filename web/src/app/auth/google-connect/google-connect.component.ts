// System Utils
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardContent } from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';

// Installed Utils
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// App Utils
import { environment } from '../../environment';
import { AuthLayoutComponent } from '../../shared/layouts/auth-layout/auth-layout.component';
import { GoogleService } from '../../shared/services/google.service';

// Configuration
@Component({
  selector: 'app-google-connect',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatCardContent,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    AuthLayoutComponent
  ],
  templateUrl: './google-connect.component.html',
  styleUrl: './google-connect.component.scss',
  standalone: true
})

// Logic
export class GoogleConnectComponent implements OnInit {

  // Site Name
  siteName = environment.siteName;

  // Loading status
  onLoading = true;

  // Success user creation message
  successMessage = '';

  // Error user creation message
  errorMessage = '';

  // Reference for component destroy
  destroyRef = inject(DestroyRef);

  // Inject services
  constructor(
    private googleService: GoogleService
  ) {}

  ngOnInit(): void {

    // Get redirect url for google
    const redirectUrl = this.googleService.getConnectUrl();

    // Subscribe to receive the
    redirectUrl.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data: unknown) => {

        // Decode the expected response
        const received = data as { success: boolean; redirectUrl: string };

        // Verify if window exists
        if (typeof window !== "undefined") {

          //Redirect to Google Login page
          window.location.href = received.redirectUrl;

        }
        
      },
      error: (err) => {
        console.log(err);
      }
    });

  }

}
