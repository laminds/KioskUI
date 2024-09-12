import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredPassPopupComponent } from './expired-pass-popup.component';

describe('ExpiredPassPopupComponent', () => {
  let component: ExpiredPassPopupComponent;
  let fixture: ComponentFixture<ExpiredPassPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpiredPassPopupComponent]
    });
    fixture = TestBed.createComponent(ExpiredPassPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
