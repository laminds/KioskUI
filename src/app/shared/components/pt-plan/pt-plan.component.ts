import { Component, ViewEncapsulation } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { CommonType } from '../../Types/commonTypes';
import { memberModel } from '../../models/memberModel';
import { PtPlanService } from '../../services/pt-plan.service';
import * as _ from 'lodash';
import { initialObjModel } from '../../models/initialObjModel';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { constMessage } from 'src/app/core/constant/const';

@Component({
  selector: 'app-pt-plan',
  templateUrl: './pt-plan.component.html',
  styleUrls: ['./pt-plan.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PtPlanComponent {
  commonTypeObj: CommonType | undefined;
  commonService: CommonService;
  path: string;
  slideNo: string;
  BannerClass: string;
  memberObj: memberModel;
  IsPriceShow: any;
  AllPTPlansList: any[];
  PTPlanTabOrderAndName: any[];
  PTTabsList: any[];
  PTPlanTabOrderList: any[];
  RowNo: number;
  AddRowNumberintoptplanlist: any[];
  SRowNo: number;
  PTPlanTabOrderListDetail: any[];
  IsShowPTPlanSkipButton: boolean;
  initialObj: initialObjModel;
  PTPlanTabOrderDetails: any[];
  PrevTab: string;
  headertext: string;
  selectPlantext: string;
  NMSText: string;
  dollarSign: string;
  buyNowbtn: string;
  sessionText: string;
  planValueText: string;
  skipbtn: string;
  okbtn: string;
  subPlanText: string;
  isSmallGroupPlan: boolean;
  ClubNumber: string | null;

  constructor(
    private _commonService: CommonService,
    private _ptPlanService: PtPlanService,
    private _router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) {
    this.NMSText = constMessage.member.ptPlan.NMSText;
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
    this.ClubNumber = window.sessionStorage.getItem("ClubNumber");
    this.memberObj = JSON.parse(window.sessionStorage.getItem("MemberObj")!) ? JSON.parse(window.sessionStorage.getItem("MemberObj")!) : JSON.parse(window.sessionStorage.getItem("RegisterObj")!);
    this.AllPTPlansList = [];
    this.PTTabsList = []
    this.PTPlanTabOrderAndName = [];
    this.PTPlanTabOrderList = [];
    this.RowNo = 0;
    this.SRowNo = 0;
    this.AddRowNumberintoptplanlist = [];
    this.PTPlanTabOrderListDetail = [];
    this.IsShowPTPlanSkipButton = true;
    this.PTPlanTabOrderDetails = [];
    this.PrevTab = "";
    this.headertext = constMessage.member.ptPlan.headertext;
    this.selectPlantext = constMessage.member.ptPlan.selectPlantext;
    this.subPlanText = constMessage.member.ptPlan.subPlanText;
    this.isSmallGroupPlan = false;
    this._commonService.setServiceName(window.sessionStorage.getItem("ServiceName")!);
  }
  ngOnInit(): void {
    this._commonService.ScreenUrl();
    this.getPTPlansDetails();
    this._commonService.changeIsHeader();
    this._commonService.changeIsFooter();
    var bannerSlide = this._commonService.setDynamicImage();
    this.slideNo = bannerSlide.slideNo;
    this.BannerClass = bannerSlide.bannerClass;
    this._commonService.setSlideNo(this.slideNo);
    this._commonService.setBanner(this.BannerClass);
    this._commonService.setBodyHeightSize();
  }

  getPlanDetail = (TabOrder: any, TabName: any) => {
    var NewData = this.PTPlanTabOrderList.length > 0 ? this.PTPlanTabOrderList : [];
    this.PTPlanTabOrderListDetail = _.filter(NewData, { tabOrder: TabOrder });
    this.RowNo = this.PTPlanTabOrderListDetail[0].rowNo;

    this.PTPlanTabOrderDetails = _.filter(this.PTPlanTabOrderAndName, { tabOrder: TabOrder });

    this.RowNo = this.RowNo;

    var PTPlanTabOrderDetails = JSON.parse(window.sessionStorage.getItem("PTPlanTabOrderDetails")!);
    if (PTPlanTabOrderDetails) {
      this.PrevTab = PTPlanTabOrderDetails[0].tabName;
    }
    // Add tab Active class
    var AddActiveClass = window.document.getElementsByClassName(this.PTPlanTabOrderListDetail[0].tabName);
    if (AddActiveClass[0] != null) {
      AddActiveClass[0].classList.add("active");
    }

    // Remove tab Active class
    var RemoveActiveClass = window.document.getElementsByClassName(this.PrevTab);
    if (RemoveActiveClass[0] != null) {
      RemoveActiveClass[0].classList.remove("active");
    }
    this._commonService.setEqualPTPlanDivSize();
    this._commonService.setBodyHeightSize();
  }

  getPTPlansDetails() {
    this.IsPriceShow = window.sessionStorage.getItem("IsPriceShow");
    if (window.sessionStorage.getItem("ClubNumber")) {
      if (window.sessionStorage.getItem('SourceName') === this._commonService.commonTypeObj.member.personalTrainingType) {
        var RegObj = JSON.parse(window.sessionStorage.getItem("MemberObj")!);
      }
      else {
        var RegObj = JSON.parse(window.sessionStorage.getItem("RegisterObj")!);
      }

      var PlanObj = JSON.parse(window.sessionStorage.getItem("PlanObj")!);
      var PlanType = "";
      if (PlanObj) {
        PlanType = PlanObj.planName.includes("Basic") ? "BASIC" : PlanObj.planName.includes("Premium +") ? "Premium+" : "PREMIUM";
      }

      var postData = {
        ClubNumber: window.sessionStorage.getItem("ClubNumber"),
        IsFlipPlan: RegObj.IsFlipPlan ? RegObj.IsFlipPlan : null,
        MemberId: RegObj.memberId,
        PlanType: PlanType,
        SGTFlag: false,
        Source: window.sessionStorage.getItem('SourceName') === this._commonService.commonTypeObj.member.personalTrainingType ? "Member" : "Guest" 
      }
      this._ptPlanService.getPTPlanDetails(postData)?.subscribe({
        next: (response: any) => {
          if (response.data) {
            this.AllPTPlansList = _.orderBy(response.data.allPTPlanList, 'totalValue', 'asc');
            this.PTTabsList = response.data.ptTabsList.length > 0 ? response.data.ptTabsList : [];

            /*set dynamic PT plan tabs*/
            this.PTPlanTabOrderAndName = response.data.ptPlanTabOrderAndName.length > 0 ? response.data.ptPlanTabOrderAndName : [];
            var LastOrderID = [this.PTPlanTabOrderAndName.length - 1];
            var LastOrderIDDetail = this.PTPlanTabOrderAndName[LastOrderID[0]].tabOrder;
            var FirstOrderID = this.PTPlanTabOrderAndName[0].tabOrder;

            var NewData = response.data.ptPlanTabOrderList.length > 0 ? response.data.ptPlanTabOrderList : [];
            this.PTPlanTabOrderList = response.data.ptPlanTabOrderList;

            //Add Row Numbercc
            this.RowNo = 0;
            _.forEach(this.PTPlanTabOrderAndName, (O: any) => {
              this.AddRowNumberintoptplanlist = _.filter(this.PTPlanTabOrderList, { TabOrder: O.TabOrder });
              _.forEach(this.AddRowNumberintoptplanlist, (a: any) => {
                this.RowNo = O.RowNo;
                a.RowNo = this.RowNo;
              });
            });

            //Add Row Number
            this.SRowNo = 0;
            _.forEach(this.PTPlanTabOrderList, (O: any) => {
              this.SRowNo = this.SRowNo + 1;
              O.SRowNo = this.SRowNo;
            });

            //Hide Show Plan Price
            var IsPriceShow = window.sessionStorage.getItem("IsPriceShow");
            _.forEach(this.PTPlanTabOrderList, (O: any) => {
              if (IsPriceShow == "0") {
                O.ClassName = 'Showprice';
                O.HideLink = "Hideprice";
              }
              else {
                if (O.viewPlanDetails == true) {
                  O.ClassName = "Showprice";
                  O.HideShowLink = "Hideprice";
                  O.HideLink = "Showprice";
                }
                else {
                  O.ClassName = 'Hideprice';
                  O.HideLink = "Hideprice";
                }
              }
              // if (IsPriceShow == "0") {
              //   O.ClassName = 'Showprice';
              //   O.HideLink = "Hideprice";
              // }
              // else {
              //   O.ClassName = 'Hideprice';
              //   O.HideLink = "Hideprice";
              // }
            });
            //Get Only First Plan Data     
            this.PTPlanTabOrderListDetail = _.filter(NewData, { tabOrder: FirstOrderID });
            this.RowNo = 1
            var memberObj = JSON.parse(window.sessionStorage.getItem("MemberObj")!);

            if (memberObj && memberObj.memberType.toLowerCase() == 'premium+' && window.sessionStorage.getItem('SourceName') === this._commonService.commonTypeObj.member.personalTrainingType) {
              this.IsShowPTPlanSkipButton = false;
            }
            this.isSmallGroupPlan = response.data.isSmallGroupPlan;
            // if (memberObj && window.sessionStorage.getItem('SourceName') === this._commonService.commonTypeObj.member.personalTrainingType) {
            //   this.IsShowPTPlanSkipButton = true;
            // }
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

  PTPlanSelection(ptPlan: any, ptPlanNameType: string, checkPreviousPTPlan: any) {
    if (ptPlanNameType == "New Member Special") {
      if (window.sessionStorage.getItem("MemberPreviousPTPlanAvailable")!) {
        if (window.sessionStorage.getItem("MemberPreviousPTPlanAvailable") == "true") {
          this.ShowMessageMemberPreviousPTPlanAvailable(checkPreviousPTPlan);
          return;
        }
      }
    }
    var PTSelectedPlan = {
      ptPlanId: ptPlan.recurringServicePlanId,
      planName: ptPlan.recurringServicePlanName,
      originalPlanName: ptPlan.originalRecurringServicePlanName,
      monthlyRecurringCharge: ptPlan.billing.invoiceTotal,
      planPrice: ptPlan.purchaseToday.unitPrice,
      serviceQuantity: ptPlan.purchaseToday.serviceQuantity,
      totalPrice: ptPlan.purchaseToday.totalInvoice,
      validationHash: ptPlan.validationHash,
      processingFee: ptPlan.ProcessingFee,
      ptPlanNameType: !ptPlanNameType ? "Pay As You Go" : ptPlanNameType,
      planDetailsJson: ptPlan.planDetailsJson
    }
    window.sessionStorage.removeItem("PTPlanObj");
    window.sessionStorage.removeItem("SmallGroupPlanObj");
    window.sessionStorage.setItem("PTPlanObj", JSON.stringify(PTSelectedPlan));

    if (window.sessionStorage.getItem('SourceName') == this._commonService.commonTypeObj.member.personalTrainingType) {

      if (window.sessionStorage.getItem("MemberObj")) {
        var memberObj = JSON.parse(window.sessionStorage.getItem("MemberObj")!);

        if (memberObj.memberType.toLowerCase() == 'premium+') {
          this.GoToCheckOut();
        }
        else {
          this.CheckMemberShipPlanType();
        }
      }
    }
    else {
      this.CheckMemberShipPlanType();
    }
    var GUID = window.sessionStorage.getItem('GUID');
    var URL = window.location.href;
    var PageName = window.location.pathname.split('/').pop();
    var PostData: any = {
      FieldValue: `PT Plan:${ptPlan?.recurringServicePlanName} ,PT PlanID:${ptPlan?.recurringServicePlanId},Tab Name:${ptPlan?.tabName}`,
      ClubNumber: this.ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: this.buyNowbtn,
    }
    this._commonService.SaveWorkFlow(PostData);
  }

  //this.$scope.Showpricesection = [true];
  ShowtoggleFilter = (inx: any, TabName: any, SRowNo: any) => {
    _.forEach(this.PTPlanTabOrderList, (O: any) => {
      if (O.tabName == TabName && O.SRowNo == SRowNo) {
        O.ClassName = "Showprice";
        O.HideShowLink = "Hideprice";
        O.HideLink = "Showprice";
      }
    });
  };

  //this.$scope.Hidepricesection = [false];
  HidetoggleFilter = (inx: any, TabName: any, SRowNo: any) => {
    _.forEach(this.PTPlanTabOrderList, (O: any) => {
      if (O.tabName == TabName && O.SRowNo == SRowNo) {
        O.ClassName = "Hideprice";
        O.HideShowLink = "Showprice"
        O.HideLink = "Hideprice";
      }
    });
  };

  CheckMemberShipPlanType() {
    if (this.isSmallGroupPlan) {
      var PlanObj = JSON.parse(window.sessionStorage.getItem("PlanObj")!);
      if (PlanObj && window.sessionStorage.getItem('SourceName') != this._commonService.commonTypeObj.member.personalTrainingType) {
        if (window.sessionStorage.getItem("ClubNumber")! && PlanObj.membershipType.toLowerCase() != 'premium+') {
          this._router.navigate(['/smallGroupTraining'])
        }
        else {
          this._router.navigate(['/checkout'])
        }
      }
      else if (window.sessionStorage.getItem('SourceName') == this._commonService.commonTypeObj.member.personalTrainingType) {
        var memberObj = JSON.parse(window.sessionStorage.getItem("MemberObj")!);

        if (memberObj && memberObj.memberType.toLowerCase() == 'premium+') {
          if (JSON.parse(window.sessionStorage.getItem("PTPlanObj")!)) {
            this._router.navigate(['/checkout'])
          }
          else {
            this.toastr.warning("Please Select at list PT Plan", "Error");
            return
          }
        }
        else {
          this._router.navigate(['/smallGroupTraining'])
        }
      }
    }
    else {
      if (window.sessionStorage.getItem("ClubNumber")!) {
        if (window.sessionStorage.getItem('SourceName') == this._commonService.commonTypeObj.member.personalTrainingType) {
          if (JSON.parse(window.sessionStorage.getItem("PTPlanObj")!)) {
            this._router.navigate(['/checkout'])
          }
          else {
            this.toastr.warning("Please Select at list PT Plan", "Error");
            return
          }
        }
        else {
          this._router.navigate(['/checkout'])
        }
      }
    }
  }

  GoToCheckOut() {
    if (window.sessionStorage.getItem("ClubNumber")!) {
      this._router.navigate(['/checkout'])
    }
  }

  SkipPTPlanSelection = () => {
    if (JSON.parse(window.sessionStorage.getItem("PTPlanObj")!)) {
      window.sessionStorage.removeItem("PTPlanObj");
    }

    if (window.sessionStorage.getItem('SourceName') == this._commonService.commonTypeObj.member.personalTrainingType) {

      if (window.sessionStorage.getItem("MemberObj")) {
        var memberObj = JSON.parse(window.sessionStorage.getItem("MemberObj")!);

        if (memberObj.memberType.toLowerCase() == 'premium+') {
          this.GoToCheckOut();
        }
        else {
          this.CheckMemberShipPlanType();
        }
      }
    }
    else {
      this.CheckMemberShipPlanType();
    }
    var GUID = window.sessionStorage.getItem('GUID');
    var URL = window.location.href;
    var PageName = window.location.pathname.split('/').pop();
    var PostData: any = {
      FieldValue: `Skip PTPlan:Skip`,
      ClubNumber: this.ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: this.skipbtn,
    }
    this._commonService.SaveWorkFlow(PostData);
  }

  ShowMessageMemberPreviousPTPlanAvailable(content: any) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  closeModalPopup() {
    this.modalService.dismissAll();
  }

}
