export class DatosPasajero{
    private id!: number;
    private nombres!: string;
    private primerApellido!: string;
    private segundoApellido!: string;
    private codigoPaisResidencia!: number;
    private fechaNacimiento!: string;
    private tipoDocumento!: number;
    private numeroDocumento!: string;
    private sexo!: string;
    private correoElectronico!: string;
    private codigoPais!: string;
    private numeroTelefono!: string;
    private fechaExpiracionDoc!: string;
    private requiereAsistencia!: string;
    private tipoPasajero!: number;
    
    public get Id() : number {
        return this.id;
    }
    
    public set Id(v : number) {
        this.id = v;
    }
    
    public get Nombres() : string {
        return this.nombres;
    }
    
    public set Nombres(v : string) {
        this.nombres = v;
    }
    
    public get PrimerApellido() : string {
        return this.primerApellido;
    }

    public set PrimerApellido(v : string) {
        this.primerApellido = v;
    }
    
    public get SegundoApellido() : string {
        return this.segundoApellido;
    }

    public set SegundoApellido(v : string) {
        this.segundoApellido = v;
    }
    
    public get CodigoPaisResidencial() : number {
        return this.codigoPaisResidencia;
    }
    
    public set CodigoPaisResidencial(v : number) {
        this.codigoPaisResidencia = v;
    }

    public get FechaNacimiento() : string {
        return this.fechaNacimiento;
    }
    
    public set FechaNacimiento(v : string) {
        this.fechaNacimiento = v;
    }
    
    public get TipoDocumento() : number {
        return this.tipoDocumento;
    }
    
    public set TipoDocumento(v : number) {
        this.tipoDocumento = v;
    }
    
    public get NumeroDocumento() : string {
        return this.numeroDocumento;
    }
    
    public set NumeroDocumento(v : string) {
        this.numeroDocumento = v;
    }
    
    public get Sexo() : string {
        return this.sexo;
    }

    public set Sexo(v : string) {
        this.sexo = v;
    }
    
    public get CorreoElectronico() : string {
        return this.correoElectronico;
    }

    public set CorreoElectronico(v : string) {
        this.correoElectronico = v;
    }
    
    public get CodigoPais() : string {
        return this.codigoPais;
    }
    
    public set CodigoPais(v : string) {
        this.codigoPais = v;
    }

    public get NumeroTelefono() : string {
        return this.numeroTelefono;
    }
    
    public set NumeroTelefono(v : string) {
        this.numeroTelefono = v;
    }

    public get FechaExpiracionDoc() : string {
        return this.fechaExpiracionDoc;
    }

    public set FechaExpiracionDoc(v : string) {
        this.fechaExpiracionDoc = v;
    }

    public get RequiereAsistencia() : string {
        return this.requiereAsistencia;
    }

    public set RequiereAsistencia(v : string) {
        this.requiereAsistencia = v;
    }
    
    public get TipoPasajero() : number {
        return this.tipoPasajero;
    }

    public set TipoPasajero(v : number) {
        this.tipoPasajero = v;
    }

}