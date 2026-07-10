import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { TicketStatus, TicketPriority } from './ticket.entity';
import { ConfigurableAuthGuard } from '../auth/configurable-auth.guard';

@Controller('api/tickets')
@UseGuards(ConfigurableAuthGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('status') status?: TicketStatus,
    @Query('priority') priority?: TicketPriority,
    @Query('sort') sort?: 'createdAt' | 'updatedAt' | 'priority' | 'status',
    @Query('order') order?: 'asc' | 'desc',
  ) {
    return this.ticketsService.findAll({ search, status, priority, sort, order });
  }

  @Get('stats')
  getStats() {
    return this.ticketsService.getStats();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.ticketsService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateTicketDto, @Request() req: any) {
    const reporter = req.user?.username || 'anonymous';
    return this.ticketsService.create(dto, reporter);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTicketDto) {
    return this.ticketsService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    this.ticketsService.delete(id);
    return { message: `Ticket ${id} deleted` };
  }

  @Post(':id/comments')
  addComment(@Param('id') id: string, @Body() dto: AddCommentDto) {
    return this.ticketsService.addComment(id, dto);
  }
}
