// System Utils
import { CommonModule, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, DestroyRef, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardContent, MatCardTitle } from '@angular/material/card';
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
import { GoogleService } from '../../shared/services/google.service';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { UserSocial } from '../../shared/models/user.model';

// Configuration
@Component({
  selector: 'app-google-callback',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatCardContent,
    MatCardTitle,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    AuthLayoutComponent
  ],
  templateUrl: './google-callback.component.html',
  styleUrl: '../../shared/styles/auth/_main.scss',
  standalone: true
})

// Logic
export class GoogleCallbackComponent implements OnInit {

  // Site Name
  siteName = environment.siteName;

  // Reset form
  setPasswordForm: FormGroup = new FormGroup({});

  // Errors messages
  errors = {
    password: '',
    repeatPassword: ''
  };

  // User data
  userData = {
    email: '',
    socialId: ''
  }

  // Submitting status
  isSubmitting = false;

  // Loading status
  onLoading = true;

  // Show form status
  showForm = false;

  // Success user creation message
  successMessage = '';

  // Error user creation message
  errorMessage = '';

  // Reference for component destroy
  destroyRef = inject(DestroyRef);

  // Inject services
  constructor(
    private title: Title,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object,
    private googleService: GoogleService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {

    // Set Page Title
    this.translateService.get('new_password').subscribe((pageTitle: string) => {
      this.title.setTitle(pageTitle);
    });

    // Rules
    this.setPasswordForm = this.fb.group({
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ])
      ],
      repeatPassword: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ])
      ]
    });

    // Run this code only in ssr
    if (isPlatformBrowser(this.platformId)) {

      // Get the code from url
      const code = this.route.snapshot.queryParamMap.get('code') || '';

      // Check if code is valid
      if (/^[a-zA-Z0-9-_.\/]+$/.test(code)) {

        // Sanitize the code
        const safeCode: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(code);

        // Get redirect url for google
        const redirectUrl = this.googleService.authorizeCode({
          code: (safeCode as any).changingThisBreaksApplicationSecurity
        });

        // Subscribe to receive the
        redirectUrl.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: (data: unknown) => {

            // Decode the expected response
            const received = data as UserSocial;

            // Disable the loading message
            this.onLoading = false;

            // Verify if the user is already registered
            if ( typeof received.content?.token !== 'undefined' ) {
              this.router.navigate(['/account/dashboard']);
            } else if ( typeof received.content?.socialId !== 'undefined' ) {
              this.showForm = true;
              this.userData.email = received.content?.email;
              this.userData.socialId = received.content?.socialId;
            } else if ( !received.success ) {
              this.errorMessage = received.message;
            }

          },
          error: (err) => {
            console.log(err);
          }
        });

      } else {

        // Set error message
        this.errorMessage = this.translateService.instant('authorization_code_not_valid');

        // Disable redirecting
        this.onLoading = false;

      }

    }

  }

  onAccountCreate(event: Event) {
    event.preventDefault();

    // Reset error messages
    this.errors.password = '';
    this.errors.repeatPassword = '';

    // Get the inputs data
    const password = this.setPasswordForm.get('password');
    const repeatPassword = this.setPasswordForm.get('repeatPassword');

    // Enable the animation
    this.isSubmitting = true;

    // Verify if the received user data is valid
    if (this.setPasswordForm.valid) {

      // Verify if repeat password is correct
      if ( password?.value !== repeatPassword?.value ) {
        // Set error message
        this.errorMessage = this.translateService.instant('repeat_password_wrong');
        // Hide the animation
        this.isSubmitting = false;
        return;
      }

      // Reset messages
      this.successMessage = '';
      this.errorMessage = '';

      // Register the user
      const observable = this.googleService.register({
        socialId: this.userData.socialId,
        email: this.userData.email,
        password: password?.value
      });

      // Subscribe to the reset response
      observable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (data: unknown) => {
          const received = data as { success: boolean; message: string };
          console.log(received);
          if (received.success) {
            this.successMessage = received.message;
            setTimeout(() => {
              this.setPasswordForm.reset();
              this.successMessage = '';
              password?.setErrors(null);
              repeatPassword?.setErrors(null);
              this.router.navigate(['/account/dashboard']);
            }, 2000);
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

        // Hide the animation
        this.isSubmitting = false;

      }

    }

  }

}
