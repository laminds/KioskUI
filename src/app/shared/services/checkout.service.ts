import { Injectable } from '@angular/core';
import { ApiMethod, AuthEndPoints } from 'src/app/core/constant/const';
import { HttpService } from 'src/app/core/services/http.service';
import { AgreementModel } from '../models/checkoutInfo.model';
import { plaidObj } from '../models/plaid.model';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(private _http: HttpService) { 
  }

  memberCheckOut(postData: any) {
    return this._http.requestCall(AuthEndPoints.MEMBER_CHECKOUT, ApiMethod.POST, postData);
  }

  checkCreditCardNumber(postData: string | null | undefined) {
    return this._http.requestCall(AuthEndPoints.CHECK_CREDITCARD_NUMBER, ApiMethod.GET, postData);
  }

  saveTemporaryData(postData: AgreementModel) {
    return this._http.requestCall(AuthEndPoints.INSERT_TEMPORARY_AGREEMENT_DATA, ApiMethod.POST, postData);
  }

  connectPlaidAPI(postData: plaidObj) {
    return this._http.requestCall(AuthEndPoints.PLAID_CONNECT_API, ApiMethod.POST, postData);
  }

}
