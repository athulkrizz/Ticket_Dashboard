import { Injectable } from '@nestjs/common';
import { Ticket, TicketStatus, TicketPriority } from './ticket.entity';
import { ITicketRepository, TicketQueryParams } from './ticket.repository.interface';
import { SEED_TICKETS } from './data/seed.data';

@Injectable()
export class InMemoryTicketRepository implements ITicketRepository {
  private tickets: Map<string, Ticket> = new Map();
  private nextId = 26;

  constructor() {
    SEED_TICKETS.forEach((ticket) => this.tickets.set(ticket.id, { ...ticket }));
  }

  findAll(query?: TicketQueryParams): Ticket[] {
    let results = Array.from(this.tickets.values());

    if (query?.search) {
      const term = query.search.toLowerCase();
      results = results.filter(
        (t) =>
          t.title.toLowerCase().includes(term) ||
          t.description.toLowerCase().includes(term) ||
          t.id.toLowerCase().includes(term) ||
          t.tags.some((tag) => tag.toLowerCase().includes(term)),
      );
    }

    if (query?.status) {
      results = results.filter((t) => t.status === query.status);
    }

    if (query?.priority) {
      results = results.filter((t) => t.priority === query.priority);
    }

    const sortField = query?.sort || 'createdAt';
    const sortOrder = query?.order || 'desc';

    results.sort((a, b) => {
      let comparison = 0;

      if (sortField === 'priority') {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortField === 'status') {
        const statusOrder = { open: 1, in_progress: 2, resolved: 3, closed: 4 };
        comparison = statusOrder[a.status] - statusOrder[b.status];
      } else {
        comparison = new Date(a[sortField]).getTime() - new Date(b[sortField]).getTime();
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return results;
  }

  findById(id: string): Ticket | undefined {
    return this.tickets.get(id);
  }

  create(ticket: Ticket): Ticket {
    const id = `TKT-${String(this.nextId++).padStart(3, '0')}`;
    const now = new Date().toISOString();
    const newTicket: Ticket = {
      ...ticket,
      id,
      status: TicketStatus.OPEN,
      comments: [],
      createdAt: now,
      updatedAt: now,
    };
    this.tickets.set(id, newTicket);
    return newTicket;
  }

  update(id: string, partial: Partial<Ticket>): Ticket | undefined {
    const existing = this.tickets.get(id);
    if (!existing) return undefined;

    const updated: Ticket = {
      ...existing,
      ...partial,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };

    this.tickets.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.tickets.delete(id);
  }

  getStats() {
    const all = Array.from(this.tickets.values());
    return {
      total: all.length,
      open: all.filter((t) => t.status === TicketStatus.OPEN).length,
      inProgress: all.filter((t) => t.status === TicketStatus.IN_PROGRESS).length,
      resolved: all.filter((t) => t.status === TicketStatus.RESOLVED).length,
      closed: all.filter((t) => t.status === TicketStatus.CLOSED).length,
    };
  }
}
