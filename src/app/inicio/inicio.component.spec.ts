import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { InicioComponent } from './inicio.component';
import { AuthService } from '../_services/auth.service';
import { CatalogosService } from '../_services/catalogos.service';
import { ReservaService } from '../_services/reserva.service';
import { ViajeService } from '../_services/viaje.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

describe('InicioComponent', () => {
  let component: InicioComponent;
  let fixture: ComponentFixture<InicioComponent>;

  beforeEach(async () => {
    const catalogosServiceMock = {
      listarDestinos: jasmine.createSpy('listarDestinos').and.returnValue(
        of({ dataRpta: [] }),
      ),
    };
    const authServiceMock = {
      obtenerTokenAnonimo: jasmine
        .createSpy('obtenerTokenAnonimo')
        .and.returnValue(of({ token: 'test-token' })),
    };

    await TestBed.configureTestingModule({
      imports: [InicioComponent],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: CatalogosService, useValue: catalogosServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: ViajeService, useValue: {} },
        { provide: ReservaService, useValue: {} },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
        {
          provide: NgbModal,
          useValue: jasmine.createSpyObj('NgbModal', ['open']),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
