import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list'
import { RouterModule } from '@angular/router';
import { AuthService } from '../../helpers/services/auth.service';
import { Observable } from 'rxjs';
import { User } from '../../helpers/models/user';


type MenuItem = {
  icon: string;
  label: string;
  route: string;
}
@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, RouterModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent implements OnInit {
  nombre: string = '';
  usuario$! : Observable<User>;
  sideNavCollapsed = signal(false);
  @Input() set collapsed(val: boolean) {
    this.sideNavCollapsed.set(val);
  }
  srvAuth = inject(AuthService);
  menuItems = signal<MenuItem[]>([
    {
      icon: 'home',
      label: 'Inicio',
      route: 'home'
    },
    {
      icon: 'people',
      label: 'Clientes',
      route: 'clientes'
    },
    {
      icon: 'account_box',
      label: 'Recepcionista',
      route: 'recepcionistas'
    },
    {
      icon: 'supervisor_account',
      label: 'Administrador',
      route: 'administradores'
    },
    {
      icon: 'hotel',
      label: 'Habitacion',
      route: 'habitaciones'
    },
    {
      icon: 'fact_check',
      label: 'Reservacion',
      route: 'reservaciones'
    }
  ]);
  ngOnInit(): void {
    this.usuario$ = this.srvAuth.usrActual;

  }
}
