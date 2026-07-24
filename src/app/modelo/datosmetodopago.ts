export class DatosMetodoPago{
    private numTarjeta!: string;
    private fechaExpiracion!: string
    private codigoSeguridad!: string;
    private nombreTitular!: string;

    public get NumTarjeta() : string {
        return this.numTarjeta;
    }
    public set NumTarjeta(v : string) {
        this.numTarjeta = v;
    }
    public get FechaExpiracion() : string {
        return this.fechaExpiracion;
    }
    public set FechaExpiracion(v : string) {
        this.fechaExpiracion = v;
    }
    public get CodigoSeguridad() : string {
        return this.codigoSeguridad;
    }
    public set CodigoSeguridad(v : string) {
        this.codigoSeguridad = v;
    }

    public get NombreTitular() : string {
        return this.nombreTitular;
    }
    public set NombreTitular(v : string) {
        this.nombreTitular = v;
    }
}