import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDeleteFormComponent } from './task-delete-form.component';

xdescribe('TaskDeleteFormComponent', () => {
    let component: TaskDeleteFormComponent;
    let fixture: ComponentFixture<TaskDeleteFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        declarations: [ TaskDeleteFormComponent ]
        })
        .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskDeleteFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
