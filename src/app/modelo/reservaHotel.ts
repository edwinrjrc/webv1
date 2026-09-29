export interface ReservaHotel {
  hotelId?: string;
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
  categoria?: string;
  precioPorNoche?: number;
  ubicacion?: string;
  descripcion?: string;
  capacidad?: number;
  rating?: number;
}
