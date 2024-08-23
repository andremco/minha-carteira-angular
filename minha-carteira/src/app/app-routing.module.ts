import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetorComponent } from "./components/setor/setor.component";
import { AcaoComponent } from "./components/acao/acao.component";
import { CarteiraComponent } from "./components/carteira/carteira.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {TableListComponent} from "./components/table-list/table-list.component";
import {AtivoComponent} from "./components/ativo/ativo.component";

const routes: Routes = [
  {
    path: '',
    component: CarteiraComponent
  },
  {
    path: 'ativo',
    component: AtivoComponent
  },
  {
    path: 'setor',
    component: SetorComponent
  },
  {
    path: 'acao',
    component: AcaoComponent
  },
  { path: 'dashboard',      component: DashboardComponent },
  { path: 'table-list',     component: TableListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
