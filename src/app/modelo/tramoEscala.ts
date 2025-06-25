import { Aeropuerto } from "./aeropuerto";
import { Avion } from "./avion";
import { HorarioVuelo } from "./horarioVuelo";

export interface TramoEscala{
    origen: Aeropuerto;
    destino: Aeropuerto;
    horarioVuelo: HorarioVuelo;
    avionTramo: Avion;
    numeroVuelo: String;
}