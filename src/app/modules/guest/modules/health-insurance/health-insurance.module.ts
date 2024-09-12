import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HealthInsuranceRoutingModule } from './health-insurance-routing.module';
import { HealthInsuranceComponent } from './health-insurance.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { SilverFitPlansComponent } from './components/silver-fit-plans/silver-fit-plans.component';


@NgModule({
  declarations: [
    HealthInsuranceComponent,
    SilverFitPlansComponent
  ],
  imports: [
    CommonModule,
    HealthInsuranceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective, 
    NgxMaskPipe,
  ],
  exports: [
    HealthInsuranceComponent
  ]
})
export class HealthInsuranceModule { }
