import { Component, Input } from '@angular/core';
import { LeadModel } from '../../models/searchModel';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-check-existing-email',
  templateUrl: './check-existing-email.component.html',
  styleUrls: ['./check-existing-email.component.css']
})
export class CheckExistingEmailComponent {
  @Input() checkEmailModelLeadObj !: any;
  @Input() yesThisIsMeText: any;

  constructor(
    private _commonService: CommonService) {
  }

  
  continueToRedirect(flag : boolean) {
    this._commonService.onNewUserComponentMethodClick(flag);
  }
}
