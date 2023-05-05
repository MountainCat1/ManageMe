import {v4 as uuidv4} from 'uuid';

export interface Project {
  id: string;
  name: string;
  description: string;
  startTime: Date;
  endTime?: Date;
  estimatedTime?: number;
  workHourDone?: number;
}

export class ProjectFactory {
  static create(name: string, description: string, startTime: Date, endTime?: Date, estimatedTime?: number, workHourDone?: number): Project {
    return {
      id: uuidv4(),
      name,
      description,
      startTime,
      endTime,
      estimatedTime,
      workHourDone,
    };
  }
}
