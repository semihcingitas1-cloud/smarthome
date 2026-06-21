import React, { useEffect, useMemo, useRef, useState } from "react";
import io from "socket.io-client";

import { Search, X, Trash2, ShieldCheck, MessageCircle, Send, Zap, CheckCheck, Check, User, ArrowLeft, Filter, Circle } from "lucide-react";

const SOCKET_URL = "https://backend-d72l.onrender.com";

const SOCKET_ENABLED = false;

const MessagesAdminNew = () => {

  const socketRef = useRef(null);

  const [customers, setCustomers] = useState([

    { id: "u1", name: "Ahmet Yılmaz", email: "ahmet@mail.com" },
    { id: "u2", name: "Zeynep Kaya", email: "zeynep@mail.com" },
    { id: "u3", name: "Mehmet Demir", email: "mehmet@mail.com" },
  ]);

  const [conversations, setConversations] = useState({

    u1: [

      { id: "m1", from: "user", text: "Merhaba, üyelik planları hakkında bilgi alabilir miyim?", time: "10:12", isSeen: true },
      { id: "m2", from: "admin", text: "Tabii, hangi planla ilgileniyorsunuz?", time: "10:13", isSeen: true },
    ],
    u2: [{ id: "m3", from: "user", text: "Ödeme yaptıktan sonra faturayı nereden indirebilirim?", time: "09:40", isSeen: false }],
    u3: [{ id: "m4", from: "user", text: "Cihaz eklerken hata alıyorum, yardımcı olur musunuz?", time: "Dün", isSeen: false }],
  });

  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const selectedCustomer = useMemo(() => customers.find((c) => c.id === selectedCustomerId) || null, [customers, selectedCustomerId]);

  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [filterTab, setFilterTab] = useState("all");

  const [onlineSet, setOnlineSet] = useState(() => new Set(["u1"]));
  const [typingMap, setTypingMap] = useState({});
  const [unreadMap, setUnreadMap] = useState({ u2: 1, u3: 1 });

  const bottomRef = useRef(null);

  const quickReplies = [

    "Merhaba, nasıl yardımcı olabilirim?",
    "İşleminizi kontrol ediyorum, 1 dakika lütfen.",
    "Sorununuz çözüldü mü? Ek bir isteğiniz var mı?",
    "Faturanızı Hesap > Faturalar bölümünden indirebilirsiniz.",
  ];

  const totalUnread = useMemo(() => Object.values(unreadMap).reduce((a, b) => a + b, 0), [unreadMap]);

  const selectedConversation = useMemo(() => {

    if (!selectedCustomerId) return [];
    return conversations[selectedCustomerId] || [];
  }, [conversations, selectedCustomerId]);

  const lastByCustomer = useMemo(() => {

    const map = {};
    customers.forEach((c) => {
      const conv = conversations[c.id] || [];
      const last = conv[conv.length - 1];
      map[c.id] = {
        text: last?.text || "",
        time: last?.time || "",
        from: last?.from || "user",
      };
    });
    return map;
  }, [customers, conversations]);

  const filteredCustomers = useMemo(() => {

    const q = query.trim().toLowerCase();

    return customers.filter((c) => (q ? c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) : true)).filter((c) => {

      if (filterTab === "unread") return (unreadMap[c.id] || 0) > 0;
      if (filterTab === "online") return onlineSet.has(c.id);
      return true;
    });
  }, [customers, query, filterTab, unreadMap, onlineSet]);

  useEffect(() => {

    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedCustomerId, selectedConversation.length]);

  const openConversation = (customerId) => {

    setSelectedCustomerId(customerId);
    setUnreadMap((prev) => ({ ...prev, [customerId]: 0 }));
    setConversations((prev) => {

      const next = { ...prev };
      const conv = next[customerId] || [];
      next[customerId] = conv.map((m) => (m.from === "user" ? { ...m, isSeen: true } : m));
      return next;
    });

    if (SOCKET_ENABLED && socketRef.current) {

      socketRef.current.emit("mark_as_seen", { senderId: customerId, receiverId: "admin" });
    }
  };

  const handleSend = (textOverride) => {

    const text = (typeof textOverride === "string" ? textOverride : message).trim();
    if (!selectedCustomerId || !text) return;

    const newMsg = {

      id: `m_${Date.now()}`,
      from: "admin",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSeen: false,
    };

    setConversations((prev) => ({ ...prev, [selectedCustomerId]: [...(prev[selectedCustomerId] || []), newMsg], }));
    setMessage("");

    if (SOCKET_ENABLED && socketRef.current) {

      socketRef.current.emit("send_message", {

        senderId: "admin",
        receiverId: selectedCustomerId,
        senderName: "Admin",
        message: text,
        time: newMsg.time,
        isSeen: false,
      });
      socketRef.current.emit("typing", { receiverId: selectedCustomerId, senderId: "admin", isTyping: false });
    }
  };

  const deleteConversation = (customerId) => {

    if (!customerId) return;
    if (!window.confirm("Bu sohbet silinsin mi?")) return;

    setConversations((prev) => {

      const next = { ...prev };
      delete next[customerId];
      return next;
    });

    setUnreadMap((prev) => {
      const next = { ...prev };
      delete next[customerId];
      return next;
    });

    setCustomers((prev) => prev.filter((c) => c.id !== customerId));
    if (selectedCustomerId === customerId) setSelectedCustomerId(null);

    if (SOCKET_ENABLED && socketRef.current) {
      socketRef.current.emit("delete_chat", { adminId: "admin", userId: customerId });
    }
  };

  const onTyping = (val) => {
    setMessage(val);

    if (SOCKET_ENABLED && socketRef.current && selectedCustomerId) {
      socketRef.current.emit("typing", {
        receiverId: selectedCustomerId,
        senderId: "admin",
        isTyping: val.length > 0,
      });
    }
  };

  // --- Socket integration (opsiyonel) ---
  useEffect(() => {
    if (!SOCKET_ENABLED) return;

    const s = io(SOCKET_URL);
    socketRef.current = s;

    s.emit("join_chat", "admin");
    s.emit("get_unread_counts");
    s.emit("get_old_messages", { userId: "admin" });

    s.on("old_messages", (data) => {
      // Bu kısım backend formatına göre uyarlanmalı (senin önceki kodunla benzer).
      // Burada sadece örnek bıraktım.
      // setCustomers(...)
      // setConversations(...)
    });

    s.on("unread_counts_data", (data) => {
      const counts = {};
      data.forEach((x) => (counts[x._id] = x.count));
      setUnreadMap(counts);
    });

    s.on("receive_message", (data) => {
      const partnerId = data.senderId === "admin" ? data.receiverId : data.senderId;
      const partnerName = data.senderName || "Müşteri";

      // ensure customer exists
      setCustomers((prev) => (prev.some((c) => c.id === partnerId) ? prev : [{ id: partnerId, name: partnerName, email: "" }, ...prev]));

      // append message
      const msg = {
        id: `m_${Date.now()}`,
        from: data.senderId === "admin" ? "admin" : "user",
        text: data.message,
        time: data.time,
        isSeen: !!data.isSeen,
      };

      setConversations((prev) => ({
        ...prev,
        [partnerId]: [...(prev[partnerId] || []), msg],
      }));

      // unread logic
      if (partnerId !== selectedCustomerId && data.senderId !== "admin") {
        setUnreadMap((prev) => ({ ...prev, [partnerId]: (prev[partnerId] || 0) + 1 }));
      }
    });

    s.on("user_typing", ({ senderId, isTyping }) => {
      setTypingMap((prev) => ({ ...prev, [senderId]: isTyping }));
    });

    s.on("user_status_changed", ({ userId, status }) => {
      setOnlineSet((prev) => {
        const next = new Set(prev);
        status === "online" ? next.add(userId) : next.delete(userId);
        return next;
      });
    });

    return () => {
      s.disconnect();
      socketRef.current = null;
    };
  }, [selectedCustomerId]);

  return (

    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white transition-colors duration-300">

      <div className="max-w-[1400px] mx-auto px-4 py-6">

        <div className="mb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">

          <div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Yönetici Mesaj Merkezi</h1>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">Müşteri mesajlarını görüntüleyin ve hızlıca yanıtlayın.</p>

          </div>

          <div className="flex gap-2">

            <div className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm dark:shadow-none flex items-center gap-2">

              <MessageCircle size={16} className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-gray-700 dark:text-slate-300">Okunmamış: <span className="font-extrabold text-blue-600 dark:text-blue-400">{totalUnread}</span></span>

            </div>

            <div className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm dark:shadow-none flex items-center gap-2">

              <ShieldCheck size={16} className="text-green-600 dark:text-green-400" />
              <span className="text-sm text-gray-700 dark:text-slate-300">Canlı Destek</span>

            </div>

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-4">

          <aside className={`bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-lg dark:shadow-none overflow-hidden ${selectedCustomerId ? "hidden md:block" : "block"}`}>

            <div className="px-5 py-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">

              <div className="font-extrabold flex items-center gap-2">
                <Filter size={16} className="text-gray-500 dark:text-slate-400" />
                Gelen Kutusu
              </div>

              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 font-bold">{customers.length}</span>

            </div>

            <div className="p-4 border-b border-gray-200 dark:border-slate-800">

              <div className="relative">

                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Müşteri ara (isim/e-posta)..." className="w-full pl-9 pr-9 py-2.5 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm focus:outline-none focus:border-blue-500"/>

                {query && ( <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:text-slate-500 dark:hover:text-slate-200" aria-label="Temizle">
                  <X size={16} />
                </button> )}

              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">

                {[
                  { id: "all", label: "Tümü" },
                  { id: "unread", label: "Okunmamış" },
                  { id: "online", label: "Online" },
                ].map((t) => ( <button key={t.id} onClick={() => setFilterTab(t.id)} className={`py-2 rounded-xl text-xs font-extrabold transition-colors ${filterTab === t.id ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"}`}>
                  {t.label}
                </button> ))}

              </div>

            </div>

            <div className="max-h-[calc(85vh-210px)] overflow-y-auto">

              {filteredCustomers.length === 0 ? ( <div className="p-10 text-center text-gray-500 dark:text-slate-500">

                <MessageCircle size={44} className="mx-auto mb-3 opacity-30" />
                <p className="font-semibold">Sonuç bulunamadı</p>
                <p className="text-xs mt-1">Arama veya filtreyi değiştirin.</p>

              </div> ) : (

                filteredCustomers.map((c) => {

                  const unread = unreadMap[c.id] || 0;
                  const active = c.id === selectedCustomerId;
                  const online = onlineSet.has(c.id);
                  const typing = typingMap[c.id];
                  const last = lastByCustomer[c.id];

                  return (

                    <button
                      key={c.id}
                      onClick={() => openConversation(c.id)}
                      className={`w-full text-left px-4 py-4 border-b border-gray-100 dark:border-slate-800/60 transition-colors group ${
                        active ? "bg-blue-50 dark:bg-blue-500/10" : "hover:bg-gray-50 dark:hover:bg-slate-800/60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          <div className="w-11 h-11 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center border border-gray-200 dark:border-slate-700">
                            <User size={18} className="text-gray-500 dark:text-slate-300" />
                          </div>
                          <span
                            className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                              online ? "bg-green-500" : "bg-gray-300 dark:bg-slate-700"
                            }`}
                            title={online ? "Online" : "Offline"}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-extrabold text-sm truncate">{c.name}</p>
                            <span className="text-[10px] text-gray-400 dark:text-slate-500 flex-shrink-0">
                              {last?.time || ""}
                            </span>
                          </div>

                          <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                            {typing ? <span className="text-blue-600 dark:text-blue-400 italic">Yazıyor...</span> : (last?.text || "Konuşmayı aç")}
                          </p>

                          <p className="text-[10px] text-gray-400 dark:text-slate-600 truncate mt-0.5">
                            {c.email}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          {unread > 0 && (
                            <span className="text-[10px] font-black bg-blue-600 text-white px-2 py-1 rounded-full">
                              {unread}
                            </span>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteConversation(c.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                            title="Sohbeti Sil"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* Chat */}
          <section className={`bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-lg dark:shadow-none overflow-hidden ${!selectedCustomerId ? "hidden md:block" : "block"}`}>
            {!selectedCustomerId ? (
              <div className="h-[80vh] flex items-center justify-center p-10 text-center">
                <div>
                  <div className="mx-auto w-16 h-16 rounded-3xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center mb-4">
                    <MessageCircle size={28} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-xl font-extrabold">Bir müşteri seçin</h2>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">
                    Soldaki listeden bir konuşma seçerek mesajları görüntüleyin.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-[80vh]">
                {/* Chat topbar */}
                <div className="px-5 py-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => setSelectedCustomerId(null)}
                      className="md:hidden p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                      aria-label="Geri"
                    >
                      <ArrowLeft size={18} />
                    </button>

                    <div className="w-11 h-11 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center border border-gray-200 dark:border-slate-700">
                      <User size={18} className="text-gray-500 dark:text-slate-300" />
                    </div>

                  <div className="min-w-0">

                    <p className="font-extrabold truncate">{selectedCustomer?.name}</p>

                    <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-slate-400">

                      <span className="inline-flex items-center gap-1">

                        <Circle size={10} className={onlineSet.has(selectedCustomerId) ? "text-green-500 fill-green-500" : "text-gray-300 dark:text-slate-700 fill-current"}/>
                        {onlineSet.has(selectedCustomerId) ? "Online" : "Offline"}

                      </span>

                      {typingMap[selectedCustomerId] && ( <span className="text-blue-600 dark:text-blue-400 italic animate-pulse">yazıyor...</span> )}
                      <span className="truncate">{selectedCustomer?.email}</span>

                    </div>

                  </div>

                </div>

                <button onClick={() => deleteConversation(selectedCustomerId)} className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" title="Sohbeti Sil">
                  <Trash2 size={18} />
                </button>

              </div>

              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 bg-gray-50 dark:bg-slate-950/40 space-y-3">

                {selectedConversation.map((m) => {

                  const mine = m.from === "admin";

                  return (

                    <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>

                      <div className={`max-w-[90%] sm:max-w-[70%] rounded-3xl px-4 py-3 shadow-sm ${mine ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-tr-lg" : "bg-white dark:bg-slate-900 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-800 rounded-tl-lg"}`}>

                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>

                        <div className={`mt-2 flex items-center justify-end gap-1 text-[10px] ${mine ? "text-white/80" : "text-gray-500 dark:text-slate-500"}`}>

                          <span>{m.time}</span>
                          {mine && (m.isSeen ? <CheckCheck size={14} /> : <Check size={14} />)}

                        </div>

                      </div>

                    </div>
                  );
                })}

                <div ref={bottomRef} />

              </div>

              <div className="px-4 sm:px-6 py-3 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">

                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">

                  <Zap size={14} className="text-amber-500 flex-shrink-0" />
                  {quickReplies.map((r, i) => ( <button key={i} onClick={() => handleSend(r)} className="text-[11px] px-3 py-2 rounded-full whitespace-nowrap border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 text-gray-700 dark:text-slate-200 hover:border-blue-300 dark:hover:border-blue-500/40 hover:bg-white dark:hover:bg-slate-800 transition-colors">{r}</button> ))}

                </div>

              </div>

              <div className="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">

                <div className="flex items-center gap-3">

                  <input value={message} onChange={(e) => onTyping(e.target.value)} onKeyDown={(e) => {if (e.key === "Enter") handleSend();}} placeholder="Yanıt yazın..." className="flex-1 px-4 py-3 rounded-2xl bg-gray-100 dark:bg-slate-800 border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400"/>
                  <button onClick={() => handleSend()} className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition-all active:scale-[0.98]" title="Gönder"><Send size={18} /></button>

                </div>

                <p className="mt-3 text-[11px] text-gray-500 dark:text-slate-500 flex items-center gap-2"><ShieldCheck size={14} className="text-green-600 dark:text-green-400" />Yönetici paneli üzerinden gönderilen yanıtlar müşteriye anında iletilir.</p>

              </div>

            </div> )}

          </section>

        </div>

      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default MessagesAdminNew;