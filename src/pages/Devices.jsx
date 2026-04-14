import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Sidebar from '../layout/Sidebar';

import { getMyDevices, startPairingAction, resetPairingStatus, completePairing, updateDevice, deleteDevice, toggleRelay } from '../redux/devicesSlice';
import { profile } from '../redux/userSlice';

import { Plus, Search, Sliders, Wifi, MoreVertical, Power, Thermometer, Droplets, 
  AlertTriangle, CheckCircle2, Activity, SignalHigh, SignalMedium, SignalLow, 
  BatteryFull, BatteryMedium, BatteryLow, Trash2, RefreshCw, X, Save, Zap, ArrowLeft, ArrowRight, Cpu, Plug } from 'lucide-react';

const Devices = () => {

  const dispatch = useDispatch();

  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedHome, setSelectedHome] = useState(null);
  const [editName, setEditName] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [deviceName, setDeviceName] = useState('Yeni Cihaz');

  const { user } = useSelector(state => state.user);
  const { devices, loading, pairingCode, pairingLoading, pairingError } = useSelector(state => state.devices);

  useEffect(() => {

    dispatch(getMyDevices());
    dispatch(profile());
  }, [dispatch]);

  useEffect(() => {

    if (step === 4 && selectedType) {

      dispatch(startPairingAction({

        homeId: user?.user?.homes?.[0]?._id,
        roomId: selectedRoom,
        name: deviceName,
        type: selectedType,
      }));
    }
  }, [step]);

  useEffect(() => {

    let timer;
    if (step === 4 && pairingCode && timeLeft > 0) {

      timer = setInterval(() => {

        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {

      dispatch(resetPairingStatus());
    }
    return () => clearInterval(timer);
  }, [step, pairingCode, timeLeft]);

  const formatTime = (seconds) => {

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const deviceTypes = [

    { id: 'Gateway', name: 'Gateway', icon: <Wifi />, desc: 'Merkezi Kontrol Ünitesi' },
    { id: 'Sensör', name: 'Sensör', icon: <Droplets />, desc: 'Su veya Gaz Sensörü' },
    { id: 'İklimlendirme', name: 'İklimlendirme', icon: <Thermometer />, desc: 'Termostat veya Nem' },
    { id: 'Güç', name: 'Güç', icon: <Zap />, desc: 'Akıllı Röle / Priz' },
  ];

  const filteredDevices = useMemo(() => {

    if (!devices) return [];
    return devices.filter(device => {
      const matchesFilter = filter === 'all' || device.data?.status === filter;
      const matchesSearch =
        device.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (device.roomId?.name && device.roomId.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchQuery, devices]);

  const getDeviceIcon = (type) => {

    switch (type) {

      case 'Gateway': return <Wifi size={24} />;
      case 'Sensör': return <Droplets size={24} />;
      case 'İklimlendirme': return <Thermometer size={24} />;
      case 'Güvenlik': return <Activity size={24} />;
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

  const handleCompletePairing = () => {

    const currentPairingCode = pairingCode;
    console.log("=== Pairing Debug ===");
    console.log("pairingCode:", currentPairingCode);
    console.log("selectedType:", selectedType);
    console.log("selectedRoom:", selectedRoom);
    console.log("selectedHome:", user?.user?.homes?.[0]?._id);
    console.log("deviceName:", deviceName);

    if (!currentPairingCode) {

      console.error("Pairing code henüz alınmadı!");
      return;
    }

    const payload = {

      homeId: user?.user?.homes?.[0]?._id,
      roomId: selectedRoom,
      name: deviceName,
      type: selectedType,
      serialNumber: currentPairingCode,
    };

    dispatch(completePairing(payload))
    .unwrap()
    .then((result) => {

      console.log("Cihaz başarıyla eklendi:", result);
      onClose();
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
    setSelectedType(null);
    setSelectedRoom(null);
    setSelectedHome(null);
    setDeviceName('Yeni Cihaz');
    setTimeLeft(600);
    dispatch(resetPairingStatus());
  };

  const handleOpenSettings = (device) => {

    setSelectedDevice(device);
    setEditName(device.name || '');
    setEditLocation(device.roomId?._id || '');
    setIsModalOpen(true);
  };

  const handleSendCommand = (device, command) => {

    const currentState = device?.data?.relayState;
    const newAction = currentState === 'on' ? 'off' : 'on';
    console.log("Mevcut durum:", currentState, "→ Gönderilen:", newAction);
    dispatch(toggleRelay({ 
      serialNumber: device.serialNumber, 
      action: newAction
    }));

    console.log(`Komut gönderiliyor → ${device.serialNumber} / ${newAction}`);
    console.log("currentState", currentState);
  };

  return (

    <div className="flex bg-slate-950 min-h-screen">

      <Sidebar />

      <main className="flex-1 lg:ml-0 overflow-x-hidden">

        <div className="p-6 space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto relative">

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">

            <div className="space-y-1">

              <h2 className="text-3xl font-extrabold text-white tracking-tight">Cihaz Yönetimi</h2>
              <p className="text-slate-400">Sistem genelinde <span className="text-blue-400 font-semibold">{devices.length}</span> cihaz tanımlı.</p>

            </div>

            <div className="flex flex-wrap gap-3">

              <div className="bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-2xl">

                <p className="text-[10px] text-slate-500 uppercase font-bold">Çalışıyor</p>
                <p className="text-lg font-bold text-green-500">{devices.filter(d => d?.data?.status === 'online').length}</p>

              </div>

              <div className="bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-2xl">

                <p className="text-[10px] text-slate-500 uppercase font-bold">Kritik</p>
                <p className="text-lg font-bold text-yellow-500">{devices.filter(d => d?.data?.status === 'warning').length}</p>

              </div>

            </div>

          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/30 p-4 rounded-3xl border border-slate-800/50">
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {['all', 'online', 'warning', 'offline'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all whitespace-nowrap ${
                    filter === f
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                      : 'text-slate-500 hover:bg-slate-800'
                  }`}
                >
                  {f === 'all' ? 'Tümü' : f}
                </button>
              ))}
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="text"
                  placeholder="Cihaz ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-2xl shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
              >
                <Plus size={22} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDevices.map((device) => (
              <div
                key={device._id}
                className="group relative bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 hover:bg-slate-800/50 hover:border-slate-600 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-8">
                  <div
                    className={`p-4 rounded-2xl shadow-inner ${
                      device?.data?.status === 'online'
                        ? 'bg-green-500/10 text-green-400'
                        : device?.data?.status === 'warning'
                        ? 'bg-yellow-500/10 text-yellow-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {getDeviceIcon(device.type)}
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setActiveMenu(activeMenu === device._id ? null : device._id)}
                      className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-full transition-all"
                    >
                      <MoreVertical size={20} />
                    </button>

                    {activeMenu === device._id && (
                      <div>
                        <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)}></div>
                        <div className="absolute right-0 mt-2 w-48 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl z-20 py-2 animate-in slide-in-from-top-2 duration-200">
                          <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-900 hover:text-white transition-colors">
                            <RefreshCw size={14} /> Yeniden Başlat
                          </button>
                          <button
                            onClick={() => handleDelete(device._id)}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 size={14} /> Cihazı Sil
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                    {device.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 font-medium">
                    {device.location} • {device.version}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="bg-slate-950/50 p-4 rounded-3xl border border-slate-800/50">
                    <div className="flex items-center gap-2 mb-1">
                      {getSignalIcon(
                        device?.data?.signal === 'Güçlü'
                          ? 'Güçlü'
                          : device?.data?.signal === 'Orta'
                          ? 'Orta'
                          : 'Zayıf'
                      )}
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Sinyal</p>
                    </div>
                    <p className="text-sm font-bold text-slate-200">{device?.data?.signal}</p>
                  </div>

                  <div className="bg-slate-950/50 p-4 rounded-3xl border border-slate-800/50">
                    <div className="flex items-center gap-2 mb-1">
                      {getBatteryIcon(
                        device.battery
                          ? device.battery > 80
                            ? 'Güçlü'
                            : device.battery > 30
                            ? 'Orta'
                            : 'Zayıf'
                          : 'AC'
                      )}
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Enerji</p>
                    </div>
                    <p className="text-sm font-bold text-slate-200">
                      {device.battery ? `%${device.battery}` : 'AC'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">

                  <button onClick={() => handleOpenSettings(device)} className="flex-1 bg-white/[0.03] hover:bg-white/[0.08] text-white py-3 rounded-2xl text-xs font-bold border border-white/5 transition-all flex items-center justify-center gap-2" >
                    <Sliders size={14} /> Ayarlar
                  </button>

                  {/*<button onClick={() => console.log('Toggle power:', device._id)} disabled={device?.data?.status === 'offline'} className={`p-3 rounded-2xl transition-all ${ device?.data?.status === 'online' ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg' : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'}`}>
                    <Power size={20} />
                  </button>*/}

                  <button onClick={() => handleSendCommand(device, 'toggle')} className={`p-3 rounded-2xl transition-all ${device?.data?.relayState === 'on' ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg' : 'bg-slate-800 text-slate-600 border border-slate-700'}`}>
                    <Power size={20} />
                  </button>

                </div>
              </div>
            ))}
          </div>

          {/* Settings Modal */}
          {isModalOpen && selectedDevice && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300"
                onClick={() => setIsModalOpen(false)}
              ></div>

              <div className="relative bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center p-8 border-b border-slate-800 bg-slate-900/50">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
                      {getDeviceIcon(selectedDevice.type)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Cihaz Ayarları</h3>
                      <p className="text-sm text-slate-500">ID: #{selectedDevice._id}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-full transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Cihaz Adı</label>
                    {/* FIX 8: defaultValue yerine value kullanıldı, editName state'e bağlı */}
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Konum</label>
                      <select
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:outline-none focus:border-blue-500 appearance-none"
                      >
                        {user?.user?.homes?.[0]?.rooms?.length > 0 ? (
                          user.user.homes[0].rooms.map((room) => (
                            <option key={room._id} value={room._id}>
                              {room.name}
                            </option>
                          ))
                        ) : (
                          <option value="">Henüz bir oda tanımlanmamış.</option>
                        )}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Versiyon</label>
                      <div className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-slate-400">
                        {selectedDevice.version}
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-2xl flex items-start gap-3">
                    <Activity size={18} className="text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-200 font-medium">Son Görülme</p>
                      <p className="text-xs text-blue-400/70">{selectedDevice.lastSeen} ağa bağlandı.</p>
                    </div>
                  </div>
                </div>

                <div className="p-8 border-t border-slate-800 flex gap-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-4 rounded-2xl text-sm font-bold text-slate-400 hover:bg-slate-800 transition-all"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="flex-2 flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20"
                  >
                    <Save size={18} /> Değişiklikleri Kaydet
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Device Modal */}
          {isAddModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300"
                onClick={onClose}
              />

              <div className="relative bg-slate-900 border border-slate-800 w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-800/50">
                  <div
                    className="h-full bg-blue-500 transition-all duration-500 ease-out"
                    style={{ width: `${(step / 4) * 100}%` }}
                  />
                </div>

                <div className="p-8 pb-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">Yeni Cihaz Ekle</h3>
                    <p className="text-slate-500 text-sm font-medium">Aşama {step} / 4</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2.5 text-slate-500 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-full transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-8 pt-4 min-h-[380px]">
                  {/* Step 1: Cihaz Tipi */}
                  {step === 1 && (
                    <div className="space-y-4 animate-in slide-in-from-right-8 duration-300">
                      <p className="text-slate-400 text-sm ml-1 font-medium">Lütfen cihaz tipini belirleyin:</p>
                      <div className="grid grid-cols-2 gap-4">
                        {deviceTypes.map((type) => (
                          <button
                            key={type.id}
                            onClick={() => setSelectedType(type.id)}
                            className={`p-6 rounded-[2.5rem] border-2 text-left transition-all group ${
                              selectedType === type.id
                                ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/5'
                                : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                            }`}
                          >
                            <div
                              className={`p-3.5 rounded-2xl w-fit mb-4 transition-transform group-active:scale-90 ${
                                selectedType === type.id
                                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {type.icon}
                            </div>
                            <h4 className="font-bold text-white text-lg">{type.name}</h4>
                            <p className="text-[11px] text-slate-500 font-bold leading-tight mt-1 uppercase tracking-wider">
                              {type.desc}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2: İsim & Konum */}
                  {step === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-500">
                      <div className="space-y-5">
                        <div className="space-y-2 group">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-2 group-focus-within:text-blue-400 transition-colors">
                            Cihaz İsmi
                          </label>
                          {/* FIX 9: deviceName state'e bağlandı */}
                          <input
                            autoFocus
                            type="text"
                            value={deviceName}
                            onChange={(e) => setDeviceName(e.target.value)}
                            placeholder="Örn: Salon ESP-Relay-1"
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-white placeholder:text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all hover:border-slate-700"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-2">
                            Ev Seçimi
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {user?.user?.homes?.length > 0 ? (
                              user.user.homes.map((home) => (
                                <button
                                  key={home._id}
                                  onClick={() => {
                                    setSelectedHome(home._id);
                                    setSelectedRoom(null); // ev değişince oda sıfırla
                                  }}
                                  className={`px-5 py-2.5 border rounded-xl text-xs font-bold transition-all duration-300 ${
                                    selectedHome === home._id
                                      ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-500'
                                  }`}
                                >
                                  {home.name}
                                </button>
                              ))
                            ) : (
                              <p className="text-xs text-yellow-500/50 italic ml-2">
                                Henüz bir ev tanımlanmamış.
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-2">
                            Oda Seçimi
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {selectedHome ? (
                              user?.user?.homes?.find(h => h._id === selectedHome)?.rooms?.length > 0 ? (
                                user.user.homes.find(h => h._id === selectedHome).rooms.map((room) => (
                                  <button
                                    key={room._id}
                                    onClick={() => setSelectedRoom(room._id)}
                                    className={`px-5 py-2.5 border rounded-xl text-xs font-bold transition-all duration-300 ${
                                      selectedRoom === room._id
                                        ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-500'
                                    }`}
                                  >
                                    {room.name}
                                  </button>
                                ))
                              ) : (
                                <p className="text-xs text-yellow-500/50 italic ml-2">
                                  Bu evde henüz bir oda tanımlanmamış.
                                </p>
                              )
                            ) : (
                              <p className="text-xs text-slate-600 italic ml-2">
                                Lütfen önce bir ev seçin.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Eşleşme Modunu Aktif Et */}
                  {step === 3 && (
                    <div className="flex flex-col items-center justify-center text-center space-y-8 py-10 animate-in slide-in-from-right-8 duration-300">
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-10"></div>
                        <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 p-10 rounded-[2.5rem] shadow-2xl shadow-blue-900/40 text-white">
                          <Cpu size={56} />
                        </div>
                      </div>
                      <div className="max-w-xs space-y-3">
                        <h4 className="text-xl font-bold text-white tracking-tight">
                          Eşleşme Modunu Aktif Edin
                        </h4>
                        <p className="text-sm text-slate-400 leading-relaxed font-medium">
                          ESP32 üzerindeki{' '}
                          <span className="text-blue-400 font-bold">BOOT</span> butonuna 5 saniye basılı
                          tutun. LED hızlıca yanıp sönmeye başladığında devam edin.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Eşleşme Kodu */}
                  {step === 4 && (
                    <div className="flex flex-col items-center justify-center text-center space-y-8 py-10 animate-in slide-in-from-right-8 duration-300">
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-10"></div>
                        <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 p-10 rounded-[2.5rem] shadow-2xl shadow-blue-900/40 text-white">
                          <Cpu size={56} />
                        </div>
                      </div>
                      <div className="max-w-xs space-y-3">
                        <h4 className="text-xl font-bold text-white tracking-tight">
                          Eşleşme Kodunu Girin
                        </h4>
                        <p className="text-sm text-slate-400 leading-relaxed font-medium">
                          ESP32 üzerindeki{' '}
                          <span className="text-blue-400 font-bold">KOD</span> Kısmına buradaki 8 haneli
                          kodu girin. LED sönünce devam edin.
                        </p>
                        <span className="flex items-center justify-center text-white font-mono tracking-[0.2em] text-xl border rounded-lg p-2">
                          {pairingLoading
                            ? '...'
                            : pairingCode
                            ? pairingCode.match(/.{1,4}/g).join(' ')
                            : 'KOD ALINIYOR'}
                        </span>
                        <div className="flex items-center justify-center gap-4">
                          <p className="text-sm text-slate-500 uppercase font-bold tracking-widest">
                            Kalan Süre
                          </p>
                          <div
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors ${
                              timeLeft < 60
                                ? 'bg-red-500/10 border-red-500/20 text-red-500'
                                : 'bg-slate-800/50 border-slate-700 text-slate-400'
                            }`}
                          >
                            <RefreshCw size={14} className={pairingLoading ? 'animate-spin' : ''} />
                            <span className="text-sm font-bold tabular-nums">{formatTime(timeLeft)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-8 border-t border-slate-800 flex gap-4 bg-slate-900/50">
                  {step > 1 && (
                    <button
                      onClick={() => setStep(step - 1)}
                      className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
                    >
                      <ArrowLeft size={18} /> Geri
                    </button>
                  )}

                  <button
                    disabled={step === 1 && !selectedType}
                    onClick={() => (step < 4 ? setStep(step + 1) : handleCompletePairing())}
                    className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl text-sm font-bold transition-all shadow-xl ${
                      step === 1 && !selectedType
                        ? 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                        : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/30 active:scale-95'
                    }`}
                  >
                    {pairingError && step === 4 && (
                    <p className="text-xs text-red-400 text-center mb-2">{pairingError}</p>
                  )}
                  {step === 4 ? 'Sisteme Kaydet' : 'Sonraki Adım'}
                    {step < 4 && <ArrowRight size={18} />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Devices;
