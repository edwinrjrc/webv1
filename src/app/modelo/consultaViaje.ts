export class ConsultaViaje{
    private tipoViaje!: string;
    private codigoIataOrigen!: string;
    private codigoIataDestino!: string;
    private claseVuelo!: string;
    private fechaIda!: Date;
    private fechaIdaStr!: string;
    private fechaVuelta!: Date;
    private fechaVueltaStr!: string;
    private adultos!: string;
    private ninos!: string;
    private infantes!: string;

    
    public get TipoViaje() : string {
        return this.tipoViaje
    }

    public set TipoViaje(v : string) {
        this.tipoViaje = v;
    }

    public get CodigoIataOrigen() : string {
        return this.codigoIataOrigen;
    }
    
    public set CodigoIataOrigen(v : string) {
        this.codigoIataOrigen = v;
    }
    
    public get CodigoIataDestino() : string {
        return this.codigoIataDestino;
    }

    public set CodigoIataDestino(v : string) {
        this.codigoIataDestino = v;
    }
    
    public get ClaseVuelo() : string {
        return this.claseVuelo;
    }
    
    public set ClaseVuelo(v : string) {
        this.claseVuelo = v;
    }
    
    public get FechaIda() : Date {
        return this.fechaIda;
    }
    
    public set FechaIda(v : Date) {
        this.fechaIda = v;
    }
    
    public get FechaVuelta() : Date {
        return this.fechaVuelta;
    }
    
    public set FechaVuelta(v : Date) {
        this.fechaVuelta = v;
    }
    
    public get Adultos() : string {
        return this.adultos;
    }
    
    public set Adultos(v : string) {
        this.adultos = v;
    }
    
    public get Ninos() : string {
        return this.ninos;
    }
    
    public set Ninos(v : string) {
        this.ninos = v;
    }
    
    public get Infantes() : string {
        return this.infantes;
    }
    
    public set Infantes(v : string) {
        this.infantes = v;
    }

    public set FechaIdaStr(v : string) {
        this.fechaIdaStr = v;
    }
    
    public get FechaIdaStr() : string {
        return this.fechaIdaStr;
    }

    
    public set FechaVueltaStr(v : string) {
        this.fechaVueltaStr = v;
    }
    
    public get FechaVueltaStr() : string {
        return this.fechaVueltaStr;
    }
    
    
}