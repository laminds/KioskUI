import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiMethod, AuthEndPoints, constMessage } from 'src/app/core/constant/const';
import { HttpService } from 'src/app/core/services/http.service';
import { SalesPersonMissingModalPopupComponent } from 'src/app/shared/modal/sales-person-missing-modal-popup/sales-person-missing-modal-popup.component';
import { clubDetailsModel } from 'src/app/shared/models/clubDetailsModel';
import { memberModel } from 'src/app/shared/models/memberModel';
import { salesPersonModel } from 'src/app/shared/models/salesPersonModel';
import { babySittingObjModel, childCareCheckOutRequestModel, totSpotPlanModel } from 'src/app/shared/models/totSpotPlanModel';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  Path: string;
  SlideNo: string;
  BannerClass: string;
  commonService!: CommonService;
  ChildList: any[];
  memberObj: memberModel;
  totSpotObj: totSpotPlanModel;
  salesPersonList: salesPersonModel[];
  hitext: string;
  welcomeText: string;
  dollarSign: string;
  buyNowbtn: string;
  sessionText: string;
  planValueText: string;
  okbtn: string;
  activeIndex: number;
  genderList: string[];
  before18year: Date;
  babySittingInfoForm!: FormGroup<babySittingObjModel>;
  submitted: boolean;
  teamMemberText: string;
  today : any;
  constructor(private _commonService: CommonService,
    private _httpService: HttpService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal,) {
    this.Path = '';
    this.SlideNo = '';
    this.BannerClass = '';
    this.ChildList = [];
    this.commonService = _commonService;
    this.genderList = ["Male", "Female"];
    this._commonService.setServiceName(window.sessionStorage.getItem("ServiceName")!);
    this.memberObj = JSON.parse(window.sessionStorage.getItem("MemberObj") || "{}");
    this.totSpotObj = JSON.parse(window.sessionStorage.getItem("BabySittingPlan")!);
    this.hitext = constMessage.member.hitext;
    this.welcomeText = constMessage.amenities.babysittingObj.welcometext;
    this.dollarSign = constMessage.member.ptPlan.dollarSign;
    this.buyNowbtn = constMessage.member.ptPlan.buyNowbtn;
    this.sessionText = constMessage.member.ptPlan.sessionText;
    this.planValueText = constMessage.member.ptPlan.planValueText;
    this.okbtn = constMessage.member.okbtn;
    this.activeIndex = 0;
    this.before18year = new Date();
    this.before18year.setFullYear(this.before18year.getFullYear() - 18);
    this.submitted = false;
    this.teamMemberText = constMessage.amenities.babysittingObj.teamMember;
    this.salesPersonList = [];
    this.today = new Date();

    this.babySittingInfoForm = new FormGroup<babySittingObjModel>({
      firstName: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.pattern(this._commonService.nameValidPattern)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.pattern(this._commonService.nameValidPattern)]),
      phoneNumber: new FormControl('', [Validators.required]),
      dob: new FormControl(this.memberObj.dob ? new Date(this.memberObj.dob) : '', [Validators.required]),
      gender: new FormControl(this.memberObj.gender ? this.memberObj.gender : '', [Validators.required]),
      salesPersonId: new FormControl(null),
      salesPersonObj: new FormControl(),
      email: new FormControl('', [Validators.required, Validators.pattern(this._commonService.emailPattern)]),
      searchFilter: new FormControl('', { nonNullable: true })
    });
  }

  get form() { return this.babySittingInfoForm.controls; }

  ngOnInit(): void {
    this._commonService.ScreenUrl();
    this.babySittingInfoForm.patchValue(this.memberObj);
    this._commonService.changeIsHeader();
    this._commonService.changeIsFooter();
    var bannerSlide = this._commonService.setDynamicImage();
    this._commonService.setSlideNo(bannerSlide.slideNo);
    this._commonService.setBanner(bannerSlide.bannerClass);
    this._commonService.setEqualDivSize();
    this._commonService.setBodyHeightSize();
    this.getSalesPersonList();
  }

  selectBabySittingPlans(){
    var ClubNumber = window.sessionStorage.getItem("ClubNumber");
    var GUID = window.sessionStorage.getItem('GUID');
    var URL = window.location.href;
    var PageName = window.location.pathname.split('/').pop();
    var PostData: any = {
      FieldValue: `Choose Another Plan:Choose Another Babysitting Plan`,
      ClubNumber: ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: "Choose Another Plan",
    }
    this._commonService.SaveWorkFlow(PostData);
    window.sessionStorage.removeItem("BabySittingPlan");
    this.router.navigateByUrl('member/amenities/babysitting');
  }

  getSalesPersonList() {
    var postData: clubDetailsModel = {
      clubNumber: JSON.parse(sessionStorage.getItem('ClubNumber') || '{}'),
      clubName: '',
      mode: ''
    }
    this._httpService.requestCall(AuthEndPoints.GET_SALES_MEMBER_DETAIL, ApiMethod.POST, postData)?.subscribe({
      next: (response: any) => {
        if (response) {
          this.salesPersonList = response.data;
        }
        else {
          this.toastr.error(response.Message, constMessage.error);
        }
      }
    })
  }

  selectBabysittingPlans = () => {
    window.sessionStorage.removeItem("TotSpotPlan");
    this.router.navigateByUrl('TotSpotPlan');
  }

  activeSelectedGenderOption(data: string, index: number) {
    this.memberObj.gender = data;
    this.activeIndex = index;
  }

  oepnMissingSalesPersonModal(data: salesPersonModel) {
    if (data.salesPersonMissing == 1) {
      this.modalService.open(SalesPersonMissingModalPopupComponent, { centered: true });
    }
  }

  activeSelectedOption(data: salesPersonModel, index: number) {
    this.babySittingInfoForm.get('salesPersonObj')?.setValue(data);
    this.activeIndex = index;
  }

  childCareCheckOut(babysittingObj: FormGroup<babySittingObjModel>) {
    var TotSpotObj = this.totSpotObj;
    var MemberObj = this.memberObj;
    this.submitted = true;
    
    if (this.babySittingInfoForm.invalid) {
      return;
    }
    var obj: any = babysittingObj.value;
    var postdata: childCareCheckOutRequestModel = {
      firstName: obj.firstName,
      lastName: obj.lastName,
      email: obj.email,
      phoneNumber: obj.phoneNumber,
      dob: obj.dob,
      gender: obj.gender,
      memberId: MemberObj.memberId,
      planName: TotSpotObj.planName,
      planPrice: TotSpotObj.downPaymentTotalAmount,
      clubNumber: window.sessionStorage.getItem("ClubNumber"),
      memberType: MemberObj.memberType,
      sourceName: window.sessionStorage.getItem("SourceName"),
      guestType: "Child Care",
      salesPersonObj : obj.salesPersonObj != null ? obj.salesPersonObj : ""
    }
    this._httpService.requestCall(AuthEndPoints.CHILDCARE_PLAN_CHECKOUT, ApiMethod.POST, postdata)?.subscribe({
      next: (response: any) => {
        if (response.data == "1") {
          // this.toastr.success("Tots Spot Babysitting Plan Added Successfully", "Success");
          this.router.navigate(['member/thankyou'])
        }
        else {
          this.toastr.error("Oops something went wrong. Please try again.", "Error");
        }
      }
    });

    var ClubNumber = window.sessionStorage.getItem("ClubNumber");
    var GUID = window.sessionStorage.getItem('GUID');
    var URL = window.location.href;
    var PageName = window.location.pathname.split('/').pop();
    var PostData: any = {
      FieldValue: `Team Member:${obj?.salesPersonObj?.fullName} , Total Due:${TotSpotObj.downPaymentTotalAmount}`,
      ClubNumber: ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: "SECURE CHECKOUT"
    }
    this._commonService.SaveWorkFlow(PostData);
  }
}
