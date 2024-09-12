import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { OAuthModule } from 'angular-oauth2-oidc';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from './shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonService } from './shared/services/common.service';
import { AppComponent } from './app.component';
import { AuthGuardService } from './core/guard/auth-guard.service';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { HomeModule } from './modules/home/home.module';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { NgxPlaidLinkModule } from 'ngx-plaid-link';
import { NgxSliderModule } from 'ngx-slider-v2';
import { JwtModule } from '@auth0/angular-jwt';

export function tokenGetter() { 
  return sessionStorage.getItem("access_token"); 
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ToastrModule.forRoot({
      timeOut: 2500
    }),
    OAuthModule.forRoot(),
    LoadingBarModule,
    LoadingBarRouterModule,
    LoadingBarHttpClientModule,
    ReactiveFormsModule,
    HomeModule,
    SharedModule,
    NgbModule,
    NgxPlaidLinkModule,
    NgxSliderModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:44365"],
        disallowedRoutes: []
      }
    })
  ],
  providers: [
    CommonService, 
    AuthGuardService,
    // {provide : LocationStrategy , useClass: HashLocationStrategy}

    ],
  bootstrap: [AppComponent],
})
export class AppModule { }
 