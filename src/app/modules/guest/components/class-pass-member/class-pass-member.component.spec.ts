import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassPassMemberComponent } from './class-pass-member.component';

describe('ClassPassMemberComponent', () => {
  let component: ClassPassMemberComponent;
  let fixture: ComponentFixture<ClassPassMemberComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClassPassMemberComponent]
    });
    fixture = TestBed.createComponent(ClassPassMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
