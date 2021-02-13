export class TodoBoard {

    constructor(
        public id: string = '',
        public name: string = '',
        public tasks: Array<TodoTask> = [],
        public description: string = '',
        public isOpen: boolean = true,
        public isArchived: boolean = false) {}
}

export class TodoTask {

    constructor(
        public id: string = '',
        public name: string = '',
        public description: string = '',
        public status: string = '',
        public createdDate: Date = null,
        public modifiedDate: Date = null,
        public history: Array<TodoChange> = [],
        public comments: Array<TodoComment> = []) {}
}

export class TodoComment {

    constructor(public description: string, public date: Date = null) {}
}

export class TodoChange {

    constructor(
        public name: TodoChangeName = TodoChangeName.NONE,
        public description: string = '',
        public date: Date = null) {}
}

export enum TodoChangeName {
    NONE = '',
    ADD_COMMENT = 'Added Comment',
    CREATED = 'Task Created',
    MODIFIED_DETAILS = 'Task Details Modified',
    MOVE_BOARD = 'Move Task Board',
    MOVE_STATUS = 'Move Task Status',
    MOVE_PRIORITY = 'Move Task Priority'
}

export class TodoOptions {

    constructor(public isHidingBoards: boolean = false) {}
}

export class TodoPayload {

    constructor(public boards: Array<TodoBoard> = [], public options: TodoOptions = null) {}
}
