import { Component, EventEmitter, Input, OnInit, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TodoTask } from '../../../models/todo.model';

@Component({
    selector: 'nssd-board-status-column',
    templateUrl: './board-status-column.component.html',
    styleUrls: ['./board-status-column.component.scss']
})
export class BoardStatusColumnComponent implements OnChanges, OnInit {

    @Input() isArchived: boolean = false;
    @Input() status: string = '';
    @Input() tasks: Array<TodoTask> = null;

    @Output() backClick: EventEmitter<string> = new EventEmitter<string>();
    @Output() forwardClick: EventEmitter<string> = new EventEmitter<string>();
    @Output() infoClick: EventEmitter<string> = new EventEmitter<string>();
    @Output() moveClick: EventEmitter<string> = new EventEmitter<string>();
    @Output() trashClick: EventEmitter<string> = new EventEmitter<string>();

    public name: string = '';

    constructor() {}

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges): void {
        if (!!changes) {
            if (this.status === 'created') {
                this.name = 'Created';
            } else if (this.status === 'started') {
                this.name = 'Started';
            } else if (this.status === 'reviewing') {
                this.name = 'Reviewing';
            } else if (this.status === 'completed') {
                this.name = 'Completed';
            }
        }
    }

    public handleIconMoveClick(id: string): void {
        this.emitEvent(this.moveClick, id);
    }

    public handleIconDeleteClick(id: string): void {
        this.emitEvent(this.trashClick, id);
    }

    public handleIconDetailsClick(id: string): void {
        this.emitEvent(this.infoClick, id);
    }

    public handleButtonBackClick(id: string): void {
        this.emitEvent(this.backClick, id);
    }

    public handleButtonForwardClick(id: string): void {
        this.emitEvent(this.forwardClick, id);
    }

    /**
     * action not emitted when task is archived
     */
    private emitEvent(emitter: EventEmitter<string>, id: string): void {
        if ((!this.isArchived) && (!!id) && (!!emitter)) {
            emitter.emit(id);
        }
    }
}
