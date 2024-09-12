import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberPlanComponent } from './member-plan.component';

describe('MemberPlanComponent', () => {
  let component: MemberPlanComponent;
  let fixture: ComponentFixture<MemberPlanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MemberPlanComponent]
    });
    fixture = TestBed.createComponent(MemberPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
