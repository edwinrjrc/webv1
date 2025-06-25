import { TestBed } from '@angular/core/testing';
import { UtilconversionsService } from './utilconversions.service';


describe('UtilconversionsService', () => {
  let service: UtilconversionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilconversionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
