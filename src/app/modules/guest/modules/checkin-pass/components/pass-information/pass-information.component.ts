import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { post } from 'jquery';
import * as _ from 'lodash';
import { duration } from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ApiMethod, AuthEndPoints, constMessage } from 'src/app/core/constant/const';
import { HttpService } from 'src/app/core/services/http.service';
import { CheckActiveMemberEmailComponent } from 'src/app/shared/modal/check-active-member-email/check-active-member-email.component';
import { CheckExistingEmailComponent } from 'src/app/shared/modal/check-existing-email/check-existing-email.component';
import { PersonalInformationFormModel } from 'src/app/shared/models/checkoutInfo.model';
import { personalInfoModel } from 'src/app/shared/models/guestInitialInfoModel';
import { registerModel } from 'src/app/shared/models/registerModel';
import { LeadModel } from 'src/app/shared/models/searchModel';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-pass-information',
  templateUrl: './pass-information.component.html',
  styleUrls: ['./pass-information.component.css']
})
export class PassInformationComponent {
  path: string;
  slideNo: string;
  BannerClass: string;
  activeIndex: number;
  commonService: CommonService;
  genderList: string[];
  continue: string;
  submitted: boolean;
  checkInForm!: FormGroup<personalInfoModel>;
  checkInObj: any = {};
  before12year: Date;
  welcomeText: string | undefined;
  subHeading: string | undefined;
  genderObj = {
    id: '',
    name: ''
  }
  profileinfo: string;
  RegObj: any;
  passDurationDays: string;
  isMemberGuestView: boolean;
  Reg: LeadModel;
  today: any;
  constructor(
    private _commonService: CommonService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private _httpService: HttpService,
    private router: Router
  ) {
    this.passDurationDays = "";
    this.isMemberGuestView = false;
    this.continue = constMessage.continue;
    this.path = '';
    this.slideNo = '';
    this.BannerClass = '';
    this.commonService = _commonService;
    this.genderList = ["Male", "Female"];
    this.RegObj = JSON.parse(window.sessionStorage.getItem("RegisterObj") || "{}");
    this.Reg = JSON.parse(window.sessionStorage.getItem("RegisterObj") || "{}");
    this.activeIndex = 0;
    this.submitted = false;
    this.before12year = new Date();
    this.before12year.setFullYear(this.before12year.getFullYear() - 12);
    this._commonService.setServiceName(window.sessionStorage.getItem("ServiceName")!);
    this._commonService.invokeNewUserComponentFunction.subscribe((value: boolean) => {
      this.continueToRedirectSignature(value);
    });
    this.today = new Date();
    this.checkInForm = new FormGroup<personalInfoModel>({
      firstName: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.pattern(this._commonService.nameValidPattern)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.pattern(this._commonService.nameValidPattern)]),
      email: new FormControl('', [Validators.required, Validators.pattern(this._commonService.emailPattern)]),
      phoneNumber: new FormControl('', [Validators.required]),
      dob: new FormControl(this.checkInObj.DOB ? new Date(this.checkInObj.DOB) : '', [Validators.required]),
      gender: new FormControl(this.checkInObj.gender ? this.checkInObj.gender : '', [Validators.required]),
      isKeepMeUpdate: new FormControl(false),
      memberId: new FormControl(),
      clubNumber: new FormControl(),
      isGuestModule: new FormControl(false)
    });
    if (window.sessionStorage.getItem("SourceName") == this._commonService.commonTypeObj.guest.checkInObj.paidPassType) {
      this.welcomeText = constMessage.checkIn.paidPass.headingText;
      this.subHeading = constMessage.checkIn.paidPass.subheadingText;
    }
    else if (window.sessionStorage.getItem("SourceName") == this._commonService.commonTypeObj.guest.joinType) {
      this.welcomeText = constMessage.checkIn.paidPass.subheadingText;
    }
    else if (window.sessionStorage.getItem("SourceName") == this._commonService.commonTypeObj.guest.checkInObj.appointmentTourType) {
      this.welcomeText = constMessage.checkIn.paidPass.headingText;
      this.subHeading = constMessage.checkIn.paidPass.subheadingText;
    }
    else if (window.sessionStorage.getItem("SourceName") == this._commonService.commonTypeObj.guest.checkInObj.memberGuestType) {
      this.welcomeText = constMessage.checkIn.memberGuest.headingText;
      this.subHeading = constMessage.checkIn.memberGuest.subheadingText;
      this.isMemberGuestView = true;
      window.sessionStorage.setItem("isMemberGuestView", JSON.stringify(this.isMemberGuestView));
    }
    else {
      this.welcomeText = constMessage.checkIn.subHeading;
      // this.subHeading = constMessage.checkIn.subHeading;
    }
    this.profileinfo = constMessage.newUser.profileinfo;

  }
  get form() { return this.checkInForm.controls; }

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

    var date = this.RegObj.dob != null ? this.RegObj.dob : this.RegObj.DOB;
    if (date) {
      this.RegObj.dob = this._commonService.getStringDate(date)
    }
    this.checkInForm.patchValue(this.RegObj);
  }

  // get form() { return this.initialInfoForm.controls; }
  activeSelectedGenderOption(data: string, index: number) {
    this.checkInObj.gender = data;
    this.checkInForm.get('gender')?.setValue(data);
    this.activeIndex = index;
  }

  confirmPassInfo(data: FormGroup<personalInfoModel>, passModel: any) {
    this.submitted = true;
    if (this.checkInForm.invalid) {
      return;
    }
    var postdata = data.value;

    var date = new Date(postdata.dob!);

     const today = new Date();
      const birthDate = new Date(date);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      var age1 = age;

    // if ((age1 < 18)) {
    //   this.toastr.warning("Please Don't select Date of Birth under 18 years.", "Required");
    //   return
    // }

    var ClubNumber = window.sessionStorage.getItem("ClubNumber");
    var GUID = window.sessionStorage.getItem('GUID');
    var URL = window.location.href;
    var PageName = window.location.pathname.split('/').pop();
    var dob = this._commonService.getStringDate(postdata.dob);
    var PostData: any = {
      FieldValue: `Profile Information:Profile Data ,FirstName:${postdata?.firstName} ,LastName:${postdata?.lastName} ,Email:${postdata.email}
                  ,PhoneNumber:${postdata?.phoneNumber} ,Date Of Birth:${dob} ,Gender:${postdata?.gender}`,
      ClubNumber: ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: this.continue,
    }
    this._commonService.SaveWorkFlow(PostData);

    var obj = {
      FirstName: postdata.firstName,
      LastName: postdata.lastName,
      Email: postdata.email,
      PhoneNumber: postdata.phoneNumber,
      DOB: this._commonService.getStringDate(postdata.dob),
      Gender: postdata.gender,
      IsGuestModule: true,
      HSId: this.RegObj.hsId
    }

    this._httpService.requestCall(AuthEndPoints.UPSERT_CONTACT_INFORMATION, ApiMethod.POST, obj)?.subscribe({
      next: (response: any) => {
        if (!response.error) {
          var data = window.sessionStorage.getItem("MissingInformation");
          if (data == 'guest') {
            this.Reg.dob = this._commonService.getStringDate(postdata.dob);
            this.Reg.gender = postdata.gender;
            this.Reg.firstName = postdata.firstName;
            this.Reg.lastName = postdata.lastName;
            this.Reg.email = postdata.email;
            this.Reg.phoneNumber = postdata.phoneNumber;
            window.sessionStorage.setItem("RegisterObj", JSON.stringify(this.Reg));
            this.router.navigateByUrl('/guest');
          }
          else {
            this.Reg.dob = this._commonService.getStringDate(postdata.dob);
            this.Reg.gender = postdata.gender;
            this.Reg.firstName = postdata.firstName;
            this.Reg.lastName = postdata.lastName;
            this.Reg.email = postdata.email;
            this.Reg.phoneNumber = postdata.phoneNumber;
            window.sessionStorage.setItem("RegisterObj", JSON.stringify(this.Reg));
            this.router.navigate(['signature']);
          }
          // if (window.sessionStorage.getItem("SourceName") == this._commonService.commonTypeObj.guest.joinType) {
          //   this.Reg.dob = this._commonService.getStringDate(postdata.dob);
          //   this.Reg.gender = postdata.gender;
          //   this.Reg.firstName = postdata.firstName;
          //   this.Reg.lastName = postdata.lastName;
          //   this.Reg.email = postdata.email;
          //   this.Reg.phoneNumber = postdata.phoneNumber;
          //   window.sessionStorage.setItem("RegisterObj", JSON.stringify(this.Reg));
          //   this.router.navigateByUrl('plans');
          // } 
          // else {
          //   this.RegObj.firstName = postdata.firstName,
          //     this.RegObj.lastName = postdata.lastName,
          //     this.RegObj.email = postdata.email,
          //     this.RegObj.dob = postdata.dob,
          //     this.RegObj.phoneNumber = postdata.phoneNumber,
          //     this.RegObj.gender = postdata.gender,
          //     this.RegObj.fullName = postdata.firstName + ' ' + postdata.lastName
          //   window.sessionStorage.setItem("RegisterObj", JSON.stringify(this.RegObj));

          //   if (window.sessionStorage.getItem("SourceName") == this._commonService.commonTypeObj.guest.checkInObj.memberGuestType) {
          //     this.router.navigateByUrl('Search');
          //   }
          //   else {
          //     this.RegObj.passDurationDay = this.RegObj.passDurationDay != null ? this.RegObj.passDurationDay : "1";
          //     if (window.sessionStorage.getItem("SourceName") == this._commonService.commonTypeObj.guest.checkInObj.freePassType) {
          //       this.openPassModel(passModel, this.RegObj.passDurationDay);
          //     }
          //     else if (window.sessionStorage.getItem("SourceName") == this._commonService.commonTypeObj.guest.checkInObj.appointmentTourType) {
          //       this.openPassModel(passModel, this.RegObj.passDurationDay);
          //     }
          //     else {
          //       this.router.navigateByUrl('signature');
          //     }
          //   }
          // }
        }
        else {
          this.toastr.error(response.error);
        }
      }

    })

  }


  validateContactEmail(email: string | null | undefined) {
    var postData = {
      Email: email
    }
    if (this.RegObj.Email != email) {
      this._httpService.requestCall(AuthEndPoints.CHECKEMAIL_USER_BY_OTHER_CONTACT, ApiMethod.POST, postData)?.subscribe({
        next: (response: any) => {
          if (response) {
            if (response.data && response.data.isActive != null && response.data.total > 0) {
              if (!response.data.isActive) {
                var data = response.data.results[0].properties;
                this.RegObj = {
                  firstName: data.firstname,
                  lastName: data.lastname,
                  phoneNumber: this._commonService.removePhoneFormat(data.phone),
                  email: data.email,
                  hearAbout: data.HearAbout,
                  gender: data.gender,
                  hSId: data.hs_object_id,
                  referringHSId: data.referring_member_id,
                  memberId: data.abcid,
                  beginDate: data.guest_pass_activation_date ? data.guest_pass_activation_date : null,
                  expiredDate: data.guest_pass_expiration_date ? data.guest_pass_expiration_date : null,
                  addressLine1: data.address,
                  DOB: data.birthdate == null ? data.birthdate : new Date(data.birthdate),
                  entrySource: data.campaign_details,
                };
                this.OpenModelForCheckEmail(response.data.results[0].properties);
              }
              else if (response.data.isActive) {
                this.openModalForExistingEmail(this.RegObj.Email);

                if (this.RegObj == null) {
                  this.RegObj.email = "";
                }
                else {
                  this.RegObj.email = this.RegObj.email;
                }
              }
            }
          }
        }
      })
    }
  }

  openModalForExistingEmail(email: string) {
    const modalRef = this.modalService.open(CheckActiveMemberEmailComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.emailObj = email;
  }


  OpenModelForCheckEmail(data: any) {
    const modalRef = this.modalService.open(CheckExistingEmailComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.checkEmailModelLeadObj = data;
    modalRef.componentInstance.yesThisIsMeText = "Yes this is me";
  }

  openPassModel(modal: any, passdays: string) {
    this.modalService.open(modal, { centered: true, size: 'md' });
    this.passDurationDays = passdays;
  }

  closeModalPopup() {
    this.modalService.dismissAll();
  }

  continueToRedirectSignature(flag: boolean) {
    if (flag == true) {
      window.sessionStorage.setItem("RegisterObj", JSON.stringify(this.RegObj));
    }
    else {
      this.emptyRegister_InitialObjForInitial();
    }
    this.checkInForm.patchValue(this.RegObj);
    this.closeModalPopup();
  }

  redirectToSignatureModule() {
    this.closeModalPopup();
    this.router.navigate(['signature']);
  }

  emptyRegister_InitialObjForInitial = () => {
    this.RegObj = {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      hearAbout: '',
      gender: '',
      salesPersonObj: null,
      referringHSId: null,
      memberId: null,
      addressLine1: null,
      addressLine2: null,
      city: null,
      state: null,
      DOB: null,
      zipCode: null,
      hSId: ''
    };
  }
}