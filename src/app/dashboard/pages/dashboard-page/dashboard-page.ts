import { Component, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DashboardProjectCard } from '../../components/dashboard-project-card/dashboard-project-card';
import { Topbar } from '../../../layout/topbar/topbar';
import { ProjectFilter } from '../../models/dashboard.models';
import { DashboardProjectsService } from '../../services/dashboard-projects.service';

@Component({
  imports: [DashboardProjectCard, MatIconModule, Topbar],
  selector: 'app-dashboard-page',
  styleUrl: './dashboard-page.scss',
  templateUrl: './dashboard-page.html',
})
export class DashboardPage {
  private readonly dashboardProjects = inject(DashboardProjectsService);

  readonly projects = this.dashboardProjects.projects;
  readonly selectedFilter = signal<ProjectFilter>('All');

  readonly filters = computed(() => [
    { count: this.projects().length, label: 'All' as const },
    {
      count: this.projects().filter((project) => project.status === 'In Progress').length,
      label: 'In Progress' as const,
    },
    {
      count: this.projects().filter((project) => project.status === 'Planning').length,
      label: 'Planning' as const,
    },
    {
      count: this.projects().filter((project) => project.status === 'On Hold').length,
      label: 'On Hold' as const,
    },
  ]);

  readonly visibleProjects = computed(() => {
    const filter = this.selectedFilter();

    return filter === 'All'
      ? this.projects()
      : this.projects().filter((project) => project.status === filter);
  });

  setFilter(filter: ProjectFilter): void {
    this.selectedFilter.set(filter);
  }

  readonly newProjectCard = {
    label: 'New project',
    subLabel: 'Start from blank or a template',
  };

  readonly actions = [
    { label: 'Invite', primary: false },
    { label: 'New project', primary: true },
  ];
}
