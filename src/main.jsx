import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';

class RootErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('RootErrorBoundary caught error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleClearCacheAndReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: '#f8fafc',
          fontFamily: "'Inter', sans-serif",
          color: '#1e293b',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 8px', color: '#0f172a' }}>
            काहीतरी त्रुटी आढळली / Something went wrong
          </h2>
          <p style={{ fontSize: '13.5px', color: '#64748b', maxWidth: '420px', margin: '0 0 20px', lineHeight: '1.5' }}>
            {this.state.error?.message || 'अपेक्षित डेटा लोड करताना त्रुटी आली. कृपया खालील बटण दाबून रीफ्रेश करा.'}
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={this.handleReload}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                fontWeight: '700',
                fontSize: '13.5px',
                cursor: 'pointer'
              }}
            >
              🔄 रीफ्रेश करा (Refresh)
            </button>
            <button
              onClick={this.handleClearCacheAndReload}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                background: '#f1f5f9',
                color: '#475569',
                border: '1.5px solid #cbd5e1',
                fontWeight: '700',
                fontSize: '13.5px',
                cursor: 'pointer'
              }}
            >
              🧹 कॅश साफ करा (Clear Cache)
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </RootErrorBoundary>
  </React.StrictMode>
);
