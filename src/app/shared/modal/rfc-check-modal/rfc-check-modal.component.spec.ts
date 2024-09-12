import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfcCheckModalComponent } from './rfc-check-modal.component';

describe('RfcCheckModalComponent', () => {
  let component: RfcCheckModalComponent;
  let fixture: ComponentFixture<RfcCheckModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RfcCheckModalComponent]
    });
    fixture = TestBed.createComponent(RfcCheckModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
