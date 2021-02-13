import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCommentFormComponent } from './task-comment-form.component';

xdescribe('TaskCommentFormComponent', () => {
    let component: TaskCommentFormComponent;
    let fixture: ComponentFixture<TaskCommentFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        declarations: [ TaskCommentFormComponent ]
        })
        .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskCommentFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
