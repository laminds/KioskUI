import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { post } from 'jquery';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ApiMethod, AuthEndPoints, constMessage } from 'src/app/core/constant/const';
import { HttpService } from 'src/app/core/services/http.service';
import { personalInfoModel } from 'src/app/shared/models/guestInitialInfoModel';
import { memberModel } from 'src/app/shared/models/memberModel';
import { registerInitialModel } from 'src/app/shared/models/registerModel';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-update-personal-info',
  templateUrl: './update-personal-info.component.html',
  styleUrls: ['./update-personal-info.component.css']
})
export class UpdatePersonalInfoComponent {
  Path: string;
  SlideNo: string;
  BannerClass: string;
  commonService!: CommonService;
  memberObj: memberModel;
  headermessage: string;
  subheaderText: string;
  updatePersonalInfoForm!: FormGroup<personalInfoModel>;
  genderList: string[];
  activeIndex: number;
  regObj: registerInitialModel;
  submitted: boolean;
  submitbtn: string;
  PItext: string;
  today: any;
  constructor(private _commonService: CommonService,
    private _httpService: HttpService,
    private router: Router,
    private toastr: ToastrService) {
    this.Path = '';
    this.SlideNo = '';
    this.BannerClass = '';
    this.commonService = _commonService;
    this._commonService.setServiceName(window.sessionStorage.getItem("ServiceName")!);
    this.memberObj = JSON.parse(window.sessionStorage.getItem("MemberObj")!);
    this.headermessage = constMessage.member.manageMembershipObj.UPersonalIObj.headerText;
    this.subheaderText = constMessage.member.manageMembershipObj.UPersonalIObj.subheaderText;
    this.genderList = ["Male", "Female"];
    this.activeIndex = 0;
    this.regObj = JSON.parse(window.sessionStorage.getItem("MemberObj") || "{}");
    this.submitted = false;
    this.submitbtn = constMessage.header.submitbtn;
    this.PItext = constMessage.amenities.pickleballObj.personalInformation
    this.today = new Date();

    this.updatePersonalInfoForm = new FormGroup<personalInfoModel>({
      firstName: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.pattern(this._commonService.nameValidPattern)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.pattern(this._commonService.nameValidPattern)]),
      phoneNumber: new FormControl('', [Validators.required]),
      dob: new FormControl(this.memberObj.dob ? new Date(this.memberObj.dob) : '', [Validators.required]),
      gender: new FormControl(this.memberObj.gender ? this.memberObj.gender : '', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern(this._commonService.emailPattern)]),
      isKeepMeUpdate: new FormControl(),
      memberId : new FormControl(),
      clubNumber : new FormControl(),
      isGuestModule : new FormControl()
    });
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
    this.regObj.dob = this.regObj.dob ? new Date(this.regObj.dob) : null;
    this.updatePersonalInfoForm.patchValue(this.regObj);
  }

  get form() { return this.updatePersonalInfoForm.controls; }

  activeSelectedGenderOption(data: string, index: number) {
    this.regObj.gender = data;
    this.updatePersonalInfoForm.get('gender')?.setValue(data);
    this.activeIndex = index;
  }

  updatePersonalInfoDetails(data: FormGroup<personalInfoModel>) {
    this.submitted = true;
    if (this.updatePersonalInfoForm.invalid) {
      return;
    }
    var postdata = data.value;
    postdata.memberId = this.memberObj.memberId;
    postdata.clubNumber = this.memberObj.clubNumber;

    this._httpService.requestCall(AuthEndPoints.UPDATE_PERSONAL_INFO, ApiMethod.POST, postdata)?.subscribe({
      next: (response: any) => {
        if (response.data.status.message == "success") {
          this.router.navigate(['member/thankyou'])
          //this.toastr.success("Update Personal Information into ABC", "success");
        }
        else{
          console.log(response.error);
        }
      }
    })
    var ClubNumber = window.sessionStorage.getItem("ClubNumber");
    var GUID = window.sessionStorage.getItem('GUID');
    var URL = window.location.href;
    var PageName = window.location.pathname.split('/').pop();
    var PostData: any = {
      FieldValue: `First Name:${postdata?.firstName} ,Last Name:${postdata?.lastName},Email:${postdata?.email}
                  ,Phone Number:${postdata?.phoneNumber},Birth Date:${postdata?.dob},Gender:${postdata?.gender}`,
      ClubNumber: ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: this.submitbtn
    }
    this._commonService.SaveWorkFlow(PostData);
  }
}
