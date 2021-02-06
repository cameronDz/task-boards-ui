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

    public createdDate: Date = null;
    public modifiedDate: Date = null;
    public description: string = '';
    public id: string = '';
    public isNewTodo: boolean = false;
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
            const { createdDate, description, id, modifiedDate, name, status } = this.task;
            this.createdDate = createdDate;
            this.description = description;
            this.id = id;
            this.modifiedDate = modifiedDate;
            this.name = name;
            this.status = status;
        } else {
            this.id = 'new-task-' + new Date().getTime();
            this.status = 'created';
            this.isNewTodo = true;
        }
    }

    private createTask(): TodoTask {
        const { createdDate, description, id, isNewTodo, name, status } = this;
        const modifiedDate: Date = new Date();
        const todoCreatedDate: Date = isNewTodo ? modifiedDate : createdDate;
        const newTask: TodoTask = new TodoTask(id, name, description, status, todoCreatedDate, modifiedDate);
        return newTask;
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
