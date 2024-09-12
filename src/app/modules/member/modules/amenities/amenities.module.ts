import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AmenitiesRoutingModule } from './amenities-routing.module';
import { AmenitiesComponent } from './amenities.component';
import { PickleballComponent } from './components/pickleball/pickleball.component';
import { BabysittingComponent } from './components/babysitting/babysitting.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CustomMemberFilterPipe } from '../../pipes/custom-member-filter.pipe';
import { CheckoutComponent } from './components/babysitting/checkout/checkout.component';


@NgModule({
  declarations: [
    AmenitiesComponent,
    PickleballComponent,
    BabysittingComponent,
    CustomMemberFilterPipe,
    CheckoutComponent
  ],
  imports: [
    CommonModule,
    AmenitiesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot()

  ],
  exports:[
    AmenitiesComponent
  ]
})
export class AmenitiesModule { }
