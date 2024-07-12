import { Component, OnInit, inject } from '@angular/core';
import { DialogoLoginComponent } from '../forms/dialogo-login/dialogo-login.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../helpers/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatDialogModule,DialogoLoginComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private srvAuth = inject(AuthService);
  ngOnInit(): void {
   const dialogRef =  this.dialog.open(DialogoLoginComponent, {
      width: '450px'
    })
    dialogRef.afterClosed().subscribe(()=>{
      if(!this.srvAuth.isLogged())
        location.reload();
    })
  }
}
