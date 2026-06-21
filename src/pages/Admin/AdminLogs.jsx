import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getServerLogs } from '../../redux/admin/adminCloudeSettings';

import AdminSidebar from '../../layout/AdminSidebar';

import { Search, Filter, Download, RefreshCw, AlertTriangle, Info, XCircle, CheckCircle2, Clock, ShieldAlert, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

const AdminLogs = () => {

  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const { logs, logsLoading, logsError } = useSelector((state) => state.adminUser);

  useEffect(() => {

    if (logsError) {

      alert(logsError);
    }

    dispatch(getServerLogs({ projectId: 'project-7a6a1a99-6493-4e38-81f', instanceId: 'instance-20260414-102205' }));

  }, [dispatch, logsError]);

  useEffect(() => {

    window.scrollTo(0, 0);
  }, []);

  const logsData = [
    {
      id: "LOG-8842",
      type: "critical",
      module: "Security",
      message: "Yetkisiz erişim denemesi tespit edildi (Art arda 15 hatalı şifre)",
      user: "Bilinmeyen",
      ip: "192.168.1.105",
      time: "20:00:12",
      date: "25 Mayıs 2026"
    },
    {
      id: "LOG-8836",
      type: "warning",
      module: "System",
      message: "Sunucu RAM kullanımı %85 seviyesini aştı.",
      user: "System",
      ip: "10.0.0.1",
      time: "17:30:00",
      date: "25 Mayıs 2026"
    }
  ];

  console.log(logs, logsLoading, logsError);

  const getLogBadge = (type) => {

    switch (type) {

      case 'critical':
        return { color: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20', icon: <ShieldAlert size={14} />, label: 'Kritik' };
      case 'error':
        return { color: 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border-orange-200 dark:border-orange-500/20', icon: <XCircle size={14} />, label: 'Hata' };
      case 'warning':
        return { color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20', icon: <AlertTriangle size={14} />, label: 'Uyarı' };
      case 'success':
        return { color: 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-200 dark:border-green-500/20', icon: <CheckCircle2 size={14} />, label: 'Başarılı' };
      case 'info':
      default:
        return { color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20', icon: <Info size={14} />, label: 'Bilgi' };
    }
  };

  return (

    <div className="flex bg-gray-50 dark:bg-slate-950 overflow-hidden">

      <AdminSidebar />

      <div className="flex-1 overflow-y-auto relative no-scrollbar">

        <div className="absolute top-20 right-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="p-6 lg:p-10 max-w-[1400px] mx-auto relative z-10 pb-28 lg:pb-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">

            <div>

              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Sistem Logları</h1>
              <p className="text-gray-500 dark:text-slate-400 mt-1 font-medium">Tüm sistem aktivitelerini, hataları ve güvenlik bildirimlerini izleyin.</p>

            </div>
            
            <div className="flex items-center gap-3">

              <button className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-300 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
                <RefreshCw size={16} />
                <span className="hidden sm:inline">Yenile</span>
              </button>

              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-blue-500/25">
                <Download size={16} />
                <span className="hidden sm:inline">Dışa Aktar (CSV)</span>
              </button>

            </div>

          </div>

          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-4 md:p-6 mb-8 shadow-lg shadow-gray-100/50 dark:shadow-none flex flex-col md:flex-row gap-4">
            
            <div className="flex-1 relative">

              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>

              <input type="text" placeholder="Log mesajı, IP adresi veya modül ara..." className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-2xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>

            </div>

            <div className="relative min-w-[200px]">

              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Filter size={18} className="text-gray-400" /></div>

              <select className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-2xl pl-11 pr-10 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-bold appearance-none cursor-pointer" value={filterType} onChange={(e) => setFilterType(e.target.value)}>

                <option value="all">Tüm Loglar</option>
                <option value="critical">Kritikler</option>
                <option value="error">Hatalar</option>
                <option value="warning">Uyarılar</option>
                <option value="info">Bilgiler</option>

              </select>

            </div>
            
          </div>

          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-lg shadow-gray-100/50 dark:shadow-none overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full text-left border-collapse min-w-[900px]">

                <thead>

                  <tr className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-800">

                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Zaman</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Seviye</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Modül</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Mesaj</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Kullanıcı / IP</th>
                    <th className="px-6 py-4"></th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-slate-800/50">

                  {logsData.map((log, idx) => {

                    const badge = getLogBadge(log.type);

                    return (

                      <tr key={idx} className="hover:bg-gray-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                        
                        <td className="px-6 py-4 whitespace-nowrap">

                          <div className="flex items-center gap-2">

                            <Clock size={16} className="text-gray-400" />

                            <div>

                              <p className="font-bold text-gray-900 dark:text-white text-sm">{log.time}</p>
                              <p className="text-xs text-gray-500 dark:text-slate-500">{log.date}</p>

                            </div>

                          </div>

                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">

                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}>

                            {badge.icon}
                            {badge.label}

                          </div>

                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">

                          <span className="text-sm font-semibold text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">{log.module}</span>

                        </td>

                        <td className="px-6 py-4">

                          <p className={`text-sm font-medium line-clamp-2 ${log.type === 'critical' ? 'text-red-600 dark:text-red-400 font-bold' : 'text-gray-700 dark:text-slate-300'}`}>{log.message}</p>
                          <p className="text-xs text-gray-400 dark:text-slate-500 font-mono mt-1">ID: {log.id}</p>

                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">

                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{log.user}</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400 font-mono">{log.ip}</p>

                        </td>

                        <td className="px-6 py-4 text-right whitespace-nowrap">

                          <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                            <MoreHorizontal size={20} />
                          </button>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

            <div className="border-t border-gray-100 dark:border-slate-800 p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/50 dark:bg-slate-900/50">

              <span className="text-sm text-gray-500 dark:text-slate-400 font-medium">Toplam <span className="font-bold text-gray-900 dark:text-white">1,245</span> kayıttan <span className="font-bold text-gray-900 dark:text-white">1-7</span> arası gösteriliyor</span>
              
              <div className="flex items-center gap-2">

                <button className="p-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 transition-colors shadow-sm" disabled>
                  <ChevronLeft size={18} />
                </button>

                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20">
                  1
                </button>

                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 font-bold hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  2
                </button>

                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 font-bold hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  3
                </button>

                <span className="text-gray-400 mx-1">...</span>

                <button className="p-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors shadow-sm">
                  <ChevronRight size={18} />
                </button>

              </div>

            </div>
            
          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminLogs;