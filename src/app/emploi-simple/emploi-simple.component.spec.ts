import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploiSimpleComponent } from './emploi-simple.component';

describe('EmploiSimpleComponent', () => {
  let component: EmploiSimpleComponent;
  let fixture: ComponentFixture<EmploiSimpleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmploiSimpleComponent]
    });
    fixture = TestBed.createComponent(EmploiSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
