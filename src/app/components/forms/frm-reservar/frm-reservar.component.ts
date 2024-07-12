import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { DialogoGeneralComponent } from '../dialogo-general/dialogo-general.component';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../../helpers/services/auth.service';
import { ReservacionService } from '../../../helpers/services/reservacion.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-frm-reservar',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule
    , ReactiveFormsModule, NgIf, MatSelectModule, MatIconModule
  ],
  templateUrl: './frm-reservar.component.html',
  styleUrl: './frm-reservar.component.scss'
})
export class FrmReservarComponent implements OnInit {
  titulo!: string;
  private data = inject(MAT_DIALOG_DATA);
  private builder = inject(FormBuilder);
  private reserveSrv = inject(ReservacionService);
  private readonly dialog = inject(MatDialog);
  private recepcionista = inject(AuthService).valorUsrActual;

  dialogRef = inject(MatDialogRef<FrmReservarComponent>);
  myForm: FormGroup;

  constructor() {
    this.myForm = this.builder.group({
      id: this.builder.control(0),
      idCliente: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15),
        Validators.pattern("[0-9]*")]],     
         cantidadNoches: ['', [Validators.required, Validators.pattern('^[1-9][0-9]*$')]],

    });
  }
  get F() {
    return {
      idCliente: (this.myForm.value.idCliente).toString(),
      idRecepcionista: (this.recepcionista.idUsuario).toString(),
      idHabitacion: parseInt(this.data.idHabitacion),
      cantidadNoches: parseInt(this.myForm.value.cantidadNoches)
    };
  }




  onReservar() {


    const reservationData = this.F;
    this.reserveSrv.reservarHabitacion(reservationData) // Use the actual ID from the form data
      .subscribe({
        complete: () => {
          this.dialog.open(DialogoGeneralComponent, {
            data: {
              texto: "Reservado correctamente",
              icono: "check",
              textoAceptar: " Aceptar ",
            }
          });
          this.dialogRef.close();
        },
        error: (error) => {
          this.dialog.open(DialogoGeneralComponent, {
            data: {
              texto: "Verifique que haya ingresado correctamente el id.",
              icono: "error",
              textoAceptar: " Aceptar ",
            }
          });
        }
      });
  }

  ngOnInit(): void {
    this.titulo = 'Reservar habitacion';
    if (this.data.datos) {
      this.myForm.setValue({
        id: this.data.datos[0].id,
        idCliente: this.data.datos[0].idCliente,
        cantidadNoches: this.data.datos[0].cantidadNoches,

      });
    }
  }
}
