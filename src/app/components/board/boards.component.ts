import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogRef, DialogService, DialogSettings } from '@progress/kendo-angular-dialog';
import { Subscription } from 'rxjs';

import { BaseComponent } from '../base.component';
import { BoardEditFormComponent } from '../forms/board-edit/board-edit-form.component';
import { BoardHttpService } from '../../services/board-http.service';
import { DownloadUtility } from '../../utilities/download.utility';
import { NameValue } from '../../models/name-value.model';
import { SubscriptionUtility } from '../../utilities/subscription.utility';
import { TaskDeleteFormComponent } from '../forms/task-delete/task-delete-form.component';
import { TaskEditFormComponent } from '../forms/task-edit/task-edit-form.component';
import { TaskHistoryFormComponent } from '../forms/task-history/task-history-form.component';
import { TaskMoveFormComponent } from '../forms/task-move/task-move-form.component';
import { TaskStatusPipe } from '../../pipes/task-status.pipe';
import { TodoBoard, TodoChange, TodoChangeName, TodoOptions, TodoPayload, TodoTask } from '../../models/todo.model';

@Component({
    selector: 'nssd-boards',
    templateUrl: './boards.component.html',
    styleUrls: ['./boards.component.scss']
})
export class BoardsComponent extends BaseComponent implements OnDestroy, OnInit {

    public readonly statuses: Array<string> = ['created', 'started', 'reviewing', 'completed'];
    private readonly errorMessage: string = 'Error occured:';

    public boardsData: Array<TodoBoard> = null;
    public hideArchivedBoards: boolean = false;
    public isLoading: boolean = false;

    private isLoadingAllBoards: boolean = false;
    private isProcessingBoardSave: boolean = false;

    private boardSubscription: Subscription = null;
    private saveSubscription: Subscription = null;

    constructor(
            private boardHttpService: BoardHttpService,
            private dialogService: DialogService,
            private taskStatusPipe: TaskStatusPipe) {
        super();
    }

    ngOnInit(): void {
        this.fetchBoardData();
    }

    ngOnDestroy(): void {
        SubscriptionUtility.unsubscribe(this.boardSubscription);
        SubscriptionUtility.unsubscribe(this.saveSubscription);
    }

    public handleClickIconAdd(boardId: string): void {
        if (!this.isLoading) {
            const boardIdx: number = this.findBoardIndex(boardId);
            this.openAddTaskDialog(boardIdx);
        }
    }

    public handleClickIconArchive(boardId: string): void {
        if (!this.isLoading) {
            const boardIdx: number = this.findBoardIndex(boardId);
            if (boardIdx >= 0) {
                this.boardsData[boardIdx].isArchived = !this.boardsData[boardIdx].isArchived;
                if (this.boardsData[boardIdx].isArchived) {
                    this.boardsData[boardIdx].isOpen = false;
                }
                this.moveArchivedBoards();
            }
        }
    }

    public handleIconHideClick(): void {
        if (!this.isLoading) {
            this.hideArchivedBoards = !this.hideArchivedBoards;
        }
    }

    public handleIconClipboardClick(): void {
        if (!this.isLoading) {
            this.openAddBoardDialog();
        }
    }

    public handleClickIconMinus(boardId: string): void {
        if (!this.isLoading) {
            const boardIdx: number = this.findBoardIndex(boardId);
            if (boardIdx >= 0) {
                this.boardsData[boardIdx].isOpen = !this.boardsData[boardIdx].isOpen;
            }
        }
    }

    public handleClickIconSave(boardId: string): void {
        if (!this.isLoading) {
            const idx: number = this.findBoardIndex(boardId);
            if ((idx >= 0) && (this.boardsData[idx])) {
                const { name } = this.boardsData[idx];
                const filename = DownloadUtility.filenameSafeString(name);
                DownloadUtility.downloadJsonData(filename, this.boardsData[idx]);
            }
        }
    }

    public handleIconDownloadAllClick(): void {
        if ((!this.isLoading) && (!!this.boardsData)) {
            const filename = 'all-board-data';
            DownloadUtility.downloadJsonData(filename, this.boardsData);
        }
    }
    public handleIconSaveAllClick(): void {
        if ((!this.isLoading) && (!!this.boardsData)) {
            this.saveBoardsToApi();
        }
    }

    public handeIconClickHistory(taskId: string, boardId: string): void {
        const boardIdx: number = this.findBoardIndex(boardId);
        const taskIdx: number = this.findTaskIndex(taskId, boardIdx);
        this.openHistoryDialog(boardIdx, taskIdx);
    }

    public handleIconClickInfo(taskId: string, boardId: string): void {
        if (!this.isLoading) {
            const boardIdx: number = this.findBoardIndex(boardId);
            const taskIdx: number = this.findTaskIndex(taskId, boardIdx);
            this.openUpdateTaskDialog(boardIdx, taskIdx);
        }
    }

    public handleIconClickMove(taskId: string, boardId: string): void {
        if (!this.isLoading) {
            const boardIdx: number = this.findBoardIndex(boardId);
            const taskIdx: number = this.findTaskIndex(taskId, boardIdx);
            this.openMoveTaskDialog(boardIdx, taskIdx);
        }
    }

    public getBoardNameValuePairs(excludedIdxs: Array<number> = []): Array<NameValue> {
        const boards: Array<NameValue> = [];
        const length: number = Array.isArray(this.boardsData) ? this.boardsData.length : 0;
        for (let idx: number = 0; idx < length; idx++) {
            if (!!this.boardsData[idx]) {
                const { id, isArchived, name } = this.boardsData[idx];
                if ((!isArchived) && (!!id) && (!!name) && ((!Array.isArray(excludedIdxs)) || (excludedIdxs.indexOf(idx) === -1))) {
                    boards.push(new NameValue(name, id));
                }
            }
        }
        return boards;
    }

    public handleIconClickTrash(taskId: string, boardId: string = ''): void {
        if (!this.isLoading) {
            const boardIdx: number = this.findBoardIndex(boardId);
            const taskIdx: number = this.findTaskIndex(taskId, boardIdx);
            if (taskIdx >= 0) {
                this.openDeleteDialog(boardIdx, taskIdx);
            }
        }
    }

    public handleIconMoveTaskPriority(taskId: string, direction: string, boardId: string = ''): void {
        if (!this.isLoading) {
            const boardIdx: number = this.findBoardIndex(boardId);
            const taskIdx: number = this.findTaskIndex(taskId, boardIdx);
            const task: TodoTask = ((boardIdx >= 0) && (taskIdx >= 0)) ? this.boardsData[boardIdx].tasks[taskIdx] : null;
            const { length } = this.boardsData[boardIdx].tasks;
            if ((length > 1) && (taskIdx >= 0) && (!!task)) {
                let change: TodoChange = null;
                const { status } = this.boardsData[boardIdx].tasks[taskIdx];
                if ((direction === 'up') && (taskIdx !== 0)) {
                    for (let idx: number = taskIdx - 1; idx >= 0; idx--) {
                        if ((!!this.boardsData[boardIdx].tasks[idx]) && (status === this.boardsData[boardIdx].tasks[idx].status)) {
                            this.swapTasks(boardIdx, taskIdx, idx);
                            change = new TodoChange(TodoChangeName.MOVE_PRIORITY, 'Move Task Priority Up', new Date());
                            break;
                        }
                    }
                } else if ((direction === 'down') && (taskIdx !== length - 1)) {
                    for (let idx: number = taskIdx + 1; idx < length; idx++) {
                        if ((!!this.boardsData[boardIdx].tasks[idx]) && (status === this.boardsData[boardIdx].tasks[idx].status)) {
                            this.swapTasks(boardIdx, taskIdx, idx);
                            change = new TodoChange(TodoChangeName.MOVE_PRIORITY, 'Move Task Priority Down', new Date());
                            break;
                        }
                    }
                }

                if (!!change) {
                    if (!Array.isArray(task.history)) {
                        task.history = [];
                    }
                    task.history.push(change);
                }
            }
        }
    }

    private swapTasks(boardIdx: number, taskIdxOne: number, taskIdxTwo): void {
        const temp: TodoTask = this.boardsData[boardIdx].tasks[taskIdxOne];
        this.boardsData[boardIdx].tasks[taskIdxOne] = this.boardsData[boardIdx].tasks[taskIdxTwo];
        this.boardsData[boardIdx].tasks[taskIdxTwo] = temp;
    }

    public handleButtonClickMoveTask(taskId: string, direction: string, boardId: string = ''): void {
        if (!this.isLoading) {
            const boardIdx: number = this.findBoardIndex(boardId);
            const taskIdx: number = this.findTaskIndex(taskId, boardIdx);
            const task: TodoTask = ((boardIdx >= 0) && (taskIdx >= 0)) ? this.boardsData[boardIdx].tasks[taskIdx] : null;
            if ((taskIdx >= 0) && (!!task)) {
                let newStatus: string = '';
                if ((task.status === 'created') && (direction === 'forward')) {
                    newStatus = 'started';
                } else if (task.status === 'reviewing') {
                    if (direction === 'forward') {
                        newStatus = 'completed';
                    } else if (direction === 'back') {
                        newStatus = 'started';
                    }
                } else if (task.status === 'started') {
                    if (direction === 'forward') {
                        newStatus = 'reviewing';
                    } else if (direction === 'back') {
                        newStatus = 'created';
                    }
                } else if ((task.status === 'completed') && (direction === 'back')) {
                    newStatus = 'reviewing';
                }

                if (!!newStatus) {
                    const change: TodoChange = this.getTaskMoveChange(task.status, newStatus);
                    if (!Array.isArray(task.history)) {
                        task.history = [];
                    }
                    task.history.push(change);
                    task.status = newStatus;
                    task.modifiedDate = new Date();
                    this.boardsData[boardIdx].tasks.splice(taskIdx, 1);
                    this.boardsData[boardIdx].tasks.unshift(task);
                }
            }
        }
    }

    private getTaskMoveChange(originalStatus: string, newStatus: string): TodoChange {
        const orgValue: string = this.taskStatusPipe.transform(originalStatus);
        const newValue: string = this.taskStatusPipe.transform(newStatus);
        const description: string = 'Move status from ' + orgValue + ' to ' + newValue + '.';
        return new TodoChange(TodoChangeName.MOVE_STATUS, description, new Date());
    }

    private findBoardIndex(boardId: string): number {
        return this.boardsData.findIndex((board: TodoBoard): boolean => {
            return ((!!boardId) && (!!board) && (board.id === boardId));
        });
    }

    private findTaskIndex(taskId: string, boardIdx: number): number {
        return (!this.boardsData[boardIdx]) ? -1 : this.boardsData[boardIdx].tasks.findIndex((task: TodoTask): boolean => {
            return ((!!taskId) && (!!task) && (task.id === taskId));
        });
    }

    private addTask(task: TodoTask, boardIdx: number = 0): void {
        this.boardsData[boardIdx].tasks.unshift(task);
    }

    private updateTask(task: TodoTask, taskIdx: number = 0, boardIdx: number = 0): void {
        this.boardsData[boardIdx].tasks[taskIdx] = task;
    }

    private moveArchivedBoards(): void {
        const archviedIndexes: Array<number> = [];
        const totalLength: number = !this.boardsData ? -1 : this.boardsData.length;
        for (let idx: number = 0; idx < totalLength; idx++) {
            if ((!!this.boardsData[idx]) && (this.boardsData[idx].isArchived)) {
                archviedIndexes.push(idx);
            }
        }
        const archivedLength: number = archviedIndexes.length;
        for (let idx: number = 0; idx < archivedLength; idx++) {
            const splicedIdx: number = archviedIndexes.pop();
            const splicedBoard: TodoBoard = this.boardsData.splice(splicedIdx, 1)[0];
            this.boardsData.push(splicedBoard);
        }
    }

    private saveBoardsToApi(): void {
        this.isProcessingBoardSave = true;
        this.setIsLoading();
        this.saveSubscription = this.boardHttpService.saveAllBoards(
            this,
            new TodoPayload(this.boardsData, new TodoOptions(this.hideArchivedBoards)),
            this.saveBoardsSuccessCallback,
            this.saveBoardsErrorCallback,
            this.saveBoardsCompletedCallback);
    }

    private saveBoardsSuccessCallback(self: BoardsComponent, data: any): void {
        self.fetchBoardData();
    }

    private saveBoardsErrorCallback(self: BoardsComponent, error: any): void {
        self.log(this.errorMessage, error);
    }

    private saveBoardsCompletedCallback(self: BoardsComponent): void {
        self.isProcessingBoardSave = false;
        self.setIsLoading();
    }

    private fetchBoardData(): void {
        this.isLoadingAllBoards = true;
        this.setIsLoading();
        this.boardSubscription = this.boardHttpService.getAllBoards(
            this,
            this.allBoardsSuccessCallback,
            this.allBoardsErrorCallback,
            this.allBoardsCompletedCallback);
    }

    private allBoardsSuccessCallback(self: BoardsComponent, data: { payload: TodoPayload }): void {
        if (!!data && !!data.payload) {
            self.boardsData = data.payload.boards;
            self.hideArchivedBoards = ((!!data.payload.options) && (data.payload.options.isHidingBoards));
            self.moveArchivedBoards();
        }
    }

    private allBoardsErrorCallback(self: BoardsComponent, error: any): void {
        self.log(self.errorMessage, error);
    }

    private allBoardsCompletedCallback(self: BoardsComponent): void {
        self.isLoadingAllBoards = false;
        self.setIsLoading();
    }

    private openAddBoardDialog(): void {
        const dialogOptions: DialogSettings = {
            content: BoardEditFormComponent,
            height: 300,
            maxWidth: '100%',
            title: 'Add Board',
            width: 460,
        };
        const dialogRef: DialogRef = this.dialogService.open(dialogOptions);
        const saveSubscription: Subscription = dialogRef.content.instance.saveClick.subscribe((board: TodoBoard): void => {
            if (!!board) {
                if (!Array.isArray(this.boardsData)) {
                    this.boardsData = [];
                }
                this.boardsData.unshift(board);
            }
            dialogRef.close();
        });
        const closeSubscription: Subscription = dialogRef.content.instance.closeForm.subscribe((): void => {
            dialogRef.close();
        });
        const resultSubscription: Subscription = dialogRef.result.subscribe((): void => {
            SubscriptionUtility.unsubscribe(saveSubscription);
            SubscriptionUtility.unsubscribe(closeSubscription);
            SubscriptionUtility.unsubscribe(resultSubscription);
        });
    }

    private openAddTaskDialog(boardIdx: number = -1): void {
        if (boardIdx > -1) {
            const dialogOptions: DialogSettings = {
                content: TaskEditFormComponent,
                height: 324,
                maxWidth: '100%',
                title: 'Add Task to Board',
                width: 460
            };
            const dialogRef: DialogRef = this.dialogService.open(dialogOptions);
            dialogRef.content.instance.task = null;
            const saveSubscription: Subscription = dialogRef.content.instance.saveTodoTask.subscribe((newTask: TodoTask): void => {
                this.addTask(newTask, boardIdx);
                dialogRef.close();
            });
            const closeSubscription: Subscription = dialogRef.content.instance.closeTodoTask.subscribe((): void => {
                dialogRef.close();
            });
            const resultSubscription: Subscription = dialogRef.result.subscribe((): void => {
                SubscriptionUtility.unsubscribe(saveSubscription);
                SubscriptionUtility.unsubscribe(closeSubscription);
                SubscriptionUtility.unsubscribe(resultSubscription);
            });
        }
    }

    private openHistoryDialog(boardIdx: number = -1, taskIdx: number = -1): void {
        if (taskIdx >= 0) {
            const dialogOptions: DialogSettings = {
                content: TaskHistoryFormComponent,
                height: 320,
                maxWidth: '100%',
                title: 'Task History',
                width: 560
            };
            const dialogRef: DialogRef = this.dialogService.open(dialogOptions);
            dialogRef.content.instance.history = this.boardsData[boardIdx].tasks[taskIdx].history;
            const closeSubscription: Subscription = dialogRef.content.instance.closeClick.subscribe((): void => {
                dialogRef.close();
            });
            const resultSubscription: Subscription = dialogRef.result.subscribe((): void => {
                SubscriptionUtility.unsubscribe(closeSubscription);
                SubscriptionUtility.unsubscribe(resultSubscription);
            });
        }
    }

    private openMoveTaskDialog(boardIdx: number = -1, taskIdx: number = -1): void {
        if (taskIdx >= 0) {
            const dialogOptions: DialogSettings = {
                content: TaskMoveFormComponent,
                height: 300,
                maxWidth: '100%',
                title: 'Move Task to Different Board',
                width: 460
            };
            const dialogRef: DialogRef = this.dialogService.open(dialogOptions);
            dialogRef.content.instance.boards = this.getBoardNameValuePairs([boardIdx]);
            const selectedSubscription: Subscription = dialogRef.content.instance.idSelected.subscribe((newId: string): void => {
                const newBoardIdx: number = this.findBoardIndex(newId);
                if (newBoardIdx > -1) {
                    const todo: TodoTask = this.boardsData[boardIdx].tasks.splice(taskIdx, 1)[0];
                    todo.modifiedDate = new Date();
                    todo.history = this.addMoveTaskBoardHistory(todo, this.boardsData[boardIdx].name, this.boardsData[newBoardIdx].name);
                    this.boardsData[newBoardIdx].tasks.push(todo);
                }
                dialogRef.close();
            });
            const closeSubscription: Subscription = dialogRef.content.instance.closeForm.subscribe((): void => {
                dialogRef.close();
            });
            const resultSubscription: Subscription = dialogRef.result.subscribe((): void => {
                SubscriptionUtility.unsubscribe(selectedSubscription);
                SubscriptionUtility.unsubscribe(closeSubscription);
                SubscriptionUtility.unsubscribe(resultSubscription);
            });
        }
    }

    private addMoveTaskBoardHistory(task: TodoTask, origBoard: string, newBoard: string): Array<TodoChange> {
        const history: Array<TodoChange> = ((!!task) && (Array.isArray(task.history))) ? task.history : [];
        const description: string = 'Moved Task from Board: ' + origBoard + ', to: ' + newBoard + '.';
        const change: TodoChange = new TodoChange(TodoChangeName.MOVE_BOARD, description, task.modifiedDate);
        history.push(change);
        return history;
    }

    private openUpdateTaskDialog(boardIdx: number = -1, taskIdx: number = -1): void {
        if (taskIdx >= 0) {
            const dialogOptions: DialogSettings = {
                content: TaskEditFormComponent,
                height: 324,
                maxWidth: '100%',
                title: 'Update Task',
                width: 460
            };
            const dialogRef: DialogRef = this.dialogService.open(dialogOptions);
            dialogRef.content.instance.task = this.boardsData[boardIdx].tasks[taskIdx];
            const saveSubscription: Subscription = dialogRef.content.instance.saveTodoTask.subscribe((updatedTask: TodoTask): void => {
                this.updateTask(updatedTask, taskIdx, boardIdx);
                dialogRef.close();
            });
            const closeSubscription: Subscription = dialogRef.content.instance.closeTodoTask.subscribe((): void => {
                dialogRef.close();
            });
            const resultSubscription: Subscription = dialogRef.result.subscribe((): void => {
                SubscriptionUtility.unsubscribe(saveSubscription);
                SubscriptionUtility.unsubscribe(closeSubscription);
                SubscriptionUtility.unsubscribe(resultSubscription);
            });
        }
    }

    private openDeleteDialog(boardIdx: number = -1, taskIdx: number = -1): void {
        if (taskIdx >= 0) {
            const dialogOptions: DialogSettings = {
                content: TaskDeleteFormComponent,
                height: 240,
                maxWidth: '100%',
                title: 'Confirm Task Delete',
                width: 460
            };
            const dialogRef: DialogRef = this.dialogService.open(dialogOptions);
            const cancelSubscription: Subscription = dialogRef.content.instance.cancelClick.subscribe((): void => {
                dialogRef.close();
            });
            const confirmSubscription: Subscription = dialogRef.content.instance.confirmClick.subscribe((): void => {
                this.boardsData[boardIdx].tasks.splice(taskIdx, 1);
                dialogRef.close();
            });
            const resultSubscription: Subscription = dialogRef.result.subscribe((): void => {
                SubscriptionUtility.unsubscribe(cancelSubscription);
                SubscriptionUtility.unsubscribe(confirmSubscription);
                SubscriptionUtility.unsubscribe(resultSubscription);
            });
        }
    }

    private setIsLoading(): void {
        this.isLoading = ((this.isProcessingBoardSave) || (this.isLoadingAllBoards));
    }
}
