import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UploadFileService } from 'src/app/services/upload-file.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AlumnoFormComponent } from '../alumno-form/alumno-form.component';
import { AlumnosDataService } from 'src/app/services/alumnos-data.service';

@Component({
  selector: 'app-alumno-list',
  templateUrl: './alumno-list.component.html',
  styleUrls: ['./alumno-list.component.scss']
})
export class AlumnoListComponent {
  displayedColumns: string[] = ['id', 'nombre', 'imagen', 'accion']
  dataSource: MatTableDataSource<any>
  objectList: any[] = []

  // Filter + paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator
  pageSizeOptions: number[] = [1, 4, 8]
  pageSize: number = 4
  pageIndex: number = 0

  constructor(private dataService: AlumnosDataService, public dialog: MatDialog,
    private snackBar: MatSnackBar, private uploadFileService: UploadFileService) {
    this.dataSource = new MatTableDataSource<any>();
  }

  ngOnInit(): void {
    this.getObjectList();
  }

  getObjectList(): void {
    this.dataService.getObjectList().subscribe(
      (response) => {
        let list: any[] = Object.values(response);
        this.dataSource.data = list;
        this.objectList = list;
        this.paginateData(); // Call paginateData after getting the object list
      },
      (error) => {
        console.log(error);
      }
    );
  }

  paginateData(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginator.length = this.objectList.length;
    this.dataSource.data = this.objectList.slice(startIndex, endIndex);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.paginateData();
  }

  addObject(): void {
    const dialogRef = this.dialog.open(AlumnoFormComponent, {
      width: '500px',
      data: { isAdd: true, info: {} as any }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const filePath = `images/${Date.now()}_${result.image.name}`;
        this.uploadFileService.uploadFile(filePath, result.image).then(
          (imagePath) => {
            result.image = imagePath;
            this.dataService.addObject(result).subscribe(
              (response) => {
                this.objectList.push(result);
                this.paginateData(); // Update pagination after adding object
                console.log("subido correctamente")
              },
              (error) => {
                console.log("No se pudo subir")
              }
            )
          }
        ).catch((error) => {
          console.log("Ha habido un error")
        })
      }
    });
  }

  editObject(obj: any): void {
    console.log(obj)
    const dialogRef = this.dialog.open(AlumnoFormComponent, {
      width: '400px',
      data: { isAdd: false, info: obj },
    });

    dialogRef.afterClosed().subscribe((result) => {

      if (result) {
        this.dataService.updateObject(result).subscribe(
          () => {
            let index = this.objectList.findIndex(p => p.id === result.id);
            if (index >= 0 && index < this.objectList.length) {
              this.objectList[index] = result;
              this.paginateData(); // Update pagination after editing object
            }
            this.showSnackbar('actualizado correctamente', 'success-message')
          },
          () => {
            this.showSnackbar('no se pudo editar', 'error-message')
          }
        )
      }
    });
  }

  removeObject(obj: any): void {
    let objName = obj.nombre;
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { objName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.deleteObject(obj.id).subscribe(
          (result) => {
            this.uploadFileService.deleteFile(obj.image).then(
              () => {
                this.showSnackbar('eliminado correctamente', 'success-message')
                let index = this.objectList.findIndex(p => p.id === obj.id);
                if (index >= 0 && index < this.objectList.length) {
                  this.objectList.splice(index, 1);
                  this.paginateData(); // Update pagination after removing object
                }
              }
            ).catch()
          },
          (error) => {
            this.showSnackbar('no se pudo eliminar', 'error-message');
          }
        )
      }
    });
  }

  showSnackbar(mensaje: string, clase: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: [clase]
    });
  }

  saveObjectList() {
    let objectDictionary: { [id: string]: any } = {};
    this.objectList.forEach(p => {
      objectDictionary[p.id] = p;
    });
    console.log(objectDictionary)
    this.dataService.saveObjectList(objectDictionary).subscribe(
      (response) => {
        console.log("Los datos se han guardado correctamente");
      },
      (error) => {
        console.log(error)
      }
    )
  }
  
}