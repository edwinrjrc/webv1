import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ReservaService } from '../../_services/reserva.service';

interface HotelDisponible {
  nombre: string;
  categoria: string;
  precioPorNoche: number;
  ubicacion: string;
  descripcion: string;
  capacidad: number;
  disponibleDesde: string;
  disponibleHasta: string;
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
  filtrosVisibles = true;
  tiposHabitacion = ['Simple', 'Doble', 'Suite', 'Familiar'];
  preciosPorTipo: Record<string, number> = {
    Simple: 80,
    Doble: 120,
    Suite: 250,
    Familiar: 180,
  };
  hotelesDisponibles: HotelDisponible[] = [];
  hotelesBase: HotelDisponible[] = [];
  hotelSeleccionado: HotelDisponible | null = null;
  mensajeBusqueda = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private reservaService: ReservaService,
  ) {}

  ngOnInit(): void {
    const oferta = this.reservaService.getOfertaActual();

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
        // use empty dates if parsing fails
      }
    }

    const hotelExistente = this.reservaService.getReservaHotel();

    this.hotelForm = this.fb.group({
      nombreHotel: [hotelExistente?.nombreHotel || '', Validators.required],
      fechaLlegada: [hotelExistente?.fechaCheckIn || fechaIn, Validators.required],
      noches: [hotelExistente?.noches || 2, [Validators.required, Validators.min(1)]],
      adultos: [hotelExistente?.adultos || 1, [Validators.required, Validators.min(1)]],
      ninos: [hotelExistente?.ninos || 0, [Validators.min(0)]],
      infantes: [hotelExistente?.infantes || 0, [Validators.min(0)]],
      fechaCheckIn: [hotelExistente?.fechaCheckIn || fechaIn, Validators.required],
      fechaCheckOut: [hotelExistente?.fechaCheckOut || fechaOut, Validators.required],
      tipoHabitacion: [hotelExistente?.tipoHabitacion || '', Validators.required],
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

    if (!fechaLlegada) {
      return;
    }

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

  private actualizarCantidadPersonas(): void {
    // No se necesita un control adicional para personas; el total se calcula solo para filtrado.
  }

  get precioEstimado(): number {
    const tipo = this.hotelForm.get('tipoHabitacion')?.value;
    const noches = Number(this.hotelForm.get('noches')?.value || 1);
    const precioBase = this.hotelSeleccionado?.precioPorNoche ?? 0;

    if (!tipo || !noches) {
      return 0;
    }

    return (this.preciosPorTipo[tipo] + precioBase) * noches;
  }

  buscarHoteles() {
    const totalPersonas = this.getTotalPersonas();
    const fechaLlegada = this.hotelForm.get('fechaLlegada')?.value || '';
    const noches = Number(this.hotelForm.get('noches')?.value || 1);

    const hotelesBase: HotelDisponible[] = [
      {
        nombre: 'Hotel Costa Azul',
        categoria: '5★',
        precioPorNoche: 180,
        ubicacion: 'Playas del Carmen',
        descripcion: 'Hotel frente al mar con desayuno incluido y excelente conexión para familias.',
        capacidad: 4,
        disponibleDesde: '2026-01-01',
        disponibleHasta: '2026-12-31',
        rating: 4.9,
      },
      {
        nombre: 'Hotel Sol y Mar',
        categoria: '4★',
        precioPorNoche: 140,
        ubicacion: 'Centro Histórico',
        descripcion: 'Ideal para viajeros que desean comodidad y fácil acceso a los puntos turísticos.',
        capacidad: 3,
        disponibleDesde: '2026-01-01',
        disponibleHasta: '2026-12-31',
        rating: 4.5,
      },
      {
        nombre: 'Hotel Horizonte',
        categoria: '4★',
        precioPorNoche: 160,
        ubicacion: 'Zona de negocios',
        descripcion: 'Perfecto para estadías cortas y viajeros que priorizan la conectividad.',
        capacidad: 5,
        disponibleDesde: '2026-06-01',
        disponibleHasta: '2026-10-31',
        rating: 4.3,
      },
      {
        nombre: 'Hotel El Bosque',
        categoria: '3★',
        precioPorNoche: 110,
        ubicacion: 'Sur del distrito',
        descripcion: 'Opción económica para estancias largas con servicios básicos y buen desayuno.',
        capacidad: 2,
        disponibleDesde: '2026-01-01',
        disponibleHasta: '2026-12-31',
        rating: 4.0,
      },
    ];

    this.hotelesBase = hotelesBase;

    const hotelesFiltrados = hotelesBase.filter((hotel) => {
      const capacidadAdecuada = totalPersonas <= hotel.capacidad;
      const dentroDelRango = (!fechaLlegada || (fechaLlegada >= hotel.disponibleDesde && fechaLlegada <= hotel.disponibleHasta));
      const filtroCategoria = this.hotelForm.get('filtroCategoria')?.value || 'Todas';
      const filtroPrecioMax = Number(this.hotelForm.get('filtroPrecioMax')?.value || 250);
      const cumpleCategoria = filtroCategoria === 'Todas' || hotel.categoria === filtroCategoria;
      const cumplePrecio = hotel.precioPorNoche <= filtroPrecioMax;
      return capacidadAdecuada && dentroDelRango && cumpleCategoria && cumplePrecio;
    });

    const hotelesOrdenados = [...hotelesFiltrados].sort((a, b) => {
      const diferenciaPrecio = a.precioPorNoche - b.precioPorNoche;
      const diferenciaRating = b.rating - a.rating;
      return diferenciaPrecio + diferenciaRating * 0.01;
    });

    this.hotelesDisponibles = hotelesOrdenados.length > 0 ? hotelesOrdenados : hotelesBase;

    if (!this.hotelSeleccionado || !this.hotelesDisponibles.some((hotel) => hotel.nombre === this.hotelSeleccionado?.nombre)) {
      this.hotelSeleccionado = null;
    }

    this.mensajeBusqueda = `Se encontraron ${this.hotelesDisponibles.length} hoteles para ${totalPersonas} personas, ${noches} noche(s) y llegada el ${fechaLlegada || 'sin fecha'}.`;
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
    this.hotelForm.patchValue({ nombreHotel: hotel.nombre }, { emitEvent: false });
  }

  guardar() {
    if (this.hotelForm.invalid || !this.hotelSeleccionado) {
      this.hotelForm.markAllAsTouched();
      this.mensajeBusqueda = 'Selecciona un hotel de la lista para continuar.';
      return;
    }

    const val = this.hotelForm.value;
    this.reservaService.setReservaHotel({
      fechaCheckIn: val.fechaCheckIn,
      fechaCheckOut: val.fechaCheckOut,
      tipoHabitacion: val.tipoHabitacion,
      cantidadHuespedes: Number(val.cantidadPersonas),
      nombreHotel: this.hotelSeleccionado.nombre,
      precio: this.precioEstimado,
      noches: Number(val.noches),
      adultos: Number(val.adultos),
      ninos: Number(val.ninos),
      infantes: Number(val.infantes),
    });

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
