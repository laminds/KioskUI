import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { SharedRoutingModule } from './shared-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LogoutComponent } from './components/logout/logout.component';
import { SearchComponent } from './components/search/search.component';
import { NewUserComponent } from './components/new-user/new-user.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CustomeSharedfilterPipe } from './pipes/custome-sharedfilter.pipe';
import { SignatureComponent } from './components/signature/signature.component';
import { RegisterThankyouComponent } from './components/register-thankyou/register-thankyou.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

import { PtPlanComponent } from './components/pt-plan/pt-plan.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SmallGroupTrainingComponent } from './components/small-group-training/small-group-training.component';
import { GuestInitialInfoComponent } from './components/guest-initial-info/guest-initial-info.component';
import { MemberPlanComponent } from './components/member-plan/member-plan.component';
import { CheckOutComponent } from './components/check-out/check-out.component';
import { SalesPersonMissingModalPopupComponent } from './modal/sales-person-missing-modal-popup/sales-person-missing-modal-popup.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RfcCheckModalComponent } from './modal/rfc-check-modal/rfc-check-modal.component';
import { ThankyouComponent } from '../modules/guest/components/thankyou/thankyou.component';
import { CreditCardDirectivesModule } from 'angular-cc-library';
import { CheckExistingEmailComponent } from './modal/check-existing-email/check-existing-email.component';
import { CheckActiveMemberEmailComponent } from './modal/check-active-member-email/check-active-member-email.component';
import { ExpiredPassPopupComponent } from './modal/expired-pass-popup/expired-pass-popup.component';
import { MinorComponent } from './components/minor/minor.component';
import { PassModalPopupComponent } from './modal/pass-modal-popup/pass-modal-popup.component';
import { NgxPlaidLinkModule } from 'ngx-plaid-link';
import { StaffComponent } from './components/staff/staff.component';
import { SortableHeaderDirective } from './directive/sortable-header.directive';
import { SurveyComponent } from './components/survey/survey.component';
import { NgxSliderModule } from 'ngx-slider-v2';
import { TourGuideComponent } from './components/tour-guide/tour-guide.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    LogoutComponent,
    SearchComponent,
    NewUserComponent,
    CustomeSharedfilterPipe,
    SignatureComponent,
    RegisterThankyouComponent,
    PtPlanComponent,
    SmallGroupTrainingComponent,
    MemberPlanComponent,
    GuestInitialInfoComponent,
    CheckOutComponent,
    SalesPersonMissingModalPopupComponent,
    NotFoundComponent,
    RfcCheckModalComponent,
    ThankyouComponent,
    CheckExistingEmailComponent,
    CheckActiveMemberEmailComponent,
    ExpiredPassPopupComponent,
    MinorComponent,
    PassModalPopupComponent,
    StaffComponent,
    SortableHeaderDirective,
    SurveyComponent,
    TourGuideComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    NgxMaskDirective, 
    NgxMaskPipe,
    NgbModule,
    TabsModule,
    BsDatepickerModule.forRoot(),
    CreditCardDirectivesModule,
    NgxPlaidLinkModule,
    DecimalPipe,
    NgxSliderModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    LogoutComponent,
    SearchComponent,
    NewUserComponent,
    SignatureComponent,
    RegisterThankyouComponent,
    CheckOutComponent,
    SignatureComponent
  ],
  providers: [
    provideNgxMask(),
    DecimalPipe
  ]
})
export class SharedModule { }
