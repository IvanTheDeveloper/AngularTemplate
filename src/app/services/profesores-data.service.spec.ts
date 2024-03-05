import { TestBed } from '@angular/core/testing';

import { ProfesoresDataService } from './profesores-data.service';

describe('ProfesoresDataService', () => {
  let service: ProfesoresDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfesoresDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
