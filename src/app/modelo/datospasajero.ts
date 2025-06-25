export class DatosPasajero{
    id!: number;
    nombres!: string;
    primerApellido!: string;
    segundoApellido!: string;
    codigoPaisResidencia!: number;
    fechaNacimiento!: Date;
    tipoDocumento!: number;
    numeroDocumento!: string;
    sexo!: string;
    correoElectronico!: string;
    codigoPais!: number;
    numeroTelefono!: string;

    
    public get Id() : number {
        return this.id;
    }
    
    public set Id(v : number) {
        this.id = v;
    }
    
    
    public get Nombres() : string {
        return this.nombres;
    }
    
}