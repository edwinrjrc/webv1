import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ReservaService } from '../../_services/reserva.service';
import {
  Traslado,
  TrasladoSugeridoSeleccionado,
} from '../../modelo/traslado';

interface EmpresaTraslado {
  id: string;
  nombre: string;
  factorPrecio: number;
}

interface TipoServicioTraslado {
  id: string;
  nombre: string;
  multiplicador: number;
}

interface DireccionSugerida {
  direccion: string;
  zona: string;
  minutosRuta: number;
}

interface TrasladoSugeridoVista {
  id: string;
  nombre: string;
  empresaId: string;
  empresaNombre: string;
  tipoServicioIda: string;
  tipoServicioVuelta?: string;
  incluyeVuelta: boolean;
  precio: number;
  horaRecojoIda: string;
  fechaRecojoVuelta?: string;
  horaRecojoVuelta?: string;
}

const ID_TRASLADO_FORM_IDA = 'form-ida';
const ID_TRASLADO_FORM_VUELTA = 'form-vuelta';

@Component({
  selector: 'app-traslado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './traslado.component.html',
  styleUrl: './traslado.component.css',
})
export class TrasladoComponent implements OnInit {
  trasladoForm!: FormGroup;
  empresasEnroladas: EmpresaTraslado[] = [
    { id: 'movego', nombre: 'MoveGo Transfers', factorPrecio: 1 },
    { id: 'skyride', nombre: 'SkyRide Mobility', factorPrecio: 1.12 },
    { id: 'aerolink', nombre: 'AeroLink Executive', factorPrecio: 1.28 },
  ];
  tiposServicio: TipoServicioTraslado[] = [
    { id: 'economico', nombre: 'Economico', multiplicador: 1 },
    { id: 'ejecutivo', nombre: 'Ejecutivo', multiplicador: 1.35 },
    { id: 'van', nombre: 'Van Familiar', multiplicador: 1.7 },
  ];
  direccionesSugeridas: DireccionSugerida[] = [
    { direccion: 'Av. Javier Prado 1540, San Isidro', zona: 'San Isidro', minutosRuta: 40 },
    { direccion: 'Calle Schell 120, Miraflores', zona: 'Miraflores', minutosRuta: 50 },
    { direccion: 'Av. Primavera 2400, Surco', zona: 'Surco', minutosRuta: 55 },
    { direccion: 'Jr. de la Union 870, Cercado de Lima', zona: 'Centro', minutosRuta: 60 },
    { direccion: 'Av. La Marina 2500, San Miguel', zona: 'San Miguel', minutosRuta: 35 },
  ];

  aeropuertoLlegada = 'Aeropuerto de llegada';
  aeropuertoSalida = 'Aeropuerto de salida';
  fechaVueloIda = '';
  horaVueloIda = '';
  fechaVueloVuelta = '';
  horaVueloVuelta = '';
  esVueloInternacional = false;
  permiteVuelta = false;
  minutosRutaSugeridos = 45;
  horaRecojoSugeridaIda = '';
  horaRecojoSugeridaVuelta = '';
  fechaRecojoSugeridaVuelta = '';
  trasladosSugeridos: TrasladoSugeridoVista[] = [];
  trasladosSeleccionados: TrasladoSugeridoSeleccionado[] = [];
  mensajeLista = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private reservaService: ReservaService,
  ) {}

  ngOnInit(): void {
    this.cargarContextoVuelo();
    const trasladoExistente = this.reservaService.getTraslado();

    this.trasladoForm = this.fb.group({
      empresa: [
        trasladoExistente?.empresaSeleccionada || this.empresasEnroladas[0].id,
        Validators.required,
      ],
      destinoDireccion: [
        trasladoExistente?.destinoDireccion || trasladoExistente?.destino || '',
        Validators.required,
      ],
      zonaDestino: [trasladoExistente?.zonaDestino || this.direccionesSugeridas[0].zona],
      tipoServicioIda: [
        this.resolverTipoServicioValor(
          trasladoExistente?.tramoIda?.tipoServicio || trasladoExistente?.tipoTraslado || '',
        ) || this.tiposServicio[0].id,
        Validators.required,
      ],
      requiereVuelta: [
        trasladoExistente?.requiereVuelta ?? this.permiteVuelta,
      ],
      tipoServicioVuelta: [
        this.resolverTipoServicioValor(trasladoExistente?.tramoVuelta?.tipoServicio || '')
          || (this.permiteVuelta ? this.tiposServicio[0].id : ''),
      ],
    });

    this.trasladoForm.get('destinoDireccion')?.valueChanges.subscribe((value) => {
      this.sincronizarZonaPorDireccion(value || '');
      this.actualizarSugerenciasHorarias();
      this.generarTrasladosSugeridos();
    });

    this.trasladoForm.get('zonaDestino')?.valueChanges.subscribe((value) => {
      this.actualizarMinutosRutaPorZona(value || '');
      this.actualizarSugerenciasHorarias();
      this.generarTrasladosSugeridos();
    });

    this.trasladoForm.get('requiereVuelta')?.valueChanges.subscribe((requiere) => {
      const controlVuelta = this.trasladoForm.get('tipoServicioVuelta');
      if (requiere && this.permiteVuelta) {
        controlVuelta?.setValidators([Validators.required]);
      } else {
        controlVuelta?.clearValidators();
        controlVuelta?.setValue('', { emitEvent: false });
      }
      controlVuelta?.updateValueAndValidity({ emitEvent: false });
      this.generarTrasladosSugeridos();
    });

    this.trasladoForm.get('empresa')?.valueChanges.subscribe(() => {
      this.actualizarSugerenciasHorarias();
      this.generarTrasladosSugeridos();
    });
    this.trasladoForm.get('tipoServicioIda')?.valueChanges.subscribe(() => {
      this.actualizarSugerenciasHorarias();
      this.generarTrasladosSugeridos();
    });
    this.trasladoForm.get('tipoServicioVuelta')?.valueChanges.subscribe(() => {
      this.actualizarSugerenciasHorarias();
      this.generarTrasladosSugeridos();
    });

    this.actualizarMinutosRutaPorZona(this.trasladoForm.get('zonaDestino')?.value || '');
    this.actualizarSugerenciasHorarias();

    if (!this.permiteVuelta) {
      this.trasladoForm.patchValue({ requiereVuelta: false, tipoServicioVuelta: '' }, { emitEvent: false });
    }

    if (this.trasladoForm.get('requiereVuelta')?.value && this.permiteVuelta) {
      this.trasladoForm.get('tipoServicioVuelta')?.setValidators([Validators.required]);
      this.trasladoForm.get('tipoServicioVuelta')?.updateValueAndValidity({ emitEvent: false });
    }

    this.trasladosSeleccionados = trasladoExistente?.trasladosSeleccionados
      ? [...trasladoExistente.trasladosSeleccionados]
      : [];

    this.generarTrasladosSugeridos();
    this.agregarTrasladosFormulario(true);
    this.inicializarTrasladosMockSiListaVacia();
  }

  get precioEstimado(): number {
    const empresa = this.getEmpresaSeleccionada();
    const factorEmpresa = empresa?.factorPrecio ?? 1;
    const tipoIda = this.getTipoServicio(this.trasladoForm.get('tipoServicioIda')?.value);
    const tipoVuelta = this.getTipoServicio(this.trasladoForm.get('tipoServicioVuelta')?.value);
    const baseIda = (20 + this.minutosRutaSugeridos * 0.85) * factorEmpresa * (tipoIda?.multiplicador ?? 1);

    const requiereVuelta = !!this.trasladoForm.get('requiereVuelta')?.value && this.permiteVuelta;
    const baseVuelta = requiereVuelta
      ? (24 + this.minutosRutaSugeridos * 0.95) * factorEmpresa * (tipoVuelta?.multiplicador ?? 1)
      : 0;

    return Number((baseIda + baseVuelta).toFixed(2));
  }

  get totalListaTraslados(): number {
    return Number(
      this.trasladosSeleccionados
        .reduce((acc, item) => acc + item.precio, 0)
        .toFixed(2),
    );
  }

  get tieneTrasladosFormularioEnLista(): boolean {
    return this.trasladosSeleccionados.some(
      (item) => item.id === ID_TRASLADO_FORM_IDA || item.id === ID_TRASLADO_FORM_VUELTA,
    );
  }

  agregarTrasladosFormulario(silencioso = false): void {
    if (this.trasladoForm.invalid) {
      this.trasladoForm.markAllAsTouched();
      this.mensajeLista = 'Completa los campos del formulario para agregar los traslados.';
      return;
    }

    const base = this.construirTrasladosDesdeFormulario();
    this.trasladosSeleccionados = this.reemplazarTrasladosFormulario(base, this.trasladosSeleccionados);
    if (!silencioso) {
      this.mensajeLista = 'Traslados de ida y vuelta agregados a la lista.';
    }
  }

  editarTrasladosFormulario(): void {
    if (!this.tieneTrasladosFormularioEnLista) {
      this.mensajeLista = 'Primero agrega los traslados del formulario.';
      return;
    }
    this.agregarTrasladosFormulario(true);
    this.mensajeLista = 'Traslados del formulario actualizados.';
  }

  eliminarTrasladosFormulario(): void {
    this.trasladosSeleccionados = this.trasladosSeleccionados.filter(
      (item) => item.id !== ID_TRASLADO_FORM_IDA && item.id !== ID_TRASLADO_FORM_VUELTA,
    );
    this.mensajeLista = 'Traslados del formulario eliminados de la lista.';
  }

  agregarTrasladoSugerido(item: TrasladoSugeridoVista): void {
    const existe = this.trasladosSeleccionados.some((t) => t.id === item.id);
    if (existe) {
      this.mensajeLista = 'Ese traslado ya esta en tu lista.';
      return;
    }

    this.trasladosSeleccionados = [...this.trasladosSeleccionados, { ...item }];
    this.mensajeLista = '';
  }

  quitarTrasladoSeleccionado(id: string): void {
    this.trasladosSeleccionados = this.trasladosSeleccionados.filter((item) => item.id !== id);
  }

  editarTrasladoSeleccionado(id: string): void {
    const item = this.trasladosSeleccionados.find((t) => t.id === id);
    if (!item) {
      return;
    }

    this.trasladoForm.patchValue(
      {
        empresa: item.empresaId || this.trasladoForm.get('empresa')?.value,
        tipoServicioIda: this.resolverTipoServicioValor(item.tipoServicioIda),
        requiereVuelta: item.incluyeVuelta,
        tipoServicioVuelta: this.resolverTipoServicioValor(item.tipoServicioVuelta || ''),
      },
      { emitEvent: true },
    );

    this.mensajeLista = 'Traslado cargado en el formulario para edicion.';
  }

  existeEnLista(id: string): boolean {
    return this.trasladosSeleccionados.some((item) => item.id === id);
  }

  esTrasladoHaciaAeropuerto(item: TrasladoSugeridoSeleccionado): boolean {
    const id = String(item.id || '').toLowerCase();
    const nombre = String(item.nombre || '').toLowerCase();
    return id.includes('vuelta') || nombre.includes('a aeropuerto');
  }

  guardar() {
    if (this.trasladoForm.invalid) {
      this.trasladoForm.markAllAsTouched();
      return;
    }

    if (this.trasladosSeleccionados.length === 0) {
      this.mensajeLista = 'Agrega al menos un traslado sugerido a la lista para continuar.';
      return;
    }

    const val = this.trasladoForm.value;
    const requiereVuelta = !!val.requiereVuelta && this.permiteVuelta;
    const empresa = this.getEmpresaSeleccionada();
    const nombreEmpresa = empresa?.nombre || '';

    const traslado: Traslado = {
      origen: this.aeropuertoLlegada,
      destino: val.destinoDireccion,
      fecha: this.fechaVueloIda,
      hora: this.horaRecojoSugeridaIda,
      tipoTraslado: this.getTipoServicio(val.tipoServicioIda)?.nombre || val.tipoServicioIda,
      precio: this.totalListaTraslados,
      requiereVuelta,
      destinoDireccion: val.destinoDireccion,
      zonaDestino: val.zonaDestino,
      empresaSeleccionada: val.empresa,
      margenLlegadaMinutos: this.getMargenLlegadaMinutos(),
      margenSalidaMinutos: this.getMargenSalidaMinutos(),
      tramoIda: {
        origen: this.aeropuertoLlegada,
        destino: val.destinoDireccion,
        fecha: this.fechaVueloIda,
        horaVuelo: this.horaVueloIda,
        horaRecojoSugerida: this.horaRecojoSugeridaIda,
        tipoServicio: this.getTipoServicio(val.tipoServicioIda)?.nombre || val.tipoServicioIda,
        empresa: nombreEmpresa,
        minutosRuta: this.minutosRutaSugeridos,
        esInternacional: this.esVueloInternacional,
      },
      tramoVuelta: requiereVuelta
        ? {
            origen: val.destinoDireccion,
            destino: this.aeropuertoSalida,
            fecha: this.fechaRecojoSugeridaVuelta || this.fechaVueloVuelta,
            horaVuelo: this.horaVueloVuelta,
            horaRecojoSugerida: this.horaRecojoSugeridaVuelta,
            tipoServicio:
              this.getTipoServicio(val.tipoServicioVuelta)?.nombre || val.tipoServicioVuelta,
            empresa: nombreEmpresa,
            minutosRuta: this.minutosRutaSugeridos,
            esInternacional: this.esVueloInternacional,
          }
        : null,
      trasladosSeleccionados: [...this.trasladosSeleccionados],
    };

    this.reservaService.setTraslado(traslado);

    this.navegarAlSiguiente();
  }

  get nombreEmpresaSeleccionada(): string {
    return this.getEmpresaSeleccionada()?.nombre || 'Empresa no disponible';
  }

  get tipoServicioIdaNombre(): string {
    return this.getTipoServicio(this.trasladoForm?.get('tipoServicioIda')?.value)?.nombre || '--';
  }

  get tipoServicioVueltaNombre(): string {
    return this.getTipoServicio(this.trasladoForm?.get('tipoServicioVuelta')?.value)?.nombre || '--';
  }

  private cargarContextoVuelo(): void {
    const oferta = this.reservaService.getOfertaActual();
    const ofertaVuelo = oferta?.OfertaVuelo || oferta?.ofertaVuelo || oferta;
    const rutas = ofertaVuelo?.listaRutaTramos || [];

    const rutaIda = rutas.find((r: any) => Number(r?.tipoViaje) === 1) || rutas[0];
    const rutaVuelta = rutas.find((r: any) => Number(r?.tipoViaje) === 2) || null;

    const idHorarioIda = Number(oferta?.IdOfertaIda ?? oferta?.idOfertaIda ?? 0);
    const idHorarioVuelta = Number(oferta?.IdOfertaVuelta ?? oferta?.idOfertaVuelta ?? 0);

    const horarioIda = this.encontrarHorario(rutaIda, idHorarioIda);
    const horarioVuelta = this.encontrarHorario(rutaVuelta, idHorarioVuelta);

    this.aeropuertoLlegada = this.formatearAeropuerto(rutaIda?.destino, 'Aeropuerto de llegada');
    this.aeropuertoSalida = this.formatearAeropuerto(rutaVuelta?.origen, 'Aeropuerto de salida');

    const fechaHoraLlegada = this.toDate(horarioIda?.fechaLlegadaVuelo) || this.toDate(rutaIda?.fechaViaje);
    const fechaHoraSalida = this.toDate(horarioVuelta?.fechaSalidaVuelo) || this.toDate(rutaVuelta?.fechaViaje);

    this.fechaVueloIda = this.formatDate(fechaHoraLlegada);
    this.horaVueloIda = this.formatTime(fechaHoraLlegada);
    this.fechaVueloVuelta = this.formatDate(fechaHoraSalida);
    this.horaVueloVuelta = this.formatTime(fechaHoraSalida);

    this.permiteVuelta = !!(rutaVuelta && fechaHoraSalida);
    this.esVueloInternacional = this.esRutaInternacional(rutaVuelta || rutaIda);
  }

  private encontrarHorario(ruta: any, idHorario: number): any {
    const horarios = ruta?.horariosRuta || [];
    if (!horarios.length) {
      return null;
    }
    if (idHorario) {
      return horarios.find((h: any) => Number(h?.id) === idHorario) || horarios[0];
    }
    return horarios[0];
  }

  private formatearAeropuerto(aeropuerto: any, fallback: string): string {
    if (!aeropuerto) {
      return fallback;
    }
    const descripcion = String(aeropuerto?.descripcion || aeropuerto?.nombreCiudad || fallback);
    const iata = String(aeropuerto?.codigoIata || '').trim();
    return iata ? `${descripcion} (${iata})` : descripcion;
  }

  private esRutaInternacional(ruta: any): boolean {
    const paisOrigen = String(ruta?.origen?.nombrePais || '').trim().toLowerCase();
    const paisDestino = String(ruta?.destino?.nombrePais || '').trim().toLowerCase();
    if (!paisOrigen || !paisDestino) {
      return false;
    }
    return paisOrigen !== paisDestino;
  }

  private actualizarSugerenciasHorarias(): void {
    const llegada = this.getFechaHora(this.fechaVueloIda, this.horaVueloIda);
    const salida = this.getFechaHora(this.fechaVueloVuelta, this.horaVueloVuelta);

    if (llegada) {
      const recojoIda = new Date(llegada);
      recojoIda.setMinutes(recojoIda.getMinutes() + this.getMargenLlegadaMinutos());
      this.horaRecojoSugeridaIda = this.formatTime(recojoIda);
    } else {
      this.horaRecojoSugeridaIda = '';
    }

    if (salida) {
      const recojoVuelta = new Date(salida);
      recojoVuelta.setMinutes(
        recojoVuelta.getMinutes() - this.getMargenSalidaMinutos() - this.minutosRutaSugeridos,
      );
      this.horaRecojoSugeridaVuelta = this.formatTime(recojoVuelta);
      this.fechaRecojoSugeridaVuelta = this.formatDate(recojoVuelta);
    } else {
      this.horaRecojoSugeridaVuelta = '';
      this.fechaRecojoSugeridaVuelta = '';
    }
  }

  private getMargenLlegadaMinutos(): number {
    return this.esVueloInternacional ? 60 : 40;
  }

  private getMargenSalidaMinutos(): number {
    return this.esVueloInternacional ? 180 : 120;
  }

  private actualizarMinutosRutaPorZona(zona: string): void {
    const match = this.direccionesSugeridas.find((d) => d.zona === zona);
    this.minutosRutaSugeridos = match?.minutosRuta || 45;
  }

  private sincronizarZonaPorDireccion(direccion: string): void {
    const value = String(direccion || '').toLowerCase();
    const match = this.direccionesSugeridas.find((d) =>
      d.direccion.toLowerCase().includes(value),
    );

    if (match && this.trasladoForm.get('zonaDestino')?.value !== match.zona) {
      this.trasladoForm.get('zonaDestino')?.setValue(match.zona, { emitEvent: false });
      this.minutosRutaSugeridos = match.minutosRuta;
    }
  }

  private getEmpresaSeleccionada(): EmpresaTraslado | undefined {
    const id = this.trasladoForm?.get('empresa')?.value;
    return this.empresasEnroladas.find((e) => e.id === id);
  }

  private getTipoServicio(id: string): TipoServicioTraslado | undefined {
    return this.tiposServicio.find((t) => t.id === id);
  }

  private resolverTipoServicioValor(valor: string): string {
    if (!valor) {
      return '';
    }
    const normalizado = valor.toLowerCase();
    const porId = this.tiposServicio.find((t) => t.id.toLowerCase() === normalizado);
    if (porId) {
      return porId.id;
    }
    const porNombre = this.tiposServicio.find((t) => t.nombre.toLowerCase() === normalizado);
    return porNombre?.id || '';
  }

  private construirTrasladosDesdeFormulario(): TrasladoSugeridoSeleccionado[] {
    const empresa = this.getEmpresaSeleccionada();
    const tipoIda = this.getTipoServicio(this.trasladoForm.get('tipoServicioIda')?.value);
    const tipoVuelta = this.getTipoServicio(this.trasladoForm.get('tipoServicioVuelta')?.value);
    const incluirVuelta = true;
    const factorEmpresa = empresa?.factorPrecio ?? 1;

    const precioIda = this.calcularPrecioSugerido(
      factorEmpresa,
      tipoIda?.multiplicador ?? 1,
      1,
      false,
    );

    const lista: TrasladoSugeridoSeleccionado[] = [
      {
        id: ID_TRASLADO_FORM_IDA,
        nombre: 'Traslado 1 - Aeropuerto a destino',
        empresaId: empresa?.id || '',
        empresaNombre: empresa?.nombre || '',
        tipoServicioIda: tipoIda?.nombre || '--',
        incluyeVuelta: false,
        precio: precioIda,
        horaRecojoIda: this.horaRecojoSugeridaIda,
      },
    ];

    if (incluirVuelta) {
      const fechaBaseVuelta =
        this.fechaRecojoSugeridaVuelta || this.fechaVueloVuelta || this.fechaVueloIda;
      const horaBaseVuelta = this.horaRecojoSugeridaVuelta || this.horaRecojoSugeridaIda || '18:00';
      const precioVuelta = this.calcularPrecioSugerido(
        factorEmpresa,
        1,
        tipoVuelta?.multiplicador ?? 1,
        true,
      ) - this.calcularPrecioSugerido(factorEmpresa, 1, 1, false);

      lista.push({
        id: ID_TRASLADO_FORM_VUELTA,
        nombre: 'Traslado 2 - Destino a aeropuerto',
        empresaId: empresa?.id || '',
        empresaNombre: empresa?.nombre || '',
        tipoServicioIda: tipoVuelta?.nombre || '--',
        tipoServicioVuelta: tipoVuelta?.nombre || '--',
        incluyeVuelta: true,
        precio: Number(Math.max(precioVuelta, 0).toFixed(2)),
        horaRecojoIda: this.horaRecojoSugeridaIda,
        fechaRecojoVuelta: fechaBaseVuelta,
        horaRecojoVuelta: horaBaseVuelta,
      });
    }

    return lista;
  }

  private reemplazarTrasladosFormulario(
    base: TrasladoSugeridoSeleccionado[],
    actuales: TrasladoSugeridoSeleccionado[],
  ): TrasladoSugeridoSeleccionado[] {
    const sinBase = actuales.filter(
      (item) => item.id !== ID_TRASLADO_FORM_IDA && item.id !== ID_TRASLADO_FORM_VUELTA,
    );
    return [...base, ...sinBase];
  }

  private inicializarTrasladosMockSiListaVacia(): void {
    if (this.trasladosSeleccionados.length > 0) {
      return;
    }

    const empresa = this.getEmpresaSeleccionada();
    const tipoBase = this.getTipoServicio(this.trasladoForm?.get('tipoServicioIda')?.value);
    const incluirVuelta = true;

    const mockIda: TrasladoSugeridoSeleccionado = {
      id: ID_TRASLADO_FORM_IDA,
      nombre: 'Traslado 1 - Aeropuerto a destino (mock)',
      empresaId: empresa?.id || 'movego',
      empresaNombre: empresa?.nombre || 'MoveGo Transfers',
      tipoServicioIda: tipoBase?.nombre || 'Economico',
      incluyeVuelta: false,
      precio: Number((28 + this.minutosRutaSugeridos * 0.8).toFixed(2)),
      horaRecojoIda: this.horaRecojoSugeridaIda || '10:30',
    };

    const listaMock: TrasladoSugeridoSeleccionado[] = [mockIda];

    if (incluirVuelta) {
      listaMock.push({
        id: ID_TRASLADO_FORM_VUELTA,
        nombre: 'Traslado 2 - Destino a aeropuerto (mock)',
        empresaId: empresa?.id || 'movego',
        empresaNombre: empresa?.nombre || 'MoveGo Transfers',
        tipoServicioIda: tipoBase?.nombre || 'Economico',
        tipoServicioVuelta: tipoBase?.nombre || 'Economico',
        incluyeVuelta: true,
        precio: Number((34 + this.minutosRutaSugeridos * 0.9).toFixed(2)),
        horaRecojoIda: this.horaRecojoSugeridaIda || '10:30',
        fechaRecojoVuelta: this.fechaRecojoSugeridaVuelta || this.fechaVueloVuelta || this.fechaVueloIda,
        horaRecojoVuelta: this.horaRecojoSugeridaVuelta || '18:10',
      });
    }

    this.trasladosSeleccionados = listaMock;
    this.mensajeLista = 'Se cargaron traslados de ejemplo para iniciar la lista.';
  }

  private generarTrasladosSugeridos(): void {
    const destino = String(this.trasladoForm?.get('destinoDireccion')?.value || '').trim();
    if (!destino) {
      this.trasladosSugeridos = [];
      return;
    }

    const incluirVuelta =
      !!this.trasladoForm?.get('requiereVuelta')?.value && this.permiteVuelta;

    const sugerencias: TrasladoSugeridoVista[] = [];

    for (const empresa of this.empresasEnroladas) {
      for (const tipoIda of this.tiposServicio) {
        if (incluirVuelta) {
          for (const tipoVuelta of this.tiposServicio) {
            const precio = this.calcularPrecioSugerido(
              empresa.factorPrecio,
              tipoIda.multiplicador,
              tipoVuelta.multiplicador,
              true,
            );
            sugerencias.push({
              id: `${empresa.id}-${tipoIda.id}-${tipoVuelta.id}-rv`,
              nombre: `${empresa.nombre} - ${tipoIda.nombre} + ${tipoVuelta.nombre}`,
              empresaId: empresa.id,
              empresaNombre: empresa.nombre,
              tipoServicioIda: tipoIda.nombre,
              tipoServicioVuelta: tipoVuelta.nombre,
              incluyeVuelta: true,
              precio,
              horaRecojoIda: this.horaRecojoSugeridaIda,
              fechaRecojoVuelta: this.fechaRecojoSugeridaVuelta,
              horaRecojoVuelta: this.horaRecojoSugeridaVuelta,
            });
          }
        } else {
          const precio = this.calcularPrecioSugerido(
            empresa.factorPrecio,
            tipoIda.multiplicador,
            1,
            false,
          );
          sugerencias.push({
            id: `${empresa.id}-${tipoIda.id}-ida`,
            nombre: `${empresa.nombre} - ${tipoIda.nombre}`,
            empresaId: empresa.id,
            empresaNombre: empresa.nombre,
            tipoServicioIda: tipoIda.nombre,
            incluyeVuelta: false,
            precio,
            horaRecojoIda: this.horaRecojoSugeridaIda,
          });
        }
      }
    }

    this.trasladosSugeridos = sugerencias
      .sort((a, b) => a.precio - b.precio)
      .slice(0, 8);
  }

  private calcularPrecioSugerido(
    factorEmpresa: number,
    multIda: number,
    multVuelta: number,
    incluirVuelta: boolean,
  ): number {
    const baseIda = (20 + this.minutosRutaSugeridos * 0.85) * factorEmpresa * multIda;
    const baseVuelta = incluirVuelta
      ? (24 + this.minutosRutaSugeridos * 0.95) * factorEmpresa * multVuelta
      : 0;
    return Number((baseIda + baseVuelta).toFixed(2));
  }

  private toDate(value: any): Date | null {
    if (!value) {
      return null;
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return null;
    }
    return date;
  }

  private getFechaHora(fecha: string, hora: string): Date | null {
    if (!fecha || !hora) {
      return null;
    }
    return this.toDate(`${fecha}T${hora}:00`);
  }

  private formatDate(date: Date | null): string {
    if (!date) {
      return '';
    }
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private formatTime(date: Date | null): string {
    if (!date) {
      return '';
    }
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  }

  navegarAlSiguiente() {
    const servicios = this.reservaService.getServiciosSeleccionados();
    const idx = servicios.indexOf('traslado');
    const siguiente = servicios[idx + 1];
    if (siguiente) {
      this.router.navigate(['/reserva/servicios', siguiente]);
    } else {
      this.router.navigate(['/reserva/resumen-servicios']);
    }
  }

  volver() {
    const servicios = this.reservaService.getServiciosSeleccionados();
    const idx = servicios.indexOf('traslado');
    const anterior = servicios[idx - 1];
    if (anterior) {
      this.router.navigate(['/reserva/servicios', anterior]);
    } else {
      this.router.navigate(['/reserva/servicios']);
    }
  }
}
