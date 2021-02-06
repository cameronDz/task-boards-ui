
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { ProgressBarModule } from '@progress/kendo-angular-progressbar';

import { AppComponent } from './app.component';
import { BoardEditFormComponent } from './components/forms/board-edit/board-edit-form.component';
import { BoardsComponent } from './components/board/boards.component';
import { BoardStatusColumnComponent } from './components/board/status-column/board-status-column.component';
import { DateFormatterPipe } from './pipes/date-formatter.pipe';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LoadBarIndicatorComponent } from './components/indicator/load-bar/load-bar-indicator.component';
import { LoadCircleIndicatorComponent } from './components/indicator/load-circle/load-circle-indicator.component';
import { TaskDeleteFormComponent } from './components/forms/task-delete/task-delete-form.component';
import { TaskEditFormComponent } from './components/forms/task-edit/task-edit-form.component';
import { TaskMoveFormComponent } from './components/forms/task-move/task-move-form.component';
import { TaskStatusPipe } from './pipes/task-status.pipe';

@NgModule({
    bootstrap: [
        AppComponent
    ],
    declarations: [
        AppComponent,
        BoardEditFormComponent,
        BoardsComponent,
        BoardStatusColumnComponent,
        DateFormatterPipe,
        FooterComponent,
        HeaderComponent,
        LoadBarIndicatorComponent,
        LoadCircleIndicatorComponent,
        TaskDeleteFormComponent,
        TaskEditFormComponent,
        TaskMoveFormComponent,
        TaskStatusPipe
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        DialogModule,
        HttpClientModule,
        LoaderModule,
        ProgressBarModule
    ],
    providers: [
        TaskStatusPipe
    ]
})
export class AppModule {}
