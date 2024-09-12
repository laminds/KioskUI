import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  token!: string;

  constructor(private router: Router, private oauthService: OAuthService) { }
  canActivate(routeAc: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    var token = this.oauthService.getAccessToken();
    if (token != null) {
      let tokenExpiration: any = new Date(this.oauthService.getAccessTokenExpiration());
      // let newdate: any = addMinutes(new Date(), 10);
      if (tokenExpiration < new Date()) {
        this.oauthService.logOut();
        window.location.href= 'https://identity.youfit.com/adfs/ls/?wa=wsignoutcleanup1.0';

        if (!this.oauthService.hasValidAccessToken()) {
          this.oauthService.tryLogin();
        }
        if (!this.oauthService.hasValidAccessToken()) {
          this.oauthService.initImplicitFlow();
          return false;
        }
        // var url = window.location.href;
        // var urlSplit = url.split("/");
        // var name = urlSplit[urlSplit.length - 1].split(".")[0];
      }
      else{
        // this.oauthService.tryLogin();
        // this.oauthService.initImplicitFlow();
        var url = window.location.href;
        var urlSplit = url.split("/");
        var name = urlSplit[urlSplit.length - 1].split(".")[0];
      }
    }
    else {
      if (!this.oauthService.hasValidAccessToken()) {
        this.oauthService.tryLogin();
      }
      if (!this.oauthService.hasValidAccessToken()) {
        this.oauthService.initImplicitFlow();

        return false;
      }
    }
    return true;
  }
}

function addMinutes(date: any, minutes: any) {
  date.setMinutes(date.getMinutes() - minutes);
  return date;
}