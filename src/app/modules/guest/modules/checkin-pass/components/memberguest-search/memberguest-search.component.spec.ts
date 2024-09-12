import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberguestSearchComponent } from './memberguest-search.component';

describe('MemberguestSearchComponent', () => {
  let component: MemberguestSearchComponent;
  let fixture: ComponentFixture<MemberguestSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MemberguestSearchComponent]
    });
    fixture = TestBed.createComponent(MemberguestSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
