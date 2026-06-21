import React, { useEffect, useState } from 'react';

import AdminSidebar from '../../layout/AdminSidebar';

const systemAllDevices = [

  { id: "DEV-1092", name: "Salon Kliması", owner: "Ahmet Yılmaz", location: "İstanbul", type: "İklimlendirme", status: "Online", lastSeen: "Şimdi" },
  { id: "DEV-4401", name: "Akıllı Priz - TV", owner: "Mehmet Kaya", location: "Ankara", type: "Enerji", status: "Online", lastSeen: "Şimdi" },
  { id: "DEV-8821", name: "Giriş Güvenlik Kamerası", owner: "Ayşe Demir", location: "İzmir", type: "Güvenlik", status: "Offline", lastSeen: "2 saat önce" },
  { id: "DEV-3019", name: "Mutfak Ana Aydınlatma", owner: "Can Özkan", location: "Bursa", type: "Aydınlatma", status: "Online", lastSeen: "Şimdi" },
  { id: "DEV-5540", name: "Bahçe Sulama Vanası", owner: "Elif Şahin", location: "Antalya", type: "Dış Mekan", status: "Hata", lastSeen: "5 dk önce" },
  { id: "DEV-7712", name: "Akıllı Termostat", owner: "Murat Çetin", location: "Eskişehir", type: "İklimlendirme", status: "Online", lastSeen: "Şimdi" },
  { id: "DEV-2291", name: "Koridor Akıllı Ampul", owner: "Selin Avcı", location: "Kocaeli", type: "Aydınlatma", status: "Online", lastSeen: "Şimdi" },
  { id: "DEV-6604", name: "Garaj Kapısı Sensörü", owner: "Hasan Yıldız", location: "Adana", type: "Güvenlik", status: "Offline", lastSeen: "1 gün önce" }
];

const AdminDevices = () => {

  const [allDevices, setAllDevices] = useState(systemAllDevices);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Hepsi');

  const filteredDevices = allDevices.filter(device => {

    const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase()) || device.id.toLowerCase().includes(searchQuery.toLowerCase()) || device.owner.toLowerCase().includes(searchQuery.toLowerCase());      
    const matchesStatus = statusFilter === 'Hepsi' || device.status === statusFilter;    
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {

    window.scrollTo(0, 0);
  }, []);

  return (

    <div className="flex h-screen bg-gray-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-hidden font-sans">

      <AdminSidebar />

      <div className="flex-1 overflow-y-auto p-6 md:p-8 transition-colors duration-200">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 border-b border-gray-200 dark:border-slate-800 pb-6">

          <div>

            <div className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Şirket Yönetim Paneli</div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1 tracking-tight">Sistemdeki Tüm Cihazlar</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Platformunuza kayıtlı tüm kullanıcı cihazlarını ve anlık bağlantı durumlarını buradan izleyin.</p>

          </div>

          <div className="grid grid-cols-3 gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">

            <div className="px-2">

              <span className="text-xs text-gray-400 dark:text-gray-500 block font-medium">Toplam</span>
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{allDevices.length}</span>

            </div>

            <div className="px-2 border-l border-gray-200 dark:border-slate-800">

              <span className="text-xs text-emerald-500 block font-medium">Online</span>
              <span className="text-xl font-bold text-emerald-500">{allDevices.filter(d => d.status === 'Online').length}</span>

            </div>

            <div className="px-2 border-l border-gray-200 dark:border-slate-800">

              <span className="text-xs text-rose-500 block font-medium">Sorunlu</span>
              <span className="text-xl font-bold text-rose-500">{allDevices.filter(d => d.status !== 'Online').length}</span>

            </div>

          </div>

        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">

          <input type="text" placeholder="Cihaz ID, ad veya kullanıcı adı ile ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"/>
          
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer font-medium">

            <option value="Hepsi">Tüm Durumlar</option>
            <option value="Online">Online (Aktif)</option>
            <option value="Offline">Offline (Bağlantı Yok)</option>
            <option value="Hata">Hata Verenler</option>

          </select>

        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full text-left border-collapse">

              <thead>

                <tr className="bg-gray-100 dark:bg-slate-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider border-b border-gray-200 dark:border-slate-800">

                  <th className="p-4 font-bold">Cihaz ID</th>
                  <th className="p-4 font-bold">Cihaz Adı</th>
                  <th className="p-4 font-bold">Kategori</th>
                  <th className="p-4 font-bold">Cihaz Sahibi</th>
                  <th className="p-4 font-bold">Bölge / Şehir</th>
                  <th className="p-4 font-bold">Son Görülme</th>
                  <th className="p-4 font-bold text-center">Durum</th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-sm">

                {filteredDevices.map((device) => ( <tr key={device.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">

                  <td className="p-4 font-mono text-xs text-indigo-600 dark:text-indigo-400 font-bold">{device.id}</td>
                  <td className="p-4 font-semibold text-gray-950 dark:text-white">{device.name}</td>
                  <td className="p-4"><span className="px-2.5 py-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 text-xs font-medium rounded-md">{device.type}</span></td>
                  <td className="p-4 text-gray-600 dark:text-gray-300 font-medium">{device.owner}</td>
                  <td className="p-4 text-gray-500 dark:text-gray-400">{device.location}</td>
                  <td className="p-4 text-xs font-mono text-gray-400 dark:text-gray-500">{device.lastSeen}</td>

                  <td className="p-4 text-center">

                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${device.status === 'Online' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : device.status === 'Offline' ? 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}><span className={`w-2 h-2 rounded-full ${device.status === 'Online' ? 'bg-emerald-500 animate-pulse' : device.status === 'Offline' ? 'bg-gray-400' : 'bg-rose-500 animate-bounce'}`} />{device.status}</span>

                  </td>

                </tr> ))}

              </tbody>

            </table>

          </div>

          {filteredDevices.length === 0 && ( <div className="text-center py-12 text-gray-400 dark:text-gray-500 font-medium">Sistemde aranan kriterlere uygun canlı cihaz kaydı bulunamadı.</div> )}

        </div>

      </div>

    </div>
  );
};

export default AdminDevices;