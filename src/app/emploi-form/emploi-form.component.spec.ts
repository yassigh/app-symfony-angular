import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploiFormComponent } from './emploi-form.component';

describe('EmploiFormComponent', () => {
  let component: EmploiFormComponent;
  let fixture: ComponentFixture<EmploiFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmploiFormComponent]
    });
    fixture = TestBed.createComponent(EmploiFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
