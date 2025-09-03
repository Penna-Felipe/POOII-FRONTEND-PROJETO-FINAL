import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';

import { Aluno } from '../models/aluno.model';
import { AlunoService } from '../services/aluno.service';
import { ConfirmDialogComponent, ConfirmDialogData } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-aluno-novo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule, // Necessário para o MatDatepicker
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './aluno-novo.component.html',
  styleUrls: ['./aluno-novo.component.css']
})
export class AlunoNovoComponent {

  aluno: Aluno = {} as Aluno;

  constructor(
    private alunoService: AlunoService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  inserirAluno(): void {
    const dialogData: ConfirmDialogData = {
      title: 'Confirmar a inclusão',
      message: `Tem certeza que deseja incluir o aluno "${this.aluno.nome}"?`,
      confirmText: 'Sim, incluir',
      cancelText: 'Cancelar',
      confirmColor: 'primary'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.alunoService.createAluno(this.aluno).subscribe({
          next: () => {
            this.snackBar.open('Aluno criado com sucesso!', 'Fechar', { duration: 3000 });
            this.router.navigate(['/aluno']);
          },
          error: (err) => {
            this.snackBar.open('Erro ao criar o aluno. Tente novamente.', 'Fechar', { duration: 5000 });
            console.error('Erro ao criar aluno:', err);
          }
        });
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/aluno']);
  }
}
