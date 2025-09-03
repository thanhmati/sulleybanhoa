import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
      <h1 className="text-4xl font-bold text-gray-800">404</h1>
      <p className="mt-4 text-lg text-gray-600">Trang bạn tìm không tồn tại 🌸</p>
      <Link
        to="/"
        className="mt-6 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
      >
        Về Trang Chủ
      </Link>
    </div>
  );
}
