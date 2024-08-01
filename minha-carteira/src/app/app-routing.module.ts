import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetorComponent } from "./components/setor/setor.component";
import { AcaoComponent } from "./components/acao/acao.component";
import { CarteiraComponent } from "./components/carteira/carteira.component";

const routes: Routes = [
  {
    path: '',
    component: CarteiraComponent
  },
  {
    path: 'setor',
    component: SetorComponent
  },
  {
    path: 'acao',
    component: AcaoComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
