import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from "./services/data.service";
import {AreaService} from "./services/area.service";
import {combineLatest, Subscription, switchMap} from "rxjs";
import {ActivitiesService} from "./services/activities.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'belkornar';

  activities: Process[] = [];

  currentArea: string = '';
  activitiesSub: Subscription | null = null;
  areaSub: Subscription | null = null;

  constructor(private areaService: AreaService, private activitiesService: ActivitiesService) {

  }

  getLink(activity: Process): string {
    if (activity.group !== undefined) {
      return `/activity-group/${activity.group}`;
    }
    else {
      return `/activity/${activity.id}`;
    }
  }

  ngOnInit(): void {
    this.activitiesSub = this.areaService.getAreaData()
      .pipe(switchMap(area => {
        return this.activitiesService.getActivities(area.activities || []);
      }))
      .subscribe(activities => {
        this.activities = activities;
      })

    this.areaSub = this.areaService.getAreaData()
      .subscribe(area => this.currentArea = area.name)
  }

  ngOnDestroy(): void {
    // technically likely not needed but eh
    this.activitiesSub?.unsubscribe();
    this.areaSub?.unsubscribe();
  }


}
