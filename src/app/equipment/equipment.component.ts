import { Component, OnInit } from '@angular/core';
import {InventoryService} from "../services/inventory.service";

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent implements OnInit {
  slots: {id: string, name: string}[]
  equipment: Record<string, InventoryItem | null> = {}

  constructor(public inventoryService: InventoryService) {
    this.slots = Object.keys(inventoryService.equipmentSlots)
      .map(slot => ({
        id: slot,
        name: inventoryService.equipmentSlots[slot]
      }));
  }

  ngOnInit(): void {
    this.equipment = this.inventoryService.equipment;
    console.log(this.equipment['head'])
  }

  unEquip(id: string) {
    this.inventoryService.tryUnEquipItem(id);
  }

}
