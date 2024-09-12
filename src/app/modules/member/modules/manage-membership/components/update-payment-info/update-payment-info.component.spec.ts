import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePaymentInfoComponent } from './update-payment-info.component';

describe('UpdatePaymentInfoComponent', () => {
  let component: UpdatePaymentInfoComponent;
  let fixture: ComponentFixture<UpdatePaymentInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatePaymentInfoComponent]
    });
    fixture = TestBed.createComponent(UpdatePaymentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
