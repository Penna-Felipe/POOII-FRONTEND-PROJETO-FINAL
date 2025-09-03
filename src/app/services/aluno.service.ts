import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Aluno } from '../models/aluno.model';
import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {

  // URL base da sua API para a entidade Aluno
  private baseUrl = 'http://localhost:8080/academico/alunos';

  constructor(private httpClient: HttpClient) { }

  getAlunos(page: number = 0, size: number = 10, search: string = ''): Observable<Page<Aluno>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.httpClient.get<Page<Aluno>>(this.baseUrl, { params });
  }

  getAlunoById(id: number): Observable<Aluno> {
    return this.httpClient.get<Aluno>(`${this.baseUrl}/${id}`);
  }

  createAluno(aluno: Aluno): Observable<Aluno> {
    return this.httpClient.post<Aluno>(this.baseUrl, aluno);
  }

  updateAluno(id: number, aluno: Aluno): Observable<Aluno> {
    return this.httpClient.put<Aluno>(`${this.baseUrl}/${id}`, aluno);
  }

  deleteAluno(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }

}
