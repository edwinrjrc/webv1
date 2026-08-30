export interface TrasladoItem {
  id: string;
  nombre: string;
  empresaId: string;
  empresaNombre: string;
  destinoDireccion: string;
  tipoServicio: string;
  precio: number;
  horaRecojoIda?: string;
  fechaRecojoVuelta?: string;
  horaRecojoVuelta?: string;
  esVuelta?: boolean;
  incluyeVuelta?: boolean;
}