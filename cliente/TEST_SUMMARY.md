# Test Suite Documentation

## Overview
This document provides a comprehensive overview of the test suite for the Canchas Management System. The test suite covers unit tests, integration tests, and component tests for both frontend and backend functionality.

## Test Structure

### Authentication Tests
- `Login.test.jsx`: Tests for login functionality
  - Form validation
  - Authentication flow
  - Error handling
  - User feedback

- `Register.test.jsx`: Tests for registration functionality
  - Form validation
  - User creation
  - Error handling
  - Duplicate email prevention

- `AuthContext.test.jsx`: Tests for authentication context
  - State management
  - Token handling
  - Session persistence
  - Logout functionality

### Component Tests
- `Dashboard.test.jsx`: Tests for main dashboard
  - Data loading
  - Filtering
  - Sorting
  - Pagination
  - Admin controls

- `Header.test.jsx`: Tests for navigation header
  - Navigation links
  - Authentication state display
  - Responsive menu
  - User profile access

- `PrivateRoute.test.jsx`: Tests for route protection
  - Authentication checks
  - Redirect behavior
  - Route state preservation

- `ErrorBoundary.test.jsx`: Tests for error handling
  - Error capture
  - Fallback UI
  - Recovery mechanism

### Cancha Management Tests
- `AddCancha.test.jsx`: Tests for adding new canchas
  - Form validation
  - Data submission
  - Error handling
  - Success feedback

- `ListaCancha.test.jsx`: Tests for cancha listing
  - Data display
  - Filtering
  - Sorting
  - Delete functionality
  - Edit navigation

- `ActualizarCancha.test.jsx`: Tests for updating canchas
  - Data loading
  - Form validation
  - Update submission
  - Error handling

- `Reviews.test.jsx`: Tests for review system
  - Rating submission
  - Comment handling
  - Display logic
  - User permissions

### API Integration Tests
- `api.test.js`: Tests for API service layer
  - Authentication endpoints
  - Cancha operations
  - Review management
  - Error handling

## Running Tests

### Prerequisites
Ensure all dependencies are installed:
```bash
npm install
```

### Running All Tests
```bash
npm test
```

### Running Specific Tests
```bash
# Run authentication tests
npm test Login
npm test Register
npm test AuthContext

# Run component tests
npm test Dashboard
npm test Header
npm test PrivateRoute

# Run cancha management tests
npm test AddCancha
npm test ListaCancha
npm test ActualizarCancha
```

### Coverage Report
Generate a coverage report:
```bash
npm test -- --coverage
```

## Test Coverage Goals

The test suite aims to maintain:
- Minimum 80% line coverage
- Minimum 70% branch coverage
- Minimum 90% function coverage

### Key Areas Covered
1. User Authentication
   - Login/Logout flow
   - Registration process
   - Session management
   - Authorization checks

2. Cancha Management
   - CRUD operations
   - Form validations
   - Data persistence
   - Error handling

3. Review System
   - Rating submission
   - Comment management
   - User permissions
   - Data validation

4. UI Components
   - Responsive behavior
   - User interactions
   - State management
   - Error boundaries

## Best Practices

1. Test Organization
   - Group related tests using describe blocks
   - Use clear, descriptive test names
   - Follow AAA pattern (Arrange, Act, Assert)

2. Mocking
   - Mock external dependencies
   - Use consistent mock data
   - Reset mocks between tests

3. Assertions
   - Test both success and failure cases
   - Verify component state
   - Check user feedback
   - Validate form interactions

4. Error Handling
   - Test error scenarios
   - Verify error messages
   - Check recovery mechanisms

## Maintenance

### Adding New Tests
1. Create test file in appropriate `__tests__` directory
2. Import required dependencies and components
3. Mock external services
4. Write test cases following existing patterns
5. Update this documentation

### Updating Tests
1. Review affected test files
2. Update test cases as needed
3. Verify coverage remains above minimum thresholds
4. Update documentation if necessary

## Continuous Integration
Tests are automatically run in the CI pipeline:
- On pull requests
- Before deployment
- Nightly builds

## Troubleshooting

Common Issues:
1. Test timeouts
   - Increase timeout in jest.config.js
   - Check for async operations

2. Mock failures
   - Verify mock implementation
   - Check mock reset between tests

3. Coverage issues
   - Review uncovered code paths
   - Add missing test cases
