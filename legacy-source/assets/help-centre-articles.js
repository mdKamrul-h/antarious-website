(function(){
const CATEGORIES = {
  approvals:    {name:"Approvals",    color:"var(--gold)",        tint:"rgba(185,142,46,.10)",  icon:"AP", desc:"Routing, thresholds, queues, and audit-friendly approval workflows."},
  agents:       {name:"Agents",       color:"var(--teal)",        tint:"rgba(15,118,110,.10)",  icon:"AG", desc:"How the 13 specialised agents work, configure, fail over, and learn."},
  audit:        {name:"Audit",        color:"var(--sky)",         tint:"rgba(3,105,161,.10)",   icon:"AU", desc:"Tamper-evident logs, exports, retention, and regulator-ready reports."},
  roles:        {name:"Roles",        color:"var(--violet)",      tint:"rgba(91,33,182,.10)",   icon:"RB", desc:"Role-based access, SSO mapping, custom roles, and break-glass."},
  integrations: {name:"Integrations", color:"var(--coral)",       tint:"rgba(185,28,28,.10)",   icon:"IN", desc:"Slack, Salesforce, NetSuite, webhooks, warehouses, and custom connectors."},
  deployment:   {name:"Deployment",   color:"var(--navy)",        tint:"rgba(31,78,121,.10)",   icon:"DP", desc:"Cloud, on-prem, networking, residency, upgrades, and disaster recovery."},
  data:         {name:"Data",         color:"var(--gold-deep)",   tint:"rgba(142,106,30,.10)",  icon:"DT", desc:"Encryption, retention, PII, BYOK, exports, and deletion."},
  billing:      {name:"Billing",      color:"var(--emerald)",     tint:"rgba(4,120,87,.10)",    icon:"BL", desc:"Plans, invoices, usage, taxes, payment methods, and changes."}
};

const ROLES = {
  founder:    {name:"Founder",    color:"var(--gold)"},
  ops:        {name:"Ops Lead",   color:"var(--teal)"},
  engineer:   {name:"Engineer",   color:"var(--sky)"},
  compliance: {name:"Compliance", color:"var(--violet)"}
};

const JOURNEYS = {
  "getting-started": {name:"Getting started"},
  "daily-ops":       {name:"Daily operations"},
  "scaling":         {name:"Scaling up"},
  "troubleshooting": {name:"Troubleshooting"},
  "reference":       {name:"Reference"}
};

const ARTICLES = [
/* ---------- APPROVALS (8) ---------- */
{slug:"appr-overview", title:"How approvals work in Antarious", category:"approvals", roles:["founder","ops","compliance"], journey:"getting-started",
 summary:"Every action above your threshold pauses for human review. This is the spine of how Antarious stays trustworthy.",
 body:[
  "Antarious is built on the principle that AI agents should never act unilaterally on consequential actions. Every operation is scored against your configured thresholds, and anything that exceeds them lands in an approval queue for a human reviewer.",
  "Approvals carry full context: the agent that proposed the action, the trigger that surfaced it, the data it read, and a one-line justification. Reviewers can approve, reject, or send it back with a comment that becomes part of the audit trail.",
  "Approvals are not a brake — they're how the agents earn trust. Once an approver routinely greenlights a class of action, you can graduate it to an auto-approve rule, with a guardrail that flags drift."
 ],
 bullets:[
  "Default threshold: any action with downstream financial, customer-facing, or data-modification impact above $0.",
  "Reviewers see the full reasoning trace, not just the outcome.",
  "Rejected actions feed back into agent training within 24 hours.",
  "Audit log captures who approved, when, and why."
 ],
 related:["appr-thresholds","appr-chains","appr-auto","audit-overview"]},

{slug:"appr-thresholds", title:"Setting approval thresholds", category:"approvals", roles:["ops","compliance"], journey:"getting-started",
 summary:"Tune what counts as 'consequential' for your team. Thresholds can vary by category, amount, recipient, or risk score.",
 body:[
  "Thresholds live in Settings → Approvals → Thresholds. The default policy holds every agent action at zero, meaning any non-trivial operation requires sign-off until you choose otherwise.",
  "You can scope thresholds three ways: by category (e.g. financial transactions, data exports, external messaging), by counterparty (e.g. always pause for new vendors), or by risk score (each agent assigns one).",
  "Most teams start strict, then loosen specific rules as confidence builds. We recommend reviewing thresholds monthly for the first quarter."
 ],
 bullets:[
  "Stack rules — narrowest match wins.",
  "Use 'shadow mode' to test a relaxed threshold without acting on it.",
  "Set quiet hours: route approvals to backup approvers off-hours.",
  "Threshold history is itself audit-logged."
 ],
 related:["appr-overview","appr-auto","appr-routing","roles-overview"]},

{slug:"appr-chains", title:"Multi-level approval chains", category:"approvals", roles:["ops","compliance","founder"], journey:"scaling",
 summary:"Two-eyes, four-eyes, sequential, or parallel — model your real org.",
 body:[
  "Chain rules let you require multiple approvers for high-stakes actions. A two-eyes policy needs any two approvers; four-eyes needs two from distinct roles. Sequential chains step through approvers in order; parallel chains poll all at once.",
  "You can mix tiers: e.g. anything over $10k requires the team lead, anything over $100k requires both the team lead and finance. Antarious notifies each approver in their preferred channel and surfaces SLA timers.",
  "If a chain stalls beyond its SLA, escalation rules promote the request to the next tier or a designated fallback."
 ],
 bullets:[
  "Templates: two-eyes, four-eyes, board-grade, regulator-grade.",
  "Distinct-role enforcement: same person can't approve twice.",
  "SLA timers in minutes, hours, or business days.",
  "Escalation paths are themselves auditable."
 ],
 related:["appr-overview","appr-thresholds","appr-delegate","roles-overview"]},

{slug:"appr-auto", title:"Auto-approve rules and guardrails", category:"approvals", roles:["ops"], journey:"scaling",
 summary:"Graduate trusted actions into auto-approval — but keep a tripwire.",
 body:[
  "When you've approved 50+ instances of the same kind of action without amendment, Antarious suggests an auto-approve rule. You can accept, reject, or scope it more narrowly.",
  "Every auto-approve rule comes with a guardrail: a drift detector that compares each new instance against the historical pattern and pauses if anything looks unusual. The guardrail is not optional.",
  "Auto-approved actions are still fully audited, with an extra flag indicating they were auto-routed and which rule fired."
 ],
 bullets:[
  "Suggestions appear in Settings → Approvals → Suggestions.",
  "Guardrail thresholds: amount drift, frequency drift, recipient drift.",
  "Auto-approve can be paused globally with one click.",
  "Daily digest shows what was auto-approved and why."
 ],
 related:["appr-overview","appr-thresholds","appr-audit","agents-overview"]},

{slug:"appr-routing", title:"Approval routing by category, amount, or recipient", category:"approvals", roles:["ops","compliance"], journey:"daily-ops",
 summary:"Send the right approval to the right reviewer, without manual triage.",
 body:[
  "Routing rules decide who sees what. They evaluate top-down, first-match-wins, and can dispatch to individuals, groups, channels, or the on-call rotation.",
  "Common patterns: route financial actions to finance, customer-facing actions to the relevant account owner, data exports to security. Anything unmatched falls through to the global default reviewer pool.",
  "When a reviewer is OOO, routing automatically falls back to their delegate, with the substitution recorded in the audit log."
 ],
 bullets:[
  "Match on agent, action type, amount, counterparty, tags, or risk score.",
  "Send via Slack, Teams, email, mobile push, or all four.",
  "Routing rules can themselves require approval to change.",
  "Use the Routing Simulator to dry-run a rule before activating."
 ],
 related:["appr-overview","appr-chains","appr-delegate","int-slack"]},

{slug:"appr-queue", title:"Reviewing the approvals queue", category:"approvals", roles:["ops","founder"], journey:"daily-ops",
 summary:"How to triage 50 approvals in 10 minutes without losing context.",
 body:[
  "The queue groups by urgency, agent, and category. Use keyboard shortcuts (J/K to move, A to approve, R to reject, ? for full list) to clear it fast.",
  "Each item shows the agent's reasoning, the inputs it considered, and a confidence score. You can expand to see the full chain, or hover to preview without committing.",
  "Bulk actions: select multiple low-risk items and approve in one stroke. Antarious will require you to type 'I have reviewed each' before processing more than 20.",
  "Filters persist per user, so your queue view stays consistent across sessions."
 ],
 bullets:[
  "Saved filter presets — e.g. 'urgent, financial, my team'.",
  "Snooze items for up to 24h with a required reason.",
  "Comment on rejection — the agent learns from it.",
  "Mobile push notifications for urgent items."
 ],
 related:["appr-overview","appr-thresholds","audit-search","agents-flagged"]},

{slug:"appr-audit", title:"Approval audit trail", category:"approvals", roles:["compliance","ops"], journey:"reference",
 summary:"Every approval, rejection, comment, and rule change — captured permanently.",
 body:[
  "The approval audit trail is a write-once log of every decision made in your tenant. Each entry records the actor, the timestamp (signed), the action, and the full input/output snapshot.",
  "The trail is tamper-evident: each entry links cryptographically to the previous one. If anyone tampered with a record, the chain breaks and it's flagged automatically.",
  "Auditors and regulators can be granted scoped, read-only access — they see the trail but nothing else in your tenant."
 ],
 bullets:[
  "Retention: 7 years by default, configurable up to 25.",
  "Export to CSV, JSON, or signed PDF.",
  "Cryptographic verification command exposed via API.",
  "Read-only auditor accounts available."
 ],
 related:["audit-overview","audit-export","audit-tamper","appr-overview"]},

{slug:"appr-delegate", title:"Delegating approvals when out of office", category:"approvals", roles:["ops","founder"], journey:"daily-ops",
 summary:"Hand approval authority to a colleague for a window — never your account, just the authority.",
 body:[
  "Delegation gives a colleague your approval rights for a defined window. They never see your account or any other data — only the queue items they're delegated to handle.",
  "Set a date range, a category scope, and (optionally) a maximum amount. The delegate gets a notification and a one-click acceptance.",
  "Every delegated approval is double-tagged: the delegate's name appears alongside yours in the audit log, with a clear 'acting on behalf of' annotation."
 ],
 bullets:[
  "Recurring delegation: e.g. every Friday afternoon.",
  "Compliance-grade trail of who approved on whose behalf.",
  "Delegate cannot re-delegate.",
  "Revoke delegation in one click."
 ],
 related:["appr-routing","appr-chains","roles-overview","appr-overview"]},

/* ---------- AGENTS (8) ---------- */
{slug:"agents-overview", title:"The 13 specialised agents at a glance", category:"agents", roles:["founder","ops","engineer"], journey:"getting-started",
 summary:"Atlas, Lyra, Orion, Vega, Nova, Theta, Iris, Rhea, Helios, Pyx, Cetus, Draco, Phoenix — what each one does.",
 body:[
  "Antarious deploys 13 specialised agents, each with a defined scope. They are not generalist chatbots — every agent has a narrow domain, its own toolset, and clear handoff rules to the others.",
  "The agents collaborate through a shared message bus. When Atlas (data sync) finishes pulling records, it pings Lyra (data quality) automatically. Lyra surfaces anomalies to Iris (operations), who decides whether to escalate to a human or self-heal.",
  "You can pause, scope, or audit any agent independently. Agents inherit your tenant-level approval thresholds — they can never bypass them."
 ],
 bullets:[
  "Atlas — sync between systems · Lyra — data quality · Orion — approvals · Vega — billing & finance",
  "Nova — customer comms · Theta — scheduling · Iris — operations · Rhea — research · Helios — exec briefings",
  "Pyx — security & access · Cetus — integrations · Draco — incident response · Phoenix — reconciliation",
  "Each agent reports to the cockpit; click any dot at the top of the page to see its current state."
 ],
 related:["agents-capabilities","agents-pause","agents-flagged","agents-failover"]},

{slug:"agents-capabilities", title:"Agent capabilities and limits", category:"agents", roles:["engineer","ops"], journey:"reference",
 summary:"What each agent can read, write, and decide — and what is permanently off-limits.",
 body:[
  "Each agent ships with a capability manifest: the tools it can call, the systems it can read from, the systems it can write to, and the actions it cannot perform under any circumstance.",
  "Capabilities are scoped narrowly. Atlas can read CRM contacts but cannot read HR data. Vega can issue invoices but cannot move funds between accounts. The capability matrix is visible in Settings → Agents → Capabilities.",
  "Capabilities can be tightened by an admin but never widened by the agent itself, even via clever prompting. Attempts to escalate are logged and surfaced to security."
 ],
 bullets:[
  "Capability changes require admin approval and are audit-logged.",
  "Each agent has a hard 'never' list that no setting can override.",
  "Agents cannot grant themselves access to new tools.",
  "Capability reviews are recommended quarterly."
 ],
 related:["agents-overview","agents-pause","roles-overview","data-pii"]},

{slug:"agents-pause", title:"Pausing or disabling an agent", category:"agents", roles:["ops","engineer"], journey:"troubleshooting",
 summary:"Pause for an hour, a day, or indefinitely. The cockpit reflects the change instantly.",
 body:[
  "If an agent is misbehaving or needs maintenance, pause it from the cockpit (click the agent dot, then 'Pause'). You can pause for a fixed window or indefinitely.",
  "Paused agents stop accepting new work but preserve in-flight tasks gracefully — they finish what they've started, then halt. Other agents that depend on them route around the gap if possible.",
  "Disabling is harder: it requires an admin and logs a reason. Disabled agents drop in-flight tasks to the dead-letter queue for review."
 ],
 bullets:[
  "Pause is reversible; disable is not without an admin.",
  "Paused agents send a heads-up to dependent agents.",
  "Dead-letter queue retains data for 30 days.",
  "Use 'Pause + drain' for a clean shutdown."
 ],
 related:["agents-overview","agents-flagged","agents-failover","agents-logs"]},

{slug:"agents-logs", title:"Reading agent activity logs", category:"agents", roles:["engineer","compliance"], journey:"troubleshooting",
 summary:"Every action, every reasoning step, every input considered — log-grep your way to root cause.",
 body:[
  "Activity logs capture five layers: trigger, inputs, reasoning trace, tools called, and outcome. They're queryable by agent, time window, status, and free-text.",
  "Reasoning traces are the most valuable layer for debugging. They show what the agent considered, what it ruled out, and why. Traces are kept for 30 days by default, longer for actions that triggered approvals.",
  "Logs export to your SIEM via Cetus (the integrations agent), or download as JSON for offline analysis."
 ],
 bullets:[
  "Filter syntax: agent:atlas status:flagged after:7d",
  "Reasoning traces are included in approval audit records.",
  "Logs are immutable once written.",
  "Search returns up to 10,000 hits; refine for more."
 ],
 related:["agents-overview","audit-search","audit-overview","agents-flagged"]},

{slug:"agents-config", title:"Custom agent configuration", category:"agents", roles:["engineer","ops"], journey:"scaling",
 summary:"Tune temperature, allowed tools, retry policy, and escalation rules per agent.",
 body:[
  "Each agent exposes a configuration profile: model temperature, tool allowlist, retry policy, escalation thresholds, and prompt prefix. Changes apply immediately and are versioned.",
  "Most teams leave defaults in place. Common customisations: tightening temperature for compliance-sensitive agents, expanding the tool allowlist for engineering, and adjusting escalation to match the org chart.",
  "Bad configurations can be rolled back with one click — every config change is a discrete revision."
 ],
 bullets:[
  "Config diff view shows exactly what changed and who changed it.",
  "Test changes in 'shadow mode' before promoting to production.",
  "Templates: conservative, balanced, exploratory.",
  "Per-agent config can be overridden by tenant-wide policy."
 ],
 related:["agents-capabilities","agents-failover","agents-overview","deploy-upgrade"]},

{slug:"agents-failover", title:"Agent failover and redundancy", category:"agents", roles:["engineer","ops"], journey:"scaling",
 summary:"Each agent runs primary + warm secondary. If the primary stalls, the secondary takes over within seconds.",
 body:[
  "Agents are deployed in primary/secondary pairs. The primary handles all live traffic; the secondary mirrors state and is ready to take over within five seconds if the primary becomes unhealthy.",
  "Failover is automatic and transparent — your dashboards keep working, and in-flight approvals are not lost. The cockpit logs the failover event but does not interrupt your session.",
  "If both fail, the agent enters degraded mode: it accepts no new work, holds existing work, and pages the on-call team."
 ],
 bullets:[
  "Failover detection: heartbeat + health probe, every 2s.",
  "RTO under 5s, RPO under 1s for agent state.",
  "Read-only standby in a second region for cross-region resilience.",
  "Quarterly failover drills run automatically."
 ],
 related:["agents-overview","deploy-dr","deploy-upgrade","agents-pause"]},

{slug:"agents-flagged", title:"Why an agent flagged for review", category:"agents", roles:["ops","compliance"], journey:"troubleshooting",
 summary:"When an agent stops and asks for help, it's a feature — not a failure. Read the reasoning, decide, move on.",
 body:[
  "Agents flag when they hit any of: an approval threshold, a confidence floor, a capability limit, or a pre-set rule (e.g. 'always flag exports of 1k+ rows'). The flag is not an error — it's the safety mechanism working.",
  "Each flag carries: the trigger, the agent's confidence, what it considered, and a recommended action. Most flags resolve in under 30 seconds: read, decide, move on.",
  "Frequent flags from the same agent on similar inputs are a signal to either widen the agent's capability or train it on more examples."
 ],
 bullets:[
  "Flag dashboard groups recurrent patterns.",
  "Resolve a flag with approve, reject, or amend.",
  "Comments on flags become training signal.",
  "Flag rate per agent is a top-line health metric."
 ],
 related:["appr-overview","agents-overview","agents-logs","agents-config"]},

{slug:"agents-add", title:"Adding a new agent role", category:"agents", roles:["engineer","founder"], journey:"scaling",
 summary:"Custom agents extend the 13 — for your unique workflow.",
 body:[
  "If your workflow doesn't map cleanly to the 13 default agents, you can add a custom agent. They run on the same infrastructure, inherit the same audit and approval rules, and live in the cockpit alongside the others.",
  "Custom agents start from one of three templates: read-only analyst, action-taking operator, or conversational assistant. From there you define scope, tools, escalation, and the approval categories the agent inherits.",
  "Custom agents are isolated in their own VM until you promote them. Promotion requires a security review and an admin sign-off."
 ],
 bullets:[
  "Maximum 10 custom agents per tenant on Standard, unlimited on Enterprise.",
  "Custom agent IDs are namespaced under your tenant.",
  "All custom agents are subject to the tenant-level capability matrix.",
  "Antarious can review your design before promotion if you ask."
 ],
 related:["agents-overview","agents-config","deploy-upgrade","int-custom"]},

/* ---------- AUDIT (8) ---------- */
{slug:"audit-overview", title:"What's recorded in your audit log", category:"audit", roles:["compliance","engineer","founder"], journey:"getting-started",
 summary:"Every action, every approval, every config change — written once, signed, and replayable.",
 body:[
  "The audit log is the single source of truth for everything that happened in your Antarious tenant. It records user actions, agent actions, approvals, rejections, configuration changes, role assignments, and system events.",
  "Each entry is signed at write time. The signatures form a hash chain, so any tampering breaks the chain and is detectable instantly. The log is write-once, append-only, and never editable — even by admins.",
  "Logs are queryable through the UI, the API, or your SIEM via the Cetus integration."
 ],
 bullets:[
  "Default retention: 7 years. Configurable up to 25 years on Enterprise.",
  "Standard fields: timestamp, actor, action, target, before/after snapshot, IP, session.",
  "Cryptographic verification CLI: antarious audit verify <range>.",
  "Logs survive tenant deletion (held in escrow per contract)."
 ],
 related:["audit-search","audit-export","audit-tamper","appr-audit"]},

{slug:"audit-search", title:"Searching the audit trail", category:"audit", roles:["compliance","engineer"], journey:"daily-ops",
 summary:"Filter, free-text, regex, time-window. The query language is small but powerful.",
 body:[
  "Search supports a compact filter syntax: actor:alice action:approve target:invoice category:financial after:2026-01-01. Filters can be combined and inverted (NOT actor:alice).",
  "Free-text search runs across action narratives and comment fields. Regex is allowed but throttled. For very large windows, use the export-then-grep workflow described in 'Exporting audit logs'.",
  "Saved searches let you replay an investigation. Every search is itself audit-logged with the actor and the query."
 ],
 bullets:[
  "Operators: AND, OR, NOT, parentheses, =, !=, ~, in().",
  "Time windows: absolute (2026-01-01..2026-02-01), relative (last 7d), or named (this-quarter).",
  "Up to 50,000 results per query; refine to narrow further.",
  "Search history retained for 90 days."
 ],
 related:["audit-overview","audit-export","appr-audit","audit-investigate"]},

{slug:"audit-export", title:"Exporting audit logs for compliance", category:"audit", roles:["compliance"], journey:"reference",
 summary:"CSV, JSON, signed PDF, or direct SIEM stream — pick what your auditor expects.",
 body:[
  "Exports are scoped: define a time window, the actors or actions you care about, and the format. The export job runs in the background; you'll be notified by email when it's ready.",
  "Signed PDF is the regulator-friendly format — each page carries the cryptographic signature and a verification URL. CSV/JSON are best for ingestion into your own tooling.",
  "Direct SIEM streaming via Cetus is the lowest-friction option for ongoing compliance: events forward in near-real-time to Splunk, Datadog, or your warehouse."
 ],
 bullets:[
  "Export size limit: 10GB per job, run multiple jobs for larger windows.",
  "Exports are themselves audit-logged.",
  "Signed PDFs are tamper-evident — opening in any PDF reader works.",
  "SIEM stream uses TLS 1.3 and your tenant-specific signing key."
 ],
 related:["audit-overview","audit-search","audit-retention","int-warehouse"]},

{slug:"audit-retention", title:"Audit retention and archival", category:"audit", roles:["compliance"], journey:"reference",
 summary:"7 years default, 25 max, configurable per record class. Pre-archive logs are queryable; archived ones are restorable.",
 body:[
  "Retention is set per record class (approvals, agent actions, config changes, etc.). The default is 7 years for everything, which covers most regulatory requirements (SOX, GDPR, HIPAA).",
  "After retention expires, records move to cold archive. They remain restorable for an additional grace period (180 days), after which they are permanently deleted with a tombstone left in the active log.",
  "Some record classes have legally enforced minimums (e.g. financial: 7 years for SOX). Antarious will block any setting that violates these."
 ],
 bullets:[
  "Cold archive: cheaper storage, queryable with 24h SLA.",
  "Permanent deletion is logged with a tombstone for audit.",
  "Per-class minimums are enforced based on detected jurisdiction.",
  "Legal hold pauses deletion entirely."
 ],
 related:["audit-overview","audit-export","data-retention","audit-overview"]},

{slug:"audit-tamper", title:"Tamper-evident logging explained", category:"audit", roles:["compliance","engineer"], journey:"reference",
 summary:"How the hash chain works, why it matters, and how to verify integrity yourself.",
 body:[
  "Each audit entry includes the SHA-256 of itself plus the previous entry's hash. The chain is anchored hourly to a public timestamping service (RFC 3161) and weekly to a permissioned blockchain.",
  "If anyone — including Antarious staff — modifies a past entry, the hashes diverge from that point forward and any verification breaks. The break is flagged by the integrity monitor within minutes.",
  "You can verify integrity yourself with the CLI tool, or have your auditor do so. The verification process needs only your tenant's public key."
 ],
 bullets:[
  "Verification command: antarious audit verify --range last-30d",
  "Public anchors: opentimestamps.org + private blockchain.",
  "Even a single-character change breaks verification.",
  "Antarious cannot fix a broken chain — you'll be informed and asked how to proceed."
 ],
 related:["audit-overview","audit-investigate","audit-overview","data-keys"]},

{slug:"audit-siem", title:"Audit log integrations (SIEM)", category:"audit", roles:["engineer","compliance"], journey:"scaling",
 summary:"Stream events to Splunk, Datadog, Sumo, Elastic, or your warehouse — in near-real-time.",
 body:[
  "Cetus, the integrations agent, can forward audit events to your SIEM continuously. Latency from event to SIEM is typically under 30 seconds.",
  "Setup is two steps: add a SIEM destination in Settings → Integrations → SIEM, paste the credentials, and pick the event classes to forward. Common patterns: forward all approvals, all agent flags, and all role changes.",
  "Forwarded events keep their cryptographic signatures, so you can verify integrity in your SIEM without round-tripping back to Antarious."
 ],
 bullets:[
  "Supported targets: Splunk, Datadog, Sumo Logic, Elastic, Snowflake, BigQuery, S3, Azure Log Analytics.",
  "Schema docs: docs.antarious.com/audit-schema",
  "Replay last N days on demand if your SIEM was down.",
  "Sampling allowed but discouraged — most teams forward 100%."
 ],
 related:["audit-export","audit-overview","int-warehouse","int-custom"]},

{slug:"audit-investigate", title:"Investigating a flagged event", category:"audit", roles:["compliance","engineer"], journey:"troubleshooting",
 summary:"From a single anomaly to a full timeline in three queries.",
 body:[
  "Start with the flagged record's ID. Pull its full reasoning trace, then pivot on the actor, the target, and the session — those three pivots usually surface adjacent activity.",
  "Use the timeline view (Audit → Investigate → Timeline) to lay everything out chronologically. Bookmark the timeline; it's stable and shareable with auditors.",
  "If the investigation needs to extend beyond your tenant's logs (for example, into Slack or Salesforce), Cetus can pull correlating events from those systems on demand."
 ],
 bullets:[
  "Pivots: actor, target, session, IP, agent, time window.",
  "Timeline supports up to 10,000 events.",
  "Annotated timelines are exportable as a signed PDF.",
  "Investigations are themselves audit-logged."
 ],
 related:["audit-search","audit-overview","agents-flagged","appr-audit"]},

{slug:"audit-reports", title:"Audit reports for board, regulators, and customers", category:"audit", roles:["compliance","founder"], journey:"reference",
 summary:"Pre-built templates for common reporting needs: SOC 2, board pack, customer DPA, regulator response.",
 body:[
  "Antarious ships pre-built report templates that pull directly from the audit log: SOC 2 Type II evidence, ISO 27001 controls, GDPR Article 30 records, board oversight summaries, and customer Data Processing Agreement (DPA) evidence packs.",
  "Each template renders to a signed PDF with embedded evidence — no manual screenshotting, no copy-paste errors. Templates accept parameters (e.g. customer name, reporting period) and remember your last run.",
  "If you need a custom template, the report builder accepts a YAML spec; common customisations are answered in the template gallery."
 ],
 bullets:[
  "Run on demand or schedule (monthly, quarterly, annually).",
  "Reports inherit the signing chain — auditors trust the artefact.",
  "Custom templates can be reviewed by Antarious before first use.",
  "Report runs are themselves audit-logged."
 ],
 related:["audit-export","audit-overview","audit-overview","data-export"]},

/* ---------- ROLES (8) ---------- */
{slug:"roles-overview", title:"Role-based access control overview", category:"roles", roles:["compliance","engineer","ops"], journey:"getting-started",
 summary:"Roles bundle permissions; people get roles. The whole model is auditable and reversible.",
 body:[
  "Antarious uses RBAC: a role is a named bundle of permissions, and a user gets one or more roles. Permissions are fine-grained — read/write/execute on each resource and each agent.",
  "Default roles cover most needs out of the box: Admin, Approver, Reviewer, Engineer, Compliance, Read-only, Auditor, and Service. Custom roles fill in the gaps.",
  "Every role assignment, change, and revocation is audit-logged. Roles can be time-bound (e.g. for a contractor) and tied to SSO group membership."
 ],
 bullets:[
  "Permissions are inheritable — Admin includes Approver includes Reviewer.",
  "Roles never grant retroactive access (logs can't be re-read because of a role change).",
  "Service accounts have their own role family.",
  "Quarterly role review reminders built in."
 ],
 related:["roles-default","roles-custom","roles-sso","roles-review"]},

{slug:"roles-default", title:"Default roles and permissions", category:"roles", roles:["engineer","compliance"], journey:"reference",
 summary:"What each default role sees, does, and cannot do.",
 body:[
  "Default roles are designed to cover 90% of usage with zero configuration. Admin can configure everything except billing. Approver can review and approve queue items in their assigned categories. Reviewer can read approval queues and comment but not approve.",
  "Engineer covers integration setup, agent configuration, and read access to logs. Compliance covers audit search, exports, retention, and read access to everything except live data. Read-only is exactly what it sounds like.",
  "Auditor is special: external read-only access scoped to the audit log only. Service is for non-human accounts (CI, automations) with action-but-not-config access."
 ],
 bullets:[
  "Admin cannot grant themselves Billing rights — that's separated.",
  "Approver can be scoped by category or by amount.",
  "Compliance cannot delete or modify records.",
  "Service accounts must rotate credentials every 90 days."
 ],
 related:["roles-overview","roles-custom","roles-sso","data-pii"]},

{slug:"roles-custom", title:"Creating a custom role", category:"roles", roles:["engineer","compliance"], journey:"scaling",
 summary:"Compose permissions from the catalogue, save, assign. Three minutes for the common cases.",
 body:[
  "Custom roles are built from a permission catalogue (about 240 fine-grained permissions). The role builder shows what the role can and cannot do as you toggle each permission, and warns about combinations that are unsafe.",
  "Common patterns: 'Finance Approver' (approve only financial, up to $50k), 'External Auditor' (read-only audit log for the last quarter), 'Vendor Manager' (read CRM, comment on approvals).",
  "Custom roles can be reviewed and approved by an admin before first assignment, depending on your tenant's settings."
 ],
 bullets:[
  "Start from a default role to save time.",
  "Test a custom role by assigning to a test user first.",
  "Custom role changes propagate within 60 seconds.",
  "Antarious flags risky combinations (e.g. read+delete on audit)."
 ],
 related:["roles-overview","roles-default","roles-sso","audit-overview"]},

{slug:"roles-assign", title:"Assigning and revoking roles", category:"roles", roles:["ops","engineer"], journey:"daily-ops",
 summary:"One person, multiple roles, optional time bounds. Revocation takes effect within a minute.",
 body:[
  "Assign roles in Settings → People → [user] → Roles. You can assign multiple roles per user — permissions are unioned, never intersected.",
  "Time-bound assignments (e.g. for a 2-week contractor) auto-expire and surface a notification a week before. They cannot be silently extended; an extension is a new assignment with its own audit trail.",
  "Revocation is immediate: within 60 seconds, the user's session refreshes and they lose access. In-flight actions are completed; new ones are blocked."
 ],
 bullets:[
  "Bulk assign via CSV or SCIM.",
  "Revocation pauses any in-flight actions over the user's threshold.",
  "Reactivation requires a fresh assignment.",
  "Self-revocation is supported for short-lived elevations."
 ],
 related:["roles-overview","roles-sso","roles-review","roles-emergency"]},

{slug:"roles-sso", title:"SSO and role mapping", category:"roles", roles:["engineer"], journey:"getting-started",
 summary:"Map your IdP groups to Antarious roles once. Updates flow automatically.",
 body:[
  "SSO works with any SAML 2.0 or OIDC provider — Okta, Azure AD, Google, Auth0, JumpCloud, OneLogin, and others. Setup is in Settings → SSO and takes about 15 minutes.",
  "Role mapping is the key step: each IdP group becomes an Antarious role. When a user is added to or removed from a group in your IdP, their roles update in Antarious within 5 minutes via SCIM.",
  "If you don't use SCIM, role updates happen at the user's next login. SCIM is strongly recommended for compliance-grade workflows."
 ],
 bullets:[
  "Just-in-time provisioning supported.",
  "MFA enforcement inherited from your IdP.",
  "SCIM 2.0 for automated provisioning/deprovisioning.",
  "Backup local admin available for SSO outages."
 ],
 related:["roles-overview","deploy-sso","roles-assign","roles-emergency"]},

{slug:"roles-service", title:"Service accounts and machine roles", category:"roles", roles:["engineer"], journey:"scaling",
 summary:"For CI, automations, and other non-humans. Same RBAC, with credential rotation.",
 body:[
  "Service accounts let non-human actors (CI pipelines, scripts, scheduled jobs) interact with Antarious. They use API keys or mTLS certificates rather than SSO.",
  "Service accounts have their own role family — they can be granted action permissions but not configuration permissions, and they cannot create other service accounts.",
  "Credentials must rotate every 90 days. Antarious nags at 60 days, hard-stops the account at 90."
 ],
 bullets:[
  "API keys, mTLS, or workload identity (Spiffe/Spire).",
  "Per-environment scoping (dev, stage, prod).",
  "Rotation is one click; old creds are revocable instantly.",
  "All service-account actions are tagged in audit."
 ],
 related:["roles-overview","int-custom","deploy-network","data-keys"]},

{slug:"roles-emergency", title:"Emergency access and break-glass", category:"roles", roles:["compliance","engineer"], journey:"reference",
 summary:"For when SSO is down or a human can't be reached. Loud, time-bound, audited.",
 body:[
  "Break-glass accounts exist for rare emergencies: SSO outage, regulator demand, data subject access request that can't wait. They are not a regular operations tool.",
  "Activation requires two admins and a written reason. Once activated, the account has elevated access for a hard 4-hour window, after which it auto-revokes regardless of what you do.",
  "Every break-glass session is recorded in fine detail: every keystroke, every API call, every file accessed. Sessions are reviewed by compliance within 24 hours."
 ],
 bullets:[
  "Two-person activation, signed reason required.",
  "Session recording with auto-redaction of secrets.",
  "Auto-revocation at 4 hours, no extension.",
  "Mandatory post-mortem within 5 business days."
 ],
 related:["roles-sso","roles-overview","audit-overview","audit-overview"]},

{slug:"roles-review", title:"Reviewing role assignments quarterly", category:"roles", roles:["compliance"], journey:"reference",
 summary:"Antarious queues a role review every quarter. Confirm, revoke, or scope down — in 30 minutes.",
 body:[
  "Quarterly role reviews are a SOC 2 / ISO 27001 control. Antarious automates the queue: at the start of each quarter, every role assignment is queued for review by the assigning admin.",
  "Review options: confirm, revoke, scope down (e.g. drop a permission), time-bound (e.g. 'only until next review'). The reviewer adds a one-line justification.",
  "If a review is skipped, the assignment auto-revokes after 30 days. The grace period is configurable per tenant."
 ],
 bullets:[
  "Reviews are bundled into a single dashboard for efficiency.",
  "Auto-revocation after grace period — no exceptions.",
  "Reviewer cannot review their own assignments.",
  "Review evidence becomes audit log artefact."
 ],
 related:["roles-overview","audit-overview","audit-overview","roles-assign"]},

/* ---------- INTEGRATIONS (8) ---------- */
{slug:"int-slack", title:"Connecting Slack, Teams, and email", category:"integrations", roles:["ops","engineer"], journey:"getting-started",
 summary:"Where your team already works — Antarious shows up there. Approvals, alerts, and Freya summons.",
 body:[
  "Antarious integrates with Slack, Microsoft Teams, and email so approvals and alerts surface in the channel where your team already works. Each integration takes ~5 minutes to set up.",
  "Approvals appear as interactive cards: approve, reject, or open a thread to discuss. Replies feed back into the audit trail. Freya can be summoned in Slack or Teams with a slash command.",
  "Per-channel routing means alerts go where they're useful — security alerts to #sec, billing approvals to #finance, customer-facing communications to your CS channel."
 ],
 bullets:[
  "OAuth setup; no agent install required.",
  "Per-user notification preferences override channel defaults.",
  "Threads and reactions sync to the audit trail.",
  "Email approvals supported via reply-to-approve."
 ],
 related:["int-crm","int-erp","appr-routing","agents-overview"]},

{slug:"int-crm", title:"CRM integrations (Salesforce, HubSpot, Pipedrive)", category:"integrations", roles:["ops","engineer"], journey:"getting-started",
 summary:"Read contacts, write activities, sync opportunities — read-only by default.",
 body:[
  "CRM integrations let agents (especially Atlas, Nova, and Helios) read your customer data, write back activities, and surface opportunities to humans. Default mode is read + write activities, but never edit deal stages without an approval.",
  "Setup is OAuth for Salesforce and HubSpot; API key for Pipedrive. Field mapping is auto-detected with a UI to override; most tenants accept the defaults.",
  "All CRM writes flow through the approval system — no agent silently mutates your CRM."
 ],
 bullets:[
  "Initial sync: ~10 minutes for 100k records.",
  "Bidirectional sync supported; approval required to enable.",
  "Custom objects and custom fields fully supported.",
  "Field-level access controls respected."
 ],
 related:["int-slack","int-erp","int-warehouse","data-pii"]},

{slug:"int-erp", title:"ERP integrations (NetSuite, SAP, Microsoft Dynamics)", category:"integrations", roles:["engineer"], journey:"scaling",
 summary:"Vega and Phoenix talk to your ERP for billing, reconciliation, and finance ops.",
 body:[
  "ERP integrations are deeper than CRM and require more care. The setup process includes a guided field mapping, a sandbox sync, and a sign-off step before any data flows in production.",
  "Vega (finance) handles invoicing and payment reconciliation. Phoenix handles month-end close support. Both operate exclusively through the approval system for ERP writes — no exceptions.",
  "ERP integrations support write-back via either the native API or middleware (MuleSoft, Boomi). Native is preferred for performance."
 ],
 bullets:[
  "Initial integration: 1-2 weeks with our team's support included.",
  "Sandbox-first: test in your ERP sandbox before production.",
  "Read latency: under 5 minutes; write latency: minutes to hours per ERP rules.",
  "Custom objects supported with field-mapping UI."
 ],
 related:["int-crm","int-warehouse","appr-overview","audit-overview"]},

{slug:"int-webhooks", title:"Webhooks and API basics", category:"integrations", roles:["engineer"], journey:"reference",
 summary:"REST + webhooks for everything else. Signed payloads, idempotent retries, and a Postman collection.",
 body:[
  "The Antarious API is a small, REST-shaped surface for tenant administration, approvals, and audit access. Outbound webhooks fire on every approval, agent flag, role change, and config change.",
  "Webhooks are signed (HMAC-SHA256). Verify the signature before processing — the signing key is in Settings → Integrations → Webhooks. Retries follow exponential backoff up to 24 hours, idempotency keys prevent duplicate processing.",
  "API rate limits are generous (1000 req/min) with burst tolerance. The OpenAPI spec is at docs.antarious.com/api."
 ],
 bullets:[
  "All API calls require an API key with explicit scope.",
  "Webhook delivery has at-least-once semantics.",
  "Postman collection and SDKs in TS, Python, Go.",
  "Sandbox tenant available for integration testing."
 ],
 related:["int-custom","int-warehouse","agents-add","data-keys"]},

{slug:"int-warehouse", title:"Data warehouse sync (Snowflake, BigQuery, Redshift)", category:"integrations", roles:["engineer","ops"], journey:"scaling",
 summary:"Stream tenant data and audit events to your warehouse for analytics — no data leaves your control plane unnecessarily.",
 body:[
  "Warehouse sync forwards your audit log, agent activity, and configurable subset of operational data to your own warehouse. Latency is under 60 seconds for hot events, batch-loaded for cold.",
  "Authentication uses your warehouse's native mechanisms: key-pair for Snowflake, service account for BigQuery, IAM role for Redshift. Antarious never stores warehouse credentials in clear text.",
  "Schemas are stable and versioned. Schema changes follow a 90-day deprecation window with email notice."
 ],
 bullets:[
  "Supported: Snowflake, BigQuery, Redshift, Databricks, Postgres.",
  "Stream + batch hybrid loading.",
  "Schemas: docs.antarious.com/warehouse-schemas",
  "Backfill up to 13 months on demand."
 ],
 related:["audit-siem","int-webhooks","data-export","int-custom"]},

{slug:"int-calendar", title:"Calendar integrations (Google, Outlook)", category:"integrations", roles:["ops"], journey:"daily-ops",
 summary:"Theta knows when you're available — and when not to interrupt.",
 body:[
  "Calendar integration lets Theta (the scheduling agent) coordinate timing for approvals, scheduled actions, and human availability. It reads availability metadata only — never event content.",
  "Privacy-first: Antarious never stores calendar events themselves, only free/busy intervals. The integration honours your IdP's calendar permissions.",
  "Common uses: route urgent approvals away from people in deep-work blocks, schedule monthly reports for when the recipient is available, suggest delegation when an approver will be OOO."
 ],
 bullets:[
  "Free/busy only — no event titles, attendees, or descriptions.",
  "Per-user opt-out available.",
  "Latency: 30 seconds from calendar update.",
  "Works with shared calendars at the user's permission level."
 ],
 related:["int-slack","appr-delegate","data-pii","data-export"]},

{slug:"int-storage", title:"Document storage (Drive, SharePoint, Dropbox, Box)", category:"integrations", roles:["engineer","compliance"], journey:"scaling",
 summary:"Read or write specific folders. Antarious can attach to approvals or pull context for agents.",
 body:[
  "Document storage integrations let agents read shared documents (e.g. policies, contracts, knowledge bases) and write artefacts (e.g. signed reports, exports) to a designated folder.",
  "Scope is folder-level. The agent never gets blanket access to your drive — only the folders you explicitly designate. Permissions are enforced per file at read time.",
  "Files attached to approvals are watermarked with the approval ID so they're traceable back to the decision they supported."
 ],
 bullets:[
  "Folder-scoped, never blanket access.",
  "Read-only by default; write requires admin consent.",
  "All accesses are audit-logged.",
  "Watermarking on writes."
 ],
 related:["int-warehouse","data-pii","audit-overview","audit-overview"]},

{slug:"int-custom", title:"Building a custom connector", category:"integrations", roles:["engineer"], journey:"scaling",
 summary:"For internal systems we don't ship out-of-the-box — a small SDK and a pattern.",
 body:[
  "If your system isn't on the integrations list, you can build a custom connector. The connector SDK is available in TypeScript, Python, and Go, and ships with three example connectors covering common patterns.",
  "Connectors run in a sandbox VM in your tenant — they cannot access other tenants' data, the rest of the Antarious stack, or the public internet without explicit allowlisting.",
  "Connectors must declare their capabilities (read/write/delete on what kinds of resources). Capabilities are enforced at runtime and audit-logged."
 ],
 bullets:[
  "Sandboxed runtime, network allowlist required.",
  "Pre-built scaffolds for REST, GraphQL, gRPC, JDBC.",
  "Mandatory capability manifest.",
  "Antarious can review your connector before promotion."
 ],
 related:["int-webhooks","agents-add","deploy-network","audit-overview"]},

/* ---------- DEPLOYMENT (8) ---------- */
{slug:"deploy-cloud-onprem", title:"Cloud vs on-prem deployment", category:"deployment", roles:["engineer","founder"], journey:"getting-started",
 summary:"SaaS, single-tenant cloud, or fully on-prem. Three modes, same product.",
 body:[
  "Antarious ships in three deployment modes. Multi-tenant SaaS is the fastest start (minutes) and best for most teams. Single-tenant cloud (your own VPC) gives you isolated infrastructure with the operational simplicity of SaaS. On-prem (your own data centre or air-gapped network) is for teams with the strictest residency requirements.",
  "Feature parity is identical across modes. Latency is similar. Pricing differs — SaaS is per-seat, single-tenant adds infra cost, on-prem is annual licence + your operations.",
  "You can start on SaaS and migrate to single-tenant or on-prem later. The migration is staffed by Antarious."
 ],
 bullets:[
  "SaaS: hours to deploy, $99/seat starting.",
  "Single-tenant: 1-2 weeks, your AWS/GCP/Azure account.",
  "On-prem: 4-8 weeks, your hardware or air-gapped.",
  "Migration paths between modes supported."
 ],
 related:["deploy-checklist","deploy-network","deploy-residency","deploy-dr"]},

{slug:"deploy-checklist", title:"Initial provisioning checklist", category:"deployment", roles:["engineer"], journey:"getting-started",
 summary:"Twelve items, in order. Most teams complete in a day.",
 body:[
  "Start with the basics: confirm your deployment mode, identify your admin team (minimum two), pick your data residency region, and choose your SSO provider. Then move to access: provision your IdP, configure SSO, and create the initial admin role assignments.",
  "Next, integrations: pick one CRM, one comms (Slack/Teams), and one calendar to start. Don't connect everything at once — confidence comes from running the basics first. Then test the approval flow end-to-end with a non-production action.",
  "Finally, audit: confirm the audit log is populating, verify a signed export, and walk through your first compliance template. You're ready for production."
 ],
 bullets:[
  "Required: 2 admins, IdP, region, comms tool.",
  "Recommended: SIEM destination configured before go-live.",
  "Pilot phase: one team, two weeks, daily check-ins.",
  "Go-live readiness checklist signed off by Antarious."
 ],
 related:["deploy-cloud-onprem","deploy-network","deploy-sso","deploy-dr"]},

{slug:"deploy-network", title:"Network and firewall requirements", category:"deployment", roles:["engineer"], journey:"reference",
 summary:"What ports, what egress, what allowlists. The full topology in one page.",
 body:[
  "For SaaS, only outbound HTTPS to *.antarious.com is needed from your IdP and any system you integrate (CRM, ERP, etc.). Antarious never initiates connections into your network.",
  "Single-tenant cloud follows the same outbound pattern but in your VPC. Required AWS/GCP/Azure services are documented per-cloud (compute, storage, KMS, network).",
  "On-prem requires a hardened network plan: minimum three nodes for HA, dedicated subnet, firewall rules in the doc, optional reverse proxy."
 ],
 bullets:[
  "Outbound only — no inbound from Antarious to you.",
  "Optional VPC peering for high-throughput CRM/ERP.",
  "Air-gapped on-prem documented and supported.",
  "DNS and SSL certificate requirements per mode."
 ],
 related:["deploy-cloud-onprem","deploy-checklist","deploy-residency","data-encryption"]},

{slug:"deploy-sso", title:"SSO setup (Okta, Azure AD, Google, others)", category:"deployment", roles:["engineer"], journey:"getting-started",
 summary:"15-20 minutes per IdP. Step-by-step screenshots in the docs.",
 body:[
  "SSO is required for production and recommended for trial. Setup is done in two places: your IdP (configure an Antarious app) and Antarious (paste IdP metadata).",
  "We support SAML 2.0 and OIDC. Step-by-step guides exist for Okta, Azure AD, Google, OneLogin, JumpCloud, Auth0, Ping. SCIM provisioning is recommended for compliance-grade workflows.",
  "If your IdP isn't on the list, generic SAML/OIDC configuration is supported with a 30-minute call with our team."
 ],
 bullets:[
  "MFA required by Antarious for admin roles.",
  "Just-in-time user creation.",
  "Group-to-role mapping in the SSO config.",
  "Session length configurable (default 12h)."
 ],
 related:["deploy-checklist","roles-sso","deploy-network","roles-emergency"]},

{slug:"deploy-residency", title:"Data residency options", category:"deployment", roles:["compliance","engineer"], journey:"getting-started",
 summary:"US, EU, UK, Canada, Australia, Singapore — pick once, locked permanently.",
 body:[
  "Pick your residency at provisioning. All tenant data, logs, and backups stay in the chosen region. Antarious never moves data across regions, even for support — engineers connect into your region's instance.",
  "Cross-region failover is opt-in and requires explicit consent. By default, regional outage means waiting for your region to recover.",
  "Multi-region deployment (active-active across two regions) is available on Enterprise for global teams."
 ],
 bullets:[
  "Available regions: US-East, US-West, EU-West, UK, CA-Central, AU, SG.",
  "Region change requires data migration project.",
  "Backups stay in-region by default.",
  "Sovereign cloud available in select regions."
 ],
 related:["deploy-cloud-onprem","data-encryption","audit-overview","data-cross-border"]},

{slug:"deploy-upgrade", title:"Upgrade and patch cadence", category:"deployment", roles:["engineer"], journey:"reference",
 summary:"Monthly minor releases, quarterly majors. SaaS is automatic; single-tenant is scheduled with you.",
 body:[
  "SaaS upgrades happen during a configurable maintenance window (default Sundays 02:00 in your region) with zero downtime via blue/green deployment. You're notified 7 days in advance.",
  "Single-tenant cloud follows your maintenance window with the same blue/green model. On-prem is scheduled per your release calendar with our team's support.",
  "Security patches bypass the regular cadence — they're deployed within 24 hours of CVE disclosure for severity-critical, 7 days for high."
 ],
 bullets:[
  "Release notes published 14 days before deployment.",
  "Rollback within one hour if needed.",
  "LTS branch supported with 18-month maintenance.",
  "Security patches: 24h critical, 7d high, 30d medium."
 ],
 related:["deploy-cloud-onprem","deploy-dr","agents-failover","deploy-decommission"]},

{slug:"deploy-dr", title:"Disaster recovery and backups", category:"deployment", roles:["engineer","compliance"], journey:"reference",
 summary:"Hourly snapshots, point-in-time restore, 1-hour RTO, 5-minute RPO.",
 body:[
  "Backups run hourly with point-in-time restore over the last 30 days, daily with 90-day retention beyond that, and weekly with 1-year retention for long-tail recovery. All backups are encrypted with your tenant's key.",
  "Recovery time objective is 1 hour for full tenant restore in the same region. Recovery point objective is 5 minutes — the most data you'd lose in a worst-case scenario.",
  "DR drills run quarterly without your involvement, and we publish the results in your tenant's status page."
 ],
 bullets:[
  "Cross-region backup available on Enterprise.",
  "Restore to point-in-time supported via UI or CLI.",
  "Backups encrypted with your KMS key.",
  "DR drill reports available on demand."
 ],
 related:["deploy-residency","agents-failover","data-encryption","data-keys"]},

{slug:"deploy-decommission", title:"Decommissioning and offboarding", category:"deployment", roles:["compliance","engineer"], journey:"reference",
 summary:"What happens to your data when you leave. Spoiler: you control it.",
 body:[
  "When you offboard, you choose what to do with your data. Options: full export and erase (most common), full export and 90-day cold archive (for litigation hold), or in-place handover to a successor tenant.",
  "Full erase is cryptographic — your KMS keys are destroyed, and the data becomes unreadable even if backups exist. Antarious provides a signed certificate of destruction.",
  "Audit logs are governed by your retention setting and continue to be retained for the contracted period unless you explicitly purge them."
 ],
 bullets:[
  "Export formats: CSV, JSON, signed PDF, parquet.",
  "Cryptographic erase with signed certificate.",
  "90-day grace period for accidental offboarding.",
  "Audit logs governed by retention policy independently."
 ],
 related:["deploy-residency","data-export","data-deletion","audit-retention"]},

/* ---------- DATA (8) ---------- */
{slug:"data-overview", title:"What data Antarious processes", category:"data", roles:["compliance","engineer"], journey:"getting-started",
 summary:"Tenant config, integration data (with your consent), audit log, and agent context. Nothing else.",
 body:[
  "Antarious processes four data classes: tenant configuration (your settings, role assignments, approval rules), integration data (CRM, ERP, comms — only what you connect), audit logs (every action), and agent context (the data agents need to do their work).",
  "Antarious does not train its models on your data. Training happens on synthetic and licensed data only. Your tenant's data stays in your tenant.",
  "Inference uses your data ephemerally — at request time, with no persistent retention beyond audit. Embeddings derived from your data are tenant-isolated."
 ],
 bullets:[
  "No model training on customer data, ever.",
  "Embeddings tenant-isolated and tenant-encrypted.",
  "Inference data deleted post-completion.",
  "Data inventory available for SOC 2/ISO audits."
 ],
 related:["data-encryption","data-pii","data-retention","audit-overview"]},

{slug:"data-encryption", title:"Encryption at rest and in transit", category:"data", roles:["compliance","engineer"], journey:"reference",
 summary:"AES-256 at rest, TLS 1.3 in transit. Your KMS, your keys, your control.",
 body:[
  "All data at rest is encrypted with AES-256-GCM. All data in transit uses TLS 1.3 with modern cipher suites. Internal service-to-service traffic uses mTLS.",
  "Keys are managed via KMS — by default, Antarious-managed in your region. For Enterprise tenants, BYOK is supported via AWS KMS, GCP Cloud KMS, or Azure Key Vault — keys never leave your KMS.",
  "Field-level encryption is available for highly sensitive fields (e.g. SSN, account numbers) — those fields are encrypted with a per-tenant DEK that Antarious cannot read at rest."
 ],
 bullets:[
  "TLS 1.3 mandatory; older TLS rejected.",
  "BYOK on Enterprise via AWS/GCP/Azure KMS.",
  "Field-level encryption for designated fields.",
  "Keys rotated annually by default."
 ],
 related:["data-keys","data-overview","deploy-residency","audit-overview"]},

{slug:"data-retention", title:"Data retention policies", category:"data", roles:["compliance"], journey:"reference",
 summary:"Per-class retention. Most data follows the 7-year audit default; some has shorter or longer windows.",
 body:[
  "Different classes of data have different retention defaults. Audit logs: 7 years. Approval records: 7 years. Agent reasoning traces: 30 days (extendable). Integration mirror data: 30 days. Operational metrics: 13 months.",
  "All defaults are configurable within a band — you can extend up to 25 years on Enterprise, or shorten subject to legal minimums (Antarious blocks settings below the floor for your jurisdiction).",
  "Retention changes apply forward only — past data continues at its prior retention until expired."
 ],
 bullets:[
  "Class-by-class config in Settings → Data → Retention.",
  "Legal-floor enforcement based on detected jurisdiction.",
  "Retention change history is itself audit-logged.",
  "Tombstones left after deletion for audit completeness."
 ],
 related:["data-overview","audit-retention","data-deletion","audit-overview"]},

{slug:"data-pii", title:"PII handling and redaction", category:"data", roles:["compliance","engineer"], journey:"reference",
 summary:"PII is detected, classified, and either redacted or quarantined per your policy.",
 body:[
  "Antarious detects PII automatically across structured and unstructured data: names, addresses, phone numbers, emails, SSN, account numbers, and 30+ other classes. Detection runs at ingestion time and on every agent input.",
  "PII handling policy is configurable per data class: pass through, redact in displays, quarantine to a restricted column, or block entirely. Different policies for different agents are supported.",
  "Some PII is unavoidably in scope for certain agents (e.g. customer name for Nova). Antarious surfaces what's in scope and what's not, so you can prove minimisation."
 ],
 bullets:[
  "Detection covers structured and unstructured.",
  "Per-class policy: pass, redact, quarantine, block.",
  "Agent-level overrides for legitimate scope.",
  "Audit log records every PII touch."
 ],
 related:["data-overview","data-encryption","data-deletion","audit-overview"]},

{slug:"data-export", title:"Data export and portability", category:"data", roles:["compliance","engineer"], journey:"reference",
 summary:"Export everything. Anytime. Multiple formats. Yours.",
 body:[
  "Your data is yours. Export at any time via Settings → Data → Export. Choose what to export (specific classes or everything), the format (CSV, JSON, parquet, signed PDF), and the destination (download, S3, GCS, or your warehouse).",
  "Exports include audit log integrity signatures so the receiving system can verify they weren't tampered with in transit.",
  "Large exports run as background jobs — you'll get an email when ready. Maximum job size is 10GB; for larger, run multiple jobs."
 ],
 bullets:[
  "Formats: CSV, JSON, parquet, signed PDF.",
  "Destinations: direct download, S3, GCS, Azure Blob.",
  "Schemas stable across exports.",
  "Exports themselves are audit-logged."
 ],
 related:["data-overview","audit-export","int-warehouse","deploy-decommission"]},

{slug:"data-keys", title:"Bring-your-own-key (BYOK)", category:"data", roles:["compliance","engineer"], journey:"scaling",
 summary:"Hold the keys to your data. Revoke them and Antarious can't read your data — including by us.",
 body:[
  "BYOK lets you supply the encryption keys for your tenant. Keys live in your KMS (AWS, GCP, or Azure). Antarious calls into your KMS to decrypt at request time but never sees the raw key material.",
  "If you revoke the key, your data immediately becomes unreadable — including by Antarious. This is a powerful guarantee, and the implication (we cannot recover for you) is real.",
  "BYOK is on Enterprise plans. Setup takes about a day with our team's involvement to validate the KMS configuration."
 ],
 bullets:[
  "Per-tenant DEK wrapped by your KEK.",
  "Key rotation cadence controlled by you.",
  "Audit log captures every KMS call.",
  "Cryptographic erase = revoke and rotate."
 ],
 related:["data-encryption","audit-overview","deploy-residency","deploy-decommission"]},

{slug:"data-cross-border", title:"Cross-border data transfer", category:"data", roles:["compliance"], journey:"reference",
 summary:"Default: data stays in-region. Cross-border transfers are explicit, logged, and contractually framed.",
 body:[
  "Data does not cross regions by default. If your workflow requires cross-border transfer (e.g. EU → US for a specific report), it must be explicitly enabled with a documented purpose, a defined data scope, and a time-bounded window.",
  "Standard Contractual Clauses (SCCs), the EU-US Data Privacy Framework, and equivalents are pre-positioned in your DPA. Country-specific addenda are available on request.",
  "Cross-border transfers are tagged in the audit log and visible in your residency dashboard."
 ],
 bullets:[
  "Default: in-region only.",
  "Explicit, scoped, time-bounded transfers.",
  "SCCs and DPF pre-positioned.",
  "Residency dashboard shows every cross-border touch."
 ],
 related:["deploy-residency","data-overview","audit-overview","data-export"]},

{slug:"data-deletion", title:"Data deletion requests", category:"data", roles:["compliance"], journey:"reference",
 summary:"GDPR Article 17, CCPA, and friends — automated where possible, traceable always.",
 body:[
  "Data subject deletion requests (DSARs) are first-class. Submit via the dashboard or programmatically; Antarious runs the deletion across all data classes within 30 days (typically same day) and produces a signed certificate.",
  "Deletion is cryptographic where possible (key destruction) and physical otherwise (overwrite). Backups are honoured per your contract — typically deleted on next backup rotation.",
  "Deletion requests interact with legal hold: if a hold is active, deletion is paused and the requester is notified per regulatory rules."
 ],
 bullets:[
  "Standard SLA: 30 days, typical actual: same day.",
  "Signed certificate of deletion provided.",
  "Backups honoured on next rotation.",
  "Legal hold pauses deletion with notification."
 ],
 related:["data-retention","data-overview","audit-overview","audit-retention"]},

/* ---------- BILLING (8) ---------- */
{slug:"billing-plans", title:"Pricing tiers and what they include", category:"billing", roles:["founder","ops"], journey:"getting-started",
 summary:"Starter, Growth, Scale, Enterprise. Per-seat with usage adjustments.",
 body:[
  "Four tiers. Starter ($99/seat) covers small teams with the 13 default agents, basic integrations, and 30-day audit retention. Growth ($249/seat) adds custom agents, full integrations, and 1-year audit retention. Scale ($499/seat) adds BYOK, single-tenant cloud option, and 7-year audit retention. Enterprise is custom — on-prem, BYOK, advanced compliance.",
  "All tiers include unlimited approvals, unlimited agent runs, and standard support. Premium support and dedicated SRE are add-ons available on Scale and above.",
  "Annual contracts get a discount; monthly available without commitment."
 ],
 bullets:[
  "Free 14-day trial — every tier, no credit card.",
  "Annual: 17% off vs monthly.",
  "Volume discounts at 50/250/1000 seats.",
  "Non-profit and education discounts available."
 ],
 related:["billing-invoice","billing-seats","billing-usage","billing-annual"]},

{slug:"billing-invoice", title:"Reading your monthly invoice", category:"billing", roles:["ops","founder"], journey:"daily-ops",
 summary:"Three sections — base subscription, usage, taxes. Each line is a link to the underlying detail.",
 body:[
  "Invoices are itemised in three sections. First, base subscription (number of seats × seat price, prorated). Second, usage (extra storage, premium support, custom agents above tier). Third, taxes (VAT, sales tax, etc.) calculated per your billing address.",
  "Each line links to the underlying detail. Clicking 'seats' shows the user list; clicking 'storage' shows the breakdown by data class. No hidden fees.",
  "Invoices are issued on the 1st of each month for the prior month, due net-30. Late payments accrue 1% monthly."
 ],
 bullets:[
  "PDF invoice plus interactive UI version.",
  "All line items click through to detail.",
  "Multi-currency: USD, EUR, GBP, CAD, AUD.",
  "Pro-rata mid-month seat changes."
 ],
 related:["billing-plans","billing-seats","billing-tax","billing-payment"]},

{slug:"billing-seats", title:"Adding seats or upgrading tier", category:"billing", roles:["ops","founder"], journey:"daily-ops",
 summary:"Add seats anytime, prorated from now. Upgrade tier anytime, effective immediately.",
 body:[
  "Seats can be added in Settings → Billing → Seats. New seats prorate from the day added through the end of the billing period. Removed seats refund prorated, applied to the next invoice.",
  "Tier upgrades take effect immediately and prorate the same way. Downgrades take effect at the end of the current billing period to avoid mid-period feature loss.",
  "Bulk seat changes (e.g. adding 100+ seats) trigger a manual review for accurate proration — no surprises."
 ],
 bullets:[
  "Self-serve up to 50 seats; sales-assist beyond.",
  "Tier upgrade: immediate, prorated.",
  "Tier downgrade: end of period.",
  "Volume pricing automatically applied at thresholds."
 ],
 related:["billing-plans","billing-invoice","billing-cancel","roles-assign"]},

{slug:"billing-usage", title:"Usage-based billing components", category:"billing", roles:["ops","founder"], journey:"reference",
 summary:"Storage, custom agents, dedicated support — these are the meters.",
 body:[
  "Most tiers include unlimited core usage. Three meters can drive overage charges: storage beyond plan limit, custom agents beyond plan limit, and dedicated support hours beyond included.",
  "Each tier has generous defaults. Most teams never exceed any limit. The dashboard shows current usage vs limit at all times so there are no surprise overages.",
  "If you're approaching a limit, Antarious notifies you 14, 7, and 1 day in advance. You can choose to upgrade tier or accept the overage."
 ],
 bullets:[
  "Storage: $0.05/GB-month over plan limit.",
  "Custom agents: $50/agent-month over plan limit.",
  "Premium support hours: $400/hour over plan included.",
  "Notifications at 14/7/1 days before threshold."
 ],
 related:["billing-plans","billing-invoice","data-retention","agents-add"]},

{slug:"billing-annual", title:"Annual vs monthly plans", category:"billing", roles:["founder"], journey:"reference",
 summary:"Annual saves 17%. Switch anytime; transition is prorated.",
 body:[
  "Annual plans bill once for 12 months and save 17% vs monthly. Most teams pick annual after their first quarter when usage is established.",
  "Switching from monthly to annual is one click in Settings → Billing → Plan. Antarious credits your remaining monthly period and charges the prorated annual amount.",
  "Switching from annual to monthly happens at the renewal date (no refund mid-year). Plans can be cancelled at the end of the term with no penalty."
 ],
 bullets:[
  "17% discount on annual.",
  "Multi-year discounts negotiable on Enterprise.",
  "Annual plans renew automatically; opt out 30 days before.",
  "Co-term multiple subscriptions to one renewal date."
 ],
 related:["billing-plans","billing-cancel","billing-payment","billing-invoice"]},

{slug:"billing-tax", title:"Tax, VAT, and reverse charge", category:"billing", roles:["ops","compliance"], journey:"reference",
 summary:"Sales tax, VAT, GST, and reverse charge handled automatically based on your billing address and registration.",
 body:[
  "Antarious calculates taxes based on your billing address. US: state sales tax where applicable. EU/UK: VAT, with reverse charge for B2B if you provide a valid VAT number. Canada: GST/HST/PST. Australia: GST.",
  "Add your VAT/tax number in Settings → Billing → Tax. Reverse charge applies automatically once verified. Tax-exempt customers can upload a certificate for instant exemption.",
  "Invoices show tax-inclusive and tax-exclusive amounts side by side. Tax remittance is handled by Antarious — you don't need to remit anything."
 ],
 bullets:[
  "Real-time VAT validation via VIES.",
  "Tax-exempt certificate upload supported.",
  "Reverse charge B2B in EU/UK.",
  "Tax remittance handled by Antarious."
 ],
 related:["billing-invoice","billing-payment","billing-plans","audit-overview"]},

{slug:"billing-payment", title:"Payment methods and ACH", category:"billing", roles:["ops"], journey:"reference",
 summary:"Card, ACH, SEPA, wire, BACS — pick what your finance team prefers.",
 body:[
  "Payment methods are flexible. Cards (Visa, MC, Amex, Discover) are fastest to set up. ACH/SEPA/BACS are preferred for larger invoices — savings on fees passed through. Wire transfer is supported for Enterprise on annual plans.",
  "Card payments via Stripe; ACH/SEPA via Stripe ACH or via direct bank transfer. Wire instructions are on the invoice.",
  "Update payment methods anytime in Settings → Billing → Payment. Change becomes the default for the next invoice."
 ],
 bullets:[
  "PCI-compliant: Antarious never sees your card number.",
  "ACH discount: 1% off invoice for ACH-paid customers.",
  "Multiple payment methods supported (primary + backup).",
  "Failed payments retry automatically with notifications."
 ],
 related:["billing-invoice","billing-tax","billing-plans","billing-cancel"]},

{slug:"billing-cancel", title:"Cancelling or downgrading", category:"billing", roles:["founder"], journey:"reference",
 summary:"Cancel anytime in two clicks. We'll be sad. Your data is safe either way.",
 body:[
  "Cancellation is in Settings → Billing → Plan → Cancel. Two clicks plus a one-line reason. Effective at the end of the current billing period — full access until then.",
  "Downgrade follows the same flow. The downgraded tier takes effect at the end of the period to avoid mid-period feature loss.",
  "When you cancel, your data follows the offboarding flow described in 'Decommissioning and offboarding'. You have 90 days post-cancellation to export, after which data is cryptographically erased per your contract."
 ],
 bullets:[
  "Full access through end of period.",
  "90-day grace post-cancellation.",
  "Reactivation in 90 days restores everything.",
  "Antarious never holds your data hostage."
 ],
 related:["billing-plans","deploy-decommission","data-export","billing-invoice"]}
];

window.__HELP_CENTRE__ = { CATEGORIES, ROLES, JOURNEYS, ARTICLES };
})();
