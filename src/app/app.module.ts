import { NgModule } from '@angular/core';
import { LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData, CommonModule } from '@angular/common';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getPtBrPaginatorIntl } from './custom-paginator';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from "@angular/material/dialog";
import { ToastrModule } from 'ngx-toastr';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { AppComponent } from './app.component';
import { SetorComponent } from "./components/setor/setor.component";
import { AcaoComponent } from "./components/acao/acao.component";
import { CarteiraComponent } from "./components/carteira/carteira.component";
import { AtivoComponent } from "./components/ativo/ativo.component";
import { TituloPublicoComponent } from "./components/titulo-publico/titulo-publico.component";
import { AporteComponent } from "./components/aporte/aporte.component";

import {TipoAtivoPipe} from "./pipe/TipoAtivoPipe";
import {NomeAtivoPipe} from "./pipe/NomeAtivoPipe";
import {TickerPipe} from "./pipe/TickerPipe";
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {TruncateTextoPipe} from "./pipe/TruncateTextoPipe";
import {
  PosicaoSetorDashboardComponent
} from "./components/carteira/components/posicao.setor.dashboard.component";


registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    SetorComponent,
    AcaoComponent,
    CarteiraComponent,
    AtivoComponent,
    TituloPublicoComponent,
    AporteComponent,
    TipoAtivoPipe,
    NomeAtivoPipe,
    TickerPipe,
    TruncateTextoPipe
  ],
  imports: [
    CommonModule,
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
    MatCardModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatDialogModule,
    ToastrModule.forRoot(),
    MatNativeDateModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    MatProgressSpinner,
    PosicaoSetorDashboardComponent
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: "pt-BR"
    },
    /* if you don't provide the currency symbol in the pipe,
      this is going to be the default symbol (R$) ... */
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'BRL'
    },
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
    {
      provide: MatPaginatorIntl,
      useValue: getPtBrPaginatorIntl()
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
