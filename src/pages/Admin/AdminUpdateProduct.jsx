import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { createProductWithImages, resetStatus } from '../../redux/productSlice';

import { Package, Upload, X, Plus, Minus, Save, Eye, Sparkles, Tag, DollarSign, Layers, Image as ImageIcon, AlertCircle, CheckCircle2, Loader2, Info, Trash2, Copy, BarChart3, Box, Palette, Zap, Shield, Truck, Star, Calendar, Hash, FileText, Settings, List, Grid3x3, ArrowLeft, ChevronDown, Search, Filter } from 'lucide-react';

const AdminAddProduct = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({

    name: '',
    sku: '',
    category: '',
    subcategory: '',
    brand: '',
    price: '',
    oldPrice: '',
    stock: '',
    unit: 'adet',
    shortDescription: '',
    description: '',
    features: [''],
    specifications: [{ key: '', value: '' }],
    tags: [],
    colors: [],
    models: [{ name: '', price: '', stock: '', features: [''] }],
    images: [],
    badge: '',
    isNew: false,
    isFeatured: false,
    isActive: true,
    freeShipping: false,
    warranty: '',
    returnDays: 14,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  });

  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [colorInput, setColorInput] = useState({ name: '', hex: '' });

  const { loading, error, success, newProductId } = useSelector((state) => state.products);

  useEffect(() => {

    if (success && newProductId) {

      dispatch(resetStatus());
      navigate(`/admin/product/${newProductId}`);
    }
  }, [success, newProductId]);

  useEffect(() => {

    if (error) {

      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  }, [error]);

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

    { value: 'Yeni', label: 'Yeni', color: 'from-green-500 to-emerald-500' },
    { value: 'Çok Satan', label: 'Çok Satan', color: 'from-orange-500 to-red-500' },
    { value: 'Premium', label: 'Premium', color: 'from-blue-500 to-purple-500' },
    { value: 'İndirim', label: 'İndirim', color: 'from-red-500 to-pink-500' },
  ];

  const tabs = [

    { id: 'basic', label: 'Temel Bilgiler', icon: Package },
    { id: 'pricing', label: 'Fiyat & Stok', icon: DollarSign },
    { id: 'details', label: 'Detaylar', icon: FileText },
    { id: 'variants', label: 'Varyantlar', icon: Layers },
    { id: 'media', label: 'Görseller', icon: ImageIcon },
    { id: 'seo', label: 'SEO', icon: BarChart3 },
  ];

  const handleChange = (field, value) => {

    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field]) {

      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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

  const addSpecification = () => {

    setFormData({
      ...formData,
      specifications: [...formData.specifications, { key: '', value: '' }]
    });
  };

  const updateSpecification = (index, field, value) => {

    const newSpecs = [...formData.specifications];
    newSpecs[index][field] = value;
    setFormData({ ...formData, specifications: newSpecs });
  };

  const removeSpecification = (index) => {

    const newSpecs = formData.specifications.filter((_, i) => i !== index);
    setFormData({ ...formData, specifications: newSpecs });
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
      setColorInput({ name: '', hex: '' });
    }
  };

  const removeColor = (index) => {

    const newColors = formData.colors.filter((_, i) => i !== index);
    setFormData({ ...formData, colors: newColors });
  };

  const addModel = () => {

    setFormData({...formData, models: [...formData.models, { name: '', price: '', stock: '', features: [''] }]});
  };

  const updateModel = (index, field, value) => {

    const newModels = [...formData.models];
    newModels[index][field] = value;
    setFormData({ ...formData, models: newModels });
  };

  const removeModel = (index) => {

    const newModels = formData.models.filter((_, i) => i !== index);
    setFormData({ ...formData, models: newModels });
  };


  const generateSKU = (data) => {

    if (!data || !data.name) {

      handleChange('sku', '');
      return;
    }

    const turkishChars = { 'Ç': 'C', 'Ş': 'S', 'Ğ': 'G', 'Ü': 'U', 'İ': 'I', 'Ö': 'O', 'ç': 'C', 'ş': 'S', 'ğ': 'G', 'ü': 'U', 'ı': 'I', 'ö': 'O' };
    let cleaned = data.name.replace(/[ÇŞĞÜİÖçşğüıö]/g, match => turkishChars[match]);
    cleaned = cleaned.toUpperCase().trim().replace(/\s+/g, '-').replace(/[^A-Z0-9-]/g, '');
    const sku = `SKU-${cleaned}`;
    handleChange('sku', sku);
  };

  const duplicateProduct = () => {

    console.log('Ürün kopyalanıyor...');
  };

  const validateForm = () => {

    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Ürün adı gereklidir';
    if (!formData.sku.trim()) newErrors.sku = 'SKU gereklidir';
    if (!formData.category) newErrors.category = 'Kategori seçiniz';
    if (!formData.price) newErrors.price = 'Fiyat gereklidir';
    if (!formData.stock) newErrors.stock = 'Stok miktarı gereklidir';
    if (formData.images.length === 0) newErrors.images = 'En az 1 görsel yükleyiniz';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (isDraft = false) => {

    if (!isDraft && !validateForm()) {

      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
      return;
    }

    const productPayload = {

      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      subcategory: formData.subcategory,
      brand: formData.brand,
      price: Number(formData.price),
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : undefined,
      stock: Number(formData.stock),
      unit: formData.unit,
      shortDescription: formData.shortDescription,
      description: formData.description,
      features: formData.features.filter(f => f.trim() !== ''),
      specifications: formData.specifications.filter( s => s.key.trim() !== '' && s.value.trim() !== '' ),
      tags: formData.tags,
      colors: formData.colors,
      models: formData.models.filter(m => m.name.trim() !== ''),
      images: formData.images,
      badge: formData.badge,
      isNew: formData.isNew,
      isFeatured: formData.isFeatured,
      isActive: isDraft ? false : formData.isActive,
      freeShipping: formData.freeShipping,
      warranty: formData.warranty,
      returnDays: Number(formData.returnDays),
      seoTitle: formData.seoTitle,
      seoDescription: formData.seoDescription,
      seoKeywords: formData.seoKeywords,
    };

    dispatch(createProductWithImages(productPayload));
  };

  const selectedCategory = categories.find(cat => cat.name === formData.category);

  return (

    <div className="min-h-screen bg-slate-950 text-white">

      {saveStatus && ( <div className={`fixed top-8 right-8 z-50 ${saveStatus === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in`}>

        {saveStatus === 'success' ? ( <>

          <CheckCircle2 size={24} />

          <div>

            <p className="font-bold">Başarılı!</p>
            <p className="text-sm">Ürün başarıyla kaydedildi.</p>

          </div>

        </> ) : ( <>

          <AlertCircle size={24} />

          <div>

            <p className="font-bold">Hata!</p>
            <p className="text-sm">Lütfen tüm alanları kontrol edin.</p>

          </div>

        </> )}

      </div> )}

      <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">

        <div className="max-w-7xl mx-auto px-6 py-4">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <button onClick={() => window.history.back()} className="p-2 hover:bg-slate-800 rounded-xl transition-colors" >
                <ArrowLeft size={20} />
              </button>

              <div>

                <h1 className="text-2xl font-bold flex items-center gap-3">

                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl"><Package size={24} /></div>
                  Ürün Güncelle

                </h1>

                <p className="text-sm text-slate-400 mt-1">Ürün bilgilerini eksiksiz doldurun</p>

              </div>

            </div>

            <div className="flex items-center gap-3">

              <button onClick={() => setPreviewMode(!previewMode)} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"><Eye size={18} />Önizle</button>
              <button onClick={duplicateProduct} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"><Copy size={18} />Kopyala</button>
              <button onClick={() => handleSave(true)} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors disabled:opacity-50">Taslak Kaydet</button>

              <button onClick={() => handleSave(false)} disabled={isSaving} className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl transition-colors disabled:opacity-50 shadow-lg shadow-blue-500/25">

                {isSaving ? ( <><Loader2 size={18} className="animate-spin" />Kaydediliyor...</> ) : ( <><Save size={18} />Yayınla</> )}

              </button>

            </div>

          </div>

        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="grid lg:grid-cols-12 gap-8">

          <div className="lg:col-span-3">

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sticky top-24">

              <div className="space-y-2">

                {tabs.map((tab) => ( <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>

                  <tab.icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                  {errors[tab.id] && ( <AlertCircle size={16} className="ml-auto text-red-400" /> )}

                </button> ))}

              </div>

              <div className="mt-6 pt-6 border-t border-slate-800 space-y-3">

                <div className="text-xs text-slate-500 uppercase font-bold mb-3">Hızlı Bilgi</div>

                <div className="flex items-center justify-between text-sm">

                  <span className="text-slate-400">Görseller</span>
                  <span className="font-semibold">{formData.images.length}</span>

                </div>

                <div className="flex items-center justify-between text-sm">

                  <span className="text-slate-400">Özellikler</span>
                  <span className="font-semibold">{formData.features.filter(f => f).length}</span>

                </div>

                <div className="flex items-center justify-between text-sm">

                  <span className="text-slate-400">Etiketler</span>
                  <span className="font-semibold">{formData.tags.length}</span>

                </div>

                <div className="flex items-center justify-between text-sm">

                  <span className="text-slate-400">Durum</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${formData.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{formData.isActive ? 'Aktif' : 'Pasif'}</span>

                </div>

              </div>

            </div>

          </div>

          <div className="lg:col-span-9">

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-8">

              {activeTab === 'basic' && ( <div className="space-y-6">

                <div className="flex items-center gap-3 mb-6">

                  <div className="p-3 bg-blue-500/10 rounded-xl"><Package className="text-blue-400" size={24} /></div>

                  <div>

                    <h2 className="text-2xl font-bold">Temel Bilgiler</h2>
                    <p className="text-sm text-slate-400">Ürünün genel bilgilerini girin</p>

                  </div>

                </div>

                <div className="space-y-2">

                  <label className="text-sm font-semibold text-slate-400 flex items-center gap-2"><FileText size={14} />Ürün Adı *</label>
                  <input type="text" placeholder="Örn: Smart LED Panel Pro" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} className={`w-full bg-slate-950 border rounded-xl px-4 py-3 focus:outline-none transition-colors ${errors.name ? 'border-red-500' : 'border-slate-800 focus:border-blue-500'}`}/>

                  {errors.name && ( <p className="text-red-400 text-xs flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.name}
                  </p> )}

                </div>

                <div className="grid md:grid-cols-2 gap-6">

                  <div className="space-y-2">

                    <label className="text-sm font-semibold text-slate-400 flex items-center gap-2"><Hash size={14} />SKU / Stok Kodu *</label>

                    <div className="flex gap-2">

                      <input type="text" placeholder="SKU-12345" value={formData.sku} onChange={(e) => handleChange('sku', e.target.value)} className={`flex-1 bg-slate-950 border rounded-xl px-4 py-3 focus:outline-none transition-colors ${errors.sku ? 'border-red-500' : 'border-slate-800 focus:border-blue-500'}`}/>

                      <button onClick={() => generateSKU(formData)} className="px-4 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors" title="SKU Oluştur">
                        <Zap size={18} />
                      </button>

                    </div>

                    {errors.sku && ( <p className="text-red-400 text-xs flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.sku}
                    </p> )}

                  </div>

                  <div className="space-y-2">

                    <label className="text-sm font-semibold text-slate-400 flex items-center gap-2"><Tag size={14} />Marka</label>
                    <input type="text" placeholder="Örn: TechHome" value={formData.brand} onChange={(e) => handleChange('brand', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"/>

                  </div>

                </div>

                <div className="grid md:grid-cols-2 gap-6">

                  <div className="space-y-2">

                    <label className="text-sm font-semibold text-slate-400 flex items-center gap-2"><Layers size={14} />Kategori *</label>

                    <div className="relative">

                      <select value={formData.category} onChange={(e) => { setFormData(prev => ({ ...prev, category: e.target.value, subcategory: '' })); if (errors.category) { setErrors(prev => ({ ...prev, category: '' })); } }} className={`w-full bg-slate-950 border rounded-xl px-4 py-3 focus:outline-none transition-colors appearance-none ${errors.category ? 'border-red-500' : 'border-slate-800 focus:border-blue-500'}`}>

                        <option value="">Kategori Seçin</option>
                        {categories.map((cat) => ( <option key={cat.name} value={cat.name}>{cat.name}</option> ))}

                      </select>

                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />

                    </div>

                    {errors.category && ( <p className="text-red-400 text-xs flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.category}
                    </p>)}

                  </div>

                  <div className="space-y-2">

                    <label className="text-sm font-semibold text-slate-400 flex items-center gap-2"><Filter size={14} />Alt Kategori</label>

                    <div className="relative">

                      <select value={formData.subcategory} onChange={(e) => handleChange('subcategory', e.target.value)} disabled={!selectedCategory} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors appearance-none disabled:opacity-50">

                        <option value="">Alt Kategori Seçin</option>
                        {selectedCategory?.subcategories.map((sub) => ( <option key={sub} value={sub}>{sub}</option> ))}

                      </select>

                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />

                    </div>

                  </div>

                </div>

                <div className="space-y-2">

                  <label className="text-sm font-semibold text-slate-400 flex items-center gap-2"><FileText size={14} />Kısa Açıklama</label>
                  <textarea rows="3" placeholder="Ürünün kısa özeti (Liste görünümünde gösterilir)" value={formData.shortDescription} onChange={(e) => handleChange('shortDescription', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors resize-none"/>
                  <p className="text-xs text-slate-500">{formData.shortDescription.length} / 200 karakter</p>

                </div>

              </div> )}

              {activeTab === 'pricing' && ( <div className="space-y-6">

                <div className="flex items-center gap-3 mb-6">

                  <div className="p-3 bg-green-500/10 rounded-xl"><DollarSign className="text-green-400" size={24} /></div>

                  <div>

                    <h2 className="text-2xl font-bold">Fiyat & Stok</h2>
                    <p className="text-sm text-slate-400">Fiyatlandırma ve stok bilgilerini ayarlayın</p>

                  </div>

                </div>

                <div className="grid md:grid-cols-3 gap-6">

                  <div className="space-y-2">

                    <label className="text-sm font-semibold text-slate-400 flex items-center gap-2"><DollarSign size={14} />Satış Fiyatı *</label>

                    <div className="relative">

                      <input type="number" placeholder="1299" value={formData.price} onChange={(e) => handleChange('price', e.target.value)} className={`w-full bg-slate-950 border rounded-xl pl-4 pr-12 py-3 focus:outline-none transition-colors ${errors.price ? 'border-red-500' : 'border-slate-800 focus:border-blue-500'}`}/>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">₺</span>

                    </div>

                    {errors.price && ( <p className="text-red-400 text-xs flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.price}
                    </p> )}

                  </div>

                  <div className="space-y-2">

                    <label className="text-sm font-semibold text-slate-400 flex items-center gap-2"><Tag size={14} />Eski Fiyat</label>

                    <div className="relative">

                      <input type="number" placeholder="1599" value={formData.oldPrice} onChange={(e) => handleChange('oldPrice', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-blue-500 transition-colors"/>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">₺</span>

                    </div>

                    {formData.price && formData.oldPrice && ( <p className="text-xs text-green-400">%{Math.round(((formData.oldPrice - formData.price) / formData.oldPrice) * 100)} İndirim</p> )}

                  </div>

                  <div className="space-y-2">

                    <label className="text-sm font-semibold text-slate-400 flex items-center gap-2"><Box size={14} />Stok Adedi *</label>
                    <input type="number" placeholder="50" value={formData.stock} onChange={(e) => handleChange('stock', e.target.value)} className={`w-full bg-slate-950 border rounded-xl px-4 py-3 focus:outline-none transition-colors ${errors.stock ? 'border-red-500' : 'border-slate-800 focus:border-blue-500'}`}/>

                    {errors.stock && ( <p className="text-red-400 text-xs flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.stock}
                    </p> )}

                  </div>

                </div>

                <div className="grid md:grid-cols-2 gap-6">

                  <div className="space-y-2">

                    <label className="text-sm font-semibold text-slate-400 flex items-center gap-2"><Shield size={14} />Garanti Süresi</label>

                    <div className="relative">

                      <select value={formData.warranty} onChange={(e) => handleChange('warranty', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors appearance-none">

                        <option value="">Garanti Seçin</option>
                        <option value="6">6 Ay</option>
                        <option value="12">1 Yıl</option>
                        <option value="24">2 Yıl</option>
                        <option value="36">3 Yıl</option>

                      </select>

                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />

                    </div>

                  </div>

                  <div className="space-y-2">

                    <label className="text-sm font-semibold text-slate-400 flex items-center gap-2"><Calendar size={14} />İade Süresi (Gün)</label>
                    <input type="number" placeholder="14" value={formData.returnDays} onChange={(e) => handleChange('returnDays', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"/>

                  </div>

                </div>

                <div className="space-y-4">

                  <label className="text-sm font-semibold text-slate-400 flex items-center gap-2"><Sparkles size={14} />Rozet & Etiketler</label>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

                    {badges.map((badge) => ( <button key={badge.value} onClick={() => handleChange('badge', formData.badge === badge.value ? '' : badge.value)} className={`p-4 rounded-xl border transition-all ${formData.badge === badge.value ? `bg-gradient-to-br ${badge.color} border-transparent shadow-lg` : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}>
                      <p className="font-semibold text-sm">{badge.label}</p>
                    </button> ))}

                  </div>

                </div>

                <div className="space-y-3">

                  <label className="flex items-center gap-3 cursor-pointer group">

                    <input type="checkbox" checked={formData.freeShipping} onChange={(e) => handleChange('freeShipping', e.target.checked)} className="w-5 h-5 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-2 focus:ring-blue-500"/>

                    <div className="flex items-center gap-2">

                      <Truck size={18} className="text-blue-400" />
                      <span className="font-medium group-hover:text-blue-400 transition-colors">Ücretsiz Kargo</span>

                    </div>

                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">

                    <input type="checkbox" checked={formData.isNew} onChange={(e) => handleChange('isNew', e.target.checked)} className="w-5 h-5 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-2 focus:ring-blue-500"/>

                    <div className="flex items-center gap-2">

                      <Sparkles size={18} className="text-green-400" />
                      <span className="font-medium group-hover:text-blue-400 transition-colors">Yeni Ürün</span>

                    </div>

                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">

                    <input type="checkbox" checked={formData.isFeatured} onChange={(e) => handleChange('isFeatured', e.target.checked)} className="w-5 h-5 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-2 focus:ring-blue-500"/>

                    <div className="flex items-center gap-2">

                      <Star size={18} className="text-yellow-400" />
                      <span className="font-medium group-hover:text-blue-400 transition-colors">Öne Çıkan Ürün</span>

                    </div>

                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">

                    <input type="checkbox" checked={formData.isActive} onChange={(e) => handleChange('isActive', e.target.checked)} className="w-5 h-5 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-2 focus:ring-blue-500"/>

                    <div className="flex items-center gap-2">

                      <Zap size={18} className="text-purple-400" />
                      <span className="font-medium group-hover:text-blue-400 transition-colors">Aktif (Satışta)</span>

                    </div>

                  </label>

                </div>

              </div> )}

              {activeTab === 'details' && ( <div className="space-y-6">

                <div className="flex items-center gap-3 mb-6">

                  <div className="p-3 bg-purple-500/10 rounded-xl"><FileText className="text-purple-400" size={24} /></div>

                  <div>

                    <h2 className="text-2xl font-bold">Detaylı Bilgiler</h2>
                    <p className="text-sm text-slate-400">Ürün açıklaması ve özellikleri</p>

                  </div>

                </div>

                <div className="space-y-2">

                  <label className="text-sm font-semibold text-slate-400 flex items-center gap-2"><FileText size={14} />Detaylı Açıklama</label>
                  <textarea rows="8" placeholder="Ürününüzü detaylı olarak açıklayın..." value={formData.description} onChange={(e) => handleChange('description', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors resize-none"/>

                </div>

                <div className="space-y-4">

                  <div className="flex items-center justify-between">

                    <label className="text-sm font-semibold text-slate-400 flex items-center gap-2"><List size={14} />Özellikler</label>

                    <button onClick={addFeature} className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors">
                      <Plus size={16} />
                      Özellik Ekle
                    </button>

                  </div>

                  <div className="space-y-3">

                    {formData.features.map((feature, index) => ( <div key={index} className="flex gap-2">

                      <input type="text" placeholder="Örn: WiFi 2.4GHz & 5GHz Desteği" value={feature} onChange={(e) => updateFeature(index, e.target.value)} className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"/>

                      <button onClick={() => removeFeature(index)} className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors">
                        <Trash2 size={18} />
                      </button>

                    </div> ))}

                  </div>

                </div>

                <div className="space-y-4">

                  <div className="flex items-center justify-between">

                    <label className="text-sm font-semibold text-slate-400 flex items-center gap-2"><Settings size={14} />Teknik Özellikler</label>

                    <button onClick={addSpecification} className="flex items-center gap-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition-colors">
                      <Plus size={16} />
                      Özellik Ekle
                    </button>

                  </div>

                  <div className="space-y-3">

                    {formData.specifications.map((spec, index) => ( <div key={index} className="flex gap-2">

                      <input type="text" placeholder="Özellik (örn: Güç Tüketimi)" value={spec.key} onChange={(e) => updateSpecification(index, 'key', e.target.value)} className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"/>
                      <input type="text" placeholder="Değer (örn: 18W)" value={spec.value} onChange={(e) => updateSpecification(index, 'value', e.target.value)} className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"/>

                      <button onClick={() => removeSpecification(index)} className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors">
                        <Trash2 size={18} />
                      </button>

                    </div> ))}

                  </div>

                </div>

                <div className="space-y-4">

                  <label className="text-sm font-semibold text-slate-400 flex items-center gap-2"><Tag size={14} />Etiketler</label>

                  <div className="flex gap-2">

                    <input type="text" placeholder="Etiket ekle (örn: akıllı, LED, enerji)" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"/>

                    <button onClick={addTag} className="px-6 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors">
                      <Plus size={18} />
                    </button>

                  </div>

                  {formData.tags.length > 0 && ( <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => ( <span key={index} className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm">{tag}<button onClick={() => removeTag(tag)} className="hover:text-red-400"><X size={14} /></button></span> ))}
                  </div> )}

                </div>

              </div> )}

              {activeTab === 'variants' && ( <div className="space-y-6">

                <div className="flex items-center gap-3 mb-6">

                  <div className="p-3 bg-orange-500/10 rounded-xl"><Layers className="text-orange-400" size={24} /></div>

                  <div>

                    <h2 className="text-2xl font-bold">Varyantlar</h2>
                    <p className="text-sm text-slate-400">Renk ve model seçenekleri</p>

                  </div>

                </div>

                <div className="space-y-4">

                  <label className="text-sm font-semibold text-slate-400 flex items-center gap-2"><Palette size={14} />Renk Seçenekleri</label>

                  <div className="grid md:grid-cols-2 gap-4">

                    <div className="space-y-2">

                      <input type="text" placeholder="Renk Adı (örn: Siyah)" value={colorInput.name} onChange={(e) => setColorInput({ ...colorInput, name: e.target.value })} className="w-full dark:bg-slate-950 border dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"/>

                    </div>

                    <div className="flex gap-2">

                      <input type="color" value={colorInput.hex} onChange={(e) => setColorInput({ ...colorInput, hex: e.target.value })} className="w-16 h-12 dark:bg-slate-950 border dark:border-slate-800 rounded-xl cursor-pointer"/>
                      <input type="text" placeholder="#000000" value={colorInput.hex} onChange={(e) => setColorInput({ ...colorInput, hex: e.target.value })} className="flex-1 dark:bg-slate-950 border dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"/>

                      <button onClick={addColor} className="px-6 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors">
                        <Plus size={18} />
                      </button>

                    </div>

                  </div>

                  {formData.colors.length > 0 && ( <div className="flex flex-wrap gap-3">

                    {formData.colors.map((color, index) => ( <div key={index} className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2">

                      <div className="w-6 h-6 rounded-full border-2 border-slate-700" style={{ backgroundColor: color.hex }}/>
                      <span className="text-sm">{color.name}</span>
                      <button onClick={() => removeColor(index)} className="ml-2 text-red-400 hover:text-red-300"><X size={14} /></button>

                    </div> ))}

                  </div> )}

                </div>

                <div className="space-y-4">

                  <div className="flex items-center justify-between">

                    <label className="text-sm font-semibold text-slate-400 flex items-center gap-2"><Box size={14} />Model Varyantları</label>

                    <button onClick={addModel} className="flex items-center gap-2 px-3 py-1 bg-orange-600 hover:bg-orange-700 rounded-lg text-sm transition-colors">
                      <Plus size={16} />
                      Model Ekle
                    </button>

                  </div>

                  <div className="space-y-4">

                    {formData.models.map((model, index) => ( <div key={index} className="dark:bg-slate-950 border dark:border-slate-800 rounded-2xl p-6 space-y-4">

                      <div className="flex items-center justify-between">

                        <h4 className="font-semibold">Model {index + 1}</h4>

                        <button onClick={() => removeModel(index)} className="p-2 dark:bg-red-500/10 hover:dark:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>

                      </div>

                      <div className="grid md:grid-cols-3 gap-4">

                        <input type="text" placeholder="Model Adı (örn: Pro)" value={model.name} onChange={(e) => updateModel(index, 'name', e.target.value)} className="dark:bg-slate-900 border dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" />
                        <input type="number" placeholder="Fiyat" value={model.price} onChange={(e) => updateModel(index, 'price', e.target.value)} className="dark:bg-slate-900 border dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"/>
                        <input type="number" placeholder="Stok" value={model.stock} onChange={(e) => updateModel(index, 'stock', e.target.value)} className="dark:bg-slate-900 border dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"/>

                      </div>

                    </div> ))}

                  </div>

                </div>

              </div> )}

              {activeTab === 'media' && ( <div className="space-y-6">

                <div className="flex items-center gap-3 mb-6">

                  <div className="p-3 bg-pink-500/10 rounded-xl"><ImageIcon className="text-pink-400" size={24} /></div>

                  <div>

                    <h2 className="text-2xl font-bold">Ürün Görselleri</h2>
                    <p className="text-sm text-slate-400">Ürün fotoğraflarını yükleyin</p>

                  </div>

                </div>

                <div className="border-2 border-dashed border-slate-800 rounded-2xl p-12 text-center hover:border-blue-500/50 transition-colors">

                  <input type="file" id="image-upload" multiple accept="image/*" onChange={handleImageUpload} className="hidden"/>
                  <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-4">
                    <div className="p-6 bg-blue-500/10 rounded-2xl"><Upload size={48} className="text-blue-400" /></div>

                    <div>

                      <p className="text-lg font-semibold mb-2">Görsel Yükle</p>
                      <p className="text-sm text-slate-400">veya sürükle-bırak yapın (PNG, JPG, WEBP)</p>

                    </div>

                  </label>

                </div>

                {errors.images && ( <p className="text-red-400 text-sm flex items-center gap-2"><AlertCircle size={16} />{errors.images}</p> )}

                {formData.images.length > 0 && ( <div>

                  <div className="flex items-center justify-between mb-4">

                    <p className="text-sm dark:text-slate-400">{formData.images.length} görsel yüklendi</p>
                    <p className="text-xs dark:text-slate-500">İlk görsel ana görsel olarak kullanılacak</p>

                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                    {formData.images.map((image, index) => ( <div key={index} className="relative group aspect-square dark:bg-slate-950 border dark:border-slate-800 rounded-2xl overflow-hidden">

                      <img src={image.preview} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                      {index === 0 && ( <div className="absolute top-2 left-2 dark:bg-blue-600 px-2 py-1 rounded-lg text-xs font-bold">Ana Görsel</div> )}

                      <button onClick={() => removeImage(index)} className="absolute top-2 right-2 p-2 dark:bg-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={16} />
                      </button>

                    </div> ))}

                  </div>

                </div> )}

              </div> )}

              {activeTab === 'seo' && ( <div className="space-y-6">

                <div className="flex items-center gap-3 mb-6">

                  <div className="p-3 dark:bg-cyan-500/10 rounded-xl"><BarChart3 className="dark:text-cyan-400" size={24} /></div>

                  <div>

                    <h2 className="text-2xl font-bold">SEO Ayarları</h2>
                    <p className="text-sm dark:text-slate-400">Arama motoru optimizasyonu</p>

                  </div>

                </div>

                <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">

                  <Info className="text-blue-400 flex-shrink-0 mt-0.5" size={20} />

                  <div className="text-sm dark:text-slate-300">

                    <p className="font-semibold mb-1">SEO İpucu</p>
                    <p className="dark:text-slate-400">Başlık ve açıklama alanlarını boş bırakırsanız, ürün adı ve kısa açıklama otomatik kullanılır.</p>

                  </div>

                </div>

                <div className="space-y-2">

                  <label className="text-sm font-semibold dark:text-slate-400 flex items-center gap-2"><FileText size={14} />SEO Başlığı</label>
                  <input type="text" placeholder="Ürün için SEO başlığı" value={formData.seoTitle} onChange={(e) => handleChange('seoTitle', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"/>
                  <p className="text-xs dark:text-slate-500">{formData.seoTitle.length} / 60 karakter</p>

                </div>

                <div className="space-y-2">

                  <label className="text-sm font-semibold dark:text-slate-400 flex items-center gap-2"><FileText size={14} />SEO Açıklaması</label>
                  <textarea rows="4" placeholder="Ürün için SEO açıklaması" value={formData.seoDescription} onChange={(e) => handleChange('seoDescription', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors resize-none"/>
                  <p className="text-xs dark:text-slate-500">{formData.seoDescription.length} / 160 karakter</p>

                </div>

                <div className="space-y-2">

                  <label className="text-sm font-semibold dark:text-slate-400 flex items-center gap-2"><Tag size={14} />SEO Anahtar Kelimeler</label>
                  <input type="text" placeholder="akıllı led, panel, aydınlatma (virgülle ayırın)" value={formData.seoKeywords} onChange={(e) => handleChange('seoKeywords', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"/>

                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">

                  <h4 className="font-semibold mb-4 text-sm dark:text-slate-400">Arama Motoru Önizlemesi</h4>

                  <div className="space-y-2">

                    <h3 className="dark:text-blue-400 text-lg hover:underline cursor-pointer">{formData.seoTitle || formData.name || 'Ürün Başlığı'}</h3>
                    <p className="dark:text-green-600 text-sm">smarthome.com › urunler › {formData.sku || 'sku'}</p>
                    <p className="dark:text-slate-400 text-sm">{formData.seoDescription || formData.shortDescription || 'Ürün açıklaması burada görünecek...'}</p>

                  </div>

                </div>

              </div> )}

            </div>

          </div>

        </div>

        {previewMode && ( <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-slide-in">

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 w-full max-w-3xl">

            <div className="flex items-center gap-3 mb-6">

              <div className="p-3 bg-blue-500/10 rounded-xl"><Package className="text-blue-400" size={24} /></div>

              <div>

                <h2 className="text-2xl font-bold">Ürün Önizlemesi</h2>
                <p className="text-sm text-slate-400">Ürününüzün müşterilere nasıl görüneceğini kontrol edin</p>

              </div>

            </div>

            {/* Burada ürün önizleme bileşeni olacak */}
            <div className="border border-slate-800 rounded-xl p-6 text-center text-sm text-slate-500">
              Ürün önizleme bileşeni burada görünecek (geliştirme aşamasında)
            </div>

            <button onClick={() => setPreviewMode(false)} className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl transition-colors">
              Önizlemeyi Kapat
            </button>

          </div>

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

export default AdminAddProduct;