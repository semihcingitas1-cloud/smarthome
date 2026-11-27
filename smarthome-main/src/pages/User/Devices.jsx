import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../../layout/Sidebar';
import { getMyDevices, startPairingAction, resetPairingStatus, completePairing, updateDevice, deleteDevice, toggleRelay } from '../../redux/devicesSlice';
import { profile } from '../../redux/userSlice';
import { Plus, Search, Sliders, Wifi, MoreVertical, Power, Thermometer, Droplets, AlertTriangle, CheckCircle2, Activity, SignalHigh, SignalMedium, SignalLow, Droplet, Gauge, BatteryFull, BatteryMedium, BatteryLow, Trash2, RefreshCw, X, Save, Zap, ArrowLeft, ArrowRight, Cpu, Plug, ChevronUp, ChevronDown, Minus, Bluetooth, Check, Sparkles, Shield, Info, Loader2 } from 'lucide-react';

const Devices = () => {

  const dispatch = useDispatch();

  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [deviceName, setDeviceName] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedHome, setSelectedHome] = useState(null);
  const [bleScanning, setBleScanning] = useState(false);
  const [bleDeviceFound, setBleDeviceFound] = useState(false);
  const [bleDeviceId, setBleDeviceId] = useState('');
  const [foundDevices, setFoundDevices] = useState([]);
  const [editName, setEditName] = useState('');
  const [editLocation, setEditLocation] = useState('');

  const { user } = useSelector(state => state.user);
  const { devices, loading } = useSelector(state => state.devices);

  useEffect(() => {

    dispatch(getMyDevices());
  }, [dispatch]);

  useEffect(() => {

    if (bleScanning) {

      setTimeout(() => {

        setFoundDevices([

          { id: 'ESP32-ECO-A1B2', name: 'ESP32-ECO-A1B2', signal: -45, distance: 'Çok Yakın', rssi: 95 },
          { id: 'ESP32-ECO-C3D4', name: 'ESP32-ECO-C3D4', signal: -62, distance: 'Yakın', rssi: 75 },
          { id: 'ESP32-ECO-E5F6', name: 'ESP32-ECO-E5F6', signal: -78, distance: 'Orta', rssi: 50 },
          { id: 'ESP32-ECO-G7H8', name: 'ESP32-ECO-G7H8', signal: -88, distance: 'Uzak', rssi: 25 },
        ]);
        setBleScanning(false);
      }, 2500);
    }
  }, [bleScanning]);

  const filteredDevices = useMemo(() => {

    if (!devices) return [];

    return devices.filter(device => {

      const matchesFilter = filter === 'all' || device.data?.status === filter;
      const matchesSearch = device.name?.toLowerCase().includes(searchQuery.toLowerCase()) || (device.roomId?.name && device.roomId.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchQuery, devices]);

  const getDeviceIcon = (type) => {

    switch (type) {

      case 'Gateway': return <Wifi size={24} />;
      case 'Sensör': return <Droplets size={24} />;
      case 'İklimlendirme': return <Thermometer size={24} />;
      case 'Güvenlik': return <Activity size={24} />;
      case 'Perde': return <ChevronUp size={24} />;
      case 'Güç': return <Zap size={24} />;
      default: return <AlertTriangle size={24} />;
    }
  };

  const getSignalIcon = (signal) => {

    if (signal === 'Güçlü') return <SignalHigh size={16} className="text-green-500" />;
    if (signal === 'Orta') return <SignalMedium size={16} className="text-yellow-500" />;
    return <SignalLow size={16} className="text-red-500" />;
  };

  const getBatteryIcon = (battery) => {

    if (battery === 'Güçlü') return <BatteryFull size={16} className="text-green-500" />;
    if (battery === 'Orta') return <BatteryMedium size={16} className="text-yellow-500" />;
    if (battery === 'AC') return <Plug size={16} className="text-yellow-500" />;
    return <BatteryLow size={16} className="text-red-500" />;
  };

  const getRoomName = (roomId) => {

    if (!user?.user?.homes) return 'Bilinmeyen Oda';
    for (const home of user.user.homes) {

      const room = home.rooms?.find(r => r._id === roomId);
      if (room) return room.name;
    }
    return 'Bilinmeyen Oda';
  };

  const handleCompletePairing = () => {

    if (!bleDeviceId || !deviceName || !selectedHome || !selectedRoom) {

      console.error("Eksik bilgiler!");
      return;
    }

    const payload = {

      homeId: selectedHome,
      roomId: selectedRoom,
      name: deviceName,
      type: 'Güç',
      serialNumber: bleDeviceId,
    };

    dispatch(completePairing(payload))
    .unwrap()
    .then((result) => {

      console.log("Cihaz başarıyla eklendi:", result);
      onClose();
      dispatch(getMyDevices());
    })
    .catch((err) => {

      console.error("Eşleştirme hatası:", err);
    });
  };

  const handleUpdate = async () => {

    try {

      await dispatch(updateDevice({

        id: selectedDevice._id,
        data: {
          name: editName,
          roomId: editLocation,
        }
      })).unwrap();
      setIsModalOpen(false);
      dispatch(getMyDevices());
    } catch (error) {

      console.error("Güncelleme hatası:", error);
    }
  };

  const handleDelete = (deviceId) => {

    if (window.confirm("Bu cihazı silmek istediğinize emin misiniz?")) {

      dispatch(deleteDevice(deviceId));
    }
  };

  const onClose = () => {

    setIsAddModalOpen(false);
    setStep(1);
    setDeviceName('');
    setSelectedRoom(null);
    setSelectedHome(null);
    setBleScanning(false);
    setBleDeviceFound(false);
    setBleDeviceId('');
    setFoundDevices([]);
  };

  const handleOpenSettings = (device) => {

    setSelectedDevice(device);
    setEditName(device.name || '');
    setEditLocation(device.roomId?._id || '');
    setIsModalOpen(true);
  };

  const handleSendCommand = (device) => {

    const currentState = device?.data?.relayState;
    const newAction = currentState === 'on' ? 'off' : 'on';
    dispatch(toggleRelay({ serialNumber: device.serialNumber, action: newAction }));
  };

  const handleCurtainControl = (device, action) => {

    dispatch(toggleRelay({ serialNumber: device.serialNumber, action: action }));
  };

  const RelayCard = ({ device }) => (

    <div className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-950 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/10">
      
      <div className="flex justify-between items-start mb-6">

        <div className={`p-4 rounded-2xl shadow-inner transition-all duration-300 ${device?.data?.relayState === 'on' ? 'bg-blue-500/20 text-blue-500 shadow-blue-500/50' : 'bg-gray-100 dark:bg-slate-800/50 text-gray-400 dark:text-slate-500'}`}><Zap size={28} className={device?.data?.relayState === 'on' ? 'animate-pulse' : ''} /></div>

        <div className="relative">

          <button onClick={() => setActiveMenu(activeMenu === device._id ? null : device._id)} className="p-2 text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-all">
            <MoreVertical size={20} />
          </button>

          {activeMenu === device._id && ( <div>

            <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />

            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-2xl z-20 py-2">

              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors">
                <RefreshCw size={14} /> Yeniden Başlat
              </button>

              <button onClick={() => handleDelete(device._id)} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                <Trash2 size={14} /> Cihazı Sil
              </button>

            </div>

          </div> )}

        </div>

      </div>

      <div className="mb-6">

        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors line-clamp-1">{device.name}</h3>
        <p className="text-sm text-gray-500 dark:text-slate-500 mt-1 font-medium">{getRoomName(device.roomId)} • {device.version}</p>

      </div>

      <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-950/50 rounded-2xl border border-gray-200 dark:border-slate-800/50">

        <div className="flex items-center justify-between mb-2">

          <span className="text-xs text-gray-500 dark:text-slate-500 uppercase font-bold">Durum</span>
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${device?.data?.relayState === 'on' ? 'bg-blue-500/20 text-blue-500' : 'bg-gray-200 dark:bg-slate-800 text-gray-500 dark:text-slate-500'}`}>{device?.data?.relayState === 'on' ? 'AÇIK' : 'KAPALI'}</div>

        </div>

        <div className="flex items-center gap-2">

          <div className={`w-2 h-2 rounded-full ${device?.data?.relayState === 'on' ? 'bg-blue-500 animate-pulse shadow-lg shadow-blue-500/50' : 'bg-gray-400 dark:bg-slate-600'}`}></div>

          <div className="flex-1 h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">

            <div className={`h-full transition-all duration-500 ${device?.data?.relayState === 'on' ? 'w-full bg-gradient-to-r from-blue-500 to-cyan-400' : 'w-0'}`}></div>

          </div>

          <span className="text-xs text-gray-500 dark:text-slate-500 font-mono">{device?.data?.uptime ? `${Math.floor(device.data.uptime / 3600)}h` : '--'}</span>

        </div>

      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">

        <div className="bg-gray-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-gray-200 dark:border-slate-800/50">

          <div className="flex items-center gap-2 mb-1">

            <Wifi size={14} className="text-green-500" />
            <p className="text-[10px] text-gray-500 dark:text-slate-500 uppercase font-bold">Sinyal</p>

          </div>

          <p className="text-sm font-bold text-gray-900 dark:text-slate-200">{device?.data?.signal || 'Güçlü'}</p>

        </div>

        <div className="bg-gray-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-gray-200 dark:border-slate-800/50">

          <div className="flex items-center gap-2 mb-1">

            <Plug size={14} className="text-yellow-500" />
            <p className="text-[10px] text-gray-500 dark:text-slate-500 uppercase font-bold">Güç</p>

          </div>

          <p className="text-sm font-bold text-gray-900 dark:text-slate-200">AC</p>

        </div>

      </div>

      <div className="flex gap-3">

        <button onClick={() => handleOpenSettings(device)} className="flex-1 bg-white dark:bg-white/[0.03] hover:bg-gray-50 dark:hover:bg-white/[0.08] text-gray-900 dark:text-white py-3 rounded-2xl text-xs font-bold border border-gray-200 dark:border-white/5 transition-all flex items-center justify-center gap-2">
          <Sliders size={14} /> Ayarlar
        </button>

        <button onClick={() => handleSendCommand(device)} className={`p-3 rounded-2xl transition-all transform hover:scale-105 ${device?.data?.relayState === 'on' ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/50' : 'bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-slate-500 border border-gray-300 dark:border-slate-700 hover:bg-gray-300 dark:hover:bg-slate-700'}`}>
          <Power size={20} />
        </button>

      </div>

    </div>
  );

  const CurtainCard = ({ device }) => {

    const position = device?.data?.position || 0;

    return (

      <div className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-950 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/10">
        
        <div className="flex justify-between items-start mb-6">

          <div className="p-4 rounded-2xl shadow-inner bg-purple-500/10 text-purple-500"><ChevronUp size={28} className={device?.data?.moving ? 'animate-bounce' : ''} /></div>

          <div className="relative">

            <button onClick={() => setActiveMenu(activeMenu === device._id ? null : device._id)} className="p-2 text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-all">
              <MoreVertical size={20} />
            </button>

            {activeMenu === device._id && ( <div>

              <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)}></div>

              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-2xl z-20 py-2">

                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors">
                  <RefreshCw size={14} /> Kalibrasyon
                </button>

                <button onClick={() => handleDelete(device._id)} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                  <Trash2 size={14} /> Cihazı Sil
                </button>

              </div>

            </div> )}

          </div>

        </div>

        <div className="mb-6">

          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors line-clamp-1">{device.name}</h3>
          <p className="text-sm text-gray-500 dark:text-slate-500 mt-1 font-medium">{getRoomName(device.roomId)} • {device.version}</p>

        </div>

        <div className="mb-6 p-6 bg-gray-50 dark:bg-slate-950/50 rounded-2xl border border-gray-200 dark:border-slate-800/50 relative overflow-hidden">

          <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent transition-all duration-700" style={{ height: `${position}%` }}></div>

          <div className="relative">

            <div className="flex items-center justify-between mb-3">

              <span className="text-xs text-gray-500 dark:text-slate-500 uppercase font-bold">Pozisyon</span>
              {device?.data?.calibrated ? ( <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-green-500/20 text-green-500">KALİBRE</span> ) : ( <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-yellow-500/20 text-yellow-500">KALİBRASYON GEREKLİ</span> )}

            </div>

            <div className="relative h-32 bg-gray-200 dark:bg-slate-800/50 rounded-xl overflow-hidden mb-4">

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-500 to-purple-300 transition-all duration-700" style={{ height: `${position}%` }}></div>

              <div className="absolute inset-0 flex items-center justify-center">

                <span className="text-4xl font-bold text-gray-900 dark:text-white drop-shadow-lg">%{position}</span>

              </div>

            </div>

            <div className="flex justify-between text-xs text-gray-500 dark:text-slate-500">

              <span>Kapalı</span>
              <span>Açık</span>

            </div>

          </div>

        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">

          <div className="bg-gray-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-gray-200 dark:border-slate-800/50">

            <div className="flex items-center gap-2 mb-1">

              <Wifi size={14} className="text-green-500" />
              <p className="text-[10px] text-gray-500 dark:text-slate-500 uppercase font-bold">Sinyal</p>

            </div>

            <p className="text-sm font-bold text-gray-900 dark:text-slate-200">{device?.data?.signal || 'Güçlü'}</p>

          </div>

          <div className="bg-gray-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-gray-200 dark:border-slate-800/50">

            <div className="flex items-center gap-2 mb-1">

              <Zap size={14} className={device?.data?.moving ? 'text-yellow-500 animate-pulse' : 'text-gray-400 dark:text-slate-500'} />
              <p className="text-[10px] text-gray-500 dark:text-slate-500 uppercase font-bold">Durum</p>

            </div>

            <p className="text-sm font-bold text-gray-900 dark:text-slate-200">{device?.data?.moving ? 'Hareket' : 'Sabit'}</p>

          </div>

        </div>

        <div className="space-y-3">

          <div className="grid grid-cols-3 gap-2">

            <button onClick={() => handleCurtainControl(device, 'close')} className="bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 text-gray-900 dark:text-white p-3 rounded-xl text-xs font-bold border border-gray-300 dark:border-slate-700 transition-all flex items-center justify-center gap-1">
              <ChevronDown size={14} /> Kapat
            </button>

            <button onClick={() => handleCurtainControl(device, 'stop')} className="bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 p-3 rounded-xl text-xs font-bold border border-yellow-500/20 transition-all flex items-center justify-center gap-1">
              <Minus size={14} /> Dur
            </button>

            <button onClick={() => handleCurtainControl(device, 'open')} className="bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-xl text-xs font-bold border border-purple-500 transition-all flex items-center justify-center gap-1">
              <ChevronUp size={14} /> Aç
            </button>

          </div>

          <button onClick={() => handleOpenSettings(device)} className="w-full bg-white dark:bg-white/[0.03] hover:bg-gray-50 dark:hover:bg-white/[0.08] text-gray-900 dark:text-white py-3 rounded-2xl text-xs font-bold border border-gray-200 dark:border-white/5 transition-all flex items-center justify-center gap-2">
            <Sliders size={14} /> Ayarlar
          </button>

        </div>

      </div>
    );
  };

  const SensorCard = ({ device }) => {

    const temperature = device?.data?.temperature || 0;
    const humidity = device?.data?.humidity || 0;
    const waterLeak = device?.data?.waterLeak || false;

    return (

      <div className={`group relative bg-gradient-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-950 border rounded-3xl p-6 transition-all duration-300 shadow-lg hover:shadow-xl ${waterLeak ? 'border-red-500/50 hover:border-red-500 shadow-red-500/20' : 'border-gray-200 dark:border-slate-800 hover:border-cyan-500/50 hover:shadow-cyan-500/10'}`}>
        
        <div className="flex justify-between items-start mb-6">

          <div className={`p-4 rounded-2xl shadow-inner ${waterLeak ? 'bg-red-500/20 text-red-500' : 'bg-cyan-500/10 text-cyan-500'}`}>
            {waterLeak ? <AlertTriangle size={28} className="animate-pulse" /> : <Droplet size={28} />}
          </div>

          <div className="relative">

            <button onClick={() => setActiveMenu(activeMenu === device._id ? null : device._id)} className="p-2 text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-all">
              <MoreVertical size={20} />
            </button>

            {activeMenu === device._id && ( <div>

              <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)}/>

              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-2xl z-20 py-2">

                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors">
                  <RefreshCw size={14} /> Yeniden Başlat
                </button>

                <button onClick={() => handleDelete(device._id)} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                  <Trash2 size={14} /> Cihazı Sil
                </button>

              </div>

            </div> )}

          </div>

        </div>

        <div className="mb-6">

          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors line-clamp-1">{device.name}</h3>
          <p className="text-sm text-gray-500 dark:text-slate-500 mt-1 font-medium">{getRoomName(device.roomId)} • {device.version}</p>

        </div>

        {waterLeak && ( <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">

          <div className="flex items-center gap-3">

            <AlertTriangle size={20} className="text-red-500 animate-pulse" />

            <div>

              <p className="text-sm font-bold text-red-500">SU KAÇAĞI TESPİT EDİLDİ!</p>
              <p className="text-xs text-red-400/70">Lütfen kontrol edin</p>

            </div>

          </div>

        </div> )}

        <div className="grid grid-cols-2 gap-3 mb-6">

          <div className="bg-gray-50 dark:bg-slate-950/50 p-4 rounded-3xl border border-gray-200 dark:border-slate-800/50 relative overflow-hidden">

            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 transition-all duration-700" style={{width: `${Math.min((temperature / 50 * 100), 100)}%`}}></div>

            <div className="relative">

              <div className="flex items-center gap-2 mb-2">

                <Thermometer size={16} className="text-orange-500" />
                <p className="text-[10px] text-gray-500 dark:text-slate-500 uppercase font-bold">Sıcaklık</p>

              </div>

              <p className="text-3xl font-bold text-gray-900 dark:text-slate-200 mb-2">{temperature}°C</p>

              <div className="h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-500" style={{width: `${Math.min((temperature / 50 * 100), 100)}%`}}></div>
              </div>

              <p className="text-[10px] text-gray-500 dark:text-slate-600 mt-1">{temperature < 15 ? 'Soğuk' : temperature < 25 ? 'Normal' : 'Sıcak'}</p>

            </div>

          </div>

          <div className="bg-gray-50 dark:bg-slate-950/50 p-4 rounded-3xl border border-gray-200 dark:border-slate-800/50 relative overflow-hidden">

            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 transition-all duration-700" style={{width: `${humidity}%`}}></div>

            <div className="relative">

              <div className="flex items-center gap-2 mb-2">

                <Droplet size={16} className="text-blue-500" />
                <p className="text-[10px] text-gray-500 dark:text-slate-500 uppercase font-bold">Nem</p>

              </div>

              <p className="text-3xl font-bold text-gray-900 dark:text-slate-200 mb-2">%{humidity}</p>

              <div className="h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">

                <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 transition-all duration-500" style={{width: `${humidity}%`}}></div>

              </div>

              <p className="text-[10px] text-gray-500 dark:text-slate-600 mt-1">{humidity < 30 ? 'Kuru' : humidity < 60 ? 'Normal' : 'Nemli'}</p>

            </div>

          </div>

        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">

          <div className="bg-gray-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-gray-200 dark:border-slate-800/50">

            <div className="flex items-center gap-2 mb-1">

              <Wifi size={14} className="text-green-500" />
              <p className="text-[10px] text-gray-500 dark:text-slate-500 uppercase font-bold">Sinyal</p>

            </div>

            <p className="text-sm font-bold text-gray-900 dark:text-slate-200">{device?.data?.signal || 'Güçlü'}</p>

          </div>

          <div className="bg-gray-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-gray-200 dark:border-slate-800/50">

            <div className="flex items-center gap-2 mb-1">

              {getBatteryIcon(device?.battery ? device.battery > 80 ? 'Güçlü' : device.battery > 30 ? 'Orta' : 'Zayıf' : 'AC')}
              <p className="text-[10px] text-gray-500 dark:text-slate-500 uppercase font-bold">Batarya</p>

            </div>

            <p className="text-sm font-bold text-gray-900 dark:text-slate-200">{device?.battery ? `%${device.battery}` : 'Güçlü'}</p>

          </div>

        </div>

        <button onClick={() => handleOpenSettings(device)} className="w-full bg-white dark:bg-white/[0.03] hover:bg-gray-50 dark:hover:bg-white/[0.08] text-gray-900 dark:text-white py-3 rounded-2xl text-xs font-bold border border-gray-200 dark:border-white/5 transition-all flex items-center justify-center gap-2">
          <Sliders size={14} /> Ayarlar
        </button>

      </div>
    );
  };

  const renderDeviceCard = (device) => {

    if (device.type === 'Sensör') {

      return <SensorCard key={device._id} device={device} />;
    } else if (device.type === 'Perde' || device.type === 'stepmotor') {

      return <CurtainCard key={device._id} device={device} />;
    } else {

      return <RelayCard key={device._id} device={device} />;
    }
  };

  return (

    <div className="flex bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">

      <Sidebar />

      <main className="flex-1 lg:ml-0 overflow-x-hidden">

        <div className="p-6 space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto relative">
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">

            <div className="space-y-2">

              <div className="inline-flex items-center gap-2 bg-blue-500/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-blue-500/20 mb-2">

                <Sparkles size={14} className="text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Cihaz Yönetimi</span>

              </div>

              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Cihazlarınız</h2>
              <p className="text-gray-600 dark:text-slate-400">Sistem genelinde <span className="text-blue-600 dark:text-blue-400 font-semibold">{devices.length}</span> cihaz tanımlı.</p>

            </div>

            <div className="flex flex-wrap gap-3">

              <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 px-4 py-2 rounded-2xl shadow-sm">

                <p className="text-[10px] text-gray-500 dark:text-slate-500 uppercase font-bold">Çalışıyor</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-500">{devices.filter(d => d?.data?.status === 'online').length}</p>

              </div>

              <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 px-4 py-2 rounded-2xl shadow-sm">

                <p className="text-[10px] text-gray-500 dark:text-slate-500 uppercase font-bold">Kritik</p>
                <p className="text-lg font-bold text-yellow-600 dark:text-yellow-500">{devices.filter(d => d?.data?.status === 'warning').length}</p>

              </div>

            </div>

          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900/30 p-4 rounded-3xl border border-gray-200 dark:border-slate-800/50 shadow-sm">

            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">

              {['all', 'online', 'warning', 'offline'].map((f) => ( <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all whitespace-nowrap ${filter === f ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-gray-600 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-800'}`}>
                {f === 'all' ? 'Tümü' : f}
              </button> ))}

            </div>

            <div className="flex gap-2 w-full md:w-auto">

              <div className="relative flex-1 md:w-64">

                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" size={18} />
                <input type="text" placeholder="Cihaz ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"/>

              </div>

              <button onClick={() => setIsAddModalOpen(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-2.5 rounded-2xl shadow-lg shadow-blue-600/30 active:scale-95 transition-all">
                <Plus size={22} />
              </button>

            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{filteredDevices.map((device) => renderDeviceCard(device))}</div>

          {isModalOpen && selectedDevice && ( <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            <div className="absolute inset-0 bg-gray-900/80 dark:bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>

            <div className="relative bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">

              <div className="flex justify-between items-center p-8 border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50">

                <div className="flex items-center gap-4">

                  <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-500 rounded-2xl">{getDeviceIcon(selectedDevice.type)}</div>

                  <div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Cihaz Ayarları</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-500">ID: #{selectedDevice._id}</p>

                  </div>

                </div>

                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-slate-800 rounded-full transition-all">
                  <X size={20} />
                </button>

              </div>

              <div className="p-8 space-y-6">

                <div className="space-y-2">

                  <label className="text-xs font-bold text-gray-600 dark:text-slate-500 uppercase ml-1">Cihaz Adı</label>
                  <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded-2xl p-4 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all"/>

                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">

                    <label className="text-xs font-bold text-gray-600 dark:text-slate-500 uppercase ml-1">Konum</label>

                    <select value={editLocation} onChange={(e) => setEditLocation(e.target.value)} className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded-2xl p-4 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 appearance-none">

                      {user?.user?.homes?.[0]?.rooms?.length > 0 ? ( user.user.homes[0].rooms.map((room) => ( <option key={room._id} value={room._id}>{room.name}</option> )) ) : ( <option value="">Henüz bir oda tanımlanmamış.</option> )}

                    </select>

                  </div>

                  <div className="space-y-2">

                    <label className="text-xs font-bold text-gray-600 dark:text-slate-500 uppercase ml-1">Versiyon</label>
                    <div className="w-full bg-gray-50 dark:bg-slate-950/50 border border-gray-300 dark:border-slate-800 rounded-2xl p-4 text-gray-600 dark:text-slate-400">{selectedDevice.version}</div>

                  </div>

                </div>

                <div className="bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/10 p-4 rounded-2xl flex items-start gap-3">

                  <Activity size={18} className="text-blue-600 dark:text-blue-500 mt-0.5" />

                  <div>

                    <p className="text-sm text-blue-900 dark:text-blue-200 font-medium">Son Görülme</p>
                    <p className="text-xs text-blue-700 dark:text-blue-400/70">{selectedDevice.lastSeen} ağa bağlandı.</p>

                  </div>

                </div>

              </div>

              <div className="p-8 border-t border-gray-200 dark:border-slate-800 flex gap-4">

                <button onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-4 rounded-2xl text-sm font-bold text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all">
                  İptal
                </button>

                <button onClick={handleUpdate} className="flex-2 flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all shadow-lg shadow-blue-600/30">
                  <Save size={18} /> Değişiklikleri Kaydet
                </button>

              </div>

            </div>

          </div> )}

          {isAddModalOpen && ( <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

            <div className="absolute inset-0 bg-gray-900/90 dark:bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose}/>
              
            <div className="relative bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-200 dark:bg-slate-800/50">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out" style={{ width: `${(step / 3) * 100}%` }}/>
              </div>

              <div className="p-8 pb-4 flex justify-between items-center">

                <div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Yeni Cihaz Ekle</h3>
                  <p className="text-gray-500 dark:text-slate-500 text-sm font-medium">Aşama {step} / 3</p>

                </div>

                <button onClick={onClose} className="p-2.5 text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-slate-800/50 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-full transition-all">
                  <X size={20} />
                </button>

              </div>
                
              <div className="p-8 pt-4 min-h-[420px]">

                {step === 1 && ( <div className="flex flex-col items-center justify-center text-center space-y-8 py-10 animate-in slide-in-from-right-8 duration-300">

                  <div className="relative">

                    <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-10" />
                    <div className="absolute inset-0 bg-orange-400 rounded-full animate-pulse opacity-20" />
                    <div className="relative bg-gradient-to-br from-orange-600 to-orange-700 p-10 rounded-3xl shadow-2xl shadow-orange-900/40 text-white"><AlertTriangle size={56} /></div>

                  </div>
                  
                  <div className="max-w-md space-y-4">

                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Cihazı Hazırlayın</h4>
                    
                    <div className="bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 text-left">

                      <div className="flex items-start gap-4">

                        <p className="text-xs text-gray-600 dark:text-slate-400">Cihazın üzerindeki LED yanıp sönüyorsa cihaz eşleşme modundadır. Değilse, cihazın üzerindeki eşleme butonuna 5sn basılı tutun.</p>

                      </div>

                    </div>

                    <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 rounded-2xl p-4">

                      <div className="flex items-center gap-3">

                        <AlertTriangle size={18} className="text-orange-600 dark:text-orange-400" />
                        <p className="text-xs text-orange-900 dark:text-orange-400 text-left"><span className="font-bold">Önemli:</span> Cihazınızın Bluetooth özelliğinin açık olduğundan emin olun</p>

                      </div>

                    </div>

                  </div>

                </div> )}

                {step === 2 && ( <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">

                  <div className="flex flex-col items-center text-center space-y-4">

                    <div className="relative">

                      <div className={`absolute inset-0 rounded-full ${bleScanning ? 'bg-blue-500 animate-ping opacity-10' : 'bg-green-500 animate-pulse opacity-20'}`}></div>
                      <div className={`relative p-8 rounded-3xl shadow-2xl ${bleScanning ? 'bg-gradient-to-br from-blue-600 to-blue-700 shadow-blue-900/40' : 'bg-gradient-to-br from-green-600 to-green-700 shadow-green-900/40'} text-white`}><Bluetooth size={48} className={bleScanning ? 'animate-pulse' : ''} /></div>

                    </div>

                    <div>

                      <h4 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">{bleScanning ? 'Cihazlar Aranıyor...' : 'Cihazlar Bulundu'}</h4>
                      <p className="text-sm text-gray-600 dark:text-slate-400">{bleScanning ? 'Yakındaki ESP32 cihazları taranıyor' : 'Listeden cihazınızı seçin'}</p>

                    </div>

                  </div>

                  {bleScanning && ( <div className="flex items-center justify-center gap-2 py-4">

                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>

                  </div> )}

                  {!bleScanning && foundDevices.length > 0 && ( <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">

                    {foundDevices.map((device) => ( <button key={device.id} onClick={() => { setBleDeviceFound(true); setBleDeviceId(device.id); }} className={`w-full p-4 rounded-2xl border-2 text-left transition-all group hover:scale-[1.02] ${bleDeviceId === device.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 shadow-lg shadow-blue-500/20' : 'border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950/50 hover:border-gray-300 dark:hover:border-slate-700'}`}>

                      <div className="flex items-center justify-between">

                        <div className="flex items-center gap-3">

                          <div className={`p-2.5 rounded-xl ${bleDeviceId === device.id ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' : 'bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-slate-400 group-hover:text-gray-700 dark:group-hover:text-slate-300'}`}>
                            <Cpu size={20} />
                          </div>
                          
                          <div>
 
                            <p className={`font-mono text-sm font-bold ${bleDeviceId === device.id ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-slate-300'}`}>{device.name}</p>
                            <p className="text-xs text-gray-500 dark:text-slate-500 mt-0.5">Sinyal: {device.signal} dBm • {device.distance}</p>

                          </div>

                        </div>

                        {bleDeviceId === device.id && ( <div className="p-1.5 bg-blue-500/20 rounded-lg animate-in zoom-in-95 duration-200"><Check size={16} className="text-blue-600 dark:text-blue-400" /></div> )}

                      </div>
                      
                      <div className="mt-3 flex items-center gap-1">

                        {[1, 2, 3, 4, 5].map((bar) => ( <div key={bar} className={`flex-1 h-1.5 rounded-full transition-all ${device.rssi >= bar * 20 ? device.rssi >= 80 ? 'bg-green-500' : device.rssi >= 60 ? 'bg-yellow-500' : device.rssi >= 40 ? 'bg-orange-500' : 'bg-red-500' : 'bg-gray-200 dark:bg-slate-800'}`}/> ))}

                      </div>

                    </button> ))}

                  </div> )}

                  {!bleScanning && foundDevices.length === 0 && ( <div className="text-center py-8">

                    <div className="p-6 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl inline-flex flex-col items-center gap-3">

                      <AlertTriangle size={32} className="text-yellow-500" />

                      <div>

                        <p className="text-sm font-bold text-gray-700 dark:text-slate-300">Cihaz Bulunamadı</p>
                        <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">BOOT butonuna bastığınızdan emin olun</p>

                      </div>

                      <button onClick={() => setBleScanning(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2">
                        <RefreshCw size={14} /> Yeniden Tara
                      </button>

                    </div>

                  </div> )}

                </div> )}

                {step === 3 && ( <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-500">

                  <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-2xl p-4">

                    <div className="flex items-center gap-3">

                      <div className="p-2 bg-green-500/20 rounded-lg"><Check size={20} className="text-green-600 dark:text-green-400" /></div>

                      <div className="flex-1">

                        <p className="text-sm font-bold text-green-900 dark:text-green-400">Cihaz Bağlandı</p>
                        <p className="text-xs text-green-700 dark:text-slate-400 font-mono">{bleDeviceId}</p>

                      </div>

                    </div>

                  </div>

                  <div className="space-y-5">

                    <div className="space-y-2 group">

                      <label className="text-[10px] font-bold text-gray-600 dark:text-slate-500 uppercase tracking-[0.2em] ml-2 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">Cihaz İsmi</label>
                      <input autoFocus type="text" value={deviceName} onChange={(e) => setDeviceName(e.target.value)} placeholder="Örn: Salon Akıllı Röle" className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded-2xl p-5 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all hover:border-gray-400 dark:hover:border-slate-700"/>

                    </div>

                    <div className="space-y-2">

                      <label className="text-[10px] font-bold text-gray-600 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Ev Seçimi</label>

                      <div className="flex flex-wrap gap-2">

                        {user?.user?.homes?.length > 0 ? ( user.user.homes.map((home) => ( <button key={home._id} onClick={() => { setSelectedHome(home._id); setSelectedRoom(null); }} className={`px-5 py-2.5 border rounded-xl text-xs font-bold transition-all duration-300 ${selectedHome === home._id ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30' : 'bg-gray-50 dark:bg-slate-950 border-gray-300 dark:border-slate-800 text-gray-700 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-slate-500'}`}>

                          {home.name}

                        </button> )) ) : ( <p className="text-xs text-yellow-700 dark:text-yellow-500/50 italic ml-2">Henüz bir ev tanımlanmamış.</p> )}

                      </div>

                    </div>

                    <div className="space-y-2">

                      <label className="text-[10px] font-bold text-gray-600 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Oda Seçimi</label>

                      <div className="flex flex-wrap gap-2">

                        {selectedHome ? ( user?.user?.homes?.find(h => h._id === selectedHome)?.rooms?.length > 0 ? ( user.user.homes.find(h => h._id === selectedHome).rooms.map((room) => ( <button key={room._id} onClick={() => setSelectedRoom(room._id)} className={`px-5 py-2.5 border rounded-xl text-xs font-bold transition-all duration-300 ${selectedRoom === room._id ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30' : 'bg-gray-50 dark:bg-slate-950 border-gray-300 dark:border-slate-800 text-gray-700 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-slate-500'}`}>

                          {room.name}

                        </button> )) ) : ( <p className="text-xs text-yellow-700 dark:text-yellow-500/50 italic ml-2">Bu evde henüz bir oda tanımlanmamış.</p> )) : ( <p className="text-xs text-gray-500 dark:text-slate-600 italic ml-2">Lütfen önce bir ev seçin.</p> )}

                      </div>

                    </div>
                    
                    <div className="bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl p-4">

                      <div className="flex items-center gap-3">

                        <div className="p-2.5 bg-blue-500/10 rounded-xl"><Zap size={18} className="text-blue-600 dark:text-blue-400" /></div>

                        <div>

                          <p className="text-xs text-gray-500 dark:text-slate-500 font-bold uppercase tracking-wider">Cihaz Tipi</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">ESP32 Akıllı Röle</p>

                        </div>

                      </div>

                    </div>

                  </div>

                </div> )}
                  
              </div>

                <div className="p-8 border-t border-gray-200 dark:border-slate-800 flex gap-4 bg-gray-50 dark:bg-slate-900/50">
                  {step > 1 && (
                    <button
                      onClick={() => {
                        if (step === 2) {
                          setBleScanning(false);
                          setBleDeviceFound(false);
                          setBleDeviceId('');
                          setFoundDevices([]);
                        }
                        setStep(step - 1);
                      }}
                      disabled={bleScanning}
                      className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowLeft size={18} /> Geri
                    </button>
                  )}

                <button disabled={ (step === 2 && (!bleDeviceFound || bleScanning)) || (step === 3 && (!deviceName || !selectedHome || !selectedRoom)) }

                  onClick={() => {
                    if (step === 1) {

                      setBleScanning(true);
                      setStep(2);
                    } else if (step === 2) {

                      setStep(3);
                    } else if (step === 3) {

                      handleCompletePairing();
                    }
                  }}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl text-sm font-bold transition-all shadow-xl ${

                    (step === 2 && (!bleDeviceFound || bleScanning)) ||
                    (step === 3 && (!deviceName || !selectedHome || !selectedRoom))
                    ? 'bg-gray-300 dark:bg-slate-800 text-gray-500 dark:text-slate-600 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-blue-600/30 active:scale-95'
                  }`} >

                  {step === 1 && ( <>Sonraki <ArrowRight size={18} /></> )}
                  {step === 2 && bleScanning && ( <><Loader2 size={18} className="animate-spin" />Taranıyor...</> )}
                  {step === 2 && !bleScanning && ( <>Devam Et <ArrowRight size={18} /></> )}
                  {step === 3 && ( <><Check size={18} /> Cihazı Ekle</> )}

                </button>

              </div>

            </div>

          </div> )}

        </div>

      </main>

    </div>
  );
};

export default Devices;
