import { Ticket, TicketStatus, TicketPriority } from './ticket.entity';

export interface TicketQueryParams {
  search?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  sort?: 'createdAt' | 'updatedAt' | 'priority' | 'status';
  order?: 'asc' | 'desc';
}

export interface ITicketRepository {
  findAll(query?: TicketQueryParams): Ticket[];
  findById(id: string): Ticket | undefined;
  create(ticket: Ticket): Ticket;
  update(id: string, partial: Partial<Ticket>): Ticket | undefined;
  delete(id: string): boolean;
  getStats(): { total: number; open: number; inProgress: number; resolved: number; closed: number };
}
