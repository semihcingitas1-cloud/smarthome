import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, QrCode } from 'lucide-react';

const socialLinks = [
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
  { name: 'Facebook', icon: Facebook, href: '#' },
];

const quickLinks = [
  { name: 'Ana Sayfa', link: '/' },
  { name: 'Cihaz Yönetimi', link: '/devices' },
  { name: 'İstatistikler', link: '/statistics' },
  { name: 'Senaryolar', link: '/scenarios' },
];

const supportLinks = [
  { name: 'Kullanım Kılavuzu', link: '/guides' },
  { name: 'Gizlilik Politikası', link: '/privacy' },
  { name: 'SSS', link: '/faq' },
  { name: 'İletişim', link: '/contact' },
];

const linkClass = "text-gray-600 dark:text-slate-400 hover:text-typus-dark dark:hover:text-typus-light transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-typus rounded";

const Footer = () => {

  const [email, setEmail] = useState("");

  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e) => {

    e.preventDefault();
    console.log("Subscribe:", email);
    setEmail("");
  };

  return (

    <footer className="w-full bg-gray-100 dark:bg-slate-950 text-gray-700 dark:text-slate-300 border-t border-gray-200 dark:border-slate-800 pt-14 pb-6 px-6 transition-colors duration-200">

      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          <div>

            <Link to="/" aria-label="TypusHome ana sayfa" className="inline-flex items-center mb-4 gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-typus rounded-lg">

              <svg viewBox="-2 -1 64 60" className="h-9 w-9 transition-transform duration-300 group-hover:scale-110" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">

                <path d="M2 26 L30 3 L58 26" className="stroke-typus" strokeWidth="4.5" />
                <path d="M10 20 V54 H50 V20" className="stroke-typus" strokeWidth="4.5" />
                <path d="M23.6 39.6 A9 9 0 0 1 36.4 39.6" className="stroke-typus-light" strokeWidth="3.5" />
                <path d="M18 34 A17 17 0 0 1 42 34" className="stroke-typus-light" strokeWidth="3.5" />
                <circle cx="30" cy="46" r="3.2" className="fill-typus stroke-none" />

              </svg>

              <div className="flex items-baseline leading-none select-none">

                <span className="text-[#5DB3EA] dark:text-[#85CBF0] text-[22px] tracking-[-0.06em]" style={{ fontFamily: "'Lexend Giga', sans-serif", fontWeight: 200 }}>Typus</span>
                <span className="text-[#0F2A47] dark:text-white text-[27px] tracking-[-0.04em]" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>Home</span>

              </div>

            </Link>

            <p className="text-sm leading-relaxed text-gray-600 dark:text-slate-400 mb-4">Geleceğin yaşam alanlarını bugünden yönetin. Güvenli, akıllı ve sürdürülebilir ev otomasyon çözümleri.</p>

            <div className="flex gap-3">

              {socialLinks.map(({ name, icon: Icon, href }) => ( <a key={name} href={href} aria-label={name} className="p-2 bg-gray-200 dark:bg-slate-800 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-typus hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-typus">
                <Icon size={16} />
              </a> ))}

            </div>

          </div>

          <div>

            <h4 className="text-gray-900 dark:text-white font-semibold mb-4 text-sm uppercase tracking-wider">Hızlı Erişim</h4>

            <ul className="space-y-2 text-sm">

              {quickLinks.map((item) => ( <li key={item.link}>
                <Link to={item.link} className={linkClass}>{item.name}</Link>
              </li> ))}

            </ul>

          </div>

          <div>

            <h4 className="text-gray-900 dark:text-white font-semibold mb-4 text-sm uppercase tracking-wider">Destek</h4>

            <ul className="space-y-2 text-sm">

              {supportLinks.map((item) => ( <li key={item.link}>
                <Link to={item.link} className={linkClass}>{item.name}</Link>
              </li> ))}

            </ul>

          </div>

          <div>

            <h4 className="text-gray-900 dark:text-white font-semibold mb-4 text-sm uppercase tracking-wider">Bize Ulaşın</h4>

            <div className="space-y-3 text-sm">

              <div className="flex items-center gap-3">

                <Mail size={16} className="text-typus flex-shrink-0" />
                <a href="mailto:destek@typushome.com" className={linkClass}>destek@typushome.com</a>

              </div>

              <div className="flex items-center gap-3">

                <Phone size={16} className="text-typus flex-shrink-0" />
                <a href="tel:+905511335410" className={linkClass}>+90 551 133 54 10</a>

              </div>

              <form onSubmit={handleSubscribe} className="pt-4">

                <label htmlFor="newsletter-email" className="block text-xs text-gray-500 dark:text-slate-400 mb-2">Bültene abone olun</label>

                <div className="flex">

                  <input id="newsletter-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-posta" className="w-full min-w-0 px-3 py-2 rounded-l-lg bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-typus dark:focus:border-typus transition-colors"/>
                  <button type="submit" className="px-4 bg-typus hover:bg-typus-dark rounded-r-lg text-white text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-typus focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950">Gönder</button>

                </div>

              </form>

            </div>

          </div>

        </div>

        <div className="border-t border-gray-200 dark:border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-500 dark:text-slate-500">

          <div className="text-center md:text-left space-y-2">

            <p>&copy; {currentYear} Typus Home Otomasyon Sistemleri. Tüm hakları saklıdır.</p>
            <p className="uppercase italic font-medium text-gray-600 dark:text-slate-400">Typus Home Software Solutions</p>

          </div>

          {/* ETBİS rozeti: şimdilik yer tutucu. Gerçek görseli gelince <QrCode ... /> yerine
              <img src={etbisQr} alt="ETBİS QR kodu" className="h-full w-full object-contain" /> koyun,
              href'i de ETBİS doğrulama linkiyle değiştirin. */}
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="ETBİS doğrulama" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-typus rounded-lg">

            <div className="h-20 w-20 flex items-center justify-center bg-white border border-gray-200 dark:border-slate-700 rounded-lg p-2">
              <QrCode size={64} className="text-gray-400" aria-hidden="true" />
            </div>

            <span className="text-gray-600 dark:text-slate-400 group-hover:text-typus-dark dark:group-hover:text-typus-light transition-colors">ETBİS<br />Kayıtlıdır</span>

          </a>

        </div>

      </div>

    </footer>
  );
};

export default Footer;
