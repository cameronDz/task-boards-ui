import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskMoveFormComponent } from './task-move-form.component';

xdescribe('TaskMoveFormComponent', () => {
    let component: TaskMoveFormComponent;
    let fixture: ComponentFixture<TaskMoveFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        declarations: [ TaskMoveFormComponent ]
        })
        .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskMoveFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
