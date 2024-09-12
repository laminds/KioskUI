import { Injectable } from '@angular/core';
import { ClientError, CustomErrorCodes, SuccessCodes } from '../constant/const';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor() { }

  WhichError(errorcode: number, errorMessage: string) {
    switch (errorcode) {
      // case CustomErrorCodes.UN_KNOWN:
      //   alert('Server is Down');
      //   break;
      case ClientError.HTTP_404_BAD_REQUEST:
        alert('Type Correct Credentials');
        break;
      // default:
      //   alert('UnKnown Error Code');
    }
  }

  userNotification(notificationCode: number, notification: string) {
    switch (notificationCode) {
      case SuccessCodes.HTTP_200_OK:
        alert('Success');
        break;
      // default:
      //   alert('Unknown Success Code');
    }
  }
}
