import React, { Component } from 'react';
import { toast } from 'react-toastify';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    toast.error("Ha ocurrido un error inesperado");
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI in Spanish
      return (
        <div>
          {this.props.children || <h2>Normal Component Render</h2>}
          <h2>Algo salió mal</h2>
          <p>Ha ocurrido un error inesperado</p>
          <button onClick={this.handleRetry}>Reintentar</button>
        </div>
      );

    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
