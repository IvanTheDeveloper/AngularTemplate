import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UploadFileService } from 'src/app/services/upload-file.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ProfesorFormComponent } from '../profesor-form/profesor-form.component';
import { ProfesoresDataService } from 'src/app/services/profesores-data.service';

@Component({
  selector: 'app-profesor-list',
  templateUrl: './profesor-list.component.html',
  styleUrls: ['./profesor-list.component.scss']
})
export class ProfesorListComponent {
  displayedColumns: string[] = ['id', 'nombre', 'asignatura', 'imagen', 'accion']
  dataSource: MatTableDataSource<any>
  objectList: any[] = []

  // Filter + paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator
  pageSizeOptions: number[] = [1, 4, 8]
  pageSize: number = 4
  pageIndex: number = 0

  constructor(private dataService: ProfesoresDataService, public dialog: MatDialog,
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
    const dialogRef = this.dialog.open(ProfesorFormComponent, {
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
                this.objectList.push(result)
                this.paginateData()
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
    const dialogRef = this.dialog.open(ProfesorFormComponent, {
      width: '400px',
      data: { isAdd: false, info: obj },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Si se proporciona una nueva imagen, subirla a Firestore y actualizar la ruta en el objeto
        if (result.image && result.image !== obj.image) {
          const filePath = `images/${Date.now()}_${result.image.name}`;
          this.uploadFileService.uploadFile(filePath, result.image).then(
            (imagePath) => {
              // Eliminar la imagen antigua
              this.uploadFileService.deleteFile(obj.image).then(
                () => {
                  result.image = imagePath; // Asignar la nueva ruta de imagen
                  this.updateObject(result); // Actualizar el objeto en la base de datos
                }
              ).catch((error) => {
                console.log("Error al eliminar la imagen antigua:", error);
              });
            }
          ).catch((error) => {
            console.log("Error al subir la nueva imagen:", error);
          });
        } else {
          // Si no se proporciona una nueva imagen, mantener la imagen existente y actualizar otros campos
          result.image = obj.image;
          this.updateObject(result); // Actualizar el objeto en la base de datos
        }
      }
    });
  }

  private updateObject(result: any): void {
    this.dataService.updateObject(result).subscribe(
      () => {
        const index = this.objectList.findIndex((p) => p.id === result.id);
        if (index >= 0 && index < this.objectList.length) {
          this.objectList[index] = result;
          this.paginateData(); // Actualizar paginación después de editar objeto
        }
        this.showSnackbar('Actualizado correctamente', 'success-message');
      },
      () => {
        this.showSnackbar('No se pudo editar', 'error-message');
      }
    );
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