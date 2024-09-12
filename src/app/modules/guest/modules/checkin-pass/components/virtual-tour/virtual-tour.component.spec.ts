import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualTourComponent } from './virtual-tour.component';

describe('VirtualTourComponent', () => {
  let component: VirtualTourComponent;
  let fixture: ComponentFixture<VirtualTourComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VirtualTourComponent]
    });
    fixture = TestBed.createComponent(VirtualTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
