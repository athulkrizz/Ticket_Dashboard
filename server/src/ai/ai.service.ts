import { Injectable } from '@nestjs/common';

export interface AiResponse {
  reply: string;
  suggestions?: string[];
}

@Injectable()
export class AiService {
  private readonly responses: { keywords: string[]; reply: string; suggestions?: string[] }[] = [
    {
      keywords: ['summarize', 'summary', 'overview', 'what is this'],
      reply: 'Based on my analysis of this ticket, here\'s a summary:\n\n• **Issue**: The ticket describes a reported problem or feature request that needs attention.\n• **Impact**: This affects the user experience and should be addressed based on its priority level.\n• **Recommendation**: Review the comments for context, check if similar issues have been resolved before, and assign to the appropriate team member.',
      suggestions: ['Check related tickets', 'Review recent changes', 'Escalate if critical'],
    },
    {
      keywords: ['priority', 'prioritize', 'urgent', 'importance'],
      reply: 'Here\'s my priority assessment:\n\n🔴 **Critical** — Assign immediately if it affects production systems or blocks multiple users.\n🟠 **High** — Schedule for the current sprint. Has significant user impact.\n🟡 **Medium** — Plan for the next sprint. Important but not time-sensitive.\n🔵 **Low** — Add to backlog. Nice to have, minimal impact.\n\nConsider the number of affected users, business impact, and available workarounds when prioritizing.',
      suggestions: ['Escalate to team lead', 'Check SLA requirements', 'Review user impact'],
    },
    {
      keywords: ['assign', 'who', 'team', 'responsible'],
      reply: 'For ticket assignment, consider:\n\n👤 **john.doe** — Backend specialist. Best for API, database, and infrastructure issues.\n👤 **jane.smith** — Security & auth expert. Ideal for authentication, encryption, and security-related tickets.\n👤 **alice.wong** — Frontend & UX specialist. Perfect for UI bugs, accessibility, and design tasks.\n\nAssign based on expertise match and current workload balance.',
      suggestions: ['Check team workload', 'View assignee history', 'Balance assignments'],
    },
    {
      keywords: ['fix', 'solve', 'solution', 'resolve', 'how to'],
      reply: 'Here\'s a suggested approach to resolving this:\n\n1. **Reproduce** — Confirm the issue in a test environment\n2. **Root Cause** — Check logs, recent changes, and related components\n3. **Implement** — Create a fix with proper error handling\n4. **Test** — Verify the fix doesn\'t introduce regressions\n5. **Deploy** — Roll out to staging first, then production\n\nAlways update the ticket with your findings as you progress.',
      suggestions: ['Create a test case', 'Check git blame', 'Review recent deployments'],
    },
    {
      keywords: ['draft', 'reply', 'respond', 'response', 'message'],
      reply: 'Here\'s a draft response you can customize:\n\n---\n\n*Thank you for reporting this issue. We\'ve reviewed the details and our team is actively working on a resolution.*\n\n*We\'ve identified the root cause and are implementing a fix. You can expect an update within the next 24-48 hours.*\n\n*In the meantime, please let us know if you experience any additional issues or if there are any workarounds that would be helpful.*\n\n---\n\nFeel free to adjust the tone and timeline based on the specific situation.',
      suggestions: ['Personalize the response', 'Add specific timeline', 'Include workaround'],
    },
    {
      keywords: ['status', 'update', 'progress', 'track'],
      reply: 'Here\'s a status tracking guide:\n\n📋 **Open** → Ticket is acknowledged but work hasn\'t started\n🔄 **In Progress** → Active development or investigation underway\n✅ **Resolved** → Fix implemented and verified\n🔒 **Closed** → Resolution confirmed by reporter/stakeholder\n\nBest practice: Update the status promptly and add a comment explaining each transition.',
      suggestions: ['Update status now', 'Add progress comment', 'Set a due date'],
    },
    {
      keywords: ['report', 'analytics', 'metrics', 'data'],
      reply: 'Key metrics to track for your ticket workflow:\n\n📊 **Average Resolution Time** — How long tickets take from open to resolved\n📊 **First Response Time** — Time from creation to first comment\n📊 **Ticket Volume Trends** — Weekly/monthly ticket counts by category\n📊 **SLA Compliance Rate** — Percentage of tickets resolved within SLA\n\nRegularly reviewing these metrics helps identify bottlenecks and improve team efficiency.',
      suggestions: ['Export ticket data', 'View SLA report', 'Check team performance'],
    },
  ];

  async chat(message: string, ticketContext?: any): Promise<AiResponse> {
    // Simulate AI processing delay
    await this.delay(800 + Math.random() * 700);

    const lowerMessage = message.toLowerCase();

    // Find the best matching response
    for (const entry of this.responses) {
      if (entry.keywords.some((kw) => lowerMessage.includes(kw))) {
        let reply = entry.reply;

        // Add ticket context if available
        if (ticketContext) {
          reply = `Regarding ticket **${ticketContext.id}** ("${ticketContext.title}"):\n\n${reply}`;
        }

        return { reply, suggestions: entry.suggestions };
      }
    }

    // Default fallback response
    let fallback = `I understand you're asking about: "${message}"\n\nHere are some things I can help you with:\n\n• **Summarize** a ticket's details and context\n• **Prioritize** tickets based on impact and urgency\n• **Suggest assignments** based on team expertise\n• **Draft responses** for ticket updates\n• **Recommend solutions** for common issue types\n\nTry asking me something more specific!`;

    if (ticketContext) {
      fallback = `Regarding ticket **${ticketContext.id}** ("${ticketContext.title}"):\n\n${fallback}`;
    }

    return {
      reply: fallback,
      suggestions: ['Summarize this ticket', 'Suggest priority', 'Draft a reply'],
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
