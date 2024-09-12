import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreditCard } from 'angular-cc-library';
import { post } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { ApiMethod, AuthEndPoints, constMessage } from 'src/app/core/constant/const';
import { HttpService } from 'src/app/core/services/http.service';
import { BillingInfoFormModel, CreditCardTypeModel, MonthModel, PaymentInformationFormModel, PersonalInformationFormModel, StateModel } from 'src/app/shared/models/checkoutInfo.model';
import { paymentInfoModel, personalInfoModel } from 'src/app/shared/models/guestInitialInfoModel';
import { registerInitialModel } from 'src/app/shared/models/registerModel';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-update-payment-info',
  templateUrl: './update-payment-info.component.html',
  styleUrls: ['./update-payment-info.component.css']
})
export class UpdatePaymentInfoComponent {
  Path: string;
  SlideNo: string;
  BannerClass: string;
  commonService!: CommonService;
  headermessage: string;
  subheaderText : string;
  updatePaymentInfoForm!: FormGroup<paymentInfoModel>;
  activeIndex : number;
  regObj: registerInitialModel;
  submitted: boolean;
  submitbtn : string;
  PItext : string;
  billingInfoText : string;
  stateList!: StateModel[];
  monthList: MonthModel[];
  yearList: string[] = [];
  addOnPlanText : string;
  dueTodayText : string;
  creditCardTypeObj!: CreditCardTypeModel;
  MPText : string;

  constructor(private _commonService: CommonService,
    private _httpService: HttpService,
    private router: Router,
    private toastr: ToastrService) {
    this.Path = '';
    this.SlideNo = '';
    this.BannerClass = '';
    this.commonService = _commonService;
    this._commonService.setServiceName(window.sessionStorage.getItem("ServiceName")!);
    this.headermessage = constMessage.member.manageMembershipObj.UPaymentIObj.headerText;
    this.subheaderText = constMessage.member.manageMembershipObj.UPaymentIObj.subheaderText;
    this.activeIndex = 0;
    this.regObj = JSON.parse(window.sessionStorage.getItem("MemberObj") || "{}");
    this.submitted = false;
    this.submitbtn = constMessage.header.submitbtn;
    this.PItext = constMessage.guestInitialInfo.paymentInfo
    this.billingInfoText = constMessage.checkOut.billingInfoText;
    this.addOnPlanText = constMessage.member.manageMembershipObj.UPaymentIObj.addOnPlanText;
    this.dueTodayText = constMessage.member.manageMembershipObj.UPaymentIObj.dueTodayText;
    this.creditCardTypeObj = this._commonService.creditCardTypeObj;
    this.MPText = constMessage.checkOut.MPText;
    this.monthList = [];
    this.updatePaymentInfoForm = new FormGroup<paymentInfoModel>({
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
        creditCardCVV: new FormControl('', [Validators.required,Validators.pattern(this._commonService.cvvNumberDigitPattern)]),
        creditCardZipCode: new FormControl('', [Validators.required,
        Validators.pattern(this._commonService.zipcodeNumberDigitPattern),
        Validators.minLength(2),]),
        creditCardType: new FormControl(''),
        searchFilter: new FormControl('', { nonNullable: true }),
        searchYearFilter: new FormControl('', { nonNullable: true }),
      }),
      memberId : new FormControl(),
      clubNumber : new FormControl(),
      email:new FormControl(),
      phonenumber:new FormControl(),
    });
  }

  ngOnInit(): void {
    this._commonService.ScreenUrl();
    this._commonService.changeIsHeader();
    this._commonService.changeIsFooter();
    var bannerSlide = this._commonService.setDynamicImage();
    this._commonService.setSlideNo(bannerSlide.slideNo);
    this._commonService.setBanner(bannerSlide.bannerClass);
    this._commonService.setEqualDivSize();
    this._commonService.setBodyHeightSize();
    this.monthList = this._commonService.monthList;
    this.stateList = this._commonService.stateList;
    for (let i: number = new Date().getFullYear(); i <= (new Date().getFullYear() + 15); i++) {
      var year = i.toString();
      this.yearList.push(year);
    }
  }

  get form() { return this.updatePaymentInfoForm.controls; }

  activeSelectedStateOption(data: StateModel, index: number) {
    this.updatePaymentInfoForm.get('billingInfo.stateObj')?.setValue(data);
  }

  checkCreditCardType(data: string) {
    if (this.updatePaymentInfoForm.get('paymentInformation.creditCardNumber')?.valid) {
      this.updatePaymentInfoForm.get('paymentInformation.creditCardType')?.setValue(this._commonService.getCreditCardType(data));
    }
    else {
      if (this.updatePaymentInfoForm.value.paymentInformation) {
        this.updatePaymentInfoForm.get('paymentInformation.creditCardType')?.setValue("");
      };
    };
  }

  // getCreditCardType(cardType: string): string {
  //   return cardType === this.creditCardTypeObj.americanExpressShort ? this.creditCardTypeObj.americanExpress :
  //     cardType === this.creditCardTypeObj.visa.toLowerCase() ? this.creditCardTypeObj.visa :
  //       cardType === this.creditCardTypeObj.masterCard.toLowerCase() ? this.creditCardTypeObj.masterCard :
  //         cardType === this.creditCardTypeObj.discover.toLowerCase() ? this.creditCardTypeObj.discover : "";
  // }



  updatePaymentInfoDetails(data: FormGroup<paymentInfoModel>){
    this.submitted = true;
    if (this.updatePaymentInfoForm.invalid) {
      document.getElementById("footerCheckout")!.style.marginBottom = "-100px";
      return;
    }
    var postdata = data.value;
    postdata.billingInfo!.state = postdata.billingInfo?.stateObj?.stateCode;
    postdata.memberId = this.regObj.memberId;
    postdata.clubNumber = this.regObj.clubNumber;
    postdata.email = this.regObj.email;
    postdata.phonenumber = this.regObj.phoneNumber;

    this._httpService.requestCall(AuthEndPoints.UPDATE_PAYMENT_INFO, ApiMethod.POST, postdata)?.subscribe({
      next: (response: any) => {
        if(response.data != "1") {
            this.toastr.error(response.data);
        }
        else { 
          this.toastr.success("Update Payment Information into ABC", "success");
          this.router.navigate(['member/thankyou'])
        }
      
      }
    })
 
    var ClubNumber = window.sessionStorage.getItem("ClubNumber");
    var GUID = window.sessionStorage.getItem('GUID');
    var URL = window.location.href;
    var PageName = window.location.pathname.split('/').pop();
    var PostData: any = {
      FieldValue: `Update Payment Information: Updated , FirstName:${postdata?.paymentInformation?.creditCardFirstName}, LastName:${postdata?.paymentInformation?.creditCardLastName}
                 , CardNumber:${postdata?.paymentInformation?.creditCardNumber} , ExpMonth:${postdata?.paymentInformation?.creditCardExpMonth?.month}
                 , ExpYear:${postdata?.paymentInformation?.creditCardExpYear} , CardCVV:${postdata?.paymentInformation?.creditCardCVV}
                 , CardZipCode:${postdata?.paymentInformation?.creditCardZipCode}`,
      ClubNumber: ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: this.submitbtn
    }
    this._commonService.SaveWorkFlow(PostData);
  }
  activeSelectedmonthTypeOption(data: MonthModel, index: number) {
    this.updatePaymentInfoForm.get('paymentInformation.creditCardExpMonth')?.setValue(data);
  }
  activeSelectedYearTypeOption(data: any, index: number) {
    this.updatePaymentInfoForm.get('paymentInformation.creditCardExpYear')?.setValue(data);
  }
}
