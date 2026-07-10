import { Injectable, NotFoundException } from '@nestjs/common';
import { InMemoryTicketRepository } from './in-memory-ticket.repository';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { Ticket, TicketStatus } from './ticket.entity';
import { TicketQueryParams } from './ticket.repository.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TicketsService {
  constructor(private readonly repo: InMemoryTicketRepository) {}

  findAll(query?: TicketQueryParams): Ticket[] {
    return this.repo.findAll(query);
  }

  findById(id: string): Ticket {
    const ticket = this.repo.findById(id);
    if (!ticket) {
      throw new NotFoundException(`Ticket ${id} not found`);
    }
    return ticket;
  }

  create(dto: CreateTicketDto, reporter: string): Ticket {
    const ticket: Ticket = {
      id: '',
      title: dto.title,
      description: dto.description,
      status: TicketStatus.OPEN,
      priority: dto.priority,
      assignee: dto.assignee || 'unassigned',
      reporter,
      tags: dto.tags || [],
      comments: [],
      createdAt: '',
      updatedAt: '',
    };
    return this.repo.create(ticket);
  }

  update(id: string, dto: UpdateTicketDto): Ticket {
    const updated = this.repo.update(id, dto);
    if (!updated) {
      throw new NotFoundException(`Ticket ${id} not found`);
    }
    return updated;
  }

  delete(id: string): void {
    const success = this.repo.delete(id);
    if (!success) {
      throw new NotFoundException(`Ticket ${id} not found`);
    }
  }

  addComment(ticketId: string, dto: AddCommentDto): Ticket {
    const ticket = this.findById(ticketId);
    const comment = {
      id: uuidv4(),
      author: dto.author,
      content: dto.content,
      createdAt: new Date().toISOString(),
    };
    ticket.comments.push(comment);
    return this.repo.update(ticketId, { comments: ticket.comments })!;
  }

  getStats() {
    return this.repo.getStats();
  }
}
