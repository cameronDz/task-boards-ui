import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

const COLLAPSED: string = 'collapsed';
const EXPANDED: string = 'expanded';

@Component({
    selector: 'nssd-collapsible-icon',
    templateUrl: './collapsible-icon.component.html',
    styleUrls: ['./collapsible-icon.component.scss'],
    animations: [
        trigger('rotatedState', [
            state(EXPANDED, style({ transform: 'rotate(90deg)' })),
            state(COLLAPSED, style({ transform: 'rotate(0deg)' })),
            transition(`${COLLAPSED} => ${EXPANDED}`, animate('250ms ease-out')),
            transition(`${EXPANDED} => ${COLLAPSED}`, animate('250ms ease-in'))
        ])
    ]
})
export class CollapsibleIconComponent implements OnInit {

    private readonly collapseText: string = 'Click to Collapse';
    private readonly expandText: string = 'Click to Expand';

    public readonly imageSource: string = 'assets/images/black-expand-triangle.png';

    @Output() clickedIcon: EventEmitter<void> = new EventEmitter<void>();

    public hoverText: string = this.collapseText;
    public textState: string = EXPANDED;

    constructor() {}

    ngOnInit(): void {}

    public handleClick(): void {
        this.textState = (this.textState === EXPANDED) ? COLLAPSED : EXPANDED;
        this.hoverText = (this.textState === EXPANDED) ? this.collapseText : this.expandText;
        if (!!this.clickedIcon) {
            this.clickedIcon.emit();
        }
    }
}
