import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  Ticket,
  TicketStats,
  CreateTicketRequest,
  UpdateTicketRequest,
  AddCommentRequest,
  TicketStatus,
  TicketPriority,
} from '../models/ticket.model';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly apiUrl = `${environment.apiUrl}/api/tickets`;

  tickets = signal<Ticket[]>([]);
  stats = signal<TicketStats>({ total: 0, open: 0, inProgress: 0, resolved: 0, closed: 0 });
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  loadTickets(params?: {
    search?: string;
    status?: TicketStatus;
    priority?: TicketPriority;
    sort?: string;
    order?: string;
  }) {
    this.loading.set(true);
    this.error.set(null);

    let httpParams = new HttpParams();
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.status) httpParams = httpParams.set('status', params.status);
    if (params?.priority) httpParams = httpParams.set('priority', params.priority);
    if (params?.sort) httpParams = httpParams.set('sort', params.sort);
    if (params?.order) httpParams = httpParams.set('order', params.order);

    this.http.get<Ticket[]>(this.apiUrl, { params: httpParams }).subscribe({
      next: (tickets) => {
        this.tickets.set(tickets);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load tickets');
        this.loading.set(false);
      },
    });
  }

  loadStats() {
    this.http.get<TicketStats>(`${this.apiUrl}/stats`).subscribe({
      next: (stats) => this.stats.set(stats),
      error: () => {},
    });
  }

  getTicketById(id: string) {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`);
  }

  createTicket(ticket: CreateTicketRequest) {
    return this.http.post<Ticket>(this.apiUrl, ticket);
  }

  updateTicket(id: string, updates: UpdateTicketRequest) {
    return this.http.patch<Ticket>(`${this.apiUrl}/${id}`, updates);
  }

  deleteTicket(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addComment(ticketId: string, comment: AddCommentRequest) {
    return this.http.post<Ticket>(`${this.apiUrl}/${ticketId}/comments`, comment);
  }
}
