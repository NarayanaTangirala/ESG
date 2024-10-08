import { TestBed } from '@angular/core/testing';

import { ESGDataService } from './esg-data.service';

describe('EsgDataService', () => {
  let service: ESGDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ESGDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
