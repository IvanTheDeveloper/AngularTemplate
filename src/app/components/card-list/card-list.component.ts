import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AlumnosDataService } from 'src/app/services/alumnos-data.service';
import { ProfesoresDataService } from 'src/app/services/profesores-data.service';
import { OrlasDataService } from 'src/app/services/orlas-data.service';
import { Observable, catchError, map, throwError } from 'rxjs';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent {
  objectList: any[] = []

  constructor(private alumnos: AlumnosDataService, private profesores: ProfesoresDataService) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator
  paginatedList!: any[]
  pageSizeOptions: number[] = [1, 4, 8, 20]
  pageSize: number = 20
  pageIndex: number = 0

  //filtro
  page: any = 1

  ngOnInit(): void {
    this.getObjectList()
  }

  getObjectList(): void {
    const list: any[] = [];
    this.getProfesores().subscribe(
      (profList) => {
        list.push(...profList);
        this.getAlumnos().subscribe(
          (aluList) => {
            list.push(...aluList);
            this.objectList = list;
            this.paginateList();
          },
          (error) => {
            console.log(error);
          }
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getAlumnos(): Observable<any[]> {
    return this.alumnos.getObjectList().pipe(
      map((response) => {
        return Object.values(response);
      }),
      catchError((error) => {
        console.log(error);
        return throwError(error);
      })
    );
  }

  getProfesores(): Observable<any[]> {
    return this.profesores.getObjectList().pipe(
      map((response) => {
        return Object.values(response);
      }),
      catchError((error) => {
        console.log(error);
        return throwError(error);
      })
    );
  }

  paginateList(): void {
    const startIndex = this.pageIndex * this.pageSize
    this.paginatedList = this.objectList.slice(startIndex, startIndex + this.pageSize)
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex
    this.pageSize = event.pageSize
    this.paginateList()
  }

  applyFilter() {
    this.getObjectList() //refrescar los datos
    this.pageIndex = 0
    this.paginator.pageIndex = 0
  }

  resetFields() {
    this.page = 1
    /* por esto uso 'any' en vez de 'number' para el tipo de variable,
    la api puede pillar los campos vacíos y devolver una respuesta como si no se hubiesen usado parámetros sin dar error */
  }

}