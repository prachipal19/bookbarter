import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AddBookComponent } from './pages/add-book/add-book.component';
import { ListingsComponent } from './pages/listings/listings.component';
import { MylistingsComponent } from './pages/mylistings/mylistings.component';
import { ExchangerequestsComponent } from './pages/exchangerequests/exchangerequests.component';
import { ShopComponent } from './pages/shop/shop.component';
const routes: Routes = [
  {
    path:'',
    redirectTo : 'dashboard',
    pathMatch:'full'
  },
  {
    path:'login',
    component: LoginComponent
  },
  {
    path:'',
    component: LayoutComponent,
    children: [
      {
        path:'dashboard',
        component:DashboardComponent
      },
      {
        path:'Shop',
        component:ShopComponent
      },
      {
        path: 'add-book',
        component: AddBookComponent
      },
      {
        path: 'listings',
        component: ListingsComponent
      },
      {
        path: 'mylistings',
        component: MylistingsComponent
      },
      {
        path: 'exchangerequests',
        component: ExchangerequestsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
