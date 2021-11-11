import { Component, OnInit } from '@angular/core';
import {PersonService} from "../services/person.service";
import {DataService} from "../services/data.service";
import {ActivatedRoute} from "@angular/router";
import {switchMap, tap} from "rxjs";
import {ItemService} from "../services/item.service";
import {InventoryService} from "../services/inventory.service";

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {
  person: Person = <Person><any>null;
  soldItems: ItemWithCount[] = [];

  amountMode = 'custom'
  amountCustom = '1';

  currentSection: string = 'person'

  constructor(private activatedRoute: ActivatedRoute, private dataService: DataService, private personService: PersonService,
              private itemService: ItemService, private inventoryService: InventoryService) { }

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
        this.soldItems = items.map(item => ({
          ...item,
          count: this.person?.sells?.first(x => x.id === item.id).count || 1
        }));

        this.currentSection = 'person';
      })
  }

  setSection(section: string) {
    this.currentSection = section;
  }

  // TODO: Get rid of this duplicate code
  getCount(item: ItemWithCount) {
    let count = parseInt(this.amountCustom);

    if (this.amountMode === '10') {
      count = 10;
    }

    count = count > item.count ? item.count : count;

    if (this.amountMode === 'all') {
      count = item.count;
    }
    return count;
  }

  sellItem(item: InventoryItem, count: number) {
    let cost = Math.ceil((item.cost || 0) / 2) * count;
    console.log((this.person.gold || 0 ) > cost)
    if (this.person.gold || 0 > cost) {
      // TODO: make this return an observable so I can action off of it
      this.inventoryService.tryUpdateInventory([{
        id: item.id,
        name: item.name,
        change: 0 - count
      }], cost)
        .subscribe(() => {
          // literally just to get ts off my back
          if (this.person.gold !== undefined) {
            this.person.gold -= cost;
          }

          // TODO: update the sellers inventory with sold items.
        })
    }
  }

  buyItem(item: ItemWithCount) {
    let count = this.getCount(item);
    let cost = (item.cost || 0) * count;

    this.inventoryService.tryUpdateInventory([{
      id: item.id,
      name: item.name,
      change: count
    }], 0 - cost).subscribe(() => {
      if (this.person.gold !== undefined) {
        this.person.gold += cost;
      }

      item.count -= count;
    })
  }
}


interface ItemWithCount extends Item {
  count: number
}
