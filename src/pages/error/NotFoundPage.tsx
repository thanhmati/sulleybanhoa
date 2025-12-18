import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileQuestion, Home, MoveLeft } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4 animate-in fade-in zoom-in duration-300">
      <Card className="w-full max-w-md shadow-xl border-muted/60">
        <CardHeader className="text-center pb-2 space-y-4">
          <div className="mx-auto bg-muted/50 p-4 rounded-full w-fit ring-8 ring-muted/20">
            <FileQuestion className="w-10 h-10 text-muted-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-gray-900">
            404 - Không tìm thấy
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center pb-6">
          <p className="text-muted-foreground">
            Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm. Có thể trang đã bị xóa
            hoặc đường dẫn không chính xác.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate(-1)} className="w-full sm:w-auto gap-2">
            <MoveLeft className="w-4 h-4" />
            Quay lại
          </Button>
          <Button asChild className="w-full sm:w-auto gap-2">
            <Link to="/">
              <Home className="w-4 h-4" />
              Về trang chủ
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
