> **🚀 Don't want to self-host?** [Join the waitlist for our fully managed solution →](https://mcpengage.com/jobber)
> 
> Zero setup. Zero maintenance. Just connect and automate.

---

# 🚀 Jobber MCP Server — 2026 Complete Version

## 💡 What This Unlocks

**This MCP server gives AI direct access to your entire Jobber workspace.** Instead of clicking through interfaces, you just *tell* it what you need — and AI handles job management, quoting, invoicing, and client operations at scale via GraphQL.

### ⚡ Field Service Power Moves

Real automation that landscaping, cleaning, HVAC, and field service pros actually use:

1. **Smart Job Pipeline** — *"Show all jobs scheduled for this week, identify conflicts where techs are double-booked, and suggest rescheduling options"*
2. **Quote to Job Acceleration** — *"Pull all quotes sent last month, filter for those awaiting client approval, and create reminder tasks for follow-ups"*
3. **Revenue Forecasting** — *"List all invoices by status, calculate outstanding AR, project cash flow for next 30 days based on payment patterns"*
4. **Client Intelligence** — *"Search clients in Chicago area who haven't booked in 90+ days, pull their service history, and generate re-engagement quotes"*
5. **Workflow Automation** — *"For every new job created today with 'lawn care' tag, auto-generate a quote with standard line items and send to client"*

### 🔗 The Real Power: Combining Tools

AI can chain multiple Jobber operations together via GraphQL:

- Query jobs → Filter by status → Analyze completion times → Optimize scheduling
- Search clients → Identify service patterns → Create targeted quotes → Track conversions
- List invoices → Identify late payments → Generate AR aging reports → Prioritize collections
- Pull job data → Analyze profitability by service type → Adjust pricing strategies

## 📦 What's Inside

**8 Field Service GraphQL Tools** covering job management, quoting, invoicing, and client data:

- `list_jobs` — Query jobs with pagination, filter by status and client
- `get_job` — Get complete job details (line items, schedule, client info, property address)
- `create_job` — Create new jobs with title, client, dates, and line items
- `list_quotes` — Query quotes by status with pagination
- `create_quote` — Build quotes with line items and send to clients
- `list_invoices` — Pull invoice data with amounts, status, and payment tracking
- `list_clients` — Search clients with optional filters and pagination
- `create_client` — Add new clients with contact info and addresses

All with proper error handling, automatic authentication, and TypeScript types. Powered by **Jobber's GraphQL API** for flexible, efficient queries.

## 🚀 Quick Start

### Option 1: Claude Desktop (Local)

1. **Clone and build:**
   ```bash
   git clone https://github.com/BusyBee3333/Jobber-MCP-2026-Complete.git
   cd jobber-mcp-2026-complete
   npm install
   npm run build
   ```

2. **Get your Jobber API credentials via OAuth:**
   
   Jobber uses **OAuth 2.0** for authentication. You'll need to:
   - Register your app at [Jobber Developer Portal](https://developer.getjobber.com)
   - Complete OAuth flow to obtain an access token
   - Tokens are scoped to specific permissions (jobs:read, jobs:write, clients:read, etc.)
   - See [Jobber OAuth Documentation](https://developer.getjobber.com/docs/authentication) for step-by-step guide

3. **Configure Claude Desktop:**
   
   On macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   
   On Windows: `%APPDATA%\Claude\claude_desktop_config.json`

   ```json
   {
     "mcpServers": {
       "jobber": {
         "command": "node",
         "args": ["/ABSOLUTE/PATH/TO/jobber-mcp-2026-complete/dist/index.js"],
         "env": {
           "JOBBER_ACCESS_TOKEN": "your-oauth-access-token-here"
         }
       }
     }
   }
   ```

4. **Restart Claude Desktop**

### Option 2: Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/jobber-mcp)

1. Click the button above
2. Set your Jobber OAuth access token in Railway dashboard
3. Use the Railway URL as your MCP server endpoint

### Option 3: Docker

```bash
docker build -t jobber-mcp .
docker run -p 3000:3000 \
  -e JOBBER_ACCESS_TOKEN=your-token \
  jobber-mcp
```

## 🔐 Authentication

Jobber uses **OAuth 2.0** authentication with a **GraphQL API**.

**GraphQL Endpoint:** `https://api.getjobber.com/api/graphql`

**Required Headers:**
- `Authorization: Bearer YOUR_ACCESS_TOKEN`
- `X-JOBBER-GRAPHQL-VERSION: 2024-12-16` (API version)

The MCP server handles authentication automatically once you provide your OAuth access token in environment variables.

**Getting credentials (OAuth flow):**
1. Register your application at [Jobber Developer Portal](https://developer.getjobber.com)
2. Configure OAuth redirect URIs
3. Initiate OAuth flow to get authorization code
4. Exchange code for access token
5. Use token to authenticate API requests

**Note:** Access tokens may expire; implement token refresh logic for production use.

See the official [Jobber API documentation](https://developer.getjobber.com/docs) and [GraphQL schema reference](https://developer.getjobber.com/docs/api) for details.

## 🎯 Example Prompts for Field Service Pros

Once connected to Claude, use natural language for landscaping, cleaning, HVAC, electrical, and field service workflows:

**Job Management:**
- *"Show me all jobs scheduled for next week with their client names and addresses"*
- *"Create a new lawn care job for client ID abc123, scheduled for tomorrow 9am-11am with standard mowing line items"*
- *"Get full details for job #12345 including line items and total cost"*

**Quoting & Sales:**
- *"List all quotes sent in the past 2 weeks that are still pending client approval"*
- *"Create a quote for spring cleanup service with 3 line items: debris removal, mulching, trimming"*
- *"Show quotes that were approved and check if jobs were created from them"*

**Client Management:**
- *"Search for clients in Seattle area and show their contact info"*
- *"Find clients who had jobs completed last summer but no activity since"*
- *"Create a new client record for 'Green Thumb Apartments' with email and billing address"*

**Invoicing & Revenue:**
- *"List all invoices due this month and show payment status"*
- *"Calculate total outstanding invoice balance across all clients"*
- *"Show invoices with partial payments and identify remaining balances"*

**Business Intelligence:**
- *"For all jobs completed last quarter, calculate average job value by service type"*
- *"Identify top 10 clients by total invoice amount and show their service history"*

**Bulk Operations:**
- *"For all lawn care clients, create seasonal spring quotes with standard packages"*
- *"Export job data from Q4, group by property type (residential vs commercial), analyze profitability"*

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Jobber account with API access (OAuth app registered)

### Setup

```bash
git clone https://github.com/BusyBee3333/Jobber-MCP-2026-Complete.git
cd jobber-mcp-2026-complete
npm install
cp .env.example .env
# Edit .env with your Jobber OAuth access token
npm run build
npm start
```

### Testing

```bash
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

## 🐛 Troubleshooting

### "Authentication failed"
- Verify your OAuth access token is valid and not expired
- Check that your app has the necessary scopes (jobs:read, jobs:write, etc.)
- Ensure your OAuth app is approved in Jobber Developer Portal
- Test your token directly via [Jobber GraphQL Explorer](https://developer.getjobber.com/explorer)

### "Tools not appearing in Claude"
- Restart Claude Desktop after updating config
- Check that the path in `claude_desktop_config.json` is **absolute** (not relative)
- Verify the build completed successfully (`dist/index.js` exists)
- Check Claude Desktop logs (Help → View Logs)

### "GraphQL errors"
- Review error messages for schema validation issues
- Check that field names match Jobber's current GraphQL schema
- Verify API version header (`X-JOBBER-GRAPHQL-VERSION`) matches your schema
- Consult [Jobber GraphQL docs](https://developer.getjobber.com/docs/api) for schema changes

### "Rate limiting"
- Jobber enforces API rate limits per OAuth app
- Use pagination (`first` parameter) to fetch data in smaller chunks
- Implement exponential backoff for retries

## 📖 Resources

- [Jobber API Documentation](https://developer.getjobber.com/docs)
- [Jobber GraphQL Schema Reference](https://developer.getjobber.com/docs/api)
- [Jobber OAuth Guide](https://developer.getjobber.com/docs/authentication)
- [GraphQL Explorer (test queries)](https://developer.getjobber.com/explorer)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [Claude Desktop Documentation](https://claude.ai/desktop)

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-tool`)
3. Commit your changes (`git commit -m 'Add amazing tool'`)
4. Push to the branch (`git push origin feature/amazing-tool`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Credits

Built by [MCPEngage](https://mcpengage.com) — AI infrastructure for field service and business software.

Want more MCP servers? Check out our [full catalog](https://mcpengage.com) covering 30+ business platforms including FieldEdge, Housecall Pro, ServiceTitan, and more.

---

**Questions?** Open an issue or join our [Discord community](https://discord.gg/mcpengage).
