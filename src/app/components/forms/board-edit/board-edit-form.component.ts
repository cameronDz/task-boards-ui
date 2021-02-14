import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TodoBoard } from '../../../models/todo.model';

@Component({
    selector: 'nssd-board-edit-form',
    templateUrl: './board-edit-form.component.html',
    styleUrls: ['./board-edit-form.component.scss']
})
export class BoardEditFormComponent implements OnInit {

    @Input() todoBoard: TodoBoard = null;

    @Output() clickedClose: EventEmitter<void> = new EventEmitter<void>();
    @Output() clickedSave: EventEmitter<TodoBoard> = new EventEmitter<TodoBoard>();

    public createdDate: Date = null;
    public description: string = '';
    public isReadOnly: boolean = false;
    public name: string = '';

    constructor() {}

    ngOnInit(): void {
        if (!!this.todoBoard) {
            const { createdDate, description, isArchived, name } = this.todoBoard;
            this.createdDate = createdDate;
            this.description = description;
            this.isReadOnly = isArchived;
            this.name = name;
        }
    }

    public handleChangedDescription(event: any): void {
        if (!!event && !!event.target) {
            this.description = event.target.value;
        }
    }

    public handleChangedName(event: any): void {
        if (!!event && !!event.target) {
            this.name = event.target.value;
        }
    }

    public handleClickedSave(): void {
        if (!!this.name) {
            const id: string = 'new-board-id-' + new Date().getTime();
            const board: TodoBoard = new TodoBoard(id, this.name, [], this.description, true, false, new Date());
            if (!!this.todoBoard) {
                board.id = this.todoBoard.id;
                board.isArchived = this.todoBoard.isArchived;
                board.isOpen = this.todoBoard.isOpen;
                board.tasks = this.todoBoard.tasks;
            }
            this.clickedSave.emit(board);
            this.clickedClose.emit();
        }
    }

    public handleClickedCancel(): void {
        this.clickedClose.emit();
    }
}
