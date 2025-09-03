import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App crashed:', error, errorInfo);
    // 👉 Gửi error lên Sentry, Datadog, v.v.
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
          <h1 className="text-3xl font-bold text-red-600">500 - Lỗi Hệ Thống</h1>
          <p className="mt-4 text-gray-600">Đã xảy ra sự cố không mong muốn. Vui lòng thử lại.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
          >
            Thử lại
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
