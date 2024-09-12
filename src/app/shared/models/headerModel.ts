import { FormControl } from "@angular/forms";

export class GenerateTicketModel{
    summary: FormControl<string | null> = new FormControl('');
    discription: FormControl<string | null> = new FormControl('');
    attachment: FormControl<FileList | null> = new FormControl(null);
  }