import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterThankyouComponent } from './register-thankyou.component';

describe('RegisterThankyouComponent', () => {
  let component: RegisterThankyouComponent;
  let fixture: ComponentFixture<RegisterThankyouComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterThankyouComponent]
    });
    fixture = TestBed.createComponent(RegisterThankyouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
