import { Alert, Button } from '@mui/material';
import { useState, Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Component Error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Alert severity="error" action={
          <Button color="inherit" onClick={this.handleRetry}>
            Retry
          </Button>
        }>
          Error: {this.state.error.message}
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;