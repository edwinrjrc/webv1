import { Aeropuerto } from "./aeropuerto";
import { HorarioRuta } from "./horarioRuta";
import { TramoEscala } from "./tramoEscala";

export interface RutaTramo{
    id: Number;
    origen: Aeropuerto;
    destino: Aeropuerto;
    horariosRuta: HorarioRuta[];
    numeroOrden: Number;
    fechaViaje: Date;
    tipoViaje: Number;
}