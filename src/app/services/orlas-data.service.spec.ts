import { TestBed } from '@angular/core/testing';

import { OrlasDataService } from './orlas-data.service';

describe('OrlasDataService', () => {
  let service: OrlasDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrlasDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
