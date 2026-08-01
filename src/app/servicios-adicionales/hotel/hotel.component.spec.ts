import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HotelComponent } from './hotel.component';
import { ReservaService } from '../../_services/reserva.service';

describe('HotelComponent', () => {
  let component: HotelComponent;
  let fixture: ComponentFixture<HotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelComponent],
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate'),
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
});
