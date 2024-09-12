import { Component } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonType } from '../../Types/commonTypes';
import { clubListModel, surveyQuestionModel } from '../../models/surveyModel';
import { HttpService } from 'src/app/core/services/http.service';
import { ApiMethod, AuthEndPoints, constMessage } from 'src/app/core/constant/const';

@Component({
  selector: 'app-tour-guide',
  templateUrl: './tour-guide.component.html',
  styleUrls: ['./tour-guide.component.css']
})
export class TourGuideComponent {
  commonTypeObj: CommonType | undefined;
  commonService: CommonService;
  path: string;
  slideNo: string;
  BannerClass: string;
  SurveyObjDetail: any;
  SurveyfirstQuestion: string;
  SurveythirteenQuestion: string;
  SurveyTwoQuestion: string;
  SurveyLocation: string;
  IsSurveyLocationHasValue: boolean;
  SurveyObjDetailList: any;
  ClubArrayArr: any;
  SurveyQuestion: surveyQuestionModel | any;
  ClubListDetail: clubListModel | any;
  ClubName: string;

  constructor(
    private _commonService: CommonService,
    private _router: Router,
    private toastr: ToastrService,
    private _http: HttpService
  ) {
    this.path = '';
    this.slideNo = '';
    this.BannerClass = '';
    this.commonService = _commonService;
    this._commonService.setServiceName(window.sessionStorage.getItem("ServiceName")!);
    this.SurveyObjDetail = "";
    this.SurveyfirstQuestion = "";
    this.SurveythirteenQuestion = "";
    this.SurveyTwoQuestion = "";
    this.SurveyLocation = "";
    this.IsSurveyLocationHasValue = false;
    this.SurveyObjDetailList = '';
    this.ClubArrayArr = '';
    this.SurveyQuestion = '';
    this.ClubListDetail = '';
    this.ClubName = '';
  }

  ngOnInit(): void {
    this._commonService.ScreenUrl();
    this.getSurveyDetail();
    this._commonService.changeIsHeader();
    this._commonService.changeIsFooter();
    var bannerSlide = this._commonService.setDynamicImage();
    this.slideNo = bannerSlide.slideNo;
    this.BannerClass = bannerSlide.bannerClass;
    this._commonService.setSlideNo(this.slideNo);
    this._commonService.setBanner(this.BannerClass);
    this._commonService.setBodyHeightSize();
  }

 
  getSurveyDetail = () => {
    this.SurveyObjDetail = JSON.parse(window.sessionStorage.getItem("SurveyObj")!);

    this.SurveyfirstQuestion = this.SurveyObjDetail.SurveyQLADetail[0].AnswerName.replace(/;/g, ", ");
    this.SurveythirteenQuestion = this.SurveyObjDetail.SurveyQLADetail[13].AnswerName.replace(/;/g, ", ");
    this.SurveyTwoQuestion = this.SurveyObjDetail.SurveyQLADetail[2].AnswerName.replace(/;/g, ", ");

    if (this.SurveyObjDetail.SurveyQLADetail[14].AnswerName != null) {
      var location = this.SurveyObjDetail.SurveyQLADetail[14].AnswerName.replace(/;Yes/g, "");
      this.IsSurveyLocationHasValue = location.includes("No") ? false : true;

      this.ClubArrayArr = this.SurveyObjDetail.SurveyQLADetail[14].AnswerName.split(";");

      if (this.ClubArrayArr[0] != "undefined") {
        this.ClubArrayArr = this.ClubArrayArr[0];
      }
      else {
        this.ClubArrayArr = "";
      }

    }
    else {
      location = null;
    }
    this.SurveyLocation = location;

    let ServicesDetail = this.SurveythirteenQuestion;
    let Services = ServicesDetail.search("HIIT or small group training");

    if (Services != -1) {
      this.SurveythirteenQuestion = this.SurveythirteenQuestion.replace("HIIT or small group training", "HIIT or small group training");
    }

    let PersonaleventDetail = this.SurveyTwoQuestion;
    let Personalevent = PersonaleventDetail.search("Personal event");

    if (Personalevent != -1) {
      this.SurveyTwoQuestion = this.SurveyTwoQuestion.replace("Personal event (wedding, vacation, reunion)", "Personal event");
    }

    let Training = this.SurveyTwoQuestion.search("Training for a special event");
    if (Training != -1) {
      this.SurveyTwoQuestion = this.SurveyTwoQuestion.replace("Training for a special event (5K, walk, fundraiser)", "Training for a special event");
    }

    let Healthreasons = this.SurveyTwoQuestion.search("Health reasons");
    if (Healthreasons != -1) {
      this.SurveyTwoQuestion = this.SurveyTwoQuestion.replace("Health reasons (doctor recommendation)", "Health reasons");
    }

    let Lifechange = this.SurveyTwoQuestion.search("Life change");
    if (Lifechange != -1) {
      this.SurveyTwoQuestion = this.SurveyTwoQuestion.replace("Life change (divorce, new job, stress)", "Life change");
    }

    let Loseweightdetail = this.SurveyfirstQuestion;
    let Loseweight = Loseweightdetail.search("Lose weight");

    if (Loseweight != -1) {
      var SurveyfirstQuestionSubQuation = this.SurveyObjDetail.SurveyQLADetail.find((x: any) => x.QuestionId == "1.1");
      this.SurveyfirstQuestion = this.SurveyfirstQuestion.replace("Lose weight", "Lose " + SurveyfirstQuestionSubQuation.AnswerName + "lbs");
    }

    let InjuryRehabDetal = this.SurveyfirstQuestion;
    let InjuryRehab = InjuryRehabDetal.search("Injury/Rehab");

    if (InjuryRehab != -1) {
      var SurveyfirstQuestionSubQuation2 = this.SurveyObjDetail.SurveyQLADetail.find((x: any) => x.QuestionId == "1.2");
      this.SurveyfirstQuestion = this.SurveyfirstQuestion.replace("Injury/Rehab", SurveyfirstQuestionSubQuation2.AnswerName);
    }


    this.ClubName = this.SurveyQuestion.ClubListDetail ? this.ClubListDetail.club_name : undefined;
    this.SurveyObjDetailList = this.SurveyObjDetail.SurveyQLADetail;
  }


  redirectToMembershipPlan() {
    var SurveyData = JSON.parse(window.sessionStorage.getItem("SurveyObj")!)
    if (SurveyData) {
      var SurveyRegisterObj = JSON.parse(window.sessionStorage.getItem("RegisterObj")!);
      var PostData = {
        SurveyObjDetails: {
          FirstName: SurveyRegisterObj.firstName,
          LastName: SurveyRegisterObj.lastName,
          Email: SurveyRegisterObj.email,
          PhoneNumber: SurveyRegisterObj.phoneNumber,
          ClubNumber: SurveyRegisterObj.clubNumber,
          hs_object_id: SurveyRegisterObj.hsId,
          QLAList: SurveyData.SurveyQLADetail,
        }
      }
      this._http.requestCall(AuthEndPoints.SAVE_SURVEY, ApiMethod.POST, PostData)?.subscribe({
        next: (response: any) => {
          if (response.data == "1") {
            setTimeout(() => {
              this._router.navigateByUrl('plans')
            }, 2000);
          }
          else {
            this.toastr.error(response.error, constMessage.error);
          }
          window.sessionStorage.setItem("IsPriceShow", JSON.stringify(1));
          window.sessionStorage.setItem("ServiceName", "Guest Service");
        }
      })
    }
    var ClubNumber = window.sessionStorage.getItem("ClubNumber");
    var GUID = window.sessionStorage.getItem('GUID');
    var URL = window.location.href;
    var PageName = window.location.pathname.split('/').pop();
    var Postdata: any = {
      FieldValue: `Tourguide:Visite tourguide `,
      ClubNumber: ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: "CONTINUE"
    }
    this._commonService.SaveWorkFlow(Postdata);
  }
}
