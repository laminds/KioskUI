import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';
import { constMessage } from 'src/app/core/constant/const';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
  signOutMessage : string;
  signOut : string;
  loginbtn : string;
  ClubNumber: string | null;
  
  constructor(private _commonService: CommonService, private router: Router) {
    this.ClubNumber = window.sessionStorage.getItem("ClubNumber");
    this.signOutMessage = constMessage.logOut.signOutMessage,
    this.signOut = constMessage.logOut.signOut,
    this.loginbtn = constMessage.logOut.loginbtn;
    this._commonService.setServiceName(window.sessionStorage.getItem("ServiceName")!);
   }


  ngOnInit(): void {
    this._commonService.changeIsLogoutPage();
  }

  login() {
    var GUID = window.sessionStorage.getItem('GUID');
    var URL = window.location.href;
    var PageName = window.location.pathname.split('/').pop();
    var PostData: any = {
      FieldValue: `Logout:Logout`,
      ClubNumber: this.ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: "Logout"
    }
    this._commonService.SaveWorkFlow(PostData);
    
    this._commonService.changeNoLogoutPage();
    this.router.navigate(['Home']);
  }
}
