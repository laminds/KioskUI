import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './core/guard/auth-guard.service';
import { DashboardComponent } from './modules/home/components/dashboard/dashboard.component';
import { SearchComponent } from './shared/components/search/search.component';
import { NewUserComponent } from './shared/components/new-user/new-user.component';
import { PtPlanComponent } from './shared/components/pt-plan/pt-plan.component';
import { SignatureComponent } from './shared/components/signature/signature.component';
import { RegisterThankyouComponent } from './shared/components/register-thankyou/register-thankyou.component';
import { SmallGroupTrainingComponent } from './shared/components/small-group-training/small-group-training.component';
import { GuestInitialInfoComponent } from './shared/components/guest-initial-info/guest-initial-info.component';
import { CheckOutComponent } from './shared/components/check-out/check-out.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { MemberPlanComponent } from './shared/components/member-plan/member-plan.component';
import { MinorComponent } from './shared/components/minor/minor.component';
import { StaffComponent } from './shared/components/staff/staff.component';
import { SurveyComponent } from './shared/components/survey/survey.component';
import { TourGuideComponent } from './shared/components/tour-guide/tour-guide.component';
import { LogoutComponent } from './shared/components/logout/logout.component';
import { QrCheckoutComponent } from './shared/components/qr-checkout/qr-checkout.component';

const routes: Routes = [
  {
    path: 'Home', component: DashboardComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'ptplans', component: PtPlanComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: '', redirectTo: 'Home', pathMatch: 'full',
  },
  {
    path: 'Search', component: SearchComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'signature', component: SignatureComponent,
    canActivate: [AuthGuardService]
  },
  { 
    path: 'smallGroupTraining', component: SmallGroupTrainingComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'register', component: NewUserComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'thankyou', component: RegisterThankyouComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'plans', component: MemberPlanComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'guestInitialInfo', component: GuestInitialInfoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'checkout', component: CheckOutComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'minor', component: MinorComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'staff', component: StaffComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'survey',  component: SurveyComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'logout', component: LogoutComponent,
  },
  {
    path: 'survey/tourguide', component: TourGuideComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'notfound', component: NotFoundComponent
  },
  { path: 'member', loadChildren: () => import('./modules/member/member.module').then(m => m.MemberModule),
  canActivate: [AuthGuardService]
 },
  { path: 'guest', loadChildren: () => import('./modules/guest/guest.module').then(m => m.GuestModule),
  canActivate: [AuthGuardService] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
