import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Clasevuelo } from '../modelo/clasevuelo';
import { Observable, OperatorFunction } from 'rxjs';
import {
  map,
  startWith,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs/operators';
import { CatalogosService } from '../_services/catalogos.service';
import { InterDestino2 } from '../modelo/interDestino2';
import { InterDataRptaDestino } from '../modelo/InterDataRptaDestino';
import { ConsultaViaje } from '../modelo/consultaViaje';
import { ViajeService } from '../_services/viaje.service';
import { OfertavueloComponent } from '../ofertavuelo/ofertavuelo.component';
import {
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
  NgbDatepickerModule,
  NgbNavModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { VuelosEncontrados } from '../modelo/vueltosEncontrados';
import { UtilconversionsService } from '../_services/utilconversions.service';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { DatosComponent } from '../datos/datos.component';
import { OfertaSeleccionada } from '../modelo/ofertaSeleccionada';

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
    DatosComponent
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
})
export class InicioComponent implements OnInit  {
  active = 1;
  listaClasesVuelo: Clasevuelo[] = [];
  filteredOptionsOrigen!: Observable<InterDestino2[]>;
  filteredOptionsDestino!: Observable<InterDestino2[]>;

  arregloRespDestinos!: InterDataRptaDestino;

  myControlAdultos = new FormControl('');
  myControlNinos = new FormControl('');
  myControlInfantes = new FormControl('');

  valorCombo2!: InterDestino2;
  idIdaVuela: string = '';
  idClase: string = '';

  varOrigen!: string;

  modelOrigen!: InterDestino2;
  modelDestino!: InterDestino2;
  formatter2 = (result: InterDestino2) =>
    result.nombreAeropuertoMostrar.toUpperCase();

  modelTipoVuelo!: string;
  modelClaseVuelo!: string;

  vuelosEncontrados!: VuelosEncontrados;

  modelNroAdultos: number = 1;
  modelNroNinos: number = 0;
  modelNroInfantes: number = 0;

  message: string | undefined;

  flgProceso !: string;

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  calendar = inject(NgbCalendar);
  formatter = inject(NgbDateParserFormatter);

  iataDestinoEncryp!:string

  resultadoBusqueda : boolean = false;
  busquedaRealizada : boolean = false;

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null = this.calendar.getToday();
  toDate: NgbDate | null = this.calendar.getNext(
    this.calendar.getToday(),
    'd',
    10
  );

  modelFechaIda !: string;
  modelFechaVuelta !: string;

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (
      this.fromDate &&
      !this.toDate &&
      date &&
      date.after(this.fromDate)
    ) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  constructor(
    private catalogoService: CatalogosService,
    private viajeService: ViajeService, private _utilconversionsService: UtilconversionsService
  ) {
    this.iniciaClaseVuelo();
    this.idIdaVuela = '1';
    this.idClase = '1';

    //Cotizacion
    this.flgProceso = "C";
  }

  ngOnInit(): void {
    this.cargarDestinos();

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

    //this.consultarVuelo2();
  }

  recibeMensaje($event: string) {

    const ofertaSelect = JSON.parse($event);

    let ofertaSeleccionada: OfertaSeleccionada;
    ofertaSeleccionada = new OfertaSeleccionada();

    ofertaSeleccionada.FlgProceso = ofertaSelect.flgProceso;

    this.flgProceso = ofertaSelect.flgProceso;

  }

  cargarDestinos() {
    this.catalogoService.listarDestinos('').subscribe((resp) => {
      this.arregloRespDestinos = resp;
    });
  }

  private _filter(name: string): InterDestino2[] {
    const filterValue = name.toLowerCase();

    return this.arregloRespDestinos.dataRpta.filter((option) =>
      option.nombreAeropuertoMostrar.toLowerCase().includes(filterValue)
    );
  }

  displayFnOrigen(destino: InterDestino2): string {
    return destino && destino.nombreAeropuertoMostrar
      ? destino.nombreAeropuertoMostrar
      : 'Vacio';
  }
  displayFnDestino(destino: InterDestino2): string {
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
      let consultaViaje: ConsultaViaje = new ConsultaViaje();
      
      let fechaIdaDate: Date;
      let fechaVueltaDate: Date;

      fechaIdaDate = new Date(this.modelFechaIda+'T00:00:00');

      let fechaIdaStr:string = fechaIdaDate.getDate() + '/' + (fechaIdaDate.getMonth()+1) + '/' + fechaIdaDate.getFullYear();

      const valueFechaIda = await this._utilconversionsService.encryptData(fechaIdaStr);
      consultaViaje.FechaIdaStr = valueFechaIda;

      fechaVueltaDate = new Date(this.modelFechaVuelta+'T00:00:00');

      let fechaVueltaStr:string = fechaVueltaDate.getDate() + '/' + (fechaVueltaDate.getMonth()+1) + '/' + fechaVueltaDate.getFullYear();

      const valueFechaVuelta = await this._utilconversionsService.encryptData(fechaVueltaStr);
      consultaViaje.FechaVueltaStr = valueFechaVuelta;

      const valueEncryptDestino = await this._utilconversionsService.encryptData(this.modelDestino.codigoIata);
      consultaViaje.CodigoIataDestino = valueEncryptDestino;

      const valueEncryptOrigen = await this._utilconversionsService.encryptData(this.modelOrigen.codigoIata);
      consultaViaje.CodigoIataOrigen = valueEncryptOrigen;

      const valueNumAdultos = await this._utilconversionsService.encryptData(this.myControlAdultos.value != null ? this.myControlAdultos.value: '');
      consultaViaje.Adultos = valueNumAdultos;

      const valueNumNinos = await this._utilconversionsService.encryptData(this.myControlNinos.value != null ? this.myControlNinos.value: '');
      consultaViaje.Ninos = valueNumNinos;

      const valueNumInfantes = await this._utilconversionsService.encryptData(this.myControlInfantes.value != null ? this.myControlInfantes.value: '');
      consultaViaje.Infantes = valueNumInfantes;

      const valueClaseVuelo = await this._utilconversionsService.encryptData(this.modelClaseVuelo);
      consultaViaje.ClaseVuelo = valueClaseVuelo;

      const valueTipoVuelo = await this._utilconversionsService.encryptData(this.modelTipoVuelo);
      consultaViaje.TipoViaje = valueTipoVuelo;

      this.viajeService.consultarVuelo(consultaViaje).subscribe((resp) => {
        this.vuelosEncontrados = resp.dataRpta;
        this.busquedaRealizada = true;
        if (this.vuelosEncontrados != null){
          this.resultadoBusqueda = (this.vuelosEncontrados.ofertasEncontradas.length > 0 ? true: false);
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

      consultaViaje.FechaIda = new Date(2024,10,4);
      consultaViaje.FechaVuelta = new Date(2024,11,15);

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
    } catch (e) {}
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed))
      ? NgbDate.from(parsed)
      : currentValue;
  }

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


  search: OperatorFunction<string, readonly InterDestino2[]> = (
    text$: Observable<String>
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
                    .indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
      )
    );
}
