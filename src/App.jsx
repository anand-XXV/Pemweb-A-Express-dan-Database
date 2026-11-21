import { Link, NavLink, Navigate, Route, Routes } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

function AppLayout() {
  const navClass = ({ isActive }) =>
    `rounded-xl px-4 py-2 text-sm font-semibold transition ${
      isActive ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200/80 bg-white/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
          <Link to="/products" className="flex items-center gap-3" aria-label="Produkly, daftar produk">
            <span className="grid size-10 place-items-center rounded-2xl bg-indigo-600 text-lg font-black text-white shadow-lg shadow-indigo-200">
              P
            </span>
            <span>
              <span className="block text-lg font-extrabold tracking-tight text-slate-900">Produkly</span>
              <span className="hidden text-xs font-medium text-slate-400 sm:block">Manajemen produk</span>
            </span>
          </Link>
          <nav className="flex items-center gap-1 rounded-2xl bg-slate-50 p-1" aria-label="Navigasi utama">
            <NavLink to="/products" className={navClass}>
              Produk
            </NavLink>
            <NavLink to="/settings" className={navClass}>
              Settings
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-9 sm:px-8 sm:py-12">
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route
            path="*"
            element={
              <section className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">404</p>
                <h1 className="mt-3 text-2xl font-bold text-slate-900">Halaman tidak ditemukan</h1>
                <p className="mt-2 text-slate-500">Alamat yang Anda buka tidak tersedia.</p>
                <Link to="/products" className="button-primary mt-6">
                  Kembali ke produk
                </Link>
              </section>
            }
          />
        </Routes>
      </main>
      <footer className="px-5 pb-8 text-center text-xs font-medium text-slate-400">
        Produkly · Kelola produk dengan lebih mudah
      </footer>
    </div>
  );
}

export default function App() {
  return <AppLayout />;
}
