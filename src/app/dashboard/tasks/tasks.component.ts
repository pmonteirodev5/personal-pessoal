import {Component, HostListener, OnInit} from '@angular/core';
import {TasksService} from "../services/tasks.service";
import {MatDialog} from '@angular/material/dialog';
import {AddTaskComponent} from "../../add-task/add-task.component";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {FirestoreService} from "../../core/firestore.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tasks: any = [];
  next: any = [];
  dueDatePickerStart: any;
  dueDatePickerEnd: any;
  showFiller = false;
  constructor(private readonly tasksService: TasksService, public firestoreService: FirestoreService, private dialog: MatDialog) {
    this.dueDatePickerStart = new Date();
    this.dueDatePickerEnd = new Date();
    this.tasks = this.tasksService.getInboxData();
    this.next = this.tasksService.getNextData();
  }

  ngOnInit(): void {
  }

  adicionarTarefa() {
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width: '800px',
      data: {
        title: 'Adicionar Tarefa',
        description: '',
        dueDate: '',
        priority: '',
        status: '',
        id: ''
      }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      console.log(`Dialog result: ${result}`);
      await this.getInboxTasks();
    });

  }

  async getInboxTasks() {
    await this.tasksService.getInboxData();
  }
  async getNextTasks() {
    await this.tasksService.getNextData();
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if(event.previousContainer.data[event.previousIndex].status === 'NEXT') event.previousContainer.data[event.previousIndex].status = 'INBOX';
      else event.previousContainer.data[event.previousIndex].status = 'NEXT';
      this.firestoreService.sendTaskUpdate.next(event.previousContainer.data[event.previousIndex]);
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
