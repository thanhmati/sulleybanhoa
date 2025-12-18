import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

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

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App crashed:', error, errorInfo);
    // 👉 Gửi error lên Sentry, Datadog, v.v.
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4 animate-in fade-in zoom-in duration-300">
          <Card className="w-full max-w-md shadow-xl border-destructive/20 ring-1 ring-destructive/5">
            <CardHeader className="text-center pb-2 space-y-4">
              <div className="mx-auto bg-red-50 p-3 rounded-full w-fit ring-4 ring-red-50/50">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
                Đã xảy ra lỗi hệ thống
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-6 space-y-4">
              <p className="text-muted-foreground w-3/4 mx-auto">
                Rất tiếc, đã có sự cố không mong muốn xảy ra. Vui lòng thử tải lại trang hoặc quay
                về trang chủ.
              </p>

              {this.state.error && (
                <div className="bg-muted/50 p-3 rounded-md text-left overflow-auto max-h-32 text-xs font-mono border text-muted-foreground/80">
                  <p className="font-semibold text-destructive mb-1">Error Details:</p>
                  {this.state.error.message || this.state.error.toString()}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button
                onClick={this.handleGoHome}
                variant="outline"
                className="w-full sm:w-auto gap-2"
              >
                <Home className="w-4 h-4" />
                Về trang chủ
              </Button>
              <Button
                onClick={this.handleReload}
                className="w-full sm:w-auto gap-2 bg-red-600 hover:bg-red-700 text-white"
              >
                <RefreshCcw className="w-4 h-4" />
                Thử lại ngay
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
