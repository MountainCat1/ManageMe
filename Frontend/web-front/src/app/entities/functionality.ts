import {v4 as uuidv4} from 'uuid';

export interface Functionality {
  id: string;
  name: string;
  description: string;
  priority: number;
  projectId: string;
  ownerId?: string;
  status: FunctionalityStatus;

  addDate: Date;
  startDate: Date | undefined;
}

export enum FunctionalityStatus {
  Todo = 'Todo',
  Doing = 'Doing',
  Done = 'Done',
}

export class FunctionalityFactory {
  static create(name: string, description: string, priority: number, projectId: string, ownerId?: string, status: FunctionalityStatus = FunctionalityStatus.Todo): Functionality {
    return {
      id: uuidv4(),
      name,
      description,
      priority,
      projectId,
      ownerId,
      status,
      addDate: new Date(),
      startDate: undefined
    };
  }
}
