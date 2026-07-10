import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ChipModule } from 'primeng/chip';
import { AiAssistantService } from '../../../core/services/ai-assistant.service';
import { Ticket } from '../../../core/models/ticket.model';

@Component({
  selector: 'app-ai-chat-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, DrawerModule, ButtonModule, InputTextModule, ChipModule],
  template: `
    <p-drawer
      [(visible)]="aiService.isOpen"
      position="right"
      [modal]="true"
      styleClass="ai-drawer"
      [style]="{ width: '400px' }"
    >
      <ng-template #header>
        <div class="ai-header">
          <div class="ai-header-title">
            <i class="pi pi-sparkles"></i>
            <span>AI Assistant</span>
          </div>
          <button pButton [text]="true" [rounded]="true" icon="pi pi-trash"
                  (click)="aiService.clearMessages()" severity="secondary"
                  pTooltip="Clear conversation"></button>
        </div>
      </ng-template>

      <div class="chat-container">
        @if (aiService.messages().length === 0) {
          <div class="empty-state">
            <i class="pi pi-sparkles empty-icon"></i>
            <h3>How can I help?</h3>
            <p>Ask me about tickets, priorities, assignments, or get help drafting responses.</p>
            <div class="quick-prompts">
              @for (prompt of quickPrompts; track prompt) {
                <p-chip
                  [label]="prompt"
                  styleClass="quick-chip"
                  (click)="sendQuickPrompt(prompt)"
                />
              }
            </div>
          </div>
        } @else {
          <div class="messages">
            @for (msg of aiService.messages(); track msg.timestamp) {
              <div class="message" [class]="msg.role">
                <div class="message-avatar">
                  @if (msg.role === 'assistant') {
                    <i class="pi pi-sparkles"></i>
                  } @else {
                    <i class="pi pi-user"></i>
                  }
                </div>
                <div class="message-content">
                  <div class="message-text" [innerHTML]="formatMessage(msg.content)"></div>
                  @if (msg.suggestions && msg.suggestions.length > 0) {
                    <div class="suggestions">
                      @for (s of msg.suggestions; track s) {
                        <p-chip [label]="s" styleClass="suggestion-chip" (click)="sendQuickPrompt(s)" />
                      }
                    </div>
                  }
                </div>
              </div>
            }

            @if (aiService.isTyping()) {
              <div class="message assistant">
                <div class="message-avatar">
                  <i class="pi pi-sparkles"></i>
                </div>
                <div class="message-content">
                  <div class="typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>

      <ng-template #footer>
        <div class="chat-input-area">
          <input
            pInputText
            [(ngModel)]="userInput"
            placeholder="Ask something..."
            (keydown.enter)="send()"
            class="chat-input"
          />
          <button pButton icon="pi pi-send" [rounded]="true" (click)="send()"
                  [disabled]="!userInput.trim() || aiService.isTyping()"></button>
        </div>
      </ng-template>
    </p-drawer>
  `,
  styles: [`
    .ai-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }

    .ai-header-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 700;
      font-size: 1.1rem;
    }

    .ai-header-title .pi-sparkles {
      color: var(--primary-color);
      font-size: 1.25rem;
    }

    .chat-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow-y: auto;
      padding: 0.5rem 0;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2rem 1rem;
      flex: 1;
    }

    .empty-icon {
      font-size: 3rem;
      color: var(--primary-color);
      margin-bottom: 1rem;
      animation: sparkle 2s ease-in-out infinite;
    }

    .empty-state h3 {
      margin: 0 0 0.5rem;
      font-size: 1.25rem;
      color: var(--text-color);
    }

    .empty-state p {
      margin: 0 0 1.5rem;
      color: var(--text-color-secondary);
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .quick-prompts, .suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: center;
    }

    :host ::ng-deep .quick-chip, :host ::ng-deep .suggestion-chip {
      cursor: pointer;
      transition: transform 0.15s, box-shadow 0.15s;
      font-size: 0.8rem;
    }

    :host ::ng-deep .quick-chip:hover, :host ::ng-deep .suggestion-chip:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(108, 99, 255, 0.3);
    }

    .messages {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 0.5rem;
    }

    .message {
      display: flex;
      gap: 0.75rem;
      align-items: flex-start;
    }

    .message-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 0.85rem;
    }

    .message.assistant .message-avatar {
      background: linear-gradient(135deg, var(--primary-color), #a78bfa);
      color: white;
    }

    .message.user .message-avatar {
      background: var(--surface-200);
      color: var(--text-color);
    }

    .message-content {
      flex: 1;
      min-width: 0;
    }

    .message-text {
      background: var(--surface-100);
      border-radius: 12px;
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
      line-height: 1.6;
      color: var(--text-color);
    }

    .message.user .message-text {
      background: var(--primary-color);
      color: white;
      border-radius: 12px 12px 2px 12px;
    }

    .message.assistant .message-text {
      border-radius: 12px 12px 12px 2px;
    }

    .suggestions {
      margin-top: 0.5rem;
      justify-content: flex-start;
    }

    .typing-indicator {
      display: flex;
      gap: 4px;
      padding: 0.75rem 1rem;
      background: var(--surface-100);
      border-radius: 12px;
      width: fit-content;
    }

    .typing-indicator span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--text-color-secondary);
      animation: bounce 1.4s infinite ease-in-out;
    }

    .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
    .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }

    @keyframes sparkle {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(1.1); }
    }

    .chat-input-area {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      width: 100%;
    }

    .chat-input {
      flex: 1;
      border-radius: 2rem !important;
    }
  `],
})
export class AiChatPanelComponent {
  ticketContext = input<Ticket | null>(null);
  userInput = '';

  quickPrompts = [
    'Summarize this ticket',
    'Suggest priority',
    'Draft a reply',
    'How to resolve this?',
  ];

  constructor(public aiService: AiAssistantService) {}

  send() {
    const msg = this.userInput.trim();
    if (!msg) return;
    this.userInput = '';
    this.aiService.sendMessage(msg, this.ticketContext());
  }

  sendQuickPrompt(prompt: string) {
    this.aiService.sendMessage(prompt, this.ticketContext());
  }

  formatMessage(text: string): string {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>')
      .replace(/• /g, '&bull; ');
  }
}
