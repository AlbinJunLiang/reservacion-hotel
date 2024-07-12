import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './shared/guards/auth.guard';
import { Role } from './helpers/models/role';
import { Error403Component } from './components/error403/error403.component';
import { loginGuard } from './shared/guards/login.guard';
import { RecepcionistaComponent } from './components/recepcionista/recepcionista.component';
import { AdministradorComponent } from './components/administrador/administrador.component';
import { HabitacionComponent } from './components/habitacion/habitacion.component';
import { ReservacionComponent } from './components/reservacion/reservacion.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, canActivate: [authGuard] },
    {
        path: 'clientes', component: ClienteComponent, canActivate: [authGuard],
        data: { roles: [Role.Admin, Role.Recepcionista] }
    },
    {
        path: 'recepcionistas', component: RecepcionistaComponent, canActivate: [authGuard],
        data: { roles: [Role.Admin] }
    },
    {
        path: 'administradores', component: AdministradorComponent, canActivate: [authGuard],
        data: { roles: [Role.Admin] }
    },
    {
        path: 'habitaciones', component: HabitacionComponent, canActivate: [authGuard],
        data: { roles: [Role.Admin, Role.Recepcionista, Role.Cliente] }
    },
    {
        path: 'reservaciones', component: ReservacionComponent,
        canActivate: [authGuard],
        data: { roles: [Role.Admin, Role.Recepcionista, Role.Cliente] }
    },


    { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
    { path: 'error403', component: Error403Component }
];
