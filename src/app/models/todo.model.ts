export class TodoBoard {

    constructor(
        public id: string = '',
        public name: string = '',
        public tasks: Array<TodoTask> = [],
        public description: string = '',
        public isArchived: boolean = false)
    {}
}

export class TodoTask {

    constructor(
        public id: string = '',
        public name: string = '',
        public description: string = '',
        public status: string = '',
        public createdDate: Date = new Date(),
        public modifiedDate: Date = new Date())
    {}
}
