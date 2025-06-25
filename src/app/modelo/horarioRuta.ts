import { HorarioVuelo } from "./horarioVuelo";

export interface HorarioRuta extends HorarioVuelo{
    equipaMochila: Boolean;
    equipaCarrion: Boolean;
    equipaBodega: Boolean;
    equipaBodegaEjecutivo: Boolean;

}