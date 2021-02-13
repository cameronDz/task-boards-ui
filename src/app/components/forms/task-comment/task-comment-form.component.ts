import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TodoComment } from '../../../models/todo.model';

@Component({
    selector: 'nssd-task-comment-form',
    templateUrl: './task-comment-form.component.html',
    styleUrls: ['./task-comment-form.component.scss']
})
export class TaskCommentFormComponent implements OnInit {

    public readonly noCommentsToDisplay: string = 'No Comments to display.';

    @Input() comments: Array<TodoComment> = [];
    @Input() isReadOnly: boolean = false;

    @Output() clickedClose: EventEmitter<void> = new EventEmitter<void>();
    @Output() clickedSavedComment: EventEmitter<TodoComment> = new EventEmitter<TodoComment>();

    public description: string = '';
    public isAddMode: boolean = false;

    constructor() {}

    ngOnInit(): void {}

    public handleChangedDescription(event: any): void {
        if (!!event && !!event.target) {
            this.description = event.target.value;
        }
    }

    public handleClickedAdd(): void {
        if (!this.isReadOnly) {
            this.isAddMode = true;
        }
    }

    public handleClickedCancel(): void {
        this.isAddMode = false;
    }

    public handleClickedClose(): void {
        this.emitClickedClosed();
    }

    public handleClickedSave(): void {
        if (!!this.description) {
            this.emitClickedSavedComment(new TodoComment(this.description, new Date()));
            this.description = '';
            this.isAddMode = false;
        }
    }

    private emitClickedSavedComment(comment: TodoComment): void {
        if ((!!this.clickedSavedComment) && (!!comment)) {
            this.clickedSavedComment.emit(comment);
        }
    }

    private emitClickedClosed(): void {
        if (!!this.clickedClose) {
            this.clickedClose.emit();
        }
    }
}
