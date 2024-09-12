import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PtPlanComponent } from './pt-plan.component';

describe('PtPlanComponent', () => {
  let component: PtPlanComponent;
  let fixture: ComponentFixture<PtPlanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PtPlanComponent]
    });
    fixture = TestBed.createComponent(PtPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
