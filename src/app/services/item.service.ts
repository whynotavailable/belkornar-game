import { Injectable } from '@angular/core';
import {map, Observable} from "rxjs";
import {DataService} from "./data.service";

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private dataService: DataService) { }

  getItems(ids: string[]): Observable<Item[]> {
    return this.dataService.data$.pipe(map(data => {
      return data.items.filter(x => ids.indexOf(x.id) !== -1);
    }));
  }
}
