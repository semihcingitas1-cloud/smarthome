import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';

import { getProducts, deleteProduct } from "../../redux/productSlice";

import AdminSidebar from '../../layout/AdminSidebar';

import { Plus, Search, Filter, Edit3, Trash2, Eye, Layers, Package, AlertTriangle, CheckCircle, RefreshCw, LayoutGrid, LayoutList, TrendingUp, Box, X, ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORIES = ['Röle', 'Sensör', 'Motor Sürücü', 'Mikrodenetleyici', 'Güç Kaynağı'];
const PAGE_SIZE = 10;

const StatCard = ({ icon: Icon, label, value, sub, accent, dark }) => (

  <div className={`rounded-2xl border p-5 flex items-start gap-4 transition-all hover:-translate-y-0.5 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700 bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md`}>

    <div className={`p-2.5 rounded-xl ${accent}`}><Icon size={20} className="text-white" /></div>

    <div className="min-w-0">

      <p className={`text-xs font-semibold uppercase tracking-wider mb-1 dark:text-slate-500 text-slate-400`}>{label}</p>
      <p className={`text-2xl font-black tracking-tight dark:text-white text-slate-900`}>{value}</p>
      {sub && <p className={`text-xs mt-0.5 dark:text-slate-500 text-slate-400`}>{sub}</p>}

    </div>

  </div>
);

const StockBadge = ({ stock }) => {

  if (stock === 0)

    return (

      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-500 border border-red-500/20"><AlertTriangle size={11} /> Tükendi</span>
    );
  if (stock <= 10)

    return (

      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20"><AlertTriangle size={11} /> Kritik ({stock})</span>
    );
  return (

    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"><CheckCircle size={11} /> Stokta ({stock})</span>
  );
};

const DeleteModal = ({ product, onConfirm, onCancel, dark }) => (

  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

    <div className={`relative rounded-2xl border p-6 w-full max-w-sm shadow-2xl dark:bg-slate-900 dark:border-slate-700 bg-white border-slate-200'}`}>

      <div className="flex items-center gap-3 mb-4">

        <div className="p-2 rounded-xl bg-red-500/10"><Trash2 size={20} className="text-red-500" /></div>
        <h3 className={`font-bold text-base dark:text-white text-slate-900`}>Ürünü Sil</h3>

      </div>

      <p className={`text-sm mb-6 leading-relaxed dark:text-slate-400 text-slate-600`}><span className={`font-semibold dark:text-white text-slate-900`}>{product?.name}</span> adlı ürünü kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>

      <div className="flex gap-2">

        <button onClick={onCancel} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200`}>
          İptal
        </button>

        <button onClick={() => onConfirm(product)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition-all">
          Sil
        </button>

      </div>

    </div>

  </div>
);

const ProductDrawer = ({ product, onClose, dark }) => {

  if (!product) return null;

  return (

    <div className="fixed inset-0 z-50 flex justify-end">

      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className={`relative w-full max-w-md h-full overflow-y-auto shadow-2xl flex flex-col dark:bg-slate-900 dark:border-slate-800 bg-white border-l border-slate-200`}>

        <div className={`sticky top-0 z-10 px-6 py-4 border-b flex items-center justify-between dark:bg-slate-900/90 dark:border-slate-800 bg-white/90 backdrop-blur border-slate-200`}>

          <h2 className={`font-bold text-base dark:text-white text-slate-900`}>Ürün Detayı</h2>

          <button onClick={onClose} className={`p-2 rounded-xl transition-colors dark:hover:bg-slate-800 dark:text-slate-400 hover:bg-slate-100 text-slate-500`}>
            <X size={18} />
          </button>

        </div>

        <div className={`mx-6 mt-6 rounded-2xl overflow-hidden aspect-video flex items-center justify-center dark:bg-slate-950 dark:border-slate-800 bg-slate-50 border border-slate-200`}>

          {product.images?.[0]?.file ? <img src={product.images[0].file} alt={product.name} className="w-full h-full object-contain p-4" /> : <Package size={40} className={dark ? 'text-slate-700' : 'text-slate-300'} />}

        </div>

        <div className="px-6 py-5 flex-1 space-y-5">

          <div>

            <span className={`text-xs font-bold uppercase tracking-wider dark:text-slate-500 text-slate-400`}>Ürün Adı</span>
            <h3 className={`mt-1 text-lg font-bold leading-snug dark:text-white text-slate-900`}>{product.name}</h3>

          </div>

          <div className="grid grid-cols-2 gap-3">

            {[
              { l: 'ID', v: product.id },
              { l: 'SKU', v: product.sku },
              { l: 'Kategori', v: product.category },
              { l: 'Fiyat', v: `₺${product.price?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}` },
            ].map(({ l, v }) => ( <div key={l} className={`rounded-xl p-3 dark:bg-slate-800 bg-slate-50 border border-slate-200`}>

              <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 dark:text-slate-500 text-slate-400`}>{l}</p>
              <p className={`text-sm font-semibold font-mono truncate dark:text-slate-200 text-slate-800`}>{v}</p>

            </div> ))}

          </div>

          <div>

            <p className={`text-xs font-bold uppercase tracking-wider mb-2 dark:text-slate-500 text-slate-400`}>Stok Durumu</p>
            <StockBadge stock={product.stock} />

          </div>

          {product.description && ( <div>

            <p className={`text-xs font-bold uppercase tracking-wider mb-2 dark:text-slate-500 text-slate-400`}>Açıklama</p>
            <p className={`text-sm leading-relaxed dark:text-slate-400 text-slate-600`}>{product.description}</p>

          </div> )}

        </div>

      </div>

    </div>
  );
};

const ProductCard = ({ product, onView, onEdit, onDelete }) => (

  <div className={`group rounded-2xl border overflow-hidden transition-all hover:-translate-y-0.5 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-blue-500/40 dark:hover:shadow-blue-500/5 bg-white border-slate-200 hover:border-blue-400/60 hover:shadow-lg hover:shadow-blue-500/10`}>

    <div className={`relative aspect-video flex items-center justify-center overflow-hidden dark:bg-slate-950 bg-slate-50`}>

      {product.images?.[0]?.file ? <img src={product.images[0].file} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300" /> : <Package size={32} className={'dark:text-slate-700 text-slate-300'} />}
      <div className="absolute top-2 right-2"><StockBadge stock={product.stock} /></div>

    </div>

    <div className="p-4">

      <p className={`font-bold text-sm leading-tight mb-1 group-hover:text-blue-500 transition-colors line-clamp-2 dark:text-slate-200 text-slate-800`}>{product.name}</p>
      <p className={`text-[11px] font-mono mb-3 dark:text-slate-500 text-slate-400`}>{product.sku}</p>

      <div className="flex items-center justify-between">

        <span className={`text-base font-black dark:text-white text-slate-900`}>₺{product.price?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>

        <div className="flex items-center gap-1">

          <button onClick={() => onView(product)} className={`p-1.5 rounded-lg transition-all dark:hover:bg-blue-500/10 dark:text-slate-500 dark:hover:text-blue-400 hover:bg-blue-50 text-slate-400 hover:text-blue-500`}>
            <Eye size={15} />
          </button>

          <button onClick={() => onEdit(product)} className={`p-1.5 rounded-lg transition-all dark:hover:bg-amber-500/10 dark:text-slate-500 dark:hover:text-amber-400 hover:bg-amber-50 text-slate-400 hover:text-amber-500`}>
            <Edit3 size={15} />
          </button>

          <button onClick={() => onDelete(product)} className={`p-1.5 rounded-lg transition-all dark:hover:bg-red-500/10 dark:text-slate-500 dark:hover:text-red-400 hover:bg-red-50 text-slate-400 hover:text-red-500`}>
            <Trash2 size={15} />
          </button>

        </div>

      </div>

    </div>

  </div>
);

const AdminProducts = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [dark, toggleTheme] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStockStatus, setSelectedStockStatus] = useState('all');
  const [viewMode, setViewMode] = useState('table');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);

  const products = useSelector((state) => state.products.products);

  useEffect(() => { 

    dispatch(getProducts()); 
  }, [dispatch]);

  useEffect(() => {

    window.scrollTo(0, 0);
  }, []);

  const handleRefresh = async () => {

    setIsRefreshing(true);
    await dispatch(getProducts());
    await new Promise(r => setTimeout(r, 600));
    setIsRefreshing(false);
  };

  const handleSort = (key) => {

    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setCurrentPage(1);
  };

  const handleDeleteConfirm = (product) => {

    if (!product || !product._id) {

      console.error('Silinecek ürün bulunamadı veya geçerli bir _id yok!');
      return;
    }

    dispatch(deleteProduct(product._id));
    setDeleteTarget(null);
  };

  const filtered = products.filter(p => {

    const q = searchTerm.toLowerCase();
    const matchSearch = p.name?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q) || p.id?.toLowerCase().includes(q);
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchStock =
    selectedStockStatus === 'all' ? true :
    selectedStockStatus === 'out' ? p.stock === 0 :
    selectedStockStatus === 'critical' ? p.stock > 0 && p.stock <= 10 :
    p.stock > 10;
    return matchSearch && matchCat && matchStock;
  }).sort((a, b) => {

    let va = a[sortKey], vb = b[sortKey];
    if (typeof va === 'string') va = va.toLowerCase();
    if (typeof vb === 'string') vb = vb.toLowerCase();
    return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const totalStock = products.reduce((s, p) => s + (p.stock || 0), 0);
  const outOfStock = products.filter(p => p.stock === 0).length;
  const critical = products.filter(p => p.stock > 0 && p.stock <= 10).length;
  const avgPrice = products.length ? (products.reduce((s, p) => s + (p.price || 0), 0) / products.length) : 0;

  const activeFilters = [selectedCategory !== 'all', selectedStockStatus !== 'all', searchTerm].filter(Boolean).length;

  const SortIcon = ({ col }) => (

    <button onClick={() => handleSort(col)} className={`ml-1 inline-flex items-center justify-center w-4 h-4 rounded transition-colors ${sortKey === col ? 'text-blue-400' : 'dark:text-slate-600 dark:hover:text-slate-400 text-slate-300 hover:text-slate-500'}`}>

      <svg width="8" height="12" viewBox="0 0 8 12" fill="none">

        <path d="M4 0L7 4H1L4 0Z" fill={sortKey === col && sortDir === 'asc' ? 'currentColor' : (dark ? '#475569' : '#cbd5e1')} />
        <path d="M4 12L1 8H7L4 12Z" fill={sortKey === col && sortDir === 'desc' ? 'currentColor' : (dark ? '#475569' : '#cbd5e1')} />

      </svg>

    </button>
  );

  return (

    <div className={`flex min-h-screen dark:bg-slate-950 bg-slate-50 dark:text-slate-100 text-slate-900 transition-colors duration-300`}>

      <AdminSidebar />

      <div className="flex-1 min-h-screen flex flex-col overflow-x-hidden">

        <div className={`sticky top-0 z-40 px-6 py-4 border-b backdrop-blur-md dark:bg-slate-950/80 dark:border-slate-800 bg-white/80 border-slate-200`}>

          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

            <div>

              <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest mb-0.5 text-blue-500`}><Layers size={12} /> Envanter Yönetimi</div>
              <h1 className={`text-xl font-black tracking-tight flex items-center gap-2 dark:text-white text-slate-900`}>Ürün Listesi<span className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold dark:bg-slate-800 dark:text-slate-400 bg-slate-100 text-slate-500`}>{filtered.length} kayıt</span></h1>

            </div>

            <div className="flex items-center gap-2">

              <div className={`flex rounded-xl border overflow-hidden dark:border-slate-700 dark:bg-slate-800 border-slate-200 bg-slate-100`}>

                {[['table', LayoutList], ['grid', LayoutGrid]].map(([m, Icon]) => (
                  <button key={m} onClick={() => setViewMode(m)} className={`p-2.5 transition-all ${viewMode === m ? 'bg-blue-500 text-white' : 'dark:text-slate-400 dark:hover:text-slate-200 text-slate-500 hover:text-slate-700'}`}>
                    <Icon size={16} />
                  </button>
                ))}

              </div>

              <button onClick={handleRefresh} disabled={isRefreshing} className={`p-2.5 rounded-xl border transition-all disabled:opacity-40 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800`}>
                <RefreshCw size={17} className={isRefreshing ? 'animate-spin' : ''} />
              </button>

              <button onClick={() => navigate('/admin/addproduct')} className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20">
                <Plus size={16} /> Yeni Ürün
              </button>

            </div>

          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 py-6 w-full flex-1 space-y-5">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

            <StatCard icon={Box} label="Toplam Ürün" value={products.length} sub="aktif ürün" accent="bg-blue-500" />
            <StatCard icon={CheckCircle} label="Toplam Stok" value={totalStock.toLocaleString('tr-TR')} sub="adet" accent="bg-emerald-500" />
            <StatCard icon={AlertTriangle} label="Kritik / Tükendi" value={`${critical} / ${outOfStock}`} sub="ürün" accent="bg-amber-500" />
            <StatCard icon={TrendingUp} label="Ort. Fiyat" value={`₺${avgPrice.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`} sub="birim fiyat" accent="bg-violet-500" />

          </div>

          <div className={`rounded-2xl border p-4 dark:bg-slate-900 dark:border-slate-800 bg-white border-slate-200`}>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">

              <div className="relative lg:col-span-5">

                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input type="text" placeholder="Ürün adı, SKU veya ID..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} className={`w-full rounded-xl pl-10 pr-4 py-2.5 text-sm border outline-none transition-colors dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 dark:placeholder:text-slate-600 dark:focus:border-blue-500/60 bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-400`}/>

                {searchTerm && ( <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  <X size={14} />
                </button> )}

              </div>

              <div className="relative lg:col-span-3">

                <select value={selectedCategory} onChange={e => { setSelectedCategory(e.target.value); setCurrentPage(1); }} className={`w-full rounded-xl px-3 py-2.5 text-sm border outline-none appearance-none cursor-pointer transition-colors dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 dark:placeholder:text-slate-600 dark:focus:border-blue-500/60 bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-400`}>

                  <option value="all">Tüm Kategoriler</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}

                </select>

                <Filter size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />

              </div>

              <div className="relative lg:col-span-3">

                <select value={selectedStockStatus} onChange={e => { setSelectedStockStatus(e.target.value); setCurrentPage(1); }} className={`w-full rounded-xl px-3 py-2.5 text-sm border outline-none appearance-none cursor-pointer transition-colors dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 dark:placeholder:text-slate-600 dark:focus:border-blue-500/60 bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-400`}>

                  <option value="all">Tüm Stok Durumları</option>
                  <option value="available">Stokta Var (10+)</option>
                  <option value="critical">Kritik Seviye (1–10)</option>
                  <option value="out">Tükendi (0)</option>

                </select>

                <Filter size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />

              </div>

              <div className="lg:col-span-1 flex justify-end">

                {activeFilters > 0 && ( <button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setSelectedStockStatus('all'); setCurrentPage(1); }} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all whitespace-nowrap">
                  <X size={13} /> Temizle ({activeFilters})
                </button> )}

              </div>

            </div>

          </div>

          {viewMode === 'grid' ? ( <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">

            {paginated.length > 0 ? paginated.map(p => ( <ProductCard key={p.id} product={p} onView={setViewTarget} onEdit={p => navigate(`/admin/updateproduct/${p.id}`)} onDelete={setDeleteTarget} /> )) : ( <div className="col-span-full py-20 flex flex-col items-center gap-3 text-slate-500">

              <Package size={44} className={'dark:text-slate-700 text-slate-300'} strokeWidth={1.5} />
              <p className="text-sm font-medium">Kriterlere uygun ürün bulunamadı.</p>

            </div> )}

          </div> ) : ( <div className={`rounded-2xl border overflow-hidden dark:bg-slate-900 dark:border-slate-800 bg-white border-slate-200`}>

            <div className="overflow-x-auto">

              <table className="w-full text-left border-collapse">

                <thead>

                  <tr className={`border-b text-[11px] font-bold uppercase tracking-widest dark:border-slate-800 dark:bg-slate-900/60 border-slate-100 bg-slate-50 dark:text-slate-400 text-slate-500`}>

                    <th className="py-3.5 px-5">Ürün <SortIcon col="name" /></th>
                    <th className="py-3.5 px-4">ID / SKU</th>
                    <th className="py-3.5 px-4">Kategori <SortIcon col="category" /></th>
                    <th className="py-3.5 px-4">Fiyat <SortIcon col="price" /></th>
                    <th className="py-3.5 px-4">Stok <SortIcon col="stock" /></th>
                    <th className="py-3.5 px-5 text-right">İşlemler</th>

                  </tr>

                </thead>

                <tbody className={`divide-y text-sm dark:divide-slate-800 divide-slate-100 dark:text-slate-300 text-slate-700`}>

                  {paginated.length > 0 ? paginated.map(product => ( <tr key={product.id} className={`transition-colors group dark:hover:bg-slate-800/40 hover:bg-slate-50`}>

                    <td className="py-3 px-5">

                      <div className="flex items-center gap-3">

                        <div className={`w-10 h-10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border dark:bg-slate-950 dark:border-slate-800 bg-slate-50 border-slate-200`}>

                          {product.images?.[0]?.file ? <img src={product.images[0].file} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" /> : <Package size={18} className={'dark:text-slate-700 text-slate-300'} />}

                        </div>

                        <span className={`font-semibold text-sm truncate max-w-[200px] group-hover:text-blue-500 transition-colors dark:text-slate-200 text-slate-800`}>{product.name}</span>

                      </div>

                    </td>

                    <td className="py-3 px-4">

                      <span className={`block text-xs font-mono dark:text-slate-300 text-slate-700`}>{product.id}</span>
                      <span className={`block text-[11px] font-mono mt-0.5 dark:text-slate-500 text-slate-400`}>{product.sku}</span>

                    </td>

                    <td className="py-3 px-4">

                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 bg-slate-100 border-slate-200 text-slate-600`}>{product.category}</span>

                    </td>

                    <td className={`py-3 px-4 font-black text-sm dark:text-white text-slate-900`}>₺{product.price?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 px-4"><StockBadge stock={product.stock} /></td>

                    <td className="py-3 px-5">

                      <div className="flex items-center justify-end gap-1">

                        <button onClick={() => setViewTarget(product)} className={`p-2 rounded-xl transition-all dark:hover:bg-blue-500/10 dark:text-slate-500 dark:hover:text-blue-400 hover:bg-blue-50 text-slate-400 hover:text-blue-500`} title="İncele">
                          <Eye size={15} />
                        </button>

                        <button onClick={() => navigate(`/admin/updateproduct/${product.id}`)} className={`p-2 rounded-xl transition-all dark:hover:bg-amber-500/10 dark:text-slate-500 dark:hover:text-amber-400 hover:bg-amber-50 text-slate-400 hover:text-amber-500`} title="Düzenle">
                          <Edit3 size={15} />
                        </button>

                        <button onClick={() => setDeleteTarget(product)} className={`p-2 rounded-xl transition-all dark:hover:bg-red-500/10 dark:text-slate-500 dark:hover:text-red-400 hover:bg-red-50 text-slate-400 hover:text-red-500`} title="Sil">
                          <Trash2 size={15} />
                        </button>

                      </div>

                    </td>

                  </tr> )) : ( <tr>

                    <td colSpan="6" className="py-20">

                      <div className="flex flex-col items-center gap-3 text-slate-500">

                        <Package size={44} className={'dark:text-slate-700 text-slate-300'} strokeWidth={1.5} />
                        <p className="text-sm font-medium">Kriterlere uygun ürün bulunamadı.</p>
                        {activeFilters > 0 && ( <button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setSelectedStockStatus('all'); }} className="text-xs text-blue-400 hover:underline">Filtreleri temizle</button> )}

                      </div>

                    </td>

                  </tr> )}

                </tbody>

              </table>

            </div>

            <div className={`px-5 py-3.5 border-t flex items-center justify-between text-xs dark:border-slate-800 dark:bg-slate-900/40 border-slate-100 bg-slate-50/60`}>

              <span className={'dark:text-slate-500 text-slate-400'}>

                Gösterilen <span className={`font-bold dark:text-slate-300 text-slate-700`}>
                {Math.min((currentPage - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(currentPage * PAGE_SIZE, filtered.length)}
                </span> / Toplam <span className={`font-bold dark:text-slate-300 text-slate-700`}>{filtered.length}</span>

              </span>

              <div className="flex items-center gap-1.5">

                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className={`p-1.5 rounded-lg border transition-all disabled:opacity-30 disabled:cursor-not-allowed dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 bg-white border-slate-200 text-slate-600 hover:bg-slate-100`}>
                  <ChevronLeft size={15} />
                </button>

                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {

                  let page = i + 1;

                  if (totalPages > 7) {

                    if (currentPage <= 4) page = i + 1;
                    else if (currentPage >= totalPages - 3) page = totalPages - 6 + i;
                    else page = currentPage - 3 + i;
                  }

                  return (

                    <button key={page} onClick={() => setCurrentPage(page)} className={`w-7 h-7 rounded-lg text-xs font-bold border transition-all ${currentPage === page ? 'bg-blue-500 border-blue-500 text-white' : 'dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 bg-white border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
                      {page}
                    </button>
                  );
                })}

                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className={`p-1.5 rounded-lg border transition-all disabled:opacity-30 disabled:cursor-not-allowed dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 bg-white border-slate-200 text-slate-600 hover:bg-slate-100`}>
                  <ChevronRight size={15} />
                </button>

              </div>

            </div>

          </div> )}

        </div>

      </div>

      {deleteTarget && ( <DeleteModal product={deleteTarget} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteTarget(null)} /> )}
      {viewTarget && ( <ProductDrawer product={viewTarget} onClose={() => setViewTarget(null)} /> )}

    </div>
  );
};

export default AdminProducts;