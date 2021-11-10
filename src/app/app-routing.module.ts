import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AreaComponent} from "./area/area.component";
import {ActivityComponent} from "./activity/activity.component";
import {InventoryComponent} from "./inventory/inventory.component";

const routes: Routes = [
  { path: 'area', component: AreaComponent },
  { path: 'activity/:id', component: ActivityComponent },
  { path: 'activity-group/:group', component: ActivityComponent},
  { path: 'inventory', component: InventoryComponent },
  { path: '**', redirectTo: '/area' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
