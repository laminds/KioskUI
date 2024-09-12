import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { salesPersonModel } from '../../models/salesPersonModel';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/core/services/http.service';
import { Router } from '@angular/router';
import { CommonType } from '../../Types/commonTypes';
import { clubModel } from '../../models/clubModel';
import { registerModel } from '../../models/registerModel';
import { ApiMethod, AuthEndPoints, constMessage, webConfig } from 'src/app/core/constant/const';
import SignaturePad from 'signature_pad';
import { clubDetailsModel } from '../../models/clubDetailsModel';
import { SalesPersonMissingModalPopupComponent } from '../../modal/sales-person-missing-modal-popup/sales-person-missing-modal-popup.component';
import { post } from 'jquery';
import { responseModel } from '../../interface/responseModel';
import { HomeService } from 'src/app/modules/home/services/home.service';


@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.css']
})
export class SignatureComponent implements OnInit, AfterViewInit {
  signPad: any;
  signPadInitial: any;
  @ViewChild('signPadCanvas', { static: false }) signaturePadElement: any;
  @ViewChild('signPadInitialCanvas', { static: false }) signaturePadElementInitial: any;
  InputList: Array<string> = [];
  signImage: any;
  signImageInitial: any;
  slideNo: string;
  BannerClass: string;
  clubList!: clubModel[];
  salesPersonList: salesPersonModel[] = [];
  activeIndex: number;
  searchFilter!: string;
  IsSalesPerson: string = "";
  commonTypeObj: CommonType;
  regObj: registerModel;
  isAgreementCheckObj : {
    isConsentCheck : boolean;
    isBehalfOfMinorCheck : boolean;
 }
 screenWidth: number;
 screenHeight: number;
 width: number;
 buttonDisabled: boolean | any;

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

  constructor(private _commonService: CommonService,
    private _http: HttpService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal,
    private homeService: HomeService) {
    this.activeIndex = 0;
    this.regObj = JSON.parse(window.sessionStorage.getItem("RegisterObj")!);
    this.slideNo = '';
    this.BannerClass = '';
    this._commonService.currentApprovalStageMessage.subscribe(msg => this.IsSalesPerson = msg);
    this.commonTypeObj = _commonService.commonTypeObj;
    this.screenWidth = 0;
    this.screenHeight = 0;
    this.width = 0;
    this.getScreenSizeForESignature();
    this.isAgreementCheckObj = {
      isConsentCheck: true,
      isBehalfOfMinorCheck: false
    };
    if (this._commonService.commonTypeObj.member.guestCheckInType == window.sessionStorage.getItem("SourceName")) {
      window.sessionStorage.removeItem("ServiceName");
      window.sessionStorage.setItem("ServiceName", "Member Service");
    }
    else if (!window.sessionStorage.getItem("SourceName")) {
      window.sessionStorage.removeItem("ServiceName");
      window.sessionStorage.setItem("ServiceName", "Main Menu");
    }
    else {
      window.sessionStorage.setItem("ServiceName", "Guest Service");
    }
    this._commonService.setServiceName(window.sessionStorage.getItem("ServiceName")!)
  }


  ngOnInit(): void {
    this._commonService.ScreenUrl();
    this._commonService.changeIsHeader();
    this._commonService.changeIsFooter();
    var bannerSlide = this._commonService.setDynamicImage();
    this.slideNo = bannerSlide.slideNo;
    this.BannerClass = "banner-signature";
    this._commonService.setSlideNo(this.slideNo);
    this._commonService.setBanner(this.BannerClass);
    this._commonService.setBodyHeightSize();
    this.getSalesPersonList();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSizeForESignature(_event?: Event) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    if (this.screenWidth == 820 && this.screenHeight == 1180) {
      this.width = 670;
    }
    else if (this.screenWidth >= 1400) {
      this.width = 850;
    }
    else if (this.screenWidth <= 1399 && this.screenWidth >= 1200) {
      this.width = 720;
    }
    else if (this.screenWidth <= 1199 && this.screenWidth >= 992) {
      this.width = 600;
    }
    else if (this.screenWidth < 992 && this.screenWidth >= 768) {
      this.width = 670;
    }
    else if (this.screenWidth <= 767 && this.screenWidth >= 522) {
      this.width = 480;
    }
    else if (this.screenWidth <= 521 && this.screenWidth >= 485) {
      this.width = 450;
    }
    else if (this.screenWidth <= 484 && this.screenWidth >= 460) {
      this.width = 425;
    }
    else if (this.screenWidth <= 460 && this.screenWidth >= 403) {
      this.width = 380;
    }
    else if (this.screenWidth <= 402 && this.screenWidth >= 329) {
     this.width = 335;
    }
    else if (this.screenWidth <= 330) {
      this.width = 270;
    }
    else {
      this.width = 335;
    }
  }

  ngAfterViewInit() {
    this.signPad = new SignaturePad(this.signaturePadElement.nativeElement);
    this.signPadInitial = new SignaturePad(this.signaturePadElementInitial.nativeElement);
  }

  getSalesPersonList() {
    var postData: clubDetailsModel = {
      clubNumber: JSON.parse(sessionStorage.getItem('ClubNumber') || '{}'),
      clubName: '',
      mode: ''
    }
    this._http.requestCall(AuthEndPoints.GET_SALES_MEMBER_DETAIL, ApiMethod.POST, postData)?.subscribe({
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

  oepnMissingSalesPersonModal(data: salesPersonModel) {
    if (data.salesPersonMissing == 1) {
      const modalRef = this.modalService.open(SalesPersonMissingModalPopupComponent, { size: 'md', centered: true });
    }
  }

  activeSelectedOption(selectedData: salesPersonModel, index: number) {
    this.salesPersonObj = selectedData;
    this.activeIndex = index;
  }

  saveContact = (signPad: any, signPadInitial: any, salesPersonObj: any, isAgreementCheckObj: any) => {
    var SourceName = window.sessionStorage.getItem("SourceName");
    if (signPad.toDataURL() == undefined || signPad.isEmpty() == true) {
      this.toastr.warning("Please do sign.", "Required");
      return;
    }
    else if (signPadInitial.toDataURL() == undefined || signPadInitial.isEmpty() == true) {
      this.toastr.warning("Please do Initials.", "Required");
      return;
    }
    else {
      var signature = this.signPad.toDataURL();
      var signatureInitial = this.signPadInitial.toDataURL();
      var regObj = JSON.parse(window.sessionStorage.getItem("RegisterObj") || '{}');
      var emailResponseObj = JSON.parse(window.sessionStorage.getItem("EmailResponse") || '{}');
      regObj.dob = regObj.dob != undefined ? this._commonService.getStringDate(regObj.dob) : undefined;

      if (window.sessionStorage.getItem("ClubNumber") && window.sessionStorage.getItem("ClubName")) {
        if (regObj && emailResponseObj) {
          var d = new Date();
          d.setMinutes(d.getMinutes() + (-1 * d.getTimezoneOffset()));
          var postData = {
            registerObj: regObj,
            memberObj: JSON.parse(window.sessionStorage.getItem("MemberObj")!) ? JSON.parse(window.sessionStorage.getItem("MemberObj")!) : null,
            emailResponseObj: emailResponseObj,
            disclaimerObj: {
              imageSrc: signature.toString(),
              clubDate: d,
              clubTimeZone: new Date().toString().match(/([A-Z]+[\+-][0-9]+.*)/)![1],
            },
            signatureObj: {
              imageSrc: signature.toString(),
              isKeepMeUpdate: isAgreementCheckObj.isConsentCheck,
              isReceiveTextMessages: false,
              clubDate: d,
              clubTimeZone: new Date().toString().match(/([A-Z]+[\+-][0-9]+.*)/)![1],
              isKeepMeUpdate_Old: false,
              isReceiveTextMessages_Old: false
            },
            initialSignatureObj: {
              imageSrc: signatureInitial.toString(),
              isKeepMeUpdate: isAgreementCheckObj.isConsentCheck,
              isReceiveTextMessages: false,
              clubDate: d,
              clubTimeZone: new Date().toString().match(/([A-Z]+[\+-][0-9]+.*)/)![1],
              isKeepMeUpdate_Old: false,
              isReceiveTextMessages_Old: false
            },
          }
          postData.registerObj.clubStationId = window.sessionStorage.getItem("ClubStationId") == undefined ? "" : window.sessionStorage.getItem("ClubStationId");
          // postData.registerObj.guestType = 'Prospect';
          postData.registerObj.salesPersonObj = salesPersonObj;
          postData.registerObj.isKeepMeUpdate = isAgreementCheckObj.isConsentCheck;

          var sourceName = window.sessionStorage.getItem("SourceName");          
          postData.registerObj.clubNumber = window.sessionStorage.getItem("ClubNumber");

          if (this._commonService.commonTypeObj.guest.checkInObj.openHouseType == window.sessionStorage.getItem("SourceName")) {
            postData.registerObj.isOpenHouse = true;
            postData.registerObj.EntrySource = webConfig.openHouseCampaignId;
            postData.registerObj.SourceName = window.sessionStorage.getItem("SourceName");
            postData.registerObj.isNewLead = false;
            // postData.registerObj.EntrySource =  postData.registerObj.isNewLead == true ? webConfig.openHouseCampaignId : postData.registerObj.EntrySource;

          }
          else if (this._commonService.commonTypeObj.guest.checkInObj.paidPassType == window.sessionStorage.getItem("SourceName") || this._commonService.commonTypeObj.guest.checkInObj.buypassType == window.sessionStorage.getItem("SourceName")) {
            // postData.registerObj.EntrySource =  postData.registerObj.isNewLead == true ? webConfig.paidPassCampaignId : postData.registerObj.EntrySource;
            postData.registerObj.EntrySource = webConfig.paidPassCampaignId;
            postData.registerObj.guestType = "paidPass";
            postData.registerObj.SourceName = window.sessionStorage.getItem("SourceName");
            postData.registerObj.isNewLead = false;
          }
          else if (this._commonService.commonTypeObj.guest.classPassMemberType == window.sessionStorage.getItem("SourceName")) {
            // postData.registerObj.EntrySource =  postData.registerObj.isNewLead == true ? webConfig.classPassCampaignId : postData.registerObj.EntrySource;
            postData.registerObj.EntrySource = webConfig.classPassCampaignId;
            postData.registerObj.SourceName = window.sessionStorage.getItem("SourceName");
            postData.registerObj.isNewLead = false;
          }
          else if (this._commonService.commonTypeObj.guest.checkInObj.appointmentTourType == window.sessionStorage.getItem("SourceName")) {
            // postData.registerObj.EntrySource =  postData.registerObj.isNewLead == true ? webConfig.appointmentTourCampaignId : postData.registerObj.EntrySource;
            postData.registerObj.EntrySource = postData.registerObj.entrySource ? postData.registerObj.entrySource : "walk_in";
            postData.registerObj.SourceName = window.sessionStorage.getItem("SourceName");
            postData.registerObj.isAppointmentTour = true;
            postData.registerObj.isNewLead = false;
          }
          else if (this._commonService.commonTypeObj.guest.checkInObj.memberGuestType == window.sessionStorage.getItem("SourceName")) {
            postData.registerObj.EntrySource = webConfig.memberGuestCampaignId;
            postData.registerObj.referringMemberId = postData.memberObj.memberId;
            postData.registerObj.referringMemberFirst = postData.memberObj.firstName;
            postData.registerObj.referringMemberLast = postData.memberObj.lastName;
            postData.registerObj.SourceName = window.sessionStorage.getItem("SourceName");
            postData.registerObj.isNewLead = false;
          }
          else if (this._commonService.commonTypeObj.guest.checkInObj.freePassType == window.sessionStorage.getItem("SourceName")) {
            postData.registerObj.EntrySource = postData.registerObj.entrySource ? postData.registerObj.entrySource : "walk_in";
            postData.registerObj.isFreePass = true;
            postData.registerObj.SourceName = window.sessionStorage.getItem("SourceName");
            postData.registerObj.isNewLead = false;
          }
          else if (this._commonService.commonTypeObj.member.guestCheckInType == window.sessionStorage.getItem("SourceName")) {
            if (postData.registerObj.isNewLead == true) {
              postData.registerObj.EntrySource = webConfig.memberGuestCampaignId;
              postData.registerObj.SourceName = window.sessionStorage.getItem("SourceName");
              postData.registerObj.referringMemberId = postData.memberObj.memberId;
              postData.registerObj.referringMemberFirst = postData.memberObj.firstName;
              postData.registerObj.referringMemberLast = postData.memberObj.lastName;
            }
            else {
              postData.registerObj.referringMemberId = postData.memberObj.memberId;
              postData.registerObj.referringMemberFirst = postData.memberObj.firstName;
              postData.registerObj.referringMemberLast = postData.memberObj.lastName;              
              postData.registerObj.EntrySource = webConfig.memberGuestCampaignId;
              postData.registerObj.sourceName = window.sessionStorage.getItem("SourceName");              
            }
          }
          else if (this._commonService.commonTypeObj.guest.pickleballguestType == window.sessionStorage.getItem("SourceName")) {
            var LeadId =  window.sessionStorage.getItem("LeadId");
            postData.registerObj.LeadId = LeadId;
            postData.registerObj.EntrySource = webConfig.pickleballCampaignId;
            postData.registerObj.SourceName = window.sessionStorage.getItem("SourceName");
            postData.registerObj.isNewLead = false;
          }
          this.buttonDisabled = true;
          // postData.registerObj.isBehalfOfMinorCheck = isAgreementCheckObj.isBehalfOfMinorCheck;
          this.homeService.SaveContact(postData).subscribe({
            next: (response: any) => {   
          // this._http.requestCall(AuthEndPoints.SAVE_LEAD_INFORMATION, ApiMethod.POST, postData)?.subscribe({
          //   next: (response: any) => {
              
              if (response.data.isvalid == true) {
                window.sessionStorage.removeItem("RegisterObj");
                window.sessionStorage.removeItem("EmailResponse");

                var SourceName = window.sessionStorage.getItem('SourceName');

                if (SourceName == this.commonTypeObj?.guest.classPassMemberType) {
                  this.router.navigate(['guest/thankyou']);
                }
                else if (this.commonTypeObj?.member.guestCheckInType == SourceName) {
                  this.router.navigate(['member/thankyou']);
                }
                else if (SourceName == this.commonTypeObj?.guest.checkInObj.openHouseType) {
                  this.router.navigate(['guest/thankyou']);
                }
                else if (SourceName == this.commonTypeObj?.member.amenitiesTypeObj.pickleballType) {
                  this.router.navigate(['member/thankyou']);
                }
                else if (SourceName == this.commonTypeObj?.guest.checkInObj.memberGuestType) {
                  this.router.navigate(['guest/thankyou']);
                }
                else {
                  this.router.navigate(['thankyou']);
                }
                var ClubNumber = window.sessionStorage.getItem("ClubNumber");
                var GUID = window.sessionStorage.getItem('GUID');
                var URL = window.location.href;
                var PageName = window.location.pathname.split('/').pop();
                var PostData: any = {
                  FieldValue: `Signature:Signature Approved , EntrySource:${postData.registerObj.EntrySource}${postData.registerObj.salesPersonObj.fullName ? ' , Helping Member:' + postData.registerObj.salesPersonObj.fullName : ''}`,
                  ClubNumber: ClubNumber,
                  SessionId: GUID,
                  PageName: PageName,
                  PageUrl: URL,
                  ActionType: "CONTINUE",
                }
                this._commonService.SaveWorkFlow(PostData);
              }
              else if (response.data.isvalid == false && response.data.message == "-1") {
                this.buttonDisabled = null;
                window.location.href = "/Login/Index";
              }
              else if (response.data.isvalid == false && response.data.message == "-4") {
                this.buttonDisabled = null;
                const errorMessage = "Selected club and your actual club is mismatch Please relogin.";
                this.toastr.error(errorMessage, "Error");
                this._commonService.SaveWaivererror(errorMessage);
                window.sessionStorage.clear();
              }
              else {
                if (response.data.message == "-2") {
                  this.buttonDisabled = null;
                  const errorMessage = "Club Number is missing, Please login again in DGR. ";
                  this.toastr.error(errorMessage, "Error");
                  this._commonService.SaveWaivererror(errorMessage);
                }
                else if (response.data.message == "-3") {
                  this.buttonDisabled = null;
                  const errorMessage = "First name or last name is not properly enter in registration please try again.";
                  this.toastr.error(errorMessage, "Error");
                  this._commonService.SaveWaivererror(errorMessage);
                }
                else if (response.data.message == "-6") {
                  this.buttonDisabled = null;
                  const errorMessage = "First name will not be greater than 15 characters in registration Please try again.";
                  this.toastr.error(errorMessage, "Required");
                  this._commonService.SaveWaivererror(errorMessage);
                  return;
                }
                else if (response.data.message == "-7") {
                  this.buttonDisabled = null;
                  const errorMessage ="Last name will not be greater than 15 characters in registration Please try again.";
                  this.toastr.error(errorMessage, "Required");
                  this._commonService.SaveWaivererror(errorMessage);
                  return;
                }
                else if (response.data.message == "-8") {
                  this.buttonDisabled = null;
                  const errorMessage = "Email or phone number is not properly enter in registration please try again.";
                  this.toastr.error(errorMessage, "Error");
                  this._commonService.SaveWaivererror(errorMessage);
                }
                else if (response.data.message == "-5") {
                  this.buttonDisabled = null;
                  const errorMessage = "Please enter a valid 10-digit phone number in registration please try again.";
                  this.toastr.error(errorMessage, "Error");
                  this._commonService.SaveWaivererror(errorMessage);
                }
                else if (response.data.message == "-105") {
                  this.buttonDisabled = null;
                  const errorMessage = "Member id does not exist for Former Member.";
                  this.toastr.error(errorMessage, "Error");
                  this._commonService.SaveWaivererror(errorMessage);
                }
                else {
                  this.buttonDisabled = null;
                  this.toastr.error(response.data.message, "Error");
                  this._commonService.SaveWaivererror(response.data.message);
                }
              }
            },
            error: (error) => {

            }
          });
        }
        else {
          this._commonService.missingRegisterInformationIssue();
        }
      }
      else {
        this._commonService.missingClubInformationIssue();
      }
    }
  }

  closeMissingSalesPersonModal() {
    this.modalService.dismissAll();
  }

}
