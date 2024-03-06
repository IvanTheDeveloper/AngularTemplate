import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { AlumnosDataService } from 'src/app/services/alumnos-data.service';
import { ProfesoresDataService } from 'src/app/services/profesores-data.service';
import { Observable, catchError, forkJoin, map, throwError } from 'rxjs';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent {
  objectList: any[] = []
  progressSpinner = false

  //paginador
  paginatedList: any[] = []
  pageSizeOptions: number[] = [1, 4, 8, 20]
  pageSize: number = 4
  pageIndex: number = 0

  //filtro
  filteredList: any[] = []
  id = ''
  nombre = ''

  constructor(private alumnos: AlumnosDataService, private profesores: ProfesoresDataService) { }

  ngOnInit(): void {
    this.getObjectList()
    this.initData()  //pillamos los datos de la base de datos y los guardamos en una lista fija para no petar a firebase todo el rato
  }

  async initData() {
    this.progressSpinner = true
    await new Promise(f => setTimeout(f, 1000))
    this.progressSpinner = false
    this.refreshData()  //un poco de estetica mientras se cargan los datos
  }

  refreshData() {
    this.filteredList = this.objectList
    this.paginateList() //actualizamos nuestros datos
  }

  paginateList(): void {
    const startIndex = this.pageIndex * this.pageSize
    this.paginatedList = this.filteredList.slice(startIndex, startIndex + this.pageSize)  //aplicamos el paginador a los datos actuales, esten filtrados o no
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex
    this.pageSize = event.pageSize
    this.paginateList() //logica cada cada vez que se pulsa el paginador para ver los elementos correctos
  }

  applyFilter() {
    this.filteredList = this.objectList.filter(item => {
      const id = item.id.toLowerCase().includes(this.id.toLowerCase())
      const nombre = item.nombre.toLowerCase().includes(this.nombre.toLowerCase())
      return id && nombre
    })
    this.pageIndex = 0;
    this.paginateList() //aplicamos el filtro usando los campos, desde la lista de datos original y lo paginamos
  }

  resetFields() {
    this.id = ''
    this.nombre = ''
    this.filteredList = this.objectList
    this.paginateList() //vaciamos los campos, cargamos la lusta completa y paginamos de nuevo
  }

  getObjectList(): void {
    forkJoin([this.getProfesores(), this.getAlumnos()]).subscribe(
      ([profList, aluList]) => {
        const list: any[] = []
        if (profList && aluList) {
          list.push(...profList, ...aluList)
        }
        this.objectList = list
      },
      (error) => {
        console.log(error)
      }
    ) //hacemos un remix de profesores y alumnos en la misma lista
  }

  getAlumnos(): Observable<any[]> {
    return this.alumnos.getObjectList().pipe(
      map((response) => {
        return response ? Object.values(response) : []
      }),
      catchError((error) => {
        console.log(error)
        return throwError(error)
      })
    ) //pillamos los alumnos de firebase
  }

  getProfesores(): Observable<any[]> {
    return this.profesores.getObjectList().pipe(
      map((response) => {
        return response ? Object.values(response) : []
      }),
      catchError((error) => {
        console.log(error)
        return throwError(error)
      })
    ) //pillamos los profesores de firebase
  }

}