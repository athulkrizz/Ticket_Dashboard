import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ChipModule } from 'primeng/chip';
import { MessageService, MenuItem } from 'primeng/api';
import { TicketService } from '../../core/services/ticket.service';
import { AuthService } from '../../core/services/auth.service';
import { AiAssistantService } from '../../core/services/ai-assistant.service';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';
import { Ticket, TicketStatus, TicketPriority } from '../../core/models/ticket.model';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, CardModule, ButtonModule,
    InputTextModule, TextareaModule, SelectModule, TagModule,
    DividerModule, AvatarModule, ToastModule, SkeletonModule,
    BreadcrumbModule, ChipModule, TimeAgoPipe,
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>

    <div class="detail-page">
      @if (loading()) {
        <div class="loading-state">
          <p-skeleton width="200px" height="20px"></p-skeleton>
          <p-skeleton width="100%" height="40px" styleClass="mt-3"></p-skeleton>
          <p-skeleton width="100%" height="200px" styleClass="mt-3"></p-skeleton>
        </div>
      } @else {
        @if (ticket(); as t) {
          <p-breadcrumb [model]="breadcrumbItems" [home]="homeItem" styleClass="detail-breadcrumb"></p-breadcrumb>

          <div class="detail-layout">
            <div class="detail-main">
              <div class="detail-header">
                <div class="header-top">
                  <span class="ticket-id">{{ t.id }}</span>
                  <div class="header-actions">
                    <button pButton icon="pi pi-sparkles" label="Ask AI" [rounded]="true"
                            [outlined]="true" (click)="openAiWithContext()" class="ai-btn"></button>
                    <button pButton icon="pi pi-arrow-left" label="Back" [text]="true"
                            severity="secondary" (click)="goBack()"></button>
                  </div>
                </div>

                @if (editingTitle()) {
                  <div class="edit-title">
                    <input pInputText [(ngModel)]="editTitle" class="w-full title-input" />
                    <button pButton icon="pi pi-check" [rounded]="true" severity="success" (click)="saveTitle()"></button>
                    <button pButton icon="pi pi-times" [rounded]="true" [text]="true" severity="secondary" (click)="editingTitle.set(false)"></button>
                  </div>
                } @else {
                  <h1 class="detail-title" (click)="startEditTitle()">
                    {{ t.title }}
                    <i class="pi pi-pencil edit-hint"></i>
                  </h1>
                }
              </div>

              <div class="detail-section">
                <h3 class="section-title"><i class="pi pi-align-left"></i> Description</h3>
                @if (editingDesc()) {
                  <div class="edit-desc">
                    <textarea pTextarea [(ngModel)]="editDesc" rows="5" class="w-full"></textarea>
                    <div class="edit-actions">
                      <button pButton label="Save" icon="pi pi-check" size="small" (click)="saveDescription()"></button>
                      <button pButton label="Cancel" [text]="true" size="small" severity="secondary" (click)="editingDesc.set(false)"></button>
                    </div>
                  </div>
                } @else {
                  <p class="description-text" (click)="startEditDesc()">
                    {{ t.description }}
                    <i class="pi pi-pencil edit-hint"></i>
                  </p>
                }
              </div>

              <p-divider></p-divider>

              <div class="detail-section">
                <h3 class="section-title"><i class="pi pi-comments"></i> Comments ({{ t.comments.length }})</h3>

                <div class="comments-list">
                  @for (comment of t.comments; track comment.id) {
                    <div class="comment">
                      <div class="comment-avatar">
                        {{ getInitial(comment.author) }}
                      </div>
                      <div class="comment-body">
                        <div class="comment-header">
                          <span class="comment-author">{{ comment.author }}</span>
                          <span class="comment-date">{{ comment.createdAt | timeAgo }}</span>
                        </div>
                        <p class="comment-text">{{ comment.content }}</p>
                      </div>
                    </div>
                  }

                  @if (t.comments.length === 0) {
                    <div class="no-comments">
                      <i class="pi pi-comment"></i>
                      <span>No comments yet</span>
                    </div>
                  }
                </div>

                <div class="add-comment">
                  <textarea pTextarea [(ngModel)]="newComment" placeholder="Add a comment..." rows="3" class="w-full"></textarea>
                  <button pButton label="Post Comment" icon="pi pi-send" size="small"
                          (click)="addComment()" [disabled]="!newComment.trim()" class="post-btn"></button>
                </div>
              </div>
            </div>

            <div class="detail-sidebar">
              <p-card styleClass="sidebar-card">
                <div class="sidebar-section">
                  <label>Status</label>
                  <p-select
                    [options]="statusOptions"
                    [(ngModel)]="t.status"
                    (onChange)="updateField('status', t.status)"
                    styleClass="w-full"
                  ></p-select>
                </div>

                <div class="sidebar-section">
                  <label>Priority</label>
                  <p-select
                    [options]="priorityOptions"
                    [(ngModel)]="t.priority"
                    (onChange)="updateField('priority', t.priority)"
                    styleClass="w-full"
                  ></p-select>
                </div>

                <p-divider></p-divider>

                <div class="sidebar-section">
                  <label>Assignee</label>
                  <p-select
                    [options]="assigneeOptions"
                    [(ngModel)]="t.assignee"
                    (onChange)="updateField('assignee', t.assignee)"
                    styleClass="w-full"
                  ></p-select>
                </div>

                <div class="sidebar-section">
                  <label>Reporter</label>
                  <div class="meta-value">
                    <div class="meta-avatar">{{ getInitial(t.reporter) }}</div>
                    <span>{{ t.reporter }}</span>
                  </div>
                </div>

                <p-divider></p-divider>

                <div class="sidebar-section">
                  <label>Tags</label>
                  <div class="tags-list">
                    @for (tag of t.tags; track tag) {
                      <p-tag [value]="tag" [rounded]="true" severity="secondary"></p-tag>
                    }
                  </div>
                </div>

                <p-divider></p-divider>

                <div class="sidebar-section">
                  <label>Created</label>
                  <span class="meta-date">{{ t.createdAt | timeAgo }}</span>
                </div>
                <div class="sidebar-section">
                  <label>Updated</label>
                  <span class="meta-date">{{ t.updatedAt | timeAgo }}</span>
                </div>
              </p-card>
            </div>
          </div>
        } @else {
          <div class="not-found">
            <i class="pi pi-exclamation-triangle"></i>
            <h2>Ticket not found</h2>
            <button pButton label="Back to Dashboard" icon="pi pi-arrow-left" (click)="goBack()"></button>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .detail-page {
      padding: 1.5rem 2rem;
      max-width: 1400px;
      margin: 0 auto;
      padding-top: 76px;
    }

    :host ::ng-deep .detail-breadcrumb {
      background: transparent !important;
      border: none !important;
      padding: 0 !important;
      margin-bottom: 1rem;
    }

    .detail-layout {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 2rem;
      align-items: start;
    }

    .detail-header { margin-bottom: 1.5rem; }

    .header-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }

    .ticket-id {
      font-family: 'Inter', monospace;
      font-weight: 700;
      font-size: 0.9rem;
      color: var(--primary-color);
      background: rgba(108, 99, 255, 0.1);
      padding: 0.25rem 0.75rem;
      border-radius: 2rem;
    }

    .header-actions { display: flex; gap: 0.5rem; }

    :host ::ng-deep .ai-btn {
      border-color: var(--primary-color) !important;
      color: var(--primary-color) !important;
    }

    .detail-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0;
      color: var(--text-color);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .edit-hint {
      font-size: 0.8rem;
      opacity: 0;
      color: var(--text-color-secondary);
      transition: opacity 0.2s;
    }

    .detail-title:hover .edit-hint,
    .description-text:hover .edit-hint {
      opacity: 0.6;
    }

    .edit-title { display: flex; gap: 0.5rem; align-items: center; }
    .title-input { font-size: 1.25rem !important; font-weight: 600 !important; }

    .detail-section { margin-bottom: 1.5rem; }

    .section-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-color);
      margin: 0 0 1rem;
    }

    .section-title i { color: var(--primary-color); }

    .description-text {
      color: var(--text-color-secondary);
      line-height: 1.7;
      font-size: 0.95rem;
      cursor: pointer;
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .edit-desc .edit-actions { display: flex; gap: 0.5rem; margin-top: 0.5rem; }

    .comments-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .comment {
      display: flex;
      gap: 0.75rem;
      padding: 1rem;
      background: var(--surface-50);
      border-radius: 12px;
      border: 1px solid var(--surface-border);
    }

    .comment-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary-color), #a78bfa);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: 700;
      flex-shrink: 0;
    }

    .comment-body { flex: 1; min-width: 0; }
    .comment-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.35rem; }
    .comment-author { font-weight: 600; font-size: 0.875rem; color: var(--text-color); }
    .comment-date { font-size: 0.75rem; color: var(--text-color-secondary); }
    .comment-text { margin: 0; font-size: 0.9rem; color: var(--text-color-secondary); line-height: 1.5; }

    .no-comments {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-color-secondary);
      font-size: 0.9rem;
      padding: 1rem;
    }

    .add-comment { display: flex; flex-direction: column; gap: 0.5rem; }
    :host ::ng-deep .post-btn { align-self: flex-end; }

    :host ::ng-deep .sidebar-card { border-radius: 16px !important; position: sticky; top: 80px; }

    .sidebar-section { margin-bottom: 1rem; }

    .sidebar-section label {
      display: block;
      font-weight: 600;
      font-size: 0.8rem;
      color: var(--text-color-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }

    .meta-value { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: var(--text-color); }

    .meta-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: linear-gradient(135deg, #10b981, #34d399);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      font-weight: 700;
    }

    .tags-list { display: flex; flex-wrap: wrap; gap: 0.35rem; }
    .meta-date { font-size: 0.875rem; color: var(--text-color); }
    .w-full { width: 100%; }

    .not-found {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      color: var(--text-color-secondary);
    }

    .not-found i { font-size: 4rem; margin-bottom: 1rem; color: var(--primary-color); }

    .loading-state { padding: 2rem; }

    @media (max-width: 768px) {
      .detail-layout { grid-template-columns: 1fr; }
      .detail-page { padding: 1rem; }
      .header-actions { flex-direction: column; }
      .detail-title { font-size: 1.2rem; }
    }
  `],
})
export class TicketDetailComponent implements OnInit {
  ticket = signal<Ticket | null>(null);
  loading = signal(true);

  editingTitle = signal(false);
  editingDesc = signal(false);
  editTitle = '';
  editDesc = '';
  newComment = '';

  homeItem: MenuItem = { icon: 'pi pi-home', routerLink: '/tickets' };
  breadcrumbItems: MenuItem[] = [];

  statusOptions = [
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

  assigneeOptions = [
    { label: 'Athul Krishnan', value: 'Athul.Krishnan' },
    { label: 'Surya Lekshmi', value: 'Surya.Lekshmi' },
    { label: 'Manu Kuttan', value: 'Manu.Kuttan' },
    { label: 'Unassigned', value: 'unassigned' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private authService: AuthService,
    private aiService: AiAssistantService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.breadcrumbItems = [
      { label: 'Tickets', routerLink: '/tickets' },
      { label: id },
    ];

    this.ticketService.getTicketById(id).subscribe({
      next: (ticket) => {
        this.ticket.set(ticket);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  getInitial(name: string): string {
    return name.split('.').map(p => p.charAt(0).toUpperCase()).join('');
  }

  startEditTitle() {
    this.editTitle = this.ticket()!.title;
    this.editingTitle.set(true);
  }

  startEditDesc() {
    this.editDesc = this.ticket()!.description;
    this.editingDesc.set(true);
  }

  saveTitle() {
    const t = this.ticket()!;
    this.ticketService.updateTicket(t.id, { title: this.editTitle }).subscribe({
      next: (updated) => {
        this.ticket.set(updated);
        this.editingTitle.set(false);
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Title saved' });
      },
    });
  }

  saveDescription() {
    const t = this.ticket()!;
    this.ticketService.updateTicket(t.id, { description: this.editDesc }).subscribe({
      next: (updated) => {
        this.ticket.set(updated);
        this.editingDesc.set(false);
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Description saved' });
      },
    });
  }

  updateField(field: string, value: any) {
    const t = this.ticket()!;
    this.ticketService.updateTicket(t.id, { [field]: value }).subscribe({
      next: (updated) => {
        this.ticket.set(updated);
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: `${field} updated` });
      },
    });
  }

  addComment() {
    const t = this.ticket()!;
    const author = this.authService.currentUser()?.username || 'anonymous';
    this.ticketService.addComment(t.id, { content: this.newComment.trim(), author }).subscribe({
      next: (updated) => {
        this.ticket.set(updated);
        this.newComment = '';
        this.messageService.add({ severity: 'success', summary: 'Comment Added', detail: 'Your comment was posted' });
      },
    });
  }

  openAiWithContext() {
    this.aiService.open();
    const t = this.ticket();
    if (t) {
      this.aiService.sendMessage('Summarize this ticket', { id: t.id, title: t.title, status: t.status, priority: t.priority });
    }
  }

  goBack() {
    this.router.navigate(['/tickets']);
  }
}
