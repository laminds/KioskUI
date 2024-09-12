import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonType } from 'src/app/shared/Types/commonTypes';
import { CommonService } from 'src/app/shared/services/common.service';
import { HealthInsuranceService } from '../../services/health-insurance.service';
import { memberShipPlanModel } from 'src/app/shared/models/memberplan-model';

@Component({
  selector: 'app-silver-fit-plans',
  templateUrl: './silver-fit-plans.component.html',
  styleUrls: ['./silver-fit-plans.component.css']
})
export class SilverFitPlansComponent {
  commonTypeObj: CommonType | undefined;
  commonService: CommonService;
  path: string;
  slideNo: string;
  BannerClass: string;
  promoCodeObj: any;
  silverPlans: memberShipPlanModel[];

  constructor(
    private _commonService: CommonService,
    private _router: Router,
    private toastr: ToastrService,
    private _healthService: HealthInsuranceService,
  ) {
    this.path = '';
    this.slideNo = '';
    this.BannerClass = '';
    this.commonService = _commonService;
    this.promoCodeObj = {
      PromoCode: ''
    };
    this.silverPlans = [];
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
    this.getSilverFitPlans();
  }

  getSilverFitPlans() {
    var PostData = {
      ClubNumber: window.sessionStorage.getItem("ClubNumber"),
      PromoCode: this.promoCodeObj.PromoCode,
    }
    this._healthService.getGuestSilverFitPlans(PostData)?.subscribe({
      next: (response: any) => {
        if (response.error == null) {
          this.silverPlans = response.data;
        }
        else {
          this.toastr.warning(response.Message, "Error");
        }
      }
    })
  }
}
