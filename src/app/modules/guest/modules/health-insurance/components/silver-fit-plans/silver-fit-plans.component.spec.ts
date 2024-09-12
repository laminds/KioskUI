import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SilverFitPlansComponent } from './silver-fit-plans.component';

describe('SilverFitPlansComponent', () => {
  let component: SilverFitPlansComponent;
  let fixture: ComponentFixture<SilverFitPlansComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SilverFitPlansComponent]
    });
    fixture = TestBed.createComponent(SilverFitPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
