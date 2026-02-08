import { OfertasEncontradas } from "./ofertasEncontradas";

export class OfertaSeleccionada{
    private idOferta : number = 0;
    private flgProceso : string = '';
    private idOfertaIda : number = 0;
    private idOfertaVuelta : number = 0;
    private ofertaVuelo!: OfertasEncontradas;

    public get IdOferta() : number {
        return this.idOferta;
    }
    
    public set IdOferta(v : number) {
        this.idOferta = v;
    }

    public get FlgProceso() : string {
        return this.flgProceso;
    }
    
    public set FlgProceso(v : string) {
        console.log('flag set ::'+v);
        this.flgProceso = v;
    }
    
    public get IdOfertaIda() : number {
        return this.idOfertaIda;
    }
    
    public set IdOfertaIda(v : number) {
        this.idOfertaIda = v;
    }
    
    public get IdOfertaVuelta() : number {
        return this.idOfertaVuelta;
    }
    
    public set IdOfertaVuelta(v : number) {
        this.idOfertaVuelta = v;
    }

    public get OfertaVuelo() : OfertasEncontradas {
        return this.ofertaVuelo;
    }
    
    public set OfertaVuelo(v : OfertasEncontradas) {
        this.ofertaVuelo = v;
    }

}