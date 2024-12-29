// System Utils
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

// Installed Utils
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription, take } from 'rxjs';

// App Utils
import { AccountLayoutComponent } from '../../../shared/layouts/account-layout/account-layout.component';
import { NavigationComponent } from '../../../shared/general/navigation/navigation.component';
import { NotificationsDirective } from '../../../shared/directives/notifications.directive';
import { UsersService } from '../../../shared/services/users.service';
import ApiResponse from '../../../shared/models/api-response.model';
import { FieldTextComponent } from '../../../shared/fields/general/field-text/field-text.component';
import { FieldEmailComponent } from '../../../shared/fields/general/field-email/field-email.component';
import { FieldPasswordComponent } from '../../../shared/fields/general/field-password/field-password.component';

// Configuration
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    AccountLayoutComponent,
    FieldTextComponent,
    FieldEmailComponent,
    FieldPasswordComponent,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})

// Logic
export class UserComponent implements OnInit, OnDestroy {

  // Create the form for user data
  userDataForm!: FormGroup;

  // Create the form for user password
  userPasswordForm!: FormGroup;

  // Selected role
  selectedRole!: string;

  // Updating data status
  update = {
    data: false,
    password: false
  };

  // Events date parameters
  events = {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    date: new Date().getDate()
  };

  // Subscription for role input
  private roleSubscription!: Subscription;

  constructor(
    private title: Title,
    private translateService: TranslateService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private notificationsDirective: NotificationsDirective
  ) {
    // Set page title
    this.translateService.get('user').subscribe((pageTitle: string) => {
      this.title.setTitle(pageTitle);
    });

    // Create the form representation
    this.userDataForm = this.fb.group({
      firstName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50)
        ])
      ],
      lastName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50)
        ])
      ],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      phone: ['', Validators.maxLength(50)],
      role: [
        '', Validators.required
      ]
    });

    // Create the form representation
    this.userPasswordForm = this.fb.group({
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ]),
      ],
      repeatPassword: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ]),
      ],
    });

  }

  ngOnInit(): void {

    // Get the user's id
    const id = this.activatedRoute.snapshot.params['id'];

  }

  ngOnDestroy(): void {
    if ( this.roleSubscription ) {
      this.roleSubscription.unsubscribe();
    }
  }

  get firstNameControl(): FormControl {
    return this.userDataForm.get('firstName') as FormControl;
  }

  get lastNameControl(): FormControl {
    return this.userDataForm.get('lastName') as FormControl;
  }

  get emailControl(): FormControl {
    return this.userDataForm.get('email') as FormControl;
  }

  get roleControl(): FormControl {
    return this.userDataForm.get('role') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.userPasswordForm.get('password') as FormControl;
  }

  get repeatPasswordControl(): FormControl {
    return this.userPasswordForm.get('repeatPassword') as FormControl;
  }

  onSubmitUserData(event: Event) {
    event.preventDefault();

    // Get the inputs data
    const firstName = this.userDataForm.get('firstName');
    const lastName = this.userDataForm.get('lastName');
    const role = this.userDataForm.get('role');

    // Verify if the received user data is valid
    if (this.userDataForm.valid) {

      // Enable animation
      this.update.data = true;

      // Get the user's id
      const id = this.activatedRoute.snapshot.params['id'];

      // Update a user
      /*const userUpdateObservable = this.userService.updateUser({
        first_name: firstName!.value,
        last_name: lastName!.value,
        role: role!.value
      }, id);

      // Subscribe to the user update observable
      userUpdateObservable.pipe(take(1)).subscribe({
        next: (data: ApiResponse<null>) => {
          if (data.success) {
            this.notificationsDirective.showNotification(
              'success',
              data.message,
            );
          } else {
            this.notificationsDirective.showNotification('error', data.message);
          }
        },
        error: (err: unknown) => {
          console.log(err);
        },
        complete: () => {
          this.update.data = false;
        }
      });*/

    } else {

      // Check if errors exists for first name
      if (firstName && firstName.errors) {
        // Set error message
        this.notificationsDirective.showNotification('error', this.translateService.instant(
          'first_name_incorrect_length'
        ));
      } else if (lastName && lastName.errors) {
        // Set error message
        this.notificationsDirective.showNotification('error', this.translateService.instant(
          'last_name_incorrect_length'
        ));
      } else if (role && role.errors) {
        // Set error message
        this.notificationsDirective.showNotification('error', this.translateService.instant(
          'phone_number_too_long'
        ));
      }
    }
  }

  onSubmitUserPassword(event: Event) {
    event.preventDefault();

    // Get the inputs data
    const password = this.userPasswordForm.get('password');
    const repeatPassword = this.userPasswordForm.get('repeatPassword');

    // Verify if the received user data is valid
    if ( this.userPasswordForm.valid ) {

      // Enable animation
      this.update.password = true;

      // Get the user's id
      const id = this.activatedRoute.snapshot.params['id'];

      // Verify if password match
      if ( password?.value != repeatPassword?.value ) {
        // Set error message
        this.notificationsDirective.showNotification('error', this.translateService.instant(
          'repeat_password_doesnt_match'
        ));
      } else {

        // Update a user's password
        /*const userUpdateObservable = this.userService.updateUserPassword({
          password: password?.value
        }, id);

        // Subscribe to the user update observable
        userUpdateObservable.pipe(take(1)).subscribe({
          next: (data: ApiResponse<null>) => {
            if (data.success) {
              this.notificationsDirective.showNotification(
                'success',
                data.message,
              );
            } else {
              this.notificationsDirective.showNotification('error', data.message);
            }
          },
          error: (err: unknown) => {
            console.log(err);
          },
          complete: () => {
            this.update.password = false;
          }

        });*/

      }

    } else {

      // Check if errors exists for password
      if (password && password.errors) {
        // Set error message
        this.notificationsDirective.showNotification('error', this.translateService.instant(
          'password_incorrect_length'
        ));
      } else if (repeatPassword && repeatPassword.errors) {
        // Set error message
        this.notificationsDirective.showNotification('error', this.translateService.instant(
          'repeat_password_doesnt_match'
        ));
      }

    }

  }

  translateText(text: string): string {
    return this.translateService.instant(text);
  }

}
