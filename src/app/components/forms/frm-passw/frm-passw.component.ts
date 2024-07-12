import { Component, inject } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { passwStrenthValidators } from '../../../shared/validators/passw-strength';
import { notEqualsValidator } from '../../../shared/validators/passw-equals';
import { MatCommonModule } from '@angular/material/core';

@Component({
  selector: 'app-frm-passw',
  standalone: true,
  imports: [MatDialogModule, ReactiveFormsModule, MatFormFieldModule,
    MatButtonModule, MatInputModule, MatIconModule, MatCommonModule],
  templateUrl: './frm-passw.component.html',
  styleUrl: './frm-passw.component.scss'
})
export class FrmPasswComponent {
  frmPasswChange: FormGroup;
  private builder = inject(FormBuilder);
  public passwordNoValido = false;
  private readonly dialogRef = inject(MatDialogRef<FrmPasswComponent>);
  private srvUsuario = inject(UsuarioService);
  constructor() {
    this.frmPasswChange = this.builder.group({
      passw: ['', [Validators.required]],
      passwN: ['', [Validators.required, Validators.minLength(8), passwStrenthValidators()]],
      passwR: ['']

    }, { validator: notEqualsValidator() as AbstractControlOptions }
    );
  }

  getF() {
    return this.frmPasswChange.controls;
  }

  cambiarPass() {
    this.srvUsuario.savePassw(
      {
        passw: this.frmPasswChange.value.passw,
        passwN: this.frmPasswChange.value.passwN
      }
    ).subscribe((res) => {
      this.passwordNoValido = res === 401
      if (res === true) {
        this.dialogRef.close();
      }
    });

  }

}
