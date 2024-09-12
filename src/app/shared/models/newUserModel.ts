import { FormControl } from "@angular/forms";
import { salesPersonModel } from "./salesPersonModel";

export class newUserModel{
  firstName: FormControl<string | null> = new FormControl('');
  lastName: FormControl<string | null> = new FormControl('');
  phoneNumber: FormControl<string | null> = new FormControl('');
  email: FormControl<string | null> = new FormControl('');
  gender: FormControl<string | null> = new FormControl('');
  DOB: FormControl<Date | null | string> = new FormControl('');
  goalInterests: FormControl<string | null> = new FormControl('');
  salesPersonObj: FormControl<salesPersonModel | null | undefined> = new FormControl(null);
  salesPersonId: FormControl<number | null> = new FormControl(null);
}