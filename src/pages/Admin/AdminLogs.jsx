import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getServerLogs } from '../../redux/admin/adminCloudeSettings';

import AdminSidebar from '../../layout/AdminSidebar';

import { Search, Filter, Download, RefreshCw, AlertTriangle, Info, XCircle, CheckCircle2, Clock, ShieldAlert, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

const PAGE_SIZE = 50;

const formatTime = (iso) => (iso ? new Date(iso).toLocaleTimeString('tr-TR') : '-');
const formatDay = (iso) => (iso ? new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : '');

const toCsv = (rows) => {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const head = ['Zaman', 'Seviye', 'Modül', 'Mesaj', 'Kullanıcı', 'IP'];
  return [head, ...rows.map((r) => [r.timestamp, r.type, r.module, r.message, r.user, r.ip])].map((r) => r.map(esc).join(';')).join('\n');
};

const AdminLogs = () => {

  const dispatch = useDispatch();

  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [page, setPage] = useState(1);

  const { logs, logsTotal, logsCounts, logsLoading, logsError } = useSelector((state) => state.serverMetrics);

  const totalPages = Math.max(1, Math.ceil((logsTotal || 0) / PAGE_SIZE));

  const load = () => dispatch(getServerLogs({ level: filterType === 'all' ? undefined : filterType, search: searchTerm || undefined, page, limit: PAGE_SIZE }));

  useEffect(() => {
    load();
  }, [filterType, searchTerm, page]); // eslint-disable-line react-hooks/exhaustive-deps

  // Arama: yazmayı bıraktıktan sonra
  useEffect(() => {
    const t = setTimeout(() => { setSearchTerm(searchInput.trim()); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {

    window.scrollTo(0, 0);
  }, []);

  const exportCsv = () => {
    const blob = new Blob(['\ufeff' + toCsv(logs)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sunucu-loglari-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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

              <button onClick={load} disabled={logsLoading} className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-300 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-60">
                <RefreshCw size={16} className={logsLoading ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">Yenile</span>
              </button>

              <button onClick={exportCsv} disabled={!logs.length} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-blue-500/25">
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

              <input type="text" placeholder="Log mesajı, IP adresi veya modül ara..." className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-2xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}/>

            </div>

            <div className="relative min-w-[200px]">

              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Filter size={18} className="text-gray-400" /></div>

              <select className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-2xl pl-11 pr-10 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-bold appearance-none cursor-pointer" value={filterType} onChange={(e) => { setFilterType(e.target.value); setPage(1); }}>

                <option value="all">Tüm Loglar</option>
                <option value="error">Hatalar{logsCounts ? ` (${logsCounts.error})` : ''}</option>
                <option value="warning">Uyarılar{logsCounts ? ` (${logsCounts.warning})` : ''}</option>
                <option value="info">Bilgiler{logsCounts ? ` (${logsCounts.info})` : ''}</option>

              </select>

            </div>
            
          </div>

          {logsError && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 text-sm text-red-700 dark:text-red-400 flex items-center gap-2"><AlertTriangle size={16} /> {logsError}</div>
          )}

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

                  {!logsLoading && logs.length === 0 && (
                    <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-slate-400">Gösterilecek log kaydı yok.</td></tr>
                  )}

                  {logs.map((log, idx) => {

                    const badge = getLogBadge(log.type);

                    return (

                      <tr key={log.id || idx} className="hover:bg-gray-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                        
                        <td className="px-6 py-4 whitespace-nowrap">

                          <div className="flex items-center gap-2">

                            <Clock size={16} className="text-gray-400" />

                            <div>

                              <p className="font-bold text-gray-900 dark:text-white text-sm">{formatTime(log.timestamp)}</p>
                              <p className="text-xs text-gray-500 dark:text-slate-500">{formatDay(log.timestamp)}</p>

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

                          <p className={`text-sm font-medium line-clamp-2 ${log.type === 'error' ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-slate-300'}`} title={log.message}>{log.message}</p>
                          {log.meta && <p className="text-xs text-gray-400 dark:text-slate-500 font-mono mt-1 line-clamp-1" title={JSON.stringify(log.meta)}>{JSON.stringify(log.meta)}</p>}

                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">

                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{log.user || 'Sistem'}</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400 font-mono">{log.ip || '-'}</p>

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

              <span className="text-sm text-gray-500 dark:text-slate-400 font-medium">Toplam <span className="font-bold text-gray-900 dark:text-white">{logsTotal.toLocaleString('tr-TR')}</span> kayıt{logsTotal > 0 && <> · <span className="font-bold text-gray-900 dark:text-white">{(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, logsTotal)}</span> arası</>}</span>

              <div className="flex items-center gap-2">

                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="p-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 transition-colors shadow-sm" aria-label="Önceki sayfa">
                  <ChevronLeft size={18} />
                </button>

                <span className="text-sm font-bold text-gray-700 dark:text-slate-300 px-2">{page} / {totalPages}</span>

                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="p-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 transition-colors shadow-sm" aria-label="Sonraki sayfa">
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