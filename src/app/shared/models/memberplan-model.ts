export class memberShipPlanModel {
  planName: string = "";
  marketingPlanName: string = "";
  planId: string = "";
  agreementDescription: string = "";
  agreementTerms: string = "";
  agreementNote: string = "";
  planValidation: string = "";
  clubFeeTotalAmount: string = "";
  initiationFee: string = "";
  scheduleTotalAmount: string = "";
  firstMonthDues: string = "";
  downPaymentTotalAmount: string = "";
  planFeesPricisionValue: number | null | undefined = null;
  planFeesScaleValue: string = "";
  enrollFeePricisionValue: string = "";
  features: planFeatureModel[] = [];
  activePresale: boolean | null | undefined = null;
  promoCode: string = "";
  promoName: string = "";
  annualFeeDueDays: string = "";
  membershipType: string = "";
  PlanName_IMG: string = "";
  PromoBanner_IMG: string = "";
  Price_IMG: string = "";
  Strikeout_field: string = "";
  prorated_total: string = "";
  PlanDetailsJson: string = "";
}

class planFeatureModel {
  feature: string = "";
  isSelected: boolean | null | undefined = null;
}


export class MemberPlanObj {
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
  planId: string = "";
  planName: string = "";
  planValidation: string = "";
  annualFeeDueDays: string = "";
  membershiptypeplan: string = "";
  planType: string = "";
  planBiweeklyType: string = "";
}


export class memberPTPlanModel  {
  planId : string = '';
  planName: string = '';
  originalPlanName: string = '';
  monthlyRecurringCharge: string = '';
  planPrice: string = '';
  serviceQuantity: string = '';
  totalPrice: string = '';
  validationHash: string = '';
  ptPlanNameType: string = '';
  ptPlanType: string= '';
  processingFee: string= '';
  ptPlanId: string= '';
}