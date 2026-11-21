import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProduct } from '../api.js';

const currency = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setProduct(null);
    setError(null);
    setLoading(true);
    getProduct(id)
      .then((result) => {
        if (active) setProduct(result);
      })
      .catch((requestError) => {
        if (active) setError(requestError);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">Memuat detail produk...</p>;
  }

  if (error?.status === 404 || error?.status === 400) {
    return (
      <section className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-rose-600">404</p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">Produk tidak ditemukan</h1>
        <p className="mt-2 text-slate-500">Produk dengan ID {id} tidak tersedia atau sudah dihapus.</p>
        <Link to="/products" className="button-primary mt-6">Kembali ke daftar produk</Link>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-xl rounded-3xl border border-rose-100 bg-white p-8 text-center shadow-sm">
        <p role="alert" className="font-semibold text-rose-700">{error.message}</p>
        <Link to="/products" className="button-primary mt-6">Kembali ke daftar produk</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl">
      <Link to="/products" className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800">
        <span aria-hidden="true">←</span> Kembali ke daftar produk
      </Link>
      <article className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 px-7 py-10 text-white sm:px-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-100">Detail produk · #{product.id}</p>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{product.name}</h1>
          <p className="mt-3 text-lg font-semibold text-indigo-100">{currency.format(product.price)}</p>
        </div>
        <div className="grid gap-4 p-7 sm:grid-cols-2 sm:p-10">
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">ID Produk</p>
            <p className="mt-2 text-lg font-bold text-slate-900">{product.id}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Harga</p>
            <p className="mt-2 text-lg font-bold text-slate-900">{currency.format(product.price)}</p>
          </div>
        </div>
      </article>
    </section>
  );
}
