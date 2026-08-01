export interface ReservaHotel {
  fechaCheckIn: string;
  fechaCheckOut: string;
  tipoHabitacion: string;
  cantidadHuespedes: number;
  nombreHotel?: string;
  precio: number;
  noches?: number;
  adultos?: number;
  ninos?: number;
  infantes?: number;
}
