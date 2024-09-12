import { AfterViewChecked, Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonType } from '../../Types/commonTypes';
import { CommonService } from '../../services/common.service';
import { memberModel } from '../../models/memberModel';
import { initialObjModel } from '../../models/initialObjModel';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MemberPlanService } from '../../services/member-plan.service';
import { memberShipPlanModel } from '../../models/memberplan-model';
import { cloneDeep } from 'lodash';
import { ApiMethod, AuthEndPoints, constMessage, webConfig } from 'src/app/core/constant/const';
import { planTabOrderDetail } from '../../models/planTaborder-model';
import { HttpService } from 'src/app/core/services/http.service';

@Component({
  selector: 'app-member-plan',
  templateUrl: './member-plan.component.html',
  styleUrls: ['./member-plan.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MemberPlanComponent implements OnInit, AfterViewChecked {

  @ViewChild("upgradeModelContent") modalContent!: TemplateRef<any>;

  commonTypeObj: CommonType | undefined;
  commonService: CommonService;
  path: string;
  slideNo: string;
  BannerClass: string;
  memberObj: memberModel;
  IsPriceShow: any;
  AllPTPlansList: any[];
  initialObj: initialObjModel;
  InitialPlanList: memberShipPlanModel[];
  PlanTabOrderDetail: planTabOrderDetail[];
  MemberShipTabOrder: any;
  MemberShipPlan: any;
  TabOrder: any;
  membership: string;
  headertext: string;
  morebtn: string;
  isMoreButton: boolean;
  visibleMoreButton: boolean;
  hideShowPlanType: string | null;
  joinNowText: string;
  upgradeTypeName: string | null;
  PlanName: string;

  constructor(
    private _commonService: CommonService,
    private _router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _memberService: MemberPlanService,
    private _http: HttpService
  ) {
    this.initialObj = _commonService.initialObj;
    this.path = '';
    this.slideNo = '';
    this.BannerClass = '';
    this.commonService = _commonService;
    this.memberObj = JSON.parse(window.sessionStorage.getItem("MemberObj")!) ? JSON.parse(window.sessionStorage.getItem("MemberObj")!) : JSON.parse(window.sessionStorage.getItem("RegisterObj")!);
    this.AllPTPlansList = [];
    this.InitialPlanList = [];
    this.PlanTabOrderDetail = [];
    this._commonService.setServiceName(window.sessionStorage.getItem("ServiceName")!);
    this.membership = constMessage.member.membershipplan.membership;
    this.headertext = constMessage.member.membershipplan.headertext;
    this.morebtn = constMessage.member.membershipplan.morebtn;
    this.isMoreButton = false;
    this.visibleMoreButton = false;
    this.hideShowPlanType = '';
    this.joinNowText = '';
    this.upgradeTypeName = '';
    this.PlanName = '';
  }

  ngOnInit(): void {
    this._commonService.ScreenUrl();
    if (window.sessionStorage.getItem('SourceName') != this._commonService.commonTypeObj.member.upgradeMemberShipType) {
      this.joinNowText = "JOIN NOW";
    }
    else {
      this.joinNowText = "UPGRADE";
    }
    this.getMemberShipPlans();
    this._commonService.changeIsHeader();
    this._commonService.changeIsFooter();
    var bannerSlide = this._commonService.setDynamicImage();
    this.slideNo = bannerSlide.slideNo;
    this.BannerClass = bannerSlide.bannerClass;
    this._commonService.setSlideNo(this.slideNo);
    this._commonService.setBanner(this.BannerClass);
    this._commonService.setBodyHeightSize();
  }

  getMemberShipPlans() {

    if (window.sessionStorage.getItem("ClubNumber") && window.sessionStorage.getItem("ClubName")) {
      this._memberService.getMemberSignUpPlans(window.sessionStorage.getItem("ClubNumber"))?.subscribe({
        next: (response: any) => {
          if (response.data) {
            if (window.sessionStorage.getItem('SourceName') != this._commonService.commonTypeObj.member.upgradeMemberShipType) {
              this.visibleMoreButton = webConfig.visibleMoreForSpecificClubs.includes(window.sessionStorage.getItem("ClubNumber")!) ? true : false;
              this.InitialPlanList = response.data.initialPlanList.length > 0 ? cloneDeep(response.data.initialPlanList) : [];
              this.PlanTabOrderDetail = response.data.planOrderTab.length > 0 ? cloneDeep(response.data.planOrderTab) : [];
              this._commonService.setBodyHeightSize();
              this.MemberShipTabOrder = this.PlanTabOrderDetail[0].tabOrder;
              this.MemberShipPlan = _.filter(this.InitialPlanList, { tabOrder: this.MemberShipTabOrder });
              this.TabOrder = this.MemberShipPlan[0].tabOrder;
              if (this.MemberShipPlan) {
                if (this.MemberShipPlan[0].originalPlanTypeName == "FULL" || this.MemberShipPlan[0].originalPlanTypeName == "MONTHLY") {
                  var MemberShipPlan = this.MemberShipPlan.filter((x: any) => x.membershipType == "BASIC");

                  var IfPremiumOrPremiumPlus = this.MemberShipPlan.filter((x: any) => x.membershipType == "PREMIUM" || x.membershipType == "PREMIUM+");

                  if (MemberShipPlan.length > 0 && IfPremiumOrPremiumPlus.length > 0) {
                    this.isMoreButton = true;
                  }
                  else {
                    this.isMoreButton = false;
                  }
                }
                else {
                  this.isMoreButton = false;
                }
              }

              _.forEach(this.MemberShipPlan, function (o, key) {
                if (o.planName.includes('Biweekly') || o.planName.includes('BW')) {
                  o.FlagBiweekly = true;
                }
                else {
                  o.FlagBiweekly = false;
                }
              });

              if (this.visibleMoreButton && this.isMoreButton) {
                _.forEach(this.MemberShipPlan, (O: any) => {
                  if (O.originalPlanTypeName == "FULL" || O.originalPlanTypeName == "MONTHLY") {
                    O.IsShowBasic = false;
                    this.MemberShipPlan = this.MemberShipPlan.filter((x: any) => x.membershipType != "BASIC");
                  }
                  else {
                    O.IsShowBasic = true
                  }
                });
              }
            }
            else {
              this.InitialPlanList = response.data.initialPlanList.length > 0 ? cloneDeep(response.data.initialPlanList) : [];
              this.PlanTabOrderDetail = response.data.planOrderTab.length > 0 ? cloneDeep(response.data.planOrderTab) : [];
              this._commonService.setBodyHeightSize();
              this.MemberShipTabOrder = this.PlanTabOrderDetail[0].tabOrder;
              this.MemberShipPlan = _.filter(this.InitialPlanList, { tabOrder: this.MemberShipTabOrder });
              this.TabOrder = this.MemberShipPlan[0].tabOrder;

              _.forEach(this.MemberShipPlan, function (o, key) {
                if (o.planName.includes('Biweekly') || o.planName.includes('BW')) {
                  o.FlagBiweekly = true;
                }
                else {
                  o.FlagBiweekly = false;
                }
              });

              if (window.sessionStorage.getItem("MemberObj")) {
                var memberObj = JSON.parse(window.sessionStorage.getItem("MemberObj")!);

                var FilteredPlans: memberShipPlanModel[] = [];
                if (memberObj.memberType.toLowerCase() == 'basic') {
                  FilteredPlans = this.MemberShipPlan.filter((x: any) => x.membershipType == "PREMIUM" || x.membershipType == "PREMIUM+");
                }
                else if (memberObj.memberType.toLowerCase() == 'premium') {
                  FilteredPlans = this.MemberShipPlan.filter((x: any) => x.membershipType == "PREMIUM+");
                }
                else {
                  FilteredPlans = this.MemberShipPlan;
                }
                this.MemberShipPlan = FilteredPlans;
              }

            }

          }
        },
        error: (error) => {
          this.toastr.error(error.error.StackTrace, constMessage.error);
        }
      });
    }
  }

  hideShowMorebtn(type: any) {
    this.hideShowPlanType = !type ? "Prv" : type == "Next" ? "Prv" : type == "Prv" ? "Next" : null;
    if (this.hideShowPlanType != "Next") {
      this.MemberShipPlan = _.filter(this.InitialPlanList, { tabOrder: this.TabOrder });

      _.forEach(this.MemberShipPlan, function (o, key) {
        if (o.planName.includes('Biweekly') || o.planName.includes('BW')) {
          o.FlagBiweekly = true;
        }
        else {
          o.FlagBiweekly = false;
        }
      });

      if (this.visibleMoreButton) {
        _.forEach(this.MemberShipPlan, (O: any) => {
          if (O.originalPlanTypeName == "FULL" || O.originalPlanTypeName == "MONTHLY") {
            O.isShowBasic = false;
            this.MemberShipPlan = this.MemberShipPlan.filter((x: any) => x.membershipType == "BASIC");
          }
          else {
            O.isShowBasic = true
          }
        });
      }
    }
    else {
      this.MemberShipPlan = _.filter(this.InitialPlanList, { tabOrder: this.TabOrder });

      _.forEach(this.MemberShipPlan, function (o, key) {
        if (o.planName.includes('Biweekly') || o.planName.includes('BW')) {
          o.FlagBiweekly = true;
        }
        else {
          o.FlagBiweekly = false;
        }
      });

      if (this.visibleMoreButton) {
        _.forEach(this.MemberShipPlan, (O: any) => {
          if (O.originalPlanTypeName == "FULL" || O.originalPlanTypeName == "MONTHLY") {
            O.isShowBasic = false;
            this.MemberShipPlan = this.MemberShipPlan.filter((x: any) => x.membershipType != "BASIC");
          }
          else {
            O.isShowBasic = true;
          }
        });
      }
    }
    this._commonService.setBodyHeightSize();
    this._commonService.setEqualPTPlanDivSize();
  }

  setEqualPlanBenefitDivSize() {
    var maxHeight: number = 0;
    if (document.getElementById('plan-benefit-section')) {
      maxHeight = document.getElementById('plan-benefit-section')!.offsetHeight;
    }

    var elements = document.querySelectorAll('#plan-benefit-section') as NodeListOf<HTMLElement>;
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].offsetHeight > maxHeight) {
        maxHeight = elements[i].offsetHeight;
      }
    }

    elements.forEach((element) => {
      element.style.height = maxHeight + "px";
    });
  }

  redirecToPTPlan = (MemberPlanObj: any) => {
    window.sessionStorage.removeItem("PlanObj");
    window.sessionStorage.setItem("PlanObj", JSON.stringify(MemberPlanObj));
    var SourceName = window.sessionStorage.getItem('SourceName');
    var GUID = window.sessionStorage.getItem('GUID');
    var ClubNumber = window.sessionStorage.getItem("ClubNumber");
    var URL = window.location.href;
    var PageName = window.location.pathname.split('/').pop();
    var PostData: any = {
      FieldValue: `Member Plan:${MemberPlanObj?.planName} ,Plan ID:${MemberPlanObj?.planId},Tab Name:${MemberPlanObj?.tabName}`,
      ClubNumber: ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: this.joinNowText
    }
    this._commonService.SaveWorkFlow(PostData);

    if (SourceName == this._commonService.commonTypeObj.member.upgradeMemberShipType) {
      this.upgradeMembershipPlan(MemberPlanObj);
    }
    else {
      this._router.navigateByUrl('ptplans');
    }
  }

  // redirecToPT(){
  //   this._router.navigateByUrl('ptplans');
  // }

  getMemberPlanType(tabOrder: any, originalPlanTypeName: any) {
    this.MemberShipPlan = _.filter(this.InitialPlanList, { tabOrder: tabOrder });

    if (window.sessionStorage.getItem('SourceName') != this._commonService.commonTypeObj.member.upgradeMemberShipType) {

      if (originalPlanTypeName) {
        if (originalPlanTypeName == "FULL" || originalPlanTypeName == "MONTHLY") {

          var MemberShipPlan = this.MemberShipPlan.filter((x: any) => x.membershipType == "BASIC");
          var IfPremiumOrPremiumPlus = this.MemberShipPlan.filter((x: any) => x.membershipType == "PREMIUM" || x.membershipType == "PREMIUM+");

          if (MemberShipPlan.length > 0 && IfPremiumOrPremiumPlus.length > 0) {
            this.isMoreButton = true;
          }
          else {
            this.isMoreButton = false;
          }
        }
        else {
          this.isMoreButton = false;
        }
      }

      this.TabOrder = tabOrder;
      this.MemberShipPlan = _.filter(this.InitialPlanList, { tabOrder: tabOrder });
      _.forEach(this.MemberShipPlan, function (o, key) {
        if (o.planName.includes('Biweekly') || o.planName.includes('BW')) {
          o.FlagBiweekly = true;
        }
        else {
          o.FlagBiweekly = false;
        }
      });
      if (this.visibleMoreButton && this.isMoreButton) {
        _.forEach(this.MemberShipPlan, (O: any) => {
          if (O.originalPlanTypeName == "FULL" || O.originalPlanTypeName == "MONTHLY") {
            O.IsShowBasic = false;
            this.MemberShipPlan = this.MemberShipPlan.filter((x: any) => x.membershipType != "BASIC");
          }
          else {
            O.isShowBasic = true
          }
        });
      }
    }
    else {
      if (window.sessionStorage.getItem("MemberObj")) {
        var memberObj = JSON.parse(window.sessionStorage.getItem("MemberObj")!);
        _.forEach(this.MemberShipPlan, function (o, key) {
          if (o.planName.includes('Biweekly') || o.planName.includes('BW')) {
            o.FlagBiweekly = true;
          }
          else {
            o.FlagBiweekly = false;
          }
        });

        var FilteredPlans: memberShipPlanModel[] = [];
        if (memberObj.memberType.toLowerCase() == 'basic') {
          FilteredPlans = this.MemberShipPlan.filter((x: any) => x.membershipType == "PREMIUM" || x.membershipType == "PREMIUM+");
        }
        else if (memberObj.memberType.toLowerCase() == 'premium') {
          FilteredPlans = this.MemberShipPlan.filter((x: any) => x.membershipType == "PREMIUM+");
        }
        else {
          FilteredPlans = this.MemberShipPlan;
        }
        this.MemberShipPlan = FilteredPlans;
      }
    }
    this.hideShowPlanType = null;
    this._commonService.setBodyHeightSize();
    this._commonService.setEqualPTPlanDivSize();
  }

  ngAfterViewChecked(): void {
    this.setEqualPlanBenefitDivSize();
  }

  //region      === Upgrade Membership

  upgradeMembershipPlan(selectedPlan: any) {
    var agreementType = webConfig.upgradeYearlyPlan;
    var yearlyPlan = agreementType.split(',');

    _.filter(yearlyPlan, (o: any, key: any) => {
      this.upgradeTypeName = selectedPlan.planName.toLowerCase().includes(o) ? "YearlyMemberPlan" : null;
    });

    var pname = selectedPlan.planName.substr(0, 9);
    if (pname == "Premium +") {
      pname = "Premium +";
    } else {
      pname = "Premium"
    }
    this.OpenUpgradeModel(pname);
  }

  upgradeMembership(planname: string) {
    if (planname == "Premium +") {
      planname = "PREMIUMPLUS";
    } else {
      planname = "PREMIUM";
    }

    if (window.sessionStorage.getItem("MemberObj")) {
      var memberObj = JSON.parse(window.sessionStorage.getItem("MemberObj")!);
      var postData = {
        PlanName: planname,
        MemberId: memberObj.memberId,
        Type: this.upgradeTypeName,
        SourceName: window.sessionStorage.getItem("SourceName")
      };
      this._http.requestCall(AuthEndPoints.UPGRADE_MEMBERSHIP, ApiMethod.POST, postData)?.subscribe({
        next: (response: any) => {
          if (response.data > 0) {
            this.closeUpgradeModal();
            this._router.navigate(['member/thankyou']);
          }
          else {
            this.toastr.error(constMessage.networkError, constMessage.error);
            this.closeUpgradeModal();
          }
        }
      })
      var GUID = window.sessionStorage.getItem('GUID');
      var ClubNumber = window.sessionStorage.getItem("ClubNumber");
      var URL = window.location.href;
      var PageName = window.location.pathname.split('/').pop();
      var PostData: any = {
        FieldValue: `Upgrade Type:Yes Button Click`,
        ClubNumber: ClubNumber,
        SessionId: GUID,
        PageName: PageName,
        PageUrl: URL,
        ActionType: "Yes"
      }
      this._commonService.SaveWorkFlow(PostData);
    }
  }


  OpenUpgradeModel(pname: string) {
    this.modalService.open(this.modalContent, { centered: true })
    this.PlanName = pname;
  }

  closeUpgradeModal() {
    this.modalService.dismissAll();
  }
  cancelUpgradeModal() {
    var GUID = window.sessionStorage.getItem('GUID');
    var ClubNumber = window.sessionStorage.getItem("ClubNumber");
    var URL = window.location.href;
    var PageName = window.location.pathname.split('/').pop();
    var PostData: any = {
      FieldValue: `Upgrade Type:No Button Click`,
      ClubNumber: ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: "No"
    }
    this._commonService.SaveWorkFlow(PostData);
    this.modalService.dismissAll();
  }
  //endregion  === Upgrade Membership
}
