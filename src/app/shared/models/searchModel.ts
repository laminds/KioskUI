import { FormControl } from "@angular/forms";

export class searchModel {
  phoneNumber: string = "";
  email: string = "";
}

export class LeadAndMemberResponseModel {
  MemberList: LeadModel[] = [];
  ProspectList: LeadModel[] = [];
}

export class LeadModel {
  clubNumber: string = "";
  newClubNumber: string = "";
  homeClubNumber: string = "";
  firstName: null| undefined | string = "";
  lastName: null| undefined |string = "";
  fullName: string = "";
  phoneNumber: null| undefined | string = "";
  email: null| undefined | string = "";
  hearAbout: string = "";
  hsId: string = "";
  isNewLead: boolean | null | undefined = null;
  canValidateEmail: boolean | null | undefined = null;
  expiredDate: Date | null | undefined = null;
  beginDate: Date | null | undefined = null;
  downloaddate: Date | null | undefined = null;
  guestPassFirstUseDate?: Date | null | undefined = null;
  passDurationDay : string = "";
  memberId: string = "";
  membershipType: string = "";
  referringSFId: string = "";
  limeCardMemberId: string = "";
  clubStationId: string = "";
  guestType: string = "";
  auto_Dialer_Opt_In: boolean | null | undefined = null;
  text_Opt_In: boolean | null | undefined = null;
  phone_Call_Opt_In: boolean | null | undefined = null;
  auto_Dialer_Opt_Out: boolean | null | undefined = null;
  text_Opt_Out: boolean | null | undefined = null;
  phone_Call_Opt_Out: boolean | null | undefined = null;
  hasOptedOutOfEmail: boolean | null | undefined = null;
  email_Opt_In__c: boolean | null | undefined = null;
  createdBy: string = "";
  skipExistingProspect: boolean | null | undefined = null;
  isMoreThanSixtyDays: boolean | null | undefined = null;
  isMoreThanSixtyDays_CreatedDate: boolean | null | undefined = null;
  lastCheckInDate: Date | null | undefined = null;
  addressLine1: string = "";
  addressLine2: string = "";
  city: string = "";
  state: string = "";
  zipCode: string = "";
  dob: string | Date | null | undefined = null;
  driverLicenseEncode: string = "";
  barcode: string = "";
  memberLeadId: number | null | undefined = null;
  agreement: string = "";
  memberStatus: string = "";
  hasGuestPassWasFirstUsed: boolean | null | undefined = null;
  memberCheckInStatus: string = "";
  renewMemberId: number | null | undefined = null;
  moduleNo: string = "";
  searchTxt: string = "";
  gender: string | null |  undefined = "";
  salesPersonObj: EmployeeDetailModel | null = null;
  equipmentObj: EquipmentModel | null | undefined = null;
  entrySource: string = "";
  newEntrySource: string = "";
  isRFC: boolean | null | undefined = null;
  ptMemberId: string = "";
  isFlipPlan: boolean | null | undefined = null;
  isGuestPassFirstUsed: boolean | null | undefined = null;
  isGuestPass: boolean | null | undefined = null;
  guestPassDay: number | null | undefined = null;
  agreementNumber: string = "";
  duplicate__c: boolean | null = null;
  isConverted: boolean | null = null;
  referringMemberId : string = "";
  referringMemberFirst : string = "";
  referringMemberLast : string = "";
}

export class EmployeeDetailModel {
  EmployeeId: number | null | undefined = null;
  PaychexId: string = "";
  FirstName: string = "";
  LastName: string = "";
  FullName: string = "";
  EmployeePhone: string = "";
  EmployeeEmail: string = "";
  EmployeeStatus: string = "";
  EpFullName: string = "";
  EmpBranchCode: string = "";
  SPClubNumber: number | null | undefined = null;
  SPEmployeeId: string = "";
  SalesPersonMissing: number | null | undefined = null;
  BarCode: string = "";
}

export class EquipmentModel {
  equipmentId: number | null | undefined = null;
  name: string = "";
  price: any = null;
  fullName: string = "";
}

export class MemberRFCRequestModel {
  memberId: string = "";
  email:  null | undefined |  string = "";
  primaryPhone: string | null | undefined = "";
  firstName: string  | null | undefined= "";
  lastName: string   | null | undefined = "";
}

export class searchInfoModel{
  phoneNumber: FormControl<string | null> = new FormControl('');
  email: FormControl<string | null> = new FormControl('');
}