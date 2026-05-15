import { BaseAgent } from '../baseAgent.js';
import { AgentResponse } from '../../types/index.js';
import { Logger } from 'pino';

export class ProposalGenerator extends BaseAgent {
  constructor(logger: Logger) {
    super(
      'proposal-generator',
      'Proposal Generator',
      `You are a proposal writing expert. Your role is to generate compelling, customized proposals.
      Address the prospect's pain points, demonstrate clear ROI, and include implementation timeline.
      Always provide:
      1. Executive Summary
      2. Problem Statement
      3. Proposed Solution
      4. Implementation Plan
      5. Pricing & Terms
      6. ROI Projection
      7. Next Steps`,
      logger
    );
  }

  async generateProposal(
    leadName: string,
    company: string,
    painPoints: string[],
    budget: number,
    timeline: string
  ): Promise<AgentResponse> {
    const message = `
Generate a proposal for:
Lead: ${leadName}
Company: ${company}
Pain Points: ${painPoints.join(', ')}
Budget Range: $${budget}
Timeline: ${timeline}

Create a comprehensive, professional proposal.
    `;
    return this.process(message);
  }

  async customizeProposal(
    baseProposal: string,
    specificRequirements: string
  ): Promise<AgentResponse> {
    const message = `
Current Proposal:
${baseProposal}

Please customize this proposal based on these specific requirements:
${specificRequirements}

Maintain the structure but adapt the details to match the requirements.
    `;
    return this.process(message);
  }
}
