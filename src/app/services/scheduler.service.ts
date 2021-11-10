import { Injectable } from '@angular/core';
import {interval, Observable, Subject, timer} from "rxjs";

/**
 * So actions that are performed based on the scheduler are done without the UI necessarily dealing with them.
 * If the UI asks the scheduler for a task and it doesn't return any data it will assume that task has either
 * completed or been cancelled.
 */
@Injectable({
  providedIn: 'root'
})
export class SchedulerService {
  timer$: Observable<number> = interval(100);
  completedTasks$: Subject<ScheduledTask> = new Subject<ScheduledTask>();

  private tasks: ScheduledTask[] = [];

  constructor() {
    this.timer$
      .subscribe(() => {
        let now = Date.now();
        // TODO: Start with all of them at the same time but maybe just one per cycle
        let completedTasks = this.tasks.filter(x => x.endTime < now);
        for (let task of completedTasks) {
          this.completedTasks$.next(task);

          if (task.interval === null) {
            this.clearTask(task.actor, task.group);
          }
          else {
            // reset the timer data
            task.startTime = Date.now();
            task.endTime = task.startTime + (task.interval * 1000);
          }
        }
      })
  }

  addTask(taskType: string,
          owner: string,
          seconds: number,
          actor: string = 'player',
          group: string = 'normal') {
    this.addTaskInternal({
      group,
      taskType,
      owner,
      actor,
      startTime: 0,
      endTime: 0,
      percentTimeLeft: 0,
      interval: null
    }, seconds)
  }

  addRepeatingTask(taskType: string,
          owner: string,
          seconds: number,
          actor: string = 'player',
          group: string = 'normal') {
    // kill any old tasks in that group for that actor
    this.addTaskInternal({
      group,
      taskType,
      owner,
      actor,
      startTime: 0,
      endTime: 0,
      percentTimeLeft: 0,
      interval: seconds
    }, seconds)
  }

  private addTaskInternal(task: ScheduledTask, seconds: number) {
    this.tasks = this.tasks.filter(x => !(x.group === task.group && x.actor === task.actor));

    task.startTime = Date.now();
    task.endTime = task.startTime + (seconds * 1000);

    this.tasks.push(task);
  }

  getTask(taskType: string, actor: string = 'player', group: string = 'normal'): ScheduledTask {
    let task = this.tasks.filter(x =>
      x.taskType === taskType &&
      x.actor === actor &&
      x.group === group)[0] || null;

    if (task !== null) {
      let now = Date.now();
      let max = task.endTime - task.startTime;
      let current = now - task.startTime;
      task.percentTimeLeft = (current/max) * 100;
    }

    return task;
  }

  clearTask(actor: string = 'player', group: string = 'normal') {
    this.tasks = this.tasks.filter(x => !(x.group === group && x.actor === actor));
  }
}

