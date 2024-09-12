import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { data } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { ApiMethod, AuthEndPoints, constMessage } from 'src/app/core/constant/const';
import { HttpService } from 'src/app/core/services/http.service';
import { memberModel } from 'src/app/shared/models/memberModel';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-amenities',
  templateUrl: './amenities.component.html',
  styleUrls: ['./amenities.component.css']
})
export class AmenitiesComponent {
  Path: string;
  SlideNo: string;
  BannerClass: string;
  commonService!: CommonService;
  memberObj: memberModel;
  pickleball: string;
  babysitting: string;
  amenitiestHeadermessage: string;
  amenitiesObj : any;
  isPickleBall: boolean;
  isTotSpot: boolean;

  constructor(private _commonService: CommonService,
    private _httpService: HttpService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal) {
    this.Path = '';
    this.SlideNo = '';
    this.BannerClass = '';
    this.commonService = _commonService;
    this.memberObj = JSON.parse(window.sessionStorage.getItem("MemberObj")!);
    this._commonService.setServiceName(window.sessionStorage.getItem("ServiceName")!);
    this.pickleball = constMessage.amenities.pickleball;
    this.babysitting = constMessage.amenities.babysitting;
    this.amenitiestHeadermessage = constMessage.amenities.amenitiestHeadermessage;
    this.amenitiesObj = JSON.parse(window.sessionStorage.getItem("AmenitiesObj")!);
    this.isPickleBall = this.amenitiesObj.isPickleBall;
    this.isTotSpot = this.amenitiesObj.isTotSpot;
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
  }

  checkMemberEligibleForPickleball(content: any) {
    if (this.memberObj.memberType?.toLowerCase() != "premium" && this.memberObj.memberType?.toLowerCase() != "premium+" && this.memberObj.memberType?.toLowerCase() != "employee") {
      this.modalService.open(content, { centered: true, size: 'md' });
      return
    }
    else {
      this._commonService.setModuleAndRedirectToPerticularSource(this._commonService.commonTypeObj.member.amenitiesTypeObj.pickleballType)
      return;
    }
  }

  closeModalPopup() {
    this.modalService.dismissAll();
  }

}
