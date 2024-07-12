import { Component, ViewChild, AfterViewInit, signal, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { ClienteService } from '../../helpers/services/cliente.service';
import { TipoUsuario } from '../../helpers/models/interfaces';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FrmClienteComponent } from '../forms/frm-cliente/frm-cliente.component';
import { DialogoGeneralComponent } from '../forms/dialogo-general/dialogo-general.component';
import { UsuarioService } from '../../shared/services/usuario.service';
import { AuthService } from '../../helpers/services/auth.service';
import { PrintService } from '../../shared/services/print.service';

@Component({
  selector: 'app-cliente',
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
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.scss',
})
export class ClienteComponent implements AfterViewInit {

  private readonly clienteSrv = inject(ClienteService);
  private readonly dialog = inject(MatDialog);
  private readonly srvUsuario = inject(UsuarioService);
  private readonly srvImpresion = inject(PrintService);
  public rol = inject(AuthService).valorUsrActual.rol;

  displayedColumns: string[] = ['Id', 'idUsuario', 'Nombre', 'Apellido1', 'Apellido2', 'Correo', 'botonera'];

  dataSource!: MatTableDataSource<TipoUsuario>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  panelOpenState = signal(false);
  filtro: any;
  mostrarDialog(titulo: string, datos?: TipoUsuario) {
    const dialogRef = this.dialog.open(FrmClienteComponent, {
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
    this.clienteSrv.filtrarCliente(this.filtro)
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
    this.clienteSrv.getCliente(id)
      .subscribe({
        next: (res) => {
          this.mostrarDialog("Editar Cliente", res);

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
        this.clienteSrv.eliminarCliente(id)
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
    this.mostrarDialog("Nuevo Cliente");
  }


  onImprimir() {
    const encabezado = [
      'Id Cliente',
      'Nombre',
      'Telefono',
      'Celular',
      'Correo'
    ];

    const dataSourceData = this.dataSource.data;

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

    this.srvImpresion.print(encabezado, cuerpo, 'Listado de Clientes', true);
  }

  ngAfterViewInit() {
    this.clienteSrv.getAll().subscribe({
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
