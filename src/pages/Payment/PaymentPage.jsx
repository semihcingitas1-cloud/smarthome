import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Building2, Lock, CheckCircle, ArrowLeft, AlertCircle, Shield, Calendar, User, Hash, ChevronRight, Info, Copy, MapPin, Plus, Loader2, Gift, Sparkles, Ticket, Phone, Home, X, ShoppingBag } from 'lucide-react';

import { fetchQuote, validateCart, clearCart, removeCoupon } from '../../redux/cartSlice';
import { placeOrder, fetchAddresses, addAddress } from '../../redux/orderSlice';
import {
  formatTL, toOrderItems, calcLocalTotals, cardBrand, cvvLength, formatCardNumber, formatExpiry, validateCard,
  validateAddress, formatPhone, isAddressComplete, toShippingAddress, BANK_ACCOUNTS,
} from '../../utils/checkout';

const PROVINCES = ['Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul', 'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kilis', 'Kırıkkale', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun', 'Şanlıurfa', 'Siirt', 'Sinop', 'Şırnak', 'Sivas', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'];

// Bu hatalarda kullanıcı sepete dönüp düzeltmeli
const CART_ERRORS = ['INSUFFICIENT_STOCK', 'OUT_OF_STOCK', 'UNAVAILABLE', 'MODEL_REQUIRED', 'GIFT_OUT_OF_STOCK', 'EMPTY_CART', 'INVALID_CART'];

const EMPTY_ADDRESS = { title: 'Ev', fullName: '', phone: '', city: '', district: '', address: '', zipCode: '' };

const inputCls = (error) => `w-full bg-gray-50 dark:bg-slate-800 border ${error ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'} rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors`;

const FieldError = ({ children }) => (children ? <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{children}</p> : null);

const Card = ({ title, icon: Icon, right, children }) => (
  <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-lg dark:shadow-none">
    <div className="flex items-center justify-between mb-4 gap-3">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">{Icon && <Icon size={20} className="text-blue-600 dark:text-blue-400" />}{title}</h2>
      {right}
    </div>
    {children}
  </div>
);

// ───────────────────────── ADRES ─────────────────────────

const AddressForm = ({ onSaved, onCancel, canCancel }) => {

  const dispatch = useDispatch();
  const [form, setForm] = useState(EMPTY_ADDRESS);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');

  const set = (key) => (e) => {
    const value = key === 'phone' ? formatPhone(e.target.value) : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((x) => ({ ...x, [key]: null }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validateAddress(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    setServerError('');
    try {
      const payload = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v]));
      payload.phone = payload.phone.replace(/\s/g, '');
      const addresses = await dispatch(addAddress(payload)).unwrap();
      onSaved(addresses);
    } catch (err) {
      setServerError(err?.message || 'Adres eklenemedi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 mt-2" noValidate>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-semibold mb-1.5 block text-gray-700 dark:text-slate-300">Adres başlığı</label>
          <input value={form.title} onChange={set('title')} placeholder="Ev, İş..." className={inputCls(errors.title)} maxLength={30} />
          <FieldError>{errors.title}</FieldError>
        </div>
        <div>
          <label className="text-sm font-semibold mb-1.5 block text-gray-700 dark:text-slate-300">Ad soyad</label>
          <input value={form.fullName} onChange={set('fullName')} autoComplete="name" className={inputCls(errors.fullName)} maxLength={80} />
          <FieldError>{errors.fullName}</FieldError>
        </div>
        <div>
          <label className="text-sm font-semibold mb-1.5 block text-gray-700 dark:text-slate-300">Cep telefonu</label>
          <input value={form.phone} onChange={set('phone')} inputMode="tel" autoComplete="tel" placeholder="05xx xxx xx xx" className={inputCls(errors.phone)} />
          <FieldError>{errors.phone}</FieldError>
        </div>
        <div>
          <label className="text-sm font-semibold mb-1.5 block text-gray-700 dark:text-slate-300">İl</label>
          <input value={form.city} onChange={set('city')} list="tr-provinces" placeholder="Örn. Ankara" className={inputCls(errors.city)} />
          <datalist id="tr-provinces">{PROVINCES.map((p) => <option key={p} value={p} />)}</datalist>
          <FieldError>{errors.city}</FieldError>
        </div>
        <div>
          <label className="text-sm font-semibold mb-1.5 block text-gray-700 dark:text-slate-300">İlçe</label>
          <input value={form.district} onChange={set('district')} placeholder="Örn. Çankaya" className={inputCls(errors.district)} maxLength={60} />
          <FieldError>{errors.district}</FieldError>
        </div>
        <div>
          <label className="text-sm font-semibold mb-1.5 block text-gray-700 dark:text-slate-300">Posta kodu <span className="font-normal text-gray-400">(isteğe bağlı)</span></label>
          <input value={form.zipCode} onChange={set('zipCode')} inputMode="numeric" maxLength={5} className={inputCls(false)} />
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold mb-1.5 block text-gray-700 dark:text-slate-300">Açık adres</label>
        <textarea value={form.address} onChange={set('address')} rows={2} placeholder="Mahalle, cadde, sokak, bina ve daire no" className={inputCls(errors.address)} maxLength={300} />
        <FieldError>{errors.address}</FieldError>
      </div>
      {serverError && <p className="text-sm text-red-500">{serverError}</p>}
      <div className="flex gap-2 justify-end">
        {canCancel && <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800">Vazgeç</button>}
        <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60 flex items-center gap-2">
          {saving && <Loader2 size={16} className="animate-spin" />} Adresi kaydet
        </button>
      </div>
    </form>
  );
};

// ───────────────────────── KART ÖNİZLEME ─────────────────────────

const CardPreview = ({ card, flipped }) => {
  const brand = cardBrand(card.number);
  return (
    <div className="mb-6" style={{ perspective: 1000 }}>
      <div className="relative w-full max-w-sm mx-auto h-52 transition-transform duration-700" style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'none' }}>
        <div className="absolute inset-0 rounded-2xl p-6 shadow-2xl overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600" style={{ backfaceVisibility: 'hidden' }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="w-12 h-9 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-md mb-7" />
          <p className="text-white text-xl font-mono tracking-wider mb-5">{card.number || '•••• •••• •••• ••••'}</p>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-white/60 text-[10px] uppercase mb-1">Kart Sahibi</p>
              <p className="text-white font-semibold uppercase text-sm truncate max-w-[180px]">{card.name || 'AD SOYAD'}</p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-[10px] uppercase mb-1">Son Kullanma</p>
              <p className="text-white font-semibold text-sm">{card.expiry || 'AA/YY'}</p>
            </div>
          </div>
          <div className="absolute top-6 right-6 text-white font-bold">
            {brand === 'visa' && <span className="text-2xl italic">VISA</span>}
            {brand === 'mastercard' && <span className="flex"><span className="w-7 h-7 bg-red-500 rounded-full opacity-90" /><span className="w-7 h-7 bg-yellow-500 rounded-full -ml-3 opacity-90" /></span>}
            {brand === 'troy' && <span className="text-xl">TROY</span>}
            {brand === 'amex' && <span className="text-lg">AMEX</span>}
          </div>
        </div>
        <div className="absolute inset-0 rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <div className="w-full h-11 bg-black mt-6" />
          <div className="p-6">
            <div className="bg-white rounded h-10 flex items-center justify-end px-4"><span className="text-black font-mono text-lg">{card.cvv || '•••'}</span></div>
            <p className="text-white/60 text-xs mt-2">CVV</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ───────────────────────── SAYFA ─────────────────────────

const PaymentPage = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { carts, couponCode, quote, quoting, quoteStale, quoteError } = useSelector((s) => s.cart);
  const { addresses, addressesLoaded, placing } = useSelector((s) => s.orders);

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [method, setMethod] = useState('card');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [cardErrors, setCardErrors] = useState({});
  const [flipped, setFlipped] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [banner, setBanner] = useState(null); // { type: 'error'|'info', text }
  const [copied, setCopied] = useState(null);
  const placedRef = useRef(false);

  const activeItems = carts.filter((i) => !i.unavailable);
  const selectedAddress = addresses.find((a) => a._id === selectedAddressId) || null;
  const paymentMethod = method === 'card' ? 'credit_card' : 'bank_transfer';

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchAddresses());
    dispatch(validateCart());
  }, [dispatch]);

  // Varsayılan adres seçili gelir
  useEffect(() => {
    if (!addressesLoaded) return;
    if (!addresses.length) {
      setShowAddressForm(true);
      return;
    }
    if (!selectedAddressId || !addresses.some((a) => a._id === selectedAddressId)) {
      setSelectedAddressId((addresses.find((a) => a.isDefault) || addresses[0])._id);
    }
  }, [addressesLoaded, addresses, selectedAddressId]);

  // Ödeme yöntemi ve şehir bazı kuponları etkiler; değişince sunucu yeniden hesaplar
  const cartSignature = carts.map((i) => `${i.cartKey}:${i.quantity}:${i.unavailable ? 0 : 1}`).join('|');
  useEffect(() => {
    if (!carts.length) return;
    dispatch(fetchQuote({ paymentMethod, city: selectedAddress?.city }));
  }, [dispatch, paymentMethod, selectedAddress?.city, couponCode, cartSignature]); // eslint-disable-line react-hooks/exhaustive-deps

  const localTotals = useMemo(() => calcLocalTotals(carts), [carts]);
  const ready = !!quote && !quoteStale && !quoting;
  const totals = quote && !quoteStale ? quote.totals : localTotals;
  const applied = quote && !quoteStale ? quote.applied ?? [] : [];
  const issues = quote && !quoteStale ? quote.issues ?? [] : [];

  const setCardField = (key, value) => {
    setCard((c) => ({ ...c, [key]: value }));
    if (cardErrors[key]) setCardErrors((e) => ({ ...e, [key]: null }));
  };

  const copyIban = async (iban) => {
    try {
      await navigator.clipboard.writeText(iban.replace(/\s/g, ''));
      setCopied(iban);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      setBanner({ type: 'error', text: 'Kopyalanamadı, IBAN\'ı elle seçebilirsin.' });
    }
  };

  const handleSubmit = async () => {
    setBanner(null);

    if (!selectedAddress || !isAddressComplete(selectedAddress)) {
      setBanner({ type: 'error', text: 'Lütfen eksiksiz bir teslimat adresi seç.' });
      return;
    }
    if (method === 'card') {
      const errs = validateCard(card);
      setCardErrors(errs);
      if (Object.keys(errs).length) {
        setBanner({ type: 'error', text: 'Kart bilgilerini kontrol et.' });
        return;
      }
    }
    if (!termsAccepted) {
      setBanner({ type: 'error', text: 'Devam etmek için ön bilgilendirme formunu ve mesafeli satış sözleşmesini onayla.' });
      return;
    }
    if (!ready) return;

    const digits = card.number.replace(/\D/g, '');

    try {
      const order = await dispatch(placeOrder({
        items: toOrderItems(carts),
        shippingAddress: toShippingAddress(selectedAddress),
        payment: method === 'card' ? { method: 'credit_card', cardLast4: digits.slice(-4) } : { method: 'bank_transfer' },
        couponCode: couponCode || undefined,
        expectedTotal: totals.total,
      })).unwrap();

      placedRef.current = true;
      dispatch(clearCart());
      navigate(`/paymentsuccess?order=${order._id}`, { replace: true, state: { order } });
    } catch (err) {
      const code = err?.code;
      if (code === 'PRICE_CHANGED') {
        dispatch(fetchQuote({ paymentMethod, city: selectedAddress.city }));
        setBanner({ type: 'info', text: 'Sepet tutarı güncellendi. Yeni toplamı kontrol edip tekrar onayla.' });
      } else if (CART_ERRORS.includes(code)) {
        dispatch(validateCart());
        setBanner({ type: 'error', text: `${err.message} Sepetini kontrol et.` });
      } else if (err?.status === 422) {
        dispatch(removeCoupon());
        setBanner({ type: 'error', text: `${err.message} Kupon kaldırıldı, toplam yeniden hesaplandı.` });
      } else {
        setBanner({ type: 'error', text: err?.message || 'Sipariş oluşturulamadı, lütfen tekrar dene.' });
      }
    }
  };

  if (!carts.length && !placedRef.current) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center space-y-5 max-w-md">
          <div className="w-24 h-24 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl flex items-center justify-center mx-auto shadow-lg"><ShoppingBag size={40} className="text-gray-300 dark:text-slate-600" /></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sepetin boş</h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm">Ödeme yapabilmek için önce sepetine ürün ekle.</p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold"><ArrowLeft size={18} /> Ürünlere git</Link>
        </div>
      </div>
    );
  }

  const brand = cardBrand(card.number);

  return (

    <div className="bg-gray-50 dark:bg-slate-950 min-h-screen py-12 px-4 transition-colors duration-300">

      <div className="max-w-6xl mx-auto">

        <div className="mb-8">
          <Link to="/cart" className="inline-flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"><ArrowLeft size={20} /> Sepete dön</Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Ödeme</h1>
          <p className="text-gray-600 dark:text-slate-400">Teslimat adresini ve ödeme yöntemini seç, siparişini onayla.</p>
        </div>

        {banner && (
          <div className={`mb-6 rounded-2xl p-4 flex items-start gap-3 border ${banner.type === 'error' ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/40 text-red-700 dark:text-red-400' : 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/40 text-blue-700 dark:text-blue-300'}`} role="alert">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium flex-1">{banner.text}</p>
            <button onClick={() => setBanner(null)} aria-label="Kapat"><X size={16} /></button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-6">

            {/* Adres */}
            <Card title="Teslimat Adresi" icon={MapPin} right={addresses.length > 0 && !showAddressForm && (
              <button onClick={() => setShowAddressForm(true)} className="text-sm font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1"><Plus size={16} /> Yeni adres</button>
            )}>
              {!addressesLoaded && <p className="text-sm text-gray-400 flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Adresler yükleniyor…</p>}

              {addressesLoaded && addresses.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-3">
                  {addresses.map((a) => {
                    const active = a._id === selectedAddressId;
                    const incomplete = !isAddressComplete(a);
                    return (
                      <button key={a._id} type="button" onClick={() => setSelectedAddressId(a._id)} className={`text-left p-4 rounded-2xl border-2 transition-all ${active ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10' : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'}`}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5"><Home size={15} /> {a.title}</span>
                          {a.isDefault && <span className="text-[10px] font-bold uppercase bg-gray-900 dark:bg-slate-700 text-white px-2 py-0.5 rounded">Varsayılan</span>}
                        </div>
                        <p className="text-sm text-gray-700 dark:text-slate-300">{a.fullName}</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400 line-clamp-2">{a.address}</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">{a.district} / {a.city}</p>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Phone size={12} /> {a.phone}</p>
                        {incomplete && <p className="text-xs text-red-500 mt-1">Bu adres eksik, lütfen yeni adres ekle.</p>}
                      </button>
                    );
                  })}
                </div>
              )}

              {addressesLoaded && showAddressForm && (
                <div className={addresses.length ? 'mt-5 pt-5 border-t border-gray-100 dark:border-slate-800' : ''}>
                  {addresses.length === 0 && <p className="text-sm text-gray-500 dark:text-slate-400">Kayıtlı adresin yok. Siparişin için bir teslimat adresi ekle.</p>}
                  <AddressForm
                    canCancel={addresses.length > 0}
                    onCancel={() => setShowAddressForm(false)}
                    onSaved={(list) => {
                      const known = new Set(addresses.map((a) => a._id));
                      const created = list.find((a) => !known.has(a._id));
                      if (created) setSelectedAddressId(created._id);
                      setShowAddressForm(false);
                    }}
                  />
                </div>
              )}
            </Card>

            {/* Ödeme yöntemi */}
            <Card title="Ödeme Yöntemi" icon={CreditCard}>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setMethod('card')} className={`p-4 rounded-2xl border-2 transition-all ${method === 'card' ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10' : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'}`} aria-pressed={method === 'card'}>
                  <CreditCard size={24} className={`mx-auto mb-2 ${method === 'card' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-slate-500'}`} />
                  <p className={`font-semibold text-sm ${method === 'card' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-slate-300'}`}>Kredi / Banka Kartı</p>
                </button>
                <button onClick={() => setMethod('bank')} className={`p-4 rounded-2xl border-2 transition-all ${method === 'bank' ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10' : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'}`} aria-pressed={method === 'bank'}>
                  <Building2 size={24} className={`mx-auto mb-2 ${method === 'bank' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-slate-500'}`} />
                  <p className={`font-semibold text-sm ${method === 'bank' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-slate-300'}`}>Havale / EFT</p>
                </button>
              </div>

              {method === 'card' && (
                <div className="mt-6">
                  <CardPreview card={card} flipped={flipped} />
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold mb-2 text-gray-700 dark:text-slate-300 flex items-center gap-2"><Hash size={16} />Kart Numarası</label>
                      <input value={card.number} onChange={(e) => setCardField('number', formatCardNumber(e.target.value))} inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" className={`${inputCls(cardErrors.number)} font-mono text-lg`} />
                      <FieldError>{cardErrors.number}</FieldError>
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 text-gray-700 dark:text-slate-300 flex items-center gap-2"><User size={16} />Kart Üzerindeki İsim</label>
                      <input value={card.name} onChange={(e) => setCardField('name', e.target.value.toUpperCase())} autoComplete="cc-name" placeholder="AD SOYAD" className={`${inputCls(cardErrors.name)} uppercase`} />
                      <FieldError>{cardErrors.name}</FieldError>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold mb-2 text-gray-700 dark:text-slate-300 flex items-center gap-2"><Calendar size={16} />Son Kullanma</label>
                        <input value={card.expiry} onChange={(e) => setCardField('expiry', formatExpiry(e.target.value))} inputMode="numeric" autoComplete="cc-exp" placeholder="AA/YY" className={`${inputCls(cardErrors.expiry)} font-mono`} />
                        <FieldError>{cardErrors.expiry}</FieldError>
                      </div>
                      <div>
                        <label className="text-sm font-semibold mb-2 text-gray-700 dark:text-slate-300 flex items-center gap-2"><Lock size={16} />CVV</label>
                        <input value={card.cvv} onChange={(e) => setCardField('cvv', e.target.value.replace(/\D/g, '').slice(0, cvvLength(brand)))} onFocus={() => setFlipped(true)} onBlur={() => setFlipped(false)} inputMode="numeric" autoComplete="cc-csc" placeholder={brand === 'amex' ? '1234' : '123'} className={`${inputCls(cardErrors.cvv)} font-mono`} />
                        <FieldError>{cardErrors.cvv}</FieldError>
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
                      <Shield size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-700 dark:text-blue-400">Kart numaran, son kullanma tarihin ve CVV'n sunucuya gönderilmez ve saklanmaz; siparişe sadece kartın son 4 hanesi yazılır.</p>
                    </div>
                  </div>
                </div>
              )}

              {method === 'bank' && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-3 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-xl p-4">
                    <Info size={20} className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">Siparişi onayladıktan sonra sipariş numaran gösterilecek. Havale açıklamasına bu numarayı yaz; ödemen 1-2 iş günü içinde onaylanır.</p>
                  </div>
                  {BANK_ACCOUNTS.map((b) => (
                    <div key={b.bank} className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 flex items-center gap-4">
                      <Building2 size={28} className="text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 dark:text-white">{b.bank}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">{b.holder}</p>
                        <p className="font-mono text-sm text-gray-900 dark:text-white mt-1 break-all">{b.iban}</p>
                      </div>
                      <button onClick={() => copyIban(b.iban)} className="bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-500/20 text-sm font-semibold flex items-center gap-1.5 flex-shrink-0">
                        {copied === b.iban ? <CheckCircle size={16} /> : <Copy size={16} />} {copied === b.iban ? 'Kopyalandı' : 'Kopyala'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-lg dark:shadow-none">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={termsAccepted} onChange={(e) => { setTermsAccepted(e.target.checked); if (e.target.checked) setBanner(null); }} className="mt-1 w-5 h-5 rounded border-gray-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                <span className="text-sm text-gray-700 dark:text-slate-300">
                  <Link to="/faq" className="text-blue-600 dark:text-blue-400 hover:underline">Ön bilgilendirme formunu</Link> ve{' '}
                  <Link to="/faq" className="text-blue-600 dark:text-blue-400 hover:underline">mesafeli satış sözleşmesini</Link> okudum, onaylıyorum.
                </span>
              </label>
            </div>

          </div>

          {/* Özet */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-lg dark:shadow-none sticky top-6">

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Sipariş Özeti</h3>

              <div className="space-y-3 mb-5 max-h-72 overflow-y-auto pr-1">
                {activeItems.map((item) => (
                  <div key={item.cartKey} className="flex gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 flex-shrink-0">
                      {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">{item.name}</p>
                      <p className="text-xs text-gray-400">{[item.selectedModel, item.selectedColor].filter(Boolean).join(' · ')}{item.selectedModel || item.selectedColor ? ' · ' : ''}{item.quantity} adet</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">{formatTL(item.price * item.quantity)}</p>
                  </div>
                ))}
                {quote && !quoteStale && quote.gifts?.map((g) => (
                  <div key={g.product} className="flex items-center gap-3 text-sm text-purple-600 dark:text-purple-400 font-semibold">
                    <div className="w-14 h-14 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center flex-shrink-0"><Gift size={22} /></div>
                    <span className="flex-1">{g.name || 'Hediye ürün'}</span>
                    <span>Hediye</span>
                  </div>
                ))}
              </div>

              {issues.length > 0 && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-sm text-red-700 dark:text-red-400 space-y-1">
                  {issues.map((i) => <p key={`${i.index}-${i.code}`}>{i.message}</p>)}
                  <Link to="/cart" className="font-semibold underline">Sepete dön</Link>
                </div>
              )}

              <div className="space-y-2.5 pb-5 mb-5 border-b border-gray-200 dark:border-slate-800 text-sm">
                <div className="flex justify-between"><span className="text-gray-600 dark:text-slate-400">Ara toplam</span><span className="font-semibold text-gray-900 dark:text-white">{formatTL(totals.subtotal)}</span></div>
                {applied.map((a) => (
                  <div key={a.coupon.code} className="flex justify-between text-green-600 dark:text-green-400">
                    <span className="flex items-center gap-1.5 truncate pr-2">{a.auto ? <Sparkles size={14} /> : <Ticket size={14} />}{a.auto ? a.coupon.name : a.coupon.code}</span>
                    <span className="font-semibold whitespace-nowrap">{a.discount > 0 ? `-${formatTL(a.discount)}` : a.freeShipping ? 'Kargo bedava' : a.gift ? 'Hediye' : 'Avantaj'}</span>
                  </div>
                ))}
                {quote && !quoteStale && quote.couponError && couponCode && (
                  <p className="text-xs text-amber-600 dark:text-amber-400">{couponCode}: {quote.couponError.message}</p>
                )}
                {applied.flatMap((a) => a.warnings || []).map((w) => <p key={w.code} className="text-xs text-amber-600 dark:text-amber-400">{w.message}</p>)}
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-slate-400">Kargo</span>
                  {totals.shipping === 0
                    ? <span className="font-semibold text-green-600 dark:text-green-400">{totals.shippingDiscount > 0 && <span className="line-through text-gray-400 font-normal mr-1.5">{formatTL(totals.shippingDiscount)}</span>}Ücretsiz</span>
                    : <span className="font-semibold text-gray-900 dark:text-white">{formatTL(totals.shipping)}</span>}
                </div>
              </div>

              <div className="flex justify-between items-baseline mb-1">
                <span className="text-lg font-bold text-gray-900 dark:text-white">Ödenecek Tutar</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatTL(totals.total)}</span>
              </div>
              <p className="text-xs text-gray-400 dark:text-slate-500 text-right mb-6">KDV dahil (içindeki KDV: {formatTL(totals.vat)})</p>

              {quoteError && !quote && <p className="text-xs text-red-500 mb-3">{quoteError}</p>}

              <button onClick={handleSubmit} disabled={placing || !ready || issues.length > 0 || !activeItems.length} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group">
                {placing ? <><Loader2 size={20} className="animate-spin" /> Sipariş oluşturuluyor…</>
                  : !ready ? <><Loader2 size={20} className="animate-spin" /> Tutar hesaplanıyor…</>
                    : <><Lock size={20} /> Siparişi Onayla <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" /></>}
              </button>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400"><CheckCircle size={16} className="text-green-500" /> SSL ile şifreli bağlantı</div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400"><CheckCircle size={16} className="text-green-500" /> 14 gün içinde koşulsuz iade</div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400"><CheckCircle size={16} className="text-green-500" /> Sipariş takibi Profil › Siparişler'de</div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default PaymentPage;
