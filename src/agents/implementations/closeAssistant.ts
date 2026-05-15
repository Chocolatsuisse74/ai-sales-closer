import { BaseAgent } from '../baseAgent.js';
import { AgentResponse } from '../../types/index.js';
import { Logger } from 'pino';

export class CloseAssistant extends BaseAgent {
  constructor(logger: Logger) {
    super(
      'close-assistant',
      'Close Assistant',
      `You are a sales closing specialist. Your role is to provide strategic guidance for closing deals.
      Help overcome objections, identify decision-maker concerns, and provide closing strategies.
      Always provide:
      1. Key objections analysis
      2. Decision-maker profile
      3. Closing strategy recommendation
      4. Sample closing statements
      5. Risk mitigation steps`,
      logger
    );
  }

  async analyzeClosingReadiness(
    dealStage: string,
    leadHistory: string,
    currentChallenges: string
  ): Promise<AgentResponse> {
    const message = `
Assess deal closing readiness:
Current Stage: ${dealStage}
Lead History: ${leadHistory}
Current Challenges: ${currentChallenges}

Provide analysis and recommended next actions.
    `;
    return this.process(message);
  }

  async provideClosingStrategy(
    dealValue: number,
    stakeholders: string,
    objections: string[]
  ): Promise<AgentResponse> {
    const message = `
Provide closing strategy for:
Deal Value: $${dealValue}
Key Stakeholders: ${stakeholders}
Remaining Objections: ${objections.join(', ')}

Create a detailed closing plan.
    `;
    return this.process(message);
  }
}
