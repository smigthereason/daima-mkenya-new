'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      errorMessage: ''
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true,
      errorMessage: error.message || 'Unknown error'
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Check if it's the React DevTools extension error
    const isDevToolsError = 
      errorInfo.componentStack?.includes('fmkadmapgofadopljbjfkapdkoienihi') ||
      error.message?.includes('fmkadmapgofadopljbjfkapdkoienihi') ||
      error.message?.includes('children should not have changed');
    
    if (isDevToolsError) {
      // Log silently or to a service
      console.log('React DevTools extension error suppressed');
      
      // Optionally send to your analytics/monitoring service
      // analytics.logError('devtools_extension_error', { error: error.message });
      
      return; // Don't show error UI for DevTools issues
    }
    
    // Log real errors to your monitoring service
    console.error('Application error:', error, errorInfo);
    // analytics.logError('app_error', { error: error.message, stack: errorInfo.componentStack });
  }

  render() {
    if (this.state.hasError) {
      // Check if it's a DevTools error (we already logged it in componentDidCatch)
      if (this.state.errorMessage.includes('fmkadmapgofadopljbjfkapdkoienihi') ||
          this.state.errorMessage.includes('children should not have changed')) {
        // For DevTools errors, try to recover by showing a minimal UI
        // or just return null to let the app continue
        return this.props.children; // Attempt to continue rendering
      }
      
      // For real errors, show fallback UI
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-lg font-bold mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-600 mb-4">Please refresh the page</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-black text-white text-sm uppercase tracking-wider"
            >
              Refresh
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;