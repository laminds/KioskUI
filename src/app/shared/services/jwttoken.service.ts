import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JWTTokenService {

  jwtToken!: string;
  decodedToken!: { [key: string]: string };
  constructor() { }

  parseJwt (token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  setToken(token: string) {
    if (token) {
      this.jwtToken = token;
    }
  }

  decodeToken() {
    if (this.jwtToken) {
    this.decodedToken = jwt_decode(this.jwtToken);
    }
  }

  getDecodeToken() {
    return jwt_decode(this.jwtToken);
  }

  getUser() {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken['displayname'] : null;
  }

  getUserID() {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken['ppid'] : null;
  }

  getEmailId() {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken['email'] : null;
  }

  getExpiryTime() {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken['exp'] : null;
  }
  
  // isTokenExpired(): boolean {
  //   const expiryTime: number = this.getExpiryTime();
  //   if (expiryTime) {
  //     return ((1000 * expiryTime) - (new Date()).getTime()) < 5000;
  //   } else {
  //     return false;
  //   }
  // }
}


function jwt_decode(jwtToken: string): { [key: string]: string; } {
  throw new Error('Function not implemented.');
}

