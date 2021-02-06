import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TodoChange } from '../../../models/todo.model';

@Component({
    selector: 'nssd-task-history-form',
    templateUrl: './task-history-form.component.html',
    styleUrls: ['./task-history-form.component.scss']
})
export class TaskHistoryFormComponent implements OnInit {

    public readonly noHistoryDisplay: string = 'No Task History to Display.';

    @Input() history: Array<TodoChange> = [];
    @Output() closeClick: EventEmitter<void> = new EventEmitter<void>();

    constructor() {}

    ngOnInit(): void {}

    public handleClickButtonClose(): void {
        this.closeClick.emit();
    }
}
