import { Component } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonType } from '../../Types/commonTypes';
import { HttpService } from 'src/app/core/services/http.service';
import { ApiMethod, AuthEndPoints, constMessage } from 'src/app/core/constant/const';
import { clubDetailsModel } from '../../models/clubDetailsModel';
import { salesPersonModel } from '../../models/salesPersonModel';
import * as _ from 'lodash';
import { clubListModel, surveyQuestionModel } from '../../models/surveyModel';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SalesPersonMissingModalPopupComponent } from '../../modal/sales-person-missing-modal-popup/sales-person-missing-modal-popup.component';
import { responseModel } from '../../interface/responseModel';
import { clubModel } from '../../models/clubModel';
import { HomeService } from 'src/app/modules/home/services/home.service';


@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent {

  commonTypeObj: CommonType | undefined;
  commonService: CommonService;
  path: string;
  slideNo: string;
  BannerClass: string;
  slider: any;
  slider1: any;
  surveyQuestionsList: any;
  surveyOptionList: any;
  salesPersonList: salesPersonModel[];
  activeIndex: number;
  searchFilter!: string;
  questionWithOption: any[] | undefined;
  loseWeightQuestionDetail: boolean;
  mealplanningDetail: boolean | string;
  familymembersDetail: boolean | string;
  surveyQuestion: surveyQuestionModel;
  radiobuttonList: any[];
  radiobuttonListforQuestionsSix: any[];
  radiobuttonListforQuestionsNine: any[];
  questionsNineSubQuestions: any[];
  questionsEightSubQuestions: any[];
  checkBoxList: any[];
  thirdcheckBoxList: any[];
  questionsOneSubQuestions: any[];
  visitlocationsDetail: boolean;
  InjuryRehabQuestionDetail: boolean;
  otherQuestionDetail: boolean;
  motivationGoalsDetail: boolean;
  locationList: any[];
  activeClubIndex: number;
  searchClubFilter!: string;
  hideShowOtherfield!: boolean;

  salesPersonObj: salesPersonModel = {
    fullName: "",
    clubNumber: 0,
    clubName: '',
    mode: '',
    moduleName: '',
    sourceName: '',
    childSourceName: '',
    barCode: '',
    empBranchCode: '',
    employeeEmail: '',
    employeeId: 0,
    employeePhone: '',
    employeeStatus: '',
    epFullName: '',
    firstName: '',
    lastName: '',
    paychexId: '',
    SPClubNumber: '',
    SPEmployeeId: 0,
    salesPersonMissing: 0
  }

  clubObj: clubListModel = {
    club_name: "",
    Code: 0
  }

  constructor(
    private _commonService: CommonService,
    private _router: Router,
    private toastr: ToastrService,
    private _http: HttpService,
    private modalService: NgbModal,
    private homeService: HomeService
  ) {
    this.path = '';
    this.slideNo = '';
    this.BannerClass = '';
    this.commonService = _commonService;
    this._commonService.setServiceName(window.sessionStorage.getItem("ServiceName")!);
    this.slider = '';
    this.slider1 = '';
    this.salesPersonList = [];
    this.activeIndex = 0;
    this.loseWeightQuestionDetail = false;
    this.mealplanningDetail = false;
    this.familymembersDetail = false;
    this.radiobuttonList = [];
    this.radiobuttonListforQuestionsSix = [];
    this.radiobuttonListforQuestionsNine = [];
    this.questionsNineSubQuestions = [];
    this.questionsEightSubQuestions = [];
    this.checkBoxList = [];
    this.thirdcheckBoxList = [];
    this.questionsOneSubQuestions = [];
    this.visitlocationsDetail = false;
    this.InjuryRehabQuestionDetail = false;
    this.otherQuestionDetail = false;
    this.motivationGoalsDetail = false;
    this.locationList = [];
    this.activeClubIndex = 0;

    this.surveyQuestion = {
      LoseWeight: false,
      Gainstrength: false,
      Buildmuscle: false,
      Toneup: false,
      Increaseendurance: false,
      InjuryRehab: false,
      InjuryRehabQuestion: "",
      InjuryRehabQuestionDetail: false,
      LoseWeightQuestion: "",
      LoseWeightQuestionDetail: false,
      SalesPersonObj: undefined,
      ClubListDetail: undefined,
      mealplanningDetail: false,
      mealplanning: false,
      visitlocations: false,
      visitlocationsDetail: false,
      mealplanningSubDetail: "",
      motivationforGoals: "",
      motivationforGoalsDetail: "",
      personalevent: false,
      specialevent: false,
      healthspecial: false,
      lifechange: false,
      wellbeing: false,
      other: false,
      otherQuestionDetail: false,
      otherQuestion: "",
      OtherQuestion: "",
      familymembers: false,
      familymembersSubDetail: false
    }
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
    this.getSalesPersonList();
    this.getClubList();
    this.getQuestionOptionsDetails();
  }


  getSalesPersonList() {
    var postData: clubDetailsModel = {
      clubNumber: JSON.parse(sessionStorage.getItem('ClubNumber') || '{}'),
      clubName: '',
      mode: ''
    }
    this._http.requestCall(AuthEndPoints.GET_SALES_MEMBER_DETAIL, ApiMethod.POST, postData)?.subscribe({
      next: (response: any) => {
        if (response) {
          this.salesPersonList = response.data;
          var staffDetail = JSON.parse(window.sessionStorage.getItem("StaffDetail")!);
          if (staffDetail) {
            this.surveyQuestion.SalesPersonObj = _.filter(this.salesPersonList, { epFullName: staffDetail.salesPersonName })[0];
            if (this.surveyQuestion.SalesPersonObj) {
              this.surveyQuestion.SalesPersonObj.fullName;
            }
          }
        }
        else {
          this.toastr.error(response.Message, constMessage.error);
        }
      }
    })
  }

  getClubList() {
    this.homeService.GetClubList().subscribe({
      next: (response: responseModel<clubModel[]>) => {
        if (response.data != null) {
          this.locationList = response.data;
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


  activeSelectedOption(data: salesPersonModel, index: number) {
    this.salesPersonObj = data;
    this.activeIndex = index;

  }

  getQuestionOptionsDetails() {
    this.slider = {
      value: 0,
      options: {
        floor: 0,
        ceil: 50,
        step: 5,
        showSelectionBar: true,
        showTicks: true,
      }
    };

    this.slider1 = {
      value: 0,
      options: {
        floor: 0,
        ceil: 10,
        step: 1,
        showSelectionBar: true,
        showTicks: true,
      }
    };
    this._http.requestCall(AuthEndPoints.GET_QLA_DETAILS, ApiMethod.GET, '')?.subscribe({
      next: (response: any) => {
        var staffDetail = window.sessionStorage.getItem("StaffDetail") ? JSON.parse(window.sessionStorage.getItem("StaffDetail")!) : JSON.parse(window.sessionStorage.getItem("RegisterObj")!);
        this.surveyQuestion.SalesPersonObj = staffDetail.salesPersonName ? _.filter(this.salesPersonList, { fullName: staffDetail.salesPersonName })[0] : null,

          this.surveyQuestionsList = response.data.surveyQuestion;
        this.surveyOptionList = response.data.surveyOption;

        this.radiobuttonList = _.filter(this.surveyOptionList, function (O: any) {
          return (O.questionOrderId == 5 || O.questionOrderId == 6 || O.questionOrderId == 7 || O.questionOrderId == 8.3 || O.questionOrderId == 9 || O.questionOrderId == 13);
        });

        this.checkBoxList = _.filter(this.surveyOptionList, function (O: any) {
          return (O.questionOrderId == 1 || O.questionOrderId == 12);
        });

        this.thirdcheckBoxList = _.filter(this.surveyOptionList, function (O: any) {
          return (O.questionOrderId == 3);
        });

        this.questionsOneSubQuestions = _.filter(this.surveyQuestionsList, function (O: any) {
          return (O.questionOrderId == 1.1 || O.questionOrderId == 1.2 || O.questionOrderId == 6.1 || O.questionOrderId == 13.1);
        });

        this.radiobuttonListforQuestionsSix = _.filter(this.surveyOptionList, function (O: any) {
          return (O.questionOrderId == 6 || O.questionOrderId == 6.1 || O.questionOrderId == 13 || O.questionOrderId == 5);
        });

        this.radiobuttonListforQuestionsNine = _.filter(this.surveyOptionList, function (O: any) {
          return (O.questionOrderId == 9);
        });

        this.questionsEightSubQuestions = _.filter(this.surveyQuestionsList, function (O: any) {
          return (O.questionOrderId == "8.2.2");
        });

        this.questionsNineSubQuestions = _.filter(this.surveyQuestionsList, function (O: any) {
          return (O.questionOrderId == 9.1);
        });

        var TableGroupData: any = [];
        _.forEach(this.surveyQuestionsList, (data: any, key: any) => {
          var list = _.filter(this.surveyOptionList, { questionOrderId: data.questionOrderId });
          var Obj = {
            AnswerName: null,
            FormInputName: data.formInputName,
            Name: data.name,
            QuestionId: data.id,
            QuestionOrderId: data.questionOrderId,
            QuestionsTypeName: data.questionsTypeName,
            QuestionsTypeOrderId: data.questionsTypeOrderId,
            List: _.filter(this.surveyOptionList, { questionOrderId: data.questionOrderId }),
            ParentID: data.parentId
          };
          TableGroupData.push(Obj);
        });
        this.questionWithOption = TableGroupData;
        this._commonService.setBodyHeightSize();
      }
    })
  }

  checkUncheckInjuryRehab() {
    if (this.surveyQuestion.InjuryRehab == true) {
      this.InjuryRehabQuestionDetail = true;
    }
    else {
      this.InjuryRehabQuestionDetail = false;
    }
    this._commonService.setBodyHeightSize();
  }

  checkUncheckLoseWeight() {
    if (this.surveyQuestion.LoseWeight == true) {
      this.loseWeightQuestionDetail = true;
    }
    else {
      this.loseWeightQuestionDetail = false;
    }
  }

  checkUncheckthirdCheckBox() {
    if (this.surveyQuestion.other == true) {
      this.otherQuestionDetail = true;
    }
    else {
      this.otherQuestionDetail = false;
    }
  }

  hideShowOthertextbox(name: any, QuestionOrderId: any) {
    if (QuestionOrderId == "8.2") {
      if (name == "Other") {
        this.hideShowOtherfield = true;
      }
      else {
        this.hideShowOtherfield = false;
      }
      this.surveyQuestion.OtherQuestion = '';
    }
    this._commonService.setBodyHeightSize();
  }

  hideshowQuestionsMotivationforGoalsQuestions(name: any) {
    if (this.surveyQuestion.motivationforGoals == "Yes") {
      this.motivationGoalsDetail = true;
    }
    else {
      this.motivationGoalsDetail = false;
    }
    this._commonService.setBodyHeightSize();
  }

  hideshowQuestionsSixsubQuestions() {
    if (this.surveyQuestion.mealplanning == "Yes" || this.surveyQuestion.mealplanning == true) {
      this.mealplanningDetail = true;
    }
    else {
      this.mealplanningDetail = false;
    }
    this._commonService.setBodyHeightSize();
  }

  hideshowQuestionsNinesubQuestions() {
    if (this.surveyQuestion.familymembers == "Yes" || this.surveyQuestion.familymembers == true) {
      this.familymembersDetail = true;
    }
    else {
      this.familymembersDetail = false;
    }
    this._commonService.setBodyHeightSize();
  }


  hideshowQuestionstwelvesubQuestions() {
    if (this.surveyQuestion.visitlocations == "Yes") {
      this.visitlocationsDetail = true;
      this.getClubList();
    }
    else {
      this.visitlocationsDetail = false;
    }
    this._commonService.setBodyHeightSize();
  }

  activeclubSelectedOption(data: clubListModel, index: number) {
    this.clubObj = data;
    this.activeClubIndex = index;
  }

  decreaseProgressBarValueForQuestion2 = () => {
    var data = this.slider1.value - 1;
    if (data > 0 || data == 0) {
      this.slider1 = {
        value: data,
        options: {
          floor: 0,
          ceil: 10,
          step: 1,
          showSelectionBar: true,
          showTicks: true,
        }
      };
    }


  }

  increaseProgressBarValueForQuestion2 = () => {
    var data = this.slider1.value + 1;
    if (data < 11) {
      this.slider1 = {
        value: data,
        options: {
          floor: 0,
          ceil: 10,
          step: 1,
          showSelectionBar: true,
          showTicks: true,
        }
      };
    }

  }

  decreaseProgressBarValue = () => {
    var data = this.slider.value - 5;
    if (data > 0 || data == 0) {
      this.slider = {
        value: data,
        options: {
          floor: 0,
          ceil: 50,
          step: 5,
          showSelectionBar: true,
          showTicks: true,
        }
      };
    }
  }

  increaseProgressBarValue = () => {
    var data = this.slider.value + 5;
    if (data < 55) {
      this.slider = {
        value: data,
        options: {
          floor: 0,
          ceil: 50,
          step: 5,
          showSelectionBar: true,
          showTicks: true,
        }
      };
    }
  }

  saveSurveyDetail(list: any, SurveyQuestion: surveyQuestionModel, clubObj: any, salesPersonObj: any) {
    var slider1 = this.slider1.value;
    var slider = this.slider.value;
    var OthlerValidation = this.hideShowOtherfield;
    if (salesPersonObj) {
      window.sessionStorage.setItem("SalesPerson", JSON.stringify(salesPersonObj.fullName));
    }

    var toastrFlag;
    var QId;
    var Obj;

    if (!salesPersonObj.fullName) {
      this.toastr.warning("Please Select Team Member ", "Required");
      return
    }
    if (!SurveyQuestion.LoseWeight && !SurveyQuestion.Gainstrength && !SurveyQuestion.Buildmuscle && !SurveyQuestion.Toneup && !SurveyQuestion.Increaseendurance && !SurveyQuestion.InjuryRehab) {
      this.toastr.warning("Please Enter Answer of Question Number " + "1", "Required");
      return
    }

    if (slider1 == 0) {
      this.toastr.warning("Please Enter Answer of Question Number " + "2", "Required");
      return
    }

    _.forEach(list, function (data: any, key: any) {
      if ((!data.AnswerName && data.QuestionOrderId != "1" && data.QuestionOrderId != "2" && data.QuestionOrderId != "1.1" && data.QuestionOrderId != "1.2" && data.QuestionOrderId != "13") || data.QuestionOrderId == "8.2") {
        if (data.QuestionOrderId != "12" && data.QuestionOrderId != "1" && data.QuestionOrderId != "6" && data.QuestionOrderId != "6.1" && data.QuestionOrderId != "6.2" && data.QuestionOrderId != "13" && data.QuestionOrderId != "13.1" && data.QuestionOrderId != "5" && data.QuestionOrderId != "3" && data.QuestionOrderId != "3.5"
          && data.QuestionOrderId != "9" && data.QuestionOrderId != "9.1" && data.QuestionOrderId != "8.2.2" && data.QuestionOrderId != "8.2") {
          toastrFlag = true;
          QId = data.QuestionsTypeOrderId

        }
        else if (!SurveyQuestion.personalevent && !SurveyQuestion.specialevent && !SurveyQuestion.healthspecial && !SurveyQuestion.lifechange && !SurveyQuestion.wellbeing && !SurveyQuestion.other) {
          QId = "3";
          toastrFlag = true;
        }
        else if (data.FormInputName == "CheckBox" && data.QuestionOrderId != "3" && data.QuestionOrderId != "3.5") {
          var Display = list.find((x: any) => x.QuestionOrderId == data.QuestionOrderId);
          var GetList = _.filter(Display.List, { 'Selected': true });
          if (GetList.length == 0) {
            toastrFlag = true;
            QId = data.QuestionsTypeOrderId;
          }
          else {
            return;
          }
        }
        else if (data.QuestionOrderId == "5" && SurveyQuestion.motivationforGoals == false) {
          QId = data.QuestionsTypeOrderId;
          toastrFlag = true;
        }
        else if (data.QuestionOrderId == "6" && SurveyQuestion.mealplanning == false) {
          QId = data.QuestionsTypeOrderId;
          toastrFlag = true;
        }
        else if (data.QuestionOrderId == "6" && SurveyQuestion.mealplanning == "Yes") {
          if (SurveyQuestion.mealplanningSubDetail == "") {
            QId = data.QuestionsTypeOrderId;
            toastrFlag = true;
          }
          else {
            return;
          }
        }
        else if (data.QuestionOrderId == "8.2") {
          if (data.AnswerName == "" || data.AnswerName == null) {
            QId = data.QuestionsTypeOrderId;
            toastrFlag = true;
          }
          else if (OthlerValidation == true && SurveyQuestion.OtherQuestion == "") {
            QId = "8b Other Field";
            toastrFlag = true;
          }
          else {
            return;
          }
        }
        else if (data.QuestionOrderId == "9" && SurveyQuestion.familymembers == false) {
          QId = data.QuestionsTypeOrderId;
          toastrFlag = true;
        }
        else if (data.QuestionOrderId == "9" && SurveyQuestion.familymembers == "Yes") {
          if (SurveyQuestion.familymembersSubDetail == false || SurveyQuestion.familymembersSubDetail == "") {
            QId = data.QuestionsTypeOrderId;
            toastrFlag = true;
          }
          else {
            return;
          }
        }
        else if (data.QuestionOrderId == "13" && SurveyQuestion.visitlocations == false) {
          QId = data.QuestionsTypeOrderId;
          toastrFlag = true;
        }
        else {
          return;
        }
        return false;
      }
    })

    if (toastrFlag) {
      this.toastr.warning("Please Enter Answer of Question Number " + QId, "Required");
    }
    else {
      var PhonePattern = /^(\d{10})$/;
      var IsValidate = false;
      if (IsValidate == false) {
        var SurveyQLAData: any = [];
        _.forEach(list, function (data: any, key: any) {
          var AnswerValueName;
          var QuestionValueId;
          var QuestionsTypeValue;
          var OptionsId;
          var OtherAnswerData;
          if (data.QuestionOrderId == "1") {
            if (SurveyQuestion.LoseWeight == true) {
              var Display = data.List.find((x: any) => x.name == "Lose weight");
              Display.Selected = true;
            }
            if (SurveyQuestion.Gainstrength == true) {
              var Display = data.List.find((x: any) => x.name == "Gain strength");
              Display.Selected = true;
            }
            if (SurveyQuestion.Buildmuscle == true) {
              var Display = data.List.find((x: any) => x.name == "Build muscle");
              Display.Selected = true;
            }
            if (SurveyQuestion.Toneup == true) {
              var Display = data.List.find((x: any) => x.name == "Tone up");
              Display.Selected = true;
            }
            if (SurveyQuestion.Increaseendurance == true) {
              var Display = data.List.find((x: any) => x.name == "Increase endurance");
              Display.Selected = true;
            }
            if (SurveyQuestion.InjuryRehab == true) {
              var Display = data.List.find((x: any) => x.name == "Injury/Rehab");
              Display.Selected = true;
            }
          }

          if (data.QuestionOrderId == "3") {
            if (SurveyQuestion.personalevent == true) {
              var Display = data.List.find((x: any) => x.name == "Personal event (wedding, vacation, reunion)");
              Display.Selected = true;
            }
            if (SurveyQuestion.specialevent == true) {
              var Display = data.List.find((x: any) => x.name == "Training for a special event (5K, walk, fundraiser)");
              Display.Selected = true;
            }
            if (SurveyQuestion.healthspecial == true) {
              var Display = data.List.find((x: any) => x.name == "Health reasons (doctor recommendation)");
              Display.Selected = true;
            }
            if (SurveyQuestion.lifechange == true) {
              var Display = data.List.find((x: any) => x.name == "Life change (divorce, new job, stress)");
              Display.Selected = true;
            }
            if (SurveyQuestion.wellbeing == true) {
              var Display = data.List.find((x: any) => x.name == "Enhancing overall well-being (Physically, mentally, emotionally)");
              Display.Selected = true;
            }
            if (SurveyQuestion.other == true) {
              var Display = data.List.find((x: any) => x.name == "Other");
              Display.Selected = true;
            }
          }
          if (data.FormInputName == "DropDown" && data.QuestionOrderId != "2" && data.QuestionOrderId != "1.1") {
            AnswerValueName = data.AnswerName,
              QuestionValueId = data.QuestionOrderId,
              QuestionsTypeValue = data.QuestionsTypeName
            OptionsId = _.filter(data.List, { 'name': data.AnswerName })[0].id;
          }

          else if (data.FormInputName == "CheckBox") {
            var Display = list.find((x: any) => x.QuestionOrderId == data.QuestionOrderId);
            var GetList = _.filter(Display.List, { 'Selected': true });
            if (GetList.length != 0) {
              AnswerValueName = _.join(_.map(_.filter(GetList, { 'Selected': true }), 'name'), ';');
              QuestionValueId = data.QuestionOrderId,
                QuestionsTypeValue = data.QuestionsTypeName
              OptionsId = _.join(_.map(_.filter(GetList, { 'Selected': true }), 'id'), ',');
            }
          }

          else {
            if (data.QuestionOrderId == "6") {
              AnswerValueName = SurveyQuestion.mealplanning == "Yes" ? "Yes" : SurveyQuestion.mealplanning == "No" ? "No" : "No",
                QuestionValueId = data.QuestionOrderId,
                QuestionsTypeValue = data.QuestionsTypeName
            }
            else if (data.QuestionOrderId == "9") {
              AnswerValueName = SurveyQuestion.familymembers == "Yes" ? "Yes" : SurveyQuestion.familymembers == "No" ? "No" : "No",
                QuestionValueId = data.QuestionOrderId,
                QuestionsTypeValue = data.QuestionsTypeName
            }
            else if (data.QuestionOrderId == "13") {
              var ClubNumber = clubObj ? clubObj.club_name : undefined;
              var Name = SurveyQuestion.visitlocations == "Yes" ? "Yes" : SurveyQuestion.visitlocations == "No" ? "No" : " ";
              if (Name == "No") {
                var ClubName = clubObj ? undefined : undefined;
                AnswerValueName = ClubName + ";" + Name
              }
              else if (Name == " ") {
                AnswerValueName = null;
              }
              else {
                AnswerValueName = ClubNumber + ";" + Name
              }
              QuestionValueId = data.QuestionOrderId,
                QuestionsTypeValue = data.QuestionsTypeName
            }
            else if (data.QuestionOrderId == "5") {
              AnswerValueName = SurveyQuestion.motivationforGoals == "Yes" ? "Yes" : SurveyQuestion.motivationforGoals == "No" ? "No" : "No",
                QuestionValueId = data.QuestionOrderId,
                QuestionsTypeValue = data.QuestionsTypeName
            }
            else if (data.QuestionOrderId == "2") {
              AnswerValueName = slider1,
                QuestionValueId = data.QuestionOrderId,
                QuestionsTypeValue = data.QuestionsTypeName

            }
            else {
              AnswerValueName = data.AnswerName == "Yes" ? "Yes" : data.AnswerName == "No" ? "No" : "No",
                QuestionValueId = data.QuestionOrderId,
                QuestionsTypeValue = data.QuestionsTypeName
            }

          }

          Obj = {
            QuestionId: QuestionValueId,
            AnswerName: AnswerValueName,
            QuestionsTypeName: QuestionsTypeValue,
            OptionId: OptionsId,
            OtherAnswerName: OtherAnswerData,
            SalesPerson: salesPersonObj ? salesPersonObj.fullName : ""

          };
          SurveyQLAData.push(Obj);
        });
        if (SurveyQuestion.LoseWeight == true) {
          var AnswerValueName;
          var QuestionValueId;
          var QuestionsTypeValue;
          var OptionsId;
          var OtherAnswerData;

          if (SurveyQuestion.LoseWeight == true) {
            var Display = list[0].List.find((x: any) => x.name == "Lose weight");

            var Survey = SurveyQLAData.filter((x: any) => x.QuestionId != "1.1" && x.QuestionId != "1.2" && x.QuestionId != "6.1" && x.QuestionId != "13.1" && x.QuestionId != "3.5" && x.QuestionId != "8.2.2" && x.QuestionId != "9.1");
            SurveyQLAData = Survey;
            AnswerValueName = slider;
            QuestionValueId = "1.1";
            OptionsId = Display.id;
          }
          Obj = {
            QuestionId: QuestionValueId,
            AnswerName: AnswerValueName,
            QuestionsTypeName: QuestionsTypeValue,
            OptionId: OptionsId,
            OtherAnswerName: OtherAnswerData,
            SalesPerson: salesPersonObj ? salesPersonObj.fullName : ""

          };
          SurveyQLAData.push(Obj);
        }
        if (SurveyQuestion.InjuryRehab == true) {
          var AnswerValueName;
          var QuestionValueId;
          var QuestionsTypeValue;
          var OptionsId;
          var OtherAnswerData;

          if (SurveyQuestion.InjuryRehab == true) {
            var Display = list[0].List.find((x: any) => x.name == "Injury/Rehab");

            if (SurveyQuestion.LoseWeight == false) {
              var Survey = SurveyQLAData.filter((x: any) => x.QuestionId != "1.1" && x.QuestionId != "1.2" && x.QuestionId != "6.1" && x.QuestionId != "13.1" && x.QuestionId != "3.5" && x.QuestionId != "8.2.2" && x.QuestionId != "9.1");
              SurveyQLAData = Survey;
            }

            AnswerValueName = SurveyQuestion.InjuryRehabQuestion;
            QuestionValueId = "1.2";
            OptionsId = Display.id;

          }
          Obj = {
            QuestionId: QuestionValueId,
            AnswerName: AnswerValueName,
            QuestionsTypeName: QuestionsTypeValue,
            OptionId: OptionsId,
            OtherAnswerName: OtherAnswerData,
            SalesPerson: salesPersonObj ? salesPersonObj.fullName : ""
          };
          SurveyQLAData.push(Obj);
        }
        if (SurveyQuestion.other == true) {
          var AnswerValueName;
          var QuestionValueId;
          var QuestionsTypeValue;
          var OptionsId;
          var OtherAnswerData;

          if (SurveyQuestion.other == true) {
            var Display = list[2].List.find((x: any) => x.name == "Other");

            if (SurveyQuestion.LoseWeight == false && SurveyQuestion.InjuryRehab == false) {
              var Survey = SurveyQLAData.filter((x: any) => x.QuestionId != "3.5" && x.QuestionId != "1.1" && x.QuestionId != "1.2" && x.QuestionId != "6.1" && x.QuestionId != "13.1" && x.QuestionId != "8.2.2" && x.QuestionId != "9.1");
            }

            SurveyQLAData = Survey;
            AnswerValueName = SurveyQuestion.otherQuestion;
            QuestionValueId = "3.5";
            OptionsId = Display.id;
          }
          Obj = {
            QuestionId: QuestionValueId,
            AnswerName: AnswerValueName,
            QuestionsTypeName: QuestionsTypeValue,
            OptionId: OptionsId,
            OtherAnswerName: OtherAnswerData,
            SalesPerson: salesPersonObj ? salesPersonObj.fullName : ""

          };
          SurveyQLAData.push(Obj);
        }
        if (SurveyQuestion.motivationforGoals == "Yes") {
          var AnswerValueName;
          var QuestionValueId;
          var QuestionsTypeValue;
          var OptionsId;
          var OtherAnswerData;

          if (SurveyQuestion.LoseWeight == false && SurveyQuestion.InjuryRehab == false && this.surveyQuestion.mealplanning == "No" && SurveyQuestion.other == false) {
            var Survey = SurveyQLAData.filter((x: any) => x.QuestionId != "1.1" && x.QuestionId != "1.2" && x.QuestionId != "6.1" && x.QuestionId != "13.1" && x.QuestionId != "3.5" && x.QuestionId != "8.2.2" && x.QuestionId != "9.1");
            SurveyQLAData = Survey;
          }

          AnswerValueName = SurveyQuestion.motivationforGoalsDetail;
          QuestionValueId = "5.1";
          OptionsId = "5.1";

          Obj = {
            QuestionId: QuestionValueId,
            AnswerName: AnswerValueName,
            QuestionsTypeName: QuestionsTypeValue,
            OptionId: OptionsId,
            OtherAnswerName: OtherAnswerData,
            SalesPerson: salesPersonObj ? salesPersonObj.fullName : ""
          };
          SurveyQLAData.push(Obj);
        }
        if (this.surveyQuestion.mealplanning == "Yes") {
          var AnswerValueName;
          var QuestionValueId;
          var QuestionsTypeValue;
          var OptionsId;
          var OtherAnswerData;

          if (SurveyQuestion.LoseWeight == false && SurveyQuestion.InjuryRehab == false && SurveyQuestion.motivationforGoals == "No" && SurveyQuestion.other == false) {
            var Survey = SurveyQLAData.filter((x: any) => x.QuestionId != "1.1" && x.QuestionId != "1.2" && x.QuestionId != "6.1" && x.QuestionId != "13.1" && x.QuestionId != "3.5" && x.QuestionId != "8.2.2" && x.QuestionId != "9.1");
            SurveyQLAData = Survey;
          }
          AnswerValueName = SurveyQuestion.mealplanningSubDetail == "Yes" ? "Yes" : SurveyQuestion.mealplanningSubDetail == "No" ? "No" : "No";
          QuestionValueId = "6.1";
          OptionsId = SurveyQuestion.mealplanningSubDetail == "Yes" ? "23" : SurveyQuestion.mealplanningSubDetail == "No" ? "24" : "24";

          Obj = {
            QuestionId: QuestionValueId,
            AnswerName: AnswerValueName,
            QuestionsTypeName: QuestionsTypeValue,
            OptionId: OptionsId,
            OtherAnswerName: OtherAnswerData,
            SalesPerson: salesPersonObj ? salesPersonObj.fullName : ""
          };
          SurveyQLAData.push(Obj);
        }
        if (SurveyQuestion.OtherQuestion != "") {
          var AnswerValueName;
          var QuestionValueId;
          var QuestionsTypeValue;
          var OptionsId;
          var OtherAnswerData;

          if (SurveyQuestion.LoseWeight == false && SurveyQuestion.InjuryRehab == false && SurveyQuestion.motivationforGoals == "No" && SurveyQuestion.other == false && this.surveyQuestion.mealplanning != "Yes") {
            var Survey = SurveyQLAData.filter((x: any) => x.QuestionId != "1.1" && x.QuestionId != "1.2" && x.QuestionId != "6.1" && x.QuestionId != "13.1" && x.QuestionId != "3.5" && x.QuestionId != "8.2.2" && x.QuestionId != "9.1");
            SurveyQLAData = Survey;
          }
          AnswerValueName = SurveyQuestion.OtherQuestion;
          QuestionValueId = "8.2.2";
          OptionsId = "8.2.2";

          Obj = {
            QuestionId: QuestionValueId,
            AnswerName: AnswerValueName,
            QuestionsTypeName: QuestionsTypeValue,
            OptionId: OptionsId,
            OtherAnswerName: OtherAnswerData,
            SalesPerson: salesPersonObj ? salesPersonObj.fullName : ""
          };
          SurveyQLAData.push(Obj);
        }
        if (this.surveyQuestion.familymembers == "Yes") {
          var AnswerValueName;
          var QuestionValueId;
          var QuestionsTypeValue;
          var OptionsId;
          var OtherAnswerData;

          if (SurveyQuestion.LoseWeight == false && SurveyQuestion.InjuryRehab == false && SurveyQuestion.motivationforGoals == "No" && SurveyQuestion.other == false && this.surveyQuestion.mealplanning != "Yes" && SurveyQuestion.OtherQuestion != "") {
            var Survey = SurveyQLAData.filter((x: any) => x.QuestionId != "1.1" && x.QuestionId != "1.2" && x.QuestionId != "6.1" && x.QuestionId != "13.1" && x.QuestionId != "3.5" && x.QuestionId != "8.2.2" && x.QuestionId != "9.1");
            SurveyQLAData = Survey;
          }
          AnswerValueName = SurveyQuestion.familymembersSubDetail == "Yes" ? "Yes" : SurveyQuestion.familymembersSubDetail == "No" ? "No" : "No";
          QuestionValueId = "9.1";
          OptionsId = SurveyQuestion.familymembersSubDetail == "Yes" ? "53" : SurveyQuestion.familymembersSubDetail == "No" ? "54" : "54";

          Obj = {
            QuestionId: QuestionValueId,
            AnswerName: AnswerValueName,
            QuestionsTypeName: QuestionsTypeValue,
            OptionId: OptionsId,
            OtherAnswerName: OtherAnswerData,
            SalesPerson: salesPersonObj ? salesPersonObj.fullName : ""
          };
          SurveyQLAData.push(Obj);
        }
        if (SurveyQuestion.LoseWeight == false && SurveyQuestion.InjuryRehab == false && SurveyQuestion.other == false && SurveyQuestion.motivationforGoals == "No" && this.surveyQuestion.mealplanning == "No" && this.surveyQuestion.familymembers == "No" && SurveyQuestion.OtherQuestion == "") {
          var Survey = SurveyQLAData.filter((x: any) => x.QuestionId != "1.1" && x.QuestionId != "1.2" && x.QuestionId != "6.1" && x.QuestionId != "13.1" && x.QuestionId != "3.5" && x.QuestionId != "9.1" && x.QuestionId != "8.2.2");
          SurveyQLAData = Survey;
        }
        var SurveyObj = {
          SurveyQLADetail: SurveyQLAData,
        }

        window.sessionStorage.setItem("SurveyObj", JSON.stringify(SurveyObj));
        this._router.navigate(['survey/tourguide'])
      }
      var ClubNumber = window.sessionStorage.getItem("ClubNumber");
      var GUID = window.sessionStorage.getItem('GUID');
      var URL = window.location.href;
      var PageName = window.location.pathname.split('/').pop();
      var PostData: any = {
        FieldValue: `Survey:Filled all Required Question`,
        ClubNumber: ClubNumber,
        SessionId: GUID,
        PageName: PageName,
        PageUrl: URL,
        ActionType: "CONTINUE"
      }
      this._commonService.SaveWorkFlow(PostData);
    }
  }

  oepnMissingSalesPersonModal(data: salesPersonModel) {
    if (data.salesPersonMissing == 1) {
      const modalRef = this.modalService.open(SalesPersonMissingModalPopupComponent, { size: 'md', centered: true });
    }
  }
}
