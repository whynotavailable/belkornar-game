import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {InventoryService} from "../services/inventory.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit, OnDestroy {
  inventorySub: Subscription | null = null;

  @Output() selectedItems = new EventEmitter<InventoryItem[]>()

  _selectedItems: string[] = [];

  inventory: InventoryItem[] = [];

  amountMode = 'all'
  amountCustom = 1;

  constructor(private inventoryService: InventoryService) { }

  selectItem(id: string) {
    if (this.isItemSelected(id)) {
      this._selectedItems = this._selectedItems.remove(x => x === id);
    }
    else {
      this._selectedItems.push(id);
    }
  }

  isItemSelected(id: string ): boolean {
    return this._selectedItems.filter(x => x === id).length > 0;
  }

  dropItem(id: string) {
    let item = this.inventory.first(x => x.id === id);
    let count = this.getCount(item);

    this.inventoryService.tryUpdateInventory([{
      id: item.id,
      change: 0 - count
    }]);
  }

  private getCount(item: InventoryItem) {
    let count = this.amountCustom;

    if (this.amountMode === '10') {
      count = 10;
    }

    count = count > item.count ? item.count : count;

    if (this.amountMode === 'all') {
      count = item.count;
    }
    return count;
  }

  ngOnInit(): void {
    this.inventory = this.inventoryService.inventory;

    this.inventorySub = this.inventoryService.inventoryChanges$
      .subscribe(() => this.updateUi());
  }

  private updateUi() {
    this.inventory = this.inventoryService.inventory;
  }

  ngOnDestroy(): void {

  }
}
