import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getProducts } from "../../redux/productSlice";

import { ShoppingCart, Star, Heart, Filter, ArrowRight, Zap, Package, Truck, Shield, Search, SlidersHorizontal, X, ChevronDown, Grid3x3, List, TrendingUp, Clock, Award, Sparkles, Eye, BarChart3, ArrowUpDown, Percent, Gift, Timer } from "lucide-react";

const Products = () => {

  const dispatch = useDispatch();

  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  useEffect(() => {

    dispatch(getProducts());
  }, [dispatch]);

  const productas = useSelector((state) => state.products.products);
  console.log("Redux Productas:", productas);

  const categories = [

    { name: "Tümü", icon: Grid3x3, count: 12 },
    { name: "Akıllı Aydınlatma", icon: Zap, count: 5 },
    { name: "Kameralar", icon: Eye, count: 3 },
    { name: "Sensörler", icon: BarChart3, count: 2 },
    { name: "Akıllı Kilitler", icon: Shield, count: 2 },
  ];

  const products = [
    {
      id: 1,
      name: "Smart LED Panel Pro",
      category: "Akıllı Aydınlatma",
      price: 1299,
      oldPrice: 1599,
      rating: 5,
      reviews: 245,
      image: "https://m.media-amazon.com/images/I/61MjKKAtlYL.jpg",
      badge: "Çok Satan",
      badgeColor: "from-orange-500 to-red-500",
      stock: 15,
      sold: 1240,
      features: ["WiFi", "RGB", "Sesli Asistan"],
      discount: 19,
      isNew: false,
    },
    {
      id: 2,
      name: "360° Güvenlik Kamerası",
      category: "Kameralar",
      price: 2499,
      oldPrice: 2999,
      rating: 5,
      reviews: 189,
      image: "https://cdn.akakce.com/x/tp-link/tp-link-tapo-c500-wi-fi.jpg",
      badge: "Yeni",
      badgeColor: "from-green-500 to-emerald-500",
      stock: 8,
      sold: 567,
      features: ["4K", "Gece Görüş", "Hareket Algılama"],
      discount: 17,
      isNew: true,
    },
    {
      id: 3,
      name: "Akıllı Hareket Sensörü",
      category: "Sensörler",
      price: 799,
      oldPrice: 999,
      rating: 4,
      reviews: 123,
      image: "https://m.media-amazon.com/images/I/61IL6g4BqbL._AC_UF1000,1000_QL80_.jpg",
      badge: "%20 İndirim",
      badgeColor: "from-purple-500 to-pink-500",
      stock: 32,
      sold: 892,
      features: ["Kablosuz", "Pil Ömrü 2 Yıl"],
      discount: 20,
      isNew: false,
    },
    {
      id: 4,
      name: "WiFi Akıllı Kilit",
      category: "Akıllı Kilitler",
      price: 3199,
      oldPrice: 3799,
      rating: 5,
      reviews: 312,
      image: "https://novato.com.tr/wp-content/uploads/2025/10/wifi-akilli-kilit1.png",
      badge: "Premium",
      badgeColor: "from-blue-500 to-purple-500",
      stock: 5,
      sold: 423,
      features: ["Biyometrik", "Uzaktan Kontrol"],
      discount: 16,
      isNew: false,
    },
    {
      id: 5,
      name: "Akıllı Ampul Set (4'lü)",
      category: "Akıllı Aydınlatma",
      price: 599,
      oldPrice: 799,
      rating: 4,
      reviews: 567,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCdrNAH2boFsmfZ3hYkYqXTuok2gpm0-XTpQ&s",
      badge: "Fırsat",
      badgeColor: "from-yellow-500 to-orange-500",
      stock: 50,
      sold: 2341,
      features: ["E27", "Dimmer", "16M Renk"],
      discount: 25,
      isNew: false,
    },
    {
      id: 6,
      name: "Akıllı Kapı Zili",
      category: "Kameralar",
      price: 1899,
      oldPrice: 2299,
      rating: 5,
      reviews: 198,
      image: "https://cdn03.ciceksepeti.com/cicek/kcm63962135-1/XL/akilli-kapi-zili-kcm63962135-1-babf4c8c72194195ad7baac8ab8b82a8.jpg",
      badge: "Popüler",
      badgeColor: "from-pink-500 to-rose-500",
      stock: 12,
      sold: 756,
      features: ["HD Video", "İki Yönlü Ses"],
      discount: 17,
      isNew: false,
    },
    {
      id: 7,
      name: "Sıcaklık & Nem Sensörü",
      category: "Sensörler",
      price: 449,
      oldPrice: 599,
      rating: 4,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3",
      badge: "Ekonomik",
      badgeColor: "from-teal-500 to-cyan-500",
      stock: 45,
      sold: 1123,
      features: ["Bluetooth", "Ekran"],
      discount: 25,
      isNew: false,
    },
    {
      id: 8,
      name: "Akıllı Şerit LED (5m)",
      category: "Akıllı Aydınlatma",
      price: 899,
      oldPrice: 1199,
      rating: 5,
      reviews: 423,
      image: "https://m.media-amazon.com/images/I/715DkFkT1sS._AC_UF1000,1000_QL80_.jpg",
      badge: "Çok Satan",
      badgeColor: "from-orange-500 to-red-500",
      stock: 28,
      sold: 1876,
      features: ["Müzik Sync", "Su Geçirmez"],
      discount: 25,
      isNew: false,
    },
  ];

  const sortOptions = [

    { value: "featured", label: "Öne Çıkanlar", icon: Sparkles },
    { value: "price-low", label: "Fiyat: Düşükten Yükseğe", icon: ArrowUpDown },
    { value: "price-high", label: "Fiyat: Yüksekten Düşüğe", icon: ArrowUpDown },
    { value: "rating", label: "En Yüksek Puan", icon: Star },
    { value: "newest", label: "En Yeni", icon: Clock },
    { value: "popular", label: "Popülerlik", icon: TrendingUp },
  ];

  const benefits = [

    {
      icon: <Truck className="text-blue-500" size={24} />,
      title: "Ücretsiz Kargo",
      description: "250₺ ve üzeri",
      color: "from-blue-500/10 to-cyan-500/10",
    },
    {
      icon: <Shield className="text-green-500" size={24} />,
      title: "2 Yıl Garanti",
      description: "Tüm ürünlerde",
      color: "from-green-500/10 to-emerald-500/10",
    },
    {
      icon: <Package className="text-purple-500" size={24} />,
      title: "Hızlı Teslimat",
      description: "1-3 iş günü",
      color: "from-purple-500/10 to-pink-500/10",
    },
    {
      icon: <Gift className="text-orange-500" size={24} />,
      title: "Hediye Paketi",
      description: "Ücretsiz",
      color: "from-orange-500/10 to-red-500/10",
    },
  ];

  const toggleWishlist = (productId) => {

    setWishlist((prev) => prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]);
  };

  const getFilteredProducts = () => {

    let filtered = products;

    if (activeCategory !== "Tümü") {

      filtered = filtered.filter((p) => p.category === activeCategory);
    }

    if (searchQuery) {

      filtered = filtered.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (selectedRating > 0) {

      filtered = filtered.filter((p) => p.rating >= selectedRating);
    }

    switch (sortBy) {

      case "price-low":

        filtered.sort((a, b) => a.price - b.price);
      break;

      case "price-high":

        filtered.sort((a, b) => b.price - a.price);
      break;

      case "rating":

        filtered.sort((a, b) => b.rating - a.rating);
      break;

      case "newest":

        filtered.sort((a, b) => b.isNew - a.isNew);
      break;

      case "popular":

        filtered.sort((a, b) => b.sold - a.sold);
      break;

      default:
      break;
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  const stats = [

    { label: "Toplam Ürün", value: products.length, icon: Package },
    { label: "Yeni Ürün", value: products.filter(p => p.isNew).length, icon: Sparkles },
    { label: "İndirimli", value: products.filter(p => p.discount > 0).length, icon: Percent },
    { label: "Ortalama Puan", value: "4.8", icon: Star },
  ];

  return (

    <div className="bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white min-h-screen transition-colors duration-300">

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6 overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 dark:from-blue-600/5 to-transparent" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto text-center relative z-10">

          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm text-blue-600 dark:text-blue-400 px-5 py-2 rounded-full border border-blue-500/30 mb-6 hover:scale-105 transition-transform">
            <Zap size={16} className="animate-pulse" />
            <span className="font-semibold">Premium Smart Home Store</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 text-gray-900 dark:text-white">
            Akıllı Ev
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient">
              {" "}Ürünleri
            </span>
          </h1>

          <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto text-lg mb-8">
            Evinizi geleceğe taşıyacak en yeni akıllı cihazlar burada. Kalite, güvenlik ve konfor bir arada.
          </p>

          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Ürün ara..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors shadow-lg dark:shadow-none"
            />

            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
              >
                <X size={20} />
              </button>
            )}
          </div>

        </div>

      </section>

      {/* Stats Section */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 text-center hover:border-blue-500/50 transition-all group shadow-lg dark:shadow-none"
            >
              <stat.icon className="mx-auto mb-3 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" size={28} />
              <div className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-sm text-gray-600 dark:text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((item, i) => (
            <div 
              key={i} 
              className={`bg-gradient-to-br ${item.color} backdrop-blur-sm border border-gray-200 dark:border-slate-800 rounded-2xl p-6 hover:scale-105 transition-all shadow-lg dark:shadow-none`}
            >
              <div className="mb-3">{item.icon}</div>
              <h3 className="font-bold mb-1 text-gray-900 dark:text-white">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-slate-400">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Filters Section */}
      <section className="px-6 py-5 sticky top-0 bg-gray-50/95 dark:bg-slate-950/95 backdrop-blur-md z-30 border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">

          {/* Categories */}
          <div className="flex items-center gap-3 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400 mr-2 flex-shrink-0">
              <Filter size={18} />
              <span className="text-sm font-medium">Kategori:</span>
            </div>

            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button 
                  key={cat.name} 
                  onClick={() => setActiveCategory(cat.name)} 
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                    activeCategory === cat.name 
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25" 
                      : "bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-800"
                  }`}
                >
                  <Icon size={16} />
                  <span className="font-medium">{cat.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeCategory === cat.name 
                      ? "bg-white/20" 
                      : "bg-gray-200 dark:bg-slate-800"
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-4">

            <div className="flex items-center gap-3">

              <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors shadow-md dark:shadow-none">
                <SlidersHorizontal size={18} />
                <span className="hidden sm:inline">Filtreler</span>
              </button>

              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 px-4 py-2 rounded-xl focus:outline-none focus:border-blue-500 cursor-pointer text-gray-900 dark:text-white shadow-md dark:shadow-none">
                {sortOptions.map((option) => ( <option key={option.value} value={option.value}>{option.label}</option> ))}
              </select>

            </div>

            <div className="flex items-center gap-2">

              <span className="text-sm text-gray-600 dark:text-slate-400 hidden sm:inline">{filteredProducts.length} ürün</span>

              <div className="flex gap-2">

                <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-400"}`}>
                  <Grid3x3 size={18} />
                </button>

                <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-white dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-400"}`}>
                  <List size={18} />
                </button>

              </div>

            </div>

          </div>

          {showFilters && ( <div className="mt-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-lg dark:shadow-none">

            <div className="grid md:grid-cols-2 gap-6">

              <div>

                <label className="block text-sm font-medium mb-3 text-gray-900 dark:text-white">Fiyat Aralığı: ₺{priceRange[0]} - ₺{priceRange[1]}</label>
                <input type="range" min="0" max="5000" step="100" value={priceRange[1]} onChange={(e) => setPriceRange([0, parseInt(e.target.value)])} className="w-full accent-blue-500"/>

              </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-900 dark:text-white">
                    Minimum Puan
                  </label>
                  <div className="flex gap-2">
                    {[0, 3, 4, 5].map((rating) => (
                      <button 
                        key={rating} 
                        onClick={() => setSelectedRating(rating)} 
                        className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                          selectedRating === rating 
                            ? "bg-blue-600 text-white" 
                            : "bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300"
                        }`}
                      >
                        {rating > 0 && <Star size={14} fill="currentColor" />}
                        {rating === 0 ? "Tümü" : `${rating}+`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Products Section */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto mt-5">

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <Package size={64} className="mx-auto mb-4 text-gray-300 dark:text-slate-700" />
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Ürün Bulunamadı</h3>
              <p className="text-gray-600 dark:text-slate-400 mb-6">Arama kriterlerinizi değiştirmeyi deneyin</p>

              <button 
                onClick={() => {
                  setActiveCategory("Tümü");
                  setSearchQuery("");
                  setPriceRange([0, 5000]);
                  setSelectedRating(0);
                }} 
                className="bg-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-white shadow-lg"
              >
                Filtreleri Sıfırla
              </button>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1 max-w-4xl mx-auto"
            }`}>
              {filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  onMouseEnter={() => setHoveredProduct(product.id)} 
                  onMouseLeave={() => setHoveredProduct(null)} 
                  className={`group bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-blue-500/50 rounded-3xl overflow-hidden transition-all hover:shadow-2xl hover:shadow-blue-500/10 ${
                    viewMode === "grid" ? "hover:scale-105" : "flex gap-6"
                  }`}
                >
                  <div className={`relative ${viewMode === "list" ? "w-64 flex-shrink-0" : ""}`}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className={`object-cover ${viewMode === "grid" ? "h-64 w-full" : "h-full w-full"}`}
                    />

                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <div className={`bg-gradient-to-r ${product.badgeColor} px-3 py-1 rounded-full text-xs font-bold shadow-lg text-white`}>
                        {product.badge}
                      </div>

                      {product.discount > 0 && (
                        <div className="bg-red-500 px-3 py-1 rounded-full text-xs font-bold shadow-lg text-white">
                          %{product.discount}
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => toggleWishlist(product.id)} 
                      className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all ${
                        wishlist.includes(product.id) 
                          ? "bg-red-500 scale-110 text-white" 
                          : "bg-black/50 hover:bg-red-500 text-white"
                      }`}
                    >
                      <Heart size={18} fill={wishlist.includes(product.id) ? "currentColor" : "none"} />
                    </button>

                    {product.stock < 10 && (
                      <div className="absolute bottom-4 left-4 bg-orange-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 text-white">
                        <Timer size={12} />
                        Son {product.stock} adet
                      </div>
                    )}

                    {hoveredProduct === product.id && viewMode === "grid" && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-xl">
                          <Eye size={18} />
                          Hızlı Bakış
                        </button>
                      </div>
                    )}
                  </div>

                  <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-500 dark:text-slate-500">{product.category}</p>

                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400">
                        <TrendingUp size={12} />
                        {product.sold} satıldı
                      </div>
                    </div>

                    <h3 className="font-bold text-lg mb-3 line-clamp-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.features.map((feature, i) => (
                        <span 
                          key={i} 
                          className="text-xs bg-gray-200 dark:bg-slate-800 px-2 py-1 rounded-full text-gray-700 dark:text-slate-400"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={15} 
                            className={i < product.rating ? "text-yellow-500" : "text-gray-300 dark:text-slate-700"} 
                            fill={i < product.rating ? "currentColor" : "none"} 
                          />
                        ))}
                      </div>

                      <span className="text-sm text-gray-600 dark:text-slate-400">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        ₺{product.price.toLocaleString()}
                      </span>
                      <span className="line-through text-gray-500 dark:text-slate-500">
                        ₺{product.oldPrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-600 dark:text-slate-400 mb-1">
                        <span>Stok Durumu</span>
                        <span>{product.stock} adet</span>
                      </div>

                      <div className="h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            product.stock > 20 
                              ? "bg-green-500" 
                              : product.stock > 10 
                                ? "bg-yellow-500" 
                                : "bg-red-500"
                          }`}
                          style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }} 
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-lg shadow-blue-500/25 text-white">
                        <ShoppingCart size={18} />
                        <span className="hidden sm:inline">Sepete Ekle</span>
                      </button>

                      <button className="bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 px-4 rounded-xl transition-colors text-gray-700 dark:text-white">
                        <Eye size={18} />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

          {filteredProducts.length > 0 && (
            <div className="text-center mt-12">
              <button className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-blue-500 px-8 py-4 rounded-2xl font-bold inline-flex items-center gap-3 hover:scale-105 transition-all text-gray-900 dark:text-white shadow-lg dark:shadow-none">
                Daha Fazla Göster
                <ChevronDown size={18} />
              </button>
            </div>
          )}

        </div>
      </section>

      {/* Promotional Banners */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">

          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />

            <div className="relative z-10">
              <Award className="text-blue-600 dark:text-blue-400 mb-4" size={40} />
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Premium Üyelik</h3>
              <p className="text-gray-700 dark:text-slate-400 mb-6">
                Tüm ürünlerde %15 ekstra indirim ve özel avantajlar
              </p>
              <button className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg">
                Üye Ol
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl" />

            <div className="relative z-10">
              <Gift className="text-orange-600 dark:text-orange-400 mb-4" size={40} />
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Hediye Çeki Kazan</h3>
              <p className="text-gray-700 dark:text-slate-400 mb-6">
                Her alışverişinizde %5 hediye çeki kazanın
              </p>
              <button className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg">
                Detaylar
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />

          <div className="relative z-10">
            <Sparkles className="mx-auto mb-6 text-blue-600 dark:text-blue-400" size={48} />
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Premium Paketlerde %30 İndirim
            </h2>
            <p className="text-gray-700 dark:text-slate-400 mb-8 max-w-2xl mx-auto text-lg">
              Akıllı evinizi şimdi kurun, avantajlı fiyatlardan yararlanın. Taksit seçenekleri ve ücretsiz kurulum dahil!
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white px-8 py-4 rounded-2xl font-bold inline-flex items-center gap-3 hover:scale-105 transition-all shadow-xl">
                Alışverişe Başla
                <ArrowRight size={18} />
              </button>

              <button className="bg-gray-200 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 px-8 py-4 rounded-2xl font-bold hover:bg-gray-300 dark:hover:bg-slate-800 transition-colors text-gray-900 dark:text-white">
                Kampanyaları Gör
              </button>
            </div>
          </div>

        </div>
      </section>

      {wishlist.length > 0 && (
        <button className="fixed bottom-8 right-8 bg-gradient-to-r from-red-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/50 hover:scale-110 transition-transform z-40 text-white">
          <Heart fill="currentColor" size={24} />
          <span className="absolute -top-2 -right-2 bg-white text-red-500 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
            {wishlist.length}
          </span>
        </button>
      )}

    </div>
  );
};

export default Products;