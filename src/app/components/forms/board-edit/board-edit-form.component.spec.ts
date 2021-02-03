import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardEditFormComponent } from './board-edit-form.component';

xdescribe('BoardEditFormComponent', () => {
    let component: BoardEditFormComponent;
    let fixture: ComponentFixture<BoardEditFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        declarations: [ BoardEditFormComponent ]
        })
        .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BoardEditFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
