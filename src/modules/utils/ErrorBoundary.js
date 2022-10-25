import React from 'react';
import PropTypes from 'prop-types';

import Alert from '@modules/ui/Alert';

/**
 * As of v16.2.0, there's no way to turn a functional component
 * into an error boundary.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {error: null, errorInfo: null};
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <div className="container mx-auto my-8 font-inter">
          <h1 className="text-2xl">Something went wrong</h1>

          <Alert level="error">
            {this.state.error && this.state.error.toString()}
          </Alert>

          <details className="py-6 px-0 whitespace-pre-wrap	">
            <p>{this.state.errorInfo.componentStack}</p>
          </details>
        </div>
      );
    }
    // Render children if there's no error
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  //React node children
  children: PropTypes.node
};

export default ErrorBoundary;
