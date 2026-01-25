import React, { useState, useEffect } from 'react';
// FIX: Sử dụng đường dẫn CDN cho Supabase để chạy được trên trình duyệt
import { createClient } from '@supabase/supabase-js';
import { CreditCard, Copy, Download, LogOut, Loader2, Zap, ShieldCheck, Box, User, CheckCircle2, X, Star, PlayCircle } from 'lucide-react';

// --- CẤU HÌNH SUPABASE ---
const getEnv = (key) => {
  try {
    return import.meta.env?.[key];
  } catch (e) {
    return undefined;
  }
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

// --- CẤU HÌNH LIÊN HỆ & FILE ---
const CONTACT_LINK = "https://zalo.me/0965585879"; 
const DRIVE_DOWNLOAD_LINK = "https://drive.google.com/file/d/1TOwlNNs3L5C9hCiV-LX4dcpLG4y3HzPo/view?usp=sharing"; 
const YOUTUBE_GUIDE_LINK = "https://www.youtube.com/watch?v=CfP27yN0jwE";

// --- CẤU HÌNH NGÂN HÀNG (VIETQR) ---
const BANK_ID = "MB"; 
const BANK_ACCOUNT = "0965585879"; 
const ACCOUNT_NAME = "OPEN SKP"; 

// --- CẤU HÌNH CÁC GÓI CREDITS ---
const PACKAGES = [
  { id: 1, price: 50000, credits: 100, label: "Cơ bản", popular: false },
  { id: 2, price: 100000, credits: 250, label: "Phổ biến", popular: true }, // Tặng 50
  { id: 3, price: 200000, credits: 550, label: "Nâng cao", popular: false }, // Tặng 50
  { id: 4, price: 500000, credits: 1500, label: "Siêu hời", popular: false }, // Tặng 250
];

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⛔ LƯU Ý: Chưa cấu hình biến môi trường Supabase.");
}

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // State quản lý Modal thanh toán & Gói đang chọn
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(PACKAGES[0]); 

  // 1. Kiểm tra session & Realtime Subscription
  useEffect(() => {
    if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') { 
        setLoading(false); 
        return; 
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

  // 1.1. Lắng nghe thay đổi Credits (Realtime)
  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = supabase
      .channel('realtime-credits')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${session.user.id}` },
        (payload) => {
          console.log("🔔 Nhận tín hiệu thay đổi data:", payload.new);
          setProfile(payload.new);
          if (showPayment) {
             setShowPayment(false);
             setTimeout(() => alert(`✅ Đã nhận được tiền! Tài khoản đã được cộng thêm Credits.`), 100);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, showPayment]);


  // 2. Lấy Profile
  const fetchProfile = async (userId) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Lỗi lấy profile:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Đăng nhập Google
  const handleLoginGoogle = async () => {
    if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') return alert("Lỗi cấu hình! Vui lòng kiểm tra biến môi trường.");
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
    if (error) {
        alert("Lỗi đăng nhập Google: " + error.message);
        setLoading(false);
    }
  };

  // 4. Xử lý tải Plugin
  const handleDownload = () => {
    window.open(DRIVE_DOWNLOAD_LINK, '_blank');
  };

  // 5. Xử lý Nạp tiền
  const handleTopup = () => {
    setShowPayment(true);
  };

  // 6. Tạo Link QR VietQR
  // CẬP NHẬT MỚI: Dùng LICENSE KEY để định danh giao dịch
  const getVietQRUrl = () => {
    if (!profile || !selectedPkg) return "";
    
    // NỘI DUNG CHUYỂN KHOẢN: OSKP <LICENSE_KEY>
    // License Key thường là chuỗi ký tự an toàn, không sợ ngân hàng lọc bỏ như email
    const key = profile.license_key || 'UNKNOWN';
    const DESCRIPTION = `OSKP ${key}`; 
    
    return `https://img.vietqr.io/image/${BANK_ID}-${BANK_ACCOUNT}-compact2.png?amount=${selectedPkg.price}&addInfo=${encodeURIComponent(DESCRIPTION)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;
  };

  const handleLogout = async () => { await supabase.auth.signOut(); };

  const copyToClipboard = async () => {
    if (profile?.license_key) {
      try {
        await navigator.clipboard.writeText(profile.license_key);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    }
  };


  // --- UI RENDER ---
  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 text-slate-900 font-serif font-sans">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-xl animate-fade-in">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <img src="/openskp-logo.png" onError={(e) => e.target.style.display='none'} alt="OpenSKP Logo" className="w-16 h-16" />
            </div>
            <h1 className="text-3xl font-serif text-slate-900 mb-2">OpenSkp</h1>
            <p className="text-slate-500">Open Sketchup with AI</p>
          </div>
          
          <div className="space-y-4">
            <button 
                onClick={handleLoginGoogle}
                disabled={loading}
                className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-sans py-3.5 rounded-xl flex items-center justify-center gap-3 transition shadow-sm font-Arial"
            >
                {loading ? <Loader2 className="animate-spin" /> : (
                  <>
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                    Đăng nhập bằng Google
                  </>
                )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-serif relative">
      
      {/* === MODAL THANH TOÁN === */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
            
            {/* Cột Trái: Chọn Gói */}
            <div className="flex-1 p-6 bg-slate-50 border-r border-slate-100 overflow-y-auto">
                <h3 className="font-bold text-xl text-slate-800 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500 fill-current"/> Chọn Gói Credits
                </h3>
                <div className="space-y-3">
                    {PACKAGES.map((pkg) => (
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
                                <div className="text-xs text-slate-500 font-sans">{pkg.label}</div>
                            </div>
                            <div className="text-blue-600 font-bold font-mono">
                                {pkg.price.toLocaleString('vi-VN')} đ
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-slate-400 mt-4 italic">
                    * Credits dùng để dựng model bằng AI. Không giới hạn thời gian sử dụng.
                </p>
            </div>

            {/* Cột Phải: QR Code */}
            <div className="flex-1 flex flex-col">
                <div className="p-4 border-b border-slate-100 flex justify-end">
                    <button onClick={() => setShowPayment(false)} className="p-1 hover:bg-slate-200 rounded-full transition text-slate-500">
                        <X className="w-6 h-6"/>
                    </button>
                </div>

                <div className="p-6 text-center flex-1 flex flex-col items-center justify-center">
                    <p className="text-slate-600 mb-2 font-sans text-sm">
                        Quét mã QR để thanh toán gói <br/>
                        <span className="font-bold text-blue-600 text-lg">{selectedPkg.credits} Credits</span>
                    </p>
                    
                    {/* QR Code Container */}
                    <div className="border-2 border-blue-100 rounded-xl p-2 inline-block mb-4 shadow-inner bg-white relative">
                        <img 
                            key={selectedPkg.id} 
                            src={getVietQRUrl()} 
                            alt="VietQR Payment" 
                            className="w-56 h-56 object-contain" 
                        />
                    </div>
                    
                    <div className="text-xs text-slate-400">
                        Nội dung CK: <span className="font-mono font-bold text-slate-700 bg-slate-100 px-1 rounded">
                             OSKP {profile?.license_key || '...'}
                        </span>
                        <br/>
                        Số tiền: <span className="font-mono font-bold text-slate-700 bg-slate-100 px-1 rounded">{selectedPkg.price.toLocaleString('vi-VN')} đ</span>
                    </div>

                    <div className="mt-4 bg-yellow-50 text-yellow-800 px-4 py-2 rounded-lg text-xs border border-yellow-100">
                        Hệ thống tự động cộng Credits sau 10-30 giây.
                    </div>
                </div>
            </div>

          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <img src="/openskp-logo.png" onError={(e) => e.target.style.display='none'} alt="OpenSKP Logo" className="w-12 h-12" />
            <span className="font-serif text-2xl text-slate-800 tracking-tight mt-3">OpenSkp</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
                <User className="w-4 h-4 text-slate-500"/>
                <span className="text-sm font-medium text-slate-600 truncate max-w-[150px]">{session.user.email}</span>
             </div>
             <button onClick={handleLogout} className="text-slate-500 hover:text-red-600 text-sm flex items-center gap-2 font-medium transition hover:bg-red-50 px-3 py-2 rounded-lg">
                <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Đăng xuất</span>
             </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10 animate-fade-in">
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">Xin chào, Kiến trúc sư!</h1>
          <p className="text-slate-500 max-w-2xl text-lg">Bạn là nhà thiết kế - hãy để AI dựng hình cho bạn.</p>
          
          <div className="mt-4">
            <a 
              href={YOUTUBE_GUIDE_LINK}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition shadow-sm hover:shadow-md group"
            >
              <PlayCircle className="w-5 h-5 fill-current text-white/20 group-hover:text-white/40" />
              Hướng dẫn sử dụng
            </a>
          </div>

        </div>

        {loading && !profile ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600 w-12 h-12"/></div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Credits */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden shadow-sm hover:shadow-md transition duration-300 group">
              <div className="absolute -top-6 -right-6 p-4 opacity-5 group-hover:opacity-10 transition"><Zap className="w-40 h-40 text-blue-600 transform rotate-12" /></div>
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600 ring-1 ring-blue-100"><CreditCard className="w-6 h-6" /></div>
                <div>
                  <h3 className="text-xs font-sans font-bold text-slate-600 uppercase tracking-wider">Số dư Credits</h3>
                  <div className="text-4xl font-sans font-bold text-slate-600 mt-1">{profile?.credits || 0}</div>
                </div>
              </div>
              <div className="mt-8 relative z-10">
                  <button onClick={handleTopup} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4 fill-current"/> Nạp thêm / Mua gói
                  </button>
                  <p className="text-xs text-slate-400 mt-3 text-center font-medium">Hệ thống nạp tự động 24/7</p>
              </div>
            </div>

            {/* Card 2: Status */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-xl ring-1 ${profile?.is_active ? 'bg-green-50 ring-green-200 text-green-600' : 'bg-red-50 ring-red-200 text-red-600'}`}>
                   <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs font-sans font-bold text-slate-600 uppercase tracking-wider">Trạng thái</h3>
                  <div className={`text-xl font-sans font-bold ${profile?.is_active ? 'text-green-600' : 'text-red-600'}`}>
                    {profile?.is_active ? 'Đang Hoạt Động' : 'Đã Bị Khóa'}
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-slate-100">
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-sans font-bold text-slate-600 uppercase">Thiết bị</span>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium ${profile?.hardware_id ? 'bg-slate-100 text-slate-600' : 'bg-orange-50 text-orange-600'}`}>
                        {profile?.hardware_id || 'Chưa kích hoạt'}
                    </span>
                 </div>
              </div>
            </div>
            
            {/* Card 3: Download */}
            <div className="bg-gradient-to-br from-slate-600 to-slate-400 text-white border rounded-2xl p-6 flex flex-col justify-between shadow-lg">
               <div>
                 <h3 className="text-lg font-sans  mb-2 flex items-center gap-2 text-white"><Download className="w-5 h-5 text-blue-400"/> Tải Plugin</h3>
                 <p className="text-slate-100 text-sm leading-relaxed">Phiên bản <strong>v2.0.1</strong> mới nhất.<br/>Hiện tại chỉ hoạt động trên Sketchup 2025 trở lên</p>
               </div>
               <button onClick={handleDownload} className="w-full py-3 mt-6 bg-white hover:bg-blue-50 text-slate-900 rounded-xl font-sans font-bold flex items-center justify-center gap-2 transition shadow-lg">
                  <Download className="w-4 h-4" /> Tải xuống
               </button>
            </div>

            {/* License Key Section */}
            <div className="lg:col-span-3 mt-2">
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                        <h3 className="text-sm font-sans text-slate-500 uppercase tracking-widest">License Key Của Bạn</h3>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-5 font-mono text-xl md:text-2xl text-slate-700 tracking-widest shadow-inner break-all">
                            {profile?.license_key || "ĐANG TẢI DỮ LIỆU..."}
                        </div>
                        <button onClick={copyToClipboard} className="bg-slate-400 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-sans min-w-[180px] transition-colors duration-300 flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 active:scale-95 transform">
                            {copySuccess ? <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5"/> Đã Copy</span> : <><Copy className="w-5 h-5"/> Copy Key</>}
                        </button>
                    </div>

                    <div className="mt-6 flex gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-800">
                        <Box className="w-8 h-8 shrink-0 mt-0.5 text-blue-600"/>
                        <p>
                            <strong>Hướng dẫn cài đặt:</strong> Tải Plugin &rarr; Copy 2 file &rarr; Paste vào C:\Users\Tên_người_dùng\AppData\Roaming\SketchUp\SketchUp 202x\SketchUp\Plugins <br/><strong>Đăng ký license:</strong> Mở SketchUp &rarr; View &rarr; Toolbars &rarr; Tick OpenSkp &rarr; Khởi động plugin &rarr; Dán Key và sử dụng.
                        </p>
                    </div>
                </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}