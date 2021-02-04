import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'nssd-load-circle-indicator',
    templateUrl: './load-circle-indicator.component.html',
    styleUrls: ['./load-circle-indicator.component.scss']
})
export class LoadCircleIndicatorComponent implements OnInit {

    @Input() isLoading: boolean = false;
    @Input() size: string = 'large';
    @Input() themeColor: string = 'dark';
    @Input() type: string = 'converging-spinner';

    constructor() {}

    ngOnInit(): void {}

}
