// System Utils
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { MatCardTitle, MatCardContent, MatCardFooter } from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';

// Installed Utils
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// App Utils
import { environment } from '../../environment';
import { AuthLayoutComponent } from '../../shared/layouts/auth-layout/auth-layout.component';
import { UserService } from '../../shared/services/user.service';

// Configuration
@Component({
  selector: 'app-reset',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
    MatCardTitle,
    MatCardContent,
    MatCardFooter,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    AuthLayoutComponent
  ],
  templateUrl: './reset.component.html',
  styleUrl: '../../shared/styles/auth/_main.scss',
  standalone: true
})

// Logic
export class ResetComponent implements OnInit {
  // Site Name
  siteName = environment.siteName;
  // Reset form
  resetForm: FormGroup = new FormGroup({});

  // Errors messages
  errors = {
    email: ''
  };

  // Submitting status
  isSubmitting = false;

  // Success user creation message
  successMessage = '';

  // Error user creation message
  errorMessage = '';

  // Reference for component destroy
  destroyRef = inject(DestroyRef);

  constructor(
    private title: Title,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private userService: UserService
  ) {}

  ngOnInit(): void {

    // Set Page Title
    this.translateService.get('reset_password').subscribe((pageTitle: string) => {
      this.title.setTitle(pageTitle);
    });

    // Rules
    this.resetForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])]
    });

  }

  /**
   * Handle reset submit
   *
   * @param event
   */
  onReset(event: Event) {
    event.preventDefault();

    // Reset error messages
    this.errors.email = '';

    // Get the inputs data
    const email = this.resetForm.get('email');

    // Enable the animation
    this.isSubmitting = true;

    // Verify if the received user data is valid
    if (this.resetForm.valid) {

      // Reset messages
      this.successMessage = '';
      this.errorMessage = '';

      // Reset the user
      const observable = this.userService.reset(
        this.resetForm.value as { email: string; }
      );

      // Subscribe to the reset response
      observable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (data: unknown) => {
          const received = data as { success: boolean; message: string; Email?: Array<string> };
          if (received.success) {
            this.successMessage = received.message;
            setTimeout(() => {
              this.resetForm.reset();
              this.successMessage = '';
              email?.setErrors(null);
            }, 2000);
          } else if ( typeof received.Email === 'object' ) {
            this.errorMessage = received.Email[0]
          } else {
            this.errorMessage = received.message;
          }
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          // Hide the animation
          this.isSubmitting = false;
        }
      });

    } else {

      // Check if errors exists for email
      if (email && email.errors) {
        // Detect email format error
        this.errors.email =
          typeof email.errors['email'] !== 'undefined'
            ? this.translateService.instant('auth_email_not_valid')
            : '';

        // Detect required error
        this.errors.email =
          typeof email.errors['required'] !== 'undefined'
            ? this.translateService.instant('auth_email_short')
            : this.errors.email;
      }

      // Hide the animation
      this.isSubmitting = false;

    }

  }
}
