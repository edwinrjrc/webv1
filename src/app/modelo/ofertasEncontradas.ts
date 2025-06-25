import { PrecioOferta } from "./precioOferta";
import { RutaTramo } from "./rutaTramo";

export interface OfertasEncontradas{
    id: number;
    listaRutaTramos: RutaTramo[];
    precioOfertaDto: PrecioOferta;
}