import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { InMemoryTicketRepository } from './in-memory-ticket.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [TicketsController],
  providers: [TicketsService, InMemoryTicketRepository],
  exports: [TicketsService],
})
export class TicketsModule {}
