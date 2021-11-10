import { Injectable } from '@angular/core';
import {Observable, single} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  data$: Observable<DataFile> = this.http.get<DataFile>('/assets/datafile.json')
    .pipe(single())

  constructor(private http: HttpClient) { }


}
