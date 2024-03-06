import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { AlumnosDataService } from 'src/app/services/alumnos-data.service';
import { ProfesoresDataService } from 'src/app/services/profesores-data.service';
import { Observable, catchError, map, throwError } from 'rxjs';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements AfterViewInit {
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
    this.getObjectList()  //pillamos los datos de la base de datos y los guardamos en una lista fija para no petar a firebase todo el rato
  }

  ngAfterViewInit(): void {
    this.initData() //inicializamos los datos que se van a mostrar que por defecto son todos
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
    const list: any[] = []
    this.getProfesores().subscribe(
      (profList) => {
        list.push(...profList)
        this.getAlumnos().subscribe(
          (aluList) => {
            list.push(...aluList)
            this.objectList = list
          },
          (error) => {
            console.log(error)
          }
        )
      },
      (error) => {
        console.log(error)
      }
    ) //mezclamos ambas listas en una sola
  }

  getAlumnos(): Observable<any[]> {
    return this.alumnos.getObjectList().pipe(
      map((response) => {
        return Object.values(response)
      }),
      catchError((error) => {
        console.log(error)
        return throwError(error)
      })
    ) //bajamos la lista de alumnos
  }

  getProfesores(): Observable<any[]> {
    return this.profesores.getObjectList().pipe(
      map((response) => {
        return Object.values(response)
      }),
      catchError((error) => {
        console.log(error)
        return throwError(error)
      })
    ) //bajamos la lista de profesores
  }

}