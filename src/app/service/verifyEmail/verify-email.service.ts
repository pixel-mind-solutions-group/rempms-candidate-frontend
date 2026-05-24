import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { CommonResponse } from 'src/app/model/commonResponse/CommonResponse';

@Injectable({
  providedIn: 'root'
})
export class VerifyEmailService {

  private verifyEmailUrl = `${environment.loginUrl}` + '/user/pixel-hire/v1';

  constructor(private httpClient: HttpClient) { }

  verifyEmail(uid: string): Observable<any> {

    const url = this.verifyEmailUrl + '/verify-email';

    const params = new HttpParams()
      .set('uid', uid)
      .set('verify', Boolean(true));

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      params: params,
    };

    return this.httpClient.post<CommonResponse>(url, {}, httpOptions);
  }

  resendVerificationEmail(username: string): Observable<any> {
    
    const url = this.verifyEmailUrl + '/send-verification-email';

    const params = new HttpParams()
      .set('username', username);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      params: params,
    };

    return this.httpClient.post<CommonResponse>(url, {}, httpOptions);

  }
}
