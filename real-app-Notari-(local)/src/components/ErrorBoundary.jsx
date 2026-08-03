import React from 'react';

/**
 * React Error Boundary Component
 * Catches JavaScript errors anywhere in child component tree,
 * logs errors, and renders a fallback UI instead of crashing into a blank screen.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught a runtime exception:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div 
          style={{
            padding: '40px 24px',
            maxWidth: '600px',
            margin: '60px auto',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            border: '1px solid #ea4335',
            color: '#202124',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 12px', color: '#d93025' }}>
            Application Error Caught
          </h2>
          <p style={{ fontSize: '14px', color: '#5f6368', margin: '0 0 20px', lineHeight: '1.5' }}>
            A runtime exception occurred in the application view. The Error Boundary prevented a blank screen collapse.
          </p>

          {this.state.error && (
            <div 
              style={{
                padding: '12px',
                backgroundColor: '#fce8e6',
                borderRadius: '8px',
                color: '#c5221f',
                fontSize: '12px',
                fontFamily: 'monospace',
                textAlign: 'left',
                overflowX: 'auto',
                marginBottom: '20px'
              }}
            >
              {this.state.error.toString()}
            </div>
          )}

          <button
            onClick={this.handleReset}
            style={{
              backgroundColor: '#1a73e8',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(26,115,232,0.3)'
            }}
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
