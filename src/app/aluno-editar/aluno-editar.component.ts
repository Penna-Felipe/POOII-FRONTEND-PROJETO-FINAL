import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-aluno-editar',
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
    MatNativeDateModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './aluno-editar.component.html',
  styleUrls: ['./aluno-editar.component.css']
})
export class AlunoEditarComponent implements OnInit {

  aluno: Aluno = {} as Aluno;

  constructor(
    private alunoService: AlunoService,
    private router: Router,
    private route: ActivatedRoute, // Mudado para 'route' para clareza
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Usamos a abordagem reativa para carregar os dados
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        // O '+' converte a string 'id' para um número
        this.getAluno(+id);
      }
    });
  }

  getAluno(id: number): void {
    this.alunoService.getAlunoById(id).subscribe({
      next: (dado) => {
        this.aluno = dado;
      },
      error: (erro) => {
        this.snackBar.open('Erro ao carregar dados do aluno.', 'Fechar', { duration: 5000 });
        console.error(erro);
      }
    });
  }

  atualizarAluno(): void {
    const dialogData: ConfirmDialogData = {
      title: 'Confirmar atualização',
      message: `Tem certeza que deseja atualizar os dados do aluno "${this.aluno.nome}"?`,
      confirmText: 'Sim, atualizar',
      cancelText: 'Cancelar',
      confirmColor: 'primary'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.alunoService.updateAluno(this.aluno.idaluno, this.aluno).subscribe({
          next: () => {
            this.snackBar.open('Aluno atualizado com sucesso!', 'Fechar', { duration: 3000 });
            this.router.navigate(['/aluno']);
          },
          error: (err) => {
            this.snackBar.open('Erro ao atualizar o aluno. Tente novamente.', 'Fechar', { duration: 5000 });
            console.error('Erro ao atualizar aluno:', err);
          }
        });
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/aluno']);
  }
}
