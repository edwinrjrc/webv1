import {
  Component,
  Inject,
  inject,
  OnInit,
  PLATFORM_ID,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Clasevuelo } from '../modelo/clasevuelo';
import { Observable, OperatorFunction } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CatalogosService } from '../_services/catalogos.service';
import { InterDestino } from '../modelo/interDestino';
import { InterDataRptaDestino } from '../modelo/InterDataRptaDestino';
import { ConsultaViaje } from '../modelo/consultaViaje';
import { ViajeService } from '../_services/viaje.service';
import { OfertavueloComponent } from '../ofertavuelo/ofertavuelo.component';
import {
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
  NgbDatepicker,
  NgbDatepickerModule,
  NgbDateStruct,
  NgbInputDatepicker,
  NgbModal,
  NgbNavModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { VuelosEncontrados } from '../modelo/vueltosEncontrados';
import { UtilconversionsService } from '../_services/utilconversions.service';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { OfertaSeleccionada } from '../modelo/ofertaSeleccionada';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../_services/auth.service'; // Ajusta la ruta si es necesario
import { ReservaService } from '../_services/reserva.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OfertavueloComponent,
    NgbDatepickerModule,
    NgbNavModule,
    NgbTypeaheadModule,
    NgbAccordionModule,
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
})
export class InicioComponent implements OnInit {
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null = null;
  toDate: NgbDate | null = null;

  listaOfertas: any[] = [];

  modelFechaIda: NgbDateStruct | undefined;
  modelFechaVuelta: NgbDateStruct | undefined;

  active = 1;
  listaClasesVuelo: Clasevuelo[] = [];
  filteredOptionsOrigen!: Observable<InterDestino[]>;
  filteredOptionsDestino!: Observable<InterDestino[]>;

  arregloRespDestinos!: InterDataRptaDestino;

  myControlAdultos = new FormControl('');
  myControlNinos = new FormControl('');
  myControlInfantes = new FormControl('');

  valorCombo2!: InterDestino;
  idIdaVuela: string = '';
  idClase: string = '';

  varOrigen!: string;

  modelOrigen!: InterDestino;
  modelDestino!: InterDestino;
  formatter2 = (result: InterDestino) =>
    result.nombreAeropuertoMostrar.toUpperCase();

  modelTipoVuelo!: string;
  modelClaseVuelo!: string;

  vuelosEncontrados!: VuelosEncontrados;

  modelNroAdultos: number = 1;
  modelNroNinos: number = 0;
  modelNroInfantes: number = 0;

  modelHotel: string = '';
  modelFechaLlegadaHotel: NgbDateStruct | undefined;
  modelNochesHotel: number = 1;
  modelAdultosHotel: number = 2;
  modelNinosHotel: number = 0;
  modelInfantesHotel: number = 0;
  modelTotalPersonasHotel: number = 2;

  message: string | undefined;

  flgProceso!: string;

  ofertaSeleccionada!: OfertaSeleccionada;

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  formatter = inject(NgbDateParserFormatter);

  iataDestinoEncryp!: string;

  resultadoBusqueda: boolean = false;
  busquedaRealizada: boolean = false;

  consultaViaje: ConsultaViaje = new ConsultaViaje();

  precioMaximo: number = 2500;

  tokenVisible: string | null = '';

  vuelosEncontradosOriginal: any = null;

  soloDirectos: boolean = false;
  conEscalas: boolean = false;

  @ViewChild('d') datepicker!: NgbInputDatepicker;

  @ViewChild('tarifaModal') tarifaModal!: TemplateRef<any>;

  onDateSelection(date: NgbDate) {
    if (!this.modelFechaIda || (this.modelFechaIda && this.modelFechaVuelta)) {
      this.modelFechaIda = date;
      this.modelFechaVuelta = undefined;
    } else if (date.after(this.modelFechaIda as any)) {
      this.modelFechaVuelta = date;
      this.datepicker.close(); // Esto ahora sí funcionará sin errores
    }
  }

  constructor(
    private catalogoService: CatalogosService,
    private viajeService: ViajeService,
    private _utilconversionsService: UtilconversionsService,
    private calendar: NgbCalendar,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object, // 3. Inyectar el ID de plataforma
    private router: Router,
    private reservaService: ReservaService,
    private modalService: NgbModal,
  ) {
    this.iniciaClaseVuelo();
    this.idIdaVuela = '1';
    this.idClase = '1';

    //Cotizacion
    this.flgProceso = 'C';

    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');

      if (!token) {
        // Si es un usuario nuevo/anónimo, generamos su token primero
        this.authService.obtenerTokenAnonimo().subscribe({
          next: () => this.cargarDestinos(), // Una vez generado, cargamos los datos
          error: (err) => console.error('Error al generar token anónimo', err),
        });
      } else {
        // Si ya tiene token (anónimo o real), cargamos normal
        this.cargarDestinos();
      }
    }

    this.modelTipoVuelo = '1';
    this.modelClaseVuelo = '1';

    this.vuelosEncontrados = {
      idUsuarioRegistro: 0,
      fechaRegistro: new Date(),
      idUsuarioModificacion: 0,
      fechaModificacion: new Date(),
      idEstadoRegistro: 0,
      ofertasEncontradas: [],
    };

    this.myControlAdultos.setValue('1');
    this.myControlNinos.setValue('0');
    this.myControlInfantes.setValue('0');
    this.recalcularTotalPersonasHotel();
    //this.consultarVuelo2();
  }

  /*recibeMensaje($event: string) {
    const ofertaSelect = JSON.parse($event);
    this.ofertaSeleccionada = Object.assign(new OfertaSeleccionada(),ofertaSelect);
    this.flgProceso = this.ofertaSeleccionada.FlgProceso;
  }*/

  recibeMensaje(oferta: any) {
    // Primero, procesamos la oferta (convertimos a objeto si viene como string JSON)
    const ofertaData = typeof oferta === 'string' ? JSON.parse(oferta) : oferta;

    // Guardamos la oferta temporalmente en una variable de la clase para no perderla
    this.ofertaSeleccionada = ofertaData;

    // En lugar de navegar, abrimos el modal que definiste en el HTML
    this.modalService.open(this.tarifaModal, {
      size: 'xl',
      centered: true,
      backdropClass: 'light-backdrop',
      // 'trapFocus' asegura que el usuario no pueda salir del modal con TAB
      beforeDismiss: () => true,
    });
  }

  cargarDestinos() {
    this.tokenVisible = localStorage.getItem('token'); // Recuperamos para mostrar
    this.catalogoService.listarDestinos('').subscribe((resp) => {
      this.arregloRespDestinos = resp;
    });
  }

  private _filter(name: string): InterDestino[] {
    const filterValue = name.toLowerCase();

    return this.arregloRespDestinos.dataRpta.filter((option) =>
      option.nombreAeropuertoMostrar.toLowerCase().includes(filterValue),
    );
  }

  displayFnOrigen(destino: InterDestino): string {
    return destino && destino.nombreAeropuertoMostrar
      ? destino.nombreAeropuertoMostrar
      : 'Vacio';
  }
  displayFnDestino(destino: InterDestino): string {
    return destino && destino.nombreAeropuertoMostrar
      ? destino.nombreAeropuertoMostrar
      : 'Vacio';
  }

  iniciaClaseVuelo() {
    let claseVuelo: Clasevuelo = new Clasevuelo();
    claseVuelo.CodigoClase = '1';
    claseVuelo.NombreClase = 'Economica';

    this.listaClasesVuelo[0] = claseVuelo;

    claseVuelo = new Clasevuelo();
    claseVuelo.CodigoClase = '2';
    claseVuelo.NombreClase = 'Premiun Economica';

    this.listaClasesVuelo[1] = claseVuelo;

    claseVuelo = new Clasevuelo();
    claseVuelo.CodigoClase = '3';
    claseVuelo.NombreClase = 'Premiun Ejecutiva';

    this.listaClasesVuelo[2] = claseVuelo;
  }

  async consultarVuelo() {
    try {
      let fechaIdaDate: Date;
      let fechaVueltaDate: Date;

      fechaIdaDate = new Date(this.modelFechaIda + 'T00:00:00');

      let fechaIdaStr: string =
        this.modelFechaIda?.day +
        '/' +
        this.modelFechaIda?.month +
        '/' +
        this.modelFechaIda?.year;

      this.consultaViaje.FechaIdaStr = fechaIdaStr;

      fechaVueltaDate = new Date(this.modelFechaVuelta + 'T00:00:00');

      let fechaVueltaStr: string =
        this.modelFechaVuelta?.day +
        '/' +
        this.modelFechaVuelta?.month +
        '/' +
        this.modelFechaVuelta?.year;

      this.consultaViaje.FechaVueltaStr = fechaVueltaStr;

      this.consultaViaje.CodigoIataDestino = this.modelDestino.codigoIata;
      this.consultaViaje.CodigoIataOrigen = this.modelOrigen.codigoIata;
      this.consultaViaje.Adultos =
        this.myControlAdultos.value != null ? this.myControlAdultos.value : '';
      this.consultaViaje.Ninos =
        this.myControlNinos.value != null ? this.myControlNinos.value : '';
      this.consultaViaje.Infantes =
        this.myControlInfantes.value != null
          ? this.myControlInfantes.value
          : '';
      this.consultaViaje.ClaseVuelo = this.modelClaseVuelo;
      this.consultaViaje.TipoViaje = this.modelTipoVuelo;

      (await this.viajeService.consultarVuelo(this.consultaViaje)).subscribe(
        (resp) => {
          this.vuelosEncontrados = resp.dataRpta;
          this.vuelosEncontradosOriginal = JSON.parse(
            JSON.stringify(resp.dataRpta),
          );
          this.busquedaRealizada = true;
          if (this.vuelosEncontrados != null) {
            this.resultadoBusqueda =
              this.vuelosEncontrados.ofertasEncontradas.length > 0
                ? true
                : false;
          }
        },
      );
    } catch (e) {
      console.log(e);
      e;
    }
  }

  async consultarVuelo2() {
    try {
      let consultaViaje: ConsultaViaje = new ConsultaViaje();

      consultaViaje.FechaIda = new Date(2024, 10, 4);
      consultaViaje.FechaVuelta = new Date(2024, 11, 15);

      consultaViaje.CodigoIataDestino = 'LIM';
      consultaViaje.CodigoIataOrigen = 'TLA';
      consultaViaje.Adultos = '1';
      consultaViaje.Ninos = '0';
      consultaViaje.Infantes = '0';
      consultaViaje.ClaseVuelo = '1';
      consultaViaje.TipoViaje = '1';

      (await this.viajeService.consultarVuelo(consultaViaje)).subscribe(
        (resp) => {
          this.vuelosEncontrados = resp.dataRpta;
        },
      );
    } catch (e) {
      console.log(e);
      e;
    }
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed))
      ? NgbDate.from(parsed)
      : currentValue;
  }

  isHovered(date: NgbDate) {
    return (
      this.modelFechaIda &&
      !this.modelFechaVuelta &&
      this.hoveredDate &&
      date.after(this.modelFechaIda as any) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return (
      this.modelFechaVuelta &&
      date.after(this.modelFechaIda as any) &&
      date.before(this.modelFechaVuelta as any)
    );
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.modelFechaIda as any) ||
      (this.modelFechaVuelta && date.equals(this.modelFechaVuelta as any)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  search: OperatorFunction<string, readonly InterDestino[]> = (
    text$: Observable<string>,
  ) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map((term) => {
        // VALIDACIÓN CRÍTICA:
        // Si el término es corto O si los datos aún no llegan del servidor, retornamos lista vacía.
        if (
          term.length < 2 ||
          !this.arregloRespDestinos ||
          !this.arregloRespDestinos.dataRpta
        ) {
          return [];
        }

        return this.arregloRespDestinos.dataRpta
          .filter((v) =>
            v.nombreAeropuertoMostrar
              .toLowerCase()
              .includes(term.toLowerCase()),
          )
          .slice(0, 10);
      }),
    );

  formatDate(date: any): string {
    return `${date.day}/${date.month}/${date.year}`;
  }

  recalcularTotalPersonasHotel() {
    this.modelAdultosHotel = Math.max(1, Number(this.modelAdultosHotel || 0));
    this.modelNinosHotel = Math.max(0, Number(this.modelNinosHotel || 0));
    this.modelInfantesHotel = Math.max(0, Number(this.modelInfantesHotel || 0));

    this.modelTotalPersonasHotel =
      this.modelAdultosHotel + this.modelNinosHotel + this.modelInfantesHotel;
  }

  buscarHoteles() {
    this.recalcularTotalPersonasHotel();

    const filtrosHoteles = {
      hotel: this.modelHotel,
      fechaLlegada: this.modelFechaLlegadaHotel
        ? this.formatDate(this.modelFechaLlegadaHotel)
        : '',
      numeroNoches: this.modelNochesHotel,
      adultos: this.modelAdultosHotel,
      ninos: this.modelNinosHotel,
      infantes: this.modelInfantesHotel,
      cantidadPersonas: this.modelTotalPersonasHotel,
    };

    console.log('Busqueda de hoteles:', filtrosHoteles);
  }

  abrirModalTarifas() {
    this.modalService.open(this.tarifaModal, {
      size: 'xl', // xl para que quepan bien las 3 tarjetas, o 'lg'
      centered: true,
      backdropClass: 'light-backdrop',
    });
  }

  seleccionarTarifa(tipoTarifa: string, modal: any) {
    // Agregamos la tarifa seleccionada al objeto de reserva
    const datosFinales = {
      ...this.ofertaSeleccionada,
      tarifaMaleta: tipoTarifa,
    };

    // 3. Ahora sí, guardamos en el servicio y navegamos
    this.reservaService.setDatosReserva(this.consultaViaje, datosFinales);

    modal.close(); // Cerramos el modal
    this.router.navigate(['/reserva']); // Navegamos a la siguiente pantalla
  }
  getPrecioPorTarifa(tipo: string): number {
    /*const precioBase =
      this.ofertaSeleccionada.OfertaVuelo.precioOfertaDto.totalRuta;*/
    const precioBase = 1000; // Aquí deberías usar el precio real de la oferta

    switch (tipo) {
      case 'Clasica':
        return precioBase + 25; // Ejemplo: +25 USD
      case 'Plus':
        return precioBase + 55; // Ejemplo: +55 USD
      default:
        return precioBase; // Básica
    }
  }

  private esOfertaDirecta(oferta: any): boolean {
    const rutas = oferta?.listaRutaTramos ?? [];

    if (rutas.length === 0) {
      return true;
    }

    return rutas.every((ruta: any) => {
      const horarios = ruta?.horariosRuta ?? [];
      return horarios.every((horario: any) => Number(horario?.inEscalas ?? 0) === 0);
    });
  }

  aplicarFiltros() {
    console.log('Aplicando filtros:');

    if (!this.vuelosEncontradosOriginal?.ofertasEncontradas) {
      return;
    }
    
    const ofertasFiltradas = this.vuelosEncontradosOriginal.ofertasEncontradas.filter(
      (oferta: any) => {
        const precioTotal = Number(
          oferta?.precioOfertaDto?.totalRuta ?? oferta?.precioTotal ?? 0,
        );
        const cumplePrecio = precioTotal <= this.precioMaximo;

        const esDirecta = this.esOfertaDirecta(oferta);
        let cumpleEscalas = true;

        if (this.soloDirectos && !this.conEscalas) {
          cumpleEscalas = esDirecta;
        } else if (this.conEscalas && !this.soloDirectos) {
          cumpleEscalas = !esDirecta;
        }

        return cumplePrecio && cumpleEscalas;
      },
    );

    this.vuelosEncontrados = {
      ...this.vuelosEncontradosOriginal,
      ofertasEncontradas: ofertasFiltradas,
    };

    this.resultadoBusqueda = ofertasFiltradas.length > 0;
  }
}
