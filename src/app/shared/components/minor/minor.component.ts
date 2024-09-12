import { Component, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/core/services/http.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { minorModel } from '../../models/registerModel';
import SignaturePad from 'signature_pad';
import { ApiMethod, AuthEndPoints, constMessage,webConfig } from 'src/app/core/constant/const';


@Component({
  selector: 'app-minor',
  templateUrl: './minor.component.html',
  styleUrls: ['./minor.component.css']
})
export class MinorComponent {
  signPad: any;
  @ViewChild('signPadCanvas', { static: false }) signaturePadElement: any;
  Path!: string;
  slideNo!: string;
  BannerClass!: string;
  submitted: boolean;
  minorInfoForm!: FormGroup<minorModel>;
  welcomeText: string;
  before18year: Date;
  today : any;
  
  constructor(
    private _commonService: CommonService,
    private _router: Router,
    private _http: HttpService,
    private toastr: ToastrService,
    private _httpService: HttpService
  ) {
    this.today = new Date();
    this.Path = '';
    this.slideNo = '';
    this.BannerClass = '';
    this.welcomeText = constMessage.minor.welcomeText;
    this._commonService.setServiceName(window.sessionStorage.getItem("ServiceName")!);
    this.before18year = new Date();
    this.before18year.setFullYear(this.before18year.getFullYear() - 18);
    this.submitted = false;
    this.minorInfoForm = new FormGroup<minorModel>({
      firstName: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.pattern(this._commonService.nameValidPattern)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.pattern(this._commonService.nameValidPattern)]),
      phoneNumber: new FormControl('', [Validators.required]),
      DOB: new FormControl('', [Validators.required])
    });
  }

  
  ngOnInit(): void {
    this._commonService.ScreenUrl();
    this._commonService.changeIsHeader();
    this._commonService.changeIsFooter();
    var bannerSlide = this._commonService.setDynamicImage();
    this.slideNo = bannerSlide.slideNo;
    this.BannerClass = bannerSlide.bannerClass;
    this._commonService.setSlideNo(this.slideNo);
    this._commonService.setBanner(this.BannerClass);
    this._commonService.setBodyHeightSize();
  }

  get form() { return this.minorInfoForm.controls; }

  ngAfterViewInit() {
    this.signPad = new SignaturePad(this.signaturePadElement.nativeElement);
  }

  saveMinorInfo = (minorobj: FormGroup<minorModel>) => {
    
    this.submitted = true;

    if (this.minorInfoForm.invalid) {
      return;
    }
    
    var dataObj: any = minorobj.value;

    var yearDifference = new Date().getFullYear() - dataObj.DOB.getFullYear();
    var dayDifference = new Date().getDate() - dataObj.DOB.getDate();

    if ((yearDifference > 18) || (yearDifference == 18 && dayDifference > 0)) {
      this.toastr.warning("Please select Date of Birth under 18 years.", "Required");
      return
    }

    
    var signature = this.signPad.toDataURL();
    var d = new Date();
    d.setMinutes(d.getMinutes() + (-1 * d.getTimezoneOffset()));
    var postData = {
      RegisterObj: {
        FirstName: dataObj.firstName,
        LastName: dataObj.lastName,
        DOB: this._commonService.getStringDate(dataObj.DOB),
        PhoneNumber: dataObj.phoneNumber,
        ClubNumber: window.sessionStorage.getItem("ClubNumber"),
        EntrySource : webConfig.minorCampaignId
      },
      SignatureObj: {
        ImageSrc: signature,
        ClubDate: d,
        ClubTimeZone: new Date().toString().match(/([A-Z]+[\+-][0-9]+.*)/)![1],
      }
    }
    this._http.requestCall(AuthEndPoints.SAVE_MINOR, ApiMethod.POST, postData)?.subscribe({
      next: (response: any) => {
      if(response.Date != 0){                     
          this.toastr.success("Minor data save successfully", "Success");
          this._router.navigateByUrl("/thankyou");
      }
      else{
        this.toastr.success("Oops something went wrong. Please try again.", "Success");
      }
      }
    })
    var ClubNumber = window.sessionStorage.getItem("ClubNumber");
    var GUID = window.sessionStorage.getItem('GUID');
    var URL = window.location.href;
    var PageName = window.location.pathname.split('/').pop();
    var PostData: any = {
      FieldValue: `Minor Information :${dataObj?.firstName} ,FirstName:${dataObj?.firstName}
                  ,LastName:${dataObj?.lastName},Phonenumber:${dataObj?.phoneNumber} ,Date of Birth:${dataObj?.DOB} `,
      ClubNumber: ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: "Submit"
    }
    this._commonService.SaveWorkFlow(PostData);
  }
}
