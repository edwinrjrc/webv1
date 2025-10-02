import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DatosPasajero } from '../../modelo/datospasajero';
import { CommonModule } from '@angular/common';
import { ValidacionesPropias } from '../../validaciones/validacionespropias';

@Component({
  selector: 'app-datospasajero',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './datospasajero.component.html',
  styleUrl: './datospasajero.component.css',
})
export class DatosPasajeroComponent implements OnInit {
  @Input() tipoPasajero!: String;

  @Output() formSubmit = new EventEmitter<any>();
  @Output() datosGuardados = new EventEmitter<any>();
  errorMensaje: string = '';

  pasajeroForm!: FormGroup;

  opcionesTipoDocumento = [
    { id: 0, nombre: 'Seleccione' }, // Valor 0, que quieres que sea inválido
    { id: 1, nombre: 'DNI' },
    { id: 2, nombre: 'Pasaporte' },
    { id: 3, nombre: 'Carné de Extranjería' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.pasajeroForm = this.fb.group({
      nombres: ['', [Validators.required]],
      primerApellido: new FormControl('', [Validators.required]),
      segundoApellido: new FormControl('', [Validators.required]),
      paisResidencia: new FormControl(0, [
        Validators.required,
        ValidacionesPropias.notZero(),
      ]),
      tipoDocumento: new FormControl(0, [
        Validators.required,
        ValidacionesPropias.notZero(),
      ]),
      numeroDocumento: new FormControl('', [Validators.required]),
      fechaNacimiento: new FormControl('', [Validators.required]),
      tipoSexo: new FormControl(0, [
        Validators.required,
        ValidacionesPropias.notZero(),
      ]),
      correoEletronico: new FormControl('', [Validators.required]),
      numTelefonoContacto: new FormControl('', [Validators.required]),
      codigoPaisTelefono: new FormControl('', [
        Validators.required,
        ValidacionesPropias.notZero(),
      ]),
    });
  }

  isRequired(controlName: string): boolean {
    const control = this.pasajeroForm.get(controlName);
    if (!control) {
      return false;
    }
    if (control.validator) {
      const validator = control.validator({} as AbstractControl);
      return validator && validator['required'];
    }
    return false;
  }

  getFormData() { 
    return this.pasajeroForm.value;
  }

  ngOnChanges() {
    this.errorMensaje = '';
  }

  isValid(): boolean {
    return this.pasajeroForm.valid;
  }

  onInputChange() {}
}
