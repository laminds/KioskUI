import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { constMessage } from 'src/app/core/constant/const';
import { HttpService } from 'src/app/core/services/http.service';
import { LeadModel } from 'src/app/shared/models/searchModel';
import { SilverFitDetails, silverFitModel } from 'src/app/shared/models/silverFitModel';
import { CommonService } from 'src/app/shared/services/common.service';
import { HealthInsuranceService } from './services/health-insurance.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-health-insurance',
  templateUrl: './health-insurance.component.html',
  styleUrls: ['./health-insurance.component.css']
})
export class HealthInsuranceComponent {
  Path!: string;
  SlideNo!: string;
  BannerClass!: string;
  model: any;
  activeIndex: number;
  searchFilter!: string;
  silverObj: any = {};
  InitialObjData: any = {}
  newSilverForm!: FormGroup<silverFitModel>;
  submitted: boolean;
  insuranceSubHeadingText : string;
  searchbtn : string;
  goalsLabel: string;
  profileinfo  : string;
  healthLabel: string;
  leadObj: LeadModel;
  silverFitList: SilverFitDetails[];
  leadMemberListSection: boolean;
  foundText: string;
  foundMessage: string;
  userFoundText: string;

  constructor(
    private _commonService: CommonService,
    private _healthService: HealthInsuranceService,
    private toastr: ToastrService,
    private _router: Router,
    private _http: HttpService,
  ) {
    this.leadMemberListSection = false;
    this.insuranceSubHeadingText = constMessage.search.insuranceSubHeadingText;
    this.searchbtn = constMessage.search.searchbtn;
    this.goalsLabel= constMessage.newUser.goalsLabel;
    this.profileinfo = constMessage.newUser.profileinfo;
    this.healthLabel = constMessage.newUser.healthLabel;
    this.foundText = constMessage.search.foundText;
    this.foundMessage  = constMessage.search.foundMessage;
    this.leadObj = JSON.parse(window.sessionStorage.getItem("RegisterObj")!);
    this.silverFitList = [];
    this.activeIndex = 0;
    this._commonService.changeIsFooter();
    var bannerSlide = this._commonService.setDynamicImage();
    this._commonService.setBodyHeightSize();
    this._commonService.setSlideNo(bannerSlide.slideNo);
    this._commonService.setBanner(bannerSlide.bannerClass);
    this.userFoundText = constMessage.search.userFoundText;
    this._commonService.setServiceName(window.sessionStorage.getItem("ServiceName")!);
    this.InitialObjData = this._commonService.initialObj.clubNumber;
    this.newSilverForm = new FormGroup<silverFitModel>({
      firstName: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.pattern(this._commonService.nameValidPattern)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.pattern(this._commonService.nameValidPattern)]),
      email: new FormControl('', [Validators.required, Validators.pattern(this._commonService.emailPattern)]),
      phoneNumber: new FormControl('', [Validators.required]),
      silverFitnessID: new FormControl('', [Validators.required]),
      clubNumber: new FormControl(window.sessionStorage.getItem("ClubNumber")),
    });
    this.submitted = false;
  }
  get form() { return this.newSilverForm.controls; }

  ngOnInit(): void {
    this._commonService.ScreenUrl();
    this._commonService.setEqualDivSize();
  }
  ngAfterViewInit(): void {
    this._commonService.changeIsFooter();
    var bannerSlide = this._commonService.setDynamicImage();
    this._commonService.setBodyHeightSize();
    this._commonService.setSlideNo(bannerSlide.slideNo);
    this._commonService.setBanner(bannerSlide.bannerClass);

  }

  searchHealthInfo = (silverObj: FormGroup<silverFitModel>) => {
    this.submitted = true;
    var Data: any = silverObj.value;
    var sourceName = window.sessionStorage.getItem("SourceName");
    if (this.newSilverForm.invalid) {
      return;
    }

    var ClubNumber = window.sessionStorage.getItem("ClubNumber");
    var GUID = window.sessionStorage.getItem('GUID');
    var URL = window.location.href;
    var PageName = window.location.pathname.split('/').pop();
    var PostData: any = {
      FieldValue: `Health Data:Health Details ,FirstName:${Data?.firstName} ,LastName:${Data?.lastName}
      ,Email:${Data?.email} ,PhoneNumber:${Data?.phoneNumber} ,Silver ID:${Data?.silverFitnessID}`,
      ClubNumber: ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: this.searchbtn,
    }
    this._commonService.SaveWorkFlow(PostData);

    if (silverObj != null) {
      return this._healthService.searchSilverFitEligibility(silverObj.value)?.subscribe({
        next: (response: any) => {
          if (response.data) {
            if (response.data.length > 0) {
              this.leadMemberListSection = true;
              this.silverFitList = response.data;
              window.sessionStorage.setItem("LookupSilverDetail", JSON.stringify(silverObj.value));
            }
            else if (response.data.length == 0) {
              window.sessionStorage.setItem("LookupSilverDetail", JSON.stringify(silverObj.value));
              this._router.navigate(['healthInsurance/silverFitlookup'])
            }
            this._commonService.setEqualDivSize();
            this._commonService.setBodyHeightSize();
          }
          else {
            this.toastr.error(response.Message, "Error");
          }
        },
        error: (error: { error: { StackTrace: any; }; }) => {
          this.toastr.error(error.error.StackTrace, constMessage.error);
        }
      })
    }
  }


  getSilverFitURLShortCode() {
    var data = JSON.parse(window.sessionStorage.getItem("LookupSilverDetail")!);
    var regObj = JSON.parse(window.sessionStorage.getItem("RegisterObj")!);
    var PostData = {
      Id: data.silverFitnessID,
      MethodType: "ASH",
      FirstName: data.firstName,
      LastName: data.lastName,
      Email: data.email,
      PhoneNumber: data.phoneNumber,
      HSId: regObj.hsId,
      ClubNumber: window.sessionStorage.getItem("ClubNumber"),
      MemberId: regObj.memberId
    }
    this._healthService.getSilverFitURLShortCode(PostData)?.subscribe({
      next: (response: any) => {
          if (response.data) {
            var silverSneakerUserData = response.data.userDetail;
            var silverDetails = JSON.parse(window.sessionStorage.getItem("LookupSilverDetail")!)
            var RegObj = {
              newClubNumber: PostData.ClubNumber,
              clubNumber: PostData.ClubNumber,
              firstName: PostData.FirstName,
              lastName: PostData.LastName,
              phoneNumber: PostData.PhoneNumber,
              email: PostData.Email,
              memberId: PostData.MemberId ? PostData.MemberId : null,
              SSASHID: silverDetails.silverFitnessID,
              SSFirstName: silverDetails.firstName,
              SSLastName: silverDetails.lastName,
              SSEmail: silverDetails.email,
              SSPhoneNumber: silverDetails.phoneNumber,
            }
            var shortCode = response.data.shortCode;
            window.sessionStorage.setItem("ShortCode", shortCode);

            window.sessionStorage.setItem("RegisterObj", JSON.stringify(RegObj));
            var EmailResponse = { Email: RegObj.email };''
            window.sessionStorage.setItem("EmailResponse", JSON.stringify(EmailResponse));
            if (window.sessionStorage.getItem("SourceName")) {
              window.sessionStorage.removeItem("SourceName");
            }
            window.sessionStorage.setItem("SourceName", this._commonService.commonTypeObj.guest.joinNowObj.healthInsuranceType);
            this._router.navigate(["guest/silverPlan"]);
          }
          else {
            this.toastr.error(response.Message, "Error");
          }
      }
    })
  }
}
