import { Component } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pass-modal-popup',
  templateUrl: './pass-modal-popup.component.html',
  styleUrls: ['./pass-modal-popup.component.css']
})
export class PassModalPopupComponent {
  RegObj : any
  
  constructor(
    private _commonService: CommonService,
    private modalService: NgbModal,
    private router : Router) {
      this.RegObj = JSON.parse(window.sessionStorage.getItem("RegisterObj") || "{}");
      this.RegObj.passDurationDay = this.RegObj.passDurationDay == null ? 1 : this.RegObj.passDurationDay;
  }

  closeModal() { 
    this.modalService.dismissAll();
  } 

  redirectToSignatureModule() {
   this.router.navigate(['signature']);
   this.closeModal();
  }
}
