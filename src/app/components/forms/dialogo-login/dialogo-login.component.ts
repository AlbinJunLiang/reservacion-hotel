import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../helpers/services/auth.service';
import { Token } from '../../../helpers/models/interfaces';

@Component({
  selector: 'app-dialogo-login',
  standalone: true,
  imports: [MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatButtonModule, MatInputModule, MatIconModule],
  templateUrl: './dialogo-login.component.html',
  styleUrl: './dialogo-login.component.scss'
})
export class DialogoLoginComponent {
  readonly dialogoRef = inject(MatDialogRef<DialogoLoginComponent>);
  frmLogin: FormGroup;
  private builder = inject(FormBuilder);
  private srvAuth = inject(AuthService);
  errorLogin: boolean = false;
  constructor() {
    this.frmLogin = this.builder.group({
      id: (0),
      usuario: (''),
      passw: ('')
    });
  }
  getF() {
    return this.frmLogin.controls;
  }

  logear() {
    this.srvAuth.login(this.frmLogin.value)
      .subscribe((res) => {
        this.errorLogin = !res || res === 401;
        if (!this.errorLogin) {
          this.dialogoRef.close();
        }
      })
  }

}
