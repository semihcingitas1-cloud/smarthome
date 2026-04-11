import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, Home } from 'lucide-react';

const Footer = () => {

  const currentYear = new Date().getFullYear();

  return (

    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-6 px-6">

      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

          <div className="col-span-1 md:col-span-1">

            <div className="flex items-center space-x-2 mb-4">

              <div className="bg-blue-600 p-1.5 rounded-md"><Home size={20} className="text-white" /></div>
              <span className="text-xl font-bold text-white tracking-tight">SMART<span className="text-blue-500">HUB</span></span>

            </div>

            <p className="text-sm leading-relaxed text-slate-400">Geleceğin yaşam alanlarını bugünden yönetin. Güvenli, akıllı ve sürdürülebilir ev otomasyon çözümleri.</p>

          </div>

          <div>

            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Hızlı Erişim</h4>

            <ul className="space-y-2 text-sm">

              <li><a href="/" className="hover:text-blue-400 transition-colors">Ana Sayfa</a></li>
              <li><a href="/devices" className="hover:text-blue-400 transition-colors">Cihaz Yönetimi</a></li>
              <li><a href="/statistics" className="hover:text-blue-400 transition-colors">İstatistikler</a></li>
              <li><a href="/scenarios" className="hover:text-blue-400 transition-colors">Senaryolar</a></li>

            </ul>

          </div>

          <div>

            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Destek</h4>

            <ul className="space-y-2 text-sm">

              <li><a href="/guides" className="hover:text-blue-400 transition-colors">Kullanım Kılavuzu</a></li>
              <li><a href="/privacy" className="hover:text-blue-400 transition-colors">Gizlilik Politikası</a></li>
              <li><a href="/faq" className="hover:text-blue-400 transition-colors">Sıkça Sorulan Sorular</a></li>
              <li><a href="/contact" className="hover:text-blue-400 transition-colors">İletişim</a></li>

            </ul>

          </div>

          <div>

            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Bize Ulaşın</h4>

            <div className="space-y-3 text-sm">

              <div className="flex items-center space-x-3">

                <Mail size={16} className="text-blue-500" />
                <span>destek@smarthub.com</span>

              </div>

              <div className="flex items-center space-x-3">

                <Phone size={16} className="text-blue-500" />
                <span>+90 (212) 123 45 67</span>

              </div>

              <div className="flex space-x-4 pt-2">

                <a href="/twitter" className="text-slate-400 hover:text-white transition-colors"><Twitter size={18} /></a>
                <a href="/instagram" className="text-slate-400 hover:text-white transition-colors"><Instagram size={18} /></a>
                <a href="/linkedin" className="text-slate-400 hover:text-white transition-colors"><Linkedin size={18} /></a>

              </div>

            </div>

          </div>

        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center text-[12px] text-slate-500">

          <p>&copy; {currentYear} SmartHub Otomasyon Sistemleri. Tüm hakları saklıdır.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 uppercase tracking-tighter italic font-medium text-slate-400">Smarthub Software Solutions</div>

        </div>

      </div>

    </footer>

  );
};

export default Footer;