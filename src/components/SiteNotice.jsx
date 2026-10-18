import React from 'react';
import { AlertTriangle } from 'lucide-react';

// Duyuruyu kapatmak için enabled: false yap
const SITE_NOTICE = {
  enabled: true,
  title: 'Site şu anda aktif değildir.',
  message: 'TypusHOME test aşamasındadır, siparişler henüz işleme alınmamaktadır.',
};

const SiteNotice = () => {

  if (!SITE_NOTICE.enabled) return null;

  return (

    <div role="alert" className="relative z-[60] w-full bg-amber-500 text-amber-950">

      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-2 text-sm text-center">

        <AlertTriangle size={16} className="flex-shrink-0" />

        <p>
          <span className="font-bold">{SITE_NOTICE.title}</span>
          {SITE_NOTICE.message && <span className="ml-1">{SITE_NOTICE.message}</span>}
        </p>

      </div>

    </div>
  );
};

export default SiteNotice;
