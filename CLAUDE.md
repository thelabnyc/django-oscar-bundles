# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

django-oscar-bundles is a Django extension for django-oscar (e-commerce framework) that provides product bundle functionality. It enables cart-triggered product recommendations:
- "User has bed + mattress → suggest sheet set"
- "Queen bed base → Queen mattress + medium pillow"
- User-configurable bundles where customers choose products from a range

## Monorepo Structure

This is a **monorepo with two distinct parts**:
- `server/` - Python/Django backend package (oscarbundles)
- `client/` - TypeScript/React frontend for dashboard UI

**Critical**: The client builds into `server/oscarbundles/static/oscarbundles/`. Always rebuild frontend after changes.

## Development Commands

**IMPORTANT**: All development commands MUST be run via Docker Compose. This ensures consistent environments and proper PostgreSQL setup.

### Backend Development

```bash
# Start all services (includes PostgreSQL, runs migrations)
docker compose up

# Run full test matrix (Python 3.12/3.13 × Django 4.2/5.1/5.2 × Oscar versions)
docker compose run --rm test uv run tox

# Run tests quickly (single environment)
docker compose run --rm test uv run python sandbox/manage.py test oscarbundles

# Run specific test
docker compose run --rm test uv run python sandbox/manage.py test oscarbundles.tests.test_api.TestClassName.test_method_name

# Type checking (strict mypy)
docker compose run --rm test uv run mypy oscarbundles sandbox

# Linting and formatting
docker compose run --rm test uv run ruff check .
docker compose run --rm test uv run ruff format .

# Start development server
docker compose up web

# Run Django management commands
docker compose run --rm test uv run python sandbox/manage.py <command>
```

### Frontend Development

```bash
# Build frontend for development
docker compose run --rm node webpack

# Watch mode for frontend (auto-rebuild on changes)
docker compose run --rm node webpack --watch

# Lint JavaScript/TypeScript code
docker compose run --rm node npm run lint

# Run frontend tests
docker compose run --rm node npm test

# Production build
docker compose run --rm node sh -c "NODE_ENV=production webpack"

# Build production assets (shortcut)
make statics
```

### Internationalization

```bash
# Generate .po/.mo files for i18n
make translations
```

## Architecture

### Core Models (server/oscarbundles/models.py)

1. **BundleGroup**: Container for bundles
   - Has configurable `bundle_type` (via `BUNDLE_GROUP_TYPES` setting)
   - Contains `triggering_parents` (products that trigger the bundle) and `suggested_parents` (products to recommend)
   - Can be temporarily disabled via `is_active` flag

2. **ConcreteBundle**: Fixed product recommendations
   - Triggers when specific product is in cart
   - Suggests specific products
   - Example: "Queen bed → Queen mattress"

3. **UserConfigurableBundle**: Range-based recommendations
   - Triggers when specific product is in cart
   - Suggests products from an Oscar Range
   - User chooses quantity
   - Example: "Bed → Choose 2 pillows from 'Pillow Range'"

### API Structure (server/oscarbundles/api/)

REST API endpoints (all responses cached for 15 minutes):
- `/api/bundlegrouptypes/` - Available bundle types
- `/api/bundlegroups/` - CRUD for bundle groups
- `/api/concretebundles/` - CRUD for concrete bundles
- `/api/userconfigurablebundles/` - CRUD for user configurable bundles
- `/api/products/<id>/concretebundles/` - Get bundles for product
- `/api/products/<id>/userconfigurablebundles/` - Get user bundles for product
- `/api/bundles/i18n.js` - Internationalization catalog (cached)

### Frontend Architecture (client/src/)

React-based SPA that integrates into Oscar dashboard:
- **Entry point**: `bundles.tsx`
- **Main component**: `BundleGroupTable` - Manages bundle groups
- **Form components**: `molecules/` directory - Edit forms with validation
- **Runtime validation**: Uses io-ts for type safety at runtime
- **Functional programming**: Leverages fp-ts for error handling and data transformations
- **Client-side search**: Uses lunr.js for filtering
- **Build output**: Compiled to `server/oscarbundles/static/oscarbundles/`

## Testing

### Python Tests
- **Framework**: Django's test framework with XMLTestRunner for CI
- **Coverage**: Tracked via coverage.py
- **Test matrix**: Tox tests against multiple Python/Django/Oscar combinations
- **Location**: `server/oscarbundles/tests/`

### JavaScript Tests
- **Framework**: Jest with jsdom environment
- **Testing Library**: @testing-library/react
- **Location**: `client/test/` and `__tests__/` directories

### Type Checking
- **Python**: MyPy in strict mode (100% type coverage goal)
- **TypeScript**: TypeScript compiler with strict settings
- Both run as part of test suite

## Code Patterns

### Django Patterns
- Uses Oscar's `OscarConfig` and `OscarDashboardConfig` for app configuration
- Leverages Oscar's dashboard navigation system for UI integration
- RESTful API design with Django REST Framework
- Type hints throughout using `django-stubs-ext`

### TypeScript Patterns
- **Functional programming**: Uses fp-ts for functional patterns
- **Runtime validation**: io-ts codecs validate API responses at runtime
- **Atomic design**: Components organized as molecules/organisms
- **React hooks**: Modern hooks-based state management
- Strong typing throughout with no implicit any

### Code Quality
- Pre-commit hooks enforce standards (configured in `.pre-commit-config.yaml`)
- Ruff for fast Python linting and formatting
- ESLint for JavaScript
- Commitizen enforces conventional commits
- All hooks must pass before commit

## Configuration

### Django Settings
- **BUNDLE_GROUP_TYPES**: Customize available bundle types
- **Caching**: API responses cached for 15 minutes by default
- **i18n**: English and Spanish translations available

### Build System
- **Webpack 5**: Bundles client code
- **PostCSS/SASS**: For styling
- **Babel**: Transpiles TypeScript/JSX
- **Output**: Client builds to `server/oscarbundles/static/oscarbundles/`

## CI/CD

- **Platform**: GitLab CI
- **Stages**: test, release
- **Test jobs**: Parallel matrix testing with coverage reporting
- **Release**: Automated via commitizen + TheLabNYC CI components
- **PyPI**: Automatic publishing on version tags

## Version Management

- **Tool**: Commitizen (configured in `.cz.toml`)
- **Format**: Conventional commits (enforced by pre-commit)
- **Current version**: Tracked in `server/pyproject.toml`
- **Tags**: Format is `v$version`
- **Changelog**: Auto-generated from commits

## Important Notes

- **All commands must be run via `docker compose`** - this ensures consistent environments and proper PostgreSQL setup
- Always rebuild frontend with `docker compose run --rm node webpack` after JavaScript/TypeScript changes
- API responses are cached - clear cache during development if needed
- Tox matrix ensures compatibility across Django/Oscar versions
- Pre-commit hooks will auto-format code - review changes before finalizing commit
- PostgreSQL is required for tests and is automatically provided by Docker Compose
