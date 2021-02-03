import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { onCompleteCallback, onErrorCallback, onSuccessCallback } from '../models/types';


@Injectable({ providedIn: 'root' })
export class BoardHttpService {

    private readonly placeholder: string = '${endpoint}';
    private readonly ALL_BOARDS_URL: string = 'https://nssd-boards-s3-api.herokuapp.com/json/${endpoint}/allBoards';
    private readonly GET_ENDPOINT: string = 'object';
    private readonly PUT_ENDPOINT: string = 'update';

    constructor(private httpClient: HttpClient) {}

    public getAllBoards(
        self: any,
        successCallback: onSuccessCallback,
        errorCallback: onErrorCallback,
        completedCallback: onCompleteCallback): Subscription {

        return this.httpClient.get(this.ALL_BOARDS_URL.replace(this.placeholder, this.GET_ENDPOINT), {})
            .pipe(finalize((): void => {
                completedCallback(self);
            }))
            .subscribe((data: any): void => {
                successCallback(self, data);
            },
            (error: any): void => {
                errorCallback(self, error);
            });
    }

    public saveAllBoards(
        self: any,
        uploadData: any,
        successCallback: onSuccessCallback,
        errorCallback: onErrorCallback,
        completedCallback: onCompleteCallback): Subscription {
        return this.httpClient.put(this.ALL_BOARDS_URL.replace(this.placeholder, this.PUT_ENDPOINT), uploadData, {})
            .pipe(finalize((): void => {
                completedCallback(self);
            })).subscribe((responseData: any): void => {
                successCallback(self, responseData);
            },
            (error: any): void => {
                errorCallback(self, error);
            });
    }
}
