export const TOP_NAV_LINKS = [
  { label: 'Dashboard', to: '/' },
  { label: 'Features', to: '/#core-features' },
  { label: 'Premium', to: '/premium' },
  { label: 'Docs', to: '/docs' },
];

export const SIDEBAR_GROUPS = [
  {
    title: 'Control Center',
    items: [{ key: 'dashboard', label: 'Dashboard', icon: '🏠', path: '/' }],
  },
  {
    title: 'Systems',
    items: [
      { key: 'economy', label: 'Economy', icon: '💸', path: '/economy' },
      { key: 'jobs', label: 'Jobs', icon: '🛠️', path: '/jobs' },
      { key: 'marketplace', label: 'Marketplace', icon: '🛍️', path: '/marketplace' },
      { key: 'mystery', label: 'Mystery Boxes', icon: '🎁', path: '/mystery-boxes' },
      { key: 'raffles', label: 'Raffles', icon: '🎟️', path: '/raffles' },
    ],
  },
  {
    title: 'Insights',
    items: [
      { key: 'premium', label: 'Premium', icon: '💎', path: '/premium' },
      { key: 'logs', label: 'Logs', icon: '📜', path: '/logs' },
      { key: 'leaderboards', label: 'Leaderboards', icon: '🏆', path: '/leaderboards' },
      { key: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' },
    ],
  },
];

export const FEATURE_SECTIONS = [
  { key: 'core', title: 'Core Features', description: 'XP engines, jobs, and marketplaces that drive your economy.' },
  { key: 'management', title: 'Server Management', description: 'Drops, raffles, and hype mechanics for every event.' },
  { key: 'utilities', title: 'Utilities', description: 'Premium tooling, leaderboards, and observability layers.' },
];

export const FEATURE_MODULES = [
  {
    key: 'economy',
    title: 'Economy Engine',
    description: 'Tune payouts, taxes, and cooldowns to shape your currency loops.',
    icon: '💸',
    category: 'core',
    premium: false,
    route: '/economy',
    pill: 'Core',
    defaultEnabled: true,
    modes: ['balanced', 'aggressive', 'chill'],
  },
  {
    key: 'jobs',
    title: 'Jobs Board',
    description: 'Stackable contracts with difficulty tiers, rerolls, and streak logic.',
    icon: '🛠️',
    category: 'core',
    premium: false,
    route: '/jobs',
    pill: 'Automation',
    defaultEnabled: true,
    modes: ['standard', 'hardcore', 'cozy'],
  },
  {
    key: 'marketplace',
    title: 'Marketplace',
    description: 'Let members trade cosmetics, boosts, and creator drops safely.',
    icon: '🛍️',
    category: 'core',
    premium: false,
    route: '/marketplace',
    pill: 'Commerce',
    defaultEnabled: true,
    modes: ['curated', 'open', 'seasonal'],
  },
  {
    key: 'mysteryBoxes',
    title: 'Mystery Boxes',
    description: 'Cinematic unboxings with pity timers, rare pools, and custom skins.',
    icon: '🎁',
    category: 'management',
    premium: false,
    route: '/mystery-boxes',
    pill: 'Events',
    defaultEnabled: false,
    modes: ['cinematic', 'arcade', 'minimal'],
  },
  {
    key: 'raffles',
    title: 'Raffles',
    description: 'Ticket-based giveaways with verification and multi-winner draws.',
    icon: '🎟️',
    category: 'management',
    premium: false,
    route: '/raffles',
    pill: 'Engagement',
    defaultEnabled: true,
    modes: ['verification', 'open'],
  },
  {
    key: 'leaderboards',
    title: 'Leaderboards',
    description: 'Seasonal ranked ladders with trophy roles and automated resets.',
    icon: '🏆',
    category: 'utilities',
    premium: true,
    route: '/leaderboards',
    pill: 'Premium',
    defaultEnabled: true,
    modes: ['seasonal', 'lifetime'],
  },
  {
    key: 'premium',
    title: 'Premium Hub',
    description: 'AI insights, concierge support, and branding overrides for top guilds.',
    icon: '💎',
    category: 'utilities',
    premium: true,
    route: '/premium',
    pill: 'Upgrade',
    defaultEnabled: true,
    modes: ['ai', 'concierge'],
  },
  {
    key: 'logs',
    title: 'Audit Logs',
    description: 'Live stream of bot actions with retention controls and alerts.',
    icon: '📜',
    category: 'utilities',
    premium: false,
    route: '/logs',
    pill: 'Visibility',
    defaultEnabled: true,
    modes: ['compressed', 'verbose'],
  },
  {
    key: 'settings',
    title: 'Server Settings',
    description: 'Maintenance windows, beta access, and timezone alignment.',
    icon: '⚙️',
    category: 'utilities',
    premium: false,
    route: '/settings',
    pill: 'Admin',
    defaultEnabled: true,
    modes: ['auto', 'manual'],
  },
];

export const FEATURE_FLAG_DEFAULTS = FEATURE_MODULES.reduce((acc, module) => {
  acc[module.key] = {
    enabled: module.defaultEnabled ?? false,
    mode: module.modes?.[0] ?? 'auto',
  };
  return acc;
}, {});

export const MOCK_USER = {
  id: 'plixi-admin',
  username: 'Ari Rhythm',
  discriminator: '1024',
  avatar: 'https://i.pravatar.cc/80?img=47',
  banner: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=60',
  planTier: 'Creator',
};

export const MOCK_GUILDS = [
  {
    id: 'guild-starlance',
    name: 'Starlance Collective',
    icon: '🌌',
    memberCount: 128402,
    premium: true,
    vanity: 'starlance.gg',
  },
  {
    id: 'guild-synth',
    name: 'Synth District',
    icon: '🎛️',
    memberCount: 74218,
    premium: false,
    vanity: 'discord.gg/synth',
  },
  {
    id: 'guild-harbor',
    name: 'Harbor Operators',
    icon: '⚓',
    memberCount: 22451,
    premium: false,
    vanity: 'plixi.gg/harbor',
  },
];

export const DEFAULT_SETTINGS = {
  economy: {
    economyEnabled: true,
    startingBalance: 250,
    dailyCooldown: 6,
    workReward: 180,
    taxRate: 5,
    currencyName: 'Credits',
    previewMode: 'balanced',
  },
  jobs: {
    jobsEnabled: true,
    jobDifficulty: 'standard',
    shiftLength: 4,
    payoutMultiplier: 1.2,
    rerollCost: 150,
    autoAssign: true,
  },
  marketplace: {
    marketplaceEnabled: true,
    allowUserListings: true,
    listingFee: 4,
    featuredSlots: 3,
    currencyName: 'Credits',
    premiumAnalytics: true,
  },
  mysteryBoxes: {
    boxesEnabled: true,
    legendaryRate: 3,
    animationStyle: 'nebula',
    guaranteedDrops: false,
  },
  raffles: {
    rafflesEnabled: true,
    maxTickets: 120,
    requireVerification: true,
    notifyWinners: true,
    autoClaim: false,
  },
  premium: {
    aiInsights: true,
    brandingControl: true,
    concierge: false,
  },
  logs: {
    logRetentionDays: 14,
    streamingChannels: ['#plixi-audit'],
    alertOnFailures: true,
    maskSensitive: true,
  },
  leaderboards: {
    leaderboardsEnabled: true,
    rotation: 'monthly',
    rewardRole: 'Top 10',
    celebrateWithEmbeds: true,
  },
  settings: {
    maintenanceMode: false,
    timezone: 'UTC',
    allowBeta: true,
  },
  featureFlags: FEATURE_FLAG_DEFAULTS,
};
