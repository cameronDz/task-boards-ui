
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { DialogModule } from '@progress/kendo-angular-dialog';

import { AppComponent } from './app.component';
import { BoardEditFormComponent } from './components/forms/board-edit/board-edit-form.component';
import { BoardsComponent } from './components/board/boards.component';
import { BoardStatusColumnComponent } from './components/board/status-column/board-status-column.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { TaskDeleteFormComponent } from './components/forms/task-delete/task-delete-form.component';
import { TaskEditFormComponent } from './components/forms/task-edit/task-edit-form.component';
import { TaskMoveFormComponent } from './components/forms/task-move/task-move-form.component';

@NgModule({
    bootstrap: [
        AppComponent
    ],
    declarations: [
        AppComponent,
        BoardEditFormComponent,
        BoardsComponent,
        BoardStatusColumnComponent,
        FooterComponent,
        HeaderComponent,
        TaskDeleteFormComponent,
        TaskEditFormComponent,
        TaskMoveFormComponent
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        DialogModule,
        HttpClientModule
    ]
})
export class AppModule {}
