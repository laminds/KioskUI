import { Component, PipeTransform, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';
import { ApiMethod, AuthEndPoints, constMessage } from 'src/app/core/constant/const';
import { StaffModel, StaffRequestModel, StaffResponseModel, StaffSessionModel, staffInfoModel } from '../../models/staffModel';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SearchResult, State, compare } from '../../interface/visitorLogGridEvent';
import * as moment from 'moment';
import { HttpService } from 'src/app/core/services/http.service';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { BehaviorSubject, Observable, Subject, debounceTime, delay, of, switchMap, tap } from 'rxjs';
import { SortColumn, SortDirection, SortEvent } from '../../interface/visitorLogSortEvent';
import { SortableHeaderDirective } from '../../directive/sortable-header.directive';
import { DecimalPipe } from '@angular/common';
import { registerInitialModel, registerModel } from '../../models/registerModel';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StaffComponent {

  staffListData$: Observable<StaffResponseModel[]>;
  mainTotal$: Observable<number>;

  private _search$ = new Subject<void>();
  private _staffList$ = new BehaviorSubject<StaffResponseModel[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private _loading$ = new BehaviorSubject<boolean>(true);

  private _state: State = {
    page: 1,
    pageSize: 4,
    globalSearchTerm: '',
    sortColumn: '',
    sortDirection: '',
    timeStamp: "",
    lastName: "",
    email: "",
    equipmentName: "",
    firstName: "",
    guestType: "",
    phoneNumber: "",
    salesPersonName: "",
    totSpotBabysitting: "",
    checkOutTimeStamp: ""
  };

  @ViewChildren(SortableHeaderDirective) headers!: QueryList<SortableHeaderDirective>;

  path: string;
  slideNo: string;
  BannerClass: string;
  staffObj: StaffModel;
  staffForm: FormGroup<staffInfoModel>;
  submitted: boolean;
  todayDate: Date;
  sevenDayDate: Date;
  isSevenDaysValidation: boolean;
  staffList: StaffResponseModel[];
  highlightClassList: any;
  isTodayDate: boolean | null;
  ClubNumber: string | null;

  constructor(private _commonService: CommonService,
    private _router: Router,
    private _http: HttpService,
    private toastr: ToastrService,
    private pipe: DecimalPipe) {
    this.path = '';
    this.slideNo = '';
    this.BannerClass = '';
    this.staffList = [];
    this.highlightClassList = [];
    this.isTodayDate = null;

    this._commonService.setServiceName(window.sessionStorage.getItem("ServiceName")!);
    this.ClubNumber = window.sessionStorage.getItem("ClubNumber");
    this.submitted = false;
    this.staffObj = {
      fromDate: new Date(),
      toDate: new Date()
    }
    this.todayDate = new Date();
    this.sevenDayDate = new Date(this.staffObj.fromDate);
    this.isSevenDaysValidation = false;
    this.staffForm = new FormGroup<staffInfoModel>({
      fromDate: new FormControl(this.staffObj.fromDate ? new Date(this.staffObj.fromDate) : '', [Validators.required]),
      toDate: new FormControl(this.staffObj.toDate ? new Date(this.staffObj.toDate) : '', [Validators.required]),
    }, []);
    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false)),
      )
      .subscribe((result) => {
        this._staffList$.next(result.staffList);
        this._total$.next(result.total);
      });

    // this._search$.next();
    this.staffListData$ = this.staffList$;
    this.mainTotal$ = this.total$;
    this.savedataflow();
  }
  savedataflow() {
    var GUID = window.sessionStorage.getItem('GUID');
    var URL = window.location.href;
    var PageName = window.location.pathname.split('/').pop();
    var PostData: any = {
      FieldValue: `Staff PageLoad: Staff`,
      ClubNumber: this.ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: "PageLoad"
    }
    this._commonService.SaveWorkFlow(PostData);
  }

  sort(vlList: StaffResponseModel[], column: SortColumn, direction: string): StaffResponseModel[] {
    if (direction === '' || column === '') {
      return vlList;
    } else {
      return [...vlList].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }


  matches(vl: StaffResponseModel, term: string, pipe: PipeTransform) {
    term = term.toLowerCase();
    return (
      // vl.TimeStamp ||
      vl.guestType.toLowerCase().includes(term) ||
      vl.lastName.toLowerCase().includes(term) ||
      vl.firstName.toLowerCase().includes(term) ||
      vl.phoneNumber.toLowerCase().includes(term) ||
      // pipe.transform(vl.PhoneNumber).includes(term) ||
      vl.email.toLowerCase().includes(term) ||
      vl.gymTime.toLowerCase().includes(term) ||
      // vl.CheckOutTimeStamp ||
      // vl.DisclaimerUrl.toLowerCase().includes(term) ||
      vl.salesPersonName.toLowerCase().includes(term) ||
      vl.equipmentName.toLowerCase().includes(term) ||
      vl.totSpotBabysitting.toLowerCase().includes(term)
    );
  }


  ngOnInit(): void {
    this._commonService.ScreenUrl();
    this._commonService.changeIsHeader();
    var bannerSlide = this._commonService.setDynamicImage();
    this.slideNo = bannerSlide.slideNo;
    this.BannerClass = "banner-staff";
    this._commonService.setSlideNo(this.slideNo);
    this._commonService.setBanner(this.BannerClass);
    this._commonService.changeIsFooter();
    this._commonService.setBodyHeightSize();
    this.getStaffInitialDetails();
  }

  get form() { return this.staffForm.controls; }

  getStaffInitialDetails() {
    if (window.sessionStorage.getItem("VisitorUserInfo")) {
      window.sessionStorage.removeItem("VisitorUserInfo")
    }
    if (window.sessionStorage.getItem("RegisterObj")) {
      window.sessionStorage.removeItem("RegisterObj")
    }
    if (window.sessionStorage.getItem("EmailResponse")) {
      window.sessionStorage.removeItem("EmailResponse")
    }
    if (window.sessionStorage.getItem("SourceName")) {
      window.sessionStorage.removeItem("SourceName")
    }
    if (window.sessionStorage.getItem("ModuleName")) {
      window.sessionStorage.removeItem("ModuleName")
    }
    if (window.sessionStorage.getItem("SurveyObj")) {
      window.sessionStorage.removeItem("SurveyObj")
    }

    if (window.sessionStorage.getItem("ClubNumber") && window.sessionStorage.getItem("ClubName")) {
      this.getStaffDetails(this.staffObj);
    }
    else {
      window.sessionStorage.clear();
      this._router.navigate(['Home']);
    }
  }

  sevenDaysValidation(data: StaffModel): number {
    var fromDate = moment(data.fromDate);
    var toDate = moment(data.toDate);
    var differenceDay = toDate.diff(fromDate, 'days');
    return differenceDay;
  }

  getStaffDetails(data: StaffModel) {
    this.submitted = true;
    this.isSevenDaysValidation = false;
    if (this.staffForm.invalid) {
      return;
    }
    else if (this.sevenDaysValidation(data) > 7) {
      this.isSevenDaysValidation = true;
      return;
    }

    var postData: StaffRequestModel = {
      clubNumber: window.sessionStorage.getItem("ClubNumber")!,
      fromDate:  this._commonService.getStringDate(data.fromDate),
      toDate: this._commonService.getStringDate(data.toDate)
    }

    this._http.requestCall(AuthEndPoints.GET_STAFF, ApiMethod.POST, postData)?.subscribe({
      next: (response: any) => {
        if (response.data && response.data.length > 0) {
          this.staffList = response.data;
          this.staffList.forEach((value: StaffResponseModel, key: number) => {
            value.timeStamp = value.timeStamp == null ? " " : moment(value.timeStamp).format('MM/DD/yyyy hh:mm a');
            value.checkOutTimeStamp = value.checkOutTimeStamp == null ? " " :  moment(value.checkOutTimeStamp).format('MM/DD/yyyy hh:mm a');
          });
          this.getOnlyHighlightRowClass(this.staffList);
          this._search();
          this.checkDateIsToday();
        }
        // else{
        //   this.toastr.error(response.error.message, constMessage.error)
        // }
      },
      error: (error) => {
        this.toastr.error(error.error.StackTrace, constMessage.error);
      }
    });
  }


  _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page } = this._state;
    // 1. sort
    let staffList = this.sort(this.staffList, sortColumn, sortDirection);

    let total: number = 0;
    if (staffList) {

      // 2. filter
      staffList = this.filterForDifferentColumn(staffList, this._state);
      total = staffList.length;

      // 3. paginate
      // visitorList = visitorList.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
      this._staffList$.next(staffList);
      this._total$.next(total);
    }
    return of({ staffList, total });
  }



  getOnlyHighlightRowClass(staffList: StaffResponseModel[]) {
    var list = _.unionBy(_.map(staffList, club => _.pick(club, 'color', 'tabName')));
    this.highlightClassList = _.unionBy(list, 'color');
  }

  setMinimumDate(date: Date | string) {
    this.sevenDayDate = new Date(date);
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.sortColumn = column;
    this.sortDirection = direction;
  }

  checkDateIsToday() {
    var fromDate = moment(this.staffObj.fromDate).format("MM/DD/YYYY");
    var toDate = moment(this.staffObj.toDate).format("MM/DD/YYYY");
    var today = moment().format("MM/DD/YYYY");
    if (moment(fromDate).isSame(today) && moment(toDate).isSame(today)) {
      this.isTodayDate = true;
    }
    else {
      this.isTodayDate = false;
    }
  }

  lastNameMatche(vl: StaffResponseModel, term: string, pipe: PipeTransform) {
    return (vl.lastName.toLowerCase().includes(term.toLowerCase()));
  }

  guestTypeMatche(vl: StaffResponseModel, term: string, pipe: PipeTransform) {
    return (vl.guestType.toLowerCase().includes(term.toLowerCase()));
  }

  timeStampMatche(vl: StaffResponseModel, term: string, pipe: PipeTransform) {
    term = moment(term).format('MM/DD/yyyy');
    return (vl.timeStamp.includes(term));
  }

  firstNameMatche(vl: StaffResponseModel, term: string, pipe: PipeTransform) {
    return (vl.firstName.toLowerCase().includes(term.toLowerCase()));
  }

  phoneNumberMatche(vl: StaffResponseModel, term: string, pipe: PipeTransform) {
    return (vl.phoneNumber.toLowerCase().includes(term.toLowerCase()));
  }

  emailMatche(vl: StaffResponseModel, term: string, pipe: PipeTransform) {
    return (vl.email.toLowerCase().includes(term.toLowerCase()));
  }

  salesPersonNameMatche(vl: StaffResponseModel, term: string, pipe: PipeTransform) {
    return (vl.salesPersonName.toLowerCase().includes(term.toLowerCase()));
  }

  equipmentNameMatche(vl: StaffResponseModel, term: string, pipe: PipeTransform) {
    return (vl.equipmentName.toLowerCase().includes(term.toLowerCase()));
  }

  totSpotBabysittingMatche(vl: StaffResponseModel, term: string, pipe: PipeTransform) {
    return (vl.totSpotBabysitting.toLowerCase().includes(term.toLowerCase()));
  }

  checkOutTimeStampMatche(vl: StaffResponseModel, term: string, pipe: PipeTransform) {
    term = moment(term).format('MM/DD/yyyy');
    return (vl.checkOutTimeStamp.includes(term));
  }


  get loading$() {
    return this._loading$.asObservable();
  }
  get page() {
    return this._state.page;
  }
  get pageSize() {
    return this._state.pageSize;
  }
  get globalSearchTerm() {
    return this._state.globalSearchTerm;
  }
  get timeStamp() {
    return this._state.timeStamp;
  }
  get lastName() {
    return this._state.lastName;
  }
  get guestType() {
    return this._state.guestType;
  }
  get firstName() {
    return this._state.firstName;
  }
  get phoneNumber() {
    return this._state.phoneNumber;
  }
  get email() {
    return this._state.email;
  }
  get checkOutTimeStamp() {
    return this._state.checkOutTimeStamp;
  }
  get salesPersonName() {
    return this._state.salesPersonName;
  }
  get equipmentName() {
    return this._state.equipmentName;
  }
  get totSpotBabysitting() {
    return this._state.totSpotBabysitting;
  }
  get staffList$() {
    return this._staffList$.asObservable();
  }
  get total$() {
    return this._total$.asObservable();
  }

  set sortColumn(sortColumn: SortColumn) {
    this._set({ sortColumn });
  }
  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }

  set page(page: number) {
    this._set({ page });
  }
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }
  set globalSearchTerm(globalSearchTerm: string) {
    this._set({ globalSearchTerm });
  }
  set timeStamp(timeStamp: any) {
    this._set({ timeStamp });
  }
  set lastName(lastName: string) {
    this._set({ lastName });
  }
  set guestType(guestType: string) {
    this._set({ guestType });
  }
  set firstName(firstName: string) {
    this._set({ firstName });
  }
  set phoneNumber(phoneNumber: string) {
    this._set({ phoneNumber });
  }
  set email(email: string) {
    this._set({ email });
  }
  set checkOutTimeStamp(checkOutTimeStamp: any) {
    this._set({ checkOutTimeStamp });
  }
  set salesPersonName(salesPersonName: string) {
    this._set({ salesPersonName });
  }
  set equipmentName(equipmentName: string) {
    this._set({ equipmentName });
  }
  set totSpotBabysitting(totSpotBabysitting: string) {
    this._set({ totSpotBabysitting });
  }
  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  redirectToSurveyModule(data: StaffResponseModel) {
    var dob = null;
    var gender = "";
    var postData = {
      Email : data.email
    }
    this._http.requestCall(AuthEndPoints.GET_STAFF_CONTACT, ApiMethod.POST, postData)?.subscribe({
      next: (response: any) => {
        if (response.results && response.results.length > 0) {

          var dateVal = new Date(response.results[0].properties.birthdate);
          //var dateVal = response.results[0].properties.birthdate.split("T");
          dob = this.getFormattedDate(dateVal);
          gender = response.results[0].properties.gender;

          var regObj: registerInitialModel = {
            newClubNumber: Number(window.sessionStorage.getItem("ClubNumber")),
            clubNumber: Number(window.sessionStorage.getItem("ClubNumber")),
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
            email: data.email,
            isNewLead: false,
            sourceName: data.sourceName,
            memberId: data.memberId,
            limeCardMemberId: '',
            addressLine1: null,
            addressLine2: null,
            city: null,
            state: null,
            dob: dob,
            zipCode: null,
            expiredDate: null,
            hasGuestPassWasFirstUsed: false,
            hasOptedOutOfEmail: false,
            isMoreThanSixtyDays: false,
            isMoreThanSixtyDays_CreatedDate: false,
            phone_Call_Opt_In: false,
            phone_Call_Opt_Out: false,
            skipExistingProspect: false,
            text_Opt_In: true,
            text_Opt_Out: false,
            beginDate: null,
            entrySource: "",
            fullName: "",
            gender: gender,
            isRFC: null,
            salesPersonObj: null,
            downloaddate: undefined,
            passDurationDay: '',
            auto_Dialer_Opt_In: false,
            auto_Dialer_Opt_Out: false,
            email_Opt_In__c: false,
            uto_Dialer_Opt_Out: false,
            hsId: null
          }

          window.sessionStorage.setItem("StaffDetail", JSON.stringify(data));
          window.sessionStorage.setItem("SourceName", this._commonService.commonTypeObj.guest.joinType);
          window.sessionStorage.setItem("ModuleName", this._commonService.commonTypeObj.staffType);
          window.sessionStorage.setItem("RegisterObj", JSON.stringify(regObj));
          this._router.navigate(['/survey']);
        }
      },
      error: (error) => {
        this.toastr.error(error.error.StackTrace, constMessage.error);
      }
    });
    var GUID = window.sessionStorage.getItem('GUID');
    var URL = window.location.href;
    var PageName = window.location.pathname.split('/').pop();
    var PostData: any = {
      FieldValue: `QLA:QLA button Click ,FirstName:${data.firstName} ,LastName:${data.lastName} ,Email:${data.email} , PhoneNumber:${data.phoneNumber} ,GuestType:${data.guestType}`,
      ClubNumber: this.ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: "QLA",
    }
    this._commonService.SaveWorkFlow(PostData);
  }

  getFormattedDate(d: any) {
    var year = d.getFullYear();

    var month = (1 + d.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = d.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
  }

  redirectToModule(data: StaffResponseModel, type: string) {
    var DOB = this._commonService.getStringDate(data.dob);
    var postData: StaffSessionModel = {
      clubNumber: window.sessionStorage.getItem("ClubNumber")!,
      clubName: window.sessionStorage.getItem("ClubName")!,
      memberId: data.memberId,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      email: data.email,
      leadId: data.leadId,
      sourceType: type,
      sPEmployeeId: data.salesPersonEmployeeNumber,
      salesPersonName: data.salesPersonName,
      sourceName : this._commonService.commonTypeObj.staffType,
      memberType : data.memberType,
      dob : DOB,
      gender : data.gender
    };

    window.sessionStorage.setItem("StaffUserInfo", JSON.stringify(postData));
    window.sessionStorage.setItem("ModuleName", this._commonService.commonTypeObj.staffType);

    if(type == "Sign Up"){

      window.sessionStorage.setItem("SourceName", "Join");
      window.sessionStorage.setItem("ModuleName", "Join");
      window.sessionStorage.setItem("RegisterObj", JSON.stringify(postData));
      var EmailResponse = { Email: postData.email };
      window.sessionStorage.setItem("EmailResponse", JSON.stringify(EmailResponse));
      window.sessionStorage.setItem("IsPriceShow", JSON.stringify(0));
      if (data.gender ==  "" || data.dob == null  || data.firstName ==  "" || data.lastName ==  "" || data.phoneNumber == "" || data.email ==  "") {
        this._router.navigateByUrl('guest/checkInPass/passinfo');
      }
      else {
        this._router.navigateByUrl("/plans");
      }

      // window.sessionStorage.setItem("SourceName", "Join");
      // window.sessionStorage.setItem("ModuleName", "Join");
      // window.sessionStorage.setItem("RegisterObj", JSON.stringify(postData));
      // var EmailResponse = { Email: postData.email };
      // window.sessionStorage.setItem("EmailResponse", JSON.stringify(EmailResponse));
      // window.sessionStorage.setItem("IsPriceShow", JSON.stringify(0));
      // this._router.navigateByUrl("/plans");
    }
    else if(type == "UpgradeMemberShip"){
      window.sessionStorage.setItem("MemberObj", JSON.stringify(postData));
      this._commonService.setModuleAndRedirectToPerticularSource(type);
    }
    var GUID = window.sessionStorage.getItem('GUID');
    var URL = window.location.href;
    var PageName = window.location.pathname.split('/').pop();
    var PostData: any = {
      FieldValue: `${type}:${type + '' + "Button Click"} ,FirstName:${data.firstName},LastName:${data.lastName} ,Email:${data.email} , PhoneNumber:${data.phoneNumber} ,GuestType:${data.guestType}`,
      ClubNumber: this.ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: type,
    }
    this._commonService.SaveWorkFlow(PostData);
  }


  filterForDifferentColumn(listData: StaffResponseModel[], stateData: State): StaffResponseModel[] {
    if (stateData.globalSearchTerm) {
      listData = listData.filter((vl) => this.matches(vl, stateData.globalSearchTerm, this.pipe));
    }
    else if (stateData.lastName) {
      listData = listData.filter((vl) => this.lastNameMatche(vl, stateData.lastName, this.pipe));
    }
    else if (stateData.guestType) {
      listData = listData.filter((vl) => this.guestTypeMatche(vl, stateData.guestType, this.pipe));
    }
    else if (stateData.timeStamp) {
      listData = listData.filter((vl) => this.timeStampMatche(vl, stateData.timeStamp, this.pipe));
    }
    else if (stateData.firstName) {
      listData = listData.filter((vl) => this.firstNameMatche(vl, stateData.firstName, this.pipe));
    }
    else if (stateData.phoneNumber) {
      listData = listData.filter((vl) => this.phoneNumberMatche(vl, stateData.phoneNumber, this.pipe));
    }
    else if (stateData.email) {
      listData = listData.filter((vl) => this.emailMatche(vl, stateData.email, this.pipe));
    }
    else if (stateData.salesPersonName) {
      listData = listData.filter((vl) => this.salesPersonNameMatche(vl, stateData.salesPersonName, this.pipe));
    }
    else if (stateData.equipmentName) {
      listData = listData.filter((vl) => this.equipmentNameMatche(vl, stateData.equipmentName, this.pipe));
    }
    else if (stateData.totSpotBabysitting) {
      listData = listData.filter((vl) => this.totSpotBabysittingMatche(vl, stateData.totSpotBabysitting, this.pipe));
    }
    else if (stateData.checkOutTimeStamp) {
      listData = listData.filter((vl) => this.checkOutTimeStampMatche(vl, stateData.checkOutTimeStamp, this.pipe));
    }
    return listData;
  }

}
