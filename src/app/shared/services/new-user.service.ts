import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { HttpService } from 'src/app/core/services/http.service';
import { environment } from 'src/environments/environment.development';
import { responseModel } from '../interface/responseModel';
import { clubModel } from '../models/clubModel';
import { Observable } from 'rxjs';
import { AuthEndPoints } from 'src/app/core/constant/const';
import { clubDetailsModel } from '../models/clubDetailsModel';

@Injectable({
  providedIn: 'root'
})
export class NewUserService {
  apiUrl: string = environment.apiUrl;

  constructor(private _http: HttpService, private http: HttpClient, private oauthService: OAuthService) { }

  // GetClubList(): Observable<responseModel<clubModel[]>> {
  //   var token = this.oauthService.getAccessToken();
  //   let header = new HttpHeaders().set(
  //     "Authorization",
  //     `Bearer ${token}`
  //   );
  //   return this.http.get<responseModel<clubModel[]>>(this.apiUrl + AuthEndPoints.GET_CLUB, {headers: header});
  // }

  GetSalesPersonList(postData: clubDetailsModel): Observable<responseModel<any>> {
    var token = this.oauthService.getAccessToken();
    let header = new HttpHeaders().set(
      "Authorization",
      `Bearer ${token}`
    );
    // return this._http.requestCall(AuthEndPoints.GET_SALESMEMBER_DETAIL, ApiMethod.POST, postData);
    return this.http.post<responseModel<any>>(this.apiUrl + AuthEndPoints.GET_SALES_MEMBER_DETAIL, postData, {headers: header});
  }

  ValidateEmail(Email: any): Observable<responseModel<any>> {
    var token = this.oauthService.getAccessToken();
    let header = new HttpHeaders().set(
      "Authorization",
      `Bearer ${token}`
    );
    return this.http.get<responseModel<any>>(this.apiUrl + AuthEndPoints.VALIDATE_EMAIL + Email, {headers: header});
  };


}
