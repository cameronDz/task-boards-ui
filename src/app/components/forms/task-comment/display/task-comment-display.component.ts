import { Component, Input, OnInit } from '@angular/core';
import { TodoComment } from '../../../../models/todo.model';

@Component({
    selector: 'nssd-task-comment-display',
    templateUrl: './task-comment-display.component.html',
    styleUrls: ['./task-comment-display.component.scss']
})
export class TaskCommentDisplayComponent implements OnInit {

    public readonly noCommentToDisplay: string = 'No Comment Available';

    @Input() comment: TodoComment = null;

    constructor() {}

    ngOnInit(): void {}

}
