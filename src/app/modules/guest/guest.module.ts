import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuestRoutingModule } from './guest-routing.module';
import { GuestComponent } from './guest.component';
import { JoinComponent } from './components/join/join.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { HealthInsuranceModule } from './modules/health-insurance/health-insurance.module';
import { ClassPassMemberComponent } from './components/class-pass-member/class-pass-member.component';


@NgModule({
  declarations: [
    GuestComponent,
    JoinComponent,
    ClassPassMemberComponent,
  ],
  imports: [
    CommonModule,
    GuestRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective, 
    NgxMaskPipe,
    HealthInsuranceModule
  ],
  exports:[
    GuestComponent
  ]
})
export class GuestModule { }
