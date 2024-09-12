import { FormControl, FormGroup } from "@angular/forms";
import { salesPersonModel } from "./salesPersonModel";
import { memberPTPlanModel } from "./memberplan-model";


export class InitialCheckOutModel {
  personalInformation!: FormGroup<PersonalInformationFormModel>;
  billingInfo!: FormGroup<BillingInfoFormModel>;
  paymentInformation!: FormGroup<PaymentInformationFormModel>;
  secondarypaymentInformation!: FormGroup<PaymentInformationFormModel>;
  planInitialInformation!: FormGroup<PlanInitialInformationFormModel>;
  PTpaymentInformation!: FormGroup<PaymentInformationFormModel>;
  secondaryPTpaymentInformation!: FormGroup<PaymentInformationFormModel>;
  bankingDetailObj!:  FormGroup<BankingDetailObj>;
  PTbankingDetailObj!:  FormGroup<PTBankingDetailObj>;
  IsPrepaidCCard!:  FormGroup<IsPrepaidCCard>;
  IsPTPrepaidCCard!:  FormGroup<IsPTPrepaidCCard>;
}

export class IsPrepaidCCard{
  IsPrepaidCreditCard: FormControl<boolean | null> = new FormControl(false);
  IsUserChangedPrepaidCard: FormControl<boolean | null> = new FormControl(false);
}

export class IsPTPrepaidCCard{
  IsPrepaidCreditCard: FormControl<boolean | null> = new FormControl(false);
  IsUserChangedPrepaidCard: FormControl<boolean | null> = new FormControl(false);
}


export class PersonalInformationFormModel {
  firstName: FormControl<string | null> = new FormControl('');
  lastName: FormControl<string | null> = new FormControl(''); 
  phoneNumber: FormControl<string | null> = new FormControl('');
  email: FormControl<string | null> = new FormControl('');
  gender: FormControl<string | null> = new FormControl('');
  DOB: FormControl<Date | null | string> = new FormControl('');
  salesPersonObj: FormControl<salesPersonModel | null | undefined> = new FormControl();
  salesPersonId: FormControl<number | null> = new FormControl(null);
  searchFilter: FormControl<string> = new FormControl('', { nonNullable: true });
  HubSpotId: FormControl<string | null> = new FormControl('');
  MemberId: FormControl<string | null> = new FormControl('');
}

export class BillingInfoFormModel {
  address: FormControl<string | null> = new FormControl('');
  city: FormControl<string | null> = new FormControl('');
  stateObj: FormControl<StateModel | null> = new FormControl(null);
  state: FormControl<string | null | undefined> = new FormControl('');
  zipCode: FormControl<string | null> = new FormControl('');
  searchFilter: FormControl<string> = new FormControl('', { nonNullable: true });
}

export class PaymentInformationFormModel {
  creditCardFirstName: FormControl<string | null | undefined> = new FormControl('');
  creditCardLastName: FormControl<string | null | undefined> = new FormControl('');
  creditCardNumber: FormControl<string | null | undefined> = new FormControl('');
  creditCardExpMonth: FormControl<MonthModel | null | undefined> = new FormControl(null);
  creditCardExpYear: FormControl<string | null | undefined> = new FormControl('');
  creditCardCVV: FormControl<string | null | undefined> = new FormControl('');
  creditCardZipCode: FormControl<string | null | undefined> = new FormControl('');
  creditCardType: FormControl<string | null | undefined> = new FormControl('');
  searchFilter: FormControl<string> = new FormControl('', { nonNullable: true });
  searchYearFilter: FormControl<string> = new FormControl('', { nonNullable: true });
}
// export class SecondaryPaymentInformationFormModel {
//   creditCardFirstName: FormControl<string | null | undefined> = new FormControl('');
//   creditCardLastName: FormControl<string | null | undefined> = new FormControl('');
//   creditCardNumber: FormControl<string | null | undefined> = new FormControl('');
//   creditCardExpMonth: FormControl<MonthModel | null | undefined> = new FormControl(null);
//   creditCardExpYear: FormControl<string | null | undefined> = new FormControl('');
//   creditCardCVV: FormControl<string | null | undefined> = new FormControl('');
//   creditCardZipCode: FormControl<string | null | undefined> = new FormControl('');
//   creditCardType: FormControl<string | null | undefined> = new FormControl('');
//   searchFilter: FormControl<string> = new FormControl('', { nonNullable: true });
// }
export class BankAccountInformationFormModel {
  draftAccountFirstName: FormControl<string | null> = new FormControl('');
  draftAccountLastName: FormControl<string | null> = new FormControl('');
  draftAccountType: FormControl<string | null> = new FormControl('');
  draftAccountNumber: FormControl<string | null> = new FormControl('');
  draftAccountRoutingNumber: FormControl<string | null> = new FormControl('');
}

export class PlanInitialInformationFormModel {
  ClubNumber: FormControl<string | null> = new FormControl('');
  PlanId: FormControl<string | null> = new FormControl('');
  clubName: FormControl<string | null> = new FormControl('');
  PlanName: FormControl<string | null> = new FormControl('');
  PTPlanName: FormControl<string | null> = new FormControl('');
  PlanPrice: FormControl<string | null> = new FormControl('');
  PTPlanId: FormControl<string | null> = new FormControl('');
  PtPlanNameType: FormControl<string | null> = new FormControl('');
  PTPlanType: FormControl<string | null> = new FormControl('');
  SmallGroupPlanId: FormControl<string | null> = new FormControl('');
  SmallGroupValidationHash: FormControl<string | null> = new FormControl('');
  PlanType: FormControl<string | null> = new FormControl('');
  PlanBiweeklyType: FormControl<string | null> = new FormControl('');
  PTValidationHash: FormControl<string | null> = new FormControl('');
  NewEntrySource: FormControl<Boolean> = new FormControl();
  // IsSameAsAbove: FormControl<Boolean> = new FormControl();
  RecurringServiceId: FormControl<string | null> = new FormControl('');
  SignatureBody: FormControl<string | null> = new FormControl('');
  InitialSignatureBody: FormControl<string | null> = new FormControl('');
  agreementNumber: FormControl<string | null> = new FormControl('');
  PlanTypeDetail: FormControl<string | null> = new FormControl();
  IsRoutingBankAccount: FormControl<string | null> = new FormControl();
  // IsAgreementContractChecked: FormControl<Boolean> = new FormControl();
    // IsNotesofthisagreementChecked: FormControl<Boolean> = new FormControl();
  isAuthorizationTermsChecked: FormControl<Boolean | null | undefined> = new FormControl();
  isThirtyDayNoticeChecked: FormControl<Boolean |  null> = new FormControl();
  isMembershipAgreementContractChecked: FormControl<Boolean | null> = new FormControl();
  isPTAgreementContractChecked: FormControl<Boolean| null> = new FormControl();
  isTermsConditionChecked: FormControl<Boolean | null | undefined> = new FormControl();
  RecurringPaymentMethod : FormControl<string | null> = new FormControl('');
  PTRecurringPaymentMethod : FormControl<string | null> = new FormControl('');
  IsRecurringPaymentFlag : FormControl<Boolean | null> = new FormControl(false);
  MemberPlanDetailsJson : FormControl<string | null> = new FormControl('');
  PTPlanDetailsJson : FormControl<string | null> = new FormControl('');
  SGTPlanDetailsJson : FormControl<string | null> = new FormControl('');
}

export class BankingDetailObj {
  IsSameAsAbove: FormControl<Boolean | null> = new FormControl(false);
  IsUseBankingDetails: FormControl<boolean | null> = new FormControl(null);
  DraftAccountFirstName: FormControl<string | null> = new FormControl('');
  DraftAccountLastName: FormControl<string | null> = new FormControl('');
  DraftAccountRoutingNumber: FormControl<string | null> = new FormControl('');
  DraftAccountNumber: FormControl<string | null> = new FormControl('');
  DraftAccountObj: FormControl<AccountTypeModel | null | undefined> = new FormControl();
  DraftAccountType: FormControl<string | null> = new FormControl('');
  PaymentType: FormControl<string | null> = new FormControl('');
}

export class PTBankingDetailObj {
  IsPTUseBankingDetails: FormControl<boolean | null> = new FormControl(null);
  PTDraftAccountFirstName: FormControl<string | null> = new FormControl('');
  PTDraftAccountLastName: FormControl<string | null> = new FormControl('');
  PTDraftAccountRoutingNumber: FormControl<string | null> = new FormControl('');
  PTDraftAccountNumber: FormControl<string | null> = new FormControl('');
  PTDraftAccountObj: FormControl<AccountTypeModel | null | undefined> = new FormControl();
  PTDraftAccountType: FormControl<string | null> = new FormControl('');
  PTPaymentType: FormControl<string | null> = new FormControl('');
}

export class CheckOutBillingModel {
  clubNumber: number = 0;
  planId: string | null = null;
  source: string = "";
  sourceName: string = "";
  clubName: string = "";
  agreementNumber: string | null = "";
}

export class StateModel {
  stateCode: string = '';
  stateName: string = '';
}


export class AccountTypeModel {
  id: number = 0;
  Type: string = '';
  AccountType :string = '';
}


export class MonthModel {
  month: string = "";
  monthName: string = "";
}

export class genderModel {
  name: string = "";
}
export class PaymentMethodModel {
  id: number = 0;
  methodName: string = "";
  paymentMethodType: string = "";
}
export class AccountModel {
  id: number = 0;
  type: string = "";
  accountType: string = "";
}

export class CreditCardTypeModel {
  americanExpress: string = "";
  americanExpressShort: string = "";
  visa: string = "";
  masterCard: string = "";
  discover: string = "";
}


export class AgreementModel {
  personalInformation!: FormGroup<PersonalInformationFormModel>;
  billingInfo!: any;
  planInitialInformation!: MembershipPlanAgreementModel;
  PTpaymentInfo!: any;
  paymentInfo!: any;
  PTPlanInformation! : memberPTPlanModel;
  BankingDetailObj! : any;
  signatureBody: string | null = null;
  initialSignatureBody: string | null = null;
  isKiosk!: boolean;
  agreementType: string = "";
  clubNumber: string = "";
  sourceName: string = "";
  entrySource: string = "";
  PTbankingDetailObj : any;
}


export class MembershipPlanAgreementModel {
  isPT_agr: boolean = false;
  isMTM_agr: boolean = false;
  agreementDescription: string = "";
  agreementNote: string = "";
  agreementTerms: string = "";
  clubFeeTotalAmount: string = "";
  firstMonthDues: string = "";
  lastMonthDues: string = "";
  firstMonthDuesPricisionValue: string = "";
  firstMonthDuesScaleValue: string = "";
  downPaymentTotalAmount: string = "";
  initiationFee: string = "";
  initiationFeePricisionValue: string = "";
  expirationDate: any;
  planId: string = "";
  planName: string = "";
  planValidation: string = "";
  annualFeeDueDays: string = "";
  membershiptypeplan: string = "";
  planType: string = "";
  planBiweeklyType: string = "";
}