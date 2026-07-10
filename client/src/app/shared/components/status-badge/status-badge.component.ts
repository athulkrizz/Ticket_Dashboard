import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { TicketStatus } from '../../../core/models/ticket.model';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule, TagModule],
  template: `
    <p-tag
      [value]="labelMap[status()]"
      [severity]="severityMap[status()]"
      [rounded]="true"
      [icon]="iconMap[status()]"
    />
  `,
})
export class StatusBadgeComponent {
  status = input.required<TicketStatus>();

  labelMap: Record<TicketStatus, string> = {
    open: 'Open',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
  };

  severityMap: Record<TicketStatus, 'info' | 'warn' | 'success' | 'secondary'> = {
    open: 'info',
    in_progress: 'warn',
    resolved: 'success',
    closed: 'secondary',
  };

  iconMap: Record<TicketStatus, string> = {
    open: 'pi pi-circle',
    in_progress: 'pi pi-spin pi-spinner',
    resolved: 'pi pi-check-circle',
    closed: 'pi pi-lock',
  };
}
