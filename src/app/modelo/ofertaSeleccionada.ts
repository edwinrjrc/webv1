export class OfertaSeleccionada{
    private idOferta : number = 0;
    private flgProceso : string = '';

    public get IdOferta() : number {
        return this.idOferta;
    }
    
    public set IdOferta(v : number) {
        this.idOferta = v;
    }

    public get FlgProceso() : string {
        console.log('flag get ::'+this.flgProceso);
        return this.flgProceso;
    }
    
    public set FlgProceso(v : string) {
        console.log('flag set ::'+v);
        this.flgProceso = v;
    }

}