import { Injectable } from '@angular/core';
import {catchError, map, Observable, single, Subject} from "rxjs";
import {ItemService} from "./item.service";
import {SchedulerService} from "./scheduler.service";

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  maxSlots = 5; // make this changable via equipment later
  inventory: InventoryItem[] = []

  inventoryChanges$: Subject<InventoryChange[]> = new Subject<InventoryChange[]>()

  constructor(private itemService: ItemService, private schedulerService: SchedulerService) { }

  tryUpdateInventory(changes: InventoryChange[]) {
    this.getTemporaryInventory(changes)
      .subscribe({
        next: (inventory: InventoryItem[]) => {
          this.inventory = inventory;
          this.inventoryChanges$.next(changes);
        },
        error: err => {
          this.cancelChange(err)
        }
      })
  }

  persist() {

  }

  getTemporaryInventory(changes: InventoryChange[]): Observable<InventoryItem[]> {
    // apply the changes and check if the inventory is valid.
    // if it's not kill the current action also
    // TODO add success/error toastr

    return this.itemService.getItems(changes.map(x => x.id))
      .pipe(single(), map(items => {
        let newInventory = this.inventory.map(x => ({...x}));

        for(let change of changes) {
          let itemInInventory = newInventory.first(x => x.id === change.id);
          let item = items.first(x => x.id === change.id);
          change.name = item.name;

          if (itemInInventory !== null) {
            itemInInventory.count += change.change;

            if (itemInInventory.count === 0) {
              newInventory = newInventory.remove(x => x.id === itemInInventory.id);
            }
            else if(itemInInventory.count < 0) {
              throw new Error('Not enough in inventory')
            }
          }
          else {
            if (change.change < 0) {
              throw new Error('Not enough in inventory')
            }

            let newInventoryItem: InventoryItem = {
              ordinal: 99,
              count: change.change,
              ...item
            }

            newInventory.push(newInventoryItem);
          }
        }

        let usedSlots = 0;

        newInventory.forEach(x => {
          if (x.stackable === true) {
            usedSlots += 1;
          }
          else {
            usedSlots += x.count;
          }
        });

        if (usedSlots > this.maxSlots) {
          throw new Error('Not enough room')
        }
        return newInventory;
      }))
  }

  cancelChange(error: string) {
    // bro, how did this even happen
    console.log('change cancelled');
    this.schedulerService.clearTask();
  }
}
