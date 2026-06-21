import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { removeFromFavorites, clearFavorites } from "../../redux/favoriteSlice";

import { Heart, ShoppingCart, Trash2, ArrowRight, Star, PackageX, Sparkles } from "lucide-react";

const FavoritesPage = () => {

  const dispatch = useDispatch();

  const favorites = useSelector((state) => state.favorites.items);

  const handleRemove = (id) => {

    dispatch(removeFromFavorites(id));
  };

  const handleClearAll = () => {

    dispatch(clearFavorites());
  };

  return (

    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white transition-colors duration-300 pt-28 pb-16 px-6 relative overflow-hidden">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        <div className="absolute w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -top-20 -right-20" />
        <div className="absolute w-96 h-96 bg-purple-600/10 rounded-full blur-3xl bottom-10 -left-20" />

      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-gray-200 dark:border-slate-800 pb-6">

          <div>

            <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-500 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/20 mb-3"><Heart size={12} fill="currentColor" /> Kişisel Listeniz</div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Favorilerim</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Beğendiğiniz ve takip ettiğiniz tüm akıllı teknolojiler bir arada.</p>

          </div>

          <div className="flex items-center gap-4">

            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Toplam{" "}
              <span className="text-blue-500 font-bold">{favorites.length}</span>{" "}
              ürün listenizde
            </span>

            {favorites.length > 0 && ( <button onClick={handleClearAll} className="text-xs text-red-400 hover:text-red-500 border border-red-400/30 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors">Tümünü Temizle</button> )}

          </div>

        </div>

        {favorites.length === 0 ? ( <div className="text-center py-20 bg-white/60 dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800/60 rounded-[2.5rem] backdrop-blur-sm max-w-2xl mx-auto space-y-6">

          <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800/80 rounded-2xl flex items-center justify-center mx-auto text-slate-400 dark:text-slate-500"><Heart size={36} /></div>

          <div className="space-y-2">

            <h3 className="text-xl font-bold">Listeniz Henüz Boş</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">Ürünleri incelerken kalp ikonuna tıklayarak favorilerinize ekleyebilirsiniz.</p>

          </div>

          <Link to="/products" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:scale-105 text-sm">
            Ürünleri Keşfet <ArrowRight size={16} />
          </Link>

        </div> ) : ( <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {favorites.map((product) => ( <div key={product._id} className="group bg-white dark:bg-slate-900/60 backdrop-blur-sm border border-gray-200 dark:border-slate-800/80 hover:border-blue-500/40 p-4 rounded-3xl transition-all duration-300 flex flex-col justify-between hover:shadow-xl dark:hover:shadow-blue-950/20 relative">

            {product.oldPrice && product.oldPrice > product.price && ( <span className="absolute top-6 left-6 z-20 bg-red-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-xl shadow-md">%{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)} İndirim</span> )}

            <button onClick={() => handleRemove(product._id)} className="absolute top-6 right-6 z-20 bg-white/80 dark:bg-slate-900/80 text-gray-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 p-2.5 rounded-xl border border-gray-100 dark:border-slate-800 backdrop-blur-sm transition-colors shadow-sm" title="Favorilerden Kaldır">
              <Trash2 size={16} />
            </button>

            <Link to={`/product/${product.slug}`}>

              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800 mb-4">

                <img src={product.images?.[0]?.file || product.images?.[0]?.preview || product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>

              </div>

            </Link>

            <div className="space-y-2 flex-grow flex flex-col justify-between">

              <div>

                <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">{product.category}</span>

                <Link to={`/product/${product.slug}`}>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">{product.name}</h3>
                </Link>

                <div className="flex items-center gap-1 mt-1">

                  <Star size={14} fill="currentColor" className="text-yellow-500" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{product.ratingsAverage?.toFixed(1) || "0.0"}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">({product.ratingsQuantity || 0})</span>

                </div>

              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 dark:border-slate-800/60 flex items-center justify-between gap-2">

                <div className="flex flex-col">

                  {product.oldPrice && ( <span className="text-xs text-slate-400 line-through font-medium">₺{product.oldPrice.toLocaleString()}</span> )}
                  <span className="text-xl font-black text-slate-900 dark:text-white">₺{product.price.toLocaleString()}</span>

                </div>

                {product.stock > 0 ? ( <button className="bg-slate-900 hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-600 text-white p-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group/btn shadow-md hover:scale-105">

                  <ShoppingCart size={16} className="group-hover/btn:rotate-6 transition-transform" />
                  <span className="text-xs hidden sm:inline">Sepete Ekle</span>

                </button> ) : ( <span className="flex items-center gap-1 text-xs text-red-400 font-semibold px-3 py-2 bg-red-500/10 rounded-xl"><PackageX size={14} /> Tükendi</span> )}

              </div>

            </div>

          </div> ))}

        </div> )}

      </div>

    </div>
  );
};

export default FavoritesPage;