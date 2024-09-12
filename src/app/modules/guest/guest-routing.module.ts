import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuestComponent } from './guest.component';
import { AuthGuardService } from 'src/app/core/guard/auth-guard.service';
import { JoinComponent } from './components/join/join.component';
import { ThankyouComponent } from './components/thankyou/thankyou.component';
import { ClassPassMemberComponent } from './components/class-pass-member/class-pass-member.component';

const routes: Routes = [
  { 
    path: '', 
    component: GuestComponent,
    canActivate: [AuthGuardService]
  },
  { 
    path: 'join', 
    component: JoinComponent,
    canActivate: [AuthGuardService]
  },
  { 
    path: 'classpass', 
    component: ClassPassMemberComponent,
    canActivate: [AuthGuardService]
  },
  // { 
  //   path: 'checkIn', 
  //   component: CheckInComponent,
  //   children: [
  //     {
  //       path: 'openhouse',
  //       component: OpenHouseComponent,
  //     },
  //   ],
  //   canActivate: [AuthGuardService]
  // },
  { 
    path: 'thankyou', 
    component: ThankyouComponent,
    canActivate: [AuthGuardService]
  },
  { path: 'health-insurance', loadChildren: () => import('./modules/health-insurance/health-insurance.module').then(m => m.HealthInsuranceModule) },
  { path: 'checkInPass', loadChildren: () => import('./modules/checkin-pass/checkin-pass.module').then(m => m.CheckinPassModule) }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule] 
})
export class GuestRoutingModule { }
