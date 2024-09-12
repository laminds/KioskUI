import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';
import { constMessage } from 'src/app/core/constant/const';

@Component({
  selector: 'app-register-thankyou',
  templateUrl: './register-thankyou.component.html',
  styleUrls: ['./register-thankyou.component.css']
})
export class RegisterThankyouComponent implements OnInit {
  headingName: string;
  headingType: string;
  thankyouText: string;
  homebtn: string;
  path: string;
  slideNo: string;
  BannerClass: string;
  constructor(private _commonService: CommonService, private _router: Router) {
    this.headingName = '';
    this.headingType = '';
    this.thankyouText = '';
    this.homebtn = constMessage.thankyou.homebtn;
    this.path = '';
    this.slideNo = '';
    this.BannerClass = '';
    this._commonService.setServiceName(window.sessionStorage.getItem("ServiceName")!)
  }

  ngOnInit(): void {
    this._commonService.changeIsHeader();
    this._commonService.changeNofooter();
    var bannerSlide = this._commonService.setDynamicImage();
    this.slideNo = bannerSlide.slideNo;
    this.BannerClass = bannerSlide.bannerClass;
    this._commonService.setSlideNo(this.slideNo);
    this._commonService.setBanner(this.BannerClass);
    this._commonService.setBodyHeightSize();

    if (this._commonService.commonTypeObj.minorType == window.sessionStorage.getItem("SourceName")) {
      this.headingName = constMessage.minor.minorheadingName;
      this.headingType = "";
      this.thankyouText = ""
      this.homebtn = constMessage.thankyou.homebtn;
    }
    else if (window.sessionStorage.getItem("SourceName") == this._commonService.commonTypeObj.guest.checkInObj.appointmentTourType) {
      this.headingName = constMessage.guest.appointmentTour.appointmentTourheadingName;
      this.headingType = "";
      this.thankyouText = ""
    }
    else if (window.sessionStorage.getItem("SourceName") == this._commonService.commonTypeObj.guest.checkInObj.paidPassType || window.sessionStorage.getItem("SourceName") == this._commonService.commonTypeObj.guest.checkInObj.buypassType) {
      this.headingName = constMessage.guest.paidPass.paidPassheadingName;
      this.headingType = constMessage.guest.paidPass.paidPassheadingType;
      this.thankyouText = ""
    }
    else if (window.sessionStorage.getItem("SourceName") == this._commonService.commonTypeObj.guest.checkInObj.freePassType) {
      this.headingName = constMessage.newUser.headingName;
      this.headingType = constMessage.newUser.headingType;
      this.thankyouText = constMessage.newUser.thankyouText;
    }
    else if (window.sessionStorage.getItem("SourceName") == this._commonService.commonTypeObj.guest.checkInObj.memberGuestType) {
      this.headingName = constMessage.newUser.headingName;
      this.headingType = constMessage.newUser.headingType;
      this.thankyouText = constMessage.guest.memberGuest.memberGuestthankyouText;
    }
    else {
      this.headingName = constMessage.newUser.headingName;
      this.headingType = constMessage.newUser.headingType;
      this.thankyouText = constMessage.newUser.thankyouText;
      this.homebtn = constMessage.thankyou.homebtn;
    }
    this._commonService.setEqualDivSize();
    setTimeout(() => {
      this.gotoHome();
    }, 7000);
  }

  gotoHome() {
    this._commonService.removeAllSession();
    this._commonService.onSearchComponentInitial();
    window.sessionStorage.removeItem('Identification');
    // window.sessionStorage.clear();
    this._router.navigateByUrl('/Search');
  }

}

