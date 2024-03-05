import { TestBed } from '@angular/core/testing';

import { AlumnosDataService } from './alumnos-data.service';

describe('AlumnosDataService', () => {
  let service: AlumnosDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlumnosDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
