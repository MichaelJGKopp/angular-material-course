import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { Course } from "../model/course";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { openEditCourseDialog } from "../course-dialog/course-dialog.component";
import { filter } from "rxjs/operators";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";

@Component({
  selector: "courses-card-list",
  templateUrl: "./courses-card-list.component.html",
  styleUrls: ["./courses-card-list.component.scss"],
  standalone: false,
})
export class CoursesCardListComponent implements OnInit {
  @Input()
  courses: Course[];
  cols: number = 3;
  rowHeight: string = "500px";
  handsetPortrait: boolean = false;

  constructor(
    private dialog: MatDialog,
    private responsive: BreakpointObserver
  ) {}

  ngOnInit() {
    this.responsive
      .observe([
        Breakpoints.TabletPortrait,
        Breakpoints.TabletLandscape,
        Breakpoints.HandsetPortrait,
        Breakpoints.HandsetLandscape,
      ])
      .subscribe((result) => {
        this.cols = 3;
        this.rowHeight = "500px";
        this.handsetPortrait = false;

        const breakpoints = result.breakpoints;
        if (breakpoints[Breakpoints.TabletPortrait]) {
          this.cols = 1;
        } else if (breakpoints[Breakpoints.TabletLandscape]) {
          this.cols = 2;
        } else if (breakpoints[Breakpoints.HandsetPortrait]) {
          this.cols = 1;
          this.rowHeight = "475px";
          this.handsetPortrait = true;
        } else if (breakpoints[Breakpoints.HandsetLandscape]) {
          this.cols = 1;
        }
      });
  }

  editCourse(course: Course) {
    const dialog$ = openEditCourseDialog(this.dialog, course);
    dialog$.pipe(filter((val) => !!val)).subscribe((result) => {
      if (result) {
        console.log("Course updated:", result);
        // Update the course in the list
        const index = this.courses.findIndex((c) => c.id === result.id);
        if (index !== -1) {
          this.courses[index] = result;
        }
      }
    });
  }
}
