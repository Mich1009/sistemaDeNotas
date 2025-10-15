import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Actualiza el state para mostrar la UI de error
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Registra el error
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>

                        <div className="text-center">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Algo salió mal
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Ha ocurrido un error inesperado. Por favor, intenta recargar la página.
                            </p>

                            <button
                                onClick={this.handleRetry}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Reintentar
                            </button>
                        </div>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-4 p-4 bg-gray-100 rounded-md">
                                <summary className="cursor-pointer text-sm font-medium text-gray-700">
                                    Detalles del error (desarrollo)
                                </summary>
                                <pre className="mt-2 text-xs text-gray-600 overflow-auto">
                                    {this.state.error && this.state.error.toString()}
                                    <br />
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
