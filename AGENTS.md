# Contributing to Luminexis

Thank you for your interest in contributing to Luminexis! This document provides guidelines for AI agents and developers.

## Development Setup

```bash
# Clone the repository
git clone https://github.com/dotjumpdot/luminexis.git
cd luminexis

# Install dependencies (using Bun)
bun install

# Build the project
bun run build

# Run tests
bun run test

# Run linter
bun run lint
```

## Project Structure

```
src/
├── Luminexis.ts          # Main entry point
└── core/
    ├── types.ts          # TypeScript interfaces
    ├── timeParser.ts     # Time parsing utilities
    ├── eventEmitter.ts   # Event emitter implementation
    └── whitelist.ts      # Whitelist utility functions

test/                     # Jest test files
```

## Coding Standards

### TypeScript

- Use strict TypeScript settings
- All public methods must have return types
- Use interfaces for configuration objects
- Avoid `any` type when possible

### Code Style

- Use single quotes for strings
- 2 spaces for indentation
- No trailing semicolons (except where required)
- Maximum line length: 100 characters

### Naming Conventions

- Classes: `PascalCase`
- Methods and properties: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Interfaces: `PascalCase`
- Files: `camelCase.ts` or `PascalCase.ts` for classes

## Testing

- All new features must have tests
- Maintain 80%+ code coverage
- Use descriptive test names
- Group related tests with `describe` blocks

```typescript
describe("Feature Name", () => {
  it("should do something specific", () => {
    // Test implementation
  });
});
```

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes with tests
3. Ensure all tests pass: `bun run test`
4. Ensure linting passes: `bun run lint`
5. Update documentation if needed
6. Submit pull request with clear description

## Release Process

```bash
# Update version in package.json
# Update CHANGELOG.md
bun run build
bun run test
bun publish
```

## Commit Message Format

```
type(scope): subject

body

footer
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting changes
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

## Questions?

Open an issue on GitHub for any questions or concerns.
