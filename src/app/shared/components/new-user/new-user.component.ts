import { Component, OnInit } from '@angular/core';
import { clubModel } from '../../models/clubModel';
import { CommonType } from '../../Types/commonTypes';
import { salesPersonModel } from '../../models/salesPersonModel';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/core/services/http.service';
import { ToastrService } from 'ngx-toastr';
import { responseModel } from '../../interface/responseModel';
import { ApiMethod, AuthEndPoints, constMessage } from 'src/app/core/constant/const';
import { clubDetailsModel } from '../../models/clubDetailsModel';
import { NewUserService } from '../../services/new-user.service';
import { registerModel } from '../../models/registerModel';
import * as _ from 'lodash';
import { CheckExistingEmailComponent } from '../../modal/check-existing-email/check-existing-email.component';
import { CheckActiveMemberEmailComponent } from '../../modal/check-active-member-email/check-active-member-email.component';
import { HomeService } from 'src/app/modules/home/services/home.service';


@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})

export class NewUserComponent implements OnInit {
  Path!: string;
  SlideNo!: string;
  BannerClass!: string;
  model: any;
  clubList!: clubModel[];
  salesPersonList: any = [];
  hearingaboutList: string[];
  genderList: string[];
  activeIndex: number;
  searchFilter!: string;
  RegObj: any = {};
  RegObjData: any = {};
  InitialObjData: any = {}
  PhonePattern = /^((?!(0))[0-9]{10})$/;
  Phone10DigitPattern = /^\d{10}$/;
  AlpabaticPattern = /^[a-zA-Z][a-zA-Z0-9]+$/;
  commonTypeObj: CommonType;
  newUserInfoForm!: FormGroup<registerModel>;
  submitted: boolean;
  before12year: Date;
  welcomeText: string;
  subHeading: string;
  profileinfo: string;
  teamMemberLabel: string;
  continuebtn: string;
  goalsLabel: string;
  initialobj: any;
  referredbyLabel: string;
  checkEmailModelLeadObj: any;
  yesThisIsMeText: string;
  emailObj: string;
  today : any;
  salesPersonObj: salesPersonModel = {
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

  hearingObj = {
    id: '',
    type: ''
  }

  genderObj = {
    id: '',
    name: ''
  }
  constructor(
    private _commonService: CommonService,
    private _newUserService: NewUserService,
    private _router: Router,
    private modalService: NgbModal,
    private _http: HttpService,
    private toastr: ToastrService,
    private _httpService: HttpService,
    private homeService: HomeService
  ) {
    this.welcomeText = constMessage.newUser.welcomeText;
    this.subHeading = constMessage.newUser.subHeading;
    this.profileinfo = constMessage.newUser.profileinfo;
    this.teamMemberLabel = constMessage.guestInitialInfo.teamMemberLabel;
    this.continuebtn = constMessage.newUser.continuebtn;
    this.goalsLabel = constMessage.newUser.goalsLabel;
    this.referredbyLabel = constMessage.newUser.referredbyLabel;
    this.activeIndex = 0;
    this.commonTypeObj = _commonService.commonTypeObj;
    this.before12year = new Date();
    this.before12year.setFullYear(this.before12year.getFullYear() - 12);
    this.hearingaboutList = ["goals", "interests"];
    this.genderList = ["Male", "Female"];
    this.RegObjData = JSON.parse(window.sessionStorage.getItem('RegisterObj') || '{}');
    this.InitialObjData = this._commonService.initialObj.clubNumber;
    this.emailObj = "";
    this.RegObj = {
      email: this.RegObjData.Email,
      salesPerson: '',
      hearAbout: '',
      goalInterests: ''
    },
    this.today = new Date();
    this.yesThisIsMeText = "",
      window.sessionStorage.setItem("ServiceName", "Main Menu");
    this._commonService.setServiceName(window.sessionStorage.getItem("ServiceName")!);
    this.newUserInfoForm = new FormGroup<registerModel>({
      firstName: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.pattern(this._commonService.nameValidPattern)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.pattern(this._commonService.nameValidPattern)]),
      phoneNumber: new FormControl('', [Validators.required]),
      DOB: new FormControl(this.RegObjData.DOB ? new Date(this.RegObjData.DOB) : '', [Validators.required]),
      gender: new FormControl(this.RegObjData.gender ? this.RegObjData.gender : '', [Validators.required]),
      // salesPersonId: new FormControl(null),
      // salesPersonObj: new FormControl(this.RegObjData.salesPersonObj != undefined ? this.RegObjData.salesPersonObj : null, [Validators.required]),
      // hearAbout: new FormControl(this.RegObjData.HearAbout ? this.RegObjData.HearAbout : '', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern(this._commonService.emailPattern)]),
      // goalInterests: new FormControl('', [Validators.required]),
      // searchFilter: new FormControl('', { nonNullable: true })
    });

    this.initialobj = {
      email: window.sessionStorage.getItem("Email"),
      phoneNumber: window.sessionStorage.getItem("PhoneNumber")
    }
    this.submitted = false;
    this._commonService.invokeNewUserComponentFunction.subscribe((value: boolean) => {
      this.continueToRedirectSignature(value);
    });
  }

  ngOnInit(): void {
    this._commonService.ScreenUrl();
    this._commonService.changeIsHeader();
    this._commonService.changeIsFooter();
    var bannerSlide = this._commonService.setDynamicImage();
    this.SlideNo = bannerSlide.slideNo;
    this.BannerClass = bannerSlide.bannerClass;
    this._commonService.setSlideNo(this.SlideNo);
    this._commonService.setBanner(this.BannerClass);
    this._commonService.setBodyHeightSize();
    this.getClubList();
    this.getSalesPersonList();
    var email = window.sessionStorage.getItem("Email");
    if (email) {
      this.newUserInfoForm.get('email')?.setValue(email);
      this.validateContactEmail(this.newUserInfoForm);
    }

    if (window.sessionStorage.getItem('SourceName') != this._commonService.commonTypeObj.member.guestCheckInType) {
      this.newUserInfoForm.patchValue(this.initialobj);
    }
  }
  get form() { return this.newUserInfoForm.controls; }

  getClubList() {
    this.homeService.GetClubList().subscribe({
      next: (response: responseModel<clubModel[]>) => {  
        if (response) {
          this.clubList = response.data;
        }
        else {
          this.toastr.error(response, constMessage.error);
        }
      },
      error: (error: { error: { StackTrace: string | undefined; }; }) => {
        this.toastr.error(error.error.StackTrace, constMessage.error);
      },
    });
  }

  getSalesPersonList() {
    var postData: clubDetailsModel = {
      clubNumber: JSON.parse(sessionStorage.getItem('ClubNumber') || '{}'),
      clubName: '',
      mode: ''
    }
    this._newUserService.GetSalesPersonList(postData).subscribe({
      next: (response: any) => {
        var data = response.data;
        if (response) {
          this.salesPersonList = response.data;
        }
        else {
          this.toastr.error(response.Message, constMessage.error);
        }
      }
    })
  }

  activeSelectedOption(selectedData: salesPersonModel, index: number) {
    // this.newUserInfoForm.get('salesPersonObj')?.setValue(selectedData);
    this.activeIndex = index;
  }
  activeSelectedGenderOption(data: string, index: number) {
    this.newUserInfoForm.get('gender')?.setValue(data);
    this.activeIndex = index;
  }

  // activeSelectedHearingOption(selectedData: any, index: number) {
  //   this.newUserInfoForm.get('hearAbout')?.setValue(selectedData);
  //   this.activeIndex = index;
  // }

  getStringDate = (data: any) => {
    var NewDate = new Date(data);
    var Day1 = ("0" + NewDate.getDate()).slice(-2);
    var Month1 = ("0" + (NewDate.getMonth() + 1)).slice(-2);
    var Year1 = NewDate.getFullYear();
    var DateString = Month1 + "/" + Day1 + "/" + Year1;
    return DateString;
  };

  saveNewContact = (newUserobj: FormGroup<registerModel>, BirthDatevalidationModel: any) => {
    this.submitted = true;

    if (this.newUserInfoForm.invalid) {
      return;
    }
    var postData: any = newUserobj.value;
    var yearDifference = new Date().getFullYear() - postData.DOB.getFullYear();

    this.RegObj = JSON.parse(window.sessionStorage.getItem('RegisterObj') || '{}');
    this.RegObj.dob = this.getStringDate(postData.DOB);
    this.RegObj.clubNumber = this._commonService.initialObj.clubNumber;
    this.RegObj.email = postData.email;
    this.RegObj.firstName = postData.firstName;
    this.RegObj.gender = postData.gender;
    this.RegObj.goalInterests = postData.goalInterests;
    this.RegObj.hearAbout = postData.hearAbout;
    this.RegObj.isNewLead = !this.RegObj.hSId ? true : false;
    this.RegObj.EntrySource = !this.RegObj.entrySource ? "walk_in" : this.RegObj.entrySource;
    this.RegObj.lastName = postData.lastName;
    this.RegObj.phoneNumber = postData.phoneNumber;
    this.RegObj.salesPersonObj = postData.salesPersonObj;
    if (yearDifference < 18) {
      this.openModalForDob(BirthDatevalidationModel);
      return
    }

    var ClubNumber = window.sessionStorage.getItem("ClubNumber");
    var GUID = window.sessionStorage.getItem('GUID');
    var URL = window.location.href;
    var PageName = window.location.pathname.split('/').pop();
    var dob = this._commonService.getStringDate(postData.DOB);
    var PostData: any = {
      FieldValue: `New user:New User Information ,FirstName:${postData?.firstName} ,LastName:${postData?.lastName} ,Email:${postData.email}
                  ,PhoneNumber:${postData.phoneNumber} ,Date Of Birth:${dob} ,Gender:${postData.gender}`,
      ClubNumber: ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: this.continuebtn,
    }
    this._commonService.SaveWorkFlow(PostData);

    if (JSON.parse(window.sessionStorage.getItem("EmailResponse")!)) {
      var EmailResponse = JSON.parse(window.sessionStorage.getItem("EmailResponse") || '{}');
      if (EmailResponse.Email != this.RegObj.email) {
        return this._newUserService.ValidateEmail(this.RegObj.email).subscribe({
          next: (response: any) => {
            if (response.data.isValid == true) {
              window.sessionStorage.setItem("RegisterObj", JSON.stringify(this.RegObj));
              response.data.email = this.RegObj.email;
              window.sessionStorage.setItem("EmailResponse", JSON.stringify(response.data));
              // this._commonService.setSalesPerson("false");
              this.saveContact();
              // this._router.navigate(['signature']);
            }
            else {
              this.toastr.warning(response.Message, "Error");
            }
          },
          error: (error) => {
            this.toastr.error(error.error.StackTrace, constMessage.error);
          }
        })
      }
      else {
        window.sessionStorage.setItem("RegisterObj", JSON.stringify(this.RegObj));
        this.saveContact();
        //this._router.navigate(['signature']);
      }
    }
    else {
      return this._newUserService.ValidateEmail(this.RegObj.email).subscribe({
        next: (response: any) => {
          if (!response.error) {
            if (response.data.isValid == true) {
              window.sessionStorage.setItem("RegisterObj", JSON.stringify(this.RegObj));
              response.data.email = this.RegObj.email;
              window.sessionStorage.setItem("EmailResponse", JSON.stringify(response.data));
              this.saveContact();
              //this._router.navigate(['signature']);
            }
            else {
              this.toastr.warning(response.message, "Error");
            }
          }
          else if (response.isValid == false && response.message == "-1") {
            window.location.href = "/Login/Index";
          }
          else {
            this.toastr.warning(response.message, "Error");
          }
        },
        error: (error: any) => {
          this.toastr.error(error.error.StackTrace, constMessage.error);
        }
      })
    }
  }

  saveContact() {
    var regObj = JSON.parse(window.sessionStorage.getItem("RegisterObj") || '{}');
    var emailResponseObj = JSON.parse(window.sessionStorage.getItem("EmailResponse") || '{}');

    if (window.sessionStorage.getItem("ClubNumber") && window.sessionStorage.getItem("ClubName")) {
      if (regObj && emailResponseObj) {
        var postData = {
          registerObj: regObj,
          memberObj: JSON.parse(window.sessionStorage.getItem("MemberObj")!) ? JSON.parse(window.sessionStorage.getItem("MemberObj")!) : null,
          emailResponseObj: emailResponseObj,
        }
        postData.registerObj.clubStationId = window.sessionStorage.getItem("ClubStationId") == undefined ? "" : window.sessionStorage.getItem("ClubStationId");
        postData.registerObj.guestType = 'Prospect';
        postData.registerObj.sourceName = 'Prospect';
        if (this._commonService.commonTypeObj.member.guestCheckInType == window.sessionStorage.getItem("SourceName")) {
          regObj.isNewLead = true;
          this._router.navigate(['signature']);
        }
        else {
          this.homeService.SaveContact(postData).subscribe({
            next: (response: any) => {
              // this._http.requestCall(AuthEndPoints.SAVE_LEAD_INFORMATION, ApiMethod.POST, postData)?.subscribe({
              //   next: (response: any) => {
              if (response.data.isvalid == true) {
                // window.sessionStorage.removeItem("RegisterObj");
                // window.sessionStorage.removeItem("EmailResponse");

                this._router.navigate(['guest']);
              }
              else if (response.data.isvalid == false && response.data.message == "-1") {
                window.location.href = "/Login/Index";
              }
              else if (response.data.isvalid == false && response.data.message == "-4") {
                this.toastr.error("Selected club and your actual club is mismatch, Please relogin.", "Error");
                window.sessionStorage.clear();
              }
              else {
                if (response.data.message == "-2") {
                  this.toastr.error("Club Number is missing, Please login again in DGR. ", "Error");
                }
                else if (response.data.message == "-3") {
                  this.toastr.error("First name or last name is not properly enter in registration, please try again.", "Error");
                }
                else if (response.data.message == "-6") {
                  this.toastr.error("First name will not be greater than 15 characters in registration, Please try again.", "Required");
                  return;
                }
                else if (response.data.message == "-7") {
                  this.toastr.error("Last name will not be greater than 15 characters in registration, Please try again.", "Required");
                  return;
                }
                else if (response.data.message == "-8") {
                  this.toastr.error("Email or phone number is not properly enter in registration, please try again.", "Error");
                }
                else if (response.data.message == "-5") {
                  this.toastr.error("Please enter a valid 10-digit phone number in registration, please try again.", "Error");
                }
                else if (response.data.message == "-105") {
                  this.toastr.error("Member id does not exist for Former Member.", "Error");
                }
                else {
                  this.toastr.error(response.data.message, "Error");
                }
              }
            },
            error: (error) => {

            }
          });
        }
      }
      else {
        this._commonService.missingRegisterInformationIssue();
      }
    }
    else {
      this._commonService.missingClubInformationIssue();

    }
  }


  openDayGuestPassPopUpAndRedirectSignature() {
    var SourceName = window.sessionStorage.getItem('SourceName');
    this._commonService.setSalesPerson('false');
    this._router.navigate(['signature']);
  }

  validateContactEmail(newUserobj: FormGroup<registerModel>) {
    var postData = {
      Email: newUserobj.value.email
    }

    if (this.RegObjData == null || this.RegObj.Email != newUserobj.value.email) {
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
                  salesPersonObj: _.filter(this.salesPersonList, { 'fullName': data.sales_person_id })[0],
                  hSId: data.hs_object_id,
                  referringHSId: data.referring_member_id,
                  memberId: data.abcid,
                  beginDate: data.guest_pass_activation_date ? data.guest_pass_activation_date : null,
                  expiredDate: data.guest_pass_expiration_date ? data.guest_pass_expiration_date : null,
                  addressLine1: data.address,
                  addressLine2: null,
                  city: data.city,
                  state: data.state,
                  zipCode: data.zip,
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
  openModalForDob(BirthDatevalidationModel: any) {
    this.modalService.open(BirthDatevalidationModel, { centered: true, size: 'md' });
  }


  OpenModelForCheckEmail(data: any) {
    const modalRef = this.modalService.open(CheckExistingEmailComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.checkEmailModelLeadObj = data;
    modalRef.componentInstance.yesThisIsMeText = "Yes this is me";
  }


  continueToRedirectSignature(flag: boolean) {
    if (flag == true) {
      window.sessionStorage.setItem("RegisterObj", JSON.stringify(this.RegObj));
    }
    else {
      this.emptyRegister_InitialObjForInitial();
    }
    this.newUserInfoForm.patchValue(this.RegObj);
    this.closeModalPopup();
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

  closeModalPopup() {
    this.modalService.dismissAll();
  }

  redirectToMinorSign() {
    window.sessionStorage.setItem("SourceName", "Minor");
    this._router.navigate(['minor']);
    this.closeModalPopup();
  }

  preventTextInput(event: KeyboardEvent) {
    if (!/^[]*$/.test(event.key)) {
      event.preventDefault();
    }
  }
}
