import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NameValue } from '../../../models/name-value.model';

@Component({
    selector: 'nssd-task-move-form',
    templateUrl: './task-move-form.component.html',
    styleUrls: ['./task-move-form.component.scss']
})
export class TaskMoveFormComponent implements OnInit {

    @Input() boards: Array<NameValue> = [];

    @Output() closeForm: EventEmitter<void> = new EventEmitter<void>();
    @Output() idSelected: EventEmitter<string> = new EventEmitter<string>();

    constructor() {}

    ngOnInit(): void {}

    public handleBoardClick(boardId: string): void {
        this.idSelected.emit(boardId);
    }

    public handleCloseClick(): void {
        this.closeForm.emit();
    }
}
