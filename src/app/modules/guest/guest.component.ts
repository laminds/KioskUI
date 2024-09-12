import { AfterViewInit, Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ApiMethod, AuthEndPoints, constMessage } from 'src/app/core/constant/const';
import { HttpService } from 'src/app/core/services/http.service';
import { LeadModel } from 'src/app/shared/models/searchModel';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.css']
})
export class GuestComponent implements OnInit {
  Path: string;
  SlideNo: string;
  BannerClass: string;
  commonService!: CommonService;
  leadObj: LeadModel
  joinNow: string;
  checkIn: string;
  buypass: string;
  classpass: string;
  guestHeadermessage: string;
  guestSecondHeadermessage: string;
  pickleball: string;
  clubNumber: Number;
  isguestPickleBall : boolean;
  constructor(
    private _commonService: CommonService,
    private route: Router,
    private _httpService: HttpService,
  ) {
    this.Path = '';
    this.SlideNo = '';
    this.BannerClass = '';
    this.leadObj = JSON.parse(window.sessionStorage.getItem("RegisterObj")!);
    this.commonService = _commonService;
    this.joinNow = constMessage.guest.joinnow;
    this.checkIn = constMessage.guest.checkIn;
    this.buypass = constMessage.guest.buypass;
    this.classpass = constMessage.guest.classpass;
    this.guestHeadermessage = constMessage.guest.guestHeadermessage;
    this.guestSecondHeadermessage = constMessage.guest.guestSecondHeadermessage;
    this.pickleball = constMessage.guest.pickleball;
    this.clubNumber = Number(window.sessionStorage.getItem("ClubNumber"));
    this.isguestPickleBall = false;
  }

  ngOnInit(): void {
    this._commonService.ScreenUrl();
    this._commonService.changeIsHeader();
    var bannerSlide = this._commonService.setDynamicImage();
    this._commonService.setSlideNo(bannerSlide.slideNo);
    this._commonService.setBanner(bannerSlide.bannerClass);
    this._commonService.setServiceName(window.sessionStorage.getItem("ServiceName")!);
    this._commonService.setEqualDivSize();
    this._commonService.changeIsFooter();
    this._commonService.setBodyHeightSize();
    this.getPickleballflag();
  }

  getPickleballflag() {
    this._httpService.requestCall(AuthEndPoints.TOTSPOT_AND_PICKLEBALL_FLAG, ApiMethod.GET,  this.clubNumber)?.subscribe({
      next: (response: any) => {
        if (response.data) {
          window.sessionStorage.setItem("AmenitiesObj", JSON.stringify(response.data));
          this.isguestPickleBall = response.data.isPickleBall;
        }
      }
    })
  }
}
