import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { TicketPriority } from '../../../core/models/ticket.model';

@Component({
  selector: 'app-priority-badge',
  standalone: true,
  imports: [CommonModule, TagModule],
  template: `
    <p-tag
      [value]="labelMap[priority()]"
      [severity]="severityMap[priority()]"
      [rounded]="true"
      [icon]="iconMap[priority()]"
    />
  `,
  styles: [`
    :host ::ng-deep .p-tag.p-tag-danger {
      background: linear-gradient(135deg, #ff4757, #ff6b81);
      align-items: flex-end;
    }
    :host ::ng-deep .p-tag.p-tag-warn {
  background: linear-gradient(135deg, #c76b00, #e08b00);
}
  `],
})
export class PriorityBadgeComponent {
  priority = input.required<TicketPriority>();

  labelMap: Record<TicketPriority, string> = {
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  };

  severityMap: Record<TicketPriority, 'danger' | 'warn' | 'info' | 'secondary'> = {
    critical: 'danger',
    high: 'warn',
    medium: 'info',
    low: 'secondary',
  };

  iconMap: Record<TicketPriority, string> = {
    critical: 'pi pi-exclamation-triangle',
    high: 'pi pi-arrow-up',
    medium: 'pi pi-minus',
    low: 'pi pi-arrow-down',
  };
}
