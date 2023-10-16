import { Routes } from '@angular/router';
import { TodosComponent } from './todos/feature/todos.component';
import { UserListComponent } from './user-list/feature/user-list.component';

export const routes: Routes = [
  { path: '', component: TodosComponent },
  { path: 'user-list', component: UserListComponent }
];
