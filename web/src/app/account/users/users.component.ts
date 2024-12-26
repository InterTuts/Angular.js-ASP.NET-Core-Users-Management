// System Utils
import { Component, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';

// Installed Utils
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';

// App Utils
import { AccountLayoutComponent } from '../../shared/layouts/account-layout/account-layout.component';
import { NavigationComponent } from '../../shared/general/navigation/navigation.component';
import { ModalService } from '../../shared/services/modal.service';
import { UsersService } from '../../shared/services/users.service';
import ApiResponse from '../../shared/models/api-response.model';
import { NotificationsDirective } from '../../shared/directives/notifications.directive';

// Configuration
@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    AccountLayoutComponent,
    NavigationComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})

// Logic
export class UsersComponent {

  // Set view container for new user modal view
  @ViewChild('newUser', { static: true, read: ViewContainerRef })
  newUserModal!: ViewContainerRef;

  // New User form
  newUserForm!: FormGroup;

  // Submitting status
  isSubmitting = false;

  // Users List
  users = {
    searchClass: '',
    total: 0,
    page: 1,
  };

  // Errors messages
  errors = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  constructor(
    private title: Title,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private modalService: ModalService,
    private usersService: UsersService,
    private notificationsDirective: NotificationsDirective
  ) {}

  ngOnInit(): void {

    // Set Page Title
    this.translateService.get('users').subscribe((pageTitle: string) => {
      this.title.setTitle(pageTitle);
    });

    // Rules
    this.newUserForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ]),
      ],
    });

  };

  onSubmit(event: Event) {
    event.preventDefault();

    // Reset error messages
    this.errors.firstName = '';
    this.errors.lastName = '';
    this.errors.email = '';
    this.errors.password = '';

    // Get the inputs data
    const firstName = this.newUserForm.get('firstName');
    const lastName = this.newUserForm.get('lastName');
    const email = this.newUserForm.get('email');
    const password = this.newUserForm.get('password');

    // Verify if the received user data is valid
    if (this.newUserForm.valid) {

      // Enable the animation
      this.isSubmitting = true;

      // Create a new user
      const newUserObservable = this.usersService.createUser({
        first_name: firstName?.value,
        last_name: lastName?.value,
        email: email?.value,
        password: password?.value,
      });

      // Subscribe to the newUserObservable
      newUserObservable.pipe(take(1)).subscribe({
        next: (data: ApiResponse<null>) => {
          console.log(data);
          if (data.success) {
            this.notificationsDirective.showNotification(
              'success',
              data.message,
            );
            this.newUserForm.reset();
            this.usersService.getUsers(
              this.users.page
            );
          } else {
            this.notificationsDirective.showNotification('error', data.message);
          }
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });

    } else {

      // Check if errors exists for first name
      if (firstName && firstName.errors) {
        // Set error message
        this.errors.firstName = this.translateService.instant(
          'first_name_is_short',
        );
      }

      // Check if errors exists for last name
      if (lastName && lastName.errors) {
        // Set error message
        this.errors.lastName = this.translateService.instant(
          'last_name_is_short',
        );
      }

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
    }
  }

  // Events Handlers

  onCloseModal() {
    this.modalService.closeModal();
  }

  showModal(modalView: TemplateRef<Element>) {
    this.modalService.showModal(this.newUserModal, modalView);
  }

}
