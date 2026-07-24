import { CostosServicio } from "./datosCostosServicio";
import { DatosMetodoPago } from "./datosmetodopago";
import { DatosPasajero } from "./datospasajero";

export class DatosCompraTotal{
    private pasajeros!: DatosPasajero[];
    private metodoPago!: DatosMetodoPago;
    private costoServicio!: CostosServicio;
    
    public get Pasajeros() : DatosPasajero[] {
        return this.pasajeros;
    }
    public get MetodoPago() : DatosMetodoPago {
        return this.metodoPago;
    }
    public get CostoServicio() : CostosServicio {
        return this.costoServicio;
    }
    public set Pasajeros(v : DatosPasajero[]) {
        this.pasajeros = v;
    }
    public set MetodoPago(v : DatosMetodoPago) {
        this.metodoPago = v;
    }
    public set CostoServicio(v : CostosServicio) {
        this.costoServicio = v;
    }

}