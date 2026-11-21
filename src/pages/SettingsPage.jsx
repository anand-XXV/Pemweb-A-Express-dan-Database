import { useState } from 'react';

export default function SettingsPage() {
  const [view, setView] = useState(() => localStorage.getItem('productView') || 'grid');

  function updateView(nextView) {
    setView(nextView);
    localStorage.setItem('productView', nextView);
  }

  return (
    <section className="mx-auto max-w-3xl">
      <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">Preferensi</p>
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Settings</h1>
      <p className="mt-2 text-slate-500">Atur bagaimana produk ditampilkan di katalog.</p>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Tampilan produk</h2>
            <p className="mt-1 text-sm text-slate-500">Preferensi ini tersimpan di perangkat Anda.</p>
          </div>
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1" role="group" aria-label="Pilih tampilan produk">
            {['grid', 'list'].map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={view === option}
                onClick={() => updateView(option)}
                className={`rounded-lg px-5 py-2 text-sm font-semibold capitalize transition ${
                  view === option ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <p role="status" className="mt-5 rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
          Tampilan saat ini: <span className="font-bold capitalize">{view}</span>
        </p>
      </div>
    </section>
  );
}
