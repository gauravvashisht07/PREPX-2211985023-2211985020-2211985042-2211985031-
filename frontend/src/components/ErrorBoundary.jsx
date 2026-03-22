import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 16, padding: 24, textAlign: 'center',
        }}>
          <div style={{ fontSize: '4rem' }}>💥</div>
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '1.5rem' }}>Something went wrong</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 400 }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button className="btn btn-primary" onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}>
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
