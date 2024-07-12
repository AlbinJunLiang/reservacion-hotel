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
import { IHabitacion, TipoUsuario } from '../../helpers/models/interfaces';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogoGeneralComponent } from '../forms/dialogo-general/dialogo-general.component';
import { UsuarioService } from '../../shared/services/usuario.service';
import { AuthService } from '../../helpers/services/auth.service';
import { PrintService } from '../../shared/services/print.service';
import { HabitacionService } from '../../helpers/services/habitacion.service';
import { FrmAdministradorComponent } from '../forms/frm-administrador/frm-administrador.component';
import { CommonModule } from '@angular/common';
import { FrmHabitacionComponent } from '../forms/frm-habitacion/frm-habitacion.component';
import { FrmReservarComponent } from '../forms/frm-reservar/frm-reservar.component';
import { DialogoImagenComponent } from '../forms/dialogo-imagen/dialogo-imagen.component';
//import { FrmHabitacionComponent } from '../forms/frm-habitacion/frm-habitacion.component';

@Component({
  selector: 'app-habitacion',
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
    MatDialogModule, CommonModule
  ],
  templateUrl: './habitacion.component.html',
  styleUrl: './habitacion.component.scss',
})
export class HabitacionComponent implements AfterViewInit {
  private readonly roomSrv = inject(HabitacionService);
  private readonly dialog = inject(MatDialog);
  private readonly srvImpresion = inject(PrintService);
  public rol = inject(AuthService).valorUsrActual.rol;

  displayedColumns: string[] = ['Id', 'tipo', 'descripcion', 'cantidadHuesped', 'tarifa', 'disponibilidad', 'botonera'];

  dataSource!: MatTableDataSource<IHabitacion>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  panelOpenState = signal(false);
  filtro: any;
  mostrarDialog(titulo: string, datos?: IHabitacion) {
    const dialogRef = this.dialog.open(FrmHabitacionComponent, {
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

  refreshData() {
    this.roomSrv.getAll().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (err) => console.error(err)
    });
  }

  limpiar() {
    this.resetearFiltro();
    (document.querySelector('#fid') as HTMLInputElement).value = '';
    (document.querySelector('#ftipo') as HTMLInputElement).value = '';
    (document.querySelector('#fdescripcion') as HTMLInputElement).value = '';
    (document.querySelector('#ftarifa') as HTMLInputElement).value = '';
    (document.querySelector('#fhuesped') as HTMLInputElement).value = '';


  }

  resetearFiltro() {
    this.filtro = { id: '', tipo: '', descripcion: '', tarifa: '', disponibilidad: '' };
    this.filtrar();
  }


  resetearFiltroDisponible() {
    this.filtro = { id: '', tipo: '', descripcion: '', tarifa: '', disponibilidad: '' };
    this.filtrarDisponibles();
  }

  filtrar() {
    this.roomSrv.filtrarHabitacion(this.filtro)
      .subscribe({
        next: (data) => this.dataSource.data = data,
        error: (err) => console.error(err)
      })
  }


  filtrarDisponibles() {
    this.roomSrv.getDisponible()
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
    this.roomSrv.getHabitacion(id)
      .subscribe({
        next: (res) => {
          this.mostrarDialog("Editar habitacion", res);

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
        this.roomSrv.eliminarHabitacion(id)
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


  onInfoClick(imagen: string, descripcion: string) {
    const dialogRef = this.dialog.open(DialogoImagenComponent, {
      data: {
        texto: "",
        imagen: imagen,
        textoAceptar: "Aceptar",
        descripcion: descripcion
      }
    });
  }


  onNuevoClick() {
    this.mostrarDialog("Nueva Habitacion");
  }


  onImprimir() {
    const encabezado =
      ['Id', 'tipo', 'descripcion',
        'cantidadHuesped', 'tarifa',
        'disponibilidad'];

    // Access the table data source
    const dataSourceData = this.dataSource.data;

    // Extract data from the data source array
    const cuerpo = dataSourceData.map((row: any) => {
      const datos = [
        row.id,
        row.tipo,
        row.descripcion,
        row.cantidadHuesped,
        row.tarifa,
        row.disponibilidad
      ];
      return datos;
    });

    // Call the print service with the extracted data
    this.srvImpresion.print(encabezado, cuerpo, 'Habitaciones', true);
  }

  liberar() {
    this.roomSrv.liberarHabitaciones().subscribe((res: any) => {
      console.log('Room released successfully');
    }, (error) => {
      console.error('Failed to release room:', error);
    });
  }


  ngAfterViewInit() {
    // alert(this.rol);
    if (this.rol !== 4) {
      this.roomSrv.getAll().subscribe({
        next: (result) => {
          if (result && result.length > 0) {

            this.dataSource = new MatTableDataSource<IHabitacion>(result);
            this.dataSource.paginator = this.paginator;
          }
        },
        error: (err) => {
          console.log(err);
        }
      })
    } else {
      this.roomSrv.getDisponible().subscribe({
        next: (result) => {

          if (result && result.length > 0) {

            this.dataSource = new MatTableDataSource<IHabitacion>(result);
            this.dataSource.paginator = this.paginator;
          }
        },
        error: (err) => {

          console.log(err);
        }
      })
    }
    this.liberar();

  }



  reservar(idHabitacion: number, datos?: IHabitacion) {
    const dialogRef = this.dialog.open(FrmReservarComponent, {
      width: '50%',
      data: {
        title: idHabitacion,
        datos: datos,
        idHabitacion: idHabitacion
      }
    });
    dialogRef.afterClosed()
      .subscribe({
        next: (res) => {
          console.log(res);
          if (this.rol !== 4) {
            this.resetearFiltro();
          } else {
            this.resetearFiltroDisponible();
          }


        },
        error: (err) => { console.error(err) }
      })
  }
}
