import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../api.js';

const currency = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

function ProductForm({ product, onCancel, onSave }) {
  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product ? String(product.price) : '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      await onSave({ name: name.trim(), price: Number(price) });
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">{product ? 'Edit produk' : 'Tambah produk'}</h2>
        <p className="mt-1 text-sm text-slate-500">Lengkapi nama dan harga produk.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="field-label">
          Nama produk
          <input
            autoFocus
            className="field-input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Contoh: Buku catatan"
            required
            maxLength={120}
          />
        </label>
        <label className="field-label">
          Harga (Rp)
          <input
            className="field-input"
            type="number"
            min="0"
            step="1"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="15000"
            required
          />
        </label>
      </div>
      {error && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>}
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="submit" className="button-primary" disabled={isSaving}>
          {isSaving ? 'Menyimpan...' : product ? 'Simpan perubahan' : 'Simpan produk'}
        </button>
        <button type="button" className="button-secondary" onClick={onCancel} disabled={isSaving}>
          Batal
        </button>
      </div>
    </form>
  );
}

function ProductCard({ product, view, onEdit, onDelete }) {
  return (
    <article
      className={`group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-200/60 ${
        view === 'list' ? 'flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between' : ''
      }`}
    >
      <div className="flex min-w-0 items-center gap-4">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-2xl" aria-hidden="true">
          📦
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Produk #{product.id}</p>
          <h2 className="mt-1 truncate text-lg font-bold text-slate-900">{product.name}</h2>
          <p className="mt-1 font-semibold text-indigo-600">{currency.format(product.price)}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
        <Link to={`/products/${product.id}`} className="button-secondary">
          Detail
        </Link>
        <button type="button" className="button-secondary" onClick={() => onEdit(product)}>
          Edit
        </button>
        <button type="button" className="button-danger" onClick={() => onDelete(product)}>
          Hapus
        </button>
      </div>
    </article>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [notice, setNotice] = useState('');
  const [formMode, setFormMode] = useState(null);
  const [view, setView] = useState(() => localStorage.getItem('productView') || 'grid');

  useEffect(() => {
    let active = true;
    getProducts()
      .then((result) => {
        if (active) setProducts(result);
      })
      .catch((error) => {
        if (active) setPageError(error.message);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function saveProduct(productData) {
    if (formMode?.type === 'edit') {
      const updated = await updateProduct(formMode.product.id, productData);
      setProducts((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setNotice('Perubahan produk berhasil disimpan.');
    } else {
      const created = await createProduct(productData);
      setProducts((current) => [...current, created].sort((a, b) => a.id - b.id));
      setNotice('Produk baru berhasil ditambahkan.');
    }
    setFormMode(null);
    setPageError('');
  }

  async function removeProduct(product) {
    if (!window.confirm(`Hapus produk "${product.name}"?`)) return;
    setNotice('');
    setPageError('');
    try {
      await deleteProduct(product.id);
      setProducts((current) => current.filter((item) => item.id !== product.id));
      setNotice('Produk berhasil dihapus.');
    } catch (error) {
      setPageError(error.message);
    }
  }

  function changeView(nextView) {
    setView(nextView);
    localStorage.setItem('productView', nextView);
  }

  return (
    <>
      <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">Katalog</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Daftar produk</h1>
          <p className="mt-2 max-w-xl text-slate-500">Kelola semua produk Anda dari satu tempat.</p>
        </div>
        <button
          type="button"
          className="button-primary self-start sm:self-auto"
          onClick={() => {
            setNotice('');
            setFormMode({ type: 'create' });
          }}
        >
          <span aria-hidden="true">＋</span> Tambah produk
        </button>
      </section>

      {notice && <p role="status" className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{notice}</p>}
      {pageError && <p role="alert" className="mb-5 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{pageError}</p>}
      {formMode && (
        <ProductForm
          key={formMode.type === 'edit' ? formMode.product.id : 'create'}
          product={formMode.type === 'edit' ? formMode.product : null}
          onCancel={() => setFormMode(null)}
          onSave={saveProduct}
        />
      )}

      <section className="mt-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-500">
            {isLoading ? 'Memuat produk...' : `${products.length} produk`}
          </p>
          <div className="flex rounded-xl border border-slate-200 bg-white p-1" aria-label="Tampilan daftar produk">
            <button
              type="button"
              onClick={() => changeView('grid')}
              aria-pressed={view === 'grid'}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${view === 'grid' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500'}`}
            >
              Grid
            </button>
            <button
              type="button"
              onClick={() => changeView('list')}
              aria-pressed={view === 'list'}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${view === 'list' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500'}`}
            >
              List
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">Sedang memuat katalog...</div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <p className="text-4xl" aria-hidden="true">🛍️</p>
            <h2 className="mt-4 text-lg font-bold text-slate-900">Belum ada produk</h2>
            <p className="mt-1 text-sm text-slate-500">Tambahkan produk pertama untuk memulai katalog.</p>
          </div>
        ) : (
          <div className={view === 'grid' ? 'grid gap-4 md:grid-cols-2' : 'space-y-3'}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                view={view}
                onEdit={(selected) => {
                  setNotice('');
                  setFormMode({ type: 'edit', product: selected });
                }}
                onDelete={removeProduct}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
