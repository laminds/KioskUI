import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiMethod, AuthEndPoints, constMessage } from 'src/app/core/constant/const';
import { HttpService } from 'src/app/core/services/http.service';
import { memberModel } from 'src/app/shared/models/memberModel';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit{
  Path: string;
  SlideNo: string;
  BannerClass: string;
  commonService!: CommonService;
  memberObj: memberModel;
  amenities : string;
  manageMembershp : string;
  referFriendTab: string;
  upgradeTab : string;
  checkInTab: string;
  trainingTab: string;
  subHeaderText: string;
  welcomeText : string;
  hitext: string;
  homeGymError: string;
  okbtn : string;
  clubNumber: Number;
  isPickleBall: boolean;
  isTotSpot: boolean;
  workOutwinSweepTab: string;


  constructor(
    private _commonService: CommonService,
    private route: Router,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private _httpService: HttpService,
    private toastr: ToastrService)  {
    this.Path = '';
    this.SlideNo = '';
    this.BannerClass = '';
    this.commonService = _commonService;
    this.memberObj = JSON.parse(window.sessionStorage.getItem("MemberObj")!);
    this._commonService.setServiceName(window.sessionStorage.getItem("ServiceName")!);
    this.config.backdrop = 'static';
    this.config.keyboard = true;
    this.subHeaderText = constMessage.member.subHeaderText;
    this.amenities = constMessage.member.amenities;
    this.trainingTab = constMessage.member.trainingTab;
    this.workOutwinSweepTab = constMessage.member.workOutwinSweepTab;
    this.checkInTab = constMessage.member.checkInTab;
    this.upgradeTab = constMessage.member.upgradeTab;
    this.referFriendTab = constMessage.member.referFriendTab;
    this.manageMembershp = constMessage.member.manageMembershp;
    this.hitext =  constMessage.member.hitext;
    this.welcomeText = constMessage.member.welcomeText;
    this.homeGymError= constMessage.member.homeGymError;
    this.okbtn = constMessage.member.okbtn;
    this.clubNumber = Number(window.sessionStorage.getItem("ClubNumber"));
    this.isPickleBall = false;
    this.isTotSpot = false;
  }

  ngOnInit(): void {
    this._commonService.ScreenUrl();
    this._commonService.setEqualDivSize();
    this._commonService.changeIsHeader();
    this._commonService.changeIsFooter();
    var bannerSlide = this._commonService.setDynamicImage();
    this._commonService.setSlideNo(bannerSlide.slideNo);
    this._commonService.setBanner(bannerSlide.bannerClass);
    this._commonService.setBodyHeightSize();
    this.getTotspotandPickleballflag();
  }

  checkClubNumberForPTPlan(content: any) {
    if (JSON.parse(window.sessionStorage.getItem("PlanObj")!)) {
      window.sessionStorage.removeItem("PlanObj");
    }
    if (window.sessionStorage.getItem("ClubNumber") != this.memberObj.clubNumber.toString()) {
      this.modalService.open(content, { centered: true, size: 'lg' });
    }
    else {
      this.commonService.setModuleAndRedirectToPerticularSource(this.commonService.commonTypeObj.member.personalTrainingType)
    }
  }

  getTotspotandPickleballflag() {
    this._httpService.requestCall(AuthEndPoints.TOTSPOT_AND_PICKLEBALL_FLAG, ApiMethod.GET,  this.clubNumber)?.subscribe({
      next: (response: any) => {
        if (response.data) {
          window.sessionStorage.setItem("AmenitiesObj", JSON.stringify(response.data));
          this.isPickleBall = response.data.isPickleBall;
          this.isTotSpot = response.data.isTotSpot;
          // if (this.isPickleBall == false && this.isTotSpot == false) {
          //   this.toastr.warning(constMessage.amenities.flagValidation)
          // }
          // else{
          //   this.commonService.setModuleAndRedirectToPerticularSource(this.commonService.commonTypeObj.member.amenities)
          // }
        }
      }
    })
  }

  closeModalPopup() {
    this.modalService.dismissAll();
  }
}
