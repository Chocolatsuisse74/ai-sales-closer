# AI Sales Closer Architecture

## Table of Contents

- [System Overview](#system-overview)
- [Architecture Diagram](#architecture-diagram)
- [Core Components](#core-components)
- [Data Flow](#data-flow)
- [Agent Orchestration](#agent-orchestration)
- [Design Patterns](#design-patterns)
- [Technology Stack](#technology-stack)
- [Database Schema](#database-schema)
- [API Design](#api-design)
- [Security Architecture](#security-architecture)
- [Scalability](#scalability)

## System Overview

AI Sales Closer is an intelligent sales automation platform that combines multiple AI agents to manage the complete sales lifecycle. The architecture follows a modular, event-driven design that enables:

- **Multi-agent collaboration** with Claude AI
- **Lead qualification and scoring**
- **Intelligent follow-up automation**
- **Dynamic proposal generation**
- **Sales deal management**
- **Real-time pipeline tracking**
- **Activity logging and analytics**

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Client Applications                          │
│                   (Dashboard, API, Webhooks)                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  Express.js API  │
                    │  (Port 3000)     │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
    ┌────────┐          ┌─────────┐          ┌──────────┐
    │ Agents │          │  Leads  │          │  Deals   │
    │ Router │          │ Router  │          │ Router   │
    └────┬───┘          └────┬────┘          └────┬─────┘
         │                   │                    │
         └───────────┬───────┴────────┬───────────┘
                     │                │
          ┌──────────▼──────────┐     │
          │ Agent Orchestrator   │     │
          ├──────────────────────┤     │
          │ Lead Qualifier       │     │
          │ Follow-up Agent      │     │
          │ Proposal Generator   │     │
          │ Close Assistant      │     │
          │ Manager Agent        │     │
          └──────────┬───────────┘     │
                     │                 │
        ┌────────────▼──────────────┐  │
        │   Claude AI Integration    │  │
        ├────────────────────────────┤  │
        │  Anthropic SDK             │  │
        │  Message Processing        │  │
        │  Token Management          │  │
        └────────────┬───────────────┘  │
                     │                  │
        ┌────────────▼──────────────┐   │
        │  Data Layer               │   │
        ├────────────────────────────┤   │
        │  Lead Repository           │   │
        │  Deal Repository           │   │
        │  Activity Logger           │   │
        │  Agent State Manager       │   │
        └────────────┬───────────────┘   │
                     │                   │
        ┌────────────▼──────────────────┐│
        │   Database Layer             ││
        ├──────────────────────────────┘│
        │  PostgreSQL                   │
        │  - Leads Table                │
        │  - Deals Table                │
        │  - Activities Table           │
        │  - Agents State Table         │
        └──────────────────────────────┘
```

## Core Components

### 1. API Router Layer (`src/api/`)

**Responsibility:** Handle HTTP requests and route to appropriate handlers.

**Key Files:**
- `index.ts` - Express app creation and configuration
- `routes/agents.ts` - Agent endpoints
- `routes/leads.ts` - Lead management
- `routes/deals.ts` - Deal management

**Endpoints:**
- `GET /agents` - List all agents
- `POST /agents/:agentType/process` - Process with agent
- `GET /leads` - List leads
- `POST /leads` - Create lead
- `GET /deals` - List deals
- `POST /deals` - Create deal

### 2. Agent Orchestrator (`src/agents/`)

**Responsibility:** Manage and coordinate AI agents.

**Key Files:**
- `index.ts` - Agent orchestrator and initialization
- `baseAgent.ts` - Base class for all agents
- `implementations/` - Individual agent implementations

**Agent Instances:**
```
AgentOrchestrator
├── LeadQualifier (id: lead-qualifier)
├── FollowUpAgent (id: follow-up)
├── ProposalGenerator (id: proposal-generator)
├── CloseAssistant (id: close-assistant)
└── ManagerAgent (id: manager)
```

**Design Pattern:** Singleton
- One orchestrator instance per application
- Manages all agent lifecycle
- Coordinates agent interactions

### 3. BaseAgent Class

**Responsibility:** Provide common agent functionality.

**Key Methods:**

```typescript
async process(userMessage: string): Promise<AgentResponse>
clearHistory(): void
getHistory(): AgentMessage[]
```

## Data Flow

### Lead Processing Workflow

```
New Lead
  │
  ├─ POST /api/leads
  │
  ▼
Create Lead Record
  │
  ├─ Generate ID
  ├─ Set status: 'new'
  ├─ Set score: 0.0
  │
  ▼
(Optional) Qualify Lead
  │
  ├─ Send to Lead Qualifier Agent
  │
  ├─ Agent analyzes lead
  ├─ Agent returns score and recommendation
  │
  ├─ Update lead status
  │
  ▼
(If Qualified) Create Deal
  │
  ├─ Create deal record
  ├─ Link to lead
  ├─ Set stage: 'discovery'
  │
  ▼
Schedule Follow-up
  │
  ├─ Send to Follow-Up Agent
  │
  ├─ Agent plans follow-up strategy
  │
  ▼
Log Activity
  │
  ├─ Record all agent interactions
  ├─ Store metadata
  │
  ▼
Send Webhooks (Optional)
  │
  └─ Notify external systems
```

## Agent Orchestration

### Multi-Turn Conversation Flow

```
User Query
  │
  ├─ Build message with context
  │
  ├─ Append to conversation history
  │
  ├─ Send to Claude with:
  │  ├─ System prompt
  │  ├─ Conversation history
  │  └─ Max tokens
  │
  ▼
Claude Response
  │
  ├─ Parse response
  │
  ├─ Extract action/score/recommendation
  │
  ├─ Add to conversation history
  │
  ├─ Update application state
  │
  ▼
Return to Client
```

## Design Patterns

### 1. Agent Factory Pattern

All agents are created and managed through the AgentOrchestrator.

### 2. Repository Pattern

Data access abstraction over database operations.

### 3. Middleware Pipeline

Request processing with authentication, validation, and error handling.

### 4. Event-Driven Architecture

Agents emit events for logging, analytics, and external integrations.

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Runtime** | Node.js 18+ | JavaScript runtime |
| **Framework** | Express.js | HTTP server |
| **Language** | TypeScript | Type-safe code |
| **AI** | Anthropic Claude SDK | AI models |
| **Database** | PostgreSQL | Data persistence |
| **Logging** | Pino | Structured logging |
| **Testing** | Vitest | Unit testing |

## Database Schema

### leads table
```sql
CREATE TABLE leads (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255),
  name VARCHAR(255),
  company VARCHAR(255),
  status VARCHAR(50),
  score FLOAT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### deals table
```sql
CREATE TABLE deals (
  id VARCHAR(36) PRIMARY KEY,
  lead_id VARCHAR(36) REFERENCES leads(id),
  amount DECIMAL(10, 2),
  stage VARCHAR(50),
  expected_closure_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### activities table
```sql
CREATE TABLE activities (
  id VARCHAR(36) PRIMARY KEY,
  lead_id VARCHAR(36) REFERENCES leads(id),
  deal_id VARCHAR(36) REFERENCES deals(id),
  agent_id VARCHAR(100),
  type VARCHAR(100),
  description TEXT,
  metadata JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

## API Design

### Request/Response Pattern

**Standardized Response:**
```json
{
  "success": true,
  "data": {
    "agentId": "lead-qualifier",
    "message": "Lead analysis complete"
  }
}
```

## Security Architecture

### Authentication

- Bearer token in header: `Authorization: Bearer API_KEY`
- API key validation on every request
- Rate limiting per API key

### Data Protection

- Encryption in transit (HTTPS)
- Input validation and sanitization
- SQL injection prevention

## Scalability

### Horizontal Scaling

Multiple API instances can run behind a load balancer, sharing a PostgreSQL database.

### Agent Processing

- Agents are stateless
- Suitable for horizontal scaling
- Suitable for serverless deployment

### Performance Optimizations

1. Connection pooling for database
2. Efficient query design
3. Async/non-blocking I/O
4. Caching layer for frequently accessed data

## Deployment

### Docker

Containerized deployment with Docker and Docker Compose.

### Cloud Platforms

- AWS (Lambda, ECS, RDS)
- Google Cloud (Cloud Run, Cloud SQL)
- Azure (App Service, SQL Database)
- Heroku
