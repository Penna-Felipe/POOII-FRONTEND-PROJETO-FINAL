import { Component } from '@angular/core';
import { Curso } from '../models/curso.model';
import { ConfirmDialogComponent, ConfirmDialogData } from '../confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { CursoService } from '../services/curso.service';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-curso-novo',
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatIcon,
    MatCardModule,
    MatDividerModule,
  ],
  templateUrl: './curso-novo.component.html',
  styleUrls: ['./curso-novo.component.css']
})
export class CursoNovoComponent {

  curso: Curso = {} as Curso;

  constructor(private cursoService: CursoService, private router: Router, private dialog: MatDialog) { }

  inserirCurso() {

    const dialogData: ConfirmDialogData = {
      title: 'Confirmar inclusão',
      message: `Tem certeza que deseja incluir o curso "${this.curso.nomeCurso}"?`,
      confirmText: 'Sim, incluir',
      cancelText: 'Cancelar',
      confirmColor: 'secondary'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cursoService.createCurso(this.curso).subscribe({
          next: () => {
            this.router.navigate(['/curso']);
          },
          error: (err) => {
            console.error('Erro ao atualizar curso:', err);
          }
        });
      }
    });
  }

  cancelar() {
    this.router.navigate(['/curso']);
  }

}
