export interface Lead {
  id: string;
  email: string;
  name: string;
  company: string;
  status: 'new' | 'qualified' | 'engaged' | 'proposal' | 'closed' | 'lost';
  score: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Deal {
  id: string;
  leadId: string;
  amount: number;
  stage: 'discovery' | 'proposal' | 'negotiation' | 'closing' | 'won' | 'lost';
  expectedClosureDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Agent {
  id: string;
  type: 'lead-qualifier' | 'follow-up' | 'proposal-generator' | 'close-assistant' | 'manager';
  name: string;
  description: string;
  status: 'active' | 'inactive';
}

export interface AgentMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AgentResponse {
  agentId: string;
  message: string;
  action?: string;
  metadata?: Record<string, unknown>;
}
