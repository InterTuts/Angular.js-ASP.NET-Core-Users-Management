// System Utils
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  selector: 'app-new-password',
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
  templateUrl: './new-password.component.html',
  styleUrl: '../../shared/styles/auth/_main.scss',
  standalone: true
})

// Logic
export class NewPasswordComponent implements OnInit {
  // Site Name
  siteName = environment.siteName;
  // Reset form
  newPasswordForm: FormGroup = new FormGroup({});

  // Errors messages
  errors = {
    password: '',
    repeatPassword: ''
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
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private userService: UserService
  ) {}

  ngOnInit(): void {

    // Set Page Title
    this.translateService.get('new_password').subscribe((pageTitle: string) => {
      this.title.setTitle(pageTitle);
    });

    // Rules
    this.newPasswordForm = this.fb.group({
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

  }

  /**
   * Handle password change submit
   *
   * @param event
   */
  onPasswordChange(event: Event) {
    event.preventDefault();

    // Reset error messages
    this.errors.password = '';
    this.errors.repeatPassword = '';

    // Get the inputs data
    const password = this.newPasswordForm.get('password');
    const repeatPassword = this.newPasswordForm.get('repeatPassword');

    // Enable the animation
    this.isSubmitting = true;

    // Verify if the received user data is valid
    if (this.newPasswordForm.valid) {

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

      // Get the code from url
      const code = this.route.snapshot.queryParamMap.get('code') || '';

      // Check if code is valid
      if (/^[a-zA-Z0-9-_.\/]+$/.test(code)) {

        // Sanitize the code
        const safeCode: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(code);

        // Reset the user
        const observable = this.userService.newPassword({
          code: (safeCode as any).changingThisBreaksApplicationSecurity,
          password: password?.value
        });

        // Subscribe to the reset response
        observable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: (data: unknown) => {
            const received = data as { success: boolean; message: string };
            if (received.success) {
              this.successMessage = received.message;
              setTimeout(() => {
                this.newPasswordForm.reset();
                this.successMessage = '';
                password?.setErrors(null);
                repeatPassword?.setErrors(null);
                this.router.navigate(['/']);
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
        // Set error message
        this.errorMessage = this.translateService.instant('reset_code_not_valid');
        // Hide the animation
        this.isSubmitting = false;
      }

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
