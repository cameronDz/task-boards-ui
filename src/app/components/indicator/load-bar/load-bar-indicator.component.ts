import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'nssd-load-bar-indicator',
    templateUrl: './load-bar-indicator.component.html',
    styleUrls: ['./load-bar-indicator.component.scss']
})
export class LoadBarIndicatorComponent implements OnInit {

    @Input() isLoading: boolean = false;

    constructor() {}

    ngOnInit(): void {}

}
