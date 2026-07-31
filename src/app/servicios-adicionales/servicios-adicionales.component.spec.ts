import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiciosAdicionalesComponent } from './servicios-adicionales.component';
import { ReservaService } from '../_services/reserva.service';

describe('ServiciosAdicionalesComponent', () => {
  let component: ServiciosAdicionalesComponent;
  let fixture: ComponentFixture<ServiciosAdicionalesComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let reservaServiceSpy: jasmine.SpyObj<ReservaService>;
  let modalSpy: jasmine.SpyObj<NgbActiveModal>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy.navigate.and.resolveTo(true);
    reservaServiceSpy = jasmine.createSpyObj('ReservaService', [
      'setServiciosSeleccionados',
    ]);
    modalSpy = jasmine.createSpyObj('NgbActiveModal', ['close']);

    await TestBed.configureTestingModule({
      imports: [ServiciosAdicionalesComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ReservaService, useValue: reservaServiceSpy },
        { provide: NgbActiveModal, useValue: modalSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiciosAdicionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe cerrar el modal y navegar al primer servicio seleccionado al continuar', () => {
    component.servicios.hotel = true;
    component.servicios.traslado = true;

    component.continuar();

    expect(reservaServiceSpy.setServiciosSeleccionados).toHaveBeenCalledWith([
      'hotel',
      'traslado',
    ]);
    expect(modalSpy.close).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/reserva/servicios', 'hotel']);
    expect(modalSpy.close).toHaveBeenCalledBefore(routerSpy.navigate);
  });

  it('debe cerrar el modal e ir a pago cuando no hay servicios seleccionados', () => {
    component.continuar();

    expect(reservaServiceSpy.setServiciosSeleccionados).toHaveBeenCalledWith([]);
    expect(modalSpy.close).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/reserva/pago']);
    expect(modalSpy.close).toHaveBeenCalledBefore(routerSpy.navigate);
  });

  it('debe cerrar el modal e ir a pago al saltar', () => {
    component.servicios.hotel = true;

    component.saltar();

    expect(reservaServiceSpy.setServiciosSeleccionados).toHaveBeenCalledWith([]);
    expect(modalSpy.close).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/reserva/pago']);
    expect(modalSpy.close).toHaveBeenCalledBefore(routerSpy.navigate);
  });
});
