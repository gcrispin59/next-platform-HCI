# NC HCI-CDS Prototype

Multi-agent AI system for North Carolina Home Care Independence Consumer Directed Services.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in Netlify dashboard:
```
NEON_DATABASE_URL=postgresql://[user]:[password]@[host]/[database]
ANTHROPIC_API_KEY=your_claude_api_key
ARMS_API_ENDPOINT=https://arms.nc.gov/api
ARMS_API_KEY=your_arms_key
```

3. Initialize database:
```bash
npm run db:init
```

4. Start development server:
```bash
npm run dev
```

## Architecture

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Netlify Serverless Functions
- **Database**: Neon PostgreSQL
- **AI**: Claude 4 Sonnet multi-agent system
- **Integration**: NC ARMS XML/API

## Features

- ✅ Multi-agent AI orchestration
- ✅ Dynamic form generation
- ✅ ARMS database integration
- ✅ Participant management
- ✅ Care advisor portal
- ✅ FMS vendor integration
- ✅ Quality assurance tracking
- ✅ Document generation
- ✅ Real-time validation

## Project Structure

```
netlify-prototype/
├── netlify/
│   └── functions/          # Serverless API endpoints
├── src/
│   ├── components/         # React components
│   ├── lib/               # Utilities and AI agents
│   ├── pages/             # Application pages
│   └── styles/            # CSS/Tailwind
├── public/                # Static assets
└── database/              # SQL schemas
```

## Deployment

Deploy to Netlify:
```bash
npm run deploy
```

Or connect GitHub repo to Netlify for automatic deployments.
