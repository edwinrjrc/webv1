import { Aerolinea } from "./aerolinea";
import { Aeropuerto } from "./aeropuerto";

export interface TramoBase{
    fechaSalidaVuelo: Date;
    fechaLlegadaVuelo: Date;
    origen: Aeropuerto;
    destino: Aeropuerto;
    aerolineaDto: Aerolinea;
    equipajeMochila: boolean;
    equipajeBodega: boolean;
    equipajeBodegaEjecutivo: boolean;
    
}