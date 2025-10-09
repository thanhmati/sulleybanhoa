import { Outlet } from 'react-router-dom';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import '../../styles/web-app.global.scss';

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4 pt-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
