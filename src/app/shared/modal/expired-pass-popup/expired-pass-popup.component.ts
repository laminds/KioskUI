import { Component } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expired-pass-popup',
  templateUrl: './expired-pass-popup.component.html',
  styleUrls: ['./expired-pass-popup.component.css']
})
export class ExpiredPassPopupComponent {

  constructor(
    private _commonService: CommonService,
    private modalService: NgbModal,
    private router : Router) {
  }

  redirectToJoin(){
    this.closeModal();
    this.router.navigate(['/guest/join']);
  }

  redirectToBuyPass(){
    this.closeModal();
    window.sessionStorage.setItem("SourceName", "buypass");
    this.router.navigate(['signature']);
  }
  
  closeModal() { 
    this.modalService.dismissAll();
  } 
}
