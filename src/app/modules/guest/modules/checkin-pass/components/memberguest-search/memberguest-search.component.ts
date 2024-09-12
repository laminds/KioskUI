import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { ApiMethod, AuthEndPoints, constMessage } from 'src/app/core/constant/const';
import { HttpService } from 'src/app/core/services/http.service';
import { RfcCheckModalComponent } from 'src/app/shared/modal/rfc-check-modal/rfc-check-modal.component';
import { LeadModel, MemberRFCRequestModel, searchInfoModel } from 'src/app/shared/models/searchModel';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-memberguest-search',
  templateUrl: './memberguest-search.component.html',
  styleUrls: ['./memberguest-search.component.css']
})
export class MemberguestSearchComponent {

  path: string;
  slideNo: string;
  BannerClass: string;
  commonService: CommonService;
  headingName: string;
  headingType: string;
  foundText: string;
  foundMessage: string;
  notFoundText: string;
  showMemberGuestView: boolean;
  showGuestCheckInView: boolean;
  leadMemberListSection: boolean;
  prospectandMemberNotFound: boolean;
  searchForm!: FormGroup<searchInfoModel>;
  searchbtn: string;
  guestList: any | LeadModel[];
  memberList: LeadModel[];
  submitted: boolean;
  eachOtherText: string;
  goback: string;
  userCardText: string;
  userNotFoundText: string;
  userFoundText: string;
  checkemail: string;
  MemberGuestList: any[];
  constructor(
    private _commonService: CommonService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private _httpService: HttpService,
    private router: Router
  ) {

    this.searchForm = new FormGroup<searchInfoModel>({
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern(this._commonService.usPhoneNumberPattern)]),
      email: new FormControl('', [Validators.required, Validators.pattern(this._commonService.emailPattern)]),
    });
    this._commonService.setServiceName(window.sessionStorage.getItem("ServiceName")!);
    this.path = '';
    this.slideNo = '';
    this.BannerClass = '';
    this.commonService = _commonService;
    this.showMemberGuestView = false;
    this.showGuestCheckInView = false;
    this.headingName = "";
    this.foundText = "";
    this.headingType = "";
    this.foundMessage = "";
    this.notFoundText = "";
    this.leadMemberListSection = false;
    this.prospectandMemberNotFound = false;
    this.searchbtn = constMessage.search.searchbtn;
    this.notFoundText = constMessage.search.notFoundText;
    this.eachOtherText = constMessage.search.eachOtherText;
    this.goback = constMessage.search.goback;
    this.userCardText = constMessage.search.userCardText;
    this.userNotFoundText = constMessage.search.userNotFoundText;
    this.userFoundText = constMessage.search.userFoundText;
    this.submitted = false;
    this.guestList = [];
    this.memberList = [];
    this.checkemail = "";
    this.MemberGuestList = [];
    window.sessionStorage.setItem("IsleadMemberListSection", JSON.stringify(this.leadMemberListSection));

    this._commonService.invokeMemberGuestComponentInitialFunction.subscribe(() => {
      this.ngOnInit();
    });
  }

  ngOnInit(): void {
    this._commonService.ScreenUrl();
    this.leadMemberListSection = false;
    window.sessionStorage.setItem("IsleadMemberListSection", JSON.stringify(this.leadMemberListSection));
    if (this._commonService.commonTypeObj.member.guestCheckInType == window.sessionStorage.getItem("SourceName")) {
      window.sessionStorage.removeItem("ServiceName");
      window.sessionStorage.setItem("ServiceName", "Member Service");
    }
    else {
      window.sessionStorage.removeItem("ServiceName");
      window.sessionStorage.setItem("ServiceName", "Guest Service");
    }
    if (window.sessionStorage.getItem('SourceName') === this._commonService.commonTypeObj.guest.checkInObj.memberGuestType) {
      this.headingName = constMessage.guest.memberGuest.memberGuestheadingName;
      this.headingType = constMessage.guest.memberGuest.memberGuestheadingType;
      this.foundText = constMessage.guest.memberGuest.memberGuestfoundText;
      this.foundMessage = constMessage.guest.memberGuest.memberGuestfoundMessage;
      this.notFoundText = constMessage.guest.memberGuest.memberGuestnotFoundText;
      this.showMemberGuestView = true;
    }
    else if (window.sessionStorage.getItem('SourceName') === this._commonService.commonTypeObj.member.guestCheckInType) {
      this.headingName = constMessage.member.guestCheckIn.guestCheckInheadingName;
      this.headingType = constMessage.member.guestCheckIn.guestCheckInheadingType;
      this.foundText = constMessage.member.guestCheckIn.guestCheckInfoundText;
      this.foundMessage = constMessage.member.guestCheckIn.guestCheckInfoundMessage;
      this.notFoundText = constMessage.member.guestCheckIn.guestCheckInnotFoundText;
      this.showGuestCheckInView = true;
      this.GetMemberGuestListPage_InitailDeatils();
    }
    this._commonService.changeIsHeader();
    this._commonService.changeIsFooter();
    var bannerSlide = this._commonService.setDynamicImage();
    this.slideNo = bannerSlide.slideNo;
    this.BannerClass = bannerSlide.bannerClass;
    this._commonService.setSlideNo(this.slideNo);
    this._commonService.setBanner(this.BannerClass);
    this._commonService.setBodyHeightSize();
  }

  get form() { return this.searchForm.controls; }

  GetMemberGuestListPage_InitailDeatils() {
    var MemberObj = JSON.parse(window.sessionStorage.getItem("MemberObj")!)
    var PostData = {
      MemberId: MemberObj.memberId
    }
    this._httpService.requestCall(AuthEndPoints.SEARCH_MEMBER_GUEST, ApiMethod.POST, PostData)?.subscribe({
      next: (response: any) => {
        if (response.data) {
          this.MemberGuestList = response.data;
          this._commonService.setEqualDivSize();
          this._commonService.setBodyHeightSize();
        }
      },
      error: (error: { error: { StackTrace: string | undefined; }; }) => {
        this.toastr.error(error.error.StackTrace, constMessage.error);
      }
    })
  }

  searchContactsInfo(searchObj: FormGroup<searchInfoModel>) {
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
      this._httpService.requestCall(AuthEndPoints.SEARCH_GUEST_MEMBER, ApiMethod.POST, postData)?.subscribe({
        next: (response: any) => {
          if (response.data) {
            window.sessionStorage.setItem("IsleadMemberListSection", JSON.stringify(this.leadMemberListSection));
            if (window.sessionStorage.getItem('SourceName') === this._commonService.commonTypeObj.member.guestCheckInType && (response.data.prospectList != null && response.data.prospectList.length > 0)) {
              if (response.data.prospectList != null || response.data.prospectList.length > 0) {
                this.MemberGuestList = response.data.prospectList.length > 0 ? response.data.prospectList : [];
              }
            }
            else if (window.sessionStorage.getItem('SourceName') == this._commonService.commonTypeObj.guest.checkInObj.memberGuestType) {
              this.leadMemberListSection = true;
              if (response.data.memberList.length > 0) {
                this.memberList =  _.filter(response.data.memberList, { memberStatus: 'Active' });
                if(this.memberList.length <= 0){
                  this.prospectandMemberNotFound = true;
                }
                // this.memberList = _.orderBy(response.data.memberList, "memberStatus", "asc");
              }
              else {
                this.prospectandMemberNotFound = true;
              }
            }
            else {
              this.leadMemberListSection = true;
              this.prospectandMemberNotFound = true;
            }
            this._commonService.setEqualDivSize();
            this._commonService.setBodyHeightSize();
          }
        },
        error: (error: { error: { StackTrace: string | undefined; }; }) => {
          this.toastr.error(error.error.StackTrace, constMessage.error);
        }
      })
    }
    var ClubNumber = window.sessionStorage.getItem("ClubNumber");
    var URL = window.location.href;
    var PageName = window.location.pathname.split('/').pop();
    var GUID = window.sessionStorage.getItem('GUID');
    var PostData: any = {
      FieldValue: `Search Value:${Data?.email || Data?.phoneNumber}`,
      ClubNumber: ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: this.searchbtn,
    }
    this._commonService.SaveWorkFlow(PostData);  
  }

  CheckMemberGuestRFC(guestData: LeadModel) {
    window.sessionStorage.setItem("RegisterObj", JSON.stringify(guestData));

    var ClubNumber = window.sessionStorage.getItem("ClubNumber");
    var GUID = window.sessionStorage.getItem('GUID');
    var URL = window.location.href;
    var PageName = window.location.pathname.split('/').pop();
    var PostData: any = {
      FieldValue: `Guest Member:${guestData?.memberId} , HSID:${guestData.hsId} ,FullName:${guestData.fullName} ,Email:${guestData.email} ,PhoneNumber:${guestData.phoneNumber}`,
      ClubNumber: ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: "GUEST",
    }
    this._commonService.SaveWorkFlow(PostData);

    var postData: MemberRFCRequestModel = {
      memberId: guestData.memberId,
      email: guestData.email,
      primaryPhone: guestData.phoneNumber,
      firstName: guestData.firstName,
      lastName: guestData.lastName
    }
    this._httpService.requestCall(AuthEndPoints.GET_MEMBER_RFC, ApiMethod.POST, postData)?.subscribe({
      next: (response: any) => {
        if (!response.error) {
          if (response.data) {
            guestData.isRFC = response.data;
            const modalRef = this.modalService.open(RfcCheckModalComponent, { size: 'md', centered: true });
            modalRef.componentInstance.leadData = guestData;
          }
          if (!guestData.gender || !guestData.dob ||
            !guestData.firstName || !guestData.lastName || 
            !guestData.phoneNumber || !guestData.email) {
             window.sessionStorage.setItem("MissingInformation","guest");
             this.router.navigateByUrl('guest/checkInPass/passinfo');
           }
          else {
            this.router.navigate(['signature']);
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

    if (window.sessionStorage.getItem('SourceName') === this._commonService.commonTypeObj.member.guestCheckInType) {
      this.router.navigate(['/register']);
    }
    else {
      if (JSON.parse(window.sessionStorage.getItem("RegisterObj")!)) {
        window.sessionStorage.removeItem("RegisterObj");
      }
      else if (JSON.parse(window.sessionStorage.getItem("MemberObj")!)) {
        window.sessionStorage.removeItem("MemberObj");
      }
      this.router.navigate(['/register']);
    }
  }


  redirectSearchModule() {
    this.searchForm.get('email')?.setValue('');
    this.prospectandMemberNotFound = false;
    this.leadMemberListSection = false;
    window.sessionStorage.setItem("IsleadMemberListSection", JSON.stringify(this.leadMemberListSection));
  }

  redirectToGuestCheckIn(glist: LeadModel, modal: any) {
    this._commonService.onGuestCheckInMethodClick(glist);
  }

  redirectToMember(mList: LeadModel) {
    var ClubNumber = window.sessionStorage.getItem("ClubNumber");
    var GUID = window.sessionStorage.getItem('GUID');
    var URL = window.location.href;
    var PageName = window.location.pathname;
    var PostData: any = {
      FieldValue:  `Member:Member Details ,Fullname:${mList?.fullName} ,Email:${mList?.email} ,PhoneNumber:${mList?.phoneNumber} ,MemberStatus:${mList.memberStatus}
                  ,Agreement number:${mList.agreementNumber} ,HSID:`,
      ClubNumber: ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: "Member",
    }
    this._commonService.SaveWorkFlow(PostData);
    this._commonService.onMemberCheckInMethodClick(mList);
  }

  upsertInHS(email: string) {
    this._commonService.onUpsertInHSMethodClick(email);
  }

  closeModalPopup() {
    this.modalService.dismissAll();
  }
}
