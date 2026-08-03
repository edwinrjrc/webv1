export interface TrasladoTramo {
  origen: string;
  destino: string;
  fecha: string;
  horaVuelo: string;
  horaRecojoSugerida: string;
  tipoServicio: string;
  empresa: string;
  minutosRuta: number;
  esInternacional: boolean;
}

export interface TrasladoSugeridoSeleccionado {
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

export interface Traslado {
  origen: string;
  destino: string;
  fecha: string;
  hora: string;
  tipoTraslado: string;
  precio: number;
  requiereVuelta?: boolean;
  destinoDireccion?: string;
  zonaDestino?: string;
  empresaSeleccionada?: string;
  margenLlegadaMinutos?: number;
  margenSalidaMinutos?: number;
  tramoIda?: TrasladoTramo;
  tramoVuelta?: TrasladoTramo | null;
  trasladosSeleccionados?: TrasladoSugeridoSeleccionado[];
}
