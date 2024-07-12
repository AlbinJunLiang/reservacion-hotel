import { Component, inject, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { TipoUsuario } from '../../helpers/models/interfaces';
import { RecepcionistaService } from '../../helpers/services/recepcionista.service';
import { UsuarioService } from '../../shared/services/usuario.service';
import { PrintService } from '../../shared/services/print.service';
import { AuthService } from '../../helpers/services/auth.service';
import { DialogoGeneralComponent } from '../forms/dialogo-general/dialogo-general.component';
import { FrmRecepcionistaComponent } from '../forms/frm-recepcionista/frm-recepcionista.component';

@Component({
  selector: 'app-empleado',
  standalone: true,
  imports: [
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatPaginator,
    MatPaginatorModule,
    MatTableModule,
    MatIconModule,
    RouterModule,
    MatExpansionModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule


  ],
  templateUrl: './recepcionista.component.html',
  styleUrl: './recepcionista.component.scss',
})
export class RecepcionistaComponent {

  private readonly recepcionistaSrv = inject(RecepcionistaService);
  private readonly dialog = inject(MatDialog);
  private readonly srvUsuario = inject(UsuarioService);
  private readonly srvImpresion = inject(PrintService);
  public rol = inject(AuthService).valorUsrActual.rol;


  displayedColumns: string[] = ['Id', 'idUsuario', 'Nombre', 'Apellido1', 'Apellido2', 'Correo','botonera'];

  dataSource!: MatTableDataSource<TipoUsuario>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  panelOpenState = signal(false);
  filtro: any;
  mostrarDialog(titulo: string, datos?: TipoUsuario) {
    const dialogRef = this.dialog.open(FrmRecepcionistaComponent, {
      width: '50%',
      data: {
        title: titulo,
        datos: datos
      }
    });
    dialogRef.afterClosed()
      .subscribe({
        next: (res) => {
          if (res !== false) {
             this.resetearFiltro(); 
            }
        },
        error: (err) => { console.error(err) }
      })
  }


  limpiar() {
    this.resetearFiltro();
    (document.querySelector('#fidUsuario') as HTMLInputElement).value = '';
    (document.querySelector('#fnombre') as HTMLInputElement).value = '';
    (document.querySelector('#fapellido1') as HTMLInputElement).value = '';
    (document.querySelector('#fapellido2') as HTMLInputElement).value = '';
  }

  resetearFiltro() {
    this.filtro = { idUsuario: '', nombre: '', apellido1: '', apellido2: '' };
    this.filtrar();
  }

  filtrar() {
    this.recepcionistaSrv.filtrarRecepcionista(this.filtro)
      .subscribe({
        next: (data) => this.dataSource.data = data,
        error: (err) => console.error(err)
      })
  }




  onFiltroChange(f: any) {
    this.filtro = f;
    this.filtrar();
  }

  onEditarClick(id: number) {
    this.recepcionistaSrv.getRecepcionista(id)
      .subscribe({
        next: (res) => {
          this.mostrarDialog("Editar recepcionista", res);

        },
        error: (err) => console.log(err)
      })
  }
  onEliminarClick(id: number) {
    const dialogRef = this.dialog.open(DialogoGeneralComponent, {
      data: {
        texto: "¿Eliminar registro seleccionado?",
        icono: "question_mark",
        textoAceptar: " si ",
        textoCancelar: " no "
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.recepcionistaSrv.eliminarRecepcionista(id)
          .subscribe((res: any) => {
            this.resetearFiltro();
            this.dialog.open(DialogoGeneralComponent, {
              data: {
                texto: "Registrado eliminado correctamente",
                icono: "check",
                textoAceptar: "Aceptar"
              }
            })
          });
      }
    });

  }

  onResetear(idUsuario: string) {
    const dialogRef = this.dialog.open(DialogoGeneralComponent, {
      data: {
        texto: "¿Estás seguro en resetear la contraseña?",
        icono: "question_mark",
        textoAceptar: " si ",
        textoCancelar: " no "
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.srvUsuario.resetPassw(idUsuario)
          .subscribe((res: any) => {
            this.resetearFiltro();
            this.dialog.open(DialogoGeneralComponent, {
              data: {
                texto: "Contraseña se ha reinciado correctamente",
                icono: "check",
                textoAceptar: "Aceptar"
              }
            })
          });
      }
    });

  }
  onInfoClick(
    idUsuario: number,
    apellido1: string,
    apellido2: string,
    telefono: string,
    celular: string,
    direccion: string,
    correo: string,
    fechaIngreso: string
  ): void {
    const mensaje = `ID Usuario: ${idUsuario}\n`
                  + `Apellido Paterno: ${apellido1}\n`
                  + `Apellido Materno: ${apellido2}\n`
                  + `Teléfono: ${telefono}\n`
                  + `Celular: ${celular}\n`
                  + `Dirección: ${direccion}\n`
                  + `Correo: ${correo}\n`
                  + `Fecha de Ingreso: ${fechaIngreso}`;

    alert(mensaje);
  }
  onNuevoClick() {
    this.mostrarDialog("Nuevo recepcionista");
    //   alert("Se va crear nuevo");
  }

 
  onImprimir() {
    const encabezado = [
      'Id Cliente',
      'Nombre',
      'Telefono',
      'Celular',
      'Correo'
    ];
  
    // Access the table data source
    const dataSourceData = this.dataSource.data;
  
    // Extract data from the data source array
    const cuerpo = dataSourceData.map((row: any) => {
      const datos = [
        row.idUsuario,
        `${row.nombre} ${row.apellido1} ${row.apellido2}`,
        row.telefono,
        row.celular,
        row.correo
      ];
      return datos;
    });
  
    // Call the print service with the extracted data
    this.srvImpresion.print(encabezado, cuerpo, 'Listado de recepcionistas', true);
  }
  
  ngAfterViewInit() {
    this.recepcionistaSrv.getAll().subscribe({
      next: (result) => {
        if (result && result.length > 0) {
          this.dataSource = new MatTableDataSource<TipoUsuario>(result);
        this.dataSource.paginator = this.paginator;
        }

      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
