import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

import { getAllUsers } from "../../redux/admin/adminUserSlice";

import AdminSidebar from '../../layout/AdminSidebar';

import { Users, Server, CreditCard, Activity, ArrowUpRight, ArrowDownRight, MoreVertical, Cpu, Database, Globe, CheckCircle2, CircleCheck, Shield, User } from 'lucide-react';

const AdminDashboard = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const stats = [

    {
      id: 1,
      title: 'Toplam Kullanıcı',
      value: '2',
      change: '+15.2%',
      isIncrease: true,
      icon: <Users size={24} className="text-white" />,
      color: 'from-blue-500 to-blue-300'
    },
    {
      id: 2,
      title: 'Aktif Cihazlar',
      value: '8',
      change: '+5.4%',
      isIncrease: true,
      icon: <Server size={24} className="text-white" />,
      color: 'from-blue-500 to-blue-300'
    },
    {
      id: 3,
      title: 'Aylık Gelir',
      value: '₺145.2K',
      change: '-2.1%',
      isIncrease: false,
      icon: <CreditCard size={24} className="text-white" />,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 4,
      title: 'Sistem Durumu',
      value: '%99.9',
      change: 'Sorunsuz',
      isIncrease: true,
      icon: <Activity size={24} className="text-white" />,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const { loading, error, users } = useSelector(action => action.adminUser);

  useEffect(() => { dispatch(getAllUsers()); }, [dispatch]);

  useEffect(() => {

    window.scrollTo(0, 0);
  }, []);

  return (

    <div className="flex h-screen bg-gray-50 dark:bg-slate-950 overflow-hidden">
      
      <AdminSidebar />

      <div className="flex-1 overflow-y-auto relative no-scrollbar">
        
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto relative z-10 pb-28 lg:pb-10">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">

            <div>

              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Dashboard Özeti</h1>
              <p className="text-gray-500 dark:text-slate-400 mt-1 font-medium">Sisteminizin genel durumu ve istatistiklerine hoş geldiniz.</p>

            </div>
            
            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 px-4 py-2 rounded-2xl shadow-sm">

              <span className="relative flex h-3 w-3">

                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>

              </span>

              <span className="text-sm font-bold text-gray-700 dark:text-slate-300">Sistem Çevrimiçi</span>

            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

            {stats.map((stat) => ( <div key={stat.id} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-lg shadow-gray-100/50 dark:shadow-none hover:-translate-y-1 transition-transform duration-300">

              <div className="flex justify-between items-start mb-4">

                <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg`}>{stat.icon}</div>

                <div className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-lg ${stat.isIncrease ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10' : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10'}`}>

                  {stat.isIncrease ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {stat.change}

                </div>

              </div>
                
              <div>

                <h3 className="text-gray-500 dark:text-slate-400 text-sm font-semibold mb-1">{stat.title}</h3>
                <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{stat.value}</p>

              </div>

            </div> ))}

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-lg shadow-gray-100/50 dark:shadow-none">

              <div className="flex items-center justify-between mb-6">

                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Son Kayıt Olan Kullanıcılar</h2>
                <button onClick={() => navigate('/admin/users')} className="text-blue-600 dark:text-blue-400 text-sm font-bold hover:underline">Tümünü Gör</button>

              </div>

              <div className="overflow-x-auto">

                <table className="w-full text-left border-collapse">

                  <thead>

                    <tr className="border-b border-gray-100 dark:border-slate-800">

                      <th className="pb-3 text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Kullanıcı</th>
                      <th className="pb-3 text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Plan</th>
                      <th className="pb-3 text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Rol</th>
                      <th className="pb-3 text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Tarih</th>
                      <th className="pb-3"></th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-gray-100 dark:divide-slate-800">

                    {users.map((user) => ( <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">

                      <td className="py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">{user.name.charAt(0)}</div>

                          <div>

                            <p className="font-bold text-gray-900 dark:text-white text-sm">{user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">{user.email}</p>

                          </div>

                        </div>

                      </td>

                      <td className="py-4 text-sm font-semibold text-gray-700 dark:text-slate-300">{user.plan}</td>

                      <td className="py-4">

                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${user.role === 'user' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : user.role === 'Admin' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' : 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400'}`}>

                          {user.role === 'user' ? <User size={12} /> : user.role === 'admin' ? <Shield size={12} /> : <CheckCircle2 size={12} />}
                          {user.role}

                        </span>

                      </td>

                      <td className="py-4 text-sm text-gray-500 dark:text-slate-400">{user.createdAt ? new Date(user.createdAt).toLocaleDateString("tr-TR") : "Tarih yok"}</td>
                      <td className="py-4 text-right"><button className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"><MoreVertical size={18} /></button></td>

                    </tr> ))}

                  </tbody>

                </table>

              </div>

            </div>

            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-lg shadow-gray-100/50 dark:shadow-none space-y-8">

              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sistem Kaynakları</h2>

              <div>

                <div className="flex justify-between items-center mb-2">

                  <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-slate-300"><Cpu size={18} className="text-blue-500" />Sunucu Yükü (CPU)</div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">%42</span>

                </div>

                <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">

                  <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: '42%' }}></div>

                </div>

              </div>

              <div>

                <div className="flex justify-between items-center mb-2">

                  <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-slate-300"><Database size={18} className="text-blue-500" />Bellek Kullanımı (RAM)</div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">12.4 GB / 32 GB</span>

                </div>

                <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">

                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '38%' }}></div>

                </div>

              </div>

              <div>

                <div className="flex justify-between items-center mb-2">

                  <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-slate-300"><Globe size={18} className="text-emerald-500" />Ağ Trafiği</div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">450 MB/s</span>

                </div>

                <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">

                  <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>

                </div>

              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-slate-800">

                <button onClick={() => navigate('/admin/logs')} className="w-full py-3 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-900 dark:text-white rounded-xl font-bold transition-colors border border-gray-200 dark:border-slate-700 text-sm">Detaylı Logları İncele</button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;