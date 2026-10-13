import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from 'react-helmet-async';

import { getProductBySlug, createReview, clearProduct } from "../../redux/productSlice";
import { addToCart } from "../../redux/cartSlice";

import ProductModel3D from '../../components/ProductModel3D';

import { Star, Heart, ShoppingCart, Minus, Plus, ShieldCheck, Truck, RotateCcw, Check, ArrowRight, Share2, ZoomIn, Award, Clock, Users, TrendingUp, Package, CreditCard, Info, X, ChevronLeft, ChevronRight, Box } from "lucide-react";
import { FaWhatsapp, FaLink, FaReddit, FaXTwitter } from 'react-icons/fa6';

const SITE_NAME = 'TypusHome';
const SITE_URL = 'https://typushome.com.tr';

const formatPrice = (value) => `₺${Number(value || 0).toLocaleString('tr-TR')}`;

const formatWarranty = (months) => {
  const m = Number(months);
  if (!m) return null;
  return m % 12 === 0 ? `${m / 12} Yıl Garanti` : `${m} Ay Garanti`;
};

const ProductDetail = () => {

  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { product, loading, error } = useSelector((state) => state.products);
  const { isAuth } = useSelector((state) => state.user);

  const [selectedImage, setSelectedImage] = useState(0);
  const [viewMode, setViewMode] = useState('image'); // 'image' | '3d'
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedModel, setSelectedModel] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [showReview, setShowReview] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0] || null);
      setSelectedModel(0);
      setSelectedImage(0);
      setQuantity(1);
      setViewMode('image');
    }
  }, [product?._id]);

  useEffect(() => {
    if (slug) {
      dispatch(getProductBySlug(slug));
    }

    return () => dispatch(clearProduct());
  }, [slug, dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-slate-950 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-slate-400">Ürün yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 dark:bg-slate-950 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Hata: {typeof error === 'string' ? error : 'Bir sorun oluştu.'}</p>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-blue-600 text-white rounded-xl">Ana Sayfaya Dön</button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-gray-50 dark:bg-slate-950 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-slate-400 mb-4">Ürün bulunamadı</p>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-blue-600 text-white rounded-xl">Ana Sayfaya Dön</button>
        </div>
      </div>
    );
  }

  // ---------- Türetilmiş değerler ----------
  const images = product.images || [];
  const models = product.models || [];
  const activeModel = models[selectedModel];
  const currentPrice = activeModel?.price ?? product.price;
  const has3D = !!product.model3d?.url;
  const inStock = Number(product.stock) > 0;

  const discountPercentage = product.oldPrice && product.oldPrice > currentPrice
    ? Math.round(((product.oldPrice - currentPrice) / product.oldPrice) * 100)
    : 0;

  const reviews = product.reviews || [];
  const displayedReviews = showReview ? reviews : reviews.slice(0, 3);
  const ratingValue = Number(product.ratingsAverage) || 0;

  const warrantyLabel = formatWarranty(product.warranty);
  const returnDays = product.returnDays ?? 14;

  const productUrl = `${SITE_URL}/productdetail/${product.slug}`;
  const currentUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent(`${product.name} ürününü incele! `);

  const seoTitle = product.seoTitle || product.name;
  const seoDescription = product.seoDescription || product.shortDescription || product.description?.slice(0, 155) || `${SITE_NAME} akıllı ev ürünleri`;
  const seoKeywords = product.seoKeywords || [product.name, product.brand, product.category, 'akıllı ev', SITE_NAME, 'IoT', ...(product.tags || [])].filter(Boolean).join(', ');

  // ---------- İşlemler ----------
  const handleSubmitReview = async () => {
    if (!reviewComment.trim() || isSubmittingReview) return;

    setIsSubmittingReview(true);
    setReviewError("");

    try {
      await dispatch(createReview({ productId: product._id, rating: reviewRating, comment: reviewComment })).unwrap();

      setReviewSuccess(true);
      setReviewComment("");
      setReviewRating(5);
      dispatch(getProductBySlug(slug));
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch (err) {
      setReviewError(typeof err === 'string' ? err : err?.message || 'Yorum gönderilemedi, tekrar deneyin.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleAddToCart = () => {
    if (!inStock) return;

    setAddedToCart(true);

    dispatch(addToCart({
      id: product._id,
      _id: product._id,
      name: product.name,
      price: currentPrice,
      image: images[0]?.file,
      category: product.category,
      slug: product.slug,
      stock: product.stock,
      quantity,
      selectedModel: activeModel?.name,
      selectedColor: selectedColor?.name,
    }));

    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleImageNavigation = (direction) => {
    if (!images.length) return;

    if (direction === "next") {
      setSelectedImage((prev) => (prev + 1) % images.length);
    } else {
      setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Link kopyalanamadı:", err);
    }
  };

  const renderStars = (value, size = 20) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={size} fill={i < Math.floor(value) ? "currentColor" : "none"} />
    ));

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: images.map((img) => img?.file).filter(Boolean),
    sku: product.sku,
    brand: { '@type': 'Brand', name: product.brand || SITE_NAME },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'TRY',
      price: currentPrice,
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    ...(reviews.length > 0 && ratingValue > 0 ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: ratingValue,
        reviewCount: reviews.length,
      },
    } : {}),
  };

  return (

    <div className="bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white min-h-screen py-8 px-4 md:px-6 pb-28 md:pb-8 transition-colors duration-300">

      <Helmet>
        <title>{`${seoTitle} | ${SITE_NAME}`}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={seoKeywords} />
        <link rel="canonical" href={productUrl} />

        <meta property="og:type" content="product" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={images[0]?.file} />
        <meta property="og:url" content={productUrl} />
        <meta property="product:price:amount" content={String(currentPrice)} />
        <meta property="product:price:currency" content="TRY" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={images[0]?.file} />

        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <div className="max-w-7xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-slate-400 mb-8">
          <span onClick={() => navigate('/products')} className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">Ürünler</span>
          {product.category && (<>
            <ChevronRight size={14} />
            <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">{product.category}</span>
          </>)}
          {product.subcategory && (<>
            <ChevronRight size={14} />
            <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">{product.subcategory}</span>
          </>)}
          <ChevronRight size={14} />
          <span className="text-gray-900 dark:text-white">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">

          {/* ---------- Galeri ---------- */}
          <div className="space-y-4">

            <div className="relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-slate-800 group shadow-lg dark:shadow-none">

              {product.badge && (
                <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 text-white shadow-lg">
                  <TrendingUp size={16} />
                  {product.badge}
                </div>
              )}

              {discountPercentage > 0 && (
                <div className="absolute top-4 right-4 z-10 bg-red-500 px-3 py-1 rounded-full text-sm font-bold text-white shadow-lg">
                  %{discountPercentage} İndirim
                </div>
              )}

              {viewMode === '3d' && has3D ? (
                <ProductModel3D
                  src={product.model3d.url}
                  poster={images[0]?.file}
                  alt={product.name}
                  colorHex={selectedColor?.hex}
                />
              ) : (
                <>
                  <img
                    src={images[selectedImage]?.file}
                    alt={product.name}
                    className="w-full h-[400px] md:h-[550px] object-cover cursor-zoom-in"
                    onClick={() => setShowImageModal(true)}
                  />

                  {images.length > 1 && (<>
                    <button onClick={() => handleImageNavigation("prev")} aria-label="Önceki görsel" className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity backdrop-blur-sm text-white">
                      <ChevronLeft size={20} />
                    </button>

                    <button onClick={() => handleImageNavigation("next")} aria-label="Sonraki görsel" className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity backdrop-blur-sm text-white">
                      <ChevronRight size={20} />
                    </button>
                  </>)}

                  <button onClick={() => setShowImageModal(true)} aria-label="Büyüt" className="absolute bottom-4 right-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity backdrop-blur-sm text-white">
                    <ZoomIn size={18} />
                  </button>
                </>
              )}

            </div>

            <div className="grid grid-cols-4 gap-3">

              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => { setSelectedImage(i); setViewMode('image'); }}
                  className={`rounded-2xl overflow-hidden border-2 transition-all ${
                    viewMode === 'image' && selectedImage === i
                      ? "border-blue-500 scale-105 shadow-lg"
                      : "border-gray-300 dark:border-slate-800 hover:border-gray-400 dark:hover:border-slate-600"
                  }`}
                >
                  <img src={img?.file} alt="" loading="lazy" className="h-20 md:h-24 w-full object-cover" />
                </button>
              ))}

              {has3D && (
                <button
                  onClick={() => setViewMode('3d')}
                  className={`rounded-2xl border-2 h-20 md:h-24 flex flex-col items-center justify-center gap-1 text-sm font-bold transition-all ${
                    viewMode === '3d'
                      ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 scale-105 shadow-lg'
                      : 'border-gray-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-gray-400 dark:hover:border-slate-600'
                  }`}
                >
                  <Box size={22} />
                  3D
                </button>
              )}

            </div>

          </div>

          {/* ---------- Ürün bilgileri ---------- */}
          <div className="space-y-6">

            <div className="flex items-center justify-between">

              <div className={`inline-flex px-4 py-2 rounded-full text-sm ${inStock ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>
                <Package size={16} className="mr-2" />
                {inStock ? `${product.stock} adet stokta` : 'Stokta yok'}
              </div>

              <div className="relative">

                <button onClick={() => setShowShareMenu(!showShareMenu)} aria-label="Paylaş" className="w-10 h-10 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors shadow-md dark:shadow-none">
                  <Share2 size={18} />
                </button>

                {showShareMenu && (
                  <div className="absolute right-0 mt-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-3 space-y-2 z-20 min-w-[175px] shadow-xl">

                    <button onClick={() => window.open(`https://api.whatsapp.com/send?text=${shareText}${currentUrl}`, "_blank")} className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-sm flex items-center gap-2 text-gray-900 dark:text-white transition-colors">
                      <FaWhatsapp size={16} className="text-green-500" /> WhatsApp
                    </button>

                    <button onClick={() => window.open(`https://twitter.com/intent/tweet?url=${currentUrl}&text=${shareText}`, "_blank")} className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-sm flex items-center gap-2 text-gray-900 dark:text-white transition-colors">
                      <FaXTwitter size={16} className="text-slate-700 dark:text-slate-300" /> X (Twitter)
                    </button>

                    <button onClick={() => window.open(`https://www.reddit.com/submit?url=${currentUrl}&title=${shareText}`, "_blank")} className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-sm flex items-center gap-2 text-gray-900 dark:text-white transition-colors">
                      <FaReddit size={16} className="text-orange-600" /> Reddit
                    </button>

                    <button onClick={copyToClipboard} className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-sm flex items-center gap-2 text-gray-900 dark:text-white transition-colors">
                      <FaLink size={16} className="text-gray-500" /> {copied ? "Link Kopyalandı" : "Link Kopyala"}
                    </button>

                  </div>
                )}

              </div>

            </div>

            <h1 className="text-3xl md:text-4xl font-bold leading-tight text-gray-900 dark:text-white">{product.name}</h1>

            <div className="flex flex-wrap items-center gap-4">

              <div className="flex items-center gap-2">
                <div className="flex text-yellow-500">{ratingValue ? renderStars(ratingValue) : null}</div>
                <span className="text-gray-600 dark:text-slate-400 text-sm">
                  {ratingValue ? ratingValue.toFixed(1) : '-'} ({reviews.length} değerlendirme)
                </span>
              </div>

              {product.salesCount > 0 && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400 text-sm">
                  <Users size={16} />
                  {product.salesCount} adet satıldı
                </div>
              )}

            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-lg dark:shadow-none">

              <div className="flex flex-wrap items-baseline gap-4 mb-2">
                <span className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400">{formatPrice(currentPrice)}</span>
                {discountPercentage > 0 && <span className="line-through text-gray-500 dark:text-slate-500 text-xl">{formatPrice(product.oldPrice)}</span>}
                {discountPercentage > 0 && <span className="bg-red-500/20 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-sm font-bold">%{discountPercentage} İNDİRİM</span>}
              </div>

              {product.isOnSale && (
                <p className="text-gray-600 dark:text-slate-400 text-sm flex items-center gap-2"><Clock size={14} /> Kampanya bitimine 2 gün 14 saat kaldı</p>
              )}

            </div>

            <p className="text-gray-700 dark:text-slate-400 leading-relaxed">{product.shortDescription || product.description}</p>

            {product.colors?.length > 0 && (
              <div>

                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 dark:text-white">Renk: {selectedColor?.name}</h3>
                  <span className="text-sm text-gray-600 dark:text-slate-400">{product.colors.length} renk mevcut</span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      style={{ backgroundColor: color.hex }}
                      aria-label={color.name}
                      title={color.name}
                      className={`relative w-12 h-12 rounded-full border-4 transition-all ${
                        selectedColor?.name === color.name
                          ? "border-blue-500 scale-110 shadow-lg"
                          : "border-gray-300 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-600"
                      }`}
                    >
                      {selectedColor?.name === color.name && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check size={20} className="text-white drop-shadow-lg" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

              </div>
            )}

            {models.length > 0 && (
              <div>

                <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Model Seçimi</h3>

                <div className="grid gap-3">
                  {models.map((model, index) => (
                    <button
                      key={`${model.name}-${index}`}
                      onClick={() => setSelectedModel(index)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        selectedModel === index
                          ? "bg-blue-600 border-blue-600 scale-[1.02] text-white shadow-lg"
                          : "border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-gray-400 dark:hover:border-slate-600 text-gray-900 dark:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold">{model.name}</span>
                        <span className="text-lg font-bold">{formatPrice(model.price ?? product.price)}</span>
                      </div>

                      {model.features?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {model.features.map((feature, i) => (
                            <span key={i} className={`text-xs px-2 py-1 rounded-full ${selectedModel === index ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-slate-300"}`}>
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                    </button>
                  ))}
                </div>

              </div>
            )}

            <div>

              <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Adet</h3>

              <div className="flex items-center gap-4">

                <button onClick={() => quantity > 1 && setQuantity(quantity - 1)} disabled={quantity <= 1} aria-label="Azalt" className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md dark:shadow-none">
                  <Minus size={18} />
                </button>

                <span className="text-2xl font-bold w-12 text-center text-gray-900 dark:text-white">{quantity}</span>

                <button onClick={() => setQuantity(quantity + 1)} disabled={quantity >= product.stock} aria-label="Artır" className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md dark:shadow-none">
                  <Plus size={18} />
                </button>

                <span className="text-gray-600 dark:text-slate-400 text-sm">(Maksimum {product.stock} adet)</span>

              </div>

            </div>

            <div className="flex gap-3">

              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-lg shadow-blue-500/25 relative overflow-hidden group text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {!inStock ? (
                  'Stokta Yok'
                ) : addedToCart ? (<>
                  <Check size={20} />
                  Sepete Eklendi!
                </>) : (<>
                  <ShoppingCart size={20} />
                  Sepete Ekle
                </>)}

                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
              </button>

              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                aria-label="Favorilere ekle"
                className={`w-16 rounded-2xl flex items-center justify-center transition-all shadow-md dark:shadow-none border ${
                  isWishlisted
                    ? "bg-red-500 border-red-500 text-white"
                    : "bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-900 dark:text-white"
                }`}
              >
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
                  <p className="text-xs text-gray-600 dark:text-slate-400">{product.freeShipping ? 'Bu üründe ücretsiz kargo' : '2500₺ üzeri siparişlerde'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center"><RotateCcw className="text-green-600 dark:text-green-500" size={20} /></div>
                <div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{returnDays} Gün İade</p>
                  <p className="text-xs text-gray-600 dark:text-slate-400">Koşulsuz iade hakkı</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-500/10 rounded-full flex items-center justify-center"><ShieldCheck className="text-purple-600 dark:text-purple-500" size={20} /></div>
                <div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{warrantyLabel || 'Garanti'}</p>
                  <p className="text-xs text-gray-600 dark:text-slate-400">Resmi distribütör garantisi</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-100 dark:bg-orange-500/10 rounded-full flex items-center justify-center"><Award className="text-pink-600 dark:text-pink-500" size={20} /></div>
                <div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">Güvenli Ödeme</p>
                  <p className="text-xs text-gray-600 dark:text-slate-400">256-bit SSL koruması</p>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* ---------- Sekmeler ---------- */}
        <div className="mt-16 md:mt-24">

          <div className="flex gap-4 md:gap-6 border-b border-gray-200 dark:border-slate-800 mb-8 overflow-x-auto">
            {[
              { id: "description", label: "Açıklama", icon: Info },
              { id: "specs", label: "Özellikler", icon: Package },
              { id: "reviews", label: `Yorumlar (${reviews.length})`, icon: Star },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 whitespace-nowrap flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-slate-500 hover:text-gray-900 dark:hover:text-slate-300"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "description" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-slate-800 shadow-lg dark:shadow-none">

                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Ürün Açıklaması</h3>

                <p className="text-gray-700 dark:text-slate-400 leading-relaxed mb-6 whitespace-pre-line">{product.description}</p>

                {product.features?.length > 0 && (<>
                  <h4 className="font-bold mb-3 text-gray-900 dark:text-white">Öne Çıkan Özellikler:</h4>

                  <div className="grid md:grid-cols-2 gap-3">
                    {product.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                        <Check size={16} className="text-green-500 dark:text-green-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </>)}

              </div>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-slate-800 shadow-lg dark:shadow-none">

              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Teknik Özellikler</h3>

              <div className="grid md:grid-cols-2 gap-4">
                {product.specifications?.length > 0 ? (
                  product.specifications.map((s, i) => (
                    <div key={i} className="flex justify-between items-center gap-4 p-4 bg-gray-100 dark:bg-slate-800 rounded-xl">
                      <span className="text-gray-600 dark:text-slate-400">{s.key}</span>
                      <span className="font-semibold text-gray-900 dark:text-white text-right">{s.value}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-slate-400">Teknik özellik eklenmemiş.</p>
                )}
              </div>

            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">

              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-slate-800 shadow-lg dark:shadow-none">

                <div className="grid md:grid-cols-2 gap-8">

                  <div className="text-center md:text-left">
                    <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">{ratingValue ? ratingValue.toFixed(1) : '-'}</div>
                    <div className="flex justify-center md:justify-start text-yellow-500 mb-2">{ratingValue ? renderStars(ratingValue) : null}</div>
                    <p className="text-gray-600 dark:text-slate-400">{reviews.length} değerlendirme</p>
                  </div>

                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = reviews.filter((r) => r.rating === star).length;
                      const total = reviews.length;
                      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

                      return (
                        <div key={star} className="flex items-center gap-3">
                          <span className="text-lg text-gray-900 dark:text-white">{star} ⭐</span>
                          <div className="flex-1 bg-gray-200 dark:bg-slate-800 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-slate-400 w-12">{count}</span>
                        </div>
                      );
                    })}
                  </div>

                </div>

              </div>

              <div className="space-y-4">
                {displayedReviews.map((review) => (
                  <div key={review._id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-lg dark:shadow-none">

                    <div className="flex items-start justify-between mb-3">

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center font-bold text-white">{review?.name?.[0] || '?'}</div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 dark:text-white">{review?.name}</span>
                            {review?.verified && (
                              <span className="bg-green-500/10 text-green-600 dark:text-green-400 text-xs px-2 py-0.5 rounded-full flex items-center gap-1"><Check size={12} />Doğrulanmış Alıcı</span>
                            )}
                          </div>
                          <span className="text-sm text-gray-600 dark:text-slate-400">{review?.date}</span>
                        </div>
                      </div>

                      <div className="flex text-yellow-500">
                        {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} fill={i <= review?.rating ? "currentColor" : "none"} />)}
                      </div>

                    </div>

                    <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-3">{review?.comment}</p>

                    {review?.images?.length > 0 && (
                      <div className="flex gap-2">
                        {review.images.map((img, i) => (
                          <img key={i} src={img} alt="Yorum görseli" loading="lazy" className="w-20 h-20 rounded-lg object-cover cursor-pointer hover:scale-105 transition-transform shadow-md" />
                        ))}
                      </div>
                    )}

                  </div>
                ))}
              </div>

              {reviews.length > 3 && (
                <button onClick={() => setShowReview(!showReview)} className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 py-4 rounded-2xl font-bold hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-900 dark:text-white shadow-md dark:shadow-none">
                  {showReview ? "Yorumları Gizle" : "Tüm Yorumları Göster"}
                </button>
              )}

              {isAuth ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800">

                  <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Değerlendirme Yaz</h3>

                  {reviewSuccess && (
                    <div className="mb-4 bg-green-500/10 text-green-600 dark:text-green-400 px-4 py-3 rounded-xl flex items-center gap-2"><Check size={18} />Yorumunuz başarıyla gönderildi!</div>
                  )}

                  {reviewError && (
                    <div className="mb-4 bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-2"><X size={18} />{reviewError}</div>
                  )}

                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-600 dark:text-slate-400 mb-3">Puanınız</p>

                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onMouseEnter={() => setReviewHoverRating(star)}
                          onMouseLeave={() => setReviewHoverRating(0)}
                          onClick={() => setReviewRating(star)}
                          aria-label={`${star} yıldız`}
                          className="transition-transform hover:scale-110"
                        >
                          <Star size={32} className="text-yellow-500" fill={star <= (reviewHoverRating || reviewRating) ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-600 dark:text-slate-400 mb-3">Yorumunuz</p>
                    <textarea
                      rows={4}
                      maxLength={1000}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Ürün hakkındaki düşüncelerinizi paylaşın..."
                      className="w-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors resize-none text-gray-900 dark:text-white"
                    />
                    <p className="text-xs text-gray-500 dark:text-slate-500 mt-1 text-right">{reviewComment.length} / 1000</p>
                  </div>

                  <button
                    onClick={handleSubmitReview}
                    disabled={!reviewComment.trim() || isSubmittingReview}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition-all text-white shadow-lg"
                  >
                    {isSubmittingReview ? "Gönderiliyor..." : "Değerlendirmeyi Gönder"}
                  </button>

                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 text-center">
                  <p className="text-gray-600 dark:text-slate-400 mb-4">Yorum yapmak için giriş yapmanız gerekiyor.</p>
                  <button onClick={() => navigate("/auth")} className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-white transition-colors">Giriş Yap</button>
                </div>
              )}

            </div>
          )}

        </div>

        {/* ---------- Benzer ürünler (şimdilik statik) ---------- */}
        <div className="mt-16 md:mt-24">

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Benzer Ürünler</h2>

            <button onClick={() => navigate('/products')} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2">
              Tümünü Gör <ArrowRight size={18} />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 transition-all group cursor-pointer shadow-lg dark:shadow-none">

                <div className="relative mb-4 overflow-hidden rounded-2xl">
                  <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-800 dark:to-slate-900 group-hover:scale-105 transition-transform"></div>
                  <div className="absolute top-3 right-3 bg-red-500 px-2 py-1 rounded-full text-xs font-bold text-white shadow-lg">%15</div>
                </div>

                <div className="flex text-yellow-500 mb-2">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={14} fill="currentColor" />)}</div>

                <h3 className="font-bold mb-2 line-clamp-2 text-gray-900 dark:text-white">Smart LED Device {i}</h3>

                <div className="flex items-center gap-2 mb-4">
                  <p className="text-blue-600 dark:text-blue-400 font-bold text-lg">₺{999 + i * 100}</p>
                  <p className="text-gray-500 dark:text-slate-500 line-through text-sm">₺{1299 + i * 100}</p>
                </div>

                <button className="w-full bg-gray-200 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors text-gray-900 dark:text-white hover:text-white">
                  <ShoppingCart size={16} />
                  Sepete Ekle
                </button>

              </div>
            ))}
          </div>

        </div>

      </div>

      {/* ---------- Görsel büyütme ---------- */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" onClick={() => setShowImageModal(false)}>

          <button className="absolute top-4 right-4 w-12 h-12 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors shadow-lg" aria-label="Kapat" onClick={() => setShowImageModal(false)}>
            <X size={24} className="text-gray-900 dark:text-white" />
          </button>

          <img src={images[selectedImage]?.file} alt={product.name} className="max-w-full max-h-[90vh] object-contain rounded-2xl" onClick={(e) => e.stopPropagation()} />

          {images.length > 1 && (<>
            <button onClick={(e) => { e.stopPropagation(); handleImageNavigation("prev"); }} aria-label="Önceki görsel" className="absolute left-4 w-12 h-12 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors shadow-lg">
              <ChevronLeft size={24} className="text-gray-900 dark:text-white" />
            </button>

            <button onClick={(e) => { e.stopPropagation(); handleImageNavigation("next"); }} aria-label="Sonraki görsel" className="absolute right-4 w-12 h-12 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors shadow-lg">
              <ChevronRight size={24} className="text-gray-900 dark:text-white" />
            </button>
          </>)}

        </div>
      )}

      {/* ---------- Mobil sabit alt bar ---------- */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800 p-4 md:hidden z-40 shadow-xl">

        <div className="flex gap-3">

          <button onClick={handleAddToCart} disabled={!inStock} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-white shadow-lg disabled:opacity-50">
            <ShoppingCart size={18} />
            {inStock ? 'Sepete Ekle' : 'Stokta Yok'}
          </button>

          <button onClick={() => setIsWishlisted(!isWishlisted)} aria-label="Favorilere ekle" className={`w-12 rounded-xl flex items-center justify-center shadow-md ${isWishlisted ? "bg-red-500 text-white" : "bg-gray-200 dark:bg-slate-900 text-gray-900 dark:text-white"}`}>
            <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
          </button>

        </div>

      </div>

    </div>
  );
};

export default ProductDetail;
