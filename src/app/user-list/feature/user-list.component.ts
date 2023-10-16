import { Component, ViewChild, computed, inject, Signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListService } from '../data-access/user-list.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { startWith } from 'rxjs';
import { User } from 'src/app/shared/utils/user';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {
  userListService = inject(UserListService);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizes: number[] = [5, 10, 25, 100];
  displayedColumns: string[] = ['id', 'email', 'first_name', 'last_name']

  dataSource: Signal<MatTableDataSource<User>> = computed(
    () => new MatTableDataSource<User>(this.userListService.users())
  );

  isLoading: Signal<Boolean> = computed(() => {
    return this.userListService.users() ? false : true;
  });

  public ngAfterViewInit(): void {
    this.paginator.page
      .pipe(startWith({ pageIndex: 0, pageSize: 5 }))
      .subscribe((data) => {
        this.userListService.getUsers(data.pageIndex + 1, data.pageSize);
      });
  }
}
