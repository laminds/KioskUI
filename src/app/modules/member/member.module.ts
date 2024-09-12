import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberRoutingModule } from './member-routing.module';
import { MemberComponent } from './member.component';
import { AmenitiesModule } from './modules/amenities/amenities.module';
import { ManageMembershipModule } from './modules/manage-membership/manage-membership.module';
import { MemberThankyouComponent } from './components/member-thankyou/member-thankyou.component';

@NgModule({
  declarations: [
    MemberComponent,
    MemberThankyouComponent
  ],
  imports: [
    CommonModule,
    MemberRoutingModule,
    AmenitiesModule,
    ManageMembershipModule,
  ]
})
export class MemberModule { }
