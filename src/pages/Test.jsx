import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Redux slice'ınızdan gerekli action ve thunk'ları import ediyoruz
import { getProductBySlug, clearProduct } from "../redux/productSlice";

const ProductTest = () => {

  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedModel, setSelectedModel] = useState(0);
  const { product, loading, error } = useSelector((state) => state.products);

  useEffect(() => {

    if (slug) {

      dispatch(getProductBySlug(slug));
    }

    return () => {

      dispatch(clearProduct());
    };
  }, [slug, dispatch]);

  if (loading) {

    return (

      <div className="flex h-screen items-center justify-center bg-slate-950 text-xl font-semibold text-blue-500">
        Ürün bilgileri yükleniyor...
      </div>
    );
  }

  if (error) {

    return (

      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-slate-950 text-zinc-100">

        <p className="text-xl font-bold text-red-500">Hata Oluştu!</p>
        <p className="text-sm text-zinc-400">{error}</p>
        <button onClick={() => navigate(-1)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-blue-700" >
          Geri Dön
        </button>

      </div>
    );
  }

  if (!product || Object.keys(product).length === 0) {

    return (

      <div className="flex h-screen items-center justify-center bg-slate-950 text-xl font-semibold text-zinc-400">
        Aranan ürün bulunamadı.
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-slate-950 p-8 text-zinc-100">

      <div className="mx-auto max-w-4xl space-y-6">

        <div className="border-b border-slate-800 pb-4">

          <h1 className="text-3xl font-black text-white">{product?.name}</h1>
          <p className="text-sm text-zinc-400">Slug: <span className="text-blue-400">{slug}</span></p>

        </div>

        <div className="flex items-center gap-4">

          {product?.oldPrice && ( <del className="text-lg text-zinc-500">₺{product.oldPrice.toLocaleString()}</del> )}
          <span className="text-2xl font-bold text-green-500">₺{(product?.models?.[selectedModel]?.price ?? product?.price ?? 0).toLocaleString()}</span>

        </div>

        {product?.models && product.models.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-zinc-300">Model Seçiniz:</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {product.models.map((model, index) => {
                if (!model) return null; // Bozuk döküman koruması
                
                return (
                  <button
                    key={model?.name || index}
                    onClick={() => setSelectedModel(index)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedModel === index
                        ? "bg-blue-600 border-blue-600 text-white shadow-lg scale-[1.01]"
                        : "border-slate-800 bg-slate-900 hover:border-slate-700 text-zinc-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold">{model?.name || "İsimsiz Model"}</span>
                      <span className="font-semibold">₺{(model?.price ?? 0).toLocaleString()}</span>
                    </div>

                    {/* Model Özellikleri İç Döngüsü */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {model?.features?.map((feature, i) => (
                        <span
                          key={i}
                          className={`text-[10px] px-2 py-0.5 rounded-full ${
                            selectedModel === index
                              ? "bg-blue-500 text-white"
                              : "bg-slate-800 text-zinc-400"
                          }`}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Ürün Açıklaması */}
        {product?.description && (
          <div className="rounded-xl bg-slate-900 p-4 border border-slate-800">
            <h3 className="mb-2 font-bold text-zinc-300">Ürün Açıklaması</h3>
            <p className="text-sm leading-relaxed text-zinc-400">{product.description}</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductTest;