import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

import { removeFromCart, updateQuantity, clearCart, validateCart, acknowledgeCartChanges, fetchQuote, applyCoupon, removeCoupon, clearCouponMessage, fetchAvailableCoupons } from '../../redux/cartSlice';
import { calcLocalTotals, formatTL, freeShippingProgress, FREE_SHIPPING_THRESHOLD } from '../../utils/checkout';

import { ShoppingBag, Trash2, ShieldCheck, CreditCard, Tag, ArrowLeft, Plus, Minus, Truck, RotateCcw, ChevronRight, X, AlertTriangle, Lock, RefreshCw, Gift, Sparkles, Ticket, Loader2, ChevronDown, Info } from 'lucide-react';

const UNAVAILABLE_TEXT = {
  out_of_stock: 'Stokta kalmadı',
  model_not_found: 'Bu model artık satılmıyor',
  not_found: 'Ürün artık satışta değil',
  unavailable: 'Şu an satın alınamıyor',
};

// Tailwind sınıfları dinamik üretilemez (derlemede silinir); her renk tam yazılmalı
const FEATURES = [
  { icon: Truck, label: 'Bedava Kargo', sub: `${formatTL(FREE_SHIPPING_THRESHOLD, false)} ve Üzeri`, box: 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20', iconBg: 'bg-emerald-500', title: 'text-emerald-800 dark:text-emerald-400', subCls: 'text-emerald-600 dark:text-emerald-500' },
  { icon: ShieldCheck, label: 'Güvenli Ödeme', sub: 'SSL ile korunur', box: 'border-orange-200 dark:border-orange-900/40 bg-orange-50/50 dark:bg-orange-950/20', iconBg: 'bg-orange-500', title: 'text-orange-800 dark:text-orange-400', subCls: 'text-orange-600 dark:text-orange-500' },
  { icon: CreditCard, label: 'Kart veya Havale', sub: 'İki ödeme seçeneği', box: 'border-blue-200 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20', iconBg: 'bg-blue-500', title: 'text-blue-800 dark:text-blue-400', subCls: 'text-blue-600 dark:text-blue-500' },
  { icon: RotateCcw, label: 'Kolay İade', sub: '14 Gün Koşulsuz', box: 'border-purple-200 dark:border-purple-900/40 bg-purple-50/50 dark:bg-purple-950/20', iconBg: 'bg-purple-500', title: 'text-purple-800 dark:text-purple-400', subCls: 'text-purple-600 dark:text-purple-500' },
];

// Kupon kartında indirimin kısa açıklaması
const couponValueText = (c) => {
  switch (c.discountType) {
    case 'percentage': return `%${c.value} indirim${c.maxDiscountAmount ? ` (en fazla ${formatTL(c.maxDiscountAmount, false)})` : ''}`;
    case 'fixed': return `${formatTL(c.value, false)} indirim`;
    case 'free_shipping': return 'Kargo bedava';
    case 'buy_x_get_y': return c.buyXGetY ? `${c.buyXGetY.buyQuantity + c.buyXGetY.getQuantity} al ${c.buyXGetY.buyQuantity} öde` : 'X al Y öde';
    case 'tiered_percentage': return 'Sepet tutarına göre artan % indirim';
    case 'tiered_fixed': return 'Sepet tutarına göre artan indirim';
    case 'gift_product': return 'Hediye ürün';
    case 'free_installation': return 'Ücretsiz kurulum';
    case 'extended_warranty': return `${c.warrantyExtraMonths} ay ek garanti`;
    default: return '';
  }
};

const appliedBenefitText = (a) => {
  if (a.gift) return `Hediye: ${a.gift.name || 'ürün'}`;
  if (a.freeShipping && !a.discount) return 'Kargo bedava';
  if (a.perks?.freeInstallation) return 'Ücretsiz kurulum';
  if (a.perks?.warrantyExtraMonths) return `${a.perks.warrantyExtraMonths} ay ek garanti`;
  return `-${formatTL(a.discount)}`;
};

const Cart = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [showCoupons, setShowCoupons] = useState(false);

  const { carts, validating, couponCode, couponApplying, couponMessage, quote, quoting, quoteStale, availableCoupons, availableLoading } = useSelector(state => state.cart);
  const { isAuth } = useSelector(state => state.user);

  // Sayfa açılınca güncel fiyat ve stok
  useEffect(() => {
    dispatch(validateCart());
  }, [dispatch]);

  // Sepet ya da kupon değişince sunucu hesabı (kısa gecikmeyle, art arda tıklamalarda tek istek)
  const cartSignature = carts.map((i) => `${i.cartKey}:${i.quantity}:${i.unavailable ? 0 : 1}`).join('|');

  useEffect(() => {
    if (!isAuth || !carts.length) return undefined;
    const t = setTimeout(() => dispatch(fetchQuote()), 350);
    return () => clearTimeout(t);
  }, [dispatch, isAuth, cartSignature, couponCode]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isAuth && showCoupons && carts.length) dispatch(fetchAvailableCoupons());
  }, [dispatch, isAuth, showCoupons, cartSignature]); // eslint-disable-line react-hooks/exhaustive-deps

  const activeItems = carts.filter((item) => !item.unavailable);
  const unavailableItems = carts.filter((item) => item.unavailable);
  const changedItems = carts.filter((item) => item.priceChanged || item.quantityAdjusted);

  const localTotals = useMemo(() => calcLocalTotals(carts), [carts]);
  const serverReady = isAuth && quote && !quoteStale;
  const totals = serverReady ? quote.totals : localTotals;
  const applied = serverReady ? quote.applied ?? [] : [];
  const hints = serverReady ? quote.hints ?? [] : [];
  const issues = serverReady ? quote.issues ?? [] : [];
  const pendingCouponError = serverReady && couponCode ? quote.couponError : null;
  const calculating = isAuth && (quoting || quoteStale) && carts.length > 0;

  const canCheckout = activeItems.length > 0 && unavailableItems.length === 0 && issues.length === 0 && !validating;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponInput.trim();
    if (!code) return;
    dispatch(applyCoupon({ code })).unwrap().then(() => setCouponInput('')).catch(() => {});
  };

  const applyFromList = (code) => {
    dispatch(applyCoupon({ code })).unwrap().then(() => setShowCoupons(false)).catch(() => {});
  };

  const handleClearCart = () => {

    if (window.confirm('Sepetteki tüm ürünler silinsin mi?')) dispatch(clearCart());
  };

  const handleRemoveUnavailable = () => {

    unavailableItems.forEach((item) => dispatch(removeFromCart(item.cartKey)));
  };

  const goCheckout = () => navigate(isAuth ? '/payment' : '/auth?redirect=/cart');

  const getImage = (item) => item.images?.[0]?.file || item.images?.[0]?.preview || item.image || '';

  if (carts.length === 0) return (

    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center p-4">

      <div className="text-center space-y-5 max-w-md">

        <div className="w-24 h-24 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
          <ShoppingBag size={40} className="text-gray-300 dark:text-slate-600" />
        </div>

        <div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sepetiniz Boş</h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed">Evinizi akıllandıracak ürünleri keşfedin ve sepetinize ekleyin.</p>

        </div>

        <Link to="/products" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/20">
          <ArrowLeft size={18} /> Alışverişe Başla
        </Link>

      </div>

    </div>
  );

  return (

    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white py-12 px-4 sm:px-6 lg:px-8">

      <div className="max-w-6xl mx-auto">

        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 mb-8">

          <Link to="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">Ana Sayfa</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 dark:text-white font-medium">Sepetim</span>

        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">

          <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-3">

            <div className="p-2.5 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/25"><ShoppingBag size={24} className="text-white" /></div>
            Alışveriş Sepetim
            <span className="text-sm font-normal bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">{totals.quantity} ürün</span>

          </h1>

          <button onClick={handleClearCart} className="self-start sm:self-auto flex items-center gap-2 text-sm text-red-400 hover:text-red-500 border border-red-400/20 hover:border-red-400/40 px-4 py-2 rounded-xl transition-colors">
            <Trash2 size={15} /> Sepeti Temizle
          </button>

        </div>

        {/* Fiyat / adet değişikliği */}
        {changedItems.length > 0 && (

          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-2xl p-4 mb-4 flex items-start gap-3">

            <AlertTriangle size={20} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />

            <div className="flex-1 min-w-0 text-sm">

              <p className="font-semibold text-amber-800 dark:text-amber-300 mb-1">Sepetindeki bazı ürünler güncellendi</p>

              <ul className="space-y-0.5 text-amber-700 dark:text-amber-400">
                {changedItems.map((item) => (
                  <li key={item.cartKey}>
                    {item.name}
                    {item.priceChanged && <> · fiyat {formatTL(item.priceChanged.from)} → <strong>{formatTL(item.priceChanged.to)}</strong></>}
                    {item.quantityAdjusted && <> · adet stoğa göre {item.quantity}'e düşürüldü</>}
                  </li>
                ))}
              </ul>

            </div>

            <button onClick={() => dispatch(acknowledgeCartChanges())} aria-label="Kapat" className="text-amber-600 hover:text-amber-800 dark:hover:text-amber-200 flex-shrink-0"><X size={16} /></button>

          </div>
        )}

        {/* Satın alınamayan ürünler */}
        {unavailableItems.length > 0 && (

          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 rounded-2xl p-4 mb-4 flex items-center gap-3">

            <AlertTriangle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="flex-1 text-sm font-semibold text-red-700 dark:text-red-400">{unavailableItems.length} ürün şu an satın alınamıyor. Devam etmek için sepetten çıkar.</p>
            <button onClick={handleRemoveUnavailable} className="flex-shrink-0 text-sm font-semibold text-red-700 dark:text-red-300 bg-white dark:bg-red-900/30 border border-red-200 dark:border-red-800 px-3 py-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">Hepsini çıkar</button>

          </div>
        )}

        {issues.length > 0 && (

          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 rounded-2xl p-4 mb-4 flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <ul className="text-sm text-red-700 dark:text-red-400 space-y-0.5">
              {issues.map((issue) => <li key={`${issue.index}-${issue.code}`}>{issue.message}</li>)}
            </ul>
          </div>
        )}

        {totals.remainingForFreeShipping > 0 && totals.shipping > 0 && ( <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 mb-6 flex items-center gap-4 shadow-sm">

          <div className="p-2.5 bg-blue-500/10 rounded-xl flex-shrink-0"><Truck size={20} className="text-blue-500" /></div>

          <div className="flex-1 min-w-0">

            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5">Ücretsiz kargo için{' '}<span className="text-blue-600 dark:text-blue-400">{formatTL(totals.remainingForFreeShipping)}</span>{' '}daha ekleyin</p>

            <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2">

              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${freeShippingProgress(totals.subtotal)}%` }}/>

            </div>

          </div>

          <span className="text-sm font-bold text-gray-500 dark:text-slate-400 flex-shrink-0">{Math.round(freeShippingProgress(totals.subtotal))}%</span>

        </div> )}

        {totals.subtotal > 0 && totals.shipping === 0 && ( <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/40 rounded-2xl p-4 mb-6 flex items-center gap-3">

          <Truck size={20} className="text-green-600 dark:text-green-400" />
          <p className="text-sm font-semibold text-green-700 dark:text-green-400">Tebrikler! Kargo ücretsiz.</p>

        </div> )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-4">

            {carts.map(item => {

              const unavailable = !!item.unavailable;
              const maxQty = Number(item.stock) > 0 ? Number(item.stock) : 99;
              const showOld = Number(item.oldPrice) > Number(item.price);

              return (

                <div key={item.cartKey} className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-sm transition-all ${unavailable ? 'border-red-200 dark:border-red-900/50' : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700'}`}>

                  <div className="flex gap-4">

                    <Link to={`/productdetail/${item.slug}`} className="flex-shrink-0">

                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">

                        <img src={getImage(item)} alt={item.name} className={`w-full h-full object-cover hover:scale-105 transition-transform duration-300 ${unavailable ? 'opacity-40 grayscale' : ''}`}/>

                      </div>

                    </Link>

                    <div className="flex-1 min-w-0">

                      <div className="flex items-start justify-between gap-2">

                        <div className="min-w-0">

                          {item.category && <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-md">{item.category}</span>}

                          <Link to={`/productdetail/${item.slug}`}>
                            <h3 className={`font-bold mt-1 line-clamp-2 hover:text-blue-500 transition-colors leading-snug ${unavailable ? 'text-gray-400 dark:text-slate-500' : 'text-gray-900 dark:text-white'}`}>{item.name}</h3>
                          </Link>

                          <div className="flex flex-wrap gap-2 mt-1">

                            {item.selectedModel && ( <span className="text-xs text-gray-400 dark:text-slate-500 bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">Model: {item.selectedModel}</span> )}
                            {item.selectedColor && ( <span className="text-xs text-gray-400 dark:text-slate-500 bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">Renk: {item.selectedColor}</span> )}

                          </div>

                          {unavailable && (
                            <p className="text-xs font-semibold text-red-600 dark:text-red-400 mt-2 flex items-center gap-1"><AlertTriangle size={12} /> {UNAVAILABLE_TEXT[item.unavailable] ?? UNAVAILABLE_TEXT.unavailable}</p>
                          )}

                        </div>

                        <button onClick={() => dispatch(removeFromCart(item.cartKey))} aria-label="Ürünü sepetten çıkar" className="p-1.5 text-gray-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all flex-shrink-0">
                          <X size={16} />
                        </button>

                      </div>

                      {!unavailable && (

                        <div className="flex items-center justify-between mt-4">

                          <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 rounded-xl p-1">

                            <button onClick={() => dispatch(updateQuantity({ key: item.cartKey, quantity: item.quantity - 1 }))} disabled={item.quantity <= 1} aria-label="Azalt" className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 transition-colors">
                              <Minus size={13} />
                            </button>

                            <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>

                            <button onClick={() => dispatch(updateQuantity({ key: item.cartKey, quantity: item.quantity + 1 }))} disabled={item.quantity >= maxQty} aria-label="Artır" className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 transition-colors">
                              <Plus size={13} />
                            </button>

                          </div>

                          <div className="text-right">

                            <p className="text-xs text-gray-400 dark:text-slate-500">{item.quantity} × {formatTL(item.price)}</p>
                            {showOld && ( <p className="text-xs text-gray-400 dark:text-slate-500 line-through">{formatTL(item.oldPrice * item.quantity)}</p> )}
                            <p className="text-lg font-black text-gray-900 dark:text-white">{formatTL(item.price * item.quantity)}</p>

                          </div>

                        </div>
                      )}

                    </div>

                  </div>

                </div>
              );
            })}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">

              {FEATURES.map(({ icon: Icon, label, sub, box, iconBg, title, subCls }) => ( <div key={label} className={`flex flex-col items-center text-center p-4 rounded-2xl border ${box}`}>

                <div className={`w-10 h-10 rounded-xl ${iconBg} text-white flex items-center justify-center mb-2 shadow-sm`}><Icon size={18} /></div>
                <span className={`text-[11px] font-bold leading-tight ${title}`}>{label}</span>
                <span className={`text-[10px] mt-0.5 ${subCls}`}>{sub}</span>

              </div> ))}

            </div>

          </div>

          <div className="space-y-4">

            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">

              <h3 className="font-bold mb-3 flex items-center gap-2 text-gray-900 dark:text-white"><Tag size={18} className="text-purple-500" /> Kupon</h3>

              {!isAuth ? (

                <div className="flex items-start gap-2 text-sm text-gray-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-800/60 rounded-xl p-3">
                  <Info size={16} className="flex-shrink-0 mt-0.5" />
                  <span><Link to="/auth?redirect=/cart" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Giriş yap</Link>, kupon kodunu kullan ve sana özel kuponları gör.</span>
                </div>

              ) : (

                <>
                  {/* Uygulanan kuponlar (elle girilen + otomatik) */}
                  {applied.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {applied.map((a) => (
                        <div key={a.coupon.code} className="flex items-center justify-between gap-2 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/40 rounded-xl px-3 py-2.5">
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-green-700 dark:text-green-400 flex items-center gap-1.5">
                              {a.auto ? <Sparkles size={14} /> : <Ticket size={14} />}
                              <span className="truncate">{a.auto ? a.coupon.name : a.coupon.code}</span>
                              {a.auto && <span className="text-[10px] font-semibold uppercase tracking-wide bg-green-600 text-white px-1.5 py-0.5 rounded">Otomatik</span>}
                            </p>
                            <p className="text-xs text-green-600 dark:text-green-500">{appliedBenefitText(a)}</p>
                            {a.warnings?.map((w) => <p key={w.code} className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">{w.message}</p>)}
                          </div>
                          {!a.auto && (
                            <button onClick={() => dispatch(removeCoupon())} aria-label="Kuponu kaldır" className="text-green-600 hover:text-red-500 transition-colors flex-shrink-0"><X size={16} /></button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Kayıtlı kod şu an uygulanamıyorsa (ör. tutar düştü) */}
                  {pendingCouponError && (
                    <div className="flex items-start justify-between gap-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-xl px-3 py-2.5 mb-3">
                      <div className="text-xs text-amber-700 dark:text-amber-400">
                        <p className="font-bold text-sm mb-0.5">{couponCode}</p>
                        {pendingCouponError.message}
                      </div>
                      <button onClick={() => dispatch(removeCoupon())} aria-label="Kuponu kaldır" className="text-amber-600 hover:text-red-500 flex-shrink-0"><X size={16} /></button>
                    </div>
                  )}

                  {!applied.some((a) => !a.auto) && !pendingCouponError && (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">

                      <div className="relative flex-1">
                        <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Kupon kodunuz" value={couponInput} onChange={e => { setCouponInput(e.target.value.toUpperCase()); if (couponMessage) dispatch(clearCouponMessage()); }} maxLength={32} className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm uppercase focus:outline-none focus:border-blue-500 transition-colors text-gray-900 dark:text-white"/>
                      </div>

                      <button type="submit" disabled={couponApplying || !couponInput.trim()} className="px-4 min-w-[84px] bg-gray-900 dark:bg-slate-700 hover:bg-gray-800 dark:hover:bg-slate-600 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center">
                        {couponApplying ? <Loader2 size={16} className="animate-spin" /> : 'Uygula'}
                      </button>

                    </form>
                  )}

                  {couponMessage && <p className="text-xs text-red-500 mt-2">{couponMessage}</p>}

                  {/* "₺X daha ekle" ipuçları */}
                  {hints.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      {hints.map((h, i) => (
                        <p key={i} className="text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/30 rounded-lg px-3 py-2 flex items-start gap-1.5">
                          <Gift size={13} className="flex-shrink-0 mt-0.5" />
                          <span>{h.name ? <strong>{h.name}: </strong> : null}{h.message}</span>
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Kullanıcının görebileceği kuponlar */}
                  <button onClick={() => setShowCoupons((v) => !v)} className="mt-3 w-full flex items-center justify-between text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700">
                    <span className="flex items-center gap-1.5"><Ticket size={15} /> Kuponlarım</span>
                    <ChevronDown size={16} className={`transition-transform ${showCoupons ? 'rotate-180' : ''}`} />
                  </button>

                  {showCoupons && (
                    <div className="mt-2 space-y-2">
                      {availableLoading && !availableCoupons.length && <p className="text-xs text-gray-400 flex items-center gap-1.5"><Loader2 size={12} className="animate-spin" /> Kuponlar yükleniyor…</p>}
                      {!availableLoading && !availableCoupons.length && <p className="text-xs text-gray-400">Şu an kullanabileceğin bir kupon yok.</p>}
                      {availableCoupons.map((c) => {
                        const isApplied = applied.some((a) => a.coupon.code === c.code);
                        return (
                          <div key={c.code} className={`rounded-xl border p-3 ${c.applicable ? 'border-purple-200 dark:border-purple-800/40 bg-purple-50/50 dark:bg-purple-950/20' : 'border-gray-200 dark:border-slate-700 opacity-80'}`}>
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{c.name}</p>
                                <p className="text-xs text-purple-700 dark:text-purple-300">{couponValueText(c)}{c.personal ? ' · sana özel' : ''}</p>
                                {c.message && <p className={`text-xs mt-1 ${c.applicable ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-slate-400'}`}>{c.message}</p>}
                                {c.expiresAt && <p className="text-[11px] text-gray-400 mt-1">Son gün: {new Date(c.expiresAt).toLocaleDateString('tr-TR')}</p>}
                              </div>
                              {isApplied ? (
                                <span className="text-xs font-bold text-green-600 flex-shrink-0">Uygulandı</span>
                              ) : c.isAuto ? (
                                <span className="text-[11px] text-gray-400 flex-shrink-0 text-right">Şartlar sağlanınca<br />otomatik</span>
                              ) : (
                                <button onClick={() => applyFromList(c.code)} disabled={!c.applicable || couponApplying} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-purple-600 text-white disabled:bg-gray-300 dark:disabled:bg-slate-700 disabled:text-gray-500 flex-shrink-0">Uygula</button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

            </div>

            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm sticky top-6">

              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-slate-800">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Sipariş Özeti</h3>
                {(validating || calculating) && <span className="flex items-center gap-1.5 text-xs text-gray-400"><RefreshCw size={12} className="animate-spin" /> Hesaplanıyor</span>}
              </div>

              <div className="space-y-3 text-sm">

                <div className="flex justify-between text-gray-600 dark:text-slate-400">

                  <span>Ara Toplam ({totals.quantity} ürün)</span>
                  <span>{formatTL(totals.subtotal)}</span>

                </div>

                {applied.filter((a) => a.discount > 0).map((a) => (
                  <div key={a.coupon.code} className="flex justify-between text-green-600 dark:text-green-400 font-semibold">
                    <span className="truncate pr-2">{a.auto ? a.coupon.name : `Kupon (${a.coupon.code})`}</span>
                    <span>-{formatTL(a.discount)}</span>
                  </div>
                ))}

                <div className="flex justify-between text-gray-600 dark:text-slate-400">

                  <span>Kargo</span>
                  {totals.shipping === 0
                    ? <span className="text-green-600 dark:text-green-400 font-semibold">{totals.shippingDiscount > 0 && <span className="line-through text-gray-400 font-normal mr-1.5">{formatTL(totals.shippingDiscount)}</span>}Ücretsiz</span>
                    : <span>{formatTL(totals.shipping)}</span>}

                </div>

                {serverReady && quote.gifts?.map((g) => (
                  <div key={g.product} className="flex justify-between text-purple-600 dark:text-purple-400 font-semibold">
                    <span className="flex items-center gap-1.5"><Gift size={14} /> {g.name || 'Hediye ürün'}</span>
                    <span>Hediye</span>
                  </div>
                ))}

                <div className="border-t border-gray-100 dark:border-slate-800 pt-3">

                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-gray-900 dark:text-white">Toplam</span>
                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{formatTL(totals.total)}</span>
                  </div>

                  <p className="text-xs text-gray-400 dark:text-slate-500 text-right mt-1">KDV dahil (içindeki KDV: {formatTL(totals.vat)})</p>

                </div>

              </div>

              <button onClick={goCheckout} disabled={!canCheckout} className="w-full mt-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                <CreditCard size={18} />
                {validating ? 'Kontrol ediliyor…' : isAuth ? 'Siparişi Tamamla' : 'Giriş Yap ve Devam Et'}
              </button>

              {unavailableItems.length > 0 && <p className="text-xs text-red-500 text-center mt-2">Satın alınamayan ürünleri çıkarman gerekiyor.</p>}

              <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-slate-500 mt-4">
                <Lock size={13} className="text-green-500" />
                <span>256-Bit SSL ile Güvenli Ödeme</span>
              </div>

              <Link to="/products" className="flex items-center justify-center gap-1 text-sm text-gray-400 dark:text-slate-500 hover:text-blue-500 transition-colors mt-4">
                <ArrowLeft size={14} /> Alışverişe Devam Et
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Cart;
