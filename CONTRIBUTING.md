# Contributing to AI Sales Closer

We welcome contributions from sales professionals, developers, and everyone who wants to improve sales automation!

## How to Contribute

1. **Report Issues** - Found a bug? [Open an issue](../../issues)
2. **Suggest Features** - Have ideas? [Share them](../../issues)
3. **Improve Docs** - Help improve documentation
4. **Submit Code** - Fix bugs or add features
5. **Improve Tests** - Increase test coverage
6. **Share Ideas** - Join discussions

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Basic TypeScript knowledge

### Setup Development

```bash
# Clone repository
git clone https://github.com/Chocolatsuisse74/ai-sales-closer.git
cd ai-sales-closer

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Add your API keys:
# AI_API_KEY=...
# CRM_API_KEY=...
# etc.

# Start development
npm run dev

# Open http://localhost:3000
```

## Development Workflow

### 1. Create Branch

```bash
# Update main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/agent-improvement
# or for fixes
git checkout -b fix/pipeline-bug
```

### 2. Make Changes

Follow [Code Standards](#code-standards) below.

### 3. Test

```bash
# Run tests
npm run test

# Check types
npx tsc --noEmit

# Lint
npm run lint

# Build
npm run build
```

### 4. Commit

```bash
git add .

# Use conventional commits
git commit -m "feat: add lead qualification agent"
git commit -m "fix: resolve CRM sync issue"

# Types: feat, fix, docs, style, test, chore
```

### 5. Push & PR

```bash
git push origin feature/agent-improvement

# Create PR with description of changes
```

## Code Standards

### TypeScript

- ✅ Strict mode
- ✅ Explicit types (no `any`)
- ✅ Return type annotations
- ✅ Runtime validation

```typescript
// ✅ Good
interface Lead {
  id: string;
  name: string;
  email: string;
}

function getLeadScore(lead: Lead): number {
  return calculateScore(lead);
}

// ❌ Avoid
function getLeadScore(lead: any): any {
  return calculateScore(lead);
}
```

### Agent Development

```typescript
// src/agents/my-agent.ts
interface AgentInput {
  data: string;
  context?: Record<string, unknown>;
}

interface AgentOutput {
  success: boolean;
  result: unknown;
  error?: string;
}

export async function myAgent(input: AgentInput): Promise<AgentOutput> {
  try {
    // Agent logic
    return { success: true, result };
  } catch (error) {
    return { success: false, result: null, error: error.message };
  }
}
```

### Naming

- Functions: `camelCase`
- Classes: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Files: `kebab-case.ts`
- Routes: `kebab-case`

```typescript
// ✅ Good
class LeadManager {
  private readonly MAX_RETRIES = 3;
  
  async processLead(leadId: string): Promise<void> {}
}

// ❌ Avoid
class lead_Manager {
  private max_retries = 3;
  
  async process_lead(LeadId: string) {}
}
```

## Agent Development

### Creating a New Agent

1. Create agent file:
```typescript
// src/agents/recommendation.agent.ts
import { Agent, AgentContext } from '@/core/agent';

export class RecommendationAgent extends Agent {
  constructor(context: AgentContext) {
    super(context);
  }

  async execute(input: LeadData): Promise<Recommendation> {
    // Implementation
  }
}
```

2. Register agent:
```typescript
// src/agents/index.ts
export { RecommendationAgent } from './recommendation.agent';
```

3. Add to manager:
```typescript
// src/core/agent-manager.ts
const agents = {
  recommendation: new RecommendationAgent(context),
};
```

4. Test agent:
```typescript
// src/agents/recommendation.agent.test.ts
describe('RecommendationAgent', () => {
  it('recommends product for qualified lead', async () => {
    const agent = new RecommendationAgent(mockContext);
    const result = await agent.execute(mockLead);
    expect(result.productId).toBeDefined();
  });
});
```

### Agent Best Practices

- ✅ Single responsibility
- ✅ Error handling
- ✅ Type safety
- ✅ Logging
- ✅ Testing
- ✅ Documentation

```typescript
// ✅ Good - Clear responsibility
export class QualificationAgent extends Agent {
  async execute(lead: Lead): Promise<QualificationResult> {
    try {
      const score = this.calculateScore(lead);
      this.logger.info(`Lead ${lead.id} scored: ${score}`);
      return { qualified: score >= 60, score };
    } catch (error) {
      this.logger.error('Qualification failed', error);
      throw new AgentError('Failed to qualify lead', error);
    }
  }
}
```

## Adding Features

### New API Endpoint

1. Create controller:
```typescript
// src/controllers/lead.controller.ts
export class LeadController {
  async createLead(req: Request): Promise<Lead> {
    const data = req.body;
    return await this.service.create(data);
  }
}
```

2. Add route:
```typescript
// src/routes/api/leads.ts
app.post('/api/leads', async (req, res) => {
  const controller = new LeadController();
  const result = await controller.createLead(req);
  res.json(result);
});
```

3. Add tests:
```typescript
describe('POST /api/leads', () => {
  it('creates new lead', async () => {
    const response = await request(app)
      .post('/api/leads')
      .send({ name: 'John', email: 'john@example.com' });
    
    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
  });
});
```

### New Integration

1. Create connector:
```typescript
// src/integrations/crm/salesforce.ts
export class SalesforceConnector {
  async authenticate(apiKey: string): Promise<void> {}
  async getLead(id: string): Promise<Lead> {}
  async updateLead(id: string, data: Partial<Lead>): Promise<void> {}
}
```

2. Register:
```typescript
// src/integrations/index.ts
export const crms = {
  salesforce: new SalesforceConnector(),
  hubspot: new HubSpotConnector(),
};
```

## Testing

### Run Tests

```bash
npm run test              # Once
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage
```

### Write Tests

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('LeadService', () => {
  let service: LeadService;
  
  beforeEach(() => {
    service = new LeadService();
  });

  it('qualifies high-score leads', () => {
    const lead = { score: 80, status: 'new' };
    const result = service.qualify(lead);
    expect(result.qualified).toBe(true);
  });

  it('rejects low-score leads', () => {
    const lead = { score: 30, status: 'new' };
    const result = service.qualify(lead);
    expect(result.qualified).toBe(false);
  });
});
```

## Pull Request

### PR Title

```
feat: Add lead scoring agent
fix: Resolve email sync issue
docs: Update API docs
test: Add agent tests
```

### PR Description

```markdown
## Description
Adds intelligent lead scoring based on firmographic and engagement data.

## Changes
- Created LeadScoringAgent
- Added scoring algorithm
- Integrated with qualification pipeline
- Added unit and integration tests

## Testing
1. Run tests: npm run test
2. Manual test with sample leads
3. Verify pipeline behavior

## Related
Closes #123
```

### PR Checklist

- [ ] Tests pass: `npm run test`
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] Linting passes: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] Code reviewed by maintainer
- [ ] Documentation updated
- [ ] No console errors
- [ ] Performance acceptable

## Code Review

Your PR will be evaluated on:

1. **Correctness** - Does it work?
2. **Quality** - Is it well-written?
3. **Performance** - Is it efficient?
4. **Tests** - Is it tested?
5. **Security** - Is it secure?
6. **Documentation** - Is it documented?

## Support

### Questions?

- 📖 [README](README.md)
- 📖 [Documentation](./docs)
- 💬 [Discussions](../../discussions)
- 🐛 [Issues](../../issues)
- 📧 support@ai-sales-closer.dev

### Issues to Work On

Check [good-first-issue](../../issues?q=label%3Agood-first-issue) and [help-wanted](../../issues?q=label%3Ahelp-wanted) labels for tasks suitable for contributors.

---

**Thank you for contributing to better sales automation!** 🚀
