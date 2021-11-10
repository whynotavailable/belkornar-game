import { Injectable } from '@angular/core';
import {DataService} from "./data.service";
import {map, Observable, of, switchMap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  constructor(private dataService: DataService) { }

  getActivities(ids: string[]): Observable<Process[]> {
    return this.dataService.data$.pipe(map(data => {
      return data.processes.filter(x => ids.indexOf(x.id) !== -1);
    }));
  }

  getActivitiesByParentId(id: string): Observable<Process[]> {
    return this.getActivity(id)
      .pipe(switchMap(activity => {
        return this.getActivities(activity.groups || []);
      }));
  }

  getActivitiesByGroup(group: string): Observable<Process[]> {
    return this.dataService.data$.pipe(map(data => {
      return data.processes.filter(x => x.group === group);
    }));
  }

  getActivity(id: string): Observable<Process> {
    return this.dataService.data$.pipe(map(data => {
      return data.processes.filter(x => id === x.id)[0] || null;
    }));
  }
}
