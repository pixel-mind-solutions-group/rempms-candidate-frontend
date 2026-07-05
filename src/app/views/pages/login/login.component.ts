import { Component, OnInit } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../service/login/auth/auth.service';
import { UserService } from '../../../service/login/user/user.service';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ContainerComponent,
  RowComponent,
  ColComponent,
  CardGroupComponent,
  CardComponent,
  CardBodyComponent,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ButtonDirective,
} from '@coreui/angular';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { Subject, takeUntil } from 'rxjs';
import { AuthStatus } from '../../../enums/AuthStatus';
import { UserRoles } from '../../../enums/UserRole';
import { UserDetailsResponseDTO } from '../../../model/user/user-details/UserDetailsResponseDTO';
import { VerifyEmailService } from 'src/app/service/verifyEmail/verify-email.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardGroupComponent,
    CardComponent,
    CardBodyComponent,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    ButtonDirective,
    NgStyle,
  ],
})
export class LoginComponent implements OnInit {
  loading = false;
  loginForm: FormGroup | any;
  showPassword = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private verifyEmailService: VerifyEmailService
  ) { }

  private unsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (this.loginForm.valid) {
      this.pageLoader();
      this.router.navigate(['/job-vacancies']);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  redirectToRegister() {
    this.router.navigate(['/register']);
  }

  getUserPermissionList() {
    this.userService.getUserPermissionList().subscribe(
      (response) => {
        if (response.status === 'OK') {
          sessionStorage.setItem('userDetails', JSON.stringify(response.data));
          const userDetails: UserDetailsResponseDTO = response.data;

          this.loading = false;

          if (
            userDetails.userHasApplicationScopeHasUserRole.userRole.role ===
            UserRoles.CANDIDATE ||
            userDetails.userHasApplicationScopeHasUserRole.userRole.role ===
            UserRoles.ADMIN
          ) {
            this.authService.setAuthenticationStatus(AuthStatus.YES);
            this.router.navigate(['/job-vacancies']);
          } else {
            this.authService.setAuthenticationStatus(AuthStatus.NO);
            Swal.fire({
              title: 'Error!',
              text: 'Unauthorized Access!',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Something went wrong. Contact support if the problem continues.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      },
      (error) => {
        this.loading = false;
        if (error.status === 500) {
          Swal.fire({
            title: 'Email Verification Failed',
            text: error.error?.details?.[1] + ' Do you want to resend the verification url?',
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Resend Url',
            cancelButtonText: 'Cancel',
          }).then((result) => {
            if (result.isConfirmed) {
              // 👇 Call resend verification method here
              this.resendVerificationEmail();
            }
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Network Error.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      },
    );
  }

  resendVerificationEmail() {
    const username: string = this.loginForm.value.username;
    this.verifyEmailService.resendVerificationEmail(username).pipe(takeUntil(this.unsubscribe$)).subscribe(
      (response) => {
        if (response.status === 'OK') {
          Swal.fire({
            title: 'Success!',
            text: 'Verification email resent successfully. Please check your inbox.',
            icon: 'success',
            confirmButtonText: 'OK',
          });

        } else if (response.status === 'NO_CONTENT') {
          Swal.fire({
            title: 'Error!',
            text: response.message,
            icon: 'error',
            confirmButtonText: 'OK',
          });

        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Something went wrong. Contact support if the problem continues.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      },
      (error) => {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to resend verification email. Contact support if the problem continues.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      },
    );
  }

  pageLoader() {
    this.loading = true;
  }
}
