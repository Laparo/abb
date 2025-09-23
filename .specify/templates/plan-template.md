
# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

## Execution Flow (/plan command scope)

```text
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (Nuxt 3 web app by default)
   → Set Structure Decision accordingly (Nuxt 3 structure)
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `.github/copilot-instructions.md` for GitHub Copilot, `CLAUDE.md` for Claude Code, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:

- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

**Language/Version**: [Nuxt 3 + TypeScript (strict), Node.js 18+/20+ or NEEDS CLARIFICATION]  
**Primary Dependencies**: [Nuxt 3, Vuetify 3 (MD3), Prisma ORM or NEEDS CLARIFICATION]  
**Storage**: [e.g., PostgreSQL via Prisma or N/A]  
**Testing**: [Vitest, Vue Test Utils, Playwright or NEEDS CLARIFICATION]  
**Target Platform**: [Universal SSR (Node) with client hydration or NEEDS CLARIFICATION]  
**Project Type**: [web (Nuxt 3) - determines source structure]  
**Performance Goals**: [Core Web Vitals compliant, e.g., LCP <2.5s, CLS <0.1 or NEEDS CLARIFICATION]  
**Constraints**: [e.g., p95 <200ms on key endpoints, minimal bundle size via tree-shaking or NEEDS CLARIFICATION]  
**Scale/Scope**: [e.g., public pages SSR, admin SPA areas, user/base sizes or NEEDS CLARIFICATION]

## Constitution Check

Gate: Must pass before Phase 0 research. Re-check after Phase 1 design.

### I. Component-First Development

- ✅ Feature designed as reusable Vue components
- ✅ Components have clear props interface and JSDoc documentation
- ✅ Business logic separated from page components

### II. File-Based Routing Discipline

- ✅ Page components follow Nuxt.js /pages/ directory structure
- ✅ Dynamic routes use proper [param].vue notation
- ✅ No manual route configuration unless justified

### III. SSR/SPA Hybrid Strategy

- ✅ Server-Side Rendering configured for public content
- ✅ Client-side hydration optimized to prevent layout shifts
- ✅ SPA mode only for authenticated areas (if applicable)

### IV. TypeScript-First Development

- ✅ All components and composables written in TypeScript
- ✅ Strict mode enabled, no any types
- ✅ Type definitions for all external APIs

### V. Composables for Logic Sharing

- ✅ Business logic implemented as Nuxt.js composables
- ✅ Server-side data fetching via $fetch/useFetch
- ✅ State management using Vue 3 Composition API or Pinia
- ✅ UI state and theming leverage Vuetify composables (useTheme, useDisplay)

### VI. Prisma ORM Integration

- ✅ Database schema defined in prisma/schema.prisma
- ✅ Type-safe database operations via Prisma client
- ✅ Database migrations version-controlled and documented
- ✅ No raw SQL queries without explicit justification

### VII. Vuetify UI Framework Standards

- ✅ All UI components use Vuetify 3 component library
- ✅ Styling follows Material Design 3 principles through Vuetify theming
- ✅ Layout system uses Vuetify components (v-app, v-main, v-navigation-drawer)
- ✅ Theme customization centralized in Vuetify configuration
- ✅ Tree-shaking properly configured for optimal bundle size

### VIII. MCP Tooling Standards (Prisma MCP)

- ✅ If used, local-only MCP endpoint configured (SSE at <http://127.0.0.1:8765/sse>)
- ✅ No production dependency on MCP; optional for developer tooling
- ✅ No secrets in prompts; outputs pass type checks and code review

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (Nuxt 3 application)

```text
├── pages/               # File-based routing (SSR by default)
├── components/          # Reusable Vue components (Vuetify-based)
├── composables/         # Business logic (Composition API)
├── server/
│   ├── api/             # Server API routes (e.g., users.post.ts, users/[id].get.ts)
│   └── services/        # Server-side services (e.g., userService.ts)
├── prisma/              # Prisma schema + migrations
├── plugins/             # Nuxt plugins (e.g., Vuetify setup)
├── middleware/          # Route middleware
├── assets/              # Uncompiled assets
├── public/              # Static assets
├── types/               # Shared TS types
├── tests/
│   ├── contract/        # Contract tests (from Phase 1)
│   ├── component/       # Component tests (Vue Test Utils)
│   ├── integration/     # Integration tests
│   └── e2e/             # End-to-end tests (Playwright)
└── .specify/            # Spec-driven development files
```

**Structure Decision**: [Default to Nuxt 3 structure above unless feature demands deviation]

## Phase 0: Outline & Research

1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
  
   ```text
  
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts

Prerequisite: research.md complete.

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh copilot`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach

Scope: This section describes what the /tasks command will do — do not execute during /plan.

**Task Generation Strategy**:

- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract → contract test task [P]
- Each entity → model creation task [P]
- Each user story → integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:

- TDD order: Tests before implementation
- Dependency order: Models before services before UI
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 25-30 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation

Scope: These phases are beyond the scope of the /plan command.

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking

Fill ONLY if Constitution Check has violations that must be justified.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking

This checklist is updated during execution flow.

**Phase Status**:

- [ ] Phase 0: Research complete (/plan command)
- [ ] Phase 1: Design complete (/plan command)
- [ ] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:

- [ ] Initial Constitution Check: PASS
- [ ] Post-Design Constitution Check: PASS
- [ ] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---
*Based on Constitution v1.3.0 - See `/.specify/memory/constitution.md`*
