import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UsersWithPagination } from 'src/app/shared/utils/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserListService {
  constructor(private http: HttpClient) {}

  #usersWithPagination = signal({} as UsersWithPagination);
  public users = computed(() => this.#usersWithPagination().data);
  public totalData = computed(() => this.#usersWithPagination().total);


  public getUsers(
    page: number,
    pageSize: number
  ) {
    this.http.get<UsersWithPagination>(
      'https://reqres.in/api/users?page=' + page + '&per_page=' + pageSize
    ).subscribe((data : UsersWithPagination) => {
      this.#usersWithPagination.update(() => data);
    }
    );
  }
}
