import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { constMessage, webConfig } from 'src/app/core/constant/const';
import { HttpService } from 'src/app/core/services/http.service';
import { memberModel } from 'src/app/shared/models/memberModel';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-babysitting',
  templateUrl: './babysitting.component.html',
  styleUrls: ['./babysitting.component.css']
})
export class BabysittingComponent {
  Path: string;
  SlideNo: string;
  BannerClass: string;
  commonService!: CommonService;
  ChildList: any[];
  memberObj : memberModel;
  hitext : string;
  welcomeText : string;
  dollarSign : string;
  buyNowbtn : string;
  sessionText : string;
  planValueText : string;
  okbtn : string;
  
  constructor(private _commonService: CommonService,
    private _httpService: HttpService,
    private router : Router) {
    this.Path = '';
    this.SlideNo = '';
    this.BannerClass = '';
    this.ChildList = [];
    this.commonService = _commonService;
    this.memberObj = JSON.parse(window.sessionStorage.getItem("MemberObj")!);
    this.hitext = constMessage.member.hitext;
    this.welcomeText = constMessage.amenities.babysittingObj.welcometext;
    this.dollarSign = constMessage.member.ptPlan.dollarSign;
    this.buyNowbtn = constMessage.member.ptPlan.buyNowbtn;
    this.sessionText = constMessage.member.ptPlan.sessionText;
    this.planValueText = constMessage.member.ptPlan.planValueText;
    this.okbtn = constMessage.member.okbtn;
    }

  ngOnInit(): void {
    this._commonService.ScreenUrl();
    this._commonService.changeIsHeader();
    this._commonService.changeIsFooter();
    var bannerSlide = this._commonService.setDynamicImage();
    this._commonService.setSlideNo(bannerSlide.slideNo);
    this._commonService.setBanner(bannerSlide.bannerClass);
    this._commonService.setEqualDivSize();
    this.getChildCareDetails();
    this._commonService.setBodyHeightSize();
  }

  getChildCareDetails(){
    var firstChildPlanList = webConfig.childCareFirstPlan.split(",");
    var secondChildPlanList = webConfig.childCareSecondPlan.split(",");

    this.ChildList = [];
    if (firstChildPlanList != null) {
      var Planlist = {
        name: firstChildPlanList[0],
        value: firstChildPlanList[1]
      };
      this.ChildList.push(Planlist);
    }
    if (secondChildPlanList != null) {
      var Planlist = {
        name: secondChildPlanList[0],
        value: secondChildPlanList[1]
      };
      this.ChildList.push(Planlist);
    }
  }

  babysittingPlanSelection(plan: any) {
    var ClubNumber = window.sessionStorage.getItem("ClubNumber");
    var GUID = window.sessionStorage.getItem('GUID');
    var URL = window.location.href;
    var PageName = window.location.pathname.split('/').pop();
    var PostData: any = {
      FieldValue: `BabySitting:${plan?.name}`,
      ClubNumber: ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: this.buyNowbtn,
    }
    this._commonService.SaveWorkFlow(PostData);

    var babySittingPlan = {
      planName: plan.name,
      downPaymentTotalAmount: plan.value,
      initiationFee: plan.value,
    }
    window.sessionStorage.setItem("BabySittingPlan", JSON.stringify(babySittingPlan));
    this.router.navigate(['member/amenities/babysitting/checkout']);
  }

}
