import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskHistoryChangeDisplayComponent } from './task-history-change-display.component';

xdescribe('TaskHistoryChangeDisplayComponent', () => {
    let component: TaskHistoryChangeDisplayComponent;
    let fixture: ComponentFixture<TaskHistoryChangeDisplayComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        declarations: [ TaskHistoryChangeDisplayComponent ]
        })
        .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskHistoryChangeDisplayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
