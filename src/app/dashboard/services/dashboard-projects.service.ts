import { Injectable, signal } from '@angular/core';
import projectsMock from '../data/projects.mock.json';
import { DashboardProject } from '../models/dashboard.models';

@Injectable({ providedIn: 'root' })
export class DashboardProjectsService {
  readonly projects = signal<DashboardProject[]>(projectsMock as DashboardProject[]);
}
