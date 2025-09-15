import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { DashboardModule } from './features/dashboard/dashboard.module';
import { MinionsModule } from './features/minions/minions.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SharedModule,
    DashboardModule,
    MinionsModule,
    AppRoutingModule // AppRoutingModule deve vir por último
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }