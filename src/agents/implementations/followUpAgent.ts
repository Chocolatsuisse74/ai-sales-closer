import { BaseAgent } from '../baseAgent.js';
import { AgentResponse } from '../../types/index.js';
import { Logger } from 'pino';

export class FollowUpAgent extends BaseAgent {
  constructor(logger: Logger) {
    super(
      'follow-up',
      'Follow-up Agent',
      `You are a professional follow-up specialist. Your role is to craft personalized, value-driven follow-up messages.
      Consider: the lead's previous interactions, their industry, company size, and any objections mentioned.
      Create messages that build rapport, remind them of the offering, and move deals forward.
      Always provide:
      1. Personalized follow-up message
      2. Best time to send
      3. Suggested next touch point
      4. Success metrics to track`,
      logger
    );
  }

  async generateFollowUp(
    leadName: string,
    company: string,
    previousInteraction: string,
    daysSinceLast: number
  ): Promise<AgentResponse> {
    const message = `
Please generate a follow-up message for:
Lead: ${leadName}
Company: ${company}
Previous Interaction: ${previousInteraction}
Days Since Last Contact: ${daysSinceLast}

Create a personalized follow-up that maintains momentum.
    `;
    return this.process(message);
  }

  async handleObjection(
    objection: string,
    leadContext: string
  ): Promise<AgentResponse> {
    const message = `
A prospect has raised the following objection: "${objection}"

Lead Context: ${leadContext}

Please provide:
1. Analysis of the objection
2. Counter-arguments
3. Proposed response message
    `;
    return this.process(message);
  }
}
