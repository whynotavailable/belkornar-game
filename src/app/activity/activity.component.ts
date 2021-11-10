import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Observable, Subscription, switchMap} from "rxjs";
import {ActivitiesService} from "../services/activities.service";
import {SchedulerService} from "../services/scheduler.service";

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit, OnDestroy {
  routeSub: Subscription | null = null;
  timerSub: Subscription | null = null;

  activities: Process[] = [];

  currentActivity: string = '';
  currentProgress: number = 0;

  constructor(private activatedRoute: ActivatedRoute, private activitiesService: ActivitiesService,
              private scheduler: SchedulerService) {
  }

  ngOnInit(): void {
    this.routeSub = this.activatedRoute.params
      .pipe(switchMap(params => {
        if (params['id'] !== undefined) {
          return this.activitiesService.getActivitiesByParentId(params['id']);
        }
        else {
          return this.activitiesService.getActivitiesByGroup(params['group']);
        }
      }))
      .subscribe(x => {
        this.activities = x;
      });

    this.timerSub = this.scheduler.timer$
      .subscribe(x => this.updateUi())
  }

  updateUi() {
    let task = this.scheduler.getTask('activity');

    if (task === null) {
      this.currentActivity = '';
      this.currentProgress = 0;
      return;
    }

    this.currentActivity = task.owner;
    this.currentProgress = task.percentTimeLeft;
  }

  getProgress(id: string): number {
    if (this.currentActivity === id) {
      return this.currentProgress;
    }
    else {
      return 0;
    }
  }

  startActivity(id: string) {
    let task = this.scheduler.getTask('activity');

    if (task !== null && task.owner === id) {
      this.scheduler.clearTask();
      this.currentActivity = '';
      this.currentProgress = 0;
    }
    else {
      this.activitiesService.startActivity(id);
    }
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.timerSub?.unsubscribe();
  }

}
