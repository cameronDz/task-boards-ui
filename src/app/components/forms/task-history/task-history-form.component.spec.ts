import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskHistoryFormComponent } from './task-history-form.component';

xdescribe('TaskHistoryFormComponent', () => {
    let component: TaskHistoryFormComponent;
    let fixture: ComponentFixture<TaskHistoryFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        declarations: [ TaskHistoryFormComponent ]
        })
        .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskHistoryFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
