import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { responseModel } from 'src/app/shared/interface/responseModel';
import { clubModel } from 'src/app/shared/models/clubModel';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient, private oauthService: OAuthService) {}
  GetClubList(): Observable<responseModel<clubModel[]>> {
    var token = this.oauthService.getAccessToken();
    let header = new HttpHeaders().set(
      "Authorization",
      `Bearer ${token}`
    );
    return this.http.get<responseModel<clubModel[]>>(this.apiUrl + 'api/Club/GetClubList', {headers: header});
  }

  GetClubStationsByClub(clubNumber: number): Observable<responseModel<string>> {
    var token = this.oauthService.getAccessToken();
    let header = new HttpHeaders().set(
      "Authorization",
      `Bearer ${token}`
    );
    return this.http.get<responseModel<string>>(this.apiUrl + 'api/club/GetClubStationsByClub?ClubNumber=' + clubNumber, {headers: header});
  }

  SaveContact(postdata : any): Observable<responseModel<any>> {
    var token = this.oauthService.getAccessToken();
    let header = new HttpHeaders().set(
      "Authorization",
      `Bearer ${token}`
    );
    return this.http.post<responseModel<any>>(this.apiUrl + 'api/Guest/SaveContact', postdata , {headers: header});
  }
}
