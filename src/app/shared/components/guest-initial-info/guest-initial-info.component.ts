import { Component } from '@angular/core';
import { CommonType } from '../../Types/commonTypes';
import { CommonService } from '../../services/common.service';
import { salesPersonModel } from '../../models/salesPersonModel';
import { clubDetailsModel } from '../../models/clubDetailsModel';
import { NewUserService } from '../../services/new-user.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { guestInitialInfoModel } from '../../models/guestInitialInfoModel';
import { registerInitialModel, registerModel } from '../../models/registerModel';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SalesPersonMissingModalPopupComponent } from '../../modal/sales-person-missing-modal-popup/sales-person-missing-modal-popup.component';
import { HttpService } from 'src/app/core/services/http.service';
import { Router } from '@angular/router';
import { ApiMethod, AuthEndPoints, constMessage } from 'src/app/core/constant/const';

@Component({
  selector: 'app-guest-initial-info',
  templateUrl: './guest-initial-info.component.html',
  styleUrls: ['./guest-initial-info.component.css']
})
export class GuestInitialInfoComponent {
  commonTypeObj: CommonType | undefined;
  commonService: CommonService;
  path: string;
  slideNo: string;
  BannerClass: string;
  salesPersonList: [];
  initialInfoForm!: FormGroup;
  genderList: string[];
  activeIndex: number;
  regObj: registerInitialModel;
  submitted: boolean;
  salesPersonObj: salesPersonModel;
  headerText: string;
  hitext : string;
  generalInfo : string;
  profileInfo : string;
  teamMemberLabel : string;
  paymentInfo: string;
  paymentDetails : string;
  paymentbtn : string;
  genderObj = {
    id: '',
    name: ''
  }
  today : any;
  constructor(
    private _commonService: CommonService,
    private _newUserService: NewUserService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private _httpService: HttpService,
    private router: Router
  ) {
    this.generalInfo = constMessage.guestInitialInfo.generalInfo;
    this.headerText = constMessage.guestInitialInfo.headerText;
    this.hitext = constMessage.member.hitext;
    this.profileInfo = constMessage.guestInitialInfo.profileInfo;
    this.teamMemberLabel = constMessage.guestInitialInfo.teamMemberLabel;
    this.paymentInfo  = constMessage.guestInitialInfo.paymentInfo;
    this.paymentDetails = constMessage.guestInitialInfo.paymentDetails;
    this.paymentbtn = constMessage.guestInitialInfo.paymentbtn;
    this.path = '';
    this.slideNo = '';
    this.BannerClass = '';
    this.commonService = _commonService;
    this.salesPersonList = [];
    this.genderList = ["Male", "Female"];
    this.activeIndex = 0;
    this.regObj = JSON.parse(window.sessionStorage.getItem("MemberObj") || "{}");
    this.submitted = false;
    this.initialInfoForm = new FormGroup({
      firstName: new FormControl(),
      lastName: new FormControl(),
      email: new FormControl(),
      phoneNumber: new FormControl(),
      dob: new FormControl(),
      gender: new FormControl(),
      searchFilter: new FormControl(),
      salesPersonObj: new FormControl()
    })
    this.today = new Date();

    this.salesPersonObj = {
      fullName: "",
      clubNumber: 0,
      clubName: '',
      mode: '',
      moduleName: '',
      sourceName: '',
      childSourceName: '',
      barCode: '',
      empBranchCode: '',
      employeeEmail: '',
      employeeId: 0,
      employeePhone: '',
      employeeStatus: '',
      epFullName: '',
      firstName: '',
      lastName: '',
      paychexId: '',
      SPClubNumber: '',
      SPEmployeeId: 0,
      salesPersonMissing: 0
    }
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

    var bannerSectionList = document.querySelectorAll('.banner-section') as NodeListOf<HTMLElement>;
    bannerSectionList[0].style.backgroundColor = '#4c4c4c';
    this.getGuestInitialInfoPageDetail();
  }
  get form() { return this.initialInfoForm.controls; }

  getGuestInitialInfoPageDetail() {
    if (window.sessionStorage.getItem("ClubNumber") && window.sessionStorage.getItem("ClubName")) {
      if (window.sessionStorage.getItem('SourceName') === this._commonService.commonTypeObj.member.personalTrainingType) {
        this.regObj = JSON.parse(window.sessionStorage.getItem("MemberObj")!);
        this.regObj.dob = this.regObj.dob ? new Date(this.regObj.dob) : null;
      }
      else {
        if (window.sessionStorage.getItem("RegisterObj")) {
          this.regObj.dob = this.regObj.dob ? new Date(this.regObj.dob) : null;
        }
      }
      this.initialInfoForm.patchValue(this.regObj);
      this.getSalesPersonList();
    }
    else {
      this._commonService.missingClubInformationIssue();
    }
  }

  getSalesPersonList() {
    var postData: clubDetailsModel = {
      clubNumber: JSON.parse(sessionStorage.getItem('ClubNumber') || '{}'),
      clubName: '',
      mode: ''
    }
    this._newUserService.GetSalesPersonList(postData).subscribe({
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

  activeSelectedGenderOption(data: string, index: number) {
    this.regObj.gender = data;
    this.initialInfoForm.get('gender')?.setValue(data);
    this.activeIndex = index;
  }

  activeSelectedOption(data: salesPersonModel, index: number) {
    this.regObj.salesPersonObj = data;
    this.initialInfoForm.get('salesPersonObj')?.setValue(data);
    this.activeIndex = index;
  }

  openMissingSalesPersonModal(data: any) {
    if (data.salesPersonMissing == 1) {
      const modalRef = this.modalService.open(SalesPersonMissingModalPopupComponent, { centered: true });
    }
  }

  redirectToCheckout() {
    var RegObj = this.regObj;
    var PhonePattern = /^((?!(0))[0-9]{10})$/;
    var Phone10DigitPattern = /^\d{10}$/;
    var NameValidPattern = /^[A-Za-z]{1}[0-9A-Za-z \-']*$/;

    var d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    var Before18YRDate = d;

    if (RegObj.firstName == undefined) {
      this.toastr.warning("First name should allow only alphanumeric characters, apostrophes('), hyphens(-), or spaces and must begin with an alpha character.", "Required");
      return;
    }
    else if (RegObj.firstName == "" || RegObj.firstName == null) {
      this.toastr.warning("Please enter first name.", "Required");
      return;
    }
    else if (!NameValidPattern.test(RegObj.firstName)) {
      this.toastr.warning("First name should allow only alphanumeric characters, apostrophes('), hyphens(-), or spaces and must begin with an alpha character.", "Required");
      return;
    }
    else if (RegObj.firstName && RegObj.firstName.length > 15) {
      this.toastr.warning("First name will not be greater than 15 characters.", "Required");
      return;
    }
    else if (RegObj.lastName == undefined) {
      this.toastr.warning("Last name should allow only alphanumeric characters, apostrophes('), hyphens(-), or spaces and must begin with an alpha character.", "Required");
      return;
    }
    else if (RegObj.lastName == "" || RegObj.lastName == null) {
      this.toastr.warning("Please enter last name.", "Required");
      return;
    }
    else if (!NameValidPattern.test(RegObj.lastName)) {
      this.toastr.warning("Last name should allow only alphanumeric characters, apostrophes('), hyphens(-), or spaces and must begin with an alpha character.", "Required");
      return;
    }
    else if (RegObj.lastName && RegObj.lastName.length > 15) {
      this.toastr.warning("Last name will not be greater than 15 characters.", "Required");
      return;
    }
    else if (!RegObj.email) {
      this.toastr.warning("Please enter valid email.", "Required");
      return;
    }
    else if (RegObj.phoneNumber == undefined || RegObj.phoneNumber == '' || !Phone10DigitPattern.test(RegObj.phoneNumber)) {
      this.toastr.warning("Please enter 10 digits for your phone number (i.e. 9876543210).", "Required");
      return;
    }
    else if (!PhonePattern.test(RegObj.phoneNumber)) {
      this.toastr.warning("Please enter correct phone number.", "Required");
      return;
    }
    else if (!RegObj.gender) {
      this.toastr.warning("Please select gender.", "Required");
      return;
    }
    else {
      this._httpService.requestCall(AuthEndPoints.VALIDATE_EMAIL, ApiMethod.GET, this.regObj.email)?.subscribe({
        next: (response: any) => {
          if (response) {
            this.regObj.dob = this._commonService.getStringDate(this.initialInfoForm.get("dob")?.value)
            response.data.email = this.regObj.email;
            window.sessionStorage.setItem("EmailResponse", JSON.stringify(response.data));

            this._httpService.requestCall(AuthEndPoints.UPSERT_CONTACT_INFORMATION, ApiMethod.POST, RegObj)?.subscribe({
              next: (response: any) => {
                if (response) {
                  window.sessionStorage.setItem("MemberObj", JSON.stringify(RegObj));
                  this.router.navigateByUrl('/checkout')
                }
              }
            })
          }
        }
      })
    }
    var ClubNumber = window.sessionStorage.getItem("ClubNumber");
    var GUID = window.sessionStorage.getItem('GUID');
    var URL = window.location.href;
    var PageName = window.location.pathname.split('/').pop();
    var PostData: any = {
      FieldValue: `GuestInitialInfo:${this.profileInfo}${RegObj.salesPersonObj?.fullName ? ' , Helping Member:' + RegObj.salesPersonObj?.fullName : ''}`,
      ClubNumber: ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: this.paymentbtn
    }
    this._commonService.SaveWorkFlow(PostData);
  }
}
