import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { constMessage } from 'src/app/core/constant/const';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  flag!: boolean;
  homebtn: string;
  backbtn: string;
  slideNo: string;
  BannerClass: string;

  constructor(
    private _commonService: CommonService,
    private location: Location,
    private router: Router,
  ) {
    this.homebtn = constMessage.thankyou.homebtn;
    this.backbtn = constMessage.thankyou.backbtn;
    this.slideNo = '';
    this.BannerClass = '';

  }

  ngOnInit() {

  }

  gotoHome() {
    var path = window.location.pathname;
    var ClubNumber = window.sessionStorage.getItem("ClubNumber");
    var GUID = window.sessionStorage.getItem('GUID');
    var URL = window.location.href;
    var PostData: any = {
      FieldValue: `Home:Home BackButton`,
      ClubNumber: ClubNumber,
      SessionId: GUID,
      PageName: path,
      PageUrl: URL,
      ActionType: this.homebtn,
    }
    this._commonService.SaveWorkFlow(PostData);
    this._commonService.removeAllSession();
    this._commonService.onSearchComponentInitial();
    window.sessionStorage.removeItem('Identification');
    // window.sessionStorage.clear();
   this.router.navigateByUrl('/Search');
    
  }
  
  redirectToPreviousPage() {
    var flag = window.sessionStorage.getItem('IsleadMemberListSection');
    var path = window.location.pathname;
    var ClubNumber = window.sessionStorage.getItem("ClubNumber");
    var GUID = window.sessionStorage.getItem('GUID');
    var URL = window.location.href;
    var PostData: any = {
      FieldValue: `Back:Click BackButton`,
      ClubNumber: ClubNumber,
      SessionId: GUID,
      PageName: path,
      PageUrl: URL,
      ActionType: this.backbtn,
    }
    this._commonService.SaveWorkFlow(PostData);
    
    if (path == "/Search") {
      this._commonService.onSearchComponentInitial();
    }
    else if (path == "/guest/checkInPass/memberGuest" && flag == "true") {
      this._commonService.onMemberGuestComponentInitial();
    }
    else if(path == "/Search"){
      this.router.navigateByUrl('/Search');
    }
    else {
      this.location.back();
    }
    this._commonService.setBodyHeightSize();
  }
}
