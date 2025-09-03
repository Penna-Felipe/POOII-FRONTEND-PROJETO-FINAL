import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Curso } from '../models/curso.model';
import { CursoService } from '../services/curso.service';

import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from '../confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-curso-editar',
  standalone: true,
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatIcon,
    MatCardModule,
    MatDividerModule,
  ],
  templateUrl: './curso-editar.component.html',
  styleUrls: ['./curso-editar.component.css']
})

export class CursoEditarComponent implements OnInit {

  curso: Curso = {} as Curso;

  constructor(private cursoservice: CursoService,
    private router: Router,
    private rotaAtiva: ActivatedRoute,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getCurso(this.rotaAtiva.snapshot.paramMap.get('id'));
  }

  getCurso(id: any) {
    this.cursoservice.getCursoById(id).subscribe({
      next: (dado) => {
        this.curso = dado;
        console.log(dado);
      },
      error: (erro) => {
        console.error(erro);
      }
    });
  }


  atualizar() {
    const dialogData: ConfirmDialogData = {
      title: 'Confirmar atualização',
      message: `Tem certeza que deseja atualizar os dados do curso id: "${this.curso.idCurso}"?`,
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
        this.cursoservice.updateCurso(this.curso.idCurso, this.curso).subscribe({
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
