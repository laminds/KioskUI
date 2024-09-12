import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { CommonService } from '../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiMethod, AuthEndPoints, constMessage } from 'src/app/core/constant/const';
import { HttpService } from 'src/app/core/services/http.service';
import jwtDecode from 'jwt-decode';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GenerateTicketModel } from '../../models/headerModel';
import { CheckoutService } from '../../services/checkout.service';
import { memberShipPlanModel, memberPTPlanModel, MemberPlanObj } from '../../models/memberplan-model';
import { LeadModel } from '../../models/searchModel';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  showClubNumberAndVL: boolean;
  logoutClubNumber: string;
  getHeader: any;
  clubFullName: string;
  getClubName: any;
  commonService: CommonService;
  clubShortName: string;
  headerServicesName: string;
  youfit: string;
  submitbtn: string;
  staff: string;
  oldDgrUrl: string;
  signOut: string;
  getServiceName: any;
  staffObj: any;
  userName!: string;
  GenerateTicketdata!: FormGroup<GenerateTicketModel>;
  ClubName!: any;
  ClubNumber!: any;
  membershipPlanObj!: memberShipPlanModel;
  membershipPTPlanObj!: memberPTPlanModel;
  SGTPlanObj!: memberPTPlanModel;
  Identification!: any;
  registerObj!: LeadModel;
  imageData!: any;
  memberObj!: LeadModel;
  attachment: any;
  submitted: boolean;

  constructor(private _http: HttpService, private oauthService: OAuthService, private _checkOutService: CheckoutService,
    private modalService: NgbModal, private _commonService: CommonService, private router: Router, private toastr: ToastrService) {
    this.showClubNumberAndVL = false;
    this.logoutClubNumber = '';
    this.clubFullName = _commonService.initialObj.clubName;
    this.commonService = this._commonService;
    this.clubShortName = _commonService.initialObj.clubShortName;
    this.headerServicesName = '';
    this.youfit = constMessage.header.youfit;
    this.submitbtn = constMessage.header.submitbtn;
    this.staff = constMessage.header.staff;
    this.oldDgrUrl = constMessage.header.oldDgrUrl;
    this.signOut = constMessage.header.signOut;
    this.submitted = false;

    this.staffObj = {
      Username: "",
      Password: ""
    }

    this.GenerateTicketdata = new FormGroup<GenerateTicketModel>({
      summary: new FormControl('', [Validators.required]),
      discription: new FormControl('', [Validators.required]),
      attachment: new FormControl<FileList | null>(null)
    });
  }

  ngOnInit() {
    this.getHeader = this._commonService.getEmittedValueForHeader()
      .subscribe(item => this.showClubNumberAndVL = item);

    this.getServiceName = this._commonService.getEmittedValueForServieName()
      .subscribe(item => this.headerServicesName = item);

    this.getClubName = this._commonService.getEmittedValueForClubName()
      .subscribe(item => this.clubShortName = item);
  }
  get form() { return this.GenerateTicketdata.controls; }

  openLogOutModal(logoutModal: any) {
    this.modalService.open(logoutModal, { centered: true });
  }

  openStaffModal(staffModal: any) {
    this.staffObj.username = null;
    this.staffObj.password = null;
    this.logoutClubNumber = "";
    this.modalService.open(staffModal, { centered: true });
  }

  openGenerateTicketModal(GenerateTicket: any) {
    const body = document.body;
    html2canvas(body).then(canvas => {
      this.imageData = canvas.toDataURL('image/png');
    });
    this.modalService.open(GenerateTicket, { centered: true, size: 'lg' });
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  closeGenerateTicketModal() {
    this.GenerateTicketdata.reset();
    this.attachment = null;
    this.submitted = false;
    this.modalService.dismissAll();
  }

  closeStaffModal() {
    this.modalService.dismissAll();
  }

  logout(clubNumber: any) {
    var GUID = window.sessionStorage.getItem('GUID');
    var URL = window.location.href;
    var PageName = window.location.pathname.split('/').pop();
    var ClubNumber = window.sessionStorage.getItem("ClubNumber");

    var PostData: any = {
      FieldValue: `Sign out:Sign out`,
      ClubNumber: ClubNumber,
      SessionId: GUID,
      PageName: PageName,
      PageUrl: URL,
      ActionType: "Sign out"
    }
    this._commonService.SaveWorkFlow(PostData);
    if (window.sessionStorage.getItem("ClubNumber") && window.sessionStorage.getItem("ClubNumber") == clubNumber) {
      window.sessionStorage.clear();
      this.closeModal();
      this._commonService.changeIsLogoutPage();
      this.router.navigateByUrl('/logout');
      this.oauthService.logOut();
      // window.location.href = 'https://identity.youfit.com/adfs/ls/?wa=wsignoutcleanup1.0';
    }
    else {
      this.closeModal();
    }
  }

  // gotoStaff(staffObj: any) {

  //   var decodeToken: any = jwtDecode(window.sessionStorage.getItem("id_token")!)
  //   var name = decodeToken.unique_name;
  //   this.userName = name.split("\\")[1];

  //   this.staffObj.username = null;
  //   this.staffObj.password = null;
  //   if (!staffObj.Username) {
  //     this.toastr.warning("Please enter username");
  //   }
  //   else if (!staffObj.Password) {
  //     this.toastr.warning("Please enter password");
  //   }
  //   else {
  //     var postData = {
  //       UserName: staffObj.Username,
  //       Password: staffObj.Password
  //     }
  //     this._http.requestCall(AuthEndPoints.VALIDATE_CREDENTIAL, ApiMethod.POST, postData)?.subscribe({
  //       next: (response: any) => {
  //         if (!response || response.data == null) {
  //             this.closeStaffModal();
  //             this.toastr.error("Invalid user", constMessage.error);
  //         }
  //         else {
  //           // if (response.data.userName.toLowerCase() == this.userName.toLowerCase()) {
  //             this.closeStaffModal();
  //             this.router.navigate(['staff']);
  //             this.staffObj.username = null;
  //             this.staffObj.password = null;
  //           // }
  //           // else {
  //           //   this.toastr.error("Invalid user", constMessage.error);
  //           // }
  //         }
  //       }
  //     })
  //   }
  // }

  handleFileInput($event: any) {
    const file = $event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.attachment = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  CloseGenerateTicketModel(GenerateTicketdata: FormGroup<GenerateTicketModel>) {
    this.submitted = true;
    if (this.GenerateTicketdata.invalid) {
      return;
    }
    this.ClubName = window.sessionStorage.getItem("ClubName")!;
    this.ClubNumber = window.sessionStorage.getItem("ClubName")!;
    this.membershipPlanObj = JSON.parse(window.sessionStorage.getItem("PlanObj")!);
    this.membershipPTPlanObj = JSON.parse(window.sessionStorage.getItem("PTPlanObj")!);
    this.SGTPlanObj = JSON.parse(window.sessionStorage.getItem("SmallGroupPlanObj")!);
    this.Identification = JSON.parse(window.sessionStorage.getItem("Identification")!);
    this.registerObj = JSON.parse(window.sessionStorage.getItem("RegisterObj")!);
    this.memberObj = JSON.parse(window.sessionStorage.getItem("MemberObj")!);

    var Userid = JSON.parse(window.sessionStorage.getItem("id_token_claims_obj")!);
    var Username = Userid.unique_name.split('\\')[1];
    var URL = window.location.pathname;
    var segments = URL.split('/');
    var ScreenIndication = segments[segments.length - 1];
    var TicketObj: any = GenerateTicketdata.value;
    var postData: any = {
      summary: TicketObj.summary,
      Discription: TicketObj.discription,
      ClubNumber: this.ClubNumber || null,
      ClubName: this.clubShortName || null,
      ScreenIndication: ScreenIndication || null,
      PlanId: this.membershipPlanObj?.planId || null,
      Planname: this.membershipPlanObj?.planName || null,
      Plantype: this.membershipPlanObj?.membershipType || null,
      PTPlanId: this.membershipPTPlanObj?.ptPlanId || null,
      PTPlanName: this.membershipPTPlanObj?.planName || null,
      PTPlanType: this.membershipPTPlanObj?.ptPlanNameType || null,
      SGTPlanID: this.SGTPlanObj?.planId || null,
      SGTPlanName: this.SGTPlanObj?.planName || null,
      IdentificationString: JSON.stringify(this.Identification.join('>>')),
      ProspectName: (this.memberObj?.firstName && this.memberObj?.lastName) ? (this.memberObj.firstName + '  ' + this.memberObj.lastName) : 
                    (this.registerObj?.firstName && this.registerObj?.lastName) ? (this.registerObj.firstName + '  ' + this.registerObj.lastName) : null,
      ProspectEmail: this.memberObj?.email || this.registerObj?.email || null,
      ProspectPhoneNumber: this.memberObj?.phoneNumber || this.registerObj?.phoneNumber || null,
      ProspectStatus: this.memberObj?.memberStatus || this.registerObj?.memberStatus || 'Guest' || null,
      ImageData: this.imageData,
      Attachment: this.attachment,
      MemberStatus: this.memberObj?.memberStatus || 'Guest' || null,
      Username: Username
    }

    this._http.requestCall(AuthEndPoints.SEND_MAIL, ApiMethod.POST, postData)?.subscribe({
      next: (response: any) => {
        if (response.data == true) {
          this.toastr.success('Ticket created successfully.', 'Success');
          this.attachment = null;
          GenerateTicketdata.reset();
          this.submitted = false;
          this.modalService.dismissAll();
        }
        else {
          this.toastr.error('An error occurred while creating the ticket.', 'Error');
        }
      }
    });
  }

  gotoStaff(clubNumber: any) {

    if (clubNumber && window.sessionStorage.getItem("ClubNumber") == clubNumber) {
      this.router.navigate(['staff']);
      this.closeStaffModal();
    }
    else {
      this.toastr.warning(constMessage.validPassword, constMessage.warning);
    }
  }

  // if (clubNumber && window.sessionStorage.getItem("ClubNumber") == clubNumber) {
  //   this.router.navigate(['staff']);
  //   this.closeStaffModal();
  // }
  // else {
  //   this.toastr.warning(constMessage.validPassword, constMessage.warning);
  // }
}
