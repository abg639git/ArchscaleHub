import React, { Fragment, useState } from "react";
import { createRoot } from "react-dom/client";
import data from "./data/adminData.json";
import "./styles.css";

const adminTabs = [
  ["access", "Access & roles", "ti-users-group"],
  ["builder", "Departments & apps", "ti-layout-grid-add"],
  ["matrix", "Permission matrix", "ti-layout-grid"],
  ["people", "People", "ti-users"],
  ["security", "Security", "ti-lock"],
  ["integrations", "Integrations", "ti-plug-connected"],
];

const overviewTabs = [
  ["o-overview", "Dashboard", "ti-layout-dashboard", "Business"],
  ["o-tenants", "Tenants & users", "ti-building-store", "Business"],
  ["o-insights", "Insights", "ti-chart-arcs", "Business"],
  ["o-support", "Support", "ti-lifebuoy", "Business"],
];

const growthTabs = [
  ["o-plans", "Plans", "ti-packages", "Business & Growth"],
  ["o-subscriptions", "Subscriptions", "ti-refresh", "Business & Growth"],
  ["o-coupons", "Coupons & discounts", "ti-ticket", "Business & Growth"],
  ["o-promotions", "Promotions", "ti-speakerphone", "Business & Growth"],
  ["o-programs", "Growth programs", "ti-network", "Business & Growth"],
  ["o-revenue", "Revenue Dashboard", "ti-chart-bar", "Business & Growth"],
  ["o-trials", "Trial Analytics", "ti-hourglass", "Business & Growth"],
  ["o-conversions", "Tenant Conversions", "ti-arrows-exchange", "Business & Growth"],
  ["o-churn", "Churn Analytics", "ti-chart-dots", "Business & Growth"],
];

const financeTabs = [
  ["o-finance", "Finance Overview", "ti-coin", "Finance"],
  ["o-collections", "Collections", "ti-cash-banknote", "Finance"],
  ["o-invoices", "Invoices", "ti-file-invoice", "Finance"],
  ["o-taxes", "Taxes", "ti-receipt-tax", "Finance"],
  ["o-refunds", "Refunds & credits", "ti-receipt-refund", "Finance"],
  ["o-expenses", "Expenses", "ti-receipt", "Finance"],
];

const productTabs = [
  ["o-product", "Apps & bundles", "ti-bundle", "Product"],
  ["o-next-queue", "Next in Queue", "ti-list-check", "Product"],
  ["o-access", "Access summary", "ti-shield-cog", "Platform"],
  ["o-audit", "Audit logs", "ti-lock-check", "Platform"],
];

const centreConfig = {
  overview: { label: "Overview", firstTab: "o-overview", icon: "ti-chart-arcs", tabs: overviewTabs },
  admin: { label: "Super Admin Centre", firstTab: "access", icon: "ti-layout-grid", tabs: adminTabs.map((item) => [...item, item[1] === "Security" || item[1] === "Integrations" ? "Platform" : "Governance"]) },
  growth: { label: "Business & Growth", firstTab: "o-plans", icon: "ti-packages", tabs: growthTabs },
  finance: { label: "Finance", firstTab: "o-finance", icon: "ti-coin", tabs: financeTabs },
  product: { label: "Product & Platform", firstTab: "o-product", icon: "ti-box", tabs: productTabs },
};

const meta = {
  access: ["GOVERNANCE", "Access & roles", "Define who can do what across the platform."],
  builder: ["GOVERNANCE", "Departments & apps", "Build the functions and apps your studio runs on."],
  matrix: ["GOVERNANCE", "Permission matrix", "What each role can do across capabilities."],
  people: ["GOVERNANCE", "People", "Invite members and assign roles."],
  security: ["PLATFORM", "Security", "Authentication, sessions and audit log."],
  integrations: ["PLATFORM", "Integrations", "Connect the tools your studio already uses."],
  "o-overview": ["BUSINESS", "Dashboard", "Control tenants, plans, modules, support, integrations and security from one owner console."],
  "o-tenants": ["BUSINESS", "Tenants & users", "All studios on the platform and their operating health."],
  "o-insights": ["BUSINESS", "Insights", "Engagement, retention and tenant health across the platform."],
  "o-plans": ["BUSINESS & GROWTH", "Plans", "Plan catalogue used when creating or upgrading tenants."],
  "o-subscriptions": ["BUSINESS & GROWTH", "Subscriptions", "Tenant-linked subscription states across active, trial, expired and cancelled accounts."],
  "o-coupons": ["BUSINESS & GROWTH", "Coupons & discounts", "Acquisition, retention and sales incentive codes for growth programs."],
  "o-promotions": ["BUSINESS & GROWTH", "Promotions", "Campaigns that package plans, coupons and target tenant segments."],
  "o-programs": ["BUSINESS & GROWTH", "Growth programs", "Referral, partner and affiliate motions for acquisition and retention."],
  "o-revenue": ["BUSINESS & GROWTH", "Revenue Dashboard", "Growth revenue view: MRR, ARR, churn and plan performance."],
  "o-trials": ["BUSINESS & GROWTH", "Trial Analytics", "Trial cohorts, activation signals and expiry risk."],
  "o-conversions": ["BUSINESS & GROWTH", "Tenant Conversions", "Trial-to-paid and plan-upgrade movement by tenant segment."],
  "o-churn": ["BUSINESS & GROWTH", "Churn Analytics", "Cancellation risk, churn reasons and retention actions."],
  "o-finance": ["FINANCE", "Finance Overview", "Accounting view for revenue, collections, invoices, taxes, refunds, credits and expenses."],
  "o-collections": ["FINANCE", "Collections", "Expected, collected, overdue and failed payment follow-up."],
  "o-invoices": ["FINANCE", "Invoices", "Invoice register with tenant, amount, due date and payment state."],
  "o-taxes": ["FINANCE", "Taxes", "Tax liability, jurisdiction and filing status."],
  "o-refunds": ["FINANCE", "Refunds & credits", "Customer refunds, credit notes and adjustment approvals."],
  "o-expenses": ["FINANCE", "Expenses", "Operating expenses, vendors, categories and approval state."],
  "o-support": ["OPERATIONS", "Support", "Tenant tickets, priorities, module ownership and resolution controls."],
  "o-product": ["PRODUCT", "Apps & bundles", "Lifecycle states, app registry and subscription bundles for the product suite."],
  "o-next-queue": ["PRODUCT", "Next in Queue", "Founder and developer product backlog checklist."],
  "o-access": ["PLATFORM", "Access summary", "Platform-wide roles and how many accounts hold each."],
  "o-audit": ["PLATFORM", "Audit logs", "Tracked events, security alerts and system-level activity."],
};

const devices = [
  ["desktop", "ti-device-desktop"],
  ["laptop", "ti-device-laptop"],
  ["tablet", "ti-device-tablet"],
  ["mobile", "ti-device-mobile"],
];

const planNames = data.businessGrowth.plans.map((plan) => plan.name);

function priceToNumber(value) {
  const cleaned = String(value || "").replace(/[^\d]/g, "");
  return cleaned ? Number(cleaned) : null;
}

function formatRs(value) {
  if (value === null || Number.isNaN(value)) return "Custom";
  return `Rs ${Math.round(value).toLocaleString("en-IN")}`;
}

function walletSummary() {
  const tenants = data.tenants || [];
  const totalRecharged = tenants.reduce((sum, tenant) => sum + Number(tenant.walletTotalRecharged || 0), 0);
  const totalBalance = tenants.reduce((sum, tenant) => sum + Number(tenant.walletBalance || 0), 0);
  const lastRecharge = tenants.reduce((latest, tenant) => {
    if (!latest) return tenant;
    return new Date(tenant.walletLastRechargeDate || 0) > new Date(latest.walletLastRechargeDate || 0) ? tenant : latest;
  }, null);

  return { totalRecharged, totalBalance, lastRecharge };
}

function healthClass(health) {
  const score = Number(String(health || "").match(/\d+/)?.[0] || 0);
  if (score >= 90) return "green";
  if (score >= 75) return "yellow";
  if (score >= 60) return "ochre";
  if (score >= 40) return "orange";
  if (score > 0) return "red";
  return "gray";
}

function parseUsers(value) {
  const [active, limit] = String(value || "0/0").split("/").map((item) => Number(item));
  return { active: active || 0, limit: limit || 0 };
}

function tenantUsers(tenant) {
  const seed = tenant.name.split(" ").map((word) => word[0]).join("").slice(0, 3).toUpperCase();
  const names = {
    "Atelier Studio": ["Shanker Dev", "Maya Iyer", "Arjun Mehta", "Rhea Shah", "Kabir Sen", "Naina Kapoor"],
    "Nava Design Co": ["Nava Rao", "Ishaan Verma", "Tara Singh", "Aditi Paul", "Dev Joshi", "Meera Nair"],
    "Urban Arc": ["Kabir Sen", "Rohan Batra", "Pia Khanna", "Aman Suri", "Jai Malik", "Noor Khan"],
    "Stonegrid": ["Rhea Shah", "Neel Shah", "Zoya Merchant", "Ira Bose", "Vikram Rao", "Sara Jain"],
    "Blue Pine Studio": ["Anil Rao", "Leena Das", "Om Kapoor", "Priya Menon", "Farah Ali", "Karan Gill"],
  };
  const types = ["Studio Owner", "Manager", "User", "User", "Client", "Vendor"];

  return types.map((type, index) => ({
    id: `${seed}-${String(index + 1).padStart(3, "0")}`,
    name: (names[tenant.name] || names["Atelier Studio"])[index],
    connected: `2026-0${(index % 4) + 2}-${String(8 + index * 3).padStart(2, "0")}`,
    type,
  }));
}

function tenantUsage(tenant) {
  const { active, limit } = parseUsers(tenant.users);
  const modules = findPlan(tenant.plan)?.modules || ["Projects", "Documents", "Approvals", "CRM"];
  return modules.slice(0, 6).map((module, index) => {
    const consumption = Math.min(100, Math.max(18, Math.round(((active / Math.max(limit, 1)) * 72) + 14 + index * 4)));
    return {
      app: module,
      users: Math.max(1, Math.round(active * (0.28 + index * 0.06))),
      consumption,
    };
  });
}

function findPlan(name) {
  return data.businessGrowth.plans.find((plan) => plan.name === name);
}

function findCoupon(code) {
  return data.businessGrowth.coupons.find((coupon) => coupon.code.toLowerCase() === String(code).trim().toLowerCase());
}

function couponAllowsPlan(coupon, planName) {
  if (!coupon || !["Active", "Limited"].includes(coupon.status)) return false;
  if (coupon.planRestriction === "All paid plans") return !["Custom"].includes(planName);
  return coupon.planRestriction.split(",").map((item) => item.trim().toLowerCase()).includes(planName.toLowerCase());
}

function calculatePrice(planName, couponCode) {
  const plan = findPlan(planName);
  const base = priceToNumber(plan?.price);
  const code = String(couponCode || "").trim().toUpperCase();

  if (!plan) return { ok: false, baseLabel: "-", discountLabel: "-", finalLabel: "-", message: "Select a plan first." };
  if (base === null) return { ok: false, baseLabel: plan.price, discountLabel: "Manual quote", finalLabel: plan.price, message: `${plan.name} needs a manual quote before discounts can be applied.` };
  if (!code) return { ok: true, baseLabel: formatRs(base), discountLabel: "Rs 0", finalLabel: formatRs(base), couponCode: "None", message: "No coupon applied yet." };

  const coupon = findCoupon(code);
  if (!coupon) return { ok: false, baseLabel: formatRs(base), discountLabel: "-", finalLabel: formatRs(base), message: `${code} is not a valid coupon.` };
  if (!couponAllowsPlan(coupon, plan.name)) return { ok: false, baseLabel: formatRs(base), discountLabel: "-", finalLabel: formatRs(base), message: `${coupon.code} is not valid for the ${plan.name} plan.` };

  const rawDiscount = coupon.discountType === "Percentage"
    ? base * (Number(coupon.percentage.replace(/[^\d]/g, "")) / 100)
    : priceToNumber(coupon.fixedAmount);
  const discount = Math.min(base, rawDiscount || 0);
  const final = Math.max(0, base - discount);

  return {
    ok: true,
    baseLabel: formatRs(base),
    discountLabel: `-${formatRs(discount)}`,
    finalLabel: formatRs(final),
    couponCode: coupon.code,
    message: `${coupon.code} applied. ${coupon.name} is valid for ${coupon.planRestriction}.`,
  };
}

function calculatePriceFromCoupons(planName, couponCode, coupons) {
  const plan = findPlan(planName);
  const base = priceToNumber(plan?.price);
  const code = String(couponCode || "").trim().toUpperCase();

  if (!plan) return { ok: false, baseLabel: "-", discountLabel: "-", finalLabel: "-", message: "Select a plan first." };
  if (base === null) return { ok: false, baseLabel: plan.price, discountLabel: "Manual quote", finalLabel: plan.price, message: `${plan.name} needs a manual quote before discounts can be applied.` };
  if (!code) return { ok: true, baseLabel: formatRs(base), discountLabel: "Rs 0", finalLabel: formatRs(base), couponCode: "None", message: "No coupon applied yet." };

  const coupon = coupons.find((item) => item.code.toLowerCase() === code.toLowerCase());
  if (!coupon) return { ok: false, baseLabel: formatRs(base), discountLabel: "-", finalLabel: formatRs(base), message: `${code} is not a valid coupon.` };
  if (!couponAllowsPlan(coupon, plan.name)) return { ok: false, baseLabel: formatRs(base), discountLabel: "-", finalLabel: formatRs(base), message: `${coupon.code} is not valid for the ${plan.name} plan.` };

  const rawDiscount = coupon.discountType === "Percentage"
    ? base * (Number(String(coupon.percentage).replace(/[^\d]/g, "")) / 100)
    : priceToNumber(coupon.fixedAmount);
  const discount = Math.min(base, rawDiscount || 0);
  const final = Math.max(0, base - discount);

  return {
    ok: true,
    baseLabel: formatRs(base),
    discountLabel: `-${formatRs(discount)}`,
    finalLabel: formatRs(final),
    couponCode: coupon.code,
    message: `${coupon.code} applied. ${coupon.name} is valid for ${coupon.planRestriction}.`,
  };
}

function loadCoupons() {
  try {
    return JSON.parse(localStorage.getItem("archscale-coupons")) || data.businessGrowth.coupons;
  } catch {
    return data.businessGrowth.coupons;
  }
}

function loadInvoiceProfile() {
  try {
    return JSON.parse(localStorage.getItem("archscale-invoice-profile")) || data.finance.invoiceProfile;
  } catch {
    return data.finance.invoiceProfile;
  }
}

function calculateGst(subtotal, gstRate, sellerState, placeOfSupply) {
  const rate = Number(gstRate || 0);
  const tax = Math.round(subtotal * (rate / 100));
  const sameState = String(sellerState || "").trim().toLowerCase() === String(placeOfSupply || "").trim().toLowerCase();
  return {
    sameState,
    cgst: sameState ? Math.round(tax / 2) : 0,
    sgst: sameState ? tax - Math.round(tax / 2) : 0,
    igst: sameState ? 0 : tax,
    tax,
  };
}

function loadIntegrationRegister() {
  try {
    const saved = JSON.parse(localStorage.getItem("archscale-integrations"));
    return (saved || data.integrations).map(normalizeIntegration);
  } catch {
    return data.integrations.map(normalizeIntegration);
  }
}

function normalizeIntegration(item) {
  return {
    name: item.name || "",
    link: item.link || "",
    category: item.category || "API",
    integratedTo: item.integratedTo || "-",
    purpose: item.purpose || item.description || "-",
    status: item.status || "Not connected / Disabled",
    emailUsed: item.emailUsed || "",
    username: item.username || "",
    passwordLocation: item.passwordLocation || "",
    accountOwner: item.accountOwner || item.owner || "",
    recoveryContact: item.recoveryContact || "",
    twoFactor: item.twoFactor || "No",
    backupCodesStored: item.backupCodesStored || "No",
    apiProvider: item.apiProvider || "",
    apiKeyName: item.apiKeyName || "",
    clientId: item.clientId || "",
    clientSecretLocation: item.clientSecretLocation || "",
    accessTokenLocation: item.accessTokenLocation || "",
    refreshTokenAvailable: item.refreshTokenAvailable || "No",
    tokenExpiryDate: item.tokenExpiryDate || "",
    scopes: item.scopes || "",
    callbackUrl: item.callbackUrl || "",
    webhookUrl: item.webhookUrl || "",
    webhookSecretLocation: item.webhookSecretLocation || "",
    planName: item.planName || "",
    pricing: item.pricing || "Free",
    monthlyCost: item.monthlyCost || "",
    renewalDate: item.renewalDate || "",
    paymentOwner: item.paymentOwner || "",
    invoiceEmail: item.invoiceEmail || "",
    environment: item.environment || "Production",
    connectedDatabase: item.connectedDatabase || "",
    dataSynced: item.dataSynced || "",
    syncDirection: item.syncDirection || "One-way",
    syncFrequency: item.syncFrequency || "Manual",
    lastSync: item.lastSync || "",
    lastTested: item.lastTested || item.lastChecked || "",
    errorNotes: item.errorNotes || item.notes || "",
    dataSensitivity: item.dataSensitivity || "Medium",
    accessUsers: item.accessUsers || "",
    adminAccessRole: item.adminAccessRole || "",
    revokeProcess: item.revokeProcess || "",
    auditNotes: item.auditNotes || "",
    lastChecked: item.lastChecked || "Not checked",
    owner: item.owner || "-",
    notes: item.notes || "-",
    icon: item.icon || "ti-plug-connected"
  };
}

function loadExpenseRegister() {
  try {
    const saved = JSON.parse(localStorage.getItem("archscale-expenses"));
    return (saved || data.finance.expenses).map(normalizeExpense);
  } catch {
    return data.finance.expenses.map(normalizeExpense);
  }
}

function normalizeExpense(item) {
  return {
    date: item.date || "2026-06-10",
    vendor: item.vendor || "",
    category: item.category || "-",
    amount: item.amount || "",
    taxType: item.taxType || "GST",
    paymentStatus: item.paymentStatus || item.status || "Not done",
    source: item.source || "Bank transfer",
    owner: item.owner || "-",
    notes: item.notes || item.period || "-"
  };
}

function loadExpenseParties() {
  try {
    const saved = JSON.parse(localStorage.getItem("archscale-expense-parties"));
    return saved || [...new Set(loadExpenseRegister().map((item) => item.vendor).filter(Boolean))].sort();
  } catch {
    return [...new Set(loadExpenseRegister().map((item) => item.vendor).filter(Boolean))].sort();
  }
}

function loadPaymentAccounts() {
  try {
    const saved = JSON.parse(localStorage.getItem("archscale-payment-accounts"));
    return saved || ["Bank transfer", "UPI", "Credit card", "Debit card", "Cash", "Wallet"];
  } catch {
    return ["Bank transfer", "UPI", "Credit card", "Debit card", "Cash", "Wallet"];
  }
}

function loadDepartments() {
  try {
    return JSON.parse(localStorage.getItem("archscale-departments")) || data.departments;
  } catch {
    return data.departments;
  }
}

function App() {
  const [theme, setTheme] = useState("light");
  const [preview, setPreview] = useState("desktop");
  const [centre, setCentre] = useState("overview");
  const [tab, setTab] = useState("o-overview");
  const [panelOpen, setPanelOpen] = useState(true);
  const [mobileTabsOpen, setMobileTabsOpen] = useState(false);
  const [auth, setAuth] = useState(!data.app.enableAuth || sessionStorage.getItem("archscale-auth") === "true");

  function openCentre(nextCentre) {
    setCentre(nextCentre);
    setPanelOpen(true);
    setTab(centreConfig[nextCentre].firstTab);
  }

  function openMobileCentre(nextCentre) {
    if (nextCentre === centre) {
      setMobileTabsOpen(!mobileTabsOpen);
    } else {
      openCentre(nextCentre);
      setMobileTabsOpen(true);
    }
  }

  return (
    <div className="app" data-theme={theme} data-preview={preview}>
      {!auth ? (
        <Login onAuth={() => {
          sessionStorage.setItem("archscale-auth", "true");
          setAuth(true);
        }} />
      ) : (
        <div className="workspace">
          <Rail centre={centre} panelOpen={panelOpen} onCentre={openCentre} onToggle={() => setPanelOpen(!panelOpen)} />
          <SidePanel centre={centre} tab={tab} open={panelOpen} onTab={setTab} />
          <main className="main">
            <TopBar
              theme={theme}
              preview={preview}
              onTheme={() => setTheme(theme === "light" ? "dark" : "light")}
              onPreview={setPreview}
              onSignOut={() => {
                sessionStorage.removeItem("archscale-auth");
                localStorage.removeItem("archscale-auth");
                setAuth(false);
              }}
            />
            <Content tab={tab} setTab={setTab} setCentre={openCentre} preview={preview} />
            <MobileTabBar centre={centre} tab={tab} open={mobileTabsOpen} onTab={(nextTab) => { setTab(nextTab); setMobileTabsOpen(false); }} />
            <MobileCentreBar centre={centre} onCentre={openMobileCentre} />
          </main>
        </div>
      )}
    </div>
  );
}

function Login({ onAuth }) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function submit(event) {
    event.preventDefault();
    const ok = user.trim() === data.app.demoUser && password === data.app.demoPassword;
    setError(!ok);
    if (ok) onAuth();
  }

  return (
    <section className="login-screen">
      <aside className="login-brand">
        <div className="brand-mark">A</div>
        <div>
          <p className="eyebrow">ArchScale Studio Hub</p>
          <h1>Where every studio operation comes into focus.</h1>
          <p>Governance, product modules, tenants, permissions and support in one controlled workspace.</p>
        </div>
        <small>© 2026 ArchScale. All rights reserved.</small>
      </aside>
      <section className="login-form-panel">
        <form className="login-card" onSubmit={submit}>
          <p className="eyebrow">Secure workspace</p>
          <h2>Welcome back.</h2>
          <p>Sign in to enter the Super Admin Centre.</p>
          {error && <div className="error">Incorrect user ID or password. Use <b>a</b> / <b>a</b>.</div>}
          <label>User ID<input value={user} onChange={(event) => setUser(event.target.value)} autoComplete="username" placeholder="a" /></label>
          <label>Password<input value={password} type="password" onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" placeholder="a" /></label>
          <button className="primary login-submit" type="submit">Sign in</button>
          <div className="login-help">
            <span>Demo access</span>
            <strong>User ID a · Password a</strong>
          </div>
        </form>
      </section>
    </section>
  );
}

function Rail({ centre, panelOpen, onCentre, onToggle }) {
  return (
    <nav className="rail" aria-label="Centres">
      <div className="logo">A</div>
      <button className="rail-toggle" onClick={onToggle} aria-label="Toggle panel"><i className={`ti ${panelOpen ? "ti-chevrons-left" : "ti-chevrons-right"}`} /></button>
      {Object.entries(centreConfig).map(([id, item]) => (
        <button key={id} className={centre === id ? "rail-icon on" : "rail-icon"} onClick={() => onCentre(id)} aria-label={item.label}>
          <i className={`ti ${item.icon}`} />
        </button>
      ))}
      <div className="rail-foot">SD</div>
    </nav>
  );
}

function SidePanel({ centre, tab, open, onTab }) {
  const tabs = centreConfig[centre].tabs;
  const groups = [...new Set(tabs.map((item) => item[3]))];
  return (
    <aside className={`side ${open ? "" : "closed"}`}>
      <div className="side-head"><strong>{centreConfig[centre].label}</strong></div>
      {groups.map((group) => (
        <section key={group}>
          <p className="side-section">{group}</p>
          {tabs.filter((item) => item[3] === group).map(([id, label, icon]) => (
            <button key={id} className={tab === id ? "side-row on" : "side-row"} onClick={() => onTab(id)}>
              <i className={`ti ${icon}`} />
              <span>{label}</span>
            </button>
          ))}
        </section>
      ))}
    </aside>
  );
}

function MobileTabBar({ centre, tab, open, onTab }) {
  return (
    <nav className={`mobile-tabs ${open ? "open" : ""}`} aria-label={`${centreConfig[centre].label} sections`}>
      {centreConfig[centre].tabs.map(([id, label, icon]) => (
        <button key={id} className={tab === id ? "on" : ""} onClick={() => onTab(id)}>
          <i className={`ti ${icon}`} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

function MobileCentreBar({ centre, onCentre }) {
  return (
    <nav className="mobile-centres" aria-label="Main centres">
      {Object.entries(centreConfig).map(([id, item]) => (
        <button key={id} className={centre === id ? "on" : ""} onClick={() => onCentre(id)}>
          <i className={`ti ${item.icon}`} />
          <span>{item.label.replace("Super Admin Centre", "Admin").replace("Product & Platform", "Product").replace("Business & Growth", "Growth")}</span>
        </button>
      ))}
    </nav>
  );
}

function TopBar({ theme, preview, onTheme, onPreview, onSignOut }) {
  const [menu, setMenu] = useState(false);
  return (
    <header className="topbar">
      <div className="crumb"><i className="ti ti-layout-dashboard" /> Control Center</div>
      <div className="top-actions">
        <button className="theme" onClick={onTheme}><i className={`ti ${theme === "light" ? "ti-moon" : "ti-sun"}`} />{theme === "light" ? "Dark" : "Light"}</button>
        <button className="bell"><i className="ti ti-bell" /></button>
        <div className="device-toggle">
          {devices.map(([id, icon]) => <button key={id} className={preview === id ? "on" : ""} onClick={() => onPreview(id)}><i className={`ti ${icon}`} /></button>)}
        </div>
        <div className="profile">
          <button className="profile-btn" onClick={() => setMenu(!menu)}><span>SD</span><strong>{data.app.user}</strong><i className="ti ti-chevron-down" /></button>
          {menu && <div className="profile-menu"><button>My profile</button><button>Workspace settings</button><button>Super Admin Panel</button><button>Design Lab</button><button onClick={onSignOut}>Sign out</button></div>}
        </div>
      </div>
    </header>
  );
}

function Content({ tab, setTab, setCentre, preview }) {
  const [subscriptions, setSubscriptions] = useState(data.businessGrowth.subscriptions);
  const [eyebrow, title, subtitle] = meta[tab] || meta.access;
  return (
    <div className="preview">
      <div className="content">
        <header className="page-head">
          <div className="page-mark"><i className={`ti ${metaIcon(tab)}`} /></div>
          <div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{subtitle}</p></div>
        </header>
        {tab === "access" && <Roles />}
        {tab === "builder" && <Departments />}
        {tab === "matrix" && <Matrix />}
        {tab === "people" && <ListPanel title="People directory" icon="ti-users" items={data.people} />}
        {tab === "security" && <ListPanel title="Security controls" icon="ti-lock" items={data.security} />}
        {tab === "integrations" && <Integrations />}
        {tab === "o-overview" && <Dashboard collapsible={preview === "mobile"} />}
        {tab === "o-product" && <Product />}
        {tab === "o-next-queue" && <NextInQueue />}
        {tab === "o-support" && <Support />}
        {tab === "o-audit" && <Audit />}
        {tab === "o-insights" && <Insights />}
        {tab === "o-revenue" && <Revenue />}
        {tab === "o-plans" && <Plans />}
        {tab === "o-subscriptions" && <Subscriptions subscriptions={subscriptions} setSubscriptions={setSubscriptions} />}
        {tab === "o-coupons" && <Coupons subscriptions={subscriptions} setSubscriptions={setSubscriptions} />}
        {tab === "o-promotions" && <Promotions />}
        {tab === "o-programs" && <GrowthPrograms />}
        {tab === "o-trials" && <TrialAnalytics />}
        {tab === "o-conversions" && <TenantConversions />}
        {tab === "o-churn" && <ChurnAnalytics />}
        {tab === "o-finance" && <FinanceOverview />}
        {tab === "o-collections" && <Collections />}
        {tab === "o-invoices" && <Invoices />}
        {tab === "o-taxes" && <Taxes />}
        {tab === "o-refunds" && <RefundsCredits />}
        {tab === "o-expenses" && <Expenses />}
        {tab === "o-tenants" && <Tenants />}
        {tab === "o-access" && <AccessSummary />}
      </div>
    </div>
  );
}

function metaIcon(tab) {
  return [...adminTabs, ...overviewTabs, ...growthTabs, ...financeTabs, ...productTabs].find(([id]) => id === tab)?.[2] || "ti-layout-dashboard";
}

function Roles() {
  return <div className="roles">{data.roles.map((role) => <article className="role-card" key={role.name} style={{ "--role": role.color }}><span><i className={`ti ${role.icon}`} /></span><h3>{role.name}<small>{role.level}</small></h3><p>{role.description}</p><button>Edit role</button></article>)}</div>;
}

function Departments() {
  const roleOptions = ["Studio", "Manager", "User", "Client", "Vendor"];
  const emptyDept = { name: "", description: "", icon: "ti-layout-grid-add", apps: [] };
  const emptyApp = { name: "", description: "", status: "Draft", icon: "ti-square", roles: ["Studio"] };
  const [departments, setDepartments] = useState(loadDepartments);
  const [deptForm, setDeptForm] = useState(emptyDept);
  const [deptEdit, setDeptEdit] = useState(null);
  const [appForm, setAppForm] = useState(emptyApp);
  const [appEdit, setAppEdit] = useState(null);
  const [saved, setSaved] = useState("");

  function persist(next) {
    setDepartments(next);
    localStorage.setItem("archscale-departments", JSON.stringify(next));
    setSaved("Departments and app access saved on this device.");
  }

  function saveDepartment() {
    if (!deptForm.name.trim()) return;
    const nextDept = { ...deptForm, name: deptForm.name.trim(), description: deptForm.description.trim() || "New business function", icon: deptForm.icon || "ti-layout-grid-add", apps: deptForm.apps || [] };
    const next = deptEdit === null ? [...departments, nextDept] : departments.map((dept, index) => index === deptEdit ? nextDept : dept);
    persist(next);
    setDeptForm(emptyDept);
    setDeptEdit(null);
  }

  function editDepartment(index) {
    setDeptForm(departments[index]);
    setDeptEdit(index);
    setSaved("");
  }

  function startApp(deptIndex, appIndex = null) {
    setAppEdit({ deptIndex, appIndex });
    setAppForm(appIndex === null ? emptyApp : departments[deptIndex].apps[appIndex]);
    setSaved("");
  }

  function saveApp() {
    if (!appEdit || !appForm.name.trim()) return;
    const nextApp = { ...appForm, name: appForm.name.trim(), description: appForm.description.trim() || "App module", status: appForm.status.trim() || "Draft", icon: appForm.icon || "ti-square", roles: appForm.roles.length ? appForm.roles : ["Studio"] };
    const next = departments.map((dept, deptIndex) => {
      if (deptIndex !== appEdit.deptIndex) return dept;
      const apps = appEdit.appIndex === null ? [...dept.apps, nextApp] : dept.apps.map((app, appIndex) => appIndex === appEdit.appIndex ? nextApp : app);
      return { ...dept, apps };
    });
    persist(next);
    setAppForm(emptyApp);
    setAppEdit(null);
  }

  function toggleRole(role) {
    const roles = appForm.roles.includes(role) ? appForm.roles.filter((item) => item !== role) : [...appForm.roles, role];
    setAppForm({ ...appForm, roles });
  }

  return (
    <div className="departments">
      <section className="business-card flow-card">
        <header className="product-head">
          <div><p className="eyebrow">Department Builder</p><h2>{deptEdit === null ? "Add new department / function" : "Edit department / function"}</h2></div>
          <button className="primary small" onClick={saveDepartment}>{deptEdit === null ? "Add department" : "Save department"}</button>
        </header>
        <div className="flow-row dept-form">
          <input placeholder="Department name" value={deptForm.name} onChange={(event) => setDeptForm({ ...deptForm, name: event.target.value })} />
          <input placeholder="Short description" value={deptForm.description} onChange={(event) => setDeptForm({ ...deptForm, description: event.target.value })} />
          <input placeholder="Tabler icon class" value={deptForm.icon} onChange={(event) => setDeptForm({ ...deptForm, icon: event.target.value })} />
          {deptEdit !== null && <button className="ghost small" onClick={() => { setDeptEdit(null); setDeptForm(emptyDept); }}>Cancel edit</button>}
        </div>
        {saved && <p className="flow-message ok">{saved}</p>}
      </section>

      {appEdit && (
        <section className="business-card flow-card">
          <header className="product-head">
            <div><p className="eyebrow">App Access</p><h2>{appEdit.appIndex === null ? "Add app/module" : "Edit app/module"}</h2></div>
            <button className="primary small" onClick={saveApp}>{appEdit.appIndex === null ? "Add app" : "Save app"}</button>
          </header>
          <div className="flow-row app-form">
            <input placeholder="App name" value={appForm.name} onChange={(event) => setAppForm({ ...appForm, name: event.target.value })} />
            <input placeholder="Description" value={appForm.description} onChange={(event) => setAppForm({ ...appForm, description: event.target.value })} />
            <input placeholder="Status" value={appForm.status} onChange={(event) => setAppForm({ ...appForm, status: event.target.value })} />
            <input placeholder="Tabler icon class" value={appForm.icon} onChange={(event) => setAppForm({ ...appForm, icon: event.target.value })} />
          </div>
          <div className="role-checks">
            {roleOptions.map((role) => (
              <label key={role}><input type="checkbox" checked={appForm.roles.includes(role)} onChange={() => toggleRole(role)} />{role}</label>
            ))}
          </div>
          <button className="ghost small" onClick={() => { setAppEdit(null); setAppForm(emptyApp); }}>Cancel app edit</button>
        </section>
      )}

      {departments.map((dept, deptIndex) => (
        <section className="dept" key={`${dept.name}-${deptIndex}`}>
          <header>
            <i className={`ti ${dept.icon}`} />
            <div><h2>{dept.name}</h2><p>{dept.description}</p></div>
            <div className="dept-actions">
              <span>{dept.apps.length} apps</span>
              <button onClick={() => editDepartment(deptIndex)}>Edit department</button>
              <button onClick={() => startApp(deptIndex)}>Add app</button>
            </div>
          </header>
          <div className="apps">
            {dept.apps.map((app, appIndex) => (
              <article className="app-card" key={`${app.name}-${appIndex}`}>
                <i className={`ti ${app.icon}`} />
                <em>{app.status}</em>
                <h3>{app.name}</h3>
                <p>{app.description}</p>
                <div>{app.roles.map((role) => <small key={role}>{role}</small>)}</div>
                <button onClick={() => startApp(deptIndex, appIndex)}>Edit app & access <i className="ti ti-pencil" /></button>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function Matrix() {
  const roleNames = data.roles.map((role) => role.name);
  return <div className="table-wrap"><table><thead><tr><th>Capability</th>{roleNames.map((role) => <th key={role}>{role}</th>)}</tr></thead><tbody>{data.permissionMatrix.map((row) => <tr key={row.capability}><td><strong>{row.capability}</strong><small>{row.source}</small></td>{roleNames.map((role) => <td className="center" key={role}>{row.roles.includes(role) ? <span className="yes"><i className="ti ti-check" /></span> : <span className="no">-</span>}</td>)}</tr>)}</tbody></table></div>;
}

function ListPanel({ title, icon, items }) {
  return <section className="panel-card"><header><i className={`ti ${icon}`} /><h2>{title}</h2></header><div className="list">{items.map((item) => <article key={item.name || item.email}><div><h3>{item.name}</h3><p>{item.description || item.email}</p></div><span>{item.status || item.role}</span></article>)}</div></section>;
}

const integrationStatuses = ["Connected / Healthy", "Issue / Needs attention", "Broken / Expired / Failed", "Not Started", "Testing", "Paused", "Not connected / Disabled"];
const integrationCategories = ["App", "API", "Plugin", "Webhook", "Automation"];
const integrationEnvironments = ["Dev", "Staging", "Production"];
const yesNo = ["Yes", "No"];
const integrationCsvColumns = [
  ["name", "App/API Name"],
  ["link", "Link"],
  ["category", "Category"],
  ["integratedTo", "Integrated To"],
  ["purpose", "Purpose"],
  ["status", "Status"],
  ["emailUsed", "Email Used"],
  ["username", "Username"],
  ["passwordLocation", "Password Location"],
  ["accountOwner", "Account Owner"],
  ["recoveryContact", "Recovery Contact"],
  ["twoFactor", "2FA Enabled"],
  ["backupCodesStored", "Backup Codes Stored"],
  ["apiProvider", "API Provider"],
  ["apiKeyName", "API Key Name"],
  ["clientId", "Client ID"],
  ["clientSecretLocation", "Client Secret Location"],
  ["accessTokenLocation", "Access Token Location"],
  ["refreshTokenAvailable", "Refresh Token Available"],
  ["tokenExpiryDate", "Token Expiry Date"],
  ["scopes", "Scopes"],
  ["callbackUrl", "Callback URL"],
  ["webhookUrl", "Webhook URL"],
  ["webhookSecretLocation", "Webhook Secret Location"],
  ["planName", "Plan Name"],
  ["pricing", "Free/Paid"],
  ["monthlyCost", "Monthly Cost"],
  ["renewalDate", "Renewal Date"],
  ["paymentOwner", "Payment Owner"],
  ["invoiceEmail", "Invoice Email"],
  ["environment", "Environment"],
  ["connectedDatabase", "Connected Database/Table"],
  ["dataSynced", "Data Synced"],
  ["syncDirection", "Sync Direction"],
  ["syncFrequency", "Sync Frequency"],
  ["lastSync", "Last Sync"],
  ["lastTested", "Last Tested"],
  ["errorNotes", "Error Notes"],
  ["dataSensitivity", "Data Sensitivity"],
  ["accessUsers", "Who Can Access"],
  ["adminAccessRole", "Admin Access Role"],
  ["revokeProcess", "Delete/Revoke Process"],
  ["auditNotes", "Audit Notes"],
  ["owner", "Owner"],
  ["notes", "Notes"],
];

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function csvToRows(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

function integrationsToCsv(items) {
  const header = integrationCsvColumns.map(([, label]) => csvEscape(label)).join(",");
  const rows = items.map((item) => integrationCsvColumns.map(([key]) => csvEscape(item[key])).join(","));
  return [header, ...rows].join("\n");
}

function integrationsFromCsv(text) {
  const rows = csvToRows(text);
  if (!rows.length) return [];
  const headers = rows[0].map((cell) => cell.toLowerCase());
  return rows.slice(1).map((row) => {
    const record = {};
    integrationCsvColumns.forEach(([key, label]) => {
      const index = headers.indexOf(label.toLowerCase());
      record[key] = index >= 0 ? row[index] || "" : "";
    });
    return normalizeIntegration({
      ...record,
      status: record.status || "Not connected / Disabled",
      name: record.name || row[0] || "",
    });
  }).filter((item) => item.name.trim());
}

function Integrations() {
  const empty = normalizeIntegration({ name: "", status: "Not connected / Disabled", lastChecked: "Not checked", owner: "", notes: "", icon: "ti-plug-connected" });
  const [items, setItems] = useState(loadIntegrationRegister);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [mode, setMode] = useState("add");
  const [bulkText, setBulkText] = useState("");
  const [saved, setSaved] = useState("");

  function persist(next) {
    setItems(next);
    localStorage.setItem("archscale-integrations", JSON.stringify(next));
    setSaved("Integration register saved on this device.");
  }

  function submitIntegration() {
    if (!form.name.trim()) return;
    const nextItem = normalizeIntegration({
      ...form,
      name: form.name.trim(),
      integratedTo: form.integratedTo.trim() || "-",
      purpose: form.purpose.trim() || "-",
      owner: form.owner.trim() || form.accountOwner.trim() || "-",
      notes: form.notes.trim() || form.errorNotes.trim() || "-"
    });
    const next = editing === null ? [nextItem, ...items] : items.map((item, index) => index === editing ? nextItem : item);
    persist(next);
    setForm(empty);
    setEditing(null);
  }

  function editIntegration(index) {
    setForm(normalizeIntegration(items[index]));
    setEditing(index);
    setMode("add");
    setSaved("");
  }

  function bulkAdd() {
    const names = bulkText
      .split(/\n|,/)
      .map((name) => name.trim())
      .filter(Boolean);
    if (!names.length) return;
    const nextItems = names.map((name) => normalizeIntegration({
      name,
      category: "API",
      integratedTo: "-",
      purpose: "-",
      status: "Not connected / Disabled",
      lastChecked: "Not checked",
      owner: "-",
      notes: "Bulk added. Open Edit to complete details."
    }));
    persist([...nextItems, ...items]);
    setBulkText("");
  }

  function exportCsv() {
    const csv = integrationsToCsv(items);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `archscale-integrations-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setSaved("Integration CSV exported.");
  }

  function importCsv(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const imported = integrationsFromCsv(String(reader.result || ""));
      if (!imported.length) {
        setSaved("No valid integrations found in that CSV.");
        return;
      }
      persist([...imported, ...items]);
      setSaved(`${imported.length} integrations imported from CSV.`);
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  function deleteIntegration(index) {
    persist(items.filter((_, itemIndex) => itemIndex !== index));
    if (editing === index) {
      setForm(empty);
      setEditing(null);
    }
  }

  return (
    <div className="overview">
      <section className="business-card flow-card">
        <header className="product-head">
          <div><p className="eyebrow">Integration Register</p><h2>Add or update integrations</h2></div>
          <div className="integration-tools">
            <div className="pill-switch">
              <button className={mode === "add" ? "on" : ""} onClick={() => setMode("add")}>Add integration</button>
              <button className={mode === "bulk" ? "on" : ""} onClick={() => setMode("bulk")}>Bulk paste</button>
            </div>
            <button className="ghost small" onClick={exportCsv}>Export CSV</button>
            <label className="ghost small import-csv">Import CSV<input type="file" accept=".csv,text/csv" onChange={importCsv} /></label>
          </div>
        </header>
        {mode === "bulk" ? (
          <div className="bulk-panel">
            <textarea className="wide-textarea" placeholder={"Paste App / API names here, one per line.\nSupabase Database\nZoho API\nWhatsApp Webhook"} value={bulkText} onChange={(event) => setBulkText(event.target.value)} />
            <button className="primary small" onClick={bulkAdd}>Add pasted integrations</button>
          </div>
        ) : (
          <>
            <IntegrationFieldset title="Basic">
              <input placeholder="App / API Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              <input placeholder="Website / API link" value={form.link} onChange={(event) => setForm({ ...form, link: event.target.value })} />
              <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{integrationCategories.map((item) => <option key={item}>{item}</option>)}</select>
              <input placeholder="Integrated to ArchScale app/module" value={form.integratedTo} onChange={(event) => setForm({ ...form, integratedTo: event.target.value })} />
              <input placeholder="Purpose" value={form.purpose} onChange={(event) => setForm({ ...form, purpose: event.target.value })} />
              <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>{integrationStatuses.map((status) => <option key={status}>{status}</option>)}</select>
            </IntegrationFieldset>
            <IntegrationFieldset title="Login Ownership">
              <input placeholder="Gmail / email used" value={form.emailUsed} onChange={(event) => setForm({ ...form, emailUsed: event.target.value })} />
              <input placeholder="Username" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />
              <input placeholder="Password storage location" value={form.passwordLocation} onChange={(event) => setForm({ ...form, passwordLocation: event.target.value })} />
              <input placeholder="Account owner" value={form.accountOwner} onChange={(event) => setForm({ ...form, accountOwner: event.target.value, owner: event.target.value })} />
              <input placeholder="Recovery email / phone" value={form.recoveryContact} onChange={(event) => setForm({ ...form, recoveryContact: event.target.value })} />
              <select value={form.twoFactor} onChange={(event) => setForm({ ...form, twoFactor: event.target.value })}>{yesNo.map((item) => <option key={item}>{item}</option>)}</select>
              <select value={form.backupCodesStored} onChange={(event) => setForm({ ...form, backupCodesStored: event.target.value })}>{yesNo.map((item) => <option key={item}>{item}</option>)}</select>
            </IntegrationFieldset>
            <IntegrationFieldset title="API Details">
              <input placeholder="API provider" value={form.apiProvider} onChange={(event) => setForm({ ...form, apiProvider: event.target.value })} />
              <input placeholder="API key name" value={form.apiKeyName} onChange={(event) => setForm({ ...form, apiKeyName: event.target.value })} />
              <input placeholder="Client ID" value={form.clientId} onChange={(event) => setForm({ ...form, clientId: event.target.value })} />
              <input placeholder="Client secret storage location" value={form.clientSecretLocation} onChange={(event) => setForm({ ...form, clientSecretLocation: event.target.value })} />
              <input placeholder="Access token storage location" value={form.accessTokenLocation} onChange={(event) => setForm({ ...form, accessTokenLocation: event.target.value })} />
              <select value={form.refreshTokenAvailable} onChange={(event) => setForm({ ...form, refreshTokenAvailable: event.target.value })}>{yesNo.map((item) => <option key={item}>{item}</option>)}</select>
              <input type="date" value={form.tokenExpiryDate} onChange={(event) => setForm({ ...form, tokenExpiryDate: event.target.value })} />
              <input placeholder="Scopes / permissions granted" value={form.scopes} onChange={(event) => setForm({ ...form, scopes: event.target.value })} />
              <input placeholder="Callback / redirect URL" value={form.callbackUrl} onChange={(event) => setForm({ ...form, callbackUrl: event.target.value })} />
              <input placeholder="Webhook URL" value={form.webhookUrl} onChange={(event) => setForm({ ...form, webhookUrl: event.target.value })} />
              <input placeholder="Webhook secret storage location" value={form.webhookSecretLocation} onChange={(event) => setForm({ ...form, webhookSecretLocation: event.target.value })} />
            </IntegrationFieldset>
            <IntegrationFieldset title="Billing">
              <input placeholder="Plan name" value={form.planName} onChange={(event) => setForm({ ...form, planName: event.target.value })} />
              <select value={form.pricing} onChange={(event) => setForm({ ...form, pricing: event.target.value })}><option>Free</option><option>Paid</option></select>
              <input placeholder="Monthly cost" value={form.monthlyCost} onChange={(event) => setForm({ ...form, monthlyCost: event.target.value })} />
              <input type="date" value={form.renewalDate} onChange={(event) => setForm({ ...form, renewalDate: event.target.value })} />
              <input placeholder="Payment owner" value={form.paymentOwner} onChange={(event) => setForm({ ...form, paymentOwner: event.target.value })} />
              <input placeholder="Invoice email" value={form.invoiceEmail} onChange={(event) => setForm({ ...form, invoiceEmail: event.target.value })} />
            </IntegrationFieldset>
            <IntegrationFieldset title="Technical">
              <select value={form.environment} onChange={(event) => setForm({ ...form, environment: event.target.value })}>{integrationEnvironments.map((item) => <option key={item}>{item}</option>)}</select>
              <input placeholder="Connected database/table" value={form.connectedDatabase} onChange={(event) => setForm({ ...form, connectedDatabase: event.target.value })} />
              <input placeholder="Data synced" value={form.dataSynced} onChange={(event) => setForm({ ...form, dataSynced: event.target.value })} />
              <select value={form.syncDirection} onChange={(event) => setForm({ ...form, syncDirection: event.target.value })}><option>One-way</option><option>Two-way</option></select>
              <select value={form.syncFrequency} onChange={(event) => setForm({ ...form, syncFrequency: event.target.value })}><option>Real-time</option><option>Hourly</option><option>Daily</option><option>Manual</option></select>
              <input placeholder="Last sync date/time" value={form.lastSync} onChange={(event) => setForm({ ...form, lastSync: event.target.value })} />
              <input placeholder="Last tested date" value={form.lastTested} onChange={(event) => setForm({ ...form, lastTested: event.target.value, lastChecked: event.target.value })} />
              <input placeholder="Error notes" value={form.errorNotes} onChange={(event) => setForm({ ...form, errorNotes: event.target.value, notes: event.target.value })} />
            </IntegrationFieldset>
            <IntegrationFieldset title="Security">
              <select value={form.dataSensitivity} onChange={(event) => setForm({ ...form, dataSensitivity: event.target.value })}><option>Low</option><option>Medium</option><option>High</option></select>
              <input placeholder="Who can access it" value={form.accessUsers} onChange={(event) => setForm({ ...form, accessUsers: event.target.value })} />
              <input placeholder="Admin panel access role" value={form.adminAccessRole} onChange={(event) => setForm({ ...form, adminAccessRole: event.target.value })} />
              <input placeholder="Delete / revoke process" value={form.revokeProcess} onChange={(event) => setForm({ ...form, revokeProcess: event.target.value })} />
              <input placeholder="Audit notes" value={form.auditNotes} onChange={(event) => setForm({ ...form, auditNotes: event.target.value })} />
            </IntegrationFieldset>
            <div className="form-actions">
              <button className="primary small" onClick={submitIntegration}>{editing === null ? "Add integration" : "Save changes"}</button>
              {editing !== null && <button className="ghost small" onClick={() => { setEditing(null); setForm(empty); }}>Cancel edit</button>}
            </div>
          </>
        )}
        <p className="soft-copy">By default, new integrations are Not connected / Disabled in grey. Status colours: Connected green, Issue amber, Broken red, Testing orange, Paused brown.</p>
        {saved && <p className="flow-message ok">{saved}</p>}
      </section>
      <section className="business-card">
        <p className="eyebrow">Status Monitor</p>
        <h2>Manual integrations list</h2>
        <div className="table-wrap">
          <table>
            <thead><tr>{["App / API Name", "Link", "Integrated To", "Purpose", "Email Used", "Username", "Password Location", "API Key Location", "Status", "Plan", "Renewal Date", "Last Tested", "Actions"].map((column) => <th key={column}>{column}</th>)}</tr></thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={`${item.name}-${index}`}>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.link ? <a href={item.link} target="_blank" rel="noreferrer">Open</a> : "-"}</td>
                  <td>{item.integratedTo}</td>
                  <td>{item.purpose}</td>
                  <td>{item.emailUsed || "-"}</td>
                  <td>{item.username || "-"}</td>
                  <td>{item.passwordLocation || "-"}</td>
                  <td>{item.apiKeyName || item.clientSecretLocation || item.accessTokenLocation || "-"}</td>
                  <td><span className={`status-dot ${statusClass(item.status)}`}>{item.status}</span></td>
                  <td>{item.planName || item.pricing || "-"}</td>
                  <td>{item.renewalDate || "-"}</td>
                  <td>{item.lastTested || item.lastChecked}</td>
                  <td><div className="row-actions"><button onClick={() => editIntegration(index)}>Edit</button><button onClick={() => deleteIntegration(index)}>Delete</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function IntegrationFieldset({ title, children }) {
  return <section className="integration-fieldset"><h3>{title}</h3><div>{children}</div></section>;
}

function statusClass(status) {
  if (status.startsWith("Connected")) return "good";
  if (status.startsWith("Issue")) return "attention";
  if (status.startsWith("Broken")) return "bad";
  if (status.startsWith("Testing")) return "testing";
  if (status.startsWith("Paused")) return "paused";
  return "neutral";
}

function Dashboard({ collapsible }) {
  const [openCards, setOpenCards] = useState(() => Object.fromEntries(data.dashboard.columns.map((column, index) => [column.title, index < 2])));
  const [range, setRange] = useState("Month");

  function toggleCard(title) {
    setOpenCards({ ...openCards, [title]: !openCards[title] });
  }

  return (
    <div className="overview">
      <div className="dashboard-range-bar">
        <div>
          <p className="eyebrow">Pattern View</p>
          <h2>{range}</h2>
        </div>
        <div className="pill-switch compact">
          {["Month", "Quarter", "Annual", "Lifetime"].map((item) => (
            <button key={item} className={range === item ? "on" : ""} onClick={() => setRange(item)}>{item}</button>
          ))}
        </div>
      </div>
      <div className="dash-columns">
        {data.dashboard.columns.map((column) => (
          <section className={`dash-card ${collapsible && !openCards[column.title] ? "collapsed" : ""}`} key={column.title}>
            {collapsible ? (
              <button className="collapse-head" onClick={() => toggleCard(column.title)} aria-expanded={openCards[column.title]}>
                <h2>{column.title}</h2>
                <i className={`ti ${openCards[column.title] ? "ti-chevron-up" : "ti-chevron-down"}`} />
              </button>
            ) : (
              <h2>{column.title}</h2>
            )}
            {(!collapsible || openCards[column.title]) && column.items.map(([label, value]) => (
              <div className="mini-stat" key={label}><span>{label}</span><strong>{value}</strong></div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}

const queuePriorities = ["Critical", "High", "Medium", "Low"];
const queueStatuses = ["Pending", "In Progress", "Review", "Blocked", "Done"];
const queueComplexities = ["Easy", "Moderate", "Complex"];
const queueFeatureTabs = ["Products & Modules", "Notes", "Developer Checklist"];
const queueCsvColumns = [
  ["productName", "Product Name"],
  ["purpose", "Purpose"],
  ["problem", "Problem Solved"],
  ["importance", "Importance"],
  ["accountable", "Accountable"],
  ["priority", "Priority"],
  ["status", "Status"],
  ["startDate", "Start Date"],
  ["endDate", "End Date"],
  ["roadmapQuarter", "Roadmap Quarter"],
  ["moduleName", "Module Name"],
  ["modulePurpose", "Module Purpose"],
  ["moduleProblem", "Module Problem Solved"],
  ["modulePriority", "Module Priority"],
  ["moduleComplexity", "Module Complexity"],
  ["featureName", "Feature Name"],
  ["featurePurpose", "Feature Purpose"],
  ["featureProblem", "Feature Problem Solved"],
  ["featurePriority", "Feature Priority"],
  ["featureComplexity", "Feature Complexity"],
  ["featureStatus", "Feature Status"],
  ["featureAccountable", "Feature Accountable"],
  ["featureDueDate", "Feature Due Date"],
  ["featureProgress", "Feature Progress %"],
  ["taskName", "Task Name"],
  ["taskPurpose", "Task Purpose"],
  ["taskAccountable", "Task Accountable"],
  ["taskPriority", "Task Priority"],
  ["taskStatus", "Task Status"],
  ["taskDueDate", "Task Due Date"],
  ["taskCompletedOn", "Task Completion Date"],
  ["doneDate", "Done Date"],
  ["lastCompletedDate", "Last Completed Date"],
  ["notes", "Notes"],
  ["developerChecklist", "Developer Checklist"],
];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function todayDisplay() {
  const [year, month, day] = todayIso().split("-");
  return `${day}-${month}-${year}`;
}

function quarterFromDate(value) {
  const month = Number(String(value || "").split("-")[1]);
  if (!month) return "Q1";
  return `Q${Math.ceil(month / 3)}`;
}

function queueId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function normalizeQueueTask(item = {}) {
  const completedOn = item.completedOn || item.doneDate || "";
  return {
    id: item.id || queueId("task"),
    taskName: item.taskName || item.name || "New task",
    taskPurpose: item.taskPurpose || item.purpose || "Double-click to add task purpose",
    accountable: item.accountable || item.owner || "",
    priority: queuePriorities.includes(item.priority) ? item.priority : "Medium",
    status: queueStatuses.includes(item.status) ? item.status : item.checked || completedOn ? "Done" : "Pending",
    dueDate: item.dueDate || "",
    checked: Boolean(item.checked || completedOn),
    completedOn: item.checked || item.status === "Done" ? completedOn || todayDisplay() : "",
    completionHistory: item.completionHistory || (completedOn ? [completedOn] : []),
  };
}

function normalizeQueueFeature(item = {}) {
  const tasks = (item.tasks || []).map(normalizeQueueTask);
  const checked = Boolean(item.checked || item.status === "Done");
  return {
    id: item.id || queueId("feature"),
    featureName: item.featureName || item.name || "New feature",
    featurePurpose: item.featurePurpose || item.purpose || "Double-click to add purpose",
    problem: item.problem || item.featureProblem || "What problem are we solving?",
    priority: queuePriorities.includes(item.priority) ? item.priority : "Medium",
    complexity: queueComplexities.includes(item.complexity) ? item.complexity : "Moderate",
    status: queueStatuses.includes(item.status) ? item.status : checked ? "Done" : "Pending",
    accountable: item.accountable || item.owner || "",
    dueDate: item.dueDate || "",
    progress: item.progress ?? (tasks.length ? Math.round((tasks.filter((task) => task.checked).length / tasks.length) * 100) : checked ? 100 : 0),
    checked,
    doneDate: checked ? item.doneDate || todayIso() : "",
    lastCompletedDate: item.lastCompletedDate || item.doneDate || "",
    expanded: item.expanded ?? true,
    tasks,
  };
}

function normalizeQueueModule(item = {}) {
  return {
    id: item.id || queueId("module"),
    moduleName: item.moduleName || item.name || "General module",
    modulePurpose: item.modulePurpose || item.purpose || "Group related features and workflows.",
    problem: item.problem || item.moduleProblem || "What problem are we solving?",
    priority: queuePriorities.includes(item.priority) ? item.priority : "Medium",
    complexity: queueComplexities.includes(item.complexity) ? item.complexity : "Moderate",
    features: (item.features || []).map(normalizeQueueFeature),
  };
}

function normalizeQueueProduct(item) {
  const legacyFeatures = item.features?.length ? [{
    moduleName: "General module",
    modulePurpose: "Imported feature group",
    features: item.features,
  }] : [];
  const modules = (item.modules?.length ? item.modules : legacyFeatures).map(normalizeQueueModule);
  return {
    id: item.id || queueId("product"),
    productName: item.productName || item.name || "Untitled product",
    purpose: item.purpose || "",
    problem: item.problem || "What problem are we solving?",
    importance: Number(item.importance ?? 3),
    accountable: item.accountable || item.owner || "Founder",
    priority: queuePriorities.includes(item.priority) ? item.priority : "Medium",
    status: queueStatuses.includes(item.status) ? item.status : "Pending",
    complexity: queueComplexities.includes(item.complexity) ? item.complexity : "Moderate",
    startDate: item.startDate || "",
    endDate: item.endDate || "",
    roadmapQuarter: item.endDate ? quarterFromDate(item.endDate) : item.roadmapQuarter || "Q1",
    notes: item.notes || "",
    developerChecklist: item.developerChecklist || "",
    modules: modules.length ? modules : [normalizeQueueModule()],
  };
}

function loadNextQueue() {
  try {
    const saved = JSON.parse(localStorage.getItem("archscale-next-queue"));
    if (Array.isArray(saved) && saved.length) return saved.map(normalizeQueueProduct);
  } catch {
    // Fall through to starter backlog.
  }
  return [
    normalizeQueueProduct({
      productName: "Client Billing Portal",
      purpose: "Let tenants update billing details, view invoices and manage subscriptions.",
      problem: "Tenant owners cannot update billing details or view invoices without support help.",
      accountable: "Founder",
      importance: 5,
      priority: "High",
      status: "In Progress",
      complexity: "Complex",
      startDate: "2026-06-10",
      endDate: "2026-06-30",
      notes: "Keep invoice details GST-ready before connecting payment automation.",
      developerChecklist: "Confirm billing data model\nWire tenant invoice route\nAdd PDF download later",
      modules: [
        { moduleName: "Billing", modulePurpose: "Tenant billing controls", priority: "High", complexity: "Complex", features: [
          { featureName: "Billing details form", featurePurpose: "Capture GST, address and accounts contact", status: "In Progress", priority: "High", complexity: "Moderate", accountable: "Product", dueDate: "2026-06-20", tasks: [
            { taskName: "Add GST fields", taskPurpose: "Capture seller and client GST data", accountable: "Frontend", priority: "High", status: "Done", checked: true, completedOn: todayDisplay() },
            { taskName: "Validate address form", taskPurpose: "Prevent incomplete invoice data", accountable: "Frontend", priority: "Medium", status: "Pending" },
          ] },
          { featureName: "Invoice list", featurePurpose: "Show tenant invoice records and statuses", status: "Pending", priority: "Medium", complexity: "Moderate", accountable: "Product" },
        ] },
      ],
    }),
  ];
}

function queueToCsv(products) {
  const header = queueCsvColumns.map(([, label]) => csvEscape(label)).join(",");
  const rows = products.flatMap((product) => {
    const modules = product.modules?.length ? product.modules : [normalizeQueueModule()];
    return modules.flatMap((module) => {
      const features = module.features.length ? module.features : [normalizeQueueFeature({ featureName: "", featurePurpose: "" })];
      return features.flatMap((feature) => {
        const tasks = feature.tasks.length ? feature.tasks : [normalizeQueueTask({ taskName: "", taskPurpose: "" })];
        return tasks.map((task) => queueCsvColumns.map(([key]) => {
      const value = {
        productName: product.productName,
        purpose: product.purpose,
        problem: product.problem,
        importance: product.importance,
        accountable: product.accountable,
        priority: product.priority,
        status: product.status,
        startDate: product.startDate,
        endDate: product.endDate,
        roadmapQuarter: product.roadmapQuarter,
        moduleName: module.moduleName,
        modulePurpose: module.modulePurpose,
        moduleProblem: module.problem,
        modulePriority: module.priority,
        moduleComplexity: module.complexity,
        featureName: feature.featureName,
        featurePurpose: feature.featurePurpose,
        featureProblem: feature.problem,
        featurePriority: feature.priority,
        featureComplexity: feature.complexity,
        featureStatus: feature.status,
        featureAccountable: feature.accountable,
        featureDueDate: feature.dueDate,
        featureProgress: feature.progress,
        taskName: task.taskName,
        taskPurpose: task.taskPurpose,
        taskAccountable: task.accountable,
        taskPriority: task.priority,
        taskStatus: task.status,
        taskDueDate: task.dueDate,
        taskCompletedOn: task.completedOn,
        doneDate: feature.doneDate,
        lastCompletedDate: feature.lastCompletedDate,
        notes: product.notes,
        developerChecklist: product.developerChecklist,
      }[key];
      return csvEscape(value);
        }).join(","));
      });
    });
  });
  return [header, ...rows].join("\n");
}

function queueFromCsv(text) {
  const rows = csvToRows(text);
  if (!rows.length) return [];
  const headers = rows[0].map((cell) => cell.toLowerCase());
  const grouped = new Map();
  rows.slice(1).forEach((row) => {
    const record = {};
    queueCsvColumns.forEach(([key, label]) => {
      const index = headers.indexOf(label.toLowerCase());
      record[key] = index >= 0 ? row[index] || "" : "";
    });
    if (!record.productName) return;
    if (!grouped.has(record.productName)) {
      grouped.set(record.productName, normalizeQueueProduct({
        productName: record.productName,
        purpose: record.purpose,
        problem: record.problem,
        accountable: record.accountable,
        importance: record.importance,
        priority: queuePriorities.includes(record.priority) ? record.priority : "Medium",
        status: queueStatuses.includes(record.status) ? record.status : "Pending",
        startDate: record.startDate,
        endDate: record.endDate,
        roadmapQuarter: record.roadmapQuarter,
        notes: record.notes,
        developerChecklist: record.developerChecklist,
        modules: [],
      }));
    }
    const product = grouped.get(record.productName);
    const moduleName = record.moduleName || "General module";
    let module = product.modules.find((item) => item.moduleName === moduleName);
    if (!module) {
      module = normalizeQueueModule({
        moduleName,
        modulePurpose: record.modulePurpose,
        problem: record.moduleProblem,
        priority: record.modulePriority,
        complexity: record.moduleComplexity,
        features: [],
      });
      product.modules.push(module);
    }
    if (record.featureName) {
      let feature = module.features.find((item) => item.featureName === record.featureName);
      if (!feature) {
        feature = normalizeQueueFeature({
          featureName: record.featureName,
          featurePurpose: record.featurePurpose,
          problem: record.featureProblem,
          priority: record.featurePriority,
          complexity: record.featureComplexity,
          status: record.featureStatus,
          accountable: record.featureAccountable,
          dueDate: record.featureDueDate,
          progress: record.featureProgress,
          checked: record.featureStatus === "Done" || Boolean(record.doneDate),
          doneDate: record.doneDate,
          lastCompletedDate: record.lastCompletedDate || record.doneDate,
          tasks: [],
        });
        module.features.push(feature);
      }
      if (record.taskName) {
        feature.tasks.push(normalizeQueueTask({
          taskName: record.taskName,
          taskPurpose: record.taskPurpose,
          accountable: record.taskAccountable,
          priority: record.taskPriority,
          status: record.taskStatus,
          dueDate: record.taskDueDate,
          checked: record.taskStatus === "Done" || Boolean(record.taskCompletedOn),
          completedOn: record.taskCompletedOn,
        }));
      }
    }
  });
  return [...grouped.values()].map(normalizeQueueProduct);
}

function slug(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function stars(value) {
  const count = Math.max(0, Math.min(5, Number(value || 0)));
  return "★★★★★".slice(0, count) + "☆☆☆☆☆".slice(0, 5 - count);
}

function priorityLabel(priority) {
  return {
    Critical: "Critical",
    High: "High",
    Medium: "Medium",
    Low: "Low",
  }[priority] || "Medium";
}

function reorder(list, from, to) {
  if (!Number.isInteger(from) || !Number.isInteger(to) || from === to || from < 0 || to < 0) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  if (!item) return list;
  next.splice(to, 0, item);
  return next;
}

function queueItems(products) {
  return products.flatMap((product) => product.modules.flatMap((module) => module.features.flatMap((feature) => [
    { type: "feature", product, module, feature, status: feature.status, dueDate: feature.dueDate },
    ...feature.tasks.map((task) => ({ type: "task", product, module, feature, task, status: task.status, dueDate: task.dueDate })),
  ])));
}

function calendarEvents(products) {
  return products.flatMap((product) => {
    const productEvents = [
      product.startDate ? {
        id: `${product.id}-start`,
        type: "Start",
        title: product.productName,
        date: product.startDate,
        status: product.status,
        product,
      } : null,
      product.endDate ? {
        id: `${product.id}-end`,
        type: "Close",
        title: product.productName,
        date: product.endDate,
        status: product.status,
        product,
      } : null,
    ].filter(Boolean);
    const childEvents = product.modules.flatMap((module) => module.features.flatMap((feature) => [
      feature.dueDate ? {
        id: `${feature.id}-due`,
        type: "Feature",
        title: feature.featureName,
        date: feature.dueDate,
        status: feature.status,
        product,
        module,
        feature,
      } : null,
      ...feature.tasks.filter((task) => task.dueDate).map((task) => ({
        id: `${task.id}-due`,
        type: "Task",
        title: task.taskName,
        date: task.dueDate,
        status: task.status,
        product,
        module,
        feature,
        task,
      })),
    ].filter(Boolean)));
    return [...productEvents, ...childEvents];
  }).sort((a, b) => a.date.localeCompare(b.date));
}

function monthName(dateValue) {
  return new Date(`${dateValue}T00:00:00`).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

function dateMs(value) {
  return new Date(`${value}T00:00:00`).getTime();
}

function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(dateValue, days) {
  const date = new Date(`${dateValue}T00:00:00`);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

function formatTimelineDate(dateValue, options = { day: "numeric", month: "short" }) {
  return new Date(`${dateValue}T00:00:00`).toLocaleDateString("en-IN", options);
}

function roadmapWindows(products) {
  return products
    .filter((product) => product.startDate || product.endDate)
    .map((product) => ({
      id: product.id,
      title: product.productName,
      start: product.startDate || product.endDate,
      end: product.endDate || product.startDate,
      status: product.status,
      priority: product.priority,
      quarter: product.roadmapQuarter,
    }))
    .sort((a, b) => a.start.localeCompare(b.start));
}

function roadmapTimelineRows(products) {
  return products.flatMap((product, productIndex) => {
    const productRow = {
      id: product.id,
      title: product.productName,
      subtitle: product.startDate || product.endDate ? `${product.startDate || product.endDate} to ${product.endDate || product.startDate} · ${product.roadmapQuarter}` : "No start or end date set",
      start: product.startDate || product.endDate || "",
      end: product.endDate || product.startDate || "",
      status: product.status,
      quarter: product.roadmapQuarter,
      hasDates: Boolean(product.startDate || product.endDate),
      type: "product",
      colorIndex: productIndex,
    };
    const moduleRows = product.modules.slice(0, 2).map((module) => ({
      id: `${product.id}-${module.id}`,
      title: module.moduleName,
      subtitle: "",
      start: module.startDate || module.endDate || "",
      end: module.endDate || module.startDate || "",
      status: module.status || product.status,
      quarter: module.roadmapQuarter || product.roadmapQuarter,
      hasDates: Boolean(module.startDate || module.endDate),
      type: "module",
      colorIndex: productIndex,
    }));
    return [productRow, ...moduleRows];
  });
}

const roadmapPalette = [
  { name: "red", line: "#d84c42", fill: "#fff0ee", text: "#8f2f28" },
  { name: "blue", line: "#2f6fec", fill: "#edf4ff", text: "#1847a7" },
  { name: "green", line: "#2f9b67", fill: "#edf8f1", text: "#1f6f48" },
  { name: "violet", line: "#7d55d8", fill: "#f3efff", text: "#4e329b" },
  { name: "purple", line: "#b542a8", fill: "#fff0fb", text: "#7a276f" },
  { name: "teal", line: "#188f9d", fill: "#eaf9fb", text: "#12646e" },
  { name: "amber", line: "#d99020", fill: "#fff6df", text: "#86570e" },
  { name: "rose", line: "#e0527c", fill: "#fff0f4", text: "#96314f" },
];

function timelineColor(index) {
  return roadmapPalette[index % roadmapPalette.length];
}

function buildTimelineCells(baseDate, scale) {
  const base = new Date(`${baseDate}T00:00:00`);
  if (scale === "week") {
    const start = new Date(base);
    start.setDate(base.getDate() - base.getDay());
    return Array.from({ length: 7 }, (_, index) => {
      const date = toIsoDate(new Date(start.getFullYear(), start.getMonth(), start.getDate() + index));
      return {
        id: date,
        label: formatTimelineDate(date, { weekday: "short" }),
        sublabel: formatTimelineDate(date, { day: "numeric", month: "short" }),
        start: date,
        end: date,
      };
    });
  }
  if (scale === "month") {
    const first = new Date(base.getFullYear(), base.getMonth(), 1);
    const daysInMonth = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, index) => {
      const date = toIsoDate(new Date(first.getFullYear(), first.getMonth(), index + 1));
      return {
        id: date,
        label: String(index + 1),
        sublabel: formatTimelineDate(date, { weekday: "short" }),
        start: date,
        end: date,
      };
    });
  }
  if (scale === "quarter") {
    const quarterStartMonth = Math.floor(base.getMonth() / 3) * 3;
    const start = new Date(base.getFullYear(), quarterStartMonth, 1);
    return Array.from({ length: 13 }, (_, index) => {
      const weekStart = toIsoDate(new Date(start.getFullYear(), start.getMonth(), start.getDate() + index * 7));
      const weekEnd = addDays(weekStart, 6);
      return {
        id: weekStart,
        label: `W${index + 1}`,
        sublabel: formatTimelineDate(weekStart),
        start: weekStart,
        end: weekEnd,
      };
    });
  }
  return Array.from({ length: 12 }, (_, index) => {
    const monthStart = toIsoDate(new Date(base.getFullYear(), index, 1));
    const monthEnd = toIsoDate(new Date(base.getFullYear(), index + 1, 0));
    return {
      id: monthStart,
      label: formatTimelineDate(monthStart, { month: "short" }),
      sublabel: String(base.getFullYear()),
      start: monthStart,
      end: monthEnd,
    };
  });
}

function timelineSpan(item, cells) {
  const startIndex = cells.findIndex((cell) => item.end >= cell.start && item.start <= cell.end);
  if (startIndex === -1) return null;
  let endIndex = startIndex;
  for (let index = startIndex; index < cells.length; index += 1) {
    if (item.end >= cells[index].start && item.start <= cells[index].end) endIndex = index;
  }
  return { start: startIndex + 1, span: endIndex - startIndex + 1 };
}

function queueMetrics(products) {
  const modules = products.flatMap((product) => product.modules);
  const features = modules.flatMap((module) => module.features);
  const tasks = features.flatMap((feature) => feature.tasks);
  const items = [...features, ...tasks];
  const completed = items.filter((item) => item.status === "Done" || item.checked).length;
  const blocked = items.filter((item) => item.status === "Blocked").length;
  const pending = items.filter((item) => item.status === "Pending").length;
  const today = todayIso();
  const overdue = items.filter((item) => item.dueDate && item.dueDate < today && item.status !== "Done").length;
  return {
    products: products.length,
    modules: modules.length,
    features: features.length,
    tasks: tasks.length,
    completed,
    pending,
    blocked,
    overdue,
    completion: items.length ? Math.round((completed / items.length) * 100) : 0,
  };
}

function countProductBlocked(product) {
  return product.modules.flatMap((module) => module.features).filter((feature) => feature.status === "Blocked").length
    + product.modules.flatMap((module) => module.features.flatMap((feature) => feature.tasks)).filter((task) => task.status === "Blocked").length;
}

function nextPendingItem(product) {
  const feature = product.modules.flatMap((module) => module.features).find((item) => item.status !== "Done");
  if (feature) return feature.featureName;
  return "No pending feature";
}

function QueueRoadmap({ products, onMoveProduct, onOpenProduct }) {
  const groups = ["Q1", "Q2", "Q3", "Q4"];
  return (
    <div className="queue-timeline">
      {groups.map((quarter) => (
        <section
          key={quarter}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            const productId = event.dataTransfer.getData("product-id");
            if (productId) onMoveProduct?.(productId, quarter);
          }}
        >
          <h3>{quarter}</h3>
          {products.filter((product) => product.roadmapQuarter === quarter).map((product) => (
            <article
              key={product.id}
              className="roadmap-card"
              draggable
              onDragStart={(event) => event.dataTransfer.setData("product-id", product.id)}
              onClick={() => onOpenProduct?.(product.id)}
            >
              <strong>{product.productName}</strong>
              <small>{product.startDate || "No start"} to {product.endDate || "No close date"}</small>
              <span className={`queue-status ${slug(product.status)}`}>{product.status}</span>
            </article>
          ))}
          {!products.some((product) => product.roadmapQuarter === quarter) && <div className="roadmap-drop-hint">Drop roadmap cards here</div>}
        </section>
      ))}
    </div>
  );
}

function ProductRoadmapPanel({ product, onClose, onUpdate, onDelete }) {
  if (!product) return null;
  return (
    <div className="queue-panel-backdrop" onMouseDown={onClose}>
      <aside className="queue-edit-panel" onMouseDown={(event) => event.stopPropagation()}>
        <header>
          <div>
            <p className="eyebrow">Roadmap Product</p>
            <h2>Edit product window</h2>
          </div>
          <button className="ghost small" onClick={onClose}>Close</button>
        </header>
        <div className="queue-panel-body">
          <label>Product Name<input value={product.productName} onChange={(event) => onUpdate({ productName: event.target.value })} /></label>
          <label>Purpose<textarea value={product.purpose} onChange={(event) => onUpdate({ purpose: event.target.value })} /></label>
          <label>Problem Solved<textarea value={product.problem} onChange={(event) => onUpdate({ problem: event.target.value })} /></label>
          <div className="queue-panel-grid">
            <label>Accountable<input value={product.accountable} onChange={(event) => onUpdate({ accountable: event.target.value })} /></label>
            <label>Importance<select value={product.importance} onChange={(event) => onUpdate({ importance: Number(event.target.value) })}>{[0, 1, 2, 3, 4, 5].map((item) => <option key={item} value={item}>{item} · {stars(item)}</option>)}</select></label>
            <label>Priority<select value={product.priority} onChange={(event) => onUpdate({ priority: event.target.value })}>{queuePriorities.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>Status<select value={product.status} onChange={(event) => onUpdate({ status: event.target.value })}>{queueStatuses.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>Complexity<select value={product.complexity} onChange={(event) => onUpdate({ complexity: event.target.value })}>{queueComplexities.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>Roadmap Quarter<input value={product.roadmapQuarter} readOnly /></label>
            <label>Start Date<input type="date" value={product.startDate} onChange={(event) => onUpdate({ startDate: event.target.value })} /></label>
            <label>End Date<input type="date" value={product.endDate} onChange={(event) => onUpdate({ endDate: event.target.value, roadmapQuarter: quarterFromDate(event.target.value) })} /></label>
          </div>
          <p className="soft-copy">Quarter is mapped automatically from the end date. You can also drag this product card between quarters on the roadmap.</p>
        </div>
        <footer>
          <button className="ghost small danger-soft" onClick={onDelete}>Delete product</button>
          <button className="primary small" onClick={onClose}>Done</button>
        </footer>
      </aside>
    </div>
  );
}

function QueueCalendar({ products }) {
  const [view, setView] = useState("calendar");
  const [scale, setScale] = useState("year");
  const events = calendarEvents(products);
  const baseDate = events[0]?.date || todayIso();
  const timelineRows = roadmapTimelineRows(products);
  const cells = buildTimelineCells(baseDate, scale);
  const datedRows = timelineRows.filter((item) => item.hasDates && timelineSpan(item, cells));
  const scaleTitle = {
    week: "Weekly calendar",
    month: "Monthly calendar",
    quarter: "Quarterly calendar",
    year: "Annual calendar",
  }[scale];
  const minCellWidth = {
    week: "150px",
    month: "78px",
    quarter: "132px",
    year: "150px",
  }[scale];
  const stickyWidth = view === "calendar" ? 260 : 280;

  return (
    <div className="queue-calendar-shell">
      <header className="calendar-view-head">
        <div>
          <p className="eyebrow">Roadmap Schedule</p>
          <h2>{view === "calendar" ? scaleTitle : "Professional Gantt timeline"}</h2>
        </div>
        <div className="calendar-controls">
          <div className="pill-switch">
            <button className={view === "calendar" ? "on" : ""} onClick={() => setView("calendar")}>Calendar</button>
            <button className={view === "gantt" ? "on" : ""} onClick={() => setView("gantt")}>Gantt</button>
          </div>
          <div className="pill-switch compact">
            {[
              ["week", "Week"],
              ["month", "Month"],
              ["quarter", "Quarter"],
              ["year", "Year"],
            ].map(([key, label]) => (
              <button key={key} className={scale === key ? "on" : ""} onClick={() => setScale(key)}>{label}</button>
            ))}
          </div>
        </div>
      </header>
      {view === "calendar" && (
        <section className={`timeline-calendar-card ${scale}`}>
          <header>
            <div>
              <p className="eyebrow">Calendar View</p>
              <h2>{scaleTitle}</h2>
            </div>
            <span>{datedRows.length} dated / {timelineRows.length} rows</span>
          </header>
          <div className="timeline-scroll">
            <div className="timeline-grid" style={{ gridTemplateColumns: `${stickyWidth}px repeat(${cells.length}, minmax(${minCellWidth}, 1fr))` }}>
              <div className="timeline-sticky timeline-corner">Product</div>
              {cells.map((cell) => (
                <div className="timeline-cell-head" key={cell.id}>
                  <strong>{cell.label}</strong>
                  <small>{cell.sublabel}</small>
                </div>
              ))}
              {timelineRows.map((item, index) => {
                const color = timelineColor(item.colorIndex);
                const span = item.hasDates ? timelineSpan(item, cells) : null;
                return (
                  <Fragment key={item.id}>
                    <div className={`timeline-sticky timeline-product ${item.type === "module" ? "module-row" : ""}`}>
                      <strong>{item.title}</strong>
                      {item.subtitle && <small>{item.subtitle}</small>}
                    </div>
                    <div className="timeline-lane" data-row-type={item.type} style={{ "--cells": cells.length, gridColumn: `2 / span ${cells.length}` }}>
                      {span ? (
                        <span
                          className="timeline-line"
                          style={{
                            "--line": color.line,
                            "--fill": color.fill,
                            "--text": color.text,
                            gridColumn: `${span.start} / span ${span.span}`,
                          }}
                          data-row-type={item.type}
                        >
                          <b>{item.title}</b>
                          <em>{item.status}</em>
                        </span>
                      ) : (
                        <span className={`timeline-empty-line ${item.type === "module" ? "module" : ""}`}>
                          {item.hasDates ? "Outside this view" : item.type === "module" ? "Module not scheduled" : "Dates pending"}
                        </span>
                      )}
                    </div>
                  </Fragment>
                );
              })}
            </div>
            {!timelineRows.length && <div className="empty-state">Add products in Module Planning to populate this calendar.</div>}
          </div>
        </section>
      )}
      {view === "gantt" && (
        <section className={`gantt-card professional ${scale}`}>
          <header>
            <div>
              <p className="eyebrow">Gantt View</p>
              <h2>{scale === "year" ? "Annual roadmap by quarter" : `${scaleTitle} roadmap`}</h2>
            </div>
            <span>{datedRows.length} dated / {timelineRows.length} rows</span>
          </header>
          <div className="gantt-pro-scroll">
            <div className="gantt-pro-grid" style={{ gridTemplateColumns: `${stickyWidth}px repeat(${cells.length}, minmax(${minCellWidth}, 1fr))` }}>
              <div className="timeline-sticky timeline-corner">Product</div>
              {cells.map((cell) => (
                <div className="gantt-pro-head" key={cell.id}>
                  <strong>{cell.label}</strong>
                  <small>{cell.sublabel}</small>
                </div>
              ))}
              {timelineRows.map((item, index) => {
                const color = timelineColor(item.colorIndex);
                const span = item.hasDates ? timelineSpan(item, cells) : null;
              return (
                  <Fragment key={item.id}>
                    <div className={`timeline-sticky gantt-pro-product ${item.type === "module" ? "module-row" : ""}`}>
                      <strong>{item.title}</strong>
                      {item.subtitle && <small>{item.subtitle}</small>}
                    </div>
                    <div className="gantt-pro-track" data-row-type={item.type} style={{ "--cells": cells.length, gridColumn: `2 / span ${cells.length}` }}>
                      {span ? (
                        <span
                          className="gantt-pro-bar"
                          style={{
                            "--line": color.line,
                            "--fill": color.fill,
                            "--text": color.text,
                            gridColumn: `${span.start} / span ${span.span}`,
                          }}
                          data-row-type={item.type}
                        >
                          {item.status}
                        </span>
                      ) : (
                        <span className={`gantt-empty-line ${item.type === "module" ? "module" : ""}`}>
                          {item.hasDates ? "Outside this view" : item.type === "module" ? "Module not scheduled" : "Dates pending"}
                        </span>
                      )}
                  </div>
                  </Fragment>
              );
            })}
            </div>
            {!timelineRows.length && <div className="empty-state">Add products in Module Planning to populate the Gantt view.</div>}
          </div>
        </section>
      )}
    </div>
  );
}

function InlineEdit({ value, onSave, multiline = false, placeholder = "-" }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || "");

  function save() {
    setEditing(false);
    onSave(draft);
  }

  if (editing) {
    const common = {
      autoFocus: true,
      value: draft,
      onChange: (event) => setDraft(event.target.value),
      onBlur: save,
      onKeyDown: (event) => {
        if (event.key === "Enter" && !multiline) save();
        if (event.key === "Escape") {
          setDraft(value || "");
          setEditing(false);
        }
      },
    };
    return multiline ? <textarea className="inline-edit-input" {...common} /> : <input className="inline-edit-input" {...common} />;
  }

  return <button className="inline-edit-text" onDoubleClick={() => { setDraft(value || ""); setEditing(true); }}>{value || placeholder}</button>;
}

function Product() {
  const [apps, setApps] = useState(data.product.lifecycle);
  const [form, setForm] = useState({ name: "", description: "", status: "Development" });
  const development = apps.filter((app) => app.status === "Development");
  const released = apps.filter((app) => app.status !== "Development");

  function addApp() {
    if (!form.name.trim()) return;
    setApps([...apps, { ...form, name: form.name.trim(), description: form.description.trim() || "New product module" }]);
    setForm({ name: "", description: "", status: "Development" });
  }

  function updateApp(name, status) {
    setApps(apps.map((app) => app.name === name ? { ...app, status } : app));
  }

  function deleteApp(name) {
    setApps(apps.filter((app) => app.name !== name));
  }

  return <div className="overview"><section className="product-card"><header className="product-head"><div><p className="eyebrow">Application Registry</p><h2>Apps lifecycle</h2></div><div className="product-tools"><input placeholder="App name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><input placeholder="Short description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>Development</option><option>Beta</option><option>Published</option></select><button className="primary small" onClick={addApp}>Add App</button></div></header><div className="lifecycle"><LifeColumn title="Draft / Development" apps={development} onStatus={updateApp} onDelete={deleteApp} /><LifeColumn title="Released / Beta / Published" apps={released} onStatus={updateApp} onDelete={deleteApp} /></div></section><Bundles /></div>;
}

function LifeColumn({ title, apps, onStatus, onDelete }) {
  return <section className="life-column"><header><span>{title}</span><b>{apps.length} apps</b></header>{apps.map((app) => <article className="life-row" key={app.name}><div><strong>{app.name}</strong><p>{app.description}</p></div><select value={app.status} onChange={(event) => onStatus(app.name, event.target.value)}><option>Development</option><option>Beta</option><option>Published</option></select><button onClick={() => onDelete(app.name)}><i className="ti ti-trash" />Delete</button></article>)}</section>;
}

function Bundles() {
  return <section className="product-card"><header className="product-head"><div><p className="eyebrow">Plan-named Bundles</p><h2>Bundles match subscriptions</h2></div><div className="product-tools"><input placeholder="Bundle name" /><button className="primary small">Create Bundle</button></div></header><div className="module-checks">{data.product.modules.map((module, index) => <label key={module}><input type="checkbox" defaultChecked={index < 2} />{module}</label>)}</div><div className="bundle-grid">{data.product.bundles.map((bundle) => <article className="bundle-card" key={bundle.name}><h3>{bundle.name}</h3><p>{bundle.modules.join(", ")}</p><button>Delete Bundle</button></article>)}</div></section>;
}

function NextInQueue() {
  const [products, setProducts] = useState(loadNextQueue);
  const [selectedId, setSelectedId] = useState(products[0]?.id || null);
  const [pageTab, setPageTab] = useState("Product Development");
  const [activeTab, setActiveTab] = useState("Roadmap");
  const [roadmapPanelId, setRoadmapPanelId] = useState(null);
  const [editingCardId, setEditingCardId] = useState(null);
  const selected = products.find((product) => product.id === selectedId) || products[0];
  const roadmapPanelProduct = products.find((product) => product.id === roadmapPanelId);
  const metrics = queueMetrics(products);

  function persist(next) {
    const normalised = next.map(normalizeQueueProduct);
    setProducts(normalised);
    localStorage.setItem("archscale-next-queue", JSON.stringify(normalised));
    if (!normalised.some((product) => product.id === selectedId)) setSelectedId(normalised[0]?.id || null);
  }

  function addProduct() {
    const product = normalizeQueueProduct({
      productName: "New product",
      purpose: "Double-click to describe why this should be built.",
      problem: "What problem are we solving?",
      accountable: "Founder",
      importance: 3,
      priority: "Medium",
      status: "Pending",
      modules: [normalizeQueueModule()],
    });
    persist([product, ...products]);
    setSelectedId(product.id);
    setActiveTab("Products & Modules");
  }

  function updateProduct(id, patch) {
    persist(products.map((product) => product.id === id ? normalizeQueueProduct({ ...product, ...patch }) : product));
  }

  function moveProduct(from, to) {
    persist(reorder(products, from, to));
  }

  function moveProductToQuarter(productId, quarter) {
    updateProduct(productId, { roadmapQuarter: quarter });
  }

  function deleteProduct(id) {
    persist(products.filter((product) => product.id !== id));
    if (roadmapPanelId === id) setRoadmapPanelId(null);
  }

  function addModule() {
    if (!selected) return;
    updateProduct(selected.id, {
      modules: [
        ...selected.modules,
        normalizeQueueModule({ moduleName: "New module", modulePurpose: "Double-click to describe this module." }),
      ],
    });
  }

  function updateModule(moduleId, patch) {
    if (!selected) return;
    updateProduct(selected.id, {
      modules: selected.modules.map((module) => module.id === moduleId ? normalizeQueueModule({ ...module, ...patch }) : module),
    });
  }

  function moveModule(from, to) {
    if (!selected) return;
    updateProduct(selected.id, { modules: reorder(selected.modules, from, to) });
  }

  function deleteModule(moduleId) {
    if (!selected) return;
    updateProduct(selected.id, { modules: selected.modules.filter((module) => module.id !== moduleId) });
  }

  function addFeature(moduleId) {
    if (!selected) return;
    updateProduct(selected.id, {
      modules: selected.modules.map((module) => module.id === moduleId ? {
        ...module,
        features: [
          ...module.features,
          normalizeQueueFeature({ featureName: "New feature", featurePurpose: "Double-click to add purpose" }),
        ],
      } : module),
    });
  }

  function updateFeature(moduleId, featureId, patch) {
    if (!selected) return;
    updateProduct(selected.id, {
      modules: selected.modules.map((module) => module.id === moduleId ? {
        ...module,
        features: module.features.map((feature) => feature.id === featureId ? normalizeQueueFeature({ ...feature, ...patch }) : feature),
      } : module),
    });
  }

  function moveFeature(moduleId, from, to) {
    const module = selected?.modules.find((item) => item.id === moduleId);
    if (!selected || !module) return;
    updateModule(moduleId, { features: reorder(module.features, from, to) });
  }

  function deleteFeature(moduleId, featureId) {
    const module = selected?.modules.find((item) => item.id === moduleId);
    if (!selected || !module) return;
    updateModule(moduleId, { features: module.features.filter((feature) => feature.id !== featureId) });
  }

  function addTask(moduleId, featureId) {
    const module = selected?.modules.find((item) => item.id === moduleId);
    const feature = module?.features.find((item) => item.id === featureId);
    if (!module || !feature) return;
    updateFeature(moduleId, featureId, {
      tasks: [...feature.tasks, normalizeQueueTask({ taskName: "New task", taskPurpose: "Double-click to add task purpose" })],
    });
  }

  function updateTask(moduleId, featureId, taskId, patch) {
    const module = selected?.modules.find((item) => item.id === moduleId);
    const feature = module?.features.find((item) => item.id === featureId);
    if (!module || !feature) return;
    updateFeature(moduleId, featureId, {
      tasks: feature.tasks.map((task) => task.id === taskId ? normalizeQueueTask({ ...task, ...patch }) : task),
    });
  }

  function moveTask(moduleId, featureId, from, to) {
    const feature = selected?.modules.find((module) => module.id === moduleId)?.features.find((item) => item.id === featureId);
    if (!feature) return;
    updateFeature(moduleId, featureId, { tasks: reorder(feature.tasks, from, to) });
  }

  function toggleTask(moduleId, featureId, task) {
    const completedOn = todayDisplay();
    updateTask(moduleId, featureId, task.id, task.checked
      ? { checked: false, status: "Pending", completedOn: "", completionHistory: task.completionHistory }
      : { checked: true, status: "Done", completedOn, completionHistory: [...(task.completionHistory || []), completedOn] });
  }

  function deleteTask(moduleId, featureId, taskId) {
    const feature = selected?.modules.find((module) => module.id === moduleId)?.features.find((item) => item.id === featureId);
    if (!feature) return;
    updateFeature(moduleId, featureId, { tasks: feature.tasks.filter((task) => task.id !== taskId) });
  }

  function exportCsv() {
    const blob = new Blob([queueToCsv(products)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `archscale-next-queue-${todayIso()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function importCsv(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const imported = queueFromCsv(String(reader.result || ""));
      if (!imported.length) return;
      persist(imported);
      setSelectedId(imported[0].id);
      setActiveTab("Roadmap");
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  function selectPageTab(item) {
    setPageTab(item);
    if (item === "Module Planning" && !queueFeatureTabs.includes(activeTab)) {
      setActiveTab("Products & Modules");
    }
  }

  return (
    <div className="overview">
      <section className="product-card queue-shell">
        <header className="product-head">
          <div><p className="eyebrow">Product Backlog</p><h2>Next in Queue</h2></div>
          <div className="queue-actions">
            <button className="primary small" onClick={addProduct}><i className="ti ti-plus" /> Add Product</button>
            <button className="ghost small csv-icon-button" onClick={exportCsv} title="Download CSV" aria-label="Download CSV">
              <i className="ti ti-arrow-down" />
            </button>
            <label className="ghost small import-csv csv-icon-button" title="Upload CSV" aria-label="Upload CSV">
              <i className="ti ti-arrow-up" />
              <input type="file" accept=".csv,text/csv" onChange={importCsv} />
            </label>
          </div>
        </header>
        <nav className="queue-main-tabs" aria-label="Product development sections">
          {["Product Development", "Module Planning", "Task Calendar"].map((item) => (
            <button key={item} className={pageTab === item ? "on" : ""} onClick={() => selectPageTab(item)}>{item}</button>
          ))}
        </nav>
        {pageTab === "Product Development" && <>
          <div className="queue-health">
            {[
              ["Products", metrics.products],
              ["Modules", metrics.modules],
              ["Features", metrics.features],
              ["Tasks", metrics.tasks],
              ["Completed", metrics.completed],
              ["Pending", metrics.pending],
              ["Blocked", metrics.blocked],
              ["Overdue", metrics.overdue],
              ["Completion", `${metrics.completion}%`],
            ].map(([label, value]) => <article key={label}><span>{label}</span><strong>{value}</strong></article>)}
          </div>
          <QueueRoadmap products={products} onMoveProduct={moveProductToQuarter} onOpenProduct={setRoadmapPanelId} />
        </>}
        {pageTab === "Module Planning" && <>
          <div className="queue-layout">
          <aside className="queue-products">
            {products.map((product, index) => (
              <article
                key={product.id}
                className={selected?.id === product.id ? "queue-product on" : "queue-product"}
                tabIndex={0}
                onClick={() => setSelectedId(product.id)}
                onDoubleClick={() => setEditingCardId(product.id)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) setEditingCardId(null);
                }}
                draggable
                onDragStart={(event) => event.dataTransfer.setData("text/plain", String(index))}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => moveProduct(Number(event.dataTransfer.getData("text/plain")), index)}
              >
                <div className="queue-product-copy">
                  <InlineEdit value={product.productName} onSave={(value) => updateProduct(product.id, { productName: value || "Untitled product" })} />
                  <p><b>Purpose:</b> {product.purpose || "No purpose added yet."}</p>
                  <p><b>Problem:</b> {product.problem}</p>
                </div>
                {editingCardId === product.id ? (
                  <div className="queue-card-editor" onClick={(event) => event.stopPropagation()}>
                    <label>Priority<select value={product.priority} onChange={(event) => updateProduct(product.id, { priority: event.target.value })}>{queuePriorities.map((item) => <option key={item}>{item}</option>)}</select></label>
                    <label>Status<select value={product.status} onChange={(event) => updateProduct(product.id, { status: event.target.value })}>{queueStatuses.map((item) => <option key={item}>{item}</option>)}</select></label>
                    <label>Complexity<select value={product.complexity} onChange={(event) => updateProduct(product.id, { complexity: event.target.value })}>{queueComplexities.map((item) => <option key={item}>{item}</option>)}</select></label>
                    <label>Importance<select value={product.importance} onChange={(event) => updateProduct(product.id, { importance: Number(event.target.value) })}>{[0, 1, 2, 3, 4, 5].map((item) => <option key={item} value={item}>{item} · {stars(item)}</option>)}</select></label>
                    <label>Quarter<input value={product.roadmapQuarter} readOnly /></label>
                  </div>
                ) : (
                  <div className="queue-card-meta">
                    <span className={`priority-pill ${slug(product.priority)}`}>{priorityLabel(product.priority)}</span>
                    <span className={`queue-status ${slug(product.status)}`}>{product.status}</span>
                    <span className={`complexity-pill ${slug(product.complexity)}`}>{product.complexity}</span>
                    <span className="quarter-pill">{product.roadmapQuarter}</span>
                    <small>{stars(product.importance)}</small>
                  </div>
                )}
              </article>
            ))}
          </aside>
          {selected && (
            <section className="queue-detail">
              <div className="queue-detail-head compact">
                <div>
                  <span className="queue-kicker">Selected product</span>
                  <InlineEdit value={selected.productName} onSave={(value) => updateProduct(selected.id, { productName: value || "Untitled product" })} />
                </div>
                <button className="ghost small danger-soft" onClick={() => deleteProduct(selected.id)}>Delete product</button>
              </div>
              <div className="queue-meta">
                <label>Accountable<input value={selected.accountable} onChange={(event) => updateProduct(selected.id, { accountable: event.target.value })} /></label>
                <label>Start Date<input type="date" value={selected.startDate} onChange={(event) => updateProduct(selected.id, { startDate: event.target.value })} /></label>
                <label>End Date<input type="date" value={selected.endDate} onChange={(event) => updateProduct(selected.id, { endDate: event.target.value, roadmapQuarter: quarterFromDate(event.target.value) })} /></label>
                <label>Auto Quarter<input value={selected.roadmapQuarter} readOnly /></label>
              </div>
              <nav className="queue-tabs">
                {queueFeatureTabs.map((item) => <button key={item} className={activeTab === item ? "on" : ""} onClick={() => setActiveTab(item)}>{item}</button>)}
              </nav>
              {activeTab === "Products & Modules" && (
                <div className="queue-features">
                  <div className="queue-viewbar">
                    <button className="primary small" onClick={addModule}><i className="ti ti-plus" /> Add module</button>
                  </div>
                    <div className="queue-list">
                      {selected.modules.map((module, moduleIndex) => (
                        <section
                          className="queue-module"
                          key={module.id}
                          draggable
                          onDragStart={(event) => event.dataTransfer.setData("module-index", String(moduleIndex))}
                          onDragOver={(event) => event.preventDefault()}
                          onDrop={(event) => moveModule(Number(event.dataTransfer.getData("module-index")), moduleIndex)}
                        >
                          <header>
                            <div className="module-fields">
                              <label>Module name<InlineEdit value={module.moduleName} onSave={(value) => updateModule(module.id, { moduleName: value || "Untitled module" })} /></label>
                              <label>Purpose<InlineEdit value={module.modulePurpose} onSave={(value) => updateModule(module.id, { modulePurpose: value })} /></label>
                            </div>
                            <div className="module-actions">
                              <button className="ghost small" onClick={() => addFeature(module.id)}><i className="ti ti-plus" /> Feature</button>
                              <button className="ghost small danger-soft" onClick={() => deleteModule(module.id)}><i className="ti ti-trash" /></button>
                            </div>
                          </header>
                          {module.features.map((feature, featureIndex) => (
                            <article
                              key={feature.id}
                              className={`queue-feature ${feature.status === "Done" ? "done" : ""}`}
                              draggable
                              onDragStart={(event) => event.dataTransfer.setData(`feature-${module.id}`, String(featureIndex))}
                              onDragOver={(event) => event.preventDefault()}
                              onDrop={(event) => moveFeature(module.id, Number(event.dataTransfer.getData(`feature-${module.id}`)), featureIndex)}
                            >
                              <div className="feature-main">
                                <div className="feature-title-row">
                                  <InlineEdit value={feature.featureName} onSave={(value) => updateFeature(module.id, feature.id, { featureName: value || "Untitled feature" })} />
                                  <span className={`queue-status ${slug(feature.status)}`}>{feature.status}</span>
                                </div>
                                <div className="feature-fields">
                                  <label>Priority<select value={feature.priority} onChange={(event) => updateFeature(module.id, feature.id, { priority: event.target.value })}>{queuePriorities.map((item) => <option key={item}>{item}</option>)}</select></label>
                                  <label>Complexity<select value={feature.complexity} onChange={(event) => updateFeature(module.id, feature.id, { complexity: event.target.value })}>{queueComplexities.map((item) => <option key={item}>{item}</option>)}</select></label>
                                  <label>Status<select value={feature.status} onChange={(event) => updateFeature(module.id, feature.id, { status: event.target.value, checked: event.target.value === "Done", doneDate: event.target.value === "Done" ? todayIso() : "" })}>{queueStatuses.map((item) => <option key={item}>{item}</option>)}</select></label>
                                  <label>Accountable<input value={feature.accountable} onChange={(event) => updateFeature(module.id, feature.id, { accountable: event.target.value })} /></label>
                                  <label>Due Date<input type="date" value={feature.dueDate} onChange={(event) => updateFeature(module.id, feature.id, { dueDate: event.target.value })} /></label>
                                  <label>Progress %<input type="number" min="0" max="100" value={feature.progress} onChange={(event) => updateFeature(module.id, feature.id, { progress: Number(event.target.value) })} /></label>
                                </div>
                                <button className="ghost small" onClick={() => updateFeature(module.id, feature.id, { expanded: !feature.expanded })}>{feature.expanded ? "Hide tasks" : "Show tasks"}</button>
                                {feature.expanded && (
                                  <div className="task-list">
                                    <button className="ghost small" onClick={() => addTask(module.id, feature.id)}>Add task</button>
                                    {feature.tasks.map((task, taskIndex) => (
                                      <article
                                        className={task.checked ? "task-row done" : "task-row"}
                                        key={task.id}
                                        draggable
                                        onDragStart={(event) => event.dataTransfer.setData(`task-${feature.id}`, String(taskIndex))}
                                        onDragOver={(event) => event.preventDefault()}
                                        onDrop={(event) => moveTask(module.id, feature.id, Number(event.dataTransfer.getData(`task-${feature.id}`)), taskIndex)}
                                      >
                                        <button className={task.checked ? "feature-check checked" : "feature-check"} onClick={() => toggleTask(module.id, feature.id, task)}>{task.checked ? <i className="ti ti-check" /> : ""}</button>
                                        <div>
                                          <InlineEdit value={task.taskName} onSave={(value) => updateTask(module.id, feature.id, task.id, { taskName: value || "Untitled task" })} />
                                          <p><b>Purpose:</b> <InlineEdit value={task.taskPurpose} onSave={(value) => updateTask(module.id, feature.id, task.id, { taskPurpose: value })} /></p>
                                          <small>{task.completedOn ? `Completed On: ${task.completedOn}` : task.completionHistory?.length ? `Last completed on: ${task.completionHistory.at(-1)}` : "Pending"}</small>
                                        </div>
                                        <div className="task-fields">
                                          <input placeholder="Accountable" value={task.accountable} onChange={(event) => updateTask(module.id, feature.id, task.id, { accountable: event.target.value })} />
                                          <select value={task.priority} onChange={(event) => updateTask(module.id, feature.id, task.id, { priority: event.target.value })}>{queuePriorities.map((item) => <option key={item}>{item}</option>)}</select>
                                          <select value={task.status} onChange={(event) => updateTask(module.id, feature.id, task.id, { status: event.target.value, checked: event.target.value === "Done", completedOn: event.target.value === "Done" ? todayDisplay() : "" })}>{queueStatuses.map((item) => <option key={item}>{item}</option>)}</select>
                                          <input type="date" value={task.dueDate} onChange={(event) => updateTask(module.id, feature.id, task.id, { dueDate: event.target.value })} />
                                          <button className="ghost small danger-soft" onClick={() => deleteTask(module.id, feature.id, task.id)}>Delete</button>
                                        </div>
                                      </article>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <button className="ghost small danger-soft" onClick={() => deleteFeature(module.id, feature.id)}>Delete feature</button>
                            </article>
                          ))}
                        </section>
                      ))}
                    </div>
                </div>
              )}
              {activeTab === "Notes" && (
                <textarea className="queue-textarea" value={selected.notes} onChange={(event) => updateProduct(selected.id, { notes: event.target.value })} placeholder="Notes for founder, product and design decisions." />
              )}
              {activeTab === "Developer Checklist" && (
                <textarea className="queue-textarea" value={selected.developerChecklist} onChange={(event) => updateProduct(selected.id, { developerChecklist: event.target.value })} placeholder="Developer checklist, one item per line." />
              )}
            </section>
          )}
          </div>
        </>}
        {pageTab === "Task Calendar" && <QueueCalendar products={products} />}
        <ProductRoadmapPanel
          product={roadmapPanelProduct}
          onClose={() => setRoadmapPanelId(null)}
          onUpdate={(patch) => updateProduct(roadmapPanelProduct.id, patch)}
          onDelete={() => deleteProduct(roadmapPanelProduct.id)}
        />
      </section>
    </div>
  );
}

function Plans() {
  return (
    <div className="overview">
      <section className="business-card">
        <header className="product-head">
          <div><p className="eyebrow">Plan Catalogue</p><h2>Plans to assign during tenant creation</h2></div>
          <button className="primary small"><i className="ti ti-plus" /> New Plan</button>
        </header>
        <div className="plan-grid">
          {data.businessGrowth.plans.map((plan) => (
            <article className="plan-card" key={plan.name}>
              <div className="plan-top"><h3>{plan.name}</h3><span>{plan.status}</span></div>
              <strong>{plan.price}</strong>
              <p>{plan.billing} · {plan.tenantLimit} · {plan.userLimit}</p>
              <div>{plan.modules.map((module) => <small key={module}>{module}</small>)}</div>
              <button>Edit plan</button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Subscriptions({ subscriptions, setSubscriptions }) {
  const statuses = ["Active", "Trial", "Expired", "Cancelled"];
  const [draft, setDraft] = useState({ tenant: "", owner: "", plan: "Professional", coupon: "WELCOME10", billing: "Monthly", status: "Trial" });
  const preview = calculatePrice(draft.plan, draft.coupon);

  function createTenant() {
    if (!draft.tenant.trim() || !preview.ok) return;
    setSubscriptions([
      {
        tenant: draft.tenant.trim(),
        owner: draft.owner.trim() || "Tenant Owner",
        plan: draft.plan,
        status: draft.status,
        coupon: preview.couponCode || "None",
        billing: draft.billing,
        finalPrice: preview.finalLabel,
        renewal: draft.status === "Trial" ? "14-day trial" : "Next cycle",
      },
      ...subscriptions,
    ]);
    setDraft({ tenant: "", owner: "", plan: "Professional", coupon: "", billing: "Monthly", status: "Trial" });
  }

  return (
    <div className="overview">
      <div className="kpis subscription-kpis">
        {statuses.map((status) => {
          const count = subscriptions.filter((item) => item.status === status).length;
          return <section className="kpi" key={status}><span>{status}</span><strong>{count}</strong></section>;
        })}
      </div>
      <section className="business-card">
        <header className="product-head">
          <div><p className="eyebrow">Tenant Subscriptions</p><h2>Subscriptions embedded to tenants</h2></div>
          <button className="primary small"><i className="ti ti-plus" /> Create Tenant</button>
        </header>
        <DataTable
          columns={["Tenant", "Owner", "Plan", "Status", "Coupon", "Billing", "Final Price", "Renewal"]}
          rows={subscriptions.map((item) => [item.tenant, item.owner, item.plan, item.status, item.coupon, item.billing, item.finalPrice, item.renewal])}
        />
      </section>
      <section className="business-card flow-card">
        <div><p className="eyebrow">During Tenant Creation</p><h2>Create Tenant · Select Plan · Apply Coupon · Final Price</h2></div>
        <div className="flow-row">
          <input placeholder="Tenant name" value={draft.tenant} onChange={(event) => setDraft({ ...draft, tenant: event.target.value })} />
          <input placeholder="Owner name" value={draft.owner} onChange={(event) => setDraft({ ...draft, owner: event.target.value })} />
          <select value={draft.plan} onChange={(event) => setDraft({ ...draft, plan: event.target.value })}>{planNames.map((plan) => <option key={plan}>{plan}</option>)}</select>
          <input placeholder="Coupon code" value={draft.coupon} onChange={(event) => setDraft({ ...draft, coupon: event.target.value.toUpperCase() })} />
          <select value={draft.billing} onChange={(event) => setDraft({ ...draft, billing: event.target.value })}><option>Monthly</option><option>Annual</option><option>Contract</option></select>
          <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value })}>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
          <button className="primary small" onClick={createTenant}>Create tenant</button>
        </div>
        <PricePreview preview={preview} />
      </section>
    </div>
  );
}

function Coupons({ subscriptions, setSubscriptions }) {
  const emptyCoupon = {
    name: "",
    code: "",
    discountType: "Percentage",
    percentage: "10%",
    fixedAmount: "-",
    startDate: "2026-06-10",
    endDate: "2026-12-31",
    usageLimit: 100,
    tenantLimit: "1 per tenant",
    planRestriction: "Starter, Professional",
    status: "Active",
  };
  const [coupons, setCoupons] = useState(loadCoupons);
  const [form, setForm] = useState(emptyCoupon);
  const [editing, setEditing] = useState(null);
  const [graphMetric, setGraphMetric] = useState("Used Count");
  const [upgrade, setUpgrade] = useState({ tenant: subscriptions[0]?.tenant || "", plan: "Business", coupon: "ANNUAL20" });
  const selected = subscriptions.find((item) => item.tenant === upgrade.tenant) || subscriptions[0];
  const preview = calculatePriceFromCoupons(upgrade.plan, upgrade.coupon, coupons);
  const couponRows = coupons.map((coupon) => {
    const used = subscriptions.filter((item) => item.coupon === coupon.code).length;
    const limit = Number(coupon.usageLimit || 0);
    return { ...coupon, used, remaining: limit ? Math.max(0, limit - used) : "-" };
  });
  const graphMax = Math.max(1, ...couponRows.map((coupon) => graphMetric === "Used Count" ? coupon.used : graphMetric === "Usage Limit" ? Number(coupon.usageLimit || 0) : Number(coupon.remaining || 0)));

  function persist(next) {
    setCoupons(next);
    localStorage.setItem("archscale-coupons", JSON.stringify(next));
  }

  function saveCoupon() {
    if (!form.name.trim() || !form.code.trim()) return;
    const nextCoupon = {
      ...form,
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      percentage: form.discountType === "Percentage" ? form.percentage : "-",
      fixedAmount: form.discountType === "Fixed Amount" ? form.fixedAmount : "-",
      usageLimit: Number(form.usageLimit || 0),
    };
    const next = editing === null ? [nextCoupon, ...coupons] : coupons.map((coupon, index) => index === editing ? nextCoupon : coupon);
    persist(next);
    setForm(emptyCoupon);
    setEditing(null);
  }

  function editCoupon(index) {
    setForm(coupons[index]);
    setEditing(index);
  }

  function deleteCoupon(index) {
    persist(coupons.filter((_, itemIndex) => itemIndex !== index));
    if (editing === index) {
      setForm(emptyCoupon);
      setEditing(null);
    }
  }

  function applyUpgrade() {
    if (!selected || !preview.ok) return;
    setSubscriptions(subscriptions.map((item) => item.tenant === selected.tenant ? {
      ...item,
      plan: upgrade.plan,
      status: "Active",
      coupon: preview.couponCode || "None",
      finalPrice: preview.finalLabel,
      renewal: "Next cycle",
    } : item));
  }

  return (
    <div className="overview">
      <section className="business-card flow-card">
        <header className="product-head">
          <div><p className="eyebrow">Coupons & Discounts</p><h2>{editing === null ? "Create coupon" : "Edit coupon"}</h2></div>
          <button className="primary small" onClick={saveCoupon}><i className="ti ti-plus" /> {editing === null ? "Save coupon" : "Save changes"}</button>
        </header>
        <div className="flow-row coupon-form">
          <input placeholder="Coupon Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <input placeholder="Coupon Code" value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value.toUpperCase() })} />
          <select value={form.discountType} onChange={(event) => setForm({ ...form, discountType: event.target.value })}><option>Percentage</option><option>Fixed Amount</option></select>
          <input placeholder="Percentage" value={form.percentage} onChange={(event) => setForm({ ...form, percentage: event.target.value })} />
          <input placeholder="Fixed Amount" value={form.fixedAmount} onChange={(event) => setForm({ ...form, fixedAmount: event.target.value })} />
          <input type="date" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} />
          <input type="date" value={form.endDate} onChange={(event) => setForm({ ...form, endDate: event.target.value })} />
          <input type="number" placeholder="Usage Limit" value={form.usageLimit} onChange={(event) => setForm({ ...form, usageLimit: event.target.value })} />
          <input placeholder="Tenant Limit" value={form.tenantLimit} onChange={(event) => setForm({ ...form, tenantLimit: event.target.value })} />
          <input placeholder="Plan Restriction" value={form.planRestriction} onChange={(event) => setForm({ ...form, planRestriction: event.target.value })} />
          <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option>Active</option><option>Limited</option><option>Paused</option><option>Expired</option><option>Draft</option></select>
          {editing !== null && <button className="ghost small" onClick={() => { setForm(emptyCoupon); setEditing(null); }}>Cancel edit</button>}
        </div>
      </section>
      <div className="coupon-layout">
        <section className="business-card table-card coupon-register">
          <header className="product-head">
            <div><p className="eyebrow">Coupon Register</p><h2>Editable offer rules and usage</h2></div>
          </header>
          <div className="table-wrap">
            <table>
              <thead><tr>{["Coupon Name", "Coupon Code", "Discount", "Start Date", "End Date", "Used", "Usage Limit", "Remaining", "Tenant Limit", "Plan Restriction", "Status", "Actions"].map((column) => <th key={column}>{column}</th>)}</tr></thead>
              <tbody>
                {couponRows.map((coupon, index) => (
                  <tr key={coupon.code}>
                    <td><strong>{coupon.name}</strong></td>
                    <td>{coupon.code}</td>
                    <td>{coupon.discountType === "Percentage" ? coupon.percentage : coupon.fixedAmount}</td>
                    <td>{coupon.startDate}</td>
                    <td>{coupon.endDate}</td>
                    <td><strong>{coupon.used}</strong></td>
                    <td>{coupon.usageLimit}</td>
                    <td>{coupon.remaining}</td>
                    <td>{coupon.tenantLimit}</td>
                    <td>{coupon.planRestriction}</td>
                    <td><span className={`status-dot ${["Active", "Limited"].includes(coupon.status) ? "good" : coupon.status === "Draft" ? "neutral" : "attention"}`}>{coupon.status}</span></td>
                    <td><div className="row-actions"><button onClick={() => editCoupon(index)}>Edit</button><button onClick={() => deleteCoupon(index)}>Delete</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="business-card coupon-graph-card">
          <header className="product-head">
            <div><p className="eyebrow">Graph Builder</p><h2>Coupon analytics</h2></div>
            <select value={graphMetric} onChange={(event) => setGraphMetric(event.target.value)}><option>Used Count</option><option>Usage Limit</option><option>Remaining</option></select>
          </header>
          <div className="coupon-chart">
            {couponRows.map((coupon) => {
              const value = graphMetric === "Used Count" ? coupon.used : graphMetric === "Usage Limit" ? Number(coupon.usageLimit || 0) : Number(coupon.remaining || 0);
              return (
                <article key={`${coupon.code}-${graphMetric}`}>
                  <span>{coupon.code}</span>
                  <div><b style={{ width: `${Math.max(3, (value / graphMax) * 100)}%` }} /></div>
                  <strong>{value}</strong>
                </article>
              );
            })}
          </div>
        </section>
      </div>
      <section className="business-card flow-card">
        <div><p className="eyebrow">Subscription Page</p><h2>Coupon Code · Apply · Preview Savings · Upgrade Plan</h2></div>
        <div className="flow-row">
          <select value={upgrade.tenant} onChange={(event) => setUpgrade({ ...upgrade, tenant: event.target.value })}>{subscriptions.map((item) => <option key={item.tenant}>{item.tenant}</option>)}</select>
          <select value={upgrade.plan} onChange={(event) => setUpgrade({ ...upgrade, plan: event.target.value })}>{planNames.map((plan) => <option key={plan}>{plan}</option>)}</select>
          <input placeholder="Coupon code" value={upgrade.coupon} onChange={(event) => setUpgrade({ ...upgrade, coupon: event.target.value.toUpperCase() })} />
          <button className="primary small" onClick={applyUpgrade}>Apply upgrade</button>
        </div>
        <div className="selected-subscription">
          <span>Current subscription</span>
          <strong>{selected ? `${selected.tenant} · ${selected.plan} · ${selected.status}` : "No subscription selected"}</strong>
        </div>
        <PricePreview preview={preview} />
      </section>
    </div>
  );
}

function PricePreview({ preview }) {
  return (
    <div>
      <div className="price-preview">
        <div className="price-box"><span>Base price</span><strong>{preview.baseLabel}</strong></div>
        <div className="price-box"><span>Discount</span><strong>{preview.discountLabel}</strong></div>
        <div className="price-box"><span>Final price</span><strong>{preview.finalLabel}</strong></div>
      </div>
      <p className={preview.ok ? "flow-message ok" : "flow-message warn"}>{preview.message}</p>
    </div>
  );
}

function Promotions() {
  const [promotions, setPromotions] = useState(data.businessGrowth.promotions);
  const [form, setForm] = useState({ name: "", audience: "", coupon: "WELCOME10", plan: "Professional", channel: "In-app", status: "Draft" });

  function addPromotion() {
    if (!form.name.trim()) return;
    setPromotions([
      {
        ...form,
        name: form.name.trim(),
        audience: form.audience.trim() || "Target tenant segment",
        starts: "Today",
        ends: "Open",
        owner: "Growth",
      },
      ...promotions,
    ]);
    setForm({ name: "", audience: "", coupon: "WELCOME10", plan: "Professional", channel: "In-app", status: "Draft" });
  }

  return (
    <div className="overview">
      <section className="business-card flow-card">
        <header className="product-head">
          <div><p className="eyebrow">Campaign Builder</p><h2>Create a growth promotion</h2></div>
          <button className="primary small" onClick={addPromotion}><i className="ti ti-plus" /> Add promotion</button>
        </header>
        <div className="flow-row">
          <input placeholder="Promotion name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <input placeholder="Audience" value={form.audience} onChange={(event) => setForm({ ...form, audience: event.target.value })} />
          <select value={form.coupon} onChange={(event) => setForm({ ...form, coupon: event.target.value })}>{data.businessGrowth.coupons.map((coupon) => <option key={coupon.code}>{coupon.code}</option>)}</select>
          <select value={form.plan} onChange={(event) => setForm({ ...form, plan: event.target.value })}>{planNames.map((plan) => <option key={plan}>{plan}</option>)}</select>
          <select value={form.channel} onChange={(event) => setForm({ ...form, channel: event.target.value })}><option>In-app</option><option>Website demo</option><option>Sales follow-up</option><option>Email campaign</option></select>
          <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option>Draft</option><option>Live</option><option>Paused</option></select>
        </div>
      </section>
      <section className="business-card">
        <p className="eyebrow">Promotion Register</p>
        <h2>Campaigns mapped to coupons and plans</h2>
        <DataTable
          columns={["Promotion", "Audience", "Coupon", "Plan", "Channel", "Status", "Starts", "Ends", "Owner"]}
          rows={promotions.map((item) => [item.name, item.audience, item.coupon, item.plan, item.channel, item.status, item.starts, item.ends, item.owner])}
        />
      </section>
    </div>
  );
}

function GrowthPrograms() {
  return (
    <div className="overview">
      <div className="program-grid">
        {data.businessGrowth.growthPrograms.map((program) => (
          <article className="program-card" key={program.type}>
            <span>{program.type}</span>
            <h2>{program.name}</h2>
            <p>{program.incentive}</p>
            <div className="program-metrics">
              <strong>{program.participants}</strong>
              <small>participants</small>
              <strong>{program.pipeline}</strong>
              <small>pipeline</small>
            </div>
            <em>{program.status}</em>
          </article>
        ))}
      </div>
      <section className="business-card">
        <p className="eyebrow">Program Sequencing</p>
        <h2>Where these sit in Business & Growth</h2>
        <p className="soft-copy">Referral, partner and affiliate programs are growth motions. They should use plans, coupons and tenant conversion data, while Finance later records commissions, payouts, invoices and tax impact.</p>
      </section>
    </div>
  );
}

function TrialAnalytics() {
  const totalTrials = data.businessGrowth.trialAnalytics.reduce((sum, row) => sum + row.trials, 0);
  const totalActivated = data.businessGrowth.trialAnalytics.reduce((sum, row) => sum + row.activated, 0);
  return (
    <div className="overview">
      <div className="kpis">
        <section className="kpi"><span>Total trials</span><strong>{totalTrials}</strong></section>
        <section className="kpi"><span>Activated</span><strong>{totalActivated}</strong></section>
        <section className="kpi"><span>Activation rate</span><strong>{Math.round((totalActivated / totalTrials) * 100)}%</strong></section>
        <section className="kpi"><span>Demo bookings</span><strong>{data.businessGrowth.trialAnalytics.reduce((sum, row) => sum + row.demoBooked, 0)}</strong></section>
      </div>
      <section className="business-card">
        <p className="eyebrow">Trial Cohorts</p>
        <h2>Activation signals and expiry risk</h2>
        <DataTable columns={["Cohort", "Trials", "Activated", "Demo Booked", "Expires", "Risk"]} rows={data.businessGrowth.trialAnalytics.map((row) => [row.cohort, row.trials, row.activated, row.demoBooked, row.expires, row.risk])} />
      </section>
    </div>
  );
}

function TenantConversions() {
  return (
    <div className="overview">
      <section className="business-card">
        <p className="eyebrow">Conversion Pipeline</p>
        <h2>Trial-to-paid and upgrade movement</h2>
        <DataTable columns={["Tenant", "From", "To", "Coupon", "Value", "Stage", "Owner"]} rows={data.businessGrowth.tenantConversions.map((row) => [row.tenant, row.from, row.to, row.coupon, row.value, row.stage, row.owner])} />
      </section>
      <div className="action-grid">
        {data.businessGrowth.tenantConversions.map((row) => (
          <article className="action-card" key={row.tenant}>
            <span>{row.stage}</span>
            <h2>{row.tenant}</h2>
            <p>{row.from} to {row.to} with {row.coupon}</p>
            <strong>{row.value}</strong>
          </article>
        ))}
      </div>
    </div>
  );
}

function ChurnAnalytics() {
  const highRisk = data.businessGrowth.churnAnalytics.filter((row) => row.risk === "High").length;
  return (
    <div className="overview">
      <div className="kpis">
        <section className="kpi"><span>At-risk tenants</span><strong>{data.businessGrowth.churnAnalytics.length}</strong></section>
        <section className="kpi"><span>High risk</span><strong>{highRisk}</strong></section>
        <section className="kpi"><span>Retention actions</span><strong>{data.businessGrowth.churnAnalytics.length}</strong></section>
        <section className="kpi"><span>Primary lever</span><strong>Offer</strong></section>
      </div>
      <section className="business-card">
        <p className="eyebrow">Retention Queue</p>
        <h2>Churn reason and next action</h2>
        <DataTable columns={["Tenant", "Plan", "Risk", "Reason", "Action", "Owner"]} rows={data.businessGrowth.churnAnalytics.map((row) => [row.tenant, row.plan, row.risk, row.reason, row.action, row.owner])} />
      </section>
    </div>
  );
}

function FinanceOverview() {
  const wallets = walletSummary();
  return (
    <div className="overview">
      <div className="kpis">
        {data.finance.summary.map((item) => (
          <section className="kpi" key={item.label}><span>{item.label}</span><strong>{item.value}</strong><small>{item.delta}</small></section>
        ))}
      </div>
      <div className="kpis">
        <section className="kpi"><span>Total wallets recharged</span><strong>{formatRs(wallets.totalRecharged)}</strong><small>Lifetime client wallet top-ups</small></section>
        <section className="kpi"><span>Last wallet charged</span><strong>{formatRs(wallets.lastRecharge?.walletLastRechargeAmount || 0)}</strong><small>{wallets.lastRecharge?.name} · {wallets.lastRecharge?.walletLastRechargeDate}</small></section>
        <section className="kpi"><span>Current wallet balances</span><strong>{formatRs(wallets.totalBalance)}</strong><small>Across client accounts</small></section>
        <section className="kpi"><span>Wallet accounts</span><strong>{data.tenants.length}</strong><small>Tenant-linked balances</small></section>
      </div>
      <section className="business-card">
        <p className="eyebrow">Accounting Boundary</p>
        <h2>Finance is the ledger view</h2>
        <p className="soft-copy">Business & Growth decides offers, trials, coupons and conversion actions. Finance records the money movement: invoices, collections, taxes, refunds, credits and expenses.</p>
      </section>
      <div className="action-grid">
        {[
          ["Collections", "Expected, collected and failed payments", "o-collections"],
          ["Invoices", "Amounts billed by tenant and plan", "o-invoices"],
          ["Refunds & credits", "Approved and pending adjustments", "o-refunds"],
        ].map(([title, copy, ref]) => <article className="action-card" key={ref}><span>Finance module</span><h2>{title}</h2><p>{copy}</p><strong>Ready</strong></article>)}
      </div>
    </div>
  );
}

function Collections() {
  const collected = data.finance.collections.filter((item) => item.status === "Collected").length;
  const attention = data.finance.collections.filter((item) => ["Overdue", "Failed"].includes(item.status)).length;
  return (
    <div className="overview">
      <div className="kpis">
        <section className="kpi"><span>Collection records</span><strong>{data.finance.collections.length}</strong></section>
        <section className="kpi"><span>Collected</span><strong>{collected}</strong></section>
        <section className="kpi"><span>Needs follow-up</span><strong>{attention}</strong></section>
        <section className="kpi"><span>Owner</span><strong>Finance</strong></section>
      </div>
      <section className="business-card">
        <p className="eyebrow">Collection Queue</p>
        <h2>Payment status by tenant</h2>
        <DataTable columns={["Tenant", "Invoice", "Amount", "Status", "Method", "Due Date", "Owner"]} rows={data.finance.collections.map((row) => [row.tenant, row.invoice, row.amount, row.status, row.method, row.dueDate, row.owner])} />
      </section>
    </div>
  );
}

function Invoices() {
  const [invoices, setInvoices] = useState(data.finance.invoices);
  const [invoiceProfile, setInvoiceProfile] = useState(loadInvoiceProfile);
  const [draft, setDraft] = useState(null);
  const [publishStatus, setPublishStatus] = useState(null);
  const [profileStatus, setProfileStatus] = useState("");

  function nextInvoiceNumber() {
    const max = invoices.reduce((highest, item) => Math.max(highest, Number(String(item.invoice).replace(/[^\d]/g, "")) || 0), 1032);
    return `INV-${max + 1}`;
  }

  function invoiceToDraft(invoice) {
    const subtotal = priceToNumber(invoice.subtotal) || 0;
    return {
      invoice: invoice.invoice,
      tenant: invoice.tenant,
      billToAddress: "Tenant billing address",
      clientContact: "",
      clientEmail: "",
      clientPhone: "",
      clientGst: "",
      clientState: "",
      clientStateCode: "",
      placeOfSupply: invoice.tenant === "Nava Design Co" ? "Delhi" : "",
      paymentRef: "",
      subscriptionRef: invoice.plan,
      adjustmentRef: "",
      hsnSac: "998313",
      gstRate: 18,
      locked: true,
      plan: invoice.plan,
      issueDate: "2026-06-10",
      dueDate: invoice.dueDate,
      status: invoice.status,
      lineDescription: `${invoice.plan} subscription`,
      quantity: 1,
      rate: subtotal,
      notes: "Thank you for choosing ArchScale Guild.",
    };
  }

  function newDraft() {
    setPublishStatus(null);
    setDraft({
      invoice: nextInvoiceNumber(),
      tenant: "",
      billToAddress: "",
      clientContact: "",
      clientEmail: "",
      clientPhone: "",
      clientGst: "",
      clientState: "",
      clientStateCode: "",
      placeOfSupply: "Delhi",
      paymentRef: "",
      subscriptionRef: "",
      adjustmentRef: "",
      hsnSac: "998313",
      gstRate: 18,
      locked: false,
      plan: "Professional",
      issueDate: "2026-06-10",
      dueDate: "2026-06-30",
      status: "Draft",
      lineDescription: "Professional subscription",
      quantity: 1,
      rate: 7999,
      notes: "Thank you for choosing ArchScale Guild.",
    });
  }

  function publishInvoice() {
    if (!draft?.tenant.trim()) {
      setPublishStatus({ type: "warn", message: "Add the tenant name before publishing this invoice." });
      return;
    }
    const subtotal = Number(draft.quantity || 0) * Number(draft.rate || 0);
    if (!subtotal) {
      setPublishStatus({ type: "warn", message: "Add a valid quantity and rate before publishing this invoice." });
      return;
    }
    const gst = calculateGst(subtotal, draft.gstRate, invoiceProfile.state, draft.placeOfSupply);
    const status = draft.status === "Draft" ? "Pending" : draft.status;
    const published = {
      invoice: draft.invoice,
      tenant: draft.tenant.trim(),
      plan: draft.plan,
      subtotal: formatRs(subtotal),
      tax: formatRs(gst.tax),
      total: formatRs(subtotal + gst.tax),
      status,
      dueDate: draft.dueDate,
    };
    setInvoices(invoices.some((item) => item.invoice === published.invoice)
      ? invoices.map((item) => item.invoice === published.invoice ? published : item)
      : [published, ...invoices]);
    setDraft({ ...draft, status, locked: true });
    setPublishStatus({ type: "ok", message: `${published.invoice} published and recorded in Tenant billing records.` });
  }

  function saveInvoiceProfile() {
    localStorage.setItem("archscale-invoice-profile", JSON.stringify(invoiceProfile));
    setProfileStatus("ArchScale Guild invoice details saved for all future invoices on this device.");
  }

  return (
    <div className="overview">
      <InvoiceProfileSettings profile={invoiceProfile} setProfile={setInvoiceProfile} onSave={saveInvoiceProfile} status={profileStatus} />
      <section className="business-card">
        <header className="product-head">
          <div><p className="eyebrow">Invoice Register</p><h2>Tenant billing records</h2></div>
          <button className="primary small" onClick={newDraft}><i className="ti ti-plus" /> Add invoice</button>
        </header>
        <div className="table-wrap">
          <table>
            <thead><tr>{["Invoice", "Tenant", "Plan", "Subtotal", "Tax", "Total", "Status", "Due Date"].map((column) => <th key={column}>{column}</th>)}</tr></thead>
            <tbody>
              {invoices.map((row) => (
                <tr key={row.invoice}>
                  <td><button className="invoice-link" onClick={() => { setPublishStatus(null); setDraft(invoiceToDraft(row)); }}>{row.invoice} <i className="ti ti-file-invoice" /></button></td>
                  <td>{row.tenant}</td>
                  <td>{row.plan}</td>
                  <td>{row.subtotal}</td>
                  <td>{row.tax}</td>
                  <td>{row.total}</td>
                  <td>{row.status}</td>
                  <td>{row.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {draft && <InvoiceEditor draft={draft} setDraft={setDraft} invoiceProfile={invoiceProfile} publishStatus={publishStatus} onPublish={publishInvoice} onClose={() => { setDraft(null); setPublishStatus(null); }} />}
    </div>
  );
}

function InvoiceProfileSettings({ profile, setProfile, onSave, status }) {
  return (
    <section className="business-card flow-card">
      <header className="product-head">
        <div><p className="eyebrow">Invoice Identity</p><h2>ArchScale Guild billing profile</h2></div>
        <button className="primary small" onClick={onSave}>Save for future invoices</button>
      </header>
      <div className="flow-row">
        <input placeholder="Business name" value={profile.brandName} onChange={(event) => setProfile({ ...profile, brandName: event.target.value })} />
        <input placeholder="Login / account ID" value={profile.login || ""} onChange={(event) => setProfile({ ...profile, login: event.target.value })} />
        <input placeholder="Contact name" value={profile.contact || ""} onChange={(event) => setProfile({ ...profile, contact: event.target.value })} />
        <input placeholder="Login / billing email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} />
        <input placeholder="Phone number" value={profile.phone || ""} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} />
        <input placeholder="GST / tax ID" value={profile.taxId} onChange={(event) => setProfile({ ...profile, taxId: event.target.value })} />
        <input placeholder="Seller state" value={profile.state || ""} onChange={(event) => setProfile({ ...profile, state: event.target.value })} />
        <input placeholder="State code" value={profile.stateCode || ""} onChange={(event) => setProfile({ ...profile, stateCode: event.target.value })} />
      </div>
      <textarea className="wide-textarea" placeholder="Business address" value={profile.address} onChange={(event) => setProfile({ ...profile, address: event.target.value })} />
      <p className="soft-copy">This is saved once in this browser and used on every invoice generated from here. Production save across users/devices will need backend storage.</p>
      {status && <p className="flow-message ok">{status}</p>}
    </section>
  );
}

function InvoiceEditor({ draft, setDraft, invoiceProfile, publishStatus, onPublish, onClose }) {
  const subtotal = Number(draft.quantity || 0) * Number(draft.rate || 0);
  const gst = calculateGst(subtotal, draft.gstRate, invoiceProfile.state, draft.placeOfSupply);
  const invoice = { ...draft, subtotal, ...gst, total: subtotal + gst.tax, sellerState: invoiceProfile.state, sellerStateCode: invoiceProfile.stateCode };
  const locked = draft.locked;

  return (
    <section className="invoice-workspace">
      <div className="invoice-editor">
        <header><div><p className="eyebrow">Invoice Editor</p><h2>{draft.invoice}</h2></div><button className="ghost small" onClick={onClose}>Close</button></header>
        {locked && <p className="flow-message warn">This invoice is published and locked. Use a credit note, debit note, refund record or revised invoice for corrections.</p>}
        <label>Tenant<input disabled={locked} value={draft.tenant} onChange={(event) => setDraft({ ...draft, tenant: event.target.value })} placeholder="Tenant name" /></label>
        <label>Bill to address<textarea disabled={locked} value={draft.billToAddress} onChange={(event) => setDraft({ ...draft, billToAddress: event.target.value })} placeholder="Tenant billing address" /></label>
        <p className="eyebrow invoice-subhead">Client invoice details</p>
        <div className="invoice-fields">
          <label>Contact person<input disabled={locked} value={draft.clientContact} onChange={(event) => setDraft({ ...draft, clientContact: event.target.value })} placeholder="Accounts contact" /></label>
          <label>GSTIN<input disabled={locked} value={draft.clientGst} onChange={(event) => setDraft({ ...draft, clientGst: event.target.value })} placeholder="Client GSTIN" /></label>
          <label>Email<input disabled={locked} value={draft.clientEmail} onChange={(event) => setDraft({ ...draft, clientEmail: event.target.value })} placeholder="billing@client.com" /></label>
          <label>Phone<input disabled={locked} value={draft.clientPhone} onChange={(event) => setDraft({ ...draft, clientPhone: event.target.value })} placeholder="+91..." /></label>
          <label>Client state<input disabled={locked} value={draft.clientState} onChange={(event) => setDraft({ ...draft, clientState: event.target.value })} placeholder="Delhi" /></label>
          <label>Client state code<input disabled={locked} value={draft.clientStateCode} onChange={(event) => setDraft({ ...draft, clientStateCode: event.target.value })} placeholder="07" /></label>
          <label>Place of supply<input disabled={locked} value={draft.placeOfSupply} onChange={(event) => setDraft({ ...draft, placeOfSupply: event.target.value })} placeholder="Delhi" /></label>
          <label>Payment reference<input disabled={locked} value={draft.paymentRef} onChange={(event) => setDraft({ ...draft, paymentRef: event.target.value })} placeholder="Gateway / UTR" /></label>
        </div>
        <p className="soft-copy client-link-note">Client-fill link: form is ready here, but an external link needs backend storage and auth before clients can fill it outside this local app.</p>
        <div className="invoice-fields">
          <label>Plan<select disabled={locked} value={draft.plan} onChange={(event) => setDraft({ ...draft, plan: event.target.value })}>{planNames.map((plan) => <option key={plan}>{plan}</option>)}</select></label>
          <label>Status<select disabled={locked} value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value })}><option>Draft</option><option>Pending</option><option>Paid</option><option>Overdue</option><option>Void</option></select></label>
          <label>Issue date<input disabled={locked} type="date" value={draft.issueDate} onChange={(event) => setDraft({ ...draft, issueDate: event.target.value })} /></label>
          <label>Due date<input disabled={locked} type="date" value={draft.dueDate} onChange={(event) => setDraft({ ...draft, dueDate: event.target.value })} /></label>
          <label>Subscription ref<input disabled={locked} value={draft.subscriptionRef} onChange={(event) => setDraft({ ...draft, subscriptionRef: event.target.value })} placeholder="Subscription ID" /></label>
          <label>Credit/refund ref<input disabled={locked} value={draft.adjustmentRef} onChange={(event) => setDraft({ ...draft, adjustmentRef: event.target.value })} placeholder="Optional" /></label>
        </div>
        <label>Line item<input disabled={locked} value={draft.lineDescription} onChange={(event) => setDraft({ ...draft, lineDescription: event.target.value })} /></label>
        <div className="invoice-fields">
          <label>HSN/SAC code<input disabled={locked} value={draft.hsnSac} onChange={(event) => setDraft({ ...draft, hsnSac: event.target.value })} /></label>
          <label>GST rate %<input disabled={locked} type="number" min="0" value={draft.gstRate} onChange={(event) => setDraft({ ...draft, gstRate: event.target.value })} /></label>
          <label>Quantity<input disabled={locked} type="number" min="1" value={draft.quantity} onChange={(event) => setDraft({ ...draft, quantity: event.target.value })} /></label>
          <label>Rate<input disabled={locked} type="number" min="0" value={draft.rate} onChange={(event) => setDraft({ ...draft, rate: event.target.value })} /></label>
        </div>
        <label>Footer note<textarea disabled={locked} value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} /></label>
        <div className="price-preview">
          <div className="price-box"><span>Subtotal</span><strong>{formatRs(subtotal)}</strong></div>
          <div className="price-box"><span>{gst.sameState ? "CGST + SGST" : "IGST"}</span><strong>{formatRs(gst.tax)}</strong></div>
          <div className="price-box"><span>Total</span><strong>{formatRs(subtotal + gst.tax)}</strong></div>
        </div>
        {publishStatus && <p className={publishStatus.type === "ok" ? "flow-message ok" : "flow-message warn"}>{publishStatus.message}</p>}
        <button className="primary invoice-publish" type="button" disabled={locked} onClick={onPublish}>Publish invoice</button>
      </div>
      <InvoiceSheet invoice={invoice} profile={invoiceProfile} />
    </section>
  );
}

function InvoiceSheet({ invoice, profile }) {
  return (
    <div className="invoice-sheet-wrap">
      <article className="invoice-sheet">
        <div className="invoice-frame">
          <header className="sheet-head">
            <div><p className="sheet-brand">{profile.brandName}</p><p>{profile.address}</p><p>{profile.contact} · {profile.email}{profile.phone ? ` · ${profile.phone}` : ""}</p><p>GSTIN: {profile.taxId} · {profile.state} ({profile.stateCode})</p></div>
            <div><span>Invoice</span><strong>{invoice.invoice}</strong><p>{invoice.status}</p></div>
          </header>
          <section className="sheet-party">
            <div><span>Bill to</span><strong>{invoice.tenant || "Tenant name"}</strong><p>{invoice.billToAddress || "Tenant billing address"}</p><p>{invoice.clientContact && `Contact: ${invoice.clientContact}`}</p><p>{invoice.clientEmail && `Email: ${invoice.clientEmail}`}</p><p>{invoice.clientPhone && `Phone: ${invoice.clientPhone}`}</p><p>{invoice.clientGst && `GSTIN: ${invoice.clientGst}`}</p><p>{invoice.clientState && `State: ${invoice.clientState} (${invoice.clientStateCode})`}</p><p>{invoice.placeOfSupply && `Place of supply: ${invoice.placeOfSupply}`}</p></div>
            <div><span>Issue date</span><strong>{invoice.issueDate}</strong><span>Due date</span><strong>{invoice.dueDate}</strong><span>Payment ref</span><strong>{invoice.paymentRef || "-"}</strong><span>Subscription ref</span><strong>{invoice.subscriptionRef || "-"}</strong></div>
          </section>
          <table className="sheet-table">
            <thead><tr><th>Description</th><th>HSN/SAC</th><th>Qty</th><th>Rate</th><th>GST</th><th>Taxable value</th></tr></thead>
            <tbody><tr><td>{invoice.lineDescription}</td><td>{invoice.hsnSac}</td><td>{invoice.quantity}</td><td>{formatRs(Number(invoice.rate || 0))}</td><td>{invoice.gstRate}%</td><td>{formatRs(invoice.subtotal)}</td></tr></tbody>
          </table>
          <section className="sheet-total">
            <div><span>Subtotal</span><strong>{formatRs(invoice.subtotal)}</strong></div>
            {invoice.sameState ? (
              <>
                <div><span>CGST {Number(invoice.gstRate || 0) / 2}%</span><strong>{formatRs(invoice.cgst)}</strong></div>
                <div><span>SGST {Number(invoice.gstRate || 0) / 2}%</span><strong>{formatRs(invoice.sgst)}</strong></div>
              </>
            ) : (
              <div><span>IGST {invoice.gstRate}%</span><strong>{formatRs(invoice.igst)}</strong></div>
            )}
            <div className="grand"><span>Total amount</span><strong>{formatRs(invoice.total)}</strong></div>
          </section>
          <footer className="sheet-footer"><p>{invoice.notes}</p><small>This invoice is generated by ArchScale Studio Hub for ArchScale Guild.</small></footer>
        </div>
      </article>
    </div>
  );
}

function Taxes() {
  return <FinanceTable eyebrow="Tax Filing" title="Jurisdiction and liability" columns={["Period", "Jurisdiction", "Taxable Revenue", "Tax Due", "Filing Status", "Due Date"]} rows={data.finance.taxes.map((row) => [row.period, row.jurisdiction, row.taxableRevenue, row.taxDue, row.filingStatus, row.dueDate])} />;
}

function RefundsCredits() {
  return <FinanceTable eyebrow="Adjustments" title="Refunds, credit notes and service credits" columns={["Reference", "Tenant", "Type", "Amount", "Reason", "Status", "Owner"]} rows={data.finance.refundsCredits.map((row) => [row.reference, row.tenant, row.type, row.amount, row.reason, row.status, row.owner])} />;
}

function Expenses() {
  const empty = { date: "2026-06-10", vendor: "", category: "", amount: "", taxType: "GST", paymentStatus: "Not done", source: "Bank transfer", owner: "", notes: "" };
  const [expenses, setExpenses] = useState(loadExpenseRegister);
  const [vendors, setVendors] = useState(loadExpenseParties);
  const [accounts, setAccounts] = useState(loadPaymentAccounts);
  const [form, setForm] = useState(empty);
  const [partyName, setPartyName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [partyEdit, setPartyEdit] = useState(null);
  const [accountEdit, setAccountEdit] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saved, setSaved] = useState("");

  function persist(next) {
    setExpenses(next);
    localStorage.setItem("archscale-expenses", JSON.stringify(next));
    setSaved("Expense register saved on this device.");
  }

  function persistVendors(next) {
    const clean = [...new Set(next.map((item) => item.trim()).filter(Boolean))].sort();
    setVendors(clean);
    localStorage.setItem("archscale-expense-parties", JSON.stringify(clean));
  }

  function persistAccounts(next) {
    const clean = [...new Set(next.map((item) => item.trim()).filter(Boolean))].sort();
    setAccounts(clean);
    localStorage.setItem("archscale-payment-accounts", JSON.stringify(clean));
  }

  function saveParty() {
    if (!partyName.trim()) return;
    persistVendors(partyEdit === null ? [...vendors, partyName] : vendors.map((item, index) => index === partyEdit ? partyName : item));
    setPartyName("");
    setPartyEdit(null);
  }

  function saveAccount() {
    if (!accountName.trim()) return;
    persistAccounts(accountEdit === null ? [...accounts, accountName] : accounts.map((item, index) => index === accountEdit ? accountName : item));
    setAccountName("");
    setAccountEdit(null);
  }

  function submitExpense() {
    if (!form.vendor.trim() || !form.amount.trim()) return;
    const nextExpense = {
      date: form.date || "2026-06-10",
      vendor: form.vendor.trim(),
      category: form.category.trim() || "-",
      amount: form.amount.trim(),
      taxType: form.taxType,
      paymentStatus: form.paymentStatus,
      source: form.source.trim() || "-",
      owner: form.owner.trim() || "-",
      notes: form.notes.trim() || "-"
    };
    const next = editing === null ? [nextExpense, ...expenses] : expenses.map((item, index) => index === editing ? nextExpense : item);
    persist(next);
    if (!vendors.includes(nextExpense.vendor)) persistVendors([...vendors, nextExpense.vendor]);
    if (!accounts.includes(nextExpense.source)) persistAccounts([...accounts, nextExpense.source]);
    setForm(empty);
    setEditing(null);
  }

  function editExpense(index) {
    setForm(expenses[index]);
    setEditing(index);
    setSaved("");
  }

  function deleteExpense(index) {
    persist(expenses.filter((_, itemIndex) => itemIndex !== index));
    if (editing === index) {
      setEditing(null);
      setForm(empty);
    }
  }

  return (
    <div className="overview">
      <section className="business-card flow-card">
        <header className="product-head">
          <div>
            <p className="eyebrow">Operating Spend</p>
            <h2>{editing === null ? "Add expense" : "Edit expense"}</h2>
          </div>
          <button className="primary small" onClick={submitExpense}>{editing === null ? "Add expense" : "Save changes"}</button>
        </header>
        <div className="flow-row expense-form">
          <input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} />
          <input list="expense-vendors" placeholder="Search or add vendor / company" value={form.vendor} onChange={(event) => setForm({ ...form, vendor: event.target.value })} />
          <datalist id="expense-vendors">{vendors.map((vendor) => <option key={vendor} value={vendor} />)}</datalist>
          <input placeholder="Amount, e.g. Rs 18,500" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} />
          <select value={form.taxType} onChange={(event) => setForm({ ...form, taxType: event.target.value })}>
            <option>GST</option>
            <option>Non GST</option>
            <option>Reverse charge</option>
          </select>
          <input placeholder="Category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} />
          <select value={form.paymentStatus} onChange={(event) => setForm({ ...form, paymentStatus: event.target.value })}>
            <option>Done</option>
            <option>Not done</option>
            <option>Pending approval</option>
            <option>Scheduled</option>
          </select>
          <select value={form.source} onChange={(event) => setForm({ ...form, source: event.target.value })}>
            {accounts.map((account) => <option key={account}>{account}</option>)}
          </select>
          <input placeholder="Owner / team" value={form.owner} onChange={(event) => setForm({ ...form, owner: event.target.value })} />
          <input placeholder="Notes / invoice reference" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
          {editing !== null && <button className="ghost small" onClick={() => { setEditing(null); setForm(empty); }}>Cancel edit</button>}
        </div>
        <p className="soft-copy">Use the vendor field as a searchable company list. If the company is not already listed, type the new business name and it will be saved when you add the expense.</p>
        {saved && <p className="flow-message ok">{saved}</p>}
      </section>
      <div className="master-grid">
        <section className="business-card flow-card">
          <header className="product-head">
            <div><p className="eyebrow">Payment Masters</p><h2>Wallet / bank / receivable accounts</h2></div>
            <button className="primary small" onClick={saveAccount}>{accountEdit === null ? "Add account" : "Save account"}</button>
          </header>
          <div className="flow-row master-form">
            <input placeholder="Account name, e.g. HDFC Current Account" value={accountName} onChange={(event) => setAccountName(event.target.value)} />
            {accountEdit !== null && <button className="ghost small" onClick={() => { setAccountName(""); setAccountEdit(null); }}>Cancel edit</button>}
          </div>
          <div className="master-list">
            {accounts.map((account, index) => (
              <article key={account}><span>{account}</span><div className="row-actions"><button onClick={() => { setAccountName(account); setAccountEdit(index); }}>Edit</button><button onClick={() => persistAccounts(accounts.filter((_, itemIndex) => itemIndex !== index))}>Delete</button></div></article>
            ))}
          </div>
        </section>
        <section className="business-card flow-card">
          <header className="product-head">
            <div><p className="eyebrow">Party Masters</p><h2>Vendor / supplier parties</h2></div>
            <button className="primary small" onClick={saveParty}>{partyEdit === null ? "Add party" : "Save party"}</button>
          </header>
          <div className="flow-row master-form">
            <input placeholder="Vendor or supplier business name" value={partyName} onChange={(event) => setPartyName(event.target.value)} />
            {partyEdit !== null && <button className="ghost small" onClick={() => { setPartyName(""); setPartyEdit(null); }}>Cancel edit</button>}
          </div>
          <div className="master-list">
            {vendors.map((vendor, index) => (
              <article key={vendor}><span>{vendor}</span><div className="row-actions"><button onClick={() => { setPartyName(vendor); setPartyEdit(index); }}>Edit</button><button onClick={() => persistVendors(vendors.filter((_, itemIndex) => itemIndex !== index))}>Delete</button></div></article>
            ))}
          </div>
        </section>
      </div>
      <section className="business-card">
        <p className="eyebrow">Expense Register</p>
        <h2>Expenses by vendor, tax type and payment status</h2>
        <div className="table-wrap">
          <table>
            <thead><tr>{["Date", "Vendor", "Category", "Amount", "GST / Non GST", "Payment Status", "Source", "Owner", "Notes", "Actions"].map((column) => <th key={column}>{column}</th>)}</tr></thead>
            <tbody>
              {expenses.map((expense, index) => (
                <tr key={`${expense.vendor}-${expense.date}-${index}`}>
                  <td>{expense.date}</td>
                  <td><strong>{expense.vendor}</strong></td>
                  <td>{expense.category}</td>
                  <td>{expense.amount}</td>
                  <td>{expense.taxType}</td>
                  <td><span className={`status-dot ${expense.paymentStatus === "Done" ? "good" : expense.paymentStatus === "Not done" ? "bad" : "attention"}`}>{expense.paymentStatus}</span></td>
                  <td>{expense.source}</td>
                  <td>{expense.owner}</td>
                  <td>{expense.notes}</td>
                  <td><div className="row-actions"><button onClick={() => editExpense(index)}>Edit</button><button onClick={() => deleteExpense(index)}>Delete</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function FinanceTable({ eyebrow, title, columns, rows }) {
  return (
    <div className="overview">
      <section className="business-card">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <DataTable columns={columns} rows={rows} />
      </section>
    </div>
  );
}

function supportPriorityClass(priority) {
  return { High: "red", Medium: "yellow", Low: "green" }[priority] || "gray";
}

function supportStatusClass(status) {
  if (status === "Resolved" || status === "Closed") return "green";
  if (status === "Open") return "red";
  if (status === "Pending") return "ochre";
  if (status === "Not contacted" || status === "No communication") return "gray";
  return "yellow";
}

function supportSignal(ticket) {
  if (ticket.status === "Resolved" || ticket.status === "Closed") return ["Closed within TAT", "green"];
  if (ticket.status === "Pending") return ["Waiting action", "ochre"];
  if (ticket.status === "Open" && ticket.priority === "High") return ["Red hot", "red"];
  if (ticket.status === "Not contacted" || ticket.status === "No communication") return ["No communication yet", "gray"];
  return ["Needs review", "yellow"];
}

function Support() {
  return (
    <div className="overview">
      <section className="panel-card">
        <header><i className="ti ti-lifebuoy" /><h2>Ticket list</h2></header>
        <div className="support-legend">
          <span className="ticket-tag red">Red hot / overdue</span>
          <span className="ticket-tag ochre">Pending action</span>
          <span className="ticket-tag yellow">In review</span>
          <span className="ticket-tag green">Closed within TAT</span>
          <span className="ticket-tag gray">No communication yet</span>
        </div>
        <div className="table-wrap">
          <table className="support-table">
            <thead><tr>{["Ticket #", "Tenant", "Priority", "Module", "Status", "Created", "Control"].map((column) => <th key={column}>{column}</th>)}</tr></thead>
            <tbody>
              {data.supportTickets.map((ticket) => {
                const [signal, signalClass] = supportSignal(ticket);
                return (
                  <tr key={ticket.id}>
                    <td><strong>{ticket.id}</strong></td>
                    <td>{ticket.tenant}</td>
                    <td><span className={`ticket-tag ${supportPriorityClass(ticket.priority)}`}>{ticket.priority}</span></td>
                    <td><span className="ticket-tag module">{ticket.module}</span></td>
                    <td><span className={`ticket-tag ${supportStatusClass(ticket.status)}`}>{ticket.status}</span></td>
                    <td>{ticket.created}</td>
                    <td><span className={`ticket-tag ${signalClass}`}>{signal}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Audit() {
  return <div className="overview"><section className="panel-card"><header><i className="ti ti-lock-check" /><h2>Tracked events</h2></header><DataTable columns={["Event", "Detail", "Actor", "Time"]} rows={data.auditEvents.map((event) => [event.event, event.detail, event.actor, event.time])} /></section></div>;
}

function Insights() {
  return <div className="overview"><div className="graph-grid"><Graph title="User Increase" metric="+186" /><Graph title="Businesses Added" metric="+12" /><Graph title="Sales Done" metric="Rs 14.2L" /></div><Tenants /></div>;
}

function Graph({ title, metric }) {
  return <section className="graph-card"><p className="eyebrow">Dashboard Graph</p><div><h2>{title}</h2><strong>{metric}</strong></div><div className="bars">{[32, 44, 58, 68, 84, 100].map((height) => <span key={height} style={{ height: `${height}%` }} />)}</div></section>;
}

function Revenue() {
  return <div className="overview"><div className="kpis">{[["MRR", "Rs 18.4L"], ["ARR", "Rs 2.2Cr"], ["Churn", "1.8%"], ["ARPU", "Rs 1,430"]].map(([label, value]) => <section className="kpi" key={label}><span>{label}</span><strong>{value}</strong></section>)}</div><section className="business-card"><p className="eyebrow">Growth Revenue</p><h2>Revenue Dashboard</h2><p className="soft-copy">This remains a growth dashboard. Accounting items such as invoices, taxes, refunds, credits and expenses should move into a separate Finance section later.</p></section></div>;
}

function Tenants() {
  const wallets = walletSummary();
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="overview">
      <div className="kpis">
        <section className="kpi"><span>Total wallets recharged</span><strong>{formatRs(wallets.totalRecharged)}</strong><small>All tenants</small></section>
        <section className="kpi"><span>Last wallet charged</span><strong>{wallets.lastRecharge?.name}</strong><small>{formatRs(wallets.lastRecharge?.walletLastRechargeAmount || 0)} · {wallets.lastRecharge?.walletLastRechargeDate}</small></section>
        <section className="kpi"><span>Current balances</span><strong>{formatRs(wallets.totalBalance)}</strong><small>Available client wallet value</small></section>
        <section className="kpi"><span>Zero balance</span><strong>{data.tenants.filter((tenant) => Number(tenant.walletBalance || 0) === 0).length}</strong><small>Needs recharge follow-up</small></section>
      </div>
      <section className="panel-card table-card tenant-section">
        <header><i className="ti ti-building-store" /><h2>Tenant Health Score</h2></header>
        <div className="table-wrap">
          <table>
            <thead><tr>{["Tenant", "Plan", "Users Active", "Health Score"].map((column) => <th key={column}>{column}</th>)}</tr></thead>
            <tbody>
              {data.tenants.map((tenant, index) => (
                <React.Fragment key={tenant.name}>
                  <tr className={`tenant-row ${selectedIndex === index ? "selected" : ""}`} onClick={() => setSelectedIndex(index)}>
                    <td><strong>{tenant.name}</strong><small>Click to view users, usage and wallet</small></td>
                    <td>{tenant.plan}</td>
                    <td>{tenant.users}</td>
                    <td><span className={`health-pill ${healthClass(tenant.health)}`}>{tenant.health}</span></td>
                  </tr>
                  {selectedIndex === index && (
                    <tr className="tenant-expanded">
                      <td colSpan="4">
                        <div className="tenant-expanded-grid">
                          <section className="tenant-detail-panel">
                            <header>
                              <div>
                                <p className="eyebrow">Tenant users</p>
                                <h3>{tenant.name}</h3>
                              </div>
                              <span className={`health-pill ${healthClass(tenant.health)}`}>{tenant.health}</span>
                            </header>
                            <div className="table-wrap inner-table">
                              <table>
                                <thead><tr>{["User ID", "Name", "Date connected", "User type"].map((column) => <th key={column}>{column}</th>)}</tr></thead>
                                <tbody>
                                  {tenantUsers(tenant).map((user) => (
                                    <tr className={`tenant-user-row ${user.type.toLowerCase().replaceAll(" ", "-")}`} key={user.id}>
                                      <td>{user.id}</td>
                                      <td><strong>{user.name}</strong></td>
                                      <td>{user.connected}</td>
                                      <td>{user.type}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </section>
                          <section className="tenant-detail-panel">
                            <header>
                              <div>
                                <p className="eyebrow">Usage and wallet</p>
                                <h3>Apps consumed by this tenant</h3>
                              </div>
                            </header>
                            <div className="app-consumption">
                              {tenantUsage(tenant).map((item) => (
                                <article key={item.app}>
                                  <div>
                                    <strong>{item.app}</strong>
                                    <small>{item.users} active users</small>
                                  </div>
                                  <div className="consumption-meter" aria-label={`${item.consumption}% consumption`}><span style={{ width: `${item.consumption}%` }} /></div>
                                  <b>{item.consumption}%</b>
                                </article>
                              ))}
                            </div>
                            <div className="wallet-mini-table">
                              <article><span>Total recharged</span><strong>{formatRs(tenant.walletTotalRecharged)}</strong></article>
                              <article><span>Last wallet charged</span><strong>{formatRs(tenant.walletLastRechargeAmount)}</strong><small>{tenant.walletLastRechargeDate}</small></article>
                              <article><span>Current balance</span><strong>{formatRs(tenant.walletBalance)}</strong></article>
                            </div>
                          </section>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function AccessSummary() {
  return <section className="panel-card"><header><i className="ti ti-shield-cog" /><h2>Platform access by role</h2></header><DataTable columns={["Role", "Scope", "Accounts"]} rows={data.roles.map((role, index) => [role.name, role.description, index + 2])} /></section>;
}

function DataTable({ columns, rows }) {
  return <div className="table-wrap"><table><thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row.join("-")}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div>;
}

createRoot(document.getElementById("root")).render(<App />);
