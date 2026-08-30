import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ReservaService } from '../../_services/reserva.service';
import type { EmpresaTraslado } from '../../modelo/empresaTraslado';
import type { TipoServicio } from '../../modelo/tipoServicio';
import type { DireccionSugerida } from '../../modelo/direccionSugerida';
import type { TrasladoItem } from '../../modelo/trasladoItem';


@Component({
  selector: 'app-traslado',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './traslado.component.html',
  styleUrls: ['./traslado.component.css'],
})
export class TrasladoComponent implements OnInit {
  trasladoForm!: FormGroup;

  // Estado del itinerario / banderas
  permiteVuelta: boolean = true;
  tieneTrasladosFormularioEnLista: boolean = false;
  mensajeLista: string = '';

  // Datos para listas desplegables y sugerencias
  empresasEnroladas: EmpresaTraslado[] = [
    { id: 'movego', nombre: 'MoveGo Transfers' },
    { id: 'transvip', nombre: 'TransVip Express' },
    { id: 'innova_shuttle', nombre: 'Innova Shuttle Service' },
  ];

  tiposServicio: TipoServicio[] = [
    { id: 'economico', nombre: 'Económico' },
    { id: 'ejecutivo', nombre: 'Ejecutivo' },
    { id: 'vip', nombre: 'VIP / Privado' },
  ];

  direccionesSugeridas: DireccionSugerida[] = [
    { direccion: 'Hotel Marriott - Av. Larco 1300, Miraflores' },
    { direccion: 'Hotel Swissôtel - Av. Santo Toribio 173, San Isidro' },
    { direccion: 'Hotel Hilton - Calle La Paz 1099, Miraflores' },
  ];

  trasladosSugeridos: TrasladoItem[] = [
    {
      id: 'sug-1',
      nombre: 'Traslado Estándar - Aeropuerto a Hotel',
      empresaId: 'movego',
      empresaNombre: 'MoveGo Transfers',
      destinoDireccion: 'Hotel Marriott Miraflores',
      tipoServicio: 'economico',
      precio: 35.0,
      horaRecojoIda: '17:56',
    },
    {
      id: 'sug-2',
      nombre: 'Traslado VIP - Aeropuerto a Destino (Ida y Vuelta)',
      empresaId: 'transvip',
      empresaNombre: 'TransVip Express',
      destinoDireccion: 'Centro Empresarial San Isidro',
      tipoServicio: 'vip',
      precio: 75.0,
      horaRecojoIda: '10:30',
      fechaRecojoVuelta: '2026-09-15',
      horaRecojoVuelta: '14:00',
    },
  ];

  trasladosSeleccionados: TrasladoItem[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private reservaService: ReservaService,
  ) {}

  ngOnInit(): void {
    this.initForm();

    const trasladosGuardados = this.reservaService.getTraslados();
    if (trasladosGuardados && trasladosGuardados.length > 0) {
      this.trasladosSeleccionados = trasladosGuardados;
      this.tieneTrasladosFormularioEnLista = this.trasladosSeleccionados.some(
        (item) => item.id.startsWith('form-'),
      );

      // Autocompletar el formulario con los datos del primer traslado guardado
      const primerTraslado = trasladosGuardados[0];
      this.trasladoForm.patchValue(
        {
          destinoDireccion: primerTraslado.destinoDireccion,
          empresa: primerTraslado.empresaId || 'movego',
          tipoServicio: primerTraslado.tipoServicio || 'economico',
          requiereVuelta: trasladosGuardados.some((t) => t.esVuelta),
        },
        { emitEvent: false },
      );
    }
  }

  /**
   * Inicializa el FormGroup con las reglas requeridas.
   * Sin invocar marcas de toque para no mostrar errores al cargar la vista.
   */
  private initForm(): void {
    this.trasladoForm = this.fb.group({
      empresa: ['movego', Validators.required],
      destinoDireccion: ['', Validators.required],
      tipoServicio: ['', Validators.required], // Control unificado
      requiereVuelta: [false],
    });
  }

  // Getters para fácil acceso en el template o TS
  get totalListaTraslados(): number {
    return this.trasladosSeleccionados.reduce(
      (acc, item) => acc + item.precio,
      0,
    );
  }

  // Comprueba si un traslado sugerido ya fue incluido en la lista
  existeEnLista(id: string): boolean {
    return this.trasladosSeleccionados.some((item) => item.id === id);
  }

  // Determina si el traslado es hacia el aeropuerto (retorno)
  esTrasladoHaciaAeropuerto(item: TrasladoItem): boolean {
    return !!item.esVuelta;
  }

  /**
   * Agrega el traslado configurado en el formulario a la lista de traslados seleccionados.
   */
  agregarTrasladosFormulario(): void {
    if (this.trasladoForm.invalid) {
      this.trasladoForm.markAllAsTouched();
      this.mensajeLista =
        'Por favor, completa todos los campos requeridos (*).';
      return;
    }

    this.mensajeLista = '';
    const formValue = this.trasladoForm.value;
    const empresaObj = this.empresasEnroladas.find(
      (e) => e.id === formValue.empresa,
    );
    const tipoObj = this.tiposServicio.find(
      (t) => t.id === formValue.tipoServicio,
    );

    const nuevoTraslado: TrasladoItem = {
      id: 'form-' + Date.now(),
      nombre: `Traslado ${tipoObj?.nombre || ''} - Aeropuerto a destino`,
      empresaId: formValue.empresa,
      empresaNombre: empresaObj?.nombre || 'Proveedor',
      destinoDireccion: formValue.destinoDireccion,
      tipoServicio: formValue.tipoServicio,
      precio: formValue.tipoServicio === 'vip' ? 60.0 : 35.0,
      horaRecojoIda: '18:00',
    };

    this.trasladosSeleccionados.push(nuevoTraslado);

    // Si marcó la opción de agregar traslado de vuelta
    if (formValue.requiereVuelta && this.permiteVuelta) {
      const nuevoTrasladoVuelta: TrasladoItem = {
        id: 'form-v-' + Date.now(),
        nombre: `Traslado ${tipoObj?.nombre || ''} - Destino a aeropuerto`,
        empresaId: formValue.empresa,
        empresaNombre: empresaObj?.nombre || 'Proveedor',
        destinoDireccion: formValue.destinoDireccion,
        tipoServicio: formValue.tipoServicio,
        precio: formValue.tipoServicio === 'vip' ? 60.0 : 35.0,
        fechaRecojoVuelta: '2026-09-20',
        horaRecojoVuelta: '10:00',
        esVuelta: true,
      };
      this.trasladosSeleccionados.push(nuevoTrasladoVuelta);
    }

    this.tieneTrasladosFormularioEnLista = true;
  }

  /**
   * Carga los datos del formulario si se requieren editar.
   */
  editarTrasladosFormulario(): void {
    if (this.trasladosSeleccionados.length > 0) {
      const ultimo = this.trasladosSeleccionados[0];
      this.trasladoForm.patchValue({
        empresa: ultimo.empresaId,
        destinoDireccion: ultimo.destinoDireccion,
        tipoServicio: ultimo.tipoServicio,
      });
    }
  }

  /**
   * Elimina de la lista los traslados agregados mediante el formulario.
   */
  eliminarTrasladosFormulario(): void {
    this.trasladosSeleccionados = this.trasladosSeleccionados.filter(
      (item) => !item.id.startsWith('form-'),
    );
    this.tieneTrasladosFormularioEnLista = false;
  }

  /**
   * Agrega un elemento desde la lista de sugerencias.
   */
  agregarTrasladoSugerido(sugerido: TrasladoItem): void {
    if (!this.existeEnLista(sugerido.id)) {
      this.trasladosSeleccionados.push(sugerido);
    }
  }

  /**
   * Edita un ítem de la lista seleccionada.
   */
  editarTrasladoSeleccionado(id: string): void {
    const item = this.trasladosSeleccionados.find((t) => t.id === id);
    if (item) {
      this.trasladoForm.patchValue({
        empresa: item.empresaId,
        destinoDireccion: item.destinoDireccion,
        tipoServicio: item.tipoServicio,
      });
    }
  }

  /**
   * Quita un ítem específico de la lista.
   */
  quitarTrasladoSeleccionado(id: string): void {
    this.trasladosSeleccionados = this.trasladosSeleccionados.filter(
      (item) => item.id !== id,
    );
    this.tieneTrasladosFormularioEnLista = this.trasladosSeleccionados.some(
      (item) => item.id.startsWith('form-'),
    );
  }

  /**
   * Navega a la vista anterior.
   */
  volver(): void {
    this.router.navigate(['/reserva/servicios']);
  }

  /**
   * Navega dinámicamente al siguiente servicio según la lista contratada.
   */
  navegarAlSiguiente(): void {
    const servicios = this.reservaService.getServiciosSeleccionados();
    const idx = servicios.indexOf('traslado');
    const siguiente = servicios[idx + 1];

    if (siguiente) {
      this.router.navigate(['/reserva/servicios', siguiente]);
    } else {
      this.router.navigate(['/reserva/resumen-servicios']);
    }
  }

  /**
   * Guarda las elecciones y avanza al siguiente paso del flujo de reserva.
   */
  guardar(): void {
    if (this.trasladosSeleccionados.length === 0 && this.trasladoForm.invalid) {
      this.trasladoForm.markAllAsTouched();
      this.mensajeLista =
        'Por favor agrega al menos un traslado o completa el formulario para continuar.';
      return;
    }

    // Almacena los ítems seleccionados en el ReservaService
    this.reservaService.setTraslados(this.trasladosSeleccionados);

    // Navega dinámicamente al siguiente paso del flujo
    this.navegarAlSiguiente();
  }
}