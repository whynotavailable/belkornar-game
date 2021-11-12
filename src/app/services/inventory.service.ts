import { Injectable } from '@angular/core';
import {catchError, map, Observable, single, Subject} from "rxjs";
import {ItemService} from "./item.service";
import {SchedulerService} from "./scheduler.service";
import {StorageService} from "./storage.service";

/**
 * Equipment Slots
 * Helmet
 * Body
 * Legs
 * Boots
 * Gloves
 * Main Hand
 * Off Hand
 * Ammo
 * Neck
 * Ring 1
 * Ring 2
 * Backpack
 * Back
 */

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  maxSlots = 10; // make this changable via equipment later
  gold: number = 0;
  inventory: InventoryItem[] = [];

  equipment: Record<string, InventoryItem | null> = {};

  inventoryChanges$: Subject<InventoryChange[]> = new Subject<InventoryChange[]>()
  goldChanged$: Subject<number> = new Subject<number>();
  equipmentChanged$: Subject<1> = new Subject<1>();

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
    this.storageService.set('equipment', this.equipment);
    this.storageService.set('inventory', this.inventory);
    this.storageService.set('gold', this.gold)
  }

  load() {
    this.equipment = this.storageService.get('equipment', {});
    this.inventory = this.storageService.get('inventory', []);
    this.gold = this.storageService.get('gold', 0);

    // fill the rest of the inventory slots with null to clean up the data.
    for (let slot of Object.keys(this.equipmentSlots)) {
      if (this.equipment[slot] === undefined) {
        this.equipment[slot] = null;
      }
    }
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

  tryUnEquipItem(slot: string) {
    let currentItem = this.equipment[slot];

    if (currentItem === null) {
      return;
    }

    let changes: InventoryChange[] = [
      {
        id: currentItem.id,
        name: currentItem.name,
        change: 1
      }
    ]

    this.tryUpdateInventory(changes)
      .subscribe(() => {
        this.equipment[slot] = null
        this.persist()
        this.equipmentChanged$.next(1);
      });
  }

  tryEquipItem(id: string) {
    let item = this.inventory.first(x =>  x.id === id);

    if (item.type !== 'equipment') {
      // lol no thanks
      return;
    }

    if (item === null) {
      return;
    }

    let slot = item.slot || ''; // this is just to get ts off my back

    let changes: InventoryChange[] = [
      {
        id: item.id,
        name: item.name,
        change: -1
      }
    ]

    let currentItem = this.equipment[slot];

    if (currentItem !== null && currentItem !== undefined) {
      changes.push({
        id: currentItem.id,
        name: currentItem.name,
        change: 1
      })
    }

    this.tryUpdateInventory(changes)
      .subscribe(() => {
        this.equipment[slot] = item
        this.persist()
        this.equipmentChanged$.next(1);
      });
  }

  get equipmentSlots(): Record<string, string> {
    return {
      head: 'Head',
      body: 'Body',
      legs: 'Legs',
      boots: 'Boots',
      gloves: 'Gloves',
      main_hand: 'Main Hand',
      off_hand: 'Off Hand',
      ammo: 'Ammo',
      neck: 'Neck',
      ring1: 'Ring 1',
      ring2: 'Ring 2',
      backpack: 'Backpack',
      back: 'Back',
    }
  }
}
