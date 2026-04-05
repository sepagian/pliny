# Electricity Tracker v6 — Product Requirements Document

## 1. Overview

**Product Name:** Electricity Tracker (v6)  
**Type:** Single-page web application  
**Core Functionality:** Track prepaid electricity credits and multi-appliance usage with real-time balance estimation and daily consumption breakdown.  
**Target Users:** Homeowners with prepaid electricity meters who want to monitor and optimize their energy consumption.

---

## 2. UI/UX Specification

### 2.1 Layout Structure

```
┌─────────────────────────────────────┐
│  Header (title + subtitle)          │
├─────────────────────────────────────┤
│  Gauge Card                         │
│  [SVG Arc] Balance: XX KWh          │
├─────────────────────────────────────┤
│  Stats Row                          │
│  [Always-on] [Sessions avg] [Days] │
├─────────────────────────────────────┤
│  Breakdown (collapsible)            │
│  Fridge · 3 KWh/day                 │
│  Lamp · 1 KWh/day                   │
│  Sessions avg · X KWh/day           │
│  Total: X KWh/day                   │
├─────────────────────────────────────┤
│  Warning Banner (conditional)       │
├─────────────────────────────────────┤
│  Appliances List                    │
│  [+ Add appliance button]           │
├─────────────────────────────────────┤
│  Action Buttons                     │
│  [Top-up] [Log balance] [Session]   │
├─────────────────────────────────────┤
│  Tab Row [History] [Chart]          │
├─────────────────────────────────────┤
│  Content Pane (history/chart)       │
└─────────────────────────────────────┘
```

### 2.2 Responsive Behavior

- **Max-width:** 540px centered
- **Padding:** 1.25rem top/bottom, 1rem sides
- **Mobile-first design**

### 2.3 Visual Design

| Element | Style |
|---------|-------|
| Background | `--color-background-primary` |
| Card Background | `--color-background-secondary` |
| Text Primary | `--color-text-primary` |
| Text Secondary | `--color-text-secondary` |
| Success | `--color-text-success` (#1D9E75) |
| Warning | `--color-text-warning` (#BA7517) |
| Danger | `--color-text-danger` (#E24B4A) |
| Info | `--color-text-info` (#378ADD) |
| Border | `--color-border-tertiary` |
| Border Radius | `var(--border-radius-md/lg)` |

### 2.4 Components

| Component | States | Behavior |
|-----------|--------|----------|
| Gauge Arc | empty/partial/full, color changes | Animated stroke-dashoffset, color by % (green >40%, amber >20%, red ≤20%) |
| Stat Card | empty, populated | Shows "--" when no data |
| Badge | `badge-session` / `badge-daily` | Session=blue, Always-on=green |
| Icon Button | default, hover | Hover turns red |
| Tab | default, active (`.on`) | Active inverts colors |
| Modal | closed, open | Absolute positioned overlay |
| Log Item | topup/bal/session variants | Dot color by type, edit + delete buttons |
| Breakdown | collapsed (default), expanded | Click to toggle, chevron rotates on expand |

---

## 3. Data Model

### 3.1 Appliance

```typescript
interface Appliance {
  id: string;            // crypto.randomUUID()
  name: string;         // e.g., "Fridge", "Bedroom AC"
  watt: number;         // Wattage in watts (e.g., 150)
  sessionBased: boolean; // true = manual logging, false = always-on
  dailyHours: number;   // Hours per day (0 if session-based)
}
```

**Examples:**
```js
{ name: 'Fridge', watt: 125, sessionBased: false, dailyHours: 24 }
{ name: 'Lamp', watt: 60, sessionBased: false, dailyHours: 12 }
{ name: 'Bedroom AC', watt: 800, sessionBased: true, dailyHours: 0 }
```

### 3.2 Entry

```typescript
type EntryType = 'topup' | 'bal' | 'session';

interface BaseEntry {
  id: string;         // crypto.randomUUID()
  date: string;      // YYYY-MM-DD
  note?: string;
}

interface TopupEntry extends BaseEntry {
  type: 'topup';
  val: number;       // KWh added
}

interface BalEntry extends BaseEntry {
  type: 'bal';
  val: number;       // Balance reading in KWh
}

interface SessionEntry extends BaseEntry {
  type: 'session';
  date: string;     // YYYY-MM-DD (always today)
  appName: string;  // Appliance name
  watt: number;     // Appliance wattage
  hours: number;    // Duration in hours
  kwh: number;      // Computed KWh (watt * hours / 1000)
}

type Entry = TopupEntry | BalEntry | SessionEntry;
```

### 3.3 Enriched Entry

```typescript
interface EnrichedEntry extends Entry {
  computedBal: number | null; // Running balance after this entry (clamped to ≥ 0)
}
```

### 3.4 Computed Stats

```typescript
interface DailyStats {
  alwaysOnKwh: number;    // Sum of always-on appliances
  sessionAvgKwh: number;  // Average session usage per day
  totalDaily: number;     // alwaysOn + sessionAvg
  daysLeft: number | null;
  currentBal: number | null;
  firstTopup: TopupEntry | null;
}
```

---

## 4. Functional Specification

### 4.1 Core Features

#### 4.1.1 Appliance Management
- **Add appliance:** Name, wattage, session-based toggle, daily hours (if not session-based)
- **Edit appliance:** Pre-fill form with existing values
- **Delete appliance:** Remove with confirmation (instant delete)
- **View appliances:** List with badges, specs, edit/delete buttons

#### 4.1.2 Balance Tracking
- **Add top-up:** Date, KWh amount, optional note
- **Log balance reading:** Date, KWh on meter, optional note (manual override)
- **Log session:** Select session-based appliance, duration, optional note

#### 4.1.3 Calculations
- **Always-on KWh/day:** `Σ (watt × dailyHours) / 1000` for non-session appliances
- **Session avg KWh/day:** `Σ sessionKWh / max(1, days between first entry date and today)`
- **Days left:** `floor(currentBal / (alwaysOn + sessionAvg))`
- **Current balance:** See §4.1.4
- **Gauge percentage:** `min(100, (currentBal / firstTopupVal) * 100)` - capped at 100%, shows "--%" if firstTopupVal = 0

#### 4.1.4 Balance Computation Algorithm
```
1. Sort entries by date ASC, then type order (topup:0, bal:1, session:2)
2. Initialize balance = 0, prevDate = null
3. Iterate through sorted entries:
   a. If prevDate exists and gap > 0 days:
      - balance -= alwaysOnKwh × gap
   b. Apply entry:
      - topup: balance += val
      - bal:   balance = val
      - session: balance -= kwh
   c. Clamp balance: balance = max(0, balance)
   d. Store computedBal for each entry
   e. prevDate = entry.date
4. Project to today:
   - If last entry date < today:
     - balance -= alwaysOnKwh × days since last entry
   - Clamp balance: balance = max(0, balance)
5. Return enriched entries + currentBal
```

**Note:** Balance is clamped to ≥ 0 at all times to prevent negative values.

#### 4.1.5 History View
- Reverse chronological display
- Color-coded dots: topup (green), bal (blue), session (amber)
- Shows: description, date, KWh change, running balance
- Edit button per entry
- Delete button per entry

#### 4.1.6 Chart View
- Line chart of computed balance over time
- Requires ≥2 data points
- Fill area under line
- X-axis: dates, Y-axis: KWh

#### 4.1.7 Warnings
- Show warning banner when `daysLeft <= 5`

### 4.2 User Interactions

| Action | Trigger | Result |
|--------|---------|--------|
| Add appliance | Click "+ Add appliance" | Opens appliance form modal (if balance exists) or shows "Add balance first" prompt |
| Edit appliance | Click ✎ on appliance | Opens pre-filled form |
| Delete appliance | Click ✕ on appliance | Removes appliance, re-renders |
| Add top-up | Click "+ Top-up" | Opens top-up form |
| Log balance | Click "Log balance" | Opens balance form |
| Log session | Click "+ Log session" | Opens session form (if balance exists and session-based apps exist) |
| Edit entry | Click ✎ on log item | Opens pre-filled form for that entry type |
| Delete entry | Click ✕ on log item | Removes entry, re-renders |
| Switch tab | Click History/Chart | Toggles pane visibility |
| Close modal | Click Cancel / background | Closes modal |

### 4.3 Edge Cases

| Scenario | Handling |
|----------|----------|
| No balance added yet | Show prompt to add top-up or balance reading (hard block - cannot add appliances or sessions) |
| No appliances | Show "No appliances yet" placeholder |
| No entries | Show "No entries yet" placeholder |
| No session-based appliances | Session modal shows error message |
| Days left > 999 | Show as "999+" or similar cap |
| No data for gauge percentage | Show "--%" |
| No data for stats | Show "--" |
| Chart < 2 points | Don't render chart |
| First topup value = 0 | Avoid division by zero in gauge |
| Balance required | Hard block - prevent adding appliances or sessions until top-up/balance is added |

---

## 5. Technical Implementation Notes

### 5.1 Dependencies

- **Chart.js 4.4.1** — Line chart visualization
- **sveltekit-superforms 2.x** — Form validation (superforms.rocks)
- **CSS Variables** — Theming (see parent app)
- **Svelte 5** — Framework with runes ($state, $effect)
- **SvelteKit** — SPA routing (adapter-cloudflare)

### 5.2 State Management

- **Svelte 5 Runes:** Use `$state` for reactive state in `.svelte.ts` module
- **Single $effect:** One effect watches entire state object, serializes once per change
- **Browser-only:** Check `$app/environment` browser flag before localStorage access
- **State structure:** Combined state object `{ appliances: [], entries: [] }` for efficient persistence

```typescript
// Example pattern
const state = $state({
  appliances: load('appliances', []),
  entries: load('entries', [])
});

$effect(() => {
  if (browser) localStorage.setItem('tracker', JSON.stringify(state));
});
```

### 5.3 Key Constants

```typescript
const CIRC = 2 * Math.PI * 30;  // Gauge arc circumference (r=30)
const TYPE_ORDER = { topup: 0, bal: 1, session: 2 };
const COLORS = {
  topup: '#1D9E75',
  bal: '#378ADD',
  session: '#BA7517',
  gauge: {
    high: '#1D9E75',   // > 40% - green
    medium: '#BA7517', // > 20% - amber
    low: '#E24B4A'     // ≤ 20% - red
  }
};
```

### 5.4 Helper Functions

| Function | Purpose |
|----------|---------|
| `today()` | Returns YYYY-MM-DD |
| `fmtDate(d)` | Formats YYYY-MM-DD to locale string |
| `toKwh(w, h)` | Converts watts × hours to KWh |
| `fmt(n, dec)` | Trims trailing zeros |
| `load<T>(key, initial)` | Load from localStorage with type safety |
| `save(value)` | Single $effect callback for persistence |

---

## 6. Modal Forms

All forms use **sveltekit-superforms** for validation with inline error messages.

### 6.1 Appliance Form

| Field | Type | Validation |
|-------|------|------------|
| Name | text | Required, non-empty |
| Wattage | number | Required, > 0 |
| Session-based | checkbox | Toggles daily hours field |
| Daily usage | number | Required if !sessionBased, > 0 |
| **Balance check** | - | Hard block: must have balance (top-up or balance reading) added first |

### 6.2 Top-up Form

| Field | Type | Validation |
|-------|------|------------|
| Date | date | Required |
| Credits added | number | Required, > 0 |
| Note | text | Optional |

### 6.3 Balance Form

| Field | Type | Validation |
|-------|------|------------|
| Date | date | Required |
| Balance on meter | number | Required, ≥ 0 |
| Note | text | Optional |

### 6.4 Session Form

| Field | Type | Validation |
|-------|------|------------|
| Appliance | select | Required, must have session-based apps |
| Duration | number | Required, > 0 |
| Note | text | Optional |
| **Balance check** | - | Hard block: must have balance added first |

### 6.5 Edit Forms

All entry types support editing via pre-filled forms:

- **Edit Top-up:** Pre-filled with existing date, val, note
- **Edit Balance:** Pre-filled with existing date, val, note
- **Edit Session:** Pre-filled with appliance, hours, note (date always resets to today)

---

## 7. Acceptance Criteria

### 7.1 Core Functionality
- [ ] Can add, edit, delete appliances
- [ ] Can add top-ups, balance readings, sessions
- [ ] Can edit existing entries (topup, bal, session)
- [ ] Balance updates correctly after each entry
- [ ] Balance never goes negative (clamped to ≥ 0)
- [ ] Days left calculation is accurate
- [ ] Warning shows when daysLeft ≤ 5
- [ ] Hard block: cannot add appliances/sessions without balance

### 7.2 UI/UX
- [ ] Gauge displays correct percentage and color
- [ ] Stats row shows always-on, session avg, days left
- [ ] Breakdown is collapsible (click to expand/collapse)
- [ ] Breakdown itemizes each always-on appliance
- [ ] History list shows all entries with edit and delete buttons
- [ ] Chart renders when ≥2 balance points exist
- [ ] Modal opens/closes correctly
- [ ] Form validation shows inline errors (superforms)

### 7.3 Data Integrity
- [ ] Entries sorted by date ASC, then type order
- [ ] Running balance computed correctly with gap deduction
- [ ] Always-on deducts for day gaps and to today
- [ ] Session average divides by correct day span (first entry to today)
- [ ] Unique IDs for all appliances and entries

### 7.4 Edge Cases Handled
- [ ] Empty states show placeholders
- [ ] No session apps shows error on session click
- [ ] Invalid form inputs show inline validation errors
- [ ] No division by zero errors
- [ ] Gauge shows "--%" when no topup exists
