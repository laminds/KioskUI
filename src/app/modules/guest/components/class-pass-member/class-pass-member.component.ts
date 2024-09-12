import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiMethod, AuthEndPoints, constMessage } from 'src/app/core/constant/const';
import { HttpService } from 'src/app/core/services/http.service';
import { registerModel } from 'src/app/shared/models/registerModel';
import { LeadModel } from 'src/app/shared/models/searchModel';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-class-pass-member',
  templateUrl: './class-pass-member.component.html',
  styleUrls: ['./class-pass-member.component.css']
})
export class ClassPassMemberComponent {
  Path: string;
  slideNo: string;
  BannerClass: string;
  commonService!: CommonService;
  foundText: string;
  foundMessage : string;
  regObj : registerModel;
  userFoundText : string;
  guestList: any | LeadModel[];
  
  constructor(
    private _commonService: CommonService,
    private _http: HttpService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.regObj = JSON.parse(window.sessionStorage.getItem("RegisterObj")!);
    this.slideNo = '';
    this.BannerClass = '';
    this.Path = '';
    this.userFoundText = constMessage.search.userFoundText;
    this.foundText = constMessage.search.foundText;
    this.foundMessage = constMessage.search.foundMessage;
    this.guestList = [] ;
  }

  ngOnInit(): void {
    this._commonService.ScreenUrl();
    this._commonService.changeIsHeader();
    this._commonService.changeIsFooter();
    var bannerSlide = this._commonService.setDynamicImage();
    this._commonService.setSlideNo(bannerSlide.slideNo);
    this._commonService.setBanner(bannerSlide.bannerClass);
    this._commonService.setBodyHeightSize();
    this.getGuestList();
  }

  getGuestList(){
    var postData = {
      clubNumber: (this._commonService.initialObj.clubNumber ? this._commonService.initialObj.clubNumber : "").toString(),
      phoneNumber: window.sessionStorage.getItem("PhoneNumber"),
      email: window.sessionStorage.getItem("Email"),
    }
    this._http.requestCall(AuthEndPoints.SEARCH_GUEST_MEMBER, ApiMethod.POST, postData)?.subscribe({
      next: (response: any) => {
        this.guestList = response.data.prospectList;
        this._commonService.setEqualDivSize();
        this._commonService.setBodyHeightSize();
      }
    })
  }

  redirectToSignature(data: any){
    var ClubNumber = window.sessionStorage.getItem("ClubNumber");
    var GUID = window.sessionStorage.getItem('GUID');
    var URL = window.location.href;
    var PageName = window.location.pathname.split('/').pop();
    var PostData: any = {
      FieldValue: `Guest Member:${data?.memberId} , HSID:${data.hsId}`,
      ClubNumber: ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: "Guest",
    }
    this._commonService.SaveWorkFlow(PostData);

    window.sessionStorage.setItem("RegisterObj", JSON.stringify(data));
    this.router.navigateByUrl('signature');
  }
}
