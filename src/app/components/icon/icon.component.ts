import { Component, EventEmitter, Input, OnInit, OnChanges, Output } from '@angular/core';

@Component({
    selector: 'nssd-icon',
    templateUrl: './icon.component.html',
    styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnChanges, OnInit {

    private readonly defaultCursor: string = 'icon-cursor';
    private readonly defaultIcon: string = 'info';
    private readonly defaultSize: string = 'lg';
    private readonly disabledCursor: string = 'disabled-cursor';
    private readonly supportedIcons: Array<string> = ['archive', 'info'];
    private readonly supportedSizes: Array<string> = ['lg', '2x'];

    @Input() disabledTitle: string = 'Disabled';
    @Input() isDisabled: boolean = false;
    @Input() isShown: boolean = true;
    @Input() size: string = 'lg';
    @Input() title: string = 'Icon';
    @Input() type: string = '';
    @Input() wildCardClasses: string = '';

    @Output() clickedIcon: EventEmitter<void> = new EventEmitter<void>();

    public className: string = '';

    constructor() {}

    ngOnInit(): void {}

    ngOnChanges(): void {
        this.setClassName();
    }

    public handleClickIcon(): void {
        if (!this.isDisabled) {
            this.clickedIcon.emit();
        }
    }

    private setClassName(): void {
        let temp: string = 'fa fas ';
        temp += this.isDisabled ? this.disabledCursor : this.defaultCursor;
        const setType: string = (this.supportedIcons.indexOf(this.type) > -1) ? this.type : this.defaultIcon;
        temp += ' fa-' + setType + ' ';
        const setSize: string = (this.supportedSizes.indexOf(this.size) > -1) ? this.size :this.defaultSize;
        temp += ' fa-' + setSize + ' ';
        temp += !!this.wildCardClasses ? this.wildCardClasses : '';
        this.className = temp;
    }
}
