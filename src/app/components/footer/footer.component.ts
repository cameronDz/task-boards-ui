import { Component, OnInit } from '@angular/core';
import { author, version } from '../../../../package.json';

@Component({
    selector: 'nssd-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

    public displayAppName: string = '';
    public displayAuthorName: string = '';
    public displayVersion: string = '';
    public displayYear: string = '';

    constructor() {}

    ngOnInit(): void {
        this.displayAuthorName = !!author ? author.name : '';
        this.displayVersion = 'v' + version;
        this.displayYear = new Date().getFullYear() + '';
    }

}
