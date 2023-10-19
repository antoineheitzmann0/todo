import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { UsersWithPagination } from 'src/app/shared/utils/user';
@Injectable({
  providedIn: 'root',
})

export class UserListService {

  constructor(private http: HttpClient) { }

  private URL = 'https://reqres.in/api/users';
  private usersWithPaginationCacheArray : UsersWithPagination[] = [];

  public getUsers(
    page: number,
    pageSize: number
  ): Observable<UsersWithPagination> {
    return this.http.get<UsersWithPagination>(`${this.URL}?page=${page}&per_page=${pageSize}`);
  }

  public getUsersUsingCache(
    page: number,
    pageSize: number
  ): Observable<UsersWithPagination> {
    const cachedUsers = this.usersWithPaginationCacheArray.find(
      (cachedUser) => cachedUser.page === page && cachedUser.per_page === pageSize
    );
    if (cachedUsers) {
      return of(cachedUsers);
    } else {
      return this.http.get<UsersWithPagination>(`${this.URL}?page=${page}&per_page=${pageSize}`).pipe(
        tap((usersWithPagination) => {
          this.usersWithPaginationCacheArray.push(usersWithPagination);
        })
      );
    }
  }
}
