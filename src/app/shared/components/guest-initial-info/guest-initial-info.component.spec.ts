import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestInitialInfoComponent } from './guest-initial-info.component';

describe('GuestInitialInfoComponent', () => {
  let component: GuestInitialInfoComponent;
  let fixture: ComponentFixture<GuestInitialInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GuestInitialInfoComponent]
    });
    fixture = TestBed.createComponent(GuestInitialInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
