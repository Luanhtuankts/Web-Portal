import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { CreditCard, Copy, Download, LogOut, Loader2, Zap, ShieldCheck, Box, User, CheckCircle2, Mail, X } from 'lucide-react';

// --- CẤU HÌNH SUPABASE ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// --- CẤU HÌNH LIÊN HỆ & FILE ---
const CONTACT_LINK = "https://zalo.me/0965585879"; 
const PLUGIN_FILENAME = "OpenSkp 1.0.2.rar"; 

// --- CẤU HÌNH NGÂN HÀNG (VIETQR) ---
const BANK_ID = "MB"; // Điền mã ngân hàng của bạn: MB, VCB, TCB, VPB, ACB...
const BANK_ACCOUNT = "0965585879"; // Số tài khoản ngân hàng của bạn
const ACCOUNT_NAME = "OPEN SKP"; // Tên chủ tài khoản (hiển thị khi quét)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("⛔ LỖI: Chưa cấu hình biến môi trường Supabase.");
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
  
  // State quản lý Modal thanh toán
  const [showPayment, setShowPayment] = useState(false);

  // 1. Kiểm tra session & Realtime Subscription
  useEffect(() => {
    if (!supabaseUrl) { setLoading(false); return; }

    // Lấy session hiện tại
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    });

    // Lắng nghe thay đổi Auth
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

    // Đăng ký kênh lắng nghe thay đổi trên bảng 'users' đúng row của user này
    const channel = supabase
      .channel('realtime-credits')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${session.user.id}` },
        (payload) => {
          // Khi database thay đổi (Casso bắn webhook), cập nhật ngay state profile
          console.log("🔔 Nhận tín hiệu thay đổi data:", payload.new);
          setProfile(payload.new);
          // Nếu đang mở bảng thanh toán thì đóng lại và thông báo
          if (showPayment) {
             setShowPayment(false);
             alert(`✅ Đã nhận được tiền! Số dư mới: ${payload.new.credits} credits.`);
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

  // 3. Đăng nhập Email
  const handleLoginEmail = async (email) => {
    if (!supabaseUrl) return alert("Lỗi cấu hình!");
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ 
        email,
        options: { emailRedirectTo: window.location.origin }
    });
    if (error) alert(error.message);
    else alert('✅ Đã gửi link! Kiểm tra hộp thư (cả mục Spam nhé).');
    setLoading(false);
  };

  // 4. Đăng nhập Google
  const handleLoginGoogle = async () => {
    if (!supabaseUrl) return alert("Lỗi cấu hình!");
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

  // 5. Xử lý tải Plugin
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `/${PLUGIN_FILENAME}`; 
    link.download = PLUGIN_FILENAME;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 6. Xử lý Nạp tiền: MỞ MODAL
  const handleTopup = () => {
    setShowPayment(true);
  };

  // 7. Tạo Link QR VietQR
  const getVietQRUrl = () => {
    if (!profile) return "";
    const AMOUNT = "50000";
    // Cú pháp quan trọng: OSKP <USER_ID>
    const DESCRIPTION = `OSKP ${profile.id}`; 
    
    return `https://img.vietqr.io/image/${BANK_ID}-${BANK_ACCOUNT}-compact2.png?amount=${AMOUNT}&addInfo=${encodeURIComponent(DESCRIPTION)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;
  };

  const handleLogout = async () => { await supabase.auth.signOut(); };

  const copyToClipboard = async () => {
    if (profile?.license_key) {
      try {
        await navigator.clipboard.writeText(profile.license_key);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        const textField = document.createElement('textarea');
        textField.innerText = profile.license_key;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy');
        textField.remove();
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    }
  };


  // --- MÀN HÌNH ĐĂNG NHẬP ---
  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 text-slate-900 font-serif font-sans">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-xl animate-fade-in">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <img src="/openskp-logo.png" alt="OpenSKP Logo" className="w-16 h-16" />
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
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                Đăng nhập bằng Google
            </button>

            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-sm">Hoặc dùng Email</span>
                <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleLoginEmail(e.target.email.value); }} className="space-y-4">
                <div>
                <input 
                    type="email" name="email" placeholder="architect@example.com" required 
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition" 
                />
                </div>
                <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-sans py-3.5 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/20 disabled:opacity-70">
                {loading ? <Loader2 className="animate-spin" /> : <><Mail className="w-4 h-4"/> Gửi Link đăng nhập</>}
                </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-serif relative">
      
      {/* === MODAL THANH TOÁN (New) === */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500 fill-current"/> Nạp Credits Tự Động
              </h3>
              <button onClick={() => setShowPayment(false)} className="p-1 hover:bg-slate-200 rounded-full transition text-slate-500">
                <X className="w-6 h-6"/>
              </button>
            </div>
            
            <div className="p-6 text-center overflow-y-auto">
              <p className="text-slate-600 mb-4 text-sm font-sans">
                Quét mã QR bằng ứng dụng ngân hàng.<br/>Hệ thống sẽ tự động cộng Credits sau 10-30 giây.
              </p>
              
              {/* QR Code */}
              <div className="border-2 border-blue-100 rounded-xl p-2 inline-block mb-4 shadow-inner bg-white relative group">
                 <img src={getVietQRUrl()} alt="VietQR Payment" className="w-64 h-64 object-contain" />
                 <div className="absolute inset-0 flex items-center justify-center bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="text-xs font-bold text-slate-600">Quét để thanh toán</span>
                 </div>
              </div>
              
              <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg text-sm mb-4 border border-yellow-100 text-left">
                <div className="font-bold text-yellow-900 mb-1 flex items-center gap-1">⚠️ Lưu ý quan trọng:</div>
                <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Không sửa nội dung chuyển khoản.</li>
                    <li>Gói nạp: <strong>50.000 VNĐ = 50 Credits</strong>.</li>
                    <li>Nếu sau 5 phút chưa nhận được, vui lòng liên hệ Zalo.</li>
                </ul>
              </div>

              <div className="text-xs text-slate-400 mt-2">
                Nội dung chuyển khoản bắt buộc: <br/>
                <div className="mt-1 flex items-center justify-center gap-2">
                    <span className="font-mono bg-slate-100 border border-slate-200 px-2 py-1.5 rounded text-slate-700 font-bold select-all text-sm">
                        OSKP {profile?.id}
                    </span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                <a href={CONTACT_LINK} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm font-medium">
                    Gặp vấn đề? Liên hệ hỗ trợ ngay
                </a>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <img src="/openskp-logo.png" alt="OpenSKP Logo" className="w-12 h-12" />
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
        </div>

        {loading && !profile ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600 w-12 h-12"/></div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Credits (Nạp tiền) */}
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
            
            {/* Card 3: Download (Tải thật) */}
            <div className="bg-gradient-to-br from-slate-600 to-slate-400 text-white border rounded-2xl p-6 flex flex-col justify-between shadow-lg">
               <div>
                 <h3 className="text-lg font-sans  mb-2 flex items-center gap-2 text-white"><Download className="w-5 h-5 text-blue-400"/> Tải Plugin</h3>
                 <p className="text-slate-100 text-sm leading-relaxed">Phiên bản <strong>v1.0.2</strong> ổn định.<br/>Bấm bên dưới để tải file cài đặt.</p>
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
                            <strong>Hướng dẫn cài đặt:</strong> Tải Plugin &rarr; Chọn phiên bản Skp &rarr; Copy 2 file &rarr; Paste vào C:\Users\Tên_người_dùng\AppData\Roaming\SketchUp\SketchUp 202x\SketchUp\Plugins <br/><strong>Đăng ký license:</strong> Mở SketchUp &rarr; View &rarr; Toolbars &rarr; Tick OpenSkp &rarr; Khởi động plugin &rarr; Dán Key và sử dụng.
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