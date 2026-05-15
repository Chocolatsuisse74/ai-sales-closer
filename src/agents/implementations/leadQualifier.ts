import { BaseAgent } from '../baseAgent.js';
import { Lead, AgentResponse } from '../../types/index.js';
import { Logger } from 'pino';

export class LeadQualifier extends BaseAgent {
  constructor(logger: Logger) {
    super(
      'lead-qualifier',
      'Lead Qualifier Agent',
      `You are an expert lead qualification AI. Your role is to analyze potential leads and assess their fit for our solutions.
      Evaluate based on: company size, industry, budget indicators, decision-making authority, timeline, and demonstrated interest.
      Provide a qualification score from 0-100 and recommend next steps.
      Always respond with:
      1. Qualification score
      2. Key strengths
      3. Potential risks
      4. Recommended next action`,
      logger
    );
  }

  async qualifyLead(lead: Lead): Promise<AgentResponse> {
    const leadInfo = `
Lead Name: ${lead.name}
Company: ${lead.company}
Email: ${lead.email}
Notes: ${lead.notes}
Current Status: ${lead.status}
    `;

    return this.process(leadInfo);
  }

  async analyzeLead(leadData: Record<string, unknown>): Promise<AgentResponse> {
    const message = JSON.stringify(leadData, null, 2);
    return this.process(`Please analyze this lead data:\n${message}`);
  }
}
