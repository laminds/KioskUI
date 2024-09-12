import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/core/services/http.service';
import { CommonType } from '../Types/commonTypes';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { salesPersonModel } from '../models/salesPersonModel';
import { bannerSlideModel, slideModel } from '../models/slideModel';
import { initialObjModel } from '../models/initialObjModel';
import { ApiMethod, AuthEndPoints, constMessage, webConfig } from 'src/app/core/constant/const';
import { LeadModel } from '../models/searchModel';
import { clubDetailsModel } from '../models/clubDetailsModel';
import { ExpiredPassPopupComponent } from '../modal/expired-pass-popup/expired-pass-popup.component';
import { PassModalPopupComponent } from '../modal/pass-modal-popup/pass-modal-popup.component';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private data: any = {};

  initialObj: initialObjModel = {
    phoneNumber: '',
    email: '',
    clubNumber: 0,
    clubName: '',
    mode: 'Tablet',
    moduleName: "",
    sourceName: "",
    childSourceName: "",
    clubShortName: ""
  }

  Path: string;
  SlideNo: string;
  BannerClass: string;
  BackGroundImage: slideModel[];
  ShowClubNumberAndVL: boolean = false;
  commonTypeObj: CommonType;
  showClubNumberAndVL: boolean;
  LimecardGuestNotFound: boolean;
  headerServicesName: string;


  @Output() checkFooter: EventEmitter<any> = new EventEmitter();
  @Output() backSlide: EventEmitter<any> = new EventEmitter();
  @Output() backBanner: EventEmitter<any> = new EventEmitter();
  @Output() checkHeader: EventEmitter<any> = new EventEmitter();
  @Output() checkClubName: EventEmitter<any> = new EventEmitter();
  @Output() checkServiceName: EventEmitter<any> = new EventEmitter();
  @Output() checkLogout: EventEmitter<any> = new EventEmitter();


  // @Output() thankYouType: EventEmitter<any> = new EventEmitter();
  invokeMemberGuestComponentInitialFunction = new EventEmitter();
  invokeSearchComponentFunction = new EventEmitter();
  invokeMemberCheckInComponentFunction = new EventEmitter();
  invokeGuestCheckInFunction = new EventEmitter();
  invokeSearchComponentInitialFunction = new EventEmitter();
  invokeNewUserComponentFunction = new EventEmitter();
  invokeUpsertInHSFunction = new EventEmitter();

  public approvalStageMessage = new BehaviorSubject('');
  currentApprovalStageMessage = this.approvalStageMessage.asObservable();
  salesPersonObj!: salesPersonModel;
  //#region Regex Pattern
  phonePattern: RegExp;
  phone10DigitPattern: RegExp;
  nameValidPattern: RegExp;
  dateValidPattern: RegExp;
  emailPattern: RegExp;
  usPhoneNumberPattern: RegExp;
  onlyPattern: RegExp;
  datePattern: RegExp;
  addressPattern: RegExp;
  cityPattern: RegExp;
  zipCodePattern: RegExp;
  onlyNumberPattern: RegExp;
  routingNumberDigitPattern: RegExp;
  accountNumberDigitPattern: RegExp;
  cvvNumberDigitPattern: RegExp;
  zipcodeNumberDigitPattern: RegExp;

  //#endregion

  phoneMask: (string | RegExp)[];
  GuestPassEntrySourceObj: {
    ThreeDayPass: string; SevenDayPass: string; WalkInDayPass: string; hand2hand_contest: string; hyrox: string
    guestPass: string; guestfortheDay: string, OneDayPass: string, FourteenDayPass: string
  };
  RegObj: any;

  constructor(private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal,
    private _http: HttpService) {
    this.Path = '';
    this.SlideNo = '';
    this.BannerClass = '';
    this.showClubNumberAndVL = false;
    this.LimecardGuestNotFound = false;
    this.RegObj = JSON.parse(window.sessionStorage.getItem("RegisterObj") || "{}");
    this.headerServicesName = window.sessionStorage.getItem("ServiceName") == "MemberService" ? "Member Service" : window.sessionStorage.getItem("ServiceName") == "GuestService" ? "Guest Service" : "Main Menu";
    this.salesPersonObj = {
      clubNumber: 0,
      clubName: '',
      mode: '',
      moduleName: "",
      sourceName: "",
      childSourceName: "",
      barCode: "",
      empBranchCode: "",
      employeeEmail: "",
      employeeId: 0,
      employeePhone: "",
      employeeStatus: "",
      epFullName: "",
      firstName: "",
      fullName: "",
      lastName: "",
      paychexId: "",
      SPClubNumber: "",
      SPEmployeeId: 0,
      salesPersonMissing: 0
    }

    this.BackGroundImage = [
      { SlideName: 'welcome', URL: '/search' },
      { SlideName: 'welcome', URL: '/register' },
      { SlideName: 'peronalTraining', URL: '/smallgrouptraining' },
      { SlideName: 'peronalTraining', URL: '/ptplans' },
      { SlideName: 'slide8', URL: '/notfound' },
      { SlideName: 'prospect', URL: '/guest' },
      { SlideName: 'prospect', URL: '/guest/join' },
      { SlideName: 'prospect', URL: '/guest/checkInPass' },
      { SlideName: 'bgcolor', URL: '/guest/checkInPass/openhouse' },
      { SlideName: 'prospect', URL: '/guest/checkInPass/freepass' },
      { SlideName: 'prospect', URL: '/plans' },
      { SlideName: 'prospect', URL: '/guest/health-insurance' },
      { SlideName: 'prospect', URL: '/guest/silverPlan' },
      { SlideName: 'guestthankyou', URL: '/guest/thankyou' },
      { SlideName: 'member', URL: '/member' },
      { SlideName: 'guestthankyou', URL: '/thankyou' },
      { SlideName: 'memberthankyou', URL: '/member/thankyou' },
      { SlideName: 'guestcheckIn', URL: '/guestcheckIn' },
      { SlideName: 'guestcheckIn', URL: '/membercheckIn' },
      { SlideName: 'bgcolor', URL: '/signature' },
      { SlideName: 'bgcolor', URL: '/checkout' },
      { SlideName: 'member', URL: '/member/amenities' },
      { SlideName: 'member', URL: '/member/amenities/babysitting' },
      { SlideName: 'bgcolor', URL: '/member/amenities/pickleball' },
      { SlideName: 'member', URL: '/member/manageMembership' },
      { SlideName: 'bgcolor', URL: '/member/manageMembership/updatePersonalInfo' },
      { SlideName: 'bgcolor', URL: '/member/manageMembership/updatePaymentInfo' },
      { SlideName: 'prospect', URL: '/guest/checkInPass/passinfo' },
      { SlideName: 'prospect', URL: '/guest/classpass' },
      { SlideName: 'prospect', URL: '/minor' },
      { SlideName: 'guestcheckIn', URL: '/guest/checkInPass/memberGuest' },
      { SlideName: 'bgcolor', URL: '/member/amenities/babysitting/checkout' },
      { SlideName: 'bgstaffcolor', URL: '/staff' },
      { SlideName: 'prospect', URL: '/survey' },
      { SlideName: 'prospect', URL: '/survey/tourguide' },
      { SlideName: 'prospect', URL: '/guest/checkInPass/virtualTour' },
      { SlideName: 'bgcolor', URL: '/QRcheckout' },
    ];

    this.GuestPassEntrySourceObj = {
      ThreeDayPass: "3day_pass",
      SevenDayPass: "7day_pass",
      WalkInDayPass: "walk_in",
      hand2hand_contest: "hand2hand_contest",
      hyrox: "hyrox",
      guestPass: "guest_pass",
      guestfortheDay: "guest_for_day",
      OneDayPass: "1day_pass",
      FourteenDayPass: "14-Day Premium Guest Pass"
    }

    this.commonTypeObj = {
      guest: {
        joinType: "Join",
        checkInType: "Check-In",
        buyPassType: "Buy-A-Pass",
        classPassMemberType: "ClassPass Member",
        pickleballguestType: "PickleballGuest",

        joinNowObj: {
          viewPlansType: "ViewPlans",
          healthInsuranceType: "HealthInsurance"
        },

        checkInObj: {
          freePassType: "FreePass",
          paidPassType: "PaidPass",
          memberGuestType: "MemberGuest",
          guestpickleballType: "guestPickleball",
          openHouseType: "OpenHouse",
          appointmentTourType: "AppointMent/Tour",
          buypassType: "buypass",
          virtualTourType: "VirtualTour"
        }
      },

      member: {
        memberShipType: "MemberShip",
        personalTrainingType: "MemberPersonalTraining",
        guestCheckInType: "GuestCheckIn",
        upgradeMemberShipType: "UpgradeMemberShip",
        referFriendType: "ReferAFriend",
        amenities: "Amenities",
        manageMembership: "Manage Membership",
        workOutwinSweep: "WorkOutWinSweep",

        amenitiesTypeObj: {
          babysittingType: "TotSpotBabysitting",
          pickleballType: "Pickleball"
        },

        manageMembershipObj: {
          updatePersonalInfo: "UpdatePersonalInformation",
          updatePaymentInfo: "UpdatePaymentInformation"
        }
      },
      staffType: "Staff",
      minorType: "Minor"
    }

    //#region Regex pattern
    this.phonePattern = /^((?!(0))[0-9]{10})$/;
    this.phone10DigitPattern = /^\d{10}$/;
    this.nameValidPattern = /^[A-Za-z]{1}[0-9A-Za-z \-']*$/;
    this.dateValidPattern = /^(1[0-2]|0[1-9])\/(3[01]|[12][0-9]|0[1-9])\/[0-9]{4}$/;
    this.emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    this.usPhoneNumberPattern = /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/;
    this.onlyPattern = /^(0|[1-9][0-9]*)$/;
    this.datePattern = /(((0[0-9])|(1[012]))\/((0[1-9])|([12][0-9])|(3[01]))\/((20[012]\d|19\d\d)|(1\d|2[0123])))/;
    this.addressPattern = /^[ A-Za-z0-9/#-]*$/;
    this.cityPattern = /^[0-9A-Za-z \-']*$/;
    this.zipCodePattern = /^[0-9]{5}$/;
    this.onlyNumberPattern = /^[0-9]*$/;
    this.routingNumberDigitPattern = /^\d{9}$/;
    this.accountNumberDigitPattern = /^\d{8,17}$/;
    this.cvvNumberDigitPattern = /^\d{3,4}$/;
    this.zipcodeNumberDigitPattern = /^\d{5}$/;
    //#endregion

    this.phoneMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  }

  stateList = [
    { stateCode: "AL", stateName: "AL - Alabama" },
    { stateCode: "AK", stateName: "AK - Alaska" },
    { stateCode: "AZ", stateName: "AZ - Arizona" },
    { stateCode: "AR", stateName: "AR - Arkansas" },
    { stateCode: "CA", stateName: "CA - California" },
    { stateCode: "CO", stateName: "CO - Colorado" },
    { stateCode: "CT", stateName: "CT - Connecticut" },
    { stateCode: "DE", stateName: "DE - Delaware" },
    { stateCode: "DC", stateName: "DC - District of Columbia" },
    { stateCode: "FL", stateName: "FL - Florida" },
    { stateCode: "GA", stateName: "GA - Georgia" },
    { stateCode: "HI", stateName: "HI - Hawaii" },
    { stateCode: "ID", stateName: "ID - Idaho" },
    { stateCode: "IL", stateName: "IL - Illinois" },
    { stateCode: "IN", stateName: "IN - Indiana" },
    { stateCode: "IA", stateName: "IA - Iowa" },
    { stateCode: "KS", stateName: "KS - Kansas" },
    { stateCode: "KY", stateName: "KY - Kentucky" },
    { stateCode: "LA", stateName: "LA - Louisiana" },
    { stateCode: "ME", stateName: "ME - Maine" },
    { stateCode: "MD", stateName: "MD - Maryland" },
    { stateCode: "MA", stateName: "MA - Massachusetts" },
    { stateCode: "MI", stateName: "MI - Michigan" },
    { stateCode: "MN", stateName: "MN - Minnesota" },
    { stateCode: "MS", stateName: "MS - Mississippi" },
    { stateCode: "MO", stateName: "MO - Missouri" },
    { stateCode: "MT", stateName: "MT - Montana" },
    { stateCode: "NE", stateName: "NE - Nebraska" },
    { stateCode: "NV", stateName: "NV - Nevada" },
    { stateCode: "NH", stateName: "NH - New Hampshire" },
    { stateCode: "NJ", stateName: "NJ - New Jersey" },
    { stateCode: "NM", stateName: "NM - New Mexico" },
    { stateCode: "NY", stateName: "NY - New York" },
    { stateCode: "NC", stateName: "NC - North Carolina" },
    { stateCode: "ND", stateName: "ND - North Dakota" },
    { stateCode: "OH", stateName: "OH - Ohio" },
    { stateCode: "OK", stateName: "OK - Oklahoma" },
    { stateCode: "OR", stateName: "OR - Oregon" },
    { stateCode: "PA", stateName: "PA - Pennsylvania" },
    { stateCode: "PR", stateName: "PR - Puerto Rico" },
    { stateCode: "RI", stateName: "RI - Rhode Island" },
    { stateCode: "SC", stateName: "SC - South Carolina" },
    { stateCode: "SD", stateName: "SD - South Dakota" },
    { stateCode: "TN", stateName: "TN - Tennessee" },
    { stateCode: "TX", stateName: "TX - Texas" },
    { stateCode: "UT", stateName: "UT - Utah" },
    { stateCode: "VT", stateName: "VT - Vermont" },
    { stateCode: "VA", stateName: "VA - Virginia" },
    { stateCode: "WA", stateName: "WA - Washington" },
    { stateCode: "WV", stateName: "WV - West Virginia" },
    { stateCode: "WI", stateName: "WI - Wisconsin" },
    { stateCode: "WY", stateName: "WY - Wyoming" }
  ];

  monthList = [
    { month: '01', monthName: '01 - January' },
    { month: '02', monthName: '02 - February' },
    { month: '03', monthName: '03 - March' },
    { month: '04', monthName: '04 - April' },
    { month: '05', monthName: '05 - May' },
    { month: '06', monthName: '06 - June' },
    { month: '07', monthName: '07 - July' },
    { month: '08', monthName: '08 - August' },
    { month: '09', monthName: '09 - September' },
    { month: '10', monthName: '10 - October' },
    { month: '11', monthName: '11 - November' },
    { month: '12', monthName: '12 - December' }
  ]

  accountList = [
    { Id: 1, Type: 'Consumer - Checking', AccountType: 'CONSUMER_CHECKING' },
    { Id: 2, Type: 'Consumer - Saving', AccountType: 'CONSUMER_SAVINGS' },
    { Id: 3, Type: 'Corporate - Checking', AccountType: 'CORPORATE_CHECKING' },
    { Id: 4, Type: 'Corporate - Saving', AccountType: 'CORPORATE_SAVINGS' }
  ];

  creditCardTypeObj = {
    americanExpress: "American Express",
    americanExpressShort: "amex",
    visa: "Visa",
    masterCard: "MasterCard",
    discover: "Discover"
  }


  phoneMasks(rawValue: string): (RegExp | string)[] {
    const numberPattern = /\d/;
    const strLength = String(rawValue).length;
    const nameMask: (RegExp | string)[] = [];

    for (let i = 0; i <= rawValue.length; i++) {
      if (i == 0 && numberPattern.test(rawValue[i])) {
        nameMask.push('(');
        nameMask.push(numberPattern);
      }
      else {
        nameMask.push(numberPattern);
      }
    }
    return nameMask;
  }

  generateGUID(): string {
    // Generate a random GUID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  SaveWorkFlow(PostData: any): void {
    this._http.requestCall(AuthEndPoints.SAVE_WORK_FLOW, ApiMethod.POST, PostData)?.subscribe({
      next: (response: any) => {
        if (response != null) {
          console.log("You Record Insert Successfully.")
        }
      }
    });
  }

  setModuleAndRedirectToPerticularSource(type: string) {
    var RegObj = JSON.parse(window.sessionStorage.getItem("RegisterObj") || "{}");
    window.sessionStorage.setItem("ModuleName", type);
    this.initialObj.moduleName = type;

    window.sessionStorage.setItem("SourceName", type);
    this.initialObj.sourceName = type;

    var date = RegObj.DOB != null ? RegObj.DOB : RegObj.dob;
    if (type === this.commonTypeObj.member.personalTrainingType) {
      window.sessionStorage.setItem("IsPriceShow", JSON.stringify(0));
      this.router.navigateByUrl('/ptplans');
    }
    else if (type === this.commonTypeObj.member.guestCheckInType) {
      this.router.navigateByUrl('/guest/checkInPass/memberGuest');
    }
    else if (type == this.commonTypeObj.member.upgradeMemberShipType) {
      this.router.navigateByUrl('/plans');
    }
    else if (type == this.commonTypeObj.member.amenities) {
      this.router.navigateByUrl('member/amenities');
    }
    else if (type == this.commonTypeObj.guest.pickleballguestType) {
      this.router.navigateByUrl('member/amenities/pickleball');
    }
    else if (type == this.commonTypeObj.member.amenitiesTypeObj.pickleballType) {
      this.router.navigateByUrl('member/amenities/pickleball');
    }
    else if (type == this.commonTypeObj.member.amenitiesTypeObj.babysittingType) {
      this.router.navigateByUrl('member/amenities/babysitting');
    }
    else if (type == this.commonTypeObj.member.manageMembership) {
      this.router.navigateByUrl('member/manageMembership');
    }
    else if (type == this.commonTypeObj.member.manageMembershipObj.updatePersonalInfo) {
      this.router.navigateByUrl('member/manageMembership/updatePersonalInfo');
    }
    else if (type == this.commonTypeObj.member.manageMembershipObj.updatePaymentInfo) {
      this.router.navigateByUrl('member/manageMembership/updatePaymentInfo');
    }
    else if (type == this.commonTypeObj.guest.checkInObj.openHouseType) {
        this.router.navigate(['signature']);
    }
    else if (type == this.commonTypeObj.guest.joinType) {
      this.router.navigateByUrl('guest/join')
    }
    else if (type == this.commonTypeObj.guest.checkInType) {
      this.router.navigateByUrl('guest/checkInPass')
    }
    else if (type == this.commonTypeObj.guest.checkInObj.paidPassType) {
        this.router.navigate(['signature']);
    }
    else if (type == this.commonTypeObj.guest.checkInObj.appointmentTourType) {
        this.showPassModal();
    }
    else if (type == this.commonTypeObj.guest.checkInObj.freePassType || type == this.commonTypeObj.guest.checkInObj.memberGuestType) {
      var data = this.checkExpiredPass();
    }
    else if (type == this.commonTypeObj.guest.classPassMemberType) {
      this.router.navigateByUrl('signature')
    }
    else if (type == this.commonTypeObj.minorType) {
      this.router.navigateByUrl('guest/classpass')
    }
    else if (type == this.commonTypeObj.minorType) {
      this.router.navigateByUrl('guest/classpass')
    }
    else if (type == this.commonTypeObj.guest.checkInObj.virtualTourType) {
      this.router.navigateByUrl('guest/checkInPass/virtualTour')
    }
    else if (type == this.commonTypeObj.member.referFriendType) {
      window.open(
        'https://lp.youfit.com/refer-your-friends', '_blank'
      );
    }
    else if (type == this.commonTypeObj.member.workOutwinSweep) {
      window.open(
        'https://news.iheart.com/promotions/youfit-walk-in-and-win-1616619/?ref=ulink&app_type=contest&share_type=', '_blank'
      );
    }

    var ClubNumber = window.sessionStorage.getItem("ClubNumber");
    var GUID = window.sessionStorage.getItem('GUID');
    var URL = window.location.href;
    var PageName = window.location.pathname.split('/').pop();
    var PostData: any = {
      FieldValue: `${type}:${type + '' + "Button Click"}`,
      ClubNumber: ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: type
    }
    this.SaveWorkFlow(PostData);
  }

  checkExpiredPass() {
    this.RegObj = JSON.parse(window.sessionStorage.getItem("RegisterObj") || "{}");
    var date = this.RegObj.DOB != null ? this.RegObj.DOB : this.RegObj.dob;
    if (this.RegObj.expiredDate !== null && this.RegObj.expiredDate !== "" && this.RegObj.expiredDate !== undefined) {
      if (this.getStringDate(new Date()) > this.getStringDate(this.RegObj.expiredDate)) {
        const modalRef = this.modalService.open(ExpiredPassPopupComponent, { centered: true, size: 'md' });
      }
      else if (window.sessionStorage.getItem("SourceName") == this.commonTypeObj.guest.checkInObj.memberGuestType) {
        this.router.navigateByUrl('guest/checkInPass/memberGuest');
      }
      else if (window.sessionStorage.getItem("SourceName") == this.commonTypeObj.guest.checkInObj.freePassType) {
      
          this.showPassModal();
        
      }
      else {
        this.showPassModal();
      }
    }
    else if (window.sessionStorage.getItem("SourceName") == this.commonTypeObj.guest.checkInObj.memberGuestType) {
      this.router.navigateByUrl('guest/checkInPass/memberGuest');
    }
    else if (window.sessionStorage.getItem("SourceName") == this.commonTypeObj.guest.checkInObj.freePassType) {
    
        this.showPassModal();
      
    }
    else {
      this.showPassModal();
    }
    return true;
  }

  showPassModal() {
    const modalRef = this.modalService.open(PassModalPopupComponent, { centered: true, size: 'md' });
  }

  setDynamicImage(): bannerSlideModel {
    var bannerSlide = new bannerSlideModel();

    this.Path = window.location.pathname;
    var scode = window.sessionStorage.getItem("ShortCode");

    var SlideObj: slideModel = this.BackGroundImage.filter(
      (value: slideModel, key: number) => {
        return this.Path.includes('/guest/membership-activation/healthInsurance/plans/' + scode)
          ? this.Path.toLowerCase().includes(value.URL.toLowerCase())
          : this.Path.toLowerCase() === value.URL.toLowerCase();
      }
    )[0];

    if (SlideObj) {
      bannerSlide.slideNo = SlideObj.SlideName;
      bannerSlide.bannerClass = 'banner';
    }
    return bannerSlide;
  }

  setBodyHeightSize() {
    setTimeout(() => {
      var bannerList = document.querySelectorAll('.banner') as NodeListOf<HTMLElement>;
      var bannerElement = Array.from(document.getElementsByClassName('banner') as HTMLCollectionOf<HTMLElement>);
      var marginBottomHeight = 0;
      var marginBottomElements =
        document.querySelectorAll('.margin-bottom-200');
      var headerHeight = document.getElementById('header-section');

      var bodyHeight = document.getElementById('bodyHeight');

      if (marginBottomElements.length > 0) {
        marginBottomHeight = parseInt(
          getComputedStyle(marginBottomElements[0]).marginBottom.replace(
            'px',
            ''
          )
        );
      }
      var PageHeight = 0;
      if (window.innerHeight > (bodyHeight ? bodyHeight.offsetHeight : 0)) {
        if (
          window.innerHeight - marginBottomHeight >
          (bodyHeight ? bodyHeight.offsetHeight : 0)
        ) {
          PageHeight =
            window.innerHeight - (headerHeight ? headerHeight.offsetHeight : 0);
        } else {
          PageHeight =
            window.innerHeight -
            (headerHeight ? headerHeight.offsetHeight : 0) +
            marginBottomHeight;
        }
      } else {
        PageHeight =
          (bodyHeight ? bodyHeight.offsetHeight : 0) -
          (headerHeight ? headerHeight.offsetHeight : 0) +
          marginBottomHeight;
      }

      if (bannerList.length > 0) {
        for (var i = 0; i < bannerList.length; i++) {
          bannerList[i].style.height = (PageHeight) + 'px';
        }
      }
      else {
        var bannerSectionList = document.querySelectorAll('.banner-section') as NodeListOf<HTMLElement>;
        bannerSectionList[0].style.height = "auto";
      }

      var slideList = document.querySelectorAll('.slide') as NodeListOf<HTMLElement>;
      if (bannerList.length > 0) {
        for (var i = 0; i < slideList.length; i++) {
          slideList[i].style.height = (PageHeight) + 'px';
        }
      }
      else {
        slideList[0].style.height = "auto";
      }
    }, 0);
  }

  missingClubInformationIssue() {
    this.toastr.error(constMessage.networkError, constMessage.error);
    setTimeout(() => {
      window.sessionStorage.clear();
      this.router.navigate(['Home']);
    }, 2000);
  }

  missingRegisterInformationIssue() {
    this.toastr.error(constMessage.networkError, constMessage.error);
    setTimeout(() => {
      // window.sessionStorage.clear();
      this.router.navigate(['Home/QrCode']);
    }, 2000);
  }

  setClubInformation = (code: number, clubFullName: string, clubcity: string) => {
    this.initialObj.clubNumber = code;
    this.initialObj.clubName = clubFullName;
    this.initialObj.clubShortName = clubcity;
  };


  getPageInitialValue() {
    if (window.sessionStorage.getItem("ClubNumber") && window.sessionStorage.getItem("ClubName")) {
      this.setClubInformation(parseInt(window.sessionStorage.getItem("ClubNumber")!), window.sessionStorage.getItem("ClubName")!, window.sessionStorage.getItem("ClubShortName")!);
    }

    if (window.sessionStorage.getItem("ModuleName")) {
      this.initialObj.moduleName = window.sessionStorage.getItem("ModuleName")!;
    }

    if (window.sessionStorage.getItem("SourceName")) {
      this.initialObj.sourceName = window.sessionStorage.getItem("SourceName")!;
    }

    if (window.sessionStorage.getItem("Mode")) {
      this.initialObj.mode = window.sessionStorage.getItem("Mode")!;
    }
  }

  setEqualDivSize() {
    setTimeout(function () {
      var MaxHeight = 0;
      var elements = document.querySelectorAll('.same-div') as NodeListOf<HTMLElement>;
      for (var i = 0; i < elements.length; i++) {
        if (elements[i].offsetHeight > MaxHeight) {
          MaxHeight = elements[i].offsetHeight;
        }
        // elements[i].style.height =  MaxHeight + "px";
      }
      elements.forEach(element => {
        element.style.height = MaxHeight + "px";
      });

    }, 0);
  };

  setEqualPTPlanDivSize() {
    setTimeout(function () {
      var MaxHeight = 0;
      var elements = document.querySelectorAll('.ptplan') as NodeListOf<HTMLElement>;
      for (var i = 0; i < elements.length; i++) {
        if (elements[i].offsetHeight > MaxHeight) {
          MaxHeight = elements[i].offsetHeight;
        }
        // elements[i].style.height =  MaxHeight + "px";
      }
      elements.forEach(element => {
        element.style.height = MaxHeight + "px";
      });
    }, 0);
  };

  focusInput(field: string) {
    var Input = Array.from(document.getElementsByClassName(field) as HTMLCollectionOf<HTMLElement>);
    if (Input[0] != null) {
      Input[0].focus();
      Input[0].classList.add("error-validation");
    }
  }

  getStringDate = (data: any): string => {
    var newDate = new Date(data);
    var day = ("0" + newDate.getDate()).slice(-2);
    var month = ("0" + (newDate.getMonth() + 1)).slice(-2);
    var year = newDate.getFullYear();
    var dateString = month + "/" + day + "/" + year;
    return dateString;
  };

  redirectToMainPage = () => {
    if (window.sessionStorage.getItem("TabMode")) {
      window.sessionStorage.removeItem("TabMode");
    }

    if (window.sessionStorage.getItem("Mode") == "Phone") {
      this.router.navigate(['Home/Services?mode=Phone&ClubNumber=' + window.sessionStorage.getItem("ClubNumber")]);
    }
    else {
      this.router.navigate(['Home']);
    }
  };

  chooseAnotherMembershipPlan() {
    this.router.navigate(['guest/membership/plans']);
  }

  chooseAnotherPTPlan() {
    this.router.navigate(['guest/membership/ptplans']);
  }

  openHomeQrCodePage() {
    var path = window.location.pathname;

    if (path == "/Search") {
      this.onSearchComponentInitial();
    }
    else {
      this.router.navigate(['Search']);
    }
    window.sessionStorage.removeItem('Identification');
    // this.onSearchRemoveSession();
    this.setBodyHeightSize();
  }

  onSearchComponentMethodClick(data: LeadModel) {
    this.invokeSearchComponentFunction.emit(data);
  }

  onGuestCheckInMethodClick(data: LeadModel) {
    this.invokeGuestCheckInFunction.emit(data);
  }

  onMemberCheckInMethodClick(data: LeadModel) {
    this.invokeMemberCheckInComponentFunction.emit(data);
  }

  onSearchComponentInitial() {
    this.invokeSearchComponentInitialFunction.emit();
  }

  onUpsertInHSMethodClick(email: string) {
    this.invokeUpsertInHSFunction.emit(email);
  }

  onMemberGuestComponentInitial() {
    this.invokeMemberGuestComponentInitialFunction.emit();
  }

  onNewUserComponentMethodClick(flag: boolean) {
    this.invokeNewUserComponentFunction.emit(flag);
  }

  removeUserSession = () => {
    if (window.sessionStorage.getItem("ClubNumber")) {
      window.sessionStorage.removeItem("ClubNumber");
    }
    if (window.sessionStorage.getItem("ClubName")) {
      window.sessionStorage.removeItem("ClubName");
    }
    if (window.sessionStorage.getItem("Email")) {
      window.sessionStorage.removeItem("Email");
    }
    if (window.sessionStorage.getItem("PhoneNumber")) {
      window.sessionStorage.removeItem("PhoneNumber");
    }
    if (window.sessionStorage.getItem("SourceName")) {
      window.sessionStorage.removeItem("SourceName");
    }
    if (window.sessionStorage.getItem("ModuleName")) {
      window.sessionStorage.removeItem("ModuleName");
    }
    if (window.sessionStorage.getItem("Mode")) {
      window.sessionStorage.removeItem("Mode");
    }
    if (window.sessionStorage.getItem("IsPriceShow")) {
      window.sessionStorage.removeItem("IsPriceShow");
    }
    if (JSON.parse(window.sessionStorage.getItem("RegisterObj")!)) {
      window.sessionStorage.removeItem("RegisterObj");
    }
    if (JSON.parse(window.sessionStorage.getItem("EmailResponse")!)) {
      window.sessionStorage.removeItem("EmailResponse");
    }
    if (JSON.parse(window.sessionStorage.getItem("MemberObj")!)) {
      window.sessionStorage.removeItem("MemberObj");
    }
    if (JSON.parse(window.sessionStorage.getItem("PlanObj")!)) {
      window.sessionStorage.removeItem("PlanObj");
    }
    if (JSON.parse(window.sessionStorage.getItem("VisitorUserInfo")!) && window.sessionStorage.getItem("ModuleName") != this.commonTypeObj.staffType) {
      window.sessionStorage.removeItem("VisitorUserInfo");
    }
    if (JSON.parse(window.sessionStorage.getItem("PTPlanObj")!)) {
      window.sessionStorage.removeItem("PTPlanObj");
    }
    if (JSON.parse(window.sessionStorage.getItem("SmallGroupPlanObj")!)) {
      window.sessionStorage.removeItem("SmallGroupPlanObj");
    }
    if (JSON.parse(window.sessionStorage.getItem("AmenitiesObj")!)) {
      window.sessionStorage.removeItem("AmenitiesObj");
    }
    if (window.sessionStorage.getItem("MemberPreviousPTPlanAvailable")) {
      window.sessionStorage.removeItem("MemberPreviousPTPlanAvailable");
    }
    if (window.sessionStorage.getItem("ServiceName")) {
      window.sessionStorage.removeItem("ServiceName");
    }
    if (window.sessionStorage.getItem("IsleadMemberListSection")) {
      window.sessionStorage.removeItem("IsleadMemberListSection");
    }
    if (window.sessionStorage.getItem("isBack")) {
      window.sessionStorage.removeItem("isBack");
    }
    if (window.sessionStorage.getItem("StaffDetail")) {
      window.sessionStorage.removeItem("StaffDetail");
    }
  }

  removePhoneFormat = (phone: any) => {
    if (phone) {
      phone = phone.replace(/[^\d]+/g, "");
      return phone.Length > 10 ? phone.substring(phone.Length - 10) : phone;
    }
    else {
      return null;
    }
  }

  getSalesPersonList() {
    var postData: clubDetailsModel = {
      clubNumber: JSON.parse(sessionStorage.getItem('ClubNumber') || '{}'),
      clubName: '',
      mode: ''
    }
    this._http.requestCall(AuthEndPoints.GET_SALES_MEMBER_DETAIL, ApiMethod.POST, postData)?.subscribe({
      next: (response: any) => {
        var data = response.data;
        if (response) {
          this.getSalesPersonList = response.data;
        }
        else {
          this.toastr.error(response.Message, constMessage.error);
        }
      }
    })
  }

  changeIsFooter() {
    this.checkFooter.emit(true);
  }

  changeNofooter() {
    this.checkFooter.emit(false);
  }

  changeIsHeader() {
    this.checkHeader.emit(true);
  }

  changeNoHeader() {
    this.checkHeader.emit(false);
  }

  getEmittedValueForHeader() {
    return this.checkHeader;
  }

  getEmittedValue() {
    return this.checkFooter;
  }

  setSlideNo(data: any) {
    this.backSlide.emit(data);
  }

  setBanner(data: any) {
    this.backBanner.emit(data);
  }

  getEmittedValueforSlide() {
    return this.backSlide;
  }

  getEmittedValueforBanner() {
    return this.backBanner;
  }

  setClubName(data: string) {
    this.checkClubName.emit(data);
  }

  setServiceName(data: string) {
    this.checkServiceName.emit(data);
  }

  getEmittedValueForServieName() {
    return this.checkServiceName;
  }

  getEmittedValueForClubName() {
    return this.checkClubName;
  }

  setSalesPerson(salesPerson: string) {
    this.approvalStageMessage.next(salesPerson)
  }

  changeIsLogoutPage() {
    this.checkLogout.emit(true);
  }

  changeNoLogoutPage() {
    this.checkLogout.emit(false);
  }

  getEmittedLogoutValue() {
    return this.checkLogout;
  }

  removeAllSession = () => {
    if (window.sessionStorage.getItem("Email")) {
      window.sessionStorage.removeItem("Email");
    }
    if (window.sessionStorage.getItem("PhoneNumber")) {
      window.sessionStorage.removeItem("PhoneNumber");
    }
    if (window.sessionStorage.getItem("SourceName")) {
      window.sessionStorage.removeItem("SourceName");
    }
    if (window.sessionStorage.getItem("ModuleName")) {
      window.sessionStorage.removeItem("ModuleName");
    }
    if (window.sessionStorage.getItem("Mode")) {
      window.sessionStorage.removeItem("Mode");
    }
    if (window.sessionStorage.getItem("IsPriceShow")) {
      window.sessionStorage.removeItem("IsPriceShow");
    }
    if (JSON.parse(window.sessionStorage.getItem("RegisterObj")!)) {
      window.sessionStorage.removeItem("RegisterObj");
    }
    if (JSON.parse(window.sessionStorage.getItem("EmailResponse")!)) {
      window.sessionStorage.removeItem("EmailResponse");
    }
    if (JSON.parse(window.sessionStorage.getItem("MemberObj")!)) {
      window.sessionStorage.removeItem("MemberObj");
    }
    if (JSON.parse(window.sessionStorage.getItem("PlanObj")!)) {
      window.sessionStorage.removeItem("PlanObj");
    }
    if (JSON.parse(window.sessionStorage.getItem("VisitorUserInfo")!) && window.sessionStorage.getItem("ModuleName") != this.commonTypeObj.staffType) {
      window.sessionStorage.removeItem("VisitorUserInfo");
    }
    if (JSON.parse(window.sessionStorage.getItem("PTPlanObj")!)) {
      window.sessionStorage.removeItem("PTPlanObj");
    }
    if (window.sessionStorage.getItem("MemberPreviousPTPlanAvailable")) {
      window.sessionStorage.removeItem("MemberPreviousPTPlanAvailable");
    }
    if (window.sessionStorage.getItem("ServiceName")) {
      window.sessionStorage.removeItem("ServiceName");
    }
    if (window.sessionStorage.getItem("IsleadMemberListSection")) {
      window.sessionStorage.removeItem("IsleadMemberListSection");
    }
    if (window.sessionStorage.getItem("isBack")) {
      window.sessionStorage.removeItem("isBack");
    }
    if (window.sessionStorage.getItem("BabySittingPlan")) {
      window.sessionStorage.removeItem("BabySittingPlan");
    }
    if (window.sessionStorage.getItem("StaffDetail")) {
      window.sessionStorage.removeItem("StaffDetail");
    }
  }

  onSearchRemoveSession() {
    if (window.sessionStorage.getItem("SourceName")) {
      window.sessionStorage.removeItem("SourceName");
    }
    if (window.sessionStorage.getItem("ModuleName")) {
      window.sessionStorage.removeItem("ModuleName");
    }
    if (JSON.parse(window.sessionStorage.getItem("RegisterObj")!)) {
      window.sessionStorage.removeItem("RegisterObj");
    }
    if (JSON.parse(window.sessionStorage.getItem("MemberObj")!)) {
      window.sessionStorage.removeItem("MemberObj");
    }
    if (JSON.parse(window.sessionStorage.getItem("PlanObj")!)) {
      window.sessionStorage.removeItem("PlanObj");
    }
    if (JSON.parse(window.sessionStorage.getItem("PTPlanObj")!)) {
      window.sessionStorage.removeItem("PTPlanObj");
    }
    if (JSON.parse(window.sessionStorage.getItem("SmallGroupPlanObj")!)) {
      window.sessionStorage.removeItem("SmallGroupPlanObj");
    }
    if (window.sessionStorage.getItem("IsPriceShow")) {
      window.sessionStorage.removeItem("IsPriceShow");
    }
    if (window.sessionStorage.getItem("BabySittingPlan")) {
      window.sessionStorage.removeItem("BabySittingPlan");
    }
    if (window.sessionStorage.getItem("StaffDetail")) {
      window.sessionStorage.removeItem("StaffDetail");
    }
    if (JSON.parse(window.sessionStorage.getItem("AmenitiesObj")!)) {
      window.sessionStorage.removeItem("AmenitiesObj");
    }
    if (window.sessionStorage.getItem("Email")) {
      window.sessionStorage.removeItem("Email");
    }
    if (window.sessionStorage.getItem("PhoneNumber")) {
      window.sessionStorage.removeItem("PhoneNumber");
    }
  }

    SaveWaivererror(error: any) {
        var GUID = window.sessionStorage.getItem('GUID');
        var ClubNumber = window.sessionStorage.getItem("ClubNumber");
        var URL = window.location.href;
        var PageName = window.location.pathname.split('/').pop();
        var PostData: any = {
            FieldValue: `Signature Error:${error}`,
            ClubNumber: ClubNumber,
            SessionId: GUID,
            PageName: PageName,
            PageUrl: URL,
            ActionType: "CONTINUE"
        }
        this.SaveWorkFlow(PostData);
    }

  storeData(key: string, value: any[]): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  ScreenUrl(): void {
    const URL = window.location.pathname;
    const segments = URL.split('/');
    const Identification = segments[segments.length - 1];

    if (Identification.trim() !== '') {
      // Retrieve existing array from session storage
      const existingIdentificationString: string | null = sessionStorage.getItem('Identification');
      let existingIdentification: any[] = [];

      if (existingIdentificationString !== null) {
        existingIdentification = JSON.parse(existingIdentificationString);
      }

      // Check if the new Identification is different from the last one in the array
      if (existingIdentification.length === 0 || existingIdentification[existingIdentification.length - 1] !== Identification) {
        // Append the new Identification value to the existing array
        existingIdentification.push(Identification);

        // Store the updated array in session storage
        this.storeData('Identification', existingIdentification);
      }
    }
  }

  getCreditCardType(cardType: string): string {
    var MatchCreditCardNumber = cardType.replace(/\s/g, '');;
    var VisaPattern = /^4\d{12}(\d{3}|\d{6})?$/;
    var AmericanExpressPattern = /^3[47]\d{13}$/;
    var MasterCardPattern = /^5[1-5]\d{14}$/;
    var DiscoverPattern = /^6(011(0[0-9]|[2-4]\d|74|7[7-9]|8[6-9]|9[0-9])|4[4-9]\d{3}|5\d{4})\d{10}$/;
    if (VisaPattern.test(MatchCreditCardNumber)) {
      return this.creditCardTypeObj.visa;
    }
    else if (MasterCardPattern.test(MatchCreditCardNumber)) {
      return this.creditCardTypeObj.masterCard;
    }
    else if (AmericanExpressPattern.test(MatchCreditCardNumber)) {
      return this.creditCardTypeObj.americanExpress;
    }
    else if (DiscoverPattern.test(MatchCreditCardNumber)) {
      return this.creditCardTypeObj.discover;
    }
    else {
      return "";
    }
    // return cardType === this.creditCardTypeObj.americanExpressShort ? this.creditCardTypeObj.americanExpress :
    //   cardType === this.creditCardTypeObj.visa.toLowerCase() ? this.creditCardTypeObj.visa :
    //     cardType === this.creditCardTypeObj.masterCard.toLowerCase() ? this.creditCardTypeObj.masterCard :
    //       cardType === this.creditCardTypeObj.discover.toLowerCase() ? this.creditCardTypeObj.discover : "";
  }

  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const regex = /^[0-9]*$/; // Regular expression to allow only numbers

    if (!regex.test(inputElement.value)) {
      inputElement.value = inputElement.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    }

    if (inputElement.value.includes('e')) {
      inputElement.value = inputElement.value.replace('e', ''); // Remove the 'e' character if entered
    }
  }
}
