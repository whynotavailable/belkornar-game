import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {InventoryService} from "../services/inventory.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit, OnDestroy {
  inventorySub: Subscription | null = null;

  @Input() customAction: CustomInventoryAction | null = null;

  @Output() selectedItems = new EventEmitter<InventoryItem[]>()

  _selectedItems: string[] = [];

  inventory: InventoryItem[] = [];

  amountMode = 'custom'
  amountCustom = '1';

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
    }]).subscribe();
  }

  getValue(item: InventoryItem): number {
    return Math.ceil((item.cost || 0) / 2) * this.getCount(item);
  }

  getCount(item: InventoryItem) {
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

  equipItem(id: string) {
    this.inventoryService.tryEquipItem(id);
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
