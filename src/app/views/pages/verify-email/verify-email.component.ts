import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailVerifyStatus } from '../../../enums/EmailVerifyStatus';
import { VerifyEmailService } from '../../../service/verifyEmail/verify-email.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent implements OnInit {
  status: EmailVerifyStatus = EmailVerifyStatus.VERIFYING;
  uid: string | null = null;
  isVerified = false;
  currentYear = new Date().getFullYear();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private verifyEmailService: VerifyEmailService
  ) { }

  ngOnInit(): void {

    this.route.queryParamMap.subscribe(params => {
      this.uid = params.get('uid');
      setTimeout(() => {
        if (this.uid) {
          this.verifyEmail(this.uid);
        } else {
          this.router.navigate(['/unauthorized']);
        }
      }, 5000);
    });
  }

  redirectToRegister(): void {
    this.router.navigate(['/register']);
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  verifyEmail(uid: string) {
    this.verifyEmailService.verifyEmail(uid)
      .subscribe({
        next: (response: any) => {

          if (response.status === 'OK' && response.data === true) {

            this.status = EmailVerifyStatus.SUCCESS;

          } else {

            this.status = EmailVerifyStatus.FAILED;

          }
        },
        error: (err) => {
          console.error('Verification error:', err);
          this.status = EmailVerifyStatus.FAILED;
          this.toastr.error('Email verification failed. Please try again or contact support.');
        }
      });
  }
}