import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'taskStatus' })
export class TaskStatusPipe implements PipeTransform {

    public transform(value: string): string {
        let display: string = '';
        if (value === 'created') {
            display = 'Created';
        } else if (value === 'started') {
            display = 'Started';
        } else if (value === 'reviewing') {
            display = 'Reviewing';
        } else if (value === 'completed') {
            display = 'Completed';
        }
        return display;
    }
}
