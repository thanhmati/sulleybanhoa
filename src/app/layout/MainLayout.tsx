import { Outlet } from 'react-router-dom';
import { Navigation } from '@/components/shared/Navigation';
import { Footer } from '@/components/shared/Footer';

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] text-[#4A4A4A] font-sans selection:bg-[#eecbcb] selection:text-white">
      <Navigation />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
