import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dateFormatter' })
export class DateFormatterPipe implements PipeTransform {

    public transform(value: Date): unknown {
        return this.isValidDate(value) ? this.convertValidDate(value) : 'N/A';
    }

    private convertValidDate(value: Date): string {
        const yyyyMM: string = value.getFullYear() + '/' + this.getTwoDigitString(value.getMonth() + 1) + '/';
        const ddhh: string =  this.getTwoDigitString(value.getDate()) + ' ' + this.getTwoDigitString(value.getHours()) + ':';
        const mmss: string = this.getTwoDigitString(value.getMinutes()); + ':' + this.getTwoDigitString(value.getSeconds());
        return yyyyMM + ddhh + mmss;
    }

    private getTwoDigitString(value: number): string {
        return ('0' + value).slice(-2);
    }

    private isValidDate(value: Date): boolean {
        return ((!!value) && (typeof value === 'object') && (!this.isNaN(value.getTime())));
    }

    private isNaN(value: any): boolean {
        return ((typeof value === 'number') && (value !== value));
    }
}
