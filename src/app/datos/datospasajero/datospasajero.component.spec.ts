import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';

import { DatosPasajeroComponent } from './datospasajero.component';

describe('DatoadultoComponent', () => {
  let component: DatosPasajeroComponent;
  let fixture: ComponentFixture<DatosPasajeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosPasajeroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosPasajeroComponent);
    component = fixture.componentInstance;
    component.pasajeroForm = new FormGroup({
      primerNombre: new FormControl(''),
      primerApellido: new FormControl(''),
      segundoApellido: new FormControl(''),
      fechaNacimiento: new FormControl(''),
      tipoSexo: new FormControl(''),
      tipoDocumento: new FormControl(''),
      numeroDocumento: new FormControl(''),
      fechaExpiracionDoc: new FormControl(''),
      nacionalidad: new FormControl(''),
      requiereAsistencia: new FormControl(false),
      responsableAdulto: new FormControl(''),
      correoElectronico: new FormControl(''),
      numTelefonoContacto: new FormControl(''),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
