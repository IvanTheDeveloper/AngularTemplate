export class Profesor {
    id: string
    imagen: string
    nombre: string
    asignatura: string

    constructor(id: string, imagen: string, nombre: string, asignatura: string) {
        this.id = id
        this.imagen = imagen
        this.nombre = nombre
        this.asignatura = asignatura
    }
    
}