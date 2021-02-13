import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TodoTask } from '../../../models/todo.model';

@Component({
    selector: 'nssd-board-status-column',
    templateUrl: './board-status-column.component.html',
    styleUrls: ['./board-status-column.component.scss']
})
export class BoardStatusColumnComponent implements OnInit {

    public readonly centerIcons: Array<{ isDisabledWhenArchived: boolean, title: string, type: string}> = [
        { isDisabledWhenArchived: true, title: 'Move Task Up', type: 'arrow-up'},
        { isDisabledWhenArchived: false, title: 'View Details', type: 'info-circle'},
        { isDisabledWhenArchived: false, title: 'View Task History', type: 'history'},
        { isDisabledWhenArchived: true, title: 'Move Task to another Board', type: 'arrows'},
        { isDisabledWhenArchived: true, title: 'Delete Task', type: 'trash'},
        { isDisabledWhenArchived: true, title: 'Move Task Down', type: 'arrow-down'}
    ];

    @Input() disabledLoadingMessage: string = 'Disabled';
    @Input() isArchived: boolean = false;
    @Input() isLoading: boolean = false;
    @Input() status: string = '';
    @Input() tasks: Array<TodoTask> = null;

    @Output() clickedBack: EventEmitter<string> = new EventEmitter<string>();
    @Output() clickedDown: EventEmitter<string> = new EventEmitter<string>();
    @Output() clickedForward: EventEmitter<string> = new EventEmitter<string>();
    @Output() clickedHistory: EventEmitter<string> = new EventEmitter<string>();
    @Output() clickedInfo: EventEmitter<string> = new EventEmitter<string>();
    @Output() clickedMove: EventEmitter<string> = new EventEmitter<string>();
    @Output() clickedTrash: EventEmitter<string> = new EventEmitter<string>();
    @Output() clickedUp: EventEmitter<string> = new EventEmitter<string>();

    constructor() {}

    ngOnInit(): void {}

    public handleClickedIcon(type: string, id: string) {
        switch (type) {
            case ('arrows'):
                this.emitEvent(this.clickedMove, id, type);
                break;
            case ('arrow-down'):
                this.emitEvent(this.clickedDown, id, type);
                break;
            case ('arrow-up'):
                this.emitEvent(this.clickedUp, id, type);
                break;
            case ('history'):
                this.emitEvent(this.clickedHistory, id, type);
                break;
            case ('info-circle'):
                this.emitEvent(this.clickedInfo, id, type);
                break;
            case ('trash'):
                this.emitEvent(this.clickedTrash, id, type);
                break;
            default:
                // do nothing
        }
    }

    public handleClickedIconBack(id: string): void {
        this.emitEvent(this.clickedBack, id);
    }

    public handleClickedIconForward(id: string): void {
        this.emitEvent(this.clickedForward, id);
    }

    /**
     * action not emitted when task is archived
     */
    private emitEvent(emitter: EventEmitter<string>, id: string, type: string = null): void {
        const iconIndex: number = this.centerIcons.findIndex((icon: { isDisabledWhenArchived: boolean, title: string, type: string}): boolean => {
            return ((!!icon) && (icon.type === type));
        });
        const isDisabledByArchive: boolean = ((iconIndex > -1) && (!!this.centerIcons[iconIndex])) ? this.centerIcons[iconIndex].isDisabledWhenArchived : true;
        if (((!isDisabledByArchive) || (!this.isArchived)) && (!this.isLoading) && (!!id) && (!!emitter)) {
            emitter.emit(id);
        }
    }
}
