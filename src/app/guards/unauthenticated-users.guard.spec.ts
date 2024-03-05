import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { unauthenticatedUsersGuard } from './unauthenticated-users.guard';

describe('unauthenticatedUsersGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => unauthenticatedUsersGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
