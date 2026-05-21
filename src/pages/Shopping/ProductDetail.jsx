import React, { useState } from "react";

import { Star, Heart, ShoppingCart, Minus, Plus, ShieldCheck, Truck, RotateCcw, Check, ArrowRight, Share2, ZoomIn, Gift, Award, Clock, Users, TrendingUp, Package, CreditCard, Info, X, ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { FaWhatsapp, FaTwitter, FaLink } from 'react-icons/fa6';

const ProductDetail = () => {

  const product = {
    name: "Smart LED Panel Pro",
    price: "₺1.299",
    oldPrice: "₺1.699",
    rating: 4.9,
    reviews: 128,
    stock: 47,
    soldCount: 342,
    badge: "Çok Satan",
    description:
      "Akıllı LED panel ile evinizin atmosferini tek dokunuşla değiştirin. WiFi kontrollü, enerji tasarruflu ve sesli asistan destekli.",
    images: [
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e",
    ],
    colors: [
      { name: "Siyah", value: "bg-black", hex: "#000000" },
      { name: "Beyaz", value: "bg-white", hex: "#FFFFFF" },
      { name: "Mavi", value: "bg-blue-500", hex: "#3B82F6" },
      { name: "Mor", value: "bg-purple-500", hex: "#A855F7" },
    ],
    models: [
      { name: "Standart", price: 999, features: ["Temel Özellikler", "WiFi"] },
      { name: "Pro", price: 1299, features: ["Gelişmiş RGB", "Sesli Asistan", "Zamanlayıcı"] },
      { name: "Ultra", price: 1599, features: ["4K Kontrol", "AI Optimizasyon", "Premium Destek"] },
    ],
    features: [
      "WiFi 2.4GHz & 5GHz Desteği",
      "16 Milyon Renk Seçeneği",
      "Alexa & Google Home Uyumlu",
      "Enerji Tasarrufu Modu",
      "Zamanlama & Otomasyon",
      "Müzik Senkronizasyonu"
    ],
    specs: {
      "Güç Tüketimi": "18W",
      "Ömür": "50.000 saat",
      "Bağlantı": "WiFi 2.4/5GHz",
      "Boyut": "30x30 cm",
      "Ağırlık": "450g",
      "Garanti": "2 Yıl"
    }
  };

  const reviews = [
    {
      id: 1,
      name: "Ahmet Y.",
      rating: 5,
      date: "2 gün önce",
      comment: "Harika ürün! Kurulumu çok kolay, uygulama kullanışlı. Renk seçenekleri muhteşem.",
      verified: true,
      images: ["https://images.unsplash.com/photo-1519710164239-da123dc03ef4"]
    },
    {
      id: 2,
      name: "Zeynep K.",
      rating: 4,
      date: "1 hafta önce",
      comment: "Kaliteli bir ürün. Sadece WiFi bağlantısı bazen kopuyor ama genel olarak memnunum.",
      verified: true
    },
    {
      id: 3,
      name: "Mehmet D.",
      rating: 5,
      date: "2 hafta önce",
      comment: "Çocuk odası için aldım, çok beğendiler. Renkleri değiştirmek çok eğlenceli.",
      verified: false
    }
  ];

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedModel, setSelectedModel] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const discountPercentage = Math.round(

    ((parseFloat(product.oldPrice.replace(/[₺,.]/g, "")) - parseFloat(product.price.replace(/[₺,.]/g, ""))) / parseFloat(product.oldPrice.replace(/[₺,.]/g, ""))) * 100
  );

  const handleAddToCart = () => {

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleImageNavigation = (direction) => {

    if (direction === "next") {

      setSelectedImage((prev) => (prev + 1) % product.images.length);
    } else {

      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const getCurrentPrice = () => {

    return `₺${product.models[selectedModel].price.toLocaleString()}`;
  };

  return (

    <div className="bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white min-h-screen py-8 px-4 md:px-6 transition-colors duration-300">

      <div className="max-w-7xl mx-auto">

        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 mb-8">

          <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">Ana Sayfa</span>
          <ChevronRight size={14} />
          <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">Aydınlatma</span>
          <ChevronRight size={14} />
          <span className="text-gray-900 dark:text-white">{product.name}</span>

        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">

          <div className="space-y-4">

            <div className="relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-slate-800 group shadow-lg dark:shadow-none">

              {product.badge && ( <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 text-white shadow-lg">

                <TrendingUp size={16} />
                {product.badge}

              </div> )}

              <div className="absolute top-4 right-4 z-10 bg-red-500 px-3 py-1 rounded-full text-sm font-bold text-white shadow-lg">

                %{discountPercentage} İndirim

              </div>

              <img src={product.images[selectedImage]} alt="product" className="w-full h-[400px] md:h-[550px] object-cover cursor-zoom-in" onClick={() => setShowImageModal(true)} />

              <button onClick={() => handleImageNavigation("prev")} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 dark:bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm text-white">
                <ChevronLeft size={20} />
              </button>

              <button onClick={() => handleImageNavigation("next")} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 dark:bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm text-white">
                <ChevronRight size={20} />
              </button>

              <button onClick={() => setShowImageModal(true)} className="absolute bottom-4 right-4 w-10 h-10 bg-black/50 dark:bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm text-white">
                <ZoomIn size={18} />
              </button>

            </div>

            <div className="grid grid-cols-4 gap-3">

              {product.images.map((img, i) => ( <button key={i} onClick={() => setSelectedImage(i)} className={`rounded-2xl overflow-hidden border-2 transition-all ${selectedImage === i ? "border-blue-500 scale-105 shadow-lg" : "border-gray-300 dark:border-slate-800 hover:border-gray-400 dark:hover:border-slate-600"}`}>

                <img src={img} alt="" className="h-20 md:h-24 w-full object-cover" />

              </button> ))}

            </div>

          </div>

          <div className="space-y-6">

            <div className="flex items-center justify-between">

              <div className="inline-flex bg-green-500/10 text-green-600 dark:text-green-400 px-4 py-2 rounded-full text-sm">

                <Package size={16} className="mr-2" />
                {product.stock} adet stokta

              </div>

              <div className="relative">

                <button onClick={() => setShowShareMenu(!showShareMenu)} className="w-10 h-10 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors shadow-md dark:shadow-none">
                  <Share2 size={18} />
                </button>

                {showShareMenu && ( <div className="absolute right-0 mt-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-3 space-y-2 z-20 min-w-[170px] shadow-xl">

                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-sm flex items-center gap-2 text-gray-900 dark:text-white transition-colors">
                    <FaWhatsapp size={16} className="text-green-500" /> WhatsApp
                  </button>

                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-sm flex items-center gap-2 text-gray-900 dark:text-white transition-colors">
                    <FaTwitter size={16} className="text-blue-400" /> Twitter
                  </button>

                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-sm flex items-center gap-2 text-gray-900 dark:text-white transition-colors">
                    <FaLink size={16} className="text-gray-500" /> Link Kopyala
                  </button>

                </div> )}

              </div>

            </div>

            <h1 className="text-3xl md:text-4xl font-bold leading-tight text-gray-900 dark:text-white">{product.name}</h1>

            <div className="flex flex-wrap items-center gap-4">

              <div className="flex items-center gap-2">

                <div className="flex text-yellow-500">

                  {[1, 2, 3, 4, 5].map((i) => ( <Star key={i} size={18} fill={i <= product.rating ? "currentColor" : "none"} /> ))}

                </div>

                <span className="text-gray-600 dark:text-slate-400 text-sm">{product.rating} ({product.reviews} değerlendirme)</span>

              </div>

              <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400 text-sm">

                <Users size={16} />
                {product.soldCount} satıldı

              </div>

            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-lg dark:shadow-none">

              <div className="flex items-baseline gap-4 mb-2">

                <span className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400">{getCurrentPrice()}</span>
                <span className="line-through text-gray-500 dark:text-slate-500 text-xl">{product.oldPrice}</span>
                <span className="bg-red-500/20 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-sm font-bold">%{discountPercentage} İNDİRİM</span>

              </div>

              <p className="text-gray-600 dark:text-slate-400 text-sm flex items-center gap-2"><Clock size={14} />Kampanya bitimine 2 gün 14 saat kaldı</p>

            </div>

            <p className="text-gray-700 dark:text-slate-400 leading-relaxed">{product.description}</p>

            <div>

              <div className="flex items-center justify-between mb-4">

                <h3 className="font-bold text-gray-900 dark:text-white">Renk: {selectedColor.name}</h3>
                <span className="text-sm text-gray-600 dark:text-slate-400">{product.colors.length} renk mevcut</span>

              </div>

              <div className="flex gap-3">

                {product.colors.map((color) => ( <button key={color.name} onClick={() => setSelectedColor(color)} className={`relative w-12 h-12 rounded-full ${color.value} border-4 transition-all ${selectedColor.name === color.name ? "border-blue-500 scale-110 shadow-lg" : "border-gray-300 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-600"}`} title={color.name}>

                  {selectedColor.name === color.name && ( <div className="absolute inset-0 flex items-center justify-center">

                    <Check size={20} className="text-white drop-shadow-lg" />

                  </div> )}

                </button> ))}

              </div>

            </div>

            <div>

              <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Model Seçimi</h3>

              <div className="grid gap-3">

                {product.models.map((model, index) => ( <button key={model.name} onClick={() => setSelectedModel(index)} className={`p-4 rounded-xl border text-left transition-all ${selectedModel === index ? "bg-blue-600 border-blue-600 scale-[1.02] text-white shadow-lg" : "border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-gray-400 dark:hover:border-slate-600 text-gray-900 dark:text-white"}`}>

                  <div className="flex items-center justify-between mb-2">

                    <span className="font-bold">{model.name}</span>
                    <span className="text-lg font-bold">₺{model.price.toLocaleString()}</span>

                  </div>

                  <div className="flex flex-wrap gap-2">

                    {model.features.map((feature, i) => ( <span key={i} className={`text-xs px-2 py-1 rounded-full ${selectedModel === index ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-slate-300"}`}>

                      {feature}

                    </span> ))}

                  </div>

                </button> ))}

              </div>

            </div>

            <div>

              <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Adet</h3>

              <div className="flex items-center gap-4">

                <button onClick={() => quantity > 1 && setQuantity(quantity - 1)} disabled={quantity <= 1} className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md dark:shadow-none">
                  <Minus size={18} />
                </button>

                <span className="text-2xl font-bold w-12 text-center text-gray-900 dark:text-white">{quantity}</span>

                <button onClick={() => setQuantity(quantity + 1)} disabled={quantity >= product.stock} className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md dark:shadow-none">
                  <Plus size={18} />
                </button>

                <span className="text-gray-600 dark:text-slate-400 text-sm">(Maksimum {product.stock} adet)</span>

              </div>

            </div>

            <div className="flex gap-3">

              <button onClick={handleAddToCart} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-lg shadow-blue-500/25 relative overflow-hidden group text-white">

                {addedToCart ? ( <>

                  <Check size={20} />
                  Sepete Eklendi!

                </> ) : ( <>

                  <ShoppingCart size={20} />
                  Sepete Ekle

                </> )}

                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>

              </button>

              <button onClick={() => setIsWishlisted(!isWishlisted)} className={`w-16 rounded-2xl flex items-center justify-center transition-all shadow-md dark:shadow-none ${isWishlisted ? "bg-red-500 border-red-500 text-white" : "bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-900 dark:text-white"} border`}>
                <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
              </button>

            </div>

            <button className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 py-4 rounded-2xl font-bold hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-gray-900 dark:text-white shadow-md dark:shadow-none">
              <CreditCard size={20} />
              Hızlı Satın Al
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-lg dark:shadow-none">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/10 rounded-full flex items-center justify-center"><Truck className="text-blue-600 dark:text-blue-500" size={20} /></div>

                <div>

                  <p className="font-semibold text-sm text-gray-900 dark:text-white">Ücretsiz Kargo</p>
                  <p className="text-xs text-gray-600 dark:text-slate-400">250₺ üzeri siparişlerde</p>

                </div>

              </div>

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center"><RotateCcw className="text-green-600 dark:text-green-500" size={20} /></div>

                <div>

                  <p className="font-semibold text-sm text-gray-900 dark:text-white">14 Gün İade</p>
                  <p className="text-xs text-gray-600 dark:text-slate-400">Koşulsuz iade hakkı</p>

                </div>

              </div>

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-500/10 rounded-full flex items-center justify-center"><ShieldCheck className="text-purple-600 dark:text-purple-500" size={20} /></div>

                <div>

                  <p className="font-semibold text-sm text-gray-900 dark:text-white">2 Yıl Garanti</p>
                  <p className="text-xs text-gray-600 dark:text-slate-400">Resmi distribütör garantisi</p>

                </div>

              </div>

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-500/10 rounded-full flex items-center justify-center"><Award className="text-orange-600 dark:text-orange-500" size={20} /></div>

                <div>

                  <p className="font-semibold text-sm text-gray-900 dark:text-white">Güvenli Ödeme</p>
                  <p className="text-xs text-gray-600 dark:text-slate-400">256-bit SSL koruması</p>

                </div>

              </div>

            </div>

            <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-2xl p-4 flex items-center gap-3">

              <Gift className="text-pink-500 dark:text-pink-400" size={24} />

              <div>

                <p className="font-semibold text-gray-900 dark:text-white">Hediye Paketi Seçeneği</p>
                <p className="text-sm text-gray-600 dark:text-slate-400">Özel hediye paketi ile gönderilebilir</p>

              </div>

            </div>

          </div>

        </div>

        <div className="mt-16 md:mt-24">

          <div className="flex gap-4 md:gap-6 border-b border-gray-200 dark:border-slate-800 mb-8 overflow-x-auto">

            {[
              { id: "description", label: "Açıklama", icon: Info },
              { id: "specs", label: "Özellikler", icon: Package },
              { id: "reviews", label: `Yorumlar (${reviews.length})`, icon: Star },
            ].map((tab) => ( <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`pb-4 capitalize whitespace-nowrap flex items-center gap-2 transition-colors ${activeTab === tab.id ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-slate-500 hover:text-gray-900 dark:hover:text-slate-300"}`}>

              <tab.icon size={18} />
              {tab.label}

            </button> ))}

          </div>

          {activeTab === "description" && ( <div className="space-y-6">

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-slate-800 shadow-lg dark:shadow-none">

              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Ürün Açıklaması</h3>

              <p className="text-gray-700 dark:text-slate-400 leading-relaxed mb-6">
                Smart LED Panel Pro, modern yaşam tarzınıza uygun olarak tasarlanmış akıllı
                aydınlatma çözümüdür. WiFi bağlantısı sayesinde telefonunuzdan veya sesli
                asistanınızdan kolayca kontrol edebilirsiniz. 16 milyon renk seçeneği ile
                istediğiniz atmosferi yaratın.
              </p>

              <h4 className="font-bold mb-3 text-gray-900 dark:text-white">Öne Çıkan Özellikler:</h4>

              <div className="grid md:grid-cols-2 gap-3">

                {product.features.map((feature, i) => ( <div key={i} className="flex items-center gap-2 text-gray-700 dark:text-slate-300">

                  <Check size={16} className="text-green-500 dark:text-green-400 flex-shrink-0" />
                  <span>{feature}</span>

                </div> ))}

              </div>

            </div>

          </div> )}

          {activeTab === "specs" && ( <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-slate-800 shadow-lg dark:shadow-none">

            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Teknik Özellikler</h3>

            <div className="grid md:grid-cols-2 gap-4">

              {Object.entries(product.specs).map(([key, value]) => ( <div key={key} className="flex justify-between items-center p-4 bg-gray-100 dark:bg-slate-800 rounded-xl">

                <span className="text-gray-600 dark:text-slate-400">{key}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{value}</span>

              </div> ))}

            </div>

          </div> )}

          {activeTab === "reviews" && ( <div className="space-y-6">

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-slate-800 shadow-lg dark:shadow-none">

              <div className="grid md:grid-cols-2 gap-8">

                <div className="text-center md:text-left">

                  <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">{product.rating}</div>
                  <div className="flex justify-center md:justify-start text-yellow-500 mb-2">{[1, 2, 3, 4, 5].map((i) => ( <Star key={i} size={20} fill="currentColor" /> ))}</div>
                  <p className="text-gray-600 dark:text-slate-400">{product.reviews} değerlendirme</p>

                </div>

                <div className="space-y-2">

                  {[5, 4, 3, 2, 1].map((star) => ( <div key={star} className="flex items-center gap-3">

                    <span className="text-lg text-gray-900 dark:text-white">{star} ⭐</span>

                    <div className="flex-1 bg-gray-200 dark:bg-slate-800 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : 10}%` }}/>
                    </div>

                    <span className="text-sm text-gray-600 dark:text-slate-400 w-12">{star === 5 ? 89 : star === 4 ? 26 : 13}</span>

                  </div> ))}

                </div>

              </div>

            </div>

            <div className="space-y-4">

              {reviews.map((review) => ( <div key={review.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-lg dark:shadow-none">

                <div className="flex items-start justify-between mb-3">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center font-bold text-white">{review.name[0]}</div>

                    <div>

                      <div className="flex items-center gap-2">

                        <span className="font-semibold text-gray-900 dark:text-white">{review.name}</span>

                        {review.verified && ( <span className="bg-green-500/10 text-green-600 dark:text-green-400 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">

                          <Check size={12} />
                          Doğrulanmış Alıcı

                        </span> )}

                      </div>

                      <span className="text-sm text-gray-600 dark:text-slate-400">{review.date}</span>

                    </div>

                  </div>

                  <div className="flex text-yellow-500">{[1, 2, 3, 4, 5].map((i) => ( <Star key={i} size={14} fill={i <= review.rating ? "currentColor" : "none"} /> ))}</div>

                </div>

                <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-3">{review.comment}</p>

                {review.images && ( <div className="flex gap-2">

                  {review.images.map((img, i) => ( <img key={i} src={img} alt="review" className="w-20 h-20 rounded-lg object-cover cursor-pointer hover:scale-105 transition-transform shadow-md"/>))}

                </div> )}

              </div> ))}

            </div>

            <button className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 py-4 rounded-2xl font-bold hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-900 dark:text-white shadow-md dark:shadow-none">
              Tüm Yorumları Göster
            </button>

          </div> )}

        </div>

        <div className="mt-16 md:mt-24">

          <div className="flex items-center justify-between mb-8">

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Benzer Ürünler</h2>

            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2">
              Tümünü Gör <ArrowRight size={18} />
            </button>

          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">

            {[1, 2, 3].map((i) => ( <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 transition-all group cursor-pointer shadow-lg dark:shadow-none">

              <div className="relative mb-4 overflow-hidden rounded-2xl">

                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-800 dark:to-slate-900 group-hover:scale-105 transition-transform"></div>
                <div className="absolute top-3 right-3 bg-red-500 px-2 py-1 rounded-full text-xs font-bold text-white shadow-lg">%15</div>

              </div>

              <div className="flex text-yellow-500 mb-2">{[1, 2, 3, 4, 5].map((star) => ( <Star key={star} size={14} fill="currentColor" /> ))}</div>

              <h3 className="font-bold mb-2 line-clamp-2 text-gray-900 dark:text-white">Smart LED Device {i}</h3>

              <div className="flex items-center gap-2 mb-4">

                <p className="text-blue-600 dark:text-blue-400 font-bold text-lg">₺{999 + i * 100}</p>
                <p className="text-gray-500 dark:text-slate-500 line-through text-sm">₺{1299 + i * 100}</p>

              </div>

              <button className="w-full bg-gray-200 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors group text-gray-900 dark:text-white hover:text-white">
                <ShoppingCart size={16} />
                Sepete Ekle
              </button>

            </div> ))}

          </div>

        </div>

      </div>

      {showImageModal && ( <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" onClick={() => setShowImageModal(false)}>

        <button className="absolute top-4 right-4 w-12 h-12 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors shadow-lg" onClick={() => setShowImageModal(false)}>
          <X size={24} className="text-gray-900 dark:text-white" />
        </button>

        <img src={product.images[selectedImage]} alt="product" className="max-w-full max-h-[90vh] object-contain rounded-2xl" onClick={(e) => e.stopPropagation()}/>

        <button onClick={(e) => { e.stopPropagation(); handleImageNavigation("prev"); }} className="absolute left-4 w-12 h-12 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors shadow-lg">
          <ChevronLeft size={24} className="text-gray-900 dark:text-white" />
        </button>

        <button onClick={(e) => { e.stopPropagation(); handleImageNavigation("next"); }} className="absolute right-4 w-12 h-12 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors shadow-lg">
          <ChevronRight size={24} className="text-gray-900 dark:text-white" />
        </button>

      </div> )}

      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800 p-4 md:hidden z-40 shadow-xl">

        <div className="flex gap-3">

          <button onClick={handleAddToCart} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-white shadow-lg">
            <ShoppingCart size={18} />
            Sepete Ekle
          </button>

          <button onClick={() => setIsWishlisted(!isWishlisted)} className={`w-12 rounded-xl flex items-center justify-center shadow-md ${isWishlisted ? "bg-red-500 text-white" : "bg-gray-200 dark:bg-slate-900 text-gray-900 dark:text-white"}`}>
            <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
          </button>

        </div>

      </div>

    </div>
  );
};

export default ProductDetail;