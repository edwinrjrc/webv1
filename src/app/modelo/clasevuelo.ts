export class Clasevuelo{
    private codigoClase: string = '';
    private nombreClase: string = '';

    
    public set CodigoClase(v : string) {
        this.codigoClase = v;
    }
    
    public get CodigoClase() : string {
        return this.codigoClase;
    }
    
    public set NombreClase(v : string) {
        this.nombreClase = v;
    }
    
    public get NombreClase() : string {
        return this.nombreClase;
    }
    
}