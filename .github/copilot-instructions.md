## Code Review & PR Assistant

When performing a code review, follow this structured checklist before relying on the rest of this guide. Do the review in French.
Prefer JavaScript over TypeScript.

### Final Review Status & Color Coding

After completing the code review, provide a final summary comment with a color-coded status to indicate if the PR is ready to merge:

#### 🟢 GREEN - Ready to Merge
- No security vulnerabilities identified
- No business logic concerns
- Minor style/formatting issues only (if any)
- All architectural patterns followed correctly
- Tests present and adequate
- Documentation updated as needed

#### 🟡 YELLOW - Needs Review or Minor Work
- Minor security considerations that need attention
- Some business logic needs clarification or improvement
- Missing tests for new functionality
- Documentation gaps
- Performance considerations that should be addressed
- Non-critical architectural deviations
- **Action Required**: Address feedback before merging or get human review

#### 🔴 RED - Unsafe to Merge
- **CRITICAL**: Security vulnerabilities present
- **CRITICAL**: Business logic flaws or data integrity risks
- Major architectural violations
- Missing essential validations or permission checks
- Potential for data loss or system instability
- **Action Required**: DO NOT MERGE - requires immediate attention and technical lead review

### Escalation & Notifications

When assigning YELLOW or RED status, include appropriate notifications:

#### For YELLOW Status:
- Mention the PR author: `@author-username`
- Add relevant team members if specific expertise needed
- Include clear action items to resolve issues

#### For RED Status:
- **CRITICAL**: Mention everyone on the team: `@team`
- **CRITICAL**: Mention technical lead if known: `@tech-lead-username`
- If technical lead is unknown, add: `⚠️ **TECHNICAL LEAD REVIEW REQUIRED** - This PR contains critical issues that require immediate technical leadership review before any merge consideration.`
- List all critical issues that must be resolved
- Include security implications and potential impact

### Review Comment Template

End each review with this format:

```
## 📋 Review Summary

**Status**: [🟢 GREEN / 🟡 YELLOW / 🔴 RED] - [Brief status description]

### Key Findings:
- [List main points]
- [Security concerns if any]
- [Business logic issues if any]

### Action Items:
- [Specific tasks to complete]
- [Required reviews or approvals]

### Notifications:
[Include @mentions as per escalation rules above]
```

### High-Level Architecture
- Does the change fit the existing module boundaries (UI in `client/` & `imports/ui/`, backend logic & publications/methods in `imports/api/`)?
- Are new concerns introduced in the right layer (avoid putting business rules inside React components or Blaze templates)?
- Is shared logic placed in a reusable util/hook instead of duplicated inline?
- If a new hook was added: is it colocated next to its component unless clearly global (used across multiple unrelated features)?

### Business Logic & Domain Consistency
- Inspect `imports/api/` folder (methods, publications, server hooks) to see if an equivalent capability already exists.
- Reuse existing patterns for: user access control, role checks, collection CRUD helpers, validation.
- Confirm collection schemas or Zod/Yup validators are updated if data shape changed.
- If a new field is added to a collection: was it added to schema, publications, fixtures/seed (if any), validators, and UI forms? Make sure it has a clear label description too.

### Security & Permissions
- Check role/permission gates: uses helpers in `imports/utils/roles.js` or `imports/utils/permissions.js` (avoid ad‑hoc string comparisons).
- **jam:method Security**: Use `jam:method` with `checkRoles` helper for all server methods. Default to `open: false` for protected methods. Validate inputs with Zod.
- **Public Methods**: Only create public methods (`open: true`) in dedicated `publicMethods/` folders when explicitly needed.
- **Role Management**: All new roles must be added to the globals object (`imports/globals/roles.ts`) - every role needs to be properly defined there.
- Publications: restrict fields; never publish secrets (tokens, password hashes, internal flags). Avoid for new features.
- Prevent over-fetching: ensure selectors & `fields` projection minimize attack surface.
- Remove or guard debug logs containing PII.

### Data Validation & Integrity
- Are all mutations validated using shared schemas (`imports/lib/zod.js`, or collection-attached schema)?
- Check for silent failure paths—prefer throwing with clear error codes/messages.
- Ensure migrations or backfills are considered if schema changes are non-optional.

### Performance Considerations
- Any new publication or query: is there an index supporting its selector? (Add a comment/note if large collection.)
- Avoid N+1 patterns inside methods/publications.
- Large lists: confirm pagination / limit / cursor-based approach.
- Frontend derived computations memoized (React `useMemo`, `useCallback`), especially for table data or expensive filters.

### Tanstack Query Cache & Reactivity
- **Query Keys**: Use descriptive, hierarchical query keys with consistent naming patterns (e.g., `['users', 'list', { filters }]` or `['user', userId]`).
- **Cache Updates After Mutations**: 
  - **Prefer `refetch()`**: Use specific query `refetch()` methods for targeted updates when you know exactly which queries need fresh data
  - **Use `queryClient.invalidateQueries()`**: Only for broader invalidation when multiple related queries need updates
  - **Direct Cache Updates**: Use `queryClient.setQueryData()` for immediate updates when you have the new data structure
- **Optimistic Updates**: Use `useMutation`'s `onMutate` for optimistic updates, with proper rollback in `onError`.
- **Simple Configuration**: Stick with Tanstack Query defaults in most cases. Avoid adding `staleTime` unless you have a specific performance issue or data freshness requirement.
- **Query Dependencies**: Use `enabled` option to prevent unnecessary queries and create proper query dependencies.
- **Infinite Queries**: Use `useInfiniteQuery` for paginated data with proper `getNextPageParam` and `getPreviousPageParam`.
- **Background Refetching**: Configure `refetchOnWindowFocus`, `refetchOnReconnect` based on data sensitivity only when needed.

### Duplication & Reusability
- Search for similar logic before introducing new helpers (look in `imports/api/`, `imports/utils/`, `imports/ui/components/`).
- Abstract repeated validation, constants, and formatting rules into shared utilities.
- Ensure new utility names are descriptive & discoverable.

### Error Handling & Logging
- Consistent error shapes returned (standardized error codes / messages?).
- Avoid swallowing exceptions without logging.
- Use structured logging if present (`_logger.js` patterns) and appropriate log level (info/warn/error).

### Frontend Review
- Semantic HTML5 elements per style guide.
- Accessibility: labels for inputs, alt text for images, keyboard navigation preserved.
- State management: avoid unnecessary re-renders—check dependency arrays & prop drilling. Use Zustand (preferred) or React Context for global state.
- Forms: consistent validation + error surfacing; no duplicate schema definitions.

### Navigation & Routing Setup
- **New Page Creation**: When adding a new page component, ensure proper navigation setup is included:
  - Add route definition to `imports/routes/routePaths.js` with path, breadcrumb, and role permissions
  - Add route to `imports/routes/routes.jsx` within the authenticated routes section
  - **CRITICAL**: Add navigation link to sidebar (for back-office pages using ApplicationLayout):
    - Update `imports/ui/layouts/DefaultLayout/DefaultLayout.jsx` to add the new MenuLink in `topLinks` section
    - OR update `imports/ui/layouts/DefaultLayout/hooks/useAuthorizedLinks.js` for bottom navigation links
    - Include proper role-based access control (`displayTo` prop with appropriate roles)
    - Add descriptive label and appropriate icon name
    - Configure `highlightedByRoutes` for proper active state indication
- **Always ask the user** if they've forgot to precise the navigation setup - this is a common oversight.
- Ensure role-based access is consistent between route permissions (`allow` in routePaths) and navigation visibility (`displayTo` in MenuLink)
- Use `getAllAuthorizedFullPathsForRoute` helper for proper route highlighting in navigation

### Testing
- New logic: unit or integration tests added (services, utils, hooks).
- Critical paths covered with at least 1 happy + 1 failure scenario.
- Avoid brittle tests tied to implementation details.

### Dependency & Package Hygiene
- No unnecessary new dependencies; justify additions in PR description.
- Prefer existing libraries already in `package.json`.
- If removing code that used a dependency, consider whether it can also be removed.

### Documentation & DX
- Update `SETTINGS.md` if new settings keys introduced.
- Update README or inline comments for non-obvious workflows or invariants.
- Add jsdoc / comments for complex algorithms or business rules.

### Security Quick Scan
- No raw user input passed to database selectors without validation/sanitization.
- No credentials/tokens committed.
- Check for potential race conditions in multi-step mutations.

### Migrations / Backwards Compatibility
- If schema changes: Are older clients or existing documents handled gracefully?
- Provide migration script or note if needed.

### PR Hygiene
- Commit messages follow conventional format (commitlint configured).
- PR description: purpose, scope, side effects, testing steps, rollback plan.
- Remove commented-out code & dead files.

---

## Coding Standards & Best Practices
When writing or reviewing code, adhere to the following standards to ensure consistency, maintainability, and quality across the codebase.

### Code Style
- Use semantic HTML5 elements (header, main, section, article, etc.)
- Prefer modern JavaScript (ES6+) features like const/let, arrow functions, and template literals

### Naming Conventions
- Use PascalCase for component names, interfaces, and type aliases
- Use camelCase for variables, functions, and methods
- Prefix private class members with underscore (_)
- Use ALL_CAPS for constants

### Code Quality
- Use meaningful variable and function names that clearly describe their purpose
- Include helpful comments for complex logic
- Add error handling for user inputs and API calls

### Context Gathering
- Always check [package.json](../package.json) files to understand package versions and dependencies for better context
- Review relevant package.json files in the workspace to understand the technology stack
- Use package versions to ensure compatibility when suggesting solutions or fixes

### DRY (Don't Repeat Yourself)
- Extract common functionality into reusable functions or utilities
- Use constants for repeated values
- Create shared components for repeated UI patterns
- Avoid code duplication across modules

### Single Responsibility Principle (SRP)
- Each function should have one clear purpose
- Keep components focused on a single concern
- Split large functions into smaller, focused ones
- Separate business logic from UI components

### SOLID Principles
- **Open/Closed**: Classes should be open for extension, closed for modification
- **Liskov Substitution**: Derived classes must be substitutable for base classes
- **Interface Segregation**: Don't force classes to depend on unused interfaces
- **Dependency Inversion**: Depend on abstractions, not concretions

### Code Organization
- Group related functionality into modules
- Use consistent file and folder structure
- Keep imports organized (external libraries first, then internal modules)
- Limit file length (prefer splitting large files)

### Performance & Maintainability
- Avoid premature optimization, but write efficient code
- Use lazy loading for heavy components
- Implement proper caching strategies
- Write self-documenting code that reduces need for comments
- Keep functions small and testable (ideally under 20 lines)
- For state management, prefer using Zustand over React Context for global state

### Error Handling
- Fail fast with clear error messages
- Use try-catch blocks for async operations
- Validate inputs at function boundaries
- Log errors appropriately for debugging

### Testing
- Write unit tests for business logic
- Aim for high test coverage on critical paths
- Use descriptive test names that explain the scenario
- Keep tests simple and focused on one behavior

---

## Architecture
Our project follows a modular architecture pattern, separating concerns into distinct layers to enhance maintainability and scalability.

### Directory Responsibilities
Top-level (root):
- `client/` Meteor client entrypoint (`main.jsx`, global styles, static HTML shell). Only UI bootstrapping here; real code lives under `imports/`.
- `server/` Meteor server entrypoint (`main.js`). Only imports startup modules – keep it thin.
- `imports/` Core application source organized by concern (API, UI, hooks, lib, globals, startup, utils).
- `packages/` Local Meteor packages (e.g. `meteor-stale-session/`, `suprakit-ui/`). Treat these like external dependencies – prefer extending here only when logic is reusable across multiple apps.
- `public/` Static, publicly served assets (imgs, favicons). Never place secrets or build artifacts here.
- `private/` Assets loadable on the server only (e.g. email templates). Not directly web-accessible.
- `i18n/` Translation catalogs. The `standard/` and `supra/` directories layer domain or brand overrides on top of base `en/fr` files.
- `scripts/` One-off or build-time scripts (e.g. `generate-settings-docs.mjs`). These must be idempotent and side‑effect aware.
- `tests/` App-level integration or high-level tests (Mocha via Meteor test driver). Unit tests colocated near code when meaningful.
- `types/` Ambient TypeScript/JS type declarations (even though we prefer JS runtime code, we allow d.ts for editor help).

Inside `imports/`:
- `imports/api/<domain>/` A domain module: collection definition, methods, publications, and server-only logic.
  - `index.js` (or similarly named) should export the collection & shared constants used by both client & server.
  - `server/` strictly server-side files organized by concern:
    - `schema.js` Collection schema definition (SimpleSchema/Zod)
    - `methods/` Meteor methods organized by functionality
    - `publications.js` Server publications for reactive data
    - `collectionIndexes.js` Database index definitions
    - `queries/` Complex database queries and aggregations
    - `services/` Business logic services
    - `utils/` Domain-specific utility functions
    - `grapherLinks.js` & `grapherReducers.js` GraphQL-related configurations
    - `pipelines/` Data processing pipelines (when applicable)
- `imports/startup/`
  - `both/` Code imported on both client & server early (collection imports, settings load, logger config, schema setup).
  - `client/` Client-only startup (UI theme providers, route mounting, i18n setup, helpscout).
  - `server/` Server-only startup (collection imports, console setup, globals exposure, fake users, roles management, migrations, scheduled jobs, user accounts config).
- `imports/lib/` Cross-cutting library code (accounts helpers, password strength, zod wrapper, security helpers, custom collection wrapper). Must be pure or side-effect light; safe to import anywhere.
- `imports/hooks/` React hooks tied to Meteor (e.g. `useUser`, `useUserId`, `useUserRole`, `useGlobals`, `useTranslator`). New reactive data access patterns belong here rather than inside components.
- `imports/ui/` All React UI organized by type:
  - `components/` Pure/reusable components (GlobalsWrapper, etc.)
  - `layouts/` Layout components (DefaultLayout)
  - `pages/` Route-level page components (LoginPages, SettingsPage, UserInfoPage, UserManagementPage)
  - `modals/` Portal-based interactive surfaces
  - `forms/` Form-specific components
  Keep business logic out – delegate to hooks / utils.
- `imports/utils/` Generic, environment-aware helpers (permissions, role management, validated query helpers, integrations, user utilities, password validation). If a util becomes domain-specific, relocate into the domain folder under `imports/api/<domain>/`.
- `imports/globals/` Application-wide constants and configurations:
  - Global constants (emails, httpStatus, languages, roles, publicGlobals)
  - `server/globals/` Server-specific global configurations
- `imports/stores/` Zustand store definitions for client-side state management (example.store.js, i18n.store.js).
- `imports/jobs/` Job definitions for scheduled tasks (exampleJob.js, index.js).
- `imports/migrations/` Database migration scripts.
- `imports/routes/` Routing configuration (routes.jsx, routePaths.js, rerouting.js).

### Layering & Import Rules
1. UI (components/pages) ➜ may depend on hooks, utils, lib, globals, domain public exports – never directly on `server/` code or raw collections that require server-only concerns.
2. Hooks ➜ may depend on lib, utils, globals, and domain public exports (collections) but not on server-only code.
3. Domain server code (`imports/api/**/server/`) ➜ may depend on lib, utils. Avoid importing UI or hooks.
4. Startup code ➜ may import anything needed to register behavior, but must avoid triggering large UI trees on the server or causing circular domain loading.
5. Local packages (`packages/*`) should not reach back into `imports/` (to keep them portable). Instead, expose needed APIs in the package and have `imports/` consume them.

Enforce direction: `imports/api` (shared parts) is a lower layer than `imports/ui`; circular imports between domain modules are red flags – extract shared pieces into `imports/lib/` or `imports/utils/`.

### Collections & Data Flow
- Collections are declared in domain folders using `AHMongoCollection` (our wrapper around `Mongo.Collection`) and imported in startup modules to guarantee initialization order (schemas, helpers, transformers) before any publication/method consumption.
- Always attach schema/validators at declaration time in the domain's `server/schema.js`; do not mutate collection schemas later in ad-hoc files.
- Index definitions belong in the domain `server/collectionIndexes.js` and are imported from startup to run once at startup.
- Publications must explicitly restrict returned fields – never return entire documents if not required.
- Collections export only necessary constants & helpers from `imports/api/<domain>/index.js` for client-server shared access.

### Methods & Publications Conventions
- **Methods**: Use `jam:method` package with `checkRoles` helper function for all server methods.
- Method name pattern: `<CollectionName>.methods.<action>` (e.g. `Meteor.users.methods.updateProfile`). Avoid deep dotted namespaces.
- **Default Security**: All methods should have `open: false` by default, meaning users must be logged in to access them.
- **Public Methods**: If a method needs to be publicly accessible, create it in a dedicated `publicMethods/` folder with explicit naming and structure matching the regular `methods/` folder and use 'open: true'.
- **Async Operations**: ALL server operations must be asynchronous (database operations, Roles package calls, etc.). Use `await` consistently.
- **Publications**: Avoid publications for new collections or APIs. Only use them for legacy reasons when absolutely necessary.
- Validate arguments first (Zod/Yup/SimpleSchema or shared validators). Throw early with consistent error codes.
- Authorization second (role/permission helpers with `checkRoles`). Then perform database action.
- Return minimal shape required by caller (avoid leaking entire doc when only ID needed).

### State Management
- Use Zustand for global state management (preferred over React Context for performance).
- Keep component-level state local using React's `useState` and `useReducer`.
- **Tanstack Query for Server State**: Use Tanstack Query for all server-state management - never mix with local state.
- **Query Client Configuration**: Keep QueryClient configuration simple. Use defaults unless you have specific performance requirements.
- **Server State vs Client State**: Clearly separate server state (managed by Tanstack Query) from client state (Zustand/React state).
- Prefer custom hooks for complex state logic that can be reused across components.

### Settings Lifecycle
1. Define schema in `imports/settings/schema.mjs`.
2. Add any new keys to `settings.example.json` and regenerate docs (`scripts/generate-settings-docs.mjs` runs via `predev`).
3. Access settings through a small wrapper (add one if missing) instead of `Meteor.settings` sprinkled everywhere for easier refactors/testing.

### Internationalization
- Base keys live in `i18n/en.i18n.json` & `fr.i18n.json`.
- Layer-specific overrides (e.g. `standard/`, `supra/`) allow brand or product line customizations – keys must remain aligned; missing keys fallback to base locale.

### Adding a New Domain Feature (Checklist)
1. Create `imports/api/<NewDomain>/` with collection + schema.
2. Add server-only logic under `imports/api/<NewDomain>/server/` (methods using `jam:method`, avoid publications for new features, indexes).
3. **Methods Setup**: Use `jam:method` with `open: false` by default. Create `publicMethods/` folder only if public access needed.
4. **Async Operations**: Ensure all server operations (database, Roles calls) use `await` and are properly async.
5. Register collection in startup modules.
6. Expose only necessary constants / helpers from `imports/api/<NewDomain>/index.js`.
7. **Query & Mutation Setup**: Create query hooks using Tanstack Query with proper key patterns and cache invalidation strategies.
8. **Mutation Hooks**: Implement mutation hooks with optimistic updates and proper error handling/rollback.
9. Create hooks if UI needs reactive queries rather than placing logic in components.
10. Add UI page/component under `imports/ui/pages/` or `components/`.
11. **Navigation Setup (CRITICAL)**: 
    - Add route definition to `imports/routes/routePaths.js` with proper permissions
    - Add route to `imports/routes/routes.jsx` in authenticated routes
    - **Don't forget**: Add navigation link to `DefaultLayout.jsx` (topLinks) or `useAuthorizedLinks.js` (bottomLinks)
    - Configure role-based visibility and proper icons
    - **Always ask user if navigation setup is complete** - this step is commonly forgotten
12. Add tests: unit (lib/utils), method tests (happy + failure), query/mutation hook tests. Avoid publication tests for new features.
13. **Role Management**: Add any new roles to `imports/globals/roles.ts` and their globals to `imports/globals/server/globals.ts` - all roles must be defined in globals.
14. Add/Update permissions if access model changes.

### Anti-Patterns to Avoid
- Importing from `imports/api/**/server/` inside client bundles.
- Embedding validation logic directly inside React components (extract to schema / util / hook).
- Ad-hoc string role checks (`if (user.role === 'admin')`) – always use role helpers.
- **Creating methods without `jam:method`** or with `open: true` by default - all methods should be protected unless explicitly public.
- **Using synchronous operations** on the server - all database operations and Roles calls must be async with `await`.
- **Creating new publications** - avoid publications for new features, only use for legacy compatibility.
- **Forgetting to define roles** - all roles must be added to `imports/globals/roles.ts`.
- **Tanstack Query Anti-Patterns**:
  - Using vague or inconsistent query keys (avoid `['data']`, prefer `['users', 'list', { status: 'active' }]`)
  - Over-using `invalidateQueries()` instead of targeted `refetch()` for specific queries
  - Forgetting to update cache after mutations (no refetch, invalidation, or direct cache updates)
  - Not implementing optimistic updates for better UX
  - Mixing server state with local state in components
  - Over-configuring with custom `staleTime`, `gcTime` values without clear performance needs
  - Fetching data in components instead of using proper query hooks
- Over-publishing fields; default to explicit field lists.
- Creating circular startup imports – keep startup files declarative, minimal side effects.
- Using React Context for heavy global state (prefer Zustand).

### Execution Sequence (High-Level)
1. Meteor loads `server/main.js` ➜ imports startup modules.
2. Collections registered and schemas attached.
3. Indexes + publications + methods registered.
4. Client loads `client/main.jsx` ➜ imports client startup modules.
5. UI mounts, hooks begin reactive data subscriptions, methods invoked as needed.

---

## Project-Specific Business Logic Notes
These rules are specific to our application's domain and should be enforced during code reviews and development.

<!-- Add short bullets capturing business logic so AI reviewers can enforce them. -->