import { Component } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-virtual-tour',
  templateUrl: './virtual-tour.component.html',
  styleUrls: ['./virtual-tour.component.css']
})
export class VirtualTourComponent {


  slideNo: string;
  bannerClass: string;

  constructor(private _commonService: CommonService,
  ) {
    this.slideNo = '';
    this.bannerClass = '';
  }

  ngOnInit(): void {
    this._commonService.ScreenUrl();
    this._commonService.changeIsHeader();
    var bannerSlide = this._commonService.setDynamicImage();
    this.slideNo = bannerSlide.slideNo;
    this.bannerClass = bannerSlide.bannerClass;
    this._commonService.setServiceName(window.sessionStorage.getItem("ServiceName")!);
    this._commonService.setSlideNo(this.slideNo);
    this._commonService.setBanner(this.bannerClass);
    this._commonService.setBodyHeightSize();
    this._commonService.changeIsFooter();
  }
}
