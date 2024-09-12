import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassInformationComponent } from './pass-information.component';

describe('PassInformationComponent', () => {
  let component: PassInformationComponent;
  let fixture: ComponentFixture<PassInformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PassInformationComponent]
    });
    fixture = TestBed.createComponent(PassInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
