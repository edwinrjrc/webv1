import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { HotelComponent } from './hotel.component';
import { CatalogosService } from '../../_services/catalogos.service';
import { ReservaService } from '../../_services/reserva.service';

describe('HotelComponent', () => {
  let component: HotelComponent;
  let fixture: ComponentFixture<HotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelComponent, HttpClientTestingModule],
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate'),
          },
        },
        {
          provide: CatalogosService,
          useValue: {
            buscarHoteles: (request: any) => ({
              subscribe: (handlers: any) => {
                const hoteles = request?.destino?.toLowerCase().includes('costa')
                  ? [{
                      id: 'hotel-1',
                      nombre: 'Hotel Costa Azul',
                      categoria: '4★',
                      precioPorNoche: 180,
                      ubicacion: 'Lima',
                      descripcion: 'Hotel cercano al centro.',
                      capacidad: 4,
                      rating: 4.8,
                    }]
                  : [];
                handlers.next({ data: hoteles });
              },
            }),
            reservarHotel: () => ({ subscribe: (handlers: any) => handlers.next({ data: { codigoReserva: 'ABC123' } }) }),
          },
        },
        {
          provide: ReservaService,
          useValue: {
            getOfertaActual: () => null,
            getReservaHotel: () => null,
            setReservaHotel: jasmine.createSpy('setReservaHotel'),
            getServiciosSeleccionados: () => [],
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render available hotels after searching', () => {
    component.hotelForm.get('nombreHotel')?.setValue('Costa');
    component.buscarHoteles();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Hotel Costa Azul');
  });

  it('should continue the flow without blocking when no hotel is selected in the form', () => {
    spyOn(component, 'navegarAlSiguiente');

    component.hotelForm.patchValue({
      fechaLlegada: '2026-08-25',
      noches: 2,
      adultos: 2,
      tipoHabitacion: 'Doble',
      fechaCheckIn: '2026-08-25',
      fechaCheckOut: '2026-08-27',
    });

    component.hotelSeleccionado = null;

    component.guardar();

    expect(component.mensajeBusqueda).not.toBe('Selecciona un hotel de la lista para continuar.');
    expect(component.navegarAlSiguiente).toHaveBeenCalled();
  });
});
