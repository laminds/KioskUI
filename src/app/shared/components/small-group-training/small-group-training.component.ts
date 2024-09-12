import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';
import { initialObjModel } from '../../models/initialObjModel';
import { CommonType } from '../../Types/commonTypes';
import { memberModel } from '../../models/memberModel';
import { PtPlanService } from '../../services/pt-plan.service';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { constMessage } from 'src/app/core/constant/const';

@Component({
  selector: 'app-small-group-training',
  templateUrl: './small-group-training.component.html',
  styleUrls: ['./small-group-training.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SmallGroupTrainingComponent {
  commonTypeObj: CommonType | undefined;
  commonService: CommonService;
  path: string;
  slideNo: string;
  BannerClass: string;
  memberObj: memberModel;
  IsPriceShow: any;
  AllPTPlansList: any[];
  PTPlanTabOrderAndName: any[];
  SGTTabList: any[];
  SGTPlanTabOrderList: any[];
  SRowNo: number;
  SGTPlanListDetail: any[];
  IsShowPTPlanSkipButton: boolean;
  initialObj: initialObjModel;
  getSmallTrainingPlanList: any[];
  smallGroupPlanTabOrderAndName: any[];
  RowNo: number;
  sgtPlanText : string;
  sgtheaderText : string;
  sgtSelectPlanText : string;
  dollarSign : string;
  buyNowbtn : string;
  sessionText : string;
  planValueText : string;
  skipbtn : string;
  okbtn : string;
  sgtSubPlanText : string;
  ClubNumber: string | null;

  constructor(
    private _commonService: CommonService,
    private _router: Router,
    private _ptPlanService: PtPlanService,
    private toastr: ToastrService
  ) {
    this.sgtheaderText = constMessage.member.ptPlan.sgtheaderText;
    this.sgtSelectPlanText = constMessage.member.ptPlan.sgtSelectPlanText;
    this.dollarSign = constMessage.member.ptPlan.dollarSign;
    this.buyNowbtn = constMessage.member.ptPlan.buyNowbtn;
    this.sessionText = constMessage.member.ptPlan.sessionText;
    this.planValueText = constMessage.member.ptPlan.planValueText;
    this.skipbtn = constMessage.member.ptPlan.skipbtn;
    this.okbtn = constMessage.member.okbtn;
    this.initialObj = _commonService.initialObj;
    this.path = '';
    this.slideNo = '';
    this.BannerClass = '';
    this.commonService = _commonService;
    this.memberObj = JSON.parse(window.sessionStorage.getItem("MemberObj")!) ? JSON.parse(window.sessionStorage.getItem("MemberObj")!) : JSON.parse(window.sessionStorage.getItem("RegisterObj")!);
    this._commonService.setServiceName(window.sessionStorage.getItem("ServiceName")!);
    this.ClubNumber = window.sessionStorage.getItem("ClubNumber");
    this.AllPTPlansList = [];
    this.SGTTabList = []
    this.PTPlanTabOrderAndName = [];
    this.SGTPlanTabOrderList = [];
    this.RowNo = 0;
    this.SRowNo = 0;
    this.SGTPlanListDetail = [];
    this.IsShowPTPlanSkipButton = false;
    this.getSmallTrainingPlanList = [];
    this.smallGroupPlanTabOrderAndName = [];
    this.sgtPlanText = constMessage.member.ptPlan.sgtPlanText;
    this.sgtSubPlanText = constMessage.member.ptPlan.sgtSubPlanText;
  }


  ngOnInit(): void {
    this._commonService.ScreenUrl();
    this._commonService.changeIsHeader();
    this._commonService.changeIsFooter();
    var bannerSlide = this._commonService.setDynamicImage();
    this.slideNo = bannerSlide.slideNo;
    this.BannerClass = bannerSlide.bannerClass;
    this._commonService.setSlideNo(this.slideNo);
    this._commonService.setBanner(this.BannerClass);
    this._commonService.setBodyHeightSize();
    this.getSmallTrainingPlan();
  }

  

  getSmallTrainingPlan = () => {
    this.IsPriceShow = window.sessionStorage.getItem("IsPriceShow");
    if (window.sessionStorage.getItem("ClubNumber")) {
      if (window.sessionStorage.getItem('SourceName') === this._commonService.commonTypeObj.member.personalTrainingType) {
        var RegObj = JSON.parse(window.sessionStorage.getItem("MemberObj")!);
      }
      else {
        var RegObj = JSON.parse(window.sessionStorage.getItem("RegisterObj")!);
      }

      var PlanObj = JSON.parse(window.sessionStorage.getItem("PlanObj")!);
      var PlanType = ""
      if (PlanObj) {
        PlanType = PlanObj.planName.includes("Basic") ? "BASIC" :
          PlanObj.planName.includes("Premium +") ? "Premium+" : "PREMIUM";
      }
      var PostData = {
        ClubNumber: window.sessionStorage.getItem("ClubNumber"),
        IsFlipPlan: RegObj.IsFlipPlan ? RegObj.IsFlipPlan : null,
        MemberId: RegObj.memberId,
        PlanType: PlanType,
        IsSGTFlag: true
      }
      this._ptPlanService.getPTPlanDetails(PostData)?.subscribe({
        next: (response: any) => {
          if (response.data) {
            this.AllPTPlansList = _.orderBy(response.data.allPTPlanList, 'totalValue', 'asc');
            this.SGTTabList = response.data.ptTabsList.length > 0 ? response.data.ptTabsList : [];
            /*set dynamic PT plan tabs*/

            this.PTPlanTabOrderAndName = response.data.ptPlanTabOrderAndName.length > 0 ? response.data.ptPlanTabOrderAndName : [];

            this.smallGroupPlanTabOrderAndName = response.data.ptPlanTabOrderAndName.length > 0 ? response.data.ptPlanTabOrderAndName : [];
            var FirstOrderID = response.data.ptPlanTabOrderAndName[0].tabOrder;

            var NewData = response.data.ptPlanTabOrderList.length > 0 ? response.data.ptPlanTabOrderList : [];
            this.SGTPlanTabOrderList = response.data.ptPlanTabOrderList;

            this.SRowNo = 0;
            _.forEach(this.SGTPlanTabOrderList, (O: any) => {
              this.SRowNo = this.SRowNo + 1;
              O.SRowNo = this.SRowNo;
            });

            //Hide Show Plan Price
            var IsPriceShow = window.sessionStorage.getItem("IsPriceShow");
            _.forEach(this.SGTPlanTabOrderList, (O: any) => {
              if (IsPriceShow == "0") {
                O.ClassName = 'Showprice';
                O.HideLink = "Hideprice";
              }
              else {
                O.ClassName = 'Hideprice';
                O.HideLink = "Hideprice";
              }
            });

            this.SGTPlanListDetail = _.filter(NewData, { tabOrder: FirstOrderID });
            this.RowNo = 1
            this.IsShowPTPlanSkipButton = true;
            this._commonService.setEqualPTPlanDivSize();
            this._commonService.setBodyHeightSize();

            this._ptPlanService.getMemberPreviousPTPlanAvailable(RegObj.memberId)?.subscribe({
              next: (response: any) => {
                if (!response.error) {
                  window.sessionStorage.setItem("MemberPreviousPTPlanAvailable", JSON.stringify(response.data));
                }
                else {
                  this.toastr.error(response.Message, "Error");
                }
              }
            })
          }
        }
      })
    }
  }

  smallGroupPlanSelection(plan: any, ptPlanNameType: string) {
    var selectedPlan = {
      planId: plan.recurringServicePlanId,
      planName: plan.recurringServicePlanName,
      originalPlanName: plan.originalRecurringServicePlanName,
      monthlyRecurringCharge: plan.billing.invoiceTotal,
      planPrice: plan.purchaseToday.unitPrice,
      serviceQuantity: plan.purchaseToday.serviceQuantity,
      totalPrice: plan.purchaseToday.totalInvoice,
      validationHash: plan.validationHash,
      ptPlanNameType: !ptPlanNameType ? "Pay As You Go" : ptPlanNameType,
      planDetailsJson : plan.planDetailsJson
    }

    window.sessionStorage.removeItem("SmallGroupPlanObj");
    window.sessionStorage.setItem("SmallGroupPlanObj", JSON.stringify(selectedPlan));
    var GUID = window.sessionStorage.getItem('GUID');
    var URL = window.location.href;
    var PageName = window.location.pathname.split('/').pop();
    var PostData: any = {
      FieldValue: `SGT Plan:${plan?.recurringServicePlanName} ,SGT PlanID:${plan?.recurringServicePlanId}`,
      ClubNumber: this.ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: this.buyNowbtn
    }
    this._commonService.SaveWorkFlow(PostData);
    this._router.navigate(['checkout']);
  }

  skipSGTPlanSelection() {
    if (window.sessionStorage.getItem("SmallGroupPlanObj")) {
      window.sessionStorage.removeItem("SmallGroupPlanObj");
    }
    var PTPlan = JSON.parse(window.sessionStorage.getItem("PTPlanObj")!);
    var SmallGroupPlan = JSON.parse(window.sessionStorage.getItem("SmallGroupPlanObj")!);
    if (PTPlan == null && SmallGroupPlan == null && this.initialObj.sourceName == this.commonService.commonTypeObj.member.personalTrainingType) {
      this.toastr.warning("Please Select PT Plan Or Small Group Training Plan", "Error");
      return
    }
    var GUID = window.sessionStorage.getItem('GUID');
    var URL = window.location.href;
    var PageName = window.location.pathname.split('/').pop();
    var PostData: any = {
      FieldValue:  `Skip SGT Plan:Skip`,
      ClubNumber: this.ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: this.skipbtn
    }
    this._commonService.SaveWorkFlow(PostData);
    this._router.navigateByUrl('checkout');
  }

   //this.$scope.Showpricesection = [true];
   ShowtoggleFilter = (TabName:any, SRowNo:any) => {
    _.forEach(this.SGTPlanTabOrderList, (O: any) => {
        if (O.TabName == TabName && O.SRowNo == SRowNo) {
            O.ClassName = "Showprice";
            O.HideShowLink = "Hideprice";
            O.HideLink = "Showprice";
        }
    });
};

//this.$scope.Hidepricesection = [false];
HidetoggleFilter = (TabName:any, SRowNo:any) => {
    _.forEach(this.SGTPlanTabOrderList, (O: any) => {
        if (O.TabName == TabName && O.SRowNo == SRowNo) {
            O.ClassName = "Hideprice";
            O.HideShowLink = "Showprice"
            O.HideLink = "Hideprice";
        }
    });
};
}
