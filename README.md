# 🤖 AI Sales Closer

> **Intelligent Sales Automation & Lead Management System**

An advanced AI-powered sales automation platform that helps close deals faster. Uses intelligent agents to manage leads, track conversations, and optimize the sales pipeline.

[![AI Powered](https://img.shields.io/badge/AI%20Powered-Yes-blue)](#-features)
[![Sales Automation](https://img.shields.io/badge/Sales%20Automation-Active-green)](#-features)
[![Status](https://img.shields.io/badge/Status-Active%20Development-yellow)](#-status)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🎯 Overview

AI Sales Closer is a comprehensive solution for modern sales teams. It combines:

- **AI-Powered Agents** - Automated lead qualification and follow-ups
- **Pipeline Management** - Track deals from prospect to close
- **Smart Communication** - Multi-channel outreach
- **Analytics & Insights** - Data-driven decision making
- **CRM Integration** - Works with existing tools

---

## ✨ Features

### 🤖 AI Agents

- **Lead Qualifier Agent** - Automatically rates lead quality
- **Follow-up Agent** - Intelligent reminder system
- **Proposal Generator** - Create customized proposals
- **Close Assistant** - Overcome objections
- **Manager Agent** - Orchestrates all other agents

### 📊 Sales Management

- 📈 Real-time pipeline tracking
- 📞 Call/email logging
- 📋 Activity timeline
- 🎯 Sales forecasting
- 📊 Performance metrics

### 🔄 Automation

- ✅ Automatic lead assignment
- ✅ Scheduled follow-ups
- ✅ Smart reminders
- ✅ Email templates
- ✅ Document generation

### 🔌 Integrations

- CRM systems (Salesforce, HubSpot, etc.)
- Email (Gmail, Outlook, etc.)
- Calendar (Google, Outlook, etc.)
- Slack notifications
- Custom webhooks

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- API keys (see configuration)

### Installation

```bash
# Clone repository
git clone https://github.com/Chocolatsuisse74/ai-sales-closer.git
cd ai-sales-closer

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API keys and settings

# Start application
npm run dev
```

### First Use

1. **Set up integrations** - Connect your CRM, email, calendar
2. **Configure agents** - Set up AI agent parameters
3. **Create sales pipeline** - Define your sales stages
4. **Add first lead** - Test with a sample lead
5. **Monitor results** - Track agent activity

---

## ⚙️ Configuration

### Environment Variables

Create `.env` file:

```env
# AI Configuration
AI_MODEL=claude-3-sonnet
AI_API_KEY=your_api_key_here

# CRM Integration
CRM_TYPE=salesforce  # or hubspot, pipedrive, etc.
CRM_API_KEY=your_crm_key
CRM_API_URL=your_crm_url

# Email Configuration
EMAIL_SERVICE=gmail  # or outlook, custom
EMAIL_ADDRESS=your_email@example.com
EMAIL_API_KEY=your_email_key

# Calendar Integration
CALENDAR_SERVICE=google  # or outlook
CALENDAR_API_KEY=your_calendar_key

# Database
DB_URL=mongodb://localhost/ai-sales-closer
DB_NAME=ai-sales-closer

# Server
PORT=3000
NODE_ENV=development
```

### Agent Configuration

Edit `config/agents.json`:

```json
{
  "agents": {
    "lead_qualifier": {
      "enabled": true,
      "model": "claude-3-sonnet",
      "temperature": 0.7,
      "rules": {
        "min_qualification_score": 0.6
      }
    },
    "follow_up": {
      "enabled": true,
      "schedule": "daily",
      "reminder_days": [1, 3, 7]
    }
  }
}
```

---

## 📁 Project Structure

```
ai-sales-closer/
├── src/
│   ├── agents/           # AI agent implementations
│   ├── controllers/      # API controllers
│   ├── models/           # Data models
│   ├── services/         # Business logic
│   ├── integrations/     # External service connectors
│   ├── utils/            # Utility functions
│   └── main.ts           # Entry point
├── config/               # Configuration files
├── tests/                # Test suite
├── docs/                 # Documentation
├── .github/              # GitHub workflows
├── .env.example          # Example environment
├── package.json
└── README.md
```

---

## 🎮 Agent Types

### Lead Qualifier Agent
Analyzes incoming leads and assigns quality scores:
- Looks at company size, industry, engagement
- Checks budget indicators
- Returns priority ranking

### Follow-up Agent
Manages intelligent follow-up timing:
- Learns best contact times
- Personalizes messages
- Tracks engagement

### Proposal Generator
Creates customized proposals:
- Uses deal info to customize
- Incorporates company research
- Generates professional PDFs

### Close Assistant
Helps overcome objections:
- Recognizes common objections
- Suggests responses
- Tracks objection patterns

### Manager Agent (Orchestrator)
Coordinates all other agents:
- Routes leads appropriately
- Manages agent workflow
- Escalates when needed

---

## 📊 Dashboard

Access the dashboard at `http://localhost:3000/dashboard`

Features:
- **Pipeline View** - See deals at each stage
- **Activity Feed** - Recent agent actions
- **Metrics** - Key sales metrics
- **Agent Status** - Monitor agent health
- **Reports** - Sales analytics

---

## 🔌 API Endpoints

### Leads

```bash
# List leads
GET /api/leads

# Create lead
POST /api/leads
Body: { name, email, company, ... }

# Get lead
GET /api/leads/:id

# Update lead
PUT /api/leads/:id

# Delete lead
DELETE /api/leads/:id
```

### Agents

```bash
# Get agent status
GET /api/agents/:agent_type/status

# Configure agent
PUT /api/agents/:agent_type/config

# Trigger agent action
POST /api/agents/:agent_type/action
```

### Deals

```bash
# List deals
GET /api/deals

# Create deal
POST /api/deals

# Update deal stage
PUT /api/deals/:id/stage
```

---

## 🧪 Testing

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# Integration tests
npm run test:integration
```

---

## 🔒 Security

- ✅ API key encryption
- ✅ Rate limiting
- ✅ Input validation
- ✅ HTTPS required
- ✅ Audit logging
- ✅ Data encryption at rest

---

## 📈 Performance

- ⚡ Optimized agent routing
- 🔄 Efficient queue management
- 📊 Batch processing support
- 🚀 Caching layer
- 🌍 Multi-region ready

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Setup

```bash
# Install dependencies
npm install

# Start dev server with auto-reload
npm run dev

# Watch tests
npm run test:watch

# Build
npm run build
```

---

## 🚀 Deployment

### Docker

```bash
# Build image
docker build -t ai-sales-closer .

# Run container
docker run -e NODE_ENV=production -p 3000:3000 ai-sales-closer
```

### Cloud Platforms

- **Heroku**: `git push heroku main`
- **AWS**: Deploy via Elastic Beanstalk or Lambda
- **Azure**: Deploy to App Service
- **Google Cloud**: Deploy to Cloud Run

### Environment Setup

1. Set up database (MongoDB, PostgreSQL, etc.)
2. Configure API keys in environment
3. Set up integrations (CRM, email, etc.)
4. Run migrations: `npm run migrate`
5. Start application: `npm start`

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file.

---

## 👥 Authors

- **Chocolatsuisse74** - [GitHub](https://github.com/Chocolatsuisse74)

---

## 🆘 Support & Issues

- 📖 [Documentation](./docs)
- 💬 [GitHub Issues](https://github.com/Chocolatsuisse74/ai-sales-closer/issues)
- 🐛 [Bug Reports](CONTRIBUTING.md#reporting-bugs)
- 💡 [Feature Requests](CONTRIBUTING.md#feature-requests)

---

## 🗺️ Roadmap

- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Video call integration
- [ ] Custom AI model training
- [ ] Mobile app
- [ ] Zapier integration
- [ ] White-label version

---

## 📊 Status

- ✅ Core agents implemented
- ✅ API endpoints working
- ✅ CRM integrations available
- 🔄 Advanced analytics (in progress)
- 🔄 Mobile app (planned)

---

**Ready to supercharge your sales?** [Get started](#-quick-start) or [check the docs](./docs) 🚀
