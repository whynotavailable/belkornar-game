import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from "./services/data.service";
import {AreaService} from "./services/area.service";
import {combineLatest, combineLatestWith, Subscription, switchMap} from "rxjs";
import {ActivitiesService} from "./services/activities.service";
import {PersonService} from "./services/person.service";
import {InventoryService} from "./services/inventory.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'belkornar';

  activities: Process[] = [];
  people: Person[] = [];

  currentArea: string = '';
  activitiesSub: Subscription | null = null;
  areaSub: Subscription | null = null;
  peopleSub: Subscription | null = null;
  goldSub: Subscription | null = null;

  gold: number = 0;

  constructor(private areaService: AreaService, private activitiesService: ActivitiesService,
              private personService: PersonService, private inventoryService: InventoryService) {

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
        return combineLatest([
          this.activitiesService.getActivities(area.activities || []),
          this.personService.getPeople(area.people || [])
        ])
      }))
      .subscribe(([activities, people]) => {
        this.activities = activities;
        this.people = people;
      })

    this.areaSub = this.areaService.getAreaData()
      .subscribe(area => this.currentArea = area.name)

    this.gold = this.inventoryService.gold;

    this.goldSub = this.inventoryService.inventoryChanges$
      .subscribe(gold => {
        this.gold = this.inventoryService.gold;
      })
  }

  ngOnDestroy(): void {
    // technically likely not needed but eh
    this.activitiesSub?.unsubscribe();
    this.areaSub?.unsubscribe();
  }


}
