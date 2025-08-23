import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from "moment";

@Component({
  selector: "course-dialog",
  templateUrl: "./course-dialog.component.html",
  styleUrls: ["./course-dialog.component.scss"],
  standalone: false,
})
export class CourseDialogComponent implements OnInit {
  description: string;
  form = this.fb.group({
    description: [this.course.description, Validators.required],
    category: [this.course.category, Validators.required],
    releasedAt: [new Date(), Validators.required],
    longDescription: [this.course.longDescription, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private course: Course,
    private dialogRef: MatDialogRef<CourseDialogComponent>
  ) {
    this.description = course.description;
  }

  ngOnInit() {}

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}

export function openEditCourseDialog(dialog: MatDialog, course: Course) {
  const dialogRef = dialog.open(CourseDialogComponent, {
    disableClose: true,
    autoFocus: true,
    width: "90%",
    // minHeight: "400px",
    // minWidth: "600px",
    // maxHeight: "80%",
    maxWidth: "400px",
    data: { ...course },
  });

  return dialogRef.afterClosed();
}
