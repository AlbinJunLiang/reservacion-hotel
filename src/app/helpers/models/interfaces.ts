export interface TipoUsuario {
  id: number;
  idUsuario: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  celular: string;
  direccion: string;
  correo: string;
  fechaIngreso: string;
}

export interface IReservacion{
  idCliente: string;
  idRecepcionista: string;
  idHabitacion: number;
  fechaEntrada: string;
  cantidadNoches: number;
}

export interface IHabitacion {
  id: number;
  tipo: string;
  descripcion: string;
  cantidadHuesped: number;
  tarifa: number;
  imagen: string;
  disponibilidad: boolean;
}

export interface IUser {
  idUsuario: string,
  nombre: string,
  rol: string
}

export interface Token {
  token: string,
  tkRef: string
}