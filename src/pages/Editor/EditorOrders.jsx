// src/pages/editor/EditorOrders.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import EditorSidebar from '../../layout/EditorSidebar';
import {
  fetchOrders,
  updateOrderStatus,
  selectOrder,
  clearSelectedOrder,
  setFilters,
  clearOrderError,
} from '../../redux/orderSlice';

import {
  Package, Search, Sparkles, X, MapPin, CreditCard, User, Truck,
  ChevronLeft, ChevronRight, Loader2, ClipboardList, Save, AlertCircle
} from 'lucide-react';

const STATUS_META = {
  pending:   { label: 'Bekliyor',       cls: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' },
  confirmed: { label: 'Onaylandı',      cls: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' },
  preparing: { label: 'Hazırlanıyor',   cls: 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400' },
  shipped:   { label: 'Kargoda',        cls: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400' },
  delivered: { label: 'Teslim Edildi',  cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' },
  cancelled: { label: 'İptal',          cls: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' },
  refunded:  { label: 'İade Edildi',    cls: 'bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-slate-300' },
};

const PAYMENT_METHODS = {
  credit_card: 'Kredi Kartı',
  bank_transfer: 'Havale / EFT',
  cash_on_delivery: 'Kapıda Ödeme',
};

const PAYMENT_STATUS = {
  pending: 'Bekliyor',
  paid: 'Ödendi',
  failed: 'Başarısız',
  refunded: 'İade Edildi',
  partial_refund: 'Kısmi İade',
};

const money = (n) =>
  Number(n || 0).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });

const formatDate = (d) =>
  d ? new Date(d).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' }) : '-';

const StatusBadge = ({ status }) => {
  const meta = STATUS_META[status] || { label: status, cls: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${meta.cls}`}>
      {meta.label}
    </span>
  );
};

const inputCls =
  'w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all';

const EditorOrders = () => {

  const dispatch = useDispatch();
  const { orders, selectedOrder, filters, loading, updating, error, pagination } =
    useSelector((s) => s.orders);

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // Detay formu
  const [newStatus, setNewStatus] = useState('');
  const [note, setNote] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Arama kutusu: yazmayı bıraktıktan 400ms sonra filtreyi güncelle
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchInput !== filters.search) {
        setPage(1);
        dispatch(setFilters({ search: searchInput.trim() }));
      }
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]); // eslint-disable-line react-hooks/exhaustive-deps

  // Siparişleri getir
  useEffect(() => {
    dispatch(fetchOrders({ status: filters.status, search: filters.search, page, limit: 20 }));
  }, [dispatch, filters.status, filters.search, page]);

  // Sipariş seçilince formu doldur
  useEffect(() => {
    if (selectedOrder) {
      setNewStatus(selectedOrder.status);
      setNote('');
      setTrackingNumber(selectedOrder.shipping?.trackingNumber || '');
      setCarrier(selectedOrder.shipping?.carrier || '');
      setFormError('');
    }
  }, [selectedOrder?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusFilter = (status) => {
    setPage(1);
    dispatch(setFilters({ status }));
  };

  const closeModal = () => {
    dispatch(clearSelectedOrder());
    dispatch(clearOrderError());
    setFormError('');
  };

  const handleUpdate = async () => {
    if (!selectedOrder) return;

    if (newStatus === selectedOrder.status && !note.trim()) {
      setFormError('Durumu değiştirin veya bir not girin.');
      return;
    }
    if (newStatus === 'shipped' && !trackingNumber.trim()) {
      setFormError('Kargoya verirken takip numarası zorunludur.');
      return;
    }
    setFormError('');

    try {
      await dispatch(
        updateOrderStatus({
          orderId: selectedOrder._id,
          status: newStatus,
          note: note.trim() || undefined,
          trackingNumber: newStatus === 'shipped' ? trackingNumber.trim() : undefined,
          carrier: newStatus === 'shipped' ? carrier.trim() : undefined,
        })
      ).unwrap();
      setNote('');
    } catch (e) {
      // hata slice'taki error alanına zaten düşüyor
    }
  };

  const statusTabs = [{ value: '', label: 'Tümü' }, ...Object.entries(STATUS_META).map(([value, m]) => ({ value, label: m.label }))];

  return (

    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white transition-colors duration-300">

      <EditorSidebar />

      <div className="flex-1 overflow-y-auto">

        {/* Başlık */}
        <section className="relative pt-8 pb-6 px-6 border-b border-gray-200 dark:border-slate-800/60 bg-white dark:bg-slate-900/40">

          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none" />

          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">

            <div className="flex items-center gap-4">

              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl text-white shadow-md shadow-blue-500/20"><ClipboardList size={28} /></div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 flex items-center gap-1.5"><Sparkles size={12} className="animate-pulse" /> Sipariş Yönetimi</span>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-0.5">Siparişlerim</h1>
              </div>

            </div>

            <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm md:text-right">Size atanan siparişleri görüntüleyin, durumlarını ve kargo bilgilerini güncelleyin.</p>

          </div>

        </section>

        <section className="py-8 px-6 max-w-6xl mx-auto space-y-6">

          {/* Filtreler */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">

            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Sipariş numarası ara (örn: SH-261013)"
                className={`${inputCls} pl-10`}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {statusTabs.map((tab) => (
                <button
                  key={tab.value || 'all'}
                  onClick={() => handleStatusFilter(tab.value)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    filters.status === tab.value
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

          </div>

          {error && !selectedOrder && (
            <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-sm text-red-700 dark:text-red-400">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* Liste */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">

            {loading ? (
              <div className="flex items-center justify-center gap-2 py-20 text-gray-400">
                <Loader2 className="animate-spin" size={20} /> Yükleniyor...
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-20 text-gray-400 dark:text-slate-500">
                <div className="p-4 bg-gray-50 dark:bg-slate-800/40 rounded-2xl border border-gray-100 dark:border-slate-800/50"><Package size={40} className="stroke-[1.2]" /></div>
                <p className="text-sm font-medium">Gösterilecek sipariş bulunamadı.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-gray-500 dark:text-slate-400 border-b border-gray-100 dark:border-slate-800/60">
                      <th className="px-5 py-3 font-bold">Sipariş No</th>
                      <th className="px-5 py-3 font-bold">Müşteri</th>
                      <th className="px-5 py-3 font-bold">Tarih</th>
                      <th className="px-5 py-3 font-bold">Tutar</th>
                      <th className="px-5 py-3 font-bold">Ödeme</th>
                      <th className="px-5 py-3 font-bold">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order._id}
                        onClick={() => dispatch(selectOrder(order._id))}
                        className="border-b border-gray-50 dark:border-slate-800/40 hover:bg-gray-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                      >
                        <td className="px-5 py-4 font-mono font-bold text-blue-600 dark:text-blue-400">{order.orderNumber}</td>
                        <td className="px-5 py-4">
                          <div className="font-semibold">{order.user?.name || '-'}</div>
                          <div className="text-xs text-gray-400 dark:text-slate-500">{order.user?.email}</div>
                        </td>
                        <td className="px-5 py-4 text-gray-500 dark:text-slate-400">{formatDate(order.createdAt)}</td>
                        <td className="px-5 py-4 font-bold">{money(order.pricing?.total)}</td>
                        <td className="px-5 py-4 text-gray-500 dark:text-slate-400">
                          {PAYMENT_METHODS[order.payment?.method] || '-'}
                          <div className="text-xs">{PAYMENT_STATUS[order.payment?.status]}</div>
                        </td>
                        <td className="px-5 py-4"><StatusBadge status={order.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Sayfalama */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-slate-800/60">
                <span className="text-xs text-gray-500 dark:text-slate-400">
                  Toplam {pagination.total} sipariş • Sayfa {pagination.page}/{pagination.totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                  ><ChevronLeft size={16} /></button>
                  <button
                    disabled={page >= pagination.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                  ><ChevronRight size={16} /></button>
                </div>
              </div>
            )}

          </div>

        </section>

      </div>

      {/* Detay Penceresi */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={closeModal}>

          <div
            className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-800/60 bg-white dark:bg-slate-900">
              <div>
                <div className="font-mono font-black text-lg">{selectedOrder.orderNumber}</div>
                <div className="text-xs text-gray-400 dark:text-slate-500">{formatDate(selectedOrder.createdAt)}</div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={selectedOrder.status} />
                <button onClick={closeModal} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"><X size={18} /></button>
              </div>
            </div>

            <div className="p-5 md:p-6 space-y-6">

              {/* Müşteri + Adres */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="p-4 bg-gray-50 dark:bg-slate-800/40 rounded-2xl space-y-1.5 text-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 flex items-center gap-2 mb-2"><User size={14} /> Müşteri</h4>
                  <div className="font-semibold">{selectedOrder.user?.name || '-'}</div>
                  <div className="text-gray-500 dark:text-slate-400">{selectedOrder.user?.email}</div>
                  <div className="text-gray-500 dark:text-slate-400">{selectedOrder.shippingAddress?.phone}</div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-slate-800/40 rounded-2xl space-y-1.5 text-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 flex items-center gap-2 mb-2"><MapPin size={14} /> Teslimat Adresi</h4>
                  <div className="font-semibold">{selectedOrder.shippingAddress?.fullName}</div>
                  <div className="text-gray-500 dark:text-slate-400">{selectedOrder.shippingAddress?.address}</div>
                  <div className="text-gray-500 dark:text-slate-400">
                    {selectedOrder.shippingAddress?.district} / {selectedOrder.shippingAddress?.city} {selectedOrder.shippingAddress?.zipCode}
                  </div>
                </div>

              </div>

              {/* Ürünler */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 flex items-center gap-2 mb-3"><Package size={14} /> Ürünler</h4>
                <div className="border border-gray-100 dark:border-slate-800/60 rounded-2xl divide-y divide-gray-100 dark:divide-slate-800/60">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="flex items-center justify-between gap-4 p-3.5 text-sm">
                      <div>
                        <div className="font-semibold">{item.name}</div>
                        <div className="text-xs text-gray-400 dark:text-slate-500">
                          {[item.selectedModel, item.selectedColor, item.sku && `SKU: ${item.sku}`].filter(Boolean).join(' • ')}
                        </div>
                      </div>
                      <div className="text-right whitespace-nowrap">
                        <div className="font-bold">{money(item.totalPrice)}</div>
                        <div className="text-xs text-gray-400 dark:text-slate-500">{item.quantity} x {money(item.price)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ödeme */}
              <div className="p-4 bg-gray-50 dark:bg-slate-800/40 rounded-2xl text-sm space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 flex items-center gap-2 mb-2"><CreditCard size={14} /> Ödeme</h4>
                <div className="flex justify-between"><span className="text-gray-500 dark:text-slate-400">Yöntem</span><span className="font-semibold">{PAYMENT_METHODS[selectedOrder.payment?.method] || '-'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 dark:text-slate-400">Ödeme Durumu</span><span className="font-semibold">{PAYMENT_STATUS[selectedOrder.payment?.status] || '-'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 dark:text-slate-400">Ara Toplam</span><span>{money(selectedOrder.pricing?.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 dark:text-slate-400">Kargo</span><span>{money(selectedOrder.pricing?.shipping)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 dark:text-slate-400">KDV</span><span>{money(selectedOrder.pricing?.tax)}</span></div>
                {selectedOrder.pricing?.couponDiscount > 0 && (
                  <div className="flex justify-between"><span className="text-gray-500 dark:text-slate-400">Kupon ({selectedOrder.coupon?.code})</span><span className="text-emerald-600">-{money(selectedOrder.pricing.couponDiscount)}</span></div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-slate-700 text-base font-black"><span>Toplam</span><span>{money(selectedOrder.pricing?.total)}</span></div>
              </div>

              {/* Müşteri notu */}
              {selectedOrder.notes?.customer && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl text-sm text-amber-800 dark:text-amber-400">
                  <strong>Müşteri Notu:</strong> {selectedOrder.notes.customer}
                </div>
              )}

              {/* Durum Güncelleme */}
              <div className="p-5 border border-gray-200 dark:border-slate-800 rounded-2xl space-y-4">

                <h4 className="text-sm font-bold flex items-center gap-2"><Truck size={16} className="text-blue-500" /> Durumu Güncelle</h4>

                <div>
                  <label className="text-xs font-bold mb-2 text-gray-600 dark:text-slate-400 uppercase tracking-wider block">Yeni Durum</label>
                  <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className={`${inputCls} cursor-pointer font-medium`}>
                    {Object.entries(STATUS_META).map(([value, m]) => (
                      <option key={value} value={value}>{m.label}</option>
                    ))}
                  </select>
                </div>

                {newStatus === 'shipped' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold mb-2 text-gray-600 dark:text-slate-400 uppercase tracking-wider block">Kargo Firması</label>
                      <input type="text" value={carrier} onChange={(e) => setCarrier(e.target.value)} placeholder="Örn: Yurtiçi Kargo" className={inputCls} />
                    </div>
                    <div>
                      <label className="text-xs font-bold mb-2 text-gray-600 dark:text-slate-400 uppercase tracking-wider block">Takip Numarası</label>
                      <input type="text" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="Takip no" className={inputCls} />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold mb-2 text-gray-600 dark:text-slate-400 uppercase tracking-wider block">Not (isteğe bağlı)</label>
                  <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Durum geçmişine eklenecek not..." className={inputCls} />
                </div>

                {(formError || error) && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl text-xs text-red-700 dark:text-red-400">
                    <AlertCircle size={14} /> {formError || error}
                  </div>
                )}

                <button
                  onClick={handleUpdate}
                  disabled={updating}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-60 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/10 cursor-pointer text-sm"
                >
                  {updating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {updating ? 'Kaydediliyor...' : 'Güncelle'}
                </button>

              </div>

              {/* Durum Geçmişi */}
              {selectedOrder.statusHistory?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-3">Durum Geçmişi</h4>
                  <div className="space-y-2">
                    {[...selectedOrder.statusHistory].reverse().map((h, i) => (
                      <div key={h._id || i} className="flex items-start justify-between gap-3 text-xs p-3 bg-gray-50 dark:bg-slate-800/40 rounded-xl">
                        <div>
                          <StatusBadge status={h.status} />
                          {h.note && <div className="mt-1.5 text-gray-500 dark:text-slate-400">{h.note}</div>}
                        </div>
                        <span className="text-gray-400 dark:text-slate-500 whitespace-nowrap">{formatDate(h.createdAt)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default EditorOrders;
