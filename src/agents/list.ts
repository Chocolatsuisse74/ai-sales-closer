import { AgentOrchestrator } from './index.js';
import { logger } from '../utils/logger.js';

const orchestrator = new AgentOrchestrator();
const agents = orchestrator.listAgents();

logger.info('Available Agents:');
agents.forEach((agentId) => {
  logger.info(`  - ${agentId}`);
});
