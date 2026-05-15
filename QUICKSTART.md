# AI Sales Closer Quick Start Guide

Get up and running with AI Sales Closer in 5 minutes!

## Prerequisites

- **Node.js** 18 or higher
- **npm** 9 or higher
- **Anthropic API Key** (from claude.ai)

Check your versions:

```bash
node --version    # Should be v18.0.0 or higher
npm --version     # Should be 9.0.0 or higher
```

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/Chocolatsuisse74/ai-sales-closer.git
cd ai-sales-closer
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Copy the example environment file and customize:

```bash
cp .env.example .env
```

Edit `.env` with your API key:

```env
# Anthropic Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration (optional)
DATABASE_URL=postgresql://user:password@localhost:5432/ai_sales_closer

# API Configuration
API_KEY=your_internal_api_key_here

# Logging
LOG_LEVEL=info
```

### 4. Start Development Server

```bash
npm run dev
```

You should see:

```
[INFO] Server running on port 3000
[INFO] Agents initialized (5 agents ready)
```

## First Sales Automation

### 1. Create a Lead

```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Authorization: Bearer your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@techcompany.com",
    "company": "TechCompany Inc"
  }'
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "lead_abc123",
    "name": "John Doe",
    "email": "john@techcompany.com",
    "company": "TechCompany Inc",
    "status": "new",
    "score": 0.0
  }
}
```

**Save the `id` for the next steps.**

### 2. Qualify Lead with AI Agent

```bash
curl -X POST http://localhost:3000/api/agents/lead-qualifier/process \
  -H "Authorization: Bearer your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "leadId": "lead_abc123",
    "context": "Enterprise prospect from tech industry, $500k budget, evaluating enterprise solutions"
  }'
```

Response:

```json
{
  "success": true,
  "data": {
    "agentId": "lead-qualifier",
    "message": "Lead analysis complete",
    "metadata": {
      "score": 0.87,
      "recommendation": "qualified",
      "reasoning": "Enterprise company with identified budget, strong indicators for fit"
    }
  }
}
```

### 3. Update Lead Status

```bash
curl -X PUT http://localhost:3000/api/leads/lead_abc123 \
  -H "Authorization: Bearer your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "qualified",
    "score": 0.87,
    "notes": "High-potential enterprise prospect"
  }'
```

### 4. Create Deal

```bash
curl -X POST http://localhost:3000/api/deals \
  -H "Authorization: Bearer your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "leadId": "lead_abc123",
    "amount": 100000,
    "stage": "discovery",
    "expectedClosureDate": "2024-06-30"
  }'
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "deal_xyz789",
    "leadId": "lead_abc123",
    "amount": 100000,
    "stage": "discovery"
  }
}
```

### 5. Generate Proposal with AI

```bash
curl -X POST http://localhost:3000/api/agents/proposal-generator/process \
  -H "Authorization: Bearer your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "leadId": "lead_abc123",
    "dealId": "deal_xyz789",
    "context": "Enterprise package with custom integrations, emphasis on scalability"
  }'
```

### 6. Handle Objections

```bash
curl -X POST http://localhost:3000/api/agents/close-assistant/process \
  -H "Authorization: Bearer your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "leadId": "lead_abc123",
    "objection": "Your price is 20% higher than the competitor"
  }'
```

Response:

```json
{
  "success": true,
  "data": {
    "agentId": "close-assistant",
    "message": "Objection handling strategy provided",
    "metadata": {
      "objectionType": "price",
      "response": "Our platform includes enterprise support, custom integrations, and guaranteed uptime that the competitor doesn't offer. The ROI difference amounts to $500k annually."
    }
  }
}
```

## Key Endpoints

### Health Check

```bash
curl http://localhost:3000/health
```

### List All Agents

```bash
curl http://localhost:3000/api/agents \
  -H "Authorization: Bearer your_api_key_here"
```

### List Leads

```bash
curl http://localhost:3000/api/leads \
  -H "Authorization: Bearer your_api_key_here"
```

### List Deals

```bash
curl http://localhost:3000/api/deals \
  -H "Authorization: Bearer your_api_key_here"
```

### View Activity Timeline

```bash
curl "http://localhost:3000/api/activities?leadId=lead_abc123" \
  -H "Authorization: Bearer your_api_key_here"
```

## Available Agents

### 1. Lead Qualifier Agent

Analyzes and scores incoming leads (0-1 scale)

```bash
curl -X POST http://localhost:3000/api/agents/lead-qualifier/process \
  -H "Authorization: Bearer your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "leadId": "lead_abc123",
    "context": "Lead details and background"
  }'
```

### 2. Follow-Up Agent

Manages intelligent lead follow-ups and engagement strategies

```bash
curl -X POST http://localhost:3000/api/agents/follow-up/process \
  -H "Authorization: Bearer your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "leadId": "lead_abc123",
    "context": "Previous interaction details"
  }'
```

### 3. Proposal Generator

Creates customized, compelling proposals

```bash
curl -X POST http://localhost:3000/api/agents/proposal-generator/process \
  -H "Authorization: Bearer your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "leadId": "lead_abc123",
    "dealId": "deal_xyz789",
    "context": "Deal details and requirements"
  }'
```

### 4. Close Assistant

Helps overcome objections and close deals

```bash
curl -X POST http://localhost:3000/api/agents/close-assistant/process \
  -H "Authorization: Bearer your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "leadId": "lead_abc123",
    "objection": "The prospect'\''s concern or objection"
  }'
```

### 5. Manager Agent

Orchestrates other agents and manages workflows

```bash
curl -X POST http://localhost:3000/api/agents/manager/process \
  -H "Authorization: Bearer your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "leadId": "lead_abc123",
    "context": "Current sales stage and next steps"
  }'
```

## Common Workflows

### Workflow 1: New Lead Qualification

```bash
# 1. Create lead
curl -X POST http://localhost:3000/api/leads \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane","email":"jane@company.com","company":"Company"}'

# 2. Qualify with Lead Qualifier Agent
# Save the lead ID from step 1, then:
curl -X POST http://localhost:3000/api/agents/lead-qualifier/process \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"leadId":"lead_id_here","context":"Enterprise prospect"}'

# 3. Update lead based on score
curl -X PUT http://localhost:3000/api/leads/lead_id_here \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status":"qualified","score":0.85}'
```

### Workflow 2: Deal Management

```bash
# 1. Create deal
curl -X POST http://localhost:3000/api/deals \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "leadId":"lead_id_here",
    "amount":100000,
    "stage":"discovery",
    "expectedClosureDate":"2024-06-30"
  }'

# 2. Move to proposal stage
curl -X PUT http://localhost:3000/api/deals/deal_id_here/stage \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"stage":"proposal"}'

# 3. Generate proposal
curl -X POST http://localhost:3000/api/agents/proposal-generator/process \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"leadId":"lead_id_here","dealId":"deal_id_here","context":"Enterprise needs"}'
```

### Workflow 3: Objection Handling

```bash
# When a prospect raises an objection:
curl -X POST http://localhost:3000/api/agents/close-assistant/process \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "leadId":"lead_id_here",
    "objection":"We need to check with our board first"
  }'

# The Close Assistant returns strategies to overcome the objection
```

## Testing

Run the test suite:

```bash
# Run all tests
npm test

# Watch mode (re-run on changes)
npm test -- --watch

# Coverage report
npm run test:cov
```

## Building for Production

### 1. Run Linting

```bash
npm run lint
npm run lint:fix  # Auto-fix issues
```

### 2. Type Check

```bash
npm run typecheck
```

### 3. Build

```bash
npm run build
```

Creates optimized JavaScript in `dist/` directory.

### 4. Start Production Server

```bash
npm start
```

## Docker Deployment

### Build Docker Image

```bash
docker build -t ai-sales-closer .
```

### Run Container

```bash
docker run -p 3000:3000 \
  -e ANTHROPIC_API_KEY=your_key_here \
  -e API_KEY=your_internal_key \
  ai-sales-closer
```

### Using Docker Compose

```bash
docker-compose up
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | - | Your Anthropic API key |
| `PORT` | 3000 | Server port |
| `NODE_ENV` | development | Environment (development/production) |
| `API_KEY` | - | Internal API authentication key |
| `LOG_LEVEL` | info | Pino log level |
| `DATABASE_URL` | - | PostgreSQL connection (optional) |

## Troubleshooting

### "Invalid API Key" Error

**Solution:**
1. Verify your ANTHROPIC_API_KEY is correct in `.env`
2. Check you're using a valid Anthropic API key from https://console.anthropic.com
3. Ensure the API key has the correct permissions

### "Port 3000 is already in use"

**Solution:**

Change PORT in `.env`:
```bash
PORT=3001
```

Or kill existing process:
```bash
lsof -i :3000
kill -9 <PID>
```

### Agent Not Responding

**Solution:**

1. Check ANTHROPIC_API_KEY is set
2. Check API rate limits (100 requests/minute default)
3. Verify network connectivity
4. Check logs: `npm run dev` shows detailed error messages

### Inconsistent Agent Responses

This is expected - Claude is creative by design. For consistent results:
- Use more specific context in requests
- Keep conversation history shorter (clear history between unrelated requests)
- Review agent system prompts in `src/agents/implementations/`

## Development Workflow

### 1. Development Server with Hot Reload

```bash
npm run dev
```

Changes to TypeScript files automatically reload!

### 2. Code Linting

```bash
# Check linting
npm run lint

# Auto-fix issues
npm run lint:fix

# Format code
npm run format
```

### 3. Testing

```bash
npm run test -- --watch
```

## Next Steps

1. **Read API Documentation** - See `docs/API.md` for complete endpoint reference
2. **Explore Agents Guide** - See `docs/AGENTS.md` for detailed agent information
3. **Learn Architecture** - See `docs/ARCHITECTURE.md` for system design
4. **Try Advanced Workflows** - Combine multiple agents for complex sales scenarios
5. **Setup Webhooks** - Integrate with your CRM or backend systems
6. **Monitor Performance** - Use health checks and activity logs

## Integrations

### CRM Integration

Agents can work with your CRM system:

```bash
# After qualifying a lead, create in your CRM
curl -X POST your-crm.com/api/leads \
  -H "Authorization: Bearer CRM_KEY" \
  -d '{"name":"John","email":"john@company.com"}'
```

### Slack Notifications

Get notified when deals progress:

```bash
# After deal moves to proposal stage
curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL \
  -d '{"text":"Deal for $100k moved to proposal stage!"}'
```

## Performance Tips

1. **Clear Agent History** - Between unrelated conversations
2. **Batch Requests** - Use pagination to load leads/deals efficiently
3. **Filter Early** - Use query parameters to reduce data transfer
4. **Cache Results** - Store agent responses locally when appropriate

## Getting Help

- **Documentation:** Check `docs/` directory
- **Issues:** Report on GitHub
- **Examples:** See this guide and API docs
- **Code:** Read source in `src/` directory

## Next: Production Deployment

When ready for production:

1. **Get Anthropic API Key** - From https://console.anthropic.com
2. **Setup Database** - Use managed PostgreSQL service (optional)
3. **Configure Environment** - Use secure secrets management
4. **Setup Monitoring** - Enable health checks and logs
5. **Enable Security** - Rate limiting, input validation
6. **Setup CI/CD** - Automate testing and deployment
7. **Configure Webhooks** - Ensure endpoints are HTTPS

See `docs/ARCHITECTURE.md` for deployment strategies.

---

**Ready to automate your sales? 🚀**
