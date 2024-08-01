import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatMenuModule } from "@angular/material/menu";
import { MatInputModule } from "@angular/material/input";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from './app-routing.module';
import { MatButtonModule } from "@angular/material/button";
import {  MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatCardModule } from "@angular/material/card";

import { AppComponent } from './app.component';
import { SetorComponent } from "./components/setor/setor.component";
import { AcaoComponent } from "./components/acao/acao.component";
import { CarteiraComponent } from "./components/carteira/carteira.component";

@NgModule({
  declarations: [
    AppComponent,
    SetorComponent,
    AcaoComponent,
    CarteiraComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    FlexLayoutModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
