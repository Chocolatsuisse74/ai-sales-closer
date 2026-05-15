# Architecture - AI Sales Closer

Technical architecture, design patterns, and system design decisions for AI Sales Closer.

## Table of Contents

- [System Overview](#system-overview)
- [Architecture Diagram](#architecture-diagram)
- [Core Components](#core-components)
- [Agent System](#agent-system)
- [Data Flow](#data-flow)
- [Design Patterns](#design-patterns)
- [Technology Stack](#technology-stack)
- [Scalability Considerations](#scalability-considerations)

---

## System Overview

AI Sales Closer is built with a layered architecture following clean code principles:

```
┌─────────────────────────────────────────────────┐
│              Client Applications                │
│         (Web, Mobile, Third-party APIs)        │
└────────────────────┬────────────────────────────┘
                     │
┌─────────────────────┴────────────────────────────┐
│             Express API Layer                    │
│    (/api/leads, /api/deals, /api/agents)        │
└─────────────────────┬────────────────────────────┘
                     │
┌─────────────────────┴────────────────────────────┐
│        Business Logic & Services Layer           │
│  (Agent Orchestration, Lead Management, etc)    │
└─────────────────────┬────────────────────────────┘
                     │
┌─────────────────────┴────────────────────────────┐
│     AI Agent Execution Layer                    │
│  (Claude API integration & agent orchestration) │
└─────────────────────┬────────────────────────────┘
                     │
┌─────────────────────┴────────────────────────────┐
│         Data Access Layer                        │
│    (Database, Cache, External Services)         │
└─────────────────────────────────────────────────┘
```

---

## Architecture Diagram

### Component Interaction Flow

```
User Request
     │
     ▼
  API Route Handler
     │
     ├─ Input Validation
     │
     ▼
  Service Layer
     │
     ├─ Business Logic
     │
     ▼
  Agent Orchestrator
     │
     ├─ Select Agent
     ├─ Prepare Context
     │
     ▼
  Base Agent (Extended)
     │
     ├─ Build Prompt
     ├─ Call Claude API
     │
     ▼
  Response Processing
     │
     ├─ Extract Result
     ├─ Update State
     │
     ▼
  Return to Client
```

---

## Core Components

### 1. API Layer (`src/api/`)

**Responsibility**: HTTP request/response handling

**Files:**
- `index.ts` - Express app creation and server startup
- `routes/agents.ts` - Agent endpoints
- `routes/leads.ts` - Lead management endpoints
- `routes/deals.ts` - Deal management endpoints

**Key Features:**
- RESTful endpoints following standard conventions
- Error handling middleware
- Request validation
- Health check endpoint

**Example Route Structure:**
```typescript
// Route definition
router.post('/:agentId/message', async (req, res) => {
  // 1. Extract and validate input
  // 2. Call service layer
  // 3. Return response
});
```

---

### 2. Agent System (`src/agents/`)

**Responsibility**: AI-powered decision making and actions

**Files:**
- `baseAgent.ts` - Abstract base class for all agents
- `implementations/` - Concrete agent implementations
  - `leadQualifier.ts` - Qualifies leads
  - `followUpAgent.ts` - Manages follow-ups
  - `proposalGenerator.ts` - Generates proposals
  - `closeAssistant.ts` - Overcomes objections
  - `managerAgent.ts` - Orchestrates other agents
- `index.ts` - Agent orchestrator
- `list.ts` - Agent discovery utility

**Architecture:**

```
BaseAgent (Abstract)
    │
    ├─ conversation history
    ├─ system prompt
    ├─ Claude API client
    │
    ▼
LeadQualifier
    ├─ qualifyLead()
    ├─ analyzeLead()
    │
FollowUpAgent
    ├─ scheduleFollowUp()
    │
ProposalGenerator
    ├─ generateProposal()
    │
CloseAssistant
    ├─ suggestResponse()
    │
ManagerAgent
    ├─ routeTask()
    ├─ escalateIssue()
```

**Key Methods:**
```typescript
abstract class BaseAgent {
  process(userMessage: string): Promise<AgentResponse>
  clearHistory(): void
  getHistory(): AgentMessage[]
}
```

---

### 3. Type System (`src/types/`)

**Core Types:**

```typescript
// Lead - prospect or customer
interface Lead {
  id: string
  email: string
  name: string
  company: string
  status: 'new' | 'qualified' | 'engaged' | 'proposal' | 'closed' | 'lost'
  score: number  // 0-100 qualification score
  notes: string
  createdAt: Date
  updatedAt: Date
}

// Deal - sales opportunity
interface Deal {
  id: string
  leadId: string  // Reference to Lead
  amount: number  // Deal value
  stage: 'discovery' | 'proposal' | 'negotiation' | 'closing' | 'won' | 'lost'
  expectedClosureDate: Date
  createdAt: Date
  updatedAt: Date
}

// Agent - AI agent definition
interface Agent {
  id: string
  type: 'lead-qualifier' | 'follow-up' | 'proposal-generator' | 'close-assistant' | 'manager'
  name: string
  description: string
  status: 'active' | 'inactive'
}

// Agent response structure
interface AgentResponse {
  agentId: string
  message: string
  action?: string
  metadata?: {
    tokensUsed: { input_tokens: number; output_tokens: number }
    stopReason: string
  }
}
```

---

### 4. Utilities (`src/utils/`)

**Logger (`logger.ts`):**
- Uses Pino for structured logging
- Logs to console in development
- Logs to file in production
- Supports different log levels (debug, info, warn, error)

```typescript
logger.info({ agentId: 'lead-qualifier' }, 'Processing lead');
logger.error(error, 'Failed to qualify lead');
```

---

## Agent System

### Agent Lifecycle

```
1. INITIALIZATION
   - Agent created with ID, name, system prompt
   - Claude API client initialized
   - Empty conversation history

2. MESSAGE PROCESSING
   - User message added to history
   - Claude API called with full history
   - Response parsed and stored in history

3. STATE MANAGEMENT
   - History maintained for context awareness
   - Can be cleared for new conversations
   - Supports multi-turn conversations

4. EXECUTION
   - baseAgent.process() handles API calls
   - Specialized methods in implementations
   - Results returned with metadata
```

### AgentOrchestrator

The orchestrator manages all agents:

```typescript
class AgentOrchestrator {
  private agents: Map<string, BaseAgent>

  constructor() {
    // Initialize all agents
    this.agents.set('lead-qualifier', new LeadQualifier(logger))
    this.agents.set('follow-up', new FollowUpAgent(logger))
    // ... etc
  }

  getAgent(id: string): BaseAgent | undefined
  listAgents(): Agent[]
}
```

### System Prompts

Each agent has a specialized system prompt:

**Lead Qualifier:**
```
You are an expert lead qualification AI. Your role is to analyze 
potential leads and assess their fit for our solutions.
Evaluate based on: company size, industry, budget indicators, 
decision-making authority, timeline, and demonstrated interest.
Provide a qualification score from 0-100 and recommend next steps.
```

**Follow-up Agent:**
```
You are an expert sales follow-up specialist. Your role is to 
determine optimal follow-up timing and personalized messaging.
Consider: engagement history, communication preferences, 
deal stage, and decision timeline.
```

---

## Data Flow

### Lead Creation & Qualification

```
Create Lead Request
     │
     ▼
  API Handler (/api/leads POST)
     │
  ├─ Validate input
  ├─ Generate ID
  │
     ▼
  Service Layer
     │
  ├─ Create lead record
  ├─ Set initial status: "new"
  ├─ Set initial score: 0
  │
     ▼
  Database
     │
  └─ Persist lead
     │
     ▼
  Response to Client
     │
User triggers qualification
     │
     ▼
  API Handler (/api/agents/lead-qualifier/qualify POST)
     │
  ├─ Get lead from database
  ├─ Format lead data
  │
     ▼
  Lead Qualifier Agent
     │
  ├─ Build prompt with lead info
  ├─ Call Claude API
  ├─ Parse response
  │
     ▼
  Extract Results
     │
  ├─ Qualification score
  ├─ Strengths/weaknesses
  ├─ Recommended actions
  │
     ▼
  Update Lead Record
     │
  ├─ Update status: "qualified"
  ├─ Set score from agent response
  │
     ▼
  Response to Client
```

### Deal Pipeline Progress

```
Create Deal
     │
     ▼
  Set stage: "discovery"
     │
User moves to next stage
     │
     ▼
  PUT /api/deals/:id/stage
     │
  ├─ Update stage
  ├─ Trigger relevant agents
  │
Close Assistant available at
  "proposal" stage for
  objection handling
     │
     ▼
  Update database
     │
     ▼
  Trigger webhooks
```

---

## Design Patterns

### 1. Abstract Base Class Pattern (Agent System)

```typescript
// BaseAgent provides common functionality
abstract class BaseAgent {
  protected client: Anthropic
  protected conversationHistory: AgentMessage[]
  
  async process(message: string): Promise<AgentResponse> {
    // Common logic for all agents
  }
}

// Concrete implementations extend and specialize
class LeadQualifier extends BaseAgent {
  async qualifyLead(lead: Lead): Promise<AgentResponse> {
    // Specialized logic
  }
}
```

**Benefits:**
- Code reuse
- Consistent interface
- Easy to add new agents

---

### 2. Dependency Injection

```typescript
// Logger injected into agents
class BaseAgent {
  constructor(
    id: string,
    name: string,
    systemPrompt: string,
    logger: Logger  // Injected dependency
  ) {
    this.logger = logger
  }
}
```

**Benefits:**
- Testability
- Flexibility
- Loose coupling

---

### 3. Factory Pattern (AgentOrchestrator)

```typescript
class AgentOrchestrator {
  private agents: Map<string, BaseAgent>

  constructor() {
    // Factory creates all agents
    this.agents.set('lead-qualifier', new LeadQualifier(logger))
    this.agents.set('follow-up', new FollowUpAgent(logger))
  }

  getAgent(id: string): BaseAgent | undefined {
    return this.agents.get(id)
  }
}
```

**Benefits:**
- Single source of agent creation
- Easy to manage lifecycle
- Central configuration point

---

### 4. Service Layer Pattern

```typescript
// API routes delegate to services
router.post('/:id', async (req, res) => {
  const result = await leadService.updateLead(req.params.id, req.body)
  res.json(result)
})

// Services contain business logic
class LeadService {
  async updateLead(id: string, data: Partial<Lead>): Promise<Lead> {
    // Complex business logic
  }
}
```

**Benefits:**
- Separation of concerns
- Reusable business logic
- Easier testing

---

## Technology Stack

### Runtime & Language
- **Node.js 18+** - JavaScript runtime
- **TypeScript 5.3+** - Type safety and modern features
- **tsx** - TypeScript executor for development

### Framework & HTTP
- **Express 4.18** - Web framework
- **Express Router** - Route management

### AI & Language Model
- **Anthropic SDK** - Claude API integration
- **claude-opus-4-1** - Base model for agents

### Utilities
- **Pino 8.17** - Structured logging
- **Pino Pretty** - Development log formatting
- **Zod 3.22** - Runtime type validation
- **axios** - HTTP client for external APIs
- **dotenv** - Environment variable management

### Development Tools
- **Vitest 1.1** - Unit testing
- **Vitest Coverage** - Code coverage analysis
- **ESLint 8.55** - Code linting
- **Prettier 3.1** - Code formatting
- **TypeScript Compiler** - Type checking

---

## Scalability Considerations

### Current Architecture

The current implementation uses in-memory storage for demonstration:

```typescript
const jobsDB: Map<string, ImportJob> = new Map()
```

### Production Recommendations

#### 1. Database Layer
- **PostgreSQL** for relational data (Leads, Deals)
- **MongoDB** for flexible documents (agent conversations)
- **Redis** for caching and sessions

```
┌─────────────────────────────────────────────┐
│           Application Layer                 │
└──────────┬──────────────┬────────────────────┘
           │              │
      ┌────▼─────┐  ┌─────▼──────┐
      │ PostgreSQL  │  │ MongoDB  │
      │ (Leads,  │  │ (Chats,   │
      │ Deals)     │  │  Logs)    │
      └────────────┘  └──────────┘
```

#### 2. Queue System for Agent Processing

```typescript
// Current: Synchronous
const response = await agent.process(message)

// Recommended: Asynchronous with queue
queue.enqueue({
  agentId: 'lead-qualifier',
  leadId: 'lead-123',
  priority: 'high'
})

worker.process(task)
```

#### 3. Caching Strategy

```
Request comes in
    │
    ├─ Check Redis cache
    ├─ If miss: Query database
    ├─ Call agent if needed
    ├─ Store in cache (TTL: 1 hour)
    │
Response to client
```

#### 4. Load Balancing

```
┌─────────────────┐
│  Load Balancer  │
└────────┬────────┘
         │
    ┌────┼────┐
    │    │    │
   ┌▼──┐┌▼──┐┌▼──┐
   │API││API││API│
   │ 1 ││ 2 ││ 3 │
   └───┘└───┘└───┘
    │    │    │
    └────┼────┘
         │
    ┌────▼─────┐
    │ Shared DB │
    └──────────┘
```

#### 5. Rate Limiting & Throttling

```typescript
// Implement per-user/IP rate limits
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 100               // 100 requests per minute
})

app.use(limiter)
```

---

## Security Architecture

### Authentication & Authorization

```
┌─────────────────┐
│  Client Request │
└────────┬────────┘
         │
      ├─ API Key Header
      │
      ▼
┌──────────────────┐
│ Auth Middleware  │
└────────┬─────────┘
         │
      ├─ Validate key
      ├─ Check permissions
      │
      ▼
┌──────────────────┐
│  Authorized      │
│  Request Handler │
└──────────────────┘
```

### Data Encryption

- Passwords hashed with bcrypt
- API keys encrypted at rest
- HTTPS for all communications
- Sensitive data not logged

---

## Error Handling Strategy

```typescript
try {
  // Execute operation
} catch (error) {
  // Log with context
  logger.error({ error, context }, 'Operation failed')
  
  // Return appropriate error code
  if (error instanceof ValidationError) {
    res.status(400).json({ error: error.message })
  } else if (error instanceof NotFoundError) {
    res.status(404).json({ error: error.message })
  } else {
    res.status(500).json({ error: 'Internal server error' })
  }
}
```

---

## Monitoring & Observability

### Key Metrics

- Request count and latency
- Agent execution time
- Error rates
- API key usage
- Cache hit rate

### Logging

```typescript
logger.info('Operation started', { operationId: '123' })
logger.error('Operation failed', { operationId: '123', error })
logger.debug('Debug info', { context })
```

---

## Future Enhancements

1. **Multi-tenant Support** - Isolate data per customer
2. **Advanced Analytics** - Track agent effectiveness
3. **Custom Agent Creation** - User-defined agents
4. **Webhook System** - Push events to external systems
5. **Plugin Architecture** - Third-party integrations
6. **Graph Database** - Relationship tracking between entities

---

## References

- [Express.js Documentation](https://expressjs.com/)
- [Anthropic API Documentation](https://docs.anthropic.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)
