import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { InicioComponent } from './inicio.component';

describe('InicioComponent', () => {
  let component: InicioComponent;
  let fixture: ComponentFixture<InicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InicioComponent,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate') },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: { get: () => null },
            },
          },
        },
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter offers by max price and direct flights', () => {
    component.vuelosEncontradosOriginal = {
      ofertasEncontradas: [
        {
          id: 1,
          precioOfertaDto: { totalRuta: 1200 },
          listaRutaTramos: [
            {
              horariosRuta: [{ inEscalas: 0 }]
            }
          ]
        },
        {
          id: 2,
          precioOfertaDto: { totalRuta: 1800 },
          listaRutaTramos: [
            {
              horariosRuta: [{ inEscalas: 1 }]
            }
          ]
        }
      ]
    } as any;

    component.vuelosEncontrados = {
      ...component.vuelosEncontradosOriginal,
      ofertasEncontradas: component.vuelosEncontradosOriginal.ofertasEncontradas
    } as any;
    component.precioMaximo = 1500;
    component.soloDirectos = true;
    component.conEscalas = false;

    component.aplicarFiltros();

    expect(component.vuelosEncontrados.ofertasEncontradas.length).toBe(1);
    expect(component.vuelosEncontrados.ofertasEncontradas[0].id).toBe(1);
  });
});
