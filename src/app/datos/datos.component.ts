import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DatosPasajeroComponent } from './datospasajero/datospasajero.component';
import { MetodopagoComponent } from './metodopago/metodopago.component';
import { ContactoemergenciaComponent } from './contactoemergencia/contactoemergencia.component';
import { DatosPasajero } from '../modelo/datospasajero';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { DatostarjetaComponent } from './datostarjeta/datostarjeta.component';
import { ConsultaViaje } from '../modelo/consultaViaje';
import { UtilconversionsService } from '../_services/utilconversions.service';
import { Constantes } from '../_services/constantes';
import { ValidacionesPropias } from '../validaciones/validacionespropias';
import { OfertaSeleccionada } from '../modelo/ofertaSeleccionada';

@Component({
  selector: 'app-datos',
  standalone: true,
  imports: [
    DatosPasajeroComponent,
    MetodopagoComponent,
    CommonModule,
    NgbProgressbarModule,
    ReactiveFormsModule,
  ],
  templateUrl: './datos.component.html',
  styleUrl: './datos.component.css',
})
export class DatosComponent implements OnInit, AfterViewInit {
  @ViewChild(DatosPasajeroComponent)
  datosPasajeroComponent!: DatosPasajeroComponent;

  @ViewChild(DatostarjetaComponent)
  datostarjetaComponent!: DatostarjetaComponent;

  @ViewChild(MetodopagoComponent) metodopagoComp!: MetodopagoComponent;

  @Input()
  datosCotizacionVuelo!: ConsultaViaje;

  @Input()
  ofertaSeleccionada!: OfertaSeleccionada;

  ventaForm!: FormGroup;

  totalPasajeros: number = 1;
  numeroPasajero: number = 1;
  tipoPasajero: String = 'A'; // A: Adulto, N: Niño, I: Infante

  totalAdultos!: number;
  totalNinos!: number;
  totalInfantes!: number;

  listaPasajeros: Array<{ tipo: string; numero: number }> = [];

  nombreOrigenIda: String = '';
  nombreDestinoIda: String = '';
  nombreOrigenVuelta: String = '';
  nombreDestinoVuelta: String = '';

  constructor(
    private _utilconversionsService: UtilconversionsService,
    private fb: FormBuilder
  ) {
    this.ventaForm = this.fb.group({
      listaPasajeros: this.fb.array([]),
      // Si tienes campos de pago aquí, agrégalos también
    });
  }

  ngOnInit(): void {
    this.ventaForm = this.fb.group({
      // FormArray para múltiples pasajeros
      listaPasajeros: this.fb.array([]),
      // Formulario para el método de pago
      metodoPago: this.fb.group({
        // Estos campos deben coincidir con los que espera MetodopagoComponent
        numeroTarjeta: ['', [Validators.required]],
        // ... otros campos
      }),
    });

    this.leeVariablesConsultaVuelo().then(() => {
      // 💡 Después de que los datos están cargados, llena el FormArray
      this.listaPasajeros.forEach((data) => {
        this.listaPasajerosArray.push(this.crearPasajeroFormGroup(data));
      });
    });

    this.inicializarDatosVuelo();
  }

  inicializarDatosVuelo(): void{
    console.log(this.ofertaSeleccionada);

    for (let tramo of this.ofertaSeleccionada.OfertaVuelo.listaRutaTramos){
      if (tramo.tipoViaje == 1){
        this.nombreOrigenIda = tramo.origen.nombreCiudad + ' (' + tramo.origen.codigoIata + ')';
        this.nombreDestinoIda = tramo.destino.nombreCiudad + ' (' + tramo.destino.codigoIata + ')';
      }
    }
  }

  inicializaFormulario(): void {
    this.ventaForm = this.fb.group({
      // Otros controles del formulario de venta pueden ir aquí
      listaPasajeros: this.fb.array([]),
    });
  }

  crearPasajeroFormGroup(data: { tipo: string }): FormGroup {
    // Usamos el FormBuilder (fb) para crear el FormGroup individual
    return this.fb.group({
      // 💡 Campo de datos: Usado para la lógica de validación dinámica en el hijo
      tipoPasajero: [data.tipo],

      // 1. Campos de texto y validación básica (required, email)
      nombres: ['', [Validators.required]],
      primerApellido: ['', [Validators.required]],
      segundoApellido: ['', [Validators.required]],
      correoElectronico: ['', [Validators.required, Validators.email]],
      numTelefonoContacto: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],

      // 2. Campos Select/Dropdown y validación con notZero()
      // Asumo que ValidacionesPropias.notZero() es un validador personalizado
      // que verifica que el valor no sea 0 (típico para 'Seleccione una opción')
      paisResidencia: [0, [Validators.required, ValidacionesPropias.notZero()]],
      tipoDocumento: [0, [Validators.required, ValidacionesPropias.notZero()]],
      codigoPaisTelefono: [
        0,
        [Validators.required, ValidacionesPropias.notZero()],
      ],
      tipoSexo: [0, [Validators.required, ValidacionesPropias.notZero()]],

      // 3. Número de Documento: Requiere ser llenado (validación dinámica se aplica en el hijo)
      numeroDocumento: ['', [Validators.required]],
      responsableAdulto: ['0']
    });
  }

  ngAfterViewInit(): void {
    this.leeVariablesConsultaVuelo();
    this.inicializarDatosVuelo();
  }

  async leeVariablesConsultaVuelo() {
    const numAdultos = await this._utilconversionsService.decryptData(
      this.datosCotizacionVuelo.Adultos
    );
    this.totalAdultos = this.datosCotizacionVuelo.Adultos
      ? parseInt(numAdultos)
      : 0;

    const numNinos = await this._utilconversionsService.decryptData(
      this.datosCotizacionVuelo.Ninos
    );
    this.totalNinos = this.datosCotizacionVuelo.Ninos ? parseInt(numNinos) : 0;

    const numInfantes = await this._utilconversionsService.decryptData(
      this.datosCotizacionVuelo.Infantes
    );
    this.totalInfantes = this.datosCotizacionVuelo.Infantes
      ? parseInt(numInfantes)
      : 0;

    const total = this.totalAdultos + this.totalNinos + this.totalInfantes;

    let valor = 0;
    let i = 0;
    while (valor < this.totalAdultos) {
      this.listaPasajeros[i] = {
        tipo: Constantes.TP_ADULTO,
        numero: valor + 1,
      };
      valor++;
      i++;
    }
    valor = 0;
    while (valor < this.totalNinos) {
      this.listaPasajeros[i] = { tipo: Constantes.TP_NINO, numero: valor + 1 };
      valor++;
      i++;
    }
    valor = 0;
    while (valor < this.totalInfantes) {
      this.listaPasajeros[i] = {
        tipo: Constantes.TP_INFANTE,
        numero: valor + 1,
      };
      valor++;
      i++;
    }
  }

  guardarDatosVenta() {
    if (this.ventaForm.valid) {
      console.log(
        '¡Todos los formularios de pasajeros son válidos!',
        this.ventaForm.value
      );
      // Lógica para guardar o enviar datos
    } else {
      this.ventaForm.markAllAsTouched();
      console.error('El formulario de venta contiene errores.', this.ventaForm);
    }
  }

  validarDatosFormulario(): boolean {
    var esValido = false;

    const form = this.metodopagoComp?.getTarjetaFormGroup();
    if (
      this.datosPasajeroComponent.pasajeroForm ||
      this.metodopagoComp?.getTarjetaFormGroup()
    ) {
      // Para Reactive Forms
      this.datosPasajeroComponent.pasajeroForm.markAllAsTouched();
      this.metodopagoComp?.getTarjetaFormGroup().markAllAsTouched();
    }
    esValido =
      this.datosPasajeroComponent.pasajeroForm.valid &&
      this.metodopagoComp?.getTarjetaFormGroup().valid;

    return esValido;
  }

  manejarDatosGuardados(datos: any) {
    console.log('Datos recibidos del hijo:', datos);
    // Aquí podrías procesar o guardar los datos
  }

  get listaPasajerosArray(): FormArray {
    return this.ventaForm.get('listaPasajeros') as FormArray;
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  generarDatosPasajeros(): void {
    // Siempre es buena práctica limpiar el FormArray antes de llenarlo
    this.listaPasajerosArray.clear();
    this.listaPasajeros.forEach((p) => {
      this.listaPasajerosArray.push(this.crearPasajeroFormGroup(p));
    });
  }
}
