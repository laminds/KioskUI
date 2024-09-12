import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LeadModel } from '../../models/searchModel';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { constMessage } from 'src/app/core/constant/const';

@Component({
  selector: 'app-rfc-check-modal',
  templateUrl: './rfc-check-modal.component.html',
  styleUrls: ['./rfc-check-modal.component.css']
})
export class RfcCheckModalComponent {
  @Input() leadData!: LeadModel;
  closeRfcErrorModal?: NgbActiveModal;
  passwordClubNumber: string;

  constructor(
    public activeRfcCheckModal: NgbActiveModal,
    private config: NgbModalConfig,
    private router: Router,
    private _commonService: CommonService,
    private toastr: ToastrService) {
    this.passwordClubNumber = "";
    this.config.backdrop = 'static';
    this.config.keyboard = false;
  }

  closeModal() {
    this.activeRfcCheckModal.dismiss();
  }

  checkPassword(password: string) {
    this.CheckClubPassword(password, this.activeRfcCheckModal);
  }

  CheckClubPassword(password: string, activeRfcCheckModal: NgbActiveModal) {
    if (window.sessionStorage.getItem("ClubNumber") == password) {
      this._commonService.onSearchComponentMethodClick(this.leadData);
      this.activeRfcCheckModal.dismiss();
    }
    else {
      this.toastr.warning("Please enter correct password.", constMessage.required);
    }
  }
  
  redirectToMainOptionModule() {
    if (window.sessionStorage.getItem("SourceName") == this._commonService.commonTypeObj.member.guestCheckInType) {
      this.router.navigate(['member']);
    }
    else {
      this.router.navigate(['Home/QrCode']);
    }
    this.closeModal();
  }
}