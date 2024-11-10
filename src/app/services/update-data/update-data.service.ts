import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UpdateDataService {

  constructor(private http: HttpClient) {}

  updateData(updateUrl:string , data: any): Observable<any> {
  

    return this.http.put(updateUrl, data);
  }
}
