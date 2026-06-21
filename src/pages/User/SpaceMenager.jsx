import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addHome, deleteHome, addRoom, deleteRoom, profile } from '../../redux/userSlice';

import Sidebar from '../../layout/Sidebar';

import { Home, Plus, Trash2, Layout, ChevronRight, ArrowRight, X, Globe, CheckCircle2, MoreHorizontal, Activity, Monitor, Edit2, MapPin, Users, Zap, Settings, AlertCircle, Eye, EyeOff, Copy, Share2, Download, Upload, Search, Filter, Grid3x3, List, Building2, Bed, Sofa, Utensils, Bath, Car, Wifi, WifiOff, TrendingUp, BarChart3, Clock, Check, Info, Star, Award } from 'lucide-react';

const SpaceManager = () => {

  const dispatch = useDispatch();

  const [isAddHomeModal, setIsAddHomeModal] = useState(false);
  const [isAddRoomModal, setIsAddRoomModal] = useState(false);
  const [isEditHomeModal, setIsEditHomeModal] = useState(false);
  const [isEditRoomModal, setIsEditRoomModal] = useState(false);
  const [selectedHomeIndex, setSelectedHomeIndex] = useState(0);
  const [homeName, setHomeName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [homeType, setHomeType] = useState('house');
  const [roomType, setRoomType] = useState('living-room');
  const [homeAddress, setHomeAddress] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedHome, setSelectedHome] = useState(null);

  const { user, loading } = useSelector((state) => state.user);

  useEffect(() => {

    dispatch(profile());
  }, [dispatch]);

  const homes = user?.user?.homes || [];
  const activeHome = homes?.[selectedHomeIndex] || null;

  const homeTypes = [

    { value: 'house', label: 'Ev', icon: <Home /> },
    { value: 'apartment', label: 'Apartman', icon: <Building2 /> },
    { value: 'office', label: 'Ofis', icon: <Monitor /> },
    { value: 'villa', label: 'Villa', icon: <Award /> }
  ];

  const roomTypes = [

    { value: 'living-room', label: 'Salon', icon: <Sofa />, color: 'blue' },
    { value: 'bedroom', label: 'Yatak Odası', icon: <Bed />, color: 'purple' },
    { value: 'kitchen', label: 'Mutfak', icon: <Utensils />, color: 'orange' },
    { value: 'bathroom', label: 'Banyo', icon: <Bath />, color: 'cyan' },
    { value: 'garage', label: 'Garaj', icon: <Car />, color: 'gray' },
    { value: 'office', label: 'Çalışma Odası', icon: <Monitor />, color: 'green' }
  ];

  const stats = [

    { label: 'Toplam Ev', value: homes.length, icon: <Home />, color: 'blue' },
    { label: 'Toplam Oda', value: homes.reduce((sum, home) => sum + (home.rooms?.length || 0), 0), icon: <Layout />, color: 'purple' },
    { label: 'Aktif Cihaz', value: homes.reduce((sum, home) => sum + (home.devices || 0), 0), icon: <Zap />, color: 'green' },
    { label: 'Online Sistem', value: homes.filter(h => h.status === 'online').length, icon: <Wifi />, color: 'orange' }
  ];

  const handleAddHome = async () => {

    if (homeName.trim()) {

      await dispatch(addHome({ name: homeName, type: homeType, address: homeAddress }));
      setHomeName('');
      setHomeType('house');
      setHomeAddress('');
      setIsAddHomeModal(false);
      dispatch(profile());
      showSuccess();
    }
  };

  const handleDeleteHome = async (id) => {

    return (

      <div className=''>

        <div>


        </div>

      </div>
    );

    if (window.confirm('Bu evi ve içindeki tüm odaları silmek istediğinize emin misiniz?')) {

      await dispatch(deleteHome(id));
      setSelectedHomeIndex(0);
      dispatch(profile());
      showSuccess();
    }
  };

  const handleAddRoom = async () => {

    if (roomName.trim() && activeHome) {

      await dispatch(addRoom({ homeId: activeHome._id, roomName, roomType }));
      setRoomName('');
      setRoomType('living-room');
      setIsAddRoomModal(false);
      dispatch(profile());
      showSuccess();
    }
  };

  const handleEditRoom = async (roomId) => {

    setIsEditRoomModal(true);
   
  };

  const handleDeleteRoom = async (roomId) => {

    if (!activeHome) return;

    if (window.confirm('Bu odayı silmek istediğinize emin misiniz?')) {

      await dispatch(deleteRoom({ homeId: activeHome._id, roomId }));
      dispatch(profile());
      showSuccess();
    }
  };

  const showSuccess = () => {

    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const getRoomIcon = (type) => {

    const roomType = roomTypes.find(rt => rt.value === type);
    return roomType ? roomType.icon : <Layout />;
  };

  const getRoomColor = (type) => {

    const roomType = roomTypes.find(rt => rt.value === type);
    return roomType ? roomType.color : 'blue';
  };

  const filteredRooms = activeHome?.rooms?.filter(room => room.name.toLowerCase().includes(searchQuery.toLowerCase())) || [];

  if (loading) {

    return (

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-900 dark:text-white">

        <div className="text-center">

          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold">Yükleniyor...</p>

        </div>

      </div>
    );
  }

  return (

    <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen">

      <Sidebar />

      {showSuccessToast && ( <div className="fixed top-8 right-8 z-50 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in">

        <CheckCircle2 size={24} />

        <div>

          <p className="font-bold">Başarılı!</p>
          <p className="text-sm">İşlem tamamlandı.</p>

        </div>

      </div> )}

      <main className="flex-1 lg:ml-0 overflow-x-hidden relative">

        <div className="p-6 lg:p-10 space-y-8 max-w-[1600px] mx-auto">

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-indigo-950/20 border border-blue-200 dark:border-slate-800 p-8 rounded-3xl">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

              <div className="space-y-3">

                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest">

                  <Globe size={14} />
                  SmartNode Hiyerarşisi

                </div>

                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">Mekan Kontrolü</h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Evlerinizi katmanlara ayırın ve ekosistemi yönetin.</p>

              </div>

              <button onClick={() => setIsAddHomeModal(true)} className="group flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/25">
                <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                Yeni Ev Ekle
              </button>

            </div>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            {stats.map((stat, i) => ( <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-lg transition-all">

              <div className={`w-12 h-12 bg-${stat.color}-500/10 rounded-xl flex items-center justify-center mb-4`}>
                <div className={`text-${stat.color}-600 dark:text-${stat.color}-400`}>{stat.icon}</div>
              </div>

              <div className="text-3xl font-bold mb-1 text-slate-900 dark:text-white">{stat.value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-500">{stat.label}</div>

            </div> ))}

          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

            <div className="xl:col-span-4 space-y-6">

              <div className="flex items-center justify-between px-2">

                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest">Kayıtlı Lokasyonlar</h3>
                <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-lg font-bold">{homes.length} EV</span>

              </div>

              <div className="space-y-4">

                {homes.map((home, index) => ( <div key={home._id} onClick={() => setSelectedHomeIndex(index)} className={`cursor-pointer group relative rounded-2xl transition-all ${selectedHomeIndex === index ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg'}`}>

                  <div className={`p-6 rounded-2xl flex items-center justify-between ${selectedHomeIndex === index ? '' : 'bg-white dark:bg-slate-900'}`}>

                    <div className="flex items-center gap-4 flex-1 min-w-0">

                      <div className={`p-3 rounded-xl transition-all ${selectedHomeIndex === index ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}><Home size={24} /></div>

                      <div className="flex-1 min-w-0">

                        <h4 className={`font-bold leading-tight truncate ${selectedHomeIndex === index ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{home.name}</h4>
                        <p className={`text-xs mt-1 font-semibold ${selectedHomeIndex === index ? 'text-white/70' : 'text-slate-500 dark:text-slate-500'}`}>{home.type || 'Ev'} • {home.rooms?.length || 0} Oda</p>

                      </div>

                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">

                      <button onClick={(e) => {e.stopPropagation(); handleDeleteHome(home._id);}} className={`p-2 rounded-lg transition-colors ${selectedHomeIndex === index ? 'hover:bg-white/20 text-white' : 'hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400'}`}>
                        <Trash2 size={16} />
                      </button>

                      <ChevronRight size={20} className={selectedHomeIndex === index ? 'text-white' : 'text-slate-400'}/>

                    </div>

                  </div>

                </div> ))}

                {homes.length === 0 && ( <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">

                  <Home size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-700" />
                  <p className="text-slate-500 dark:text-slate-500 mb-4">Henüz ev eklenmemiş</p>

                  <button onClick={() => setIsAddHomeModal(true)} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                    İlk evinizi ekleyin
                  </button>

                </div> )}

              </div>

            </div>

            <div className="xl:col-span-8 space-y-6">

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 lg:p-10">

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">

                  <div className="flex items-center gap-4">

                    <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      <Monitor size={28} />
                    </div>

                    <div>

                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{activeHome?.name || 'Ev Seçilmedi'}</h3>

                      <div className="flex items-center gap-3 mt-1 text-sm text-slate-500 dark:text-slate-500">

                        <span className="flex items-center gap-1"><Activity size={14} className="text-green-600 dark:text-green-400" />Sistem Online</span>
                        <span>•</span>
                        <span>{filteredRooms.length} Oda</span>

                      </div>

                    </div>

                  </div>

                  <div className="flex items-center gap-3">

                    <div className="relative">

                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="text" placeholder="Oda ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"/>

                    </div>

                    <div className="flex gap-2">

                      <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                        <Grid3x3 size={18} />
                      </button>

                      <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                        <List size={18} />
                      </button>

                    </div>

                  </div>

                </div>

                {activeHome ? ( <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>

                  {filteredRooms.map((room) => {

                    const roomColor = getRoomColor(room.type);

                    return (

                      <div key={room._id} className={`group relative bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-lg transition-all ${viewMode === 'list' ? 'flex items-center gap-6' : ''}`}>

                        <div className={`absolute top-0 left-0 w-full h-1 bg-${roomColor}-500 rounded-t-2xl`} />

                        <div className={`flex ${viewMode === 'list' ? 'items-center gap-6 flex-1' : 'justify-between items-start'}`}>

                          <div className={viewMode === 'list' ? 'flex items-center gap-6 flex-1' : 'space-y-4'}>

                            <div className={`w-12 h-12 bg-${roomColor}-500/10 rounded-xl flex items-center justify-center text-${roomColor}-600 dark:text-${roomColor}-400 border border-${roomColor}-500/20`}>
                              {getRoomIcon(room.type)}
                            </div>

                            <div className={viewMode === 'list' ? 'flex-1' : ''}>

                              <h5 className="text-lg font-bold text-slate-900 dark:text-white">{room.name}</h5>
                              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">{room.devices || 0} Akıllı Cihaz</p>

                            </div>

                          </div>

                          <div className={`flex items-center gap-2 ${viewMode === 'list' ? '' : 'mt-4'}`}>

                            <button onClick={() => handleDeleteRoom(room._id)} className="p-2.5 bg-red-50 dark:bg-red-500/10 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
                              <Trash2 size={16} />
                            </button>

                            <button onClick={() => handleEditRoom(room._id)} className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                              <Settings size={16} />
                            </button>

                          </div>

                        </div>

                        {viewMode === 'grid' && ( <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">

                          <span className={`text-xs font-bold uppercase tracking-wider text-${roomColor}-600 dark:text-${roomColor}-400`}>{room.status === 'active' ? 'Aktif' : 'Pasif'}</span>
                          <ArrowRight size={16} className="text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />

                        </div> )}

                      </div>
                    );

                  }
                )}

                <button onClick={() => setIsAddRoomModal(true)} className={`border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl flex items-center justify-center gap-4 text-slate-500 dark:text-slate-500 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/5 hover:text-blue-600 dark:hover:text-blue-400 transition-all group ${viewMode === 'grid' ? 'flex-col p-8' : 'p-6'}`}>

                  <div className="w-14 h-14 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus size={24} />
                  </div>
                  <span className="font-bold text-sm uppercase tracking-wider">Oda Ekle</span>

                </button>

              </div> ) : ( <div className="text-center py-20">

                <Layout size={64} className="mx-auto mb-4 text-slate-300 dark:text-slate-700" />
                <p className="text-slate-500 dark:text-slate-500">Ev seçin veya yeni ev ekleyin</p>

              </div> )}

            </div>

          </div>

        </div>

      </div>

      {isAddHomeModal && ( <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">

        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsAddHomeModal(false)}/>

        <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl">

          <div className="p-8 space-y-6">

            <div className="flex justify-between items-center">

              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Yeni Mekan Ekle</h3>
              <button onClick={() => setIsAddHomeModal(false)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors">
                <X size={20} />
              </button>

            </div>

            <div className="space-y-4">

              <div>

                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Ev Adı *</label>
                <input value={homeName} onChange={(e) => setHomeName(e.target.value)} placeholder="Örn: Ana Ev" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"/>

              </div>

              <div>

                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Ev Tipi</label>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

                  {homeTypes.map((type) => ( <button key={type.value} onClick={() => setHomeType(type.value)} className={`p-4 rounded-xl border-2 transition-all ${homeType === type.value ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'}`}>

                    <div className="flex flex-col items-center gap-2">

                      {type.icon}
                      <span className="text-xs font-semibold">{type.label}</span>

                    </div>

                  </button> ))}

                </div>

              </div>

            </div>

            <button onClick={handleAddHome} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-blue-500/25 transition-all"><CheckCircle2 size={22} />Kaydet</button>

          </div>

        </div>

      </div> )}

      {isAddRoomModal && ( <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">

        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsAddRoomModal(false)}/>

          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl">

            <div className="p-8 space-y-6">

              <div className="flex justify-between items-center">

                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Yeni Oda Ekle</h3>

                <button onClick={() => setIsAddRoomModal(false)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors">
                  <X size={20} />
                </button>

              </div>

              <div className="space-y-4">

                <div>

                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Oda Adı *</label>
                  <input value={roomName} onChange={(e) => setRoomName(e.target.value)} placeholder="Örn: Salon" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"/>

                </div>

                <div>

                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Oda Tipi</label>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

                    {roomTypes.map((type) => ( <button key={type.value} onClick={() => setRoomType(type.value)} className={`p-4 rounded-xl border-2 transition-all ${roomType === type.value ? `border-${type.color}-500 bg-${type.color}-50 dark:bg-${type.color}-500/10 text-${type.color}-600 dark:text-${type.color}-400` : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'}`}>

                      <div className="flex flex-col items-center gap-2">

                        {type.icon}
                        <span className="text-xs font-semibold">{type.label}</span>

                      </div>

                    </button> ))}

                  </div>

                </div>

              </div>

              <button onClick={handleAddRoom} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-blue-500/25 transition-all">
                <CheckCircle2 size={22} />
                Odayı Kaydet
              </button>

            </div>

          </div>

        </div> )}

        {isEditRoomModal && ( <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">

        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsEditRoomModal(false)}/>

          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl">

            <div className="p-8 space-y-6">

              <div className="flex justify-between items-center">

                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">deneme</h3>

                <button onClick={() => setIsEditRoomModal(false)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors">
                  <X size={20} />
                </button>

              </div>

              <div className="space-y-4">

                <div>

                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Oda Adı *</label>
                  <input value={roomName} onChange={(e) => setRoomName(e.target.value)} placeholder="Örn: Salon" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"/>

                </div>

                <div>

                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Oda Tipi</label>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

                    {roomTypes.map((type) => ( <button key={type.value} onClick={() => setRoomType(type.value)} className={`p-4 rounded-xl border-2 transition-all ${roomType === type.value ? `border-${type.color}-500 bg-${type.color}-50 dark:bg-${type.color}-500/10 text-${type.color}-600 dark:text-${type.color}-400` : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'}`}>

                      <div className="flex flex-col items-center gap-2">

                        {type.icon}
                        <span className="text-xs font-semibold">{type.label}</span>

                      </div>

                    </button> ))}

                  </div>

                </div>

              </div>

              <button onClick={handleAddRoom} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-blue-500/25 transition-all">
                <CheckCircle2 size={22} />
                Odayı Kaydet
              </button>

            </div>

          </div>

        </div> )}

      </main>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SpaceManager;