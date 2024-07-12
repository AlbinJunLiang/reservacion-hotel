import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { DialogoGeneralComponent } from '../dialogo-general/dialogo-general.component';
import { MatSelectModule } from '@angular/material/select';
import { ReservacionService } from '../../../helpers/services/reservacion.service';

@Component({
  selector: 'app-frm-reservacion',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule
    , ReactiveFormsModule, NgIf, MatSelectModule
  ],
  templateUrl: './frm-reservacion.component.html',
  styleUrl: './frm-reservacion.component.scss'
})
export class FrmReservacionComponent implements OnInit {
  titulo!: string;
  private data = inject(MAT_DIALOG_DATA);
  private builder = inject(FormBuilder);
  private reserveSrv = inject(ReservacionService);
  private readonly dialog = inject(MatDialog);
  dialogRef = inject(MatDialogRef<FrmReservacionComponent>);
  myForm: FormGroup;

  constructor() {
    this.myForm = this.builder.group({
      id: this.builder.control(0),
      idCliente: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15),
      Validators.pattern("[0-9]*")]],
      idRecepcionista: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15),
      Validators.pattern("[0-9]*")]],
      idHabitacion: ['', [Validators.required, Validators.pattern('^[1-9][0-9]*$')]],
      fechaEntrada: ['', [Validators.required, this.formatoFechaValido]],

      cantidadNoches: ['', [Validators.required, Validators.pattern('^[1-9][0-9]*$')]],
      fechaFinalizacion: ['', [Validators.required, this.formatoFechaValido]],

      montoFinal: ['', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]],
      estado: ['', [Validators.required, Validators.pattern('^(expirado|activo|EXPIRADO|ACTIVO)$')]],
    });
  }
  get F() {
    return this.myForm.controls;
  }

  onGuardar() {
    if (!this.myForm.valid) return;

    if (this.myForm.value.id === 0) {
      this.reserveSrv.guardarReservacion(this.myForm.value).
        subscribe({
          complete: () => {
            this.dialog.open(DialogoGeneralComponent, {
              data: {
                texto: "Habitacion creado correctamente",
                icono: "check",
                textoAceptar: " Aceptar ",
              }
            });
            this.dialogRef.close();
          },
          error: (e) => {

            this.dialog.open(DialogoGeneralComponent, {
              data: {
                texto: "Error no especificado, revise si los datos existen.",
                icono: "error",
                textoAceptar: " Aceptar ",
              }
            });

          }
        });
    } else {
      this.reserveSrv.guardarReservacion(this.myForm.value, this.myForm.value.id)
        .subscribe(res => console.log(res));
      this.dialogRef.close();

    }

  }
  ngOnInit(): void {
    this.titulo = this.data.title;
    if (this.data.datos) {
      this.myForm.setValue({
        id: this.data.datos[0].id,
        idCliente: this.data.datos[0].idCliente,
        idRecepcionista: this.data.datos[0].idRecepcionista,
        idHabitacion: this.data.datos[0].idHabitacion,
        fechaEntrada: this.data.datos[0].fechaEntrada,
        cantidadNoches: this.data.datos[0].cantidadNoches,
        fechaFinalizacion: this.data.datos[0].fechaFinalizacion,
        montoFinal: this.data.datos[0].montoFinal,
        estado: this.data.datos[0].estado

      });
    }
  }

  formatoFechaValido(control: { value: string }): { [key: string]: boolean } | null {
    if (!control.value.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
      return { 'formatoFechaInvalido': true };
    }
    return null;
  }
}
