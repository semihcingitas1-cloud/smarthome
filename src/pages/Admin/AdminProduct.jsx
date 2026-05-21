import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Package, Upload, X, Plus, Minus, Save, Eye, Sparkles, Tag, DollarSign, Layers, Image as ImageIcon, AlertCircle, CheckCircle2, Loader2, Info, Trash2, Copy, BarChart3, Box, Palette, Zap, Shield, Truck, Star, Calendar, Hash, FileText, Settings, List, Grid3x3, ArrowLeft, ChevronDown, Search, Filter, Edit, MoreVertical, SlidersHorizontal, Download, RefreshCw, TrendingUp, Users, ShoppingCart, Activity } from 'lucide-react';

const AdminProduct = () => {

  const initialProducts = [
    {
      id: 1,
      name: 'Smart LED Panel Pro',
      sku: 'SKU-LED001',
      category: 'Akıllı Aydınlatma',
      subcategory: 'LED Paneller',
      brand: 'TechHome',
      price: 1299,
      oldPrice: 1599,
      stock: 45,
      sold: 1240,
      rating: 4.9,
      reviews: 245,
      image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
      badge: 'bestseller',
      isNew: false,
      isFeatured: true,
      isActive: true,
      freeShipping: true,
      warranty: '24',
      tags: ['LED', 'WiFi', 'RGB'],
      colors: [
        { name: 'Siyah', hex: '#000000' },
        { name: 'Beyaz', hex: '#FFFFFF' }
      ],
      features: ['WiFi 2.4GHz & 5GHz', 'RGB Kontrol', 'Sesli Asistan'],
      description: 'Premium akıllı LED panel'
    },
    {
      id: 2,
      name: '360° Güvenlik Kamerası',
      sku: 'SKU-CAM002',
      category: 'Kameralar',
      subcategory: 'İç Mekan',
      brand: 'SecureTech',
      price: 2499,
      oldPrice: 2999,
      stock: 28,
      sold: 567,
      rating: 5,
      reviews: 189,
      image: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb',
      badge: 'new',
      isNew: true,
      isFeatured: true,
      isActive: true,
      freeShipping: true,
      warranty: '24',
      tags: ['Kamera', '4K', 'Gece Görüş'],
      colors: [{ name: 'Beyaz', hex: '#FFFFFF' }],
      features: ['4K Çözünürlük', 'Gece Görüşü', 'Hareket Algılama'],
      description: '360 derece görüş açılı güvenlik kamerası'
    },
    {
      id: 3,
      name: 'Akıllı Hareket Sensörü',
      sku: 'SKU-SEN003',
      category: 'Sensörler',
      subcategory: 'Hareket',
      brand: 'SmartSense',
      price: 799,
      oldPrice: 999,
      stock: 120,
      sold: 892,
      rating: 4.7,
      reviews: 123,
      image: 'https://images.unsplash.com/photo-1581091215367-59ab6dcef10d',
      badge: 'sale',
      isNew: false,
      isFeatured: false,
      isActive: true,
      freeShipping: false,
      warranty: '12',
      tags: ['Sensör', 'PIR', 'Kablosuz'],
      colors: [{ name: 'Beyaz', hex: '#FFFFFF' }],
      features: ['Kablosuz', 'Pil Ömrü 2 Yıl', 'Geniş Algılama'],
      description: 'Hassas hareket algılama sensörü'
    },
    {
      id: 4,
      name: 'WiFi Akıllı Kilit',
      sku: 'SKU-LOCK004',
      category: 'Akıllı Kilitler',
      subcategory: 'Biyometrik',
      brand: 'SecureLock',
      price: 3199,
      oldPrice: 3799,
      stock: 15,
      sold: 423,
      rating: 4.8,
      reviews: 312,
      image: 'https://images.unsplash.com/photo-1558002038-1055907df827',
      badge: 'premium',
      isNew: false,
      isFeatured: true,
      isActive: true,
      freeShipping: true,
      warranty: '36',
      tags: ['Kilit', 'Biyometrik', 'WiFi'],
      colors: [
        { name: 'Siyah', hex: '#000000' },
        { name: 'Silver', hex: '#C0C0C0' }
      ],
      features: ['Biyometrik', 'Uzaktan Kontrol', 'Otomatik Kilitleme'],
      description: 'Akıllı biyometrik kapı kilidi'
    },
    {
      id: 5,
      name: 'Akıllı Ampul Set (4lü)',
      sku: 'SKU-BULB005',
      category: 'Akıllı Aydınlatma',
      subcategory: 'Ampuller',
      brand: 'LightSmart',
      price: 599,
      oldPrice: 799,
      stock: 200,
      sold: 2341,
      rating: 4.6,
      reviews: 567,
      image: 'https://images.unsplash.com/photo-1550985616-10810253b84d',
      badge: 'bestseller',
      isNew: false,
      isFeatured: false,
      isActive: true,
      freeShipping: false,
      warranty: '12',
      tags: ['LED', 'E27', 'RGB'],
      colors: [],
      features: ['E27 Duy', 'Dimmer', '16M Renk'],
      description: '4lü akıllı LED ampul seti'
    }
  ];

  const navigate = useNavigate();

  const [products, setProducts] = useState(initialProducts);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentProduct, setCurrentProduct] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    subcategory: '',
    brand: '',
    price: '',
    oldPrice: '',
    stock: '',
    shortDescription: '',
    description: '',
    features: [''],
    tags: [],
    colors: [],
    images: [],
    badge: '',
    isNew: false,
    isFeatured: false,
    isActive: true,
    freeShipping: false,
    warranty: ''
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [tagInput, setTagInput] = useState('');
  const [colorInput, setColorInput] = useState({ name: '', hex: '#000000' });

  const categories = [
    { 
      name: 'Akıllı Aydınlatma', 
      subcategories: ['LED Paneller', 'Ampuller', 'Şerit LED', 'Spot Işıklar'] 
    },
    { 
      name: 'Kameralar', 
      subcategories: ['İç Mekan', 'Dış Mekan', 'Kapı Zilleri', 'PTZ Kameralar'] 
    },
    { 
      name: 'Sensörler', 
      subcategories: ['Hareket', 'Sıcaklık', 'Kapı/Pencere', 'Duman'] 
    },
    { 
      name: 'Akıllı Kilitler', 
      subcategories: ['Biyometrik', 'Şifreli', 'Kartlı', 'Bluetooth'] 
    },
  ];

  const badges = [
    { value: 'new', label: 'Yeni', color: 'from-green-500 to-emerald-500' },
    { value: 'bestseller', label: 'Çok Satan', color: 'from-orange-500 to-red-500' },
    { value: 'premium', label: 'Premium', color: 'from-blue-500 to-purple-500' },
    { value: 'sale', label: 'İndirim', color: 'from-red-500 to-pink-500' },
  ];

  const tabs = [
    { id: 'basic', label: 'Temel Bilgiler', icon: Package },
    { id: 'pricing', label: 'Fiyat & Stok', icon: DollarSign },
    { id: 'details', label: 'Detaylar', icon: FileText },
    { id: 'media', label: 'Görseller', icon: ImageIcon },
  ];

  const stats = [
    { label: 'Toplam Ürün', value: products.length, icon: Package, color: 'from-blue-500 to-cyan-500' },
    { label: 'Aktif Ürün', value: products.filter(p => p.isActive).length, icon: CheckCircle2, color: 'from-green-500 to-emerald-500' },
    { label: 'Stokta Tükenen', value: products.filter(p => p.stock < 10).length, icon: AlertCircle, color: 'from-orange-500 to-red-500' },
    { label: 'Toplam Satış', value: products.reduce((sum, p) => sum + p.sold, 0).toLocaleString(), icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
  ];

  // Open modal for adding product
  const handleAddProduct = () => {
    setModalMode('add');
    setCurrentProduct(null);
    setFormData({
      name: '',
      sku: '',
      category: '',
      subcategory: '',
      brand: '',
      price: '',
      oldPrice: '',
      stock: '',
      shortDescription: '',
      description: '',
      features: [''],
      tags: [],
      colors: [],
      images: [],
      badge: '',
      isNew: false,
      isFeatured: false,
      isActive: true,
      freeShipping: false,
      warranty: ''
    });
    setActiveTab('basic');
    setShowModal(true);
  };

  // Open modal for editing product
  const handleEditProduct = (product) => {
    setModalMode('edit');
    setCurrentProduct(product);
    setFormData({
      ...product,
      price: product.price.toString(),
      oldPrice: product.oldPrice.toString(),
      stock: product.stock.toString()
    });
    setActiveTab('basic');
    setShowModal(true);
  };

  // Delete product
  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(p => p.id !== productId));
    setShowDeleteConfirm(false);
    setProductToDelete(null);
    setSaveStatus('deleted');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // Save product (add or edit)
  const handleSaveProduct = () => {
    if (modalMode === 'add') {
      const newProduct = {
        ...formData,
        id: Date.now(),
        price: parseFloat(formData.price),
        oldPrice: parseFloat(formData.oldPrice || 0),
        stock: parseInt(formData.stock),
        sold: 0,
        rating: 0,
        reviews: 0,
        image: formData.images[0]?.preview || 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4'
      };
      setProducts([newProduct, ...products]);
      setSaveStatus('added');
    } else {
      const updatedProducts = products.map(p =>
        p.id === currentProduct.id
          ? {
              ...formData,
              id: p.id,
              price: parseFloat(formData.price),
              oldPrice: parseFloat(formData.oldPrice || 0),
              stock: parseInt(formData.stock),
              sold: p.sold,
              rating: p.rating,
              reviews: p.reviews,
              image: formData.images[0]?.preview || p.image
            }
          : p
      );
      setProducts(updatedProducts);
      setSaveStatus('updated');
    }

    setShowModal(false);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // Toggle product selection
  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Bulk delete
  const handleBulkDelete = () => {
    setProducts(products.filter(p => !selectedProducts.includes(p.id)));
    setSelectedProducts([]);
    setSaveStatus('deleted');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // Duplicate product
  const handleDuplicateProduct = (product) => {
    const duplicated = {
      ...product,
      id: Date.now(),
      name: `${product.name} (Kopya)`,
      sku: `${product.sku}-COPY`
    };
    setProducts([duplicated, ...products]);
    setSaveStatus('duplicated');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // Filter and sort products
  const getFilteredProducts = () => {
    let filtered = [...products];

    // Search
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(p => p.category === filterCategory);
    }

    // Status filter
    if (filterStatus === 'active') {
      filtered = filtered.filter(p => p.isActive);
    } else if (filterStatus === 'inactive') {
      filtered = filtered.filter(p => !p.isActive);
    } else if (filterStatus === 'lowstock') {
      filtered = filtered.filter(p => p.stock < 10);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'stock':
        filtered.sort((a, b) => a.stock - b.stock);
        break;
      case 'bestselling':
        filtered.sort((a, b) => b.sold - a.sold);
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  // Form handlers
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));
    setFormData({ ...formData, images: [...formData.images, ...newImages] });
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const addColor = () => {
    if (colorInput.name && colorInput.hex) {
      setFormData({ ...formData, colors: [...formData.colors, colorInput] });
      setColorInput({ name: '', hex: '#000000' });
    }
  };

  const removeColor = (index) => {
    const newColors = formData.colors.filter((_, i) => i !== index);
    setFormData({ ...formData, colors: newColors });
  };

  const getBadgeColor = (badge) => {
    const badgeObj = badges.find(b => b.value === badge);
    return badgeObj?.color || 'from-gray-500 to-gray-600';
  };

  return (

    <div className="min-h-screen bg-slate-950 text-white">

      {saveStatus && ( <div className="fixed top-8 right-8 z-50 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in">

        <CheckCircle2 size={24} />

        <div>

          <p className="font-bold">Başarılı!</p>

          <p className="text-sm">

            {saveStatus === 'added' && 'Ürün başarıyla eklendi'}
            {saveStatus === 'updated' && 'Ürün başarıyla güncellendi'}
            {saveStatus === 'deleted' && 'Ürün(ler) başarıyla silindi'}
            {saveStatus === 'duplicated' && 'Ürün başarıyla kopyalandı'}

          </p>

        </div>

      </div> )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-500/10 rounded-2xl">
                <AlertCircle className="text-red-400" size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Ürünü Sil</h3>
                <p className="text-sm text-slate-400">Bu işlem geri alınamaz</p>
              </div>
            </div>
            <p className="text-slate-400 mb-6">
              <span className="text-white font-semibold">{productToDelete?.name}</span> ürününü silmek istediğinize emin misiniz?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-semibold transition-colors"
              >
                İptal
              </button>
              <button
                onClick={() => handleDeleteProduct(productToDelete.id)}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-semibold transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && ( <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto">

        <div className="min-h-screen p-6 flex items-center justify-center">

          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">

            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-6 z-10">

              <div className="flex items-center justify-between">

                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-slate-800 rounded-xl transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

                {/* Tabs */}
                <div className="flex gap-2 mt-6 overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <tab.icon size={18} />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Basic Info Tab */}
                {activeTab === 'basic' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-400">Ürün Adı *</label>
                      <input
                        type="text"
                        placeholder="Örn: Smart LED Panel Pro"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-400">SKU *</label>
                        <input
                          type="text"
                          placeholder="SKU-12345"
                          value={formData.sku}
                          onChange={(e) => handleChange('sku', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-400">Marka</label>
                        <input
                          type="text"
                          placeholder="Örn: TechHome"
                          value={formData.brand}
                          onChange={(e) => handleChange('brand', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-400">Kategori *</label>
                        <select
                          value={formData.category}
                          onChange={(e) => {
                            handleChange('category', e.target.value);
                            handleChange('subcategory', '');
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                        >
                          <option value="">Kategori Seçin</option>
                          {categories.map((cat) => (
                            <option key={cat.name} value={cat.name}>{cat.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-400">Alt Kategori</label>
                        <select
                          value={formData.subcategory}
                          onChange={(e) => handleChange('subcategory', e.target.value)}
                          disabled={!formData.category}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                        >
                          <option value="">Alt Kategori Seçin</option>
                          {categories.find(c => c.name === formData.category)?.subcategories.map((sub) => (
                            <option key={sub} value={sub}>{sub}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-400">Kısa Açıklama</label>
                      <textarea
                        rows="3"
                        placeholder="Ürünün kısa özeti"
                        value={formData.shortDescription}
                        onChange={(e) => handleChange('shortDescription', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* Pricing Tab */}
                {activeTab === 'pricing' && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-400">Satış Fiyatı *</label>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="1299"
                            value={formData.price}
                            onChange={(e) => handleChange('price', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-blue-500"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">₺</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-400">Eski Fiyat</label>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="1599"
                            value={formData.oldPrice}
                            onChange={(e) => handleChange('oldPrice', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-blue-500"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">₺</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-400">Stok Adedi *</label>
                        <input
                          type="number"
                          placeholder="50"
                          value={formData.stock}
                          onChange={(e) => handleChange('stock', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-400">Garanti Süresi</label>
                        <select
                          value={formData.warranty}
                          onChange={(e) => handleChange('warranty', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                        >
                          <option value="">Garanti Seçin</option>
                          <option value="6">6 Ay</option>
                          <option value="12">1 Yıl</option>
                          <option value="24">2 Yıl</option>
                          <option value="36">3 Yıl</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-400">Rozet</label>
                        <select
                          value={formData.badge}
                          onChange={(e) => handleChange('badge', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                        >
                          <option value="">Rozet Seçin</option>
                          {badges.map(badge => (
                            <option key={badge.value} value={badge.value}>{badge.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.freeShipping}
                          onChange={(e) => handleChange('freeShipping', e.target.checked)}
                          className="w-5 h-5 rounded border-slate-700 bg-slate-950 text-blue-600"
                        />
                        <span className="font-medium">Ücretsiz Kargo</span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isNew}
                          onChange={(e) => handleChange('isNew', e.target.checked)}
                          className="w-5 h-5 rounded border-slate-700 bg-slate-950 text-blue-600"
                        />
                        <span className="font-medium">Yeni Ürün</span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isFeatured}
                          onChange={(e) => handleChange('isFeatured', e.target.checked)}
                          className="w-5 h-5 rounded border-slate-700 bg-slate-950 text-blue-600"
                        />
                        <span className="font-medium">Öne Çıkan Ürün</span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) => handleChange('isActive', e.target.checked)}
                          className="w-5 h-5 rounded border-slate-700 bg-slate-950 text-blue-600"
                        />
                        <span className="font-medium">Aktif (Satışta)</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Details Tab */}
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-400">Detaylı Açıklama</label>
                      <textarea
                        rows="6"
                        placeholder="Ürününüzü detaylı olarak açıklayın..."
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 resize-none"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-slate-400">Özellikler</label>
                        <button
                          onClick={addFeature}
                          className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
                        >
                          <Plus size={16} />
                          Ekle
                        </button>
                      </div>
                      <div className="space-y-3">
                        {formData.features.map((feature, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Örn: WiFi 2.4GHz Desteği"
                              value={feature}
                              onChange={(e) => updateFeature(index, e.target.value)}
                              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                            />
                            <button
                              onClick={() => removeFeature(index)}
                              className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-semibold text-slate-400">Etiketler</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Etiket ekle"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                        />
                        <button
                          onClick={addTag}
                          className="px-6 bg-blue-600 hover:bg-blue-700 rounded-xl"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm"
                            >
                              {tag}
                              <button onClick={() => removeTag(tag)}>
                                <X size={14} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-semibold text-slate-400">Renk Seçenekleri</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Renk Adı"
                          value={colorInput.name}
                          onChange={(e) => setColorInput({ ...colorInput, name: e.target.value })}
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="color"
                          value={colorInput.hex}
                          onChange={(e) => setColorInput({ ...colorInput, hex: e.target.value })}
                          className="w-16 h-12 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer"
                        />
                        <button
                          onClick={addColor}
                          className="px-6 bg-blue-600 hover:bg-blue-700 rounded-xl"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                      {formData.colors.length > 0 && (
                        <div className="flex flex-wrap gap-3">
                          {formData.colors.map((color, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2"
                            >
                              <div
                                className="w-6 h-6 rounded-full border-2 border-slate-700"
                                style={{ backgroundColor: color.hex }}
                              />
                              <span className="text-sm">{color.name}</span>
                              <button
                                onClick={() => removeColor(index)}
                                className="ml-2 text-red-400"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Media Tab */}
                {activeTab === 'media' && (
                  <div className="space-y-6">
                    <div className="border-2 border-dashed border-slate-800 rounded-2xl p-12 text-center hover:border-blue-500/50 transition-colors">
                      <input
                        type="file"
                        id="image-upload"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-4">
                        <div className="p-6 bg-blue-500/10 rounded-2xl">
                          <Upload size={48} className="text-blue-400" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold mb-2">Görsel Yükle</p>
                          <p className="text-sm text-slate-400">
                            veya sürükle-bırak yapın (PNG, JPG, WEBP)
                          </p>
                        </div>
                      </label>
                    </div>

                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.images.map((image, index) => (
                          <div
                            key={index}
                            className="relative group aspect-square bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden"
                          >
                            <img
                              src={image.preview}
                              alt={`Product ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {index === 0 && (
                              <div className="absolute top-2 left-2 bg-blue-600 px-2 py-1 rounded-lg text-xs font-bold">
                                Ana Görsel
                              </div>
                            )}
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 p-2 bg-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-slate-900 border-t border-slate-800 p-6">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-semibold transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleSaveProduct}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold transition-colors shadow-lg shadow-blue-500/25"
                  >
                    <Save size={18} className="inline mr-2" />
                    {modalMode === 'add' ? 'Ürünü Ekle' : 'Değişiklikleri Kaydet'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="mb-8">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h1 className="text-3xl font-bold mb-2">Ürün Yönetimi</h1>
              <p className="text-slate-400">Tüm ürünlerinizi buradan yönetin</p>

            </div>

            <button onClick={() => navigate('/admin/addproduct')} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/25">
              <Plus size={20} />
              Yeni Ürün Ekle
            </button>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                  <stat.icon size={24} className="text-white" />
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="grid md:grid-cols-12 gap-4">
              {/* Search */}
              <div className="md:col-span-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Ürün ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="md:col-span-2">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">Tüm Kategoriler</option>
                  {categories.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="md:col-span-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">Tüm Durumlar</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Pasif</option>
                  <option value="lowstock">Düşük Stok</option>
                </select>
              </div>

              {/* Sort */}
              <div className="md:col-span-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                >
                  <option value="newest">En Yeni</option>
                  <option value="price-low">Fiyat: Düşük-Yüksek</option>
                  <option value="price-high">Fiyat: Yüksek-Düşük</option>
                  <option value="stock">Stok Durumu</option>
                  <option value="bestselling">Çok Satanlar</option>
                </select>
              </div>

              {/* View Mode */}
              <div className="md:col-span-2 flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                    viewMode === 'grid' ? 'bg-blue-600' : 'bg-slate-950 hover:bg-slate-800'
                  }`}
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                    viewMode === 'list' ? 'bg-blue-600' : 'bg-slate-950 hover:bg-slate-800'
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedProducts.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                <p className="text-sm text-slate-400">
                  {selectedProducts.length} ürün seçildi
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedProducts([])}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm transition-colors"
                  >
                    Seçimi Temizle
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl text-sm transition-colors"
                  >
                    Seçilenleri Sil
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">
            <Package size={64} className="mx-auto mb-4 text-slate-700" />
            <h3 className="text-2xl font-bold mb-2">Ürün Bulunamadı</h3>
            <p className="text-slate-400 mb-6">Arama kriterlerinizi değiştirin veya yeni ürün ekleyin</p>
            <button
              onClick={handleAddProduct}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition-colors"
            >
              Yeni Ürün Ekle
            </button>
          </div>

        ) : (

        <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>

          {filteredProducts.map((product) => ( <div key={product.id} className={`bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden transition-all hover:border-blue-500/50 ${viewMode === 'list' ? 'flex gap-6' : ''}`}>

            <div className={`absolute ${viewMode === 'grid' ? 'top-4 left-4' : 'top-6 left-6'} z-10`}>

              <input type="checkbox" checked={selectedProducts.includes(product.id)} onChange={() => toggleProductSelection(product.id)} className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-blue-600 cursor-pointer" />

            </div>

            <div className={`relative ${viewMode === 'grid' ? '' : 'w-64 flex-shrink-0'}`}>

              <img src={product.image} alt={product.name} className={`w-full object-cover ${viewMode === 'grid' ? 'h-64' : 'h-full'}`} />

              {product.badge && ( <div className={`absolute top-4 right-4 bg-gradient-to-r ${getBadgeColor(product.badge)} px-3 py-1 rounded-full text-xs font-bold shadow-lg`}>
                {badges.find(b => b.value === product.badge)?.label}
              </div> )}

              {!product.isActive && ( <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <span className="bg-red-500 px-4 py-2 rounded-xl font-bold">Pasif</span>
              </div> )}

            </div>

            <div className="p-6 flex-1">

              <div className="flex items-start justify-between mb-3">

                <div className="flex-1">

                  <p className="text-xs text-slate-500 mb-1">{product.category}</p>
                  <h3 className="font-bold text-lg mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-xs text-slate-400">SKU: {product.sku}</p>

                </div>

              </div>

              <div className="flex items-center gap-2 mb-3">

                {product.tags.slice(0, 3).map((tag, i) => ( <span key={i} className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full">{tag}</span> ))}

              </div>

              <div className="flex items-center gap-1 mb-3">

                {[...Array(5)].map((_, i) => ( <Star key={i} size={14} className={i < product.rating ? 'text-yellow-500' : 'text-slate-700'} fill={i < product.rating ? 'currentColor' : 'none'} /> ))}
                <span className="text-xs text-slate-400 ml-1">({product.reviews})</span>

              </div>

              <div className="flex items-center gap-3 mb-4">

                <span className="text-2xl font-bold text-blue-400">₺{product.price.toLocaleString()}</span>
                {product.oldPrice && ( <span className="line-through text-slate-500">₺{product.oldPrice.toLocaleString()}</span> )}

              </div>

              <div className="flex items-center justify-between mb-4">

                <div className="text-sm">

                  <span className="text-slate-400">Stok: </span>
                  <span className={product.stock < 10 ? 'text-orange-400 font-semibold' : 'text-green-400 font-semibold'}>{product.stock}</span>

                </div>

                <div className="text-sm text-slate-400">{product.sold} satış</div>

              </div>

              <div className="flex gap-2">

                <button onClick={() => handleEditProduct(product)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors">
                  <Edit size={16} />
                  Düzenle
                </button>

                <button onClick={() => handleDuplicateProduct(product)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors" title="Kopyala">
                  <Copy size={16} />
                </button>

                <button onClick={() => {setProductToDelete(product); setShowDeleteConfirm(true); }} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors" title="Sil">
                  <Trash2 size={16} />
                </button>

              </div>

            </div>

          </div> ))}

        </div> )}

      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AdminProduct;