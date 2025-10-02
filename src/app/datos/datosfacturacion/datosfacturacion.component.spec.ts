import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosfacturacionComponent } from './datosfacturacion.component';

describe('DatosfacturacionComponent', () => {
  let component: DatosfacturacionComponent;
  let fixture: ComponentFixture<DatosfacturacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosfacturacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatosfacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
