import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePersonalInfoComponent } from './update-personal-info.component';

describe('UpdatePersonalInfoComponent', () => {
  let component: UpdatePersonalInfoComponent;
  let fixture: ComponentFixture<UpdatePersonalInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatePersonalInfoComponent]
    });
    fixture = TestBed.createComponent(UpdatePersonalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
