import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ReservaService } from '../../_services/reserva.service';
import {
  BusquedaHotelRequest,
  CatalogosService,
  HotelDisponibleResponse,
  ReservaHotelRequest,
} from '../../_services/catalogos.service';

interface HotelDisponible {
  id?: string;
  nombre: string;
  categoria: string;
  precioPorNoche: number;
  ubicacion: string;
  descripcion: string;
  capacidad: number;
  rating: number;
}

@Component({
  selector: 'app-hotel',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './hotel.component.html',
  styleUrl: './hotel.component.css',
})
export class HotelComponent implements OnInit {
  hotelForm!: FormGroup;
  private ofertaActual: any = null;
  filtrosVisibles = true;
  tiposHabitacion = ['Simple', 'Doble', 'Suite', 'Familiar'];
  preciosPorTipo: Record<string, number> = {
    Simple: 80,
    Doble: 120,
    Suite: 250,
    Familiar: 180,
  };
  hotelesDisponibles: HotelDisponible[] = [];
  hotelSeleccionado: HotelDisponible | null = null;
  mensajeBusqueda = '';
  buscandoHoteles = false;
  validandoSeleccionHotel = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private reservaService: ReservaService,
    private catalogosService: CatalogosService,
  ) {}

  ngOnInit(): void {
    const oferta = this.reservaService.getOfertaActual();
    this.ofertaActual = oferta;

    let fechaIn = '';
    let fechaOut = '';

    if (oferta) {
      try {
        const tramos = oferta?.tramosDto || oferta?.tramos || [];
        if (tramos.length > 0) {
          fechaIn = tramos[0]?.fechaSalida?.substring(0, 10) || '';
          const ultimoTramo = tramos[tramos.length - 1];
          fechaOut = ultimoTramo?.fechaLlegada?.substring(0, 10) || '';
        }
      } catch {
        // Manejo silencioso en caso de fallo al extraer tramos
      }
    }

    const hotelExistente = this.reservaService.getReservaHotel();
    const destinoSugerido = this.obtenerDestinoBusqueda();
    const fechaLlegadaInicial =
      hotelExistente?.fechaCheckIn || fechaIn || this.obtenerFechaHoyIso();

    this.hotelForm = this.fb.group({
      nombreHotel: [hotelExistente?.nombreHotel || destinoSugerido, Validators.required],
      fechaLlegada: [fechaLlegadaInicial, Validators.required],
      noches: [
        hotelExistente?.noches || 2,
        [Validators.required, Validators.min(1)],
      ],
      adultos: [
        hotelExistente?.adultos || 1,
        [Validators.required, Validators.min(1)],
      ],
      ninos: [hotelExistente?.ninos || 0, [Validators.min(0)]],
      infantes: [hotelExistente?.infantes || 0, [Validators.min(0)]],
      fechaCheckIn: [
        hotelExistente?.fechaCheckIn || fechaLlegadaInicial,
        Validators.required,
      ],
      fechaCheckOut: [
        hotelExistente?.fechaCheckOut || fechaOut,
        Validators.required,
      ],
      tipoHabitacion: [
        hotelExistente?.tipoHabitacion || '',
        Validators.required,
      ],
      filtroCategoria: ['Todas'],
      filtroPrecioMax: [250],
    });

    this.actualizarCantidadPersonas();
    this.hotelForm.get('fechaLlegada')?.valueChanges.subscribe(() => {
      this.actualizarFechas();
      this.buscarHoteles();
    });
    this.hotelForm.get('noches')?.valueChanges.subscribe(() => {
      this.actualizarFechas();
      this.buscarHoteles();
    });
    this.hotelForm.get('adultos')?.valueChanges.subscribe(() => {
      this.actualizarCantidadPersonas();
      this.buscarHoteles();
    });
    this.hotelForm.get('ninos')?.valueChanges.subscribe(() => {
      this.actualizarCantidadPersonas();
      this.buscarHoteles();
    });
    this.hotelForm.get('infantes')?.valueChanges.subscribe(() => {
      this.actualizarCantidadPersonas();
      this.buscarHoteles();
    });

    this.buscarHoteles();
  }

  private actualizarFechas(): void {
    const fechaLlegada = this.hotelForm.get('fechaLlegada')?.value;
    const noches = Number(this.hotelForm.get('noches')?.value || 1);

    if (!fechaLlegada) return;

    const fechaInicio = new Date(`${fechaLlegada}T00:00:00`);
    const fechaSalida = new Date(fechaInicio);
    fechaSalida.setDate(fechaInicio.getDate() + noches);

    const formatoFecha = (fecha: Date) => fecha.toISOString().slice(0, 10);

    this.hotelForm.patchValue(
      {
        fechaCheckIn: formatoFecha(fechaInicio),
        fechaCheckOut: formatoFecha(fechaSalida),
      },
      { emitEvent: false },
    );
  }

  private actualizarCantidadPersonas(): void {}

  get precioEstimado(): number {
    const tipo = this.hotelForm.get('tipoHabitacion')?.value;
    const noches = Number(this.hotelForm.get('noches')?.value || 1);
    const precioBase = this.hotelSeleccionado?.precioPorNoche ?? 0;

    if (!tipo || !noches) return 0;

    return (this.preciosPorTipo[tipo] + precioBase) * noches;
  }

  buscarHoteles() {
    const totalPersonas = this.getTotalPersonas();
    const fechaLlegadaRaw = String(
      this.hotelForm.get('fechaLlegada')?.value || '',
    ).trim();
    const fechaLlegada = fechaLlegadaRaw || this.obtenerFechaHoyIso();
    const noches = Math.max(1, Number(this.hotelForm.get('noches')?.value || 1));
    const destino = this.obtenerDestinoBusqueda();

    const filtroCategoria =
      this.hotelForm.get('filtroCategoria')?.value || 'Todas';
    const precioMaximoValor = Number(this.hotelForm.get('filtroPrecioMax')?.value);
    const precioMaximo = Number.isFinite(precioMaximoValor)
      ? precioMaximoValor
      : 999999;

    const request: BusquedaHotelRequest = {
      destino,
      fechaLlegada,
      noches,
      adultos: Math.max(1, Number(this.hotelForm.get('adultos')?.value || 1)),
      ninos: Math.max(0, Number(this.hotelForm.get('ninos')?.value || 0)),
      infantes: Math.max(0, Number(this.hotelForm.get('infantes')?.value || 0)),
      categoria: filtroCategoria === 'Todas' ? '' : filtroCategoria,
      precioMaximo,
    };

    this.buscandoHoteles = true;
    this.catalogosService.buscarHoteles(request).subscribe({
      next: (resp) => {
        const hotelesApi: HotelDisponibleResponse[] = Array.isArray(resp?.data)
          ? resp.data
          : [];

        this.hotelesDisponibles = hotelesApi.map((hotel) => ({
          id: hotel.id,
          nombre: hotel.nombre,
          categoria: hotel.categoria,
          precioPorNoche: Number(hotel.precioPorNoche || 0),
          ubicacion: hotel.ubicacion,
          descripcion: hotel.descripcion,
          capacidad: Number(hotel.capacidad || 0),
          rating: Number(hotel.rating || 0),
        }));

        if (
          !this.hotelSeleccionado ||
          !this.hotelesDisponibles.some(
            (hotel) => hotel.nombre === this.hotelSeleccionado?.nombre,
          )
        ) {
          this.hotelSeleccionado = null;
        }

        this.mensajeBusqueda = `Se encontraron ${this.hotelesDisponibles.length} hoteles para ${totalPersonas} personas, ${noches} noche(s) y llegada el ${fechaLlegada}.`;
        this.buscandoHoteles = false;
      },
      error: (error: HttpErrorResponse) => {
        this.hotelesDisponibles = [];
        this.hotelSeleccionado = null;
        this.mensajeBusqueda =
          error?.error?.mensaje ||
          'No se pudo consultar hoteles del backend. Intenta nuevamente.';
        this.buscandoHoteles = false;
      },
    });
  }

  private obtenerDestinoBusqueda(): string {
    const destinoFormulario = String(
      this.hotelForm?.get('nombreHotel')?.value || '',
    ).trim();

    if (destinoFormulario) return destinoFormulario;

    const tramos = this.ofertaActual?.tramosDto || this.ofertaActual?.tramos || [];
    if (Array.isArray(tramos) && tramos.length > 0) {
      const ultimoTramo = tramos[tramos.length - 1];
      const destinoVuelo = String(
        ultimoTramo?.destino?.nombreCiudad ||
          ultimoTramo?.destino?.descripcion ||
          '',
      ).trim();
      if (destinoVuelo) return destinoVuelo;
    }

    return 'Lima';
  }

  private obtenerFechaHoyIso(): string {
    return new Date().toISOString().slice(0, 10);
  }

  getTotalPersonas(): number {
    const adultos = Math.max(1, Number(this.hotelForm.get('adultos')?.value || 1));
    const ninos = Math.max(0, Number(this.hotelForm.get('ninos')?.value || 0));
    const infantes = Math.max(0, Number(this.hotelForm.get('infantes')?.value || 0));
    return adultos + ninos + infantes;
  }

  aplicarFiltros() {
    this.buscarHoteles();
  }

  toggleFiltros(): void {
    this.filtrosVisibles = !this.filtrosVisibles;
  }

  seleccionarHotel(hotel: HotelDisponible) {
    this.hotelSeleccionado = hotel;
    this.hotelForm.patchValue(
      { nombreHotel: hotel.nombre },
      { emitEvent: false },
    );

    if (!hotel.id) {
      this.mensajeBusqueda =
        'Hotel seleccionado localmente, sin identificador para validar en backend.';
      return;
    }

    const fechaCheckIn = this.hotelForm.get('fechaCheckIn')?.value;
    const fechaCheckOut = this.hotelForm.get('fechaCheckOut')?.value;
    const noches = Number(this.hotelForm.get('noches')?.value || 0);
    const adultos = Math.max(1, Number(this.hotelForm.get('adultos')?.value || 1));
    const ninos = Math.max(0, Number(this.hotelForm.get('ninos')?.value || 0));
    const infantes = Math.max(0, Number(this.hotelForm.get('infantes')?.value || 0));
    const tipoHabitacionActual =
      this.hotelForm.get('tipoHabitacion')?.value || 'Simple';

    if (!this.hotelForm.get('tipoHabitacion')?.value) {
      this.hotelForm.patchValue(
        { tipoHabitacion: tipoHabitacionActual },
        { emitEvent: false },
      );
    }

    if (!fechaCheckIn || !fechaCheckOut || noches <= 0) {
      this.mensajeBusqueda =
        'Hotel seleccionado. Completa fechas/noches para validar reserva en backend.';
      return;
    }

    const request: ReservaHotelRequest = {
      hotelId: hotel.id,
      tipoHabitacion: tipoHabitacionActual,
      fechaCheckIn,
      fechaCheckOut,
      noches,
      adultos,
      ninos,
      infantes,
      titularReserva: 'WEB-CLIENTE',
    };

    this.validandoSeleccionHotel = true;
    this.catalogosService.reservarHotel(request).subscribe({
      next: (resp) => {
        const codigo = resp?.data?.codigoReserva;
        this.mensajeBusqueda = codigo
          ? `Hotel seleccionado y validado en backend. Codigo: ${codigo}.`
          : 'Hotel seleccionado y validado en backend.';
        this.validandoSeleccionHotel = false;
      },
      error: () => {
        this.mensajeBusqueda =
          'Hotel seleccionado, pero no se pudo validar la reserva en backend.';
        this.validandoSeleccionHotel = false;
      },
    });
  }

  guardar() {
    const hotelActual = this.reservaService.getReservaHotel();
    const nombreHotelFormulario = String(
      this.hotelForm.get('nombreHotel')?.value || '',
    ).trim();
    const hotelNombre =
      this.hotelSeleccionado?.nombre ||
      nombreHotelFormulario ||
      hotelActual?.nombreHotel ||
      '';

    if (this.hotelForm.invalid && !hotelActual && !this.hotelSeleccionado) {
      this.hotelForm.markAllAsTouched();
      this.mensajeBusqueda = 'Completa los datos del hotel para continuar.';
      return;
    }

    const val = this.hotelForm.value;
    const nombreHotel = hotelNombre || val.nombreHotel || 'Hotel seleccionado';
    const precioHotel = this.precioEstimado || hotelActual?.precio || 0;
    const nochesHotel = Number(val.noches || hotelActual?.noches || 1);
    const adultosHotel = Number(val.adultos || hotelActual?.adultos || 1);
    const ninosHotel = Number(val.ninos || hotelActual?.ninos || 0);
    const infantesHotel = Number(val.infantes || hotelActual?.infantes || 0);

    if (this.hotelSeleccionado || hotelActual) {
      this.reservaService.setReservaHotel({
        fechaCheckIn: val.fechaCheckIn,
        fechaCheckOut: val.fechaCheckOut,
        tipoHabitacion: val.tipoHabitacion,
        cantidadHuespedes: Number(val.cantidadPersonas || 0),
        nombreHotel,
        precio: precioHotel,
        noches: nochesHotel,
        adultos: adultosHotel,
        ninos: ninosHotel,
        infantes: infantesHotel,
      });

      // LÓGICA DE TRASLADOS POR DEFECTO
      const servicios = this.reservaService.getServiciosSeleccionados();
      if (servicios.includes('traslado')) {
        this.reservaService.generarTrasladosPorDefecto(
          nombreHotel,
          this.hotelSeleccionado?.ubicacion,
        );
      }
    }

    this.navegarAlSiguiente();
  }

  navegarAlSiguiente() {
    const servicios = this.reservaService.getServiciosSeleccionados();
    const idx = servicios.indexOf('hotel');
    const siguiente = servicios[idx + 1];
    if (siguiente) {
      this.router.navigate(['/reserva/servicios', siguiente]);
    } else {
      this.router.navigate(['/reserva/resumen-servicios']);
    }
  }

  volver() {
    this.router.navigate(['/reserva/servicios']);
  }
}