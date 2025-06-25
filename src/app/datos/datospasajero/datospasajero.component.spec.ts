import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosPasajeroComponent } from './datospasajero.component';

describe('DatoadultoComponent', () => {
  let component: DatosPasajeroComponent;
  let fixture: ComponentFixture<DatosPasajeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosPasajeroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatosPasajeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
