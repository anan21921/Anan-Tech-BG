
import React, { useState } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import { EditorConfig } from './types';
import { DRESS_OPTIONS, PRESET_BG_COLORS } from './constants';
import { processPassportPhoto } from './services/geminiService';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [config, setConfig] = useState<EditorConfig>({
    bgColor: '#FFFFFF',
    dressType: 'No Change',
    enhanceFace: true,
    smoothSkin: true,
    lightingAdjustment: 'Studio',
  });

  const handleImageSelect = (file: File, base64: string) => {
    setOriginalImage(base64);
    setImageMimeType(file.type);
    setProcessedImage(null);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!originalImage) return;
    setIsProcessing(true);
    setError(null);
    try {
      const result = await processPassportPhoto(originalImage, imageMimeType, config);
      setProcessedImage(result);
    } catch (err: any) {
      setError("প্রসেসিং ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `Passport_Photo_${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-grow max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Side */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
              এডিটর সেটিংস
            </h2>

            {/* BG Color */}
            <div className="mb-6">
              <label className="text-sm font-bold text-slate-600 mb-3 block">ব্যাকগ্রাউন্ড কালার</label>
              <div className="flex flex-wrap gap-2 items-center">
                {PRESET_BG_COLORS.map(c => (
                  <button 
                    key={c.value}
                    onClick={() => setConfig({...config, bgColor: c.value})}
                    className={`w-9 h-9 rounded-full border-2 transition-all ${config.bgColor === c.value ? 'border-emerald-500 scale-110 shadow-md' : 'border-slate-100'}`}
                    style={{ backgroundColor: c.value }}
                  />
                ))}
                <input 
                  type="color" 
                  value={config.bgColor}
                  onChange={(e) => setConfig({...config, bgColor: e.target.value})}
                  className="w-9 h-9 p-0 border-none rounded-full cursor-pointer overflow-hidden"
                />
              </div>
            </div>

            {/* Dress Selection */}
            <div className="mb-6">
              <label className="text-sm font-bold text-slate-600 mb-3 block">পোশাক পরিবর্তন</label>
              <div className="grid grid-cols-2 gap-2">
                {DRESS_OPTIONS.map(d => (
                  <button
                    key={d}
                    onClick={() => setConfig({...config, dressType: d})}
                    className={`text-xs py-2 px-3 rounded-xl border transition-all ${config.dressType === d ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
                  >
                    {d === 'No Change' ? 'অরিজিনাল' : d}
                  </button>
                ))}
              </div>
            </div>

            {/* Enhancements */}
            <div className="space-y-4 mb-8">
              <label className="text-sm font-bold text-slate-600 block">ফেস এনহ্যান্সমেন্ট</label>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                <span className="text-sm text-slate-600">স্মুথ এবং ক্লিয়ার ফেস</span>
                <input 
                  type="checkbox" 
                  checked={config.enhanceFace}
                  onChange={e => setConfig({...config, enhanceFace: e.target.checked})}
                  className="w-5 h-5 accent-emerald-600"
                />
              </div>
              <select 
                value={config.lightingAdjustment}
                onChange={e => setConfig({...config, lightingAdjustment: e.target.value as any})}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 ring-emerald-500/20"
              >
                <option value="Normal">নরমাল লাইট</option>
                <option value="Studio">স্টুডিও লাইটিং</option>
                <option value="Bright">ব্রাইট এক্সপোজার</option>
                <option value="Auto-Fix">অটো ফিক্স</option>
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!originalImage || isProcessing}
              className={`w-full py-4 rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/20 transition-all ${!originalImage || isProcessing ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'}`}
            >
              {isProcessing ? "AI কাজ করছে..." : "ফটো তৈরী করুন"}
            </button>
            {error && <p className="text-red-500 text-xs text-center mt-3">{error}</p>}
          </div>
        </div>

        {/* Viewport Side */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">অরিজিনাল ছবি</h3>
              <ImageUploader onImageSelect={handleImageSelect} currentImage={originalImage} />
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">ফলাফল</h3>
              <div className="aspect-[4/5] bg-white rounded-3xl shadow-sm border border-slate-200 flex items-center justify-center overflow-hidden relative group">
                {isProcessing ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-emerald-600 font-bold text-sm animate-pulse">প্রসেস হচ্ছে...</p>
                  </div>
                ) : processedImage ? (
                  <>
                    <img src={processedImage} alt="Result" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-8">
                       <button onClick={downloadImage} className="bg-white text-slate-900 w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform">
                        ডাউনলোড করুন
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-slate-300">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <p className="text-sm">কোনো ছবি তৈরী হয়নি</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tips and Info */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <h4 className="font-bold text-slate-800">পাসপোর্ট ফটোর নিয়মাবলী</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                বাংলাদেশের পাসপোর্টের জন্য সাধারণত সাদা বা হালকা নীল ব্যাকগ্রাউন্ড প্রয়োজন হয়। AI আপনার ড্রেস এবং ফেস অটো-অ্যাডজাস্ট করে দিবে। সেরা রেজাল্টের জন্য উজ্জ্বল আলোতে তোলা ছবি ব্যবহার করুন।
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center text-center">
          <p className="text-slate-400 text-sm mb-6">© {new Date().getFullYear()} BD Passport Photo Pro • Powered by Gemini AI</p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-12 items-center">
            <div className="group">
              <p className="text-[10px] text-slate-300 uppercase tracking-widest font-bold mb-1">Design Agency</p>
              <p className="text-slate-800 font-bold group-hover:text-emerald-600 transition-colors">Anan Technology</p>
            </div>
            <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>
            <div className="group">
              <p className="text-[10px] text-slate-300 uppercase tracking-widest font-bold mb-1">Lead Developer</p>
              <p className="text-slate-800 font-bold group-hover:text-emerald-600 transition-colors">Ayan Khan Shuvro</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
