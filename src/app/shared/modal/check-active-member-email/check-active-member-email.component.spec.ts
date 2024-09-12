import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckActiveMemberEmailComponent } from './check-active-member-email.component';

describe('CheckActiveMemberEmailComponent', () => {
  let component: CheckActiveMemberEmailComponent;
  let fixture: ComponentFixture<CheckActiveMemberEmailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckActiveMemberEmailComponent]
    });
    fixture = TestBed.createComponent(CheckActiveMemberEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
