import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinPassComponent } from './checkin-pass.component';

describe('CheckinPassComponent', () => {
  let component: CheckinPassComponent;
  let fixture: ComponentFixture<CheckinPassComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckinPassComponent]
    });
    fixture = TestBed.createComponent(CheckinPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
