import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { constMessage } from 'src/app/core/constant/const';
import { LeadModel } from 'src/app/shared/models/searchModel';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit, AfterViewInit {
  Path: string;
  SlideNo: string;
  BannerClass: string;
  commonService!: CommonService;
  leadObj: LeadModel;
  viewPlans: string;
  healthInsurance: string;
  joinHeadermessage: string;
  subHeadermessage: string;
  registerObj: LeadModel;
  constructor(
    private _commonService: CommonService,
    private route: Router,
  ) {
    this.Path = '';
    this.SlideNo = '';
    this.BannerClass = '';
    this.leadObj = JSON.parse(window.sessionStorage.getItem("RegisterObj")!);
    this.commonService = _commonService;
    this.viewPlans = constMessage.guest.viewPlans;
    this.healthInsurance = constMessage.guest.healthInsurance;
    this.joinHeadermessage = constMessage.newUser.welcomeText;
    this.subHeadermessage = constMessage.guest.join.subHeadermessage;
    this._commonService.setServiceName(window.sessionStorage.getItem("ServiceName")!);
    this.registerObj = JSON.parse(window.sessionStorage.getItem("RegisterObj")!);
  }

  ngOnInit(): void {
    this._commonService.ScreenUrl();
    this._commonService.setEqualDivSize();
  }
  ngAfterViewInit(): void {
    this._commonService.changeIsHeader();
    this._commonService.changeIsFooter();
    var bannerSlide = this._commonService.setDynamicImage();
    this._commonService.setBodyHeightSize();
    this._commonService.setSlideNo(bannerSlide.slideNo);
    this._commonService.setBanner(bannerSlide.bannerClass);
  }

  redirectToPlans = () => {
    var ClubNumber = window.sessionStorage.getItem("ClubNumber");
    var GUID = window.sessionStorage.getItem('GUID');
    var URL = window.location.href;
    var PageName = window.location.pathname.split('/').pop();
    var PostData: any = {
      FieldValue: `${this.viewPlans}:Membershiplan button Click`,
      ClubNumber: ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: this.viewPlans,
    }
    this._commonService.SaveWorkFlow(PostData);

    window.sessionStorage.setItem("IsPriceShow", JSON.stringify(0));
   
      this.route.navigateByUrl('plans')
    
  }
  redirectToHealthInsurance = () => {
    var ClubNumber = window.sessionStorage.getItem("ClubNumber");
    var GUID = window.sessionStorage.getItem('GUID');
    var URL = window.location.href;
    var PageName = window.location.pathname.split('/').pop();
    var PostData: any = {
      FieldValue: `${this.healthInsurance}:HealthInsurance button Click`,
      ClubNumber: ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: this.healthInsurance,
    }
    this._commonService.SaveWorkFlow(PostData);

    this.route.navigateByUrl('guest/health-insurance')
  }
}
