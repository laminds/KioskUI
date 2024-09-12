import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonService } from '../../../../shared/services/common.service';
import { Router } from '@angular/router';
import { constMessage } from 'src/app/core/constant/const';

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ThankyouComponent implements OnInit {

  headingName: string;
  headingType: string;
  thankyouText: string;
  sourceName: string;
  homebtn: string;
  agreementNumber: string;
  join:boolean;

  constructor(
    private _commonService: CommonService,
    private router: Router,
  ) {
    this.sourceName = window.sessionStorage.getItem('SourceName')!;
    this.agreementNumber = window.sessionStorage.getItem('AgreementNumber')! == null ? "" : window.sessionStorage.getItem('AgreementNumber')!;
    this.headingName = '';
    this.headingType = '';
    this.thankyouText = '';
    this.join = false;
    this.homebtn = constMessage.thankyou.homebtn;
    this._commonService.setServiceName(window.sessionStorage.getItem("ServiceName")!);
  }

  ngOnInit(): void {
    this._commonService.changeIsHeader();
    this._commonService.changeNofooter();
    var bannerSlide = this._commonService.setDynamicImage();
    this._commonService.setBodyHeightSize();
    this._commonService.setSlideNo(bannerSlide.slideNo);
    this._commonService.setBanner(bannerSlide.bannerClass);
    if (this.sourceName == this._commonService.commonTypeObj.guest.checkInObj.openHouseType) {
      this.headingName = constMessage.guest.openHouse.openHouseheadingName;
      this.headingType =  constMessage.guest.openHouse.openHouseThankyou;
      this.thankyouText = constMessage.guest.openHouse.openHouseheadingType;
      this.join = false;
    }
    else if (this.sourceName == this._commonService.commonTypeObj.guest.classPassMemberType) {
      // this.headingName = constMessage.thankyou.OfficialText;
      this.headingType = constMessage.guest.classPassMember.classPassheadingName;
      this.thankyouText = constMessage.guest.classPassMember.classPassThankyou;
      this.join = false;
    }
    else if (this.sourceName == this._commonService.commonTypeObj.guest.joinType) {
      this.headingName = constMessage.guest.join.thankyouText;
      this.thankyouText = constMessage.guest.join.paymentText;
      this.headingType = constMessage.guest.join.agreementNumberText + ' ' + this.agreementNumber;
      this.join = true;
    }
    else if (this.sourceName == this._commonService.commonTypeObj.guest.checkInObj.memberGuestType) {
      this.headingName = constMessage.member.guestCheckIn.thankyoutext;
      this.headingType = constMessage.member.guestCheckIn.headingtext;
      this.thankyouText = "";
      this.join = false;
    }
    else {
      this.headingName = constMessage.thankyou.OfficialText;
      this.headingType = constMessage.thankyou.guestThankyouText;
      this.thankyouText = constMessage.thankyou.guestHeadingText;
      this.join = false;
    }
    this._commonService.setEqualDivSize();
    // setTimeout(() => {
    //   this.redirectToHome();
    // }, 7000);
  }

  redirectToHome() {
    this._commonService.removeAllSession();
    this._commonService.onSearchComponentInitial();
    // window.sessionStorage.clear();
    this.router.navigateByUrl('/Search');
  }

  redirectToRefer() {
    window.open(
      'https://lp.youfit.com/refer-your-friends', '_blank'
    );
  }

}
