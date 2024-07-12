import { Component, HostListener, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon'
import { MatButton } from '@angular/material/button'
import { MatSidenavModule } from '@angular/material/sidenav'
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { AuthService } from './helpers/services/auth.service';
import { User } from './helpers/models/user';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { FrmPasswComponent } from './components/forms/frm-passw/frm-passw.component';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatIconModule, MatButton, MatSidenavModule
    , SideNavComponent, CommonModule, MatMenuModule, MatMenuTrigger, MatDividerModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  authSrv = inject(AuthService);
  dialog = inject(MatDialog);
  usuario$!: Observable<User>;
  collapsed = signal(false);
  sidenavWidth = computed(() => this.collapsed() ? '65px' : '250px');

  @HostListener("window:beforeunload", ["$event"]) unloadHandller() {
    this.logOut();
  }

  logOut() {
    this.authSrv.logout();
  }

  ngOnInit(): void {
    this.usuario$ = this.authSrv.usrActual;
  }
  changePasswForm() {
    this.dialog.open(FrmPasswComponent, {
      width: '450px'
    });
  }
}
