import { Component, Input } from '@angular/core';
import { DashboardProject } from '../../models/dashboard.models';

@Component({
  selector: 'app-dashboard-project-card',
  styleUrl: './dashboard-project-card.scss',
  templateUrl: './dashboard-project-card.html',
})
export class DashboardProjectCard {
  @Input({ required: true }) project!: DashboardProject;
}
