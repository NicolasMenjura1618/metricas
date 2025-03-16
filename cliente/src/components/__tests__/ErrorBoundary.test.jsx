import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from '../ErrorBoundary';

// Component that throws an error
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Normal Component Render</div>;
};

// Suppress console.error for expected errors
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe('ErrorBoundary Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.queryByText(/algo salió mal/i)).not.toBeInTheDocument();
  });

  test('renders error UI when child component throws', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/algo salió mal/i)).toBeInTheDocument();
    expect(screen.getByText(/ha ocurrido un error inesperado/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument();
  });

  test('resets error state when retry button is clicked', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/algo salió mal/i)).toBeInTheDocument();

    // Click retry button
    fireEvent.click(screen.getByRole('button', { name: /reintentar/i }));

    // Update props to not throw error
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal Component Render')).toBeInTheDocument();
    expect(screen.queryByText(/algo salió mal/i)).not.toBeInTheDocument();
  });

  test('captures different types of errors', () => {
    const errors = [
      { message: 'TypeError', error: new TypeError('Type error test') },
      { message: 'ReferenceError', error: new ReferenceError('Reference error test') },
      { message: 'Custom Error', error: new Error('Custom error test') }
    ];

    errors.forEach(({ error }) => {
      const ErrorComponent = () => {
        throw error;
      };

      const { unmount } = render(
        <ErrorBoundary>
          <ErrorComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText(/algo salió mal/i)).toBeInTheDocument();
      unmount();
    });
  });

  test('handles nested errors', () => {
    const NestedComponent = () => {
      throw new Error('Nested error');
    };

    const ParentComponent = () => (
      <div>
        <NestedComponent />
      </div>
    );

    render(
      <ErrorBoundary>
        <ParentComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(/algo salió mal/i)).toBeInTheDocument();
  });

  test('preserves error boundary state across renders', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/algo salió mal/i)).toBeInTheDocument();

    // Rerender with same error state
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/algo salió mal/i)).toBeInTheDocument();
  });

  test('error boundary catches async errors in effects', async () => {
    const AsyncErrorComponent = () => {
      React.useEffect(() => {
        throw new Error('Async error');
      }, []);
      return <div>Async Component</div>;
    };

    render(
      <ErrorBoundary>
        <AsyncErrorComponent />
      </ErrorBoundary>
    );

    // Error boundary should catch the error and display fallback UI
    expect(screen.getByText(/algo salió mal/i)).toBeInTheDocument();
  });

  test('displays custom error message when provided', () => {
    const customError = new Error('Custom error message');
    const CustomErrorComponent = () => {
      throw customError;
    };

    render(
      <ErrorBoundary>
        <CustomErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(/algo salió mal/i)).toBeInTheDocument();
    expect(screen.getByText(/ha ocurrido un error inesperado/i)).toBeInTheDocument();
  });
});
