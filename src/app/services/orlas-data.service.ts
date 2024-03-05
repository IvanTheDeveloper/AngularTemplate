import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { firebaseConfig } from '../app.module';

@Injectable({
  providedIn: 'root'
})
export class OrlasDataService {
  private readonly COOKIE_KEY = 'my_auth_token'
  private firebaseUrl = firebaseConfig.databaseURL
  private firebaseFolder = 'orlas'
  private objectList: any[] = []

  constructor(private cookieService: CookieService, private http: HttpClient) { }

  refreshObjectList(obj: any): any[] {
    const index = this.objectList.findIndex(parameter => parameter.id === obj.id)
    if (index >= 0 && index < this.objectList.length) {
      this.objectList[index] = obj;
    }
    return this.objectList;
  }

  updateObject(obj: any) {
    const token = this.cookieService.get(this.COOKIE_KEY)
    return this.http.put(this.firebaseUrl + '/' + this.firebaseFolder + '/' + obj.id + '.json?auth=' + token, obj);
  }

  saveObjectList(objList: any): Observable<any> { //objList must be a dictionary (key-value)
    const token = this.cookieService.get(this.COOKIE_KEY)
    return this.http.put(this.firebaseUrl + '/' + this.firebaseFolder + '.json?auth=' + token, objList);
  }

  getObjectList(): Observable<any> {
    const token = this.cookieService.get(this.COOKIE_KEY)
    return this.http.get(this.firebaseUrl + '/' + this.firebaseFolder + '.json?auth=' + token);
  }

  addObject(obj: any): Observable<any> {
    const token = this.cookieService.get(this.COOKIE_KEY)
    return this.http.put(this.firebaseUrl + '/' + this.firebaseFolder + '/' + obj.id + '.json?auth=' + token, obj);
  }

  deleteObject(id: string) {
    const token = this.cookieService.get(this.COOKIE_KEY)
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    }
    return this.http.delete(this.firebaseUrl + '/' + this.firebaseFolder + '/' + id + '.json?auth=' + token, httpOptions)
  }

}