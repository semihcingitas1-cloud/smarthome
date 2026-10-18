import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getProducts, getProductCategories, getHomeProducts } from "../../redux/productSlice";
import { addToCart } from "../../redux/cartSlice";

import { ShoppingCart, Star, Heart, Zap, Package, Truck, Shield, Search, SlidersHorizontal, X, ChevronDown, Grid3x3, List, Eye, BarChart3, Timer, CreditCard, Layers, Tag, Check, RotateCcw, Flame, ArrowRight } from "lucide-react";

// ───────────────────────── SABİTLER ─────────────────────────

const PAGE_SIZE = 20;

const SORT_OPTIONS = [
  { value: "new", label: "En yeni" },
  { value: "popular", label: "Çok satanlar" },
  { value: "rating", label: "En yüksek puan" },
  { value: "price_asc", label: "Fiyat: düşükten yükseğe" },
  { value: "price_desc", label: "Fiyat: yüksekten düşüğe" },
];

const RATING_OPTIONS = [0, 3, 4, 4.5];

// Şemadaki rozet listesiyle birebir
const BADGE_STYLES = {
  Yeni: "from-emerald-500 to-green-500",
  "Çok Satan": "from-orange-500 to-red-500",
  Premium: "from-blue-500 to-violet-500",
  İndirim: "from-pink-500 to-rose-500",
};

const CATEGORY_ICONS = {
  "Akıllı Aydınlatma": Zap,
  Kameralar: Eye,
  Sensörler: BarChart3,
  "Akıllı Kilitler": Shield,
};

const BENEFITS = [
  { icon: CreditCard, title: "Güvenli ödeme", description: "iyzico altyapısı", color: "text-blue-500 bg-blue-500/10" },
  { icon: Shield, title: "2 yıl garanti", description: "Tüm ürünlerde", color: "text-emerald-500 bg-emerald-500/10" },
  { icon: Package, title: "Hızlı teslimat", description: "1-3 iş günü", color: "text-violet-500 bg-violet-500/10" },
  { icon: Truck, title: "Ücretsiz kargo", description: "2500₺ ve üzeri", color: "text-orange-500 bg-orange-500/10" },
];

const WISHLIST_KEY = "typushome_wishlist";

// ───────────────────────── YARDIMCILAR ─────────────────────────

const priceFormatter = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 });
const formatPrice = (value) => (Number.isFinite(Number(value)) ? priceFormatter.format(Number(value)) : "—");

const getProductId = (p) => p?._id ?? p?.id;
const getImage = (p) => p?.primaryImage || p?.images?.[0]?.preview || p?.images?.[0]?.file || null;
const hasDiscount = (p) => p?.hasDiscount ?? (Number(p?.oldPrice) > Number(p?.price));
const discountOf = (p) => p?.discountPercentage ?? (hasDiscount(p) ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0);
const needsOptions = (p) => (p?.hasModels ?? (p?.models?.length > 0)) || (p?.colors?.length ?? 0) > 1;
const isOutOfStock = (p) => (p?.stockStatus ? p.stockStatus === "out_of_stock" : !p?.stock);
const isLowStock = (p) => (p?.stockStatus ? p.stockStatus === "low_stock" : p?.stock > 0 && p?.stock <= (p?.lowStockThreshold ?? 10));

const readWishlist = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const useDebounced = (value, delay = 350) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
};

// ───────────────────────── KÜÇÜK BİLEŞENLER ─────────────────────────

const Stars = ({ value = 0, size = 14 }) => (
  <div className="flex items-center gap-0.5">
    {[0, 1, 2, 3, 4].map((i) => (
      <Star key={i} size={size} className={i < Math.round(value) ? "text-amber-400" : "text-gray-300 dark:text-slate-700"} fill={i < Math.round(value) ? "currentColor" : "none"} />
    ))}
  </div>
);

const SkeletonCard = ({ list }) => (
  <div className={`animate-pulse bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-slate-800 ${list ? "flex" : ""}`}>
    <div className={`bg-gray-100 dark:bg-slate-800 ${list ? "w-56 h-56 flex-shrink-0" : "aspect-square"}`} />
    <div className="p-5 space-y-3 flex-1">
      <div className="h-3 w-1/3 rounded bg-gray-100 dark:bg-slate-800" />
      <div className="h-4 w-4/5 rounded bg-gray-100 dark:bg-slate-800" />
      <div className="h-3 w-1/2 rounded bg-gray-100 dark:bg-slate-800" />
      <div className="h-10 w-full rounded-xl bg-gray-100 dark:bg-slate-800 mt-4" />
    </div>
  </div>
);

const ProductCard = ({ product, list, wished, onOpen, onAdd, onWish }) => {

  const image = getImage(product);
  const outOfStock = isOutOfStock(product);
  const lowStock = isLowStock(product);
  const discount = discountOf(product);
  const optionsNeeded = needsOptions(product);
  const fromPrice = product?.hasModels ?? product?.models?.length > 0;

  return (
    <article onClick={onOpen} className={`group cursor-pointer bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-500/30 ${list ? "flex" : "flex flex-col"}`}>

      {/* Görsel */}
      <div className={`relative bg-gray-50 dark:bg-slate-800/60 overflow-hidden ${list ? "w-56 flex-shrink-0" : "aspect-square"}`}>

        {image ? (
          <img src={image} alt={product.name} loading="lazy" className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${outOfStock ? "opacity-50 grayscale" : ""}`} />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><Package size={48} className="text-gray-300 dark:text-slate-700" /></div>
        )}

        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {BADGE_STYLES[product.badge] && (
            <span className={`bg-gradient-to-r ${BADGE_STYLES[product.badge]} text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow`}>{product.badge}</span>
          )}
          {discount > 0 && <span className="bg-red-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">%{discount}</span>}
        </div>

        <button onClick={(e) => { e.stopPropagation(); onWish(); }} aria-label="Favorilere ekle" className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${wished ? "bg-red-500 text-white" : "bg-white/80 dark:bg-slate-900/70 text-gray-600 dark:text-slate-300 hover:text-red-500"}`}>
          <Heart size={16} fill={wished ? "currentColor" : "none"} />
        </button>

        {outOfStock ? (
          <span className="absolute bottom-3 left-3 bg-gray-900/80 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">Tükendi</span>
        ) : lowStock ? (
          <span className="absolute bottom-3 left-3 bg-orange-500/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><Timer size={11} /> Son {product.stock} adet</span>
        ) : null}

      </div>

      {/* İçerik */}
      <div className="p-5 flex flex-col flex-1">

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-500 mb-1.5">
          <span className="truncate">{product.category}</span>
          {product.salesCount > 0 && <span className="flex-shrink-0">{product.salesCount} satıldı</span>}
        </div>

        <h3 className="font-bold text-[15px] leading-snug line-clamp-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{product.name}</h3>

        {list && product.shortDescription && <p className="text-sm text-gray-500 dark:text-slate-400 mt-2 line-clamp-2">{product.shortDescription}</p>}

        {product.features?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {product.features.slice(0, list ? 4 : 2).map((f, i) => (
              <span key={i} className="text-[11px] bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 px-2 py-0.5 rounded-md">{f}</span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 mt-3">
          <Stars value={product.ratingsAverage} />
          <span className="text-xs text-gray-500 dark:text-slate-400">{product.ratingsQuantity > 0 ? `${product.ratingsAverage} (${product.ratingsQuantity})` : "Henüz yorum yok"}</span>
        </div>

        <div className="mt-auto pt-4">

          <div className="flex items-baseline gap-2 mb-3 flex-wrap">
            <span className="text-xl font-extrabold text-gray-900 dark:text-white">{formatPrice(product.price)}</span>
            {fromPrice && <span className="text-xs text-gray-500 dark:text-slate-400">'den başlayan</span>}
            {hasDiscount(product) && <span className="text-sm line-through text-gray-400 dark:text-slate-500">{formatPrice(product.oldPrice)}</span>}
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); onAdd(); }}
            disabled={outOfStock}
            className={`w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${outOfStock ? "bg-gray-100 dark:bg-slate-800 text-gray-400 cursor-not-allowed" : optionsNeeded ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90" : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/25"}`}
          >
            {outOfStock ? "Stokta yok" : optionsNeeded ? (<><Layers size={16} /> Seçenekleri gör</>) : (<><ShoppingCart size={16} /> Sepete ekle</>)}
          </button>

        </div>

      </div>

    </article>
  );
};

// ───────────────────────── SAYFA ─────────────────────────

const Products = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { products, productCount, page, hasMore, listLoading, error, categories, categoriesTotal, home } = useSelector((state) => state.products);

  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("new");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [minPriceText, setMinPriceText] = useState("");
  const [maxPriceText, setMaxPriceText] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [discountedOnly, setDiscountedOnly] = useState(false);
  const [wishlist, setWishlist] = useState(readWishlist);
  const [toast, setToast] = useState(null);

  const toastTimer = useRef(null);

  const debouncedSearch = useDebounced(searchQuery.trim());
  const debouncedMin = useDebounced(minPriceText);
  const debouncedMax = useDebounced(maxPriceText);

  // ── Sunucuya giden sorgu ──
  const query = useMemo(() => ({
    search: debouncedSearch || undefined,
    category: activeCategory === "Tümü" ? undefined : activeCategory,
    sort: sortBy,
    minPrice: debouncedMin || undefined,
    maxPrice: debouncedMax || undefined,
    minRating: minRating || undefined,
    inStock: inStockOnly ? "true" : undefined,
    discounted: discountedOnly ? "true" : undefined,
    limit: PAGE_SIZE,
  }), [debouncedSearch, activeCategory, sortBy, debouncedMin, debouncedMax, minRating, inStockOnly, discountedOnly]);

  useEffect(() => {
    dispatch(getProductCategories());
    dispatch(getHomeProducts(8));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getProducts({ ...query, page: 1 }));
  }, [dispatch, query]);

  useEffect(() => {
    try { localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist)); } catch {}
  }, [wishlist]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const hasActiveFilters = !!(query.search || query.category || query.minPrice || query.maxPrice || query.minRating || query.inStock || query.discounted);
  const filterCount = [query.minPrice || query.maxPrice, query.minRating, query.inStock, query.discounted].filter(Boolean).length;

  // ── İşlemler ──
  const resetFilters = () => {
    setActiveCategory("Tümü");
    setSearchQuery("");
    setMinPriceText("");
    setMaxPriceText("");
    setMinRating(0);
    setInStockOnly(false);
    setDiscountedOnly(false);
  };

  const loadMore = () => {
    if (!hasMore || listLoading) return;
    dispatch(getProducts({ ...query, page: page + 1, append: true }));
  };

  const openProduct = useCallback((p) => navigate(`/productdetail/${p.slug}`), [navigate]);

  const toggleWishlist = (p) => {
    const id = getProductId(p);
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const showAddedToast = (name) => {
    clearTimeout(toastTimer.current);
    setToast(name);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = (p) => {

    // Model ya da renk seçimi gerekiyorsa kullanıcı detayda seçer
    if (needsOptions(p)) {
      openProduct(p);
      return;
    }

    const id = getProductId(p);

    dispatch(addToCart({
      id,
      _id: id,
      name: p.name,
      price: p.price,
      image: getImage(p),
      category: p.category,
      slug: p.slug,
      stock: p.stock,
      quantity: 1,
      selectedModel: null,
      selectedColor: p.colors?.[0]?.name ?? null,
    }));

    showAddedToast(p.name);
  };

  // ── Görünüm verileri ──
  const stats = [
    { label: "Ürün", value: categoriesTotal || productCount || 0, icon: Package },
    { label: "Kategori", value: categories.length, icon: Layers },
    { label: "Fırsat ürünü", value: home.discounted.length, icon: Tag },
    { label: "Yeni ürün", value: home.newest.length, icon: Zap },
  ];

  const initialLoading = listLoading && products.length === 0;
  const showDeals = !hasActiveFilters && home.discounted.length > 0;

  return (

    <div className="bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white min-h-screen">

      {/* ── HERO ── */}
      <section className="relative pt-24 pb-12 px-6 overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/[0.07] to-transparent pointer-events-none" />
        <div className="absolute -top-24 right-0 w-[28rem] h-[28rem] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">

          <div className="max-w-3xl">

            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-full mb-5">
              <Zap size={13} /> TypusHOME Store
            </span>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] mb-4">
              Evini akıllı hale getiren <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">cihazlar</span>
            </h1>

            <p className="text-gray-600 dark:text-slate-400 text-lg mb-8">TypusHOME uygulamasıyla tam uyumlu sensörler, röleler ve otomasyon ürünleri.</p>

            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" placeholder="Ürün, kategori ya da özellik ara" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl pl-12 pr-12 py-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 shadow-sm" />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} aria-label="Aramayı temizle" className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white"><X size={15} /></button>
              )}
            </div>

          </div>

          {/* İstatistikler */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10">
            {stats.map((s) => (
              <div key={s.label} className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0"><s.icon size={18} /></div>
                <div>
                  <div className="text-xl font-extrabold leading-none">{s.value}</div>
                  <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </section>

      {/* ── AVANTAJLAR ── */}
      <section className="px-6 pb-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3">
          {BENEFITS.map((b) => (
            <div key={b.title} className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${b.color}`}><b.icon size={18} /></div>
              <div className="min-w-0">
                <div className="font-semibold text-sm">{b.title}</div>
                <div className="text-xs text-gray-500 dark:text-slate-400 truncate">{b.description}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FIRSATLAR (filtre yokken) ── */}
      {showDeals && (
        <section className="px-6 pb-10">
          <div className="max-w-7xl mx-auto">

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-extrabold flex items-center gap-2"><Flame size={20} className="text-orange-500" /> Fırsatlar</h2>
              <button onClick={() => setDiscountedOnly(true)} className="text-sm font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:gap-2 transition-all">Tümünü gör <ArrowRight size={15} /></button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 snap-x scrollbar-hide">
              {home.discounted.map((p) => (
                <button key={getProductId(p)} onClick={() => openProduct(p)} className="snap-start flex-shrink-0 w-60 text-left bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-orange-400/50 transition-colors">
                  <div className="relative aspect-[4/3] bg-gray-50 dark:bg-slate-800/60">
                    {getImage(p) ? <img src={getImage(p)} alt={p.name} loading="lazy" className="w-full h-full object-cover" /> : null}
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">%{discountOf(p)}</span>
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-semibold line-clamp-1">{p.name}</div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-extrabold">{formatPrice(p.price)}</span>
                      <span className="text-xs line-through text-gray-400">{formatPrice(p.oldPrice)}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* ── ARAÇ ÇUBUĞU ── */}
      <section className="px-6 py-4 sticky top-0 bg-gray-50/90 dark:bg-slate-950/90 backdrop-blur-md z-30 border-b border-gray-200/70 dark:border-slate-800">

        <div className="max-w-7xl mx-auto">

          {/* Kategoriler */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-hide">

            {[{ name: "Tümü", count: categoriesTotal }, ...categories].map((cat) => {

              const Icon = cat.name === "Tümü" ? Grid3x3 : CATEGORY_ICONS[cat.name] ?? Package;
              const active = activeCategory === cat.name;

              return (
                <button key={cat.name} onClick={() => setActiveCategory(cat.name)} className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${active ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow" : "bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700"}`}>
                  <Icon size={15} />
                  {cat.name}
                  <span className={`text-[11px] px-1.5 py-0.5 rounded-md ${active ? "bg-white/20 dark:bg-gray-900/10" : "bg-gray-100 dark:bg-slate-800"}`}>{cat.count ?? 0}</span>
                </button>
              );
            })}

          </div>

          <div className="flex items-center justify-between gap-3">

            <div className="flex items-center gap-2">

              <button onClick={() => setShowFilters((v) => !v)} className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium border transition-colors ${showFilters || filterCount ? "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300" : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800"}`}>
                <SlidersHorizontal size={16} />
                <span className="hidden sm:inline">Filtreler</span>
                {filterCount > 0 && <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">{filterCount}</span>}
              </button>

              <div className="relative">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 pl-3.5 pr-9 py-2 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer">
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>

              {hasActiveFilters && (
                <button onClick={resetFilters} className="hidden md:flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white px-2"><RotateCcw size={14} /> Sıfırla</button>
              )}

            </div>

            <div className="flex items-center gap-3">

              <span className="text-sm text-gray-500 dark:text-slate-400 hidden sm:inline">{productCount} ürün</span>

              <div className="flex bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-1">
                <button onClick={() => setViewMode("grid")} aria-label="Izgara görünümü" className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900" : "text-gray-500"}`}><Grid3x3 size={16} /></button>
                <button onClick={() => setViewMode("list")} aria-label="Liste görünümü" className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900" : "text-gray-500"}`}><List size={16} /></button>
              </div>

            </div>

          </div>

          {/* Filtre paneli */}
          {showFilters && (
            <div className="mt-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 grid gap-6 md:grid-cols-3">

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">Fiyat aralığı (₺)</label>
                <div className="flex items-center gap-2">
                  <input type="number" min="0" inputMode="numeric" placeholder="En az" value={minPriceText} onChange={(e) => setMinPriceText(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
                  <span className="text-gray-400">–</span>
                  <input type="number" min="0" inputMode="numeric" placeholder="En çok" value={maxPriceText} onChange={(e) => setMaxPriceText(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">Minimum puan</label>
                <div className="flex gap-2 flex-wrap">
                  {RATING_OPTIONS.map((r) => (
                    <button key={r} onClick={() => setMinRating(r)} className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${minRating === r ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900" : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"}`}>
                      {r > 0 && <Star size={13} fill="currentColor" className="text-amber-400" />}
                      {r === 0 ? "Tümü" : `${r}+`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">Göster</label>
                <div className="space-y-2">
                  {[
                    { label: "Sadece stoktakiler", checked: inStockOnly, onChange: setInStockOnly },
                    { label: "Sadece indirimdekiler", checked: discountedOnly, onChange: setDiscountedOnly },
                  ].map((o) => (
                    <label key={o.label} className="flex items-center gap-2.5 cursor-pointer select-none text-sm">
                      <span className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${o.checked ? "bg-blue-600 border-blue-600" : "border-gray-300 dark:border-slate-600"}`}>{o.checked && <Check size={13} className="text-white" />}</span>
                      <input type="checkbox" className="sr-only" checked={o.checked} onChange={(e) => o.onChange(e.target.checked)} />
                      {o.label}
                    </label>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </section>

      {/* ── ÜRÜNLER ── */}
      <section className="px-6 pt-6 pb-24">

        <div className="max-w-7xl mx-auto">

          {error && products.length === 0 ? (

            <div className="text-center py-20">
              <Package size={56} className="mx-auto mb-4 text-gray-300 dark:text-slate-700" />
              <h3 className="text-xl font-bold mb-2">Ürünler yüklenemedi</h3>
              <p className="text-gray-500 dark:text-slate-400 mb-6">{typeof error === "string" ? error : "Bir hata oluştu."}</p>
              <button onClick={() => dispatch(getProducts({ ...query, page: 1 }))} className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl font-semibold">Tekrar dene</button>
            </div>

          ) : initialLoading ? (

            <div className={`grid gap-5 ${viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 max-w-4xl mx-auto"}`}>
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} list={viewMode === "list"} />)}
            </div>

          ) : products.length === 0 ? (

            <div className="text-center py-20">
              <Search size={56} className="mx-auto mb-4 text-gray-300 dark:text-slate-700" />
              <h3 className="text-xl font-bold mb-2">Ürün bulunamadı</h3>
              <p className="text-gray-500 dark:text-slate-400 mb-6">Arama ya da filtreleri değiştirmeyi dene.</p>
              {hasActiveFilters && <button onClick={resetFilters} className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl font-semibold">Filtreleri sıfırla</button>}
            </div>

          ) : (

            <>
              <div className={`grid gap-5 ${viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 max-w-4xl mx-auto"} ${listLoading ? "opacity-60 transition-opacity" : ""}`}>
                {products.map((p) => (
                  <ProductCard
                    key={getProductId(p)}
                    product={p}
                    list={viewMode === "list"}
                    wished={wishlist.includes(getProductId(p))}
                    onOpen={() => openProduct(p)}
                    onAdd={() => handleAddToCart(p)}
                    onWish={() => toggleWishlist(p)}
                  />
                ))}
              </div>

              <div className="text-center mt-12">
                {hasMore ? (
                  <button onClick={loadMore} disabled={listLoading} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-blue-500 px-8 py-3.5 rounded-2xl font-semibold inline-flex items-center gap-2 transition-colors disabled:opacity-60">
                    {listLoading ? "Yükleniyor…" : "Daha fazla göster"}
                    {!listLoading && <ChevronDown size={17} />}
                  </button>
                ) : (
                  <p className="text-sm text-gray-400">{productCount} ürünün tamamı gösteriliyor</p>
                )}
              </div>
            </>
          )}

        </div>

      </section>

      {/* ── Favoriler ── */}
      {wishlist.length > 0 && (
        <button onClick={() => navigate("/favorite")} aria-label="Favoriler" className="fixed bottom-8 right-8 bg-gradient-to-br from-red-500 to-pink-500 w-14 h-14 rounded-full flex items-center justify-center shadow-xl shadow-red-500/30 hover:scale-110 transition-transform z-40 text-white">
          <Heart fill="currentColor" size={22} />
          <span className="absolute -top-1.5 -right-1.5 bg-white text-red-500 min-w-[24px] h-6 px-1 rounded-full flex items-center justify-center text-xs font-bold shadow">{wishlist.length}</span>
        </button>
      )}

      {/* ── Sepete eklendi ── */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 pl-4 pr-2 py-2 rounded-2xl shadow-2xl max-w-[90vw]">
          <span className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0"><Check size={15} className="text-white" /></span>
          <span className="text-sm font-medium truncate">Sepete eklendi: {toast}</span>
          <button onClick={() => navigate("/cart")} className="flex-shrink-0 bg-white/10 dark:bg-gray-900/10 hover:bg-white/20 px-3 py-1.5 rounded-xl text-sm font-semibold">Sepete git</button>
        </div>
      )}

    </div>
  );
};

export default Products;
