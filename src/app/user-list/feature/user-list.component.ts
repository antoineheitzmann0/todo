import {
  Component,
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
import { MatPaginatorModule } from '@angular/material/paginator';
import { BehaviorSubject, switchMap } from 'rxjs';
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

  private pageData$ = new BehaviorSubject({ pageIndex: 1, pageSize: 5 });
  private state = signal({} as UsersWithPagination);

  public users = computed(() => this.state().data);
  public totalData = computed(() => this.state().total);
  dataSource: Signal<MatTableDataSource<User>> = computed(
    () => new MatTableDataSource<User>(this.users())
  );
  isLoading: Signal<Boolean> = computed(() => {
    return this.users() ? false : true;
  });

  pageSizes: number[] = [5, 10, 25, 100];
  displayedColumns: string[] = ['id', 'email', 'first_name', 'last_name'];

  ngOnInit(): void {
    this.pageData$
      .pipe(
        switchMap((pageData) =>
          this.userListService.getUsersUsingCache(
            pageData.pageIndex,
            pageData.pageSize
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((usersWithPagination) => {
        this.state.set(usersWithPagination);
      });
  }

  onPageChange(event: any) {
    this.pageData$.next({
      pageIndex: event.pageIndex + 1,
      pageSize: event.pageSize,
    });
  }
}
