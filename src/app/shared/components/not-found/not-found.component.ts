import { Component } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { CommonType } from '../../Types/commonTypes';
import { initialObjModel } from '../../models/initialObjModel';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent {
  commonTypeObj: CommonType | undefined;
  commonService: CommonService;
  path: string;
  slideNo: string;
  BannerClass: string;
  initialObj: initialObjModel;
  constructor(
    private _commonService: CommonService
  ){
    this.initialObj = _commonService.initialObj;
    this.path = '';
    this.slideNo = '';
    this.BannerClass = '';
    this.commonService = _commonService;
    this._commonService.setServiceName(window.sessionStorage.getItem("ServiceName")!);
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
}
