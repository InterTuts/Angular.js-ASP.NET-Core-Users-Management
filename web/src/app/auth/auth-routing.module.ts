// System Utils
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// App Utils
import { LogoutGuard } from '../shared/guards/logout.guard';
import { AuthGuard } from '../shared/guards/auth.guard';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ResetComponent } from './reset/reset.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { SigninComponent } from './signin/signin.component';
import { GoogleConnectComponent } from './google-connect/google-connect.component';
import { GoogleCallbackComponent } from './google-callback/google-callback.component';
import { NotFoundComponent } from '../shared/errors/not-found/not-found.component';

// Supported Routes
const routes: Routes = [
  {
    path: 'sign-up',
    component: SignUpComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'reset',
    component: ResetComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'new-password',
    component: NewPasswordComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'google-connect',
    component: GoogleConnectComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'google-callback',
    component: GoogleCallbackComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'logout',
    component: SigninComponent,
    canActivate: [LogoutGuard]
  }, {
    path: '**',
    component: NotFoundComponent
  }
];

// Configuration
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

// Logic
export class AuthRoutingModule { }
