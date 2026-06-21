import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = "https://backend-d72l.onrender.com";

const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
        headers: { 
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token?.trim()}`
        },
        withCredentials: true
    };
};

export const AI_MODELS = {
    CLAUDE_SONNET: 'claude-sonnet-4-20250514',
    CLAUDE_OPUS: 'claude-opus-4-20250514',
    GPT4: 'gpt-4-turbo',
};

export const PERSONALITIES = {
    PROFESSIONAL: 'professional',
    FRIENDLY: 'friendly',
    HUMOROUS: 'humorous',
};

export const PERSONALITY_CONFIG = {
    professional: {
        name: 'Profesyonel',
        description: 'Kısa, öz ve net yanıtlar.',
        systemPrompt: 'Sen profesyonel ve öz yanıtlar veren bir akıllı ev asistanısın. Kısa ve net ol. Maksimum 2 cümle.',
        icon: 'Bot',
        color: 'blue',
        example: 'Işıklar açılıyor.',
    },
    friendly: {
        name: 'Samimi',
        description: 'Daha sıcak ve insansı bir dil.',
        systemPrompt: 'Sen sıcak, samimi ve yardımsever bir akıllı ev asistanısın. Biraz daha kişisel ve konuşkan ol.',
        icon: 'MessageSquare',
        color: 'green',
        example: 'Tamam! Işıkları hemen açıyorum.',
    },
    humorous: {
        name: 'Esprili',
        description: 'Şakacı ve eğlenceli etkileşim.',
        systemPrompt: 'Sen eğlenceli ve biraz esprili bir akıllı ev asistanısın. Yanıtlara hafif bir mizah katabilirsin ama yardımcı olmayı unutma.',
        icon: 'Sparkles',
        color: 'purple',
        example: 'Işıkları açtım! Artık karanlıkta değilsiniz 😄',
    },
};

export const LANGUAGES = {
    TR: 'tr-TR',
    EN_US: 'en-US',
    EN_GB: 'en-GB',
    DE: 'de-DE',
    FR: 'fr-FR',
};

export const VOICES = [
    { id: 'female1', name: 'Ayşe (Kadın)', lang: 'tr', accent: 'İstanbul' },
    { id: 'male1', name: 'Mehmet (Erkek)', lang: 'tr', accent: 'Ankara' },
    { id: 'female2', name: 'Emma (Female)', lang: 'en', accent: 'US' },
    { id: 'male2', name: 'David (Male)', lang: 'en', accent: 'UK' },
];

export const AI_SETTINGS_DEFAULTS = {
    personality: 'professional',
    language: 'tr-TR',
    voice: 'female1',
    voiceEnabled: true,
    autoLearning: true,
    autoSend: true,
    autoTts: false,
    wakeWordSensitivity: 75,
    responseSpeed: 50,
    voiceVolume: 80,
    privacyMode: false,
    model: AI_MODELS.CLAUDE_SONNET,
    temperature: 0.7,
    maxTokens: 1000,
    topP: 0.9,
};

const MAX_HISTORY = 50;
const MAX_CONVERSATION = 20;

const formatConversationHistory = (messages, limit = MAX_CONVERSATION) => {
    return messages.slice(-limit).map(msg => ({
        role: msg.role,
        content: msg.content,
    }));
};

const buildSystemPrompt = (personality) => {
    const config = PERSONALITY_CONFIG[personality];
    const basePrompt = config.systemPrompt;
    return `${basePrompt} Türkçe konuş. Akıllı ev komutlarına, günlük sorulara ve genel sorulara yanıt ver.`;
};

const calculateConfidence = (textLength, hasResponse) => {
    if (!hasResponse) return 0;
    const baseConfidence = 0.75;
    const lengthBonus = Math.min(0.2, textLength / 1000);
    const randomFactor = Math.random() * 0.05;
    return Math.min(0.99, baseConfidence + lengthBonus + randomFactor);
};

const createCommandHistoryEntry = (userInput, aiResponse, confidence, status = 'success') => {
    return {
        id: Date.now() + Math.random(),
        user: userInput,
        ai: aiResponse,
        confidence: confidence,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
        status: status,
    };
};

const calculateStats = (history) => {
    const total = history.length;
    const success = history.filter(h => h.status === 'success').length;
    const failed = total - success;
    
    const latencies = history.filter(h => h.latency).map(h => h.latency);
    const avgLatency = latencies.length ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : 0;
    
    const confidences = history.filter(h => h.confidence).map(h => h.confidence);
    const avgConfidence = confidences.length ? Math.round((confidences.reduce((a, b) => a + b, 0) / confidences.length) * 100) : 0;
    
    return {
        total,
        success,
        failed,
        successRate: total ? Math.round((success / total) * 100) : 0,
        avgLatency,
        avgConfidence,
    };
};

const saveSettingsToLocalStorage = (settings) => {
    try {
        localStorage.setItem('aiSettings', JSON.stringify(settings));
        return true;
    } catch (error) {
        console.error('AI ayarları kaydedilemedi:', error);
        return false;
    }
};

const loadSettingsFromLocalStorage = () => {
    try {
        const saved = localStorage.getItem('aiSettings');
        return saved ? JSON.parse(saved) : null;
    } catch (error) {
        console.error('AI ayarları yüklenemedi:', error);
        return null;
    }
};

const savedSettings = loadSettingsFromLocalStorage();

const initialState = {
    conversation: {
        messages: [],
        transcript: '',
        currentResponse: '',
        isListening: false,
        isSpeaking: false,
        isProcessing: false,
        confidence: null,
    },
    settings: savedSettings || AI_SETTINGS_DEFAULTS,
    history: [],
    stats: {
        total: 0,
        success: 0,
        failed: 0,
        successRate: 0,
        avgLatency: 0,
        avgConfidence: 0,
        todayCount: 0,
    },
    systemStatus: {
        apiConnected: true,
        micPermission: null,
        lastHealthCheck: null,
    },
    loading: false,
    error: null,
};

export const sendMessageToAI = createAsyncThunk(
    'ai/sendMessage',
    async ({ message, includeHistory = true }, { getState, rejectWithValue }) => {
        const startTime = Date.now();
        
        try {
            const state = getState().ai;
            const { conversation, settings } = state;

            let messages = includeHistory 
                ? formatConversationHistory([
                    ...conversation.messages,
                    { role: 'user', content: message }
                ])
                : [{ role: 'user', content: message }];

            const { data } = await axios.post(
                `${BASE_URL}/ai/chat`, 
                {
                    model: settings.model,
                    messages,
                    systemPrompt: buildSystemPrompt(settings.personality),
                    maxTokens: settings.maxTokens,
                    temperature: settings.temperature,
                    topP: settings.topP,
                },
                getAuthConfig()
            );

            const latency = Date.now() - startTime;
            const confidence = calculateConfidence(message.length, !!data.response);

            return {
                userMessage: message,
                aiResponse: data.response,
                latency,
                confidence,
                timestamp: Date.now(),
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'AI yanıt veremedi' });
        }
    }
);

export const saveAISettings = createAsyncThunk(
    'ai/saveSettings',
    async (settings, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(
                `${BASE_URL}/ai/settings`, 
                settings, 
                getAuthConfig()
            );
            
            saveSettingsToLocalStorage(settings);
            return data.settings;
        } catch (error) {
            saveSettingsToLocalStorage(settings);
            return rejectWithValue(error.response?.data || { message: 'Ayarlar kısmen kaydedildi' });
        }
    }
);

export const loadAISettings = createAsyncThunk(
    'ai/loadSettings',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${BASE_URL}/ai/settings`, getAuthConfig());
            saveSettingsToLocalStorage(data.settings);
            return data.settings;
        } catch (error) {
            const localSettings = loadSettingsFromLocalStorage();
            if (localSettings) return localSettings;
            return rejectWithValue(error.response?.data || { message: 'Ayarlar yüklenemedi' });
        }
    }
);

export const loadHistory = createAsyncThunk(
    'ai/loadHistory',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${BASE_URL}/ai/history`, getAuthConfig());
            return data.history || [];
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Geçmiş yüklenemedi' });
        }
    }
);

export const checkSystemHealth = createAsyncThunk(
    'ai/healthCheck',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${BASE_URL}/ai/health`, getAuthConfig());
            return {
                apiConnected: data.status === 'ok',
                lastHealthCheck: Date.now(),
                details: data,
            };
        } catch (error) {
            return rejectWithValue({
                apiConnected: false,
                lastHealthCheck: Date.now(),
                error: error.message,
            });
        }
    }
);

export const speakText = createAsyncThunk(
    'ai/speak',
    async (text, { getState, rejectWithValue }) => {
        try {
            const { settings } = getState().ai;
            
            if (!window.speechSynthesis) {
                throw new Error('TTS desteklenmiyor');
            }

            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = settings.language;
            utterance.volume = settings.voiceVolume / 100;
            utterance.rate = 0.8 + (settings.responseSpeed / 100) * 0.7;
            utterance.pitch = 1.0;

            return new Promise((resolve, reject) => {
                utterance.onend = () => resolve({ success: true });
                utterance.onerror = (e) => reject(e);
                window.speechSynthesis.speak(utterance);
            });
        } catch (error) {
            return rejectWithValue({ message: error.message || 'TTS hatası' });
        }
    }
);

// ═══════════════════════════════════════════════════════════════════
// SLICE
// ═══════════════════════════════════════════════════════════════════

export const aiSlice = createSlice({
    name: 'ai',
    initialState,
    reducers: {
        setTranscript: (state, action) => {
            state.conversation.transcript = action.payload;
        },
        setListening: (state, action) => {
            state.conversation.isListening = action.payload;
            if (!action.payload) {
                state.conversation.transcript = '';
            }
        },
        setSpeaking: (state, action) => {
            state.conversation.isSpeaking = action.payload;
        },
        clearConversation: (state) => {
            state.conversation.messages = [];
            state.conversation.transcript = '';
            state.conversation.currentResponse = '';
            state.conversation.confidence = null;
        },
        updateSettings: (state, action) => {
            state.settings = { ...state.settings, ...action.payload };
            saveSettingsToLocalStorage(state.settings);
        },
        resetSettings: (state) => {
            state.settings = AI_SETTINGS_DEFAULTS;
            saveSettingsToLocalStorage(AI_SETTINGS_DEFAULTS);
        },
        clearHistory: (state) => {
            state.history = [];
            state.stats = {
                total: 0,
                success: 0,
                failed: 0,
                successRate: 0,
                avgLatency: 0,
                avgConfidence: 0,
                todayCount: 0,
            };
        },
        removeHistoryItem: (state, action) => {
            state.history = state.history.filter(item => item.id !== action.payload);
            state.stats = calculateStats(state.history);
        },
        setMicPermission: (state, action) => {
            state.systemStatus.micPermission = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(sendMessageToAI.pending, (state) => {
            state.loading = true;
            state.conversation.isProcessing = true;
            state.error = null;
        });
        builder.addCase(sendMessageToAI.fulfilled, (state, action) => {
            state.loading = false;
            state.conversation.isProcessing = false;
            
            const { userMessage, aiResponse, latency, confidence, timestamp } = action.payload;

            state.conversation.messages.push(
                { role: 'user', content: userMessage },
                { role: 'assistant', content: aiResponse }
            );
            
            state.conversation.currentResponse = aiResponse;
            state.conversation.confidence = confidence;

            const historyEntry = createCommandHistoryEntry(userMessage, aiResponse, confidence, 'success');
            historyEntry.latency = latency;
            historyEntry.timestamp = timestamp;
            
            state.history = [historyEntry, ...state.history.slice(0, MAX_HISTORY - 1)];
            state.stats = calculateStats(state.history);
            state.stats.todayCount += 1;
        });
        builder.addCase(sendMessageToAI.rejected, (state, action) => {
            state.loading = false;
            state.conversation.isProcessing = false;
            state.error = action.payload;

            if (action.meta.arg?.message) {
                const historyEntry = createCommandHistoryEntry(
                    action.meta.arg.message,
                    'Hata oluştu',
                    0,
                    'error'
                );
                historyEntry.error = action.payload?.message;
                state.history = [historyEntry, ...state.history.slice(0, MAX_HISTORY - 1)];
                state.stats = calculateStats(state.history);
            }
        });

        builder.addCase(saveAISettings.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(saveAISettings.fulfilled, (state, action) => {
            state.loading = false;
            state.settings = action.payload;
        });
        builder.addCase(saveAISettings.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        builder.addCase(loadAISettings.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(loadAISettings.fulfilled, (state, action) => {
            state.loading = false;
            state.settings = action.payload;
        });
        builder.addCase(loadAISettings.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        builder.addCase(loadHistory.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(loadHistory.fulfilled, (state, action) => {
            state.loading = false;
            state.history = action.payload.slice(0, MAX_HISTORY);
            state.stats = calculateStats(state.history);
        });
        builder.addCase(loadHistory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        builder.addCase(checkSystemHealth.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(checkSystemHealth.fulfilled, (state, action) => {
            state.loading = false;
            state.systemStatus = { ...state.systemStatus, ...action.payload };
        });
        builder.addCase(checkSystemHealth.rejected, (state, action) => {
            state.loading = false;
            state.systemStatus = {
                ...state.systemStatus,
                apiConnected: false,
                lastHealthCheck: Date.now(),
            };
        });

        builder.addCase(speakText.pending, (state) => {
            state.conversation.isSpeaking = true;
        });
        builder.addCase(speakText.fulfilled, (state) => {
            state.conversation.isSpeaking = false;
        });
        builder.addCase(speakText.rejected, (state, action) => {
            state.conversation.isSpeaking = false;
            state.error = action.payload;
        });
    },
});

export const { setTranscript, setListening, setSpeaking, clearConversation, updateSettings, resetSettings, clearHistory, removeHistoryItem, setMicPermission, clearError } = aiSlice.actions;
export default aiSlice.reducer;