import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckinPassRoutingModule } from './checkin-pass-routing.module';
import { RouterModule } from '@angular/router';
import { CheckinPassComponent } from './checkin-pass.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { PassInformationComponent } from './components/pass-information/pass-information.component';
import { MemberguestSearchComponent } from './components/memberguest-search/memberguest-search.component';
import { VirtualTourComponent } from './components/virtual-tour/virtual-tour.component';


@NgModule({
  declarations: [
    CheckinPassComponent,
    PassInformationComponent,
    MemberguestSearchComponent,
    VirtualTourComponent,
  ],
  imports: [
    CommonModule,
    CheckinPassRoutingModule,
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    NgxMaskDirective, 
    NgxMaskPipe,
  ],
  exports: [
    PassInformationComponent,
    CheckinPassComponent
  ]
})
export class CheckinPassModule { }
