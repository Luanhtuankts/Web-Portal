// KẾT NỐI ONLINE: IMPORT THƯ VIỆN CHÍNH
/* Thư viện kết nối Database và Auth */
import React, { useState, useRef, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
/* Import bộ icon từ lucide-react */
import { 
  CreditCard, Copy, Download, LogOut, Loader2, Zap, 
  Box, User, CheckCircle2, X, Star, PlayCircle, LibraryBig ,
  Facebook, MessageCircle, Globe, Plus, Menu, ArrowRight, ArrowLeft, BookOpen,
  Mic, Image as ImageIcon, Send, History, LayoutTemplate, ScanEye,
  MoreVertical, Eye, EyeOff, Key
} from 'lucide-react';

// ==============================================================================
// 1. CẤU HÌNH SUPABASE (ĐÃ ĐIỀN KEY CHUẨN CỦA BẠN)
// ==============================================================================
const supabaseUrl = "https://rwptjxjtxdvvlmsbzbec.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3cHRqeGp0eGR2dmxtc2J6YmVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMDkxMTcsImV4cCI6MjA3OTc4NTExN30.RRXlEviP64hJ6jsmLa1P013CBkXuw4AQpErBixg0K64"; 

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

// DỮ LIỆU GIẢ LẬP (MOCK DATA)
const MOCK_SESSION = { user: { email: 'architect@openskp.com', id: 'mock-user-id' } };
const MOCK_PROFILE = { wallet_balance: 20000, license_key: 'OSKP-8822-1133-PRO', is_active: true, hardware_id: 'HW-8822-1133' };

// CÁC ĐƯỜNG DẪN & CẤU HÌNH THANH TOÁN
const ZALO_LINK = "https://zalo.me/0965585879";
const FACEBOOK_LINK = "https://web.facebook.com/tuan.936796/";
const DRIVE_DOWNLOAD_LINK = "https://rwptjxjtxdvvlmsbzbec.supabase.co/storage/v1/object/public/openskp-library/Openskp%202.1.rar";

const BANK_ID = "MB"; 
const BANK_ACCOUNT = "0965585879"; 
const ACCOUNT_NAME = "OPEN SKP"; 

const PAYPAL_CLIENT_ID = "ARPc_R309yq_8l2tkRJCxb6TooyNcfrF-LNN7AKv6UdlCaVSK5t6Sh8tbyS0_6hlq5lCfORUVhwXJ1Wn";

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
// CÁC SUB-COMPONENTS
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

const PaymentModal = ({ t, paymentMethod, handleSwitchMethod, selectedPkg, setSelectedPkg, setShowPayment, paypalSuccess, profile, getVietQRUrl, setPaypalSuccess }) => (
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
                                      <img src={getVietQRUrl()} alt="VietQR" className="w-48 h-48 object-contain" />
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
                                  <PayPalButtons 
                                      key={selectedPkg.id}
                                      style={{ layout: "vertical", shape: "rect", label: "checkout", height: 48 }}
                                      createOrder={(data, actions) => {
                                          return actions.order.create({
                                              purchase_units: [{
                                                  amount: { value: selectedPkg.price.toString() },
                                                  description: `Buy ${selectedPkg.value} Credits`
                                              }]
                                          });
                                      }}
                                      onApprove={async (data, actions) => {
                                          const order = await actions.order.capture();
                                          setPaypalSuccess(order.id);
                                      }}
                                      onError={(err) => {
                                          console.error("PayPal Error:", err);
                                          alert("Giao dịch thất bại / Payment Failed");
                                      }}
                                  />
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
      <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
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
                    className="text-xs font-mono font-normal text-slate-700 leading-tight bg-transparent outline-none border-none w-24"
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
  
  const t = TRANSLATIONS[language];

  // KẾT NỐI: AUTHENTICATION & REALTIME
  useEffect(() => {
    if (!supabaseUrl) { setLoading(false); return; }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
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
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = supabase
      .channel('realtime-credits')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'users_v2', filter: `id=eq.${session.user.id}` },
        (payload) => {
          console.log("🔔 Data thay đổi từ Server:", payload.new);
          setProfile(payload.new);
          if (showPayment && paymentMethod === 'VND') {
             setShowPayment(false);
             setTimeout(() => alert(`✅ Đã nhận được tiền! Tài khoản đã được cập nhật số dư.`), 500);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [session, showPayment, paymentMethod]);

  const fetchProfile = async (userId, isRetry = false) => {
    try {
      // Thử lấy dữ liệu ngay lập tức (Xử lý trường hợp F5 tải lại trang)
      const { data, error } = await supabase
        .from('users_v2')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      setProfile(data);
      console.log("✅ Lấy dữ liệu thành công:", data);
      
    } catch (err) {
      console.error("⚠️ Lỗi lấy dữ liệu V2:", err.message);
      
      // Lỗi thường gặp nhất: Trigger chạy chưa xong, hoặc RLS đang chặn
      if (!isRetry) {
        console.log("⏳ Đang thử tải lại sau 1.5s (Chờ hệ thống tạo mã)...");
        setTimeout(() => fetchProfile(userId, true), 1500);
      } else {
        console.error("❌ Vẫn không lấy được dữ liệu. Hãy kiểm tra lại RLS trên Supabase.");
      }
    }
  };

  const handleResetHWID = async () => {
    if (!profile?.license_key) return;
    if (!window.confirm("Xác nhận hủy liên kết với máy tính hiện tại? Bạn sẽ phải nhập lại License Key trên máy mới.")) return;
    setLoading(true);
    const { error } = await supabase.rpc('reset_hwid', { p_license_key: profile.license_key });
    if (!error) {
      alert("Hủy khóa máy thành công! License đã sẵn sàng cho thiết bị mới.");
      fetchProfile(session.user.id);
    } else {
      alert("Lỗi: " + error.message);
      setLoading(false);
    }
  };

  const handleLoginGoogle = async () => {
    if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
        return alert("Lỗi cấu hình! Vui lòng kiểm tra file .env.local");
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin, queryParams: { access_type: 'offline', prompt: 'consent' } }
    });
    if (error) {
        alert("Lỗi đăng nhập Google: " + error.message);
        setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setShowPayment(false);
  };

  const handleDownload = () => { window.open(DRIVE_DOWNLOAD_LINK, '_blank'); };

  const handleTopup = () => {
    if (!session) return alert("Vui lòng đăng nhập để mua Credits");
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

  return (
    <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID }}>
      <div 
        className="min-h-screen text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col relative"
        style={{ 
            backgroundColor: BG_COLOR,
            backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
            backgroundSize: '20px 20px'
        }}
      >
        <BackgroundDecorations />

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
                        <a href={FACEBOOK_LINK} target="_blank" rel="noreferrer" className="hover:text-blue-600">{t.footerContact}</a>
                </div>
            </div>
        </footer>
        
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
            <a href={FACEBOOK_LINK} target="_blank" rel="noreferrer" className="w-12 h-12 text-white rounded-full flex items-center justify-center shadow-lg transition transform hover:scale-110" style={{ backgroundColor: PRIMARY_COLOR }}>
                <Facebook className="w-6 h-6" />
            </a>
            <a href={ZALO_LINK} target="_blank" rel="noreferrer" className="w-12 h-12 text-white rounded-full flex items-center justify-center shadow-lg transition transform hover:scale-110 ring-2 ring-white" style={{ backgroundColor: PRIMARY_COLOR }}>
                <MessageCircle className="w-6 h-6" />
            </a>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}