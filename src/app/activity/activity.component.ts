import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Observable, Subscription, switchMap} from "rxjs";
import {ActivitiesService} from "../services/activities.service";

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit, OnDestroy {
  routeSub: Subscription | null = null;

  activities: Process[] = [];

  constructor(private activatedRoute: ActivatedRoute, private activitiesService: ActivitiesService) {

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
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

}
