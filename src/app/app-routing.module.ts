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

const landingPage = '/login' //when not authenticated
const mainPage = '/orlas' //when authenticated
const notFoundPage = undefined

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [unauthenticatedUsersGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [unauthenticatedUsersGuard] },
  { path: 'orlas', component: CardListComponent, },
  { path: 'profesores', component: ProfesorListComponent, canActivate: [authenticatedUsersGuard] },
  { path: 'alumnos', component: AlumnoListComponent, canActivate: [authenticatedUsersGuard] },
  { path: '', redirectTo: landingPage, pathMatch: 'full' }, //landing page
  { path: 'main', redirectTo: mainPage, pathMatch: 'full' }, //main page
  { path: '**', redirectTo: notFoundPage, component: PageNotFoundComponent }, //page not found
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
