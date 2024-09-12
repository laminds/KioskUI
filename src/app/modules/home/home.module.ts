import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { CustomHomeFilterPipe } from './pipes/custom-home-filter.pipe';


@NgModule({
  declarations: [
    DashboardComponent,
    CustomHomeFilterPipe
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule
  ],
  exports : [
    DashboardComponent,
  ]
})
export class HomeModule { }
