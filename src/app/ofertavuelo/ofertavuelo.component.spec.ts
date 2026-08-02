import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertavueloComponent } from './ofertavuelo.component';

describe('OfertavueloComponent', () => {
  let component: OfertavueloComponent;
  let fixture: ComponentFixture<OfertavueloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfertavueloComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OfertavueloComponent);
    component = fixture.componentInstance;
    component.ofertaEncontrada = {
      id: 1,
      listaRutaTramos: [],
      precioOfertaDto: {
        precioUnitarioClase: 0,
        cantidadAdultos: 1,
        totalPrecioAdultos: 0,
        totalImptosCargos: 0,
        totalRuta: 0,
      },
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
