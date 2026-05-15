# AI Sales Closer - Agents Guide

## Table of Contents

- [Agents Overview](#agents-overview)
- [Agent Architecture](#agent-architecture)
- [Available Agents](#available-agents)
- [Agent Configuration](#agent-configuration)
- [Agent Lifecycle](#agent-lifecycle)
- [Integration Patterns](#integration-patterns)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

## Agents Overview

AI Sales Closer uses a multi-agent system powered by Claude AI to automate and enhance sales processes. Each agent specializes in a specific sales function and works collaboratively to manage the entire customer journey.

### Agent Types

```
┌─────────────────────────────────────────────────────────┐
│                    Manager Agent                         │
│         (Orchestrates and coordinates all agents)        │
└────────────────────┬────────────────────────────────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
    ▼                ▼                ▼
┌─────────────┐ ┌──────────────┐ ┌─────────────────┐
│Lead         │ │Follow-up     │ │Proposal         │
│Qualifier    │ │Agent         │ │Generator        │
│             │ │              │ │                 │
│Scores &     │ │Schedules &   │ │Creates custom   │
│qualifies    │ │manages       │ │proposals        │
│leads        │ │follow-ups    │ │                 │
└─────────────┘ └──────────────┘ └─────────────────┘
    │                │                │
    └────────────────┼────────────────┘
                     │
                     ▼
         ┌──────────────────────┐
         │ Close Assistant      │
         │                      │
         │ Handles objections   │
         │ Closes deals         │
         └──────────────────────┘
```

## Agent Architecture

### BaseAgent Class

All agents inherit from the `BaseAgent` class, which provides:

```typescript
abstract class BaseAgent {
  protected client: Anthropic;          // Claude API client
  protected id: string;                 // Agent identifier
  protected name: string;               // Human-readable name
  protected systemPrompt: string;       // AI behavior definition
  protected logger: Logger;             // Structured logging
  protected conversationHistory: AgentMessage[] = [];

  abstract async process(userMessage: string): Promise<AgentResponse>;
  clearHistory(): void;
  getHistory(): AgentMessage[];
}
```

### Agent Flow

```
Request
  │
  ├─ Build conversation with history
  │
  ├─ Call Claude with system prompt
  │
  ├─ Process response
  │
  ├─ Update conversation history
  │
  └─ Return structured result
```

### Agent Response Format

```typescript
interface AgentResponse {
  agentId: string;              // Which agent responded
  message: string;              // AI response text
  action?: string;              // Action to take
  metadata?: {
    tokensUsed: TokenUsage;
    stopReason: string;
    score?: number;             // For scoring agents
    recommendation?: string;    // For recommendation agents
  };
}
```

## Available Agents

### 1. Lead Qualifier Agent

**Purpose:** Analyze and score incoming leads to prioritize sales effort.

**Responsibilities:**
- Analyze lead company profile
- Evaluate budget indicators
- Assess engagement signals
- Generate qualification score (0-1)
- Recommend next steps

**System Prompt Focus:**
```
You are an expert sales qualification AI. Your role is to:
1. Analyze lead profiles and company information
2. Assess fit with our product/service
3. Evaluate budget and timeline indicators
4. Score from 0 (poor fit) to 1 (excellent fit)
5. Provide specific reasoning for your score
```

**Input Example:**

```json
{
  "agentType": "lead-qualifier",
  "leadData": {
    "name": "Jane Smith",
    "company": "TechCorp Inc",
    "industry": "Software",
    "companySize": "500-1000",
    "budget": "$100k-200k",
    "timeline": "Q3 2024"
  }
}
```

**Output Example:**

```json
{
  "agentId": "lead-qualifier",
  "message": "Lead analysis complete",
  "metadata": {
    "score": 0.87,
    "recommendation": "qualified",
    "reasoning": "Enterprise company with identified budget, Q3 timeline aligns with our sales cycle, technology fit is excellent"
  }
}
```

**Best Practices:**
- Provide comprehensive lead information
- Include company size and industry
- Include budget and timeline indicators
- Ask for detailed reasoning

**API Usage:**

```bash
curl -X POST "http://localhost:3000/api/agents/lead-qualifier/process" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "leadId": "lead_123",
    "context": "Fortune 500 tech company, $500k annual budget, evaluating enterprise solutions"
  }'
```

### 2. Follow-Up Agent

**Purpose:** Manage intelligent lead follow-ups and engagement tracking.

**Responsibilities:**
- Schedule follow-up communications
- Personalize outreach messages
- Track engagement history
- Identify optimal contact timing
- Escalate unresponsive leads

**System Prompt Focus:**
```
You are a sales follow-up specialist. Your role is to:
1. Schedule strategic follow-ups based on engagement
2. Personalize messages based on lead history
3. Identify optimal contact timing
4. Track response patterns
5. Recommend follow-up strategies
```

**Input Example:**

```json
{
  "agentType": "follow-up",
  "leadData": {
    "leadId": "lead_123",
    "lastContact": "2024-05-10",
    "contactsCount": 2,
    "responseRate": "50%",
    "lastMessage": "Interested in demo"
  }
}
```

**Output Example:**

```json
{
  "agentId": "follow-up",
  "action": "schedule_followup",
  "message": "Follow-up scheduled",
  "metadata": {
    "followupDate": "2024-05-17T10:00:00Z",
    "template": "follow_up_after_demo_interest",
    "recommendation": "Send detailed product comparison document with ROI calculator"
  }
}
```

**Follow-Up Strategies:**
- **Immediate (0-1 day):** Hot leads showing interest
- **Short-term (2-3 days):** Interested but needs more info
- **Medium-term (1 week):** Evaluating options
- **Long-term (2+ weeks):** Early-stage prospects

**API Usage:**

```bash
curl -X POST "http://localhost:3000/api/agents/follow-up/process" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "leadId": "lead_123",
    "context": "Lead expressed interest in demo 3 days ago, hasn'\''t responded to initial follow-up"
  }'
```

### 3. Proposal Generator Agent

**Purpose:** Create customized, compelling proposals tailored to each prospect.

**Responsibilities:**
- Generate proposal documents
- Customize based on prospect needs
- Include relevant case studies
- Incorporate pricing information
- Suggest contract terms

**System Prompt Focus:**
```
You are an expert proposal writer. Your role is to:
1. Create compelling, customized proposals
2. Address specific prospect pain points
3. Highlight relevant case studies
4. Include clear pricing and ROI
5. Suggest contract terms and next steps
```

**Input Example:**

```json
{
  "agentType": "proposal-generator",
  "leadData": {
    "leadId": "lead_123",
    "company": "TechCorp Inc",
    "painPoints": ["scalability", "integration", "cost reduction"],
    "budget": "$150,000",
    "timeline": "Q3 2024"
  }
}
```

**Output Example:**

```json
{
  "agentId": "proposal-generator",
  "action": "generate_proposal",
  "message": "Proposal generated successfully",
  "metadata": {
    "proposalId": "prop_456",
    "sections": [
      "Executive Summary",
      "Current Challenges",
      "Proposed Solution",
      "Implementation Timeline",
      "Pricing & ROI",
      "Case Studies",
      "Contract Terms"
    ],
    "estimatedValue": "$150,000",
    "suggestedFollowup": "Schedule walkthrough call in 24 hours"
  }
}
```

**Proposal Elements:**
1. Executive Summary (1 page)
2. Current Situation Analysis
3. Proposed Solution
4. Implementation Timeline
5. Pricing Breakdown
6. ROI Calculation
7. Relevant Case Studies
8. Team Credentials
9. Contract Terms
10. Next Steps

**API Usage:**

```bash
curl -X POST "http://localhost:3000/api/agents/proposal-generator/process" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "leadId": "lead_123",
    "dealId": "deal_456",
    "context": "Enterprise package, emphasis on scalability and integration, $150k budget"
  }'
```

### 4. Close Assistant Agent

**Purpose:** Help overcome objections and close deals.

**Responsibilities:**
- Identify common objections
- Suggest objection handling strategies
- Prepare closing arguments
- Recommend contract negotiation tactics
- Escalate complex situations

**System Prompt Focus:**
```
You are an expert sales closer. Your role is to:
1. Identify and categorize objections
2. Suggest data-driven responses
3. Prepare closing arguments
4. Recommend negotiation strategies
5. Identify deal-breakers vs. solvable issues
```

**Input Example:**

```json
{
  "agentType": "close-assistant",
  "leadData": {
    "leadId": "lead_123",
    "dealStage": "negotiation",
    "objection": "Your price is 20% higher than competitor X"
  }
}
```

**Output Example:**

```json
{
  "agentId": "close-assistant",
  "action": "handle_objection",
  "message": "Objection handling strategy provided",
  "metadata": {
    "objectionType": "price",
    "severity": "medium",
    "response": "Our platform includes enterprise support, custom integrations, and guaranteed uptime that competitor X doesn't offer. The ROI difference amounts to $500k annually.",
    "closingStrategy": "Schedule economics review with their CFO",
    "alternativeTerms": [
      "Three-year commitment for 10% discount",
      "Phased implementation reducing initial investment",
      "Success-based pricing model"
    ]
  }
}
```

**Common Objections:**
- **Price:** Cost too high relative to budget
- **Timing:** Not ready now, want to revisit later
- **Competitor:** Comparing with alternative solutions
- **Need:** Questioning if they actually need the solution
- **Internal:** Lack of internal buy-in

**API Usage:**

```bash
curl -X POST "http://localhost:3000/api/agents/close-assistant/process" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "leadId": "lead_123",
    "objection": "Your platform is missing feature X that we need"
  }'
```

### 5. Manager Agent

**Purpose:** Orchestrate all other agents and manage the sales workflow.

**Responsibilities:**
- Route leads to appropriate agents
- Coordinate agent workflows
- Track overall pipeline health
- Escalate issues requiring human intervention
- Generate pipeline reports

**System Prompt Focus:**
```
You are the sales operations manager. Your role is to:
1. Route leads to appropriate agents
2. Coordinate multi-agent workflows
3. Escalate complex situations
4. Maintain pipeline health
5. Generate actionable insights
```

**Agent Orchestration Example:**

```
New Lead
  │
  └─→ Manager Agent
       │
       ├─→ Route to Lead Qualifier
       │   │
       │   ├─→ Score: 0.87 (Qualified)
       │   │
       │   └─→ Create Deal
       │
       ├─→ Assign to Follow-Up Agent
       │   │
       │   └─→ Schedule initial outreach
       │
       ├─→ (If qualified) Route to Proposal Generator
       │   │
       │   └─→ Generate custom proposal
       │
       └─→ Monitor and escalate as needed
```

**API Usage:**

```bash
curl -X POST "http://localhost:3000/api/agents/manager/orchestrate" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "leadId": "lead_123",
    "action": "process_new_lead",
    "context": "New lead from conference, enterprise prospect"
  }'
```

## Agent Configuration

### Agent Configuration File

Agents are configured in `src/config/agents.json`:

```json
{
  "agents": {
    "lead_qualifier": {
      "enabled": true,
      "model": "claude-opus-4-1",
      "temperature": 0.7,
      "maxTokens": 1024,
      "systemPrompt": "You are an expert sales qualification AI...",
      "rules": {
        "minQualificationScore": 0.6,
        "autoQualifyAboveScore": 0.85
      }
    },
    "follow_up": {
      "enabled": true,
      "schedule": "dynamic",
      "templates": [
        "initial_outreach",
        "follow_up_after_demo_interest",
        "re_engagement"
      ],
      "rules": {
        "maxFollowUpsPerWeek": 3,
        "minDaysBetweenFollowUps": 1
      }
    },
    "proposal_generator": {
      "enabled": true,
      "model": "claude-opus-4-1",
      "temperature": 0.5,
      "includeRoi": true,
      "includeCaseStudies": true,
      "rules": {
        "generateForScoreAbove": 0.75
      }
    },
    "close_assistant": {
      "enabled": true,
      "objectionTypes": [
        "price",
        "timing",
        "competitor",
        "need",
        "internal"
      ],
      "rules": {
        "escalateAfterObjections": 3
      }
    },
    "manager": {
      "enabled": true,
      "orchestration": "sequential",
      "rules": {
        "escalateUndefinedCases": true,
        "generateReportsDaily": true
      }
    }
  }
}
```

### Environment Configuration

Set agent behavior via environment variables:

```bash
# Agent Model
AGENT_MODEL=claude-opus-4-1

# Temperature (creativity vs consistency)
AGENT_TEMPERATURE=0.7

# API Configuration
ANTHROPIC_API_KEY=your_key_here

# Logging
LOG_LEVEL=info
```

## Agent Lifecycle

### Agent Initialization

```
Server Startup
  │
  ├─ Load configuration
  │
  ├─ Initialize Anthropic client
  │
  ├─ Create agent instances
  │
  ├─ Validate system prompts
  │
  └─ Ready to process requests
```

### Request Processing Lifecycle

```
1. Request Received
   │
   ├─ Validate input
   ├─ Check agent availability
   │
2. Prepare Message
   │
   ├─ Load conversation history
   ├─ Build message with context
   │
3. Process with Claude
   │
   ├─ Send to Claude API
   ├─ Wait for response
   │
4. Process Response
   │
   ├─ Parse response
   ├─ Extract action/score
   │
5. Update State
   │
   ├─ Store conversation history
   ├─ Log activity
   ├─ Update lead/deal status
   │
6. Return Result
   │
   └─ Send response to client
```

### Conversation History Management

Each agent maintains conversation history for context:

```typescript
const history = [
  {
    role: 'user',
    content: 'Initial lead qualification request'
  },
  {
    role: 'assistant',
    content: 'Lead analysis and score...'
  },
  {
    role: 'user',
    content: 'Follow-up with more information'
  },
  {
    role: 'assistant',
    content: 'Updated analysis...'
  }
];
```

**History Operations:**

```typescript
// Clear history between different lead sessions
agent.clearHistory();

// Retrieve conversation history
const history = agent.getHistory();

// History persists within a session
// Useful for multi-turn conversations
```

## Integration Patterns

### Pattern 1: Sequential Agent Workflow

Process leads through agents in sequence:

```typescript
async function qualifyAndCreateDeal(leadId: string) {
  const lead = await database.getLead(leadId);

  // Step 1: Qualify
  const qualifyAgent = orchestrator.getAgent('lead-qualifier');
  const qualification = await qualifyAgent.process(buildQualifyMessage(lead));

  if (qualification.metadata?.score > 0.75) {
    // Step 2: Create Deal
    const deal = await database.createDeal(leadId, {
      amount: estimateDealValue(lead),
      stage: 'discovery'
    });

    // Step 3: Generate Proposal
    const proposalAgent = orchestrator.getAgent('proposal-generator');
    const proposal = await proposalAgent.process(
      buildProposalMessage(lead, deal)
    );

    return { lead, deal, proposal };
  }
}
```

### Pattern 2: Parallel Agent Processing

Process with multiple agents in parallel:

```typescript
async function analyzeLeadComprehensively(leadId: string) {
  const lead = await database.getLead(leadId);

  const [qualification, followUpStrategy] = await Promise.all([
    orchestrator.getAgent('lead-qualifier').process(buildMessage(lead)),
    orchestrator.getAgent('follow-up').process(buildFollowUpMessage(lead))
  ]);

  return {
    qualification,
    followUpStrategy,
    combinedInsights: combineResults([qualification, followUpStrategy])
  };
}
```

### Pattern 3: Conditional Routing

Route based on lead characteristics:

```typescript
async function routeLead(leadId: string) {
  const lead = await database.getLead(leadId);
  const manager = orchestrator.getAgent('manager');

  const routing = await manager.process(
    `Route this lead: ${JSON.stringify(lead)}`
  );

  switch (routing.metadata?.recommendedAgent) {
    case 'hot-lead':
      return handleHotLead(lead);
    case 'nurture':
      return handleNurtureLead(lead);
    case 'escalate':
      return escalateToHuman(lead);
  }
}
```

## Examples

### Example 1: Complete Lead Qualification Workflow

```typescript
import { AgentOrchestrator } from './src/agents/index.js';
import { logger } from './src/utils/logger.js';

async function processNewLead(leadData: any) {
  const orchestrator = new AgentOrchestrator();

  // Get agents
  const qualifierAgent = orchestrator.getAgent('lead-qualifier');
  const followerAgent = orchestrator.getAgent('follow-up');
  const managerAgent = orchestrator.getAgent('manager');

  logger.info(`Processing new lead: ${leadData.name}`);

  // Step 1: Initial qualification
  const qualificationResult = await qualifierAgent.process(
    `Analyze this lead for qualification:
    Name: ${leadData.name}
    Company: ${leadData.company}
    Industry: ${leadData.industry}
    Budget: ${leadData.budget}
    Timeline: ${leadData.timeline}`
  );

  const score = qualificationResult.metadata?.score || 0;
  logger.info(`Lead qualification score: ${score}`);

  if (score > 0.7) {
    // Step 2: Plan follow-up
    const followUpResult = await followerAgent.process(
      `Plan follow-up for qualified lead: ${leadData.name}
      Qualification score: ${score}
      Previous interactions: ${leadData.previousInteractions}`
    );

    // Step 3: Orchestrate workflow
    const orchestrationResult = await managerAgent.process(
      `Orchestrate workflow for qualified lead ${leadData.name}
      Next step: ${followUpResult.metadata?.recommendedFollowup}`
    );

    return {
      leadId: leadData.id,
      score,
      qualification: qualificationResult,
      followUp: followUpResult,
      orchestration: orchestrationResult,
      status: 'qualified'
    };
  }

  return {
    leadId: leadData.id,
    score,
    status: 'not_qualified'
  };
}
```

### Example 2: Handling Sales Objections

```typescript
async function handleObjection(leadId: string, objection: string) {
  const orchestrator = new AgentOrchestrator();
  const closeAssistant = orchestrator.getAgent('close-assistant');

  logger.info(`Handling objection for lead ${leadId}: "${objection}"`);

  const response = await closeAssistant.process(
    `Handle this objection from a prospect:
    Objection: "${objection}"
    
    Provide:
    1. Categorization of the objection
    2. Data-driven response
    3. Alternative solutions
    4. Closing strategy`
  );

  logger.info(`Close assistant response:`, response);

  return {
    leadId,
    objection,
    response: response.message,
    strategy: response.metadata?.closingStrategy,
    alternatives: response.metadata?.alternativeTerms
  };
}
```

### Example 3: Agent Management and Monitoring

```typescript
async function monitorAgents() {
  const orchestrator = new AgentOrchestrator();

  logger.info('Agent Status Report:');

  for (const [agentId, agent] of orchestrator.getAllAgents()) {
    const status = await agent.process('What is your current status?');

    logger.info(`
      Agent: ${agentId}
      Status: ${status.metadata?.status || 'active'}
      Last Activity: ${status.metadata?.lastActivity}
    `);
  }

  return orchestrator.listAgents();
}
```

## Troubleshooting

### Agent Not Responding

**Problem:** Agent returns empty or error response

**Solutions:**
1. Check API key is valid and has sufficient quota
2. Verify system prompt is properly formatted
3. Check conversation history isn't corrupted
4. Clear history and retry: `agent.clearHistory()`

### Inconsistent Agent Behavior

**Problem:** Agent gives different responses for similar inputs

**Solutions:**
1. Temperature setting too high - reduce for consistency
2. System prompt is ambiguous - clarify instructions
3. Add more context to user message
4. Use explicit output format requirements

### High Token Usage

**Problem:** Agent consuming too many tokens

**Solutions:**
1. Reduce conversation history length
2. Simplify context provided to agent
3. Use shorter system prompt
4. Clear history between unrelated requests

### Agent Timeouts

**Problem:** Agent requests timing out

**Solutions:**
1. Increase timeout in configuration
2. Reduce request complexity
3. Check API rate limits aren't exceeded
4. Verify network connectivity

### Agent Queue Buildup

**Problem:** Too many requests queued

**Solutions:**
1. Implement rate limiting on incoming requests
2. Use agent pools for parallel processing
3. Add request prioritization
4. Monitor and alert on queue depth
