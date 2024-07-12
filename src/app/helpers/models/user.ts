export class User {
    idUsuario: string = '';
    nombre: string = '';
    rol: number;
    constructor(usr?: User) {
        this.idUsuario = usr !== undefined ? usr.idUsuario : '';
        this.nombre = usr !== undefined ? usr.nombre : '';
        this.rol = usr !== undefined ? usr.rol : -1;

    }
}