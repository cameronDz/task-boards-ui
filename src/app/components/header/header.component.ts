import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'nssd-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    public readonly title: string = 'Task Boards UI';
    public readonly subtitle: string = 'Tracking for various activities, projects, and goals.';

    constructor() {}

    ngOnInit(): void {}

}
