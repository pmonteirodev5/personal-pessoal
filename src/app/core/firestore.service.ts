import {Injectable} from '@angular/core';
import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {collection, addDoc, doc, getDocs, onSnapshot, query, where} from "firebase/firestore";
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  public sendTaskUpdate: Subject<any> = new Subject();
  public updateInboxTasks: Subject<any> = new Subject();
  public observeInboxTaskUpdate: Observable<any> = this.updateInboxTasks.asObservable();

  public updateNextTasks: Subject<any> = new Subject();
  public observeNextTaskUpdate: Observable<any> = this.updateNextTasks.asObservable();

  public observeTaskUpdate: Observable<any> = this.sendTaskUpdate.asObservable();
  constructor() {
    this.observeTaskUpdate.subscribe(async (task: any) => {

      await this.addOrUpdateData(task);
    });
  }

  getFirestoreDB() {
    const firebaseApp = initializeApp({
      apiKey: "AIzaSyCUXeK8ibMcZMgfGMyxjclrvPXqpRjNFNE",
      authDomain: "personal-pessoal.firebaseapp.com",
      projectId: "personal-pessoal"
    })
    return getFirestore(firebaseApp);
  }

  async addOrUpdateData(task: any) {
    const db = this.getFirestoreDB();
    try {
      if(task.id) {
        await addDoc(collection(db, "tasks"), {
          id: task.id,
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          status: task.status
        });
      } else {
        await addDoc(collection(db, "tasks"), {
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          status: task.status
        });
      }
    } catch (error) {
      console.log(error);

    }
  }
  async getInboxData() {
    const db = this.getFirestoreDB();
    const inboxTasks = collection(db, "tasks");
    const q = query(inboxTasks, where("status", "==", "INBOX"));
    const querySnapshot = await getDocs(q);
    const tasks = querySnapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    });
    return tasks;
  }
  async getNextData() {
    const db = this.getFirestoreDB();
    const inboxTasks = collection(db, "tasks");
    const q = query(inboxTasks, where("status", "==", "NEXT"));
    const querySnapshot = await getDocs(q);
    const tasks = querySnapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    });
    return tasks;  }
}
