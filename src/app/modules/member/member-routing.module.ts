import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemberComponent } from './member.component';
import { AuthGuardService } from 'src/app/core/guard/auth-guard.service';
import { PtPlanComponent } from 'src/app/shared/components/pt-plan/pt-plan.component';
import { MemberThankyouComponent } from './components/member-thankyou/member-thankyou.component';
import { AmenitiesComponent } from './modules/amenities/amenities.component';
import { ManageMembershipComponent } from './modules/manage-membership/manage-membership.component';

const routes: Routes = [
  { 
    path: '', 
    component: MemberComponent,
    canActivate: [AuthGuardService]
    // loadChildren: () => import('./modules/membership/membership.module').then(m => m.MembershipModule) 
  },
  {
    path: 'ptplans',
    component: PtPlanComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'amenities',
    component: AmenitiesComponent,        
    loadChildren: () => import('./modules/amenities/amenities.module').then(m => m.AmenitiesModule) 
  },
  {
    path: 'manageMembership',
    component: ManageMembershipComponent,
    loadChildren: () => import('./modules/manage-membership/manage-membership.module').then(m => m.ManageMembershipModule ) 
  },
  {
    path: 'thankyou', component: MemberThankyouComponent,
    canActivate: [AuthGuardService]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule { }
 