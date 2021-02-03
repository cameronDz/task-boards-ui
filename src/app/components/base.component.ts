import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({ template: `` })
export abstract class BaseComponent implements OnDestroy, OnInit{

    public abstract ngOnInit(): void;

    public abstract ngOnDestroy(): void;

    protected log(message: string = '', obj: any = null): void {
        console.log(message, obj);
    }
}
