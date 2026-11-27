import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BookOpen, Sparkles, FileText, Wrench, Video, Plus, Pencil, Trash2, Eye, EyeOff, X, Upload, ExternalLink, AlertTriangle, RefreshCw, Loader2, Database } from 'lucide-react';

import EditorSidebar from '../../layout/EditorSidebar';
import { fetchEditorGuides, createGuideItem, updateGuideItem, deleteGuideItem, uploadCatalogFile, seedDefaultGuides, clearGuidesError } from '../../redux/guidesSlice';
import { DEFAULT_GUIDES_CONTENT, EMPTY_ITEM, GUIDE_ICONS, CATALOG_COLORS, VIDEO_TYPES, iconFor, parseYoutubeId, sortByOrder } from '../../data/guidesContent';

const TABS = [
  { key: 'catalogs', label: 'Kataloglar', icon: FileText, singular: 'Katalog' },
  { key: 'installs', label: 'Kurulum Rehberleri', icon: Wrench, singular: 'Kurulum Rehberi' },
  { key: 'videos', label: 'Videolar', icon: Video, singular: 'Video' },
];

const DIFFICULTIES = ['Kolay', 'Orta', 'Elektrik bilgisi gerekir'];

const inputClass = 'w-full rounded-xl border px-4 py-2.5 text-sm bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-700 focus:outline-none focus:border-blue-500';
const labelClass = 'block text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-slate-400 mb-1.5';

const idOf = (x) => x?._id ?? x?.id;
const lines = (text) => String(text ?? '').split('\n').map((l) => l.trim()).filter(Boolean);

const Field = ({ label, children, className = '' }) => (
  <label className={`block ${className}`}>
    <span className={labelClass}>{label}</span>
    {children}
  </label>
);

// Sunucuya gönderilecek kaydı formdan oluşturur
const toPayload = (section, form) => {

  const base = { title: form.title.trim(), order: Number(form.order) || 0, isPublished: Boolean(form.isPublished) };

  if (section === 'catalogs') {
    return { ...base, description: form.description.trim(), pages: form.pages === '' ? null : Number(form.pages), fileUrl: form.fileUrl.trim(), color: form.color };
  }
  if (section === 'installs') {
    return { ...base, icon: form.icon, category: form.category.trim(), duration: form.duration.trim(), difficulty: form.difficulty, tools: lines(form.toolsText), steps: lines(form.stepsText), warning: form.warning.trim() };
  }
  return { ...base, type: form.type, duration: form.duration.trim(), youtubeId: parseYoutubeId(form.youtubeId) };
};

const toForm = (section, item) => {

  const merged = { ...EMPTY_ITEM[section], ...item };
  if (section === 'installs') return { ...merged, toolsText: (merged.tools ?? []).join('\n'), stepsText: (merged.steps ?? []).join('\n') };
  if (section === 'catalogs') return { ...merged, pages: merged.pages ?? '' };
  return merged;
};

const validate = (section, form) => {

  if (!form.title.trim()) return 'Başlık gerekli.';
  if (section === 'installs' && !lines(form.stepsText).length) return 'En az bir kurulum adımı yazın.';
  if (section === 'videos' && form.youtubeId.trim() && !parseYoutubeId(form.youtubeId)) return 'YouTube adresi tanınmadı.';
  return null;
};

const ItemModal = ({ section, initial, onClose, onSave, saving, error }) => {

  const dispatch = useDispatch();
  const [form, setForm] = useState(() => toForm(section, initial ?? {}));
  const [localError, setLocalError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const tab = TABS.find((t) => t.key === section);
  const youtubeId = section === 'videos' ? parseYoutubeId(form.youtubeId) : '';

  const handleUpload = async (e) => {

    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setLocalError(null);
    try {
      const url = await dispatch(uploadCatalogFile(file)).unwrap();
      if (url) setForm((f) => ({ ...f, fileUrl: url }));
    } catch (err) {
      setLocalError(typeof err === 'string' ? err : 'Dosya yüklenemedi.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const submit = (e) => {

    e.preventDefault();
    const problem = validate(section, form);
    if (problem) return setLocalError(problem);
    setLocalError(null);
    onSave(toPayload(section, form));
  };

  return (

    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>

      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-2xl">

        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-10">
          <h2 className="text-lg font-bold">{initial && idOf(initial) ? `${tab.singular} Düzenle` : `Yeni ${tab.singular}`}</h2>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800" aria-label="Kapat"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-4">

          <Field label="Başlık"><input className={inputClass} value={form.title} onChange={set('title')} autoFocus /></Field>

          {section === 'catalogs' && (
            <>
              <Field label="Açıklama"><textarea className={inputClass} rows={3} value={form.description} onChange={set('description')} /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Sayfa sayısı"><input type="number" min="0" className={inputClass} value={form.pages} onChange={set('pages')} /></Field>
                <Field label="Renk">
                  <select className={inputClass} value={form.color} onChange={set('color')}>
                    {Object.keys(CATALOG_COLORS).map((c) => <option key={c} value={c}>{{ blue: 'Mavi', purple: 'Mor', green: 'Yeşil', orange: 'Turuncu' }[c] ?? c}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="PDF adresi">
                <div className="flex gap-2">
                  <input className={inputClass} value={form.fileUrl} onChange={set('fileUrl')} placeholder="https://... veya /catalogs/katalog.pdf" />
                  <label className={`flex items-center gap-2 px-4 rounded-xl text-sm font-semibold whitespace-nowrap cursor-pointer bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
                    {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}Yükle
                    <input type="file" accept="application/pdf" className="hidden" onChange={handleUpload} />
                  </label>
                </div>
                <span className="text-xs text-gray-400 mt-1 block">Boş bırakılırsa sitede "Yakında" görünür.</span>
              </Field>
            </>
          )}

          {section === 'installs' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Kategori"><input className={inputClass} value={form.category} onChange={set('category')} placeholder="Aydınlatma, Güvenlik..." /></Field>
                <Field label="İkon">
                  <select className={inputClass} value={form.icon} onChange={set('icon')}>
                    {Object.entries(GUIDE_ICONS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </Field>
                <Field label="Süre"><input className={inputClass} value={form.duration} onChange={set('duration')} placeholder="20 dk" /></Field>
                <Field label="Zorluk">
                  <select className={inputClass} value={form.difficulty} onChange={set('difficulty')}>
                    {[...new Set([...DIFFICULTIES, form.difficulty].filter(Boolean))].map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Gerekenler (her satıra bir tane)"><textarea className={inputClass} rows={3} value={form.toolsText} onChange={set('toolsText')} /></Field>
              <Field label="Kurulum adımları (her satıra bir adım)"><textarea className={inputClass} rows={7} value={form.stepsText} onChange={set('stepsText')} /></Field>
              <Field label="Uyarı (isteğe bağlı)"><input className={inputClass} value={form.warning} onChange={set('warning')} /></Field>
            </>
          )}

          {section === 'videos' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Tür">
                  <select className={inputClass} value={form.type} onChange={set('type')}>
                    {VIDEO_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="Süre (isteğe bağlı)"><input className={inputClass} value={form.duration} onChange={set('duration')} placeholder="12:34" /></Field>
              </div>
              <Field label="YouTube adresi">
                <input className={inputClass} value={form.youtubeId} onChange={set('youtubeId')} placeholder="https://www.youtube.com/watch?v=..." />
                <span className="text-xs text-gray-400 mt-1 block">Boş bırakılırsa sitede "Yakında" görünür.</span>
              </Field>
              {youtubeId && <img src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`} alt="Video önizleme" className="w-64 aspect-video object-cover rounded-xl border border-gray-200 dark:border-slate-700" />}
            </>
          )}

          <div className="grid grid-cols-2 gap-4 items-end">
            <Field label="Sıra"><input type="number" className={inputClass} value={form.order} onChange={set('order')} /></Field>
            <label className="flex items-center gap-3 py-2.5 cursor-pointer">
              <input type="checkbox" checked={form.isPublished} onChange={set('isPublished')} className="w-5 h-5 accent-blue-600" />
              <span className="text-sm font-semibold">Sitede yayınla</span>
            </label>
          </div>

          {(localError || error) && (
            <div className="flex gap-2 p-3 rounded-xl text-sm bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"><AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />{localError || error}</div>
          )}

        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700">Vazgeç</button>
          <button type="submit" disabled={saving || uploading} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60 flex items-center gap-2">
            {saving && <Loader2 size={16} className="animate-spin" />}Kaydet
          </button>
        </div>

      </form>

    </div>
  );
};

const describe = (section, item) => {

  if (section === 'catalogs') return [item.pages ? `${item.pages} sayfa` : null, item.fileUrl ? 'PDF eklendi' : 'PDF yok'].filter(Boolean).join(' · ');
  if (section === 'installs') return [item.category, item.duration, `${item.steps?.length ?? 0} adım`].filter(Boolean).join(' · ');
  return [item.type, item.youtubeId ? 'YouTube' : 'Video yok', item.duration].filter(Boolean).join(' · ');
};

const EditorGuides = () => {

  const dispatch = useDispatch();
  const { editor, editorLoaded, editorLoading, editorError, saving, saveError } = useSelector((state) => state.guides);

  const [activeTab, setActiveTab] = useState('catalogs');
  const [modal, setModal] = useState(null); // { item } — item boşsa yeni kayıt
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {

    dispatch(fetchEditorGuides());
  }, [dispatch]);

  // Sunucu yokken varsayılan içerik sadece önizleme olarak gösterilir
  const offline = !editorLoaded && !editorLoading && Boolean(editorError);
  const data = offline ? DEFAULT_GUIDES_CONTENT : editor;
  const items = useMemo(() => sortByOrder(data[activeTab] ?? []), [data, activeTab]);
  const isEmpty = editorLoaded && !editor.catalogs.length && !editor.installs.length && !editor.videos.length;

  const openModal = (item = null) => { dispatch(clearGuidesError()); setModal({ item }); };

  const save = async (payload) => {

    const id = idOf(modal?.item);
    const action = id ? updateGuideItem({ section: activeTab, id, item: payload }) : createGuideItem({ section: activeTab, item: payload });
    const res = await dispatch(action);
    if (!res.error) setModal(null);
  };

  const remove = (item) => {

    if (confirmDelete !== idOf(item)) return setConfirmDelete(idOf(item));
    setConfirmDelete(null);
    dispatch(deleteGuideItem({ section: activeTab, id: idOf(item) }));
  };

  const togglePublish = (item) => dispatch(updateGuideItem({ section: activeTab, id: idOf(item), item: { isPublished: item.isPublished === false } }));

  const tab = TABS.find((t) => t.key === activeTab);

  return (

    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white transition-colors duration-300">

      <EditorSidebar />

      <div className="flex-1 overflow-y-auto pb-24 lg:pb-0">

        <section className="relative pt-8 pb-6 px-6 border-b border-gray-200 dark:border-slate-800/60 bg-white dark:bg-slate-900/40">

          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none" />

          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">

            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl text-white shadow-md shadow-blue-500/20"><BookOpen size={28} /></div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 flex items-center gap-1.5"><Sparkles size={12} /> İçerik Yönetimi</span>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-0.5">Rehberler</h1>
              </div>
            </div>

            <Link to="/guides" target="_blank" className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700">
              Sayfayı Görüntüle <ExternalLink size={14} />
            </Link>

          </div>

        </section>

        <section className="py-8 px-6 max-w-6xl mx-auto space-y-6">

          {offline && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-2xl border bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-300 text-sm">
              <AlertTriangle size={18} className="flex-shrink-0" />
              <span className="flex-1">Sunucuya bağlanılamadı{editorError ? ` (${editorError})` : ''}. Rehberler sayfası şu an varsayılan içeriği gösteriyor. Aşağıdaki liste sadece önizlemedir, sunucu hazır olduğunda düzenleme açılır.</span>
              <button onClick={() => dispatch(fetchEditorGuides())} className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold bg-white/70 dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-800 whitespace-nowrap"><RefreshCw size={14} />Tekrar dene</button>
            </div>
          )}

          {isEmpty && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-2xl border bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-800 dark:text-blue-300 text-sm">
              <Database size={18} className="flex-shrink-0" />
              <span className="flex-1">Henüz hiç içerik yok. Sitede şu an görünen varsayılan katalog, rehber ve videoları tek tıkla sunucuya aktarıp buradan düzenleyebilirsiniz.</span>
              <button onClick={() => dispatch(seedDefaultGuides()).then(() => dispatch(fetchEditorGuides()))} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60 whitespace-nowrap">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Database size={14} />}Varsayılan içeriği yükle
              </button>
            </div>
          )}

          {saveError && !modal && (
            <div className="flex items-center gap-2 p-3 rounded-xl text-sm bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"><AlertTriangle size={16} />{saveError}</div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div className="flex gap-2 overflow-x-auto">
              {TABS.map((t) => (
                <button key={t.key} onClick={() => { setActiveTab(t.key); setConfirmDelete(null); }} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeTab === t.key ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-400 hover:border-blue-500/40'}`}>
                  <t.icon size={16} />{t.label}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === t.key ? 'bg-white/20' : 'bg-gray-100 dark:bg-slate-800'}`}>{(data[t.key] ?? []).length}</span>
                </button>
              ))}
            </div>

            <button onClick={() => openModal()} disabled={offline || editorLoading} className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed">
              <Plus size={16} />Yeni {tab.singular}
            </button>

          </div>

          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl overflow-hidden">

            {editorLoading ? (
              <div className="flex items-center justify-center gap-3 py-16 text-gray-500"><Loader2 size={20} className="animate-spin" />Yükleniyor...</div>
            ) : !items.length ? (
              <div className="py-16 text-center text-gray-500 dark:text-slate-400 text-sm">Bu bölümde henüz kayıt yok.</div>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-slate-800">
                {items.map((item) => {

                  const Icon = activeTab === 'installs' ? iconFor(item.icon) : tab.icon;
                  const published = item.isPublished !== false;
                  const id = idOf(item);

                  return (
                    <li key={id ?? item.title} className="flex items-center gap-4 px-5 py-4">

                      {activeTab === 'videos' && item.youtubeId ? (
                        <img src={`https://i.ytimg.com/vi/${item.youtubeId}/default.jpg`} alt="" className="w-16 h-11 rounded-lg object-cover flex-shrink-0 bg-gray-100 dark:bg-slate-800" />
                      ) : (
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${activeTab === 'catalogs' ? `text-white bg-gradient-to-br ${CATALOG_COLORS[item.color] ?? CATALOG_COLORS.blue}` : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'}`}><Icon size={20} /></div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">{item.title}</h3>
                          {!published && <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-gray-100 dark:bg-slate-800 text-gray-500">Taslak</span>}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 truncate">{describe(activeTab, item)}</p>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => togglePublish(item)} disabled={offline || saving} title={published ? 'Yayından kaldır' : 'Yayınla'} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-40">{published ? <Eye size={18} /> : <EyeOff size={18} />}</button>
                        <button onClick={() => openModal(item)} disabled={offline} title="Düzenle" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-40"><Pencil size={18} /></button>
                        <button onClick={() => remove(item)} disabled={offline || saving} title="Sil" className={`p-2 rounded-lg disabled:opacity-40 ${confirmDelete === id ? 'bg-red-600 text-white px-3 text-xs font-bold' : 'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10'}`}>
                          {confirmDelete === id ? 'Emin misiniz?' : <Trash2 size={18} />}
                        </button>
                      </div>

                    </li>
                  );
                })}
              </ul>
            )}

          </div>

        </section>

      </div>

      {modal && <ItemModal section={activeTab} initial={modal.item} onClose={() => setModal(null)} onSave={save} saving={saving} error={saveError} />}

    </div>
  );
};

export default EditorGuides;
