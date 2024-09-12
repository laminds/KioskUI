import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HealthInsuranceComponent } from './health-insurance.component';
import { SilverFitPlansComponent } from './components/silver-fit-plans/silver-fit-plans.component';

const routes: Routes = [
  { path: '', component: HealthInsuranceComponent },
  { path: 'silverPlan', component: SilverFitPlansComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HealthInsuranceRoutingModule { }
