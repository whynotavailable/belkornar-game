import { Injectable } from '@angular/core';
import {DataService} from "./data.service";
import {filter, map, Observable, of, single, switchMap} from "rxjs";
import {SchedulerService} from "./scheduler.service";

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  constructor(private dataService: DataService, private schedulerService: SchedulerService) {
    this.schedulerService.completedTasks$
      .pipe(filter(x => x.taskType === 'activity'))
      .subscribe(x => {
        console.log(x);
      })
  }

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

  startActivity(id: string) {
    this.getActivity(id)
      .pipe(single())
      .subscribe(activity => {
        if (activity.time !== undefined) {
          this.schedulerService
            .addRepeatingTask('activity', id, activity.time || 0);
        }
        else {
          console.warn(`no time set for ${activity.id}`);
        }
      })
  }
}
