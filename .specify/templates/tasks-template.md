# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`

**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)

```text
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`

- [P]: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions

- Nuxt app (this project): `pages/`, `components/`, `layouts/`, `composables/`, `server/api/`, `server/services/`, `prisma/`, `tests/`
- Shared types: `types/`
- Adjust paths based on plan.md if feature-specific structure differs

## Phase 3.1: Setup

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize [language] project with [framework] dependencies
- [ ] T003 [P] Configure linting and formatting tools
- [ ] T004 Initialize Prisma with `prisma init`
- [ ] T005 Configure database connection in .env
- [ ] T006 Define database schema in prisma/schema.prisma
- [ ] T007 [P] Install and configure Vuetify 3 with Nuxt.js integration
- [ ] T008 [P] Configure Vuetify theme and Material Design tokens
- [ ] T009 [P] Set up Vuetify tree-shaking for optimal bundle size
- [ ] T010 [P] Configure local Prisma MCP server (add to VS Code mcp.json)
- [ ] T011 [P] Document start command `npx -y prisma mcp` in README

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

Note: These tests MUST be written and MUST FAIL before ANY implementation.

- [ ] T004 [P] Contract test POST /api/users in `tests/contract/users.post.spec.ts`
- [ ] T005 [P] Contract test GET /api/users/{id} in `tests/contract/users.[id].get.spec.ts`
- [ ] T006 [P] Integration test user registration in `tests/integration/registration.spec.ts`
- [ ] T007 [P] Integration test auth flow in `tests/integration/auth.spec.ts`

## Phase 3.3: Core Implementation (ONLY after tests are failing)

- [ ] T012 [P] Create Vuetify layout (e.g., `layouts/default.vue`) and components (`components/AppAppBar.vue`, `components/AppNavigationDrawer.vue`)
- [ ] T013 [P] Define `User` interface in `types/user.ts`
- [ ] T014 [P] Server-side user service (CRUD) in `server/services/userService.ts`
- [ ] T015 [P] Vue components using Vuetify UI components
- [ ] T016 Implement `server/api/users.post.ts` (create user via Prisma)
- [ ] T017 Implement `server/api/users/[id].get.ts` (get user via Prisma)
- [ ] T018 Input validation: client (Vuetify forms) and server (`server/validators/user.ts`)
- [ ] T019 Error handling and logging for API routes
- [ ] T020 [P] Implement responsive design with Vuetify breakpoints

## Phase 3.4: Integration

- [ ] T021 Generate Prisma client with `prisma generate`
- [ ] T022 Run database migrations with `prisma migrate dev`
- [ ] T023 Wire composables (e.g., `composables/useUsers.ts`) to server API via `$fetch`
- [ ] T024 Configure Vuetify SSR with proper hydration
- [ ] T025 Integrate Vuetify theme system with `useTheme`
- [ ] T026 SSR hydration optimization for Vuetify components
- [ ] T027 Meta tags and SEO setup with `useHead()`
- [ ] T028 Image optimization with Nuxt Image
- [ ] T029 [P] Validate MCP server connectivity (SSE at <http://127.0.0.1:8765/sse>)

## Phase 3.5: Polish

- [ ] T030 [P] Database integration tests with test database
- [ ] T031 [P] Prisma schema validation tests
- [ ] T032 [P] Vuetify component unit tests with Vue Test Utils
- [ ] T033 [P] Test Vuetify theme customization and breakpoints
- [ ] T034 Performance tests (Core Web Vitals) with Vuetify optimizations
- [ ] T035 [P] Update component and database documentation
- [ ] T036 Bundle size analysis and Vuetify tree-shaking validation
- [ ] T037 E2E testing with Playwright including Vuetify interactions

## Dependencies

- Tests (T004-T006) before implementation (T012-T020)
- Vuetify setup (T007-T009) before UI implementation (T012, T015, T018, T020)
- MCP setup (T010-T011) before MCP validation (T029)
- T013 blocks T014, T021
- T022 blocks T023, T024
- Implementation before polish (T030-T037)

## Parallel Example

```text
# Launch T004–T007 together:
Task: "Contract test POST /api/users in tests/contract/users.post.spec.ts"
Task: "Contract test GET /api/users/{id} in tests/contract/users.[id].get.spec.ts"
Task: "Integration test registration in tests/integration/registration.spec.ts"
Task: "Integration test auth in tests/integration/auth.spec.ts"
```

## Notes

- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts

## Task Generation Rules

Applied during main() execution.

1. From Contracts:
   - Each contract file → contract test task [P]
   - Each endpoint → implementation task

2. From Data Model:
   - Each entity → model creation task [P]
   - Relationships → service layer tasks

3. From User Stories:
   - Each story → integration test [P]
   - Quickstart scenarios → validation tasks

4. Ordering:
   - Setup → Tests → Models → Services → Endpoints → Polish
   - Dependencies block parallel execution

## Validation Checklist

Gate: Checked by main() before returning.

- [ ] All contracts have corresponding tests
- [ ] All entities have model tasks
- [ ] All tests come before implementation
- [ ] Parallel tasks truly independent
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task
