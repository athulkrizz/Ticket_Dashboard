import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AIMessage } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AiAssistantService {
  private readonly apiUrl = `${environment.apiUrl}/api/ai`;

  messages = signal<AIMessage[]>([]);
  isTyping = signal(false);
  isOpen = signal(false);

  constructor(private http: HttpClient) {}

  toggle() {
    this.isOpen.update((v) => !v);
  }

  open() {
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
  }

  sendMessage(content: string, ticketContext?: any) {
    const userMessage: AIMessage = {
      role: 'user',
      content,
      timestamp: new Date(),
    };

    this.messages.update((msgs) => [...msgs, userMessage]);
    this.isTyping.set(true);

    this.http
      .post<{ reply: string; suggestions?: string[] }>(`${this.apiUrl}/chat`, {
        message: content,
        ticketContext,
      })
      .subscribe({
        next: (response) => {
          const assistantMessage: AIMessage = {
            role: 'assistant',
            content: response.reply,
            timestamp: new Date(),
            suggestions: response.suggestions,
          };
          this.messages.update((msgs) => [...msgs, assistantMessage]);
          this.isTyping.set(false);
        },
        error: () => {
          const errorMessage: AIMessage = {
            role: 'assistant',
            content: 'Sorry, I encountered an error. Please try again.',
            timestamp: new Date(),
          };
          this.messages.update((msgs) => [...msgs, errorMessage]);
          this.isTyping.set(false);
        },
      });
  }

  clearMessages() {
    this.messages.set([]);
  }
}
