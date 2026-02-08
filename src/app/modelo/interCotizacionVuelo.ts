export interface CotizacionVuelo {
  idCotizacionVuelo: number;
  fechaCotizacion: Date;
  origen: string;
  destino: string;
  fechaIda: Date;
  fechaVuelta?: Date;
  numeroAdultos: number;
  numeroNinos: number;
  numeroInfantes: number;
  idEstadoCotizacion: number;
}