import { Injectable } from '@angular/core';
import {DataService} from "./data.service";
import {combineLatestWith, concatMap, concatWith, filter, map, mergeMap, Observable, of, single, switchMap} from "rxjs";
import {SchedulerService} from "./scheduler.service";
import {InventoryService} from "./inventory.service";

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  constructor(private dataService: DataService, private schedulerService: SchedulerService, private inventoryService: InventoryService) {
    this.schedulerService.completedTasks$
      .pipe(
        filter(x => x.taskType === 'activity'),
        switchMap(task => of(task)
          .pipe(
            switchMap(x => this.getActivity(task.owner)),
            map(activity => ({task, activity})))),
      )
      .subscribe(({task, activity}) => {
        let inventoryChanges: InventoryChange[] = [];

        for (let input of activity.input || []) {
          inventoryChanges.push({
            id: input.id,
            change: 0 - (input.amount || 1)
          })
        }
        for (let output of activity.output || []) {
          inventoryChanges.push({
            id: output.id,
            change: (output.amount || 1)
          })
          inventoryService.tryUpdateInventory(inventoryChanges).subscribe();
        }
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
