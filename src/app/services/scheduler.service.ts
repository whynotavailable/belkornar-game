import { Injectable } from '@angular/core';
import {Observable, timer} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SchedulerService {
  timer$: Observable<0> = timer(100);

  constructor() { }
}
