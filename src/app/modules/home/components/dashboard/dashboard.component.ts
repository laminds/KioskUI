import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { ToastrService } from 'ngx-toastr';
import { responseModel } from 'src/app/shared/interface/responseModel';
import { clubModel } from 'src/app/shared/models/clubModel';
import { CommonService } from 'src/app/shared/services/common.service';
import { JWTTokenService } from 'src/app/shared/services/jwttoken.service';
import { HomeService } from '../../services/home.service';
import { constMessage } from 'src/app/core/constant/const';
import { windowCount } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  activeIndex: number;
  clubList: clubModel[];
  searchFilter!: string;

  message!: string;
  token!: string;
  idtoken!: string;
  welcomeText!: string;
  selectClubLocation!: string;
  clubLocation!: string;

  clubObj: clubModel = {
    ClubId: 0,
    location_code: 0,
    Name: "",
    club_name: "",
    s_clubName : "",
    promo_location_id: "",
    Latitude: 0,
    Longitude: 0,
    club_city: ""
  }

  constructor(
    private oauthService: OAuthService,
    private homeService: HomeService,
    private toastr: ToastrService,
    private _commonService: CommonService,
    private router: Router,
    protected jwtToken: JWTTokenService) {
    this.activeIndex = 0;
    this.clubList = [];
  }

  ngOnInit() {
    this._commonService.removeUserSession();
    this.token = this.oauthService.getAccessToken();
    const decode = (token: string) => decodeURIComponent(atob(token.split('.')[1].replace('-', '+').replace('_', '/')).split('').map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`).join(''));
    var toeknData = decode(this.token);
    var JOSNObject = JSON.parse(toeknData);
    this._commonService.changeNoHeader();
    this._commonService.changeNofooter();
    this._commonService.setSlideNo('');
    this._commonService.setBanner('');

    this.getClubList();
    this.welcomeText = constMessage.dashBoard.welcomeText;
    this.selectClubLocation = constMessage.dashBoard.selectClubLocation;
    this.clubLocation = constMessage.dashBoard.clubLocation;
  }


  getClubList() {
    this.homeService.GetClubList().subscribe({
      next: (response: responseModel<clubModel[]>) => {
        if (response.data != null) {
          
          this.clubList = response.data;
          if (this.clubList.length == 1) {
            this.getClubStationsByClub(this.clubList[0].location_code);
            window.sessionStorage.setItem("ClubNumber", this.clubList[0].location_code.toString());
            window.sessionStorage.setItem("ClubName", this.clubList[0].club_name);
            window.sessionStorage.setItem("ClubShortName", this.clubList[0].s_clubName);
            this._commonService.setClubInformation(this.clubList[0].location_code, this.clubList[0].club_name, this.clubList[0].s_clubName);
            this.router.navigate(['Search']);
          }
        }
        else {
          this.toastr.error(response.Message, constMessage.error);
        }
      },
      error: (error: { error: { StackTrace: string | undefined; }; }) => {
        this.toastr.error(error.error.StackTrace, constMessage.error);
      },
    });
  }


  activeSelectedOption(selectedData: clubModel, index: number) {
    
    this.clubObj = selectedData;
    this._commonService.initialObj.clubName = selectedData.club_name;
    this._commonService.initialObj.clubNumber = selectedData.location_code;
    this._commonService.initialObj.clubShortName = selectedData.s_clubName;
    this.activeIndex = index;
  }

  viewCRMServices(data: clubModel) {
    
    if (!data.club_name && !data.location_code) {
      this.toastr.warning(constMessage.clubSelection.clubWarning, constMessage.warning);
    }
    else {
      this.getClubStationsByClub(data.location_code);
      this._commonService.initialObj.clubNumber = data.location_code;
      this._commonService.initialObj.clubName = data.club_name;
      this._commonService.initialObj.clubShortName = data.s_clubName;
      window.sessionStorage.setItem("ClubNumber", data.location_code.toString());
      window.sessionStorage.setItem("ClubName", data.club_name);
      window.sessionStorage.setItem("promo_location_id", data.promo_location_id);
      window.sessionStorage.setItem("ClubShortName", data.s_clubName);
    }
  }

  getClubStationsByClub(clubNumber: number) {
    this.homeService.GetClubStationsByClub(clubNumber).subscribe({
      next: (response: responseModel<any>) => {
        if (response) {
          if (response.data != null) {
            window.sessionStorage.setItem("ClubStationId", response.data.stationId);
          }
          else {
            window.sessionStorage.setItem("ClubStationId", "");
          }
          this._commonService.ShowClubNumberAndVL = true;
          this.router.navigate(['Search']);
        }
        else {
          this.toastr.error(constMessage.error);
        }
      },
      error: (error) => {
        this.toastr.error(error.error.StackTrace, constMessage.error);
      }
    });
  }

  logout() {
    this.oauthService.logOut();
    window.location.href = 'https://identity.youfit.com/adfs/ls/?wa=wsignoutcleanup1.0';
  }

}

