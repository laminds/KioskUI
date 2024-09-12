import { FormControl } from "@angular/forms";

export class silverFitModel{
    firstName: FormControl<string | null> = new FormControl('');
    lastName: FormControl<string | null> = new FormControl('');
    phoneNumber: FormControl<string | null> = new FormControl('');
    email: FormControl<string | null> = new FormControl('');
    silverFitnessID: FormControl<string | null> = new FormControl('');
    clubNumber: FormControl<string | null | undefined> = new FormControl('');
}


export class SilverFitDetails {
    fullName: string = "";
    email: string = "";
    phoneNumber: string = ""
  }