// Titan Wealth International — deck-grounded library.
// Single source of truth taken from the master adviser deck for:
//   1. INTRO_PIECES   — the building blocks of an introduction meeting
//   2. PRODUCTS       — the Titan product set that goes into reports
//   3. REPORT_START / REPORT_END — the fixed pages every report begins/ends on
//   4. REPORT_TYPES   — the report types an adviser can build
// The agents and the UI (clickable detail views) both read from here.
// `points` are the slide bullet content used in detail views and agent grounding.

export type LibItem = {
  id: string;
  title: string;
  summary: string;
  points: string[];
  deckPages: string;
};

export type IntroPiece = LibItem & {
  relevance: string;
  alwaysOn?: boolean;
};

export const INTRO_PIECES: IntroPiece[] = [
  {
    id: "advice-team",
    title: "Your Advice Team",
    summary:
      "Introduces the Titan adviser and the wider advice team supporting the client.",
    relevance: "Every introduction",
    alwaysOn: true,
    deckPages: "5",
    points: [
      "Your named adviser, with a direct line whenever it suits you",
      "A full advice team behind them (paraplanner, associate, administration)",
      "Qualifications and experience (DipFA, CISI, LIBF)",
    ],
  },
  {
    id: "structure-security",
    title: "Financial Structure & Security",
    summary:
      "Maps the client's current structure — accounts, income, living costs and emergency reserve — in their own currency, and frames the simple early fixes around structure and protection.",
    relevance: "Every introduction",
    alwaysOn: true,
    deckPages: "44–74",
    points: [
      "Current accounts, income and monthly living costs, in the client's own currency",
      "An emergency reserve sized to outgoings (typically months of living costs)",
      "The simple early fixes: get the structure right first, then protection",
      "Where cash is working and where it is sitting idle",
    ],
  },
  {
    id: "cash-on-account",
    title: "Cash on Account & Inflation",
    summary:
      "The real cost of holding too much cash: inflation eroding purchasing power over time.",
    relevance: "Cash-heavy clients",
    deckPages: "78",
    points: [
      "The real cost of holding too much cash",
      "Inflation eroding purchasing power year on year",
      "How much to keep liquid versus put to work",
    ],
  },
  {
    id: "understanding-pension",
    title: "Understanding Your Pension",
    summary:
      "How the client's pensions work, the options on relocation, and consolidation considerations.",
    relevance: "Clients with UK pensions",
    deckPages: "80",
    points: [
      "How the client's pensions work today",
      "Options on relocation and whether to consolidate",
      "Drawdown, lump sum and beneficiary considerations",
    ],
  },
  {
    id: "national-insurance",
    title: "National Insurance",
    summary:
      "How UK National Insurance works while living or working abroad, voluntary contributions, and protecting the State Pension.",
    relevance: "UK nationals with NI history",
    deckPages: "75–77",
    points: [
      "Paying NI while working abroad and social-security agreements",
      "Voluntary contributions to protect benefit and State Pension entitlement",
      "Checking the State Pension forecast",
    ],
  },
];

export type Product = LibItem & {
  category: string;
  relevance: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "sipp",
    title: "SIPP",
    category: "Pensions",
    summary:
      "UK FCA-regulated personal pension wrapper; a life-long plan with income drawdown, and the full fund is inheritable by named beneficiaries.",
    relevance: "UK pension consolidation, retirement income",
    deckPages: "204–207",
    points: [
      "UK FCA-regulated personal pension wrapper, open architecture",
      "Life-long plan with income drawdown in retirement",
      "Full fund inheritable by named beneficiaries",
      "Illustration: ~£1.0m at 4% net grows through retirement with a tapering AMC",
    ],
  },
  {
    id: "qrops",
    title: "QROPS / QNUPS",
    category: "Pensions",
    summary:
      "Overseas pension schemes for expats; used for cross-border pension transfers and IHT planning.",
    relevance: "Non-UK-resident pension transfers",
    deckPages: "—",
    points: [
      "Overseas pension schemes for non-UK residents",
      "Cross-border transfer of UK pension benefits",
      "Used for jurisdiction and IHT planning",
    ],
  },
  {
    id: "offshore-bond",
    title: "Offshore / International Bond",
    category: "Wrappers",
    summary:
      "Offshore portfolio bond (e.g. RL360, Standard Life International): tax-efficient, multi-currency, gross roll-up, and can be trust-wrapped for IHT.",
    relevance: "Tax-efficient growth, multi-currency, IHT",
    deckPages: "108, 112",
    points: [
      "Gross roll-up (tax deferral) on growth",
      "5% tax-deferred withdrawals each year",
      "Time apportionment and top-slicing relief",
      "Trust-wrappable to make it IHT-efficient",
      "Open architecture; no CGT on internal switches",
      "Portable across jurisdictions and accessible from Saudi Arabia",
      "Providers: RL360, Standard Life International",
    ],
  },
  {
    id: "trust",
    title: "Trust Wrapping",
    category: "Estate / IHT",
    summary:
      "Wrapping a bond in trust to remove it from the UK estate for IHT while the client retains control.",
    relevance: "IHT exposure, estate planning",
    deckPages: "102, 116",
    points: [
      "Removes assets from the UK estate for IHT while retaining control",
      "Wrapping an offshore bond in trust makes it IHT-efficient",
      "Worked example: £1,000,000 in trust versus without",
    ],
  },
  {
    id: "isa-gia",
    title: "ISA / GIA",
    category: "Wrappers",
    summary:
      "UK ISA and General Investment Account for tax-efficient and flexible holdings.",
    relevance: "UK-resident or returning clients",
    deckPages: "108–109",
    points: [
      "ISA: tax-free growth and income within the annual allowance",
      "General Investment Account: flexible, no contribution cap",
      "Best for UK-resident or soon-to-return clients",
    ],
  },
  {
    id: "mps",
    title: "Model Portfolio Service",
    category: "Investment",
    summary:
      "Titan's discretionary model portfolios (e.g. Balanced 60/40), reviewed monthly by the Investment Committee.",
    relevance: "Core investment recommendation",
    deckPages: "110, 303–307",
    points: [
      "Risk-mapped discretionary models (e.g. Balanced 60/40)",
      "Reviewed monthly by the Investment Committee",
      "Benchmark comparison and disciplined rebalancing",
    ],
  },
  {
    id: "dfm",
    title: "Discretionary Fund Management",
    category: "Investment",
    summary: "Bespoke discretionary management for larger or complex portfolios.",
    relevance: "Higher-value or bespoke mandates",
    deckPages: "11–12",
    points: [
      "Bespoke discretionary mandate rather than a model",
      "For larger or more complex portfolios",
    ],
  },
  {
    id: "annuity",
    title: "Annuity",
    category: "Retirement income",
    summary: "Securing guaranteed income in retirement.",
    relevance: "Income certainty in retirement",
    deckPages: "198",
    points: [
      "Secures a guaranteed income in retirement",
      "Trades flexibility for certainty",
    ],
  },
  {
    id: "protection",
    title: "Protection (Life & Critical Illness)",
    category: "Protection",
    summary:
      "Whole of life and critical illness cover to protect the family, any liabilities, and estate liquidity.",
    relevance: "Dependents, mortgage, estate liquidity",
    deckPages: "11, 15",
    points: [
      "Term assurance, whole of life and critical illness cover",
      "Protects the family, liabilities and estate liquidity",
    ],
  },
  {
    id: "mortgage",
    title: "Mortgage / Lending",
    category: "Lending",
    summary: "UK and international property lending solutions.",
    relevance: "Property purchase or refinance",
    deckPages: "12",
    points: [
      "UK and international property lending",
      "Purchase, refinance and equity-release routes",
    ],
  },
];

// Every report opens on these, in this order.
export const REPORT_START: LibItem[] = [
  {
    id: "assessment",
    title: "Assessment Report",
    summary: "Cover and executive summary of the client's position and objectives.",
    deckPages: "1",
    points: [
      "Cover and client details",
      "Executive summary of position and objectives",
      "What this report sets out to answer",
    ],
  },
  {
    id: "asset-overview",
    title: "Asset Overview",
    summary: "Full picture of assets, liabilities, income and expenditure.",
    deckPages: "13–19",
    points: [
      "Assets, liabilities, income and expenditure",
      "Property, pensions, cash and investments",
      "Net position and monthly surplus",
    ],
  },
  {
    id: "exposures",
    title: "Exposures",
    summary:
      "Tax, currency, IHT and concentration exposures in the current arrangement.",
    deckPages: "23–27",
    points: [
      "Tax exposure (income, CGT, IHT)",
      "Currency exposure across holdings",
      "Concentration and provider risk",
      "Estimated IHT exposure today and projected",
    ],
  },
];

// Every report closes on these, in this order.
export const REPORT_END: LibItem[] = [
  {
    id: "mps-close",
    title: "Model Portfolio Service",
    summary: "The recommended Titan investment solution.",
    deckPages: "303–307",
    points: ["The recommended Titan investment solution", "Risk-mapped model and rationale"],
  },
  {
    id: "client-servicing",
    title: "Client Servicing",
    summary: "The ongoing service, review cadence and points of contact.",
    deckPages: "352–353",
    points: [
      "Direct line to your adviser, plus a full team",
      "Quarterly call, annual meeting and ongoing wealth tracking",
      "Portfolio performance versus benchmark and rebalancing",
      "Investor portal with live feeds across your accounts",
      "Fee: 0.25% per quarter",
    ],
  },
  {
    id: "sign-off",
    title: "Sign-off",
    summary: "Signed final page with a brief personal note from the adviser.",
    deckPages: "—",
    points: ["A brief personal note from the adviser", "Signature and next steps"],
  },
];

export type ReportType = {
  id: string;
  label: string;
  description: string;
};

// Report types the advisor can start from (pre-populated in Templates).
export const REPORT_TYPES: ReportType[] = [
  {
    id: "new_client_assessment",
    label: "Full client assessment",
    description: "The complete suitability report from a first meeting.",
  },
  {
    id: "review_pack",
    label: "Review pack",
    description: "A periodic review against the house view.",
  },
  {
    id: "introductory_pitch",
    label: "Introduction",
    description: "A pre-meeting introduction (usually created via New engagement).",
  },
  {
    id: "custom",
    label: "Bespoke document",
    description: "Any other Titan document, built from one example.",
  },
];

export const findProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
export const findReportType = (id: string) => REPORT_TYPES.find((t) => t.id === id);
