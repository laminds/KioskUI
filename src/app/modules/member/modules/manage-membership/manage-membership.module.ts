import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageMembershipRoutingModule } from './manage-membership-routing.module';
import { UpdatePersonalInfoComponent } from './components/update-personal-info/update-personal-info.component';
import { UpdatePaymentInfoComponent } from './components/update-payment-info/update-payment-info.component';
import { ManageMembershipComponent } from './manage-membership.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CreditCardDirectivesModule } from 'angular-cc-library';
import { CustomManageMembershipPipe } from './pipes/custom-manage-membership.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    UpdatePersonalInfoComponent,
    UpdatePaymentInfoComponent,
    ManageMembershipComponent,
    CustomManageMembershipPipe
  ],
  imports: [
    CommonModule,
    ManageMembershipRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    CreditCardDirectivesModule
  ],
  exports:[
    ManageMembershipComponent
  ]
})
export class ManageMembershipModule { }
