import { Routes, RouterModule } from '@angular/router';
import {SetorPage} from "./pages/setor.page";
import {AppComponent} from "./app.component";

export const routes: Routes = [
  {
    path: 'setor',
    component: SetorPage
  }
];

export const AppRoutes = RouterModule.forRoot(routes);
