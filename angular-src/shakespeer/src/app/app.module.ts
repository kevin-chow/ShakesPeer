import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './components/main/main.component';
import { NetworkComponent } from './components/network/network.component';
import { RelationshipComponent } from './components/relationship/relationship.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import {FilterService} from "./services/filter.service";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent,
    NetworkComponent,
    RelationshipComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule
  ],
  providers: [FilterService],
  bootstrap: [AppComponent]
})
export class AppModule { }
