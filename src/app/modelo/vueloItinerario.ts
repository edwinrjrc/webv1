export interface VueloItinerario {
  origen: string;
  destino: string;
  fechaSalida: string;  // Formato YYYY-MM-DD
  fechaRetorno?: string; // Formato YYYY-MM-DD
  hotelDireccion?: string;
}