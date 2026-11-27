import { Plug, Droplets, Wind, Eye, Lightbulb, Lock, Thermometer, Camera, Wifi, Package } from 'lucide-react';

// Rehberler sayfasının varsayılan içeriği.
// Sunucuya (GET /guides) ulaşılamazsa sayfa bu içerikle açılır.
// Editör panelindeki "Varsayılan içeriği yükle" butonu da bu listeleri sunucuya gönderir.
// Alanların açıklaması için proje kökündeki GUIDES_API.md dosyasına bakın.

export const GUIDE_SECTIONS = ['catalogs', 'installs', 'videos'];

// Kurulum rehberlerinde seçilebilecek ikonlar (sunucuda sadece anahtar saklanır)
export const GUIDE_ICONS = {
  plug: { label: 'Röle / Priz', Icon: Plug },
  curtain: { label: 'Perde', Icon: Wind },
  water: { label: 'Su sensörü', Icon: Droplets },
  motion: { label: 'Hareket sensörü', Icon: Eye },
  light: { label: 'Aydınlatma', Icon: Lightbulb },
  lock: { label: 'Kilit', Icon: Lock },
  climate: { label: 'İklim / Sıcaklık', Icon: Thermometer },
  camera: { label: 'Kamera', Icon: Camera },
  hub: { label: 'Ağ / Merkez', Icon: Wifi },
  other: { label: 'Diğer', Icon: Package },
};

export const iconFor = (key) => (GUIDE_ICONS[key] ?? GUIDE_ICONS.other).Icon;

export const CATALOG_COLORS = {
  blue: 'from-blue-500 to-cyan-500',
  purple: 'from-purple-500 to-pink-500',
  green: 'from-emerald-500 to-teal-500',
  orange: 'from-orange-500 to-red-500',
};

export const VIDEO_TYPES = ['Tanıtım', 'Kurulum'];

// YouTube adresi veya doğrudan kimlik kabul eder: "https://youtu.be/ID", "https://www.youtube.com/watch?v=ID", "ID"
export const parseYoutubeId = (value) => {

  const v = String(value ?? '').trim();
  if (!v) return '';
  if (/^[\w-]{11}$/.test(v)) return v;
  const m = v.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/)([\w-]{11})/);
  return m ? m[1] : '';
};

export const DEFAULT_GUIDES_CONTENT = {

  catalogs: [
    { _id: 'default-catalog-1', title: 'Ürün Kataloğu 2026', description: 'Tüm akıllı ev ürünlerimiz, özellikleri ve teknik bilgileri tek dosyada.', pages: 32, fileUrl: '', color: 'blue', order: 1, isPublished: true },
    { _id: 'default-catalog-2', title: 'Akıllı Ev Paketleri', description: 'Daire tipine göre (1+1, 2+1, 3+1) hazırlanmış paket önerileri.', pages: 12, fileUrl: '', color: 'purple', order: 2, isPublished: true },
    { _id: 'default-catalog-3', title: 'Kurulum Kılavuzu', description: 'Tüm ürünler için adım adım kurulum talimatları, yazdırılabilir.', pages: 24, fileUrl: '', color: 'green', order: 3, isPublished: true },
  ],

  installs: [
    {
      _id: 'default-install-relay',
      icon: 'plug',
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
      order: 1,
      isPublished: true,
    },
    {
      _id: 'default-install-curtain',
      icon: 'curtain',
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
      warning: '',
      order: 2,
      isPublished: true,
    },
    {
      _id: 'default-install-water',
      icon: 'water',
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
      warning: '',
      order: 3,
      isPublished: true,
    },
    {
      _id: 'default-install-motion',
      icon: 'motion',
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
      warning: '',
      order: 4,
      isPublished: true,
    },
  ],

  videos: [
    { _id: 'default-video-1', title: 'Typus Home Tanıtım', type: 'Tanıtım', duration: '', youtubeId: 'pRTeSIznQ1E', order: 1, isPublished: true },
    { _id: 'default-video-2', title: 'Akıllı Kontrol Rölesi Kurulumu', type: 'Kurulum', duration: '', youtubeId: '', order: 2, isPublished: true },
    { _id: 'default-video-3', title: 'Akıllı Perde Motoru Kurulumu', type: 'Kurulum', duration: '', youtubeId: '', order: 3, isPublished: true },
    { _id: 'default-video-4', title: 'Sensörleri Uygulamaya Ekleme', type: 'Kurulum', duration: '', youtubeId: '', order: 4, isPublished: true },
  ],
};

// Boş form değerleri
export const EMPTY_ITEM = {
  catalogs: { title: '', description: '', pages: '', fileUrl: '', color: 'blue', order: 0, isPublished: true },
  installs: { icon: 'plug', title: '', category: '', duration: '', difficulty: 'Kolay', tools: [], steps: [], warning: '', order: 0, isPublished: true },
  videos: { title: '', type: 'Kurulum', duration: '', youtubeId: '', order: 0, isPublished: true },
};

export const sortByOrder = (list = []) => [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
