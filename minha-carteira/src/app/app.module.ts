import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutes } from "./app.routes";
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {SetorPage} from "./pages/setor.page";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatLabel} from "@angular/material/form-field";


@NgModule({
  declarations: [
    AppComponent,
    SetorPage
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    MatSlideToggleModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    AppRoutes,
    MatFormField,
    MatInput,
    MatLabel
  ],
  providers: [],
  bootstrap: [AppComponent,SetorPage]
})
export class AppModule { }
