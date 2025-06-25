import { OfertasEncontradas } from "./ofertasEncontradas";

export interface VuelosEncontrados{
    idUsuarioRegistro: Number;
    fechaRegistro: Date;
    idUsuarioModificacion: Number;
    fechaModificacion: Date;
    idEstadoRegistro: Number;
    ofertasEncontradas: OfertasEncontradas[];
}