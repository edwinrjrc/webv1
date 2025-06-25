import { Aerolinea } from "./aerolinea";
import { TramoEscala } from "./tramoEscala";

export interface HorarioVuelo{
    id: Number;
    fechaSalidaVuelo: Date;
    fechaLlegadaVuelo: Date;
    aerolineaDto: Aerolinea;
    escalas: TramoEscala[];
    inEscalas: Number;
    numeroEscalas: Number;
}