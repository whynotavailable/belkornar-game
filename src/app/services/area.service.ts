import { Injectable } from '@angular/core';
import {BehaviorSubject, combineLatest, map, Observable, switchMap} from "rxjs";
import {DataService} from "./data.service";

@Injectable({
  providedIn: 'root'
})
export class AreaService {
  currentArea$: BehaviorSubject<string> = new BehaviorSubject<string>(AreaService.getCurrentArea());

  constructor(private dataService: DataService) { }

  private static getCurrentArea(): string {
    return 'area__basic_village';
  }

  getAreaData(): Observable<Area> {
    return combineLatest([this.dataService.data$, this.currentArea$])
      .pipe(map(([data, area]) => {
        return data.areas.filter(x => x.id === area)[0] || null;
      }))
  }
}
