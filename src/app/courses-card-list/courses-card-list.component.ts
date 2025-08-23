import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Course} from "../model/course";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { openEditCourseDialog } from '../course-dialog/course-dialog.component';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'courses-card-list',
    templateUrl: './courses-card-list.component.html',
    styleUrls: ['./courses-card-list.component.scss'],
    standalone: false
})
export class CoursesCardListComponent implements OnInit {

    @Input()
    courses: Course[];

    constructor(private dialog: MatDialog) {
    }

    ngOnInit() {

    }

    editCourse(course: Course) {
        const dialog$ = openEditCourseDialog(this.dialog, course);
        dialog$.pipe(
            filter((val) => !!val)
        )
        .subscribe((result) => {
            if (result) {
                console.log('Course updated:', result);
                // Update the course in the list
                const index = this.courses.findIndex(c => c.id === result.id);
                if (index !== -1) {
                    this.courses[index] = result;
                }
            }
        });
    }
}









