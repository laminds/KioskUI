import { Injectable } from '@angular/core';
import { ApiMethod, AuthEndPoints } from 'src/app/core/constant/const';
import { HttpService } from 'src/app/core/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class HealthInsuranceService {

  constructor(private _http: HttpService) { }

  searchSilverFitEligibility(PostData:any) {
    return this._http.requestCall(AuthEndPoints.SEARCH_SILVER_FIT_DETAILS, ApiMethod.POST, PostData);
  }

  getSilverFitURLShortCode(PostData: any){
    return this._http.requestCall(AuthEndPoints.SILVER_FIT_URL_SHORTCODE, ApiMethod.POST, PostData);
  }

  getGuestSilverFitPlans(PostData:any){
    return this._http.requestCall(AuthEndPoints.GET_MEMBER_SILVER_FIT_PLANS, ApiMethod.POST, PostData);
  }

}
