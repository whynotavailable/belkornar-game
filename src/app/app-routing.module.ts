import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AreaComponent} from "./area/area.component";
import {ActivityComponent} from "./activity/activity.component";
import {InventoryPageComponent} from "./inventory-page/inventory-page.component";
import {PersonComponent} from "./person/person.component";
import {EquipmentComponent} from "./equipment/equipment.component";

const routes: Routes = [
  { path: 'area', component: AreaComponent },
  { path: 'activity/:id', component: ActivityComponent },
  { path: 'activity-group/:group', component: ActivityComponent},
  { path: 'inventory', component: InventoryPageComponent },
  { path: 'person/:person', component: PersonComponent },
  { path: 'equipment', component: EquipmentComponent },
  { path: '**', redirectTo: '/area' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
