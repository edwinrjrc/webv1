import {
  Component,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { ReservaService } from '../_services/reserva.service';
import { combineLatest } from 'rxjs';
import { Constantes } from '../_services/constantes';
import { ValidacionesPropias } from '../validaciones/validacionespropias';
import { DatosMetodoPago } from '../modelo/datosmetodopago';
import {
  cardNumberValidator,
  luhnValidator,
} from './datostarjeta/datostarjeta.component';

// IMPORTANTE: Importamos el componente hijo aquí
import { DatosPasajeroComponent } from './datospasajero/datospasajero.component';
import { DatosCompraTotal } from '../modelo/datoscompratotal';
import { DatosPasajero } from '../modelo/datospasajero';

@Component({
  selector: 'app-datos',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    ReactiveFormsModule,
    NgbProgressbarModule,
    DatosPasajeroComponent, // <--- ESTO ES LO QUE FALTABA PARA QUITAR EL ERROR NG8001
  ],
  templateUrl: './datos.component.html',
  styleUrl: './datos.component.css',
})
export class DatosComponent implements OnInit {
  ventaForm: FormGroup;
  metodoPagoForm: FormGroup;
  ofertaSeleccionada: any;
  consultaViaje: any;
  listaPasajeros: any[] = [];
  totalPasajeros: number = 0;

  constructor(
    public router: Router,
    private fb: FormBuilder,
    private reservaService: ReservaService,
    private cd: ChangeDetectorRef,
  ) {
    this.metodoPagoForm = this.fb.group({
      numeroTarjeta: [
        '',
        [
          Validators.required,
          cardNumberValidator,
        ],
      ],
      nombreTitular: ['', [Validators.required]],
      vctoTarjeta: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/),
        ],
      ],
      codigoSeguridadTarjeta: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(4),
          Validators.pattern(/^[0-9]*$/),
        ],
      ],
    });

    this.ventaForm = this.fb.group({
      listaPasajeros: this.fb.array([]),
      metodoPago: this.metodoPagoForm,
    });

    this.reservaService.setMetodoPagoForm(this.metodoPagoForm);
  }

  ngOnInit() {
    combineLatest([
      this.reservaService.datosBusqueda$,
      this.reservaService.ofertaActual$,
    ]).subscribe(([consulta, oferta]) => {
      if (consulta && oferta) {
        this.consultaViaje = consulta;
        this.ofertaSeleccionada = oferta;

        // CRITICO: Solo generamos pasajeros si el array está vacío.
        // Si el usuario vuelve de "Pago", el array ya tendrá datos y NO se borrarán.
        if (this.listaPasajerosArray.length === 0) {
          this.generarFormularioPasajeros();
        }
      }
    });
  }

  generarFormularioPasajeros() {
    const pasajerosArr = this.ventaForm.get('listaPasajeros') as FormArray;
    pasajerosArr.clear();

    const a = Number(this.consultaViaje.adultos || 0);
    const n = Number(this.consultaViaje.ninos || 0);
    const i = Number(this.consultaViaje.infantes || 0);

    const agregar = (cant: number, tipo: string) => {
      for (let x = 0; x < cant; x++) {
        const esPrimero = this.listaPasajeros.length === 0;
        this.listaPasajeros.push({ tipo, numero: x + 1 });

        pasajerosArr.push(
          this.fb.group({
            tipoPasajero: [tipo],
            primerNombre: ['', Validators.required],
            primerApellido: ['', Validators.required],
            segundoApellido: [''],
            tipoDocumento: [
              '0',
              [Validators.required, ValidacionesPropias.notZero()],
            ],
            numeroDocumento: ['', Validators.required],
            fechaNacimiento: ['', Validators.required],
            tipoSexo: ['0', Validators.required],
            fechaExpiracionDoc: ['', Validators.required],
            nacionalidad: ['PE'],
            requiereAsistencia: [false],
            responsableAdulto: ['0'],
            // Validaciones condicionales solo para el primer pasajero
            correoElectronico: esPrimero
              ? ['', [Validators.required, Validators.email]]
              : [null],
            numTelefonoContacto: esPrimero ? ['', Validators.required] : [null],
          }),
        );
      }
    };

    agregar(a, 'A');
    agregar(n, 'N');
    agregar(i, 'I');
    this.cd.detectChanges();
  }

  get listaPasajerosArray() {
    return this.ventaForm.get('listaPasajeros') as FormArray;
  }

  asFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  get progresoActual(): number {
    const url = this.router.url;
    if (url.includes('pago')) return 90;
    if (url.includes('resumen-servicios')) return 80;
    if (url.includes('servicios')) return 65;
    return 45;
  }

  get tituloActual(): string {
    const url = this.router.url;
    if (url.includes('pago')) return 'Finaliza tu Reserva';
    if (url.includes('resumen-servicios')) return 'Resumen de Servicios';
    if (url.includes('servicios/')) return 'Datos del Servicio';
    if (url.includes('servicios')) return 'Servicios Adicionales';
    return 'Datos de los Pasajeros';
  }

  get totalConServicios(): number {
    const base = this.ofertaSeleccionada?.precioOfertaDto?.totalRuta || 0;
    return base + this.reservaService.calcularTotalServicios();
  }

  get totalServiciosExtra(): number {
    return this.reservaService.calcularTotalServicios();
  }

  get hayServiciosAdicionales(): boolean {
    return this.reservaService.calcularTotalServicios() > 0;
  }

  get resumenServicios() {
    return this.reservaService.getResumenServicios();
  }

  irAServiciosAdicionales() {
    this.router.navigate(['/reserva/servicios']);
  }

  /*realizarCompra() {
    if (this.ventaForm.valid) {
      const rawData = this.ventaForm.value;
      let datosCompraTotal: DatosCompraTotal = new DatosCompraTotal();
      let listaTotalPasajeros: DatosPasajero[] = [];

      // 1. Mapeo de Pasajeros (Se mantiene igual, solo asegúrate de los nombres)
      for (let i = 0; i < rawData.listaPasajeros.length; i++) {
        let datosPasajero: DatosPasajero = new DatosPasajero();
        const p = rawData.listaPasajeros[i];

        datosPasajero.TipoPasajero = p.tipoPasajero;
        datosPasajero.Nombres = p.primerNombre;
        datosPasajero.PrimerApellido = p.primerApellido;
        datosPasajero.SegundoApellido = p.segundoApellido;
        datosPasajero.TipoDocumento = p.tipoDocumento;
        datosPasajero.NumeroDocumento = p.numeroDocumento;
        datosPasajero.FechaNacimiento = p.fechaNacimiento;
        datosPasajero.Sexo = p.tipoSexo;
        datosPasajero.CorreoElectronico = p.correoElectronico;
        datosPasajero.NumeroTelefono = p.numTelefonoContacto;
        datosPasajero.RequiereAsistencia = p.requiereAsistencia;

        listaTotalPasajeros.push(datosPasajero);
      }

      datosCompraTotal.Pasajeros = listaTotalPasajeros;

      // 2. CORRECCIÓN DEL MÉTODO DE PAGO
      // Usamos los nombres reales de 'datostarjeta.component.ts'
      let varMetodoPago: DatosMetodoPago = new DatosMetodoPago();
      const pago = rawData.metodoPago;

      // Quitamos espacios del número de tarjeta antes de guardar
      varMetodoPago.NumTarjeta = pago.numeroTarjeta?.replace(/\s/g, '');

      // En tu componente la fecha viene completa como "MM/YY" en 'vctoTarjeta'
      varMetodoPago.FechaExpiracion = pago.vctoTarjeta;

      // El nombre del campo en tu TS es 'codigoSeguridadTarjeta'
      varMetodoPago.CodigoSeguridad = pago.codigoSeguridadTarjeta;

      datosCompraTotal.MetodoPago = varMetodoPago;

      // 3. PERSISTENCIA
      sessionStorage.setItem(
        'reserva_temporal',
        JSON.stringify(datosCompraTotal),
      );
      console.log('OBJETO FINAL PARA SERVICIO:', datosCompraTotal);

      // 4. GUARDAR Y PROCESAR
      this.reservaService.actualizarDatosCompra(datosCompraTotal);

      // Aquí podrías llamar a tu API de Java
      // this.reservaService.finalizarVenta(datosCompraTotal).subscribe(...)
    } else {
      this.ventaForm.markAllAsTouched();
      alert('Faltan datos obligatorios. Revisa los campos marcados en rojo.');
      return;
    }

    const datosCompletos = this.reservaService.getDatosReservaActual();

    if (this.ventaForm.valid && datosCompletos?.MetodoPago) {
      console.log('Enviando a Java:', datosCompletos);
      // Aquí invocas tu API de Spring Boot
    } else {
      this.ventaForm.markAllAsTouched();
      alert('Revisa los datos de los pasajeros y de tu tarjeta.');
    }
  }*/

  realizarCompra() {
    console.log('0️⃣ CLICK: Iniciando proceso de compra...');

    // 1. IMPORTANTE: Extraer lo que el servicio ya tiene (lo que vimos en tus logs)
    const datosDesdeServicio = this.reservaService.getDatosReservaActual();

    const datosTarjeta =
      this.reservaService.getDatosReservaActual()?.MetodoPago;

    if (datosTarjeta) {
      // Le llenamos los datos al formulario padre para que se vuelva "VALID"
      this.ventaForm.get('metodoPago')?.patchValue({
        numeroTarjeta: datosTarjeta.NumTarjeta,
        vctoTarjeta: datosTarjeta.FechaExpiracion,
        codigoSeguridadTarjeta: datosTarjeta.CodigoSeguridad,
        nombreTitular: datosTarjeta.NombreTitular, // Asegúrate de que este campo exista en tu modelo
      });
    }
    const pagoExtraido =
      datosDesdeServicio?.MetodoPago || (datosDesdeServicio as any)?.metodoPago;

    // 2. Verificamos que existan los pasajeros y la tarjeta
    if (this.ventaForm.valid && pagoExtraido) {
      const rawData = this.ventaForm.value;
      const datosCompraTotal = new DatosCompraTotal();

      let listaTotalPasajeros: DatosPasajero[] = [];

      // 1. Mapeo de Pasajeros (Se mantiene igual, solo asegúrate de los nombres)
      for (let i = 0; i < rawData.listaPasajeros.length; i++) {
        let datosPasajero: DatosPasajero = new DatosPasajero();
        const p = rawData.listaPasajeros[i];

        datosPasajero.TipoPasajero = p.tipoPasajero;
        datosPasajero.Nombres = p.primerNombre;
        datosPasajero.PrimerApellido = p.primerApellido;
        datosPasajero.SegundoApellido = p.segundoApellido;
        datosPasajero.TipoDocumento = p.tipoDocumento;
        datosPasajero.NumeroDocumento = p.numeroDocumento;
        datosPasajero.FechaNacimiento = p.fechaNacimiento;
        datosPasajero.Sexo = p.tipoSexo;
        datosPasajero.CorreoElectronico = p.correoElectronico;
        datosPasajero.NumeroTelefono = p.numTelefonoContacto;
        datosPasajero.RequiereAsistencia = p.requiereAsistencia;

        listaTotalPasajeros.push(datosPasajero);
      }
      datosCompraTotal.Pasajeros = listaTotalPasajeros;

      // 2. MAPEO SEGURO AL MODELO
      let varMetodoPago = new DatosMetodoPago();

      // Usamos los nombres que confirmamos en tu log
      varMetodoPago.NumTarjeta =
        pagoExtraido.NumTarjeta || pagoExtraido.numTarjeta;
      varMetodoPago.FechaExpiracion =
        pagoExtraido.FechaExpiracion || pagoExtraido.fechaExpiracion;
      varMetodoPago.CodigoSeguridad =
        pagoExtraido.CodigoSeguridad || pagoExtraido.codigoSeguridad;
      // Agregamos el titular que también vi en tu log
      (varMetodoPago as any).NombreTitular =
        pagoExtraido.NombreTitular || pagoExtraido.nombreTitular;

      datosCompraTotal.MetodoPago = varMetodoPago;

      console.log('✅ 2️⃣ OBJETO FINAL LISTO:', datosCompraTotal);

      // 4. PERSISTENCIA Y ENVÍO A JAVA
      sessionStorage.setItem(
        'reserva_temporal',
        JSON.stringify(datosCompraTotal),
      );

      // Aquí es donde invocas tu método de finalizar venta
      // this.reservaService.finalizarVenta(datosCompraTotal).subscribe(...);
    } else {
      console.error('❌ ERROR: El abuelo no encuentra los datos.');
      if (!datosDesdeServicio?.MetodoPago) {
        console.warn('Motivo: MetodoPago no está en el servicio.');
      }
      alert('Por favor, completa los datos de la tarjeta.');
    }
  }
}
