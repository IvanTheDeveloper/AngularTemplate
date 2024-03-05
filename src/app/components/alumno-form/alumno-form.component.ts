import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alumno-form',
  templateUrl: './alumno-form.component.html',
  styleUrls: ['./alumno-form.component.scss']
})
export class AlumnoFormComponent {
  checkoutForm: FormGroup;

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<AlumnoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { info: any, isAdd: boolean }) {
    this.checkoutForm = this.formBuilder.group({
      id: [this.data.isAdd ? '' : this.data.info.id, [Validators.required]],
      nombre: [this.data.isAdd ? '' : this.data.info.nombre, [Validators.required]],
      imagen: [null]
    })
    if (!this.data.isAdd) {
      this.checkoutForm.get('id')?.disable()
    }
  }

  onSubmit(): void {
    const obj: any = {
      id: this.id?.value,
      nombre: this.nombre?.value,
      image: this.imagen?.value
    }
    this.checkoutForm.reset()
    this.dialogRef.close(obj)
  }

  get id() {
    return this.checkoutForm.get('id')
  }

  get nombre() {
    return this.checkoutForm.get('nombre')
  }

  get imagen() {
    return this.checkoutForm.get('imagen')
  }

  cancelClick(): void {
    this.dialogRef.close(false)
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0]
    this.checkoutForm.patchValue({ imagen: file })
  }

  getImageUrl(): string {
    const file = this.checkoutForm.get('imagen')?.value
    return URL.createObjectURL(file);
  }

}