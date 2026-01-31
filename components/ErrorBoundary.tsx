"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Catches React render errors in children and shows fallback UI.
 * Does not catch event handlers or async errors.
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div
          className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-8 text-center"
          role="alert"
        >
          <h2 className="text-lg font-semibold text-red-800">
            Something went wrong
          </h2>
          <p className="mt-2 text-sm text-red-700">
            {this.state.error.message}
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={this.handleRetry}
            className="mt-4 border-red-300 text-red-800 hover:bg-red-100"
          >
            Try again
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
