import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnoListComponent } from './alumno-list.component';

describe('AlumnoListComponent', () => {
  let component: AlumnoListComponent;
  let fixture: ComponentFixture<AlumnoListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlumnoListComponent]
    });
    fixture = TestBed.createComponent(AlumnoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
