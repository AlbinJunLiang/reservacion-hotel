import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dialogo-general',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './dialogo-general.component.html',
  styleUrl: './dialogo-general.component.scss'
})
export class DialogoGeneralComponent {
  readonly data = inject(MAT_DIALOG_DATA);
}
