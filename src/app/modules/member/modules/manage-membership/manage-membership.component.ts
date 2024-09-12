import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { constMessage } from 'src/app/core/constant/const';
import { HttpService } from 'src/app/core/services/http.service';
import { memberModel } from 'src/app/shared/models/memberModel';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-manage-membership',
  templateUrl: './manage-membership.component.html',
  styleUrls: ['./manage-membership.component.css']
})
export class ManageMembershipComponent {
  Path: string;
  SlideNo: string;
  BannerClass: string;
  commonService!: CommonService;
  memberObj: memberModel;
  hitext: string;
  headermessage: string;
  UPersonalItext : string;
  UPaymentItext : string;

  constructor(private _commonService: CommonService,) {
    this.Path = '';
    this.SlideNo = '';
    this.BannerClass = '';
    this.commonService = _commonService;
    this._commonService.setServiceName(window.sessionStorage.getItem("ServiceName")!);
    this.memberObj = JSON.parse(window.sessionStorage.getItem("MemberObj")!);
    this.hitext = constMessage.member.hitext;
    this.headermessage = constMessage.amenities.amenitiestHeadermessage;
     this.UPersonalItext = constMessage.member.manageMembershipObj.UPInfotext;
     this.UPaymentItext = constMessage.member.manageMembershipObj.UPaymentInfo;
  }

  ngOnInit(): void {
    this._commonService.ScreenUrl();
    this._commonService.changeIsHeader();
    this._commonService.changeIsFooter();
    var bannerSlide = this._commonService.setDynamicImage();
    this._commonService.setSlideNo(bannerSlide.slideNo);
    this._commonService.setBanner(bannerSlide.bannerClass);
    this._commonService.setEqualDivSize();
    this._commonService.setBodyHeightSize();
  }
}
