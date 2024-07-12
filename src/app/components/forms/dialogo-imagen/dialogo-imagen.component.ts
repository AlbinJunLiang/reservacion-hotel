import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogo-imagen',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './dialogo-imagen.component.html',
  styleUrl: './dialogo-imagen.component.scss'
})
export class DialogoImagenComponent {
  readonly data = inject(MAT_DIALOG_DATA);

}
