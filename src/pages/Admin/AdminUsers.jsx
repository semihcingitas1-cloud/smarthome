import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getAllUsers, deleteUser, deleteManyUsers, updateUserRole, updateUserStatus, verifyUserEmail } from "../../redux/admin/adminUserSlice";

import AdminSidebar from '../../layout/AdminSidebar';

import { Search, Filter, Edit, Trash2, CheckCircle2, XCircle, Clock, Shield, User, Mail, ChevronLeft, ChevronRight, Download, X, Users, UserCheck, Eye, AlertTriangle, Home, Smartphone, MailCheck, RefreshCw, ShieldCheck, UserCog } from 'lucide-react';

const PAGE_SIZE = 8;

const AVATAR_PALETTE = [

  "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
  "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400",
  "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400",
  "bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-400",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400",
  "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400",
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400",
];

const getAvatarClass = (name = '') => AVATAR_PALETTE[name.charCodeAt(0) % AVATAR_PALETTE.length];

const normalizeUser = (u) => ({
    id:              u._id,
    name:            u.name            || 'İsimsiz Kullanıcı',
    email:           u.email           || '—',
    phone:           u.phone           || null,
    role:            u.role            || 'user',
    isEmailVerified: u.isEmailVerified ?? false,
    isActive:        u.isActive        ?? true,
    avatar:          u.avatar          || null,
    homes:           u.homes           || [],
    createdAt:       u.createdAt       ? new Date(u.createdAt).toLocaleDateString('tr-TR', { day:'2-digit', month:'short', year:'numeric' }) : '—',
    updatedAt:       u.updatedAt       ? new Date(u.updatedAt).toLocaleDateString('tr-TR', { day:'2-digit', month:'short', year:'numeric' }) : '—',
    providers: [

      u.googleId   && 'Google',
      u.facebookId && 'Facebook',
      u.githubId   && 'GitHub',
    ].filter(Boolean),
});

const ROLE_MAP = {

  superadmin: { label: 'Süper Admin', icon: ShieldCheck, cls: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10" },
  admin:      { label: 'Admin',       icon: Shield,      cls: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10" },
  user:       { label: 'Kullanıcı',   icon: User,        cls: "text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-800" },
};


const StatCard = ({ icon: Icon, label, value, accent, sub }) => (

  <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 flex items-start gap-4 hover:-translate-y-0.5 transition-all hover:shadow-md dark:hover:shadow-none hover:border-gray-300 dark:hover:border-slate-700">

    <div className={`p-2.5 rounded-xl ${accent}`}><Icon size={20} className="text-white" /></div>

    <div>

      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-1">{label}</p>
      <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{sub}</p>}

    </div>

  </div>
);

const RoleBadge = ({ role }) => {

  const cfg = ROLE_MAP[role] || ROLE_MAP.user;
  const Icon = cfg.icon;

  return (

    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${cfg.cls}`}><Icon size={11} /> {cfg.label}</span>
  );
};

const VerifiedBadge = ({ verified }) => verified ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/20"><MailCheck size={10} /> Doğrulandı</span> : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20"><Mail size={10} /> Doğrulanmadı</span>;

const StatusToggle = ({ isActive, userId, dispatch, actionLoading }) => (

  <button disabled={actionLoading} onClick={() => dispatch(updateUserStatus({ userId, isActive: !isActive }))} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all disabled:opacity-50 ${isActive ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-500/20' : 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20 hover:bg-green-50 dark:hover:bg-green-500/10 hover:text-green-600 dark:hover:text-green-400 hover:border-green-200 dark:hover:border-green-500/20'}`}>
    {isActive ? <><CheckCircle2 size={11} /> Aktif</> : <><XCircle size={11} /> Pasif</>}
  </button>
);

const DeleteModal = ({ user, onConfirm, onCancel, loading }) => (

  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />

    <div className="relative bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">

      <div className="flex items-center gap-3 mb-4">

        <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-500/10"><AlertTriangle size={20} className="text-red-500" /></div>
        <h3 className="font-bold text-gray-900 dark:text-white">Kullanıcıyı Sil</h3>

      </div>

      <p className="text-sm text-gray-500 dark:text-slate-400 mb-1 leading-relaxed"><span className="font-semibold text-gray-900 dark:text-white">{user?.name}</span> adlı kullanıcıyı kalıcı olarak silmek istediğinize emin misiniz?</p>
      <p className="text-xs text-red-400 mb-6">Bu işlem geri alınamaz. Kullanıcının tüm ev ve oda verileri de silinecektir.</p>

      <div className="flex gap-2">

        <button onClick={onCancel} disabled={loading} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all disabled:opacity-50">
          İptal
        </button>

        <button onClick={onConfirm} disabled={loading} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {loading && <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}Sil
        </button>

      </div>

    </div>

  </div>
);

const UserDrawer = ({ user, dispatch, actionLoading, onClose, onDelete }) => {

  const [roleEdit, setRoleEdit] = useState(false);
  const [newRole,  setNewRole]  = useState(user?.role);

  if (!user) return null;
  const avatarCls = getAvatarClass(user.name);

  const handleRoleSave = () => {

    dispatch(updateUserRole({ userId: user.id, role: newRole }));
    setRoleEdit(false);
  };


  return (

    <div className="fixed inset-0 z-50 flex justify-end">

      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-sm h-full bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-y-auto">

        <div className="sticky top-0 z-10 px-5 py-4 border-b border-gray-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur flex items-center justify-between">
          <h2 className="font-bold text-gray-900 dark:text-white">Kullanıcı Detayı</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"><X size={18} /></button>
        </div>

        <div className="px-5 pt-6 pb-5 flex flex-col items-center text-center border-b border-gray-100 dark:border-slate-800">

          {user.avatar ? <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-3xl object-cover mb-3" /> : <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl font-black mb-3 ${avatarCls}`}>{user.name.charAt(0).toUpperCase()}</div>}
          <h3 className="text-lg font-black text-gray-900 dark:text-white">{user.name}</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 flex items-center gap-1.5 mt-1"><Mail size={13} /> {user.email}</p>
          {user.phone && ( <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{user.phone}</p> )}

          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">

            <RoleBadge role={user.role} />
            <VerifiedBadge verified={user.isEmailVerified} />
            <StatusToggle isActive={user.isActive} userId={user.id} dispatch={dispatch} actionLoading={actionLoading} />

          </div>

          {user.providers.length > 0 && ( <div className="flex gap-1.5 mt-2">

            {user.providers.map(p => ( <span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 font-semibold border border-gray-200 dark:border-slate-700">{p}</span> ))}

          </div> )}

        </div>

        <div className="px-5 py-5 space-y-3 flex-1">

          <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-3.5">

            <div className="flex items-center justify-between mb-1">

              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">Rol</p>
              {!roleEdit && ( <button onClick={() => setRoleEdit(true)} className="text-[10px] font-bold text-blue-500 hover:underline flex items-center gap-0.5"><UserCog size={11} /> Değiştir</button> )}

            </div>

            {roleEdit ? ( <div className="flex gap-2 mt-1">

              <select value={newRole} onChange={e => setNewRole(e.target.value)} className="flex-1 text-xs rounded-lg px-2 py-1.5 border bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-800 dark:text-white outline-none">

                <option value="user">Kullanıcı</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Süper Admin</option>

              </select>

              <button onClick={handleRoleSave} disabled={actionLoading} className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-bold hover:bg-blue-600 transition-all disabled:opacity-50">
                Kaydet
              </button>

              <button onClick={() => setRoleEdit(false)} className="px-2 py-1.5 rounded-lg bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-300 text-xs font-bold hover:bg-gray-300 dark:hover:bg-slate-600 transition-all">
                <X size={13} />
              </button>

            </div> ) : ( <RoleBadge role={user.role} /> )}

          </div>

          <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-3.5">

            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2">Evler ({user.homes.length})</p>
            {user.homes.length === 0 ? <p className="text-xs text-gray-400 dark:text-slate-500">Kayıtlı ev yok.</p> : user.homes.map((h, i) => ( <div key={i} className="flex items-center gap-2 py-1.5 border-b border-gray-100 dark:border-slate-700 last:border-0">

              <Home size={13} className="text-gray-400 dark:text-slate-500 shrink-0" />

              <div>

                <p className="text-xs font-semibold text-gray-700 dark:text-slate-300">{h.name}</p>
                <p className="text-[10px] text-gray-400 dark:text-slate-500">{h.rooms?.length || 0} oda · {h.rooms?.reduce((s, r) => s + (r.devices?.length || 0), 0)} cihaz</p>

              </div>

            </div> )) }

          </div>

          {[
              { label: "Kullanıcı ID", value: user.id },
              { label: "Kayıt Tarihi", value: user.createdAt },
              { label: "Son Güncelleme", value: user.updatedAt },
          ].map(({ label, value }) => ( <div key={label} className="bg-gray-50 dark:bg-slate-800 rounded-xl p-3.5">

            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-0.5">{label}</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 font-mono break-all">{value}</p>

          </div> ))}

          {!user.isEmailVerified && ( <button disabled={actionLoading} onClick={() => dispatch(verifyUserEmail(user.id))} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10 text-sm font-bold transition-all disabled:opacity-50">

            <MailCheck size={15} /> E-postayı Doğrula

          </button> )}

        </div>

        <div className="px-5 pb-6 flex gap-2">

          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold transition-all">
            <Edit size={15} /> Düzenle
          </button>

          <button onClick={() => { onClose(); onDelete(user); }} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-500/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 text-sm font-bold transition-all">
            <Trash2 size={15} />
          </button>

        </div>

      </div>

    </div>
  );
};

const AdminUsers = () => {

  const dispatch = useDispatch();

  const [searchTerm,   setSearchTerm]   = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter,   setRoleFilter]   = useState('all');
  const [verifiedFilter, setVerifiedFilter] = useState('all');
  const [currentPage,  setCurrentPage]  = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget,   setViewTarget]   = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const { loading, error, users, actionLoading, actionError } = useSelector(s => s.adminUser);

  const usersData = (users || []).map(normalizeUser);

  useEffect(() => { dispatch(getAllUsers()); }, [dispatch]);

  useEffect(() => {

    window.scrollTo(0, 0);
  }, []);

  const filtered = usersData.filter(u => {

    const q = searchTerm.toLowerCase();
    const matchQ        = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q) || (u.phone && u.phone.includes(q));
    const matchStatus   = statusFilter === 'all' ? true : statusFilter === 'active' ? u.isActive : !u.isActive;
    const matchRole     = roleFilter   === 'all' || u.role === roleFilter;
    const matchVerified = verifiedFilter === 'all' ? true : verifiedFilter === 'verified' ? u.isEmailVerified : !u.isEmailVerified;
    return matchQ && matchStatus && matchRole && matchVerified;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const activeCount    = usersData.filter(u => u.isActive).length;
  const adminCount     = usersData.filter(u => u.role === 'admin' || u.role === 'superadmin').length;
  const unverifiedCount= usersData.filter(u => !u.isEmailVerified).length;

  const activeFilters = [searchTerm, statusFilter !== 'all', roleFilter !== 'all', verifiedFilter !== 'all'].filter(Boolean).length;

  const toggleRow    = (id) => setSelectedRows(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const allSelected  = paginated.length > 0 && paginated.every(u => selectedRows.includes(u.id));
  const toggleAll    = () => setSelectedRows(allSelected ? [] : paginated.map(u => u.id));

  const handleDeleteConfirm = async () => {

    await dispatch(deleteUser(deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleBulkDelete = async () => {

    if (!window.confirm(`${selectedRows.length} kullanıcı silinecek. Emin misiniz?`)) return;
    await dispatch(deleteManyUsers(selectedRows));
    setSelectedRows([]);
  };

  const goTo = (page) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  const clearFilters = () => { setSearchTerm(''); setStatusFilter('all'); setRoleFilter('all'); setVerifiedFilter('all'); setCurrentPage(1); };

  return (

    <div className="flex h-screen bg-gray-50 dark:bg-slate-950 overflow-hidden">

      <AdminSidebar />

      <div className="flex-1 overflow-y-auto">

        <div className="relative min-h-full">

          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6 pb-20">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

              <div>

                <p className="text-[11px] font-bold uppercase tracking-widest text-blue-500 mb-1">Yönetim Paneli</p>
                <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">Kullanıcı Yönetimi</h1>
                <p className="text-sm mt-0.5 font-medium text-gray-500 dark:text-slate-400">Sistemdeki üyeleri görüntüleyin, düzenleyin veya yönetin.</p>

              </div>

              <div className="flex items-center gap-2 flex-wrap">

                <button onClick={() => dispatch(getAllUsers())} disabled={loading} className="p-2.5 rounded-xl border bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50">
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                </button>

                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800">
                  <Download size={16} /><span className="hidden sm:inline">Dışa Aktar</span>
                </button>

              </div>

            </div>

            {actionError && ( <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium">

              <AlertTriangle size={16} />
              {actionError}

            </div> )}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

              <StatCard icon={Users}     label="Toplam"         value={usersData.length} accent="bg-blue-500"    sub="kayıtlı kullanıcı" />
              <StatCard icon={UserCheck} label="Aktif"          value={activeCount}      accent="bg-emerald-500" sub="aktif hesap" />
              <StatCard icon={Shield}    label="Admin"          value={adminCount}       accent="bg-violet-500"  sub="yönetici" />
              <StatCard icon={MailCheck} label="Doğrulanmadı"   value={unverifiedCount}  accent="bg-amber-500"   sub="e-posta bekliyor" />

            </div>

            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm dark:shadow-none">

              <div className="flex flex-col lg:flex-row gap-3">

                <div className="relative flex-1">

                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="text" placeholder="İsim, e-posta, telefon veya ID ara..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="w-full rounded-xl pl-10 pr-10 py-2.5 text-sm border outline-none transition-colors font-medium bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-blue-400 dark:focus:border-blue-500/60" />
                  {searchTerm && ( <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"><X size={14} /></button> )}

                </div>

                <div className="relative min-w-[155px]">

                  <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={15} />

                  <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setCurrentPage(1); }} className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm border outline-none appearance-none cursor-pointer font-semibold bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:border-blue-400 dark:focus:border-blue-500/60">

                    <option value="all">Tüm Roller</option>
                    <option value="superadmin">Süper Admin</option>
                    <option value="admin">Admin</option>
                    <option value="user">Kullanıcı</option>

                  </select>

                </div>

                <div className="relative min-w-[155px]">

                  <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={15} />

                  <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm border outline-none appearance-none cursor-pointer font-semibold bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:border-blue-400 dark:focus:border-blue-500/60">

                    <option value="all">Tüm Durumlar</option>
                    <option value="active">Aktif</option>
                    <option value="passive">Pasif</option>

                  </select>

                </div>

                <div className="relative min-w-[170px]">

                  <MailCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={15} />

                  <select value={verifiedFilter} onChange={e => { setVerifiedFilter(e.target.value); setCurrentPage(1); }} className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm border outline-none appearance-none cursor-pointer font-semibold bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:border-blue-400 dark:focus:border-blue-500/60">

                    <option value="all">E-posta Durumu</option>
                    <option value="verified">Doğrulandı</option>
                    <option value="unverified">Doğrulanmadı</option>

                  </select>

                </div>

                {activeFilters > 0 && ( <button onClick={clearFilters} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-red-500 border border-red-200 dark:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all whitespace-nowrap"><X size={13} /> Temizle ({activeFilters})</button> )}

              </div>

              {selectedRows.length > 0 && ( <div className="mt-3 px-4 py-2.5 rounded-xl flex items-center justify-between text-sm bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">

                <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedRows.length} kullanıcı seçildi</span>

                <div className="flex items-center gap-2">

                  <button onClick={handleBulkDelete} disabled={actionLoading} className="px-3 py-1 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-all disabled:opacity-50 flex items-center gap-1">
                    {actionLoading && <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />}Toplu Sil
                  </button>

                  <button onClick={() => setSelectedRows([])} className="p-1 rounded-lg text-blue-500 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all">
                    <X size={14} />
                  </button>

                </div>

              </div> )}

            </div>

            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">

              {loading && ( <div className="py-20 flex flex-col items-center gap-3 text-gray-400 dark:text-slate-500">

                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-medium">Kullanıcılar yükleniyor...</p>

              </div> )}

              {error && !loading && ( <div className="py-16 flex flex-col items-center gap-3 text-red-400">

                <AlertTriangle size={36} strokeWidth={1.5} />
                <p className="text-sm font-semibold">Veri yüklenirken hata oluştu.</p>
                <p className="text-xs text-gray-400 dark:text-slate-500">{typeof error === 'string' ? error : 'Lütfen tekrar deneyin.'}</p>
                <button onClick={() => dispatch(getAllUsers())} className="mt-1 px-4 py-2 rounded-xl bg-blue-500 text-white text-xs font-bold hover:bg-blue-600 transition-all">Tekrar Dene</button>

              </div> )}

              {!loading && !error && ( <div className="overflow-x-auto">

                <table className="w-full text-left border-collapse min-w-[900px]">

                  <thead>

                    <tr className="border-b text-[11px] font-bold uppercase tracking-widest bg-gray-50 dark:bg-slate-800/50 border-gray-100 dark:border-slate-800 text-gray-400 dark:text-slate-400">

                      <th className="px-5 py-4 w-10"><input type="checkbox" checked={allSelected} onChange={toggleAll} className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 accent-blue-500 cursor-pointer" /></th>
                      <th className="px-5 py-4">Kullanıcı</th>
                      <th className="px-5 py-4">Rol</th>
                      <th className="px-5 py-4">E-posta</th>
                      <th className="px-5 py-4">Durum</th>
                      <th className="px-5 py-4">Evler</th>
                      <th className="px-5 py-4">Kayıt</th>
                      <th className="px-5 py-4 text-right">İşlemler</th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-sm">

                    {paginated.length > 0 ? paginated.map(u => {

                      const avatarCls  = getAvatarClass(u.name);
                      const isSelected = selectedRows.includes(u.id);

                      return (

                        <tr key={u.id} className={`group transition-colors ${isSelected ? 'bg-blue-50/60 dark:bg-blue-500/5 border-l-2 border-l-blue-500' : 'hover:bg-gray-50/80 dark:hover:bg-slate-800/40'}`}>

                          <td className="px-5 py-4"><input type="checkbox" checked={isSelected} onChange={() => toggleRow(u.id)} className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 accent-blue-500 cursor-pointer" /></td>

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              {u.avatar ? <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-2xl object-cover shrink-0" /> : <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black shrink-0 ${avatarCls}`}>
                                {u.name.charAt(0).toUpperCase()}
                              </div> }

                              <div>

                                <p className="font-bold text-sm text-gray-900 dark:text-white">{u.name}</p>
                                <p className="text-xs flex items-center gap-1 mt-0.5 text-gray-500 dark:text-slate-400"><Mail size={10} /> {u.email}</p>
                                <p className="text-[10px] font-mono mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 dark:text-slate-500">{u.id}</p>

                              </div>

                            </div>

                          </td>

                          <td className="px-5 py-4 whitespace-nowrap"><RoleBadge role={u.role} /></td>
                          <td className="px-5 py-4 whitespace-nowrap"><VerifiedBadge verified={u.isEmailVerified} /></td>
                          <td className="px-5 py-4 whitespace-nowrap"><StatusToggle isActive={u.isActive} userId={u.id} dispatch={dispatch} actionLoading={actionLoading} /></td>

                          <td className="px-5 py-4 whitespace-nowrap">

                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-slate-400">

                              <Home size={13} className="text-gray-400 dark:text-slate-500" />
                              {u.homes.length} ev
                              <span className="text-gray-300 dark:text-slate-600">·</span>
                              <Smartphone size={12} className="text-gray-400 dark:text-slate-500" />
                              {u.homes.reduce((s, h) => s + h.rooms?.reduce((rs, r) => rs + (r.devices?.length || 0), 0), 0)} cihaz

                            </span>

                          </td>

                          <td className="px-5 py-4 whitespace-nowrap"><span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-slate-400"><Clock size={11} className="shrink-0" />{u.createdAt}</span></td>

                          <td className="px-5 py-4">

                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">

                              <button onClick={() => setViewTarget(u)} className="p-2 rounded-xl transition-all text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10" title="İncele"><Eye size={15} /></button>
                              <button className="p-2 rounded-xl transition-all text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10" title="Düzenle"><Edit size={15} /></button>
                              <button onClick={() => setDeleteTarget(u)} className="p-2 rounded-xl transition-all text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10" title="Sil"><Trash2 size={15} /></button>

                            </div>

                          </td>

                        </tr>
                      );

                    }) : ( <tr>

                      <td colSpan="8" className="py-20">

                        <div className="flex flex-col items-center gap-3 text-gray-400 dark:text-slate-500">

                          <Users size={40} strokeWidth={1.5} className="text-gray-200 dark:text-slate-700" />
                          <p className="text-sm font-medium">Kriterlere uygun kullanıcı bulunamadı.</p>
                          {activeFilters > 0 && ( <button onClick={clearFilters} className="text-xs text-blue-500 dark:text-blue-400 hover:underline">Filtreleri temizle</button> )}

                        </div>

                      </td>

                    </tr> )}

                  </tbody>

                </table>

              </div> )}

              {!loading && !error && ( <div className="px-5 py-3.5 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">

                <span className="text-gray-400 dark:text-slate-500">

                  Gösterilen{' '}
                  <span className="font-bold text-gray-700 dark:text-slate-300">{filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)}</span>
                  {' '}/ Toplam{' '}
                  <span className="font-bold text-gray-700 dark:text-slate-300">{filtered.length}</span> kullanıcı

                </span>

                <div className="flex items-center gap-1.5">

                  <button disabled={currentPage === 1} onClick={() => goTo(currentPage - 1)} className="p-1.5 rounded-lg border transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700">
                    <ChevronLeft size={15} />
                  </button>

                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {

                    let page = i + 1;

                    if (totalPages > 7) {

                      if (currentPage <= 4) page = i + 1;
                      else if (currentPage >= totalPages - 3) page = totalPages - 6 + i;
                      else page = currentPage - 3 + i;
                    }

                    return (

                      <button key={page} onClick={() => goTo(page)} className={`w-7 h-7 rounded-lg text-xs font-bold border transition-all ${currentPage === page ? 'bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-500/20' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`}>
                        {page}
                      </button>
                    );

                  })}

                  <button disabled={currentPage === totalPages} onClick={() => goTo(currentPage + 1)} className="p-1.5 rounded-lg border transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700">
                    <ChevronRight size={15} />
                  </button>

                </div>

              </div> )}

            </div>

          </div>

        </div>

      </div>

      {deleteTarget && ( <DeleteModal user={deleteTarget} loading={actionLoading} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteTarget(null)} /> )}
      {viewTarget && ( <UserDrawer user={viewTarget} dispatch={dispatch} actionLoading={actionLoading} onClose={() => setViewTarget(null)} onDelete={setDeleteTarget} /> )}

    </div>
  );
};

export default AdminUsers;