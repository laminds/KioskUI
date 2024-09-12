import { Component, Input } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-check-active-member-email',
  templateUrl: './check-active-member-email.component.html',
  styleUrls: ['./check-active-member-email.component.css']
})
export class CheckActiveMemberEmailComponent {
  @Input() emailObj !: any;

  constructor(
    private _commonService: CommonService,
    private modalService: NgbModal,) {
  }

  
  closeModalPopup() { 
    this.modalService.dismissAll();
  }
}
