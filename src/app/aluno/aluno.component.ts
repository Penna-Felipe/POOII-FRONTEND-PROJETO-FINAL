import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common'; // Importe o DatePipe
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';

import { Aluno } from '../models/aluno.model';
import { AlunoService } from '../services/aluno.service';
import { ConfirmDialogComponent, ConfirmDialogData } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-aluno',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe, // Adicione o DatePipe aos imports
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './aluno.component.html',
  styleUrls: ['./aluno.component.css']
})
export class AlunoComponent implements OnInit {

  alunos: Aluno[] = [];
  displayedAlunos: string[] = ['idaluno', 'nome', 'sexo', 'dt_nasc', 'update', 'delete'];

  // Variáveis de estado para a paginação
  currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  private currentFilter: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private alunoService: AlunoService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getAlunoList();
  }

  getAlunoList(page: number = 0, search: string = ''): void {
    this.alunoService.getAlunos(page, this.pageSize, search).subscribe({
      next: dados => {
        this.alunos = dados.content;
        this.totalElements = dados.totalElements;
        this.currentPage = dados.number; // 'number' é o campo correto para a página atual no Page do Spring
      },
      error: erro => {
        console.error(erro);
        this.snackBar.open('Erro ao carregar a lista de alunos.', 'Fechar', { duration: 5000 });
      },
    });
  }

  filtrarAlunos(event: Event): void {
    const valor = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.currentFilter = valor;
    this.getAlunoList(0, this.currentFilter); // Reinicia a paginação para a primeira página
  }

  onPaginateChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.getAlunoList(event.pageIndex, this.currentFilter); // Mantém o filtro ao mudar de página
  }

  deletarAluno(delAluno: Aluno) {
    const dialogData: ConfirmDialogData = {
      title: 'Confirmar a exclusão',
      message: `Tem certeza que deseja excluir o aluno "${delAluno.nome}"?`,
      confirmText: 'Sim, excluir',
      cancelText: 'Cancelar',
      confirmColor: 'warn' // 'warn' para cor vermelha de perigo
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.alunoService.deleteAluno(delAluno.idaluno).subscribe({
          next: () => {
            this.snackBar.open('Aluno excluído com sucesso!', 'Fechar', { duration: 3000 });
            this.getAlunoList(this.currentPage, this.currentFilter); // Recarrega a lista
          },
          error: (err) => {
            this.snackBar.open('Erro ao excluir o aluno.', 'Fechar', { duration: 5000 });
            console.error(err);
          }
        });
      }
    });
  }

  novoAluno() {
    this.router.navigate(['/aluno-novo']);
  }

  editarAluno(aluno: Aluno) {
    this.router.navigate([`/aluno-editar/${aluno.idaluno}`]);
  }
}
