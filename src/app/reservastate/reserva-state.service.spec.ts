import { TestBed } from '@angular/core/testing';

import { ReservaStateService } from './reserva-state.service';

describe('ReservaStateService', () => {
  let service: ReservaStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservaStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
