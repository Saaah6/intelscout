# Implementation Plan - SignalScout AI (Next.js & TypeScript)

SignalScout AI will be built as a full-featured, interactive Next.js application using TypeScript, TailwindCSS, and Framer Motion. The code is modularized into separate, dedicated component files rather than combined into a single file, conforming to clean architecture and modern React design patterns.

## User Review Required

> [!IMPORTANT]
> The app will run on a client-side Next.js environment. To make the application fully functional, responsive, and testable without external server setups or API keys, we will implement mock AI generators, a complete local qualified calculation engine, and a live intelligence feed directly in TypeScript state.

> [!TIP]
> We will initialize the application in `d:/demo/signalScout` using `npx -y create-next-app@latest` with Tailwind, TypeScript, and ESLint configured.

## Proposed Changes

We will structure the React components under `src/` (or standard Next.js directory layout):

### Component Breakdown

#### [NEW] Configuration and Entry
- `tailwind.config.ts` / `src/app/globals.css` - Custom styling tokens, animations, and dark mode configuration matching Stripe/Linear aesthetics.
- `src/app/layout.tsx` - Layout and provider configurations.
- `src/app/page.tsx` - Main router switching between the **Onboarding Wizard** and the **Dashboard / Workspace**.

#### [NEW] State Management
- `src/context/SignalScoutContext.tsx` - Custom React Context handling:
  - Offer definition & sales cycles (Stage 1)
  - Ideal Customer Profile (Stage 2)
  - Pain mapping & triggers (Stage 3)
  - Customizable signal weights (Stage 4 & 7)
  - Accounts database state & loading status (Stage 5)
  - Qualification engine results (Stage 6 & 7)
  - Live intelligence feed events (Stage 12)

#### [NEW] Core Components
- `src/components/OnboardingWizard/`
  - `Stage1Offer.tsx` - Form for selling definition, deal size, and sales cycle.
  - `Stage2ICPBuilder.tsx` - Visual generator display displaying Firmographics, Technographics, Growth Signals, and Buying Committees.
  - `Stage3PainMapping.tsx` - Pain-points and trigger builder.
  - `Stage4SignalWeights.tsx` - Interactive weights configurator.
  - `Stage5AccountImport.tsx` - CSV upload container (real client-side parser) with a "Load Demo Dataset" quick launch option.
  - `ResearchEngineLoader.tsx` - Simulated scanning console displaying step-by-step audit logs (website analysis, careers crawling, technology auditing) with a beautiful loading layout.
- `src/components/Dashboard/`
  - `DashboardLayout.tsx` - Multi-viewport structure with sidebar, top navbar, and mobile bottom bar navigation.
  - `Sidebar.tsx` - Collapsible navigation displaying system status.
  - `KPIWidgets.tsx` - Dashboard cards (Match rate, high priority, pipeline value) with micro-charts.
  - `AnalyticsCharts.tsx` - Live-updating SVG visualizations of intent distribution and pipeline opportunities.
  - `AccountsTable.tsx` - Sortable/searchable company lists showing domain, tier badges, score formula results, and CTA trigger events.
  - `CompanyDetailsDrawer.tsx` - Slide-over panel (Framer Motion) displaying explainable scoring, Buying Committee mapping, and context-tailored GTM messaging.
  - `IntelligenceFeed.tsx` - Rolling terminal feed that pops new signals into view in real-time, instantly recalculating target company scores and firing UI transitions.
  - `SettingsPanel.tsx` - Live weights modifier.

---

## Verification Plan

### Build Check
- Compile Next.js build using `npm run build` to verify there are no TypeScript or bundling issues.

### Manual Verification
1. **Onboarding Stages**: Walk through form fields and verify they generate custom firmographics/technographics based on inputs.
2. **CSV parsing**: Check local file uploads or click the "Load Demo Dataset" button.
3. **Research console**: Ensure crawling animation displays live console statements and transitions seamlessly to the dashboard.
4. **Interactive Qualification Drawer**: Click on any account to view the drawer and confirm it displays calculated metrics matching the GTM recommendations.
5. **Feed Updates**: Observe live feed additions and ensure related company priority metrics update dynamically.
6. **Responsive Layouts**: Test collapse sidebar and layout structure on mobile, tablet, and desktop breakpoints.
