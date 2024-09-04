import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetorComponent } from "./components/setor/setor.component";
import { AcaoComponent } from "./components/acao/acao.component";
import { CarteiraComponent } from "./components/carteira/carteira.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {TableListComponent} from "./components/table-list/table-list.component";
import {AtivoComponent} from "./components/ativo/ativo.component";
import {TituloPublicoComponent} from "./components/titulo-publico/titulo-publico.component";
import {AporteComponent} from "./components/aporte/aporte.component";

const routes: Routes = [
  {
    path: '',
    component: CarteiraComponent
  },
  {
    path: 'ativos',
    component: AtivoComponent
  },
  {
    path: 'setores',
    component: SetorComponent
  },
  {
    path: 'acoes',
    component: AcaoComponent
  },
  {
    path: 'titulos-publicos',
    component: TituloPublicoComponent
  },
  {
    path: 'aportes',
    component: AporteComponent
  },
  { path: 'dashboard',      component: DashboardComponent },
  { path: 'table-list',     component: TableListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
