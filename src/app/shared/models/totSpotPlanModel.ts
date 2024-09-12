import { FormControl } from "@angular/forms";
import { salesPersonModel } from "./salesPersonModel";

export class totSpotPlanModel {
  planName: string | null | undefined = "";
  downPaymentTotalAmount: string | null | undefined = "";
  initiationFee: string | null | undefined = "";
}
export class childCareCheckOutRequestModel {
  firstName: string | null | undefined = "";
  lastName: string | null | undefined = "";
  email: string | null | undefined = "";
  phoneNumber: string | null | undefined = "";
  dob: Date | null | undefined | string = null;
  gender: string | null | undefined = "";
  memberId: string | null | undefined = "";
  planName: string | null | undefined = "";
  planPrice: string | null | undefined = "";
  clubNumber: string | null | undefined = "";
  memberType: string | null | undefined | null | undefined = "";
  sourceName: string | null | undefined = "";
  guestType: string | null | undefined = "";
  salesPersonObj: FormControl<salesPersonModel | null | undefined> = new FormControl(null);
}

export class babySittingObjModel{
  firstName: FormControl<string | null> = new FormControl('');
  lastName: FormControl<string | null> = new FormControl('');
  phoneNumber: FormControl<string | null> = new FormControl('');
  email: FormControl<string | null> = new FormControl('');
  gender: FormControl<string | null> = new FormControl('');
  dob: FormControl<Date | null | string> = new FormControl('');
  salesPersonObj: FormControl<salesPersonModel | null | undefined> = new FormControl(null);
  salesPersonId: FormControl<null> = new FormControl(null);
  searchFilter: FormControl<string> = new FormControl('', { nonNullable: true });
}