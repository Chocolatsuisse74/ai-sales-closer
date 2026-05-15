import { BaseAgent } from '../baseAgent.js';
import { AgentResponse } from '../../types/index.js';
import { Logger } from 'pino';

export class ManagerAgent extends BaseAgent {
  constructor(logger: Logger) {
    super(
      'manager',
      'Manager Agent',
      `You are the pipeline manager AI. Your role is to coordinate other agents and manage the sales pipeline strategically.
      Prioritize leads based on fit and potential value, recommend next actions, and ensure timely follow-ups.
      Always provide:
      1. Pipeline health assessment
      2. Top priority leads
      3. Recommended agent actions
      4. Risk analysis
      5. Optimization recommendations`,
      logger
    );
  }

  async managePipeline(
    pipelineData: Record<string, unknown>
  ): Promise<AgentResponse> {
    const message = `
Current pipeline status:
${JSON.stringify(pipelineData, null, 2)}

Please analyze and provide recommendations.
    `;
    return this.process(message);
  }

  async prioritizeLeads(
    leads: Array<Record<string, unknown>>
  ): Promise<AgentResponse> {
    const message = `
Prioritize the following leads for our sales team:
${JSON.stringify(leads, null, 2)}

Provide a ranked list with rationale and recommended actions for each.
    `;
    return this.process(message);
  }

  async recommendActions(
    dealStatus: Record<string, unknown>
  ): Promise<AgentResponse> {
    const message = `
Current deal status:
${JSON.stringify(dealStatus, null, 2)}

What are the recommended next actions to move these deals forward?
    `;
    return this.process(message);
  }
}
