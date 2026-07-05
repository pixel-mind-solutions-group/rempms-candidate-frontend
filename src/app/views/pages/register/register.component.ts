import { Component, OnInit } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ContainerComponent,
  RowComponent,
  ColComponent,
  CardComponent,
  CardBodyComponent,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ButtonDirective,
} from '@coreui/angular';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UserRegisterDTO } from '../../../model/user/register/UserRegisterDTO';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../service/login/user/user.service';
import { UserHasApplicationScopeHasUserRoleRequestDTO } from '../../../model/user/userHasApplicationScopeHasUserRole/UserHasApplicationScopeHasUserRoleRequestDTO';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardComponent,
    CardBodyComponent,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    ButtonDirective,
    CommonModule,
  ],
})
export class RegisterComponent implements OnInit {
  loading = false;
  registerForm: FormGroup | any;
  showPassword = false;
  showRetypePassword = false;
  
  passwordStrength = 0;
  passwordStrengthText = '';
  passwordStrengthClass = '';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.registerFormInit();
    this.registerForm.get('password')?.valueChanges.subscribe((val: string) => {
      this.checkPasswordStrength(val);
    });
  }

  registerFormInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      retypePassword: ['', [Validators.required]],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleRetypePasswordVisibility() {
    this.showRetypePassword = !this.showRetypePassword;
  }

  checkPasswordStrength(password: string) {
    if (!password) {
      this.passwordStrength = 0;
      this.passwordStrengthText = '';
      this.passwordStrengthClass = '';
      return;
    }
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password) && /[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    this.passwordStrength = score;
    switch (score) {
      case 0:
      case 1:
        this.passwordStrengthText = 'Weak';
        this.passwordStrengthClass = 'strength-weak';
        break;
      case 2:
        this.passwordStrengthText = 'Fair';
        this.passwordStrengthClass = 'strength-fair';
        break;
      case 3:
        this.passwordStrengthText = 'Good';
        this.passwordStrengthClass = 'strength-good';
        break;
      case 4:
        this.passwordStrengthText = 'Strong';
        this.passwordStrengthClass = 'strength-strong';
        break;
      default:
        this.passwordStrengthText = 'Weak';
        this.passwordStrengthClass = 'strength-weak';
    }
  }

  register() {
    if (this.registerForm.valid) {
      if (
        this.registerForm.value.password !==
        this.registerForm.value.retypePassword
      ) {
        Swal.fire({
          title: 'Error!',
          text: 'Passwords do not match.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        return;
      }

      const userHasAuthorizeParties: string[] = [
        'rempms-client',
        'user-auth-client',
      ];

      const userHasApplicationScopeHasUserRoles: UserHasApplicationScopeHasUserRoleRequestDTO[] =
        [
          {
            userHasApplicationScopeHasUserRoleId: '',
            applicationScopeId: '',
            applicationScope: 'rempms_candidate',
            userRole: 'CANDIDATE',
            userRoleId: '',
            hasElements: [],
          },
          {
            userHasApplicationScopeHasUserRoleId: '',
            applicationScopeId: '',
            applicationScope: 'pdev_user',
            userRole: 'NON_AD',
            userRoleId: '',
            hasElements: [],
          },
        ];

      const userRegister: UserRegisterDTO = {
        userId: '',
        userName: this.registerForm.value.username,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        firstName: '',
        lastName: '',
        uuid: '',
        active: true,
        userHasAuthorizeParties: userHasAuthorizeParties,
        userHasApplicationScopeHasUserRoles:
          userHasApplicationScopeHasUserRoles,
      };

      this.userService.register(userRegister).subscribe(
        (response) => {
          this.loading = false;
          if (response.status === 'OK') {
            Swal.fire({
              title: 'Success!',
              text: response.message,
              icon: 'success',
              confirmButtonText: 'OK',
            }).then((result) => {
              if (result.isConfirmed) {
                this.registerForm.reset();
                this.router.navigate(['/login']);
              }
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: response.message,
              icon: 'error',
              confirmButtonText: 'OK',
            }).then(() => {});
          }
        },
        (error) => {
          Swal.fire({
            title: 'Error!',
            text: error.error.message,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        },
      );
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  pageLoader() {
    this.loading = true;
  }
}
