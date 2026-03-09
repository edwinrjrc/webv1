import {
  Component,
  Inject,
  inject,
  OnInit,
  PLATFORM_ID,
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
  NgbNavModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { VuelosEncontrados } from '../modelo/vueltosEncontrados';
import { UtilconversionsService } from '../_services/utilconversions.service';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { DatosComponent } from '../datos/datos.component';
import { OfertaSeleccionada } from '../modelo/ofertaSeleccionada';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../_services/auth.service'; // Ajusta la ruta si es necesario

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    OfertavueloComponent,
    NgbDatepickerModule,
    NgbNavModule,
    NgbTypeaheadModule,
    NgbAccordionModule,
    DatosComponent,
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

  @ViewChild('d') datepicker!: NgbInputDatepicker;

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
    //this.consultarVuelo2();
  }

  recibeMensaje($event: string) {
    const ofertaSelect = JSON.parse($event);

    this.ofertaSeleccionada = Object.assign(
      new OfertaSeleccionada(),
      ofertaSelect,
    );

    this.flgProceso = this.ofertaSeleccionada.FlgProceso;
  }

  cargarDestinos() {
    this.tokenVisible = localStorage.getItem('token'); // Recuperamos para mostrar
    this.catalogoService.listarDestinos('').subscribe((resp) => {
      console.log(resp);
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

      console.log('fechaIdaStr ::' + fechaIdaStr);

      const valueFechaIda =
        await this._utilconversionsService.encryptData(fechaIdaStr);
      this.consultaViaje.FechaIdaStr = valueFechaIda;

      fechaVueltaDate = new Date(this.modelFechaVuelta + 'T00:00:00');

      let fechaVueltaStr: string =
        this.modelFechaVuelta?.day +
        '/' +
        this.modelFechaVuelta?.month +
        '/' +
        this.modelFechaVuelta?.year;

      const valueFechaVuelta =
        await this._utilconversionsService.encryptData(fechaVueltaStr);
      this.consultaViaje.FechaVueltaStr = valueFechaVuelta;

      const valueEncryptDestino =
        await this._utilconversionsService.encryptData(
          this.modelDestino.codigoIata,
        );
      this.consultaViaje.CodigoIataDestino = valueEncryptDestino;

      const valueEncryptOrigen = await this._utilconversionsService.encryptData(
        this.modelOrigen.codigoIata,
      );
      this.consultaViaje.CodigoIataOrigen = valueEncryptOrigen;

      const valueNumAdultos = await this._utilconversionsService.encryptData(
        this.myControlAdultos.value != null ? this.myControlAdultos.value : '',
      );
      this.consultaViaje.Adultos = valueNumAdultos;

      const valueNumNinos = await this._utilconversionsService.encryptData(
        this.myControlNinos.value != null ? this.myControlNinos.value : '',
      );
      this.consultaViaje.Ninos = valueNumNinos;

      const valueNumInfantes = await this._utilconversionsService.encryptData(
        this.myControlInfantes.value != null
          ? this.myControlInfantes.value
          : '',
      );
      this.consultaViaje.Infantes = valueNumInfantes;

      const valueClaseVuelo = await this._utilconversionsService.encryptData(
        this.modelClaseVuelo,
      );
      this.consultaViaje.ClaseVuelo = valueClaseVuelo;

      const valueTipoVuelo = await this._utilconversionsService.encryptData(
        this.modelTipoVuelo,
      );
      this.consultaViaje.TipoViaje = valueTipoVuelo;

      this.viajeService.consultarVuelo(this.consultaViaje).subscribe((resp) => {
        this.vuelosEncontrados = resp.dataRpta;
        this.busquedaRealizada = true;
        console.log(this.vuelosEncontrados);
        if (this.vuelosEncontrados != null) {
          this.resultadoBusqueda =
            this.vuelosEncontrados.ofertasEncontradas.length > 0 ? true : false;
        }
      });
    } catch (e) {
      console.log(e);
      e;
    }
  }

  consultarVuelo2() {
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

      this.viajeService.consultarVuelo(consultaViaje).subscribe((resp) => {
        this.vuelosEncontrados = resp.dataRpta;
      });
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

  /*
  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
        this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
        this.toDate = date;
    } else {
        this.toDate = null;
        this.fromDate = date;
    }
}*/

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
    text$: Observable<String>,
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term === null
          ? []
          : this.arregloRespDestinos.dataRpta
              .filter(
                (v) =>
                  v.nombreAeropuertoMostrar
                    .toLowerCase()
                    .indexOf(term.toLowerCase()) > -1,
              )
              .slice(0, 10),
      ),
    );

  formatDate(date: any): string {
    return `${date.day}/${date.month}/${date.year}`;
  }
}
