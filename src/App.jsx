// KẾT NỐI ONLINE: IMPORT THƯ VIỆN CHÍNH
import React, { useState, useRef, useEffect } from 'react';
/* Import bộ icon từ lucide-react */
import { 
  CreditCard, Copy, Download, LogOut, Loader2, Zap, 
  Box, User, CheckCircle2, X, Star, PlayCircle, LibraryBig,
  Facebook, MessageCircle, Globe, Plus, Menu, ArrowRight, ArrowLeft, BookOpen,
  Mic, Image as ImageIcon, Send, History, LayoutTemplate, ScanEye,
  MoreVertical, Eye, EyeOff, Key, AlertTriangle
} from 'lucide-react';

// ==============================================================================
// 1. CẤU HÌNH BẬT/TẮT CHẾ ĐỘ XEM THỬ (MOCK MODE FOR CANVAS PREVIEW)
// ==============================================================================
// ĐẶT LÀ true: Để chạy thử giao diện, test tính năng ngay trên Canvas không bị lỗi biên dịch.
// ĐẶT LÀ false: Khi deploy lên hosting thật (sẽ tự động kết nối Supabase & PayPal thật qua CDN).
const IS_PREVIEW_MOCK_MODE = false;

// Sử dụng cơ chế thực thi gián tiếp (dynamic evaluation) để đọc biến môi trường Vite.
// Thao tác này giúp triệt tiêu hoàn toàn lỗi cú pháp "import.meta" khi đóng gói ES2015.
const getMetaEnv = () => {
  try {
    return new Function('return import.meta.env')();
  } catch (e) {
    return {};
  }
};
const metaEnv = getMetaEnv();

// Toàn bộ các thông tin cấu hình nhạy cảm hiện tại đã được loại bỏ hoàn toàn giá trị fallback nhạy cảm
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || "";
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || "";
const PAYPAL_CLIENT_ID = metaEnv.VITE_PAYPAL_CLIENT_ID || "";

// Khởi tạo Supabase Client động nếu không ở chế độ giả lập
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

// Hàm tải động các thư viện JS từ CDN bảo mật
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

// CẤU HÌNH MÀU SẮC TỔNG THỂ
const PRIMARY_COLOR = "#0063A3";
const BG_COLOR = "#fdfbf7";

// TỪ ĐIỂN ĐA NGÔN NGỮ (TRANSLATIONS)
const TRANSLATIONS = {
  VN: {
    login: "Đăng nhập",
    logout: "Đăng xuất",
    credits: "VNĐ",
    licenseKey: "License Key",
    copyKey: "Sao chép Key",
    copyKeyBtn: "Copy Key Ngay",
    buyCredits: "Mua thêm Credits",
    heroTitle: "Xin chào, Kiến trúc sư!",
    heroSubtitle: "\"Bạn là nhà thiết kế - hãy để AI dựng hình cho bạn.\"",
    download: "Tải Plugin",
    guide: "Hướng dẫn",
    backHome: "Quay lại Trang chủ",
    footerRights: "© 2026 OpenSkp. Bảo lưu mọi quyền.",
    footerTerms: "Điều khoản sử dụng",
    footerPrivacy: "Chính sách bảo mật",
    footerContact: "Liên hệ",
    paymentTitle: "Nạp Credits",
    paymentVND: "VNĐ",
    paymentUSD: "USD",
    paymentTotal: "Tổng thanh toán:",
    paymentScan: "Quét mã để thanh toán tự động",
    paymentSuccess: "Thanh toán thành công!",
    paymentSuccessMsg: "Vui lòng gửi mã này cho Admin qua Zalo/Facebook.",
    paymentCardDesc: "Thẻ Tín dụng / Ghi nợ",
    loginToView: "Vui lòng đăng nhập..."
  },
  EN: {
    login: "Log in",
    logout: "Log out",
    credits: "VND",
    licenseKey: "License Key",
    copyKey: "Copy Key",
    copyKeyBtn: "Copy Key Now",
    buyCredits: "Buy Credits",
    heroTitle: "Hello, Architect!",
    heroSubtitle: "You are the designer - let AI do the modeling for you.",
    download: "Download Plugin",
    guide: "Guide",
    backHome: "Back to Home",
    footerRights: "© 2026 OpenSkp. All rights reserved.",
    footerTerms: "Terms of Use",
    footerPrivacy: "Privacy Policy",
    footerContact: "Contact",
    paymentTitle: "Buy Credits",
    paymentVND: "VND",
    paymentUSD: "USD",
    paymentTotal: "Total payment:",
    paymentScan: "Scan QR to pay automatically",
    paymentSuccess: "Payment Successful!",
    paymentSuccessMsg: "Please send this code to Admin via Zalo/Facebook.",
    paymentCardDesc: "Debit or Credit Card",
    loginToView: "Please login..."
  }
};

// DỮ LIỆU GIẢ LẬP ĐỂ TEST TRÊN CANVAS PREVIEW
const MOCK_SESSION_DATA = { user: { email: 'architect_test@openskp.com', id: 'mock-user-uuid-12345' } };
const MOCK_PROFILE_DATA = { wallet_balance: 150000, license_key: 'OPENSKP-V2-PREVIEW-ACTIVE', is_active: true, hardware_id: 'HWID-SKETCHUP-CLIENT-9999' };

// CÁC ĐƯỜNG DẪN & CẤU HÌNH THANH TOÁN (ĐÃ XÓA SẠCH NỘI DUNG NHẠY CẢM HARDCODED)
const ZALO_LINK = metaEnv.VITE_ZALO_LINK || "";
const FACEBOOK_LINK = metaEnv.VITE_FACEBOOK_LINK || "";
const DRIVE_DOWNLOAD_LINK = metaEnv.VITE_DRIVE_DOWNLOAD_LINK || "";

const BANK_ID = metaEnv.VITE_BANK_ID || ""; 
const BANK_ACCOUNT = metaEnv.VITE_BANK_ACCOUNT || ""; 
const ACCOUNT_NAME = metaEnv.VITE_BANK_ACCOUNT_NAME || ""; 

const PACKAGES_VND = [
  { id: 1, price: 50000, value: 50000, label: "Cơ bản", popular: false, currency: 'VND' },
  { id: 2, price: 100000, value: 105000, label: "Phổ biến (Tặng 5%)", popular: true, currency: 'VND' },
  { id: 3, price: 200000, value: 220000, label: "Nâng cao (Tặng 10%)", popular: false, currency: 'VND' },
  { id: 4, price: 500000, value: 575000, label: "Siêu hời (Tặng 15%)", popular: false, currency: 'VND' },
];

const PACKAGES_USD = [
  { id: 'usd_1', price: 2, value: 50000, label: "Basic", popular: false, currency: 'USD' },
  { id: 'usd_2', price: 4, value: 105000, label: "Popular (+5%)", popular: true, currency: 'USD' },
  { id: 'usd_3', price: 8, value: 220000, label: "Advanced (+10%)", popular: false, currency: 'USD' },
  { id: 'usd_4', price: 20, value: 575000, label: "Pro (+15%)", popular: false, currency: 'USD' },
];

// ==============================================================================
// GIẢ LẬP PAYPAL BUTTONS ĐỂ CHẠY THỬ TRÊN CANVAS KHÔNG LỖI BIÊN DỊCH
// ==============================================================================
const PayPalButtonContainer = ({ price, value, onSuccess, onError }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (IS_PREVIEW_MOCK_MODE) {
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <div class="bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold py-3 px-4 rounded-xl shadow cursor-pointer transition flex items-center justify-center gap-2 text-sm">
             <span>Pay with <b>PayPal</b> (Chế độ Xem thử)</span>
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
              description: `Buy ${value} Credits`
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
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none h-full w-full">
       <img
          src="/Sketch2.png"
          className="absolute top-[55%] -right-[5%] w-[45%] opacity-[0.15] rotate-[0deg]"
          alt="Decoration"
       />
       <img
          src="/Sketch1.png"
          className="absolute top-[25%] -left-[0%] w-[50%] opacity-[0.15] rotate-[-12deg] mix-blend-multiply"
          alt="Decoration"
          onError={(e) => e.target.style.display = 'none'}
       />
       <img
          src="/Sketch2.png"
          className="absolute top-[85%] -right-[5%] w-[30%] opacity-[0.04] rotate-[45deg] mix-blend-multiply"
          alt="Decoration"
          onError={(e) => e.target.style.display = 'none'}
       />
  </div>
);

const HeroSection = ({ t, handleDownload }) => (
  <div className="flex flex-col items-center text-center mb-24 mt-6 animate-fade-in px-4 relative z-20">
      <div className="relative z-0 -mb-0.5 pointer-events-none select-none">
          <img 
              src="/robot-drawing.png" 
              alt="Robot Architect" 
              className="w-60 sm:w-[24rem] h-auto object-contain"
              onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/300x300/fdfbf7/0063A3?text=Robot+PNG";
              }}
          />
      </div>
      <div className="relative z-10 pt-4">
          <h1 className="text-3xl font-serif sm:text-5xl mb-4 max-w-3xl leading-tight text-primary-brand" style={{ color: PRIMARY_COLOR }}>
              {t.heroTitle} <br/>
          </h1>
          <h1 className="text-lg sm:text-2xl mt-2 block text-primary-brand" style={{ color: PRIMARY_COLOR }}>
              {t.heroSubtitle}
          </h1>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mt-6 mb-1 relative z-20">
          <button 
              onClick={handleDownload}
              className="px-8 py-3 rounded-xl text-white font-bold text-lg shadow-lg hover:translate-y-[-2px] transition flex items-center justify-center gap-2"
              style={{ backgroundColor: PRIMARY_COLOR }}
          >
              <Download size={20} /> {t.download}
          </button>
      </div>
  </div>
);

const PaymentModal = ({ t, paymentMethod, handleSwitchMethod, selectedPkg, setSelectedPkg, setShowPayment, paypalSuccess, profile, getVietQRUrl, setPaypalSuccess, showToast, paypalSdkReady }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 ">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
          <div className="flex-1 p-6 bg-slate-50 border-r border-slate-100 flex flex-col">
              <h3 className="text-xl font-normal mb-4 flex items-center gap-2 font-serif" style={{ color: PRIMARY_COLOR }}>
                   {t.paymentTitle}
              </h3>
              <div className="flex bg-slate-200 p-1 rounded-xl mb-4 font-sans shrink-0">
                  <button onClick={() => handleSwitchMethod('VND')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${paymentMethod === 'VND' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}>
                      {t.paymentVND}
                  </button>
                  <button onClick={() => handleSwitchMethod('USD')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${paymentMethod === 'USD' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>
                      {t.paymentUSD}
                  </button>
              </div>
              <div className="space-y-3 flex-1 custom-scrollbar pr-1 overflow-y-auto">
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
                              <div className="font-bold text-slate-700">{pkg.value.toLocaleString('vi-VN')} {t.credits}</div>
                              <div className="text-xs text-slate-500">{pkg.label}</div>
                          </div>
                          <div className="text-blue-600 font-bold font-mono">
                              {paymentMethod === 'USD' ? '$' : ''}{pkg.price.toLocaleString('vi-VN')}{paymentMethod === 'VND' ? ' đ' : ''}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
          <div className="flex-1 flex flex-col bg-white relative overflow-y-auto custom-scrollbar">
               <button onClick={() => setShowPayment(false)} className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-full transition text-slate-500 z-10">
                  <X className="w-6 h-6"/>
              </button>
              <div className="px-8 pt-16 pb-8 flex flex-col items-center justify-start min-h-full text-center">
                  {paypalSuccess ? (
                       <div className="animate-fade-in w-full">
                          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle2 className="w-10 h-10" /></div>
                          <h3 className="text-xl font-bold text-slate-800">{t.paymentSuccess}</h3>
                          <div className="bg-slate-100 p-3 rounded-lg font-mono text-sm border border-slate-200 my-4 select-all text-slate-700">{paypalSuccess}</div>
                          <h5 className="text-slate-500 text-xs">{t.paymentSuccessMsg}</h5>
                      </div>
                  ) : (
                      <div className="w-full">
                          <h5 className="text-slate-500 text-sm mb-4">{t.paymentTotal} <span className="text-2xl font-bold text-slate-800 block mt-1">{selectedPkg.price.toLocaleString('vi-VN')} {paymentMethod === 'VND' ? 'đ' : '$'}</span></h5>
                          {paymentMethod === 'VND' ? (
                              <div className="bg-white p-2 border border-slate-200 rounded-xl shadow-sm inline-block">
                                  {profile ? (
                                      <img src={getVietQRUrl()} alt="VietQR" className="w-48 h-48 object-contain animate-fade-in" />
                                  ) : (
                                      <div className="w-48 h-48 flex items-center justify-center text-xs text-gray-400 bg-gray-50 rounded">
                                          <Loader2 className="animate-spin mr-2" /> {t.loginToView}
                                      </div>
                                  )}
                                  <h5 className="text-[10px] text-slate-400 mt-2">{t.paymentScan}</h5>
                              </div>
                          ) : (
                              <div className="w-full px-4 mt-4 relative z-0">
                                  <div className="h-4"></div>
                                  {(IS_PREVIEW_MOCK_MODE || paypalSdkReady) ? (
                                      <PayPalButtonContainer 
                                          price={selectedPkg.price}
                                          value={selectedPkg.value}
                                          onSuccess={(orderId) => {
                                              setPaypalSuccess(orderId);
                                              showToast("Thanh toán PayPal thành công!", "success");
                                          }}
                                          onError={() => {
                                              showToast("Giao dịch thất bại / Payment Failed", "error");
                                          }}
                                      />
                                  ) : (
                                      <div className="w-full h-12 flex items-center justify-center text-slate-400 bg-slate-50 rounded-xl border border-slate-100">
                                          <Loader2 className="animate-spin mr-2 w-4 h-4" /> Đang kết nối PayPal...
                                      </div>
                                  )}
                                  <div className="bg-blue-50 p-3 rounded-lg text-[10px] text-blue-800 mt-4 border border-blue-100">
                                      ℹ️ {t.paymentCardDesc}
                                  </div>
                                  <div className="h-4"></div>
                              </div>
                          )}
                      </div>
                  )}
              </div>
          </div>
      </div>
  </div>
);

const Navbar = ({ t, handleTopup, handleDownload, session, profile, handleLogout, handleLoginGoogle, language, setLanguage, keyCopySuccess, copyToClipboard, handleResetHWID, loading }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navTextStyle = {
      color: PRIMARY_COLOR,
      fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
      fontSize: '16px',
      marginTop: '6px',
      fontWeight: 400
  };

  const renderUserDashboard = () => (
      <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2 pl-2">
              <div className="text-right">
                  <div className="text-[10px] uppercase text-slate-400 font-normal tracking-wider leading-none mb-0.5">{t.credits}</div>
                  <div className="text-base font-normal leading-none" style={{ color: PRIMARY_COLOR }}>
                      <span>{Number(profile?.wallet_balance || 0).toLocaleString('vi-VN')}</span>
                  </div>
              </div>
              <button 
                  onClick={(e) => { e.stopPropagation(); handleTopup(); setIsMobileMenuOpen(false); }} 
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white shadow hover:scale-105 transition" 
                  style={{ backgroundColor: PRIMARY_COLOR }}
              >
                  <Plus size={16} strokeWidth={2} />
              </button>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg border border-slate-200">
                  <div className="flex flex-col items-start">
                  <span className="text-[9px] font-normal text-slate-400 uppercase leading-none">{t.licenseKey}</span>
                  <input 
                    type="text" 
                    readOnly 
                    value={profile?.license_key || 'Đang tạo mã...'} 
                    className="text-xs font-mono font-normal text-slate-700 leading-tight bg-transparent outline-none border-none w-24 cursor-default"
                  />
                  </div>
                  <button 
                  onClick={(e) => {
                      e.stopPropagation();
                      if(profile?.license_key){
                          copyToClipboard(profile.license_key, true);
                      }
                  }} 
                  className="text-slate-400 hover:text-blue-600 transition p-0.5 hover:bg-white rounded-md"
                  >
                  {keyCopySuccess ? <CheckCircle2 size={14} className="text-green-600"/> : <Copy size={14} />}
                  </button>
          </div>
      </div>
  );

  return (
    <nav className="border-b border-gray-200 sticky top-0 z-50 bg-[#fdfbf7]/95 backdrop-blur-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center relative">
            <div className="flex items-center gap-6 lg:gap-8">
                <div className="flex items-center gap-2 cursor-pointer group shrink-0" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMobileMenuOpen(false); }}>
                    <div className="group-hover:scale-110 transition-transform duration-300"><LogoSVG /></div>
                    <span className="font-serif font-normal text-2xl tracking-tight mt-1" style={{ color: PRIMARY_COLOR }}>OpenSkp</span>
                </div>
                <div className="hidden md:flex items-center gap-5 pt-1">
                    <button onClick={handleTopup} className="text-sm hover:opacity-70 transition hover:scale-105" style={navTextStyle}>{language === 'VN' ? 'Bảng giá' : 'Pricing'}</button>
                    <button onClick={handleDownload} className="text-sm hover:opacity-70 transition hover:scale-105" style={navTextStyle}>{t.download}</button>
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
                            <div className="bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 p-4 flex flex-col gap-3">
                                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex-shrink-0 flex items-center justify-center text-primary-brand border border-slate-100">
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
                                    <p className="text-xs font-semibold text-slate-500 mb-2">Thiết bị đang kết nối (HWID):</p>
                                    {profile?.hardware_id ? (
                                        <div>
                                            <p className="text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded mb-2 text-xs break-all">✓ {profile.hardware_id}</p>
                                            <button onClick={handleResetHWID} disabled={loading} className="w-full text-center px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold rounded-lg disabled:opacity-50 transition">
                                                {loading ? "Đang xử lý..." : "Hủy liên kết máy này"}
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1.5 rounded">Chưa khóa thiết bị nào.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button onClick={handleLoginGoogle} className="px-3 py-1.5 rounded-lg text-white font-normal text-xs shadow-md hover:opacity-90 transition flex items-center gap-2" style={{ backgroundColor: PRIMARY_COLOR }}>
                        <User size={14} /> <span>{t.login}</span>
                    </button>
                )}
                <button onClick={() => setLanguage(language === 'VN' ? 'EN' : 'VN')} className="flex items-center gap-1 text-slate-500 font-normal text-[10px] hover:text-slate-900 border border-slate-200 px-2 py-1 rounded-md bg-white">
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
                      <button onClick={() => { handleTopup(); setIsMobileMenuOpen(false); }} className="py-2 px-6 hover:bg-slate-50 transition w-full text-center text-base" style={navTextStyle}>{language === 'VN' ? 'Bảng giá' : 'Pricing'}</button>
                      <button onClick={() => { handleDownload(); setIsMobileMenuOpen(false); }} className="py-2 px-6 hover:bg-slate-50 transition w-full text-center text-base" style={navTextStyle}>{t.download}</button>
                    </div>
                    <div className="flex flex-col items-center gap-3 w-full px-4">
                        {session ? (
                            <>
                                <div className="scale-105 origin-center">{renderUserDashboard()}</div>
                                <div className="flex items-center justify-center gap-4 w-full mt-2">
                                    <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full truncate max-w-[200px]">
                                      <User size={14}/> <span className="truncate">{session.user.email}</span>
                                    </div>
                                    <button onClick={handleLogout} className="flex items-center gap-1 text-red-500 bg-red-50 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-red-100 transition shrink-0">
                                        <LogOut size={14} /> {t.logout}
                                    </button>
                                </div>
                                <div className="w-full max-w-xs mt-2 p-3 bg-white border border-slate-100 shadow-sm rounded-xl text-left">
                                    <p className="text-xs font-semibold text-slate-500 mb-2">Trạng thái khóa máy (HWID):</p>
                                    {profile?.hardware_id ? (
                                        <div>
                                            <p className="text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded mb-2 text-xs break-all">✓ {profile.hardware_id}</p>
                                            <button onClick={handleResetHWID} disabled={loading} className="w-full text-center px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold rounded-lg disabled:opacity-50 transition">
                                                {loading ? "Đang xử lý..." : "Hủy liên kết máy này"}
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1.5 rounded">Chưa khóa thiết bị nào.</p>
                                    )}
                                </div>
                            </>
                        ) : (
                            <button onClick={() => { handleLoginGoogle(); setIsMobileMenuOpen(false); }} className="w-full max-w-xs py-3 rounded-lg text-white font-normal text-sm shadow-md flex items-center justify-center gap-2" style={{ backgroundColor: PRIMARY_COLOR }}>
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
  
  // QUẢN LÝ TRẠNG THÁI (STATE)
  const [session, setSession] = useState(null); 
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('VN');
  const [copySuccess, setCopySuccess] = useState(false);
  const [keyCopySuccess, setKeyCopySuccess] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('VND');
  const [selectedPkg, setSelectedPkg] = useState(PACKAGES_VND[0]);
  const [paypalSuccess, setPaypalSuccess] = useState(null);
  
  // Trạng thái tải thư viện cho CDN (Khi deploy thật)
  const [supabaseReady, setSupabaseReady] = useState(false);
  const [paypalSdkReady, setPaypalSdkReady] = useState(false);

  // Bộ đếm số lần hủy khóa thiết bị HWID giả lập để phục vụ kiểm thử chế độ Xem thử (Lớp phòng vệ 2)
  const [mockResetCount, setMockResetCount] = useState(0);

  // Hệ thống thông báo tự phát triển (Toast State)
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  
  // Hộp thoại xác nhận hành động tự phát triển (Confirmation Modal State)
  const [confirmModal, setConfirmModal] = useState({ show: false, message: '', onConfirm: null });

  // UseRef lưu trữ giá trị Profile mới nhất để ngăn chặn rò rỉ hoặc resubscribe Realtime
  const latestProfileRef = useRef(profile);
  useEffect(() => {
    latestProfileRef.current = profile;
  }, [profile]);

  const t = TRANSLATIONS[language];

  // Hàm hiển thị thông báo thay thế alert()
  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3500);
  };

  // KÍCH HOẠT TIẾN TRÌNH TẢI CDN TRÊN THIẾT BỊ THẬT (KHI IS_PREVIEW_MOCK_MODE = FALSE)
  useEffect(() => {
    if (IS_PREVIEW_MOCK_MODE) {
      // Ở chế độ Xem thử trên Canvas, tự động đăng nhập tài khoản giả lập ngay lập tức để người dùng tương tác
      setSession(MOCK_SESSION_DATA);
      setProfile(MOCK_PROFILE_DATA);
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

  // Tải PayPal SDK động khi người dùng ở môi trường thật
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

  // KẾT NỐI REALTIME & AUTHENTICATION (KHI IS_PREVIEW_MOCK_MODE = FALSE)
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

  // Đăng ký kênh Realtime để tự cập nhật số dư khi khách hàng nạp SePay thành công
  // VÁ LỖ HỔNG 3: Luôn sử dụng Secure Pull từ DB chính chủ khi có sự kiện Realtime thay vì tin ngay Client payload
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
          console.log("🔔 Nhận tín hiệu Realtime từ Postgres, đang tiến hành kéo dữ liệu xác minh (Secure Pull)...");
          
          try {
            // Thực hiện kéo độc lập có màng lọc auth.uid() để đảm bảo tính an toàn chống hacker can thiệp client package
            const verifiedData = await fetchProfile(session.user.id);
            if (verifiedData) {
              const oldBalance = latestProfileRef.current?.wallet_balance || 0;
              const newBalance = verifiedData.wallet_balance || 0;

              // Đối soát: Chỉ cập nhật giao diện nạp tiền thành công nếu số dư thực tế trong DB đã tăng lên thực sự
              if (newBalance > oldBalance) {
                if (showPayment && paymentMethod === 'VND') {
                   setShowPayment(false);
                   setTimeout(() => showToast("Đã nhận được giao dịch nạp tiền! Tài khoản đã được cập nhật số dư.", "success"), 500);
                }
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
      return data; // Trả về dữ liệu chính chủ để làm màng lọc xác thực Realtime
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
        // KIỂM THỬ GIẢ LẬP LỖ HỔNG 4: Trình diễn lỗi ném ra từ cơ sở dữ liệu nếu vượt quá 3 lần
        if (mockResetCount >= 3) {
          showToast("Giao dịch không thành công: Bạn đã vượt quá giới hạn cho phép (Tối đa 3 lần reset trong 24 giờ)!", "error");
          setLoading(false);
          return;
        }
        
        // Ghi nhận tăng lượt reset giả lập
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
    // Gọi hàm RPC nạp vào Postgres đã gia cố logic bảo mật đếm log reset 24 giờ qua
    const { error } = await supabaseClient.rpc('reset_hwid', { p_license_key: profile.license_key });
    if (!error) {
      showToast("Hủy liên kết máy thành công! License đã sẵn sàng cho thiết bị mới.", "success");
      fetchProfile(session.user.id);
    } else {
      // Nhận trực tiếp thông điệp lỗi tự định nghĩa "Bạn đã vượt quá giới hạn cho phép..." từ database ném ra
      showToast("Giao dịch không thành công: " + error.message, "error");
      setLoading(false);
    }
  };

  const handleResetHWID = () => {
    if (!profile?.license_key) return;
    setConfirmModal({
      show: true,
      message: "Xác nhận hủy liên kết với máy tính hiện tại? Bạn sẽ phải nhập lại License Key trên máy mới.",
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
      setMockResetCount(0); // Đưa số lần reset giả lập về lại ban đầu
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

  const handleDownload = () => { 
    if (DRIVE_DOWNLOAD_LINK) {
      window.open(DRIVE_DOWNLOAD_LINK, '_blank'); 
    } else {
      showToast("Đường dẫn tải plugin hiện chưa khả dụng (Vui lòng thiết lập VITE_DRIVE_DOWNLOAD_LINK)", "error");
    }
  };

  const handleTopup = () => {
    if (!session) return showToast("Vui lòng đăng nhập để mua Credits", "error");
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

  const getVietQRUrl = () => {
    if (!profile || !selectedPkg) return "";
    const key = profile.license_key || 'UNKNOWN';
    const DESCRIPTION = `${key.split('-')[1] || key}`; 
    // Trả về ảnh giả lập khi chạy thử không có cấu hình ngân hàng thật
    if (!BANK_ID || !BANK_ACCOUNT) {
      return "https://placehold.co/300x300/fdfbf7/0063A3?text=VietQR+Simulated";
    }
    return `https://img.vietqr.io/image/${BANK_ID}-${BANK_ACCOUNT}-compact2.png?amount=${selectedPkg.price}&addInfo=${encodeURIComponent(DESCRIPTION)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;
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
          backgroundColor: BG_COLOR,
          backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
          backgroundSize: '20px 20px'
      }}
    >
      <BackgroundDecorations />

      {/* THÔNG BÁO BẬT CHẾ ĐỘ XEM THỬ */}
      {IS_PREVIEW_MOCK_MODE && (
        <div className="bg-amber-500 text-amber-950 font-semibold text-center text-xs py-1 relative z-50 shrink-0">
          ⚠️ Chế độ Xem thử trên Canvas đang bật để tránh lỗi biên dịch. Thay đổi <code>const IS_PREVIEW_MOCK_MODE = false;</code> khi triển khai môi trường thật.
        </div>
      )}

      {/* ----------------- HỆ THỐNG TOAST NOTIFICATION TỰ THIẾT KẾ ----------------- */}
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

      {/* ----------------- HỘP THOẠI CONFIRM MODAL TỰ THIẾT KẾ ----------------- */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-[105] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center border border-yellow-200">
                <AlertTriangle size={20} />
              </div>
              <h4 className="text-lg font-bold text-slate-800 font-serif" style={{ color: PRIMARY_COLOR }}>Xác nhận thao tác</h4>
            </div>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">{confirmModal.message}</p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setConfirmModal({ show: false, onConfirm: null, message: '' })}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={() => {
                  if (confirmModal.onConfirm) confirmModal.onConfirm();
                  setConfirmModal({ show: false, onConfirm: null, message: '' });
                }}
                className="px-4 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition shadow-sm"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}

      {showPayment && (
          <PaymentModal 
            t={t} 
            paymentMethod={paymentMethod} 
            handleSwitchMethod={handleSwitchMethod} 
            selectedPkg={selectedPkg} 
            setSelectedPkg={setSelectedPkg} 
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
          handleDownload={handleDownload} 
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
      />
      
      <main className="flex-grow w-full relative z-10 flex flex-col items-center justify-center">
          <HeroSection t={t} handleDownload={handleDownload} />
      </main>
      
      <footer className="mt-auto border-t border-slate-200 bg-white/60 backdrop-blur-sm py-8 relative z-10">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
              <div>{t.footerRights}</div>
              <div className="flex gap-6">
                      <a href="#" className="hover:text-blue-600">{t.footerTerms}</a>
                      <a href="#" className="hover:text-blue-600">{t.footerPrivacy}</a>
                      {FACEBOOK_LINK && (
                        <a href={FACEBOOK_LINK} target="_blank" rel="noreferrer" className="hover:text-blue-600">{t.footerContact}</a>
                      )}
              </div>
          </div>
      </footer>
      
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