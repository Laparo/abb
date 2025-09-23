# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
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
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

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

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T004 [P] Contract test POST /api/users in tests/contract/test_users_post.py
- [ ] T005 [P] Contract test GET /api/users/{id} in tests/contract/test_users_get.py
- [ ] T006 [P] Integration test user registration in tests/integration/test_registration.py
- [ ] T007 [P] Integration test auth flow in tests/integration/test_auth.py

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T010 [P] Create Vuetify layout components (AppBar, NavigationDrawer)
- [ ] T011 [P] User model in src/models/user.py
- [ ] T012 [P] UserService CRUD in src/services/user_service.py
- [ ] T013 [P] Vue components using Vuetify UI components
- [ ] T014 POST /api/users endpoint
- [ ] T015 GET /api/users/{id} endpoint
- [ ] T016 Input validation with Vuetify form components
- [ ] T017 Error handling and logging
- [ ] T018 [P] Implement responsive design with Vuetify breakpoints

## Phase 3.4: Integration
- [ ] T019 Generate Prisma client with `prisma generate`
- [ ] T020 Run database migrations with `prisma migrate dev`
- [ ] T021 Connect composables to Nuxt server API with Prisma client
- [ ] T022 Configure Vuetify SSR with proper hydration
- [ ] T023 Integrate Vuetify theme system with useTheme composable
- [ ] T024 SSR hydration optimization for Vuetify components
- [ ] T025 Meta tags and SEO setup with useHead()
- [ ] T026 Image optimization with Nuxt Image

## Phase 3.5: Polish
- [ ] T027 [P] Database integration tests with test database
- [ ] T028 [P] Prisma schema validation tests
- [ ] T029 [P] Vuetify component unit tests with Vue Test Utils
- [ ] T030 [P] Test Vuetify theme customization and breakpoints
- [ ] T031 Performance tests (Core Web Vitals) with Vuetify optimizations
- [ ] T032 [P] Update component and database documentation
- [ ] T033 Bundle size analysis and Vuetify tree-shaking validation
- [ ] T034 E2E testing with Playwright including Vuetify interactions

## Dependencies
- Tests (T004-T006) before implementation (T010-T018)
- Vuetify setup (T007-T009) before UI implementation (T010, T013, T016, T018)
- T011 blocks T012, T019
- T020 blocks T021, T022
- Implementation before polish (T027-T034)

## Parallel Example
```
# Launch T004-T007 together:
Task: "Contract test POST /api/users in tests/contract/test_users_post.py"
Task: "Contract test GET /api/users/{id} in tests/contract/test_users_get.py"
Task: "Integration test registration in tests/integration/test_registration.py"
Task: "Integration test auth in tests/integration/test_auth.py"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - Each contract file → contract test task [P]
   - Each endpoint → implementation task
   
2. **From Data Model**:
   - Each entity → model creation task [P]
   - Relationships → service layer tasks
   
3. **From User Stories**:
   - Each story → integration test [P]
   - Quickstart scenarios → validation tasks

4. **Ordering**:
   - Setup → Tests → Models → Services → Endpoints → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [ ] All contracts have corresponding tests
- [ ] All entities have model tasks
- [ ] All tests come before implementation
- [ ] Parallel tasks truly independent
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task