import { TestBed, inject } from '@angular/core/testing';

import { AppVeyorApiService } from './app-veyor-api.service';

describe('AppVeyorApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppVeyorApiService]
    });
  });

  it('should be created', inject([AppVeyorApiService], (service: AppVeyorApiService) => {
    expect(service).toBeTruthy();
  }));
});
