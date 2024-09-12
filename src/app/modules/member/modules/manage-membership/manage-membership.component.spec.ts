import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMembershipComponent } from './manage-membership.component';

describe('ManageMembershipComponent', () => {
  let component: ManageMembershipComponent;
  let fixture: ComponentFixture<ManageMembershipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageMembershipComponent]
    });
    fixture = TestBed.createComponent(ManageMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
