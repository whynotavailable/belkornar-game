import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import { AreaComponent } from './area/area.component';
import { ActivityComponent } from './activity/activity.component';
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { InventoryComponent } from './inventory/inventory.component';
import { InventoryPageComponent } from './inventory-page/inventory-page.component';
import {FormsModule} from "@angular/forms";
import { PersonComponent } from './person/person.component';
import { EquipmentComponent } from './equipment/equipment.component';

@NgModule({
  declarations: [
    AppComponent,
    AreaComponent,
    ActivityComponent,
    InventoryComponent,
    InventoryPageComponent,
    PersonComponent,
    EquipmentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ProgressbarModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

Array.prototype.first = function (predicate) {
  return this.filter(predicate)[0] || null;
}

Array.prototype.remove = function (predicate) {
  // basically return anything that doesn't match the predicate
  return this.filter(value => !predicate(value));
}
