import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCommentDisplayComponent } from './task-comment-display.component';

xdescribe('TaskCommentDisplayComponent', () => {
    let component: TaskCommentDisplayComponent;
    let fixture: ComponentFixture<TaskCommentDisplayComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        declarations: [ TaskCommentDisplayComponent ]
        })
        .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskCommentDisplayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
