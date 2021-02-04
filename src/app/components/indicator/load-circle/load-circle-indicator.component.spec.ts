import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadCircleIndicatorComponent } from './load-circle-indicator.component';

xdescribe('LoadCircleIndicatorComponent', () => {
    let component: LoadCircleIndicatorComponent;
    let fixture: ComponentFixture<LoadCircleIndicatorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        declarations: [ LoadCircleIndicatorComponent ]
        })
        .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LoadCircleIndicatorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
