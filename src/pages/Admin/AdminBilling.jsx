import React, { useEffect, useState } from "react";

import AdminSidebar from "../../layout/AdminSidebar";

import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Package, Zap, Shield, Home, X } from "lucide-react";

const iconMap = { home: Home, zap: Zap, shield: Shield };

const packages = [
  {
    id: 1,
    name: "Başlangıç",
    price: "Ücretsiz",
    billing: "Süresiz",
    icon: "home",
    status: "active",
    limits: "Maks. 5 Cihaz",
    features: [
      { name: "Temel Cihaz Kontrolü", included: true },
      { name: "1 Adet Otomasyon Senaryosu", included: true },
      { name: "Kamera Kaydı", included: false },
      { name: "7/24 Öncelikli Destek", included: false },
    ],
  },
  {
    id: 2,
    name: "Pro Ev",
    price: "149 ₺",
    billing: "/ ay",
    icon: "zap",
    status: "active",
    limits: "Maks. 50 Cihaz",
    popular: true,
    features: [
      { name: "Sınırsız Cihaz Kontrolü", included: true },
      { name: "Sınırsız Otomasyon", included: true },
      { name: "7 Günlük Kamera Kaydı", included: true },
      { name: "7/24 Öncelikli Destek", included: false },
    ],
  },
  {
    id: 3,
    name: "Sınırsız Köşk",
    price: "399 ₺",
    billing: "/ ay",
    icon: "shield",
    status: "passive",
    limits: "Sınırsız Cihaz",
    features: [
      { name: "Sınırsız Cihaz Kontrolü", included: true },
      { name: "Gelişmiş AI Senaryoları", included: true },
      { name: "30 Günlük Kamera Kaydı", included: true },
      { name: "7/24 Öncelikli Destek", included: true },
    ],
  },
];

const PackageCard = ({ pkg }) => {

  const Icon = iconMap[pkg.icon];

  return (

    <div className={`relative bg-white dark:bg-slate-900 rounded-3xl p-8 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${pkg.popular ? "border-purple-500/50 shadow-purple-500/10 dark:shadow-purple-900/20" : "border-slate-200 dark:border-slate-800"}`}>

      {pkg.popular && ( <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1 rounded-full text-xs font-bold">En Çok Satan</div>)}

      <div className="flex items-center gap-3 mb-6">

        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl"><Icon size={24} className="text-blue-500" /></div>

        <div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{pkg.name}</h3>

          <div className="flex items-center gap-2 mt-1">

            <span className={`w-2 h-2 rounded-full ${pkg.status === "active" ? "bg-green-500" : "bg-red-500"}`}/>
            <span className="text-xs text-slate-500 dark:text-slate-400">{pkg.status === "active" ? "Aktif Satışta" : "Satışa Kapalı"}</span>

          </div>

        </div>

      </div>

      <div className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">

        <div className="flex items-baseline gap-1">

          <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{pkg.price}</span>
          <span className="text-slate-500">{pkg.billing}</span>

        </div>

        <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mt-2">{pkg.limits}</p>

      </div>

      <ul className="space-y-4 mb-8">

        {pkg.features.map((f, i) => ( <li key={i} className="flex items-start gap-3">

          {f.included ? ( <CheckCircle2 size={20} className="text-green-500" /> ) : ( <XCircle size={20} className="text-slate-400" /> )}
          <span className={`text-sm ${f.included ? "text-slate-700 dark:text-slate-300" : "text-slate-400 line-through"}`}>{f.name}</span>

        </li> ))}

      </ul>

      <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">

        <button className="flex-1 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-sm font-semibold py-2.5 rounded-xl">
          <Edit2 size={16} />
          Düzenle
        </button>

        <button className="p-2.5 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 text-red-600 rounded-xl">
          <Trash2 size={18} />
        </button>

      </div>

    </div>
  );
};

const AdminBilling = () => {

  const [addModal, setAddModal] = useState(false);
  const [packageName, setPackageName] = useState('');
  const [packagePrice, setPackagePrice] = useState('');
  const [billingPeriod, setBillingPeriod] = useState('Aylık');
  const [packageIcon, setPackageIcon] = useState('home');
  const [packageStatus, setPackageStatus] = useState('active');
  const [maxHomes, setMaxHomes] = useState(1);
  const [maxDevices, setMaxDevices] = useState(5);

  const [features, setFeatures] = useState([
    { name: 'Temel Cihaz Kontrolü', included: true },
    { name: 'Kamera Kaydı', included: false }
  ]);

  const [newFeatureName, setNewFeatureName] = useState('');
  const [newFeatureIncluded, setNewFeatureIncluded] = useState(true);

  useEffect(() => {

    window.scrollTo(0, 0);
  }, []);

  const handleAddFeature = () => {

    if (!newFeatureName.trim()) return;
    setFeatures([...features, { name: newFeatureName.trim(), included: newFeatureIncluded }]);
    setNewFeatureName('');
  };

  const handleRemoveFeature = (index) => {

    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {

    e.preventDefault();
    
    const newPackageData = {

      name: packageName,
      price: packagePrice === '0' || packagePrice === '' ? 'Ücretsiz' : `${packagePrice} ₺`,
      billing: packagePrice === '0' || packagePrice === '' ? 'Süresiz' : billingPeriod,
      icon: packageIcon,
      status: packageStatus,
      limits: `Maks. ${maxHomes} Ev / ${maxDevices} Cihaz`,
      features: features
    };

    console.log("Veritabanına Gönderilecek Paket:", newPackageData);
    setAddModal(false);
  };

  return (

    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">

      <AdminSidebar />

      <main className="flex-1 p-6 md:p-8">

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-4 mb-10">

          <div>

            <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-900 dark:text-white"><Package className="text-blue-500" />Lisans ve Paket Yönetimi</h1>
            <p className="text-slate-500 mt-1">Abonelik paketlerini ve limitlerini yönetin.</p>

          </div>

          <button onClick={() => setAddModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg">
            <Plus size={20} />
            Yeni Paket Ekle
          </button>

        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {packages.map((pkg) => ( <PackageCard key={pkg.id} pkg={pkg} /> ))}

        </div>

      </main>

      {addModal && ( <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">

        <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 dark:border-slate-800 my-8 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 rounded-t-2xl flex items-center justify-between shadow-md">

            <div className="flex items-center gap-3">

              <div className="p-2 bg-white/10 rounded-xl"><Package size={22} /></div>

              <div>

                <h2 className="text-lg font-bold tracking-tight">Yeni Satış Paketi Oluştur</h2>
                <p className="text-xs text-blue-100 mt-0.5">Müşteriler için yeni bir abonelik/lisans planı tanımlayın.</p>

              </div>

            </div>

            <button onClick={() => setAddModal(false)} className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl transition-all cursor-pointer" type="button">
              <X size={16} />
            </button>

          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 scrollbar-thin">

            <div className="grid grid-cols-3 gap-4">

              <div className="col-span-2">

                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">Paket Adı</label>
                <input type="text" required value={packageName} onChange={(e) => setPackageName(e.target.value)} placeholder="Örn: Başlangıç, Premium" className="w-full border border-gray-200 dark:border-slate-700 rounded-xl p-2.5 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition-all"/>

              </div>

              <div>

                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">Paket İkonu</label>

                <select value={packageIcon} onChange={(e) => setPackageIcon(e.target.value)} className="w-full border border-gray-200 dark:border-slate-700 rounded-xl p-2.5 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none cursor-pointer font-medium">

                  <option value="home">🏠 Ev</option>
                  <option value="zap">⚡ Yıldırım</option>
                  <option value="shield">🛡️ Kalkan</option>
                  <option value="sparkles">✨ Premium</option>

                </select>

              </div>

            </div>

            <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-slate-800/40 p-4 rounded-xl border border-gray-100 dark:border-slate-800/60">

              <div>

                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">Fiyat (₺)</label>
                <input type="number" min="0" value={packagePrice} onChange={(e) => setPackagePrice(e.target.value)} placeholder="0 yazarsanız Ücretsiz olur" className="w-full border border-gray-200 dark:border-slate-700 rounded-xl p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none transition-all"/>

              </div>

              <div>

                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">Faturalandırma Dönemi</label>

                <select  disabled={packagePrice === '0' || packagePrice === ''} value={billingPeriod} onChange={(e) => setBillingPeriod(e.target.value)} className="w-full border border-gray-200 dark:border-slate-700 rounded-xl p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-medium">

                  <option value="Süresiz">Süresiz (Ücretsiz Paket)</option>
                  <option value="Aylık">Aylık</option>
                  <option value="Yıllık">Yıllık</option>

                </select>

              </div>

            </div>

            <div className="grid grid-cols-3 gap-4">

              <div>

                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">Maks. Ev</label>
                <input type="number" min="1" value={maxHomes} onChange={(e) => setMaxHomes(e.target.value)} className="w-full border border-gray-200 dark:border-slate-700 rounded-xl p-2.5 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none"/>

              </div>

              <div>

                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">Maks. Cihaz</label>
                <input type="number" min="1" value={maxDevices} onChange={(e) => setMaxDevices(e.target.value)} className="w-full border border-gray-200 dark:border-slate-700 rounded-xl p-2.5 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none"/>

              </div>

              <div>

                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">Yayın Durumu</label>

                <select value={packageStatus} onChange={(e) => setPackageStatus(e.target.value)} className="w-full border border-gray-200 dark:border-slate-700 rounded-xl p-2.5 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none cursor-pointer font-medium">

                  <option value="active">Aktif (Satışta)</option>
                  <option value="passive">Pasif (Gizli)</option>

                </select>

              </div>

            </div>

            <div className="border-t border-gray-100 dark:border-slate-800/80 pt-4 space-y-3">

              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Paket Özellikleri Ayarı</label>

              <div className="flex gap-2 items-center bg-gray-50 dark:bg-slate-800/30 p-2 rounded-xl border border-gray-200/60 dark:border-slate-800/60">

                <input type="text" value={newFeatureName} onChange={(e) => setNewFeatureName(e.target.value)} placeholder="Örn: 7/24 Öncelikli Destek" className="flex-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-xs rounded-lg p-2 text-slate-900 dark:text-white focus:outline-none"/>

                <select value={newFeatureIncluded ? "true" : "false"} onChange={(e) => setNewFeatureIncluded(e.target.value === "true")} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-xs rounded-lg p-2 text-slate-700 dark:text-white focus:outline-none cursor-pointer">

                  <option value="true">Dahil ✔</option>
                  <option value="false">Dahil Değil ❌</option>

                </select>

                <button type="button" onClick={handleAddFeature} className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer">
                  <Plus size={16} />
                </button>

              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">

                {features.map((feature, index) => ( <div key={index} className="flex items-center justify-between text-xs p-2 bg-white dark:bg-slate-800/50 rounded-lg border border-gray-100 dark:border-slate-800/40 hover:border-gray-200 dark:hover:border-slate-700 transition-colors">

                  <div className="flex items-center gap-2">

                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${feature.included ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'}`}>{feature.included ? '✓' : '✕'}</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{feature.name}</span>

                  </div>

                  <button type="button" onClick={() => handleRemoveFeature(index)} className="text-slate-400 hover:text-rose-500 p-1 rounded transition-colors">
                    <Trash2 size={14} />
                  </button>

                </div> ))}

                {features.length === 0 && ( <p className="text-center text-xs text-slate-400 dark:text-slate-500 py-3 italic">Henüz bir kural/özellik eklenmedi.</p> )}

              </div>

            </div>

            <div className="pt-2">

              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/10 cursor-pointer text-sm">
                Paketi Veritabanına Kaydet
              </button>

            </div>

          </form>

        </div>

      </div> )}

    </div>
  );
};

export default AdminBilling;