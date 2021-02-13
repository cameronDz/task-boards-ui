import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogRef, DialogService, DialogSettings } from '@progress/kendo-angular-dialog';
import { Subscription } from 'rxjs';

import { BaseComponent } from '../base.component';
import { BoardEditFormComponent } from '../forms/board-edit/board-edit-form.component';
import { BoardHttpService } from '../../services/board-http.service';
import { DownloadUtility } from '../../utilities/download.utility';
import { NameValue } from '../../models/name-value.model';
import { SubscriptionUtility } from '../../utilities/subscription.utility';
import { TaskCommentFormComponent } from '../forms/task-comment/task-comment-form.component';
import { TaskDeleteFormComponent } from '../forms/task-delete/task-delete-form.component';
import { TaskEditFormComponent } from '../forms/task-edit/task-edit-form.component';
import { TaskHistoryFormComponent } from '../forms/task-history/task-history-form.component';
import { TaskMoveFormComponent } from '../forms/task-move/task-move-form.component';
import { TaskStatusPipe } from '../../pipes/task-status.pipe';
import { TodoBoard, TodoChange, TodoChangeName, TodoComment, TodoOptions, TodoPayload, TodoTask } from '../../models/todo.model';

@Component({
    selector: 'nssd-boards',
    templateUrl: './boards.component.html',
    styleUrls: ['./boards.component.scss']
})
export class BoardsComponent extends BaseComponent implements OnDestroy, OnInit {

    public readonly messageDisableTitle: string = 'Disabled';
    public readonly messageHideArchivedBoard: string = 'Hide Archived Boards';
    public readonly messageShowArchivedBoard: string = 'Show Archived Boards';

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

    public handleClickedAddBoard(): void {
        if (!this.isLoading) {
            this.openAddBoardDialog();
        }
    }

    public handleClickedBoardAddTask(boardId: string): void {
        if (!this.isLoading) {
            const boardIdx: number = this.findBoardIndex(boardId);
            this.openAddTaskDialog(boardIdx);
        }
    }

    public handleClickedBoardArchive(boardId: string): void {
        if (!this.isLoading) {
            this.flipArchiveBoardStatus(boardId)
        }
    }

    public handleClickedBoardDown(boardId: string): void {
        if (!this.isLoading) {
            this.moveBoardDown(boardId);
        }
    }

    public handleClickedBoardDownload(boardId: string): void {
        if (!this.isLoading) {
            this.downloadBoardData(boardId);
        }
    }

    public handleClickedBoardHideShow(boardId: string): void {
        if (!this.isLoading) {
            const boardIdx: number = this.findBoardIndex(boardId);
            if (boardIdx >= 0) {
                this.boardsData[boardIdx].isOpen = !this.boardsData[boardIdx].isOpen;
            }
        }
    }

    public handleClickedBoardUp(boardId: string): void {
        if (!this.isLoading) {
            this.moveBoardUp(boardId);
        }
    }

    public handleClickedDownloadAll(): void {
        if (!this.isLoading) {
            this.downloadBoardData();
        }
    }

    public handleClickedHideShowArchivedBoards(): void {
        if (!this.isLoading) {
            this.hideArchivedBoards = !this.hideArchivedBoards;
        }
    }

    public handleClickedUploadAll(): void {
        if ((!this.isLoading) && (!!this.boardsData)) {
            this.saveBoardsToApi();
        }
    }

    public handleClickedTaskComment(taskId: string, boardId: string = ''): void {
        if (!this.isLoading) {
            const boardIdx: number = this.findBoardIndex(boardId);
            const taskIdx: number = this.findTaskIndex(taskId, boardIdx);
            if (taskIdx >= 0) {
                this.openCommentDialog(boardIdx, taskIdx);
            }
        }
    }

    public handleClickedTaskDelete(taskId: string, boardId: string = ''): void {
        if (!this.isLoading) {
            const boardIdx: number = this.findBoardIndex(boardId);
            const taskIdx: number = this.findTaskIndex(taskId, boardIdx);
            if (taskIdx >= 0) {
                this.openDeleteDialog(boardIdx, taskIdx);
            }
        }
    }

    public handleClickedTaskHistory(taskId: string, boardId: string): void {
        const boardIdx: number = this.findBoardIndex(boardId);
        const taskIdx: number = this.findTaskIndex(taskId, boardIdx);
        this.openHistoryDialog(boardIdx, taskIdx);
    }

    public handleClickedTaskInfo(taskId: string, boardId: string): void {
        if (!this.isLoading) {
            const boardIdx: number = this.findBoardIndex(boardId);
            const taskIdx: number = this.findTaskIndex(taskId, boardIdx);
            this.openUpdateTaskDialog(boardIdx, taskIdx);
        }
    }

    public handleClickedTaskMoveBoard(taskId: string, boardId: string): void {
        if (!this.isLoading) {
            const boardIdx: number = this.findBoardIndex(boardId);
            const taskIdx: number = this.findTaskIndex(taskId, boardIdx);
            this.openMoveTaskDialog(boardIdx, taskIdx);
        }
    }

    public handleClickedTaskMovePrioritze(taskId: string, direction: string, boardId: string = ''): void {
        if (!this.isLoading) {
            this.moveTaskPriority(taskId, direction, boardId);
        }
    }

    public handleClickedTaskMoveStatus(taskId: string, direction: string, boardId: string = ''): void {
        if (!this.isLoading) {
            this.moveTaskStatus(taskId, direction, boardId);
        }
    }

    private moveTaskPriority(taskId: string, direction: string, boardId: string = ''): void {
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

    private downloadBoardData(boardId: string = ''): void {
        if (!!this.boardsData) {
            let filename: string = 'all-board-date';
            let data: any = this.boardsData;
            if (!!boardId) {
                const idx: number = this.findBoardIndex(boardId);
                if ((idx >= 0) && (!!this.boardsData[idx])) {
                    data = this.boardsData[idx];
                    filename = DownloadUtility.filenameSafeString(this.boardsData[idx].name);
                } else {
                    filename = '';
                }
            }
            if (!!filename) {
                DownloadUtility.downloadJsonData(filename, data);
            }
        }
    }

    private flipArchiveBoardStatus(boardId: string): void {
        const boardIdx: number = this.findBoardIndex(boardId);
        if (boardIdx >= 0) {
            this.boardsData[boardIdx].isArchived = !this.boardsData[boardIdx].isArchived;
            if (this.boardsData[boardIdx].isArchived) {
                this.boardsData[boardIdx].isOpen = false;
            }
        }
    }

    private moveBoardDown(boardId: string): void {
        const length: number = Array.isArray(this.boardsData) ? this.boardsData.length : 0;
        const boardIdx: number = this.findBoardIndex(boardId);
        if ((length > 1) && (boardIdx < length - 1)) {
            for (let idx: number = boardIdx + 1; idx < length; idx++) {
                if ((!!this.boardsData[idx]) && ((!this.hideArchivedBoards) || (!this.boardsData[idx].isArchived))) {
                    const temp: TodoBoard = this.boardsData[idx];
                    this.boardsData[idx] = this.boardsData[boardIdx];
                    this.boardsData[boardIdx] = temp;
                    break;
                }
            }
        }
    }

    private moveBoardUp(boardId: string): void {
        const length: number = Array.isArray(this.boardsData) ? this.boardsData.length : 0;
        const boardIdx: number = this.findBoardIndex(boardId);
        if ((length > 1) && (boardIdx !== 0)) {
            for (let idx: number = boardIdx - 1; idx >= 0; idx--) {
                if ((!!this.boardsData[idx]) && ((!this.hideArchivedBoards) || (!this.boardsData[idx].isArchived))) {
                    const temp: TodoBoard = this.boardsData[idx];
                    this.boardsData[idx] = this.boardsData[boardIdx];
                    this.boardsData[boardIdx] = temp;
                    break;
                }
            }
        }
    }

    private swapTasks(boardIdx: number, taskIdxOne: number, taskIdxTwo): void {
        const temp: TodoTask = this.boardsData[boardIdx].tasks[taskIdxOne];
        this.boardsData[boardIdx].tasks[taskIdxOne] = this.boardsData[boardIdx].tasks[taskIdxTwo];
        this.boardsData[boardIdx].tasks[taskIdxTwo] = temp;
    }

    private moveTaskStatus(taskId: string, direction: string, boardId: string = ''): void {
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

    private openCommentDialog(boardIdx: number = -1, taskIdx: number = -1): void {
        if (taskIdx >= 0) {
            const dialogOptions: DialogSettings = {
                content: TaskCommentFormComponent,
                height: 320,
                maxWidth: '100%',
                title: 'Task Comments',
                width: 560
            };
            const dialogRef: DialogRef = this.dialogService.open(dialogOptions);
            dialogRef.content.instance.comments = this.boardsData[boardIdx].tasks[taskIdx].comments;
            dialogRef.content.instance.isReadOnly = this.boardsData[boardIdx].isArchived;
            const saveSubscription: Subscription = dialogRef.content.instance.clickedSavedComment.subscribe((comment: TodoComment): void => {
                if (!Array.isArray(this.boardsData[boardIdx].tasks[taskIdx].comments)) {
                    this.boardsData[boardIdx].tasks[taskIdx].comments = [];
                }
                this.boardsData[boardIdx].tasks[taskIdx].comments.push(comment);
                if (!Array.isArray(this.boardsData[boardIdx].tasks[taskIdx].history)) {
                    this.boardsData[boardIdx].tasks[taskIdx].history = [];
                }
                this.boardsData[boardIdx].tasks[taskIdx].history.push(new TodoChange(TodoChangeName.ADD_COMMENT, '', new Date()));
                dialogRef.content.instance.comments = this.boardsData[boardIdx].tasks[taskIdx].comments;
            });
            const closeSubscription: Subscription = dialogRef.content.instance.clickedClose.subscribe((): void => {
                dialogRef.close();
            });
            const resultSubscription: Subscription = dialogRef.result.subscribe((): void => {
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
            dialogRef.content.instance.isReadOnly = this.boardsData[boardIdx].isArchived;
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

    private getBoardNameValuePairs(excludedIdxs: Array<number> = []): Array<NameValue> {
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

    private setIsLoading(): void {
        this.isLoading = ((this.isProcessingBoardSave) || (this.isLoadingAllBoards));
    }
}
