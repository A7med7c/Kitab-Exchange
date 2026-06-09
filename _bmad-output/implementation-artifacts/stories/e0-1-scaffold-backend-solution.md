---
story_key: e0-1-scaffold-backend-solution
epic: 0
status: review
baseline_commit: NO_VCS
---

# Story E0-1: Scaffold Backend Solution

## Story

As a **developer**, I need the Kitab .NET solution scaffolded with Clean Architecture (Domain, Application, Infrastructure, API), MediatR, EF Core, AutoMapper, FluentValidation, and Swagger, so that all features follow a consistent technical foundation.

## Acceptance Criteria

- [x] `Kitab.sln` contains Domain, Application, Infrastructure, and API projects with correct references
- [x] MediatR, EF Core SqlServer, Swashbuckle, and FluentValidation packages installed
- [x] `docker-compose.yml` provides SQL Server for local development
- [x] API runs and Swagger UI is available at `/swagger`
- [x] Global exception middleware returns RFC 7807 ProblemDetails

## Tasks / Subtasks

- [x] Create solution and four projects with references
- [x] Install NuGet packages per architecture doc
- [x] Add Domain base types and Application pipeline behaviors
- [x] Add Infrastructure DI stub and API Program.cs with Swagger + CORS
- [x] Add ExceptionHandlingMiddleware (ProblemDetails)
- [x] Add docker-compose.yml for SQL Server
- [x] Add health endpoint and verify build + swagger

## Dev Notes

- Target framework: `net8.0` (per architecture; SDK 10 compatible)
- Project references: Domain ← Application ← Infrastructure ← API
- Do NOT implement auth/EF entities in this story (E0-3, E0-5)

## Dev Agent Record

### Implementation Plan

- Scaffold four-layer Clean Architecture under `src/` with `Kitab.sln` + `Kitab.slnx`
- Pin NuGet packages to net8-compatible versions (EF Core 8.x, MediatR 12.x, Swashbuckle 6.5.x)
- Wire MediatR + FluentValidation pipeline, Swagger, CORS, and RFC 7807 exception middleware
- Add integration tests for health and ProblemDetails endpoints

### Completion Notes

- ✅ Solution builds cleanly; API starts on `http://localhost:5050` with Swagger at `/swagger`
- ✅ `docker-compose.yml` provides SQL Server 2022 on port 1433 with healthcheck
- ✅ `ExceptionHandlingMiddleware` returns `application/problem+json` (verified via integration test)
- ✅ 2 integration tests pass (`HealthEndpointTests`)
- ⚠️ AutoMapper 12.0.1 reports NU1903 advisory (version pinned for DI extensions compatibility; upgrade in later story if needed)

## File List

- Kitab.sln
- Kitab.slnx
- docker-compose.yml
- src/Kitab.Domain/Kitab.Domain.csproj
- src/Kitab.Domain/Common/BaseEntity.cs
- src/Kitab.Application/Kitab.Application.csproj
- src/Kitab.Application/DependencyInjection.cs
- src/Kitab.Application/Common/Behaviours/ValidationBehaviour.cs
- src/Kitab.Application/Common/Exceptions/NotFoundException.cs
- src/Kitab.Application/Common/Exceptions/ValidationException.cs
- src/Kitab.Application/Common/Models/Result.cs
- src/Kitab.Application/Health/Queries/GetHealthQuery.cs
- src/Kitab.Infrastructure/Kitab.Infrastructure.csproj
- src/Kitab.Infrastructure/DependencyInjection.cs
- src/Kitab.API/Kitab.API.csproj
- src/Kitab.API/Program.cs
- src/Kitab.API/appsettings.json
- src/Kitab.API/Middleware/ExceptionHandlingMiddleware.cs
- src/Kitab.API/Controllers/HealthController.cs
- src/Kitab.API/Controllers/DiagnosticsController.cs
- tests/Kitab.API.Tests/Kitab.API.Tests.csproj
- tests/Kitab.API.Tests/HealthEndpointTests.cs

## Change Log

- 2026-06-09: Scaffolded Kitab backend solution (Clean Architecture, MediatR, EF Core packages, Swagger, ProblemDetails middleware, docker-compose, health endpoint, integration tests)
