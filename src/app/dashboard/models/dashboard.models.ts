export type ProjectStatus = 'In Progress' | 'Planning' | 'On Hold';
export type ProjectFilter = 'All' | ProjectStatus;

export interface DashboardProject {
  code: string;
  knowledge: number;
  members: string[];
  name: string;
  progress: number;
  status: ProjectStatus;
  summary: string;
  tasksDone: number;
  tasksTotal: number;
}
