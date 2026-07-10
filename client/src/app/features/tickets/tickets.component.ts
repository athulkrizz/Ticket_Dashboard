import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TicketService } from '../../core/services/ticket.service';
import { AuthService } from '../../core/services/auth.service';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { PriorityBadgeComponent } from '../../shared/components/priority-badge/priority-badge.component';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';
import { Ticket, TicketStatus, TicketPriority, CreateTicketRequest } from '../../core/models/ticket.model';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule,
    SelectModule, DialogModule, TextareaModule, ToastModule,
    ConfirmDialogModule, SkeletonModule, TagModule, TooltipModule,
    SelectButtonModule, StatusBadgeComponent, PriorityBadgeComponent, TimeAgoPipe,
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-toast />
    <p-confirmDialog />

    <div class="tickets-page">
      <!-- Stat Cards -->
      <div class="stat-cards">
        <div class="stat-card total" (click)="filterByStatus(undefined)">
          <div class="stat-icon"><i class="pi pi-ticket"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ ticketService.stats().total }}</span>
            <span class="stat-label">Total Tickets</span>
          </div>
        </div>
        <div class="stat-card open" (click)="filterByStatus('open')">
          <div class="stat-icon"><i class="pi pi-circle"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ ticketService.stats().open }}</span>
            <span class="stat-label">Open</span>
          </div>
        </div>
        <div class="stat-card in-progress" (click)="filterByStatus('in_progress')">
          <div class="stat-icon"><i class="pi pi-spinner"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ ticketService.stats().inProgress }}</span>
            <span class="stat-label">In Progress</span>
          </div>
        </div>
        <div class="stat-card resolved" (click)="filterByStatus('resolved')">
          <div class="stat-icon"><i class="pi pi-check-circle"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ ticketService.stats().resolved }}</span>
            <span class="stat-label">Resolved</span>
          </div>
        </div>
        <div class="stat-card closed" (click)="filterByStatus('closed')">
          <div class="stat-icon"><i class="pi pi-lock"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ ticketService.stats().closed }}</span>
            <span class="stat-label">Closed</span>
          </div>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="toolbar">
        <div class="toolbar-left">
          <span class="p-input-icon-left search-wrapper">
            <input
              pInputText
              [(ngModel)]="searchQuery"
              placeholder="Search tickets..."
              (input)="onSearch()"
              class="search-input"
            />
          </span>

          <p-selectbutton
            [options]="statusOptions"
            [(ngModel)]="selectedStatus"
            (onChange)="onFilterChange()"
            optionLabel="label"
            optionValue="value"
            styleClass="status-filter"
          />
        </div>

        <div class="toolbar-right">
          <p-select
            [options]="priorityOptions"
            [(ngModel)]="selectedPriority"
            (onChange)="onFilterChange()"
            placeholder="All Priorities"
            [showClear]="true"
            styleClass="priority-filter"
          />
          <button
            pButton
            label="New Ticket"
            icon="pi pi-plus"
            (click)="showCreateDialog = true"
            class="new-ticket-btn"
          ></button>
        </div>
      </div>

      <!-- Ticket Table -->
      @if (ticketService.loading()) {
        <div class="skeleton-table">
          @for (i of [1,2,3,4,5,6,7,8]; track i) {
            <div class="skeleton-row">
              <p-skeleton width="80px" height="20px" />
              <p-skeleton width="300px" height="20px" />
              <p-skeleton width="90px" height="24px" borderRadius="12px" />
              <p-skeleton width="70px" height="24px" borderRadius="12px" />
              <p-skeleton width="100px" height="20px" />
              <p-skeleton width="80px" height="20px" />
            </div>
          }
        </div>
      } @else {
        <p-table
          [value]="ticketService.tickets()"
          [paginator]="true"
          [rows]="10"
          [rowsPerPageOptions]="[10, 20, 50]"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} tickets"
          [globalFilterFields]="['title', 'id', 'assignee']"
          styleClass="p-datatable-sm p-datatable-gridlines"
          [rowHover]="true"
          responsiveLayout="scroll"
        >
          <ng-template #header>
            <tr>
              <th style="width: 100px" pSortableColumn="id">ID <p-sortIcon field="id" /></th>
              <th pSortableColumn="title">Title <p-sortIcon field="title" /></th>
              <th style="width: 130px">Status</th>
              <th style="width: 110px">Priority</th>
              <th style="width: 130px" pSortableColumn="assignee">Assignee <p-sortIcon field="assignee" /></th>
              <th style="width: 130px" pSortableColumn="createdAt">Created <p-sortIcon field="createdAt" /></th>
              <th style="width: 80px">Actions</th>
            </tr>
          </ng-template>
          <ng-template #body let-ticket>
            <tr class="ticket-row" (click)="openTicket(ticket)">
              <td><span class="ticket-id">{{ ticket.id }}</span></td>
              <td>
                <div class="ticket-title-cell">
                  <span class="ticket-title">{{ ticket.title }}</span>
                  <div class="ticket-tags">
                    @for (tag of ticket.tags.slice(0, 3); track tag) {
                      <p-tag [value]="tag" [rounded]="true" severity="secondary" styleClass="tag-mini" />
                    }
                  </div>
                </div>
              </td>
              <td><app-status-badge [status]="ticket.status" /></td>
              <td><app-priority-badge [priority]="ticket.priority" /></td>
              <td>
                <div class="assignee-cell">
                  <div class="assignee-avatar">{{ getInitial(ticket.assignee) }}</div>
                  <span>{{ ticket.assignee }}</span>
                </div>
              </td>
              <td><span class="created-date">{{ ticket.createdAt | timeAgo }}</span></td>
              <td>
                <button
                  pButton
                  icon="pi pi-trash"
                  [rounded]="true"
                  [text]="true"
                  severity="danger"
                  (click)="confirmDelete($event, ticket)"
                  pTooltip="Delete"
                ></button>
              </td>
            </tr>
          </ng-template>
          <ng-template #emptymessage>
            <tr>
              <td colspan="7">
                <div class="empty-state">
                  <i class="pi pi-inbox empty-icon"></i>
                  <h3>No tickets found</h3>
                  <p>Try adjusting your search or filters</p>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      }

      <!-- Create Ticket Dialog -->
      <p-dialog
        header="Create New Ticket"
        [(visible)]="showCreateDialog"
        [modal]="true"
        [style]="{ width: '500px' }"
        [draggable]="false"
        styleClass="create-dialog"
      >
        <div class="create-form">
          <div class="field">
            <label for="newTitle">Title *</label>
            <input id="newTitle" pInputText [(ngModel)]="newTicket.title" placeholder="Brief ticket title" class="w-full" />
          </div>
          <div class="field">
            <label for="newDesc">Description *</label>
            <textarea id="newDesc" pTextarea [(ngModel)]="newTicket.description" placeholder="Detailed description..." rows="4" class="w-full"></textarea>
          </div>
          <div class="field-row">
            <div class="field">
              <label>Priority *</label>
              <p-select
                [options]="createPriorityOptions"
                [(ngModel)]="newTicket.priority"
                placeholder="Select priority"
                styleClass="w-full"
                appendTo="body"
              />
            </div>
            <div class="field">
              <label>Assignee</label>
              <p-select
                [options]="assigneeOptions"
                [(ngModel)]="newTicket.assignee"
                placeholder="Assign to..."
                styleClass="w-full"
                appendTo="body"
              />
            </div>
          </div>
        </div>
        <ng-template #footer>
          <button pButton label="Cancel" [text]="true" severity="secondary" (click)="showCreateDialog = false"></button>
          <button pButton label="Create Ticket" icon="pi pi-plus" (click)="createTicket()" [disabled]="!newTicket.title || !newTicket.description || !newTicket.priority"></button>
        </ng-template>
      </p-dialog>
    </div>
  `,
  styles: [`
    .tickets-page {
      padding: 1.5rem 2rem;
      max-width: 1600px;
      margin: 0 auto;
    }

    /* Stat Cards */
    .stat-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      border-radius: 14px;
      background: var(--surface-card);
      border: 1px solid var(--surface-border);
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      border-radius: 16px 16px 0 0;
    }

    .stat-card.total::before { background: linear-gradient(90deg, #6C63FF, #a78bfa); }
    .stat-card.open::before { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
    .stat-card.in-progress::before { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
    .stat-card.resolved::before { background: linear-gradient(90deg, #10b981, #34d399); }
    .stat-card.closed::before { background: linear-gradient(90deg, #6b7280, #9ca3af); }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .stat-card.total .stat-icon { background: rgba(108, 99, 255, 0.15); color: #6C63FF; }
    .stat-card.open .stat-icon { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
    .stat-card.in-progress .stat-icon { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
    .stat-card.resolved .stat-icon { background: rgba(16, 185, 129, 0.15); color: #10b981; }
    .stat-card.closed .stat-icon { background: rgba(107, 114, 128, 0.15); color: #6b7280; }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 800;
      line-height: 1;
      color: var(--text-color);
    }

    .stat-label {
      font-size: 0.8rem;
      color: var(--text-color-secondary);
      margin-top: 0.25rem;
      font-weight: 500;
    }

    /* Toolbar */
    .toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .search-wrapper {
      position: relative;
    }

    .search-input {
      width: 280px;
      border-radius: 10px !important;
    }

    :host ::ng-deep .new-ticket-btn {
      border-radius: 10px !important;
      font-weight: 600;
      background: linear-gradient(135deg, var(--primary-color), #a78bfa) !important;
      border: none !important;
      color: white !important;
    }

    /* Table */
    .ticket-row {
      cursor: pointer;
      transition: background 0.15s;
    }

    .ticket-id {
      font-family: 'Inter', monospace;
      font-weight: 600;
      font-size: 0.85rem;
      color: var(--primary-color);
    }

    .ticket-title-cell {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .ticket-title {
      font-weight: 500;
      font-size: 0.9rem;
      color: var(--text-color);
    }

    .ticket-tags {
      display: flex;
      gap: 0.25rem;
    }

    :host ::ng-deep .tag-mini {
      font-size: 0.7rem !important;
      padding: 0.1rem 0.4rem !important;
    }

    .assignee-cell {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .assignee-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary-color), #a78bfa);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
      flex-shrink: 0;
    }

    .created-date {
      font-size: 0.85rem;
      color: var(--text-color-secondary);
    }

    /* Empty State */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 3rem;
      color: var(--text-color-secondary);
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .empty-state h3 { margin: 0; font-size: 1.1rem; color: var(--text-color); }
    .empty-state p { margin: 0.25rem 0 0; font-size: 0.9rem; }

    /* Skeleton Loading */
    .skeleton-table {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
      background: var(--surface-card);
      border-radius: 12px;
      border: 1px solid var(--surface-border);
    }

    .skeleton-row {
      display: flex;
      gap: 1.5rem;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--surface-border);
    }

    /* Create Form */
    .create-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .field label {
      font-weight: 600;
      font-size: 0.875rem;
    }

    .field-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .w-full { width: 100%; }

    /* Responsive */
    @media (max-width: 1024px) {
      .stat-cards {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 768px) {
      .tickets-page { padding: 1rem; }
      .stat-cards {
        grid-template-columns: repeat(2, 1fr);
      }
      .toolbar {
        flex-direction: column;
        align-items: stretch;
      }
      .toolbar-left, .toolbar-right {
        flex-direction: column;
      }
      .search-input { width: 100%; }
      .field-row {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 480px) {
      .stat-cards {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class TicketsComponent implements OnInit {
  searchQuery = '';
  selectedStatus: string | undefined;
  selectedPriority: string | undefined;
  showCreateDialog = false;

  newTicket: CreateTicketRequest = {
    title: '',
    description: '',
    priority: 'medium' as TicketPriority,
    assignee: '',
    tags: [],
  };

  statusOptions = [
    { label: 'All', value: undefined },
    { label: 'Open', value: 'open' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Resolved', value: 'resolved' },
    { label: 'Closed', value: 'closed' },
  ];

  priorityOptions = [
    { label: 'Critical', value: 'critical' },
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' },
  ];

  createPriorityOptions = [
    { label: 'Critical', value: 'critical' },
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' },
  ];

  assigneeOptions = [
    { label: 'Athul Krishnan', value: 'Athul.Krishnan' },
    { label: 'Surya Lekshmi', value: 'Surya.Lekshmi' },
    { label: 'Manu Kuttan', value: 'Manu.Kuttan' },
  ];

  private searchTimeout: any;

  constructor(
    public ticketService: TicketService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit() {
    this.ticketService.loadTickets();
    this.ticketService.loadStats();
  }

  onSearch() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.loadWithFilters(), 300);
  }

  onFilterChange() {
    this.loadWithFilters();
  }

  filterByStatus(status: string | undefined) {
    this.selectedStatus = status;
    this.loadWithFilters();
  }

  private loadWithFilters() {
    this.ticketService.loadTickets({
      search: this.searchQuery || undefined,
      status: this.selectedStatus as TicketStatus | undefined,
      priority: this.selectedPriority as TicketPriority | undefined,
    });
  }

  openTicket(ticket: Ticket) {
    this.router.navigate(['/tickets', ticket.id]);
  }

  getInitial(name: string): string {
    return name.split('.').map(p => p.charAt(0).toUpperCase()).join('');
  }

  confirmDelete(event: Event, ticket: Ticket) {
    event.stopPropagation();
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Delete ticket ${ticket.id}?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ticketService.deleteTicket(ticket.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Deleted', detail: `${ticket.id} removed` });
            this.ticketService.loadTickets();
            this.ticketService.loadStats();
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete' });
          },
        });
      },
    });
  }

  createTicket() {
    this.ticketService.createTicket(this.newTicket).subscribe({
      next: (ticket) => {
        this.messageService.add({ severity: 'success', summary: 'Created', detail: `Ticket ${ticket.id} created` });
        this.showCreateDialog = false;
        this.newTicket = { title: '', description: '', priority: 'medium', assignee: '', tags: [] };
        this.ticketService.loadTickets();
        this.ticketService.loadStats();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create ticket' });
      },
    });
  }
}
