# API Documentation - AI Sales Closer

Complete API reference for the AI Sales Closer platform with examples and authentication details.

## Table of Contents

- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Common Response Format](#common-response-format)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Endpoints](#endpoints)
  - [Health Check](#health-check)
  - [Agents](#agents)
  - [Leads](#leads)
  - [Deals](#deals)

---

## Overview

The AI Sales Closer API provides programmatic access to:
- AI Agent management and execution
- Lead qualification and tracking
- Sales deal management
- Real-time sales pipeline updates

All endpoints return JSON responses with consistent formatting.

---

## Base URL

```
http://localhost:3000/api
```

For production environments, replace `localhost:3000` with your deployment URL.

---

## Authentication

Currently, the API uses API key authentication. Add your API key to request headers:

```bash
Authorization: Bearer YOUR_API_KEY
```

### Getting Your API Key

1. Log in to the AI Sales Closer dashboard
2. Navigate to Settings > API Keys
3. Click "Generate New Key"
4. Copy and store securely

---

## Common Response Format

### Success Response

```json
{
  "data": { /* response payload */ },
  "status": "success",
  "timestamp": "2026-05-15T10:30:00Z"
}
```

### Error Response

```json
{
  "error": "Error message describing what went wrong",
  "status": "error",
  "code": "ERROR_CODE",
  "timestamp": "2026-05-15T10:30:00Z"
}
```

---

## Error Handling

### HTTP Status Codes

| Status | Meaning |
|--------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Missing/invalid authentication |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

### Common Error Codes

- `INVALID_REQUEST` - Malformed request
- `UNAUTHORIZED` - Missing or invalid API key
- `NOT_FOUND` - Resource not found
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `AGENT_ERROR` - Error processing with agent
- `INTERNAL_ERROR` - Server error

---

## Rate Limiting

- **Free Tier**: 100 requests/hour
- **Pro Tier**: 1000 requests/hour
- **Enterprise**: Unlimited

Rate limit headers are included in all responses:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1234567890
```

---

## Endpoints

### Health Check

#### Check API Status

```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-05-15T10:30:00Z"
}
```

**Example:**
```bash
curl http://localhost:3000/health
```

---

### Agents

#### List All Agents

```http
GET /agents
```

**Response:**
```json
{
  "agents": [
    {
      "id": "lead-qualifier",
      "type": "lead-qualifier",
      "name": "Lead Qualifier Agent",
      "description": "Analyzes and qualifies incoming leads",
      "status": "active"
    },
    {
      "id": "follow-up",
      "type": "follow-up",
      "name": "Follow-up Agent",
      "description": "Manages intelligent follow-ups",
      "status": "active"
    },
    {
      "id": "proposal-generator",
      "type": "proposal-generator",
      "name": "Proposal Generator",
      "description": "Creates customized proposals",
      "status": "active"
    },
    {
      "id": "close-assistant",
      "type": "close-assistant",
      "name": "Close Assistant",
      "description": "Helps overcome objections",
      "status": "active"
    },
    {
      "id": "manager",
      "type": "manager",
      "name": "Manager Agent",
      "description": "Orchestrates all agents",
      "status": "active"
    }
  ],
  "count": 5
}
```

**Example:**
```bash
curl -X GET http://localhost:3000/api/agents \
  -H "Authorization: Bearer YOUR_API_KEY"
```

---

#### Send Message to Agent

```http
POST /agents/:agentId/message
```

**Parameters:**
- `agentId` (path): The ID of the agent (e.g., "lead-qualifier")

**Request Body:**
```json
{
  "message": "Your message to the agent"
}
```

**Response:**
```json
{
  "agentId": "lead-qualifier",
  "message": "Agent's response message",
  "metadata": {
    "tokensUsed": {
      "input_tokens": 256,
      "output_tokens": 128
    },
    "stopReason": "end_turn"
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/agents/lead-qualifier/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "message": "Analyze this lead: TechCorp Inc, $5M ARR, 500 employees"
  }'
```

---

#### Qualify Lead with Specialist

```http
POST /agents/lead-qualifier/qualify
```

**Request Body:**
```json
{
  "lead": {
    "id": "lead-123",
    "name": "John Doe",
    "email": "john@techcorp.com",
    "company": "TechCorp Inc",
    "status": "new",
    "score": 0,
    "notes": "Referred by existing customer"
  }
}
```

**Response:**
```json
{
  "agentId": "lead-qualifier",
  "message": "Qualification Score: 85/100\n\nKey Strengths:\n- Large company with proven budget\n- Direct referral from trusted source\n- Matching industry\n\nPotential Risks:\n- No prior engagement\n- Decision timeline unclear\n\nRecommended Next Action:\n- Schedule discovery call within 48 hours",
  "metadata": {
    "tokensUsed": {
      "input_tokens": 512,
      "output_tokens": 256
    },
    "stopReason": "end_turn"
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/agents/lead-qualifier/qualify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "lead": {
      "id": "lead-123",
      "name": "John Doe",
      "email": "john@techcorp.com",
      "company": "TechCorp Inc",
      "status": "new",
      "score": 0,
      "notes": "Referred by existing customer"
    }
  }'
```

---

### Leads

#### List All Leads

```http
GET /leads
```

**Query Parameters:**
- `status` (optional): Filter by status (new, qualified, engaged, proposal, closed, lost)
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Results per page (default: 20)
- `sort` (optional): Sort field (createdAt, score, updatedAt)

**Response:**
```json
{
  "leads": [
    {
      "id": "lead-123",
      "name": "John Doe",
      "email": "john@techcorp.com",
      "company": "TechCorp Inc",
      "status": "qualified",
      "score": 85,
      "notes": "Referred by existing customer",
      "createdAt": "2026-05-10T14:20:00Z",
      "updatedAt": "2026-05-15T10:30:00Z"
    }
  ],
  "count": 1,
  "total": 145,
  "page": 1,
  "pages": 8
}
```

**Example:**
```bash
curl -X GET "http://localhost:3000/api/leads?status=qualified&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

---

#### Create Lead

```http
POST /leads
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@innovatecorp.com",
  "company": "InnovateCorp",
  "notes": "Inbound inquiry from website",
  "status": "new"
}
```

**Response:**
```json
{
  "id": "lead-456",
  "name": "Jane Smith",
  "email": "jane@innovatecorp.com",
  "company": "InnovateCorp",
  "status": "new",
  "score": 0,
  "notes": "Inbound inquiry from website",
  "createdAt": "2026-05-15T10:30:00Z",
  "updatedAt": "2026-05-15T10:30:00Z"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@innovatecorp.com",
    "company": "InnovateCorp",
    "notes": "Inbound inquiry from website",
    "status": "new"
  }'
```

---

#### Get Lead Details

```http
GET /leads/:id
```

**Parameters:**
- `id` (path): The lead ID

**Response:**
```json
{
  "id": "lead-123",
  "name": "John Doe",
  "email": "john@techcorp.com",
  "company": "TechCorp Inc",
  "status": "qualified",
  "score": 85,
  "notes": "Referred by existing customer",
  "createdAt": "2026-05-10T14:20:00Z",
  "updatedAt": "2026-05-15T10:30:00Z"
}
```

**Example:**
```bash
curl -X GET http://localhost:3000/api/leads/lead-123 \
  -H "Authorization: Bearer YOUR_API_KEY"
```

---

#### Update Lead

```http
PUT /leads/:id
```

**Parameters:**
- `id` (path): The lead ID

**Request Body:**
```json
{
  "status": "engaged",
  "score": 90,
  "notes": "Called and very interested in demo"
}
```

**Response:**
```json
{
  "id": "lead-123",
  "name": "John Doe",
  "email": "john@techcorp.com",
  "company": "TechCorp Inc",
  "status": "engaged",
  "score": 90,
  "notes": "Called and very interested in demo",
  "createdAt": "2026-05-10T14:20:00Z",
  "updatedAt": "2026-05-15T10:35:00Z"
}
```

**Example:**
```bash
curl -X PUT http://localhost:3000/api/leads/lead-123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "status": "engaged",
    "score": 90,
    "notes": "Called and very interested in demo"
  }'
```

---

#### Delete Lead

```http
DELETE /leads/:id
```

**Parameters:**
- `id` (path): The lead ID

**Response:**
```json
{
  "message": "Lead deleted successfully",
  "id": "lead-123"
}
```

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/leads/lead-123 \
  -H "Authorization: Bearer YOUR_API_KEY"
```

---

### Deals

#### List All Deals

```http
GET /deals
```

**Query Parameters:**
- `stage` (optional): Filter by stage (discovery, proposal, negotiation, closing, won, lost)
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Results per page (default: 20)
- `sort` (optional): Sort field (createdAt, amount, expectedClosureDate)

**Response:**
```json
{
  "deals": [
    {
      "id": "deal-789",
      "leadId": "lead-123",
      "amount": 50000,
      "stage": "proposal",
      "expectedClosureDate": "2026-06-15T00:00:00Z",
      "createdAt": "2026-05-10T14:20:00Z",
      "updatedAt": "2026-05-15T10:30:00Z"
    }
  ],
  "count": 1,
  "total": 47,
  "page": 1,
  "pages": 3
}
```

**Example:**
```bash
curl -X GET "http://localhost:3000/api/deals?stage=proposal&sort=amount" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

---

#### Create Deal

```http
POST /deals
```

**Request Body:**
```json
{
  "leadId": "lead-123",
  "amount": 50000,
  "stage": "discovery",
  "expectedClosureDate": "2026-06-15"
}
```

**Response:**
```json
{
  "id": "deal-789",
  "leadId": "lead-123",
  "amount": 50000,
  "stage": "discovery",
  "expectedClosureDate": "2026-06-15T00:00:00Z",
  "createdAt": "2026-05-15T10:30:00Z",
  "updatedAt": "2026-05-15T10:30:00Z"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/deals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "leadId": "lead-123",
    "amount": 50000,
    "stage": "discovery",
    "expectedClosureDate": "2026-06-15"
  }'
```

---

#### Update Deal Stage

```http
PUT /deals/:id/stage
```

**Parameters:**
- `id` (path): The deal ID

**Request Body:**
```json
{
  "stage": "negotiation"
}
```

**Response:**
```json
{
  "id": "deal-789",
  "leadId": "lead-123",
  "amount": 50000,
  "stage": "negotiation",
  "expectedClosureDate": "2026-06-15T00:00:00Z",
  "createdAt": "2026-05-10T14:20:00Z",
  "updatedAt": "2026-05-15T10:40:00Z"
}
```

**Example:**
```bash
curl -X PUT http://localhost:3000/api/deals/deal-789/stage \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "stage": "negotiation"
  }'
```

---

## Workflow Example

Here's a complete workflow showing how to use multiple endpoints:

```bash
# 1. Create a new lead
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@enterprise.com",
    "company": "Enterprise Inc",
    "notes": "LinkedIn outreach",
    "status": "new"
  }' > lead.json

LEAD_ID=$(jq -r '.id' lead.json)

# 2. Qualify the lead
curl -X POST http://localhost:3000/api/agents/lead-qualifier/qualify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d @lead.json > qualification.json

# 3. Update lead status based on qualification
curl -X PUT http://localhost:3000/api/leads/$LEAD_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "status": "qualified",
    "score": 88
  }'

# 4. Create a deal
curl -X POST http://localhost:3000/api/deals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "leadId": "'$LEAD_ID'",
    "amount": 75000,
    "stage": "discovery",
    "expectedClosureDate": "2026-07-15"
  }' > deal.json

# 5. Get deal status
DEAL_ID=$(jq -r '.id' deal.json)
curl -X GET http://localhost:3000/api/deals/$DEAL_ID \
  -H "Authorization: Bearer YOUR_API_KEY"
```

---

## Pagination

For endpoints that support pagination, use these query parameters:

```
GET /leads?page=2&limit=50
```

Response includes pagination info:

```json
{
  "leads": [...],
  "page": 2,
  "limit": 50,
  "total": 500,
  "pages": 10,
  "hasNext": true,
  "hasPrev": true
}
```

---

## Sorting

Use the `sort` parameter to order results:

```
GET /leads?sort=-createdAt      // Descending by creation date
GET /leads?sort=score           // Ascending by score
GET /deals?sort=-amount         // Descending by amount
```

---

## Filtering

Filter results with query parameters:

```
GET /leads?status=qualified
GET /deals?stage=closing&amount_gte=100000
GET /leads?company=TechCorp
```

---

## Webhook Events

The API can send webhook events to your configured endpoint:

- `lead.created` - When a new lead is added
- `lead.qualified` - When a lead is qualified
- `deal.created` - When a new deal is created
- `deal.stage_changed` - When deal stage changes
- `agent.action_completed` - When agent completes an action

Configure webhooks in Settings > Integrations > Webhooks.

---

## SDKs

Official SDKs are available:

- **JavaScript/TypeScript**: `npm install ai-sales-closer`
- **Python**: `pip install ai-sales-closer`
- **Go**: `go get github.com/chocolatsuisse74/ai-sales-closer-go`

---

## Support

For API support:
- Email: api-support@example.com
- Documentation: https://docs.example.com
- GitHub Issues: https://github.com/chocolatsuisse74/ai-sales-closer
