import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardsComponent } from './boards.component';

xdescribe('BoardsComponent', () => {
    let component: BoardsComponent;
    let fixture: ComponentFixture<BoardsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        declarations: [ BoardsComponent ]
        })
        .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BoardsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
