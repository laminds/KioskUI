import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassModalPopupComponent } from './pass-modal-popup.component';

describe('PassModalPopupComponent', () => {
  let component: PassModalPopupComponent;
  let fixture: ComponentFixture<PassModalPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PassModalPopupComponent]
    });
    fixture = TestBed.createComponent(PassModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
