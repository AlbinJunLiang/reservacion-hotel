import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HabitacionService } from '../../../helpers/services/habitacion.service';
import { NgIf } from '@angular/common';
import { DialogoGeneralComponent } from '../dialogo-general/dialogo-general.component';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-frm-habitacion',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule
    , ReactiveFormsModule, NgIf, MatSelectModule
  ],
  templateUrl: './frm-habitacion.component.html',
  styleUrl: './frm-habitacion.component.scss'
})
export class FrmHabitacionComponent implements OnInit {
  titulo!: string;
  private data = inject(MAT_DIALOG_DATA);
  private builder = inject(FormBuilder);
  private roomSrv = inject(HabitacionService);
  private readonly dialog = inject(MatDialog);
  dialogRef = inject(MatDialogRef<FrmHabitacionComponent>);
  myForm: FormGroup;

  constructor() {
    this.myForm = this.builder.group({
      id: this.builder.control(0),
      tipo: ['', [Validators.maxLength(50)]],
      descripcion: ['', [Validators.maxLength(350)]],
      cantidadHuesped: ['', [Validators.required, Validators.pattern('^[1-9][0-9]*$')]],
      tarifa: ['', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]],
      imagen: ['',[Validators.maxLength(1500)]],
      disponibilidad: ['', [Validators.required, Validators.pattern('^[01]$')]],
    });
  }
  get F() {
    return this.myForm.controls;
  }

  onGuardar() {
    if (!this.myForm.valid) return;

    if (this.myForm.value.id === 0) {
      this.roomSrv.guardarHabitacion(this.myForm.value).
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
                texto: "Error no especificado",
                icono: "error",
                textoAceptar: " Aceptar ",
              }
            });

          }
        });
    } else {
      this.roomSrv.guardarHabitacion(this.myForm.value, this.myForm.value.id)
        .subscribe(res => console.log(res));
      this.dialogRef.close();

    }

  }
  ngOnInit(): void {
    this.titulo = this.data.title;
    if (this.data.datos) {
      this.myForm.setValue({
        id: this.data.datos[0].id,
        tipo: this.data.datos[0].tipo,
        descripcion: this.data.datos[0].descripcion,
        cantidadHuesped: this.data.datos[0].cantidadHuesped,
        tarifa: this.data.datos[0].tarifa,
        imagen: this.data.datos[0].imagen,
        disponibilidad: this.data.datos[0].disponibilidad.toString()


      });
    }
  }
}
