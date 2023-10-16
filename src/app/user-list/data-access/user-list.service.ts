import { Injectable, computed, signal } from '@angular/core';
import { UsersWithPagination } from 'src/app/shared/utils/user';
@Injectable({
  providedIn: 'root',
})

export class UserListService {

  private URL = 'https://reqres.in/api/users';

  #usersWithPagination = signal({} as UsersWithPagination);
  usersWithPaginationCacheArray = [] as UsersWithPagination[];
  public users = computed(() => this.#usersWithPagination().data);
  public totalData = computed(() => this.#usersWithPagination().total);

  public getUsers(
    page: number,
    pageSize: number
  ) {
    if (pageSize !== this.#usersWithPagination().per_page) this.usersWithPaginationCacheArray = [];
    if (this.usersWithPaginationCacheArray[page]) {
      this.#usersWithPagination.update(() => this.usersWithPaginationCacheArray[page]);
    } else {
      fetch(`${this.URL}?page=${page}&per_page=${pageSize}`)
        .then(response => response.json())
        .then((data: UsersWithPagination) => {
          this.#usersWithPagination.update(() => data);
          this.usersWithPaginationCacheArray[page] = data;
        });
    }
  }
}
