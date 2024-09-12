import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmenitiesComponent } from './amenities.component';

describe('AmenitiesComponent', () => {
  let component: AmenitiesComponent;
  let fixture: ComponentFixture<AmenitiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AmenitiesComponent]
    });
    fixture = TestBed.createComponent(AmenitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
