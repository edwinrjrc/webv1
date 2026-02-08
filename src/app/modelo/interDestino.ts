import { Pais } from "./interPais";

export interface InterDestino{
    id: Number;
    descripcion: string;
    nombreDestino: string;
    nombreCiudad: string;
    pais: Pais;
    codigoIata: string;
    codigoIataAeropuerto: string;
    codigoIataCiudad: string;
    nombreAeropuertoMostrar: string;
    idUsuarioRegistro: Number;
    fechaRegistro: Date;
    idUsuarioModificacion: Number;
    fechaModificacion: Date;
    idEstadoRegistro: number;
}