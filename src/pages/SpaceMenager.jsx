import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addHome, deleteHome, addRoom, deleteRoom, profile } from '../redux/userSlice';
import Sidebar from '../layout/Sidebar';

import { Home, Plus, Trash2, Layout, ChevronRight, ArrowRight, X, Globe, CheckCircle2, Activity, Monitor } from 'lucide-react';

const SpaceManager = () => {

  const dispatch = useDispatch();

  const [isAddHomeModal, setIsAddHomeModal] = useState(false);
  const [isAddRoomModal, setIsAddRoomModal] = useState(false);
  const [selectedHomeIndex, setSelectedHomeIndex] = useState(0);
  const [homeName, setHomeName] = useState('');
  const [roomName, setRoomName] = useState('');

  const { user, loading } = useSelector((state) => state.user);

  useEffect(() => {

    dispatch(profile());
  }, [dispatch]);

  const homes = user?.user?.homes || [];
  const activeHome = homes?.[selectedHomeIndex] || null;

  const handleAddHome = () => {

    if (homeName.trim()) {

      dispatch(addHome({ name: homeName }));
      setHomeName('');
      setIsAddHomeModal(false);
    }
  };

  const handleDeleteHome = (id) => {

    if (window.confirm('Bu evi ve içindeki tüm odaları silmek istediğinize emin misiniz?')) {

      dispatch(deleteHome(id));
      setSelectedHomeIndex(0);
    }
  };

  const handleAddRoom = () => {

    if (roomName.trim() && activeHome) {

      dispatch(addRoom({ homeId: activeHome._id, roomName }));
      setRoomName('');
      setIsAddRoomModal(false);
    }
  };

  const handleDeleteRoom = (roomId) => {

    if (!activeHome) return;
    dispatch(deleteRoom({ homeId: activeHome._id, roomId }));
  };

  if (loading) {

    return (

      <div className="min-h-screen bg-[#05070a] flex items-center justify-center text-white">Yükleniyor...</div>
    );
  }

  return (

    <div className="flex bg-[#05070a] min-h-screen text-slate-200">

      <Sidebar />

      <main className="flex-1 lg:ml-0 overflow-x-hidden relative">

        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="p-6 lg:p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1600px] mx-auto relative z-10">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-900/20 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-md">

            <div className="space-y-2">

              <div className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase tracking-[0.3em]"><Globe size={14} /> SmartNode Hiyerarşisi</div>
              <h2 className="text-4xl font-black text-white tracking-tight">Mekan Kontrolü</h2>
              <p className="text-slate-500 font-medium">Evlerinizi katmanlara ayırın ve ekosistemi yönetin.</p>

            </div>

            <button onClick={() => setIsAddHomeModal(true)} className="group flex items-center gap-3 bg-white text-black hover:bg-blue-500 hover:text-white px-8 py-4 rounded-2xl font-black transition-all duration-500 shadow-2xl active:scale-95">
              <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Yeni Ev Ekle
            </button>

          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">

            <div className="xl:col-span-4 space-y-6">

              <div className="flex items-center justify-between px-2">

                <h3 className="text-xs font-black text-slate-600 uppercase tracking-widest">Kayıtlı Lokasyonlar</h3>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded-md">{homes.length} EV</span>

              </div>

              <div className="space-y-4">

                {homes.map((home, index) => ( <div key={home._id} onClick={() => setSelectedHomeIndex(index)} className={`cursor-pointer group relative p-1 rounded-[2rem] transition-all duration-500 ${selectedHomeIndex === index ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-slate-900/50 hover:bg-slate-800'}`}>

                  <div className="bg-[#0b0f1a] rounded-[1.8rem] p-6 h-full flex items-center justify-between">

                    <div className="flex items-center gap-5">

                      <div className={`p-4 rounded-2xl transition-all duration-500 ${selectedHomeIndex === index ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-500 group-hover:text-blue-400'}`}>
                        <Home size={24} />
                      </div>

                      <div>

                        <h4 className="font-bold text-white leading-none">{home.name}</h4>
                        <p className="text-[10px] text-slate-500 mt-2 font-black uppercase tracking-tighter">{home.type || 'Ev'} • {home.rooms?.length || 0} Oda</p>

                      </div>

                    </div>

                    <div className="flex items-center gap-2">

                      <button onClick={(e) => { e.stopPropagation(); handleDeleteHome(home._id); }} className="p-2 rounded-lg hover:bg-red-500/20 text-red-400">
                        <Trash2 size={16} />
                      </button>

                      <ChevronRight size={20} className={`${selectedHomeIndex === index ? 'text-blue-500' : 'text-slate-800'}`}/>

                    </div>

                  </div>

                </div> ))}

              </div>

            </div>

            <div className="xl:col-span-8 space-y-8">

              <div className="bg-slate-900/30 border border-white/5 rounded-[3rem] p-8 lg:p-12 min-h-[600px]">

                <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-8">

                  <div className="flex items-center gap-5">

                    <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-500/20"><Monitor size={28} /></div>

                    <div>

                      <h3 className="text-2xl font-black text-white">{activeHome?.name || 'Ev Yok'}</h3>

                      <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">

                        <span className="flex items-center gap-1"><Activity size={14} className="text-green-500" /> Sistem Online</span>
                        <span>•</span>
                        <span>Düşük Gecikme</span>

                      </div>

                    </div>

                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {activeHome?.rooms?.map((room) => (
                    <div
                      key={room._id}
                      className="group relative bg-[#0b0f1a] border border-white/5 p-8 rounded-[2.5rem] hover:border-blue-500/50 transition-all duration-500 overflow-hidden"
                    >
                      <div
                        className={`absolute top-0 left-0 w-full h-1 ${
                          room.status === 'active'
                            ? 'bg-green-500'
                            : room.status === 'warning'
                            ? 'bg-yellow-500'
                            : 'bg-slate-700'
                        }`}
                      />

                      <div className="flex justify-between items-start">
                        <div className="space-y-4">
                          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-slate-600 group-hover:text-blue-400 group-hover:bg-blue-400/10 transition-all duration-500">
                            <Layout size={22} />
                          </div>

                          <div>
                            <h5 className="text-xl font-bold text-white">{room.name}</h5>
                            <p className="text-xs text-slate-500 mt-1 font-medium">{room.devices || 0} Akıllı Ünite</p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteRoom(room._id)}
                          className="p-3 bg-slate-900 rounded-xl text-red-400 hover:text-white hover:bg-red-500/20 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest ${
                            room.status === 'active' ? 'text-green-500' : 'text-slate-500'
                          }`}
                        >
                          {room.status === 'active' ? 'Veri Alınıyor' : 'Cihaz Yok'}
                        </span>
                        <ArrowRight size={16} className="text-slate-700 group-hover:text-blue-500" />
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => setIsAddRoomModal(true)}
                    className="border-2 border-dashed border-slate-800/50 p-8 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-slate-500 hover:border-blue-500/40 hover:bg-blue-500/5 hover:text-blue-400 transition-all group"
                  >
                    <div className="w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Plus size={24} />
                    </div>
                    <span className="font-black text-xs uppercase tracking-widest">Oda Ekle</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isAddHomeModal && ( <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">

          <div className="absolute inset-0 bg-[#05070a]/95 backdrop-blur-2xl" onClick={() => setIsAddHomeModal(false)} />

          <div className="relative bg-[#0b0f1a] border border-white/10 w-full max-w-xl rounded-[3.5rem] overflow-hidden shadow-2xl">

            <div className="p-10 space-y-8">

              <div className="flex justify-between items-center">

                <h3 className="text-3xl font-black text-white">Yeni Mekan</h3>
                <button onClick={() => setIsAddHomeModal(false)} className="p-3 text-slate-500 hover:text-white bg-slate-900 rounded-full"><X size={20} /></button>

              </div>

              <input value={homeName} onChange={(e) => setHomeName(e.target.value)} placeholder="Örn: Kuzey Ofisi" className="w-full bg-slate-950 border border-white/5 rounded-2xl p-5 text-white outline-none"/>
              <button onClick={handleAddHome} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3"><CheckCircle2 size={22} /> Kaydı Tamamla</button>

            </div>

          </div>

        </div> )}

        {isAddRoomModal && ( <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">

          <div className="absolute inset-0 bg-[#05070a]/95 backdrop-blur-2xl" onClick={() => setIsAddRoomModal(false)} />

          <div className="relative bg-[#0b0f1a] border border-white/10 w-full max-w-xl rounded-[3.5rem] overflow-hidden shadow-2xl">

            <div className="p-10 space-y-8">

              <div className="flex justify-between items-center">

                <h3 className="text-3xl font-black text-white">Yeni Oda</h3>
                <button onClick={() => setIsAddRoomModal(false)} className="p-3 text-slate-500 hover:text-white bg-slate-900 rounded-full"><X size={20} /></button>

              </div>

              <input value={roomName} onChange={(e) => setRoomName(e.target.value)} placeholder="Örn: Salon" className="w-full bg-slate-950 border border-white/5 rounded-2xl p-5 text-white outline-none"/>
              <button onClick={handleAddRoom} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3"><CheckCircle2 size={22} /> Kaydı Tamamla</button>

             </div>

          </div>

        </div> )}

      </main>

    </div>

  );
};

export default SpaceManager;
