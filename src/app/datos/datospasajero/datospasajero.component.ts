import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Optional,
  Output,
  SkipSelf,
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
export class DatosPasajeroComponent implements OnInit {
  @Input() tipoPasajero: string = ''; // Inicializado con string vacío
  @Input() numeroPasajero: number = 0;
  @Input() totalPasajeros!: number;

  tp_Adulto: String = Constantes.TP_ADULTO; // Adulto
  tp_Nino: String = Constantes.TP_NINO; // Niño
  tp_Infante: String = Constantes.TP_INFANTE; // Infante

  nombreTipoPasajero: String = '';

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

  varFormNombres = 'nombres';
  varFormprimerApellido = 'primerApellido';
  varFormsegundoApellido = 'segundoApellido';
  varFormpaisResidencia = 'paisResidencia';
  varFormtipoDocumento = 'tipoDocumento';
  varFormnumeroDocumento = 'numeroDocumento';
  varFormfechaNacimiento = 'fechaNacimiento';
  varFormtipoSexo = 'tipoSexo';
  varFormcorreoElectronico = 'correoElectronico';
  varFormnumTelefonoContacto = 'numTelefonoContacto';
  varFormcodigoPaisTelefono = 'codigoPaisTelefono';
  varFormRespAdulto = 'responsableAdulto';

  constructor(
    private fb: FormBuilder,
    private controlContainer: ControlContainer
  ) {}

  ngOnInit(): void {
    this.inicializaForm();

    if (this.tipoPasajero === this.tp_Adulto) {
      this.nombreTipoPasajero = 'Adulto';

      if (this.totalPasajeros > 0) {
        this.nombreTipoPasajero += ' ' + this.numeroPasajero;
      }
    } else if (this.tipoPasajero === this.tp_Nino) {
      this.nombreTipoPasajero = 'Niño';
      if (this.totalPasajeros > 0) {
        this.nombreTipoPasajero += ' ' + this.numeroPasajero;
      }
    } else if (this.tipoPasajero === this.tp_Infante) {
      this.nombreTipoPasajero = 'Infante';
      if (this.totalPasajeros > 0) {
        this.nombreTipoPasajero += ' ' + this.numeroPasajero;
      }
    }

    /*
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
      correoElectronico: new FormControl('', [Validators.required,Validators.email]),
      numTelefonoContacto: new FormControl('', [Validators.required]),
      codigoPaisTelefono: new FormControl(0, [
        Validators.required,
        ValidacionesPropias.notZero(),
      ]),
    });

    if (this.tipoPasajero === this.tp_Nino || this.tipoPasajero === this.tp_Infante) {
      this.pasajeroForm.addControl(this.varFormRespAdulto, new FormControl(0, [
        Validators.required,
        ValidacionesPropias.notZero(),
      ]));
    }

    this.pasajeroForm.updateValueAndValidity();*/
  }

  inicializaForm(): void {
    try{
      this.pasajeroForm = this.controlContainer.control as FormGroup;
    } catch (error) {
      console.error('Error al inicializar el formulario del pasajero:', error);
      console.error('this.pasajeroForm:', this.pasajeroForm);
      console.error('this.controlContainer:', this.controlContainer);
    }
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

  cargarTipoDocumento() {
    this.opcionesTipoDocumento = [
      { id: 0, nombre: 'Seleccione' }, // Valor 0, que quieres que sea inválido
      { id: 1, nombre: 'DNI' },
      { id: 2, nombre: 'Pasaporte' },
      { id: 3, nombre: 'Carné de Extranjería' },
    ];
  }
}
