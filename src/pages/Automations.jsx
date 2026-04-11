import React, { useState } from 'react';

import Sidebar from '../layout/Sidebar';

import { Plus, Play, Clock, Zap, Trash2, ChevronRight, AlertCircle, ToggleRight, ToggleLeft, Bell, ArrowRight, MoreVertical, Settings2, Calendar, Activity, X } from 'lucide-react';

const Automation = () => {

  const [activeTab, setActiveTab] = useState('active');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({

    name: "",
    description: "",
    type: "Safety",
    triggerDevice: "",
    triggerCondition: "",
    actionDevice: "",
    actionCommand: ""
  });

  const automations = [
    {
      id: 1,
      name: "Acil Gaz Kesme",
      description: "Mutfak gaz sensörü sızıntı algılarsa ana vanayı kapat.",
      type: "Safety",
      status: true,
      trigger: { device: "Mutfak Gaz Sensörü", condition: "Analog > 400" },
      action: { device: "Ana Vana Rölesi", command: "OFF" },
      lastRun: "Hiç çalışmadı"
    },
    {
      id: 2,
      name: "Gece Modu",
      description: "Hafta içi saat 23:00'de tüm ışıkları kapat.",
      type: "Schedule",
      status: true,
      trigger: { device: "Zamanlayıcı", condition: "23:00" },
      action: { device: "Tüm Aydınlatmalar", command: "OFF" },
      lastRun: "Dün 23:00"
    },
    {
      id: 3,
      name: "Su Baskını Koruması",
      description: "Banyo sensörü su algılarsa bildirim gönder.",
      type: "Safety",
      status: false,
      trigger: { device: "Banyo Su Sensörü", condition: "Detected" },
      action: { device: "Mobil Bildirim", command: "SEND_ALERT" },
      lastRun: "2 gün önce"
    }
  ];

  return (

    <div className="flex bg-slate-950 min-h-screen">

      <Sidebar />

      <main className="flex-1 lg:ml-0 overflow-x-hidden">

        <div className="p-6 space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto">
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">

            <div className="space-y-1">

              <h2 className="text-3xl font-extrabold text-white tracking-tight">Otomasyonlar</h2>
              <p className="text-slate-400">Cihazların birbiriyle nasıl konuşacağını buradan yönetin.</p>

            </div>

            <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl shadow-lg shadow-blue-900/20 active:scale-95 transition-all font-bold"><Plus size={20} /> Yeni Senaryo Oluştur</button>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {[
              { label: "Aktif Senaryo", value: "8", icon: <Zap className="text-yellow-400" />, color: "bg-yellow-500/10" },
              { label: "Bugünkü Tetiklenme", value: "24", icon: <Activity className="text-blue-400" />, color: "bg-blue-500/10" },
              { label: "Kritik Güvenlik", value: "2", icon: <AlertCircle className="text-red-400" />, color: "bg-red-500/10" }
            ].map((stat, i) => ( <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-[2rem] flex items-center justify-between">

              <div>

                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black text-white mt-1">{stat.value}</p>

              </div>

              <div className={`p-4 rounded-2xl ${stat.color}`}>{stat.icon}</div>

            </div> ))}

          </div>

          <div className="space-y-4">

            <div className="flex gap-2 p-1 bg-slate-900/50 w-fit rounded-2xl border border-slate-800">

              {['active', 'all', 'history'].map((t) => ( <button key={t} onClick={() => setActiveTab(t)} className={`px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all ${activeTab === t ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>

                {t === 'active' ? 'Çalışanlar' : t === 'all' ? 'Tümü' : 'Geçmiş'}

              </button> ))}

            </div>

            <div className="grid grid-cols-1 gap-4">

              {automations.map((rule) => ( <div key={rule.id} className="group bg-slate-900 border border-slate-800 rounded-[2rem] p-6 hover:bg-slate-800/40 transition-all">

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

                  <div className="flex items-center gap-4 flex-1">

                    <div className={`p-4 rounded-2xl ${rule.type === 'Safety' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>

                      {rule.type === 'Safety' ? <AlertCircle size={24} /> : <Clock size={24} />}

                    </div>

                    <div>

                      <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{rule.name}</h4>
                      <p className="text-sm text-slate-500 max-w-md">{rule.description}</p>

                    </div>

                  </div>

                  <div className="flex items-center gap-4 bg-slate-950/50 px-6 py-4 rounded-3xl border border-slate-800/50 flex-[1.5]">

                    <div className="text-center">

                      <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">EĞER</p>
                      <p className="text-xs text-white font-medium">{rule.trigger.device}</p>

                    </div>

                    <ArrowRight size={16} className="text-slate-700" />

                    <div className="text-center">

                      <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">DURUM</p>
                      <p className="text-xs text-blue-400 font-bold">{rule.trigger.condition}</p>

                    </div>

                    <ChevronRight size={20} className="text-slate-800 mx-2" />

                    <div className="text-center">

                      <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">AKSİYON</p>
                      <p className="text-xs text-green-400 font-bold">{rule.action.device} : {rule.action.command}</p>

                    </div>

                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto justify-between border-t md:border-t-0 border-slate-800 pt-4 md:pt-0">

                    <div className="text-right hidden xl:block">

                      <p className="text-[10px] text-slate-500 font-bold uppercase">SON ÇALIŞMA</p>
                      <p className="text-xs text-slate-300">{rule.lastRun}</p>

                    </div>

                    <div className="flex items-center gap-2">

                      <button className={`p-2 transition-all ${rule.status ? 'text-blue-500' : 'text-slate-600'}`}>
                        {rule.status ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                      </button>
                      <button className="p-3 text-slate-500 hover:text-white hover:bg-slate-800 rounded-2xl transition-all">
                        <Settings2 size={20} />
                      </button>

                    </div>

                  </div>

                </div>

              </div> ))}

            </div>

          </div>

          {automations.length === 0 && ( <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-slate-900/20 rounded-[3rem] border border-dashed border-slate-800">

            <div className="p-6 bg-slate-800/50 rounded-full text-slate-600"><Zap size={40} /></div>

            <div>

              <h3 className="text-xl font-bold text-white">Henüz Otomasyon Yok</h3>
              <p className="text-slate-500 max-w-xs mx-auto mt-2">Evini akıllı hale getirmek için cihazların arasında kurallar oluşturmaya başla.</p>

            </div>

          </div> )}

          {isCreateModalOpen && (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">

    <div
      className="absolute inset-0 bg-black/70 backdrop-blur-md"
      onClick={() => setIsCreateModalOpen(false)}
    />

    <div className="relative bg-slate-900 border border-slate-800 w-full max-w-xl rounded-[2.5rem] p-8 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">
          Yeni Otomasyon ({step}/4)
        </h3>

        <button onClick={() => setIsCreateModalOpen(false)}>
          <X />
        </button>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-4">

          <input
            placeholder="Senaryo adı"
            className="w-full p-4 rounded-xl bg-slate-800 text-white"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <textarea
            placeholder="Açıklama"
            className="w-full p-4 rounded-xl bg-slate-800 text-white"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <select
            className="w-full p-4 rounded-xl bg-slate-800 text-white"
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
          >
            <option value="Safety">Safety</option>
            <option value="Schedule">Schedule</option>
          </select>

        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-4">

          <input
            placeholder="Trigger Device ID"
            className="w-full p-4 rounded-xl bg-slate-800 text-white"
            value={form.triggerDevice}
            onChange={(e) =>
              setForm({ ...form, triggerDevice: e.target.value })
            }
          />

          <input
            placeholder="Condition (örn: >400 veya 23:00)"
            className="w-full p-4 rounded-xl bg-slate-800 text-white"
            value={form.triggerCondition}
            onChange={(e) =>
              setForm({ ...form, triggerCondition: e.target.value })
            }
          />

        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="space-y-4">

          <input
            placeholder="Action Device ID"
            className="w-full p-4 rounded-xl bg-slate-800 text-white"
            value={form.actionDevice}
            onChange={(e) =>
              setForm({ ...form, actionDevice: e.target.value })
            }
          />

          <input
            placeholder="Command (ON / OFF / ALERT)"
            className="w-full p-4 rounded-xl bg-slate-800 text-white"
            value={form.actionCommand}
            onChange={(e) =>
              setForm({ ...form, actionCommand: e.target.value })
            }
          />

        </div>
      )}

      {/* STEP 4 (ÖZET) */}
      {step === 4 && (
        <div className="space-y-4 text-white">

          <p><b>Ad:</b> {form.name}</p>
          <p><b>Tip:</b> {form.type}</p>

          <div className="bg-slate-800 p-4 rounded-xl">
            <p className="text-sm text-slate-400">EĞER</p>
            <p>{form.triggerDevice} → {form.triggerCondition}</p>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl">
            <p className="text-sm text-slate-400">AKSİYON</p>
            <p>{form.actionDevice} → {form.actionCommand}</p>
          </div>

        </div>
      )}

      {/* FOOTER */}
      <div className="flex justify-between">

        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="px-6 py-3 bg-slate-700 rounded-xl"
          >
            Geri
          </button>
        )}

        <button
          onClick={() => {
            if (step < 4) setStep(step + 1);
            else {
              console.log("🚀 GÖNDER:", form);

              // dispatch(createAutomation(form))
              setIsCreateModalOpen(false);
              setStep(1);
            }
          }}
          className="px-6 py-3 bg-blue-600 rounded-xl text-white"
        >
          {step === 4 ? "Kaydet" : "Devam"}
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

export default Automation;