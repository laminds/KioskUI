import { salesPersonModel } from "./salesPersonModel";

export class surveyQuestionModel {
  LoseWeight: boolean | undefined;
  Gainstrength: boolean | undefined;
  Buildmuscle: boolean | undefined;
  Toneup: boolean | undefined;
  Increaseendurance: boolean | undefined;
  InjuryRehab: boolean | undefined;
  InjuryRehabQuestion: string = "";
  InjuryRehabQuestionDetail: boolean | undefined;
  LoseWeightQuestion: string = "";
  LoseWeightQuestionDetail: boolean | undefined;
  SalesPersonObj: salesPersonModel | undefined | null = null;
  ClubListDetail: clubListModel | undefined | null;
  mealplanningDetail: boolean | undefined;
  mealplanning: boolean | string | undefined;
  familymembers:boolean|string|undefined;
  familymembersSubDetail:boolean|String|undefined;
  visitlocations: boolean | string | undefined;
  visitlocationsDetail: boolean | undefined;
  mealplanningSubDetail: string | undefined;
  motivationforGoals: boolean| string |   undefined;
  motivationforGoalsDetail: string | undefined;
  personalevent: boolean | undefined;
  specialevent: boolean | undefined;
  healthspecial: boolean | undefined;
  lifechange: boolean | undefined;
  wellbeing: boolean | undefined;
  other: boolean | undefined;
  otherQuestionDetail: boolean | undefined;
  otherQuestion: string| undefined;
  OtherQuestion: string| undefined;
} 

export class clubListModel {
  club_name: string = "";
  Code: number = 0;
}

export class AnswerListModel {
  displayName: string = "";
  id: number = 0;
  name: string = "";
  questionOrderId: string = "";
}