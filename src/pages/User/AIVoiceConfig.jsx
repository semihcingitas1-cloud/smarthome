import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../../layout/Sidebar';

import {
  // Actions
  sendMessageToAI,
  saveAISettings,
  loadAISettings,
  loadHistory,
  checkSystemHealth,
  speakText,
  setTranscript,
  setListening,
  setSpeaking,
  clearConversation,
  updateSettings,
  resetSettings,
  clearHistory,
  removeHistoryItem,
  setMicPermission,
  clearError,
  
  // Selectors
  AI_MODELS,
  PERSONALITIES,
  PERSONALITY_CONFIG,
  LANGUAGES,
  VOICES,
  AI_SETTINGS_DEFAULTS,
} from '../../redux/aiSlice';

import {
  Mic, BrainCircuit, MessageSquare, Settings2, Radio, Volume2, Sparkles,
  Play, Save, Database, Ear, Languages as LangIcon, Cpu, Bot, Activity,
  Zap, TrendingUp, AlertCircle, CheckCircle2, RefreshCw, Download, Upload,
  Bell, Clock, Gauge, Wifi, Server, Settings, Trash2, Eye, EyeOff, Volume1,
  VolumeX, Plus, X, ChevronRight, Info, BarChart3, Waves, Mic2, Speaker,
  Headphones, Share2, Copy, FileText, Filter, Search, Shield, StopCircle
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════

function Toggle({ on, onChange, color = 'bg-blue-600' }) {
  return (
    <button
      onClick={() => onChange(!on)}
      role="switch"
      aria-checked={on}
      className={`w-14 h-7 rounded-full transition-colors relative ${
        on ? color : 'bg-slate-300 dark:bg-slate-700'
      }`}
    >
      <div
        className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${
          on ? 'right-1' : 'left-1'
        }`}
      />
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SPEECH RECOGNITION SETUP
// ═══════════════════════════════════════════════════════════════════

const SpeechRecognitionAPI =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

const AIVoiceConfig = () => {
  const dispatch = useDispatch();

  // ── Redux State ────────────────────────────────────────────────────
  const {
    conversation,
    settings,
    history,
    stats,
    systemStatus,
    loading,
    error: reduxError,
  } = useSelector((state) => state.ai);

  // ── Local UI State ─────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('overview');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [localError, setLocalError] = useState('');

  // ── Refs ───────────────────────────────────────────────────────────
  const recognitionRef = useRef(null);
  const waveIntervalRef = useRef(null);
  const barRefs = useRef([]);

  // ── Derived State ──────────────────────────────────────────────────
  const {
    messages,
    transcript,
    currentResponse,
    isListening,
    isSpeaking,
    isProcessing,
    confidence,
  } = conversation;

  const displayError = reduxError?.message || localError;

  // ═══════════════════════════════════════════════════════════════════
  // WAVEFORM ANIMATION
  // ═══════════════════════════════════════════════════════════════════

  const startWave = useCallback(() => {
    waveIntervalRef.current = setInterval(() => {
      barRefs.current.forEach((bar) => {
        if (bar) bar.style.height = Math.random() * 20 + 4 + 'px';
      });
    }, 100);
  }, []);

  const stopWave = useCallback(() => {
    if (waveIntervalRef.current) {
      clearInterval(waveIntervalRef.current);
      waveIntervalRef.current = null;
    }
    const defaults = [6, 14, 8, 20, 10, 16, 6, 12, 18, 8, 22, 10];
    barRefs.current.forEach((bar, i) => {
      if (bar) bar.style.height = defaults[i] + 'px';
    });
  }, []);

  // ═══════════════════════════════════════════════════════════════════
  // SPEECH RECOGNITION
  // ═══════════════════════════════════════════════════════════════════

  const initRecognition = useCallback(() => {
    if (!SpeechRecognitionAPI) return;

    const rec = new SpeechRecognitionAPI();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = settings.language;

    rec.onstart = () => {
      dispatch(setListening(true));
      dispatch(clearError());
      setLocalError('');
    };

    rec.onresult = (e) => {
      let interim = '';
      let final = '';

      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      dispatch(setTranscript(final || interim));

      // Auto-send when final result received
      if (final && settings.autoSend) {
        stopListeningFn(rec);
        handleSendToAI(final.trim());
      }
    };

    rec.onerror = (e) => {
      stopListeningFn(rec);
      
      let errorMsg = 'Ses tanıma hatası';
      if (e.error === 'not-allowed') {
        errorMsg = 'Mikrofon izni reddedildi. Tarayıcı ayarlarından izin verin.';
        dispatch(setMicPermission(false));
      } else if (e.error === 'no-speech') {
        errorMsg = 'Ses algılanamadı, tekrar deneyin.';
      } else {
        errorMsg = `Ses tanıma hatası: ${e.error}`;
      }
      
      setLocalError(errorMsg);
    };

    rec.onend = () => {
      dispatch(setListening(false));
      stopWave();
    };

    recognitionRef.current = rec;
  }, [settings.language, settings.autoSend, dispatch, stopWave]);

  const stopListeningFn = (rec) => {
    try {
      rec?.stop();
    } catch (_) {
      // Ignore errors when stopping
    }
    dispatch(setListening(false));
    stopWave();
  };

  const toggleMic = async () => {
    if (!SpeechRecognitionAPI) {
      setLocalError(
        'Bu tarayıcı ses tanımayı desteklemiyor. Chrome veya Edge kullanın.'
      );
      return;
    }

    if (isListening) {
      stopListeningFn(recognitionRef.current);
      return;
    }

    // Check mic permission
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      dispatch(setMicPermission(true));
    } catch (err) {
      dispatch(setMicPermission(false));
      setLocalError('Mikrofon izni gerekli');
      return;
    }

    dispatch(clearError());
    setLocalError('');
    dispatch(setTranscript(''));

    initRecognition();

    setTimeout(() => {
      try {
        recognitionRef.current?.start();
        startWave();
      } catch (err) {
        setLocalError('Mikrofon başlatılamadı: ' + err.message);
      }
    }, 50);
  };

  // ═══════════════════════════════════════════════════════════════════
  // AI MESSAGE HANDLING
  // ═══════════════════════════════════════════════════════════════════

  const handleSendToAI = async (text) => {
    if (!text?.trim()) return;

    dispatch(clearError());
    setLocalError('');

    try {
      const result = await dispatch(
        sendMessageToAI({ message: text.trim(), includeHistory: true })
      ).unwrap();

      // Auto TTS if enabled
      if (settings.autoTts && result.aiResponse) {
        dispatch(speakText(result.aiResponse));
      }
    } catch (err) {
      console.error('AI message failed:', err);
      // Error already in Redux state
    }
  };

  // ═══════════════════════════════════════════════════════════════════
  // SETTINGS HANDLERS
  // ═══════════════════════════════════════════════════════════════════

  const handleSettingChange = (key, value) => {
    dispatch(updateSettings({ [key]: value }));
  };

  const handleSaveSettings = async () => {
    try {
      await dispatch(saveAISettings(settings)).unwrap();
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (err) {
      setLocalError('Ayarlar kaydedilemedi');
    }
  };

  const handleResetSettings = () => {
    if (window.confirm('Tüm ayarları sıfırlamak istediğinizden emin misiniz?')) {
      dispatch(resetSettings());
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Tüm geçmişi silmek istediğinizden emin misiniz?')) {
      dispatch(clearHistory());
    }
  };

  const handleClearConversation = () => {
    dispatch(clearConversation());
    dispatch(clearError());
    setLocalError('');
  };

  // ═══════════════════════════════════════════════════════════════════
  // TTS HANDLER
  // ═══════════════════════════════════════════════════════════════════

  const handleSpeak = (text) => {
    if (!text) return;
    dispatch(speakText(text));
  };

  // ═══════════════════════════════════════════════════════════════════
  // DATA EXPORT
  // ═══════════════════════════════════════════════════════════════════

  const handleExportData = () => {
    const exportData = {
      history,
      stats,
      settings,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smarthub-ai-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ═══════════════════════════════════════════════════════════════════
  // EFFECTS
  // ═══════════════════════════════════════════════════════════════════

  // Load settings and history on mount
  useEffect(() => {
    dispatch(loadAISettings());
    dispatch(loadHistory());
    dispatch(checkSystemHealth());
  }, [dispatch]);

  // Periodic health check
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(checkSystemHealth());
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWave();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [stopWave]);

  // ═══════════════════════════════════════════════════════════════════
  // STATIC DATA
  // ═══════════════════════════════════════════════════════════════════

  const personalities = Object.entries(PERSONALITY_CONFIG).map(([id, config]) => ({
    id,
    name: config.name,
    desc: config.description,
    icon: <Bot />, // You can customize icons per personality
    color: config.color,
  }));

  const tabs = [
    { id: 'overview', label: 'Genel Bakış', icon: <BarChart3 /> },
    { id: 'voice', label: 'Ses Ayarları', icon: <Mic /> },
    { id: 'personality', label: 'Kişilik', icon: <Bot /> },
    { id: 'history', label: 'Geçmiş', icon: <Clock /> },
    { id: 'advanced', label: 'Gelişmiş', icon: <Settings /> },
  ];

  const quickActions = [
    {
      label: 'Ayarları Yükle',
      icon: <Download />,
      action: () => dispatch(loadAISettings()),
    },
    {
      label: 'Sistem Kontrolü',
      icon: <Activity />,
      action: () => dispatch(checkSystemHealth()),
    },
    {
      label: 'Verileri Dışa Aktar',
      icon: <Upload />,
      action: handleExportData,
    },
    {
      label: 'Fabrika Ayarları',
      icon: <RefreshCw />,
      action: handleResetSettings,
    },
  ];

  const getPersonalityColor = (color) =>
    ({
      blue: 'border-blue-500 bg-blue-500/5',
      green: 'border-green-500 bg-green-500/5',
      purple: 'border-purple-500 bg-purple-500/5',
    }[color] || 'border-blue-500 bg-blue-500/5');

  // ═══════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════

  return (
    <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen">
      <Sidebar />

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-8 right-8 z-50 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in">
          <CheckCircle2 size={24} />
          <div>
            <p className="font-bold">Başarılı!</p>
            <p className="text-sm">Ayarlar kaydedildi.</p>
          </div>
        </div>
      )}

      <main className="flex-1 lg:ml-0 overflow-x-hidden">
        <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white min-h-screen p-6 lg:p-12 transition-colors">
          {/* ══════════════════════════════════════════════════════════════
              HEADER
          ══════════════════════════════════════════════════════════════ */}
          <div className="max-w-7xl mx-auto mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 px-4 py-2 rounded-full text-xs font-bold border border-purple-500/20">
                  <Sparkles size={14} />
                  {settings.model} Aktif
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                  AI & Sesli Asistan
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  Evinizin zekasını ve konuşma tarzını buradan kişiselleştirin.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleClearConversation}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all text-slate-900 dark:text-white"
                >
                  <Database size={18} />
                  <span className="hidden sm:inline">Belleği Temizle</span>
                </button>
                <button
                  onClick={handleSaveSettings}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all text-white"
                >
                  <Save size={18} />
                  <span className="hidden sm:inline">
                    {loading ? 'Kaydediliyor...' : 'Kaydet'}
                  </span>
                </button>
              </div>
            </div>

            {/* ── Tabs ── */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 overflow-x-auto">
              <div className="flex gap-2 min-w-max">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              TAB CONTENT
          ══════════════════════════════════════════════════════════════ */}
          <div className="max-w-7xl mx-auto">
            {/* ════════════════════════════════════════════════════════════
                OVERVIEW TAB
            ════════════════════════════════════════════════════════════ */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  {/* Mic Hero Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-indigo-950/20 border border-blue-200 dark:border-slate-800 rounded-3xl p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                      <BrainCircuit
                        size={120}
                        className="text-blue-600 dark:text-white"
                      />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                      {/* Mic Button */}
                      <div className="relative">
                        <div
                          className={`w-32 h-32 rounded-full flex items-center justify-center border-4 transition-colors ${
                            isListening
                              ? 'border-blue-500/60 bg-blue-500/10'
                              : 'border-blue-500/30 bg-blue-600/20'
                          }`}
                        >
                          <button
                            onClick={toggleMic}
                            disabled={isProcessing}
                            className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                              isListening
                                ? 'bg-red-500 shadow-red-500/50 animate-pulse'
                                : 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/50 hover:scale-105'
                            }`}
                          >
                            {isListening ? (
                              <StopCircle size={36} className="text-white" />
                            ) : (
                              <Mic size={40} className="text-white" />
                            )}
                          </button>
                        </div>
                        {isListening && (
                          <div className="absolute inset-0 rounded-full border-4 border-blue-500 animate-ping" />
                        )}
                      </div>

                      <div className="flex-1 text-center md:text-left space-y-4">
                        {/* Transcript */}
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white italic tracking-wide min-h-[2rem]">
                          {transcript
                            ? `"${transcript}"`
                            : isListening
                            ? '"Sizi dinliyorum..."'
                            : '"Hey Evim, bir komut ver..."'}
                        </h2>

                        {/* AI Response */}
                        {(isProcessing || currentResponse) && (
                          <div
                            className={`bg-white/70 dark:bg-slate-950/50 rounded-2xl px-4 py-3 border border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 ${
                              isProcessing ? 'animate-pulse' : ''
                            }`}
                          >
                            {isProcessing
                              ? 'Yanıt üretiliyor...'
                              : currentResponse}
                          </div>
                        )}

                        {/* Error */}
                        {displayError && (
                          <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-2">
                            <AlertCircle size={16} />
                            {displayError}
                          </div>
                        )}

                        {/* Quick Stats */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                          {[
                            {
                              label: 'Gecikme',
                              value: stats.avgLatency
                                ? `${stats.avgLatency}ms`
                                : '—',
                              color: 'green',
                            },
                            {
                              label: 'Model',
                              value: settings.model.split('-')[1] || 'Claude',
                              color: 'blue',
                            },
                            {
                              label: 'Güven',
                              value: confidence
                                ? `${Math.round(confidence * 100)}%`
                                : '—',
                              color: 'purple',
                            },
                          ].map((s) => (
                            <div
                              key={s.label}
                              className="bg-white dark:bg-slate-950/50 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm"
                            >
                              <p className="text-[10px] text-slate-500 font-bold uppercase">
                                {s.label}
                              </p>
                              <p
                                className={`text-sm font-mono text-${s.color}-600 dark:text-${s.color}-400`}
                              >
                                {s.value}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Waveform */}
                        <div className="flex items-end gap-1 h-8">
                          {Array.from({ length: 12 }).map((_, i) => (
                            <div
                              key={i}
                              ref={(el) => (barRefs.current[i] = el)}
                              style={{
                                height:
                                  [6, 14, 8, 20, 10, 16, 6, 12, 18, 8, 22, 10][
                                    i
                                  ] + 'px',
                              }}
                              className={`w-1.5 rounded-full transition-colors ${
                                isListening
                                  ? 'bg-blue-500'
                                  : 'bg-slate-300 dark:bg-slate-700'
                              }`}
                            />
                          ))}
                        </div>

                        {/* TTS Controls */}
                        {currentResponse && (
                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => handleSpeak(currentResponse)}
                              disabled={isProcessing}
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all disabled:opacity-50 ${
                                isSpeaking
                                  ? 'bg-blue-100 dark:bg-blue-500/20 border-blue-300 dark:border-blue-500/30 text-blue-700 dark:text-blue-300'
                                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                              }`}
                            >
                              {isSpeaking ? (
                                <VolumeX size={16} />
                              ) : (
                                <Volume2 size={16} />
                              )}
                              {isSpeaking ? 'Durdur' : 'Sesli Oku'}
                            </button>
                            <button
                              onClick={() =>
                                navigator.clipboard.writeText(currentResponse)
                              }
                              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-400 transition-all"
                            >
                              <Copy size={16} />
                              Kopyala
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      {
                        label: 'Toplam İstek',
                        value: stats.total,
                        icon: <Activity />,
                        color: 'blue',
                      },
                      {
                        label: 'Başarılı',
                        value: stats.success,
                        icon: <CheckCircle2 />,
                        color: 'green',
                      },
                      {
                        label: 'Başarı Oranı',
                        value: `${stats.successRate}%`,
                        icon: <TrendingUp />,
                        color: 'purple',
                      },
                      {
                        label: 'Ort. Güven',
                        value: stats.avgConfidence
                          ? `${stats.avgConfidence}%`
                          : '—',
                        icon: <Gauge />,
                        color: 'orange',
                      },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-lg transition-all"
                      >
                        <div
                          className={`w-12 h-12 bg-${stat.color}-500/10 rounded-xl flex items-center justify-center mb-4`}
                        >
                          <div
                            className={`text-${stat.color}-600 dark:text-${stat.color}-400`}
                          >
                            {stat.icon}
                          </div>
                        </div>
                        <div className="text-3xl font-bold mb-1 text-slate-900 dark:text-white">
                          {stat.value}
                        </div>
                        <div className="text-xs text-slate-500">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
                    <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">
                      Hızlı İşlemler
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {quickActions.map((action, i) => (
                        <button
                          key={i}
                          onClick={action.action}
                          className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all group"
                        >
                          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                            {action.icon}
                          </div>
                          <span className="text-xs font-semibold text-center text-slate-700 dark:text-slate-300">
                            {action.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                  {/* System Status */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                      <Activity className="text-blue-600 dark:text-blue-500" />
                      Sistem Durumu
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          icon: (
                            <Server
                              size={18}
                              className="text-blue-600 dark:text-blue-400"
                            />
                          ),
                          label: 'API Bağlantısı',
                          value: systemStatus.apiConnected ? 'Online' : 'Offline',
                          ok: systemStatus.apiConnected,
                        },
                        {
                          icon: (
                            <Mic
                              size={18}
                              className="text-purple-600 dark:text-purple-400"
                            />
                          ),
                          label: 'Mikrofon',
                          value:
                            systemStatus.micPermission === null
                              ? 'Bilinmiyor'
                              : systemStatus.micPermission
                              ? 'Aktif'
                              : 'İzin Yok',
                          ok: systemStatus.micPermission === true,
                        },
                        {
                          icon: (
                            <Volume2
                              size={18}
                              className="text-green-600 dark:text-green-400"
                            />
                          ),
                          label: 'Ses Çıkışı',
                          value: settings.voiceEnabled ? 'Aktif' : 'Pasif',
                          ok: settings.voiceEnabled,
                        },
                      ].map((row, i, arr) => (
                        <div
                          key={i}
                          className={`flex items-center justify-between py-3 ${
                            i < arr.length - 1
                              ? 'border-b border-slate-200 dark:border-slate-800'
                              : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {row.icon}
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              {row.label}
                            </span>
                          </div>
                          <span
                            className={`text-xs font-mono ${
                              row.ok
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {row.value}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={toggleMic}
                      disabled={isProcessing}
                      className={`w-full mt-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                        isListening
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {isListening ? (
                        <>
                          <Waves size={18} className="animate-pulse" />
                          Dinleniyor — Durdur
                        </>
                      ) : (
                        <>
                          <Play size={18} />
                          Sesi Test Et
                        </>
                      )}
                    </button>
                  </div>

                  {/* Last Health Check */}
                  {systemStatus.lastHealthCheck && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-600/10 dark:to-transparent border border-blue-200 dark:border-blue-500/10 rounded-3xl p-8">
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                        <Activity className="text-blue-600 dark:text-blue-500" />
                        Son Kontrol
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                        {new Date(
                          systemStatus.lastHealthCheck
                        ).toLocaleString('tr-TR')}
                      </p>
                      <button
                        onClick={() => dispatch(checkSystemHealth())}
                        disabled={loading}
                        className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-xl text-sm font-semibold transition-colors"
                      >
                        Yeniden Kontrol Et
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════
                VOICE TAB
            ════════════════════════════════════════════════════════════ */}
            {activeTab === 'voice' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                  {/* Voice Output */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                      <Speaker className="text-blue-600 dark:text-blue-500" />
                      Ses Çıkışı
                    </h3>

                    <div className="space-y-4 mb-6">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Ses Seçimi
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {VOICES.map((voice) => (
                          <button
                            key={voice.id}
                            onClick={() =>
                              handleSettingChange('voice', voice.id)
                            }
                            className={`p-4 rounded-2xl border-2 text-left transition-all ${
                              settings.voice === voice.id
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Headphones
                                size={16}
                                className="text-blue-600 dark:text-blue-400"
                              />
                              <span className="font-semibold text-sm text-slate-900 dark:text-white">
                                {voice.name}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">
                              {voice.accent}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Volume Slider */}
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Ses Seviyesi
                        </label>
                        <span className="text-sm font-mono text-blue-600 dark:text-blue-400">
                          {settings.voiceVolume}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={settings.voiceVolume}
                        onChange={(e) =>
                          handleSettingChange(
                            'voiceVolume',
                            Number(e.target.value)
                          )
                        }
                        className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Sessiz</span>
                        <span>Orta</span>
                        <span>Yüksek</span>
                      </div>
                    </div>

                    {/* Response Speed Slider */}
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Yanıt Hızı
                        </label>
                        <span className="text-sm font-mono text-purple-600 dark:text-purple-400">
                          {settings.responseSpeed}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={settings.responseSpeed}
                        onChange={(e) =>
                          handleSettingChange(
                            'responseSpeed',
                            Number(e.target.value)
                          )
                        }
                        className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Yavaş</span>
                        <span>Normal</span>
                        <span>Hızlı</span>
                      </div>
                    </div>
                  </div>

                  {/* Language Settings */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                      <LangIcon className="text-blue-600 dark:text-blue-500" />
                      Dil Ayarları
                    </h3>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-3">
                      Asistan Dili
                    </label>
                    <div className="relative">
                      <select
                        value={settings.language}
                        onChange={(e) =>
                          handleSettingChange('language', e.target.value)
                        }
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 appearance-none"
                      >
                        {Object.entries(LANGUAGES).map(([key, value]) => (
                          <option key={key} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                      <LangIcon
                        size={16}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Voice Input */}
                <div className="space-y-8">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                      <Mic2 className="text-blue-600 dark:text-blue-500" />
                      Ses Girişi
                    </h3>

                    {/* Wake Word Sensitivity */}
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Uyandırma Kelimesi Hassasiyeti
                        </label>
                        <span className="text-sm font-mono text-green-600 dark:text-green-400">
                          {settings.wakeWordSensitivity}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={settings.wakeWordSensitivity}
                        onChange={(e) =>
                          handleSettingChange(
                            'wakeWordSensitivity',
                            Number(e.target.value)
                          )
                        }
                        className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-green-600"
                      />
                      <p className="text-xs text-slate-500">
                        Yüksek hassasiyet: Daha kolay uyandırma, daha fazla
                        yanlış tetikleme
                      </p>
                    </div>

                    {/* Toggles */}
                    <div className="space-y-4">
                      {[
                        {
                          icon: (
                            <Ear
                              size={18}
                              className="text-slate-600 dark:text-slate-400"
                            />
                          ),
                          label: 'Sürekli Dinleme',
                          key: 'voiceEnabled',
                          value: settings.voiceEnabled,
                        },
                        {
                          icon: (
                            <Shield
                              size={18}
                              className="text-slate-600 dark:text-slate-400"
                            />
                          ),
                          label: 'Gizlilik Modu',
                          key: 'privacyMode',
                          value: settings.privacyMode,
                          color: 'bg-purple-600',
                        },
                        {
                          icon: (
                            <Zap
                              size={18}
                              className="text-slate-600 dark:text-slate-400"
                            />
                          ),
                          label: 'Otomatik Gönder',
                          key: 'autoSend',
                          value: settings.autoSend,
                        },
                        {
                          icon: (
                            <Volume2
                              size={18}
                              className="text-slate-600 dark:text-slate-400"
                            />
                          ),
                          label: 'Oto Sesli Yanıt',
                          key: 'autoTts',
                          value: settings.autoTts,
                        },
                      ].map((row) => (
                        <div
                          key={row.key}
                          className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl"
                        >
                          <div className="flex items-center gap-3">
                            {row.icon}
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              {row.label}
                            </span>
                          </div>
                          <Toggle
                            on={row.value}
                            onChange={(val) =>
                              handleSettingChange(row.key, val)
                            }
                            color={row.color}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Privacy Mode Info */}
                  {settings.privacyMode && (
                    <div className="bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-3xl p-6">
                      <div className="flex items-start gap-3">
                        <Info
                          className="text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1"
                          size={20}
                        />
                        <div>
                          <h4 className="font-bold text-purple-900 dark:text-purple-400 mb-2">
                            Gizlilik Modu Aktif
                          </h4>
                          <p className="text-sm text-purple-700 dark:text-purple-300 leading-relaxed">
                            Bu modda ses kayıtları cihazda işlenir ve buluta
                            gönderilmez. Sadece metin formatında komutlar
                            iletilir.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════
                PERSONALITY TAB
            ════════════════════════════════════════════════════════════ */}
            {activeTab === 'personality' && (
              <div className="space-y-8">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
                  <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
                    Asistan Kişiliği
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {personalities.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          handleSettingChange('personality', p.id);
                          dispatch(clearConversation());
                        }}
                        className={`p-8 rounded-3xl border-2 text-left transition-all hover:scale-105 ${
                          settings.personality === p.id
                            ? getPersonalityColor(p.color)
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div
                          className={`w-16 h-16 bg-${p.color}-500/10 rounded-2xl flex items-center justify-center mb-4 text-${p.color}-600 dark:text-${p.color}-400`}
                        >
                          {p.icon}
                        </div>
                        <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">
                          {p.name}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {p.desc}
                        </p>
                      </button>
                    ))}
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                    <h4 className="font-bold mb-4 text-slate-900 dark:text-white">
                      Örnek Yanıtlar
                    </h4>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageSquare
                          size={16}
                          className="text-blue-600 dark:text-blue-400"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                          Siz: "Işıkları aç"
                        </p>
                        <p className="text-sm text-slate-900 dark:text-white font-semibold">
                          {
                            PERSONALITY_CONFIG[settings.personality || 'professional']
                              .example
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                        Otomatik Öğrenme
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Asistan kullanım alışkanlıklarınızdan öğrenir ve
                        zamanla daha kişisel yanıtlar verir.
                      </p>
                    </div>
                    <Toggle
                      on={settings.autoLearning}
                      onChange={(val) =>
                        handleSettingChange('autoLearning', val)
                      }
                      color="bg-green-600"
                    />
                  </div>
                  {settings.autoLearning && (
                    <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl p-4">
                      <div className="flex items-start gap-3">
                        <BrainCircuit
                          className="text-green-600 dark:text-green-400 flex-shrink-0 mt-1"
                          size={20}
                        />
                        <div>
                          <h4 className="font-bold text-green-900 dark:text-green-400 mb-1 text-sm">
                            Öğrenme Aktif
                          </h4>
                          <p className="text-xs text-green-700 dark:text-green-300">
                            Bu oturumda {stats.total} komut işlendi. Konuşma
                            bağlamı korunuyor.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════
                HISTORY TAB
            ════════════════════════════════════════════════════════════ */}
            {activeTab === 'history' && (
              <div className="space-y-8">
                {/* Search & Filter */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
                  <div className="flex flex-wrap gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="Komutlarda ara..."
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      <Filter size={18} />
                      Filtrele
                    </button>
                  </div>
                </div>

                {/* History List */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      <Clock className="text-blue-600 dark:text-blue-500" />
                      Komut Geçmişi ({history.length})
                    </h3>
                    <button
                      onClick={handleClearHistory}
                      disabled={history.length === 0}
                      className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Tümünü Temizle
                    </button>
                  </div>

                  {history.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">
                      <Mic size={40} className="mx-auto mb-4 opacity-30" />
                      <p className="text-sm">
                        Henüz komut geçmişi yok. Mikrofona tıklayarak başlayın.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {history.map((log) => (
                        <div
                          key={log.id}
                          className={`flex gap-4 p-6 rounded-2xl border-2 transition-all hover:shadow-lg ${
                            log.status === 'success'
                              ? 'bg-green-50 dark:bg-green-500/5 border-green-200 dark:border-green-500/20'
                              : 'bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/20'
                          }`}
                        >
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                              log.status === 'success'
                                ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                                : 'bg-red-500/10 text-red-600 dark:text-red-400'
                            }`}
                          >
                            {log.status === 'success' ? (
                              <CheckCircle2 size={22} />
                            ) : (
                              <AlertCircle size={22} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-600 dark:text-slate-400 italic mb-2">
                              "{log.user}"
                            </p>
                            <p className="text-sm text-slate-900 dark:text-white font-semibold mb-3">
                              {log.ai}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {log.time}
                              </span>
                              {log.confidence !== undefined && (
                                <span
                                  className={`font-mono ${
                                    log.confidence > 0.9
                                      ? 'text-green-600 dark:text-green-400'
                                      : 'text-orange-600 dark:text-orange-400'
                                  }`}
                                >
                                  Güven: %{Math.round(log.confidence * 100)}
                                </span>
                              )}
                              {log.latency && (
                                <span className="font-mono text-blue-600 dark:text-blue-400">
                                  {log.latency}ms
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => navigator.clipboard.writeText(log.ai)}
                              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                              title="Kopyala"
                            >
                              <Copy size={18} />
                            </button>
                            <button
                              onClick={() => dispatch(removeHistoryItem(log.id))}
                              className="text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                              title="Sil"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════
                ADVANCED TAB
            ════════════════════════════════════════════════════════════ */}
            {activeTab === 'advanced' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                  {/* Model Settings */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
                    <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">
                      Model Ayarları
                    </h3>

                    {/* Model Selection */}
                    <div className="mb-6">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block">
                        AI Modeli
                      </label>
                      <select
                        value={settings.model}
                        onChange={(e) =>
                          handleSettingChange('model', e.target.value)
                        }
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      >
                        {Object.entries(AI_MODELS).map(([key, value]) => (
                          <option key={key} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Temperature */}
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Sıcaklık (Temperature)
                        </label>
                        <span className="text-sm font-mono text-blue-600 dark:text-blue-400">
                          {settings.temperature}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={settings.temperature}
                        onChange={(e) =>
                          handleSettingChange(
                            'temperature',
                            Number(e.target.value)
                          )
                        }
                        className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <p className="text-xs text-slate-500">
                        Düşük: Daha tutarlı, Yüksek: Daha yaratıcı yanıtlar
                      </p>
                    </div>

                    {/* Max Tokens */}
                    <div className="mb-6">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block">
                        Maksimum Token Sayısı
                      </label>
                      <input
                        type="number"
                        min="100"
                        max="4000"
                        step="100"
                        value={settings.maxTokens}
                        onChange={(e) =>
                          handleSettingChange('maxTokens', Number(e.target.value))
                        }
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Top P */}
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Top P (Nucleus Sampling)
                        </label>
                        <span className="text-sm font-mono text-purple-600 dark:text-purple-400">
                          {settings.topP}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={settings.topP}
                        onChange={(e) =>
                          handleSettingChange('topP', Number(e.target.value))
                        }
                        className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                    </div>
                  </div>

                  {/* Warning */}
                  <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-3xl p-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle
                        className="text-orange-600 dark:text-orange-400 flex-shrink-0 mt-1"
                        size={20}
                      />
                      <div>
                        <h4 className="font-bold text-orange-900 dark:text-orange-400 mb-2">
                          Dikkat!
                        </h4>
                        <p className="text-sm text-orange-700 dark:text-orange-300 leading-relaxed">
                          Gelişmiş ayarları değiştirmek asistanın performansını
                          etkileyebilir. Varsayılan değerleri kullanmanız
                          önerilir.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Data Management */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
                    <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">
                      Veri Yönetimi
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          icon: (
                            <Download className="text-blue-600 dark:text-blue-400" size={18} />
                          ),
                          label: 'Verileri Dışa Aktar',
                          action: handleExportData,
                          danger: false,
                        },
                        {
                          icon: (
                            <Upload className="text-green-600 dark:text-green-400" size={18} />
                          ),
                          label: 'Yedek Yükle',
                          action: () => console.log('upload'),
                          danger: false,
                        },
                        {
                          icon: (
                            <Trash2 className="text-red-600 dark:text-red-400" size={18} />
                          ),
                          label: 'Tüm Verileri Sil',
                          action: () => {
                            if (
                              window.confirm(
                                'Tüm verileri silmek istediğinizden emin misiniz?'
                              )
                            ) {
                              dispatch(clearHistory());
                              dispatch(clearConversation());
                            }
                          },
                          danger: true,
                        },
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={item.action}
                          className={`w-full flex items-center justify-between p-4 rounded-2xl transition-colors ${
                            item.danger
                              ? 'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20'
                              : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {item.icon}
                            <span
                              className={`text-sm font-semibold ${
                                item.danger
                                  ? 'text-red-900 dark:text-red-400'
                                  : 'text-slate-900 dark:text-white'
                              }`}
                            >
                              {item.label}
                            </span>
                          </div>
                          <ChevronRight
                            size={18}
                            className={
                              item.danger ? 'text-red-400' : 'text-slate-400'
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* System Info */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
                    <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">
                      Sistem Bilgisi
                    </h3>
                    <div className="space-y-3 text-sm">
                      {[
                        { label: 'Aktif Model', value: settings.model },
                        {
                          label: 'Kişilik',
                          value: PERSONALITY_CONFIG[settings.personality].name,
                        },
                        { label: 'Bu Oturum', value: `${stats.total} komut` },
                        {
                          label: 'Başarı Oranı',
                          value: `${stats.successRate}%`,
                        },
                        {
                          label: 'Ort. Gecikme',
                          value: stats.avgLatency
                            ? `${stats.avgLatency}ms`
                            : '—',
                        },
                        {
                          label: 'Ort. Güven',
                          value: stats.avgConfidence
                            ? `${stats.avgConfidence}%`
                            : '—',
                        },
                      ].map((row, i, arr) => (
                        <div
                          key={row.label}
                          className={`flex justify-between py-2 ${
                            i < arr.length - 1
                              ? 'border-b border-slate-200 dark:border-slate-800'
                              : ''
                          }`}
                        >
                          <span className="text-slate-600 dark:text-slate-400">
                            {row.label}
                          </span>
                          <span className="font-mono text-slate-900 dark:text-white">
                            {row.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
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

export default AIVoiceConfig;