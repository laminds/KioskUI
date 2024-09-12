import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { constMessage, webConfig } from 'src/app/core/constant/const';
import { LeadModel } from 'src/app/shared/models/searchModel';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-checkin-pass',
  templateUrl: './checkin-pass.component.html',
  styleUrls: ['./checkin-pass.component.css']
})
export class CheckinPassComponent {
  Path: string;
  SlideNo: string;
  BannerClass: string;
  commonService!: CommonService;
  leadObj: LeadModel;
  freepass: string;
  guestFortheday: string;
  premiumguest: string;
  openhouseText: string;
  paidpass: string
  pickleballText: string;
  memberguestText: string;
  joinHeadermessage: string;
  appointment: string;
  welcomeText: string;
  selectOptionText: string;
  IsShowOpenHouseTab: boolean;
  virtualTourText : string;
  workOutwinSweepTab : string;

  constructor(
    private _commonService: CommonService,
    private route: Router,
  ) {
    this.Path = '';
    this.SlideNo = '';
    this.BannerClass = '';
    this.leadObj = JSON.parse(window.sessionStorage.getItem("RegisterObj")!);
    this._commonService.setServiceName(window.sessionStorage.getItem("ServiceName")!);
    this.commonService = _commonService;
    this.freepass = constMessage.guest.freepass;
    this.guestFortheday = constMessage.guest.guestFortheday;
    this.premiumguest = constMessage.guest.premiumguest;
    this.joinHeadermessage = constMessage.guest.joinHeadermessage;
    this.appointment = constMessage.guest.appointment;
    this.openhouseText = constMessage.guest.openhouseText;
    this.paidpass = constMessage.guest.paidpass;
    this.pickleballText = constMessage.guest.pickleball;
    this.memberguestText = constMessage.guest.memberguestText;
    this.welcomeText = constMessage.newUser.welcomeText;
    this.selectOptionText = constMessage.guest.join.subHeadermessage;
    this.IsShowOpenHouseTab = false;
    this.virtualTourText = constMessage.guest.virtualTourText;
    this.workOutwinSweepTab = constMessage.member.workOutwinSweepTab;
  }

  ngOnInit(): void {
    this._commonService.ScreenUrl();
    var date = this.commonService.getStringDate(new Date());
    var TodayDate = Date.parse(date);
    var FromDate = Date.parse(webConfig.fromDateForOpenHouse);
    var ToDate = Date.parse(webConfig.toDateForOpenHouse)
    if (webConfig.fromDateForOpenHouse || webConfig.toDateForOpenHouse) {
      if ((FromDate && FromDate == TodayDate) || ToDate && ToDate == TodayDate) {
        this.IsShowOpenHouseTab = true;
      }
      else if (TodayDate > FromDate && TodayDate < ToDate) {
        this.IsShowOpenHouseTab = true;
      }
    }

    this._commonService.setEqualDivSize();
    this._commonService.changeIsHeader();
    var bannerSlide = this._commonService.setDynamicImage();
    this._commonService.setSlideNo(bannerSlide.slideNo);
    this._commonService.setBanner(bannerSlide.bannerClass);
    this._commonService.setServiceName(window.sessionStorage.getItem("ServiceName")!);
    this._commonService.changeIsFooter();
    this._commonService.setBodyHeightSize();
  }
  ngAfterViewInit(): void {
    this._commonService.setEqualDivSize();
    this._commonService.changeIsHeader();
    var bannerSlide = this._commonService.setDynamicImage();
    this._commonService.setSlideNo(bannerSlide.slideNo);
    this._commonService.setBanner(bannerSlide.bannerClass);
    this._commonService.setServiceName(window.sessionStorage.getItem("ServiceName")!);
    this._commonService.changeIsFooter();
    this._commonService.setBodyHeightSize();
  }

}
