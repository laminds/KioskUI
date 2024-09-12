
import { FormControl } from "@angular/forms";
import { salesPersonModel } from "./salesPersonModel";

export class  registerModel{
  firstName: FormControl<string | null> = new FormControl('');
  lastName: FormControl<string | null> = new FormControl('');
  phoneNumber: FormControl<string | null> = new FormControl('');
  email: FormControl<string | null> = new FormControl('');
  gender: FormControl<string | null> = new FormControl('');
  DOB: FormControl<Date | null | string> = new FormControl('');
  // goalInterests: FormControl<string | null> = new FormControl('');
}

export class registerInitialModel {
  newClubNumber: number = 0;
  clubNumber: number = 0;
  firstName: string  | null | undefined = "";
  lastName: string  | null | undefined = "";
  fullName: string = "";
  phoneNumber: string  | null | undefined = "";
  email: string | null | undefined = "";
  isNewLead: boolean | null | undefined = null;
  sourceName: string | null = null;
  memberId: string = "";
  limeCardMemberId: string = "";
  expiredDate: Date | null | undefined = null;
  beginDate: Date | null | undefined = null;
  downloaddate: Date | null | undefined = null;
  passDurationDay : string = "";
  auto_Dialer_Opt_In: boolean | null | undefined = null;
  auto_Dialer_Opt_Out: boolean | null | undefined = null;
  text_Opt_In: boolean | null | undefined = null;
  phone_Call_Opt_In: boolean | null | undefined = null;
  hasOptedOutOfEmail: boolean | null | undefined = null;
  email_Opt_In__c: boolean | null | undefined = null;
  uto_Dialer_Opt_Out: boolean | null | undefined = null;
  text_Opt_Out: boolean | null | undefined = null;
  phone_Call_Opt_Out: boolean | null | undefined = null;
  skipExistingProspect: boolean | null | undefined = null;
  isMoreThanSixtyDays: boolean | null | undefined = null;
  isMoreThanSixtyDays_CreatedDate: boolean | null | undefined = null;
  hasGuestPassWasFirstUsed: boolean | null | undefined = null;
  addressLine1: string | null | undefined = null;
  addressLine2: string | null | undefined = null;
  city: string | null | undefined = null;
  state: string | null | undefined = null;
  dob: Date | null | undefined | string = null;
  zipCode: string | null | undefined = null;
  isRFC: boolean | null | undefined = null;
  gender: string | null | undefined = "";
  hsId: string | null | undefined = "";
  salesPersonObj: salesPersonModel | null | undefined = null;
  entrySource : string = "";
}

export class  minorModel{
  firstName: FormControl<string | null> = new FormControl('');
  lastName: FormControl<string | null> = new FormControl('');
  phoneNumber: FormControl<string | null> = new FormControl('');
  DOB: FormControl<Date | null | string> = new FormControl('');
}
