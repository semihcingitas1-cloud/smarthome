import React, { useState } from 'react';
import EditorSidebar from '../../layout/EditorSidebar';
import { 
  MessageSquare, 
  Search, 
  Send, 
  MoreVertical, 
  Phone, 
  Video, 
  Paperclip, 
  Smile,
  X,
  Check,
  CheckCheck,
  Clock,
  AlertCircle,
  Archive,
  Star,
  Filter
} from 'lucide-react';

const mockUsers = [
  { 
    id: 1, 
    name: 'Semih Cingitaş', 
    email: 'semih@example.com',
    lastMessage: 'Ödeme dökümanını incelediniz mi?', 
    time: '14:32', 
    unread: 2, 
    online: true,
    status: 'active',
    avatar: null
  },
  { 
    id: 2, 
    name: 'Ahmet Yılmaz', 
    email: 'ahmet@example.com',
    lastMessage: 'Sunucu loglarında hata görünüyor.', 
    time: 'Dün', 
    unread: 0, 
    online: false,
    status: 'resolved',
    avatar: null
  },
  { 
    id: 3, 
    name: 'Ayşe Demir', 
    email: 'ayse@example.com',
    lastMessage: 'Abonelik sistemim aktifleşti mi?', 
    time: '30 May', 
    unread: 0, 
    online: true,
    status: 'pending',
    avatar: null
  },
];

const mockMessages = {
  1: [
    { 
      id: 101, 
      sender: 'user', 
      text: 'Merhaba editör bey, iyzico entegrasyonunda bir sorun yaşıyorum.', 
      time: '14:25',
      status: 'read'
    },
    { 
      id: 102, 
      sender: 'editor', 
      text: 'Selamlar Semih, hangi adımda hata alıyorsun? Webhook tarafında mı?', 
      time: '14:28',
      status: 'read'
    },
    { 
      id: 103, 
      sender: 'user', 
      text: 'Ödeme dökümanını incelediniz mi? Oradaki parametrelerde çakışma var sanırım.', 
      time: '14:32',
      status: 'delivered'
    },
  ],
  2: [
    { 
      id: 201, 
      sender: 'user', 
      text: 'Sunucu loglarında hata görünüyor.', 
      time: 'Dün',
      status: 'read'
    }
  ],
  3: [
    { 
      id: 301, 
      sender: 'user', 
      text: 'Abonelik sistemim aktifleşti mi?', 
      time: '30 May',
      status: 'read'
    }
  ],
};

const EditorMessage = () => {
  const [selectedUserId, setSelectedUserId] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const activeUser = mockUsers.find(u => u.id === selectedUserId);
  const currentMessages = mockMessages[selectedUserId] || [];
  const totalUnread = mockUsers.reduce((acc, user) => acc + user.unread, 0);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    console.log(`Kullanıcı ${selectedUserId} için gönderilen mesaj:`, newMessage);
    setNewMessage('');
  };

  const MessageStatusIcon = ({ status }) => {
    switch(status) {
      case 'sent':
        return <Check size={14} className="text-slate-400" />;
      case 'delivered':
        return <CheckCheck size={14} className="text-slate-400" />;
      case 'read':
        return <CheckCheck size={14} className="text-blue-400" />;
      default:
        return <Clock size={14} className="text-slate-500" />;
    }
  };

  const StatusBadge = ({ status }) => {
    const config = {
      active: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', label: 'Aktif' },
      pending: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', label: 'Bekliyor' },
      resolved: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20', label: 'Çözüldü' },
    };
    
    const style = config[status] || config.pending;
    
    return (
      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${style.bg} ${style.text} ${style.border}`}>
        {style.label}
      </span>
    );
  };

  return (

    <div className="flex min-h-screen dark:bg-slate-950 bg-slate-50 dark:text-slate-100 text-slate-900 transition-colors duration-300">

      <EditorSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        <div className="sticky top-0 z-40 px-6 py-4 border-b backdrop-blur-md dark:bg-slate-950/80 dark:border-slate-800 bg-white/80 border-slate-200">

          <div className="max-w-full flex items-center justify-between gap-4">

            <div>

              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest mb-0.5 text-blue-500"><MessageSquare size={12} /> Müşteri İletişimi</div>
              <h1 className="text-xl font-black tracking-tight flex items-center gap-2 dark:text-white text-slate-900">Mesajlaşma{totalUnread > 0 && ( <span className="text-xs px-2 py-0.5 rounded-full font-mono font-bold bg-blue-500 text-white">{totalUnread} yeni</span> )}</h1>

            </div>

            <div className="flex items-center gap-2">

              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-xl px-3 py-2 text-sm border outline-none appearance-none cursor-pointer transition-colors dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 bg-slate-100 border-slate-200 text-slate-800">

                <option value="all">Tüm Durumlar</option>
                <option value="active">Aktif</option>
                <option value="pending">Bekliyor</option>
                <option value="resolved">Çözüldü</option>

              </select>

              <button className="p-2.5 rounded-xl border transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800">
                <Archive size={17} />
              </button>

            </div>

          </div>

        </div>

        <div className="flex-1 flex overflow-hidden">

          <div className="w-80 xl:w-96 border-r dark:border-slate-800 border-slate-200 flex flex-col dark:bg-slate-900 bg-white">

            <div className="p-4 border-b dark:border-slate-800 border-slate-200">

              <div className="relative">

                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input type="text" placeholder="Kullanıcı veya e-posta ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-xl pl-10 pr-10 py-2.5 text-sm border outline-none transition-colors dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 dark:placeholder:text-slate-600 dark:focus:border-blue-500/60 bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-400"/>
                {searchQuery && ( <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"><X size={14} /></button> )}

              </div>

            </div>

            <div className="flex-1 overflow-y-auto divide-y dark:divide-slate-800 divide-slate-100">

              {filteredUsers.length > 0 ? ( filteredUsers.map((user) => ( <button key={user.id} onClick={() => setSelectedUserId(user.id)} className={`w-full text-left p-4 flex items-start gap-3 transition-all group ${selectedUserId === user.id ? 'dark:bg-slate-800/80 bg-blue-50/80 border-l-2 border-blue-500' : 'dark:hover:bg-slate-800/40 hover:bg-slate-50'}`}>

                <div className="relative flex-shrink-0">

                  <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl flex items-center justify-center font-bold text-white uppercase text-sm shadow-lg shadow-blue-500/20">{user.name.substring(0, 2)}</div>
                  {user.online && ( <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 dark:border-slate-900 border-white rounded-full"></span> )}

                </div>

                <div className="flex-1 min-w-0">

                  <div className="flex justify-between items-baseline mb-1">

                    <h2 className="text-sm font-bold dark:text-slate-200 text-slate-800 truncate group-hover:text-blue-500 transition-colors">{user.name}</h2>
                    <span className="text-[10px] dark:text-slate-500 text-slate-400 font-mono">{user.time}</span>

                  </div>

                  <p className="text-xs dark:text-slate-400 text-slate-500 truncate mb-1.5">{user.lastMessage}</p>

                  <div className="flex items-center justify-between">

                    <StatusBadge status={user.status} />
                    {user.unread > 0 && ( <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-blue-500/30">{user.unread}</span> )}

                  </div>

                </div>

              </button> )) ) : ( <div className="flex flex-col items-center justify-center py-20 text-slate-500">

                <Search size={40} className="dark:text-slate-700 text-slate-300 mb-3" strokeWidth={1.5} />
                <p className="text-sm font-medium">Kullanıcı bulunamadı</p>

              </div> )}

            </div>

          </div>

          <div className="flex-1 flex flex-col dark:bg-slate-950 bg-slate-50">

            {activeUser ? ( <>

              <div className="p-4 dark:bg-slate-900/60 bg-white border-b dark:border-slate-800 border-slate-200 flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="relative">

                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl flex items-center justify-center font-bold text-white uppercase text-sm">{activeUser.name.substring(0, 2)}</div>
                    {activeUser.online && ( <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 dark:border-slate-900 border-white rounded-full"></span> )}

                  </div>

                  <div>

                    <h2 className="text-sm font-bold dark:text-white text-slate-900">{activeUser.name}</h2>
                    <p className="text-xs dark:text-slate-400 text-slate-500 flex items-center gap-1.5">{activeUser.online ? ( <><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>Çevrimiçi</> ) : ( 'Çevrimdışı' )}</p>

                  </div>

                </div>

                <div className="flex items-center gap-1">

                  <button className="p-2.5 rounded-xl transition-all dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 text-slate-500 hover:text-slate-800" title="Sesli Arama">
                    <Phone size={17} />
                  </button>

                  <button className="p-2.5 rounded-xl transition-all dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 text-slate-500 hover:text-slate-800" title="Görüntülü Arama">
                    <Video size={17} />
                  </button>

                  <button className="p-2.5 rounded-xl transition-all dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 text-slate-500 hover:text-slate-800" title="Favorilere Ekle">
                    <Star size={17} />
                  </button>

                  <button className="p-2.5 rounded-xl transition-all dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 text-slate-500 hover:text-slate-800" title="Daha Fazla">
                    <MoreVertical size={17} />
                  </button>

                </div>

              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">

                {currentMessages.map((msg) => {

                  const isEditor = msg.sender === 'editor';

                  return (

                    <div key={msg.id} className={`flex ${isEditor ? 'justify-end' : 'justify-start'} animate-fade-in`}>

                      <div className={`max-w-[70%] ${isEditor ? 'order-2' : 'order-1'}`}>

                        <div className={`rounded-2xl px-4 py-3 text-sm shadow-lg ${isEditor ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-sm' : 'dark:bg-slate-800 bg-white dark:text-slate-100 text-slate-800 rounded-tl-sm border dark:border-slate-700 border-slate-200'}`}>
                          <p className="leading-relaxed">{msg.text}</p>
                        </div>

                        <div className={`flex items-center gap-1.5 mt-1.5 px-1 ${isEditor ? 'justify-end' : 'justify-start'}`}>

                          <span className="text-[10px] dark:text-slate-500 text-slate-400 font-mono">{msg.time}</span>
                          {isEditor && <MessageStatusIcon status={msg.status} />}

                        </div>

                      </div>

                    </div>

                  );
                })}

              </div>

              <form onSubmit={handleSendMessage} className="p-4 dark:bg-slate-900 bg-white border-t dark:border-slate-800 border-slate-200">

                <div className="flex items-end gap-3">

                  <button  type="button" className="p-2.5 rounded-xl transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800" title="Dosya Ekle">
                    <Paperclip size={18} />
                  </button>

                  <div className="flex-1 relative">

                    <textarea placeholder="Mesajınızı yazın..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => {

                      if (e.key === 'Enter' && !e.shiftKey) {

                        e.preventDefault();
                        handleSendMessage(e);
                      }

                    }}
                    rows={1}
                    className="w-full bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 border-slate-200 rounded-xl px-4 py-3 pr-12 text-sm dark:text-slate-200 text-slate-800 dark:placeholder-slate-500 placeholder-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 resize-none transition-colors"
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                    />

                    <button type="button" className="absolute right-3 bottom-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                      <Smile size={18} />
                    </button>

                  </div>

                  <button type="submit" disabled={!newMessage.trim()} className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white p-3 rounded-xl font-semibold transition-all active:scale-95 shadow-lg shadow-blue-500/20 disabled:shadow-none">
                    <Send size={18} />
                  </button>

                </div>

                <p className="text-[10px] dark:text-slate-600 text-slate-400 mt-2 px-1"><span className="font-mono">Enter</span> ile gönder, <span className="font-mono">Shift + Enter</span> ile yeni satır</p>

              </form>

            </> ) : ( <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-6">

              <div className="w-20 h-20 rounded-2xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 flex items-center justify-center mb-4 shadow-xl"><MessageSquare size={36} className="dark:text-slate-700 text-slate-300" strokeWidth={1.5} /></div>
              <h3 className="text-lg font-bold dark:text-slate-400 text-slate-600 mb-2">Sohbet Başlatın</h3>
              <p className="text-sm dark:text-slate-600 text-slate-400 text-center max-w-sm">Sol taraftan bir kullanıcı seçerek müşterilerinizle profesyonel bir şekilde iletişime geçin.</p>

            </div> )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default EditorMessage;