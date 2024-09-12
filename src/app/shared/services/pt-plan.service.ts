import { Injectable } from '@angular/core';
import { ApiMethod, AuthEndPoints } from 'src/app/core/constant/const';
import { HttpService } from 'src/app/core/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class PtPlanService {

  constructor(private _http: HttpService) { }

  getPTPlanDetails(postData: any) {
    return this._http.requestCall(AuthEndPoints.GET_PTPLAN_DETAILS, ApiMethod.POST, postData);
  }
  
  getMemberPreviousPTPlanAvailable(memberId: any) {
    return this._http.requestCall(AuthEndPoints.GETMEMBER_PREVIOUS_PTPLAN_AVAILABLE, ApiMethod.GET, memberId);
  }
  
}
