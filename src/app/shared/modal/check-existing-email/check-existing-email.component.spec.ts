import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckExistingEmailComponent } from './check-existing-email.component';

describe('CheckExistingEmailComponent', () => {
  let component: CheckExistingEmailComponent;
  let fixture: ComponentFixture<CheckExistingEmailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckExistingEmailComponent]
    });
    fixture = TestBed.createComponent(CheckExistingEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
