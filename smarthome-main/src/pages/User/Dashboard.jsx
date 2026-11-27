import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { profile } from '../../redux/userSlice';

import Sidebar from '../../layout/Sidebar';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, BarChart, Bar, Legend } from 'recharts';
import { Thermometer, Droplets, Zap, ShieldCheck, Activity, Cpu, Wifi, Fan, Lightbulb, Play, Power, AlertTriangle, Wind, ChevronRight, Home, Clock, TrendingUp, Battery, Sun, Moon } from 'lucide-react';

const data = [

  { time: '12:00', temp: 22, power: 400, humidity: 45 },
  { time: '13:00', temp: 23, power: 450, humidity: 48 },
  { time: '14:00', temp: 24, power: 300, humidity: 50 },
  { time: '15:00', temp: 23.5, power: 500, humidity: 47 },
  { time: '16:00', temp: 25, power: 700, humidity: 52 },
  { time: '17:00', temp: 24, power: 600, humidity: 49 },
];

const Dashboard = () => {

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);

  const [isAutoMode, setIsAutoMode] = useState(true);
  const [selectedHome, setSelectedHome] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const homes = user?.user?.homes || [];

  useEffect(() => {

    if (homes.length > 0 && !selectedHome) {

      setSelectedHome(homes[0]);
    }
  }, [homes, selectedHome]);

  useEffect(() => {

    if (selectedHome?.rooms?.length > 0) {

      setSelectedRoom(selectedHome.rooms[0]);
    }
  }, [selectedHome]);

  const updateDevice = (roomId, deviceId, updates) => {

    const updatedHome = { 
      ...selectedHome, 
      rooms: selectedHome.rooms.map((room) => 
        room._id === roomId || room.id === roomId 
          ? {
              ...room, 
              devices: room.devices.map((device) => 
                device._id === deviceId || device.id === deviceId 
                  ? { ...device, ...updates } 
                  : device 
              ), 
            } 
          : room 
      ), 
    };
    setSelectedHome(updatedHome);

    const updatedRoom = updatedHome.rooms.find(
      (room) => room._id === roomId || room.id === roomId
    );

    if (updatedRoom) {
      setSelectedRoom(updatedRoom);
    }
  };

  const getDeviceIcon = (type, active) => {

    const color = (active ? 'dark:text-blue-400 text-blue-600' : 'dark:text-slate-500 text-gray-400');

    switch (type) {
      case 'light':
        return <Lightbulb size={24} className={color} />;
      case 'power':
        return <Zap size={24} className={color} />;
      case 'climate':
        return <Thermometer size={24} className={color} />;
      case 'sensor':
        return <Droplets size={24} className={color} />;
      default:
        return <Cpu size={24} className={color} />;
    }
  };

  const totalDevices = selectedRoom?.devices?.length || 0;
  const activeDevices = selectedRoom?.devices?.filter(d => d.status)?.length || 0;
  const totalPower = selectedRoom?.devices?.reduce((acc, d) => acc + (d.status ? (d.power || 50) : 0), 0) || 0;

  return (

    <div className={`flex min-h-screen transition-colors duration-300 dark:bg-slate-950 bg-gray-50`}>

      <Sidebar />

      <main className="flex-1 lg:ml-0 p-6 pb-28 lg:pb-6 overflow-x-hidden">

        <div className="max-w-[1600px] mx-auto mb-6 flex justify-between items-center">

          <div>

            <h1 className={`text-3xl font-bold  dark:text-white text-gray-900`}>Akıllı Ev Dashboard</h1>
            <p className={`text-sm mt-1 dark:text-slate-400 text-gray-600`}>Hoş geldiniz, {user?.user?.name || 'Kullanıcı'}</p>

          </div>

        </div>

        <div className="p-2 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-700">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            <div className={`p-5 rounded-2xl flex items-center gap-4 transition-all hover:scale-105 dark:bg-slate-900/50 dark:border dark:border-slate-800 bg-white border border-gray-200 shadow-lg`}>

              <div className={`p-3 rounded-xl dark:bg-blue-500/10 dark:text-blue-500 bg-blue-100 text-blue-600`}><Cpu size={24} /></div>

              <div>

                <p className={`text-xs font-bold uppercase dark:text-slate-500 text-gray-500`}>Ana Kontrolcü</p>
                <p className={`text-sm font-mono dark:text-slate-200 text-gray-900`}>Uptime: 142 Saat</p>

              </div>

            </div>

            <div className={`p-5 rounded-2xl flex items-center gap-4 transition-all hover:scale-105 dark:bg-slate-900/50 dark:border dark:border-slate-800 bg-white border border-gray-200 shadow-lg`}>

              <div className={`p-3 rounded-xl dark:bg-green-500/10 dark:text-green-500 bg-green-100 text-green-600`}><Wifi size={24} /></div>

              <div>

                <p className={`text-xs font-bold uppercase dark:text-slate-500 text-gray-500`}>Bağlantı</p>
                <p className={`text-sm font-mono dark:text-slate-200 text-gray-900`}>12ms • Aktif</p>

              </div>

            </div>

            <div className={`p-5 rounded-2xl flex items-center gap-4 transition-all hover:scale-105 dark:bg-slate-900/50 dark:border-slate-800 bg-white border border-gray-200 shadow-lg`}>

              <div className={`p-3 rounded-xl dark:bg-purple-500/10 dark:text-purple-500 bg-purple-100 text-purple-600`}><Zap size={24} /></div>

              <div>

                <p className={`text-xs font-bold uppercase dark:text-slate-500 text-gray-500`}>Toplam Güç</p>
                <p className={`text-sm font-mono dark:text-slate-200 text-gray-900`}>{totalPower}W</p>

              </div>

            </div>

            <div className={`p-5 rounded-2xl flex items-center justify-between transition-all hover:scale-105 dark:bg-slate-900/50 dark:border-slate-800 bg-white border border-gray-200 shadow-lg`}>

              <div>

                <p className={`text-xs font-bold uppercase dark:text-slate-500 text-gray-500`}>Akıllı Mod</p>
                <p className={`text-sm dark:text-slate-200 text-gray-900`}>{isAutoMode ? 'AI Aktif' : 'Manuel'}</p>

              </div>

              <button onClick={() => setIsAutoMode(!isAutoMode)} className={`w-12 h-6 rounded-full relative transition-colors ${isAutoMode ? 'bg-blue-600' : 'dark:bg-slate-700 bg-gray-300'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isAutoMode ? 'right-1' : 'left-1'}`}/>
              </button>

            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            <div className="lg:col-span-8">

              <div className={`rounded-2xl p-6 shadow-xl transition-all dark:bg-slate-900 dark:border-slate-800 bg-white border border-gray-200`}>

                <div className="flex justify-between items-center mb-6">

                  <h3 className={`font-bold flex items-center gap-2 dark:text-slate-200 text-gray-900`}><Activity size={18} className="text-blue-500" />Enerji Tüketim Analizi</h3>

                  <div className="flex gap-2">

                    <span className={`px-3 py-1 rounded-lg text-xs dark:bg-slate-800 dark:text-slate-300 bg-gray-100 text-gray-700`}>Son 6 Saat</span>

                  </div>

                </div>

                <div className="h-[300px] w-full">

                  <ResponsiveContainer width="100%" height="100%">

                    <AreaChart data={data}>

                      <defs>

                        <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">

                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />

                        </linearGradient>

                      </defs>

                      <CartesianGrid strokeDasharray="3 3" stroke={'#1e293b'} vertical={false} />
                      <XAxis dataKey="time" stroke={'#64748b'} />
                      <YAxis stroke={'#64748b'} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: `1px solid #334155`, borderRadius: '8px', color: '#e2e8f0'}}/>
                      <Area type="monotone" dataKey="power" stroke="#3b82f6" fill="url(#colorPower)" strokeWidth={3}/>

                    </AreaChart>

                  </ResponsiveContainer>

                </div>

              </div>

            </div>

            <div className="lg:col-span-4 space-y-4">

              <div className={`rounded-2xl p-6 shadow-xl transition-all dark:bg-slate-900 dark:border-slate-800 bg-white border border-gray-200`}>

                <div className="flex items-center gap-3 mb-4">

                  <div className={`p-2 rounded-lg dark:bg-orange-500/10 dark:text-orange-500 bg-orange-100 text-orange-600`}><Thermometer size={20} /></div>
                  <h4 className={`font-semibold dark:text-slate-200 text-gray-900`}>Sıcaklık</h4>

                </div>

                <p className={`text-3xl font-bold dark:text-white text-gray-900`}>24°C</p>
                <p className={`text-xs mt-1 dark:text-slate-400 text-gray-600`}>Optimum Seviye</p>

              </div>

              <div className={`rounded-2xl p-6 shadow-xl transition-all dark:bg-slate-900 dark:border-slate-800 bg-white border border-gray-200`}>

                <div className="flex items-center gap-3 mb-4">

                  <div className={`p-2 rounded-lg dark:bg-cyan-500/10 dark:text-cyan-500 bg-cyan-100 text-cyan-600`}><Droplets size={20} /></div>
                  <h4 className={`font-semibold dark:text-slate-200 text-gray-900`}>Nem</h4>

                </div>

                <p className={`text-3xl font-bold dark:text-white text-gray-900`}>48%</p>
                <p className={`text-xs mt-1 dark:text-slate-400 text-gray-600`}>İdeal Aralık</p>

              </div>

              <div className={`rounded-2xl p-6 shadow-xl transition-all dark:bg-slate-900 dark:border-slate-800 bg-white border border-gray-200`}>

                <div className="flex items-center gap-3 mb-4">

                  <div className={`p-2 rounded-lg dark:bg-green-500/10 dark:text-green-500 bg-green-100 text-green-600`}>
                    <Activity size={20} />
                  </div>
                  <h4 className={`font-semibold dark:text-slate-200 text-gray-900`}>Aktif Cihazlar</h4>

                </div>

                <p className={`text-3xl font-bold dark:text-white text-gray-900`}>{activeDevices}/{totalDevices}</p>
                <p className={`text-xs mt-1 dark:text-slate-400 text-gray-600`}>Cihaz Çalışıyor</p>

              </div>

            </div>

          </div>

        </div>

        <div className="my-10 max-w-[1600px] mx-auto space-y-8">

          <div className="flex flex-col lg:flex-row justify-between gap-6">

            <div className={`flex items-center gap-2 text-sm dark:text-slate-500 text-gray-600`}>

              <Home size={16} />
              <span>Evlerim</span>
              <ChevronRight size={14} />
              <span className={`dark:text-slate-300 text-gray-900`}>{selectedHome?.name || 'Seçilmedi'}</span>

            </div>

            <div className={`flex p-1.5 rounded-2xl gap-2 dark:bg-slate-900/50 dark:border-white/5 bg-white border border-gray-200 shadow-md`}>

              {homes.map((home) => ( <button key={home._id} onClick={() => setSelectedHome(home)} className={`px-6 py-2 rounded-xl transition-all ${selectedHome?._id === home._id ? 'bg-blue-600 text-white shadow-lg' : 'dark:text-slate-400 dark:hover:text-slate-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                {home.name}
              </button> ))}

            </div>

          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">

            {selectedHome?.rooms?.map((room) => ( <button key={room._id} onClick={() => setSelectedRoom(room)} className={`px-5 py-2.5 rounded-xl whitespace-nowrap transition-all ${selectedRoom?._id === room._id ? 'dark:bg-white dark:text-black bg-blue-600 text-white shadow-xl' : 'dark:text-slate-400 dark:border-slate-700 dark:hover:border-slate-600 text-gray-700 border border-gray-300 hover:border-gray-400 bg-white'}`}>
              {room.name}
            </button> ))}

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

            {selectedRoom?.devices?.map((device) => ( <div key={device._id} className={`p-6 rounded-3xl transition-all hover:scale-105 dark:bg-slate-900 border dark:border-slate-800 bg-white border-gray-200 shadow-lg'`}>

              <div className="mb-4">{getDeviceIcon(device.type, device.status)}</div>
              <h3 className={`text-lg font-bold mb-1 dark:text-white text-gray-900`}>{device.name}</h3>
              <p className={`text-xs mb-4 dark:text-slate-500 text-gray-500`}>{device.status ? 'Açık' : 'Kapalı'} • {device.type}</p>

              <button onClick={() => updateDevice(selectedRoom._id, device._id, {status: !device.status})} className={`w-full py-3 rounded-xl font-medium transition-all ${device.status ? 'dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white bg-blue-600 hover:bg-blue-700 text-white shadow-md' : 'dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 bg-gray-200 hover:bg-gray-300 text-gray-700'}`}>
                {device.status ? 'Kapat' : 'Aç'}
              </button>

            </div> ))}

          </div>

          {selectedRoom?.devices?.length === 0 && ( <div className={`text-center py-16 rounded-2xl dark:bg-slate-900/50 dark:border dark:border-slate-800 bg-white border border-gray-200`}>

            <Cpu size={48} className={`dark:text-slate-700 text-gray-300 mx-auto mb-4`} />
            <p className={`text-lg font-semibold dark:text-slate-400 text-gray-600`}>Bu odada henüz cihaz bulunmuyor</p>

          </div> )}

        </div>

      </main>

    </div>
  );
};

export default Dashboard;
