# AI Sales Closer API Documentation

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Base URL](#base-url)
- [Response Format](#response-format)
- [Endpoints](#endpoints)
  - [Leads](#leads)
  - [Deals](#deals)
  - [Agents](#agents)
  - [Activities](#activities)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Examples](#examples)

## Overview

AI Sales Closer provides a comprehensive RESTful API for managing leads, deals, and coordinating AI agents for sales automation.

## Authentication

AI Sales Closer uses bearer token authentication:

```bash
Authorization: Bearer YOUR_API_KEY
```

## Base URL

```
http://localhost:3000/api
```

## Response Format

### Success Response (2xx)

```json
{
  "success": true,
  "data": {},
  "timestamp": "2024-05-15T10:30:00Z"
}
```

### Error Response (4xx, 5xx)

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-05-15T10:30:00Z"
}
```

## Endpoints

### Leads

#### List All Leads

```bash
GET /leads
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status: new, qualified, engaged, proposal, closed, lost |
| `minScore` | number | Filter by minimum qualification score (0-1) |
| `limit` | number | Results per page (default: 20, max: 100) |
| `offset` | number | Pagination offset (default: 0) |

**Example Request:**

```bash
curl -X GET "http://localhost:3000/api/leads?status=qualified&minScore=0.7&limit=10" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### Create Lead

```bash
POST /leads
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@techcompany.com",
  "company": "TechCompany Inc",
  "notes": "Referred by marketing campaign"
}
```

**Example Request:**

```bash
curl -X POST "http://localhost:3000/api/leads" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@techcompany.com",
    "company": "TechCompany Inc"
  }'
```

#### Get Lead Details

```bash
GET /leads/:id
```

**Example Request:**

```bash
curl -X GET "http://localhost:3000/api/leads/lead_123abc" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### Update Lead

```bash
PUT /leads/:id
```

**Request Body:**

```json
{
  "status": "engaged",
  "notes": "Had initial discovery call",
  "score": 0.90
}
```

#### Delete Lead

```bash
DELETE /leads/:id
```

### Deals

#### List All Deals

```bash
GET /deals
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `stage` | string | Filter by stage: discovery, proposal, negotiation, closing, won, lost |
| `minAmount` | number | Filter by minimum deal amount |
| `maxAmount` | number | Filter by maximum deal amount |
| `limit` | number | Results per page (default: 20) |
| `offset` | number | Pagination offset (default: 0) |

**Example Request:**

```bash
curl -X GET "http://localhost:3000/api/deals?stage=proposal&minAmount=50000" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### Create Deal

```bash
POST /deals
```

**Request Body:**

```json
{
  "leadId": "lead_123abc",
  "amount": 75000,
  "stage": "discovery",
  "expectedClosureDate": "2024-06-15"
}
```

#### Update Deal Stage

```bash
PUT /deals/:id/stage
```

**Request Body:**

```json
{
  "stage": "proposal"
}
```

#### Get Deal Details

```bash
GET /deals/:id
```

### Agents

#### List All Agents

```bash
GET /agents
```

Returns all available AI agents and their status.

**Example Request:**

```bash
curl -X GET "http://localhost:3000/api/agents" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Example Response:**

```json
{
  "success": true,
  "data": [
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
      "description": "Manages intelligent lead follow-ups",
      "status": "active"
    }
  ]
}
```

#### Get Agent Status

```bash
GET /agents/:agentType/status
```

**Example Request:**

```bash
curl -X GET "http://localhost:3000/api/agents/lead-qualifier/status" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### Process with Agent

```bash
POST /agents/:agentType/process
```

Send a lead to an agent for processing.

**Request Body:**

```json
{
  "leadId": "lead_123abc",
  "context": "Additional context for the agent"
}
```

**Example Request:**

```bash
curl -X POST "http://localhost:3000/api/agents/lead-qualifier/process" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "leadId": "lead_123abc",
    "context": "Enterprise prospect, $50k budget, needs enterprise features"
  }'
```

### Activities

#### List Activities

```bash
GET /activities
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `leadId` | string | Filter by lead |
| `dealId` | string | Filter by deal |
| `agentId` | string | Filter by agent |
| `type` | string | Filter by activity type |
| `limit` | number | Results per page (default: 50) |

**Example Request:**

```bash
curl -X GET "http://localhost:3000/api/activities?leadId=lead_123abc&limit=10" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Error Handling

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Server Error |

## Rate Limiting

API requests are rate limited:

- **Standard:** 100 requests per minute
- **Burst:** 1000 requests per 5 minutes

Rate limit headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1715768400
```

## Examples

### Complete Lead Management Workflow

#### 1. Create Lead

```bash
curl -X POST "http://localhost:3000/api/leads" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@innovatecorp.com",
    "company": "InnovateCorp"
  }'
```

#### 2. Qualify Lead with Agent

```bash
curl -X POST "http://localhost:3000/api/agents/lead-qualifier/process" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "leadId": "lead_newlead001",
    "context": "500-person tech company, looking for enterprise solutions"
  }'
```

#### 3. Update Lead Status

```bash
curl -X PUT "http://localhost:3000/api/leads/lead_newlead001" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "qualified",
    "score": 0.92
  }'
```

#### 4. Create Deal

```bash
curl -X POST "http://localhost:3000/api/deals" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "leadId": "lead_newlead001",
    "amount": 150000,
    "stage": "discovery",
    "expectedClosureDate": "2024-07-01"
  }'
```

#### 5. Advance Deal Stage

```bash
curl -X PUT "http://localhost:3000/api/deals/deal_newdeal001/stage" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "stage": "proposal"
  }'
```

#### 6. View Activity Timeline

```bash
curl -X GET "http://localhost:3000/api/activities?leadId=lead_newlead001&limit=20" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Python Client Example

```python
import requests

BASE_URL = "http://localhost:3000/api"
API_KEY = "your_api_key_here"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

# Create lead
response = requests.post(
    f"{BASE_URL}/leads",
    json={
        "name": "John Prospect",
        "email": "john@company.com",
        "company": "ProspectCo"
    },
    headers=headers
)

lead = response.json()['data']
print(f"Created lead: {lead['id']}")

# Qualify with agent
response = requests.post(
    f"{BASE_URL}/agents/lead-qualifier/process",
    json={
        "leadId": lead['id'],
        "context": "Large enterprise, strong indicators"
    },
    headers=headers
)

result = response.json()['data']
print(f"Qualification score: {result['metadata']['score']}")
```

### JavaScript/Node.js Example

```javascript
const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
const API_KEY = process.env.API_KEY;

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }
});

async function createAndQualifyLead() {
  try {
    // Create lead
    const leadResponse = await client.post('/leads', {
      name: 'John Prospect',
      email: 'john@company.com',
      company: 'ProspectCo'
    });

    const lead = leadResponse.data.data;
    console.log('Created lead:', lead.id);

    // Qualify with agent
    const qualifyResponse = await client.post(
      `/agents/lead-qualifier/process`,
      {
        leadId: lead.id,
        context: 'Large enterprise, budget approved'
      }
    );

    const qualification = qualifyResponse.data.data;
    console.log('Score:', qualification.metadata.score);

    // Create deal
    const dealResponse = await client.post('/deals', {
      leadId: lead.id,
      amount: 100000,
      stage: 'discovery',
      expectedClosureDate: '2024-06-30'
    });

    const deal = dealResponse.data.data;
    console.log('Created deal:', deal.id);

    return { lead, deal, qualification };
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

createAndQualifyLead();
```

## Health Check

```bash
GET /health
```

Returns API health status:

```json
{
  "status": "ok",
  "timestamp": "2024-05-15T10:30:00Z"
}
```
