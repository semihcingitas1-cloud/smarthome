import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

import { removeFromCart, updateQuantity, clearCart } from '../../redux/cartSlice';

import { ShoppingBag, Trash2, ShieldCheck, CreditCard, Tag, ArrowLeft, Plus, Minus, Truck, RotateCcw, ChevronRight, X, PackageX, Gift, Zap, Lock } from 'lucide-react';

const Cart = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const { carts } = useSelector(state => state.cart);
  const { isAuth } = useSelector(state => state.user);

  const COUPONS = { 'AKILLIEV20': 20, 'SMART10': 10, 'SMARTHOME15': 15 };
  const FREE_SHIPPING_THRESHOLD = 2500;
  const SHIPPING_FEE = 200;
  const TAX_RATE = 0.20;

  const subtotal = carts.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = appliedCoupon ? Math.round(subtotal * COUPONS[appliedCoupon] / 100) : 0;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const tax = subtotal * TAX_RATE;
  const total = subtotal - discountAmount + shipping + tax;
  const totalQty = carts.reduce((acc, item) => acc + item.quantity, 0);
  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  const handleApplyCoupon = (e) => {

    e.preventDefault();
    const code = coupon.toUpperCase().trim();

    if (COUPONS[code]) {

      setAppliedCoupon(code);
      setCouponError('');
    } else {

      setCouponError('Geçersiz kupon kodu.');
    }
  };

  const handleRemoveCoupon = () => {

    setAppliedCoupon(null);
    setCoupon('');
    setCouponError('');
  };

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
            <span className="text-sm font-normal bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">{totalQty} ürün</span>

          </h1>

          <button onClick={() => dispatch(clearCart())} className="self-start sm:self-auto flex items-center gap-2 text-sm text-red-400 hover:text-red-500 border border-red-400/20 hover:border-red-400/40 px-4 py-2 rounded-xl transition-colors">
            <Trash2 size={15} /> Sepeti Temizle
          </button>

        </div>

        {subtotal < FREE_SHIPPING_THRESHOLD && ( <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 mb-6 flex items-center gap-4 shadow-sm">

          <div className="p-2.5 bg-blue-500/10 rounded-xl flex-shrink-0"><Truck size={20} className="text-blue-500" /></div>

          <div className="flex-1 min-w-0">

            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5">Ücretsiz kargo için{' '}<span className="text-blue-600 dark:text-blue-400">₺{(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString('tr-TR')}</span>{' '}daha ekleyin</p>

            <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2">

              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${shippingProgress}%` }}/>

            </div>

          </div>

          <span className="text-sm font-bold text-gray-500 dark:text-slate-400 flex-shrink-0">{Math.round(shippingProgress)}%</span>

        </div> )}

        {subtotal >= FREE_SHIPPING_THRESHOLD && ( <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/40 rounded-2xl p-4 mb-6 flex items-center gap-3">

          <Truck size={20} className="text-green-600 dark:text-green-400" />
          <p className="text-sm font-semibold text-green-700 dark:text-green-400">Tebrikler! Ücretsiz kargoya hak kazandınız.</p>

        </div> )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-4">

            {carts.map(item => ( <div key={item._id} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-gray-300 dark:hover:border-slate-700 transition-all">

              <div className="flex gap-4">

                <Link to={`/productdetail/${item.slug}`} className="flex-shrink-0">

                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">

                    <img src={getImage(item)} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"/>

                  </div>

                </Link>

                <div className="flex-1 min-w-0">

                  <div className="flex items-start justify-between gap-2">

                    <div className="min-w-0">

                      <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-md">{item.category}</span>

                      <Link to={`/productdetail/${item.slug}`}>
                        <h3 className="font-bold text-gray-900 dark:text-white mt-1 line-clamp-2 hover:text-blue-500 transition-colors leading-snug">{item.name}</h3>
                      </Link>

                      <div className="flex flex-wrap gap-2 mt-1">

                        {item.selectedModel && ( <span className="text-xs text-gray-400 dark:text-slate-500 bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">Model: {item.selectedModel}</span> )}
                        {item.selectedColor && ( <span className="text-xs text-gray-400 dark:text-slate-500 bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">Renk: {item.selectedColor}</span> )}

                      </div>

                    </div>

                    <button onClick={() => dispatch(clearCart(item._id))} className="p-1.5 text-gray-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all flex-shrink-0">
                      <X size={16} />
                    </button>

                  </div>

                  <div className="flex items-center justify-between mt-4">

                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 rounded-xl p-1">

                      <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))} disabled={item.quantity <= 1} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 transition-colors">
                        <Minus size={13} />
                      </button>

                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>

                      <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))} disabled={item.quantity >= (item.stock || 99)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 transition-colors">
                        <Plus size={13} />
                      </button>

                    </div>

                    <div className="text-right">

                      <p className="text-xs text-gray-400 dark:text-slate-500">{item.quantity} × ₺{item.price.toLocaleString('tr-TR')}</p>
                      {item.oldPrice && ( <p className="text-xs text-gray-400 dark:text-slate-500 line-through">₺{(item.oldPrice * item.quantity).toLocaleString('tr-TR')}</p> )}
                      <p className="text-lg font-black text-gray-900 dark:text-white">₺{(item.price * item.quantity).toLocaleString('tr-TR')}</p>

                    </div>

                  </div>

                </div>

              </div>

            </div> ))}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">

              {[
                { icon: Truck, label: 'Bedava Kargo', sub: '₺2000 ve Üzeri', color: 'emerald' },
                { icon: ShieldCheck, label: 'Güvenli Ödeme', sub: 'iyzico Altyapısı', color: 'orange' },
                { icon: CreditCard, label: 'Kolay Taksit', sub: '12 Aya Kadar', color: 'blue' },
                { icon: RotateCcw, label: 'Kolay İade', sub: '14 Gün Koşulsuz', color: 'purple' },
              ].map(({ icon: Icon, label, sub, color }) => ( <div key={label} className={`flex flex-col items-center text-center p-4 rounded-2xl border border-${color}-200 dark:border-${color}-900/40 bg-${color}-50/50 dark:bg-${color}-950/20`}>

                <div className={`w-10 h-10 rounded-xl bg-${color}-500 text-white flex items-center justify-center mb-2 shadow-sm`}><Icon size={18} /></div>
                <span className={`text-[11px] font-bold text-${color}-800 dark:text-${color}-400 leading-tight`}>{label}</span>
                <span className={`text-[10px] text-${color}-600 dark:text-${color}-500 mt-0.5`}>{sub}</span>

              </div> ))}

            </div>

          </div>

          <div className="space-y-4">

            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">

              <h3 className="font-bold mb-3 flex items-center gap-2 text-gray-900 dark:text-white"><Tag size={18} className="text-purple-500" /> Kupon Kodu</h3>

              {appliedCoupon ? ( <div className="flex items-center justify-between bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/40 rounded-xl px-4 py-3">

                <div>

                  <p className="text-sm font-bold text-green-700 dark:text-green-400">{appliedCoupon}</p>
                  <p className="text-xs text-green-600 dark:text-green-500">%{COUPONS[appliedCoupon]} indirim aktif</p>

                </div>

                <button onClick={handleRemoveCoupon} className="text-green-600 hover:text-red-500 transition-colors">
                  <X size={16} />
                </button>

              </div> ) : ( <form onSubmit={handleApplyCoupon} className="flex gap-2">

                <div className="relative flex-1">

                  <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Kupon kodunuz" value={coupon} onChange={e => { setCoupon(e.target.value); setCouponError(''); }} className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors text-gray-900 dark:text-white"/>

                </div>

                <button type="submit" className="px-4 bg-gray-900 dark:bg-slate-700 hover:bg-gray-800 dark:hover:bg-slate-600 text-white rounded-xl text-sm font-semibold transition-colors">
                  Uygula
                </button>

              </form> )}

              {couponError && <p className="text-xs text-red-500 mt-2">{couponError}</p>}
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">Deneme: <span className="font-mono">SMART10</span>, <span className="font-mono">AKILLIEV20</span></p>

            </div>

            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm sticky top-6">

              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 pb-3 border-b border-gray-100 dark:border-slate-800">Sipariş Özeti</h3>

              <div className="space-y-3 text-sm">

                <div className="flex justify-between text-gray-600 dark:text-slate-400">

                  <span>Ara Toplam ({totalQty} ürün)</span>
                  <span>₺{subtotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>

                </div>

                <div className="flex justify-between text-gray-600 dark:text-slate-400">

                  <span>KDV (%20)</span>
                  <span>₺{tax.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>

                </div>

                <div className="flex justify-between text-gray-600 dark:text-slate-400">

                  <span>Kargo</span>
                  {shipping === 0 ? <span className="text-green-600 dark:text-green-400 font-semibold">Ücretsiz</span> : <span>₺{shipping.toFixed(2)}</span> }

                </div>

                {discountAmount > 0 && ( <div className="flex justify-between text-green-600 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-950/30 px-3 py-2 rounded-xl">

                  <span>Kupon İndirimi</span>
                  <span>-₺{discountAmount.toLocaleString('tr-TR')}</span>

                </div> )}

                <div className="border-t border-gray-100 dark:border-slate-800 pt-3 flex justify-between items-baseline">

                  <span className="font-bold text-gray-900 dark:text-white">Toplam</span>
                  <span className="text-2xl font-black text-blue-600 dark:text-blue-400">₺{total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>

                </div>

              </div>

              <button onClick={() => navigate(isAuth ? '/payment' : '/auth')} className="w-full mt-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 hover:scale-[1.02]">
                <CreditCard size={18} />
                {isAuth ? 'Siparişi Tamamla' : 'Giriş Yap ve Devam Et'}
              </button>

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