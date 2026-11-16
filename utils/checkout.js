// Sepet ve ödeme yardımcıları. Kurallar sunucudaki utils/pricing.js ile aynı:
// fiyatlar KDV dahil, kargo barajı indirimsiz ara toplama göre, hesap kuruş üzerinden.
// Giriş yapılmışsa ekranda sunucunun hesapladığı toplam gösterilir; bu dosya
// misafir kullanıcı ve sunucu yanıtı gelene kadar kullanılır.

export const BASE_URL = "https://ornekciceksitesi.com";

export const FREE_SHIPPING_THRESHOLD = 2500;
export const SHIPPING_FEE = 200;
export const VAT_RATE = 0.2;

const toKurus = (tl) => Math.round((Number(tl) || 0) * 100);

// ₺1.234,50 — kuruş yoksa ve decimals false ise ₺1.234
export const formatTL = (tl, decimals = true) => {
  const k = toKurus(tl);
  const abs = Math.abs(k);
  const lira = String(Math.floor(abs / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const kurus = abs % 100;
  const body = decimals || kurus ? `${lira},${String(kurus).padStart(2, '0')}` : lira;
  return `${k < 0 ? '-' : ''}₺${body}`;
};

export const productIdOf = (item) => item?.id ?? item?._id;

// Sunucuya giden sepet satırları (fiyat gönderilmez, sunucu kendisi bulur)
export const toOrderItems = (carts) => carts
  .filter((item) => !item.unavailable)
  .map((item) => ({
    product: productIdOf(item),
    quantity: item.quantity,
    selectedModel: item.selectedModel ?? null,
    selectedColor: item.selectedColor ?? null,
  }));

export const calcLocalTotals = (carts) => {
  const lines = carts.filter((item) => !item.unavailable);
  const quantity = lines.reduce((s, l) => s + l.quantity, 0);
  const subtotalK = lines.reduce((s, l) => s + toKurus(l.price) * l.quantity, 0);
  const shippingK = subtotalK === 0 || subtotalK >= toKurus(FREE_SHIPPING_THRESHOLD) ? 0 : toKurus(SHIPPING_FEE);
  const totalK = subtotalK + shippingK;
  return {
    quantity,
    subtotal: subtotalK / 100,
    discount: 0,
    baseShipping: shippingK / 100,
    shippingDiscount: 0,
    shipping: shippingK / 100,
    vat: Math.round(totalK - totalK / (1 + VAT_RATE)) / 100,
    total: totalK / 100,
    remainingForFreeShipping: shippingK ? Math.max(0, toKurus(FREE_SHIPPING_THRESHOLD) - subtotalK) / 100 : 0,
  };
};

export const freeShippingProgress = (subtotal) => Math.min(100, (Number(subtotal) / FREE_SHIPPING_THRESHOLD) * 100);

export const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

export const errorMessage = (error, fallback) => error?.response?.data?.message || fallback;

// ── Kart ──
export const cardBrand = (number) => {
  const n = String(number).replace(/\D/g, '');
  if (/^3[47]/.test(n)) return 'amex';
  if (/^(9792|65)/.test(n)) return 'troy';
  if (/^4/.test(n)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'mastercard';
  return 'generic';
};

export const cardLength = (brand) => (brand === 'amex' ? 15 : 16);
export const cvvLength = (brand) => (brand === 'amex' ? 4 : 3);

export const formatCardNumber = (value) => {
  const digits = String(value).replace(/\D/g, '');
  const brand = cardBrand(digits);
  const trimmed = digits.slice(0, cardLength(brand));
  if (brand === 'amex') return [trimmed.slice(0, 4), trimmed.slice(4, 10), trimmed.slice(10)].filter(Boolean).join(' ');
  return trimmed.replace(/(.{4})/g, '$1 ').trim();
};

export const luhnValid = (digits) => {
  let sum = 0;
  let even = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let d = Number(digits[i]);
    if (even) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    even = !even;
  }
  return digits.length > 0 && sum % 10 === 0;
};

export const validateCard = ({ number, name, expiry, cvv }) => {
  const errors = {};
  const digits = String(number).replace(/\D/g, '');
  const brand = cardBrand(digits);

  if (!digits) errors.number = 'Kart numarası gerekli';
  else if (digits.length !== cardLength(brand)) errors.number = `Kart numarası ${cardLength(brand)} haneli olmalı`;
  else if (!luhnValid(digits)) errors.number = 'Kart numarası geçersiz';

  if (!name.trim()) errors.name = 'Kart sahibinin adı gerekli';
  else if (name.trim().length < 3) errors.name = 'İsim çok kısa';
  else if (!/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s.'-]+$/.test(name.trim())) errors.name = 'İsim sadece harf içermeli';

  const [mm, yy] = String(expiry).split('/');
  const month = Number(mm);
  const year = Number(yy);
  const now = new Date();
  const curYear = now.getFullYear() % 100;
  if (!mm || !yy || yy.length !== 2) errors.expiry = 'AA/YY biçiminde girin';
  else if (month < 1 || month > 12) errors.expiry = 'Geçersiz ay';
  else if (year < curYear || (year === curYear && month < now.getMonth() + 1)) errors.expiry = 'Kartın süresi dolmuş';

  if (String(cvv).length !== cvvLength(brand)) errors.cvv = `CVV ${cvvLength(brand)} haneli olmalı`;

  return errors;
};

export const formatExpiry = (value) => {
  const digits = String(value).replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

// ── Adres ──
export const ADDRESS_REQUIRED = ['title', 'fullName', 'phone', 'city', 'district', 'address'];

export const formatPhone = (value) => {
  const d = String(value).replace(/\D/g, '').slice(0, 11);
  const parts = [d.slice(0, 4), d.slice(4, 7), d.slice(7, 9), d.slice(9, 11)].filter(Boolean);
  return parts.join(' ');
};

export const validateAddress = (form) => {
  const errors = {};
  if (!form.title?.trim()) errors.title = 'Adres başlığı gerekli';
  if (!form.fullName?.trim()) errors.fullName = 'Ad soyad gerekli';
  const phone = String(form.phone || '').replace(/\D/g, '');
  if (!/^0?5\d{9}$/.test(phone)) errors.phone = 'Geçerli bir cep telefonu girin (05xx...)';
  if (!form.city?.trim()) errors.city = 'İl gerekli';
  if (!form.district?.trim()) errors.district = 'İlçe gerekli';
  if (!form.address?.trim() || form.address.trim().length < 10) errors.address = 'Açık adres en az 10 karakter olmalı';
  return errors;
};

export const isAddressComplete = (a) => !!a && ['fullName', 'phone', 'city', 'district', 'address'].every((k) => String(a[k] || '').trim());

export const toShippingAddress = (a) => ({
  fullName: a.fullName,
  phone: a.phone,
  city: a.city,
  district: a.district,
  address: a.address,
  ...(a.zipCode ? { zipCode: a.zipCode } : {}),
});

// ── Sipariş ──
export const ORDER_STATUS = {
  pending:   { label: 'Onay bekliyor', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' },
  confirmed: { label: 'Onaylandı', cls: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' },
  preparing: { label: 'Hazırlanıyor', cls: 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400' },
  shipped:   { label: 'Kargoda', cls: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400' },
  delivered: { label: 'Teslim edildi', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' },
  cancelled: { label: 'İptal edildi', cls: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' },
  refunded:  { label: 'İade edildi', cls: 'bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-slate-300' },
};

export const PAYMENT_METHOD_LABEL = {
  credit_card: 'Kredi / banka kartı',
  bank_transfer: 'Havale / EFT',
  cash_on_delivery: 'Kapıda ödeme',
};

// Havale bilgileri: gerçek hesaplarla değiştir
export const BANK_ACCOUNTS = [
  { bank: 'Ziraat Bankası', holder: 'TypusHOME Teknoloji A.Ş.', iban: 'TR00 0000 0000 0000 0000 0000 00' },
  { bank: 'Garanti BBVA', holder: 'TypusHOME Teknoloji A.Ş.', iban: 'TR00 0000 0000 0000 0000 0000 00' },
];

export const SUPPORT_EMAIL = 'destek@typushome.com.tr';

export const orderNumberOf = (order) => order?.orderNumber || String(order?._id || '').slice(-8).toUpperCase();
