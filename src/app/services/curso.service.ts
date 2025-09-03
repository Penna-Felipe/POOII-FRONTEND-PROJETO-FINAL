import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Curso } from '../models/curso.model';
import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  //api RestFull JAVA Spring Boot
  private baseUrl = 'http://localhost:8080/academico/cursos';

  constructor(private httpClient: HttpClient) { }

  getCursos(page: number = 0, size: number = 10, search: string = ''): Observable<Page<Curso>> {
    const params: any = { page: page.toString(), size: size.toString() };
    if (search) {  params.search = search; }
    return this.httpClient.get<Page<Curso>>(this.baseUrl, { params });
  }

  getCursoById(id: number): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/${id}`);
  }

  createCurso(curso: Object) {
    return this.httpClient.post(`${this.baseUrl}`, curso);
  }
  updateCurso(id: number, curso: Object) {
    return this.httpClient.put(`${this.baseUrl}/${id}`, curso);
  }
  deleteCurso(id: number) {
    return this.httpClient.delete(`${this.baseUrl}/${id}`);
  }

}