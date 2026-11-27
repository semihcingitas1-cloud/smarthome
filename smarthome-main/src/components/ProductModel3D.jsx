import React, { useEffect, useRef, useState } from 'react';

const ProductModel3D = ({ src, poster, alt, colorHex }) => {
  const viewerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  // Kütüphane sadece 3D sekmesi açılınca yüklenir (ana bundle şişmez)
  useEffect(() => {
    import('@google/model-viewer').then(() => setReady(true));
  }, []);

  useEffect(() => {
    const el = viewerRef.current;
    if (!el || !ready) return;
    const onProgress = (e) => setProgress(e.detail.totalProgress);
    el.addEventListener('progress', onProgress);
    return () => el.removeEventListener('progress', onProgress);
  }, [ready]);

  // Seçilen renge göre gövde materyalini boya
  useEffect(() => {
    const el = viewerRef.current;
    if (!el || !ready || !colorHex) return;

    const apply = () => {
      const mat = el.model?.materials?.find((m) => m.name === 'body') || el.model?.materials?.[0];
      mat?.pbrMetallicRoughness.setBaseColorFactor(colorHex);
    };

    if (el.loaded) apply();
    else el.addEventListener('load', apply, { once: true });
  }, [colorHex, ready, src]);

  if (!ready) {
    return <div className="w-full h-[400px] md:h-[550px] flex items-center justify-center text-slate-400">3D yükleniyor...</div>;
  }

  return (
    <div className="relative w-full h-[400px] md:h-[550px]">
      <model-viewer
        ref={viewerRef}
        src={src}
        poster={poster}
        alt={alt}
        camera-controls=""
        auto-rotate=""
        auto-rotate-delay="2000"
        shadow-intensity="1"
        exposure="1"
        ar=""
        ar-modes="webxr scene-viewer quick-look"
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      />

      {progress < 1 && (
        <div className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all" style={{ width: `${progress * 100}%` }} />
      )}

      <div className="absolute bottom-3 left-3 text-xs bg-black/50 text-white px-3 py-1 rounded-full backdrop-blur-sm">
        Sürükleyerek döndür • Kaydırarak yakınlaştır
      </div>
    </div>
  );
};

export default ProductModel3D;
