import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DeleteDataService {

  constructor(private http: HttpClient) { }

  DeleteData(url: string, id: number){
    return this.http.delete(url+"/"+id.toString());
  }
}
