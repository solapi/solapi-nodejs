# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SOLAPI SDK for Node.js - A server-side SDK for sending SMS, LMS, MMS, and Kakao messages (Alimtalk/Friendtalk) in Korea. Compatible with SOLAPI family services (CoolSMS, etc).

## Commands

```bash
# Development
pnpm dev              # Watch mode with tsup
pnpm build            # Lint + build (production)
pnpm lint             # Biome check with auto-fix

# Testing
pnpm test             # Run all tests once
pnpm test:watch       # Watch mode
pnpm vitest run <path>  # Run specific test file

# Documentation
pnpm docs             # Generate TypeDoc documentation
```

## Architecture

### Entry Point & Service Facade
`SolapiMessageService` (src/index.ts) is the main SDK entry point. It aggregates all domain services and exposes their methods via delegation pattern using `bindServices()`.

### Service Layer
All services extend `DefaultService` (src/services/defaultService.ts) which provides:
- Base URL configuration (https://api.solapi.com)
- Authentication handling via `AuthenticationParameter`
- HTTP request abstraction via `defaultFetcher`

Domain services:
- `MessageService` / `GroupService` - Message sending and group management
- `KakaoChannelService` / `KakaoTemplateService` - Kakao Alimtalk integration
- `CashService` - Balance inquiries
- `IamService` - Block lists and 080 rejection management
- `StorageService` - File uploads (images, documents)

### Effect Library Integration
This project uses the **Effect** library for functional programming and type-safe error handling:

- All errors extend `Data.TaggedError` with environment-aware `toString()` methods
- Use `Effect.gen` for complex business logic
- Use `pipe` with `Effect.flatMap` for data transformation chains
- Schema validation via Effect Schema for runtime type safety
- Convert Effect to Promise using `runSafePromise` for API compatibility

### Path Aliases
```
@models     → src/models
@lib        → src/lib
@services   → src/services
@errors     → src/errors
@internal-types → src/types
@           → src
```

## Code Style Requirements

### TypeScript
- **Never use `any` type** - use `unknown` with type guards, union types, or Effect Schema
- Prefer functional programming style with Effect library
- Run lint after writing code

### TDD Approach
- Follow Red → Green → Refactor cycle
- Separate structural changes from behavioral changes in commits
- Only commit when all tests pass

### Error Handling
- Define errors as Effect Data types (`Data.TaggedError`)
- Provide concise messages in production, detailed in development
- Use structured logging with environment-specific verbosity

## Sub-Agents

### tidy-first
Refactoring specialist applying Kent Beck's "Tidy First?" principles.

**Auto-invocation conditions**:
- Adding new features or functionality
- Implementing new behavior
- Code review requests
- Refactoring tasks

**Core principles**:
- Always separate structural changes from behavioral changes
- Make small, reversible changes only (minutes to hours)
- Maintain test coverage

**Tidying types**: Guard Clauses, Dead Code removal, Pattern normalization, Function extraction, Readability improvements

Works alongside the TDD Approach section's "Separate structural changes from behavioral changes" principle.
