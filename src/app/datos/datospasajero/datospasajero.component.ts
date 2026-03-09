import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Optional,
  Output,
  SkipSelf,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidacionesPropias } from '../../validaciones/validacionespropias';
import { Constantes } from '../../_services/constantes';

@Component({
  selector: 'app-datospasajero',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './datospasajero.component.html',
  styleUrl: './datospasajero.component.css',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (container: ControlContainer) => container,
      deps: [[new Optional(), new SkipSelf(), ControlContainer]],
    },
  ],
})
export class DatosPasajeroComponent implements OnInit, OnChanges {
  @Input() tipoPasajero: string = '';
  @Input() numeroPasajero: number = 0;
  @Input() totalPasajeros!: number;

  @Output() datosEnviados = new EventEmitter<any>();

  tp_Adulto: String = Constantes.TP_ADULTO;
  tp_Nino: String = Constantes.TP_NINO;
  tp_Infante: String = Constantes.TP_INFANTE;

  pasajeroForm!: FormGroup;
  errorMensaje: string = '';

  varFormNombres = 'nombres';
  varFormprimerApellido = 'primerApellido';
  varFormsegundoApellido = 'segundoApellido';
  varFormtipoDocumento = 'tipoDocumento';
  varFormnumeroDocumento = 'numeroDocumento';
  varFormfechaNacimiento = 'fechaNacimiento';
  varFormtipoSexo = 'tipoSexo';
  varFormemailContacto = 'correoElectronico';
  varFormnumTelefonoContacto = 'numTelefonoContacto';
  varFormRespAdulto = 'responsableAdulto';

  constructor(private controlContainer: ControlContainer) {}

  ngOnInit(): void {
    this.inicializaForm();
    this.configurarValidacionesDinamicas();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.errorMensaje = '';
    if (this.pasajeroForm) {
      this.configurarValidacionesDinamicas();
    }
  }

  private configurarValidacionesDinamicas(): void {
    const respControl = this.pasajeroForm.get(this.varFormRespAdulto);
    if (this.tipoPasajero !== this.tp_Adulto && respControl) {
      respControl.setValidators([
        Validators.required,
        ValidacionesPropias.notZero(),
      ]);
    } else {
      respControl?.clearValidators();
    }
    respControl?.updateValueAndValidity();
  }

  inicializaForm(): void {
    try {
      this.pasajeroForm = this.controlContainer.control as FormGroup;
    } catch (error) {
      console.error('Error al inicializar el formulario del pasajero:', error);
    }
  }

  isRequired(controlName: string): boolean {
    const control = this.pasajeroForm?.get(controlName);
    if (!control) return false;
    if (control.validator) {
      const validator = control.validator({} as AbstractControl);
      return validator && validator['required'];
    }
    return false;
  }

  getFormData() {
    return this.pasajeroForm.value;
  }

  isValid(): boolean {
    return this.pasajeroForm.valid;
  }

  onInputChange(): void {
    if (this.pasajeroForm.valid) {
      this.datosEnviados.emit(this.pasajeroForm.value);
    }
  }
}