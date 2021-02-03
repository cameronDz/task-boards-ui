import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { onCompleteCallback, onErrorCallback, onSuccessCallback } from '../models/types';
import { BaseComponent } from '../components/base.component';

import * as _todoClassicListPayload from '../../assets/classicList.json';
import * as _todoSimpleListPayload from '../../assets/simpleList.json';

@Injectable({ providedIn: 'root' })
export class TodoDataService {

    private todoDataBehavioralSubject: BehaviorSubject<any>;
    private todoSimpleListBehavioralSubject: BehaviorSubject<any>;

    constructor() {
        this.loadDate();
    }

    public getTodoClassicList(
            self: BaseComponent,
            successCallback: onSuccessCallback,
            errorCallback: onErrorCallback,
            completedCallback: onCompleteCallback): Subscription {
        return this.getSubscription(this.todoDataBehavioralSubject, self, successCallback, errorCallback, completedCallback);
    }

    public getTodoSimpleList(
            self: BaseComponent,
            successCallback: onSuccessCallback,
            errorCallback: onErrorCallback,
            completedCallback: onCompleteCallback): Subscription {
        return this.getSubscription(this.todoSimpleListBehavioralSubject, self, successCallback, errorCallback, completedCallback);
    }

    private getSubscription(
            behavioralSubject: BehaviorSubject<any>,
            self: BaseComponent,
            successCallback: onSuccessCallback,
            errorCallback: onErrorCallback,
            completedCallback: onCompleteCallback): Subscription {
        return behavioralSubject.asObservable().pipe(
            finalize((): void => completedCallback(self)))
            .subscribe(
                (data: Array<any>): void => successCallback(self, data),
                (error: any): void => errorCallback(self, error),
                (): void => {});
    }

    private loadDate(): void {
        this.todoDataBehavioralSubject = new BehaviorSubject<any>(_todoClassicListPayload.data);
        this.todoSimpleListBehavioralSubject = new BehaviorSubject<any>(_todoSimpleListPayload.data);
    }
}
