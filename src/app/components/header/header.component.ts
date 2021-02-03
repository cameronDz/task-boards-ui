import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'nssd-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    public readonly title: string = 'Task Boards';
    public readonly subtitle: string = 'Create Task boards with related tasks for; daily activities, projects, and goals.';

    constructor() {}

    ngOnInit(): void {}

}
