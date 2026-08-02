import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { UtilconversionsService } from './utilconversions.service';
import { ViajeService } from './viaje.service';

describe('ViajeService', () => {
  let service: ViajeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UtilconversionsService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ViajeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
