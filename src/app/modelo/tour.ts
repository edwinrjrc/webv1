export interface Tour {
  id: number;
  nombre: string;
  descripcion: string;
  duracion: string;
  precio: number;
  seleccionado?: boolean;
  fecha?: string;
}
