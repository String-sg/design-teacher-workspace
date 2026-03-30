import React from 'react';

import { Button } from '~/shared/components/ui/button';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-4 p-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground">Something went wrong</h2>
            <p className="mt-2 text-muted-foreground">
              An unexpected error occurred. Please try again.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre className="mt-4 max-w-xl overflow-auto rounded-md bg-muted p-4 text-left text-sm">
                {this.state.error.message}
              </pre>
            )}
          </div>
          <Button onClick={this.handleReset}>Try again</Button>
        </div>
      );
    }

    return this.props.children;
  }
}
