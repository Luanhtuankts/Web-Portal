// KẾT NỐI ONLINE: IMPORT THƯ VIỆN CHÍNH
import React, { useState, useRef, useEffect } from 'react';
/* Import bộ icon từ lucide-react */
import { 
  CreditCard, Copy, Download, LogOut, Loader2, Zap, 
  Box, User, CheckCircle2, X, Star, PlayCircle, LibraryBig,
  Facebook, MessageCircle, Globe, Plus, Menu, ArrowRight, ArrowLeft, BookOpen,
  Mic, Image as ImageIcon, Send, History, LayoutTemplate, ScanEye,
  MoreVertical, Eye, EyeOff, Key, AlertTriangle, Sparkles, Home
} from 'lucide-react';
import { ShowcaseSection, InteractiveGuideSection } from './GuideAndShowcase';

// ==============================================================================
// 1. CẤU HÌNH BẬT/TẮT CHẾ ĐỘ XEM THỬ (MOCK MODE FOR CANVAS PREVIEW)
// ==============================================================================
const IS_PREVIEW_MOCK_MODE = false;

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || "";

let supabaseInstance = null;
const getSupabase = () => {
  if (IS_PREVIEW_MOCK_MODE) return null;
  if (supabaseInstance) return supabaseInstance;
  if (typeof window !== 'undefined' && window.supabase) {
    supabaseInstance = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
    return supabaseInstance;
  }
  return null;
};

const loadScript = (src, id) => {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.id = id;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(script);
  });
};

const PRIMARY_COLOR = "#0063A3";
const BG_COLOR = "#fdfbf7"; // Nền sáng mặc định

// TỪ ĐIỂN ĐA NGÔN NGỮ (TRANSLATIONS)
const TRANSLATIONS = {
  VN: {
    login: "Đăng nhập",
    logout: "Đăng xuất",
    licenseKey: "License Key",
    copyKey: "Sao chép Key",
    copyKeyBtn: "Copy Key Ngay",
    heroTitle: "Xin chào, Kiến trúc sư!",
    heroSubtitle: "\"Bạn là nhà thiết kế - hãy để AI dựng hình cho bạn.\"",
    downloadMain: "Dùng thử",
    guide: "Hướng dẫn",
    backHome: "Quay lại Trang chủ",
    footerRights: "© 2026 OpenSkp. Bảo lưu mọi quyền.",
    footerTerms: "Điều khoản sử dụng",
    footerPrivacy: "Chính sách bảo mật",
    footerContact: "Liên hệ",
    paymentTitle: "Bảng giá phần mềm",
    paymentVND: "VNĐ",
    paymentUSD: "USD",
    paymentTotal: "Tổng thanh toán:",
    paymentScan: "Quét mã để thanh toán tự động",
    paymentSuccess: "Thanh toán thành công!",
    paymentSuccessMsg: "Vui lòng gửi mã này cho Admin qua Zalo/Facebook.",
    paymentCardDesc: "Thẻ Tín dụng / Ghi nợ quốc tế",
    loginToView: "Vui lòng đăng nhập...",
    
    licenseDesc: "OpenSkp đóng vai trò là cầu nối thông minh giữa SketchUp và các mô hình AI bên ngoài. Hệ thống hỗ trợ dựng không gian 3D tự động từ ảnh mặt bằng 2D và điều phối tạo dựng các cấu kiện mô hình 3D hoàn chỉnh.",
    paymentNotice: "Lưu ý: Hệ thống thanh toán có thể thay đổi, chỉ áp dụng cơ chế sử dụng vĩnh viễn với các đăng ký trong giai đoạn đầu phát triển Plugin.",
    pkgLifetimeTitle: "Phiên bản Trọn đời",
    pkgLifetimeSubtitle: "Mua đứt 1 lần, sử dụng vĩnh viễn",

    statusActivated: "Đã kích hoạt",
    statusInactive: "Chưa kích hoạt",
    pricingPricing: "Bảng giá"
  },
  EN: {
    login: "Log in",
    logout: "Log out",
    licenseKey: "License Key",
    copyKey: "Copy Key",
    copyKeyBtn: "Copy Key Now",
    heroTitle: "Hello, Architect!",
    heroSubtitle: "\"You are the designer - let AI do the modeling for you.\"",
    downloadMain: "Free Trial",
    guide: "Guide",
    backHome: "Back to Home",
    footerRights: "© 2026 OpenSkp. All rights reserved.",
    footerTerms: "Terms of Use",
    footerPrivacy: "Privacy Policy",
    footerContact: "Contact",
    paymentTitle: "Software Pricing",
    paymentVND: "VND",
    paymentUSD: "USD",
    paymentTotal: "Total payment:",
    paymentScan: "Scan QR to pay automatically",
    paymentSuccess: "Payment Successful!",
    paymentSuccessMsg: "Please send this code to Admin via Zalo/Facebook.",
    paymentCardDesc: "International Debit or Credit Card",
    loginToView: "Please login...",

    licenseDesc: "OpenSkp serves as an intelligent bridge between SketchUp and external AI models. It automates 3D spatial generation from 2D floor plans and coordinates full 3D model component creation.",
    paymentNotice: "Note: The payment system is subject to change; lifetime usage is only applicable to registrations during the initial development phase of the Plugin.",
    pkgLifetimeTitle: "Lifetime License",
    pkgLifetimeSubtitle: "Pay once, use forever",

    statusActivated: "Activated",
    statusInactive: "Inactive",
    pricingPricing: "Pricing"
  }
};

const MOCK_SESSION_DATA = { user: { email: 'architect_test@openskp.com', id: 'mock-user-uuid-12345' } };
const MOCK_PROFILE_DATA = { license_key: 'OPENSKP-V2-PREVIEW-ACTIVE', is_active: true, hardware_id: 'HWID-SKETCHUP-CLIENT-9999' };

const ZALO_LINK = import.meta.env.VITE_ZALO_LINK || "";
const FACEBOOK_LINK = import.meta.env.VITE_FACEBOOK_LINK || "";
const DRIVE_DOWNLOAD_LINK = import.meta.env.VITE_DRIVE_DOWNLOAD_LINK || "";

const BANK_ID = import.meta.env.VITE_BANK_ID || ""; 
const BANK_ACCOUNT = import.meta.env.VITE_BANK_ACCOUNT || ""; 
const ACCOUNT_NAME = import.meta.env.VITE_BANK_ACCOUNT_NAME || ""; 

const OPENSKP_PRICE_VND = 200000;
const OPENSKP_PRICE_USD = 10;

const PayPalButtonContainer = ({ price, value, onSuccess, onError, language = 'VN' }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (IS_PREVIEW_MOCK_MODE) {
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <div class="bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold py-3 px-4 rounded-xl shadow cursor-pointer transition flex items-center justify-center gap-2 text-sm">
             <span>Pay with <b>PayPal</b> (${language === 'VN' ? 'Chế độ Xem thử' : 'Preview Mode'})</span>
          </div>
        `;
        const btn = containerRef.current.firstElementChild;
        btn.onclick = () => {
          const mockOrderId = "PAYID-" + Math.random().toString(36).substring(2, 11).toUpperCase();
          onSuccess(mockOrderId);
        };
      }
      return;
    }

    if (window.paypal && containerRef.current) {
      containerRef.current.innerHTML = "";
      window.paypal.Buttons({
        style: { layout: "vertical", shape: "rect", label: "checkout", height: 48 },
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: { value: price.toString() },
              description: `Buy ${value}`
            }]
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          onSuccess(order.id);
        },
        onError: (err) => {
          console.error("PayPal SDK Error:", err);
          onError(err);
        }
      }).render(containerRef.current);
    }
  }, [price, value]);

  return <div ref={containerRef} className="w-full min-h-[48px]"></div>;
};

// ==============================================================================
// CÁC SUB-COMPONENTS GIAO DIỆN
// ==============================================================================

const LogoSVG = () => (
  <svg className="w-10 h-10" viewBox="0 0 24 24" style={{ color: PRIMARY_COLOR }}>
      <path d='M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-4 5h8c2.76 0 5 2.24 5 5v4c0 2.76-2.24 5-5 5H8c-2.76 0-5-2.24-5-5v-4c0-2.76 2.24-5 5-5zm1 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z' fill='currentColor'/>
      <path d='M5 23 Q 12 18, 19 23 H 5 z' fill='currentColor'/>
  </svg>
);

const BackgroundDecorations = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none w-full h-full">
       {/* 1. KHU VỰC HERO ĐẦU TRANG (GIỮ NGUYÊN VỊ TRÍ GỐC, KHÔNG BỊ CẮT LẸM CHÂN) */}
       <img
          src="/Sketch1.png"
          className="absolute top-[150px] sm:top-[160px] -left-[3%] w-[45%] sm:w-[48%] max-w-[620px] opacity-[0.16] rotate-[-12deg] mix-blend-multiply"
          alt="Decoration"
          onError={(e) => e.target.style.display = 'none'}
       />
       <img
          src="/Sketch2.png"
          className="absolute top-[410px] sm:top-[430px] -right-[5%] w-[42%] sm:w-[45%] max-w-[560px] opacity-[0.16] rotate-[0deg] mix-blend-multiply"
          alt="Decoration"
       />

       {/* 2. RẢI RANDOM DỌC 2 BÊN BIÊN XUỐNG DƯỚI CHO NỀN ĐỠ TRỐNG */}
       {/* Biên trái - ngang tầm Showcase 1 */}
       <img
          src="/Sketch2.png"
          className="absolute top-[1250px] -left-[6%] sm:-left-[4%] w-[32%] sm:w-[34%] max-w-[440px] opacity-[0.12] rotate-[-10deg] mix-blend-multiply"
          alt="Decoration"
       />
       {/* Biên phải - cuối Showcase 1 / đầu Showcase 2 */}
       <img
          src="/Sketch1.png"
          className="absolute top-[1800px] -right-[6%] sm:-right-[4%] w-[34%] sm:w-[36%] max-w-[460px] opacity-[0.12] rotate-[10deg] mix-blend-multiply"
          alt="Decoration"
       />
       {/* Biên trái - ngang tầm Showcase 2 */}
       <img
          src="/Sketch1.png"
          className="absolute top-[2400px] -left-[5%] sm:-left-[3%] w-[33%] sm:w-[35%] max-w-[450px] opacity-[0.11] rotate-[-14deg] mix-blend-multiply"
          alt="Decoration"
       />
       {/* Biên phải - cuối Showcase 2 / đầu Showcase 3 */}
       <img
          src="/Sketch2.png"
          className="absolute top-[2950px] -right-[6%] sm:-right-[4%] w-[30%] sm:w-[33%] max-w-[430px] opacity-[0.11] rotate-[7deg] mix-blend-multiply"
          alt="Decoration"
       />
       {/* Biên trái - ngang tầm Showcase 3 */}
       <img
          src="/Sketch2.png"
          className="absolute top-[3500px] -left-[6%] sm:-left-[4%] w-[32%] sm:w-[34%] max-w-[440px] opacity-[0.11] rotate-[-7deg] mix-blend-multiply"
          alt="Decoration"
       />
       {/* Biên phải - gần chân trang Footer */}
       <img
          src="/Sketch1.png"
          className="absolute top-[4050px] -right-[5%] sm:-right-[3%] w-[33%] sm:w-[35%] max-w-[450px] opacity-[0.11] rotate-[12deg] mix-blend-multiply"
          alt="Decoration"
       />
  </div>
);

// ==============================================================================
// CẤU HÌNH VÀ BỘ CHỌN MẪU FONT TRỰC TIẾP (LIVE FONT SWITCHER)
// ==============================================================================
export const FONT_OPTIONS = [
  {
    id: 'manrope',
    name: 'Manrope (Đang dùng)',
    tag: 'Đanh gọn, hình khối cân đối chuẩn Kiến trúc & 3D',
    fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },
  {
    id: 'space-grotesk',
    name: 'Space Grotesk',
    tag: 'Hình học Tech / Brutalist chuẩn Đồ họa kiến trúc',
    fontFamily: "'Space Grotesk', sans-serif"
  },
  {
    id: 'outfit',
    name: 'Outfit',
    tag: 'Hình học hiện đại, thoáng đãng, chuẩn sản phẩm công nghệ',
    fontFamily: "'Outfit', sans-serif"
  },
  {
    id: 'lexend',
    name: 'Lexend',
    tag: 'Tối ưu thị giác, nét thẳng tắp chuẩn công nghệ cao',
    fontFamily: "'Lexend', sans-serif"
  },
  {
    id: 'work-sans',
    name: 'Work Sans',
    tag: 'Tỷ lệ vàng kiến trúc, chuẩn bản vẽ kỹ thuật & thiết kế',
    fontFamily: "'Work Sans', sans-serif"
  },
  {
    id: 'inter',
    name: 'Inter',
    tag: 'Chuẩn UI quốc tế (tương tự Apple SF trên dicular.com)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },
  {
    id: 'jakarta',
    name: 'Plus Jakarta Sans',
    tag: 'Hiện đại, bo cong mềm mại (chuẩn SaaS cao cấp)',
    fontFamily: "'Plus Jakarta Sans', sans-serif"
  },
  {
    id: 'vietnam',
    name: 'Be Vietnam Pro',
    tag: 'Thiết kế tối ưu chuyên biệt cho Tiếng Việt',
    fontFamily: "'Be Vietnam Pro', sans-serif"
  }
];

export const FontSwitcher = ({ currentFont, onChangeFont, PRIMARY_COLOR }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2">
      {isOpen && (
        <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl border border-slate-200 w-80 sm:w-92 animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Sparkles size={14} style={{ color: PRIMARY_COLOR }} />
              <span>Chọn mẫu font Kiến trúc & Công nghệ (8 mẫu):</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition text-xs cursor-pointer"
              title="Thu nhỏ"
            >
              <X size={14} />
            </button>
          </div>
          <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
            {FONT_OPTIONS.map((f) => {
              const isSelected = currentFont === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => onChangeFont(f.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl transition flex items-center justify-between border cursor-pointer ${
                    isSelected 
                      ? 'border-[#0063A3] bg-[#0063A3]/5 text-[#0063A3] shadow-xs' 
                      : 'border-slate-100 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                  style={{ fontFamily: f.fontFamily }}
                >
                  <div className="flex flex-col">
                    <span className="text-[13.5px] font-semibold flex items-center gap-1.5">
                      {f.name}
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#0063A3]"></span>}
                    </span>
                    <span className="text-[10.5px] text-slate-500 font-normal">{f.tag}</span>
                  </div>
                  {isSelected ? (
                    <CheckCircle2 size={16} className="text-[#0063A3] shrink-0" />
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium hover:text-[#0063A3]">Chọn</span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500 leading-tight">
            🔒 <em>"Xin chào, Kiến trúc sư!"</em> luôn được giữ nguyên 100% font có chân Crimson Pro.
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-slate-200 text-slate-700 hover:text-[#0063A3] hover:border-[#0063A3] flex items-center gap-2 text-xs font-semibold transition cursor-pointer select-none group"
      >
        <span className="w-2 h-2 rounded-full bg-[#0063A3] animate-pulse"></span>
        <Sparkles size={14} className="text-[#0063A3] group-hover:rotate-12 transition-transform" />
        <span>Mẫu Font: {FONT_OPTIONS.find(f => f.id === currentFont)?.name || 'Inter'}</span>
      </button>
    </div>
  );
};

// HIỂN THỊ NÚT TẢI OPENSKP VÀ NÚT HƯỚNG DẪN TRỰC QUAN (ĐỒNG BỘ CỠ CHỮ CHUẨN)
const HeroSection = ({ t, handleDownloadMain, currentView, setCurrentView }) => (
  <div className="flex flex-col items-center text-center mb-12 mt-6 animate-fade-in px-4 relative z-20">
      <div className="relative z-0 -mb-0.5 pointer-events-none select-none">
          <img 
              src="/robot-drawing.png" 
              alt="Robot Architect" 
              className="w-52 sm:w-[22rem] h-auto object-contain"
              onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/300x300/fdfbf7/0063A3?text=Robot+PNG";
              }}
          />
      </div>
      <div className="relative z-10 pt-4 text-slate-800">
          <h1 
            className="text-3xl font-serif sm:text-5xl mb-4 max-w-3xl leading-tight" 
            style={{ color: PRIMARY_COLOR, fontFamily: "'Crimson Pro', Georgia, serif" }}
          >
              {t.heroTitle} <br/>
          </h1>
          <h1 
            className="text-lg sm:text-2xl mt-2 block font-serif italic" 
            style={{ color: PRIMARY_COLOR, fontFamily: "'Crimson Pro', Georgia, serif" }}
          >
              {t.heroSubtitle}
          </h1>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mt-8 mb-1 relative z-20">
          <button 
              onClick={handleDownloadMain}
              className="px-9 py-3.5 rounded-xl text-white text-[17px] sm:text-[18px] font-semibold shadow-lg hover:translate-y-[-2px] hover:opacity-90 active:translate-y-[0px] active:scale-[0.98] transition flex items-center justify-center gap-2.5 cursor-pointer select-none"
              style={{ backgroundColor: PRIMARY_COLOR }}
          >
              <Download size={21} /> <span>{t.downloadMain}</span>
          </button>
          <button 
              onClick={() => {
                const nextView = currentView === 'guide' ? 'home' : 'guide';
                setCurrentView(nextView);
                if (nextView === 'guide') {
                  setTimeout(() => {
                    document.getElementById('guide-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="px-9 py-3.5 rounded-xl text-[17px] sm:text-[18px] font-semibold shadow-lg hover:translate-y-[-2px] active:translate-y-[0px] active:scale-[0.98] bg-white border hover:bg-slate-50 transition flex items-center justify-center gap-2.5 cursor-pointer select-none"
              style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
          >
              {currentView === 'guide' ? (
                <>
                  <Home size={21} /> <span>{t.backHome}</span>
                </>
              ) : (
                <>
                  <BookOpen size={21} /> <span>{t.guide}</span>
                </>
              )}
          </button>
      </div>
  </div>
);

// GIAO DIỆN BẢNG GIÁ (ĐƯA VỀ CÙNG 1 Ô: TIÊU ĐỀ - NỘI DUNG - QR - TỔNG THANH TOÁN - 200.000Đ - VND USD - LƯU Ý - ĐỒNG BỘ CỠ CHỮ)
const PaymentModal = ({ 
  t, 
  language = 'VN',
  paymentMethod, 
  handleSwitchMethod, 
  setShowPayment, 
  paypalSuccess, 
  profile, 
  getVietQRUrl, 
  setPaypalSuccess, 
  showToast, 
  paypalSdkReady 
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full relative overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100 flex flex-col max-h-[92vh]">
            
            {/* Nút đóng X góc trên */}
            <button 
              onClick={() => setShowPayment(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-full transition z-20 cursor-pointer"
              title={language === 'VN' ? 'Đóng' : 'Close'}
            >
                <X size={18} />
            </button>

            <div className="p-6 sm:p-7 flex flex-col items-center text-center overflow-y-auto custom-scrollbar">
                
                {/* 1. TIÊU ĐỀ */}
                <h3 
                  className="text-4xl font-serif font-normal tracking-tight mb-4"
                  style={{ fontFamily: "'Crimson Pro', Georgia, serif", color: PRIMARY_COLOR }}
                >
                    OpenSkp
                </h3>

                {/* 2. NỘI DUNG */}
                <p className="text-[14.5px] sm:text-[15px] text-slate-600 leading-relaxed text-justify mb-5 px-1">
                    {t.licenseDesc}
                </p>

                {/* 3. QR (hoặc PayPal nếu chọn USD) */}
                {paypalSuccess ? (
                    <div className="animate-fade-in w-full my-2">
                        <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">{t.paymentSuccess}</h3>
                        <div className="bg-slate-100 p-2.5 rounded-lg font-mono text-xs border border-slate-200 my-3 select-all text-slate-700">
                            {paypalSuccess}
                        </div>
                        <h5 className="text-slate-500 text-xs">{t.paymentSuccessMsg}</h5>
                    </div>
                ) : (
                    <>
                        {paymentMethod === 'VND' ? (
                            <div className="bg-white p-2.5 border border-slate-200 rounded-xl shadow-xs inline-block mb-3">
                                {profile ? (
                                    <img src={getVietQRUrl()} alt="VietQR" className="w-44 h-44 object-contain animate-fade-in mx-auto" />
                                ) : (
                                    <div className="w-44 h-44 flex items-center justify-center text-xs text-gray-400 bg-gray-50 rounded">
                                        <Loader2 className="animate-spin mr-2" /> {t.loginToView}
                                    </div>
                                )}
                                <h5 className="text-[10px] text-slate-400 mt-1.5">{t.paymentScan}</h5>
                            </div>
                        ) : (
                            <div className="w-full max-w-xs px-2 my-3 relative z-0">
                                {(IS_PREVIEW_MOCK_MODE || paypalSdkReady) ? (
                                    <PayPalButtonContainer 
                                        price={OPENSKP_PRICE_USD}
                                        value={"OpenSkp Lifetime License"}
                                        language={language}
                                        onSuccess={(orderId) => {
                                            setPaypalSuccess(orderId);
                                            showToast(language === 'VN' ? "Thanh toán PayPal thành công!" : "PayPal payment successful!", "success");
                                        }}
                                        onError={() => {
                                            showToast(language === 'VN' ? "Giao dịch thất bại / Payment Failed" : "Payment Failed", "error");
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-12 flex items-center justify-center text-slate-400 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                                        <Loader2 className="animate-spin mr-2 w-4 h-4" /> {language === 'VN' ? 'Đang kết nối PayPal...' : 'Connecting to PayPal...'}
                                    </div>
                                )}
                                <div className="bg-blue-50 p-2 rounded-lg text-[10px] text-blue-800 mt-2 border border-blue-100 text-center">
                                    ℹ️ {t.paymentCardDesc}
                                </div>
                            </div>
                        )}

                        {/* 4. TỔNG THANH TOÁN */}
                        <div className="text-sm text-slate-500 font-medium mt-1">
                            {t.paymentTotal}
                        </div>

                        {/* 5. 200.000Đ */}
                        <div className="text-2xl font-bold font-mono text-[#0063A3] mt-0.5 mb-3">
                            {paymentMethod === 'USD' ? `$${OPENSKP_PRICE_USD}` : `${OPENSKP_PRICE_VND.toLocaleString('vi-VN')} đ`}
                        </div>

                        {/* 6. VND USD */}
                        <div className="w-48 flex bg-slate-100 p-1 rounded-xl mb-4 shrink-0">
                            <button 
                                onClick={() => handleSwitchMethod('VND')} 
                                className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition cursor-pointer ${paymentMethod === 'VND' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
                            >
                                {t.paymentVND}
                            </button>
                            <button 
                                onClick={() => handleSwitchMethod('USD')} 
                                className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition cursor-pointer ${paymentMethod === 'USD' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
                            >
                                {t.paymentUSD}
                            </button>
                        </div>

                        {/* 7. LƯU Ý ... */}
                        <div className="text-[12.5px] text-red-500 font-medium text-justify px-2 leading-relaxed border-t border-slate-100 pt-3">
                            {t.paymentNotice}
                        </div>
                    </>
                )}

            </div>
        </div>
    </div>
  );
};

const Navbar = ({ t, handleTopup, session, profile, handleLogout, handleLoginGoogle, language, setLanguage, keyCopySuccess, copyToClipboard, handleResetHWID, loading, onOpenGuide, handleDownloadMain }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navTextStyle = {
      color: PRIMARY_COLOR,
      fontSize: '15px',
      fontWeight: 500
  };

  const renderUserDashboard = () => (
      <div className="flex items-center bg-white p-1.5 rounded-xl shadow-sm border border-slate-200 animate-fade-in text-slate-800 font-sans">
          
          {/* CỘT: Trạng thái Bản quyền - TIÊU ĐỀ XANH ĐẬM, VIẾT HOA, GIỮ XANH LÁ */}
          <div className="flex flex-col justify-center items-start px-2.5 whitespace-nowrap">
              <div className="text-[10px] uppercase text-[#0063A3] font-bold tracking-wider leading-none mb-1 font-sans">
                {language === 'VN' ? 'TRẠNG THÁI' : 'STATUS'}
              </div>
              <div className={`text-[10px] font-bold uppercase leading-none font-sans ${profile?.lite ? 'text-emerald-600' : 'text-slate-400'}`}>
                   {profile?.lite ? (t.statusActivated || 'ĐÃ KÍCH HOẠT').toUpperCase() : (t.statusInactive || 'CHƯA KÍCH HOẠT').toUpperCase()}
              </div>
          </div>

          {/* VÁCH NGĂN DỌC */}
          <div className="w-px h-8 bg-slate-200 mx-1"></div>

          {/* CỘT: License Key - TIÊU ĐỀ XANH ĐẬM, KEY ĐEN MẢNH, VIẾT HOA TẤT */}
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-200 ml-1">
              <div className="flex flex-col items-start">
                  <span className="text-[10px] font-bold text-[#0063A3] uppercase tracking-wider leading-none mb-1 font-sans">
                    {t.licenseKey ? t.licenseKey.toUpperCase() : 'LICENSE KEY'}
                  </span>
                  <span className="text-xs font-normal text-slate-900 font-sans leading-tight select-all uppercase whitespace-nowrap cursor-default">
                    {(profile?.license_key || (language === 'VN' ? 'ĐANG TẠO MÃ...' : 'GENERATING...')).toUpperCase()}
                  </span>
              </div>
              <button 
                  onClick={(e) => {
                      e.stopPropagation();
                      if(profile?.license_key){
                          copyToClipboard(profile.license_key, true);
                      }
                  }} 
                  className="text-slate-400 hover:text-blue-600 transition p-0.5 hover:bg-white rounded-md shrink-0 cursor-pointer"
                  title={t.copyKey}
              >
                  {keyCopySuccess ? <CheckCircle2 size={14} className="text-green-600"/> : <Copy size={14} />}
              </button>
          </div>
      </div>
  );

  return (
    <nav className="border-b border-gray-200 sticky top-0 z-50 bg-[#fdfbf7]/95 backdrop-blur-sm transition-all duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center relative">
            <div className="flex items-center gap-6 lg:gap-8">
                <div className="flex items-center gap-2 cursor-pointer group shrink-0" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMobileMenuOpen(false); }}>
                    <div className="group-hover:scale-110 transition-transform duration-300"><LogoSVG /></div>
                    <span className="font-serif font-normal text-3xl tracking-tight mt-1" style={{ color: PRIMARY_COLOR, fontFamily: "'Crimson Pro', Georgia, serif" }}>OpenSkp</span>
                </div>
                <div className="hidden md:flex items-center gap-6 pt-1">
                    <button 
                      onClick={handleTopup} 
                      className="font-serif text-[17px] hover:opacity-80 transition hover:scale-105 cursor-pointer select-none" 
                      style={{ color: PRIMARY_COLOR, fontFamily: "'Crimson Pro', Georgia, serif" }}
                    >
                      {t.pricingPricing}
                    </button>
                    <button 
                      onClick={onOpenGuide} 
                      className="font-serif text-[17px] hover:opacity-80 transition hover:scale-105 cursor-pointer select-none" 
                      style={{ color: PRIMARY_COLOR, fontFamily: "'Crimson Pro', Georgia, serif" }}
                    >
                      {t.guide}
                    </button>
                    <button 
                      onClick={handleDownloadMain} 
                      className="font-serif text-[17px] hover:opacity-80 transition hover:scale-105 cursor-pointer select-none" 
                      style={{ color: PRIMARY_COLOR, fontFamily: "'Crimson Pro', Georgia, serif" }}
                    >
                      Download
                    </button>
                </div>
            </div>

            <div className="hidden md:flex items-center gap-3 sm:gap-4">
                {session && renderUserDashboard()}
                {session ? (
                    <div className="relative group ml-1 z-50">
                        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 cursor-pointer hover:bg-slate-200 transition shadow-sm">
                            <User size={20} />
                        </div>
                        <div className="absolute right-0 top-full pt-3 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right">
                            <div className="bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 p-4 flex flex-col gap-3 text-slate-800 font-sans">
                                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex-shrink-0 flex items-center justify-center text-primary-brand border border-slate-100" style={{ color: PRIMARY_COLOR }}>
                                        <User size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <span className="text-sm font-medium text-slate-700 truncate block" title={session.user.email}>
                                             {session.user.email}
                                        </span>
                                    </div>
                                    <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition flex-shrink-0" title={language === 'VN' ? 'Đăng xuất' : 'Log out'}>
                                        <LogOut size={18} />
                                    </button>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-[#0063A3] uppercase tracking-wider mb-2 font-sans">
                                      {language === 'VN' ? 'THIẾT BỊ ĐANG KẾT NỐI (HWID)' : 'CONNECTED DEVICE (HWID)'}
                                    </p>
                                    {profile?.hardware_id ? (
                                        <div className="space-y-2">
                                            <p className="text-emerald-600 font-normal bg-emerald-50 border border-emerald-200/60 px-2.5 py-1.5 rounded-lg text-xs font-sans break-all">✓ {profile.hardware_id}</p>
                                            <button onClick={handleResetHWID} disabled={loading} className="w-full text-center px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold rounded-lg disabled:opacity-50 transition border border-red-100 cursor-pointer uppercase">
                                                {loading ? "ĐANG XỬ LÝ..." : (language === 'VN' ? "HỦY LIÊN KẾT MÁY NÀY" : "UNLINK THIS DEVICE")}
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-xs font-normal text-slate-500 bg-slate-50 border border-slate-200/60 px-2.5 py-1.5 rounded-lg font-sans">
                                          {language === 'VN' ? 'CHƯA KHÓA THIẾT BỊ NÀO.' : 'NO DEVICE LOCKED.'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button onClick={handleLoginGoogle} className="px-3 py-1.5 rounded-lg text-white font-bold text-xs shadow-md hover:opacity-90 transition flex items-center gap-2" style={{ backgroundColor: PRIMARY_COLOR }}>
                        <User size={14} /> <span>{t.login}</span>
                    </button>
                )}
                <button onClick={() => setLanguage(language === 'VN' ? 'EN' : 'VN')} className="flex items-center gap-1 text-slate-500 font-normal text-[10px] hover:text-slate-900 border border-slate-200 px-2 py-1 rounded-md bg-white transition">
                    <Globe size={12} /><span>{language}</span>
                </button>
            </div>

            <button className="md:hidden p-2 transition hover:bg-slate-50 rounded-lg" style={{ color: PRIMARY_COLOR }} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
        </div>

        {isMobileMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 shadow-xl animate-in slide-in-from-top-1 duration-200 z-50">
                <div className="flex flex-col py-4 gap-4 items-center">
                    <div className="w-full flex flex-col items-center gap-2 border-b border-gray-50 pb-4">
                      <button onClick={() => { handleTopup(); setIsMobileMenuOpen(false); }} className="py-2 px-6 hover:bg-slate-50 transition w-full text-center text-lg font-serif" style={{ color: PRIMARY_COLOR, fontFamily: "'Crimson Pro', Georgia, serif" }}>{t.pricingPricing}</button>
                      <button onClick={() => { setIsMobileMenuOpen(false); if (onOpenGuide) onOpenGuide(); }} className="py-2 px-6 hover:bg-slate-50 transition w-full text-center text-lg font-serif" style={{ color: PRIMARY_COLOR, fontFamily: "'Crimson Pro', Georgia, serif" }}>{t.guide}</button>
                      <button onClick={() => { setIsMobileMenuOpen(false); if (handleDownloadMain) handleDownloadMain(); }} className="py-2 px-6 hover:bg-slate-50 transition w-full text-center text-lg font-serif" style={{ color: PRIMARY_COLOR, fontFamily: "'Crimson Pro', Georgia, serif" }}>
                        Download
                      </button>
                    </div>
                    <div className="flex flex-col items-center gap-3 w-full px-4">
                        {session ? (
                            <>
                                <div className="scale-105 origin-center">{renderUserDashboard()}</div>
                                <div className="flex items-center justify-center gap-4 w-full mt-2">
                                    <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full truncate max-w-[200px] font-sans">
                                      <User size={14}/> <span className="truncate">{session.user.email}</span>
                                    </div>
                                    <button onClick={handleLogout} className="flex items-center gap-1 text-red-500 bg-red-50 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-red-100 transition shrink-0 font-sans">
                                        <LogOut size={14} /> {t.logout}
                                    </button>
                                </div>
                                <div className="w-full max-w-xs mt-2 p-3 bg-white border border-slate-100 shadow-sm rounded-xl text-left text-slate-800 font-sans">
                                    <p className="text-[10px] font-bold text-[#0063A3] uppercase tracking-wider mb-2 font-sans">
                                      {language === 'VN' ? 'THIẾT BỊ ĐANG KẾT NỐI (HWID)' : 'CONNECTED DEVICE (HWID)'}
                                    </p>
                                    {profile?.hardware_id ? (
                                        <div className="space-y-2">
                                            <p className="text-emerald-600 font-normal bg-emerald-50 border border-emerald-200/60 px-2.5 py-1.5 rounded-lg text-xs font-sans break-all">✓ {profile.hardware_id}</p>
                                            <button onClick={handleResetHWID} disabled={loading} className="w-full text-center px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold rounded-lg disabled:opacity-50 transition border border-red-100 cursor-pointer uppercase">
                                                {loading ? "ĐANG XỬ LÝ..." : (language === 'VN' ? "HỦY LIÊN KẾT MÁY NÀY" : "UNLINK THIS DEVICE")}
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-xs font-normal text-slate-500 bg-slate-50 border border-slate-200/60 px-2.5 py-1.5 rounded-lg font-sans">
                                          {language === 'VN' ? 'CHƯA KHÓA THIẾT BỊ NÀO.' : 'NO DEVICE LOCKED.'}
                                        </p>
                                    )}
                                </div>
                            </>
                        ) : (
                            <button onClick={() => { handleLoginGoogle(); setIsMobileMenuOpen(false); }} className="w-full max-w-xs py-3 rounded-lg text-white font-bold text-sm shadow-md flex items-center justify-center gap-2" style={{ backgroundColor: PRIMARY_COLOR }}>
                                <User size={16} /> {t.login}
                            </button>
                        )}
                        <button onClick={() => setLanguage(language === 'VN' ? 'EN' : 'VN')} className="text-xs text-slate-400 mt-2 hover:text-slate-600 flex items-center gap-1 bg-white border border-slate-200 px-3 py-1 rounded-full">
                            <Globe size={12} /> Language: {language}
                        </button>
                    </div>
                </div>
            </div>
        )}
    </nav>
  );
};

// ==============================================================================
// APP EXPORT CHÍNH
// ==============================================================================

export default function App() {
  
  const [session, setSession] = useState(null); 
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('VN');
  const [copySuccess, setCopySuccess] = useState(false);
  const [keyCopySuccess, setKeyCopySuccess] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('VND');
  const [paypalSuccess, setPaypalSuccess] = useState(null);
  
  const [supabaseReady, setSupabaseReady] = useState(false);
  const [paypalSdkReady, setPaypalSdkReady] = useState(false);
  const [mockResetCount, setMockResetCount] = useState(0);
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'guide'

  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [confirmModal, setConfirmModal] = useState({ show: false, message: '', onConfirm: null });

  // Quản lý mẫu font chữ toàn website (Mặc định: Manrope)
  const [currentFont, setCurrentFont] = useState('manrope');

  const applyFont = (fontFamilyStr) => {
    document.documentElement.style.setProperty('--app-font', fontFamilyStr);
    document.body.style.fontFamily = fontFamilyStr;
  };

  const handleFontChange = (fontId) => {
    const selected = FONT_OPTIONS.find(f => f.id === fontId);
    if (selected) {
      setCurrentFont(fontId);
      applyFont(selected.fontFamily);
      try {
        localStorage.setItem('openskp_font', fontId);
      } catch (e) {}
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem('openskp_font', 'manrope');
      setCurrentFont('manrope');
      applyFont(FONT_OPTIONS[0].fontFamily);
    } catch (e) {
      applyFont(FONT_OPTIONS[0].fontFamily);
    }
  }, []);

  const latestProfileRef = useRef(profile);
  useEffect(() => {
    latestProfileRef.current = profile;
  }, [profile]);

  const t = TRANSLATIONS[language];

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3500);
  };

  useEffect(() => {
    if (IS_PREVIEW_MOCK_MODE) {
      // Ban đầu chưa đăng nhập để trải nghiệm đúng luồng "yêu cầu đăng nhập mới cho download"
      setSupabaseReady(true);
      return;
    }

    const initSupabase = async () => {
      try {
        await loadScript("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2", "supabase-js-cdn");
        if (window.supabase) {
          setSupabaseReady(true);
        } else {
          throw new Error("Không thể khởi tạo đối tượng Supabase.");
        }
      } catch (err) {
        console.error("Lỗi Supabase CDN:", err);
        showToast("Không thể tải kết nối an toàn với máy chủ. Vui lòng tải lại trang.", "error");
      }
    };
    initSupabase();
  }, []);

  useEffect(() => {
    if (IS_PREVIEW_MOCK_MODE) return;

    if (showPayment && paymentMethod === 'USD' && PAYPAL_CLIENT_ID) {
      setPaypalSdkReady(false);
      loadScript(`https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`, "paypal-js-sdk")
        .then(() => {
          if (window.paypal) {
            setPaypalSdkReady(true);
          } else {
            throw new Error("Không tìm thấy đối tượng SDK PayPal.");
          }
        })
        .catch((err) => {
          console.error("Lỗi tải PayPal SDK:", err);
          showToast("Không thể khởi tạo cổng PayPal. Vui lòng thử lại sau.", "error");
        });
    }
  }, [showPayment, paymentMethod]);

  useEffect(() => {
    if (IS_PREVIEW_MOCK_MODE) return;

    const supabaseClient = getSupabase();
    if (!supabaseReady || !supabaseClient) { setLoading(false); return; }

    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((event, newSession) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          setSession((prevSession) => {
              if (prevSession?.user?.id === newSession?.user?.id) {
                  return prevSession; 
              }
              if (newSession) fetchProfile(newSession.user.id);
              else { setProfile(null); setLoading(false); }
              return newSession;
          });
      }
    });

    return () => subscription.unsubscribe();
  }, [supabaseReady]);

  useEffect(() => {
    if (IS_PREVIEW_MOCK_MODE) return;

    const supabaseClient = getSupabase();
    if (!supabaseReady || !supabaseClient || !session?.user?.id) return;

    const channel = supabaseClient
      .channel('realtime-credits')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'users_v2', filter: `id=eq.${session.user.id}` },
        async (payload) => {
          try {
            const verifiedData = await fetchProfile(session.user.id);
            if (verifiedData) {
              const oldBalance = latestProfileRef.current?.wallet_balance || 0;
              const newBalance = verifiedData.wallet_balance || 0;
              const oldLite = latestProfileRef.current?.lite || false;
              const newLite = verifiedData.lite || false;

              if (newLite && !oldLite) {
                if (showPayment) setShowPayment(false);
                showToast(`🎉 Kích hoạt thành công! Bản quyền OpenSkp của bạn đã sẵn sàng sử dụng.`, "success");
              }
            }
          } catch (e) {
            console.error("Lỗi đối soát bảo mật Realtime:", e);
          }
        }
      )
      .subscribe();

    return () => { supabaseClient.removeChannel(channel); };
  }, [supabaseReady, session, showPayment, paymentMethod]);

  const fetchProfile = async (userId, isRetry = false) => {
    if (IS_PREVIEW_MOCK_MODE) return;

    const supabaseClient = getSupabase();
    if (!supabaseClient) return;

    try {
      const { data, error } = await supabaseClient
        .from('users_v2')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
      return data; 
    } catch (err) {
      console.error("⚠️ Lỗi truy xuất hồ sơ:", err.message);
      if (!isRetry) {
        setTimeout(() => fetchProfile(userId, true), 1500);
      } else {
        showToast("Hồ sơ tài khoản chưa được chuẩn bị kịp trên Cloud. Vui lòng tải lại trang.", "error");
      }
      return null;
    }
  };

  const executeResetHWID = async () => {
    if (IS_PREVIEW_MOCK_MODE) {
      setLoading(true);
      setTimeout(() => {
        if (mockResetCount >= 3) {
          showToast("Giao dịch không thành công: Bạn đã vượt quá giới hạn cho phép (Tối đa 3 lần reset trong 24 giờ)!", "error");
          setLoading(false);
          return;
        }
        setMockResetCount(prev => prev + 1);
        setProfile(prev => ({ ...prev, hardware_id: null }));
        setLoading(false);
        showToast(`Hủy liên kết máy thành công! (Lần ${mockResetCount + 1}/3 - Chế độ Xem thử)`, "success");
      }, 1000);
      return;
    }

    const supabaseClient = getSupabase();
    if (!supabaseClient) return;

    setLoading(true);
    const { error } = await supabaseClient.rpc('reset_hwid', { p_license_key: profile.license_key });
    if (!error) {
      showToast("Hủy liên kết máy thành công! License đã sẵn sàng cho thiết bị mới.", "success");
      fetchProfile(session.user.id);
    } else {
      showToast("Giao dịch không thành công: " + error.message, "error");
      setLoading(false);
    }
  };

  const handleResetHWID = () => {
    if (!profile?.license_key) return;
    setConfirmModal({
      show: true,
      message: language === 'VN' 
        ? "Xác nhận hủy liên kết với máy tính hiện tại? Bạn sẽ phải nhập lại License Key trên máy mới." 
        : "Confirm unlinking current computer? You will need to re-enter your License Key on a new device.",
      onConfirm: executeResetHWID
    });
  };

  const handleLoginGoogle = async () => {
    if (IS_PREVIEW_MOCK_MODE) {
      setLoading(true);
      setTimeout(() => {
        setSession(MOCK_SESSION_DATA);
        setProfile(MOCK_PROFILE_DATA);
        setLoading(false);
        showToast("Đăng nhập thành công dưới dạng tài khoản Xem thử!", "success");
      }, 500);
      return;
    }

    const supabaseClient = getSupabase();
    if (!supabaseReady || !supabaseClient) {
        return showToast("Cổng Supabase chưa tải xong, vui lòng thử lại sau.", "error");
    }
    setLoading(true);
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin, queryParams: { access_type: 'offline', prompt: 'consent' } }
    });
    if (error) {
        showToast("Lỗi kết nối đăng nhập: " + error.message, "error");
        setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (IS_PREVIEW_MOCK_MODE) {
      setSession(null);
      setProfile(null);
      setShowPayment(false);
      setMockResetCount(0); 
      showToast("Đã đăng xuất tài khoản giả lập.", "info");
      return;
    }

    const supabaseClient = getSupabase();
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    }
    setSession(null);
    setProfile(null);
    setShowPayment(false);
    showToast("Đã đăng xuất tài khoản.", "info");
  };

  const handleDownloadMain = () => { 
    if (!session) {
      setConfirmModal({
        show: true,
        type: 'login',
        title: language === 'VN' ? 'Yêu cầu đăng nhập' : 'Login Required',
        message: language === 'VN' 
          ? 'Vui lòng đăng nhập tài khoản Google để nhận mã bản quyền (License Key) và tải bản dùng thử OpenSkp.'
          : 'Please log in with Google to receive your License Key and download OpenSkp Free Trial.',
        confirmText: language === 'VN' ? 'Đăng nhập ngay' : 'Log in Now',
        cancelText: language === 'VN' ? 'Để sau' : 'Later',
        onConfirm: () => {
          handleLoginGoogle();
        }
      });
      showToast(
        language === 'VN' 
          ? 'Vui lòng đăng nhập để tải bản dùng thử OpenSkp!' 
          : 'Please log in to download OpenSkp Free trial!', 
        'info'
      );
      return;
    }

    if (DRIVE_DOWNLOAD_LINK) {
      window.open(DRIVE_DOWNLOAD_LINK, '_blank'); 
    } else {
      showToast(
        language === 'VN'
          ? "Đường dẫn tải plugin OpenSkp hiện chưa khả dụng (Vui lòng thiết lập VITE_DRIVE_DOWNLOAD_LINK)"
          : "OpenSkp plugin download link is currently unavailable (Please set VITE_DRIVE_DOWNLOAD_LINK)", 
        "error"
      );
    }
  };

  const handleTopup = () => {
    if (!session) {
      setConfirmModal({
        show: true,
        type: 'login',
        title: language === 'VN' ? 'Yêu cầu đăng nhập' : 'Login Required',
        message: language === 'VN' 
          ? 'Vui lòng đăng nhập tài khoản để xem bảng giá và đăng ký bản quyền OpenSkp.'
          : 'Please log in to view pricing and purchase an OpenSkp license.',
        confirmText: language === 'VN' ? 'Đăng nhập ngay' : 'Log in Now',
        cancelText: language === 'VN' ? 'Để sau' : 'Later',
        onConfirm: () => {
          handleLoginGoogle();
        }
      });
      showToast(
        language === 'VN' 
          ? "Vui lòng đăng nhập để xem bảng giá và thanh toán" 
          : "Please log in to view pricing and checkout", 
        "info"
      );
      return;
    }
    setShowPayment(true);
    setPaymentMethod('VND');
    setPaypalSuccess(null);
  };

  const handleSwitchMethod = (method) => {
    setPaymentMethod(method);
    setPaypalSuccess(null);
  };

  const getVietQRUrl = () => {
    if (!profile) return "";
    const key = profile.license_key || 'UNKNOWN';
    const shortKey = key.split('-').pop() || key; 
    const DESCRIPTION = `OPENSKP ${shortKey}`;

    if (!BANK_ID || !BANK_ACCOUNT) {
      return "https://placehold.co/300x300/fdfbf7/0063A3?text=VietQR+Simulated";
    }
    return `https://img.vietqr.io/image/${BANK_ID}-${BANK_ACCOUNT}-compact2.png?amount=${OPENSKP_PRICE_VND}&addInfo=${encodeURIComponent(DESCRIPTION)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;
  };

  const copyToClipboard = async (text, isKey = false) => {
    if (text) {
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(text);
        } else {
          const textarea = document.createElement("textarea");
          textarea.value = text;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }
        
        if (isKey) {
            setKeyCopySuccess(true);
            setTimeout(() => setKeyCopySuccess(false), 2000);
        } else {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
        showToast("Đã sao chép vào bộ nhớ tạm!", "success");
      } catch (err) {
        console.error('Failed to copy', err);
        showToast("Không thể tự động sao chép. Vui lòng bôi đen sao chép thủ công.", "error");
      }
    }
  };

  return (
    <div 
      className="min-h-screen text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col relative"
      style={{ 
          fontFamily: 'var(--app-font)',
          backgroundColor: BG_COLOR,
          backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
          backgroundSize: '20px 20px'
      }}
    >
      <BackgroundDecorations />

      {IS_PREVIEW_MOCK_MODE && (
        <div className="bg-amber-500 text-amber-950 font-semibold text-center text-xs py-1 relative z-50 shrink-0">
          ⚠️ Chế độ Xem thử trên Canvas đang bật để tránh lỗi biên dịch. Thay đổi <code>const IS_PREVIEW_MOCK_MODE = false;</code> khi triển khai môi trường thật.
        </div>
      )}

      {toast.show && (
        <div className={`fixed top-4 right-4 z-[110] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl border animate-in slide-in-from-top-4 duration-300 ${
          toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
          toast.type === 'error' ? 'bg-rose-50 text-rose-800 border-rose-200' :
          'bg-blue-50 text-blue-800 border-blue-200'
        }`}>
          <span className="text-sm font-semibold">{toast.message}</span>
          <button onClick={() => setToast({ ...toast, show: false })} className="hover:opacity-75 transition ml-1">
            <X size={16} />
          </button>
        </div>
      )}

      {confirmModal.show && (
        <div className="fixed inset-0 z-[105] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200 border border-slate-100 text-slate-800 font-sans" style={{ fontFamily: 'var(--app-font)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 ${confirmModal.type === 'login' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-yellow-50 text-yellow-600 border-yellow-200'} rounded-full flex items-center justify-center border shrink-0`}>
                {confirmModal.type === 'login' ? <User size={20} /> : <AlertTriangle size={20} />}
              </div>
              <h4 className="text-lg font-bold font-sans text-slate-800" style={{ color: PRIMARY_COLOR, fontFamily: 'var(--app-font)' }}>
                {confirmModal.title || (language === 'VN' ? 'Xác nhận thao tác' : 'Confirm Action')}
              </h4>
            </div>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed text-justify font-sans" style={{ fontFamily: 'var(--app-font)' }}>{confirmModal.message}</p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setConfirmModal({ show: false, onConfirm: null, message: '', title: '', type: '' })}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition cursor-pointer font-sans"
                style={{ fontFamily: 'var(--app-font)' }}
              >
                {confirmModal.cancelText || (language === 'VN' ? 'Hủy bỏ' : 'Cancel')}
              </button>
              <button 
                onClick={() => {
                  const cb = confirmModal.onConfirm;
                  setConfirmModal({ show: false, onConfirm: null, message: '', title: '', type: '' });
                  if (cb) cb();
                }}
                className="px-5 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition shadow-sm cursor-pointer flex items-center gap-2 font-sans"
                style={{ backgroundColor: PRIMARY_COLOR, fontFamily: 'var(--app-font)' }}
              >
                {confirmModal.type === 'login' && <User size={15} />}
                <span>{confirmModal.confirmText || (language === 'VN' ? 'Đồng ý' : 'Confirm')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showPayment && (
          <PaymentModal 
            t={t} 
            language={language}
            paymentMethod={paymentMethod} 
            handleSwitchMethod={handleSwitchMethod} 
            setShowPayment={setShowPayment} 
            paypalSuccess={paypalSuccess} 
            profile={profile} 
            getVietQRUrl={getVietQRUrl} 
            setPaypalSuccess={setPaypalSuccess} 
            showToast={showToast}
            paypalSdkReady={paypalSdkReady}
          />
      )}
      
      <Navbar 
          t={t} 
          handleTopup={handleTopup} 
          session={session} 
          profile={profile} 
          handleLogout={handleLogout} 
          handleLoginGoogle={handleLoginGoogle} 
          language={language} 
          setLanguage={setLanguage} 
          keyCopySuccess={keyCopySuccess} 
          copyToClipboard={copyToClipboard}
          handleResetHWID={handleResetHWID}
          loading={loading}
          handleDownloadMain={handleDownloadMain}
          onOpenGuide={() => {
            setCurrentView('guide');
            setTimeout(() => {
              document.getElementById('guide-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
      />
      
      <main className="flex-grow w-full relative z-10 flex flex-col items-center justify-start pb-16">
          <HeroSection 
            t={t} 
            handleDownloadMain={handleDownloadMain} 
            currentView={currentView}
            setCurrentView={setCurrentView}
          />

          {currentView === 'home' ? (
            <ShowcaseSection 
              t={t} 
              language={language}
              PRIMARY_COLOR={PRIMARY_COLOR} 
              onOpenGuide={() => {
                setCurrentView('guide');
                setTimeout(() => {
                  document.getElementById('guide-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
            />
          ) : (
            <InteractiveGuideSection 
              t={t} 
              language={language}
              PRIMARY_COLOR={PRIMARY_COLOR} 
              profile={profile} 
              session={session} 
              copyToClipboard={copyToClipboard} 
              keyCopySuccess={keyCopySuccess}
              onBackHome={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}
      </main>
      
      <footer className="mt-auto border-t border-slate-200 bg-white/60 backdrop-blur-sm py-8 relative z-10">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
              <div>{t.footerRights}</div>
              <div className="flex gap-6">
                      <a href="#" className="hover:text-blue-600 transition">{t.footerTerms}</a>
                      <a href="#" className="hover:text-blue-600 transition">{t.footerPrivacy}</a>
                      {FACEBOOK_LINK && (
                        <a href={FACEBOOK_LINK} target="_blank" rel="noreferrer" className="hover:text-blue-600 transition">{t.footerContact}</a>
                      )}
              </div>
          </div>
      </footer>
      
      {/* NÚT LIÊN HỆ ZALO & FACEBOOK */}

      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
          {FACEBOOK_LINK && (
            <a href={FACEBOOK_LINK} target="_blank" rel="noreferrer" className="w-12 h-12 text-white rounded-full flex items-center justify-center shadow-lg transition transform hover:scale-110" style={{ backgroundColor: PRIMARY_COLOR }}>
              <Facebook className="w-6 h-6" />
            </a>
          )}
          {ZALO_LINK && (
            <a href={ZALO_LINK} target="_blank" rel="noreferrer" className="w-12 h-12 text-white rounded-full flex items-center justify-center shadow-lg transition transform hover:scale-110 ring-2 ring-white" style={{ backgroundColor: PRIMARY_COLOR }}>
              <MessageCircle className="w-6 h-6" />
            </a>
          )}
      </div>
    </div>
  );
}