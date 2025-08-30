import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: LogRocket, Sentry, etc.
      // logErrorToService(error, errorInfo);
    }
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-rock-black text-rock-cream flex items-center justify-center p-4">
          <div className="max-w-2xl w-full text-center">
            {/* Error Icon with Rock Theme */}
            <div className="mb-8 relative">
              <div className="w-32 h-32 mx-auto bg-rock-rust rounded-full flex items-center justify-center border-4 border-rock-amber animate-pulse">
                <AlertTriangle size={64} className="text-rock-amber" />
              </div>
              {/* Stage lights effect */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 w-40 h-40 bg-rock-amber rounded-full blur-3xl opacity-20 animate-pulse"></div>
            </div>

            {/* Error Message */}
            <h1 className="font-edgy text-4xl md:text-6xl font-black mb-6 text-rock-amber rock-text-shadow">
              TECHNICAL DIFFICULTIES
            </h1>
            <h2 className="font-rock text-2xl md:text-3xl font-bold mb-8 text-rock-rust">
              The show must go on...
            </h2>
            
            <div className="bg-rock-charcoal border-2 border-rock-steel p-6 rounded-none mb-8">
              <p className="font-hipster text-lg text-rock-smoke mb-4">
                Something went wrong backstage. Our sound engineers are working to fix the issue.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left mt-4">
                  <summary className="font-rock text-rock-amber cursor-pointer hover:text-rock-rust transition-colors">
                    🔧 Technical Details (Development)
                  </summary>
                  <div className="mt-4 p-4 bg-rock-black border border-rock-steel rounded font-mono text-sm text-rock-smoke">
                    <div className="mb-2">
                      <strong className="text-rock-rust">Error:</strong> {this.state.error.message}
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong className="text-rock-rust">Stack:</strong>
                        <pre className="mt-2 text-xs overflow-auto max-h-40 text-rock-ash">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={this.handleRefresh}
                className="bg-rock-amber text-rock-black font-rock font-bold text-lg px-8 py-4 rounded-none border-2 border-rock-rust hover:bg-rock-rust hover:text-rock-cream transition-all duration-300 amp-glow"
              >
                <RefreshCw size={20} className="mr-2" />
                🔄 RESTART THE SHOW
              </Button>
              
              <Button
                onClick={this.handleGoHome}
                className="bg-rock-charcoal text-rock-amber font-rock font-bold text-lg px-8 py-4 rounded-none border-2 border-rock-amber hover:border-rock-rust hover:bg-rock-slate transition-all duration-300"
              >
                <Home size={20} className="mr-2" />
                🏠 BACK TO MAIN STAGE
              </Button>
            </div>

            {/* Contact Information */}
            <div className="mt-12 text-center">
              <p className="font-hipster text-rock-smoke mb-2">
                Still having issues? Let our roadies know:
              </p>
              <a 
                href="/contact" 
                className="text-rock-amber hover:text-rock-rust transition-colors font-rock font-bold underline"
              >
                📧 Contact Technical Support
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
