import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericIconComponent } from './generic-icon.component';

xdescribe('GenericIconComponent', () => {
    let component: GenericIconComponent;
    let fixture: ComponentFixture<GenericIconComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        declarations: [ GenericIconComponent ]
        })
        .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GenericIconComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
