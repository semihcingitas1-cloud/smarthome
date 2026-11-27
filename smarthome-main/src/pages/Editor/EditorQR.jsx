import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';

import EditorSidebar from '../../layout/EditorSidebar';

import { QrCode, Calendar, Settings, Type, Download, Copy, Sparkles, CheckCircle, Smartphone } from 'lucide-react';

const EditorQR = () => {

  const [paramOption, setParamOption] = useState('R1');
  const [userInput, setUserInput] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef(null);
  const today = new Date().toISOString().split('T')[0];

  const options = [

    { value: 'R1', label: 'R1', desc: 'Mini Röle Tek Kanal' },
    { value: 'R2', label: 'R2', desc: 'Mini Röle İki Kanal' },
    { value: 'SP', label: 'ST', desc: 'Stor Perde' },
    { value: 'SS', label: 'SS', desc: 'Su Sensörü' }
  ];

  const activeDesc = options.find(opt => opt.value === paramOption)?.desc || '';

  useEffect(() => {

    const cleanedInput = userInput.trim();
    const finalString = `SH-${paramOption}-${today}-${cleanedInput || '...'}`;
    setGeneratedText(finalString);

    if (cleanedInput) {

      const actualData = `SH-${paramOption}-${today}-${cleanedInput}`;
      QRCode.toDataURL(actualData, { width: 300, margin: 2, color: { dark: '#0f172a', light: '#ffffff' } }).then(url => setQrDataUrl(url)).catch(err => console.error(err));
    } else {

      setQrDataUrl('');
    }
  }, [paramOption, userInput, today]);

  useEffect(() => {

    window.scrollTo(0, 0);
  }, []);

  const handleCopy = () => {

    if (!userInput.trim()) return;
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {

    if (!qrDataUrl) return;
    const downloadLink = document.createElement('a');
    downloadLink.href = qrDataUrl;
    downloadLink.download = `${generatedText}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (

    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white transition-colors duration-300">

      <EditorSidebar />

      <div className="flex-1 overflow-y-auto">

        <section className="relative pt-8 pb-6 px-6 border-b border-gray-200 dark:border-slate-800/60 bg-white dark:bg-slate-900/40">

          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none" />
          
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">

            <div className="flex items-center gap-4">

              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl text-white shadow-md shadow-blue-500/20"><QrCode size={28} /></div>

              <div>

                <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 flex items-center gap-1.5"><Sparkles size={12} className="animate-pulse" /> Fabrika Üretim & Cihaz Tanımlama</span>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-0.5">QR Kod Oluşturucu</h1>

              </div>

            </div>

            <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm md:text-right">Donanım ve akıllı ev modülleri için standartlara uygun seri numarası ve takip etiketleri oluşturun.</p>

          </div>

        </section>

        <section className="py-10 px-6 max-w-5xl mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">

              <h3 className="text-lg font-bold flex items-center gap-2 border-b border-gray-100 dark:border-slate-800/60 pb-3"><Settings className="text-blue-500" size={18} /> QR Kod Konfigürasyonu</h3>

              <div>

                <label className="text-xs font-bold mb-2 text-gray-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">1. Parametre Belirteci (Cihaz Tipi)</label>

                <select value={paramOption} onChange={(e) => setParamOption(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-medium cursor-pointer">
                  {options.map((opt) => ( <option key={opt.value} value={opt.value}>{opt.label} — {opt.desc}</option> ))}
                </select>

                <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">Aktif Seçim: <span className="font-semibold text-blue-500">{activeDesc}</span> (Etiket: <span className="font-mono font-bold">{paramOption}</span>)</p>

              </div>

              <div>

                <label className="text-xs font-bold mb-2 text-gray-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2"><Calendar size={14} /> Üretim Tarihi (Otomatik)</label>
                <div className="w-full bg-gray-100 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-800/60 rounded-xl px-4 py-3 text-sm text-gray-500 dark:text-slate-400 font-mono font-bold select-none">{today}</div>

              </div>

              <div>

                <label className="text-xs font-bold mb-2 text-gray-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2"><Type size={14} /> 2. Benzersiz Seri No / Özel Metin</label>
                <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all" placeholder="Örn: SN-99412 veya MAC adresi..."/>

              </div>

              <div className="p-4 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/30 rounded-2xl text-xs text-blue-800 dark:text-blue-400 leading-relaxed">

                <strong>Sistem Algoritma Kuralı:</strong>{' '}
                <code className="font-mono bg-blue-100/60 dark:bg-blue-900/40 px-1.5 py-0.5 rounded text-blue-600 dark:text-blue-300">SH-[Cihaz]-[Tarih]-[Metin]</code>{' '}
                düzeninde şifrelenerek donanım kimliği basılır.

              </div>

            </div>

            <div className="space-y-6">

              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">

                <div className="flex justify-between items-center mb-3">

                  <span className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Oluşturulan Sistem Sicil Kodu</span>

                  {userInput.trim() && ( <button onClick={handleCopy} className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold transition-colors">

                    {copied ? <CheckCircle size={13} className="text-emerald-500" /> : <Copy size={13} />}
                    {copied ? 'Kopyalandı' : 'Kodu Kopyala'}

                  </button> )}

                </div>

                <div className="bg-gray-950 text-emerald-400 font-mono p-4 rounded-xl text-xs sm:text-sm break-all border border-gray-800 shadow-inner min-h-[52px] flex items-center tracking-wide">{generatedText}</div>

              </div>

              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm text-center flex flex-col items-center justify-center min-h-[340px]">

                {qrDataUrl ? ( <div className="w-full flex flex-col items-center space-y-6 transition-all duration-300 animate-in fade-in zoom-in-95">

                  <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-md inline-block"><img src={qrDataUrl} alt="Oluşturulan QR Kod" className="w-44 h-44 md:w-48 md:h-48 select-none" /></div>

                  <div className="w-full">

                    <button onClick={handleDownload} className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg shadow-blue-500/10 cursor-pointer text-sm">
                      <Download size={16} />
                      QR Kodu Bilgisayara İndir (.PNG)
                    </button>

                  </div>

                </div> ) : ( <div className="text-gray-400 dark:text-slate-600 flex flex-col items-center gap-3 p-6">

                  <div className="p-4 bg-gray-50 dark:bg-slate-800/40 rounded-2xl border border-gray-100 dark:border-slate-800/50"><QrCode size={40} className="stroke-[1.2] text-gray-400 dark:text-slate-500" /></div>
                  <p className="text-xs sm:text-sm font-medium max-w-[240px] text-gray-400 dark:text-slate-400 leading-relaxed">QR etiketinin anlık üretilmesi için lütfen <span className="text-blue-500 font-semibold">2. seçeneğe</span> bir veri girişi yapın.</p>

                </div> )}

              </div>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
};

export default EditorQR;