import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BookOpen, Search, Download, FileText, Clock, ChevronDown, CheckCircle2, AlertTriangle, Wrench, Plug, Droplets, Wind, Eye, Smartphone, Wifi, ArrowRight, Package, MessageCircle, Sparkles, ShieldCheck, PlayCircle, Video } from 'lucide-react';

import { getHomeProducts } from '../redux/productSlice';

// ── Kataloglar ──
// PDF hazır olduğunda `file` alanına adresini yazın (ör. '/catalogs/urun-katalogu-2026.pdf', public/ klasörüne koyabilirsiniz).
// `file` boş olan kataloglar "Yakında" olarak görünür.
const CATALOGS = [
  { title: 'Ürün Kataloğu 2026', description: 'Tüm akıllı ev ürünlerimiz, özellikleri ve teknik bilgileri tek dosyada.', pages: 32, size: 'PDF', file: null, color: 'from-blue-500 to-cyan-500' },
  { title: 'Akıllı Ev Paketleri', description: 'Daire tipine göre (1+1, 2+1, 3+1) hazırlanmış paket önerileri.', pages: 12, size: 'PDF', file: null, color: 'from-purple-500 to-pink-500' },
  { title: 'Kurulum Kılavuzu', description: 'Tüm ürünler için adım adım kurulum talimatları, yazdırılabilir.', pages: 24, size: 'PDF', file: null, color: 'from-emerald-500 to-teal-500' },
];

// ── Videolar ──
// Video eklemek için YouTube adresindeki kimliği `youtubeId` alanına yazın
// (ör. https://www.youtube.com/watch?v=pRTeSIznQ1E → 'pRTeSIznQ1E'). Kimliği boş olanlar "Yakında" görünür.
const VIDEOS = [
  { title: 'Typus Home Tanıtım', type: 'Tanıtım', duration: '', youtubeId: 'pRTeSIznQ1E' },
  { title: 'Akıllı Kontrol Rölesi Kurulumu', type: 'Kurulum', duration: '', youtubeId: null },
  { title: 'Akıllı Perde Motoru Kurulumu', type: 'Kurulum', duration: '', youtubeId: null },
  { title: 'Sensörleri Uygulamaya Ekleme', type: 'Kurulum', duration: '', youtubeId: null },
];

// ── Kurulum rehberleri ──
const INSTALL_GUIDES = [
  {
    id: 'relay',
    icon: Plug,
    title: 'Akıllı Kontrol Rölesi',
    category: 'Aydınlatma',
    duration: '20 dk',
    difficulty: 'Elektrik bilgisi gerekir',
    tools: ['Düz ve yıldız tornavida', 'Kontrol kalemi', 'Telefonunuzda uygulama'],
    steps: [
      'Sigorta kutusundan ilgili hattın sigortasını kapatın ve kontrol kalemiyle elektrik olmadığından emin olun.',
      'Anahtarın kapağını sökün, rölenin L (faz) ve N (nötr) girişlerini kutudaki etiketlere göre bağlayın.',
      'Lamba çıkışını rölenin çıkış ucuna bağlayın, röleyi anahtar kutusunun içine yerleştirin ve kapağı takın.',
      'Sigortayı açın. Röle üzerindeki ışık yanıp sönmeye başladığında eşleşmeye hazırdır.',
      'Uygulamada "Cihaz Ekle" adımına girin, kutudaki QR kodu okutun ve ev WiFi ağınızı seçin.',
      'Cihaza oda adı verin (ör. Salon Lambası). Artık uygulamadan ve sesli asistandan kontrol edebilirsiniz.',
    ],
    warning: 'Elektrik bağlantısı konusunda emin değilseniz kurulumu bir elektrik ustasına yaptırın.',
  },
  {
    id: 'curtain',
    icon: Wind,
    title: 'Akıllı Perde Motoru',
    category: 'Konfor',
    duration: '30 dk',
    difficulty: 'Orta',
    tools: ['Matkap ve dübel', 'Metre', 'Tornavida'],
    steps: [
      'Perde rayının uzunluğunu ölçün ve rayı kutudaki montaj aparatlarıyla duvara veya tavana sabitleyin.',
      'Motoru rayın uç kısmına oturtun ve kilitleme mandalını kapatın.',
      'Perde askılarını raya takın, ilk askıyı motor arabasına bağlayın.',
      'Motorun fişini prize takın, eşleşme düğmesine 3 saniye basılı tutun.',
      'Uygulamada "Cihaz Ekle" ile motoru ekleyin ve açık / kapalı limitlerini ekrandaki yönergelerle ayarlayın.',
      'İsterseniz gün doğumu veya belirli saatler için otomasyon kurun.',
    ],
  },
  {
    id: 'water',
    icon: Droplets,
    title: 'Su Baskın Sensörü',
    category: 'Güvenlik',
    duration: '5 dk',
    difficulty: 'Kolay',
    tools: ['Telefonunuzda uygulama'],
    steps: [
      'Sensörün pil yalıtım bandını çekin. Işık yanıp sönmeye başlar.',
      'Uygulamada "Cihaz Ekle" adımına girin ve sensörü listeden seçin.',
      'Sensörü çamaşır makinesi, bulaşık makinesi veya lavabo altı gibi su sızabilecek bir noktada zemine yerleştirin.',
      'Uygulamada bildirimleri açın. Su algılandığında telefonunuza anında uyarı gelir.',
    ],
  },
  {
    id: 'motion',
    icon: Eye,
    title: 'Hareket Sensörü',
    category: 'Güvenlik',
    duration: '10 dk',
    difficulty: 'Kolay',
    tools: ['Çift taraflı bant veya vida', 'Telefonunuzda uygulama'],
    steps: [
      'Pil yalıtım bandını çekin ve sensörü uygulamaya "Cihaz Ekle" ile ekleyin.',
      'Sensörü yerden yaklaşık 2–2,5 metre yükseğe, odanın girişini görecek şekilde konumlandırın.',
      'Doğrudan güneş ışığı alan ve kalorifer peteğine yakın yerlerden kaçının, yanlış algılamaya neden olabilir.',
      'Uygulamada "hareket algılanınca ışığı aç" gibi bir otomasyon oluşturarak sensörü test edin.',
    ],
  },
];

const GUIDE_CATEGORIES = ['Tümü', ...Array.from(new Set(INSTALL_GUIDES.map((g) => g.category)))];

// Her ürün için ortak ilk kurulum adımları
const QUICK_START = [
  { icon: Smartphone, title: 'Uygulamayı indirin', text: 'Hesabınızla giriş yapın veya yeni hesap oluşturun.' },
  { icon: Wifi, title: 'WiFi hazır olsun', text: 'Cihazlar 2,4 GHz ev ağınıza bağlanır, şifrenizi yanınızda bulundurun.' },
  { icon: Package, title: 'Cihazı ekleyin', text: 'Kutudaki QR kodu okutun, uygulama sizi adım adım yönlendirir.' },
  { icon: Sparkles, title: 'Otomasyon kurun', text: 'Saat, sensör veya sesli komutla çalışan senaryolar oluşturun.' },
];

const FAQS = [
  { question: 'Kurulum için teknik bilgi gerekiyor mu?', answer: 'Sensörler ve perde motoru için gerekmez, uygulama sizi adım adım yönlendirir. Röle gibi elektrik tesisatına bağlanan ürünlerde bir elektrik ustasından destek almanızı öneririz.' },
  { question: 'İnternet kesilirse cihazlar çalışmaya devam eder mi?', answer: 'Anahtarlar ve fiziksel düğmeler çalışmaya devam eder. Uzaktan kontrol ve bildirimler internet geldiğinde kaldığı yerden devam eder.' },
  { question: 'Kurulum hizmeti veriyor musunuz?', answer: 'Evet. Sipariş sırasında kurulum hizmeti seçebilir veya iletişim sayfasından bize ulaşarak randevu oluşturabilirsiniz.' },
  { question: 'Cihaz eşleşmezse ne yapmalıyım?', answer: 'Cihazı 5 saniye boyunca sıfırlama düğmesine basılı tutarak sıfırlayın, telefonunuzun 2,4 GHz ağa bağlı olduğundan emin olun ve tekrar deneyin.' },
];

const getImage = (p) => p?.primaryImage || p?.images?.[0]?.preview || p?.images?.[0]?.file || null;

const InstallGuideCard = ({ guide, open, onToggle }) => {

  const Icon = guide.icon;

  return (

    <div className={`bg-white dark:bg-slate-900 border rounded-3xl overflow-hidden transition-all ${open ? 'border-blue-500/50 shadow-lg shadow-blue-500/10' : 'border-slate-200 dark:border-slate-800 hover:border-blue-500/30'}`}>

      <button onClick={onToggle} className="w-full p-6 flex items-center gap-4 text-left" aria-expanded={open}>

        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-blue-500/10 text-blue-600 dark:text-blue-400"><Icon size={24} /></div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold">{guide.title}</h3>
          <div className="flex flex-wrap gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1"><Clock size={12} />{guide.duration}</span>
            <span>·</span>
            <span>{guide.difficulty}</span>
            <span>·</span>
            <span>{guide.category}</span>
          </div>
        </div>

        <ChevronDown size={20} className={`flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />

      </button>

      {open && (

        <div className="px-6 pb-6 border-t border-slate-200 dark:border-slate-800 pt-5 space-y-5">

          <div>
            <h4 className="text-sm font-bold mb-2 flex items-center gap-2"><Wrench size={16} className="text-slate-500" />Gerekenler</h4>
            <div className="flex flex-wrap gap-2">
              {guide.tools.map((t) => <span key={t} className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{t}</span>)}
            </div>
          </div>

          <ol className="space-y-3">
            {guide.steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>

          {guide.warning && (
            <div className="flex gap-3 p-4 rounded-2xl text-sm bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/20">
              <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{guide.warning}</span>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

const VideoCard = ({ video }) => {

  const [playing, setPlaying] = useState(false);
  const ready = Boolean(video.youtubeId);

  return (

    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden">

      <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900">

        {ready && playing ? (
          <iframe src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`} title={video.title} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="absolute inset-0 w-full h-full" />
        ) : ready ? (
          <button onClick={() => setPlaying(true)} className="group absolute inset-0 w-full h-full" aria-label={`${video.title} videosunu oynat`}>
            <img src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`} alt="" loading="lazy" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            <PlayCircle size={56} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
          </button>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400">
            <Video size={36} />
            <span className="text-xs font-semibold">Yakında</span>
          </div>
        )}

        {video.duration && !playing && <span className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-bold">{video.duration}</span>}

      </div>

      <div className="p-4">
        <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-md ${video.type === 'Tanıtım' ? 'bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400' : 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'}`}>{video.type}</span>
        <h3 className="font-bold text-sm mt-2">{video.title}</h3>
      </div>

    </div>
  );
};

const FAQItem = ({ question, answer }) => {

  const [isOpen, setIsOpen] = useState(false);

  return (

    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">

      <button onClick={() => setIsOpen(!isOpen)} className="w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors" aria-expanded={isOpen}>
        <span className="font-semibold text-left">{question}</span>
        <ChevronDown size={20} className={`flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-200 dark:border-slate-800 pt-4">{answer}</div>}

    </div>
  );
};

const Guides = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [openGuide, setOpenGuide] = useState(INSTALL_GUIDES[0].id);

  const { home, homeLoading } = useSelector((state) => state.products);

  useEffect(() => {

    dispatch(getHomeProducts(8));
  }, [dispatch]);

  // Tanıtım için öne çıkan ürünler; yoksa en yeni ürünler
  const showcase = useMemo(() => {

    const list = home?.featured?.length ? home.featured : home?.newest ?? [];
    return list.slice(0, 4);
  }, [home]);

  const filteredGuides = useMemo(() => {

    const q = searchQuery.trim().toLocaleLowerCase('tr');

    return INSTALL_GUIDES.filter((g) => {

      if (activeCategory !== 'Tümü' && g.category !== activeCategory) return false;
      if (!q) return true;
      return [g.title, g.category, ...g.steps].some((t) => t.toLocaleLowerCase('tr').includes(q));
    });
  }, [searchQuery, activeCategory]);

  return (

    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white">

      {/* Başlık */}
      <section className="pt-32 pb-16 px-6 border-b relative overflow-hidden border-slate-200 dark:border-slate-900 bg-gradient-to-b from-blue-100/20 to-transparent dark:from-blue-900/10 dark:to-transparent">

        <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl bg-blue-500/10 dark:bg-blue-500/5" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl bg-purple-500/10 dark:bg-purple-500/5" />

        <div className="max-w-7xl mx-auto relative z-10">

          <div className="flex items-center gap-3 font-bold mb-4 text-blue-600 dark:text-blue-400">
            <BookOpen size={20} />
            <span>Kataloglar & Kurulum Rehberleri</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Bilgi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Merkezi</span></h1>
          <p className="text-lg max-w-2xl mb-8 text-slate-600 dark:text-slate-400">Ürünlerimizi tanıyın, kataloglarımızı indirin ve akıllı evinizi adım adım kurun.</p>

          <div className="flex flex-wrap gap-3">
            <a href="#kataloglar" className="px-5 py-3 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"><FileText size={16} />Kataloglar</a>
            <a href="#urunler" className="px-5 py-3 rounded-xl font-semibold text-sm bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center gap-2"><Package size={16} />Ürün Tanıtımları</a>
            <a href="#kurulum" className="px-5 py-3 rounded-xl font-semibold text-sm bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center gap-2"><Wrench size={16} />Kurulum Rehberleri</a>
            <a href="#videolar" className="px-5 py-3 rounded-xl font-semibold text-sm bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center gap-2"><Video size={16} />Videolar</a>
          </div>

        </div>

      </section>

      {/* Kataloglar */}
      <section id="kataloglar" className="py-16 px-6 scroll-mt-24">

        <div className="max-w-7xl mx-auto">

          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Kataloglar</h2>
            <p className="text-slate-600 dark:text-slate-400">Ürünlerimizi ve paketlerimizi incelemek için kataloglarımızı indirin</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            {CATALOGS.map((c) => (

              <div key={c.title} className="border rounded-3xl p-8 flex flex-col bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">

                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-5 bg-gradient-to-br ${c.color}`}><FileText size={26} /></div>
                <h3 className="text-xl font-bold mb-2">{c.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex-1">{c.description}</p>
                <p className="text-xs text-slate-500 mb-5">{c.pages} sayfa · {c.size}</p>

                {c.file ? (
                  <a href={c.file} download className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:opacity-90">
                    <Download size={16} />İndir
                  </a>
                ) : (
                  <span className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed">Yakında</span>
                )}

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* Ürün tanıtımları */}
      <section id="urunler" className="py-16 px-6 bg-slate-50 dark:bg-slate-900/20 scroll-mt-24">

        <div className="max-w-7xl mx-auto">

          <div className="flex items-end justify-between mb-8 gap-4">

            <div>
              <h2 className="text-3xl font-bold mb-2">Ürün Tanıtımları</h2>
              <p className="text-slate-600 dark:text-slate-400">Öne çıkan ürünlerimizi yakından tanıyın</p>
            </div>

            <Link to="/products" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-500 font-semibold whitespace-nowrap">Tüm Ürünler <ArrowRight size={18} /></Link>

          </div>

          {homeLoading && !showcase.length ? (

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[0, 1, 2, 3].map((i) => <div key={i} className="aspect-[3/4] rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />)}
            </div>

          ) : showcase.length ? (

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {showcase.map((p) => {

                const image = getImage(p);

                return (

                  <article key={p._id ?? p.id ?? p.slug} onClick={() => navigate(`/productdetail/${p.slug}`)} className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl hover:border-blue-500/30">

                    <div className="aspect-square bg-slate-100 dark:bg-slate-800/60 overflow-hidden">
                      {image ? <img src={image} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="w-full h-full flex items-center justify-center text-slate-400"><Package size={40} /></div>}
                    </div>

                    <div className="p-5">
                      {p.category && <p className="text-xs text-slate-500 mb-1">{p.category}</p>}
                      <h3 className="font-bold leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{p.name}</h3>
                      {p.shortDescription && <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">{p.shortDescription}</p>}
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400">İncele <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></span>
                    </div>

                  </article>
                );
              })}

            </div>

          ) : (

            <div className="text-center py-12 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500">
              Ürünler şu anda yüklenemedi. <Link to="/products" className="text-blue-600 dark:text-blue-400 font-semibold">Mağazaya göz atın</Link>
            </div>
          )}

        </div>

      </section>

      {/* Kurulum */}
      <section id="kurulum" className="py-16 px-6 scroll-mt-24">

        <div className="max-w-5xl mx-auto">

          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Kurulum Rehberleri</h2>
            <p className="text-slate-600 dark:text-slate-400">Her ürün için adım adım kurulum talimatları</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">

            {QUICK_START.map((s, i) => (
              <div key={s.title} className="p-5 rounded-2xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400"><s.icon size={18} /><span className="text-xs font-bold">ADIM {i + 1}</span></div>
                <h3 className="font-bold text-sm mb-1">{s.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">{s.text}</p>
              </div>
            ))}

          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">

            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Kurulum rehberlerinde ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full border rounded-xl pl-11 pr-4 py-3 focus:outline-none transition-colors bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 focus:border-blue-500" />
            </div>

            <div className="flex gap-2 overflow-x-auto">
              {GUIDE_CATEGORIES.map((c) => (
                <button key={c} onClick={() => setActiveCategory(c)} className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${activeCategory === c ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800'}`}>{c}</button>
              ))}
            </div>

          </div>

          <div className="space-y-4">

            {filteredGuides.length ? filteredGuides.map((g) => (
              <InstallGuideCard key={g.id} guide={g} open={openGuide === g.id} onToggle={() => setOpenGuide(openGuide === g.id ? null : g.id)} />
            )) : (
              <p className="text-center py-10 text-slate-500">Aramanızla eşleşen rehber bulunamadı.</p>
            )}

          </div>

          <div className="mt-8 flex gap-3 p-5 rounded-2xl border bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-sm text-green-800 dark:text-green-300">
            <ShieldCheck size={20} className="flex-shrink-0" />
            <span>Elektrik tesisatına bağlanan ürünlerde işe başlamadan önce mutlaka sigortayı kapatın. Kurulum hizmetimizle ürünlerinizi uzman ekibimize de kurdurabilirsiniz.</span>
          </div>

        </div>

      </section>

      {/* Videolar */}
      <section id="videolar" className="py-16 px-6 bg-slate-50 dark:bg-slate-900/20 scroll-mt-24">

        <div className="max-w-7xl mx-auto">

          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Videolar</h2>
            <p className="text-slate-600 dark:text-slate-400">Ürün tanıtım ve kurulum videoları</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VIDEOS.map((v) => <VideoCard key={v.title} video={v} />)}
          </div>

        </div>

      </section>

      {/* SSS */}
      <section className="py-16 px-6">

        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Sıkça Sorulan Sorular</h2>
            <p className="text-slate-600 dark:text-slate-400">Kurulum hakkında en çok merak edilenler</p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq) => <FAQItem key={faq.question} {...faq} />)}
          </div>

        </div>

      </section>

      {/* Destek */}
      <section className="pt-20 pb-24 px-6">

        <div className="max-w-6xl mx-auto border rounded-3xl p-12 text-center bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-600/20 dark:to-purple-600/20 border-blue-300 dark:border-blue-500/30">

          <MessageCircle className="mx-auto mb-6 text-blue-600 dark:text-blue-400" size={48} />
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Kurulumda yardıma mı ihtiyacınız var?</h3>
          <p className="mb-8 max-w-2xl mx-auto text-slate-600 dark:text-slate-400">Destek ekibimiz sorularınızı yanıtlamaya ve kurulum randevusu oluşturmaya hazır.</p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="px-8 py-4 rounded-2xl font-bold text-sm shadow-lg flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"><MessageCircle size={18} />Bize Ulaşın</Link>
            <Link to="/faq" className="px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 bg-white/70 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700"><CheckCircle2 size={18} />Tüm SSS</Link>
          </div>

        </div>

      </section>

    </div>
  );
};

export default Guides;
