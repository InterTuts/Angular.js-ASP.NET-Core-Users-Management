// System Utils
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { MatCardTitle, MatCardContent, MatCardActions, MatCardFooter } from '@angular/material/card';
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
import { UserLogin } from '../../shared/models/user.model';

// Configuration
@Component({
  selector: 'app-signin',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatCardFooter,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    AuthLayoutComponent
  ],
  templateUrl: './signin.component.html',
  styleUrl: '../../shared/styles/auth/_main.scss',
  standalone: true
})

// Logic
export class SigninComponent implements OnInit {
  // Site Name
  siteName = environment.siteName;
  // Sign in form
  signInForm: FormGroup = new FormGroup({});

  // Errors messages
  errors = {
    email: '',
    password: '',
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
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {

    // Set Page Title
    this.translateService.get('sign_in').subscribe((pageTitle: string) => {
      this.title.setTitle(pageTitle);
    });

    // Rules
    this.signInForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ]),
      ],
      rememberMe: [false]
    });

  }

  /**
   * Handle sign in submit
   *
   * @param event
   */
  onSignIn(event: Event) {
    event.preventDefault();

    // Reset error messages
    this.errors.email = '';
    this.errors.password = '';

    // Get the inputs data
    const email = this.signInForm.get('email');
    const password = this.signInForm.get('password');
    const rememberMe = this.signInForm.get('rememberMe');

    // Enable the animation
    this.isSubmitting = true;

    // Verify if the received user data is valid
    if (this.signInForm.valid) {

      // Reset messages
      this.successMessage = '';
      this.errorMessage = '';

      // Set remember's me status
      this.userService.saveMe = rememberMe!.value;

      // Login the user
      const observable = this.userService.login(
        this.signInForm.value as { email: string; password: string; },
      );

      // Subscribe to the login response
      observable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (data: unknown) => {
          const received = data as UserLogin & { Email?: Array<string>;  Password?: Array<string>};
          if (received.success) {
            this.successMessage = received.message;
            setTimeout(() => {
              this.router.navigate(['/account/dashboard']);
            }, 2000);
          } else if ( typeof received.Email === 'object' ) {
            this.errorMessage = received.Email[0]
          } else if ( typeof received.Password === 'object' ) {
            this.errorMessage = received.Password[0]
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

      // Verify if errors exists for password
      if (password && password.errors) {
        // Detect short password
        this.errors.password =
          typeof password.errors['minlength'] !== 'undefined'
            ? this.translateService.instant('auth_password_short')
            : '';

        // Detect long password
        this.errors.password =
          typeof password.errors['maxlength'] !== 'undefined'
            ? this.translateService.instant('auth_password_long')
            : '';

        // Detect required error
        this.errors.password =
          typeof password.errors['required'] !== 'undefined'
            ? this.translateService.instant('auth_password_short')
            : this.errors.password;
      }

      // Hide the animation
      this.isSubmitting = false;

    }

  }
}

