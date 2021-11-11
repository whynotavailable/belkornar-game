import { Component, OnInit } from '@angular/core';
import {PersonService} from "../services/person.service";
import {DataService} from "../services/data.service";
import {ActivatedRoute} from "@angular/router";
import {switchMap, tap} from "rxjs";
import {ItemService} from "../services/item.service";

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {
  person: Person | null = null;
  soldItems: Item[] = [];

  currentSection: string = 'person'

  constructor(private activatedRoute: ActivatedRoute, private dataService: DataService, private personService: PersonService,
              private itemService: ItemService) { }

  ngOnInit(): void {
    this.activatedRoute
      .params.pipe(
        switchMap(params => this.personService.getPerson(params['person'])),
        tap(person => {
          this.person = person;
        }),
        switchMap(person => this.itemService.getItems(person.sells?.map(x => x.id) || []))
      )
      .subscribe(items => {
        this.soldItems = items;
        this.currentSection = 'person'
      })
  }

  setSection(section: string) {
    this.currentSection = section;
  }

}
