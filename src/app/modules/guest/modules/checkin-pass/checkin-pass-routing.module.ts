import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckinPassComponent } from './checkin-pass.component';
import { PassInformationComponent } from './components/pass-information/pass-information.component';
import { MemberguestSearchComponent } from './components/memberguest-search/memberguest-search.component';
import { VirtualTourComponent } from './components/virtual-tour/virtual-tour.component';

const routes: Routes = [
  { path: '', component: CheckinPassComponent },
  { path: 'passinfo', component: PassInformationComponent},
  { path: 'memberGuest', component: MemberguestSearchComponent},
  { path: 'virtualTour', component: VirtualTourComponent}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckinPassRoutingModule { }
