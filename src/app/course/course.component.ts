import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  viewChild,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Course } from "../model/course";
import { CoursesService } from "../services/courses.service";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  catchError,
  finalize,
} from "rxjs/operators";
import { merge, fromEvent, of, throwError } from "rxjs";
import { Lesson } from "../model/lesson";

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.scss"],
  standalone: false,
})
export class CourseComponent implements OnInit, AfterViewInit {
  course: Course;
  lessons: Lesson[] = [];
  loading = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService
  ) {}

  displayedColumns = ["seqNo", "description", "duration"];

  ngOnInit() {
    this.course = this.route.snapshot.data["course"];
    this.loadLessonsPage();
  }

  loadLessonsPage() {
    this.loading = true;
    this.coursesService
      .findLessons(
        this.course.id,
        this.sort?.direction ?? "asc",
        this.paginator?.pageIndex ?? 0,
        this.paginator?.pageSize ?? 3,
        this.sort?.active ?? "seqNo",
      )
      .pipe(
        tap((lessons) => (this.lessons = lessons)),
        catchError((error) => {
          console.error("Error loading lessons", error);
          alert("Error loading lessons");
          this.loading = false;
          return throwError(error);
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(
      this.sort.sortChange,
      this.paginator.page
    ).pipe(
      tap(() => this.loadLessonsPage())
    ).subscribe();
  }
}
