import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TodoBoard } from '../../../models/todo.model';

@Component({
    selector: 'nssd-board-edit-form',
    templateUrl: './board-edit-form.component.html',
    styleUrls: ['./board-edit-form.component.scss']
})
export class BoardEditFormComponent implements OnInit {

    @Output() closeForm: EventEmitter<void> = new EventEmitter<void>();
    @Output() saveClick: EventEmitter<TodoBoard> = new EventEmitter<TodoBoard>();

    public description: string = '';
    public name: string = '';

    constructor() {}

    ngOnInit(): void {}

    public handleChangeDescription(event: any): void {
        if (!!event && !!event.target) {
            this.description = event.target.value;
        }
    }

    public handleChangeName(event: any): void {
        if (!!event && !!event.target) {
            this.name = event.target.value;
        }
    }

    public handleClickButtonSave(): void {
        if (!!this.name) {
            const id: string = 'new-board-id-' + new Date().getTime();
            this.saveClick.emit(new TodoBoard(id, this.name, [], this.description));
            this.closeForm.emit();
        }
    }

    public handleClickButtonCancel(): void {
        this.closeForm.emit();
    }
}
