const paragraph = (text) => ({ type: 'paragraph', text });
const heading = (text) => ({ type: 'heading', text });
const divider = () => ({ type: 'divider' });
const list = (items, { ordered = false, variant = 'default' } = {}) => ({
  type: 'list',
  items,
  ordered,
  variant,
});
const callout = (variant, title, body) => ({ type: 'callout', variant, title, body });
const code = (content, language = 'bash') => ({
  type: 'code',
  language,
  content: Array.isArray(content) ? content.join('\n') : content,
});
const table = (headers, rows) => ({ type: 'table', headers, rows });

const DOC_BLUEPRINT = [
  {
    title: 'Getting Started',
    slug: 'getting-started',
    intro: 'Kickoff configuration and invite Plixi into your community.',
    pages: [
      {
        title: 'What is Plixi?',
        summary: 'High-level introduction to the platform.',
        keywords: ['overview', 'economy bot', 'why plixi'],
        body: [
          heading('Why Plixi exists'),
          paragraph(
            'Plixi is a connected economy system for Discord servers. It blends slash commands, an always-on currency ledger, cosmetics, and automation so communities can run in-server businesses without touching spreadsheets.',
          ),
          paragraph(
            'Every switch inside the dashboard mirrors a live command or in-app view. When you save a change, the bot reflects it immediately, auditable through change logs. That transparency allows staff teams to experiment confidently.',
          ),
          list(
            [
              'Economy primitives: currency, streaks, multipliers, and drains.',
              'Engagement engines: shops, auctions, raffles, and job pools.',
              'Operational tooling: audit logs, permissions, role locks, and legal docs.',
            ],
            { variant: 'check' },
          ),
          callout(
            'info',
            'Always-on transparency',
            'Each Plixi action is logged with who triggered it, what values changed, and when the bot synced to Discord. Those breadcrumbs reduce disputes between staff and members.',
          ),
          heading('When to use Plixi'),
          list(
            [
              'Launch a new economy without building custom bots.',
              'Replace aging currency bots that lack dashboards or compliance.',
              'Consolidate multiple mini-bots (jobs, auctions, shops) into one permission-aware system.',
            ],
            { ordered: false },
          ),
        ],
      },
      {
        title: 'Adding Plixi to your server',
        summary: 'Invite URL, permissions, and verification flow.',
        keywords: ['invite', 'oauth', 'add bot'],
        body: [
          heading('Invite flow'),
          paragraph(
            'Use the “Add to server” button in the dashboard header or navigate directly to the OAuth URL. Select your Discord server, confirm the required permissions, and authorize the bot. Only members with “Manage Server” can complete this flow.',
          ),
          list(
            [
              'Pick the target server from the dropdown.',
              'Grant the requested permissions (Manage Roles, Send Messages, Embed Links, Use Slash Commands).',
              'Complete Discord’s verification captcha if prompted.',
              'Return to the dashboard — the guild will appear in your server picker instantly.',
            ],
            { ordered: true },
          ),
          callout(
            'warning',
            'Tip for large servers',
            'If your server uses role hierarchies, drag Plixi’s role above the roles it needs to assign. Without that, moderation commands and shop locks may silently fail.',
          ),
          heading('Verification badge'),
          paragraph(
            'Servers over 2,000 members are prompted to confirm ownership via a quick DNS challenge. This prevents fake staff from linking sensitive guilds. Once verified, the badge propagates across the dashboard and API within a few minutes.',
          ),
        ],
      },
      {
        title: 'Required permissions & setup checklist',
        summary: 'Lock in the Discord permissions Plixi needs to run reliably.',
        keywords: ['permissions', 'intents', 'checklist'],
        body: [
          heading('Essential permissions'),
          table(['Permission', 'Why it matters'], [
            ['Manage Roles', 'Assign premium locks, apply mutes, and sync inventory states.'],
            ['Manage Channels', 'Create temporary event channels for auctions or raffles.'],
            ['Send Messages & Embed Links', 'Post shop refreshes, box pulls, and moderation logs.'],
            ['Use Slash Commands', 'Expose the entire command suite to members.'],
          ]),
          callout(
            'tip',
            'Gateway intents',
            'Enable Server Members and Message Content intents inside the Discord Developer Portal. They allow Plixi to hydrate role rosters for permissions without storing raw message history.',
          ),
          heading('Setup checklist'),
          list(
            [
              'Create a dedicated #plixi-updates channel for announcements.',
              'Grant trusted staff the “Plixi Admin” dashboard role.',
              'Review currency name, symbol, and decimals before launch.',
              'Switch on audit logging so every save is recorded.',
              'Run /daily and /work yourself to validate payouts.',
            ],
            { variant: 'check' },
          ),
        ],
      },
      {
        title: 'First-time setup guide (5–10 min)',
        summary: 'Complete the initial currency and shop configuration.',
        keywords: ['onboarding', 'first steps', 'setup'],
        body: [
          heading('Guided setup'),
          paragraph(
            'The first-run checklist walks you through currency basics, streaks, jobs, and a starter shop layout. Treat it as a wizard — you can revisit every choice later, but this pass ensures members do not encounter empty views.',
          ),
          list(
            [
              'Name your currency and confirm whether decimals are allowed.',
              'Pick a daily reward template (regular is safest for new servers).',
              'Seed the work pool with at least five job prompts.',
              'Add 3–5 starter shop items so /shop feels alive.',
              'Preview the dashboard changes and press Save.',
            ],
            { ordered: true },
          ),
          callout(
            'info',
            'Autosave drafts',
            'Plixi autosaves in-progress changes every few seconds locally. If you close the tab mid-setup, reopen the dashboard to resume right where you left off.',
          ),
          heading('Smoke test'),
          paragraph(
            'Once saved, hop into Discord and run /daily, /balance, /shop, and /work. Seeing the flows end-to-end confirms Discord permissions, intents, and dashboard settings are aligned before members touch the system.',
          ),
        ],
      },
      {
        title: 'Dashboard overview',
        summary: 'Understand navigation, cards, and save behavior.',
        keywords: ['dashboard', 'navigation', 'cards'],
        body: [
          heading('Shell layout'),
          paragraph(
            'The dashboard mirrors the Plixi app: navigation on the left groups modules, the top bar shows guild context, and the main column renders collapsible cards. Sections collapse automatically on narrow screens to preserve focus.',
          ),
          heading('Cards & modules'),
          paragraph(
            'Every module is broken into cards (Settings, Appearance, Schedule, etc.). Cards expand inline, and advanced editors slide in from the right when you open previews. This approach keeps the context of your settings while giving editors more space.',
          ),
          callout(
            'info',
            'Saving changes',
            'The save bar appears whenever unsaved edits exist. Press Save to push updates instantly or Discard to revert. High-impact actions (reset economy, delete box) prompt an extra confirmation modal.',
          ),
          list(
            [
              'Breadcrumbs show where you are (Docs → Economy → Daily Rewards).',
              'Search on every page filters both commands and dashboard copy.',
              'Audit icons mark cards that log changes for compliance.',
            ],
            { variant: 'check' },
          ),
        ],
      },
    ],
  },
  {
    title: 'Dashboard Guide',
    slug: 'dashboard-guide',
    intro: 'Deep dive into the web dashboard and how changes propagate.',
    pages: [
      {
        title: 'Connecting a server',
        summary: 'Link Discord guilds to the dashboard safely.',
        keywords: ['server linking', 'guilds', 'auth'],
        body: [
          heading('Server picker'),
          paragraph(
            'The server picker pulls every guild you manage. Selecting one sets the context for every module, including audit logs and billing. Switching servers clears unsaved drafts so you never overwrite the wrong guild.',
          ),
          heading('Staff access'),
          paragraph(
            'Invite additional staff from the “System → Server settings” card. Each invite can be limited to read-only, module-specific, or full admin capabilities. Dashboard permissions map to Discord roles automatically every hour.',
          ),
          callout(
            'warning',
            'Ownership checks',
            'If you lose the Manage Server permission inside Discord, Plixi temporarily revokes your dashboard access for that guild. Have another owner reinstate your role to regain control.',
          ),
        ],
      },
      {
        title: 'Navigating cards & sections',
        summary: 'Use collapsible cards to stay organized.',
        keywords: ['cards', 'modules', 'layout'],
        body: [
          heading('Collapsible rhythm'),
          paragraph(
            'Cards default to a stacked, collapsible layout so you can focus on one problem at a time. Keyboard users can jump between card headers with Tab / Shift + Tab, and press Enter to toggle.',
          ),
          list(
            [
              'Middle column: standard controls.',
              'Right column: preview or editor panes when invoked.',
              'Sticky headers: quick description + Save state.',
            ],
            { variant: 'check' },
          ),
          callout(
            'tip',
            'Remember preview context',
            'When a preview is open (e.g., server shop appearance), other cards hide temporarily. Close the preview or use the breadcrumb back button to return without losing work.',
          ),
        ],
      },
      {
        title: 'Saving changes',
        summary: 'Draft handling, autosave, and conflict resolution.',
        keywords: ['save', 'drafts', 'conflicts'],
        body: [
          heading('Draft buffer'),
          paragraph(
            'Edits are stored locally until you hit Save, preventing unintended pushes. A badge on the top-right save drawer shows how many modules have pending drafts.',
          ),
          heading('Conflict resolution'),
          paragraph(
            'If another admin saves the same card while you are editing, Plixi surfaces a diff in the save drawer. You can merge, overwrite, or discard your changes with one click.',
          ),
          callout(
            'warning',
            'Destructive actions',
            'Resetting the economy, deleting items, or purging streaks cannot be undone. These buttons are colored red, require typing the guild name, and generate an audit entry plus emailed receipt.',
          ),
        ],
      },
      {
        title: 'Feature locks',
        summary: 'See what each pricing tier unlocks.',
        keywords: ['tiers', 'pricing', 'locks'],
        body: [
          heading('Tiering at a glance'),
          paragraph(
            'The Feature Locks card compares Free, Lite, Premium, and Ultra tiers. Locked modules show a badge explaining why they are unavailable and link to pricing if you need to upgrade.',
          ),
          table(
            ['Feature', 'Free', 'Lite', 'Premium', 'Ultra'],
            [
              ['Economy basics', '✓', '✓', '✓', '✓'],
              ['Server shop scheduling', '—', '✓', '✓', '✓'],
              ['Auctions & raffles', '—', '—', '✓', '✓'],
              ['Advanced audit exports', '—', '—', '—', '✓'],
            ],
          ),
          callout(
            'info',
            'Grace periods',
            'Downgrading a tier gives you a seven-day grace period to remove locked settings. After that, scheduled jobs pause automatically to prevent half-configured states.',
          ),
        ],
      },
      {
        title: 'Audit logs & admin actions',
        summary: 'Monitor every change and export logs.',
        keywords: ['audit logs', 'exports', 'compliance'],
        body: [
          heading('What gets logged'),
          list(
            [
              'Dashboard saves (who, when, what changed).',
              'Slash commands invoked by staff.',
              'High-risk member actions (big trades, auction wins).',
            ],
            { variant: 'check' },
          ),
          paragraph(
            'Logs render inline with filters for module, actor, and time range. Use the “Open logs on the website” button to deep-link a filter set for other admins.',
          ),
          callout(
            'tip',
            'Channel mirroring',
            'Each audit rule can optionally send summaries to a Discord channel. Enable it for moderation moves so the rest of the staff can see what happened without opening the dashboard.',
          ),
        ],
      },
      {
        title: 'Role permissions',
        summary: 'Control who can run commands or save modules.',
        keywords: ['roles', 'permissions', 'access'],
        body: [
          heading('Dashboard roles'),
          paragraph(
            'Assign admin, editor, or viewer roles per module. Editors can save within their modules but cannot issue refunds or touch billing. Viewers see live data without controls.',
          ),
          heading('Command gates'),
          paragraph(
            'Within each module you can restrict commands to approved Discord roles. For example, /gift might be limited to @VIP, while /trade stays open to everyone.',
          ),
          callout(
            'info',
            'Sync cadence',
            'Permissions sync every five minutes by default. You can force-sync instantly from the System → Permissions card if you just promoted someone.',
          ),
        ],
      },
    ],
  },
  {
    title: 'Economy System',
    slug: 'economy-system',
    intro: 'Configure currency, streaks, and protective guardrails.',
    pages: [
      {
        title: 'Currency settings',
        summary: 'Name, symbol, and rounding modes.',
        keywords: ['currency name', 'symbol', 'rounding'],
        body: [
          heading('Naming'),
          paragraph(
            'Pick a short, memorable name and symbol. Members will see it in commands, leaderboards, and receipts (e.g., “Credits” with symbol “¤”). Changing it later updates everywhere instantly.',
          ),
          heading('Rounding & decimals'),
          paragraph(
            'Most servers keep whole numbers for simplicity, but financial-style economies can enable decimals with precision up to two places. Plixi rounds half up to avoid exploits.',
          ),
          callout(
            'tip',
            'Inflation guardrail',
            'Set a soft cap for wallet balances. When members hit it, Plixi nudges them toward shops or auctions, keeping the economy circulating.',
          ),
        ],
      },
      {
        title: 'Starting balance',
        summary: 'Seed newcomers with enough funds.',
        keywords: ['onboarding', 'balance'],
        body: [
          paragraph(
            'The starting balance is deposited the first time a user interacts with Plixi. Keep it aligned with shop pricing so newcomers can immediately buy something or enter a raffle.',
          ),
          list(
            [
              'Default: 250 credits.',
              'Recommended max: 10× the cheapest shop item.',
              'Use role bonuses if you want boosters or staff to spawn richer.',
            ],
            { variant: 'check' },
          ),
          callout(
            'warning',
            'Abuse prevention',
            'If you change the starting balance, existing members do not retroactively receive the difference. This prevents users from leaving and rejoining to farm extra currency.',
          ),
        ],
      },
      {
        title: 'Decimals',
        summary: 'Enable or disable fractional payouts.',
        keywords: ['decimals', 'precision'],
        body: [
          paragraph(
            'Enable decimals only if your pricing model truly needs cents. The UI, commands, and exports handle up to two decimal places. Anything more creates floating-point rounding issues and member confusion.',
          ),
          callout(
            'tip',
            'Presentation',
            'When decimals are enabled, Plixi automatically formats shop prices and logs with two digits (e.g., 14.50). Use consistent symbols so members know it is not real-world currency.',
          ),
        ],
      },
      {
        title: 'Daily rewards',
        summary: 'Configure /daily payouts and messages.',
        keywords: ['daily', '/daily', 'streak'],
        body: [
          paragraph(
            'Set the base reward, cooldown, and flavor text for /daily. Members can only claim once per 20 hours by default; increase the buffer if you want a slower economy.',
          ),
          list(
            [
              'Base payout: 150 credits.',
              'Cooldown: 20h (adjustable).',
              'Missed streak forgiveness: optional grace day to reduce frustration.',
            ],
            { variant: 'check' },
          ),
          callout(
            'warning',
            'Abuse detection',
            'Enable “Suspicious claim” logging to flag accounts that hop between servers or alternate accounts to farm streaks. Logs appear in both the dashboard and Discord channel if configured.',
          ),
        ],
      },
      {
        title: 'Streak bonuses (aggressive / regular / conservative)',
        summary: 'Choose the cadence that fits your community.',
        keywords: ['streaks', 'bonus', 'aggressive'],
        body: [
          paragraph(
            'Streak templates control how quickly repeated check-ins grow. Aggressive streaks ramp faster but risk inflation, while conservative streaks keep payouts near the base reward.',
          ),
          table(['Day', 'Aggressive', 'Regular', 'Conservative'], [
            ['1', '+0%', '+0%', '+0%'],
            ['5', '+45%', '+25%', '+15%'],
            ['10', '+110%', '+60%', '+30%'],
          ]),
          callout(
            'tip',
            'Custom streaks',
            'Switch to “Custom” if you want to plot your own curve. Plixi validates that bonuses never go negative and caps the maximum bonus at 300% for safety.',
          ),
        ],
      },
      {
        title: 'Work & jobs',
        summary: 'Shape /work cooldowns and job pools.',
        keywords: ['work', 'jobs', 'cooldown'],
        body: [
          paragraph(
            '/work pulls from a job pool you define. Each job includes a title, flavor text, payout range, and optional role bonus.',
          ),
          list(
            [
              'Maintain at least 10 jobs to keep prompts fresh.',
              'Set cooldowns between 30–90 minutes depending on economy pace.',
              'Use negative jobs sparingly if you want risk/reward gameplay.',
            ],
            { variant: 'check' },
          ),
          callout(
            'info',
            'Job pool editor',
            'The “Edit job pool” button opens a focused list view with inline editing, bulk duplication, and CSV import. Changes sync to the bot instantly upon save.',
          ),
        ],
      },
      {
        title: 'Role bonuses',
        summary: 'Reward boosters or VIPs with extra income.',
        keywords: ['role bonus', 'boosters'],
        body: [
          paragraph(
            'Apply multipliers or flat bonuses per Discord role. Bonuses apply to /daily, /work, and job payouts, but never to direct trades to prevent laundering.',
          ),
          callout(
            'tip',
            'Stacking',
            'Members only receive the highest applicable bonus. This keeps booster rewards meaningful without multiplying payouts endlessly.',
          ),
          paragraph(
            'Use the preview chart on the right side to simulate how bonuses affect long streaks before publishing.',
          ),
        ],
      },
      {
        title: 'Leaderboards',
        summary: 'Expose rankings and cadence resets.',
        keywords: ['leaderboard', 'reset', 'season'],
        body: [
          paragraph(
            'Leaderboards encourage friendly competition. Choose between all-time, seasonal, or weekly ladders. Seasonal boards archive automatically so you can celebrate winners without losing history.',
          ),
          callout(
            'warning',
            'Privacy controls',
            'Hide members who opt out by toggling “Respect privacy requests.” Their balances stay intact but disappear from /top and dashboard views.',
          ),
          paragraph(
            'Resetting a ladder is permanent. Export a CSV beforehand if you want an offline copy.',
          ),
        ],
      },
    ],
  },
  {
    title: 'Items & Inventory',
    slug: 'items-inventory',
    intro: 'Create cosmetics, consumables, and rule sets for ownership.',
    pages: [
      {
        title: 'Creating items',
        summary: 'Define metadata, rarity, and cost.',
        keywords: ['item builder', 'metadata', 'rarity'],
        body: [
          paragraph(
            'Give every item a name, description, rarity color, and acquisition cost. Add tags to improve search inside the dashboard and to restrict items in shops or boxes.',
          ),
          list(
            [
              'Consumables: run an action when used (e.g., boost, ticket).',
              'Cosmetics: sit in the inventory until equipped or displayed.',
              'Quest items: invisible to members until a trigger reveals them.',
            ],
            { variant: 'check' },
          ),
          callout(
            'info',
            'Versioning',
            'Items keep a changelog so you can reference previous stats when balancing. Editing rarity or tags never wipes ownership.',
          ),
        ],
      },
      {
        title: 'Rarity system',
        summary: 'Color-coded tiers and drop balancing.',
        keywords: ['rarity', 'tiers', 'odds'],
        body: [
          paragraph(
            'Plixi ships with five rarity tiers (Common → Legendary). Each tier controls default colors, icon treatment, and recommended drop odds.',
          ),
          table(['Rarity', 'Color', 'Suggested drop rate'], [
            ['Common', '#94a3b8', '60%'],
            ['Rare', '#38bdf8', '25%'],
            ['Epic', '#a855f7', '10%'],
            ['Legendary', '#fbbf24', '4%'],
            ['Mythic', '#f472b6', '1%'],
          ]),
          callout(
            'tip',
            'Custom tiers',
            'Add or rename tiers anytime. Update box odds and shop filters afterwards so everything stays consistent.',
          ),
        ],
      },
      {
        title: 'Inventory behavior',
        summary: 'Stacking, equipping, and expiration.',
        keywords: ['inventory', 'stacking', 'expiration'],
        body: [
          paragraph(
            'Define whether items stack per user or require separate slots. Stackable consumables make it easier to grant bulk rewards, while unstacked items help track provenance.',
          ),
          list(
            [
              'Equippable items expose /equip and /unequip commands.',
              'Expiring items automatically trigger reminders three days before they disappear.',
              'Bind-on-pickup prevents trading or gifting rare drops.',
            ],
            { variant: 'check' },
          ),
          callout(
            'warning',
            'Deleting items',
            'Deleting an item wipes it from every inventory. Use “Retire” instead so history remains intact.',
          ),
        ],
      },
      {
        title: 'Trading & gifting rules',
        summary: 'Protect against dupes and scams.',
        keywords: ['trade', 'gift', 'limits'],
        body: [
          paragraph(
            'Trading requires both members to confirm within 60 seconds. Plixi screenshots the transaction for audit history and sends receipts to both parties.',
          ),
          list(
            [
              'Role locks can disable trading entirely or limit it to trusted roles.',
              'Cooldowns prevent mass funneling of items between alts.',
              'Gifting can be kept one-way for events; disable trades per item if needed.',
            ],
            { variant: 'check' },
          ),
          callout(
            'info',
            'Staff overrides',
            'Authorized staff can push trades through even if one party disconnects. This is logged with a bright banner so abuse is obvious.',
          ),
        ],
      },
      {
        title: 'Item visibility',
        summary: 'Hide, schedule, or staff-lock items.',
        keywords: ['visibility', 'scheduling'],
        body: [
          paragraph(
            'Visibility determines when members see an item in their inventory, shops, or boxes. Use schedules for seasonal drops and staff-locks for beta testing new gear.',
          ),
          callout(
            'tip',
            'Preview tools',
            'Use the “View as member” toggle to confirm visibility before launch. It mirrors the exact inventory UI so surprises disappear.',
          ),
        ],
      },
    ],
  },
  {
    title: 'Mystery Boxes',
    slug: 'mystery-boxes',
    intro: 'Build loot tables with transparent odds and battle modes.',
    pages: [
      {
        title: 'Creating boxes',
        summary: 'Wizard for naming, art, and hero copy.',
        keywords: ['boxes', 'wizard', 'creation'],
        body: [
          paragraph(
            'The creation wizard captures box name, description, hero art, and purchase cost. Hero copy appears on Discord buttons, so keep it short and enticing.',
          ),
          callout(
            'tip',
            'Preview animation',
            'Use the inline preview to test colors, gradients, and overlays before publishing. Members see the exact same animation when opening boxes.',
          ),
        ],
      },
      {
        title: 'Adding items & odds',
        summary: 'Assign weights and enforce fairness.',
        keywords: ['odds', 'weights', 'drops'],
        body: [
          paragraph(
            'Drag items into the loot table, then assign weight percentages. Plixi enforces that every tier adds up to 100%. Items can appear multiple times to increase their odds.',
          ),
          paragraph(
            'When a member opens a box, Plixi rolls server-seeded RNG, records the seed + result, and stores the entire pull transcript in the box log. Staff can replay the roll to prove fairness.',
          ),
          callout(
            'warning',
            'Transparency requirement',
            'Odds must be disclosed to comply with Discord’s monetization policies. Plixi displays them on hover and includes them in the /box info command automatically.',
          ),
          callout(
            'info',
            'Comprehensive logging',
            'Every opening lists the RNG seed, item pulled, member ID, and payout value. Search the log or export it before running tournaments.',
          ),
        ],
      },
      {
        title: 'Box pricing',
        summary: 'Set credit cost based on expected value.',
        keywords: ['pricing', 'ev'],
        body: [
          paragraph(
            'Plixi calculates the expected value (EV) of your box by multiplying drop chance by each item’s market value. Price boxes slightly above EV to ensure the economy sinks more currency than it mints.',
          ),
          callout(
            'tip',
            'Dynamic pricing',
            'Enable “Follow market” to let Plixi adjust box prices nightly based on marketplace data. You receive an email summary every time a price moves more than 10%.',
          ),
        ],
      },
      {
        title: 'Limited stock',
        summary: 'Drive scarcity safely.',
        keywords: ['limited', 'stock'],
        body: [
          paragraph(
            'Limit how many boxes can be sold per refresh. Stock resets automatically at midnight UTC unless you tie it to an event date.',
          ),
          callout(
            'info',
            'Restock alerts',
            'Members can subscribe to restock notifications. Plixi caps them to prevent spam and includes opt-out links in every DM.',
          ),
        ],
      },
      {
        title: 'For-sale toggles',
        summary: 'Soft launch boxes before going public.',
        keywords: ['for sale', 'toggle'],
        body: [
          paragraph(
            'Keep boxes private while testing animations or checking odds. When you flip the “For sale” toggle, Plixi announces the launch in your configured channel.',
          ),
          callout(
            'warning',
            'Locked boxes',
            'Boxes tied to moderation items (e.g., punishments) cannot be put on sale globally. Create a duplicate box with safe rewards for members instead.',
          ),
        ],
      },
      {
        title: 'Animations & backgrounds',
        summary: 'Customize opening visuals.',
        keywords: ['animation', 'background'],
        body: [
          paragraph(
            'Upload background art, choose confetti styles, and pick reveal speeds. Larger servers often match box colors to seasonal branding.',
          ),
          callout(
            'tip',
            'Performance',
            'Use compressed images under 1 MB. Anything larger slows down Discord clients when the animation is embedded.',
          ),
        ],
      },
      {
        title: 'Rare opening announcements',
        summary: 'Broadcast legendary pulls.',
        keywords: ['announcements', 'rare drops'],
        body: [
          paragraph(
            'Plixi can shout out drops above a rarity threshold. Configure which channel receives the message and how often duplicates should be suppressed.',
          ),
          callout(
            'info',
            'Spoiler controls',
            'Enable spoiler tags automatically for PVP items so members do not screenshot secret stats.',
          ),
        ],
      },
      {
        title: 'Box battles (if enabled)',
        summary: 'Enable competitive openings.',
        keywords: ['box battles', 'pvp'],
        body: [
          paragraph(
            'Box battles let two or more members open the same number of boxes, with the highest total EV winning everything. Use it for tournaments or weekend events.',
          ),
          callout(
            'warning',
            'Fairness',
            'Each battle generates a public log showing every roll so accusations can be resolved quickly.',
          ),
        ],
      },
    ],
  },
  {
    title: 'Marketplace & Shops',
    slug: 'marketplace-shops',
    intro: 'Operate curated shops and peer-driven markets.',
    pages: [
      {
        title: 'Marketplace overview',
        summary: 'Difference between server shops and user listings.',
        keywords: ['marketplace', 'overview'],
        body: [
          paragraph(
            'Plixi supports two commerce models. Server shops are curated storefronts you control, while the marketplace is player-to-player listings. Both share the same inventory engine.',
          ),
          callout(
            'info',
            'Search & filters',
            'Members can filter by rarity, price range, or seller reputation directly within /market.',
          ),
        ],
      },
      {
        title: 'Server shop vs user shops',
        summary: 'Pick the right sales model.',
        keywords: ['server shop', 'user shop'],
        body: [
          table(['Aspect', 'Server shop', 'User shop'], [
            ['Control', 'Staff pick featured items and pricing.', 'Members list their own items.'],
            ['Rotation', 'Scheduled or randomized pools.', 'Always-on listings with expiration timers.'],
            ['Fees', 'Optional tax routed to treasury.', 'Listing and sale fees deducted automatically.'],
          ]),
          callout(
            'tip',
            'Hybrid approach',
            'Many servers run a curated daily shop plus a user marketplace for overflow items. Use treasury analytics to balance both sinks.',
          ),
        ],
      },
      {
        title: 'Fees & taxes',
        summary: 'Take a cut to fight inflation.',
        keywords: ['fees', 'tax', 'treasury'],
        body: [
          paragraph(
            'Configure percentage fees for listings, instant purchases, and secondary sales. Fees route to the treasury wallet you can later spend on events or staff stipends.',
          ),
          callout(
            'warning',
            'Transparency',
            'Always disclose marketplace fees in the listing confirmation. Plixi does this by default, but editing the text block is encouraged so it matches your tone.',
          ),
        ],
      },
      {
        title: 'Listings & pagination',
        summary: 'Control how many offers appear at once.',
        keywords: ['listings', 'pagination'],
        body: [
          paragraph(
            'The marketplace shows 12 listings per page. You can tighten or loosen that window, but keep it reasonable so mobile users can navigate quickly.',
          ),
          callout(
            'info',
            'Auto-expire',
            'Stale listings expire after 14 days by default. Adjust the timer if your economy moves slower or faster.',
          ),
        ],
      },
      {
        title: 'Scheduled vs randomized shops',
        summary: 'Calendar vs pool-based rotations.',
        keywords: ['scheduled', 'randomized', 'server shop'],
        body: [
          paragraph(
            'Scheduled shops let you plan daily layouts with up to eight slots per day. Randomized shops pull from a pool each refresh. Choose the mode that best fits your content cadence.',
          ),
          callout(
            'tip',
            'Editing experience',
            'Each mode opens a full-width editor. Scheduled mode shows a calendar with slots on the left and a live preview on the right. Randomized mode focuses on the item pool list.',
          ),
        ],
      },
      {
        title: 'Featured items',
        summary: 'Pin premium goods to the hero slot.',
        keywords: ['featured', 'hero slot'],
        body: [
          paragraph(
            'Feature one item per refresh to sit in the hero banner. Featured items support custom artwork, captions, and a “limited quantity” badge.',
          ),
          callout(
            'warning',
            'Cooldown',
            'The same item cannot be featured twice within 48 hours, preventing favoritism.',
          ),
        ],
      },
      {
        title: 'Purchase behavior (inventory vs instant use)',
        summary: 'Decide whether items land in inventory or resolve immediately.',
        keywords: ['purchase', 'instant use'],
        body: [
          paragraph(
            'Some items should resolve instantly (e.g., “Grant 30 minutes of double XP”), while others should land in the inventory for later use. Configure the behavior per item or override it globally per shop slot.',
          ),
          callout(
            'info',
            'Refund window',
            'Inventory purchases include a five-minute refund window for accidental clicks. Instant-use goods do not because the effect executes right away.',
          ),
        ],
      },
    ],
  },
  {
    title: 'Auctions & Raffles',
    slug: 'auctions-raffles',
    intro: 'Live bidding, ticket systems, and fairness notes.',
    pages: [
      {
        title: 'Creating auctions',
        summary: 'Launch auction lots with schedules.',
        keywords: ['auction', 'lot'],
        body: [
          paragraph(
            'Choose an item, reserve price, increment, and start/end time. Auctions can be silent or live-streamed in a Discord channel.',
          ),
          callout(
            'tip',
            'Templates',
            'Save commonly used auction layouts (e.g., weekend drops). Templates store copy, timers, and minimum increments.',
          ),
        ],
      },
      {
        title: 'Auction fees',
        summary: 'Charge commissions to sustain payouts.',
        keywords: ['auction fees', 'commission'],
        body: [
          paragraph(
            'Set buyer and seller premiums separately. Fees deposit into the treasury wallet, mirroring marketplace behavior.',
          ),
          callout(
            'info',
            'Auto-withdraw',
            'When the winning bidder cannot cover the total including fees, Plixi reruns the final call and flags the user for review.',
          ),
        ],
      },
      {
        title: 'Auction rules',
        summary: 'Auto-extend, anti-sniping, and reserve prices.',
        keywords: ['rules', 'anti snipe'],
        body: [
          paragraph(
            'Enable anti-sniping to auto-extend the auction by two minutes whenever someone bids in the last 60 seconds. Reserve prices keep items from selling below value.',
          ),
          callout(
            'warning',
            'Public rules',
            'List your rules in the auction description so bidders understand how extensions and reserves work. Transparency reduces disputes.',
          ),
        ],
      },
      {
        title: 'Raffles setup',
        summary: 'Ticket sales, draw modes, and winners.',
        keywords: ['raffle', 'tickets'],
        body: [
          paragraph(
            'Raffles sell tickets at a fixed price. Choose whether entries are unlimited, per-user capped, or role-gated. Draws can be instant or scheduled.',
          ),
          callout(
            'tip',
            'Multi-winner',
            'Enable multi-winner raffles to draw first, second, and third place prizes automatically.',
          ),
        ],
      },
      {
        title: 'Prize pools',
        summary: 'Funding options and transparency.',
        keywords: ['prize pool', 'funding'],
        body: [
          paragraph(
            'Fund prizes with treasury credits, custom items, or sponsor slots. Sponsors can receive branding in the raffle embed.',
          ),
          callout(
            'info',
            'Ledger entries',
            'Every payout logs in the audit trail so finance roles can reconcile events later.',
          ),
        ],
      },
      {
        title: 'Duration limits',
        summary: 'Prevent endless events.',
        keywords: ['duration', 'limits'],
        body: [
          paragraph(
            'Set max durations so auctions and raffles cannot run forever. The default cap is seven days. Anything longer drains attention and floods logs.',
          ),
          callout(
            'warning',
            'Auto-close',
            'Events that hit the hard limit close automatically and refund bidders. Keep notifications enabled to avoid surprises.',
          ),
        ],
      },
      {
        title: 'Logs & fairness',
        summary: 'Publish draws to build trust.',
        keywords: ['logs', 'fairness'],
        body: [
          paragraph(
            'All bids, ticket purchases, and winners stream into the audit log. Export the log as CSV for public review or to settle disputes.',
          ),
          callout(
            'info',
            'Provably fair draws',
            'Raffles use server seeds plus the winning number, which you can verify through the transparency endpoint.',
          ),
        ],
      },
    ],
  },
  {
    title: 'Commands Reference',
    slug: 'commands-reference',
    intro: 'Slash command catalog with permissions and cooldowns.',
    pages: [
      {
        title: 'Command reference',
        slug: 'commands-table',
        summary: 'Searchable list of every public command.',
        keywords: ['/daily', '/work', '/shop', 'commands'],
        body: [
          paragraph('Search this table inside the docs or run /help inside Discord for context-aware hints.'),
          code(['/daily', '/work', '/shop', '/box open mythic-crate', '/plixi sync'].join('\n'), 'text'),
          table(
            ['Command', 'Description', 'Permissions', 'Example', 'Cooldown', 'Notes'],
            [
              ['/daily', 'Claim your daily reward.', 'None', '/daily', '20h', 'Streak bonus applies automatically.'],
              ['/work', 'Complete a random job for credits.', 'None', '/work', '45m', 'Cooldown respects role bonuses.'],
              ['/shop', 'Open the server shop.', 'None', '/shop', 'None', 'Shows either randomized or scheduled view.'],
              ['/gift', 'Send an item or credits to another user.', 'Gift permission', '/gift @User 250', '15m', 'Logs include giver + recipient IDs.'],
              ['/trade', 'Trade directly with another member.', 'Trade permission', '/trade @User', 'None', 'Both parties must confirm within 60 seconds.'],
              ['/balance', 'Check wallet + bank totals.', 'None', '/balance', '10s', 'Shows privacy-safe summary if user opted out.'],
              ['/leaderboard', 'View current rankings.', 'None', '/leaderboard wallet', '5m', 'Falls back to last cached board if syncing.'],
              ['/box open', 'Open a selected mystery box.', 'None', '/box open neon-thrash', '30s', 'Logs every roll with RNG seed + item.'],
              ['/auction bid', 'Increase your bid on an active auction.', 'Auction access', '/auction bid 2k', '10s', 'Fails gracefully if balance < bid + fees.'],
              ['/raffle enter', 'Buy raffle tickets.', 'None', '/raffle enter nebula', '1m', 'Tickets refunded if raffle auto-cancels.'],
            ],
          ),
          callout(
            'info',
            'Edge cases',
            'Commands inherit Discord permissions. If a member cannot send messages in a channel, their command replies arrive via ephemeral messages automatically.',
          ),
        ],
      },
    ],
  },
  {
    title: 'Permissions & Roles',
    slug: 'permissions-roles',
    intro: 'Safe defaults and common pitfalls.',
    pages: [
      {
        title: 'Admin permissions',
        summary: 'Who can save modules or run high-risk commands.',
        keywords: ['admin', 'permissions'],
        body: [
          paragraph(
            'Assign Admin roles sparingly. They can reset economies, refund members, and export billing data. Use the dashboard to scope access per module and log every override.',
          ),
          callout(
            'warning',
            'Least privilege',
            'Start everyone as a Viewer and escalate only what they need. This limits damage if an account is compromised.',
          ),
        ],
      },
      {
        title: 'Role restrictions',
        summary: 'Block specific roles from /trade or /gift.',
        keywords: ['role restrictions'],
        body: [
          paragraph(
            'Restrict high-risk commands for muted, probation, or new roles. Restrictions apply instantly and show descriptive tooltips so members know why a command failed.',
          ),
          callout(
            'tip',
            'Conditional locks',
            'Combine role restrictions with balance caps to curb laundering between alts.',
          ),
        ],
      },
      {
        title: 'Safe defaults',
        summary: 'Recommended settings for new servers.',
        keywords: ['defaults', 'templates'],
        body: [
          list(
            [
              'Enable audit logging for every module.',
              'Require 2FA for dashboard admins.',
              'Keep trades limited to members older than seven days.',
            ],
            { variant: 'check' },
          ),
          callout(
            'info',
            'Prebuilt template',
            'Choose the “Recommended security” template during onboarding to apply all safe defaults automatically.',
          ),
        ],
      },
      {
        title: 'Common misconfigurations',
        summary: 'Fix command scoping and missing intents.',
        keywords: ['misconfiguration', 'troubleshooting'],
        body: [
          paragraph(
            'Most issues stem from role hierarchy. If Plixi’s role is below the target role, it cannot assign it. Double-check slash command scopes and ensure the bot has Use Slash Commands in every channel.',
          ),
          callout(
            'warning',
            'Discord intents',
            'If commands suddenly disappear, confirm the Message Content intent is still enabled in the Developer Portal. Discord occasionally resets it when bots change ownership.',
          ),
        ],
      },
    ],
  },
  {
    title: 'Troubleshooting',
    slug: 'troubleshooting',
    intro: 'Self-serve fixes for the most common support tickets.',
    pages: [
      {
        title: 'Bot not responding',
        summary: 'Health checks and permission resets.',
        keywords: ['bot down', 'not responding'],
        body: [
          paragraph(
            'Verify the bot is online in Discord. If it appears offline, check the status page. When online but not responding, confirm you have command permissions and try running /ping.',
          ),
          callout(
            'info',
            'Quick restart',
            'Use the System → Status card to trigger a soft restart. It reconnects the gateway without interrupting jobs.',
          ),
        ],
      },
      {
        title: 'Missing permissions',
        summary: 'Diagnose Discord role hierarchy problems.',
        keywords: ['missing permissions'],
        body: [
          paragraph(
            'The dashboard flags missing permissions with a red banner. Hover to see exactly which permission is lacking. Fix it directly in Discord’s role settings.',
          ),
          callout(
            'tip',
            'Automation',
            'Click “Auto-fix role stack” to let Plixi reorder its role relative to managed roles you select.',
          ),
        ],
      },
      {
        title: 'Commands not appearing',
        summary: 'Slash command sync tips.',
        keywords: ['commands missing', 'sync'],
        body: [
          paragraph(
            'Slash commands sync automatically every hour. If they vanish, run /plixi sync in Discord (available to admins) or press “Force resync” in the dashboard.',
          ),
          callout(
            'warning',
            'Guild limits',
            'Discord caps the number of global and guild commands. Delete unused custom commands if you hit the ceiling.',
          ),
        ],
      },
      {
        title: 'Economy not updating',
        summary: 'Verify data stores and caches.',
        keywords: ['economy lag', 'not updating'],
        body: [
          paragraph(
            'If balances seem frozen, confirm there are no paused jobs or failed webhooks. The telemetry tab shows the last successful write and flags anomalies.',
          ),
          callout(
            'info',
            'Cache flush',
            'Use “Flush member cache” before filing a ticket. 90% of stale balance issues resolve instantly.',
          ),
        ],
      },
      {
        title: 'Dashboard not saving',
        summary: 'Resolve CSRF or validation errors.',
        keywords: ['save failed', 'csrf'],
        body: [
          paragraph(
            'Failed saves usually stem from expired sessions or unsatisfied required fields. Re-authenticate, then scan for highlighted inputs. Error toasts show the exact field names.',
          ),
          callout(
            'warning',
            'Browser extensions',
            'Aggressive privacy extensions sometimes block the CSRF cookie. Add dashboard.plixi.gg to your allowlist.',
          ),
        ],
      },
      {
        title: 'Sync delays',
        summary: 'Understand caching windows.',
        keywords: ['sync delay', 'cache'],
        body: [
          paragraph(
            'Some modules (like analytics) sync every few minutes instead of instantly to optimize load. A badge on each card lists the expected delay.',
          ),
          callout(
            'info',
            'Manual sync',
            'Look for the “Sync now” button in cards that support manual refreshes. It is safe to use anytime.',
          ),
        ],
      },
    ],
  },
  {
    title: 'FAQ',
    slug: 'faq',
    intro: 'Answer the most common customer questions.',
    pages: [
      {
        title: 'Is Plixi real money?',
        summary: 'Explain virtual currency boundaries.',
        keywords: ['real money', 'currency value'],
        body: [
          paragraph(
            'No. Plixi currency is fictional and locked to your Discord server. It has no exchange rate and cannot be withdrawn for cash.',
          ),
          callout(
            'warning',
            'Legal reminder',
            'State clearly in your server rules that credits are virtual and hold no real-world monetary value.',
          ),
        ],
      },
      {
        title: 'Can users trade currency?',
        summary: 'Outline trade rules and logging.',
        keywords: ['trade currency'],
        body: [
          paragraph(
            'Yes, as long as the trade module is enabled and both members have permission. Trades are logged and can include items, credits, or both.',
          ),
          callout(
            'info',
            'Limits',
            'Add per-day and per-transaction caps in the System → Trades card to stop laundering attempts.',
          ),
        ],
      },
      {
        title: 'Is gambling involved?',
        summary: 'Clarify legal stance and odds disclosures.',
        keywords: ['gambling', 'odds'],
        body: [
          paragraph(
            'Plixi simulates loot boxes and raffles with virtual currency. Because no fiat or crypto is withdrawn, it does not qualify as gambling in most regions. Still, disclose odds and follow Discord policy.',
          ),
          callout(
            'info',
            'Transparency',
            'Show odds percentages everywhere you present loot mechanics. It builds trust and keeps you compliant.',
          ),
        ],
      },
      {
        title: 'Can I reset data?',
        summary: 'Reset flows and warnings.',
        keywords: ['reset', 'wipe'],
        body: [
          paragraph(
            'You can reset currency, inventories, or shops from the dashboard. Each reset requires typing the guild name and generates audit logs.',
          ),
          callout(
            'warning',
            'Irreversible',
            'Resets delete data permanently. Export CSV backups before confirming.',
          ),
        ],
      },
      {
        title: 'Is this allowed by Discord ToS?',
        summary: 'Show compliance with Platform and Monetization policies.',
        keywords: ['discord tos', 'compliance'],
        body: [
          paragraph(
            'Yes. Plixi adheres to Discord’s policies by keeping currency virtual, disclosing odds, and offering moderation controls. Do not sell credits for real money unless you comply with Discord’s monetization requirements.',
          ),
          callout(
            'info',
            'Read the rules',
            'Cross-check Discord’s Community Guidelines and Monetization Terms whenever you plan new economy mechanics.',
          ),
        ],
      },
    ],
  },
  {
    title: 'Legal',
    slug: 'legal',
    intro: 'Plain-English policies linked from every footer.',
    pages: [
      {
        title: 'Terms of Service',
        summary: 'Contract governing usage and acceptable conduct.',
        keywords: ['tos', 'terms'],
        body: [
          paragraph(
            'By using Plixi you agree to operate a Discord server that follows Discord’s own Terms, to keep your account secure, and to respect other members. Plixi may suspend access if we detect abuse, fraud, or violations of law.',
          ),
          list(
            [
              'You remain responsible for how your staff uses the dashboard.',
              'Virtual credits issued through Plixi have no real-world value and cannot be redeemed for fiat or cryptocurrency.',
              'Subscriptions renew automatically each billing cycle until you cancel.',
            ],
            { ordered: false },
          ),
          callout(
            'warning',
            'Enforcement',
            'We reserve the right to remove features, suspend bots, or terminate access when a server violates these terms or Discord policy.',
          ),
        ],
      },
      {
        title: 'Privacy Policy',
        summary: 'Explain what data Plixi stores and why.',
        keywords: ['privacy', 'data'],
        body: [
          paragraph(
            'Plixi stores Discord user IDs, usernames, role mappings, and the data you configure in the dashboard (items, shops, logs). We never store plaintext passwords.',
          ),
          list(
            [
              'Telemetry helps monitor uptime and diagnose issues.',
              'Logs retain for 90 days unless your tier unlocks longer retention.',
              'You can request deletion of guild data by emailing support@plixi.gg from the owner’s account.',
            ],
            { variant: 'check' },
          ),
          callout(
            'info',
            'Regional compliance',
            'We honor GDPR and CCPA requests. Submit them through the in-app privacy form and we will respond within 30 days.',
          ),
        ],
      },
      {
        title: 'Refund Policy',
        summary: 'Subscription refunds and pro-rated credits.',
        keywords: ['refunds', 'billing'],
        body: [
          paragraph(
            'Subscriptions can be cancelled anytime. We provide pro-rated refunds within 14 days of purchase for annual plans and within 7 days for monthly plans if key features fail to work as advertised.',
          ),
          callout(
            'tip',
            'How to request',
            'Open a billing ticket inside the dashboard or email billing@plixi.gg with your guild ID and receipt. Refunds process back to the original payment source.',
          ),
        ],
      },
      {
        title: 'Subscription terms',
        summary: 'Billing cycles, upgrades, downgrades.',
        keywords: ['subscription', 'billing terms'],
        body: [
          paragraph(
            'Subscriptions renew automatically each month or year until cancelled. Upgrades take effect immediately with a pro-rated charge; downgrades apply at the next renewal.',
          ),
          callout(
            'info',
            'Failed payments',
            'We retry failed invoices three times over seven days. After that, premium features pause but data remains intact for 30 days.',
          ),
        ],
      },
      {
        title: 'Disclaimer',
        summary: 'Virtual currency has zero real-world value.',
        keywords: ['disclaimer', 'virtual currency'],
        body: [
          paragraph(
            'Plixi provides virtual economies for entertainment. Credits, items, and rewards issued through the service cannot be exchanged for real money, cryptocurrency, gift cards, or anything of monetary value outside Discord.',
          ),
          callout(
            'warning',
            'No investment value',
            'Nothing in the dashboard constitutes financial advice. Make it clear to your members that Plixi is purely for community engagement.',
          ),
        ],
      },
    ],
  },
];

const defaultBody = (sectionTitle, pageTitle) => [
  paragraph(`${pageTitle} walks through the considerations for ${sectionTitle.toLowerCase()}.`),
  paragraph('Detailed documentation is being expanded in upcoming releases. Submit feedback via the in-app support panel.'),
];

export const DOCS_SECTIONS = DOC_BLUEPRINT.map((section) => ({
  title: section.title,
  slug: section.slug,
  intro: section.intro,
  pages: section.pages.map((page) => ({
    title: page.title,
    slug: page.slug || `${section.slug}-${page.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    summary: page.summary,
    body: page.body || defaultBody(section.title, page.title),
    keywords: page.keywords || [],
  })),
}));

export const DOC_BLOCK_HELPERS = {
  paragraph,
  heading,
  divider,
  list,
  callout,
  code,
  table,
};
