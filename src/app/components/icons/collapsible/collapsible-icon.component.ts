import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

enum IconState {
    NONE = '',
    COLLAPSED = 'collapsed',
    EXPANDED = 'expanded'
}

@Component({
    selector: 'nssd-collapsible-icon',
    templateUrl: './collapsible-icon.component.html',
    styleUrls: ['./collapsible-icon.component.scss'],
    animations: [
        trigger('rotatedState', [
            state(IconState.EXPANDED, style({ transform: 'rotate(90deg)' })),
            state(IconState.COLLAPSED, style({ transform: 'rotate(0deg)' })),
            transition(`${IconState.COLLAPSED} => ${IconState.EXPANDED}`, animate('250ms ease-out')),
            transition(`${IconState.EXPANDED} => ${IconState.COLLAPSED}`, animate('250ms ease-in'))
        ])
    ]
})
export class CollapsibleIconComponent implements OnChanges, OnInit {

    private readonly collapseText: string = 'Click to Collapse';
    private readonly expandText: string = 'Click to Expand';

    public readonly imageSource: string = 'assets/images/black-expand-triangle.png';

    @Input() isExpanded: boolean = true;
    @Output() clickedIcon: EventEmitter<void> = new EventEmitter<void>();

    public hoverText: string = this.collapseText;
    public iconState: IconState = IconState.EXPANDED

    constructor() {}

    ngOnInit(): void {}

    ngOnChanges(): void {
        this.iconState = (this.isExpanded) ? IconState.EXPANDED : IconState.COLLAPSED;
        this.hoverText = (this.iconState === IconState.EXPANDED) ? this.collapseText : this.expandText;
    }

    public handleClick(): void {
        if (!!this.clickedIcon) {
            this.clickedIcon.emit();
        }
    }
}
