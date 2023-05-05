import {v4 as uuidv4} from 'uuid';

export enum TaskState {
  Todo = 'Todo',
  Doing = 'Doing',
  Done = 'Done',
}

export interface TaskItem {
  id: string;
  name: string;
  description: string;
  priority: number;
  estimatedTime: number;
  state: TaskState;
  addedDate: Date;
  startedDate?: Date;
  completedDate?: Date;
  assignedUserId: string;
  functionalityId: string;
  workHoursDone: number;
}

export class TaskItemFactory {
  static create(name: string, description: string, priority: number, functionalityId: string, estimatedTime: number, startedDate?: Date, completedDate?: Date, assignedUserId?: string): TaskItem {
    return {
      id: uuidv4(),
      name,
      description,
      priority,
      functionalityId,
      estimatedTime,
      startedDate,
      completedDate,
      addedDate: new Date(),
      state: TaskState.Todo,
      assignedUserId: assignedUserId || '',
      workHoursDone: 0
    };
  }
}
