import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TodoChange, TodoChangeName, TodoTask } from '../../../models/todo.model';

@Component({
    selector: 'nssd-task-edit-form',
    templateUrl: './task-edit-form.component.html',
    styleUrls: ['./task-edit-form.component.scss']
})
export class TaskEditFormComponent implements OnInit {

    @Input() isReadOnly: boolean = false;
    @Input() task: TodoTask = null;

    @Output() closeTodoTask: EventEmitter<void> = new EventEmitter<void>();
    @Output() saveTodoTask: EventEmitter<TodoTask> = new EventEmitter<TodoTask>();

    public createdDate: Date = null;
    public modifiedDate: Date = null;
    public description: string = '';
    public history: Array<TodoChange> = [];
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
            const { createdDate, description, history, id, modifiedDate, name, status } = this.task;
            this.createdDate = createdDate;
            this.description = description;
            this.history = history;
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
        const { createdDate, description, history, id, isNewTodo, name, status } = this;
        const modifiedDate: Date = new Date();
        const todoCreatedDate: Date = isNewTodo ? modifiedDate : createdDate;
        const newTask: TodoTask = new TodoTask(id, name, description, status, todoCreatedDate, modifiedDate, history);
        newTask.history = this.setNewTaskHistory(newTask, this.task);
        return newTask;
    }

    private setNewTaskHistory(newTask: TodoTask, origTask: TodoTask): Array<TodoChange> {
        const history: Array<TodoChange> = ((!!newTask) && (Array.isArray(newTask.history))) ? newTask.history : [];
        const change: TodoChange = new TodoChange(TodoChangeName.CREATED, '', new Date());
        if (!!origTask) {
            let description: string = '';
            if (origTask.description !== newTask.description) {
                description = 'Changed description from: "' + origTask.description + '", to: "' + newTask.description + '".';
            }
            if (origTask.name !== newTask.name) {
                if (!!description) {
                    description += ' ';
                }
                description += 'Changed name from: "' + origTask.name + '", to: "' + newTask.name + '".';
            }
            change.description = description;
            change.name = TodoChangeName.MODIFIED_DETAILS;
        }
        history.push(change);
        return history;
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
