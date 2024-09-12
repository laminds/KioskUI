import { FormControl, FormGroup } from "@angular/forms";
import { salesPersonModel } from "./salesPersonModel";
import { BankAccountInformationFormModel, BillingInfoFormModel, PaymentInformationFormModel } from "./checkoutInfo.model";

export class guestInitialInfoModel {
  firstName: FormControl<any> = new FormControl('');
  lastName: FormControl<string | null> = new FormControl('');
  email: FormControl<string | null> = new FormControl('');
  phoneNumber: FormControl<string | null> = new FormControl('');
  dob: FormControl<Date | string | null> = new FormControl('');
  gender: FormControl<string | null> = new FormControl('');
  salesPersonObj!: FormControl<salesPersonModel>;
}

export class personalInfoModel {
  firstName: FormControl<string | null> = new FormControl('');
  lastName: FormControl<string | null> = new FormControl('');
  email: FormControl<string | null> = new FormControl('');
  phoneNumber: FormControl<string | null> = new FormControl('');
  dob: FormControl<Date | string | null> = new FormControl('');
  gender: FormControl<string | null> = new FormControl('');
  isKeepMeUpdate : FormControl<Boolean | null> = new FormControl(false);
  memberId : FormControl<string | null> = new FormControl('');
  clubNumber : FormControl<number | null> = new FormControl(0);
  isGuestModule : FormControl<Boolean | null> = new FormControl(false);
}

export class paymentInfoModel {
  memberId : FormControl<string | null> = new FormControl('');
  clubNumber : FormControl<number | null> = new FormControl(0);
  email : FormControl<string | null> = new FormControl('');
  phonenumber: FormControl<string | null> = new FormControl('');
  billingInfo!: FormGroup<BillingInfoFormModel>;
  paymentInformation!: FormGroup<PaymentInformationFormModel>;
}