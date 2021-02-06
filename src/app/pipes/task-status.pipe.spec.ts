import { TaskStatusPipe } from './task-status.pipe';

describe('TaskStatusPipe', () => {
    it('create an instance', () => {
        const pipe = new TaskStatusPipe();
        expect(pipe).toBeTruthy();
    });
});
