import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DirNumerosDirective } from '../../dir-numeros.directive';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import { ValidacionesPropias } from '../../validaciones/validacionespropias';
import { ReservaService } from '../../_services/reserva.service';
import { DatosCompraTotal } from '../../modelo/datoscompratotal';
import { DatosMetodoPago } from '../../modelo/datosmetodopago';

@Component({
  selector: 'app-datostarjeta',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './datostarjeta.component.html',
  styleUrl: './datostarjeta.component.css',
})
export class DatostarjetaComponent implements OnInit {
  @Input() datosTarjetaForm!: FormGroup;

  varFormNumTarjeta = 'numeroTarjeta';
  varFormVctoTarjeta = 'vctoTarjeta';
  varFormCodSegTarjeta = 'codigoSeguridadTarjeta';
  varFormCodTipoDocTitular = 'codigoTipoDocumentoTitular';
  varFormNumDocTitular = 'numeroDocumentoTitular';
  varFormNoTitular = 'nombreTitular';

  @Output() formSubmit = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private reservaService: ReservaService,
  ) {}

  ngOnInit(): void {
    if (!this.datosTarjetaForm || !this.datosTarjetaForm.get(this.varFormNumTarjeta)) {
      this.datosTarjetaForm = this.fb.group({
        [this.varFormNumTarjeta]: [
          '',
          [
            Validators.required,
            cardNumberValidator,
          ],
        ],
        [this.varFormVctoTarjeta]: [
          '',
          [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)],
        ],
        [this.varFormCodSegTarjeta]: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(4),
            Validators.pattern(/^[0-9]*$/),
          ],
        ],
        [this.varFormNoTitular]: ['', [Validators.required]],
      });
    }

    this.datosTarjetaForm.valueChanges.subscribe((valor) => {
      console.log('1. Hijo (Tarjeta) - Detectando cambios...'); // <-- LOG DE RASTREO

      if (this.datosTarjetaForm.valid) {
        const currentData =
          this.reservaService.getDatosReservaActual() || new DatosCompraTotal();
        const numLimpio = valor[this.varFormNumTarjeta]?.replace(/\s/g, '');

        console.log(
          '2. Hijo (Tarjeta) - Formulario Válido. Enviando al servicio.',
        );

        // Usamos <any> para que el compilador de Angular deje de dar vueltas con los nombres
        const infoPago: any = {
          numTarjeta: numLimpio,
          NumTarjeta: numLimpio,
          fechaExpiracion: valor[this.varFormVctoTarjeta],
          FechaExpiracion: valor[this.varFormVctoTarjeta],
          codigoSeguridad: valor[this.varFormCodSegTarjeta],
          CodigoSeguridad: valor[this.varFormCodSegTarjeta],
          nombreTitular: valor[this.varFormNoTitular],
          NombreTitular: valor[this.varFormNoTitular],
        };

        currentData.MetodoPago = infoPago;
        this.reservaService.actualizarDatosCompra(currentData);
      } else {
        console.warn('Hijo (Tarjeta) - Formulario incompleto o inválido aún');
      }
    });
  }

  isRequired(controlName: string): boolean {
    const control = this.datosTarjetaForm.get(controlName);
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
    return this.datosTarjetaForm.value;
  }

  onInputCardNumber(event: any) {
    // 1. Solo permitimos números
    let inputVal = event.target.value.replace(/\D/g, '');

    // 2. Limitamos a 16 dígitos
    inputVal = inputVal.substring(0, 16);

    // 3. Formateamos con espacios cada 4 dígitos
    const formattedVal = inputVal.match(/.{1,4}/g)?.join(' ') || '';

    // 4. Actualizamos el control y el valor visual del input
    this.datosTarjetaForm.get(this.varFormNumTarjeta)?.setValue(formattedVal);
    event.target.value = formattedVal;
  }

  onInputDigitsOnly(event: any, controlName: string, limit: number) {
    const value = event.target.value.replace(/\D/g, '').substring(0, limit);
    this.datosTarjetaForm.get(controlName)?.setValue(value);
    event.target.value = value;
  }

  // El método de vencimiento que mencionamos antes
  onInputExpiry(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.datosTarjetaForm.get(this.varFormVctoTarjeta)?.setValue(value);
    event.target.value = value;
  }

  validarFechaVencimiento(): boolean {
    const control = this.datosTarjetaForm.get(this.varFormVctoTarjeta);
    if (!control || !control.value || control.value.length < 5) return false;

    const [mes, anio] = control.value.split('/').map(Number);
    const ahora = new Date();
    const mesActual = ahora.getMonth() + 1;
    const anioActual = parseInt(ahora.getFullYear().toString().slice(-2)); // Tomamos los últimos 2 dígitos

    if (anio < anioActual || (anio === anioActual && mes < mesActual)) {
      control.setErrors({ expirada: true });
      return false;
    }
    return true;
  }
}

export function cardNumberValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const rawValue = control.value?.toString().replace(/\s/g, '') ?? '';
  if (!rawValue) {
    return null;
  }

  if (!/^[0-9]{16}$/.test(rawValue)) {
    return { invalidCardNumber: true, invalidLength: rawValue.length !== 16 };
  }

  return isValidLuhn(rawValue) ? null : { luhnInvalid: true };
}

export function luhnValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const value = control.value?.toString().replace(/\s/g, '');
  if (!value || value.length < 16) return null;
  return isValidLuhn(value) ? null : { luhnInvalid: true };
}

function isValidLuhn(value: string): boolean {
  let sum = 0;
  let shouldDouble = false;

  for (let i = value.length - 1; i >= 0; i--) {
    let digit = parseInt(value.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}
