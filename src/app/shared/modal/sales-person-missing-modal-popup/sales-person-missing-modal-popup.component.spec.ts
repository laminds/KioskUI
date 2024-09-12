import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesPersonMissingModalPopupComponent } from './sales-person-missing-modal-popup.component';

describe('SalesPersonMissingModalPopupComponent', () => {
  let component: SalesPersonMissingModalPopupComponent;
  let fixture: ComponentFixture<SalesPersonMissingModalPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesPersonMissingModalPopupComponent]
    });
    fixture = TestBed.createComponent(SalesPersonMissingModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
