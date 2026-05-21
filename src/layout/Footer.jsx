import React from 'react';

import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, Home } from 'lucide-react';

const Footer = () => {

  const currentYear = new Date().getFullYear();

  return (

    <footer className="w-full bg-gray-100 dark:bg-slate-950 text-gray-700 dark:text-slate-300 border-t border-gray-300 dark:border-slate-800 pt-14 pb-6 px-6 transition-colors duration-300">

      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          <div>

            <div className="flex items-center space-x-2 mb-4">

              <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/30"><Home size={20} className="text-white" /></div>
              <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">SMART<span className="text-blue-500">HUB</span></span>

            </div>

            <p className="text-sm leading-relaxed text-gray-600 dark:text-slate-400 mb-4">Geleceğin yaşam alanlarını bugünden yönetin. Güvenli, akıllı ve sürdürülebilir ev otomasyon çözümleri.</p>

            <div className="flex space-x-4">

              {[Twitter, Instagram, Linkedin, Facebook].map((Icon, i) => ( <a key={i} href="#" className="p-2 bg-gray-200 dark:bg-slate-800 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white transition-all duration-300 text-gray-700 dark:text-slate-300">
                <Icon size={16} />
              </a> ))}

            </div>

          </div>

          <div>

            <h4 className="text-gray-900 dark:text-white font-semibold mb-4 text-sm uppercase tracking-wider">Hızlı Erişim</h4>

            <ul className="space-y-2 text-sm">

              {[
                { name: 'Ana Sayfa', link: '/' },
                { name: 'Cihaz Yönetimi', link: '/devices' },
                { name: 'İstatistikler', link: '/statistics' },
                { name: 'Senaryolar', link: '/scenarios' }
              ].map((item, i) => ( <li key={i}>

                <a href={item.link} className="text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {item.name}
                </a>

              </li> ))}

            </ul>

          </div>

          <div>

            <h4 className="text-gray-900 dark:text-white font-semibold mb-4 text-sm uppercase tracking-wider">Destek</h4>

            <ul className="space-y-2 text-sm">

              {[
                { name: 'Kullanım Kılavuzu', link: '/guides' },
                { name: 'Gizlilik Politikası', link: '/privacy' },
                { name: 'SSS', link: '/faq' },
                { name: 'İletişim', link: '/contact' }
              ].map((item, i) => ( <li key={i}>

                <a href={item.link} className="text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {item.name}
                </a>

              </li> ))}

            </ul>

          </div>

          <div>

            <h4 className="text-gray-900 dark:text-white font-semibold mb-4 text-sm uppercase tracking-wider">Bize Ulaşın</h4>

            <div className="space-y-3 text-sm">

              <div className="flex items-center space-x-3">

                <Mail size={16} className="text-blue-500" />
                <span className="text-gray-600 dark:text-slate-400">destek@smarthub.com</span>

              </div>

              <div className="flex items-center space-x-3">

                <Phone size={16} className="text-blue-500" />
                <span className="text-gray-600 dark:text-slate-400">+90 551 133 54 10</span>

              </div>

              <div className="pt-4">

                <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">Bültene abone olun</p>

                <div className="flex">

                  <input type="email" placeholder="E-posta" className="w-full px-3 py-2 rounded-l-lg bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors"/>
                  <button className="px-4 bg-blue-600 rounded-r-lg text-white text-sm hover:bg-blue-700 transition-colors shadow-md">Gönder</button>

                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="border-t border-gray-300 dark:border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 dark:text-slate-500">

          <p>&copy; {currentYear} SmartHub Otomasyon Sistemleri. Tüm hakları saklıdır.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 uppercase italic font-medium text-gray-600 dark:text-slate-400"><span>Smarthub Software Solutions</span></div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;