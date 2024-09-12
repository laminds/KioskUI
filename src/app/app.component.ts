import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonService } from './shared/services/common.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { authonfig } from './core/config/authConfig';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { LoadingBarState } from '@ngx-loading-bar/core/loading-bar.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterContentChecked{
  isFooter: boolean;
  getFooter: any;
  getSlides: any;
  getBanner: any;
  getLogout: any
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  Path: string;
  SlideNo: string;
  BannerClass: string;
  loader: LoadingBarState;
  isLogout: boolean;

  
  constructor(
    private loadingBar: LoadingBarService,
    private _commonService: CommonService,
    private changeDetector: ChangeDetectorRef,
    private oauthService: OAuthService
  ) {
    this._commonService.getPageInitialValue();
    this.loader = this.loadingBar.useRef();
    this.Path = '';
    this.SlideNo = '';
    this.BannerClass = '';
    this.isFooter = false;
    this._commonService = _commonService;
    this.isLogout = false;
  }

  
  ngOnInit() {
    this.getFooter = this._commonService.getEmittedValue()
      .subscribe(item => this.isFooter = item);

    this.getSlides = this._commonService.getEmittedValueforSlide()
      .subscribe(item => this.SlideNo = item);

    this.getBanner = this._commonService.getEmittedValueforBanner()
      .subscribe(item => this.BannerClass = item);

    this.getLogout = this._commonService.getEmittedLogoutValue()
      .subscribe(item => this.isLogout = item);

     this.oauthService.initCodeFlow();
     this.oauthService.configure(authonfig);
     this.oauthService.setStorage(sessionStorage)
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  loadingStart() {
    this.loader.start();
  }

  loadingComplete() {
    this.loader.complete();
  }

  logout(){
    this.oauthService.logOut();
    window.location.href= 'https://identity.youfit.com/adfs/ls/?wa=wsignoutcleanup1.0';
    sessionStorage.clear();
  }

}
