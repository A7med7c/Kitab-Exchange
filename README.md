# Kitab Exchange

Kitab Exchange is a full-stack book marketplace and swapping platform built with **ASP.NET Core 8** and **Angular 20**.  
Users can list books for sale or exchange, browse listings, manage wishlists, and send contact/exchange requests.  
Admins can moderate listings and manage categories.

## Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Core Features](#core-features)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Endpoints Summary](#api-endpoints-summary)
- [Testing](#testing)
- [Known Notes](#known-notes)

## Project Overview
- **Frontend**: Angular single-page application in `kitab-web`
- **Backend API**: ASP.NET Core Web API in `src/Kitab.API`
- **Application Layer**: CQRS (MediatR), validation (FluentValidation), mapping (AutoMapper)
- **Infrastructure Layer**: Entity Framework Core + ASP.NET Core Identity + JWT auth
- **Database**: SQL Server with EF Core migrations and startup seeding

## Tech Stack
### Backend
- .NET 8
- ASP.NET Core Web API
- Entity Framework Core (SQL Server)
- ASP.NET Core Identity
- JSON Web Tokens (JWT)
- MediatR + FluentValidation + AutoMapper
- Swagger/OpenAPI (Development environment)

### Frontend
- Angular 20 (standalone components)
- Angular Material + Bootstrap 5
- ngx-translate (English/Arabic localization)
- Vitest (unit testing)

## Architecture
The backend follows a layered architecture:
- **Kitab.Domain**: core entities and enums
- **Kitab.Application**: use cases, commands/queries, validation, DTOs, interfaces
- **Kitab.Infrastructure**: persistence, identity, repositories, image storage, dependency wiring
- **Kitab.API**: controllers, middleware, Swagger setup, CORS, composition root

Application startup (`Program.cs`) registers services, enables JWT auth, CORS, static files, and runs data seeding + migrations automatically.

## Core Features
### Authentication & Authorization
- Register, login, token refresh
- JWT-protected endpoints
- Role-based access (`Admin`, `User`)
- Current user profile endpoint

### Listings
- Create, update, delete, and browse book listings
- Filter/search by term, condition, listing type, and price range
- Upload listing images (JPG/JPEG/PNG/WEBP, up to 5 MB)
- Personal “my listings” view

### Categories
- List categories for all users
- Admin CRUD operations for categories

### Contact & Exchange Requests
- Send contact requests or exchange requests for listings
- View incoming/outgoing requests
- Accept or reject requests

### Wishlist
- Add/remove listings to wishlist
- List wishlist entries
- Check if a listing is wishlisted

### Admin
- Dashboard statistics
- Listings moderation endpoints

### Localization & UX
- English and Arabic language support
- Notification service integration in frontend
- Dedicated pages: Home, About, Contact, FAQ, Dashboard, Requests, Wishlist, Admin

## Repository Structure
```text
.
├── src/
│   ├── Kitab.API
│   ├── Kitab.Application
│   ├── Kitab.Domain
│   └── Kitab.Infrastructure
├── tests/
│   └── Kitab.API.Tests
├── kitab-web/
│   └── (Angular application)
├── docker-compose.yml
└── Kitab.sln
```

## Getting Started
### Prerequisites
- .NET SDK 8.0+
- Node.js (with npm)
- SQL Server (local instance) **or** Docker

### 1) Start SQL Server (Option A: Docker)
From repository root:
```bash
docker compose up -d
```
This starts SQL Server 2022 on `localhost:1433`.

### 2) Run the Backend API
From repository root:
```bash
dotnet restore Kitab.sln
dotnet run --project src/Kitab.API/Kitab.API.csproj
```

Default development URLs (from launch settings):
- `https://localhost:7161`
- `http://localhost:5247`

Swagger UI (development):  
`https://localhost:7161/swagger`

### 3) Run the Frontend
```bash
cd kitab-web
npm ci
npm start
```
Frontend default URL: `http://localhost:4200`

The Angular development environment points API requests to:
- `https://localhost:7161/api`

## Configuration
### Backend
Main settings file:
- `src/Kitab.API/appsettings.json`

Important keys:
- `ConnectionStrings:DefaultConnection`
- `Jwt:Issuer`
- `Jwt:Audience`
- `Jwt:SigningKey`
- `Jwt:ExpirationMinutes`

### Seeded Development Data
On startup, migrations and seeders run automatically (`DataSeeder.SeedAsync`):
- Roles: `Admin`, `User`
- Initial categories list
- Admin account:
  - Email: `admin@kitab.com`
  - Password: see `src/Kitab.Infrastructure/Persistence/DataSeeder.cs`

> ⚠️ The seeded admin password is defined in `src/Kitab.Infrastructure/Persistence/DataSeeder.cs` for local development bootstrap only.  
> Change it before using the project outside local development.

### Frontend
Environment files:
- `kitab-web/src/environments/environment.development.ts`
- `kitab-web/src/environments/environment.prod.ts`

Includes:
- API base URL
- Assets base URL
- Localization defaults (`en`, `ar`)

## API Endpoints Summary
Base API route prefix: `/api`

### Health & Diagnostics
- `GET /api/Health`
- `GET /api/Diagnostics/throw`

### Authentication
- `POST /api/Auth/register`
- `POST /api/Auth/login`
- `POST /api/Auth/refresh`
- `GET /api/Auth/me`
- `POST /api/Auth/roles` (Admin)

### Listings
- `GET /api/Listings`
- `GET /api/Listings/mine`
- `GET /api/Listings/search`
- `GET /api/Listings/{id}`
- `POST /api/Listings`
- `PUT /api/Listings/{id}`
- `DELETE /api/Listings/{id}`
- `POST /api/Listings/upload-image`

### Categories
- `GET /api/Categories`
- `POST /api/Categories` (Admin)
- `PUT /api/Categories/{id}` (Admin)
- `DELETE /api/Categories/{id}` (Admin)

### Contact Requests
- `GET /api/ContactRequests/incoming`
- `GET /api/ContactRequests/outgoing`
- `POST /api/ContactRequests`
- `POST /api/ContactRequests/{id}/accept`
- `POST /api/ContactRequests/{id}/reject`

### Wishlist
- `POST /api/Wishlist/{listingId}`
- `DELETE /api/Wishlist/{listingId}`
- `GET /api/Wishlist`
- `GET /api/Wishlist/check/{listingId}`

### Admin
- `GET /api/Admin/dashboard`
- `GET /api/Admin/listings`
- `DELETE /api/Admin/listings/{id}`

## Testing
### Backend tests
```bash
dotnet test Kitab.sln
```

### Frontend tests
```bash
cd kitab-web
npm run test -- --watch=false
```

## Known Notes
- Backend integration tests require SQL Server availability and valid connection settings.
- Production Angular builds may require internet access for external font inlining (`fonts.googleapis.com`) unless fonts are bundled locally.
