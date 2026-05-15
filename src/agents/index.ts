import { LeadQualifier } from './implementations/leadQualifier.js';
import { FollowUpAgent } from './implementations/followUpAgent.js';
import { ProposalGenerator } from './implementations/proposalGenerator.js';
import { CloseAssistant } from './implementations/closeAssistant.js';
import { ManagerAgent } from './implementations/managerAgent.js';
import { BaseAgent } from './baseAgent.js';
import { logger } from '../utils/logger.js';

export class AgentOrchestrator {
  private agents: Map<string, BaseAgent> = new Map();

  constructor() {
    this.initializeAgents();
  }

  private initializeAgents(): void {
    this.agents.set('lead-qualifier', new LeadQualifier(logger));
    this.agents.set('follow-up', new FollowUpAgent(logger));
    this.agents.set('proposal-generator', new ProposalGenerator(logger));
    this.agents.set('close-assistant', new CloseAssistant(logger));
    this.agents.set('manager', new ManagerAgent(logger));

    logger.info(`Initialized ${this.agents.size} agents`);
  }

  getAgent(agentId: string): BaseAgent | undefined {
    return this.agents.get(agentId);
  }

  getAllAgents(): Map<string, BaseAgent> {
    return this.agents;
  }

  listAgents(): string[] {
    return Array.from(this.agents.keys());
  }
}

export {
  LeadQualifier,
  FollowUpAgent,
  ProposalGenerator,
  CloseAssistant,
  ManagerAgent,
};
