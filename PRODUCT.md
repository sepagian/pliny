# Pliny - Product Summary

## Overview

Pliny is an offline-first utility tracking web application built with SvelteKit. It allows users to track their electricity/meter usage, manage appliances, log sessions, and monitor remaining balance - all stored locally in the browser via IndexedDB.

## Purpose

Pliny solves the problem of tracking utility consumption without requiring an account or cloud backend. Users can:
- Monitor meter balance and usage trends
- Log utility sessions (e.g., electricity consumption)
- Track and manage home appliances
- Record top-ups and meter readings
- View detailed usage logs and statistics

## Problems Solved

1. **No account required** - Data stored locally using IndexedDB (via Dexie)
2. **Offline-first** - Works without internet after initial load
3. **Privacy-focused** - No data leaves the user's device
4. **Simple tracking** - No complex setup, just start logging

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | SvelteKit 2.x |
| Language | TypeScript |
| UI Runtime | Svelte 5 (Runes) |
| Styling | UnoCSS + Tailwind Variants |
| UI Components | shadcn-svelte, bits-ui, vaul-svelte |
| Database | Dexie (IndexedDB wrapper) |
| Forms | sveltekit-superforms, formsnap |
| Validation | Zod |
| Deployment | @sveltejs/adapter-cloudflare |
| Linting | Ultracite, Biome |

## Key Features

- **Dashboard**: Balance display, usage gauge, recent logs
- **Appliance Management**: Add/edit/delete appliances
- **Entry Forms**: Meter readings, sessions, top-ups, appliances
- **Log Navigation**: Browse and filter usage history
- **Theme Toggle**: Light/dark mode support
- **Local Storage**: All data persisted in IndexedDB

## Architecture

```
src/
├── lib/
│   ├── actions/        # Svelte actions for data operations
│   ├── components/    # UI components (features + UI primitives)
│   ├── db/            # Dexie database setup
│   ├── models/        # Data models
│   ├── query/         # Query/calculation utilities
│   ├── stores/        # Svelte stores (logs, stats, appliances)
│   └── utils/         # Helpers, schemas, constants
└── routes/            # SvelteKit routes
```

## Data Model

- **Meter**: Current balance and readings
- **Session**: Usage sessions with start/end times
- **TopUp**: Balance top-up records
- **Appliance**: User-defined appliances with power ratings

## Why Svelte 5?

Pliny leverages Svelte 5's runes (`$state`, `$derived`, `$effect`) for reactive state management, providing fine-grained reactivity and better performance compared to Svelte 4.

## Deployment

Built with `@sveltejs/adapter-cloudflare` for edge deployment, enabling fast global access while maintaining offline capabilities via Service Workers.