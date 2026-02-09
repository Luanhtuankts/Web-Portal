import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
// Thêm thư viện PayPal
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { 
  CreditCard, Copy, Download, LogOut, Loader2, Zap, 
  Box, User, CheckCircle2, X, Star, PlayCircle, 
  Facebook, MessageCircle, Globe, Plus, Menu, ArrowRight
} from 'lucide-react';

// --- CẤU HÌNH STYLE ---
const PRIMARY_COLOR = "#0063A3";
const BG_COLOR = "#fdfbf7"; // Màu trắng ngà / giấy cũ

// --- TỪ ĐIỂN NGÔN NGỮ (TRANSLATIONS) ---
const TRANSLATIONS = {
  VN: {
    login: "Đăng nhập",
    logout: "Đăng xuất",
    credits: "Credits",
    licenseKey: "License Key",
    copyKey: "Sao chép Key",
    copyKeyBtn: "Copy Key Ngay",
    buyCredits: "Mua thêm Credits",
    heroTitle: "Xin chào, Kiến trúc sư!",
    heroSubtitle: "Bạn là nhà thiết kế - hãy để AI dựng hình cho bạn.",
    download: "Tải Plugin",
    guide: "Hướng dẫn",
    backHome: "Quay lại Trang chủ",
    showcase1Title: "\"Vẽ một cái bàn 1mx2m...\"",
    showcase1Desc: "Chỉ cần nhập lệnh, OpenSKP sẽ tự động tạo mô hình 3D chi tiết ngay trong SketchUp. Không cần dựng hình thủ công tốn thời gian.",
    showcase2Title: "Tùy chỉnh không giới hạn",
    showcase2Desc: "Thay đổi vật liệu, kích thước và kiểu dáng chỉ với vài cú click chuột. Công cụ hỗ trợ đắc lực cho việc lên concept nhanh chóng.",
    footerRights: "© 2024 OpenSkp. Bảo lưu mọi quyền.",
    footerTerms: "Điều khoản sử dụng",
    footerPrivacy: "Chính sách bảo mật",
    footerContact: "Liên hệ",
    // Payment
    paymentTitle: "Nạp Credits & Mua Key",
    paymentVND: "🇻🇳 VNĐ (QR)",
    paymentUSD: "🌏 USD (PayPal)",
    paymentTotal: "Tổng thanh toán:",
    paymentScan: "Quét mã để thanh toán tự động",
    paymentSuccess: "Thanh toán thành công!",
    paymentSuccessMsg: "Vui lòng gửi mã này cho Admin qua Zalo/Facebook.",
    paymentCardDesc: "Thẻ Tín dụng / Ghi nợ",
    // Guide
    guideBreadcrumb: "Hướng dẫn sử dụng",
    guideToc: "Mục lục",
    guideItem1: "1. Cài đặt & License",
    guideItem2: "2. Lệnh cơ bản",
    guideItem3: "3. Mẹo Prompt",
    guideItem4: "4. Khắc phục lỗi",
    guideTitle: "Biên tập mẫu: Hướng dẫn cài đặt",
    guideNote: "Lưu ý quan trọng:",
    guideNoteText: "Vui lòng tắt hoàn toàn SketchUp trước khi thực hiện cài đặt.",
    guideStep1: "Bước 1: Tải về và Giải nén",
    guideStep1Text: "Nhấn vào nút",
    guideStep1Text2: "ở trên. Sau khi tải về file .zip, hãy giải nén ra thư mục máy tính.",
    guideStep2: "Bước 2: Copy vào thư mục Plugin",
    guideStep2Text: "Copy toàn bộ file trong thư mục vừa giải nén vào đường dẫn sau:",
    guideStep3: "Bước 3: Kích hoạt License",
    guideStep3Text: "Mở SketchUp lên, bạn sẽ thấy thanh công cụ OpenSKP. Bấm vào icon Robot, một bảng nhập key sẽ hiện ra.",
    guideYourKey: "License Key của bạn:",
    loginToView: "Vui lòng đăng nhập..."
  },
  EN: {
    login: "Login",
    logout: "Logout",
    credits: "Credits",
    licenseKey: "License Key",
    copyKey: "Copy Key",
    copyKeyBtn: "Copy Key Now",
    buyCredits: "Buy Credits",
    heroTitle: "Hello, Architect!",
    heroSubtitle: "You are the designer - let AI do the modeling for you.",
    download: "Download Plugin",
    guide: "Guide",
    backHome: "Back to Home",
    showcase1Title: "\"Draw a 1mx2m table...\"",
    showcase1Desc: "Just enter a prompt, OpenSKP automatically creates detailed 3D models right inside SketchUp. No need for time-consuming manual modeling.",
    showcase2Title: "Unlimited Customization",
    showcase2Desc: "Change materials, dimensions, and styles with just a few clicks. A powerful tool for quick concept development.",
    footerRights: "© 2024 OpenSkp. All rights reserved.",
    footerTerms: "Terms of Use",
    footerPrivacy: "Privacy Policy",
    footerContact: "Contact",
    // Payment
    paymentTitle: "Topup Credits & Buy Key",
    paymentVND: "🇻🇳 VND (QR)",
    paymentUSD: "🌏 USD (PayPal)",
    paymentTotal: "Total payment:",
    paymentScan: "Scan QR to pay automatically",
    paymentSuccess: "Payment Successful!",
    paymentSuccessMsg: "Please send this code to Admin via Zalo/Facebook.",
    paymentCardDesc: "Debit or Credit Card",
    // Guide
    guideBreadcrumb: "User Guide",
    guideToc: "Table of Contents",
    guideItem1: "1. Install & License",
    guideItem2: "2. Basic Commands",
    guideItem3: "3. Prompt Tips",
    guideItem4: "4. Troubleshooting",
    guideTitle: "Sample Editor: Installation Guide",
    guideNote: "Important Note:",
    guideNoteText: "Please completely close SketchUp before installing.",
    guideStep1: "Step 1: Download and Extract",
    guideStep1Text: "Click the",
    guideStep1Text2: "button above. After downloading the .zip file, extract it to a folder on your computer.",
    guideStep2: "Step 2: Copy to Plugin folder",
    guideStep2Text: "Copy all files in the extracted folder to the following path:",
    guideStep3: "Step 3: Activate License",
    guideStep3Text: "Open SketchUp, you will see the OpenSKP toolbar. Click the Robot icon, a key entry panel will appear.",
    guideYourKey: "Your License Key:",
    loginToView: "Please login..."
  }
};

// --- CẤU HÌNH MOCK DATA (DÙNG CHO PREVIEW) ---
const MOCK_SESSION = {
  user: { email: 'architect@openskp.com', id: 'mock-user-id' }
};
const MOCK_PROFILE = {
  credits: 1250,
  license_key: 'OSKP-8822-1133-PRO',
  is_active: true,
  hardware_id: 'HW-8822-1133'
};

// --- CẤU HÌNH LIÊN HỆ ---
const ZALO_LINK = "https://zalo.me/0965585879"; 
const FACEBOOK_LINK = "https://web.facebook.com/tuan.936796/"; 
const DRIVE_DOWNLOAD_LINK = "https://drive.google.com/file/d/1TOwlNNs3L5C9hCiV-LX4dcpLG4y3HzPo/view?usp=sharing"; 

// --- CẤU HÌNH NGÂN HÀNG ---
const BANK_ID = "MB"; 
const BANK_ACCOUNT = "0965585879"; 
const ACCOUNT_NAME = "OPEN SKP"; 

const PACKAGES_VND = [
  { id: 1, price: 50000, credits: 100, label: "Cơ bản", popular: false, currency: 'VND' },
  { id: 2, price: 100000, credits: 250, label: "Phổ biến", popular: true, currency: 'VND' },
  { id: 3, price: 200000, credits: 550, label: "Nâng cao", popular: false, currency: 'VND' },
  { id: 4, price: 500000, credits: 1500, label: "Siêu hời", popular: false, currency: 'VND' },
];

const PACKAGES_USD = [
  { id: 'usd_1', price: 2, credits: 100, label: "Basic", popular: false, currency: 'USD' },
  { id: 'usd_2', price: 4, credits: 250, label: "Popular", popular: true, currency: 'USD' },
  { id: 'usd_3', price: 8, credits: 550, label: "Advanced", popular: false, currency: 'USD' },
  { id: 'usd_4', price: 20, credits: 1500, label: "Pro", popular: false, currency: 'USD' },
];

export default function App() {
  // --- STATE ---
  const [session, setSession] = useState(MOCK_SESSION); // Mặc định đã login cho preview
  const [profile, setProfile] = useState(MOCK_PROFILE);
  const [loading, setLoading] = useState(false);
  
  // State UI
  const [viewMode, setViewMode] = useState('home'); // 'home' hoặc 'guide'
  const [language, setLanguage] = useState('VN'); // 'VN' hoặc 'EN'
  const [copySuccess, setCopySuccess] = useState(false);
  const [keyCopySuccess, setKeyCopySuccess] = useState(false);
  
  // Lấy text theo ngôn ngữ hiện tại
  const t = TRANSLATIONS[language];

  // State Thanh toán
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('VND');
  const [selectedPkg, setSelectedPkg] = useState(PACKAGES_VND[0]); 
  const [paypalSuccess, setPaypalSuccess] = useState(null);

  // --- LOGIC GIẢ LẬP ---
  const handleLoginGoogle = () => {
    setLoading(true);
    setTimeout(() => {
        setSession(MOCK_SESSION);
        setProfile(MOCK_PROFILE);
        setLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setSession(null);
    setProfile(null);
    setViewMode('home');
  };

  const handleDownload = () => {
    window.open(DRIVE_DOWNLOAD_LINK, '_blank');
  };

  const handleTopup = () => {
    if (!session) {
        alert("Vui lòng đăng nhập để mua Credits");
        return;
    }
    setShowPayment(true);
    setPaymentMethod('VND');
    setSelectedPkg(PACKAGES_VND[0]);
    setPaypalSuccess(null);
  };

  const handleSwitchMethod = (method) => {
    setPaymentMethod(method);
    setPaypalSuccess(null);
    setSelectedPkg(method === 'VND' ? PACKAGES_VND[0] : PACKAGES_USD[0]);
  };

  const handleMockPayPalPayment = () => {
      const mockOrderId = "PAYPAL-MOCK-" + Math.random().toString(36).substr(2, 9).toUpperCase();
      setPaypalSuccess(mockOrderId);
  };

  const getVietQRUrl = () => {
    if (!profile || !selectedPkg) return "";
    const key = profile.license_key || 'UNKNOWN';
    const DESCRIPTION = `OSKP ${key}`; 
    return `https://img.vietqr.io/image/${BANK_ID}-${BANK_ACCOUNT}-compact2.png?amount=${selectedPkg.price}&addInfo=${encodeURIComponent(DESCRIPTION)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;
  };

  const copyToClipboard = async (text, isKey = false) => {
    if (text) {
      try {
        await navigator.clipboard.writeText(text);
        if (isKey) {
            setKeyCopySuccess(true);
            setTimeout(() => setKeyCopySuccess(false), 2000);
        } else {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  const toggleLanguage = () => {
      setLanguage(prev => prev === 'VN' ? 'EN' : 'VN');
  }

  // --- UI COMPONENTS ---

  const LogoSVG = () => (
    <svg className="w-10 h-10" viewBox="0 0 24 24" style={{ color: PRIMARY_COLOR }}>
        <path d='M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-4 5h8c2.76 0 5 2.24 5 5v4c0 2.76-2.24 5-5 5H8c-2.76 0-5-2.24-5-5v-4c0-2.76 2.24-5 5-5zm1 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z' fill='currentColor'/>
        <path d='M5 23 Q 12 18, 19 23 H 5 z' fill='currentColor'/>
    </svg>
  );

  const BackgroundDecorations = () => (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none h-full w-full">
         {/* Họa tiết 1: Robot/Sketch ở góc phải, giữa trang */}
         {/* Đã bỏ 'grayscale', tăng kích thước lên w-[45%] */}
         <img
            src="Sketch2.png"
            className="absolute top-[55%] -right-[5%] w-[45%] opacity-[0.15] rotate-[0deg]"
            alt="Decoration"
         />
         

         {/* Họa tiết 3: Thước/Dụng cụ ở góc trái trên */}
         {/* Đã bỏ 'grayscale', tăng kích thước lên w-[30%] */}
         <img
            src="Sketch1.png"
            className="absolute top-[25%] -left-[0%] w-[50%] opacity-[0.15] rotate-[-12deg] mix-blend-multiply"
            alt="Decoration"
            onError={(e) => e.target.style.display = 'none'}
         />

         {/* Họa tiết 4: Dụng cụ vẽ ở góc phải dưới */}
         {/* Đã bỏ 'grayscale', tăng kích thước lên w-[30%] */}
         <img
            src="Sketch2.png"
            className="absolute top-[85%] -right-[5%] w-[30%] opacity-[0.04] rotate-[45deg] mix-blend-multiply"
            alt="Decoration"
            onError={(e) => e.target.style.display = 'none'}
         />
    </div>
  );

  const Navbar = () => (
    <nav className="border-b border-gray-200 sticky top-0 z-50 bg-[#fdfbf7]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setViewMode('home')}>
                <div className="group-hover:scale-110 transition-transform duration-300">
                    <LogoSVG />
                </div>
                <span className="font-serif font-normal text-2xl tracking-tight mt-1" style={{ color: PRIMARY_COLOR }}>OpenSkp</span>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3 sm:gap-4">
                
                {session && (
                    <div className="flex items-center gap-3 bg-white/50 p-1.5 rounded-xl border border-slate-200/60 shadow-sm">
                        {/* Credits & Topup */}
                        <div className="flex items-center gap-2 pl-2">
                            <div className="text-right hidden sm:block">
                                <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider leading-none mb-0.5">{t.credits}</div>
                                <div className="text-base font-bold leading-none" style={{ color: PRIMARY_COLOR }}>
                                    {profile?.credits?.toLocaleString() || 0}
                                </div>
                            </div>
                            <button 
                                onClick={handleTopup}
                                className="w-7 h-7 rounded-full flex items-center justify-center text-white shadow hover:scale-105 transition"
                                style={{ backgroundColor: PRIMARY_COLOR }}
                                title={t.buyCredits}
                            >
                                <Plus size={16} strokeWidth={3} />
                            </button>
                        </div>

                        {/* License Key */}
                        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-100/80 rounded-lg border border-slate-200">
                             <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-slate-400 uppercase leading-none">{t.licenseKey}</span>
                                <code className="text-xs font-mono font-bold text-slate-700 leading-tight">{profile?.license_key}</code>
                             </div>
                             <button 
                                onClick={() => copyToClipboard(profile?.license_key, true)} 
                                className="text-slate-400 hover:text-blue-600 transition p-1 hover:bg-white rounded-md"
                                title={t.copyKey}
                             >
                                {keyCopySuccess ? <CheckCircle2 size={14} className="text-green-600"/> : <Copy size={14} />}
                             </button>
                        </div>
                    </div>
                )}

                {/* User Info */}
                {session ? (
                    <div className="flex items-center gap-2 ml-1">
                        <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 ring-2 ring-white shadow-sm" title={session.user.email}>
                            <User size={20} />
                        </div>
                        <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition p-1" title={t.logout}>
                            <LogOut size={20} />
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={handleLoginGoogle}
                        className="px-4 py-2 rounded-lg text-white font-medium text-sm shadow-md hover:opacity-90 transition flex items-center gap-2"
                        style={{ backgroundColor: PRIMARY_COLOR }}
                    >
                         <User size={16} /> <span className="hidden sm:inline">{t.login}</span>
                    </button>
                )}

                {/* Language Switch */}
                <button onClick={toggleLanguage} className="flex items-center gap-1 text-slate-500 font-bold text-xs hover:text-slate-900 border border-slate-200 px-2 py-1 rounded-md bg-white">
                    <Globe size={14} />
                    <span>{language}</span>
                </button>
            </div>
        </div>
    </nav>
  );

  const HeroSection = () => (
    <div className="flex flex-col items-center text-center mt-6 animate-fade-in px-4">
        {/* Robot Image (PNG) - Chờm xuống chữ */}
        {/* Note: Sử dụng margin-bottom âm (-mb-10) và z-index (z-10) để tạo hiệu ứng đè lên chữ */}
        <div className="relative z-0 -mb-10 pointer-events-none select-none">
             <img 
                src="/robot-drawing.png" 
                alt="Robot Architect" 
                className="w-60 sm:w-[24rem] h-auto object-contain"
                // Sử dụng ảnh placeholder nếu không tìm thấy file local
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/300x300/fdfbf7/0063A3?text=Robot+PNG";
                }}
            />
        </div>

        {/* Tagline Container - Có z-index thấp hơn hoặc bằng để bị ảnh đè lên phần trên */}
        <div className="relative z-10 pt-4">
            <h1 className="text-3xl sm:text-5xl font-serif font-normal mb-4 max-w-3xl leading-tight" style={{ color: PRIMARY_COLOR }}>
                {t.heroTitle} <br/>
                <span className="text-lg sm:text-2xl font-serif font-normal mt-2 block" style={{ color: PRIMARY_COLOR }}>
                    {t.heroSubtitle}
                </span>
            </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6 mb-12 relative z-20">
            <button 
                onClick={handleDownload}
                className="px-8 py-3 rounded-xl text-white font-bold text-lg shadow-lg hover:translate-y-[-2px] transition flex items-center justify-center gap-2"
                style={{ backgroundColor: PRIMARY_COLOR }}
            >
                <Download size={20} /> {t.download}
            </button>
            <button 
                onClick={() => setViewMode(viewMode === 'home' ? 'guide' : 'home')}
                className={`px-8 py-3 rounded-xl border-2 font-bold text-lg transition flex items-center justify-center gap-2
                    ${viewMode === 'guide' 
                        ? 'bg-slate-100 border-slate-300 text-slate-800 shadow-inner' 
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50'}`}
            >
                <PlayCircle size={20} /> {viewMode === 'guide' ? t.backHome : t.guide}
            </button>
        </div>
    </div>
  );

  const ShowcaseContent = () => (
    <div className="max-w-7xl mx-auto space-y-24 animate-slide-up pb-20 px-4">
        {/* Block 1 */}
        <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 space-y-4 text-center md:text-left">
                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold uppercase tracking-wider">Prompt to 3D</div>
                <h3 className="text-2xl font-normal font-serif" style={{ color: PRIMARY_COLOR }}>{t.showcase1Title}</h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                    {t.showcase1Desc}
                </p>
            </div>
            <div className="flex-[1.5] w-full">
                <div className="aspect-video bg-white border-2 border-slate-200 rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] p-2 overflow-hidden transform rotate-1 hover:rotate-0 transition duration-500">
                    <img 
                        src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHd4eGl5dnNya3RudnJjOXluOHBteGlqYnliemxzMTBzMzkxNGQxbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dJX6ig7de21xe/giphy.gif"
                        alt="AI Generating Architecture" 
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/600x400/e2e8f0/0063A3?text=AI+Generating+GIF...";
                        }}
                    />
                </div>
            </div>
        </div>

        {/* Block 2 */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-10">
            <div className="flex-1 space-y-4 text-center md:text-left">
                    <div className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase tracking-wider">Smart Edit</div>
                <h3 className="text-2xl font-normal font-serif" style={{ color: PRIMARY_COLOR }}>{t.showcase2Title}</h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                    {t.showcase2Desc}
                </p>
            </div>
            <div className="flex-[1.5] w-full">
                <div className="aspect-video bg-white border-2 border-slate-200 rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] p-2 overflow-hidden transform -rotate-1 hover:rotate-0 transition duration-500">
                    <img 
                        src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHd4eGl5dnNya3RudnJjOXluOHBteGlqYnliemxzMTBzMzkxNGQxbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dJX6ig7de21xe/giphy.gif"
                        alt="Plugin Interface Animation" 
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/600x400/e2e8f0/0063A3?text=Plugin+Interface+GIF...";
                        }}
                    />
                </div>
            </div>
        </div>
    </div>
  );

  const GuideContent = () => (
    <div className="max-w-6xl mx-auto mb-20 animate-fade-in min-h-[50vh] px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1 hidden md:block">
                <div className="sticky top-24 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-5 shadow-sm">
                    <h4 className="font-normal text-slate-900 mb-4 flex items-center gap-2 font-serif" style={{ color: PRIMARY_COLOR }}><Menu size={16}/> {t.guideToc}</h4>
                    <ul className="space-y-1 text-sm">
                        <li className="font-bold text-blue-700 bg-blue-50 rounded-lg p-2 flex items-center gap-2"><ArrowRight size={12}/> {t.guideItem1}</li>
                        <li className="text-slate-600 cursor-pointer p-2 hover:bg-slate-50 rounded-lg hover:text-slate-900 transition">{t.guideItem2}</li>
                        <li className="text-slate-600 cursor-pointer p-2 hover:bg-slate-50 rounded-lg hover:text-slate-900 transition">{t.guideItem3}</li>
                        <li className="text-slate-600 cursor-pointer p-2 hover:bg-slate-50 rounded-lg hover:text-slate-900 transition">{t.guideItem4}</li>
                    </ul>
                </div>
            </div>

            <div className="md:col-span-3 bg-white border border-slate-200 rounded-xl p-8 shadow-sm relative">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/notebook.png")' }}></div>

                <article className="prose prose-slate max-w-none relative z-10">
                    <h2 className="text-3xl font-normal mb-6 pb-2 border-b border-slate-100 font-serif" style={{ color: PRIMARY_COLOR }}>{t.guideTitle}</h2>
                    
                    <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6 rounded-r-lg">
                        <p className="text-orange-800 text-sm font-medium m-0">
                            <strong>{t.guideNote}</strong> {t.guideNoteText}
                        </p>
                    </div>

                    <h3 className="text-xl font-normal mt-8 mb-4 font-serif" style={{ color: PRIMARY_COLOR }}>{t.guideStep1}</h3>
                    <p className="text-slate-600 mb-4 leading-relaxed">
                        {t.guideStep1Text} <span className="font-bold text-white px-2 py-0.5 rounded text-sm" style={{ backgroundColor: PRIMARY_COLOR }}>{t.download}</span> {t.guideStep1Text2}
                    </p>

                    <h3 className="text-xl font-normal mt-8 mb-4 font-serif" style={{ color: PRIMARY_COLOR }}>{t.guideStep2}</h3>
                    <p className="text-slate-600 mb-2">{t.guideStep2Text}</p>
                    <div className="bg-slate-800 text-slate-200 p-4 rounded-xl text-sm font-mono overflow-x-auto mb-6 shadow-inner">
                        C:\Users\[User_Name]\AppData\Roaming\SketchUp\SketchUp 202x\SketchUp\Plugins
                    </div>

                    <h3 className="text-xl font-normal mt-8 mb-4 font-serif" style={{ color: PRIMARY_COLOR }}>{t.guideStep3}</h3>
                    <p className="text-slate-600 mb-4">
                        {t.guideStep3Text}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 items-center bg-blue-50 p-6 rounded-xl border border-blue-100 mt-4">
                         <div className="flex-1">
                             <p className="text-sm text-blue-800 font-bold mb-1">{t.guideYourKey}</p>
                             <div className="font-mono text-lg text-slate-800 bg-white px-3 py-2 rounded border border-blue-200">
                                {session ? profile?.license_key : t.loginToView}
                             </div>
                         </div>
                         <button 
                            onClick={() => copyToClipboard(profile?.license_key)}
                            className="px-6 py-3 rounded-lg font-bold text-white shadow-md hover:opacity-90 transition whitespace-nowrap"
                            style={{ backgroundColor: PRIMARY_COLOR }}
                         >
                            {t.copyKeyBtn}
                         </button>
                    </div>
                </article>
            </div>
        </div>
    </div>
  );

  const PaymentModal = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
            <div className="flex-1 p-6 bg-slate-50 border-r border-slate-100 flex flex-col">
                <h3 className="text-xl font-normal mb-4 flex items-center gap-2 font-serif" style={{ color: PRIMARY_COLOR }}>
                    <Zap className="w-5 h-5 text-yellow-500 fill-current"/> {t.paymentTitle}
                </h3>
                
                <div className="flex bg-slate-200 p-1 rounded-xl mb-4 font-sans shrink-0">
                    <button onClick={() => handleSwitchMethod('VND')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${paymentMethod === 'VND' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}>
                        {t.paymentVND}
                    </button>
                    <button onClick={() => handleSwitchMethod('USD')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${paymentMethod === 'USD' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>
                        {t.paymentUSD}
                    </button>
                </div>

                <div className="space-y-3 overflow-y-auto flex-1 custom-scrollbar pr-1">
                    {(paymentMethod === 'VND' ? PACKAGES_VND : PACKAGES_USD).map((pkg) => (
                        <div 
                            key={pkg.id} onClick={() => setSelectedPkg(pkg)}
                            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center group
                                ${selectedPkg.id === pkg.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-300'}`}
                        >
                            {pkg.popular && (
                                <span className="absolute -top-2.5 -right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-current"/> HOT
                                </span>
                            )}
                            <div>
                                <div className="font-bold text-slate-700">{pkg.credits} Credits</div>
                                <div className="text-xs text-slate-500">{pkg.label}</div>
                            </div>
                            <div className="text-blue-600 font-bold font-mono">
                                {paymentMethod === 'USD' ? '$' : ''}{pkg.price.toLocaleString('vi-VN')}{paymentMethod === 'VND' ? ' đ' : ''}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 flex flex-col bg-white relative">
                 <button onClick={() => setShowPayment(false)} className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-full transition text-slate-500">
                    <X className="w-6 h-6"/>
                </button>

                <div className="p-8 flex flex-col items-center justify-center h-full text-center">
                    {paypalSuccess ? (
                         <div className="animate-fade-in w-full">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle2 className="w-10 h-10" /></div>
                            <h3 className="text-xl font-bold text-slate-800">{t.paymentSuccess}</h3>
                            <div className="bg-slate-100 p-3 rounded-lg font-mono text-sm border border-slate-200 my-4 select-all text-slate-700">{paypalSuccess}</div>
                            <p className="text-slate-500 text-xs">{t.paymentSuccessMsg}</p>
                        </div>
                    ) : (
                        <div className="w-full">
                            <p className="text-slate-500 text-sm mb-4">{t.paymentTotal} <span className="text-2xl font-bold text-slate-800 block mt-1">{selectedPkg.price.toLocaleString('vi-VN')} {paymentMethod === 'VND' ? 'đ' : '$'}</span></p>
                            
                            {paymentMethod === 'VND' ? (
                                <div className="bg-white p-2 border border-slate-200 rounded-xl shadow-sm inline-block">
                                    <img src={getVietQRUrl()} alt="VietQR" className="w-48 h-48 object-contain" />
                                    <p className="text-[10px] text-slate-400 mt-2">{t.paymentScan}</p>
                                </div>
                            ) : (
                                <div className="w-full px-4 mt-4">
                                     <button 
                                        onClick={handleMockPayPalPayment}
                                        className="w-full py-3 bg-[#FFC439] hover:bg-[#F4B400] text-[#003087] font-bold rounded-full shadow-md transition flex flex-col items-center justify-center gap-1"
                                     >
                                         <span className="italic font-serif text-lg tracking-wide">Pay<span className="text-[#009cde]">Pal</span></span>
                                         <span className="text-[10px] font-normal uppercase opacity-80">{t.paymentCardDesc}</span>
                                     </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div 
        className="min-h-screen text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col relative"
        style={{ 
            backgroundColor: BG_COLOR,
            backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
            backgroundSize: '20px 20px'
        }}
    >
        {/* Lớp trang trí nền (Background Decorations) - Chứa các ảnh PNG neo dọc trang */}
        <BackgroundDecorations />

        {showPayment && <PaymentModal />}
        <Navbar />
        <main className="flex-grow w-full relative z-10">
            <HeroSection />
            {viewMode === 'home' ? <ShowcaseContent /> : <GuideContent />}
        </main>
        <footer className="mt-auto border-t border-slate-200 bg-white/60 backdrop-blur-sm py-8 relative z-10">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                <div>{t.footerRights}</div>
                <div className="flex gap-6">
                        <a href="#" className="hover:text-blue-600">{t.footerTerms}</a>
                        <a href="#" className="hover:text-blue-600">{t.footerPrivacy}</a>
                        <a href="#" className="hover:text-blue-600">{t.footerContact}</a>
                </div>
            </div>
        </footer>
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
            <a href={FACEBOOK_LINK} target="_blank" rel="noreferrer" 
               className="w-12 h-12 text-white rounded-full flex items-center justify-center shadow-lg transition transform hover:scale-110"
               style={{ backgroundColor: PRIMARY_COLOR }}
            >
                <Facebook className="w-6 h-6" />
            </a>
            <a href={ZALO_LINK} target="_blank" rel="noreferrer" 
               className="w-12 h-12 text-white rounded-full flex items-center justify-center shadow-lg transition transform hover:scale-110 ring-2 ring-white"
               style={{ backgroundColor: PRIMARY_COLOR }}
            >
                    <MessageCircle className="w-6 h-6" />
            </a>
        </div>
    </div>
  );
}