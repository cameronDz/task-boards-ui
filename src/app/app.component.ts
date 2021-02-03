import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseComponent } from './components/base.component';

@Component({
    selector: 'nssd-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent implements OnDestroy, OnInit {

    constructor() {
        super();
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {}

}
