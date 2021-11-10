import {Component, OnDestroy, OnInit} from '@angular/core';
import {InventoryService} from "../services/inventory.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit, OnDestroy {
  inventorySub: Subscription | null = null;
  inventory: InventoryItem[] = [];

  constructor(private inventoryService: InventoryService) { }

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
