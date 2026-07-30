export interface ServicioAdicional {
  tipo: 'hotel' | 'rentacarro' | 'traslado' | 'tours';
  nombre: string;
  precio: number;
  completado: boolean;
}
