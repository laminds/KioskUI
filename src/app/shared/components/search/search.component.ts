import { AfterContentChecked, ChangeDetectorRef, Component, EventEmitter, OnChanges, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { LeadModel, MemberRFCRequestModel, searchModel, searchInfoModel } from '../../models/searchModel';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { CommonType } from '../../Types/commonTypes';
import { HttpService } from 'src/app/core/services/http.service';
import { ApiMethod, AuthEndPoints, constMessage } from 'src/app/core/constant/const';
import { memberModel } from '../../models/memberModel';
import { RfcCheckModalComponent } from '../../modal/rfc-check-modal/rfc-check-modal.component';
import { registerInitialModel, registerModel } from '../../models/registerModel';
import * as _ from 'lodash';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  @ViewChild("checkEmailPopup") modalContent!: TemplateRef<any>;

  searchObj: searchModel;
  leadMemberListSection: any;
  IsShowFooter!: boolean;
  guestList: any | LeadModel[];
  memberList: LeadModel[];
  path: string;
  slideNo: string;
  BannerClass: string;
  flag!: boolean;
  headingName!: string;
  headingType!: string;
  commonTypeObj: CommonType | undefined;
  commonService: CommonService;
  searchInfoForm!: FormGroup<searchInfoModel>;
  submitted: boolean;
  prospectandMemberNotFound: boolean
  searchbtn: string;
  foundText: string;
  foundMessage: string;
  userNotFoundText: string;
  userFoundText: string;
  oopstext: string;
  errorFoundMessage: string;
  checkemail: string;
  notExistsEmail!: LeadModel;
  searchWelcomeText: string;
  notFoundText: string;
  eachOtherText: string;
  goback: string;
  userCardText: string;
  showMemberGuestView: boolean;
  showGuestCheckInView: boolean;
  memberStatus: string;
  GUID!: string;
  email: string;

  constructor(
    private _commonService: CommonService,
    private _http: HttpService,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private config: NgbModalConfig,
    private _formBuilder: FormBuilder,
    private oauthService: OAuthService
  ) {

    this.leadMemberListSection = false;
    window.sessionStorage.setItem("IsleadMemberListSection", JSON.stringify(this.leadMemberListSection));
    this.guestList = [];
    this.memberList = [];

    this.searchObj = {
      phoneNumber: window.sessionStorage.getItem("PhoneNumber")! ? window.sessionStorage.getItem("PhoneNumber")! : "",
      email: window.sessionStorage.getItem("Email")! ? window.sessionStorage.getItem("Email")! : ""
    }

    this.config.backdrop = 'static';
    this.config.keyboard = false;

    this.path = '';
    this.slideNo = '';
    this.BannerClass = '';
    this.commonService = _commonService;

    this.searchInfoForm = new FormGroup<searchInfoModel>({
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern(this._commonService.usPhoneNumberPattern)]),
      email: new FormControl('', [Validators.required, Validators.pattern(this._commonService.emailPattern)]),
    });
    this.prospectandMemberNotFound = false;
    this.submitted = false;
    if (this._commonService.commonTypeObj.member.guestCheckInType == window.sessionStorage.getItem("SourceName")) {
      window.sessionStorage.removeItem("ServiceName");
      window.sessionStorage.setItem("ServiceName", "Member Service");
    }
    else {
      window.sessionStorage.setItem("ServiceName", "Main Menu");
    }
    this._commonService.setClubName(window.sessionStorage.getItem("ClubShortName")!);
    this._commonService.setServiceName(window.sessionStorage.getItem("ServiceName")!);
    this.searchbtn = constMessage.search.searchbtn;
    this.foundText = "";
    this.foundMessage = "";
    this.userNotFoundText = constMessage.search.userNotFoundText;
    this.userFoundText = constMessage.search.userFoundText;
    this.oopstext = constMessage.search.oopstext;
    this.errorFoundMessage = constMessage.search.errorFoundMessage;
    this.searchWelcomeText = constMessage.search.searchWelcomeText;
    this.notFoundText = constMessage.search.notFoundText;
    this.eachOtherText = constMessage.search.eachOtherText;
    this.goback = constMessage.search.goback;
    this.userCardText = constMessage.search.userCardText;
    this.headingName = constMessage.search.headingName;
    this.headingType = constMessage.search.headingType;
    this.foundText = constMessage.search.foundText;
    this.foundMessage = constMessage.search.foundMessage;
    this.checkemail = "";
    this.memberStatus = "";
    this.email = "";

    this._commonService.invokeSearchComponentFunction.subscribe((value: LeadModel) => {
      this.redirectSignatureModule(value);
    });

    this._commonService.invokeSearchComponentInitialFunction.subscribe(() => {
      this.ngOnInit();
    });

    this._commonService.invokeGuestCheckInFunction.subscribe((value: LeadModel) => {
      this.redirectToCheckIn(value, null);
    });

    this._commonService.invokeMemberCheckInComponentFunction.subscribe((value: LeadModel) => {
      this.redirectToMemberModule(value, this.modalContent);
    });

    this._commonService.invokeUpsertInHSFunction.subscribe((email: string) => {
      this.upsertInHS(email);
    });

    this.showMemberGuestView = false;
    this.showGuestCheckInView = false;
  }

  ngOnInit(): void {
    this._commonService.ScreenUrl();
    this.searchInfoForm = new FormGroup<searchInfoModel>({
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern(this._commonService.usPhoneNumberPattern)]),
      email: new FormControl('', [Validators.required, Validators.pattern(this._commonService.emailPattern)]),
    });
    this._commonService.onSearchRemoveSession();
    this.leadMemberListSection = false;
    this.prospectandMemberNotFound = false;
    window.sessionStorage.setItem("IsleadMemberListSection", JSON.stringify(this.leadMemberListSection));
    this._commonService.changeIsHeader();
    this._commonService.changeIsFooter();
    var bannerSlide = this._commonService.setDynamicImage();
    this.slideNo = bannerSlide.slideNo;
    this.BannerClass = bannerSlide.bannerClass;
    this._commonService.setSlideNo(this.slideNo);
    this._commonService.setBanner(this.BannerClass);
    this._commonService.setBodyHeightSize();
    this.GUID = this._commonService.generateGUID();
    window.sessionStorage.setItem('GUID', this.GUID);
  }

  get form() { return this.searchInfoForm.controls; }

  redirectSearchModule() {
    this.searchInfoForm.get('email')?.setValue('');
    this.prospectandMemberNotFound = false;
    this.leadMemberListSection = false;
    window.sessionStorage.setItem("IsleadMemberListSection", JSON.stringify(this.leadMemberListSection));
  }

  searchContacts(searchObj: FormGroup<searchInfoModel>) {
    var token = this.oauthService.getAccessToken();
    if (token != null) {
      let tokenExpiration: any = new Date(this.oauthService.getAccessTokenExpiration());
      // let newdate: any = addMinutes(new Date(), 10);
      if (tokenExpiration < new Date()) {
        this.oauthService.logOut();
        window.location.href = 'https://identity.youfit.com/adfs/ls/?wa=wsignoutcleanup1.0';

        if (!this.oauthService.hasValidAccessToken()) {
          this.oauthService.tryLogin();
        }
        if (!this.oauthService.hasValidAccessToken()) {
          this.oauthService.initImplicitFlow();
          return false;
        }
        this.callbackSearch(searchObj);
      }
      else {
        this.callbackSearch(searchObj);
      }
    }
    else {
      if (!this.oauthService.hasValidAccessToken()) {
        this.oauthService.tryLogin();
      }
      if (!this.oauthService.hasValidAccessToken()) {
        this.oauthService.initImplicitFlow();

        return false;
      }
    }
  }

  addMinutes(date: any, minutes: any) {
    date.setMinutes(date.getMinutes() - minutes);
    return date;
  }

  callbackSearch(searchObj: any) {
    this.submitted = true;
    var Data: any = searchObj.value;
    searchObj.value.phoneNumber = searchObj.value.phoneNumber?.replace('(', '').replace(')', '').replace(' ', '').replace('-', '');

    window.sessionStorage.setItem("PhoneNumber", Data.phoneNumber);
    window.sessionStorage.setItem("Email", Data.email);

    var PhonePattern = /^(\d{10})$/;
    var Email = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/

    if (Data.email == "" && Data.phoneNumber == "") {
      this.toastr.warning("Please enter phone number or email.", "Required");
    }
    else if (Data.phoneNumber == undefined) {
      this.toastr.warning("Please enter 10 digits for your phone number (i.e. 9876543210)", "Required");
      return;
    }
    else if (Data.phoneNumber != "" && !PhonePattern.test(Data.phoneNumber)) {
      this.toastr.warning("Please enter valid 10 digits phone number (i.e. 9876543210).", "Required");
      return;
    }
    else if (Data.email == undefined) {
      this.toastr.warning("Please enter valid email address.", "Required");
      return;
    }
    else if (Data.email != "" && !Email.test(Data.email)) {
      this.toastr.warning("Please enter valid email address.", "Required");
      return;
    }
    else {
      this.leadMemberListSection = false;
      window.sessionStorage.setItem("IsleadMemberListSection", JSON.stringify(this.leadMemberListSection));
      var postData = {
        clubNumber: (this._commonService.initialObj.clubNumber ? this._commonService.initialObj.clubNumber : "").toString(),
        phoneNumber: Data.phoneNumber,
        email: Data.email
      }
      this._http.requestCall(AuthEndPoints.SEARCH_GUEST_MEMBER, ApiMethod.POST, postData)?.subscribe({
        next: (response: any) => {
          if (response.data) {
            this.leadMemberListSection = true;
            window.sessionStorage.setItem("IsleadMemberListSection", JSON.stringify(this.leadMemberListSection));
            // window.sessionStorage.setItem("leadMemberListSection", (this.leadMemberListSection.toString()));
            // if (window.sessionStorage.getItem('SourceName') === this._commonService.commonTypeObj.member.guestCheckInType && (response.data.prospectList != null && response.data.prospectList.length > 0)) {
            //   if(response.data.prospectList != null || response.data.prospectList.length > 0){
            //     this.guestList = response.data.prospectList.length > 0 ? response.data.prospectList : [];
            //   }
            // }
            // else if (window.sessionStorage.getItem('SourceName') == this._commonService.commonTypeObj.guest.checkInObj.memberGuestType) {
            //   if(response.data.memberList.length > 0){
            //     this.memberList = _.orderBy(response.data.memberList, "memberStatus", "asc");
            //   }
            //   else{
            //     this.prospectandMemberNotFound = true;
            //   }
            // }
            if (response.data.prospectList != null && response.data.prospectList.length > 0 || response.data.memberList.length > 0) {
              if (response.data.prospectList != null && response.data.prospectList.length > 0) {
                this.guestList = response.data.prospectList;
              }
              this.memberList = _.orderBy(response.data.memberList, "memberStatus", "asc");
            }
            else {
              this.prospectandMemberNotFound = true;
              this.leadMemberListSection = false;
              window.sessionStorage.setItem("IsleadMemberListSection", JSON.stringify(this.leadMemberListSection));
            }
            this._commonService.setEqualDivSize();
            this._commonService.setBodyHeightSize();
          }
        },
        error: (error: { error: { StackTrace: string | undefined; }; }) => {
          this.toastr.error(error.error.StackTrace, constMessage.error);
        }
      })
      var ClubNumber = window.sessionStorage.getItem("ClubNumber");
      var URL = window.location.href;
      var PageName = window.location.pathname.split('/').pop();
      var PostData: any = {
        FieldValue: `Search Value:${Data?.email || Data?.phoneNumber}`,
        ClubNumber: ClubNumber,
        SessionId: this.GUID,
        PageName: PageName,
        PageUrl: URL,
        ActionType: this.searchbtn
      }
      this._commonService.SaveWorkFlow(PostData);
    }
  }

  // #region Member list
  redirectToMemberModule(memberObj: LeadModel, modal: any) {
    if (!memberObj && window.sessionStorage.getItem("RegisterObj")) {
      memberObj = JSON.parse(window.sessionStorage.getItem("RegisterObj")!)
    }

    var memberData: memberModel = {
      homeClubNumber: memberObj.homeClubNumber,
      firstName: memberObj.firstName,
      lastName: memberObj.lastName,
      phoneNumber: memberObj.phoneNumber,
      email: memberObj.email,
      memberLeadId: 0,
      clubNumber: Number(window.sessionStorage.getItem("ClubNumber")),
      clubName: window.sessionStorage.getItem("ClubName"),
      memberId: memberObj.memberId,
      expiredDate: null,
      guestType: 'Limecard Member',
      clubStationId: window.sessionStorage.getItem("ClubStationId") == undefined ? "" : window.sessionStorage.getItem("ClubStationId"),
      memberType: memberObj.membershipType,
      memberStatus: memberObj.memberStatus,
      renewMemberId: memberObj.renewMemberId,
      ModuleName: window.sessionStorage.getItem("ModuleName"),
      dob: this._commonService.getStringDate(memberObj.dob),
      gender: memberObj.gender,
      ptMemberId: memberObj.ptMemberId,
      isFlipPlan: memberObj.isFlipPlan,
      isKeepMeUpdate: false,
      salesPersonObj: null,
      equipmentObj: null,
      agreementNumber: memberObj.agreementNumber ? window.sessionStorage.getItem("ClubNumber") + memberObj.agreementNumber : null
    }
    window.sessionStorage.setItem("MemberObj", JSON.stringify(memberData));
    if (memberObj.memberStatus != "Active" && memberObj.memberStatus != "Pending Cancel") {
      window.sessionStorage.setItem("ServiceName", "Guest Service");
      memberData.agreementNumber = null;
      this.memberStatus = memberObj.memberStatus;
      window.sessionStorage.setItem("RegisterObj", JSON.stringify(memberData));
      if (!memberObj.email) {
        this.OpenModelForCheckEmailInHB(memberObj, modal);
      }
      else {
        this.searchCancelledMember(memberObj);
        // this.router.navigateByUrl('/guest');
      }
    }
    else if (window.sessionStorage.getItem('SourceName') == this._commonService.commonTypeObj.guest.checkInObj.memberGuestType) {
      window.sessionStorage.setItem("ServiceName", "Member Service");
      this.router.navigateByUrl('/signature')
    }
    else {
      window.sessionStorage.setItem("ServiceName", "Member Service");
      this.router.navigateByUrl('/member')
    }
    var ClubNumber = window.sessionStorage.getItem("ClubNumber");
    var MemberObj = JSON.parse(window.sessionStorage.getItem("MemberObj")!);
    var GUID = window.sessionStorage.getItem('GUID');
    var URL = window.location.href;
    var PageName = window.location.pathname.split('/').pop();
    var PostData: any = {
      FieldValue: `Member Selection:${memberObj?.memberId} , Fullname:${memberObj?.fullName} , Email:${memberObj?.email} , PhoneNumber:${memberObj?.phoneNumber} , MemberShip Type:${memberObj.membershipType}
                  , Agreement number:${MemberObj.agreementNumber} , HSID:`,
      ClubNumber: ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: "GUEST",
    }
    this._commonService.SaveWorkFlow(PostData);
  }
  // #endregion Member list

  searchCancelledMember(data: LeadModel) {
    var regObj = {
      newClubNumber: data.clubNumber,
      clubNumber: data.clubNumber,
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      email: data.email,
      isNewLead: false,
      entrySource: "former_member",
      memberId: data.memberId,
      beginDate: data.beginDate,
      downloaddate: data.downloaddate,
      expiredDate: data.expiredDate,
      auto_Dialer_Opt_In: data.auto_Dialer_Opt_In,
      text_Opt_In: data.text_Opt_In,
      phone_Call_Opt_In: data.phone_Call_Opt_In,
      hasOptedOutOfEmail: data.hasOptedOutOfEmail,
      email_Opt_In__c: data.email_Opt_In__c,
      auto_Dialer_Opt_Out: data.auto_Dialer_Opt_Out,
      text_Opt_Out: data.text_Opt_Out,
      phone_Call_Opt_Out: data.phone_Call_Opt_Out,
      skipExistingProspect: data.skipExistingProspect,
      isMoreThanSixtyDays: data.isMoreThanSixtyDays,
      isMoreThanSixtyDays_CreatedDate: data.isMoreThanSixtyDays_CreatedDate,
      hasGuestPassWasFirstUsed: data.hasGuestPassWasFirstUsed,
      dob: data.dob == null ? null : this._commonService.getStringDate(data.dob),
      gender: data.gender,
      salesPersonObj: null,
      isRFC: data.isRFC,
      hsId: data.hsId,
    }
    this._http.requestCall(AuthEndPoints.CANCELLED_MEMBER, ApiMethod.POST, regObj)?.subscribe({
      next: (response: any) => {
        if (!response.error) {
          if (response.data) {
            this.router.navigateByUrl('/guest');
          }
          else {
          }
        }
        else {
          this.toastr.error(response.error.message, constMessage.error)
        }
      }
    });
  }

  redirectRegisterModule(data: FormGroup<searchInfoModel>) {
    var obj: any = data.value;

    var ClubNumber = window.sessionStorage.getItem("ClubNumber");
    var GUID = window.sessionStorage.getItem('GUID');
    var URL = window.location.href;
    var PageName = window.location.pathname.split('/').pop();
    var PostData: any = {
      FieldValue: `New Member:${obj?.email || obj?.phoneNumber}`,
      ClubNumber: ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: this.userNotFoundText,
    }
    this._commonService.SaveWorkFlow(PostData);
    if (JSON.parse(window.sessionStorage.getItem("RegisterObj")!)) {
      window.sessionStorage.removeItem("RegisterObj");
    }
    else if (JSON.parse(window.sessionStorage.getItem("MemberObj")!)) {
      window.sessionStorage.removeItem("MemberObj");
    }
    // window.sessionStorage.setItem("PhoneNumber", obj.phoneNumber);
    // window.sessionStorage.setItem("Email", obj.email);
    this.router.navigate(['/register']);
  }

  redirectToCheckIn(guestData: LeadModel, modal: any) {
    window.sessionStorage.setItem("ServiceName", "Guest Service");
    if (!guestData.email) {
      this.OpenModelForCheckEmailInHB(guestData, modal);
    }
    else {
      if (window.sessionStorage.getItem("SourceName") === this.commonService.commonTypeObj.member.guestCheckInType) {
        this.checkMemberGuestRFC(guestData);
      }
      else {
        this.checkProspectReturnForCollection(guestData);
      }
      window.sessionStorage.setItem("RegisterObj", JSON.stringify(guestData));
    }
    var ClubNumber = window.sessionStorage.getItem("ClubNumber");
    var GUID = window.sessionStorage.getItem('GUID');
    var URL = window.location.href;
    var PageName = window.location.pathname.split('/').pop();
    var PostData: any = {
      FieldValue: `Guest Member:${guestData?.memberId} , Fullname:${guestData?.fullName} , Email:${guestData?.email} , PhoneNumber:${guestData?.phoneNumber} , HSID:${guestData.hsId}
                  , Agreement number:`,
      ClubNumber: ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: "GUEST",
    }
    this._commonService.SaveWorkFlow(PostData);
  }

  OpenModelForCheckEmailInHB(data: LeadModel, modal: any) {
    window.sessionStorage.setItem("MemberDataObj", JSON.stringify(data));
    this.notExistsEmail = data;
    this.modalService.open(modal, { centered: true, size: 'lg' });
  }

  closeModalPopup() {
    this.modalService.dismissAll();
  }

  upsertInHS(email: string) {
    var EmailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var data = this.notExistsEmail;
    if (email == "") {
      this.toastr.warning("Please enter email.", "Required");
      return;
    }
    else if (email == undefined) {
      this.toastr.warning("Please enter valid email address.", "Required");
      return;
    }
    else if (email != '' && !EmailPattern.test(email)) {
      this.toastr.warning("Please enter valid email address (i.e. abcxyz@gmail.com).", "Required");
      return;
    }
    else {
      var postdata = {
        email: email,
        HsId: data.hsId
      }
      this._http.requestCall(AuthEndPoints.VALIDATE_HUBSPOT_EMAIL, ApiMethod.POST, postdata)?.subscribe({
        next: (response: any) => {
          if (response) {
            this.closeModalPopup();
            if (response.data.isActive == true) {
              this.checkemail = "";
              this.toastr.warning("Oh no! It looks like Email is already use in hubspot. Please continue with a different Email.", "Warning");
            }
            else if (this.memberStatus == "Cancelled") {
              var obj = JSON.parse(window.sessionStorage.getItem("RegisterObj")!);
              obj.email = email;
              window.sessionStorage.setItem("RegisterObj", JSON.stringify(obj));
              var MemberObj = JSON.parse(window.sessionStorage.getItem("MemberDataObj")!);
              MemberObj.email = email;
              this.searchCancelledMember(MemberObj);
            }
            else {
              data.email = email;
              this.checkProspectReturnForCollection(data);
            }
          }
        }
      })
    }
  }

  checkMemberGuestRFC(guestData: LeadModel) {
    var postData: MemberRFCRequestModel = {
      memberId: guestData.memberId,
      email: guestData.email,
      primaryPhone: guestData.phoneNumber,
      firstName: guestData.firstName,
      lastName: guestData.lastName
    }
    this._http.requestCall(AuthEndPoints.GET_MEMBER_RFC, ApiMethod.POST, postData)?.subscribe({
      next: (response: any) => {
        if (!response.error) {
          if (response.data) {
            guestData.isRFC = response.data;
            const modalRef = this.modalService.open(RfcCheckModalComponent, { size: 'md', centered: true });
            modalRef.componentInstance.leadData = guestData;
          }
          else {
            this.redirectSignatureModule(guestData);
          }
        }
        else {
          this.toastr.error(response.error.message, constMessage.error)
        }
      }
    });
  }

  checkProspectReturnForCollection(data: LeadModel) {
    if (data.memberId == null || data.memberId == "" || data.memberId == undefined) {
      this.AddMissedABCIdContacts(data);
    }
    var postData: MemberRFCRequestModel = {
      memberId: data.memberId,
      email: data.email,
      primaryPhone: data.phoneNumber,
      firstName: data.firstName,
      lastName: data.lastName
    }
    this._http.requestCall(AuthEndPoints.GET_MEMBER_RFC, ApiMethod.POST, postData)?.subscribe({
      next: (response: any) => {
        if (response.data == true) {
          data.isRFC = response.data;
          this.saveRFCMember(postData);
          this.openErrorModel();
        }
        else {
          this.redirectSignatureModule(data);
        }
      }
    })
  }

  saveRFCMember(data: any) {
    var postData = {
      MemberId: data.MemberId,
      Email: data.Email,
      PhoneNumber: data.PrimaryPhone,
      FirstName: data.FirstName,
      LastName: data.LastName,
      clbNumber: window.sessionStorage.getItem("ClubNumber")
    }
    this._http.requestCall(AuthEndPoints.UPDATE_RFC_FLAG, ApiMethod.POST, postData)?.subscribe({
      next: (response: any) => {
        var saveRFCUser = response.data;
      },
      error: (error) => {
        this.toastr.error(error.error.StackTrace, constMessage.error);
      }
    });
  }

  openErrorModel() {

  }

  redirectSignatureModule(data: LeadModel) {
    // window.sessionStorage.setItem("PhoneNumber", this.searchObj.phoneNumber);
    // window.sessionStorage.setItem("Email", this.searchObj.email);
    var sourceName: string | null = window.sessionStorage.getItem("SourceName");

    var limeCardMemberId = "";

    if (sourceName == this._commonService.commonTypeObj.member.guestCheckInType) {
      var memberObj: memberModel = JSON.parse(window.sessionStorage.getItem("MemberObj")!);
      limeCardMemberId = memberObj.memberId;
    }

    var guestPassDay = (data.entrySource == this._commonService.GuestPassEntrySourceObj.guestfortheDay || data.entrySource == this._commonService.GuestPassEntrySourceObj.WalkInDayPass || data.entrySource == this._commonService.GuestPassEntrySourceObj.OneDayPass) ? "1" :
      (data.entrySource == this._commonService.GuestPassEntrySourceObj.ThreeDayPass || data.entrySource == this._commonService.GuestPassEntrySourceObj.hand2hand_contest) ? "3" :
        (data.entrySource == this._commonService.GuestPassEntrySourceObj.SevenDayPass || data.entrySource == this._commonService.GuestPassEntrySourceObj.hyrox) ? "7" :
          (data.entrySource == this._commonService.GuestPassEntrySourceObj.FourteenDayPass) ? "14" : "1";


    var regObj: registerInitialModel = {
      newClubNumber: this._commonService.initialObj.clubNumber,
      clubNumber: this._commonService.initialObj.clubNumber,
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      email: data.email,
      isNewLead: false,
      sourceName: sourceName,
      memberId: data.memberId,
      limeCardMemberId: limeCardMemberId,
      passDurationDay: guestPassDay,
      beginDate: data.beginDate,
      downloaddate: data.downloaddate,
      expiredDate: data.expiredDate,
      auto_Dialer_Opt_In: data.auto_Dialer_Opt_In,
      text_Opt_In: data.text_Opt_In,
      phone_Call_Opt_In: data.phone_Call_Opt_In,
      hasOptedOutOfEmail: data.hasOptedOutOfEmail,
      email_Opt_In__c: data.email_Opt_In__c,
      auto_Dialer_Opt_Out: data.auto_Dialer_Opt_Out,
      text_Opt_Out: data.text_Opt_Out,
      phone_Call_Opt_Out: data.phone_Call_Opt_Out,
      skipExistingProspect: data.skipExistingProspect,
      isMoreThanSixtyDays: data.isMoreThanSixtyDays,
      isMoreThanSixtyDays_CreatedDate: data.isMoreThanSixtyDays_CreatedDate,
      hasGuestPassWasFirstUsed: data.hasGuestPassWasFirstUsed,
      addressLine1: null,
      addressLine2: null,
      city: null,
      state: null,
      dob: data.dob == null ? null : this._commonService.getStringDate(data.dob),
      gender: data.gender,
      zipCode: null,
      salesPersonObj: null,
      isRFC: data.isRFC,
      uto_Dialer_Opt_Out: undefined,
      hsId: data.hsId,
      entrySource: data.entrySource
    }
    window.sessionStorage.setItem("RegisterObj", JSON.stringify(regObj));
    var EmailResponse = { Email: regObj.email };
    window.sessionStorage.setItem("EmailResponse", JSON.stringify(EmailResponse));

    if (sourceName == this._commonService.commonTypeObj.member.guestCheckInType) {
      this._commonService.setSalesPerson("true");
      this.router.navigate(['signature']);
    }
    else if (sourceName != this._commonService.commonTypeObj.guest.classPassMemberType) {
      var postData = {
        RegisterObj: JSON.parse(window.sessionStorage.getItem("RegisterObj")!)
      }
      if (!postData.RegisterObj.gender || !postData.RegisterObj.dob ||
        !postData.RegisterObj.firstName || !postData.RegisterObj.lastName ||
        !postData.RegisterObj.phoneNumber || !postData.RegisterObj.email) {
        window.sessionStorage.setItem("MissingInformation", "guest");
        this.router.navigateByUrl('guest/checkInPass/passinfo');
      }
      else {
        this.router.navigateByUrl('/guest');
      }
    }
    else {
      this._commonService.setSalesPerson("true");
      this.router.navigate(['signature']);
    }
  }

  AddMissedABCIdContacts(data: any) {
    var postData = {
      HSId: data.hsId,
      MemberId: data.memberId,
      FirstName: data.firstName,
      LastName: data.lastName,
      Email: data.email,
      Gender: data.gender,
      DOB: data.dob,
      PhoneNumber: data.phoneNumber,
      ClubNumber: window.sessionStorage.getItem("ClubNumber")
    }
    this._http.requestCall(AuthEndPoints.ADD_MISSING_ABC_PROSPECTS, ApiMethod.POST, postData)?.subscribe({
      next: (response: any) => {
        // var saveRFCUser = response.data;
      },
      error: (error) => {
        this.toastr.error(error.error.StackTrace, constMessage.error);
      }
    });
  }
}
