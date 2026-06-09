---
story_key: e0-3-database-schema-category-seed
epic: 0
status: review
baseline_commit: NO_VCS
---

# Story E0-3: Persistence Layer Foundation

## Story

As a **developer**, I need the Kitab persistence layer wired with SQL Server, EF Core, ASP.NET Identity, and JWT authentication so that upcoming authentication and data features can build on a working database foundation.

## Acceptance Criteria

- [x] `ApplicationDbContext` uses SQL Server and EF Core
- [x] ASP.NET Identity user and role types are available
- [x] Domain user entity is mapped to the database
- [x] Role configuration is applied through EF Core model configuration
- [x] Infrastructure dependency injection registers DbContext, Identity, authorization, and JWT bearer authentication
- [x] Initial EF Core migration exists and can apply successfully

## Tasks / Subtasks

- [x] Create `ApplicationDbContext`
- [x] Create Identity user and Identity role
- [x] Create domain `User` entity
- [x] Create role and user EF configurations
- [x] Register persistence, Identity, and JWT authentication in dependency injection
- [x] Generate and validate initial migration
- [x] Add regression coverage for infrastructure service registration

## Dev Notes

- Target framework: `net8.0`
- SQL Server remains the configured provider.
- The domain `Users` table is distinct from the Identity `AspNetUsers` table and links by `IdentityUserId`.
- RBAC seed data is deferred to E0-4.

## Dev Agent Record

### Implementation Plan

- Add Identity-aware EF Core context in Infrastructure
- Keep Identity persistence concerns in Infrastructure and expose registration via `AddInfrastructure`
- Add JWT bearer authentication using appsettings configuration
- Generate an initial migration and validate against SQL Server LocalDB

### Completion Notes

- Added `ApplicationDbContext` inheriting from `IdentityDbContext<ApplicationUser, ApplicationRole, Guid>`.
- Added `ApplicationUser`, `ApplicationRole`, `JwtOptions`, and domain `User`.
- Added EF configurations for roles and domain users, including one-to-one link to Identity users.
- Registered SQL Server DbContext, Identity managers/stores, JWT bearer authentication, and authorization in Infrastructure DI.
- Generated `InitialCreate` migration and applied it successfully to SQL Server LocalDB database `KitabDb_E03_MigrationValidation`.
- Final regression suite passes: 3 tests.
- Note: Applying to the configured `localhost,1433` database initially failed because SQL Server was not running there; Docker is not available on PATH in this environment.

## File List

- src/Kitab.Domain/Entities/User.cs
- src/Kitab.Infrastructure/Kitab.Infrastructure.csproj
- src/Kitab.Infrastructure/DependencyInjection.cs
- src/Kitab.Infrastructure/Identity/ApplicationUser.cs
- src/Kitab.Infrastructure/Identity/ApplicationRole.cs
- src/Kitab.Infrastructure/Identity/JwtOptions.cs
- src/Kitab.Infrastructure/Persistence/ApplicationDbContext.cs
- src/Kitab.Infrastructure/Persistence/Configurations/ApplicationRoleConfiguration.cs
- src/Kitab.Infrastructure/Persistence/Configurations/UserConfiguration.cs
- src/Kitab.Infrastructure/Persistence/Migrations/20260609115522_InitialCreate.cs
- src/Kitab.Infrastructure/Persistence/Migrations/20260609115522_InitialCreate.Designer.cs
- src/Kitab.Infrastructure/Persistence/Migrations/ApplicationDbContextModelSnapshot.cs
- src/Kitab.API/Kitab.API.csproj
- src/Kitab.API/Program.cs
- src/Kitab.API/appsettings.json
- tests/Kitab.API.Tests/InfrastructureRegistrationTests.cs

## Change Log

- 2026-06-09: Implemented persistence foundation with SQL Server EF Core, ASP.NET Identity, JWT authentication wiring, initial migration, and infrastructure registration tests.
