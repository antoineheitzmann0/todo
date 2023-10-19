import {
  Component,
  ViewChild,
  computed,
  inject,
  Signal,
  ChangeDetectionStrategy,
  signal,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListService } from '../data-access/user-list.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { startWith, switchMap } from 'rxjs';
import { User, UsersWithPagination } from 'src/app/shared/utils/user';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  userListService = inject(UserListService);
  destroyRef = inject(DestroyRef);
  #usersWithPagination = signal({} as UsersWithPagination);

  public users = computed(() => this.#usersWithPagination().data);
  public totalData = computed(() => this.#usersWithPagination().total);
  dataSource: Signal<MatTableDataSource<User>> = computed(
    () => new MatTableDataSource<User>(this.users())
  );
  isLoading: Signal<Boolean> = computed(() => {
    return this.users() ? false : true;
  });

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizes: number[] = [5, 10, 25, 100];
  displayedColumns: string[] = ['id', 'email', 'first_name', 'last_name'];

  public ngAfterViewInit(): void {
    this.paginator.page
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        startWith({ pageIndex: 0, pageSize: 5 }),
        switchMap((data) =>
          this.userListService.getUsersUsingCache(
            data.pageIndex + 1,
            data.pageSize
          )
        )
      )
      .subscribe((usersWithPagination) => {
        this.#usersWithPagination.set(usersWithPagination);
      });
  }
}
