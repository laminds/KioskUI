import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiMethod, AuthEndPoints, constMessage, webConfig } from 'src/app/core/constant/const';
import { HttpService } from 'src/app/core/services/http.service';
import { pickleballObjModel } from 'src/app/shared/models/memberModel';
import { EquipmentModel } from 'src/app/shared/models/searchModel';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-pickleball',
  templateUrl: './pickleball.component.html',
  styleUrls: ['./pickleball.component.css']
})
export class PickleballComponent {
  Path: string;
  SlideNo: string;
  BannerClass: string;
  commonService!: CommonService;
  memberObj: any;
  hitext: string;
  welcomeText: string;
  personalInformation: string;
  pickleballInfoForm!: FormGroup<pickleballObjModel>;
  submitted: boolean;
  activeIndex: number;
  genderList: string[];
  toastr: any;
  equipmentList: EquipmentModel[];
  equipmentLabel: string;
  continuebtn: string;
  before18year: Date;
  today : any;

  constructor(private _commonService: CommonService,
    private _httpService: HttpService,
    private router: Router) {
    this.Path = '';
    this.SlideNo = '';
    this.BannerClass = '';
    this.commonService = _commonService;
    this.memberObj = JSON.parse(window.sessionStorage.getItem("MemberObj")!) ? JSON.parse(window.sessionStorage.getItem("MemberObj")!) : JSON.parse(window.sessionStorage.getItem("RegisterObj")!);
    this._commonService.setServiceName(window.sessionStorage.getItem("ServiceName")!);
    this.hitext = constMessage.amenities.hitext;
    this.welcomeText = constMessage.amenities.pickleballObj.welcomeText;
    this.personalInformation = constMessage.amenities.pickleballObj.personalInformation;
    this.equipmentLabel = constMessage.amenities.pickleballObj.equipmentLabel;
    this.continuebtn = constMessage.newUser.continuebtn;
    this.submitted = false;
    this.activeIndex = 0;
    this.genderList = ["Male", "Female"];
    this.before18year = new Date();
    this.before18year.setFullYear(this.before18year.getFullYear() - 18);
    this.today = new Date();

    this.pickleballInfoForm = new FormGroup<pickleballObjModel>({
      firstName: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.pattern(this._commonService.nameValidPattern)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.pattern(this._commonService.nameValidPattern)]),
      phoneNumber: new FormControl('', [Validators.required]),
      dob: new FormControl(this.memberObj.dob ? new Date(this.memberObj.dob) : '', [Validators.required]),
      gender: new FormControl(this.memberObj.gender ? this.memberObj.gender : '', [Validators.required]),
      equipmentId: new FormControl(null),
      equipmentObj: new FormControl(this.memberObj.equipmentObj != undefined ? this.memberObj.equipmentObj : null, [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern(this._commonService.emailPattern)]),
      searchFilter: new FormControl('', { nonNullable: true })
    });
    this.equipmentList = [];
  }

  ngOnInit(): void {
    this._commonService.ScreenUrl();
    this._commonService.changeIsHeader();
    this._commonService.changeIsFooter();
    var bannerSlide = this._commonService.setDynamicImage();
    this._commonService.setSlideNo(bannerSlide.slideNo);
    this._commonService.setBanner(bannerSlide.bannerClass);
    this._commonService.setEqualDivSize();
    this._commonService.setBodyHeightSize();
    this.getPickleballInitialInfoDetail();
  }

  get form() { return this.pickleballInfoForm.controls; }

  activeSelectedGenderOption(data: string, index: number) {
    this.memberObj.gender = data;
    this.pickleballInfoForm.get('gender')?.setValue(data);
    this.activeIndex = index;
  }

  activeSelectedOption(data: EquipmentModel, index: number) {
    this.pickleballInfoForm.get('equipmentObj')?.setValue(data);
    this.activeIndex = index;
  }

  getPickleballInitialInfoDetail() {
    if (window.sessionStorage.getItem("ClubNumber") && window.sessionStorage.getItem("ClubName")) {
      this.memberObj.dob = this.memberObj.dob ? new Date(this.memberObj.dob) : null;
      this.equipmentDetails();
      this.pickleballInfoForm.patchValue(this.memberObj);
    }
    else {
      this._commonService.missingClubInformationIssue();
    }
  }

  equipmentDetails() {
    var postData = {
      MemberType: this.memberObj.memberType == null ? "PREMIUM+" : this.memberObj.memberType
    }
    this._httpService.requestCall(AuthEndPoints.EQUIPMENT_DETAILS, ApiMethod.POST, postData)?.subscribe({
      next: (response: any) => {
        if (response) {
          this.equipmentList = response.data;
        }
        else {
          this.toastr.warning("No equipment found", "Required");
        }
      }
    })
  }

  savePickleballDetails(pickleballobj: FormGroup<pickleballObjModel>) {
    this.submitted = true;
    if (this.pickleballInfoForm.invalid) {
      return;
    }
    var postData: any = pickleballobj.value;

    var ClubNumber = window.sessionStorage.getItem("ClubNumber");
    var GUID = window.sessionStorage.getItem('GUID');
    var URL = window.location.href;
    var PageName = window.location.pathname.split('/').pop();
    var PostData: any = {
      FieldValue: `Pickleball:${postData?.equipmentObj.name}`,
      ClubNumber: ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: this.continuebtn,
    }
    this._commonService.SaveWorkFlow(PostData);
    
    this._httpService.requestCall(AuthEndPoints.VALIDATE_EMAIL, ApiMethod.GET, postData.email)?.subscribe({
      next: (response: any) => {
        if (response.data.isValid == true) {
          postData.dob = this.commonService.getStringDate(postData.dob)
          response.data.email = postData.email;

          var Data: any = {
            firstName: postData.firstName,
            lastName: postData.lastName,
            email: postData.email,
            phoneNumber: postData.phoneNumber,
            gender: postData.gender,
            dob: postData.dob == null ? null : this._commonService.getStringDate(postData.dob),
            equipmentId: postData.equipmentObj?.equipmentId,
            clubNumber: parseInt(window.sessionStorage.getItem("ClubNumber")!),
            sourceName: window.sessionStorage.getItem("SourceName"),
            memberType: this.memberObj.memberType,
            memberId: this.memberObj.memberId,
            guestType: "Pickleball",
            // entrySource : webConfig.pickleballCampaignId
          };
          this._httpService.requestCall(AuthEndPoints.SAVE_PICKLEBALL, ApiMethod.POST, Data)?.subscribe({
            next: (response: any) => {
              if (response.data) {
                if (window.sessionStorage.getItem("SourceName") == this._commonService.commonTypeObj.member.amenitiesTypeObj.pickleballType) {
                  this.router.navigate(['member/thankyou']);
                }
                else {
                  window.sessionStorage.setItem("LeadId", response.data);
                  this.router.navigateByUrl('signature');
                }
              }
              else {
                if (response.error) {
                  this.toastr.error(response.error.message, constMessage.error);
                }
              }
            }
          })

        }
      }
    })
  }
}

