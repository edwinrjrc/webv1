export class CostosServicio {
    private subtotalAdulto!:number;
    private subtotalNiño!:number;
    private subtotalInfante!:number;
    private numAdultos!:number;
    private numNinos!:number;
    private numInfantes!:number;
    private totalImpuestos!:number;
    private totalCargos!:number;
    private totalServicio!:number;

    public get SubtotalAdulto() : number {
        return this.subtotalAdulto;
    }
    public set SubtotalAdulto(v : number) {
        this.subtotalAdulto = v;
    }

    public get SubtotalNiño() : number {
        return this.subtotalNiño;
    }
    public set SubtotalNiño(v : number) {
        this.subtotalNiño = v;
    }

    public get SubtotalInfante() : number {
        return this.subtotalInfante;
    }
    public set SubtotalInfante(v : number) {
        this.subtotalInfante = v;
    }

    public get TotalImpuestos() : number {
        return this.totalImpuestos;
    }
    public set TotalImpuestos(v : number) {
        this.totalImpuestos = v;
    }

    public get TotalCargos() : number {
        return this.totalCargos;
    }
    public set TotalCargos(v : number) {
        this.totalCargos = v;
    }

    public get TotalServicio() : number {
        return this.totalServicio;
    }
    public set TotalServicio(v : number) {
        this.totalServicio = v;
    }

    public get NumAdultos() : number {
        return this.numAdultos;
    }
    public set NumAdultos(v : number) {
        this.numAdultos = v;
    }

    public get NumNinos() : number {
        return this.numNinos;
    }
    public set NumNinos(v : number) {
        this.numNinos = v;
    }

    public get NumInfantes() : number {
        return this.numInfantes;
    }
    public set NumInfantes(v : number) {
        this.numInfantes = v;
    }

}