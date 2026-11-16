import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home, Package, Building2, Copy, Loader2, Gift, MapPin, CreditCard, Clock } from 'lucide-react';

import { fetchMyOrder } from '../../redux/orderSlice';
import { formatTL, orderNumberOf, PAYMENT_METHOD_LABEL, BANK_ACCOUNTS, SUPPORT_EMAIL } from '../../utils/checkout';

const PaymentSuccess = () => {

  const dispatch = useDispatch();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order');

  const [order, setOrder] = useState(location.state?.order ?? null);
  const [loading, setLoading] = useState(!order && !!orderId);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(null);
  const [showConfetti, setShowConfetti] = useState(!!location.state?.order);

  // Sayfa yenilenirse sipariş sunucudan alınır
  useEffect(() => {
    if (order || !orderId) return;
    dispatch(fetchMyOrder(orderId)).unwrap()
      .then(setOrder)
      .catch((e) => setError(e?.message || 'Sipariş bulunamadı.'))
      .finally(() => setLoading(false));
  }, [dispatch, order, orderId]);

  useEffect(() => {
    if (!showConfetti) return undefined;
    const timer = setTimeout(() => setShowConfetti(false), 6000);
    return () => clearTimeout(timer);
  }, [showConfetti]);

  // Konfeti her render'da yeniden rastgele dağılmasın
  const confetti = useMemo(() => [...Array(60)].map(() => ({
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 4}s`,
    backgroundColor: ['#3b82f6', '#8b5cf6', '#22c55e', '#eab308'][Math.floor(Math.random() * 4)],
    opacity: Math.random() * 0.8 + 0.4,
  })), []);

  if (!order && !orderId) return <Navigate to="/" replace />;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
        <Loader2 size={32} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 p-6">
        <div className="text-center space-y-4">
          <p className="text-gray-700 dark:text-slate-300">{error || 'Sipariş bulunamadı.'}</p>
          <Link to="/user/userprofile?tab=orders" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold">Siparişlerime git</Link>
        </div>
      </div>
    );
  }

  const number = orderNumberOf(order);
  const isBank = order.payment?.method === 'bank_transfer';
  const p = order.pricing || {};
  const products = (order.items || []).filter((i) => !i.isGift);
  const gifts = (order.items || []).filter((i) => i.isGift);

  const copy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1800);
    } catch {}
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 flex items-center justify-center p-6 relative overflow-hidden">

      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {confetti.map((style, i) => <div key={i} className="absolute w-2 h-2 rounded-full animate-fall" style={style} />)}
        </div>
      )}

      <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl dark:shadow-none border border-gray-100 dark:border-slate-800 overflow-hidden relative">

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-10 text-center relative">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6 shadow-xl"><CheckCircle size={64} className="text-green-500" /></div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Siparişin alındı!</h1>
          <p className="text-green-100 text-lg">{isBank ? 'Havaleni yaptıktan sonra siparişin onaylanacak.' : 'Siparişin onaylandığında bildirim alacaksın.'}</p>
          <button onClick={() => copy(number, 'number')} className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 text-green-600 dark:text-green-400 text-sm font-bold px-6 py-2 rounded-2xl shadow-md border border-green-100 dark:border-green-500/20 flex items-center gap-2 whitespace-nowrap">
            Sipariş No: {number} {copied === 'number' ? <CheckCircle size={14} /> : <Copy size={14} />}
          </button>
        </div>

        <div className="p-8 pt-10 space-y-6">

          {isBank && (
            <div className="rounded-2xl border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10 p-5 space-y-3">
              <p className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2"><Building2 size={18} /> {formatTL(p.total)} tutarını havale et</p>
              <p className="text-sm text-amber-700 dark:text-amber-400">Açıklamaya <strong>{number}</strong> yaz. Dekontu <a href={`mailto:${SUPPORT_EMAIL}`} className="underline">{SUPPORT_EMAIL}</a> adresine gönderebilirsin.</p>
              {BANK_ACCOUNTS.map((b) => (
                <div key={b.bank} className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 rounded-xl p-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{b.bank} · {b.holder}</p>
                    <p className="font-mono text-xs text-gray-600 dark:text-slate-300 break-all">{b.iban}</p>
                  </div>
                  <button onClick={() => copy(b.iban.replace(/\s/g, ''), b.bank)} className="text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center gap-1 flex-shrink-0">
                    {copied === b.bank ? <CheckCircle size={14} /> : <Copy size={14} />} {copied === b.bank ? 'Kopyalandı' : 'Kopyala'}
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-5 space-y-3">
            {products.map((item, i) => (
              <div key={i} className="flex justify-between gap-3 text-sm">
                <span className="text-gray-700 dark:text-slate-300">{item.name}{item.selectedModel ? ` (${item.selectedModel})` : ''} × {item.quantity}</span>
                <span className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">{formatTL(item.totalPrice)}</span>
              </div>
            ))}
            {gifts.map((item, i) => (
              <div key={`g${i}`} className="flex justify-between text-sm text-purple-600 dark:text-purple-400 font-semibold">
                <span className="flex items-center gap-1.5"><Gift size={14} /> {item.name}</span><span>Hediye</span>
              </div>
            ))}
            <div className="border-t border-dashed border-gray-300 dark:border-slate-700 pt-3 space-y-1.5 text-sm">
              {p.couponDiscount > 0 && <div className="flex justify-between text-green-600 dark:text-green-400"><span>İndirim{order.coupons?.length ? ` (${order.coupons.map((c) => c.code).join(', ')})` : ''}</span><span>-{formatTL(p.couponDiscount)}</span></div>}
              <div className="flex justify-between text-gray-600 dark:text-slate-400"><span>Kargo</span><span>{p.shipping ? formatTL(p.shipping) : 'Ücretsiz'}</span></div>
              <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white"><span>Toplam</span><span>{formatTL(p.total)}</span></div>
              <p className="text-xs text-gray-400 text-right">KDV dahil</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2 text-gray-600 dark:text-slate-400"><MapPin size={16} className="flex-shrink-0 mt-0.5" /><span>{order.shippingAddress?.fullName}<br />{order.shippingAddress?.district} / {order.shippingAddress?.city}</span></div>
            <div className="flex items-start gap-2 text-gray-600 dark:text-slate-400"><CreditCard size={16} className="flex-shrink-0 mt-0.5" /><span>{PAYMENT_METHOD_LABEL[order.payment?.method] || '-'}{order.payment?.cardLast4 ? ` •••• ${order.payment.cardLast4}` : ''}<br /><span className="inline-flex items-center gap-1"><Clock size={12} /> Ödeme onayı bekleniyor</span></span></div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/user/userprofile?tab=orders" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-bold hover:brightness-105 transition-all flex items-center justify-center gap-2"><Package size={18} /> Siparişlerim <ArrowRight size={18} /></Link>
            <Link to="/products" className="flex-1 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 py-4 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"><Home size={18} /> Alışverişe devam et</Link>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg); }
          100% { transform: translateY(110vh) rotate(720deg); }
        }
        .animate-fall { top: -10px; animation: fall 4s linear infinite; }
      `}</style>

    </div>
  );
};

export default PaymentSuccess;
