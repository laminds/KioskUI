import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageMembershipComponent } from './manage-membership.component';
import { UpdatePersonalInfoComponent } from './components/update-personal-info/update-personal-info.component';
import { UpdatePaymentInfoComponent } from './components/update-payment-info/update-payment-info.component';

const routes: Routes = [
  // {
  //   path: 'member/manageMembership',
  //   component: ManageMembershipComponent
  // },
  {
    path: 'manageMembership/updatePersonalInfo',
    component: UpdatePersonalInfoComponent
  },
  {
    path: 'manageMembership/updatePaymentInfo',
    component: UpdatePaymentInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageMembershipRoutingModule { }
