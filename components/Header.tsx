
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 mb-8 shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-none">BD Passport Photo Pro</h1>
            <p className="text-xs text-gray-500 mt-1">পাসপোর্ট সাইজ ফটো এডিটর (AI Powered)</p>
          </div>
        </div>
        <div className="hidden md:flex gap-4">
          <span className="text-sm bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-medium">40mm x 50mm Ready</span>
          <span className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">BG Remover</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
