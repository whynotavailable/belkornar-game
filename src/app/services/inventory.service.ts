import { Injectable } from '@angular/core';
import {catchError, map, Observable, single, Subject} from "rxjs";
import {ItemService} from "./item.service";
import {SchedulerService} from "./scheduler.service";
import {StorageService} from "./storage.service";

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  maxSlots = 10; // make this changable via equipment later
  gold: number = 0;
  inventory: InventoryItem[] = []

  inventoryChanges$: Subject<InventoryChange[]> = new Subject<InventoryChange[]>()
  goldChanged$: Subject<number> = new Subject<number>();

  constructor(private itemService: ItemService, private schedulerService: SchedulerService,
              private storageService: StorageService) {
    this.load();
  }

  tryUpdateInventory(changes: InventoryChange[], gold: number = 0): Observable<boolean> {
    return this.getTemporaryInventory(changes, gold)
      .pipe(
        catchError(err => {
          this.cancelChange(err);
          // rethrow so the map doesn't happen
          throw err;
        }),
        map(({inventory, gold}) => {
          this.inventory = inventory;
          this.gold = gold;

          this.persist();
          this.inventoryChanges$.next(changes);
          return true;
      }))
      /*.subscribe({
        next: ({inventory, gold}) => {
          this.inventory = inventory;
          this.gold = gold;

          this.persist();
          this.inventoryChanges$.next(changes);
        },
        error: err => {
          this.cancelChange(err)
        }
      })*/
  }

  tryUpdateGold(change: number) {
    let newGold = this.gold + change;
    if (newGold < 0) {
      throw new Error('not enough gold');
    }

    this.gold = newGold;
    this.goldChanged$.next(newGold);
  }

  persist() {
    this.storageService.set('inventory', this.inventory);
    this.storageService.set('gold', this.gold)
  }

  load() {
    this.inventory = this.storageService.get('inventory', []);
    this.gold = this.storageService.get('gold', 0);
  }

  getTemporaryInventory(changes: InventoryChange[], gold: number): Observable<{
    inventory: InventoryItem[],
    gold: number
  }> {
    // apply the changes and check if the inventory is valid.
    // if it's not kill the current action also
    // TODO add success/error toastr

    return this.itemService.getItems(changes.map(x => x.id))
      .pipe(single(), map(items => {
        let newInventory = this.inventory.map(x => ({...x}));

        let newGold = this.gold + gold;
        if (newGold < 0) {
          throw new Error('not enough gold');
        }

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
        return {
          inventory: newInventory,
          gold: newGold
        };
      }))
  }

  cancelChange(error: string) {
    // bro, how did this even happen
    console.log('change cancelled', error);
    this.schedulerService.clearTask();
  }
}
