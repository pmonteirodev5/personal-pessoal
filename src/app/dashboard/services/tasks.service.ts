import { Injectable } from '@angular/core';
import {FirestoreService} from "../../core/firestore.service";

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private readonly firestoreService: FirestoreService) { }


  addTask(task: any) {
    return this.firestoreService.addOrUpdateData(task);
  }

  async getInboxData() {
    return await this.firestoreService.getInboxData();
  }
  getNextData() {
    return this.firestoreService.getNextData();
  }

}
