import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Package, ChevronDown, Loader2, MapPin, CreditCard, Truck, Gift, XCircle, RotateCcw, AlertCircle, ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react';

import { fetchMyOrders, cancelMyOrder, requestOrderReturn } from '../../redux/orderSlice';
import { formatTL, orderNumberOf, ORDER_STATUS, PAYMENT_METHOD_LABEL, BANK_ACCOUNTS } from '../../utils/checkout';

const FILTERS = [
  { value: '', label: 'Tümü' },
  { value: 'pending', label: 'Onay bekleyen' },
  { value: 'shipped', label: 'Kargoda' },
  { value: 'delivered', label: 'Teslim edilen' },
  { value: 'cancelled', label: 'İptal' },
];

const RETURN_STATUS = { requested: 'İade talebi inceleniyor', approved: 'İade onaylandı', rejected: 'İade talebi reddedildi', completed: 'İade tamamlandı' };

const formatDate = (d) => (d ? new Date(d).toLocaleString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '');

const StatusBadge = ({ status }) => {
  const meta = ORDER_STATUS[status] || { label: status, cls: 'bg-gray-100 text-gray-600' };
  return <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${meta.cls}`}>{meta.label}</span>;
};

const itemImage = (item) => item.image || item.product?.images?.[0]?.file || item.product?.images?.[0]?.preview || '';

// İptal / iade için kısa onay alanı
const ReasonBox = ({ title, placeholder, confirmLabel, danger, busy, onConfirm, onCancel }) => {
  const [reason, setReason] = useState('');
  return (
    <div className="mt-4 p-4 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 space-y-3">
      <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
      <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2} maxLength={300} placeholder={placeholder} className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" />
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700">Vazgeç</button>
        <button onClick={() => onConfirm(reason.trim())} disabled={busy} className={`px-4 py-2 rounded-xl text-sm font-bold text-white disabled:opacity-60 flex items-center gap-2 ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
          {busy && <Loader2 size={14} className="animate-spin" />} {confirmLabel}
        </button>
      </div>
    </div>
  );
};

const OrderCard = ({ order }) => {

  const dispatch = useDispatch();
  const { actionLoading } = useSelector((s) => s.orders);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(null); // 'cancel' | 'return'
  const [message, setMessage] = useState(null);
  const [copied, setCopied] = useState(false);

  const p = order.pricing || {};
  const products = (order.items || []).filter((i) => !i.isGift);
  const gifts = (order.items || []).filter((i) => i.isGift);
  const number = orderNumberOf(order);
  const canCancel = ['pending', 'confirmed'].includes(order.status);
  const canReturn = order.status === 'delivered' && !order.return?.requested;
  const awaitingTransfer = order.payment?.method === 'bank_transfer' && order.payment?.status === 'pending' && order.status === 'pending';

  const run = async (thunk, reason, okText) => {
    setMessage(null);
    try {
      await dispatch(thunk({ id: order._id, reason: reason || undefined })).unwrap();
      setMode(null);
      setMessage({ type: 'ok', text: okText });
    } catch (e) {
      setMessage({ type: 'error', text: e?.message || 'İşlem yapılamadı.' });
    }
  };

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(number);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden">

      <button onClick={() => setOpen((v) => !v)} className="w-full text-left p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4" aria-expanded={open}>
        <div className="flex -space-x-3 flex-shrink-0">
          {products.slice(0, 3).map((item, i) => (
            <div key={i} className="w-14 h-14 rounded-2xl border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 overflow-hidden">
              {itemImage(item) ? <img src={itemImage(item)} alt="" className="w-full h-full object-cover" /> : <Package className="m-auto mt-4 text-slate-400" size={20} />}
            </div>
          ))}
          {products.length > 3 && <div className="w-14 h-14 rounded-2xl border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300">+{products.length - 3}</div>}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-mono font-bold text-slate-900 dark:text-white">{number}</span>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{products.map((i) => i.name).join(', ')}</p>
          <p className="text-xs text-slate-400 mt-0.5">{formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3 md:text-right">
          <div>
            <p className="text-lg font-black text-slate-900 dark:text-white">{formatTL(p.total)}</p>
            <p className="text-xs text-slate-400">{products.reduce((s, i) => s + i.quantity, 0)} ürün</p>
          </div>
          <ChevronDown size={20} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {open && (
        <div className="px-5 md:px-6 pb-6 border-t border-slate-100 dark:border-slate-800 pt-5 space-y-5">

          {awaitingTransfer && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-sm text-amber-800 dark:text-amber-300 space-y-1">
              <p className="font-bold">Havale bekleniyor: {formatTL(p.total)}</p>
              <p>Açıklamaya <strong>{number}</strong> yaz. {BANK_ACCOUNTS[0] && <>IBAN: <span className="font-mono">{BANK_ACCOUNTS[0].iban}</span> ({BANK_ACCOUNTS[0].bank})</>}</p>
            </div>
          )}

          {order.shipping?.trackingNumber && (
            <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 text-sm text-cyan-800 dark:text-cyan-300 flex items-center gap-2">
              <Truck size={16} /> {order.shipping.carrier || 'Kargo'} · Takip no: <span className="font-mono font-bold">{order.shipping.trackingNumber}</span>
            </div>
          )}

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {products.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">{itemImage(item) && <img src={itemImage(item)} alt="" className="w-full h-full object-cover" />}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.name}</p>
                  <p className="text-xs text-slate-400">{[item.selectedModel, item.selectedColor].filter(Boolean).join(' · ')}{item.selectedModel || item.selectedColor ? ' · ' : ''}{item.quantity} × {formatTL(item.price)}</p>
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{formatTL(item.totalPrice)}</p>
              </div>
            ))}
            {gifts.map((item, i) => (
              <div key={`g${i}`} className="flex items-center gap-3 py-3 text-purple-600 dark:text-purple-400">
                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center flex-shrink-0"><Gift size={20} /></div>
                <p className="flex-1 text-sm font-semibold">{item.name} × {item.quantity}</p>
                <p className="text-sm font-bold">Hediye</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-sm space-y-1.5">
              <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>Ara toplam</span><span>{formatTL(p.subtotal)}</span></div>
              {(order.coupons?.length ? order.coupons : order.coupon?.code ? [{ code: order.coupon.code, discount: p.couponDiscount }] : []).filter((c) => c.discount > 0).map((c) => (
                <div key={c.code} className="flex justify-between text-green-600 dark:text-green-400"><span>{c.auto ? c.name : `Kupon (${c.code})`}</span><span>-{formatTL(c.discount)}</span></div>
              ))}
              <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>Kargo</span><span>{p.shipping ? formatTL(p.shipping) : 'Ücretsiz'}</span></div>
              <div className="flex justify-between font-bold text-slate-900 dark:text-white pt-1.5 border-t border-slate-200 dark:border-slate-700"><span>Toplam</span><span>{formatTL(p.total)}</span></div>
              <p className="text-xs text-slate-400 text-right">KDV dahil{p.tax ? ` (içindeki KDV: ${formatTL(p.tax)})` : ''}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-sm space-y-3">
              <div className="flex gap-2 text-slate-600 dark:text-slate-400"><MapPin size={16} className="flex-shrink-0 mt-0.5" /><span>{order.shippingAddress?.fullName} · {order.shippingAddress?.phone}<br />{order.shippingAddress?.address}<br />{order.shippingAddress?.district} / {order.shippingAddress?.city}</span></div>
              <div className="flex gap-2 text-slate-600 dark:text-slate-400"><CreditCard size={16} className="flex-shrink-0 mt-0.5" /><span>{PAYMENT_METHOD_LABEL[order.payment?.method] || '-'}{order.payment?.cardLast4 ? ` •••• ${order.payment.cardLast4}` : ''}</span></div>
              {(order.perks?.freeInstallation || order.perks?.warrantyExtraMonths > 0) && (
                <div className="flex gap-2 text-purple-600 dark:text-purple-400"><Gift size={16} className="flex-shrink-0 mt-0.5" /><span>{[order.perks.freeInstallation && 'Ücretsiz kurulum', order.perks.warrantyExtraMonths > 0 && `${order.perks.warrantyExtraMonths} ay ek garanti`].filter(Boolean).join(' · ')}</span></div>
              )}
            </div>
          </div>

          {order.statusHistory?.length > 0 && (
            <ol className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-2 space-y-3">
              {[...order.statusHistory].reverse().map((h, i) => (
                <li key={h._id || i} className="ml-4">
                  <span className={`absolute -left-[7px] w-3 h-3 rounded-full ${i === 0 ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`} />
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{ORDER_STATUS[h.status]?.label || h.status}</p>
                  {h.note && <p className="text-xs text-slate-500 dark:text-slate-400">{h.note}</p>}
                  <p className="text-xs text-slate-400">{formatDate(h.createdAt)}</p>
                </li>
              ))}
            </ol>
          )}

          {order.return?.requested && <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2"><RotateCcw size={16} /> {RETURN_STATUS[order.return.status] || 'İade talebi var'}</p>}

          {message && (
            <p className={`text-sm flex items-center gap-2 ${message.type === 'error' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}><AlertCircle size={16} /> {message.text}</p>
          )}

          <div className="flex flex-wrap gap-2">
            <button onClick={copyNumber} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">{copied ? <Check size={15} /> : <Copy size={15} />} Sipariş no</button>
            {canCancel && !mode && <button onClick={() => setMode('cancel')} className="px-4 py-2 rounded-xl border border-red-200 dark:border-red-500/30 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-1.5"><XCircle size={15} /> Siparişi iptal et</button>}
            {canReturn && !mode && <button onClick={() => setMode('return')} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5"><RotateCcw size={15} /> İade talebi oluştur</button>}
          </div>

          {mode === 'cancel' && (
            <ReasonBox title="Siparişi iptal etmek istediğine emin misin?" placeholder="İptal nedeni (isteğe bağlı)" confirmLabel="Evet, iptal et" danger busy={actionLoading}
              onCancel={() => setMode(null)} onConfirm={(reason) => run(cancelMyOrder, reason, 'Siparişin iptal edildi.')} />
          )}
          {mode === 'return' && (
            <ReasonBox title="İade nedeni" placeholder="Kısaca neden iade etmek istediğini yaz" confirmLabel="İade talebi gönder" busy={actionLoading}
              onCancel={() => setMode(null)} onConfirm={(reason) => run(requestOrderReturn, reason, 'İade talebin alındı.')} />
          )}

        </div>
      )}
    </div>
  );
};

const MyOrders = () => {

  const dispatch = useDispatch();
  const { myOrders, myOrdersLoading, myOrdersError, myPagination } = useSelector((s) => s.orders);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchMyOrders({ status, page, limit: 10 }));
  }, [dispatch, status, page]);

  return (
    <div className="space-y-6">

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button key={f.value} onClick={() => { setStatus(f.value); setPage(1); }} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${status === f.value ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}>{f.label}</button>
        ))}
      </div>

      {myOrdersLoading && !myOrders.length && <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-blue-500" /></div>}

      {myOrdersError && <p className="text-sm text-red-500">{myOrdersError}</p>}

      {!myOrdersLoading && !myOrdersError && myOrders.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-4">
          <Package size={40} className="mx-auto text-slate-300 dark:text-slate-600" />
          <p className="text-slate-600 dark:text-slate-400">{status ? 'Bu durumda siparişin yok.' : 'Henüz siparişin yok.'}</p>
          <Link to="/products" className="inline-flex bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold">Alışverişe başla</Link>
        </div>
      )}

      <div className={`space-y-4 ${myOrdersLoading ? 'opacity-60' : ''}`}>
        {myOrders.map((order) => <OrderCard key={order._id} order={order} />)}
      </div>

      {myPagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40" aria-label="Önceki"><ChevronLeft size={18} /></button>
          <span className="text-sm text-slate-600 dark:text-slate-400">{page} / {myPagination.totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(myPagination.totalPages, p + 1))} disabled={page >= myPagination.totalPages} className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40" aria-label="Sonraki"><ChevronRight size={18} /></button>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
