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
import { IHabitacion, IReservacion, TipoUsuario } from '../../helpers/models/interfaces';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogoGeneralComponent } from '../forms/dialogo-general/dialogo-general.component';
import { UsuarioService } from '../../shared/services/usuario.service';
import { AuthService } from '../../helpers/services/auth.service';
import { PrintService } from '../../shared/services/print.service';
import { HabitacionService } from '../../helpers/services/habitacion.service';
import { FrmAdministradorComponent } from '../forms/frm-administrador/frm-administrador.component';
import { CommonModule } from '@angular/common';
import { FrmHabitacionComponent } from '../forms/frm-habitacion/frm-habitacion.component';
import { ReservacionService } from '../../helpers/services/reservacion.service';
import { FrmReservacionComponent } from '../forms/frm-reservacion/frm-reservacion.component';
import { MatSelectModule } from '@angular/material/select';
//import { FrmHabitacionComponent } from '../forms/frm-habitacion/frm-habitacion.component';

@Component({
  selector: 'app-reservacion',
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
    MatDialogModule, CommonModule, MatSelectModule
  ],
  templateUrl: './reservacion.component.html',
  styleUrl: './reservacion.component.scss',
})
export class ReservacionComponent implements AfterViewInit {

  private readonly reservSrv = inject(ReservacionService);
  private readonly dialog = inject(MatDialog);
  private readonly srvUsuario = inject(UsuarioService);
  private readonly srvImpresion = inject(PrintService);
  public rol = inject(AuthService).valorUsrActual.rol;
  public cliente = inject(AuthService).valorUsrActual.idUsuario;



  displayedColumns: string[] = ['idReservacion', 'idCliente', 'idRecepcionista', 'idHabitacion',
    'fechaEntrada', 'cantidadNoches', 'fechaFinalizacion', 'montoFinal', 'estado', 'botonera'];

  dataSource!: MatTableDataSource<IReservacion>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  panelOpenState = signal(false);
  filtro: any;
  mostrarDialog(titulo: string, datos?: IReservacion) {
    const dialogRef = this.dialog.open(FrmReservacionComponent, {
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
            this.resetearFiltro();

          }
        },
        error: (err) => { console.error(err) }
      })
  }



  limpiar() {
    this.resetearFiltro();
    (document.querySelector('#fid') as HTMLInputElement).value = '';
    (document.querySelector('#fidCliente') as HTMLInputElement).value = '';
    (document.querySelector('#fidRecepcionista') as HTMLInputElement).value = '';
    (document.querySelector('#fidHabitacion') as HTMLInputElement).value = '';
    (document.querySelector('#ffechaEntrada') as HTMLInputElement).value = '';
    (document.querySelector('#ffechaSalida') as HTMLInputElement).value = '';
    (document.querySelector('#festado') as HTMLInputElement).value = '';


  }

  resetearFiltro() {
    this.filtro = {
      id: '', idCliente: '', idRecepcionista: '',
      idHabitacion: '', fechaEntrada: '', cantidadNoches: '', fechaFinalizacion: '', montoFinal: '', estado: ''
    };
    this.filtrar();
  }

  // Resetea luego de cancelar una reservacion del usuario para evitar que vea las reseravciones de otras personas
  resetearReserveUsuario() {
    this.filtro = {
      id: '', idCliente: '', idRecepcionista: '',
      idHabitacion: '', fechaEntrada: '', cantidadNoches: '', fechaFinalizacion: '', montoFinal: '', estado: ''
    };
    this.filtrarReserveUsuario();
  }

  filtrar() {

    this.reservSrv.filtrarReservacion(this.filtro)
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
    this.reservSrv.getReservacion(id)
      .subscribe({
        next: (res) => {
          this.mostrarDialog("Editar reservacion", res);

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
        this.reservSrv.eliminarReservacion(id)
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

  onCancelar(id: number, estado: string) {
    if (estado.toUpperCase() === "ACTIVO") {
      const dialogRef = this.dialog.open(DialogoGeneralComponent, {
        data: {
          texto: "¿Deseas cancelar la reservacion?",
          icono: "question_mark",
          textoAceptar: " si ",
          textoCancelar: " no "
        }
      });


      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.reservSrv.cancelarReservacion(id)
            .subscribe((res: any) => {
              this.resetearReserveUsuario();
              this.dialog.open(DialogoGeneralComponent, {
                data: {
                  texto: "Se ha cancelado la reservacion",
                  icono: "check",
                  textoAceptar: "Aceptar"
                }
              })
            });
        }
      });
    }
  }

  // Solo muestra las reservaciones del usuario
  filtrarReserveUsuario(): void {
    this.reservSrv.filtrarReservacion(this.filtro)
      .subscribe({
        next: (result: any[]) => {
          if (!this.dataSource || !this.dataSource.data) {
            this.dataSource.data = [];
            return;
          }

          const filteredReservations = result.filter(
            (reservation: any) => reservation.idCliente === this.cliente
          );
          this.dataSource.data = filteredReservations;
        },
        error: (err: any) => {
          console.error("Error filtrando tus propias reservaciones:", err);
        },
      });
  }



  onNuevoClick() {
    this.mostrarDialog("Nuevo reservacion");
  }


  onImprimir() {
    const encabezado = [
      'id', 'recepcionista', 'cliente', 'habitacion',
      'fechaEntrada', 'check-out', 'noches', 'estado', 'total'
    ];

    // Access the table data source
    const dataSourceData = this.dataSource.data;

    // Extract data from the data source array
    const cuerpo = dataSourceData.map((row: any) => {
      const datos = [
        row.id,
        row.idRecepcionista,
        row.idCliente,
        row.idHabitacion,
        row.fechaEntrada,
        row.fechaFinalizacion,
        row.cantidadNoches,
        row.estado,
        row.montoFinal
      ];
      return datos;
    });

    // Call the print service with the extracted data
    this.srvImpresion.print(encabezado, cuerpo, 'Reservaciones', true);
  }

  ngAfterViewInit() {
    this.reservSrv.getAll().subscribe({
      next: (result) => {
        if (result && result.length > 0) {
          this.dataSource = new MatTableDataSource<IReservacion>(result);

          if (this.rol !== 4) {

            this.dataSource.paginator = this.paginator;


          } else {
            const filteredReservations = this.dataSource.data.filter(result => result.idCliente === this.cliente);
            filteredReservations.sort((a, b) => {
              const aDate = new Date(a.fechaEntrada);
              const bDate = new Date(b.fechaEntrada);
              return aDate.getTime() - bDate.getTime(); // Sort within filtered range
            });

            this.dataSource = new MatTableDataSource(filteredReservations);
            this.dataSource.paginator = this.paginator;
          }

        }

      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
