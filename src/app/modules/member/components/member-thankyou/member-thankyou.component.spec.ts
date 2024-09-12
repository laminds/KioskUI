import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberThankyouComponent } from './member-thankyou.component';

describe('MemberThankyouComponent', () => {
  let component: MemberThankyouComponent;
  let fixture: ComponentFixture<MemberThankyouComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MemberThankyouComponent]
    });
    fixture = TestBed.createComponent(MemberThankyouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
