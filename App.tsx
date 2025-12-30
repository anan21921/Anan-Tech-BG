
import React, { useState } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import { EditorConfig, DressType } from './types';
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
      setError(err.message || 'Error processing image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `bd-passport-photo-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen pb-12">
      <Header />

      <main className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Controls - Left side on Large Screens */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              সেটিং পরিবর্তন করুন
            </h2>

            {/* BG Color Selection */}
            <div className="space-y-3 mb-6">
              <label className="text-sm font-semibold text-gray-700 block">ব্যাকগ্রাউন্ড কালার</label>
              <div className="flex flex-wrap gap-2">
                {PRESET_BG_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setConfig({ ...config, bgColor: color.value })}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${config.bgColor === color.value ? 'border-emerald-600 scale-110 shadow-md' : 'border-gray-200'}`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
                <input 
                  type="color" 
                  value={config.bgColor} 
                  onChange={(e) => setConfig({ ...config, bgColor: e.target.value })}
                  className="w-10 h-10 rounded-full cursor-pointer bg-transparent"
                />
              </div>
            </div>

            {/* Dress Selection */}
            <div className="space-y-3 mb-6">
              <label className="text-sm font-semibold text-gray-700 block">পোশাক পরিবর্তন</label>
              <div className="grid grid-cols-2 gap-2">
                {DRESS_OPTIONS.map((dress) => (
                  <button
                    key={dress}
                    onClick={() => setConfig({ ...config, dressType: dress })}
                    className={`px-3 py-2 text-sm rounded-lg border font-medium transition-all ${config.dressType === dress ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                  >
                    {dress === 'No Change' ? 'অরিজিনাল' : dress}
                  </button>
                ))}
              </div>
            </div>

            {/* Face Enhancement Toggles */}
            <div className="space-y-4 mb-8">
              <label className="text-sm font-semibold text-gray-700 block">ফেস এনহ্যান্সমেন্ট</label>
              
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm text-gray-600">ফেস ক্লিয়ারিং</span>
                <input 
                  type="checkbox" 
                  checked={config.enhanceFace} 
                  onChange={(e) => setConfig({ ...config, enhanceFace: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm text-gray-600">স্কিন স্মুদিং</span>
                <input 
                  type="checkbox" 
                  checked={config.smoothSkin} 
                  onChange={(e) => setConfig({ ...config, smoothSkin: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
              </label>

              <div className="pt-2">
                <span className="text-sm text-gray-600 block mb-2">লাইটিং কোয়ালিটি</span>
                <select 
                  value={config.lightingAdjustment}
                  onChange={(e) => setConfig({ ...config, lightingAdjustment: e.target.value as any })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="Normal">নরমাল</option>
                  <option value="Bright">ব্রাইট</option>
                  <option value="Studio">স্টুডিও লাইটিং</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!originalImage || isProcessing}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${!originalImage || isProcessing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'}`}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  তৈরী হচ্ছে...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 11 4-7"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/><path d="m9 11 1 9"/><path d="m15 11-1 9"/></svg>
                  ফটো তৈরী করুন
                </>
              )}
            </button>

            {error && (
              <p className="mt-4 text-xs text-red-500 text-center bg-red-50 p-2 rounded border border-red-100">{error}</p>
            )}
          </section>
        </div>

        {/* Workspace - Right side */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Top Row: Original and Result */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Input View */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider px-2">অরিজিনাল ছবি</h3>
              <ImageUploader 
                onImageSelect={handleImageSelect} 
                currentImage={originalImage} 
              />
            </div>

            {/* Output View */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider px-2">ফলাফল</h3>
              <div className="relative aspect-[40/50] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center shadow-inner group">
                {isProcessing ? (
                  <div className="flex flex-col items-center gap-4 text-emerald-600">
                    <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium animate-pulse">AI কাজ করছে...</p>
                  </div>
                ) : processedImage ? (
                  <>
                    <img 
                      src={processedImage} 
                      alt="Processed Result" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={downloadImage}
                        className="w-full bg-white text-gray-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 active:scale-95 transition-transform"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                        ডাউনলোড এইচডি
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-8">
                    <div className="bg-gray-200/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 13V2"/><path d="m4 6 8-4 8 4"/><path d="m4 12 8-4 8 4"/><path d="m4 18 8-4 8 4"/><path d="M12 22v-9"/></svg>
                    </div>
                    <p className="text-gray-400 text-sm italic">
                      ছবি আপলোড করে 'ফটো তৈরী করুন' বাটনে ক্লিক করুন
                    </p>
                  </div>
                )}
              </div>

              {processedImage && !isProcessing && (
                <div className="hidden md:block">
                   <button 
                    onClick={downloadImage}
                    className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 active:scale-95 transition-all shadow-md mt-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                    ডাউনলোড করুন
                  </button>
                  <p className="text-[10px] text-gray-400 text-center mt-2 uppercase tracking-widest font-semibold">Standard 40x50mm Resolution</p>
                </div>
              )}
            </div>
          </div>

          {/* Help/Info Panel */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
            <h4 className="text-emerald-800 font-bold mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              টিপস (Tips)
            </h4>
            <ul className="text-sm text-emerald-700/80 space-y-2 list-disc pl-5">
              <li>সবচেয়ে ভালো রেজাল্টের জন্য সরাসরি ক্যামেরার দিকে তাকিয়ে থাকা ছবি ব্যবহার করুন।</li>
              <li>ছবির ব্যাকগ্রাউন্ডে খুব বেশি ডিটেইল না থাকলে AI নিখুঁতভাবে কাজ করতে পারে।</li>
              <li>ড্রেস পরিবর্তন অপশনটি শুধুমাত্র সামনের দিকে মুখ করা ছবির ক্ষেত্রে ভালো কাজ করে।</li>
              <li>প্রসেসিং শেষ হতে ১০-২০ সেকেন্ড সময় লাগতে পারে।</li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="mt-12 text-center text-gray-500 text-sm border-t pt-8 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          <p className="mb-3">© {new Date().getFullYear()} BD Passport Photo Pro. Created with Advanced Gemini AI.</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 text-gray-400 text-xs">
            <p>Design: <span className="font-semibold text-gray-600">Anan Technology</span></p>
            <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
            <p>Developer: <span className="font-semibold text-gray-600">Ayan Khan Shuvro</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
