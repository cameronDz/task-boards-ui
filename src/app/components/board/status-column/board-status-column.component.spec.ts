import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardStatusColumnComponent } from './board-status-column.component';

xdescribe('BoardStatusColumnComponent', () => {
    let component: BoardStatusColumnComponent;
    let fixture: ComponentFixture<BoardStatusColumnComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        declarations: [ BoardStatusColumnComponent ]
        })
        .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BoardStatusColumnComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
