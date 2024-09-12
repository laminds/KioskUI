import { AfterViewInit, Component, NgZone, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { CommonType } from '../../Types/commonTypes';
import { Route, Router } from '@angular/router';
import SignaturePad from 'signature_pad';
import { memberPTPlanModel, memberShipPlanModel } from '../../models/memberplan-model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountTypeModel, AgreementModel, BankAccountInformationFormModel, BankingDetailObj, BillingInfoFormModel, CheckOutBillingModel, CreditCardTypeModel, InitialCheckOutModel, IsPTPrepaidCCard, IsPrepaidCCard, MonthModel, PTBankingDetailObj, PaymentInformationFormModel, PersonalInformationFormModel, PlanInitialInformationFormModel, StateModel, genderModel } from '../../models/checkoutInfo.model';
import { clubDetailsModel } from '../../models/clubDetailsModel';
import { HttpService } from 'src/app/core/services/http.service';
import { ApiMethod, AuthEndPoints, constMessage } from 'src/app/core/constant/const';
import { salesPersonModel } from '../../models/salesPersonModel';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { CheckoutService } from '../../services/checkout.service';
import { LeadModel } from '../../models/searchModel';
import { CreditCard } from 'angular-cc-library';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { plaidObj } from '../../models/plaid.model';
import { SalesPersonMissingModalPopupComponent } from 'src/app/shared/modal/sales-person-missing-modal-popup/sales-person-missing-modal-popup.component';
import { environment } from 'src/environments/environment.development';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})

export class CheckOutComponent implements OnInit, AfterViewInit {

  signPad: any;
  signPadInitial: any;
  @ViewChild('signPadCanvas', { static: false }) signaturePadElement: any;
  @ViewChild('signPadInitialCanvas', { static: false }) signaturePadElementInitial: any;
  commonTypeObj: CommonType | undefined;
  commonService: CommonService;
  path: string;
  slideNo: string;
  BannerClass: string;
  membershipPlanObj: memberShipPlanModel;
  membershipPTPlanObj: memberPTPlanModel;
  SGTPlanObj: memberPTPlanModel;
  registerObj: LeadModel;
  memberObj: LeadModel;
  creditCardTypeObj!: CreditCardTypeModel;
  before12year: Date;
  InitialCheckOutForm!: FormGroup<InitialCheckOutModel>;
  personalInfoModel!: FormGroup<PersonalInformationFormModel>;
  creditCardInformation!: FormGroup<PaymentInformationFormModel>;
  planInitialInformation!: FormGroup<PlanInitialInformationFormModel>;
  agreementTerms!: string;
  agreementNote!: string;
  agreementDescription!: string;
  billingInfo!: FormGroup<BillingInfoFormModel>;
  stateList: StateModel[];
  monthList: MonthModel[];
  yearList: string[] = [];
  billingObj!: CheckOutBillingModel;
  submitted: boolean;
  genderList: string[];
  activeIndex: number;
  salesPersonList: salesPersonModel[] = [];
  ProcessingFee!: string;
  searchFilter!: string;
  headerText: string;
  subHeaderText: string;
  PIText: string;
  paymentInfoText: string;
  billingInfoText: string;
  memberPlanText: string;
  PTPlanText: string;
  SGTPlanText: string;
  MPText: string;
  agreementUrl: SafeResourceUrl;
  SourceName: string;
  agreementType: string = "";
  showPassword: boolean;
  showPasswordOnPress: boolean;
  enableMembershipAgreementContractChecked: boolean;
  enablePTAgreementContractChecked: boolean;
  fname!: string;
  lname!: string;
  accno!: string;
  routingNo!: string;
  accType!: string;
  paymentType!: any;
  PTfname!: string;
  PTlname!: string;
  PTaccno!: string;
  PTroutingNo!: string;
  PTaccType!: string;
  PTpaymentType!: any;
  PTPaymentCopyObj: any;
  secondaryPTPaymentCopyObj: any;
  PrivacyPolicy: string;
  personalObj: any;
  IsSecondaryCCDetails: boolean;
  IsPTSecondaryCCDetails: boolean;
  IsPlaid: boolean;
  showdraftAccount: boolean;
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
  agreementContractObj = {
    memberShipTypeAgreement: "MemberShipAgreement",
    ptTypeAgreement: "PTAgreement",
    mtmMembershipPlan: "MonthToMonth",
    yearlyMembershipPlan: "Term",
    sgtTypeAgreement: "SGTAgreement"
  }
  plaidObj!: plaidObj;
  LinkToken!: string;
  LinkToken_requestid!: string;
  Linktoken_expired!: string;
  PlaidID!: number;
  $window: any;
  accountList: any;
  screenWidth: number;
  screenHeight: number;
  width: number;
  Signaturewidth: number;
  CheckPTOneTimeCC: boolean;
  CheckOneTimeCC: boolean;
  PTCCNumberList: any[];
  CCNumberList: any[];
  IsPTUserChangedPrepaidCard: boolean;
  IsPTPrepaidCC: boolean;
  IsUserChangedPrepaidCard: boolean;
  IsPrepaidCC: boolean;
  PTbankDetails: any;
  PTcreditDetails: any;
  bankDetailsInfo: any;
  creditDetailsInfo: any;
  today: any;
  buttonDisabled: boolean | any;
  IsRecurringPaymentFlag: boolean | any;

  constructor(
    private _commonService: CommonService,
    private _router: Router,
    private _http: HttpService,
    private toastr: ToastrService,
    private _checkOutService: CheckoutService,
    private modalService: NgbModal,
    private ngZone: NgZone,
    private sanitizer: DomSanitizer,
    private oauthService: OAuthService
  ) {

    this.path = '';
    this.slideNo = '';
    this.BannerClass = '';
    this.commonService = _commonService;
    this.SourceName = window.sessionStorage.getItem("SourceName")!;
    this.registerObj = JSON.parse(window.sessionStorage.getItem("RegisterObj")!);
    this.memberObj = JSON.parse(window.sessionStorage.getItem("MemberObj")!);
    this.membershipPlanObj = JSON.parse(window.sessionStorage.getItem("PlanObj")!);
    this.membershipPTPlanObj = JSON.parse(window.sessionStorage.getItem("PTPlanObj")!);
    this.SGTPlanObj = JSON.parse(window.sessionStorage.getItem("SmallGroupPlanObj")!);

    this.before12year = new Date();
    this.before12year.setFullYear(this.before12year.getFullYear() - 12);
    this.genderList = ["Male", "Female"];
    this.activeIndex = 0;
    this.stateList = [];
    this.monthList = [];
    this.headerText = constMessage.checkOut.headerText;
    this.subHeaderText = constMessage.checkOut.subHeaderText;
    this.PIText = constMessage.checkOut.PIText;
    this.paymentInfoText = constMessage.checkOut.paymentInfoText;
    this.billingInfoText = constMessage.checkOut.billingInfoText;
    this.memberPlanText = constMessage.checkOut.memberPlanText;
    this.PTPlanText = constMessage.checkOut.PTPlanText;
    this.SGTPlanText = constMessage.checkOut.SGTPlanText;
    this.MPText = constMessage.checkOut.MPText;
    this.agreementUrl = "";
    this.accountList = this.commonService.accountList;
    this.creditCardTypeObj = this._commonService.creditCardTypeObj;
    this.enableMembershipAgreementContractChecked = false;
    this.enablePTAgreementContractChecked = false;
    this.PrivacyPolicy = constMessage.checkOut.PrivacyPolicy;
    this.screenWidth = 0;
    this.screenHeight = 0;
    this.width = 0;
    this.Signaturewidth = 0;
    this.getScreenSizeForESignature();
    this.showPassword = false;
    this.showdraftAccount = true;
    this.showPasswordOnPress = false;
    this.CheckPTOneTimeCC = false;
    this.CheckOneTimeCC = false;
    this.PTCCNumberList = [];
    this.CCNumberList = [];
    this.IsPTUserChangedPrepaidCard = false;
    this.IsPTPrepaidCC = false;
    this.IsUserChangedPrepaidCard = false;
    this.IsPrepaidCC = false;
    this.PTbankDetails = {};
    this.PTcreditDetails = {};
    this.bankDetailsInfo = {};
    this.creditDetailsInfo = {};
    this.IsSecondaryCCDetails = false;
    this.IsPTSecondaryCCDetails = false;
    this.IsPlaid = false;
    this.today = new Date();
    this.IsRecurringPaymentFlag = false;

    this.InitialCheckOutForm = new FormGroup<InitialCheckOutModel>({
      personalInformation: new FormGroup<PersonalInformationFormModel>({
        firstName: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.pattern(this._commonService.nameValidPattern)]),
        lastName: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.pattern(this._commonService.nameValidPattern)]),
        phoneNumber: new FormControl('', [Validators.required]),
        DOB: new FormControl('', [Validators.required]),
        gender: new FormControl("", [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.pattern(this._commonService.emailPattern)]),
        salesPersonId: new FormControl(null),
        salesPersonObj: new FormControl(null),
        searchFilter: new FormControl('', { nonNullable: true }),
        HubSpotId: new FormControl(''),
        MemberId: new FormControl(''),
      }),

      billingInfo: new FormGroup<BillingInfoFormModel>({
        address: new FormControl('', [Validators.required, Validators.maxLength(40), Validators.pattern(this._commonService.addressPattern)]),
        city: new FormControl('', [Validators.required, Validators.maxLength(24), Validators.pattern(this._commonService.cityPattern)]),
        stateObj: new FormControl(null, [Validators.required]),
        state: new FormControl(''),
        zipCode: new FormControl('', [Validators.required, Validators.maxLength(5), Validators.pattern(this._commonService.zipCodePattern)]),
        searchFilter: new FormControl('', { nonNullable: true })
      }),

      paymentInformation: new FormGroup<PaymentInformationFormModel>({
        creditCardFirstName: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.pattern(this._commonService.nameValidPattern)]),
        creditCardLastName: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.pattern(this._commonService.nameValidPattern)]),
        creditCardNumber: new FormControl('', [Validators.required]),
        creditCardExpMonth: new FormControl(null, [Validators.required]),
        creditCardExpYear: new FormControl('', [Validators.required]),
        creditCardCVV: new FormControl('', [Validators.required, Validators.pattern(this._commonService.cvvNumberDigitPattern)]),
        creditCardZipCode: new FormControl('', [Validators.required,
        Validators.pattern(this._commonService.zipcodeNumberDigitPattern),
        Validators.minLength(2),]),
        creditCardType: new FormControl(''),
        searchFilter: new FormControl('', { nonNullable: true }),
        searchYearFilter: new FormControl('', { nonNullable: true })
      }),

      secondarypaymentInformation: new FormGroup<PaymentInformationFormModel>({
        creditCardFirstName: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.pattern(this._commonService.nameValidPattern)]),
        creditCardLastName: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.pattern(this._commonService.nameValidPattern)]),
        creditCardNumber: new FormControl('', [Validators.required]),
        creditCardExpMonth: new FormControl(null, [Validators.required]),
        creditCardExpYear: new FormControl('', [Validators.required]),
        creditCardCVV: new FormControl('', [Validators.required, Validators.pattern(this._commonService.cvvNumberDigitPattern)]),
        creditCardZipCode: new FormControl('', [Validators.required,
        Validators.pattern(this._commonService.zipcodeNumberDigitPattern),
        Validators.minLength(2),]),
        creditCardType: new FormControl(''),
        searchFilter: new FormControl('', { nonNullable: true }),
        searchYearFilter: new FormControl('', { nonNullable: true })
      }),

      PTpaymentInformation: new FormGroup<PaymentInformationFormModel>({
        creditCardFirstName: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.pattern(this._commonService.nameValidPattern)]),
        creditCardLastName: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.pattern(this._commonService.nameValidPattern)]),
        creditCardNumber: new FormControl('', [Validators.required]),
        creditCardExpMonth: new FormControl(null, [Validators.required]),
        creditCardExpYear: new FormControl('', [Validators.required]),
        creditCardCVV: new FormControl('', [Validators.required, Validators.pattern(this._commonService.cvvNumberDigitPattern)]),
        creditCardZipCode: new FormControl('', [Validators.required,
        Validators.pattern(this._commonService.zipcodeNumberDigitPattern),
        Validators.minLength(2),]),
        creditCardType: new FormControl(''),
        searchFilter: new FormControl('', { nonNullable: true }),
        searchYearFilter: new FormControl('', { nonNullable: true })
      }),

      secondaryPTpaymentInformation: new FormGroup<PaymentInformationFormModel>({
        creditCardFirstName: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.pattern(this._commonService.nameValidPattern)]),
        creditCardLastName: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.pattern(this._commonService.nameValidPattern)]),
        creditCardNumber: new FormControl('', [Validators.required]),
        creditCardExpMonth: new FormControl(null, [Validators.required]),
        creditCardExpYear: new FormControl('', [Validators.required]),
        creditCardCVV: new FormControl('', [Validators.required, Validators.pattern(this._commonService.cvvNumberDigitPattern)]),
        creditCardZipCode: new FormControl('', [Validators.required,
        Validators.pattern(this._commonService.zipcodeNumberDigitPattern),
        Validators.minLength(2),]),
        creditCardType: new FormControl(''),
        searchFilter: new FormControl('', { nonNullable: true }),
        searchYearFilter: new FormControl('', { nonNullable: true })
      }),
      
      bankingDetailObj: new FormGroup<BankingDetailObj>({
        IsSameAsAbove: new FormControl(false),
        IsUseBankingDetails: new FormControl(null, [Validators.required]),
        DraftAccountFirstName: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.pattern(this._commonService.nameValidPattern)]),
        DraftAccountLastName: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.pattern(this._commonService.nameValidPattern)]),
        DraftAccountNumber: new FormControl('', [Validators.required, Validators.pattern(this._commonService.accountNumberDigitPattern)]),
        DraftAccountRoutingNumber: new FormControl('', [Validators.required, Validators.pattern(this._commonService.routingNumberDigitPattern)]),
        DraftAccountObj: new FormControl(null, [Validators.required]),
        DraftAccountType: new FormControl(''),
        PaymentType: new FormControl(''),
      }),

      PTbankingDetailObj: new FormGroup<PTBankingDetailObj>({
        IsPTUseBankingDetails: new FormControl(null),
        PTDraftAccountFirstName: new FormControl(''),
        PTDraftAccountLastName: new FormControl(''),
        PTDraftAccountNumber: new FormControl(''),
        PTDraftAccountRoutingNumber: new FormControl(''),
        PTDraftAccountObj: new FormControl(null),
        PTDraftAccountType: new FormControl(''),
        PTPaymentType: new FormControl(''),
      }),

      IsPrepaidCCard: new FormGroup<IsPrepaidCCard>({
        IsPrepaidCreditCard: new FormControl(false),
        IsUserChangedPrepaidCard: new FormControl(false)
      }),

      IsPTPrepaidCCard: new FormGroup<IsPTPrepaidCCard>({
        IsPrepaidCreditCard: new FormControl(false),
        IsUserChangedPrepaidCard: new FormControl(false)
      }),

      planInitialInformation: new FormGroup<PlanInitialInformationFormModel>({
        ClubNumber: new FormControl(''),
        PlanId: new FormControl(''),
        clubName: new FormControl(''),
        PlanName: new FormControl(''),
        PTPlanName: new FormControl(''),
        PlanPrice: new FormControl(''),
        PTPlanId: new FormControl(''),
        PtPlanNameType: new FormControl(''),
        PTPlanType: new FormControl(''),
        SmallGroupPlanId: new FormControl(''),
        SmallGroupValidationHash: new FormControl(''),
        PlanType: new FormControl(''),
        PlanBiweeklyType: new FormControl(''),
        PTValidationHash: new FormControl(''),
        NewEntrySource: new FormControl(),
        RecurringServiceId: new FormControl(''),
        SignatureBody: new FormControl(''),
        InitialSignatureBody: new FormControl(''),
        agreementNumber: new FormControl(''),
        PlanTypeDetail: new FormControl(''),
        IsRoutingBankAccount: new FormControl(''),
        isThirtyDayNoticeChecked: new FormControl(false, [Validators.requiredTrue]),
        isAuthorizationTermsChecked: new FormControl(false, [Validators.requiredTrue]),
        isMembershipAgreementContractChecked: new FormControl(false, [Validators.requiredTrue]),
        isPTAgreementContractChecked: new FormControl(false, [Validators.requiredTrue]),
        isTermsConditionChecked: new FormControl(false, [Validators.requiredTrue]),
        RecurringPaymentMethod: new FormControl(''),
        PTRecurringPaymentMethod: new FormControl(''),
        IsRecurringPaymentFlag: new FormControl(false),
        MemberPlanDetailsJson: new FormControl(''),
        PTPlanDetailsJson: new FormControl(''),
        SGTPlanDetailsJson: new FormControl('')
      })
    });

    this.submitted = false;
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
    this._commonService.setServiceName(window.sessionStorage.getItem("ServiceName")!);
    this.getSalesPersonList();
    this.GetClubViseProcessingFee();
    this.monthList = this._commonService.monthList;
    this.stateList = this._commonService.stateList;
    this._commonService.setBodyHeightSize();
    this.InitialCheckOutForm.get('bankingDetailObj.IsUseBankingDetails')?.setValue(true);
    this.InitialCheckOutForm.get('PTbankingDetailObj.IsPTUseBankingDetails')?.setValue(true);
    this.removeValidatorsCreditCardsecondary();
    this.removeValidatorsPTCreditCardsecondary();
    this.showdraftAccount = true;

    for (let i: number = new Date().getFullYear(); i <= (new Date().getFullYear() + 15); i++) {
      var year = i.toString();
      this.yearList.push(year);
    }
    this.billingObj = {
      clubNumber: Number(window.sessionStorage.getItem("ClubNumber")!),
      planId: this.membershipPlanObj ? this.membershipPlanObj.planId : null,
      source: "",
      sourceName: window.sessionStorage.getItem("SourceName")!,
      clubName: window.sessionStorage.getItem("ClubName")!,
      agreementNumber: this.registerObj ? this.registerObj.agreementNumber : null
    }
    if (this.membershipPlanObj) {
      this.agreementTerms = atob(this.membershipPlanObj.agreementTerms);
      this.agreementNote = atob(this.membershipPlanObj.agreementNote);
      this.agreementDescription = atob(this.membershipPlanObj.agreementDescription);
    }
    var regobj;
    if (this.SourceName == this._commonService.commonTypeObj.member.personalTrainingType) {
      regobj = JSON.parse(window.sessionStorage.getItem("MemberObj")!);
    }
    else {
      regobj = JSON.parse(window.sessionStorage.getItem("RegisterObj")!);
    }


    this.InitialCheckOutForm.get('personalInformation.firstName')?.setValue(regobj?.firstName);
    this.InitialCheckOutForm.get('personalInformation.lastName')?.setValue(regobj?.lastName);
    this.InitialCheckOutForm.get('personalInformation.email')?.setValue(regobj?.email);
    this.InitialCheckOutForm.get('personalInformation.phoneNumber')?.setValue(regobj?.phoneNumber);
    this.InitialCheckOutForm.get('personalInformation.DOB')?.setValue(regobj.dob);
    this.InitialCheckOutForm.get('personalInformation.gender')?.setValue(regobj.gender);
    this.InitialCheckOutForm.get('planInitialInformation.RecurringPaymentMethod')?.setValue("EFT");
  }

  @HostListener('window:resize', ['$event'])
  getScreenSizeForESignature(_event?: Event) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    if (this.screenWidth == 820 && this.screenHeight == 1180) {
      this.width = 670;
    }
    else if (this.screenWidth >= 1400) {
      this.width = 1250;
    }
    else if (this.screenWidth <= 1399 && this.screenWidth >= 1296) {
      this.width = 1070;
    }
    else if (this.screenWidth < 1296 && this.screenWidth >= 1200) {
      this.width = 1050;
    }
    else if (this.screenWidth <= 1199 && this.screenWidth >= 992) {
      this.width = 890;
    }
    else if (this.screenWidth < 992 && this.screenWidth >= 768) {
      this.width = 650;
    }
    else if (this.screenWidth < 768 && this.screenWidth >= 576) {
      this.width = 470;
    }
    else if (this.screenWidth < 576 && this.screenWidth >= 425) {
      this.width = 350;
    }
    else if (this.screenWidth < 425 && this.screenWidth >= 366) {
      this.width = 300;
    }
    else if (this.screenWidth < 366) {
      this.width = 250;
    }
    else {
      this.width = 670;
    }
  }

  ngAfterViewInit() {
    this.signPad = new SignaturePad(this.signaturePadElement.nativeElement);
    this.signPadInitial = new SignaturePad(this.signaturePadElementInitial.nativeElement);
    if (this.membershipPTPlanObj != null || this.SGTPlanObj != null) {
    }
    if (this.SourceName != this._commonService.commonTypeObj.member.personalTrainingType) {
    }
    this.InitialCheckOutForm.get('personalInformation.firstName')?.disable({ onlySelf: true });
    this.InitialCheckOutForm.get('personalInformation.lastName')?.disable({ onlySelf: true });
    this.InitialCheckOutForm.get('personalInformation.email')?.disable({ onlySelf: true });
    this.InitialCheckOutForm.get('personalInformation.phoneNumber')?.disable({ onlySelf: true });
    this.InitialCheckOutForm.get('personalInformation.DOB')?.disable({ onlySelf: true });
    this.InitialCheckOutForm.get('personalInformation.gender')?.disable({ onlySelf: true });
    this._commonService.setBodyHeightSize();
  }

  @ViewChild('myadreesRef') myadreesRef!: ElementRef;
  @ViewChild('myCityRef') myCityRef!: ElementRef;
  @ViewChild('mystateRef') mystateRef!: ElementRef;
  @ViewChild('myzipCodeRef') myzipCodeRef!: ElementRef;
  @ViewChild('DraftAccountFirstName') DraftAccountFirstName!: ElementRef;
  @ViewChild('DraftAccountLastName') DraftAccountLastName!: ElementRef;
  @ViewChild('DraftAccountObj') DraftAccountObj!: ElementRef;
  @ViewChild('DraftAccountRoutingNumber') DraftAccountRoutingNumber!: ElementRef;
  @ViewChild('DraftAccountNumber') DraftAccountNumber!: ElementRef;
  @ViewChild('mycreditCardFirstNameRef') mycreditCardFirstNameRef!: ElementRef;
  @ViewChild('mycreditCardLastNameRef') mycreditCardLastNameRef!: ElementRef;
  @ViewChild('myccNumberRef') myccNumberRef!: ElementRef;
  @ViewChild('mycreditCardExpMonthRef') mycreditCardExpMonthRef!: ElementRef;
  @ViewChild('mycreditCardExpYearRef') mycreditCardExpYearRef!: ElementRef;
  @ViewChild('mycreditCardCVVRef') mycreditCardCVVRef!: ElementRef;
  @ViewChild('mycreditCardZipCodeRef') mycreditCardZipCodeRef!: ElementRef;
  @ViewChild('mycreditCardFirstNameRefsecondary') mycreditCardFirstNameRefsecondary!: ElementRef;
  @ViewChild('mycreditCardLastNameRefsecondary') mycreditCardLastNameRefsecondary!: ElementRef;
  @ViewChild('myccNumberRefsecondary') myccNumberRefsecondary!: ElementRef;
  @ViewChild('mycreditCardExpMonthRefsecondary') mycreditCardExpMonthRefsecondary!: ElementRef;
  @ViewChild('mycreditCardExpYearRefsecondary') mycreditCardExpYearRefsecondary!: ElementRef;
  @ViewChild('mycreditCardCVVRefsecondary') mycreditCardCVVRefsecondary!: ElementRef;
  @ViewChild('mycreditCardZipCodeRefsecondary') mycreditCardZipCodeRefsecondary!: ElementRef;
  @ViewChild('myPTcreditCardFirstNameRef') myPTcreditCardFirstNameRef!: ElementRef;
  @ViewChild('myPTcreditCardLastNameRef') myPTcreditCardLastNameRef!: ElementRef;
  @ViewChild('myPTccNumberRef') myPTccNumberRef!: ElementRef;
  @ViewChild('myPTcreditCardExpMonthRef') myPTcreditCardExpMonthRef!: ElementRef;
  @ViewChild('myPTcreditCardExpYearRef') myPTcreditCardExpYearRef!: ElementRef;
  @ViewChild('myPTcreditCardCVVRef') myPTcreditCardCVVRef!: ElementRef;
  @ViewChild('myPTcreditCardZipCodeRef') myPTcreditCardZipCodeRef!: ElementRef;
  @ViewChild('myPTcreditCardFirstNameRefsecondary') myPTcreditCardFirstNameRefsecondary!: ElementRef;
  @ViewChild('myPTcreditCardLastNameRefsecondary') myPTcreditCardLastNameRefsecondary!: ElementRef;
  @ViewChild('myPTccNumberRefsecondary') myPTccNumberRefsecondary!: ElementRef;
  @ViewChild('myPTcreditCardExpMonthRefsecondary') myPTcreditCardExpMonthRefsecondary!: ElementRef;
  @ViewChild('myPTcreditCardExpYearRefsecondary') myPTcreditCardExpYearRefsecondary!: ElementRef;
  @ViewChild('myPTcreditCardCVVRefsecondary') myPTcreditCardCVVRefsecondary!: ElementRef;
  @ViewChild('myPTcreditCardZipCodeRefsecondary') myPTcreditCardZipCodeRefsecondary!: ElementRef;
  @ViewChild('myMembershipAgreementContractRef') myMembershipAgreementContractRef!: ElementRef;
  @ViewChild('myPTAgreementContractRef') myPTAgreementContractRef!: ElementRef;
  @ViewChild('myermsConditionRef') myermsConditionRef!: ElementRef;
  @ViewChild('myuthorizationTermsRef') myuthorizationTermsRef!: ElementRef;
  @ViewChild('myThirtyDayNoticeRef') myThirtyDayNoticeRef!: ElementRef;

  setFocus() {

    // Check if the input element exists and set focus
    var creditCardCVV: any = this.InitialCheckOutForm.get('paymentInformation.creditCardCVV')?.value;
    var secondarycreditCardCVV: any = this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardCVV')?.value;
    var PTcreditCardCVV: any = this.InitialCheckOutForm.get('PTpaymentInformation.creditCardCVV')?.value;
    var secondaryPTcreditCardCVV: any = this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardCVV')?.value;
    var DraftAccountNumber: any = this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountNumber')?.value;
    var DraftAccountRoutingNumber = this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountRoutingNumber')?.value;

    var IsUseBankingDetails = this.InitialCheckOutForm.controls.bankingDetailObj.controls.IsUseBankingDetails.value;
    var IsPTUseBankingDetails = this.InitialCheckOutForm.controls.PTbankingDetailObj.controls.IsPTUseBankingDetails.value;

    if (this.myadreesRef && this.myadreesRef.nativeElement && !this.InitialCheckOutForm.get('billingInfo.address')?.value) {
      this.myadreesRef.nativeElement.focus();
    }
    else if (this.myCityRef && this.myCityRef.nativeElement && !this.InitialCheckOutForm.get('billingInfo.city')?.value) {
      this.myCityRef.nativeElement.focus();
    }
    else if (this.mystateRef && this.mystateRef.nativeElement && !this.InitialCheckOutForm.get('billingInfo.stateObj')?.value) {
      this.mystateRef.nativeElement.focus();
    }
    else if (this.myzipCodeRef && this.myzipCodeRef.nativeElement && (!this.InitialCheckOutForm.get('billingInfo.zipCode')?.value || this.InitialCheckOutForm.get('billingInfo.zipCode')?.value?.length != 5)) {
      this.myzipCodeRef.nativeElement.focus();
    }
    else if (this.mycreditCardFirstNameRef && this.mycreditCardFirstNameRef.nativeElement && !this.InitialCheckOutForm.get('paymentInformation.creditCardFirstName')?.value) {
      this.mycreditCardFirstNameRef.nativeElement.focus();
    }
    else if (this.mycreditCardLastNameRef && this.mycreditCardLastNameRef.nativeElement && !this.InitialCheckOutForm.get('paymentInformation.creditCardLastName')?.value) {
      this.mycreditCardLastNameRef.nativeElement.focus();
    }
    else if (this.myccNumberRef && this.myccNumberRef.nativeElement && !this.InitialCheckOutForm.get('paymentInformation.creditCardNumber')?.value) {
      this.myccNumberRef.nativeElement.focus();
    }
    else if (this.mycreditCardExpMonthRef && this.mycreditCardExpMonthRef.nativeElement && !this.InitialCheckOutForm.get('paymentInformation.creditCardExpMonth')?.value) {
      this.mycreditCardExpMonthRef.nativeElement.focus();
    }
    else if (this.mycreditCardExpYearRef && this.mycreditCardExpYearRef.nativeElement && !this.InitialCheckOutForm.get('paymentInformation.creditCardExpYear')?.value) {
      this.mycreditCardExpYearRef.nativeElement.focus();
    }
    else if (this.mycreditCardCVVRef && this.mycreditCardCVVRef.nativeElement && (!this.InitialCheckOutForm.get('paymentInformation.creditCardCVV')?.value || (creditCardCVV.length < 3))) {
      this.mycreditCardCVVRef.nativeElement.focus();
    }
    else if (this.mycreditCardZipCodeRef && this.mycreditCardZipCodeRef.nativeElement && (!this.InitialCheckOutForm.get('paymentInformation.creditCardZipCode')?.value || this.InitialCheckOutForm.get('paymentInformation.creditCardZipCode')?.value?.length != 5)) {
      this.mycreditCardZipCodeRef.nativeElement.focus();
    }
    else if (this.DraftAccountFirstName && this.DraftAccountFirstName.nativeElement && (!this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountFirstName')?.value)) {
      this.DraftAccountFirstName.nativeElement.focus();
    }
    else if (this.DraftAccountLastName && this.DraftAccountLastName.nativeElement && (!this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountLastName')?.value)) {
      this.DraftAccountLastName.nativeElement.focus();
    }
    else if (this.DraftAccountObj && this.DraftAccountObj.nativeElement && (!this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountObj')?.value)) {
      this.DraftAccountObj.nativeElement.focus();
    }
    else if (this.DraftAccountRoutingNumber && this.DraftAccountRoutingNumber.nativeElement && (!this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountRoutingNumber')?.value || (DraftAccountRoutingNumber?.length != 9))) {
      this.DraftAccountRoutingNumber.nativeElement.focus();
    }
    else if (this.DraftAccountNumber && this.DraftAccountNumber.nativeElement && (!this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountNumber')?.value || DraftAccountNumber.length < 8 || DraftAccountNumber.length > 17)) {
      this.DraftAccountNumber.nativeElement.focus();
    }
   else if (IsUseBankingDetails == null &&
      (this.mycreditCardFirstNameRefsecondary && this.mycreditCardFirstNameRefsecondary.nativeElement && !this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardFirstName')?.value)) {
      this.mycreditCardFirstNameRefsecondary.nativeElement.focus();
    }
    else if (IsUseBankingDetails == null &&
      (this.mycreditCardLastNameRefsecondary && this.mycreditCardLastNameRefsecondary.nativeElement && !this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardLastName')?.value)) {
      this.mycreditCardLastNameRefsecondary.nativeElement.focus();
    }
    else if (IsUseBankingDetails == null &&
      (this.myccNumberRefsecondary && this.myccNumberRefsecondary.nativeElement && !this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardNumber')?.value)) {
      this.myccNumberRefsecondary.nativeElement.focus();
    }
    else if (IsUseBankingDetails == null &&
      (this.mycreditCardExpMonthRefsecondary && this.mycreditCardExpMonthRefsecondary.nativeElement && !this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardExpMonth')?.value)) {
      this.mycreditCardExpMonthRefsecondary.nativeElement.focus();
    }
    else if (IsUseBankingDetails == null &&
      (this.mycreditCardExpYearRefsecondary && this.mycreditCardExpYearRefsecondary.nativeElement && !this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardExpYear')?.value)) {
      this.mycreditCardExpYearRefsecondary.nativeElement.focus();
    }
    else if (IsUseBankingDetails == null &&
      (this.mycreditCardCVVRefsecondary && this.mycreditCardCVVRefsecondary.nativeElement && (!this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardCVV')?.value || (secondarycreditCardCVV.length < 3)))) {
      this.mycreditCardCVVRefsecondary.nativeElement.focus();
    }
    else if (IsUseBankingDetails == null &&
      (this.mycreditCardZipCodeRefsecondary && this.mycreditCardZipCodeRefsecondary.nativeElement && (!this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardZipCode')?.value
        || this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardZipCode')?.value?.length != 5))) {
      this.mycreditCardZipCodeRefsecondary.nativeElement.focus();
    }
    else if (this.membershipPTPlanObj != null || this.SGTPlanObj != null) {
      if (this.myPTcreditCardFirstNameRef && this.myPTcreditCardFirstNameRef.nativeElement && !this.InitialCheckOutForm.get('PTpaymentInformation.creditCardFirstName')?.value) {
        this.myPTcreditCardFirstNameRef.nativeElement.focus();
      }
      else if (this.myPTcreditCardLastNameRef && this.myPTcreditCardLastNameRef.nativeElement && !this.InitialCheckOutForm.get('PTpaymentInformation.creditCardLastName')?.value) {
        this.myPTcreditCardLastNameRef.nativeElement.focus();
      }
      else if (this.myPTccNumberRef && this.myPTccNumberRef.nativeElement && !this.InitialCheckOutForm.get('PTpaymentInformation.creditCardNumber')?.value) {
        this.myPTccNumberRef.nativeElement.focus();
      }
      else if (this.myPTcreditCardExpMonthRef && this.myPTcreditCardExpMonthRef.nativeElement && !this.InitialCheckOutForm.get('PTpaymentInformation.creditCardExpMonth')?.value) {
        this.myPTcreditCardExpMonthRef.nativeElement.focus();
      }
      else if (this.myPTcreditCardExpYearRef && this.myPTcreditCardExpYearRef.nativeElement && !this.InitialCheckOutForm.get('PTpaymentInformation.creditCardExpYear')?.value) {
        this.myPTcreditCardExpYearRef.nativeElement.focus();
      }
      else if (this.myPTcreditCardCVVRef && this.myPTcreditCardCVVRef.nativeElement && (!this.InitialCheckOutForm.get('PTpaymentInformation.creditCardCVV')?.value || (PTcreditCardCVV.length < 3))) {
        this.myPTcreditCardCVVRef.nativeElement.focus();
      }
      else if (this.myPTcreditCardZipCodeRef && this.myPTcreditCardZipCodeRef.nativeElement && (!this.InitialCheckOutForm.get('PTpaymentInformation.creditCardZipCode')?.value || this.InitialCheckOutForm.get('PTpaymentInformation.creditCardZipCode')?.value?.length != 5)) {
        this.myPTcreditCardZipCodeRef.nativeElement.focus();
      }
      else if (IsPTUseBankingDetails == null &&
        (this.myPTcreditCardFirstNameRefsecondary && this.myPTcreditCardFirstNameRefsecondary.nativeElement && !this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardFirstName')?.value)) {
        this.myPTcreditCardFirstNameRefsecondary.nativeElement.focus();
      }
      else if (IsPTUseBankingDetails == null &&
        (this.myPTcreditCardLastNameRefsecondary && this.myPTcreditCardLastNameRefsecondary.nativeElement && !this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardLastName')?.value)) {
        this.myPTcreditCardLastNameRefsecondary.nativeElement.focus();
      }
      else if (IsPTUseBankingDetails == null &&
        (this.myPTccNumberRefsecondary && this.myPTccNumberRefsecondary.nativeElement && !this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardNumber')?.value)) {
        this.myPTccNumberRefsecondary.nativeElement.focus();
      }
      else if (IsPTUseBankingDetails == null &&
        (this.myPTcreditCardExpMonthRefsecondary && this.myPTcreditCardExpMonthRefsecondary.nativeElement && !this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardExpMonth')?.value)) {
        this.myPTcreditCardExpMonthRefsecondary.nativeElement.focus();
      }
      else if (IsPTUseBankingDetails == null &&
        (this.myPTcreditCardExpYearRefsecondary && this.myPTcreditCardExpYearRefsecondary.nativeElement && !this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardExpYear')?.value)) {
        this.myPTcreditCardExpYearRefsecondary.nativeElement.focus();
      }
      else if (IsPTUseBankingDetails == null && (
        this.myPTcreditCardCVVRefsecondary && this.myPTcreditCardCVVRefsecondary.nativeElement && (!this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardCVV')?.value || (secondaryPTcreditCardCVV.length < 3)))) {
        this.myPTcreditCardCVVRefsecondary.nativeElement.focus();
      }
      else if (IsPTUseBankingDetails == null &&
        (this.myPTcreditCardZipCodeRefsecondary && this.myPTcreditCardZipCodeRefsecondary.nativeElement && (!this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardZipCode')?.value
          || this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardZipCode')?.value?.length != 5))) {
        this.myPTcreditCardZipCodeRefsecondary.nativeElement.focus();
      }
      else if (this.myMembershipAgreementContractRef && this.myMembershipAgreementContractRef.nativeElement && !this.InitialCheckOutForm.get('planInitialInformation.isMembershipAgreementContractChecked')?.value) {
        this.myMembershipAgreementContractRef.nativeElement.focus();
      }
      else if ((this.membershipPTPlanObj != null) && this.myPTAgreementContractRef && this.myPTAgreementContractRef.nativeElement && !this.InitialCheckOutForm.get('planInitialInformation.isPTAgreementContractChecked')?.value) {
        this.myPTAgreementContractRef.nativeElement.focus();
      }
      else if (this.myermsConditionRef && this.myermsConditionRef.nativeElement && this.SourceName != this.commonService.commonTypeObj.member.personalTrainingType && !this.InitialCheckOutForm.get('planInitialInformation.isTermsConditionChecked')?.value) {
        this.myermsConditionRef.nativeElement.focus();
      }
      else if (this.myuthorizationTermsRef && this.myuthorizationTermsRef.nativeElement && !this.InitialCheckOutForm.get('planInitialInformation.isAuthorizationTermsChecked')?.value) {
        this.myuthorizationTermsRef.nativeElement.focus();
      }
    }
    else if (this.myMembershipAgreementContractRef && this.myMembershipAgreementContractRef.nativeElement && !this.InitialCheckOutForm.get('planInitialInformation.isMembershipAgreementContractChecked')?.value) {
      this.myMembershipAgreementContractRef.nativeElement.focus();
    }
    else if ((this.membershipPTPlanObj != null) && this.myPTAgreementContractRef && this.myPTAgreementContractRef.nativeElement && !this.InitialCheckOutForm.get('planInitialInformation.isPTAgreementContractChecked')?.value) {
      this.myPTAgreementContractRef.nativeElement.focus();
    }
    else if (this.myermsConditionRef && this.myermsConditionRef.nativeElement && this.SourceName != this.commonService.commonTypeObj.member.personalTrainingType && !this.InitialCheckOutForm.get('planInitialInformation.isTermsConditionChecked')?.value) {
      this.myermsConditionRef.nativeElement.focus();
    }
    else if (this.myuthorizationTermsRef && this.myuthorizationTermsRef.nativeElement && !this.InitialCheckOutForm.get('planInitialInformation.isAuthorizationTermsChecked')?.value) {
      this.myuthorizationTermsRef.nativeElement.focus();
    }
  }

  get form() { return this.InitialCheckOutForm.controls; }
  Isadreesfocus = false
  redirectToCheckOut = (InitialCheckOutData: FormGroup<InitialCheckOutModel>, signature: SignaturePad, initialSignature: SignaturePad) => {
    debugger
    var creditCardCVV: any = this.InitialCheckOutForm.get('paymentInformation.creditCardCVV')?.value;
    var secondarycreditCardCVV: any = this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardCVV')?.value;
    var PTcreditCardCVV: any = this.InitialCheckOutForm.get('PTpaymentInformation.creditCardCVV')?.value;
    var secondaryPTcreditCardCVV: any = this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardCVV')?.value;
    var DraftAccountNumber: any = this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountNumber')?.value;

    var IsUseBankingDetails = this.InitialCheckOutForm.controls.bankingDetailObj.controls.IsUseBankingDetails.value;
    var IsPTUseBankingDetails = this.InitialCheckOutForm.controls.PTbankingDetailObj.controls.IsPTUseBankingDetails.value;
    //#region Set Focus
    if (!this.InitialCheckOutForm.get('billingInfo.address')?.value) {
      this.setFocus();
    }
    else if (!this.InitialCheckOutForm.get('billingInfo.city')?.value) {
      this.setFocus();
    }
    else if (!this.InitialCheckOutForm.get('billingInfo.stateObj')?.value) {
      this.setFocus();
    }
    else if (!this.InitialCheckOutForm.get('billingInfo.zipCode')?.value || this.InitialCheckOutForm.get('billingInfo.zipCode')?.value?.length != 5) {
      this.setFocus();
    }
    else if (!this.InitialCheckOutForm.get('paymentInformation.creditCardFirstName')?.value) {
      this.setFocus();
    }
    else if (!this.InitialCheckOutForm.get('paymentInformation.creditCardLastName')?.value) {
      this.setFocus();
    }
    else if (!this.InitialCheckOutForm.get('paymentInformation.creditCardNumber')?.value) {
      this.setFocus();
    }
    else if (!this.InitialCheckOutForm.get('paymentInformation.creditCardExpMonth')?.value) {
      this.setFocus();
    }
    else if (!this.InitialCheckOutForm.get('paymentInformation.creditCardExpYear')?.value) {
      this.setFocus();
    }
    else if (!this.InitialCheckOutForm.get('paymentInformation.creditCardCVV')?.value || (creditCardCVV.length < 3)) {
      this.setFocus();
    }
    else if (!this.InitialCheckOutForm.get('paymentInformation.creditCardZipCode')?.value || this.InitialCheckOutForm.get('paymentInformation.creditCardZipCode')?.value?.length != 5) {
      this.setFocus();
    }
    else if (this.showdraftAccount && !this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountFirstName')?.value) {
      this.setFocus();
    }
    else if (this.showdraftAccount && !this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountLastName')?.value) {
      this.setFocus();
    }
    else if (this.showdraftAccount && !this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountObj')?.value) {
      this.setFocus();
    }
    else if (this.showdraftAccount && (!this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountRoutingNumber')?.value || this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountRoutingNumber')?.value?.length != 9)) {
      this.setFocus();
    }
    else if (this.showdraftAccount && (!this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountNumber')?.value || DraftAccountNumber.length < 8 || DraftAccountNumber.length > 17)) {
      this.setFocus();
    }
    else if (IsUseBankingDetails == null && (!this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardFirstName')?.value)) {
      this.setFocus();
    }
    else if (IsUseBankingDetails == null && (!this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardLastName')?.value)) {
      this.setFocus();
    }
    else if (IsUseBankingDetails == null && (!this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardNumber')?.value)) {
      this.setFocus();
    }
    else if (IsUseBankingDetails == null && (!this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardExpMonth')?.value)) {
      this.setFocus();
    }
    else if (IsUseBankingDetails == null && (!this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardExpYear')?.value)) {
      this.setFocus();
    }
    else if (IsUseBankingDetails == null && (!this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardCVV')?.value || (secondarycreditCardCVV.length < 3))) {
      this.setFocus();
    }
    else if (IsUseBankingDetails == null &&
      (!this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardZipCode')?.value || this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardZipCode')?.value?.length != 5)) {
      this.setFocus();
    }
    else if (this.membershipPTPlanObj != null || this.SGTPlanObj != null) {
      if (!this.InitialCheckOutForm.get('PTpaymentInformation.creditCardFirstName')?.value) {
        this.setFocus();
      }
      else if (!this.InitialCheckOutForm.get('PTpaymentInformation.creditCardLastName')?.value) {
        this.setFocus();
      }
      else if (!this.InitialCheckOutForm.get('PTpaymentInformation.creditCardNumber')?.value) {
        this.setFocus();
      }
      else if (!this.InitialCheckOutForm.get('PTpaymentInformation.creditCardExpMonth')?.value) {
        this.setFocus();
      }
      else if (!this.InitialCheckOutForm.get('PTpaymentInformation.creditCardExpYear')?.value) {
        this.setFocus();
      }
      else if (!this.InitialCheckOutForm.get('PTpaymentInformation.creditCardCVV')?.value || (PTcreditCardCVV.length < 3)) {
        this.setFocus();
      }
      else if (!this.InitialCheckOutForm.get('PTpaymentInformation.creditCardZipCode')?.value || this.InitialCheckOutForm.get('PTpaymentInformation.creditCardZipCode')?.value?.length != 5) {
        this.setFocus();
      }
      else if (IsPTUseBankingDetails == null && (!this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardFirstName')?.value)) {
        this.setFocus();
      }
      else if (IsPTUseBankingDetails == null && (!this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardLastName')?.value)) {
        this.setFocus();
      }
      else if (IsPTUseBankingDetails == null && (!this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardNumber')?.value)) {
        this.setFocus();
      }
      else if (IsPTUseBankingDetails == null && (!this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardExpMonth')?.value)) {
        this.setFocus();
      }
      else if (IsPTUseBankingDetails == null && (!this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardExpYear')?.value)) {
        this.setFocus();
      }
      else if (IsPTUseBankingDetails == null && (!this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardCVV')?.value || (secondaryPTcreditCardCVV.length < 3))) {
        this.setFocus();
      }
      else if (IsPTUseBankingDetails == null &&
        (!this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardZipCode')?.value || this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardZipCode')?.value?.length != 5)) {
        this.setFocus();
      }
      else if (!this.InitialCheckOutForm.get('planInitialInformation.isMembershipAgreementContractChecked')?.value) {
        this.setFocus();
      }
      else if (this.membershipPTPlanObj != null && !this.InitialCheckOutForm.get('planInitialInformation.isPTAgreementContractChecked')?.value) {
        this.setFocus();
      }
      else if (this.SourceName != this.commonService.commonTypeObj.member.personalTrainingType && !this.InitialCheckOutForm.get('planInitialInformation.isTermsConditionChecked')?.value) {
        this.setFocus();
      }
      else if (!this.InitialCheckOutForm.get('planInitialInformation.isAuthorizationTermsChecked')?.value) {
        this.setFocus();
      }
    }
    else if (!this.InitialCheckOutForm.get('planInitialInformation.isMembershipAgreementContractChecked')?.value) {
      this.setFocus();
    }
    else if (this.membershipPTPlanObj != null && !this.InitialCheckOutForm.get('planInitialInformation.isPTAgreementContractChecked')?.value) {
      this.setFocus();
    }
    else if (this.SourceName != this.commonService.commonTypeObj.member.personalTrainingType && !this.InitialCheckOutForm.get('planInitialInformation.isTermsConditionChecked')?.value) {
      this.setFocus();
    }
    else if (!this.InitialCheckOutForm.get('planInitialInformation.isAuthorizationTermsChecked')?.value) {
      this.setFocus();
    }
    //#endregion End of Set Focus
    var regobj = JSON.parse(window.sessionStorage.getItem("RegisterObj")!);

    if (this.SourceName != this._commonService.commonTypeObj.member.personalTrainingType) {
      if (this.InitialCheckOutForm.get('bankingDetailObj.IsUseBankingDetails')?.value == true || (this.InitialCheckOutForm.get('bankingDetailObj.IsUseBankingDetails')?.value == false && this.showdraftAccount)) {
        if (this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountFirstName')?.value != null || undefined) {
          this.fname =
            this.showdraftAccount && this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountFirstName')?.value != "" ?
              this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountFirstName')?.value! : "";
        }
        if (this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountLastName')?.value != null || undefined) {
          this.lname =
            this.showdraftAccount && this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountLastName')?.value != "" ?
              this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountLastName')?.value! : "";
        }
        if (this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountNumber')?.value != null || undefined) {
          this.accno = this.showdraftAccount && this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountNumber')?.value! != "" ?
            this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountNumber')?.value! : "";
        }
        if (this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountRoutingNumber')?.value != null || undefined) {
          this.routingNo = this.showdraftAccount && this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountRoutingNumber')?.value! != "" ?
            this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountRoutingNumber')?.value! : "";
        }
        if (this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountType')?.value != null || undefined) {
          this.accType = this.showdraftAccount && this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountType')?.value! != "" ?
            this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountType')?.value! : "";
        }
        // if (this.InitialCheckOutForm.get('bankingDetailObj.PaymentType')?.value != null || undefined) {
        //   this.paymentType = this.showdraftAccount && this.InitialCheckOutForm.get('bankingDetailObj.PaymentType')?.value! != "" ?
        //   this.InitialCheckOutForm.get('bankingDetailObj.PaymentType')?.value! : "";
        // }
        if (this.showdraftAccount) {
          this.paymentType = this.showdraftAccount ? "ACH" : "CC";
        }

        var MemberaccountType = this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountObj')?.value?.Type!;
        this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountFirstName')?.setValue(this.fname);
        this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountLastName')?.setValue(this.lname);
        this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountRoutingNumber')?.setValue(this.routingNo);
        this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountNumber')?.setValue(this.accno);
        this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountType')?.setValue(this.accType == "" ? MemberaccountType : this.accType);
        this.InitialCheckOutForm.get('bankingDetailObj.PaymentType')?.setValue(this.paymentType);
        // if (this.accType != null) {
        //   this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountObj')?.clearValidators();
        //   this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountObj')?.updateValueAndValidity();
        // }
        // else {
        //   this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountObj')?.setValidators([Validators.required]);
        //   this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountObj')?.updateValueAndValidity();
        // }
        var IsSameAsAboveObj = this.InitialCheckOutForm.get('bankingDetailObj.IsSameAsAbove')?.value;
        if (IsSameAsAboveObj == true) {
        }
        if (this.membershipPTPlanObj == null && this.SGTPlanObj == null) {
          this.removePTPaymentValidator();
        }
        else if (this.membershipPlanObj != null && this.SGTPlanObj != null && this.membershipPTPlanObj == null) {
          this.removePTCheckAggrementValidator();
        }
        this.setEmptyCreditCardsecondary();
        this.removeValidatorsCreditCardsecondary();
      }
      else if (this.InitialCheckOutForm.get('bankingDetailObj.IsUseBankingDetails')?.value == false) {
        this.IsPlaid = false;
        this.removeValidatorsDraftAccount()

        if (this.membershipPTPlanObj == null && this.SGTPlanObj == null) {
          this.removePTPaymentValidator();
        }
        else if (this.membershipPlanObj != null && this.SGTPlanObj != null && this.membershipPTPlanObj == null) {
          this.removePTCheckAggrementValidator();
        }
        this.setEmptyCreditCardsecondary();
        this.removeValidatorsCreditCardsecondary();
      }
      else {
        if (this.membershipPTPlanObj == null && this.SGTPlanObj == null) {
          this.removePTPaymentValidator();
        }
        else if (this.membershipPlanObj != null && this.SGTPlanObj != null && this.membershipPTPlanObj == null) {
          this.removePTCheckAggrementValidator();
        }
      }
    }
    else {

      this.removeValidatorsCreditCard()
      this.InitialCheckOutForm.get('planInitialInformation.isMembershipAgreementContractChecked')?.clearValidators();
      this.InitialCheckOutForm.get('planInitialInformation.isMembershipAgreementContractChecked')?.updateValueAndValidity();

      this.InitialCheckOutForm.get('planInitialInformation.isTermsConditionChecked')?.clearValidators();
      this.InitialCheckOutForm.get('planInitialInformation.isTermsConditionChecked')?.updateValueAndValidity();

      if (this.membershipPTPlanObj == null && this.membershipPlanObj == null && this.SGTPlanObj != null) {
        this.removeSGTAggrementValidator();
      }
    }

    this._commonService.setBodyHeightSize();
    this.submitted = true;
    var sourceName = window.sessionStorage.getItem("SourceName");
    if (this.InitialCheckOutForm.invalid) {
      if (this.InitialCheckOutForm.controls.paymentInformation.status != "VALID" || this.InitialCheckOutForm.controls.PTpaymentInformation.status != "VALID" ||
        this.InitialCheckOutForm.controls.billingInfo.status != "VALID" || this.InitialCheckOutForm.controls.paymentInformation.status != "VALID" ||
        this.InitialCheckOutForm.controls.personalInformation.status != "VALID" || this.InitialCheckOutForm.controls.planInitialInformation.status != "VALID" ||
        this.InitialCheckOutForm.controls.secondarypaymentInformation.status != "VALID" || this.InitialCheckOutForm.controls.secondaryPTpaymentInformation.status != "VALID"
      ) {
        return;
      }
    }
    if (this.membershipPlanObj != null) {
      if (this.InitialCheckOutForm.controls.bankingDetailObj.controls.IsUseBankingDetails.value == true) {
        if (this.InitialCheckOutForm.controls.bankingDetailObj.status != "VALID") {
          // if (this.InitialCheckOutForm.controls.bankingDetailObj.controls.DraftAccountFirstName.value == "") {
          //   this.toastr.warning(constMessage.billingInfo.plaidAccountFname, constMessage.required);
          //   return;
          // }
          if (this.InitialCheckOutForm.controls.bankingDetailObj.controls.DraftAccountFirstName.value == "" || this.InitialCheckOutForm.controls.bankingDetailObj.controls.DraftAccountLastName.value == ""
            || this.InitialCheckOutForm.controls.bankingDetailObj.controls.DraftAccountNumber.value == "" || this.InitialCheckOutForm.controls.bankingDetailObj.controls.DraftAccountRoutingNumber.value == "" ||
             this.InitialCheckOutForm.controls.bankingDetailObj.controls.DraftAccountRoutingNumber.value?.length != 9 || this.InitialCheckOutForm.controls.bankingDetailObj.controls.DraftAccountType.value == "" || DraftAccountNumber.length < 8 || DraftAccountNumber.length > 17
            || this.InitialCheckOutForm.controls.bankingDetailObj.controls.DraftAccountObj.value == null) {
            return;
          }
        }
      }
    }

    if (this.membershipPTPlanObj != null || this.SGTPlanObj != null) {
    }

    if (signature.isEmpty()) {
      this.toastr.warning(constMessage.billingInfo.signRequired, constMessage.required);
      return;
    }
    else if (initialSignature.isEmpty()) {
      this.toastr.warning(constMessage.billingInfo.initialSignRequired, constMessage.required);
      return;
    }

    if (InitialCheckOutData.value.personalInformation?.salesPersonObj) {
      InitialCheckOutData.controls.personalInformation.controls.salesPersonId.setValue(InitialCheckOutData.value.personalInformation.salesPersonObj.SPEmployeeId);
    }
    else {
      InitialCheckOutData.controls.personalInformation.controls.salesPersonId.setValue(null);
    }
    this.InitialCheckOutForm.get('PTbankingDetailObj.PTPaymentType')?.setValue("CC");
    var postData: any = _.cloneDeep(InitialCheckOutData.value);
    postData.personalInformation = this.registerObj ? this.registerObj : this.memberObj;
    postData.personalInformation.salesPersonObj = InitialCheckOutData.value.personalInformation?.salesPersonObj;
    postData.personalInformation.HubSpotId = postData.personalInformation.hsId != null ? postData.personalInformation.hsId : null;
    postData.planInitialInformation.clubNumber = this.billingObj.clubNumber;
    postData.planInitialInformation.planId = this.billingObj.planId;
    postData.planInitialInformation.sourceName = this.billingObj.sourceName;
    postData.planInitialInformation.clubName = this.billingObj.clubName;
    postData.billingInfo.state = postData.billingInfo.stateObj.stateCode;
    postData.planInitialInformation.signatureBody = this.signPad.toDataURL();
    postData.planInitialInformation.initialSignatureBody = this.signPadInitial.toDataURL();
    postData.IsPrepaidCCard = {
      IsPrepaidCreditCard: this.IsPrepaidCC,
      IsUserChangedPrepaidCard: this.IsUserChangedPrepaidCard
    }
    postData.IsPTPrepaidCCard = {
      IsPrepaidCreditCard: this.IsPTPrepaidCC,
      IsUserChangedPrepaidCard: this.IsPTUserChangedPrepaidCard
    }

    if (postData.paymentInformation != null) {
      postData.paymentInformation.creditCardNumber = postData.paymentInformation.creditCardNumber.split(' ').filter((c: string) => c).join('');
      postData.paymentInformation.creditCardExpMonth = postData.paymentInformation.creditCardExpMonth != null ? postData.paymentInformation.creditCardExpMonth.month : "";
    }
    var IsUseBankingDetailsObj = this.InitialCheckOutForm.controls.bankingDetailObj.controls.IsUseBankingDetails.value;
    if (IsUseBankingDetailsObj == null) {
      if (postData.secondarypaymentInformation.creditCardNumber) {
        postData.secondarypaymentInformation.creditCardNumber = postData.secondarypaymentInformation.creditCardNumber.split(' ').filter((c: string) => c).join('');
      }
      if (postData.secondarypaymentInformation.creditCardExpMonth) {
        postData.secondarypaymentInformation.creditCardExpMonth = postData.secondarypaymentInformation.creditCardExpMonth != null ? postData.secondarypaymentInformation.creditCardExpMonth.month : "";
      }
    }
    else {
      postData.secondarypaymentInformation.creditCardFirstName = "";
      postData.secondarypaymentInformation.creditCardLastName = "";
      postData.secondarypaymentInformation.creditCardNumber = "";
      postData.secondarypaymentInformation.creditCardExpMonth = "";
      postData.secondarypaymentInformation.creditCardExpYear = "";
      postData.secondarypaymentInformation.creditCardCVV = "";
      postData.secondarypaymentInformation.creditCardZipCode = "";
      postData.secondarypaymentInformation.creditCardType = "";
    }

    if (postData.PTpaymentInformation != null && postData.PTpaymentInformation.creditCardExpMonth != null) {
      postData.PTpaymentInformation.creditCardExpMonth = postData.PTpaymentInformation.creditCardExpMonth.month;
    }

    var IsPTUseBankingDetails = this.InitialCheckOutForm.controls.PTbankingDetailObj.controls.IsPTUseBankingDetails.value;
    if (IsPTUseBankingDetails == null) {
      if (postData.secondaryPTpaymentInformation.creditCardNumber) {
        postData.secondaryPTpaymentInformation.creditCardNumber = postData.secondaryPTpaymentInformation.creditCardNumber.split(' ').filter((c: string) => c).join('');
      }
      if (postData.secondaryPTpaymentInformation.creditCardExpMonth) {
        postData.secondaryPTpaymentInformation.creditCardExpMonth = postData.secondaryPTpaymentInformation.creditCardExpMonth != null ? postData.secondaryPTpaymentInformation.creditCardExpMonth.month : "";
      }
    }
    else {
      postData.secondaryPTpaymentInformation.creditCardFirstName = "";
      postData.secondaryPTpaymentInformation.creditCardLastName = "";
      postData.secondaryPTpaymentInformation.creditCardNumber = "";
      postData.secondaryPTpaymentInformation.creditCardExpMonth = "";
      postData.secondaryPTpaymentInformation.creditCardExpYear = "";
      postData.secondaryPTpaymentInformation.creditCardCVV = "";
      postData.secondaryPTpaymentInformation.creditCardZipCode = "";
      postData.secondaryPTpaymentInformation.creditCardType = "";
    }

    if (JSON.parse(window.sessionStorage.getItem("EmailResponse")!)) {
      postData.emailResponseObj = JSON.parse(window.sessionStorage.getItem("EmailResponse")!);
    }
    if (JSON.parse(window.sessionStorage.getItem("PlanObj")!)) {
      var PlanObj = JSON.parse(window.sessionStorage.getItem("PlanObj")!);
      postData.planInitialInformation.PlanType = PlanObj.planName.includes("Paid in Full") ? "PIF" : "EFT";
      PlanObj.PlanBiweeklyType = PlanObj.planName.includes("Biweekly") ? "Biweekly" : "";
      PlanObj.PlanTypeDetail = PlanObj.planTypeDetail;
      postData.planInitialInformation.PlanName = PlanObj.planName;
      postData.planInitialInformation.MemberPlanDetailsJson = PlanObj.planDetailsJson;
    }
    if (JSON.parse(window.sessionStorage.getItem("PTPlanObj")!)) {
      var ptObj = JSON.parse(window.sessionStorage.getItem("PTPlanObj")!)
      postData.planInitialInformation.PTPlanId = ptObj.ptPlanId;
      postData.planInitialInformation.PTValidationHash = ptObj.validationHash;
      postData.planInitialInformation.PTPlanType = ptObj.originalPlanName.includes("PIF") ? "PIF" : "EFT";
      postData.planInitialInformation.PTPlanNameType = ptObj.ptPlanNameType;
      postData.planInitialInformation.PTPlanName = ptObj.planName;
      postData.planInitialInformation.PTPlanDetailsJson = ptObj.planDetailsJson;
    }

    if (JSON.parse(window.sessionStorage.getItem("SmallGroupPlanObj")!)) {
      var smallGroupObj = JSON.parse(window.sessionStorage.getItem("SmallGroupPlanObj")!)
      postData.planInitialInformation.SmallGroupPlanId = smallGroupObj.planId;
      postData.planInitialInformation.SmallGroupValidationHash = smallGroupObj.validationHash;
      postData.planInitialInformation.SGTPlanNameType = smallGroupObj.ptPlanNameType;
      postData.planInitialInformation.SGTPlanDetailsJson = smallGroupObj.planDetailsJson;
    }

    var IsSameAsAbove = this.InitialCheckOutForm.get('bankingDetailObj.IsSameAsAbove')?.value;

    if (IsSameAsAbove == true && IsUseBankingDetailsObj == null) {
      this.setValidatorsCreditCardsecondary();
      this.setValidatorPTCreditCardsecondary();
    }

    if (IsUseBankingDetailsObj == null) {
      this.setValidatorsCreditCardsecondary();
    }
    else {
      this.removeValidatorsCreditCardsecondary();
      this.setEmptyCreditCardsecondary();
    }

    if (IsPTUseBankingDetails == null) {
      this.setValidatorPTCreditCardsecondary();
    }
    else {
      this.removeValidatorsPTCreditCardsecondary();
      this.setEmptyPTCreditCardsecondary();
    }
    this.buttonDisabled = true;
    postData.planInitialInformation.IsRecurringPaymentFlag = this.IsRecurringPaymentFlag;
    this._checkOutService.memberCheckOut(postData)?.subscribe({
      next: (response: any) => {
        if (response.data) {
          //#region member
          if (response.data.message == "-111") {
            this.toastr.warning(constMessage.checkOut.planWarningText);
            setTimeout(() => {
              this._router.navigate(['Search'])
            }, 5000)
          }
          else {
            if (response.data.message != null) {
              if (response.data.message.toLowerCase() == "success") {
                this.toastr.success(constMessage.billingInfo.memberSignUpSuccess, constMessage.success);
                if (response.data) {
                  window.sessionStorage.setItem("MemberId", response.data.memberId)
                  window.sessionStorage.setItem("AgreementNumber", response.data.agreementNumber)
                  window.sessionStorage.setItem("RecurringServiceId", response.data.recurringServiceId);
                  window.sessionStorage.setItem("SGTRecurringServiceId", response.data.sgtRecurringServiceId);
                }
                setTimeout(() => {
                  if (window.sessionStorage.getItem("SourceName") == this._commonService.commonTypeObj.guest.joinNowObj.healthInsuranceType) {
                    window.location.href = "/SilverSneakers/ThankYou";
                  }
                  else {
                    this._router.navigate(['guest/thankyou']);
                  }
                }, 2000);
              }
              else {
                this.buttonDisabled = null;
                this.toastr.error(response.data.message, "Error");

                var GUID = window.sessionStorage.getItem('GUID');
                var URL = window.location.href;
                var PageName = window.location.pathname.split('/').pop();
                var PostData: any = {
                  FieldValue: `Checkout: ${response.data.message}${postData.personalInformation.salesPersonObj?.fullName ? ' , Helping Member:' + postData.personalInformation.salesPersonObj?.fullName : ''} 
                              , Billing info:${postData.billingInfo.address + '' + postData.billingInfo.city + '' + postData.billingInfo.stateObj.stateName + '' + postData.billingInfo.zipCode}`,
                  ClubNumber: postData.personalInformation.clubNumber,
                  SessionId: GUID,
                  PageName: PageName,
                  PageUrl: URL,
                  ActionType: "Secure Checkout"
                };
                if (postData.bankingDetailObj.DraftAccountFirstName != (null || '')) {
                  // Add bankingDetailObj fields line by line
                  PostData.FieldValue += ` , Plaid Info:Draft Account Detail For Plaid
                          , FirstName:${postData.bankingDetailObj.DraftAccountFirstName}
                          , LastName:${postData.bankingDetailObj.DraftAccountLastName}
                          , Account Type:${postData.bankingDetailObj.DraftAccountType}`;
                }
                function addPaymentInfo(paymentInfo: any, paymentType: string) {
                  PostData.FieldValue += ` , Payment Info:${paymentType}
                            , CardHolder FirstName:${paymentInfo.creditCardFirstName}
                            , CardHolder LastName:${paymentInfo.creditCardLastName}
                            , CardType:${paymentInfo.creditCardType}`;
                }
                // Add payment information
                if (postData.paymentInformation.creditCardFirstName != (null || '')) {
                  addPaymentInfo(postData.paymentInformation, "Primary Cardholder Details");
                }
                if (this.IsSecondaryCCDetails == true && postData.secondarypaymentInformation) {
                  addPaymentInfo(postData.secondarypaymentInformation, "Secondary Cardholder Details");
                }

                if (postData.PTpaymentInformation.creditCardFirstName != (null || '')) {
                  addPaymentInfo(postData.PTpaymentInformation, "PTPrimary Cardholder Details");
                }

                if (this.IsPTSecondaryCCDetails == true && postData.secondaryPTpaymentInformation) {
                  addPaymentInfo(postData.secondaryPTpaymentInformation, "PTSecondary Cardholder Details");
                }
                this._commonService.SaveWorkFlow(PostData);
              }
            }
            //#endregion
            //#region PTmember
            if (response.data.ptMessage != null) {
              if (response.data.ptMessage.toLowerCase() == "success") {
                this.toastr.success(constMessage.billingInfo.ptSuccess, constMessage.success);

                if ((response.data.cardOnFileStatus == false) && (window.sessionStorage.getItem("SourceName") == this._commonService.commonTypeObj.member.personalTrainingType)) {
                  this.toastr.warning(constMessage.billingInfo.cardOnfileMessage, constMessage.warning);
                }

                setTimeout(() => {
                  if (window.sessionStorage.getItem("SourceName") == this._commonService.commonTypeObj.member.personalTrainingType) {
                    this._router.navigate(['member/thankyou'])
                  }
                }, 2000);
              }
              else {
                this.buttonDisabled = null;
                this.toastr.error(response.data.ptMessage, "Error");

                var GUID = window.sessionStorage.getItem('GUID');
                var URL = window.location.href;
                var PageName = window.location.pathname.split('/').pop();
                var PostData: any = {
                  FieldValue: `Checkout: ${response.data.ptMessage}${postData.personalInformation.salesPersonObj?.fullName ? ' , Helping Member:' + postData.personalInformation.salesPersonObj?.fullName : ''} 
                              , Billing info:${postData.billingInfo.address + '' + postData.billingInfo.city + '' + postData.billingInfo.stateObj.stateName + '' + postData.billingInfo.zipCode}`,
                  ClubNumber: postData.personalInformation.clubNumber,
                  SessionId: GUID,
                  PageName: PageName,
                  PageUrl: URL,
                  ActionType: "Secure Checkout"
                };
                if (postData.bankingDetailObj.DraftAccountFirstName != (null || '')) {
                  // Add bankingDetailObj fields line by line
                  PostData.FieldValue += ` , Plaid Info:Draft Account Detail For Plaid
                          , FirstName:${postData.bankingDetailObj.DraftAccountFirstName}
                          , LastName:${postData.bankingDetailObj.DraftAccountLastName}
                          , Account Type:${postData.bankingDetailObj.DraftAccountType}`;
                }
                function addPaymentInfo(paymentInfo: any, paymentType: string) {
                  PostData.FieldValue += ` , Payment Info:${paymentType}
                            , CardHolder FirstName:${paymentInfo.creditCardFirstName}
                            , CardHolder LastName:${paymentInfo.creditCardLastName}
                            , CardType:${paymentInfo.creditCardType}`;
                }
                // Add payment information
                if (postData.paymentInformation.creditCardFirstName != (null || '')) {
                  addPaymentInfo(postData.paymentInformation, "Primary Cardholder Details");
                }
                if (this.IsSecondaryCCDetails == true && postData.secondarypaymentInformation) {
                  addPaymentInfo(postData.secondarypaymentInformation, "Secondary Cardholder Details");
                }

                if (postData.PTpaymentInformation.creditCardFirstName != (null || '')) {
                  addPaymentInfo(postData.PTpaymentInformation, "PTPrimary Cardholder Details");
                }

                if (this.IsPTSecondaryCCDetails == true && postData.secondaryPTpaymentInformation) {
                  addPaymentInfo(postData.secondaryPTpaymentInformation, "PTSecondary Cardholder Details");
                }
                this._commonService.SaveWorkFlow(PostData);
              }
            }
            //#endregion
            //#region SGTmember
            if (response.data.sgtMessage != null) {
              if (response.data.sgtMessage.toLowerCase() == "success") {
                this.toastr.success(constMessage.billingInfo.sgtSuccess, constMessage.success);
                setTimeout(() => {
                  if (window.sessionStorage.getItem("SourceName") == this._commonService.commonTypeObj.member.personalTrainingType) {
                    this._router.navigate(['member/thankyou'])
                  }
                }, 2000);
              }
              else {
                this.buttonDisabled = null;
                this.toastr.error(response.data.sgtMessage, "Error");

                var GUID = window.sessionStorage.getItem('GUID');
                var URL = window.location.href;
                var PageName = window.location.pathname.split('/').pop();
                var PostData: any = {
                  FieldValue: `Checkout:${response.data.sgtMessage}${postData.personalInformation.salesPersonObj?.fullName ? ' , Helping Member:' + postData.personalInformation.salesPersonObj?.fullName : ''} 
                              , Billing info:${postData.billingInfo.address + '' + postData.billingInfo.city + '' + postData.billingInfo.stateObj.stateName + '' + postData.billingInfo.zipCode}`,
                  ClubNumber: postData.personalInformation.clubNumber,
                  SessionId: GUID,
                  PageName: PageName,
                  PageUrl: URL,
                  ActionType: "Secure Checkout"
                };
                if (postData.bankingDetailObj.DraftAccountFirstName != (null || '')) {
                  // Add bankingDetailObj fields line by line
                  PostData.FieldValue += ` , Plaid Info:Draft Account Detail For Plaid
                          , FirstName:${postData.bankingDetailObj.DraftAccountFirstName}
                          , LastName:${postData.bankingDetailObj.DraftAccountLastName}
                          , Account Type:${postData.bankingDetailObj.DraftAccountType}`;
                }
                function addPaymentInfo(paymentInfo: any, paymentType: string) {
                  PostData.FieldValue += ` , Payment Info:${paymentType}
                            , CardHolder FirstName:${paymentInfo.creditCardFirstName}
                            , CardHolder LastName:${paymentInfo.creditCardLastName}
                            , CardType:${paymentInfo.creditCardType}`;
                }
                // Add payment information
                if (postData.paymentInformation.creditCardFirstName != (null || '')) {
                  addPaymentInfo(postData.paymentInformation, "Primary Cardholder Details");
                }
                if (this.IsSecondaryCCDetails == true && postData.secondarypaymentInformation) {
                  addPaymentInfo(postData.secondarypaymentInformation, "Secondary Cardholder Details");
                }

                if (postData.PTpaymentInformation.creditCardFirstName != (null || '')) {
                  addPaymentInfo(postData.PTpaymentInformation, "PTPrimary Cardholder Details");
                }

                if (this.IsPTSecondaryCCDetails == true && postData.secondaryPTpaymentInformation) {
                  addPaymentInfo(postData.secondaryPTpaymentInformation, "PTSecondary Cardholder Details");
                }
                this._commonService.SaveWorkFlow(PostData);
              }
            }
            //#endregion
          }
        }
        else {
          this.buttonDisabled = null;
          this.toastr.error(response.message, "Error");

          var GUID = window.sessionStorage.getItem('GUID');
          var URL = window.location.href;
          var PageName = window.location.pathname.split('/').pop();
          var PostData: any = {
            FieldValue: `Checkout:${response.message}${postData.personalInformation.salesPersonObj?.fullName ? ' , Helping Member:' + postData.personalInformation.salesPersonObj?.fullName : ''} 
                        , Billing info:${postData.billingInfo.address + '' + postData.billingInfo.city + '' + postData.billingInfo.stateObj.stateName + '' + postData.billingInfo.zipCode}`,
            ClubNumber: postData.personalInformation.clubNumber,
            SessionId: GUID,
            PageName: PageName,
            PageUrl: URL,
            ActionType: "Secure Checkout"
          };
          if (postData.bankingDetailObj.DraftAccountFirstName != (null || '')) {
            // Add bankingDetailObj fields line by line
            PostData.FieldValue += ` , Plaid Info:Draft Account Detail For Plaid
                    , FirstName:${postData.bankingDetailObj.DraftAccountFirstName}
                    , LastName:${postData.bankingDetailObj.DraftAccountLastName}
                    , Account Type:${postData.bankingDetailObj.DraftAccountType}`;
          }
          function addPaymentInfo(paymentInfo: any, paymentType: string) {
            PostData.FieldValue += ` , Payment Info:${paymentType}
                      , CardHolder FirstName:${paymentInfo.creditCardFirstName}
                      , CardHolder LastName:${paymentInfo.creditCardLastName}
                      , CardType:${paymentInfo.creditCardType}`;
          }
          // Add payment information
          if (postData.paymentInformation.creditCardFirstName != (null || '')) {
            addPaymentInfo(postData.paymentInformation, "Primary Cardholder Details");
          }
          if (this.IsSecondaryCCDetails == true && postData.secondarypaymentInformation) {
            addPaymentInfo(postData.secondarypaymentInformation, "Secondary Cardholder Details");
          }

          if (postData.PTpaymentInformation.creditCardFirstName != (null || '')) {
            addPaymentInfo(postData.PTpaymentInformation, "PTPrimary Cardholder Details");
          }

          if (this.IsPTSecondaryCCDetails == true && postData.secondaryPTpaymentInformation) {
            addPaymentInfo(postData.secondaryPTpaymentInformation, "PTSecondary Cardholder Details");
          }
          this._commonService.SaveWorkFlow(PostData);
        }
      },
      error: (error: { error: { StackTrace: string | undefined; }; }) => {
        this.toastr.error(error.error.StackTrace, constMessage.error);

        var GUID = window.sessionStorage.getItem('GUID');
        var URL = window.location.href;
        var PageName = window.location.pathname.split('/').pop();
        var PostData: any = {
          FieldValue: `Checkout:${error.error.StackTrace}${postData.personalInformation.salesPersonObj?.fullName ? ' , Helping Member:' + postData.personalInformation.salesPersonObj?.fullName : ''} 
                      , Billing info:${postData.billingInfo.address + '' + postData.billingInfo.city + '' + postData.billingInfo.stateObj.stateName + '' + postData.billingInfo.zipCode}`,
          ClubNumber: postData.personalInformation.clubNumber,
          SessionId: GUID,
          PageName: PageName,
          PageUrl: URL,
          ActionType: "Secure Checkout"
        };
        if (postData.bankingDetailObj.DraftAccountFirstName != (null || '')) {
          // Add bankingDetailObj fields line by line
          PostData.FieldValue += ` , Plaid Info:Draft Account Detail For Plaid
                          , FirstName:${postData.bankingDetailObj.DraftAccountFirstName}
                          , LastName:${postData.bankingDetailObj.DraftAccountLastName}
                          , Account Type:${postData.bankingDetailObj.DraftAccountType}`;
        }
        function addPaymentInfo(paymentInfo: any, paymentType: string) {
          PostData.FieldValue += ` , Payment Info:${paymentType}
                    , CardHolder FirstName:${paymentInfo.creditCardFirstName}
                    , CardHolder LastName:${paymentInfo.creditCardLastName}
                    , CardType:${paymentInfo.creditCardType}`;
        }
        // Add payment information
        if (postData.paymentInformation.creditCardFirstName != (null || '')) {
          addPaymentInfo(postData.paymentInformation, "Primary Cardholder Details");
        }
        if (this.IsSecondaryCCDetails == true && postData.secondarypaymentInformation) {
          addPaymentInfo(postData.secondarypaymentInformation, "Secondary Cardholder Details");
        }

        if (postData.PTpaymentInformation.creditCardFirstName != (null || '')) {
          addPaymentInfo(postData.PTpaymentInformation, "PTPrimary Cardholder Details");
        }

        if (this.IsPTSecondaryCCDetails == true && postData.secondaryPTpaymentInformation) {
          addPaymentInfo(postData.secondaryPTpaymentInformation, "PTSecondary Cardholder Details");
        }
        this._commonService.SaveWorkFlow(PostData);
      }
    });
  }

  setValidatorsDraftAccount = () => {
    this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountFirstName')?.setValidators([Validators.required, Validators.maxLength(15), Validators.pattern(this._commonService.nameValidPattern)]);
    this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountFirstName')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountLastName')?.setValidators([Validators.required, Validators.maxLength(15), Validators.pattern(this._commonService.nameValidPattern)]);
    this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountLastName')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountRoutingNumber')?.setValidators([Validators.required, Validators.pattern(this._commonService.routingNumberDigitPattern)]);
    this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountRoutingNumber')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountNumber')?.setValidators([Validators.required, Validators.pattern(this._commonService.accountNumberDigitPattern)]);
    this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountNumber')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountType')?.setValidators(null);
    this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountType')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountObj')?.setValidators([Validators.required]);
    this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountObj')?.updateValueAndValidity();

  }

  setValidatorsPTDraftAccount = () => {
    this.InitialCheckOutForm.get('PTbankingDetailObj.PTDraftAccountFirstName')?.setValidators([Validators.required, Validators.maxLength(15), Validators.pattern(this._commonService.nameValidPattern)]);
    this.InitialCheckOutForm.get('PTbankingDetailObj.PTDraftAccountFirstName')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('PTbankingDetailObj.PTDraftAccountLastName')?.setValidators([Validators.required, Validators.maxLength(15), Validators.pattern(this._commonService.nameValidPattern)]);
    this.InitialCheckOutForm.get('PTbankingDetailObj.PTDraftAccountLastName')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('PTbankingDetailObj.PTDraftAccountRoutingNumber')?.setValidators([Validators.required, Validators.pattern(this._commonService.routingNumberDigitPattern)]);
    this.InitialCheckOutForm.get('PTbankingDetailObj.PTDraftAccountRoutingNumber')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('PTbankingDetailObj.PTDraftAccountNumber')?.setValidators([Validators.required, Validators.required, Validators.pattern(this._commonService.accountNumberDigitPattern)]);
    this.InitialCheckOutForm.get('PTbankingDetailObj.PTDraftAccountNumber')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('PTbankingDetailObj.PTDraftAccountType')?.setValidators(null);
    this.InitialCheckOutForm.get('PTbankingDetailObj.PTDraftAccountType')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('PTbankingDetailObj.PTDraftAccountObj')?.setValidators([Validators.required]);
    this.InitialCheckOutForm.get('PTbankingDetailObj.PTDraftAccountObj')?.updateValueAndValidity();

  }
  removeValidatorsDraftAccount = () => {
    this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountFirstName')?.clearValidators();
    this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountFirstName')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountLastName')?.clearValidators();
    this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountLastName')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountRoutingNumber')?.clearValidators();
    this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountRoutingNumber')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountNumber')?.clearValidators();
    this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountNumber')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountType')?.clearValidators();
    this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountType')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountObj')?.clearValidators();
    this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountObj')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('bankingDetailObj.IsUseBankingDetails')?.clearValidators();
    this.InitialCheckOutForm.get('bankingDetailObj.IsUseBankingDetails')?.updateValueAndValidity();
  }

  removeValidatorsPTDraftAccount = () => {
    this.InitialCheckOutForm.get('PTbankingDetailObj.PTDraftAccountFirstName')?.clearValidators();
    this.InitialCheckOutForm.get('PTbankingDetailObj.PTDraftAccountFirstName')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('PTbankingDetailObj.PTDraftAccountLastName')?.clearValidators();
    this.InitialCheckOutForm.get('PTbankingDetailObj.PTDraftAccountLastName')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('PTbankingDetailObj.PTDraftAccountRoutingNumber')?.clearValidators();
    this.InitialCheckOutForm.get('PTbankingDetailObj.PTDraftAccountRoutingNumber')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('PTbankingDetailObj.PTDraftAccountNumber')?.clearValidators();
    this.InitialCheckOutForm.get('PTbankingDetailObj.PTDraftAccountNumber')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('PTbankingDetailObj.PTDraftAccountType')?.clearValidators();
    this.InitialCheckOutForm.get('PTbankingDetailObj.PTDraftAccountType')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('PTbankingDetailObj.PTDraftAccountObj')?.clearValidators();
    this.InitialCheckOutForm.get('PTbankingDetailObj.PTDraftAccountObj')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('PTbankingDetailObj.IsPTUseBankingDetails')?.clearValidators();
    this.InitialCheckOutForm.get('PTbankingDetailObj.IsPTUseBankingDetails')?.updateValueAndValidity();
  }

  setValidatorsCreditCardsecondary = () => {
    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardFirstName')?.setValidators([Validators.required, Validators.maxLength(15), Validators.pattern(this._commonService.nameValidPattern)]);
    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardFirstName')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardLastName')?.setValidators([Validators.required, Validators.maxLength(15), Validators.pattern(this._commonService.nameValidPattern)]);
    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardLastName')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardNumber')?.setValidators([Validators.required]);
    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardNumber')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardType')?.setValidators(null);
    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardType')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardZipCode')?.setValidators([Validators.required, Validators.pattern(this._commonService.zipCodePattern)]);
    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardZipCode')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardCVV')?.setValidators([Validators.required, Validators.pattern(this._commonService.cvvNumberDigitPattern)]);
    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardCVV')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardExpMonth')?.setValidators([Validators.required]);
    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardExpMonth')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardExpYear')?.setValidators([Validators.required]);
    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardExpYear')?.updateValueAndValidity();
  }

  setValidatorPTCreditCardsecondary = () => {
    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardFirstName')?.setValidators([Validators.required, Validators.maxLength(15), Validators.pattern(this._commonService.nameValidPattern)]);
    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardFirstName')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardLastName')?.setValidators([Validators.required, Validators.maxLength(15), Validators.pattern(this._commonService.nameValidPattern)]);
    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardLastName')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardNumber')?.setValidators([Validators.required]);
    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardNumber')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardType')?.setValidators(null);
    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardType')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardZipCode')?.setValidators([Validators.required, Validators.pattern(this._commonService.zipCodePattern)]);
    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardZipCode')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardCVV')?.setValidators([Validators.required, Validators.pattern(this._commonService.cvvNumberDigitPattern)]);
    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardCVV')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardExpMonth')?.setValidators([Validators.required]);
    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardExpMonth')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardExpYear')?.setValidators([Validators.required]);
    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardExpYear')?.updateValueAndValidity();
  }

  removePTCheckAggrementValidator = () => {
    if (this.membershipPlanObj != null && this.SGTPlanObj != null) {
      this.InitialCheckOutForm.get('planInitialInformation.isThirtyDayNoticeChecked')?.clearValidators();
      this.InitialCheckOutForm.get('planInitialInformation.isThirtyDayNoticeChecked')?.updateValueAndValidity();

      this.InitialCheckOutForm.get('planInitialInformation.isPTAgreementContractChecked')?.clearValidators();
      this.InitialCheckOutForm.get('planInitialInformation.isPTAgreementContractChecked')?.updateValueAndValidity();
    }
  }

  removeSGTAggrementValidator = () => {
    this.InitialCheckOutForm.get('planInitialInformation.isMembershipAgreementContractChecked')?.clearValidators();
    this.InitialCheckOutForm.get('planInitialInformation.isMembershipAgreementContractChecked')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('planInitialInformation.isThirtyDayNoticeChecked')?.clearValidators();
    this.InitialCheckOutForm.get('planInitialInformation.isThirtyDayNoticeChecked')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('planInitialInformation.isPTAgreementContractChecked')?.clearValidators();
    this.InitialCheckOutForm.get('planInitialInformation.isPTAgreementContractChecked')?.updateValueAndValidity();
  }

  removeValidatorsCreditCard = () => {
    this.InitialCheckOutForm.get('paymentInformation.creditCardFirstName')?.clearValidators();
    this.InitialCheckOutForm.get('paymentInformation.creditCardFirstName')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('paymentInformation.creditCardLastName')?.clearValidators();
    this.InitialCheckOutForm.get('paymentInformation.creditCardLastName')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('paymentInformation.creditCardNumber')?.clearValidators();
    this.InitialCheckOutForm.get('paymentInformation.creditCardNumber')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('paymentInformation.creditCardNumber')?.clearValidators();
    this.InitialCheckOutForm.get('paymentInformation.creditCardNumber')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('paymentInformation.creditCardType')?.clearValidators();
    this.InitialCheckOutForm.get('paymentInformation.creditCardType')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('paymentInformation.creditCardZipCode')?.clearValidators();
    this.InitialCheckOutForm.get('paymentInformation.creditCardZipCode')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('paymentInformation.creditCardCVV')?.clearValidators();
    this.InitialCheckOutForm.get('paymentInformation.creditCardCVV')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('paymentInformation.creditCardExpMonth')?.clearValidators();
    this.InitialCheckOutForm.get('paymentInformation.creditCardExpMonth')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('paymentInformation.creditCardExpYear')?.clearValidators();
    this.InitialCheckOutForm.get('paymentInformation.creditCardExpYear')?.updateValueAndValidity();
  }

  removeValidatorsCreditCardsecondary = () => {
    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardFirstName')?.clearValidators();
    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardFirstName')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardLastName')?.clearValidators();
    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardLastName')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardNumber')?.clearValidators();
    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardNumber')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardType')?.clearValidators();
    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardType')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardZipCode')?.clearValidators();
    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardZipCode')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardCVV')?.clearValidators();
    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardCVV')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardExpMonth')?.clearValidators();
    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardExpMonth')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardExpYear')?.clearValidators();
    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardExpYear')?.updateValueAndValidity();
  }

  removePTPaymentValidator = () => {
    this.InitialCheckOutForm.get('PTpaymentInformation.creditCardFirstName')?.clearValidators();
    this.InitialCheckOutForm.get('PTpaymentInformation.creditCardFirstName')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('PTpaymentInformation.creditCardLastName')?.clearValidators();
    this.InitialCheckOutForm.get('PTpaymentInformation.creditCardLastName')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('PTpaymentInformation.creditCardNumber')?.clearValidators();
    this.InitialCheckOutForm.get('PTpaymentInformation.creditCardNumber')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('PTpaymentInformation.creditCardNumber')?.clearValidators();
    this.InitialCheckOutForm.get('PTpaymentInformation.creditCardNumber')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('PTpaymentInformation.creditCardType')?.clearValidators();
    this.InitialCheckOutForm.get('PTpaymentInformation.creditCardType')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('PTpaymentInformation.creditCardZipCode')?.clearValidators();
    this.InitialCheckOutForm.get('PTpaymentInformation.creditCardZipCode')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('PTpaymentInformation.creditCardCVV')?.clearValidators();
    this.InitialCheckOutForm.get('PTpaymentInformation.creditCardCVV')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('PTpaymentInformation.creditCardExpMonth')?.clearValidators();
    this.InitialCheckOutForm.get('PTpaymentInformation.creditCardExpMonth')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('PTpaymentInformation.creditCardExpYear')?.clearValidators();
    this.InitialCheckOutForm.get('PTpaymentInformation.creditCardExpYear')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('planInitialInformation.isThirtyDayNoticeChecked')?.clearValidators();
    this.InitialCheckOutForm.get('planInitialInformation.isThirtyDayNoticeChecked')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('planInitialInformation.isPTAgreementContractChecked')?.clearValidators();
    this.InitialCheckOutForm.get('planInitialInformation.isPTAgreementContractChecked')?.updateValueAndValidity();
  }

  removeValidatorsPTCreditCardsecondary = () => {
    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardFirstName')?.clearValidators();
    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardFirstName')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardLastName')?.clearValidators();
    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardLastName')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardNumber')?.clearValidators();
    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardNumber')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardType')?.clearValidators();
    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardType')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardZipCode')?.clearValidators();
    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardZipCode')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardCVV')?.clearValidators();
    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardCVV')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardExpMonth')?.clearValidators();
    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardExpMonth')?.updateValueAndValidity();

    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardExpYear')?.clearValidators();
    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardExpYear')?.updateValueAndValidity();
  }

  setEmptyDraftAccount = () => {
    this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountFirstName')?.setValue("");
    this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountLastName')?.setValue("");
    this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountRoutingNumber')?.setValue("");
    this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountNumber')?.setValue("");
    this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountObj')?.setValue(null);
    this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountType')?.setValue("");
    this.InitialCheckOutForm.get('bankingDetailObj.PaymentType')?.setValue("");
  }

  setEmptyPTDraftAccount = () => {
    this.InitialCheckOutForm.get('PTbankingDetailObj.PTDraftAccountFirstName')?.setValue("");
    this.InitialCheckOutForm.get('PTbankingDetailObj.PTDraftAccountLastName')?.setValue("");
    this.InitialCheckOutForm.get('PTbankingDetailObj.PTDraftAccountRoutingNumber')?.setValue("");
    this.InitialCheckOutForm.get('PTbankingDetailObj.PTDraftAccountNumber')?.setValue("");
    this.InitialCheckOutForm.get('PTbankingDetailObj.PTDraftAccountType')?.setValue("");
    this.InitialCheckOutForm.get('PTbankingDetailObj.PTDraftAccountObj')?.setValue(null);
    this.InitialCheckOutForm.get('PTbankingDetailObj.PTPaymentType')?.setValue("");
  }

  setEmptyCreditCardsecondary = () => {
    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardFirstName')?.setValue(null);
    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardLastName')?.setValue(null);
    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardNumber')?.setValue(null);
    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardType')?.setValue(null);
    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardZipCode')?.setValue(null);
    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardCVV')?.setValue(null);
    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardExpMonth')?.setValue(null);
    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardExpYear')?.setValue(null);
  }

  setEmptyPTCreditCardsecondary = () => {
    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardFirstName')?.setValue(null);
    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardLastName')?.setValue(null);
    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardNumber')?.setValue(null);
    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardType')?.setValue(null);
    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardZipCode')?.setValue(null);
    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardCVV')?.setValue(null);
    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardExpMonth')?.setValue(null);
    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardExpYear')?.setValue(null);
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

  GetClubViseProcessingFee() {
    var postData = {
      clubNumber: JSON.parse(sessionStorage.getItem('ClubNumber') || '{}')
    }
    this._http.requestCall(AuthEndPoints.GET_CLUB_VISE_PROCESSING_FEE, ApiMethod.POST, postData)?.subscribe({
      next: (response: any) => {
        if (response) {
          this.ProcessingFee = response.data ? response.data[0].processingFee : null;
        }
        else {
          this.toastr.error(response.Message, constMessage.error);
        }
      }
    })
  }

  setMembershipRecurringDraftOrCreditCard(postData: any) {
    postData.paymentInformation.creditCardExpMonth = postData.paymentInformation.creditCardExpMonthObj != null || postData.paymentInformation.creditCardExpMonthObj != undefined ? postData.paymentInformation.creditCardExpMonthObj.month : "";
    postData.recurrPaymentInfo.recurringPaymentMethod = postData.recurrPaymentInfo.recurringPaymentMethodObj != null || postData.recurrPaymentInfo.recurringPaymentMethodObj != undefined ? postData.recurrPaymentInfo.recurringPaymentMethodObj.paymentMethodType : "";

    if (postData.recurrPaymentInfo.recurringPaymentMethodObj && postData.recurrPaymentInfo.recurringPaymentMethodObj.methodName == "Bank Account") {
      postData.recurrPaymentInfo.creditCardInformation = {
        creditCardFirstName: '',
        creditCardLastName: '',
        creditCardNumber: '',
        creditCardExpMonthObj: undefined,
        creditCardExpMonth: '',
        creditCardExpYear: '',
        creditCardCVV: '',
        creditCardZipCode: '',
        creditCardType: ''
      }
      postData.recurrPaymentInfo.bankAccountInformation.draftAccountType = postData.recurrPaymentInfo.bankAccountInformation.draftAccountTypeObj ? postData.recurrPaymentInfo.bankAccountInformation.draftAccountTypeObj.type : null;
    }
    else if (postData.recurrPaymentInfo.recurringPaymentMethodObj && postData.recurrPaymentInfo.recurringPaymentMethodObj.methodName == "Credit Card") {
      postData.recurrPaymentInfo.bankAccountInformation = {
        draftAccountFirstName: '',
        draftAccountLastName: '',
        draftAccountType: '',
        draftAccountNumber: '',
        draftAccountRoutingNumber: '',
        draftAccountTypeObj: null
      }
      if (postData.recurrPaymentInfo.isSameCard && postData.recurrPaymentInfo.isSameCard == "Yes") {
        postData.recurrPaymentInfo.creditCardInformation = postData.paymentInformation;
      }
      else {
        postData.recurrPaymentInfo.creditCardInformation.creditCardExpMonth = postData.recurrPaymentInfo.creditCardInformation.creditCardExpMonthObj ? postData.recurrPaymentInfo.creditCardInformation.creditCardExpMonthObj.month : null;
      }
    }
    return;
  }

  setPTRecurringDraftOrCreditCard(postData: any) {
    if (postData.ptPaymentObjInfo != null) {
      postData.ptPaymentObjInfo.paymentInformation.creditCardExpMonth = postData.ptPaymentObjInfo.paymentInformation.creditCardExpMonthObj != null || postData.ptPaymentObjInfo.paymentInformation.creditCardExpMonthObj != undefined ? postData.ptPaymentObjInfo.paymentInformation.creditCardExpMonthObj.month : "";
      postData.ptPaymentObjInfo.recurrPaymentInfo.recurringPaymentMethod = postData.ptPaymentObjInfo.recurrPaymentInfo.recurringPaymentMethodObj != null || postData.ptPaymentObjInfo.recurrPaymentInfo.recurringPaymentMethodObj != undefined ? postData.ptPaymentObjInfo.recurrPaymentInfo.recurringPaymentMethodObj.paymentMethodType : "";

      if (postData.ptPaymentObjInfo.recurrPaymentInfo.recurringPaymentMethodObj && postData.ptPaymentObjInfo.recurrPaymentInfo.recurringPaymentMethodObj.methodName == "Bank Account") {
        postData.ptPaymentObjInfo.recurrPaymentInfo.creditCardInformation = {
          creditCardLastName: '',
          creditCardNumber: '',
          creditCardExpMonthObj: undefined,
          creditCardExpMonth: '',
          creditCardExpYear: '',
          creditCardCVV: '',
          creditCardZipCode: ''
        }
        postData.ptPaymentObjInfo.recurrPaymentInfo.bankAccountInformation.draftAccountType = postData.ptPaymentObjInfo.recurrPaymentInfo.bankAccountInformation.draftAccountTypeObj ? postData.ptPaymentObjInfo.recurrPaymentInfo.bankAccountInformation.draftAccountTypeObj.type : null;
      }
      else if (postData.ptPaymentObjInfo.recurrPaymentInfo.recurringPaymentMethodObj && postData.ptPaymentObjInfo.recurrPaymentInfo.recurringPaymentMethodObj.methodName == "Credit Card") {
        postData.ptPaymentObjInfo.recurrPaymentInfo.bankAccountInformation = {
          draftAccountFirstName: '',
          draftAccountLastName: '',
          draftAccountType: '',
          draftAccountNumber: '',
          draftAccountRoutingNumber: ''
        }
        if (postData.ptPaymentObjInfo.recurrPaymentInfo.isSameCard && postData.ptPaymentObjInfo.recurrPaymentInfo.isSameCard == 'Yes') {
          postData.ptPaymentObjInfo.recurrPaymentInfo.creditCardInformation = postData.ptPaymentObjInfo.paymentInformation;
        }
        else {
          postData.ptPaymentObjInfo.recurrPaymentInfo.creditCardInformation.creditCardExpMonth = postData.ptPaymentObjInfo.recurrPaymentInfo.creditCardInformation.creditCardExpMonthObj ? postData.ptPaymentObjInfo.recurrPaymentInfo.creditCardInformation.creditCardExpMonthObj.month : null;
        }
      }
      postData.ptPaymentObjInfo.recurrPaymentInfo.isSameCard = postData.ptPaymentObjInfo.recurrPaymentInfo.isSameCard == "Yes" ? true : false;
    }
    return;
  }

  activeSelectedGenderOption(data: string, index: number) {
    this.InitialCheckOutForm.get('personalInformation.gender')?.setValue(data);
    this.activeIndex = index;
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
  activeSelectedSalesPersonOption(selectedData: salesPersonModel, index: number) {
    this.InitialCheckOutForm.get('personalInformation.salesPersonObj')?.setValue(selectedData);
    this.activeIndex = index;
  }

  activeSelectedStateOption(data: StateModel, index: number) {
    this.InitialCheckOutForm.get('billingInfo.stateObj')?.setValue(data);
  }
  activeSelectedAccountTypeOption(data: AccountTypeModel, index: number) {
    this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountObj')?.setValue(data);
  }
  activePTSelectedAccountTypeOption(data: AccountTypeModel, index: number) {
    this.InitialCheckOutForm.get('PTbankingDetailObj.PTDraftAccountObj')?.setValue(data);
  }
  activeSelectedmonthTypeOption(data: MonthModel, index: number) {
    this.InitialCheckOutForm.get('paymentInformation.creditCardExpMonth')?.setValue(data);
  }
  activeSelectedYearTypeOption(data: any, index: number) {
    this.InitialCheckOutForm.get('paymentInformation.creditCardExpYear')?.setValue(data);
  }
  activeSelectedmonthTypeOptionForPT(data: MonthModel, index: number) {
    this.InitialCheckOutForm.get('PTpaymentInformation.creditCardExpMonth')?.setValue(data);
  }
  activeSelectedYearTypeOptionForPt(data: any, index: number) {
    this.InitialCheckOutForm.get('PTpaymentInformation.creditCardExpYear')?.setValue(data);
  }
  activeSelectedmonthTypeOptionForSecondary(data: MonthModel, index: number) {
    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardExpMonth')?.setValue(data);
  }
  activeSelectedYearTypeOptionForSecondary(data: any, index: number) {
    this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardExpYear')?.setValue(data);
  }
  activeSelectedmonthTypeOptionForPTSecondary(data: MonthModel, index: number) {
    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardExpMonth')?.setValue(data);
  }
  activeSelectedYearTypeOptionForPtSecondary(data: any, index: number) {
    this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardExpYear')?.setValue(data);
  }
  selectPTPlans = () => {
    var ClubNumber = window.sessionStorage.getItem("ClubNumber");
    var GUID = window.sessionStorage.getItem('GUID');
    var URL = window.location.href;
    var PageName = window.location.pathname.split('/').pop();
    var PostData: any = {
      FieldValue: `Choose Another Plan:Choose Another PT Plan`,
      ClubNumber: ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: "Choose Another Plan",
    }
    this._commonService.SaveWorkFlow(PostData);
    this._router.navigateByUrl('ptplans');
  }

  selectMembershipPlans = () => {
    var ClubNumber = window.sessionStorage.getItem("ClubNumber");
    var GUID = window.sessionStorage.getItem('GUID');
    var URL = window.location.href;
    var PageName = window.location.pathname.split('/').pop();
    var PostData: any = {
      FieldValue: `Choose Another Plan:Choose Another Member Plan`,
      ClubNumber: ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: "Choose Another Plan",
    }
    this._commonService.SaveWorkFlow(PostData);
    this._router.navigateByUrl('plans');
  }

  selectSGTPlans = () => {
    var ClubNumber = window.sessionStorage.getItem("ClubNumber");
    var GUID = window.sessionStorage.getItem('GUID');
    var URL = window.location.href;
    var PageName = window.location.pathname.split('/').pop();
    var PostData: any = {
      FieldValue: `Choose Another Plan:Choose Another SGT Plan`,
      ClubNumber: ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: "Choose Another Plan",
    }
    this._commonService.SaveWorkFlow(PostData);
    this._router.navigateByUrl('smallGroupTraining');
  }

  checkSameAsAbove = () => {
    this.InitialCheckOutForm.get('bankingDetailObj.IsSameAsAbove')?.setValue(this.InitialCheckOutForm.get('bankingDetailObj.IsSameAsAbove')?.value == false ? true : false);
    var PaymentObj = this.InitialCheckOutForm.get('paymentInformation')?.value;
    var secondaryPaymentObj = this.InitialCheckOutForm.get('secondarypaymentInformation')?.value;
    var MemberDraftAccountObj = this.InitialCheckOutForm.get('bankingDetailObj')?.value;

    var IsUseBankingDetailsObj = this.InitialCheckOutForm.controls.bankingDetailObj.controls.IsUseBankingDetails.value;
    var PaymentType = this.InitialCheckOutForm.controls.bankingDetailObj.controls.PaymentType.value;

    if (this.InitialCheckOutForm.controls.bankingDetailObj.controls.IsSameAsAbove.value == true) {
      this.PTPaymentCopyObj = Object.assign({}, this.InitialCheckOutForm.get('PTpaymentInformation')?.value);
      this.secondaryPTPaymentCopyObj = Object.assign({}, this.InitialCheckOutForm.get('secondaryPTpaymentInformation')?.value);

      this.InitialCheckOutForm.get('PTpaymentInformation.creditCardFirstName')?.setValue(PaymentObj?.creditCardFirstName);
      this.InitialCheckOutForm.get('PTpaymentInformation.creditCardLastName')?.setValue(PaymentObj?.creditCardLastName);
      this.InitialCheckOutForm.get('PTpaymentInformation.creditCardNumber')?.setValue(PaymentObj?.creditCardNumber);
      this.InitialCheckOutForm.get('PTpaymentInformation.creditCardExpMonth')?.setValue(PaymentObj?.creditCardExpMonth);
      this.InitialCheckOutForm.get('PTpaymentInformation.creditCardExpYear')?.setValue(PaymentObj?.creditCardExpYear);
      this.InitialCheckOutForm.get('PTpaymentInformation.creditCardCVV')?.setValue(PaymentObj?.creditCardCVV);
      this.InitialCheckOutForm.get('PTpaymentInformation.creditCardZipCode')?.setValue(PaymentObj?.creditCardZipCode);
      this.InitialCheckOutForm.get('PTpaymentInformation.creditCardType')?.setValue(PaymentObj?.creditCardType);

      if (IsUseBankingDetailsObj == false) {
        this.IsPTSecondaryCCDetails = false;
        this.InitialCheckOutForm.get('PTbankingDetailObj.IsPTUseBankingDetails')?.setValue(true);
        this.InitialCheckOutForm.get('PTbankingDetailObj.PTPaymentType')?.setValue("CC");
        this.InitialCheckOutForm.get('bankingDetailObj.PaymentType')?.setValue("CC");
      }
      else if (IsUseBankingDetailsObj == true) {
        this.IsPTSecondaryCCDetails = false;
        this.InitialCheckOutForm.get('PTbankingDetailObj.IsPTUseBankingDetails')?.setValue(true);
      }
      else {
        this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardFirstName')?.setValue(secondaryPaymentObj?.creditCardFirstName);
        this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardLastName')?.setValue(secondaryPaymentObj?.creditCardLastName);
        this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardNumber')?.setValue(secondaryPaymentObj?.creditCardNumber);
        this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardExpMonth')?.setValue(secondaryPaymentObj?.creditCardExpMonth);
        this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardExpYear')?.setValue(secondaryPaymentObj?.creditCardExpYear);
        this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardCVV')?.setValue(secondaryPaymentObj?.creditCardCVV);
        this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardZipCode')?.setValue(secondaryPaymentObj?.creditCardZipCode);
        this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardType')?.setValue(secondaryPaymentObj?.creditCardType);

        this.InitialCheckOutForm.get('PTbankingDetailObj.IsPTUseBankingDetails')?.setValue(null);
        this.IsPTSecondaryCCDetails = true;

        this.setEmptyDraftAccount();
        this.removeValidatorsDraftAccount();
        this.setEmptyPTDraftAccount();
        this.removeValidatorsPTDraftAccount();
        this.InitialCheckOutForm.get('PTbankingDetailObj.PTPaymentType')?.setValue("CC");
        this.InitialCheckOutForm.get('bankingDetailObj.PaymentType')?.setValue("CC");
      }
    }
    else {
      this.InitialCheckOutForm.get('PTbankingDetailObj.IsPTUseBankingDetails')?.setValue(true);
      this.IsPTSecondaryCCDetails = false;

      this.InitialCheckOutForm.get('PTpaymentInformation.creditCardFirstName')?.setValue(this.PTPaymentCopyObj.creditCardFirstName != null ? this.PTPaymentCopyObj.creditCardFirstName : null);
      this.InitialCheckOutForm.get('PTpaymentInformation.creditCardLastName')?.setValue(this.PTPaymentCopyObj.creditCardLastName != null ? this.PTPaymentCopyObj.creditCardLastName : null);
      this.InitialCheckOutForm.get('PTpaymentInformation.creditCardNumber')?.setValue(this.PTPaymentCopyObj.creditCardNumber != null ? this.PTPaymentCopyObj.creditCardNumber : null);
      this.InitialCheckOutForm.get('PTpaymentInformation.creditCardExpMonth')?.setValue(this.PTPaymentCopyObj.creditCardExpMonth != null ? this.PTPaymentCopyObj.creditCardExpMonth : null);
      this.InitialCheckOutForm.get('PTpaymentInformation.creditCardExpYear')?.setValue(this.PTPaymentCopyObj.creditCardExpYear != null ? this.PTPaymentCopyObj.creditCardExpYear : null);
      this.InitialCheckOutForm.get('PTpaymentInformation.creditCardCVV')?.setValue(this.PTPaymentCopyObj.creditCardCVV != null ? this.PTPaymentCopyObj.creditCardCVV : null);
      this.InitialCheckOutForm.get('PTpaymentInformation.creditCardZipCode')?.setValue(this.PTPaymentCopyObj.creditCardZipCode != null ? this.PTPaymentCopyObj.creditCardZipCode : null);

      this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardFirstName')?.setValue(this.secondaryPTPaymentCopyObj.creditCardFirstName != null ? this.secondaryPTPaymentCopyObj.creditCardFirstName : null);
      this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardLastName')?.setValue(this.secondaryPTPaymentCopyObj.creditCardLastName != null ? this.secondaryPTPaymentCopyObj.creditCardLastName : null);
      this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardNumber')?.setValue(this.secondaryPTPaymentCopyObj.creditCardNumber != null ? this.secondaryPTPaymentCopyObj.creditCardNumber : null);
      this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardExpMonth')?.setValue(this.secondaryPTPaymentCopyObj.creditCardExpMonth != null ? this.secondaryPTPaymentCopyObj.creditCardExpMonth : null);
      this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardExpYear')?.setValue(this.secondaryPTPaymentCopyObj.creditCardExpYear != null ? this.secondaryPTPaymentCopyObj.creditCardExpYear : null);
      this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardCVV')?.setValue(this.secondaryPTPaymentCopyObj.creditCardCVV != null ? this.secondaryPTPaymentCopyObj.creditCardCVV : null);
      this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardZipCode')?.setValue(this.secondaryPTPaymentCopyObj.creditCardZipCode != null ? this.secondaryPTPaymentCopyObj.creditCardZipCode : null);

      if (this.InitialCheckOutForm.get('PTbankingDetailObj.IsPTUseBankingDetails')?.value == false) {
        this.setEmptyPTDraftAccount();
        this.setValidatorsPTDraftAccount();
        this.InitialCheckOutForm.get('PTbankingDetailObj.PTPaymentType')?.setValue("CC");
        this.InitialCheckOutForm.get('bankingDetailObj.PaymentType')?.setValue("CC");
      }
    }
    this._commonService.setBodyHeightSize();
  }

  checkUseBanking = () => {
    var IsSameAsAboveObj = this.InitialCheckOutForm.get('bankingDetailObj.IsSameAsAbove')?.value;
    if (IsSameAsAboveObj == true) {
      this.InitialCheckOutForm.get('PTbankingDetailObj.IsPTUseBankingDetails')?.setValue(true);
    }
    else if (IsSameAsAboveObj == false) {
      var fname = (<HTMLInputElement>document.getElementById('AccHolderFirstName')).value;
      var accName = (<HTMLInputElement>document.getElementById('AccountName')).value;
      if (fname != null || fname == "") {
      }
      if (accName != null || accName == undefined) {
      }
    }
    else {
    }
    this.setValidatorsDraftAccount();
  }

  IsBankingDetailsChecked = (data: boolean | null) => {
    this.IsSecondaryCCDetails = false;
    if (data == true) {
      this.showdraftAccount = true;
      this.IsRecurringPaymentFlag = false;
      this.InitialCheckOutForm.get('planInitialInformation.RecurringPaymentMethod')?.setValue("EFT");
      this.removeValidatorsCreditCardsecondary();
      this.removeValidatorsPTCreditCardsecondary();

      if (this.SourceName != this._commonService.commonTypeObj.member.personalTrainingType) {
        var IsSameAsAboveObj = this.InitialCheckOutForm.get('bankingDetailObj.IsSameAsAbove')?.value;
        if (IsSameAsAboveObj == true) {
          this.InitialCheckOutForm.get('PTbankingDetailObj.IsPTUseBankingDetails')?.setValue(true);
          this.IsPTSecondaryCCDetails = false;
        }
        else {
        }
        this.setEmptyDraftAccount();
        this.setValidatorsDraftAccount();
        if (this.membershipPTPlanObj == null || this.SGTPlanObj == null) {
          this.removeValidatorsPTDraftAccount();
        }
      }
      else {
      }
    }
    else if (data == false) {
      this.IsPlaid = false;
      this.showdraftAccount = false;
      this.IsRecurringPaymentFlag = true;
      this.setEmptyDraftAccount();
      this.removeValidatorsDraftAccount();
      this.setEmptyPTDraftAccount()
      this.removeValidatorsPTDraftAccount();

      this.removeValidatorsCreditCardsecondary();
      this.removeValidatorsPTCreditCardsecondary();

      var IsSameAsAboveObj = this.InitialCheckOutForm.get('bankingDetailObj.IsSameAsAbove')?.value;
      if (IsSameAsAboveObj == true) {
        this.InitialCheckOutForm.get('PTbankingDetailObj.IsPTUseBankingDetails')?.setValue(true);
        this.IsPTSecondaryCCDetails = false;
      }
      else {
      }
      this.InitialCheckOutForm.get('planInitialInformation.RecurringPaymentMethod')?.setValue("CreditCard");
      this.InitialCheckOutForm.get('bankingDetailObj.PaymentType')?.setValue("CC");
    }
    else {
      this.IsRecurringPaymentFlag = false;
      this.IsPlaid = false;
      this.showdraftAccount = false;
      this.setEmptyDraftAccount();
      this.removeValidatorsDraftAccount();
      this.setEmptyPTDraftAccount();
      this.removeValidatorsPTDraftAccount();

      var secondaryPaymentObj = this.InitialCheckOutForm.get('secondarypaymentInformation')?.value;

      this.setValidatorsCreditCardsecondary();
      var IsSameAsAboveObj = this.InitialCheckOutForm.get('bankingDetailObj.IsSameAsAbove')?.value;
      if (IsSameAsAboveObj == true) {
        this.setValidatorPTCreditCardsecondary();

        this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardFirstName')?.setValue(secondaryPaymentObj?.creditCardFirstName);
        this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardLastName')?.setValue(secondaryPaymentObj?.creditCardLastName);
        this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardNumber')?.setValue(secondaryPaymentObj?.creditCardNumber);
        this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardExpMonth')?.setValue(secondaryPaymentObj?.creditCardExpMonth);
        this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardExpYear')?.setValue(secondaryPaymentObj?.creditCardExpYear);
        this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardCVV')?.setValue(secondaryPaymentObj?.creditCardCVV);
        this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardZipCode')?.setValue(secondaryPaymentObj?.creditCardZipCode);
        this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardType')?.setValue(secondaryPaymentObj?.creditCardType);

        this.InitialCheckOutForm.get('PTbankingDetailObj.IsPTUseBankingDetails')?.setValue(null);
        this.IsPTSecondaryCCDetails = true;
      }

      this.IsSecondaryCCDetails = true;
      this.InitialCheckOutForm.get('planInitialInformation.RecurringPaymentMethod')?.setValue("CreditCard");
      this.InitialCheckOutForm.get('bankingDetailObj.PaymentType')?.setValue("CC");
    }
    this._commonService.setBodyHeightSize();
  }

  IsPTBankingDetailsChecked = (isPTChecked: boolean | null) => {
    this.IsPTSecondaryCCDetails = false;

    if (isPTChecked == true) {
      this.InitialCheckOutForm.get('planInitialInformation.PTRecurringPaymentMethod')?.setValue("EFT");
      if (this.InitialCheckOutForm.controls.PTbankingDetailObj.controls.PTDraftAccountFirstName.value == "") {
        this.setEmptyPTDraftAccount();
      }
      this.setValidatorsPTDraftAccount();

      this.removeValidatorsPTCreditCardsecondary();
    }
    else if (isPTChecked == false) {
      this.setEmptyPTDraftAccount();
      this.removeValidatorsPTDraftAccount();

      this.removeValidatorsPTCreditCardsecondary();

      if (this.SourceName == this._commonService.commonTypeObj.member.personalTrainingType) {
      }
      this.InitialCheckOutForm.get('PTbankingDetailObj.PTPaymentType')?.setValue("CC");
      this.InitialCheckOutForm.get('planInitialInformation.PTRecurringPaymentMethod')?.setValue("CreditCard");
    }
    else {
      this.setValidatorPTCreditCardsecondary();

      this.setEmptyPTDraftAccount();
      this.removeValidatorsPTDraftAccount();

      this.IsPTSecondaryCCDetails = true;
      this.InitialCheckOutForm.get('PTbankingDetailObj.PTPaymentType')?.setValue("CC");
      this.InitialCheckOutForm.get('planInitialInformation.PTRecurringPaymentMethod')?.setValue("CreditCard");

    }
    this._commonService.setBodyHeightSize();
  }
  checkCreditCardType(data: string) {
    if (this.InitialCheckOutForm.get('paymentInformation.creditCardNumber')?.valid) {
      this.InitialCheckOutForm.get('paymentInformation.creditCardType')?.setValue(this._commonService.getCreditCardType(data));
    }
    else {
      if (this.InitialCheckOutForm.value.paymentInformation) {
        this.InitialCheckOutForm.get('paymentInformation.creditCardType')?.setValue("");
      };
    };
  }

  checkCreditCardTypeForSecondary(data: string) {
    if (this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardNumber')?.valid) {
      this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardType')?.setValue(this._commonService.getCreditCardType(data));
    }
    else {
      if (this.InitialCheckOutForm.value.secondarypaymentInformation) {
        this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardType')?.setValue("");
      };
    };
  }

  checkPTCreditCardType(data: string) {
    if (this.InitialCheckOutForm.get('PTpaymentInformation.creditCardNumber')?.valid) {
      this.InitialCheckOutForm.get('PTpaymentInformation.creditCardType')?.setValue(this._commonService.getCreditCardType(data));
    }
    else {
      if (this.InitialCheckOutForm.value.PTpaymentInformation) {
        this.InitialCheckOutForm.get('PTpaymentInformation.creditCardType')?.setValue(this.InitialCheckOutForm.value.PTpaymentInformation.creditCardType);
      };
    };
  }

  checkPTCreditCardTypeForPTSecondary(data: string) {
    if (this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardNumber')?.valid) {
      this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardType')?.setValue(this._commonService.getCreditCardType(data));
    }
    else {
      if (this.InitialCheckOutForm.value.secondaryPTpaymentInformation) {
        this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardType')?.setValue(this.InitialCheckOutForm.value.secondaryPTpaymentInformation.creditCardType);
      };
    };
  }

  closePrepaidCCModal() {
    this.modalService.dismissAll();
  }

  closeAgreementContractModal(type: string) {
    this.modalService.dismissAll();
  }

  openAuthorizationTermsContent(authorizationTermsContent: any) {
    var data = this.InitialCheckOutForm.get('planInitialInformation.isAuthorizationTermsChecked')?.value;
    setTimeout(() => {
      this.InitialCheckOutForm.get('planInitialInformation.isAuthorizationTermsChecked')?.setValue(data);
    }, 0);

    this.modalService.open(authorizationTermsContent, {
      centered: true,
      size: 'lg',
      windowClass: 'authorization-terms-model',
      scrollable: true
    });
  }

  closeAuthorizationTermsModal() {
    this.modalService.dismissAll();
  }
  closeTermsConditionsModal() {
    this.modalService.dismissAll();
  }

  openTermsConditionsContent(termsConditionscontent: any) {
    var data = this.InitialCheckOutForm.get('planInitialInformation.isTermsConditionChecked')?.value;
    setTimeout(() => {
      this.InitialCheckOutForm.get('planInitialInformation.isTermsConditionChecked')?.setValue(data);
    }, 0);

    this.modalService.open(termsConditionscontent, {
      centered: true,
      size: 'lg',
      windowClass: 'terms-conditions-model',
      scrollable: true
    });
  }

  checkCreditCardNumber(ccNumber: string | null | undefined, prepaidccModalPopup: any, plantype: string) {
    var CN = ccNumber?.replace(/ /g, "");
    this._checkOutService.checkCreditCardNumber(ccNumber)?.subscribe({
      next: (response: any) => {
        if (response.data == "1") {
          this.modalService.open(prepaidccModalPopup, { centered: true });
          if (plantype == "PTPlan") {
            this.CheckPTOneTimeCC = true;
            this.InitialCheckOutForm.get('PTpaymentInformation.creditCardNumber')?.setValue("");
            this.InitialCheckOutForm.get('secondaryPTpaymentInformation.creditCardNumber')?.setValue("");
          }
          else {
            this.CheckOneTimeCC = true;
            this.InitialCheckOutForm.get('paymentInformation.creditCardNumber')?.setValue("");
            this.InitialCheckOutForm.get('secondarypaymentInformation.creditCardNumber')?.setValue("");
          }
        }
        else if (response.data == "2") {
          if (plantype == "PTPlan") {
            this.PTCCNumberList.push(CN);
            if (this.PTCCNumberList.length > 0 && this.CheckPTOneTimeCC) {
              this.IsPTUserChangedPrepaidCard = true;
            }
            this.IsPTPrepaidCC = false;
          }
          else {
            this.CCNumberList.push(CN);
            if (this.CCNumberList.length > 0 && this.CheckOneTimeCC) {
              this.IsUserChangedPrepaidCard = true;
            }
            this.IsPrepaidCC = false;
          }
        }
      },
      error: (error: { error: { StackTrace: string | undefined; }; }) => {
        this.toastr.error(error.error.StackTrace, constMessage.error);
      }
    });
  }

  saveTemporaryData = (agreementType: string, agreementContractContent: any, signature: SignaturePad, initialSignature: SignaturePad) => {
    
    var RecurringPlanObj = null;
    if (this.membershipPTPlanObj && agreementType == 'PTAgreement') {
      RecurringPlanObj = JSON.parse(window.sessionStorage.getItem("PTPlanObj")!);
      RecurringPlanObj = this.RecurringPlanReportDataForPlanType(RecurringPlanObj);
    }
    else if (this.SGTPlanObj && agreementType == 'SGTAgreement') {
      RecurringPlanObj = JSON.parse(window.sessionStorage.getItem("SmallGroupPlanObj")!);
    }

    if (this.membershipPlanObj) {
      var PlanObj = JSON.parse(window.sessionStorage.getItem("PlanObj")!);
      PlanObj.planType = PlanObj.planName.includes("Paid in Full") ? "PIF" : "EFT";
      PlanObj.planBiweeklyType = PlanObj.planName.includes("Biweekly") ? "Biweekly" : "";
    }
    var agreementModel: any = _.cloneDeep(this.InitialCheckOutForm.value);
    var data = this.InitialCheckOutForm.get('bankingDetailObj')?.value;

    var regobj = JSON.parse(window.sessionStorage.getItem("RegisterObj")!);

    if (this.membershipPlanObj) {
      this.bankDetailsInfo = {
        DraftAccountFirstName: this.showdraftAccount ?
          this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountFirstName')?.value == "" ? regobj?.firstName :
            this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountFirstName')?.value : "",

        DraftAccountLastName: this.showdraftAccount ? this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountLastName')?.value == "" ? regobj?.lastName :
          this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountLastName')?.value : "",

        DraftAccountRoutingNumber: !this.showdraftAccount && this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountRoutingNumber')?.value == "" ? ""
          : this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountRoutingNumber')?.value,

        DraftAccountNumber: !this.showdraftAccount && this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountNumber')?.value == "" ? ""
          : this.InitialCheckOutForm.get('bankingDetailObj.DraftAccountNumber')?.value,

        DraftAccountType: !this.showdraftAccount && this.InitialCheckOutForm.get("bankingDetailObj.DraftAccountObj")!.value == undefined ? ""
          : this.InitialCheckOutForm.get("bankingDetailObj.DraftAccountObj")!.value?.Type,
      }
    
      var paymentObj = this.InitialCheckOutForm.get('paymentInformation')?.value;
      this.creditDetailsInfo = {
        creditCardFirstName: paymentObj?.creditCardFirstName,
        creditCardLastName: paymentObj?.creditCardLastName,
        creditCardNumber: paymentObj?.creditCardNumber,
        creditCardExpMonth: paymentObj?.creditCardExpMonth?.month,
        creditCardExpYear: paymentObj?.creditCardExpYear,
        creditCardCVV: paymentObj?.creditCardCVV,
        creditCardZipCode: paymentObj?.creditCardZipCode,
        creditCardType: paymentObj?.creditCardType
      }

       if (this.showdraftAccount) {
        this.creditDetailsInfo.PaymentType = this.showdraftAccount ? "ACH" : "CC";
      }
      else{
        this.creditDetailsInfo.PaymentType = this.showdraftAccount ? "ACH" : "CC";
      }
    }

    if (this.membershipPTPlanObj || this.SGTPlanObj) {

      var PTpaymentObj = this.InitialCheckOutForm.get('PTpaymentInformation')?.value;
      this.PTcreditDetails = {
        creditCardFirstName: PTpaymentObj?.creditCardFirstName,
        creditCardLastName: PTpaymentObj?.creditCardLastName,
        creditCardNumber: PTpaymentObj?.creditCardNumber,
        creditCardExpMonth: PTpaymentObj?.creditCardExpMonth?.month,
        creditCardExpYear: PTpaymentObj?.creditCardExpYear,
        creditCardCVV: PTpaymentObj?.creditCardCVV,
        creditCardZipCode: PTpaymentObj?.creditCardZipCode,
        creditCardType: PTpaymentObj?.creditCardType,
        PaymentType : "CC"
      }
    }

    var billingInfo = this.InitialCheckOutForm.get('billingInfo')?.value;
    var billingInfoObj = {
      address: billingInfo?.address,
      City: billingInfo?.city,
      State: billingInfo?.stateObj?.stateCode,
      ZipCode: billingInfo?.zipCode,
    }

    if (this.SourceName == this._commonService.commonTypeObj.member.personalTrainingType) {
      this.personalObj = JSON.parse(window.sessionStorage.getItem("MemberObj")!)
    }
    else {
      this.personalObj = JSON.parse(window.sessionStorage.getItem("RegisterObj")!)
    }

    var personInfo = this.InitialCheckOutForm.get('personalInformation')?.value;
    this.personalObj.salesPersonObj = personInfo?.salesPersonObj;

    var tempPostData: AgreementModel = {
      personalInformation: this.personalObj,
      billingInfo: billingInfoObj,
      planInitialInformation: PlanObj,
      PTpaymentInfo: this.PTcreditDetails,
      paymentInfo: this.creditDetailsInfo,
      PTPlanInformation: RecurringPlanObj ? RecurringPlanObj : null,
      BankingDetailObj: this.bankDetailsInfo,
      signatureBody: signature.isEmpty() ? "" : signature.toDataURL(),
      initialSignatureBody: signature.isEmpty() ? "" : initialSignature.toDataURL(),
      isKiosk: true,
      agreementType: agreementType,
      clubNumber: window.sessionStorage.getItem("ClubNumber")!,
      sourceName: window.sessionStorage.getItem("SourceName")!,
      entrySource: "",
      PTbankingDetailObj: this.PTbankDetails
    };
    this._checkOutService.saveTemporaryData(tempPostData)?.subscribe({
      next: (response: any) => {
        if (!response.error) {
          this.agreementUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.apiUrl + response.data);
          this.modalService.open(agreementContractContent, {
            centered: true,
            size: 'xl',
            windowClass: 'agreement-contract-modal agreement-css'
          });
          this.agreementType = agreementType;
          if (this.agreementType == this.agreementContractObj.memberShipTypeAgreement) {
            this.enableMembershipAgreementContractChecked = true;
            this.checkAgreementIsReadable(this.enableMembershipAgreementContractChecked, 'Membership')
          }
          else if (this.agreementType == this.agreementContractObj.ptTypeAgreement) {
            this.enablePTAgreementContractChecked = true;
            this.checkAgreementIsReadable(this.enablePTAgreementContractChecked, 'PT')
          }
        }
        else {
          if (response.error) {
            this.toastr.error(response.Message, "Error");
            var ClubNumber = window.sessionStorage.getItem("ClubNumber");
            var GUID = window.sessionStorage.getItem('GUID');
            var URL = window.location.href;
            var PageName = window.location.pathname.split('/').pop();
            var PostData: any = {
              FieldValue: `${agreementType}:${response.Message}`,
              ClubNumber: ClubNumber,
              SessionId: GUID,
              PageName: PageName,
              PageUrl: URL,
              ActionType: agreementType,
            }
            this._commonService.SaveWorkFlow(PostData);
          }
        }
      },
      error: (error: { error: { StackTrace: string | undefined; }; }) => {
        this.toastr.error(error.error.StackTrace, constMessage.error);
        var ClubNumber = window.sessionStorage.getItem("ClubNumber");
        var GUID = window.sessionStorage.getItem('GUID');
        var URL = window.location.href;
        var PageName = window.location.pathname.split('/').pop();
        var PostData: any = {
          FieldValue: `${agreementType}:${error.error.StackTrace}`,
          ClubNumber: ClubNumber,
          SessionId: GUID,
          PageName: PageName,
          PageUrl: URL,
          ActionType: agreementType,
        }
        this._commonService.SaveWorkFlow(PostData);
      }
    });

  }

  RecurringPlanReportDataForPlanType = (RecurringPlanObj: any) => {
    RecurringPlanObj.PTPlanType = RecurringPlanObj.originalPlanName.includes("Buy 4 Get 2 Free") ? "" :
      RecurringPlanObj.originalPlanName.includes("PIF") ? "PIF" :
        "EFT";
    RecurringPlanObj.totalPrice = RecurringPlanObj.totalPrice.replace(',', '');

    return RecurringPlanObj;
  }

  checkAgreementIsReadable(flag: boolean, type: string) {
    let element = document.getElementById(type);

    if (flag) {
      element?.classList.remove('cover', 'd-block');
      element?.classList.add('d-none');
    }
    else {
      if (type === this.agreementContractObj.memberShipTypeAgreement) {
        this.toastr.warning(`${"Please read Membership Agreement."}`);
        this.planInitialInformation.get('isMembershipAgreementContractChecked')?.setValue(false);
      }
      else if (type === this.agreementContractObj.ptTypeAgreement) {
        this.toastr.warning(`${"Please read PT Agreement."}`);
        this.planInitialInformation.get('isPTAgreementContractChecked')?.setValue(false);
      }
    }
  }
}

