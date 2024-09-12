import { Injectable } from '@angular/core';
import { ApiMethod, AuthEndPoints } from 'src/app/core/constant/const';
import { HttpService } from 'src/app/core/services/http.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MemberPlanService {

  apiUrl: string = environment.apiUrl;
  constructor(private _http: HttpService) { }

  getMemberSignUpPlans(postData: any) {
    return this._http.requestCall(AuthEndPoints.GET_MEMBERSHIP_PLANS, ApiMethod.GET, postData);
  }
}
