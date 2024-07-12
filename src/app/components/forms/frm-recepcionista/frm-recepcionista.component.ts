import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RecepcionistaService } from '../../../helpers/services/recepcionista.service';
import { NgIf } from '@angular/common';
import { DialogoGeneralComponent } from '../dialogo-general/dialogo-general.component';

@Component({
  selector: 'app-frm-recepcionista',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule
    , ReactiveFormsModule, NgIf
  ],
  templateUrl: './frm-recepcionista.component.html',
  styleUrl: './frm-recepcionista.component.scss'
})
export class FrmRecepcionistaComponent implements OnInit {
  titulo!: string;
  private data = inject(MAT_DIALOG_DATA);
  private builder = inject(FormBuilder);
  private srvRecepcionista = inject(RecepcionistaService);
  private readonly dialog = inject(MatDialog);
  dialogRef = inject(MatDialogRef<FrmRecepcionistaComponent>);
  myForm: FormGroup;

  constructor() {
    this.myForm = this.builder.group({
      id: this.builder.control(0),
      idUsuario: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15),
      Validators.pattern("[0-9]*")]],
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30),
      Validators.pattern("[A-Za-zñÑáéíóú]*[A-Za-zñÑáéíóú]{0,1}")]],
      apellido1: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15),
      Validators.pattern("[A-Za-zñÑáéíóú]*[A-Za-zñÑáéíóú]{0,1}")]],
      apellido2: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15),
      Validators.pattern("[A-Za-zñÑáéíóú]*[A-Za-zñÑáéíóú]{0,1}")]],
      telefono: ['', [Validators.required, Validators.pattern("[0-9]{8}")]],
      celular: ['', [Validators.pattern("[0-9]{8}")]],
      direccion: ['', [Validators.minLength(10), Validators.maxLength(255)]],
      correo: ['', [Validators.required, Validators.email]],

    });
  }
  get F() {
    return this.myForm.controls;
  }

  onGuardar() {
    if (!this.myForm.valid) return;

    if (this.myForm.value.id === 0) {
      this.srvRecepcionista.guardarRecepcionista(this.myForm.value).
        subscribe({
          complete: () => {
            this.dialog.open(DialogoGeneralComponent, {
              data: {
                texto: "Recepcionista creado correctamente",
                icono: "check",
                textoAceptar: " Aceptar ",
              }
            });
            this.dialogRef.close();
          },
          error: (e) => {
            switch (e) {
              case 409:
                this.dialog.open(DialogoGeneralComponent, {
                  data: {
                    texto: "Error id usuario o Correo duplicado",
                    icono: "error",
                    textoAceptar: " Aceptar ",
                  }
                });
                break;
              default:
                this.dialog.open(DialogoGeneralComponent, {
                  data: {
                    texto: "Error no especificado",
                    icono: "error",
                    textoAceptar: " Aceptar ",
                  }
                });
            }
          }
        });
    } else {
      this.srvRecepcionista.guardarRecepcionista(this.myForm.value, this.myForm.value.id)
        .subscribe(res => console.log(res));
      this.dialogRef.close();

    }

  }
  ngOnInit(): void {
    this.titulo = this.data.title;
    if (this.data.datos) {
      this.myForm.setValue({
        id: this.data.datos[0].id,
        idUsuario: this.data.datos[0].idUsuario,
        nombre: this.data.datos[0].nombre,
        apellido1: this.data.datos[0].apellido1,
        apellido2: this.data.datos[0].apellido2,
        celular: this.data.datos[0].celular,
        telefono: this.data.datos[0].telefono,
        direccion: this.data.datos[0].direccion,
        correo: this.data.datos[0].correo
      });
    }
  }
}
