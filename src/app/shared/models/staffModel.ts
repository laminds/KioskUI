import { FormControl } from "@angular/forms";

export class StaffModel {
  fromDate: Date | string = "";
  toDate: Date | string = "";
}

export class staffInfoModel {
  fromDate: FormControl<Date | null | string> = new FormControl('');
  toDate: FormControl<Date | null | string> = new FormControl('');
}

export class StaffRequestModel extends StaffModel {
  clubNumber: string = "";
}


export class StaffResponseModel {
  timeStamp: any = "";
  firstName: string = "";
  lastName: string = "";
  phoneNumber: string = "";
  email: string = "";
  gender: string = "";
  dob: Date | null = null;
  guestType: string = "";
  note: string = "";
  abcCheckIn: string = "";
  visitorType: string | null = "";
  checkInStatus: string = "";
  checkInMessage: string = "";
  hasAppointment: boolean | null = null;
  appointmentStart: Date | null = null;
  appointmentEnd: Date | null = null;
  appointmentSubject: string = "";
  appointmentShown: boolean | null = null;
  leadId: number | null = null;
  dataTrakCheckinId: number | null = null;
  SourceId: number | null = null;
  sfId: string = "";
  contractUrl: string = "";
  memberId: string = "";
  referralMemberId: string = "";
  isCheckOut: boolean | null = null;
  checkOutTimeStamp: any = null;
  gymTime: string = "";
  totalMinutesGymTime: string = "";
  disclaimerUrl: string = "";
  memberType: string = "";
  seprationLine: number | null = null;
  color: string = "";
  healthInsurance: string = "";
  planName: string = "";
  salesPersonEmployeeNumber: string = "";
  salesPersonName: string = "";
  isRFC: boolean | null = null;
  borderColor: string = "";
  isRFCViewed: boolean | null = null;
  equipmentName: string = "";
  totSpotBabysitting: string = "";
  isSurvey: boolean | null = null;
  sourceName: string = "";
  tabName: string = "";
}


export class StaffSessionModel {
  clubNumber: string = "";
  clubName: string = "";
  memberId: string = "";
  firstName: string = "";
  lastName: string = "";
  phoneNumber: string = "";
  email: string = "";
  leadId: number | null = null;
  sourceType: string = "";
  sPEmployeeId: string = "";
  salesPersonName: string = "";
  sourceName: string = "";
  memberType : string = "";
  gender: string = "";
  dob: Date | null | string = null;
}