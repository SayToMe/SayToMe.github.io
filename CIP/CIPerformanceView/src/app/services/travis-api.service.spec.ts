import { TestBed, inject } from '@angular/core/testing';

import { TravisApiService } from './travis-api.service';

describe('TravisApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TravisApiService]
    });
  });

  it('should be created', inject([TravisApiService], (service: TravisApiService) => {
    expect(service).toBeTruthy();
  }));
});
