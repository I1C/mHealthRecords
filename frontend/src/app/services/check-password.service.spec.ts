import { TestBed } from '@angular/core/testing';

import { CheckPasswordService } from './check-password.service';

describe('CheckPasswordService', () => {
  let service: CheckPasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckPasswordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
