import { Outlet } from 'react-router-dom';

export default function BackOfficeLayout() {
  return (
    <div className="">
      <main className="">
        <Outlet />
      </main>
    </div>
  );
}
