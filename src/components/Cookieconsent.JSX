import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "cookie_consent";
const CONSENT_VERSION = 1; // çerez kategorilerini değiştirirseniz artırın, herkes yeniden onay verir

// ---- Dışarıdan kullanılabilen yardımcılar ----

export const getCookieConsent = () => {

  try {

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return parsed?.version === CONSENT_VERSION ? parsed : null;
  } catch {

    return null;
  }
};

// Analitik/pazarlama script'lerini yüklemeden önce kontrol edin: if (hasConsent("analytics")) { ... }
export const hasConsent = (category) => getCookieConsent()?.[category] === true;

// Footer'daki "Çerez Tercihleri" linki bunu çağırır
export const openCookieSettings = () => window.dispatchEvent(new Event("open-cookie-settings"));

const saveConsent = (analytics, marketing) => {

  const consent = {

    version: CONSENT_VERSION,
    necessary: true,
    analytics,
    marketing,
    updatedAt: new Date().toISOString(),
  };

  try {

    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // localStorage kapalıysa sessizce geç; banner bir sonraki açılışta tekrar çıkar
  }

  // Analitik kodunuz bu olayı dinleyip izin verilince yüklenebilir
  window.dispatchEvent(new CustomEvent("cookie-consent-changed", { detail: consent }));
  return consent;
};

// ---- Bileşen ----

const Toggle = ({ checked, onChange, disabled, label }) => (

  <button type="button" role="switch" aria-checked={checked} aria-label={label} disabled={disabled} onClick={() => onChange(!checked)} className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-typus focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${checked ? "bg-typus" : "bg-gray-300 dark:bg-slate-700"} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}>

    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />

  </button>
);

const categories = [
  { key: "necessary", title: "Zorunlu Çerezler", text: "Oturum açma ve güvenlik için gereklidir, kapatılamaz.", locked: true },
  { key: "analytics", title: "Analitik Çerezler", text: "Siteyi nasıl kullandığınızı anlamamıza ve geliştirmemize yardımcı olur." },
  { key: "marketing", title: "Pazarlama Çerezleri", text: "İlgi alanlarınıza uygun içerik ve kampanyalar göstermek için kullanılır." },
];

const CookieConsent = () => {

  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [choices, setChoices] = useState({ necessary: true, analytics: false, marketing: false });

  useEffect(() => {

    const existing = getCookieConsent();

    if (existing) {

      setChoices({ necessary: true, analytics: !!existing.analytics, marketing: !!existing.marketing });
    } else {

      setVisible(true);
    }

    const openSettings = () => {

      const current = getCookieConsent();
      if (current) setChoices({ necessary: true, analytics: !!current.analytics, marketing: !!current.marketing });
      setShowPrefs(true);
      setVisible(true);
    };

    window.addEventListener("open-cookie-settings", openSettings);
    return () => window.removeEventListener("open-cookie-settings", openSettings);
  }, []);

  useEffect(() => {

    if (!showPrefs) return;

    const onKey = (e) => {

      if (e.key !== "Escape") return;
      setShowPrefs(false);
      if (getCookieConsent()) setVisible(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showPrefs]);

  const finish = (analytics, marketing) => {

    saveConsent(analytics, marketing);
    setChoices({ necessary: true, analytics, marketing });
    setShowPrefs(false);
    setVisible(false);
  };

  // Tercihler footer'dan açıldıysa (daha önce seçim yapılmışsa) kapatınca alt banner geri gelmesin
  const closePrefs = () => {

    setShowPrefs(false);
    if (getCookieConsent()) setVisible(false);
  };

  if (!visible) return null;

  const primaryBtn = "px-5 py-2.5 bg-typus hover:bg-typus-dark text-white text-sm font-semibold rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-typus focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900";
  const secondaryBtn = "px-5 py-2.5 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 text-sm font-semibold rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-typus";

  if (showPrefs) {

    return (

      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50" onClick={closePrefs}>

        <div role="dialog" aria-modal="true" aria-label="Çerez tercihleri" onClick={(e) => e.stopPropagation()} className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6">

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Çerez Tercihleri</h2>
          <p className="text-sm text-gray-600 dark:text-slate-400 mb-5">Hangi çerezlere izin vereceğinizi seçin. Tercihlerinizi istediğiniz zaman değiştirebilirsiniz.</p>

          <div className="space-y-4 mb-6">

            {categories.map((cat) => ( <div key={cat.key} className="flex items-start justify-between gap-4 pb-4 border-b border-gray-200 dark:border-slate-800 last:border-0 last:pb-0">

              <div>

                <p className="text-sm font-semibold text-gray-900 dark:text-white">{cat.title}</p>
                <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">{cat.text}</p>

              </div>

              <Toggle label={cat.title} checked={choices[cat.key]} disabled={cat.locked} onChange={(value) => setChoices((prev) => ({ ...prev, [cat.key]: value }))} />

            </div> ))}

          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">

            <button type="button" onClick={closePrefs} className={secondaryBtn}>Geri</button>
            <button type="button" onClick={() => finish(choices.analytics, choices.marketing)} className={primaryBtn}>Tercihleri Kaydet</button>

          </div>

        </div>

      </div>
    );
  }

  return (

    <div role="dialog" aria-label="Çerez bildirimi" className="fixed bottom-0 inset-x-0 z-[60] bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800">

      

    </div>
  );
};

export default CookieConsent;
