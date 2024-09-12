import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallGroupTrainingComponent } from './small-group-training.component';

describe('SmallGroupTrainingComponent', () => {
  let component: SmallGroupTrainingComponent;
  let fixture: ComponentFixture<SmallGroupTrainingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SmallGroupTrainingComponent]
    });
    fixture = TestBed.createComponent(SmallGroupTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
