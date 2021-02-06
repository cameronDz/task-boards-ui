import { Component, Input, OnInit } from '@angular/core';
import { TodoChange } from '../../../../models/todo.model';

@Component({
  selector: 'nssd-task-history-change-display',
  templateUrl: './task-history-change-display.component.html',
  styleUrls: ['./task-history-change-display.component.scss']
})
export class TaskHistoryChangeDisplayComponent implements OnInit {

    public readonly noChangeToDisplay: string = 'No change data to display.';

    @Input() change: TodoChange = null;

    constructor() {}

    ngOnInit(): void {}

}
