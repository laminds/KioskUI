import { FormControl } from "@angular/forms";
import { salesPersonModel } from "./salesPersonModel";
import { EquipmentModel } from "./searchModel";
export class memberModel {
    homeClubNumber: string = "";
    firstName: string  | null | undefined = "";
    lastName: string | null | undefined = "";
    phoneNumber: string | null | undefined = "";
    email: string  | null | undefined = "";
    memberLeadId: number | null | undefined = null;
    clubNumber: number = 0;
    memberId:string = "";
    agreementNumber:any;
    expiredDate: Date | null | undefined = null;
    guestType: string = "";
    clubStationId: string | null | undefined = null;
    memberType: string | null | undefined = null;
    memberStatus: string | null | undefined = null;
    renewMemberId: number | null | undefined = null;
    ModuleName: string | null | undefined = null;
    dob: Date | null | undefined | string = null;
    gender: string | null | undefined = "";
    ptMemberId: string | null | undefined = null;
    isFlipPlan: boolean | null | undefined = null;
    clubName: string | null | undefined = null;
    isKeepMeUpdate: boolean | null | undefined = null;
    salesPersonObj: salesPersonModel | null | undefined = null;
    equipmentObj : EquipmentModel | null | undefined = null;
  }

  export class pickleballObjModel{
    firstName: FormControl<string | null> = new FormControl('');
    lastName: FormControl<string | null> = new FormControl('');
    phoneNumber: FormControl<string | null> = new FormControl('');
    email: FormControl<string | null> = new FormControl('');
    gender: FormControl<string | null> = new FormControl('');
    dob: FormControl<Date | null | string> = new FormControl('');
    equipmentObj: FormControl<EquipmentModel | null | undefined> = new FormControl(null);
    equipmentId: FormControl<number | null> = new FormControl(null);
    searchFilter: FormControl<string> = new FormControl('', { nonNullable: true });
  }