import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sales-person-missing-modal-popup',
  templateUrl: './sales-person-missing-modal-popup.component.html',
  styleUrls: ['./sales-person-missing-modal-popup.component.css']
})
export class SalesPersonMissingModalPopupComponent {
  constructor(public activeModal: NgbActiveModal) { }
  closePopupModal() {
    this.activeModal.dismiss();
  }
}
