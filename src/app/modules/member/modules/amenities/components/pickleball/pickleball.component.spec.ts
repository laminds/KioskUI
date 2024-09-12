import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickleballComponent } from './pickleball.component';

describe('PickleballComponent', () => {
  let component: PickleballComponent;
  let fixture: ComponentFixture<PickleballComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PickleballComponent]
    });
    fixture = TestBed.createComponent(PickleballComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
