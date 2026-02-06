import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"; // Cần cài: npm install @paypal/react-paypal-js
import { 
  CreditCard, Copy, Download, LogOut, Loader2, Zap, ShieldCheck, 
  Box, User, CheckCircle2, X, Star, PlayCircle, Facebook, MessageCircle 
} from 'lucide-react';

/* ==================================================================================
 * PHẦN 1: CẤU HÌNH HỆ THỐNG & HẰNG SỐ
 * ================================================================================== */

const getEnv = (key) => {
  try { return import.meta.env?.[key]; } 
  catch (e) { return undefined; }
};

const SUPABASE_CONFIG = {
  url: getEnv('VITE_SUPABASE_URL'),
  anonKey: getEnv('VITE_SUPABASE_ANON_KEY'),
};

// --- CẤU HÌNH LIÊN HỆ ---
const LINKS = {
  ZALO: "https://zalo.me/0965585879",
  FACEBOOK: "https://www.facebook.com/openskp", // <--- Thay link Facebook của bạn vào đây
  DRIVE_DOWNLOAD: "https://drive.google.com/file/d/1TOwlNNs3L5C9hCiV-LX4dcpLG4y3HzPo/view?usp=sharing",
  YOUTUBE_GUIDE: "https://www.youtube.com/watch?v=CfP27yN0jwE",
};

// --- CẤU HÌNH NGÂN HÀNG (VIETQR) ---
const BANK_INFO = {
  ID: "MB",
  ACCOUNT: "0965585879",
  NAME: "OPEN SKP",
};

// --- CẤU HÌNH PAYPAL ---
// Lấy Client ID tại: https://developer.paypal.com/dashboard/
const PAYPAL_CLIENT_ID = "YOUR_PAYPAL_CLIENT_ID"; // <--- QUAN TRỌNG: Hãy thay Client ID của bạn vào đây

// --- CẤU HÌNH CÁC GÓI CREDITS (VNĐ) ---
const PACKAGES_VND = [
  { id: 'vnd_1', price: 50000, credits: 100, label: "Cơ bản", popular: false, currency: 'VND' },
  { id: 'vnd_2', price: 100000, credits: 250, label: "Phổ biến", popular: true, currency: 'VND' },
  { id: 'vnd_3', price: 200000, credits: 550, label: "Nâng cao", popular: false, currency: 'VND' },
  { id: 'vnd_4', price: 500000, credits: 1500, label: "Siêu hời", popular: false, currency: 'VND' },
];

// --- CẤU HÌNH CÁC GÓI CREDITS (USD - PAYPAL) ---
const PACKAGES_USD = [
  { id: 'usd_1', price: 2, credits: 100, label: "Basic", popular: false, currency: 'USD' },
  { id: 'usd_2', price: 4, credits: 250, label: "Popular", popular: true, currency: 'USD' },
  { id: 'usd_3', price: 8, credits: 550, label: "Advanced", popular: false, currency: 'USD' },
  { id: 'usd_4', price: 20, credits: 1500, label: "Pro", popular: false, currency: 'USD' },
];

/* ==================================================================================
 * PHẦN 2: KHỞI TẠO DỊCH VỤ
 * ================================================================================== */

if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
  console.warn("⛔ LƯU Ý: Chưa cấu hình biến môi trường Supabase.");
}

const supabase = createClient(
  SUPABASE_CONFIG.url || 'https://placeholder.supabase.co', 
  SUPABASE_CONFIG.anonKey || 'placeholder'
);

/* ==================================================================================
 * PHẦN 3: MAIN COMPONENT (APP)
 * ================================================================================== */

export default function App() {
  // --- STATE MANAGEMENT ---
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // State Thanh toán
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('VND'); // 'VND' hoặc 'USD'
  const [selectedPkg, setSelectedPkg] = useState(PACKAGES_VND[0]);
  
  // State kết quả thanh toán PayPal
  const [paypalSuccess, setPaypalSuccess] = useState(null); // Lưu transaction ID

  // --- EFFECT: AUTH & REALTIME ---
  useEffect(() => {
    if (!SUPABASE_CONFIG.url || SUPABASE_CONFIG.url.includes('placeholder')) { 
        setLoading(false); return; 
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else { setProfile(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Realtime Credits Update
  useEffect(() => {
    if (!session?.user?.id) return;
    const channel = supabase.channel('realtime-credits')
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${session.user.id}` },
        (payload) => {
          setProfile(payload.new);
          if (showPayment && paymentMethod === 'VND') {
             setShowPayment(false);
             setTimeout(() => alert(`✅ Đã nhận được tiền! Tài khoản đã được cộng thêm Credits.`), 100);
          }
        }
      ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [session, showPayment, paymentMethod]);

  // --- HELPER FUNCTIONS ---
  const fetchProfile = async (userId) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
      if (error) throw error;
      setProfile(data);
    } catch (error) { console.error('Lỗi profile:', error.message); } 
    finally { setLoading(false); }
  };

  const handleLoginGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google', options: { redirectTo: window.location.origin }
    });
    if (error) alert(error.message);
  };

  const handleLogout = async () => await supabase.auth.signOut();

  const copyToClipboard = async () => {
    if (profile?.license_key) {
        await navigator.clipboard.writeText(profile.license_key);
        setCopySuccess(true); setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleDownload = () => window.open(LINKS.DRIVE_DOWNLOAD, '_blank');
  
  // Reset trạng thái khi mở modal
  const handleTopup = () => {
    setShowPayment(true);
    setPaypalSuccess(null);
    setPaymentMethod('VND');
    setSelectedPkg(PACKAGES_VND[0]);
  };

  const handleSwitchMethod = (method) => {
      setPaymentMethod(method);
      setPaypalSuccess(null);
      // Tự động chọn gói đầu tiên của phương thức đó
      setSelectedPkg(method === 'VND' ? PACKAGES_VND[0] : PACKAGES_USD[0]);
  };

  // --- PAYMENT LOGIC ---
  const getVietQRUrl = () => {
    if (!profile || !selectedPkg) return "";
    const key = profile.license_key || 'UNKNOWN';
    const DESCRIPTION = `OSKP ${key}`; 
    return `https://img.vietqr.io/image/${BANK_INFO.ID}-${BANK_INFO.ACCOUNT}-compact2.png?amount=${selectedPkg.price}&addInfo=${encodeURIComponent(DESCRIPTION)}&accountName=${encodeURIComponent(BANK_INFO.NAME)}`;
  };

  // Link hỗ trợ nhanh kèm nội dung soạn sẵn
  const getSupportLink = (platform, transId = "") => {
    const msg = `Xin chào Admin, tôi vừa thanh toán gói ${selectedPkg.credits} Credits qua PayPal. Transaction ID: ${transId}. Email: ${session?.user?.email}. License Key: ${profile?.license_key}.`;
    if (platform === 'facebook') return `${LINKS.FACEBOOK}`; // Facebook không hỗ trợ pre-fill message qua link web
    if (platform === 'zalo') return LINKS.ZALO;
    return "#";
  };

  /* ==================================================================================
   * PHẦN 4: UI RENDER
   * ================================================================================== */

  if (!session) {
    // (Giữ nguyên màn hình đăng nhập như cũ)
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-xl text-center">
            <h1 className="text-3xl font-bold mb-2">OpenSkp</h1>
            <button onClick={handleLoginGoogle} className="w-full mt-6 bg-white border py-3 rounded-xl flex justify-center gap-2 hover:bg-slate-50">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="G" /> 
                Đăng nhập bằng Google
            </button>
        </div>
      </div>
    );
  }

  // Lấy danh sách gói hiện tại dựa trên Tab đang chọn
  const currentPackages = paymentMethod === 'VND' ? PACKAGES_VND : PACKAGES_USD;

  return (
    <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID }}>
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative">
      
      {/* === MODAL THANH TOÁN === */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
            
            {/* Cột Trái: Chọn Gói */}
            <div className="flex-1 p-6 bg-slate-50 border-r border-slate-100 overflow-y-auto">
                <h3 className="font-bold text-xl text-slate-800 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500 fill-current"/> Chọn Gói Credits
                </h3>
                
                {/* Tabs Chuyển đổi Tiền tệ */}
                <div className="flex bg-slate-200 p-1 rounded-xl mb-4">
                    <button 
                        onClick={() => handleSwitchMethod('VND')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${paymentMethod === 'VND' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        🇻🇳 Chuyển khoản (VNĐ)
                    </button>
                    <button 
                        onClick={() => handleSwitchMethod('USD')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${paymentMethod === 'USD' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        🌏 PayPal (USD)
                    </button>
                </div>

                <div className="space-y-3">
                    {currentPackages.map((pkg) => (
                        <div 
                            key={pkg.id}
                            onClick={() => setSelectedPkg(pkg)}
                            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center group
                                ${selectedPkg.id === pkg.id 
                                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                                    : 'border-slate-200 bg-white hover:border-blue-300'}`}
                        >
                            {pkg.popular && (
                                <span className="absolute -top-2.5 -right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-current"/> BEST
                                </span>
                            )}
                            <div>
                                <div className="font-bold text-slate-700">{pkg.credits} Credits</div>
                                <div className="text-xs text-slate-500">{pkg.label}</div>
                            </div>
                            <div className="text-blue-600 font-bold font-mono text-lg">
                                {paymentMethod === 'USD' ? '$' : ''}{pkg.price.toLocaleString('vi-VN')}{paymentMethod === 'VND' ? ' đ' : ''}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cột Phải: Thanh toán */}
            <div className="flex-1 flex flex-col relative">
                <button onClick={() => setShowPayment(false)} className="absolute top-4 right-4 p-1 hover:bg-slate-200 rounded-full transition text-slate-500 z-10">
                    <X className="w-6 h-6"/>
                </button>

                <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
                    
                    {/* TRƯỜNG HỢP 1: Giao dịch PayPal thành công -> Hướng dẫn liên hệ */}
                    {paypalSuccess ? (
                        <div className="animate-fade-in w-full">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Thanh toán thành công!</h3>
                            <p className="text-slate-500 text-sm mb-4">
                                Cảm ơn bạn. Để nhận Credits, vui lòng gửi mã giao dịch bên dưới cho Admin.
                            </p>
                            
                            <div className="bg-slate-100 p-3 rounded-lg font-mono text-sm border border-slate-200 mb-6 break-all select-all">
                                {paypalSuccess}
                            </div>

                            <div className="flex flex-col gap-3 w-full px-8">
                                <a href={LINKS.FACEBOOK} target="_blank" rel="noreferrer" 
                                   className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition">
                                    <Facebook className="w-5 h-5" /> Gửi qua Facebook
                                </a>
                                <a href={LINKS.ZALO} target="_blank" rel="noreferrer"
                                   className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 py-3 rounded-xl font-bold transition">
                                    <MessageCircle className="w-5 h-5" /> Gửi qua Zalo
                                </a>
                            </div>
                        </div>
                    ) : (
                        /* TRƯỜNG HỢP 2: Đang chờ thanh toán */
                        <>
                            <p className="text-slate-600 mb-4 font-sans text-sm">
                                Thanh toán gói <span className="font-bold text-blue-600 text-lg">{selectedPkg.credits} Credits</span>
                                <br/>
                                Số tiền: <span className="font-bold text-slate-900">{paymentMethod === 'USD' ? '$' : ''}{selectedPkg.price.toLocaleString('vi-VN')}{paymentMethod === 'VND' ? ' đ' : ''}</span>
                            </p>

                            {paymentMethod === 'VND' ? (
                                // --- THANH TOÁN QR CODE (VND) ---
                                <div className="flex flex-col items-center">
                                    <div className="border-2 border-blue-100 rounded-xl p-2 inline-block mb-4 shadow-inner bg-white">
                                        <img src={getVietQRUrl()} alt="VietQR" className="w-52 h-52 object-contain" />
                                    </div>
                                    <div className="text-xs text-slate-400 mb-4">
                                        Nội dung CK: <span className="font-mono font-bold text-slate-700 bg-slate-100 px-1 rounded">OSKP {profile?.license_key}</span>
                                    </div>
                                    <div className="bg-yellow-50 text-yellow-800 px-4 py-2 rounded-lg text-xs border border-yellow-100 flex items-center gap-2">
                                        <Loader2 className="w-3 h-3 animate-spin"/> Đang chờ chuyển khoản... (Tự động 10s)
                                    </div>
                                </div>
                            ) : (
                                // --- THANH TOÁN PAYPAL (USD) ---
                                <div className="w-full px-8 mt-2">
                                    <div className="mb-4 p-3 bg-blue-50 text-blue-800 text-xs rounded-lg text-left border border-blue-100">
                                        ℹ️ <strong>Lưu ý:</strong> Sau khi thanh toán PayPal thành công, vui lòng nhắn tin cho Admin mã giao dịch để được cộng Credits.
                                    </div>
                                    <PayPalButtons
                                        key={selectedPkg.id} // Re-render khi đổi gói
                                        style={{ layout: "vertical", shape: "rect", label: "paypal" }}
                                        createOrder={(data, actions) => {
                                            return actions.order.create({
                                                purchase_units: [{
                                                    description: `${selectedPkg.credits} Credits - OSKP`,
                                                    amount: { value: selectedPkg.price.toString() }
                                                }]
                                            });
                                        }}
                                        onApprove={async (data, actions) => {
                                            const order = await actions.order.capture();
                                            console.log("PayPal Success:", order);
                                            setPaypalSuccess(order.id); // Lưu transaction ID và chuyển UI
                                        }}
                                        onError={(err) => {
                                            console.error("PayPal Error:", err);
                                            alert("Thanh toán thất bại hoặc đã bị hủy.");
                                        }}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
          </div>
        </div>
      )}

      {/* === NAVBAR === */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 h-16 flex justify-between items-center shadow-sm">
         <div className="flex items-center gap-2">
            <img src="/openskp-logo.png" onError={(e)=>e.target.style.display='none'} className="w-10 h-10"/>
            <span className="font-serif text-2xl font-bold text-slate-800">OpenSkp</span>
         </div>
         <div className="flex items-center gap-4">
             <span className="text-sm text-slate-500 hidden sm:inline">{session.user.email}</span>
             <button onClick={handleLogout} className="text-slate-500 hover:text-red-600"><LogOut className="w-5 h-5"/></button>
         </div>
      </nav>

      {/* === MAIN CONTENT === */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* Phần Header & License Key giữ nguyên như code cũ, tôi rút gọn để tập trung vào phần thanh toán */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Xin chào!</h1>
                <p className="text-slate-500">Quản lý tài khoản & License Key</p>
            </div>
             <a href={LINKS.YOUTUBE_GUIDE} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-red-600 font-bold hover:underline">
                <PlayCircle className="w-5 h-5"/> Xem hướng dẫn
            </a>
        </div>

        {loading && !profile ? <div className="text-center py-20"><Loader2 className="animate-spin inline w-8 h-8"/></div> : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Credits Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Zap className="w-6 h-6"/></div>
                    <div>
                        <div className="text-xs font-bold text-slate-500 uppercase">Số dư Credits</div>
                        <div className="text-3xl font-bold text-slate-800">{profile?.credits || 0}</div>
                    </div>
                </div>
                <button onClick={handleTopup} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-lg shadow-blue-600/20">
                    Nạp thêm Credits
                </button>
            </div>

            {/* License Key & Info */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">License Key</h3>
                <div className="flex gap-4 mb-6">
                    <div className="flex-1 bg-slate-50 border p-4 rounded-xl font-mono text-xl text-slate-700 break-all">
                        {profile?.license_key || 'Loading...'}
                    </div>
                    <button onClick={copyToClipboard} className="bg-slate-800 text-white px-6 rounded-xl font-bold hover:bg-slate-700">
                        {copySuccess ? <CheckCircle2/> : <Copy/>}
                    </button>
                </div>
                <div className="flex gap-4">
                     <button onClick={handleDownload} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold">
                        <Download className="w-4 h-4"/> Tải Plugin
                     </button>
                     <a href={LINKS.FACEBOOK} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold">
                        <Facebook className="w-4 h-4"/> Facebook Fanpage
                     </a>
                </div>
            </div>

          </div>
        )}
      </main>
    </div>
    </PayPalScriptProvider>
  );
}