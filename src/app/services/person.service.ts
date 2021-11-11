import { Injectable } from '@angular/core';
import {map, Observable} from "rxjs";
import {DataService} from "./data.service";

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(private dataService: DataService) { }

  getPeople(ids: string[]): Observable<Person[]> {
    return this.dataService.data$.pipe(map(data => {
      return data.people.filter(x => ids.indexOf(x.id) !== -1);
    }));
  }

  getPerson(id: string): Observable<Person> {
    return this.dataService.data$.pipe(map(data => {
      return data.people.first(x => x.id === id);
    }));
  }
}
