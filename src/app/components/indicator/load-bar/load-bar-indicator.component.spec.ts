import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadBarIndicatorComponent } from './load-bar-indicator.component';

xdescribe('LoadBarIndicatorComponent', () => {
    let component: LoadBarIndicatorComponent;
    let fixture: ComponentFixture<LoadBarIndicatorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        declarations: [ LoadBarIndicatorComponent ]
        })
        .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LoadBarIndicatorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
