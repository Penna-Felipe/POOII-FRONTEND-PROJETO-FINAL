import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

import { CursoService } from '../services/curso.service';
import { Curso } from '../models/curso.model';
import { ConfirmDialogComponent, ConfirmDialogData } from '../confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-curso.component',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatIconButton,
    MatIcon,
    MatCardModule,
    MatDividerModule,
  ],
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.css']
})

export class CursoComponent implements OnInit {

  cursos: Curso[] = [];
  displayedCursos: string[] = ['idCurso', 'nomeCurso', 'update', 'delete'];
  currentPage: number = 0;
  pageSize: number = 5;
  totalElements: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private cursoService: CursoService, private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getCursoList();
  }

  getCursoList(page: number = 0, search: string = ''): void {
    this.cursoService.getCursos(page, this.pageSize, search).subscribe({
      next: dados => {
        this.cursos = dados.content;
        this.totalElements = dados.totalElements;
        this.currentPage = dados.page;
      },
      error: erro => console.error(erro),
    });
  }

  filtrarCursos(event: Event): void {
    const valor = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.getCursoList(0, valor); // Reinicia a paginação
  }

  onPaginateChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.getCursoList(event.pageIndex);
  }

  deletarCurso(delcurso: Curso) {
    const dialogData: ConfirmDialogData = {
      title: 'Confirmar a exclusão',
      message: `Tem certeza que deseja excluir o curso "${delcurso.nomeCurso}"?`,
      confirmText: 'Sim, excluir',
      cancelText: 'Cancelar',
      confirmColor: 'secondary'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cursoService.deleteCurso(delcurso.idCurso).subscribe({
          next: () => {
            this.getCursoList(this.currentPage);
          }
        });
      }
    });
  }

  novoCurso() {
    this.router.navigate(['/curso-novo']);
  }

  editarCurso(curso: Curso) {
    this.router.navigate([`/curso-editar/${curso.idCurso}`]);
  }
}