import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddContractComponent } from './components/add-contract/add-contract.component';
import { ContractsComponent } from './components/contracts/contracts.component';
import { ContractDetailComponent } from './components/contract-detail/contract-detail.component';
import { ContractsListComponent } from './components/contracts-list/contracts-list.component';
import { SearchContractsComponent } from './components/search-contracts/search-contracts.component';


const routes: Routes = [
  {path: '', component:ContractsComponent},
  {path: 'save-contracts', component:ContractDetailComponent},
  {path: 'update-contract/:id', component:ContractDetailComponent},
  {path: 'contracts-list',component:ContractsListComponent},
  {path: 'search-contracts', component:SearchContractsComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
