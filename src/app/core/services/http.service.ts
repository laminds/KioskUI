import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ErrorService } from '../error/error.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';
import { ApiMethod, AuthEndPoints } from '../constant/const';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private _http: HttpClient, private _error: ErrorService, private oauthService: OAuthService) { }
  requestCall(api: AuthEndPoints, methods: ApiMethod, data?: any) {
    let response;
    var token = this.oauthService.getAccessToken();
    let header = new HttpHeaders().set(
      "Authorization",
      `Bearer ${token}`
    );
    switch (methods) {
      case ApiMethod.GET:
        response = this._http
        .get(`${environment.apiUrl}${api}${data}`, {headers: header})
          .pipe(catchError(async (err) => this.handleError(err, this)));
        break;
      case ApiMethod.POST:
        response = this._http
          .post(`${environment.apiUrl}${api}`,data, {headers: header})
          .pipe(catchError(async (err) => this.handleError(err, this)));
        break;
      case ApiMethod.PUT:
        response = this._http
          .put(`${environment.apiUrl}${api}`,data, {headers: header})
          .pipe(catchError(async (err) => this.handleError(err, this)));
        break;
      case ApiMethod.DELETE:
        response = this._http
          .delete(`${environment.apiUrl}${api}`, {headers: header})
          .pipe(catchError(async (err) => this.handleError(err, this)));
        break;
      default:
        break;
    }
    return response;
  }

   handleError(error: HttpErrorResponse, _self: this) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occured:', error.error.message);
    } else {
      this._error.WhichError(error.status, error.message);
      // return throwError({ error: error.message, status: error.status });
    }
  }
}
