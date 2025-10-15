# DocLink Testing Suite

This directory contains the comprehensive testing suite for the DocLink project.

## Test Structure

```
tests/
├── unit/           # Unit tests for individual functions and utilities
├── components/     # Component tests for UI elements
└── integration/    # Integration tests for complex interactions
```

## Test Files

### Unit Tests

- `utils.test.js` - Tests for utility functions like `cn` (class name merger) and `getFridays` (date utility)

### Component Tests

- `Button.test.jsx` - Tests for the Button component including variants, sizes, and interactions

### Integration Tests

- `Appointments.test.jsx` - Tests for the Appointments page including filtering, searching, and status management

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Coverage

Current test coverage:

- **Statements**: 62.03%
- **Branches**: 33.09%
- **Functions**: 41.86%
- **Lines**: 64.14%

## Testing Framework

- **Jest**: Test runner and assertion library
- **React Testing Library**: For testing React components
- **@testing-library/jest-dom**: Additional Jest matchers for DOM testing
- **@testing-library/user-event**: For simulating user interactions

## Configuration

- `jest.config.js`: Jest configuration with Next.js integration
- `jest.setup.js`: Global test setup including React Testing Library configuration

## Key Features Tested

1. **Utility Functions**: Class name merging, date calculations
2. **UI Components**: Button variants, sizes, states, and interactions
3. **Appointment Management**: Filtering by status, time period, and search functionality
4. **User Interactions**: Click events, form inputs, and state changes

## Writing New Tests

When adding new tests:

1. Place unit tests in `tests/unit/`
2. Place component tests in `tests/components/`
3. Place integration tests in `tests/integration/`
4. Use descriptive test names and organize tests with `describe` blocks
5. Mock external dependencies and API calls
6. Use React Testing Library's `screen` queries for element selection
7. Test user interactions with `@testing-library/user-event`

## Mocking Strategy

- API calls are mocked using Jest's `jest.mock()`
- External dependencies are mocked to isolate unit tests
- Firebase and other services are mocked for component tests
- Test data is provided through mock implementations
