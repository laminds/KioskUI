import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PickleballComponent } from './components/pickleball/pickleball.component';
import { BabysittingComponent } from './components/babysitting/babysitting.component';
import { AuthGuardService } from 'src/app/core/guard/auth-guard.service';
import { CheckoutComponent } from './components/babysitting/checkout/checkout.component';

const routes: Routes = [
  {
    path: 'amenities/pickleball',
    component: PickleballComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'amenities/babysitting',
    component: BabysittingComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'amenities/babysitting/checkout',
    component: CheckoutComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AmenitiesRoutingModule { }
