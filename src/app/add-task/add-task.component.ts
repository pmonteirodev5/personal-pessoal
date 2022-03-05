import { Component, OnInit } from '@angular/core';
import {TasksService} from "../dashboard/services/tasks.service";

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {
  showFiller = false;
  static INBOX = 'INBOX';
  constructor(private readonly tasksService: TasksService) { }

  ngOnInit(): void {
  }
  async addTask(event: any) {
    event.preventDefault();
    await this.tasksService.addTask({

      title: event.target.title.value,
      description: event.target.description.value,
      status: AddTaskComponent.INBOX,
      dueDate: event.target.dueDate.value,
    });
  }

}
