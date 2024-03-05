import { Alumno } from "./Alumno";
import { Profesor } from "./Profesor";

export class Orla {
    id: string
    anio: number
    profesores: Profesor[]
    alumnos: Alumno[]

    constructor(id: string, anio: number, profesores: Profesor[], alumnos: Alumno[]) {
        this.id = id
        this.anio = anio
        this.profesores = profesores
        this.alumnos = alumnos
    }

}