import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'nssd-task-delete-form',
    templateUrl: './task-delete-form.component.html',
    styleUrls: ['./task-delete-form.component.scss']
})
export class TaskDeleteFormComponent implements OnInit {

    @Input() name: string = '';

    @Output() cancelClick: EventEmitter<void> = new EventEmitter<void>();
    @Output() confirmClick: EventEmitter<void> = new EventEmitter<void>();

    constructor() {}

    ngOnInit(): void {}

    public handleClickButtonCancel(): void {
        this.cancelClick.emit();
    }

    public handleClickButtonConfirm(): void {
        this.confirmClick.emit();
    }
}
