import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TodoTask } from '../../../models/todo.model';

@Component({
    selector: 'nssd-task-edit-form',
    templateUrl: './task-edit-form.component.html',
    styleUrls: ['./task-edit-form.component.scss']
})
export class TaskEditFormComponent implements OnInit {

    @Input() task: TodoTask = null;

    @Output() closeTodoTask: EventEmitter<void> = new EventEmitter<void>();
    @Output() saveTodoTask: EventEmitter<TodoTask> = new EventEmitter<TodoTask>();

    public description: string = '';
    public id: string = '';
    public name: string = '';
    public status: string = '';

    constructor() {}

    ngOnInit(): void {
        this.setTaskValues();
    }

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

    public handleClickButton(buttonName: string): void {
        if (buttonName === 'save') {
            this.emitTodoTask();
            this.emitClose();
        } else if (buttonName === 'close') {
            this.emitClose();
        }
    }

    private setTaskValues(): void {
        if (!!this.task) {
            const { description, id, name, status } = this.task;
            this.description = description;
            this.id = id;
            this.name = name;
            this.status = status;
        } else {
            this.id = 'new-task-' + new Date().getTime();
            this.status = 'created';
        }
    }

    private createTask(): TodoTask {
        const { description, id, name, status } = this;
        return new TodoTask(id, name, description, status);
    }

    private emitClose(): void {
        if (!!this.saveTodoTask) {
            this.closeTodoTask.emit();
        }
    }

    private emitTodoTask(): void {
        if (!!this.saveTodoTask) {
            const newTask: TodoTask = this.createTask();
            this.saveTodoTask.emit(newTask);
        }
    }
}