import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { unauthenticatedUsersGuard } from './guards/unauthenticated-users.guard';
import { authenticatedUsersGuard } from './guards/authenticated-users.guard';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfesorListComponent } from './components/profesor-list/profesor-list.component';
import { AlumnoListComponent } from './components/alumno-list/alumno-list.component';
import { CardListComponent } from './components/card-list/card-list.component';

const landingPage = '/login' //cuando el usuario NO está autenticado
const mainPage = '/orlas' //cuando el usuario SI está autenticado
const notFoundPage = undefined

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [unauthenticatedUsersGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [unauthenticatedUsersGuard] },
  { path: 'orlas', component: CardListComponent },
  { path: 'profesores', component: ProfesorListComponent, canActivate: [authenticatedUsersGuard] },
  { path: 'alumnos', component: AlumnoListComponent, canActivate: [authenticatedUsersGuard] },
  { path: '', redirectTo: landingPage, pathMatch: 'full' }, //página por defecto al entrar
  { path: 'main', redirectTo: mainPage, pathMatch: 'full' }, //página principal para redirecciones
  { path: '**', redirectTo: notFoundPage, component: PageNotFoundComponent }, //página cuando la url es inválida
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
