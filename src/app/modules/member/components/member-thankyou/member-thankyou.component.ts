import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { constMessage } from 'src/app/core/constant/const';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-member-thankyou',
  templateUrl: './member-thankyou.component.html',
  styleUrls: ['./member-thankyou.component.css']
})
export class MemberThankyouComponent {
  Path!: string;
  SlideNo!: string;
  BannerClass!: string;
  getThankYou: any;
  IsShowThankYou: string = "";
  headingtext: string;
  thankyouText: string;
  sourceName: string;
  memberBackButton: boolean;
  memberHomeButton:boolean;


  constructor(private _commonService: CommonService, private _router: Router) {
    this._commonService = _commonService;
    this.headingtext = '';
    this.thankyouText = '';
    this.sourceName = window.sessionStorage.getItem('SourceName')!;
    this.memberBackButton = false;
    this.memberHomeButton = false;
    this._commonService.setServiceName(window.sessionStorage.getItem("ServiceName")!);
  }
  ngOnInit(): void {
    this._commonService.changeIsHeader();
    this._commonService.changeNofooter();
    var bannerSlide = this._commonService.setDynamicImage();
    this.SlideNo = bannerSlide.slideNo;
    this.BannerClass = bannerSlide.bannerClass;
    this._commonService.setSlideNo(this.SlideNo);
    this._commonService.setBanner(this.BannerClass);    
    this._commonService.setBodyHeightSize();
    if (this.sourceName == this._commonService.commonTypeObj.member.guestCheckInType) {
      this.thankyouText = constMessage.member.guestCheckIn.thankyoutext;
      this.headingtext = constMessage.member.guestCheckIn.headingtext;
    }
    else if(this.sourceName == this._commonService.commonTypeObj.member.amenitiesTypeObj.pickleballType){
      this.thankyouText = constMessage.amenities.pickleballObj.pickleballthankyouText;
      this.headingtext = constMessage.amenities.pickleballObj.pickleballheadingtext;
    }
    else if(this.sourceName == this._commonService.commonTypeObj.member.amenitiesTypeObj.babysittingType){
      this.thankyouText = constMessage.amenities.babysittingObj.babysittingthankyouText;
      this.headingtext = constMessage.amenities.babysittingObj.babysittingheadingtext;
    }
    else if(this.sourceName == this._commonService.commonTypeObj.member.upgradeMemberShipType){
      this.thankyouText = constMessage.member.upgradePlan.thankyoutext;
      this.headingtext = constMessage.member.upgradePlan.subheaderText;
    }
    else if(this.sourceName == this._commonService.commonTypeObj.member.personalTrainingType){
      this.thankyouText = constMessage.member.memberCheckOut.thankyouText;
      this.headingtext = constMessage.member.memberCheckOut.subHeaderText;
    }
    else if(this.sourceName == this._commonService.commonTypeObj.member.manageMembershipObj.updatePaymentInfo){
      this.thankyouText = "";
      this.headingtext = constMessage.amenities.updatePaymentInfoObj.updatePaymentInfoheadingtext;
    }
    setTimeout(() => {
      this.gotoHome();
    }, 7000);
  }

  redirectToMemberScreen() {
    this._router.navigateByUrl('member');
  }

  gotoHome() {
    if (window.sessionStorage.getItem("RegisterObj") || window.sessionStorage.getItem("MemberObj")) {
      window.sessionStorage.removeItem("RegisterObj");
      window.sessionStorage.removeItem("MemberObj");
    }
    this._commonService.onSearchComponentInitial();
    // window.sessionStorage.clear();
    this._commonService.removeAllSession();
    this._router.navigateByUrl('/Search');
  }

}


