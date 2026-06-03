// The Titan Solutions catalog — the governed library of master-deck slides,
// organised into sections an adviser can search by topic/solution.
//
// Each solution lists the EXACT deck pages (rendered to /public/deck-slides/,
// cropped of client footnotes/disclaimers). Captions are the real slide titles
// from the master deck. A solution with no slides yet but a `productId` falls
// back to that product's library points (titan-library).
//
// Only GENERIC, governed explainer/product slides are listed here — client
// worked examples (illustrations, quotes, vested-share and US-situs case
// slides) are deliberately excluded so the library stays reusable.
//
// Slide image path = `/deck-slides/p<page>.png`.

export type CatalogSlide = { page: number; caption: string };

export type CatalogSolution = {
  id: string;
  title: string;
  summary: string;
  /** Extra synonyms/terms so search finds this even with different wording. */
  keywords?: string;
  whenToUse?: string;
  slides: CatalogSlide[];
  productId?: string; // fallback to titan-library points when slides is empty
};

export type CatalogSection = {
  id: string;
  title: string;
  blurb: string;
  solutions: CatalogSolution[];
};

export const SOLUTION_SECTIONS: CatalogSection[] = [
  {
    id: "offshore-bonds",
    title: "Offshore Bonds",
    blurb:
      "Tax-efficient international investment wrappers — the fundamentals, by provider, and by destination.",
    solutions: [
      {
        id: "offshore-bond",
        title: "How Offshore Bonds Work",
        summary:
          "The core tax mechanics of an international portfolio bond — the foundation of most expat investment recommendations.",
        keywords:
          "portfolio bond wrapper tax deferred gross roll-up 5% withdrawals top slicing segmentation super six international offshore",
        whenToUse: "Tax-efficient growth, multi-currency, IHT planning.",
        slides: [
          { page: 96, caption: "The 'Super Six' tax benefits" },
          { page: 97, caption: "Benefit 1 — gross roll-up" },
          { page: 98, caption: "Benefit 2 — 5% tax-deferred withdrawals" },
          { page: 99, caption: "Benefit 3 — time apportionment relief (TAR)" },
          { page: 100, caption: "Benefit 4 — segmentation & gift assignment" },
          { page: 101, caption: "Benefit 5 — top-slicing relief" },
          { page: 102, caption: "Benefit 6 — trust wrapping" },
          { page: 103, caption: "Portable wealth — tax comparison" },
          { page: 108, caption: "Offshore portfolio bond — feature comparison" },
        ],
      },
      {
        id: "rl360",
        title: "RL360 International Bond",
        summary:
          "Isle of Man portfolio bond — open architecture, provider strength and ring-fenced asset protection.",
        keywords: "royal london isle of man IOM PIMS open architecture portfolio bond",
        slides: [
          { page: 91, caption: "RL360 International Portfolio Bond — overview" },
          { page: 93, caption: "RL360 — product provider strength" },
          { page: 94, caption: "RL360 International — PIMS open architecture" },
          { page: 95, caption: "Isle of Man — ring-fenced asset protection" },
        ],
      },
      {
        id: "rl360-platform",
        title: "RL360 Platform (Regular Savings)",
        summary:
          "RL360's regular-savings platform — recommended for phased investing, with dollar-cost averaging through market volatility.",
        keywords: "regular savings plan RSP dollar cost averaging DCA phased drip feed platform royal london",
        slides: [
          { page: 84, caption: "RL360 Platform — overview" },
          { page: 85, caption: "Platform provider recommendation" },
          { page: 87, caption: "Dollar-cost averaging — benefiting from volatility" },
          { page: 88, caption: "How it works in practice" },
        ],
      },
      {
        id: "utmost",
        title: "Utmost International Bond",
        summary:
          "Utmost (Apex) bond with residency-driven structuring for European destinations — France, Portugal, Spain and Sweden.",
        keywords:
          "apex assurance vie europe france portugal spain sweden irish insurer NHR beckham swedish executive portfolio",
        slides: [
          { page: 119, caption: "Utmost International Portfolio Bond — overview" },
          { page: 122, caption: "Utmost Wealth Solutions — Apex" },
          { page: 124, caption: "Utmost Group — global footprint" },
          { page: 127, caption: "Why use Irish-based insurers — tax benefits" },
          { page: 130, caption: "European compatibility" },
          { page: 121, caption: "Residency-driven structuring — France" },
          { page: 136, caption: "Residency-driven structuring — Portugal" },
          { page: 148, caption: "Portugal — NHR vs NHR 2.0 (IFICI)" },
          { page: 153, caption: "Residency-driven structuring — Spain" },
          { page: 155, caption: "Spain — Beckham's Law (future position)" },
          { page: 167, caption: "Spanish-compliant investment bond" },
          { page: 173, caption: "Utmost — Swedish Executive Portfolio" },
        ],
      },
      {
        id: "fpi",
        title: "Friends Provident International Bond",
        summary:
          "Friends Provident International portfolio bond — provider overview and investor protection.",
        keywords: "friends provident international FPI portfolio bond isle of man",
        slides: [
          { page: 114, caption: "FPI International Portfolio Bond — overview" },
          { page: 115, caption: "Friends Provident International — product provider" },
          { page: 117, caption: "Protection for investors" },
        ],
      },
      {
        id: "gia-vs-wrapper",
        title: "Tax Wrapper vs GIA",
        summary:
          "Why a tax wrapper beats a General Investment Account — a direct, like-for-like comparison.",
        keywords: "general investment account GIA capital gains tax dividend tax wrapper comparison fixed income",
        slides: [
          { page: 42, caption: "General Investment Account vs tax wrapper — direct comparison" },
          { page: 43, caption: "Fixed income — with vs without a tax wrapper" },
        ],
      },
    ],
  },
  {
    id: "pensions",
    title: "Pensions & Retirement",
    blurb:
      "UK pension review, transfer analysis and SIPP solutions for internationally mobile clients.",
    solutions: [
      {
        id: "understanding-pension",
        title: "Understanding Your Pension & NI",
        summary:
          "How UK pensions work for expats, and National Insurance while living and working abroad.",
        keywords: "national insurance NI state pension qualifying years voluntary contributions class 2 class 3 abroad",
        slides: [
          { page: 80, caption: "Understanding your UK pension" },
          { page: 77, caption: "What is National Insurance?" },
          { page: 76, caption: "National Insurance when you work abroad" },
          { page: 75, caption: "National Insurance — voluntary contributions" },
        ],
      },
      {
        id: "pension-transfers",
        title: "DB / DC Schemes, CETV & Transfers",
        summary:
          "Reviewing defined-benefit and defined-contribution schemes and the cash equivalent transfer value.",
        keywords: "defined benefit defined contribution final salary CETV cash equivalent transfer value L&G occupational",
        slides: [
          { page: 197, caption: "Defined contribution schemes" },
          { page: 198, caption: "L&G defined contribution scheme" },
          { page: 199, caption: "Defined benefit scheme" },
          { page: 200, caption: "Cash Equivalent Transfer Value (CETV)" },
          { page: 205, caption: "Defined benefit vs SIPP — comparison" },
        ],
      },
      {
        id: "sipp",
        title: "SIPP",
        summary:
          "UK FCA-regulated personal pension — open architecture, flexi-access drawdown, 25% tax-free cash, inheritable.",
        keywords: "self invested personal pension drawdown flexi-access tax-free cash morningstar IFGL provider",
        whenToUse: "UK pension consolidation, retirement income.",
        slides: [
          { page: 207, caption: "What is a SIPP?" },
          { page: 206, caption: "Morningstar SIPP" },
          { page: 208, caption: "Who is Morningstar?" },
          { page: 211, caption: "IFGL SIPP" },
          { page: 213, caption: "Who is IFGL?" },
        ],
      },
      {
        id: "qrops",
        title: "QROPS / QNUPS",
        summary:
          "Overseas pension schemes for non-UK residents — cross-border transfer and IHT planning.",
        keywords: "qrops qnups rops overseas pension recognised non-uk transfer",
        slides: [],
        productId: "qrops",
      },
    ],
  },
  {
    id: "platforms",
    title: "Investment Platforms",
    blurb:
      "Open, transparent platforms for general (non-pension) investment and ISA/GIA holdings.",
    solutions: [
      {
        id: "morningstar-platform",
        title: "Morningstar Platform",
        summary:
          "Transparent investment platform with full reporting and a USD cash account option.",
        keywords: "morningstar platform usd cash account reporting transparent",
        slides: [
          { page: 216, caption: "Morningstar Platform — overview" },
          { page: 217, caption: "Who is Morningstar?" },
          { page: 219, caption: "Morningstar USD cash account rate" },
        ],
      },
      {
        id: "ardan-platform",
        title: "Ardan Platform",
        summary:
          "Multi-currency, open-architecture international wealth platform.",
        keywords: "ardan platform multi-currency open architecture international",
        slides: [
          { page: 220, caption: "Ardan Platform — overview" },
          { page: 221, caption: "Who is Ardan?" },
        ],
      },
      {
        id: "isa-gia",
        title: "ISA / GIA",
        summary:
          "UK ISA and General Investment Account for tax-efficient and flexible holdings.",
        keywords: "individual savings account ISA general investment account GIA UK wrapper",
        slides: [],
        productId: "isa-gia",
      },
    ],
  },
  {
    id: "mps",
    title: "Model Portfolio Service",
    blurb:
      "Titan's discretionary, risk-mapped model portfolios — the core investment engine.",
    solutions: [
      {
        id: "mps",
        title: "Model Portfolio Service",
        summary:
          "Risk-mapped discretionary models (Defensive to Adventurous) in GBP, USD and EUR, reviewed monthly by the Investment Committee.",
        keywords:
          "model portfolio discretionary risk mapped defensive cautious balanced growth adventurous investment committee asset allocation",
        whenToUse: "Core investment recommendation.",
        slides: [
          { page: 303, caption: "Model Portfolio Service" },
          { page: 305, caption: "Contents" },
          { page: 306, caption: "Global coverage" },
          { page: 307, caption: "Investment Portfolio Service" },
          { page: 309, caption: "Investment approach" },
          { page: 310, caption: "Investment Committee" },
          { page: 311, caption: "Market outlook update" },
          { page: 313, caption: "Risk-weighted mandates" },
          { page: 314, caption: "Model portfolio returns — overview" },
          { page: 317, caption: "Underlying holdings" },
          { page: 318, caption: "Defensive — allocation" },
          { page: 319, caption: "Cautious — allocation" },
          { page: 320, caption: "Balanced — allocation" },
          { page: 321, caption: "Growth — allocation" },
          { page: 322, caption: "Adventurous — allocation" },
        ],
      },
    ],
  },
  {
    id: "dfm",
    title: "Discretionary Fund Management",
    blurb:
      "Bespoke discretionary management, the investment process, and Titan's in-house funds.",
    solutions: [
      {
        id: "dfm",
        title: "Discretionary Fund Management",
        summary:
          "Bespoke discretionary mandates, the Titan investment process, and proprietary funds.",
        keywords: "discretionary fund management DFM bespoke titan hybrid capital bond global equity investment process",
        whenToUse: "Higher-value or bespoke mandates.",
        slides: [
          { page: 307, caption: "Investment Portfolio Service" },
          { page: 309, caption: "Investment approach" },
          { page: 310, caption: "Investment Committee" },
          { page: 344, caption: "Investing for the long term" },
          { page: 345, caption: "Titan Hybrid Capital Bond Fund — performance" },
          { page: 346, caption: "Titan Global Equity — performance" },
          { page: 347, caption: "Asset allocation & market cycles" },
          { page: 349, caption: "Understanding cycles" },
        ],
      },
    ],
  },
  {
    id: "retirement-income",
    title: "Retirement Income",
    blurb:
      "Income and capital-protection solutions for the drawdown years.",
    solutions: [
      {
        id: "uli",
        title: "Universal Life Insurance (ULI)",
        summary:
          "Indexed life cover with an investment account that locks in gains — protection plus capital growth with no market losses.",
        keywords: "universal life insurance indexed IUL death benefit capital guarantee income drawdown protection",
        slides: [
          { page: 223, caption: "Universal Life Insurance" },
          { page: 224, caption: "Indexed Universal Life — capital guarantee" },
          { page: 225, caption: "Benefits of Indexed Universal Life" },
          { page: 226, caption: "Maximum death benefit (years 1–10)" },
          { page: 227, caption: "Income drawdown (year 11+)" },
          { page: 228, caption: "Lifetime & estate benefits — summary" },
        ],
      },
      {
        id: "mgg",
        title: "MGG (Manulife Global Generations)",
        summary:
          "Income solution offering 100% liquid withdrawals, managing sequence-of-returns risk.",
        keywords: "MGG manulife global generations income liquid withdrawals",
        slides: [
          { page: 242, caption: "MGG — Manulife Global Generations" },
          { page: 243, caption: "Manulife Global Generations — overview" },
        ],
      },
      {
        id: "sunjoy",
        title: "SunJoy Global (Sun Life Par Fund)",
        summary:
          "Sun Life participating whole-of-life plan with a long, stable track record (7.19% annualised since 2001).",
        keywords: "sun life sunjoy par fund participating whole of life smoothing annualised returns",
        slides: [
          { page: 262, caption: "SunJoy Global" },
          { page: 263, caption: "Sun Life — SunJoy Global" },
          { page: 264, caption: "Sun Life — Par Fund" },
          { page: 265, caption: "What is a participating whole-of-life plan?" },
          { page: 266, caption: "Par Fund — annualised returns since 2001" },
          { page: 267, caption: "Par Fund — smoothing" },
          { page: 269, caption: "Income & risk management" },
        ],
      },
      {
        id: "sequence-risk",
        title: "Sequence Risk in Retirement",
        summary:
          "Why the order of returns matters in drawdown, and the gain needed to recover from a loss.",
        keywords: "sequence of returns risk drawdown order pound cost ravaging bear market recovery",
        slides: [
          { page: 255, caption: "Sequence investment risk" },
          { page: 256, caption: "Sequence-of-returns risk" },
          { page: 257, caption: "Retiring in 1990 with $1m" },
          { page: 258, caption: "Retiring in 2000 with $1m" },
          { page: 259, caption: "S&P 500 — 100 years of bull & bear markets" },
        ],
      },
      {
        id: "annuity",
        title: "Annuity",
        summary: "Securing a guaranteed income in retirement.",
        keywords: "annuity guaranteed income lifetime",
        slides: [],
        productId: "annuity",
      },
      {
        id: "protection",
        title: "Protection (Life & Critical Illness)",
        summary:
          "Whole-of-life and critical-illness cover to protect the family, liabilities and estate liquidity.",
        keywords: "protection life cover critical illness income protection family liabilities",
        slides: [],
        productId: "protection",
      },
    ],
  },
  {
    id: "estate-tax",
    title: "Estate & Tax Planning",
    blurb:
      "Protecting the estate from UK inheritance tax, US estate tax and probate.",
    solutions: [
      {
        id: "uk-iht",
        title: "UK Inheritance Tax",
        summary:
          "How UK IHT applies to a worldwide estate — the system, UK-situs assets, allowances and pensions.",
        keywords: "inheritance tax IHT death duty estate nil rate band residence allowance UK situs domicile",
        slides: [
          { page: 35, caption: "Old vs new IHT system" },
          { page: 36, caption: "UK-situs assets" },
          { page: 37, caption: "IHT allowances" },
          { page: 38, caption: "UK pensions & IHT" },
        ],
      },
      {
        id: "us-estate-tax",
        title: "US Estate Tax & Treaties",
        summary:
          "US estate and gift tax exposure for those with US-situs assets, and how to mitigate it.",
        keywords: "US estate tax gift tax situs assets treaty probate non-resident alien shares ETF",
        slides: [
          { page: 229, caption: "US estate tax — overview" },
          { page: 230, caption: "US estate tax — how it works" },
          { page: 232, caption: "US-situs assets commonly held" },
          { page: 233, caption: "US estate tax treaties" },
          { page: 234, caption: "Federal estate & gift tax rates — US citizens" },
          { page: 235, caption: "Federal estate & gift tax rates — non-US citizens" },
          { page: 236, caption: "Estate tax — worked example" },
          { page: 237, caption: "Case study" },
          { page: 238, caption: "How we can help" },
          { page: 240, caption: "Avoiding US estate tax & probate" },
          { page: 241, caption: "Other considerations" },
        ],
      },
      {
        id: "trust",
        title: "Trust Wrapping",
        summary:
          "Placing a bond in trust to sit outside the estate for IHT while retaining control.",
        keywords: "trust wrapping IHT estate outside the estate settlor control gift",
        whenToUse: "IHT exposure, estate planning.",
        slides: [{ page: 102, caption: "Trust wrapping — outside the estate for IHT" }],
      },
      {
        id: "opes",
        title: "Overseas Trust & Pension (OPES)",
        summary:
          "OPES/OTAP overseas trust and pension structures for cross-border estate and CGT planning.",
        keywords: "OPES OTAP overseas trust pension CGT capital gains south africa cross-border",
        slides: [
          { page: 271, caption: "OTAP / OPES — information" },
          { page: 272, caption: "Overseas Trust and Pension" },
          { page: 273, caption: "Scope of services" },
          { page: 274, caption: "OPES — South Africa" },
          { page: 275, caption: "CGT benefits of a trust" },
        ],
      },
    ],
  },
  {
    id: "residency-migration",
    title: "Residency & Migration",
    blurb:
      "Residency tests, visas and cross-border relocation planning.",
    solutions: [
      {
        id: "residency",
        title: "Residency & the SRT",
        summary:
          "Why residency drives the plan, the UK Statutory Residency Test, and the overseas/ties tests.",
        keywords: "statutory residency test SRT finance act 2013 automatic overseas ties domicile non-resident",
        slides: [
          { page: 33, caption: "Why is residency important?" },
          { page: 34, caption: "Statutory Residency Test (Finance Act 2013)" },
          { page: 20, caption: "Automatic overseas test" },
          { page: 21, caption: "Potential ties to the UK" },
        ],
      },
      {
        id: "migration",
        title: "Visas & Relocation",
        summary:
          "UAE visa options, moving to the UAE, departing the UK, and country entry & residency strategies.",
        keywords: "visa relocation NT code UAE move emigrate golden visa france cyprus ireland italy portugal entry strategy",
        slides: [
          { page: 25, caption: "UAE visa options" },
          { page: 282, caption: "Moving to the UAE" },
          { page: 285, caption: "UAE visa" },
          { page: 286, caption: "Offshore banking" },
          { page: 287, caption: "Applying for an NT code" },
          { page: 290, caption: "Ensuring a seamless tax transition" },
          { page: 291, caption: "France — entry & residency strategies" },
          { page: 293, caption: "Cyprus — entry & residency strategy" },
          { page: 295, caption: "Ireland — entry & residency strategies" },
          { page: 297, caption: "Italy — entry & residency strategies" },
          { page: 299, caption: "Portugal — entry & residency strategies" },
        ],
      },
      {
        id: "mortgage",
        title: "Mortgage / Lending",
        summary:
          "UK and international property lending — purchase, refinance and equity release.",
        keywords: "mortgage lending property loan refinance equity release buy to let",
        slides: [],
        productId: "mortgage",
      },
    ],
  },
  {
    id: "shariah",
    title: "Shariah-Compliant Investing",
    blurb:
      "Sharia-compliant fund options across equities, sukuk, precious metals and gold.",
    solutions: [
      {
        id: "shariah",
        title: "Shariah-Compliant Investing",
        summary:
          "A range of Sharia-compliant funds for clients who require it — equities, sukuk, precious metals and gold.",
        keywords: "shariah sharia islamic halal sukuk HSBC franklin precious metals gold ETF compliant",
        slides: [
          { page: 276, caption: "Shariah-compliant range" },
          { page: 277, caption: "HSBC Islamic Global Equity Fund" },
          { page: 278, caption: "SP Funds S&P 500 Sharia ETF" },
          { page: 279, caption: "Franklin Global Sukuk Fund" },
          { page: 280, caption: "DWS Noor Precious Metals" },
          { page: 281, caption: "iShares Physical Gold ETC" },
        ],
      },
    ],
  },
];

export const ALL_SOLUTIONS: CatalogSolution[] = SOLUTION_SECTIONS.flatMap(
  (s) => s.solutions,
);

export const findCatalogSolution = (id: string): CatalogSolution | undefined =>
  ALL_SOLUTIONS.find((s) => s.id === id);

export const sectionForSolution = (id: string): CatalogSection | undefined =>
  SOLUTION_SECTIONS.find((sec) => sec.solutions.some((s) => s.id === id));
