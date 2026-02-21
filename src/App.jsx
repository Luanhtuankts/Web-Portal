
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

// CẤU HÌNH MÔI TRƯỜNG & SUPABASE
/* Hàm lấy biến môi trường an toàn từ file .env.local */
const getEnv = (key) => {
  try { return import.meta.env?.[key]; } catch (e) { return undefined; }
};

/* Lấy thông tin từ file .env.local như trong ảnh bạn gửi */
const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

/* Kiểm tra xem đã đọc được file .env chưa */
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⛔ LƯU Ý: Chưa đọc được biến môi trường. Hãy chắc chắn file .env.local nằm cùng cấp với thư mục src và package.json");
}

/* Khởi tạo Supabase Client với thông tin từ file cấu hình */
const supabase = createClient(
  supabaseUrl || 'https:\x2f\x2fplaceholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);


// CẤU HÌNH MÀU SẮC TỔNG THỂ
/* Màu xanh chủ đạo của thương hiệu */
const PRIMARY_COLOR = "#0063A3";
/* Màu nền chính của trang web */
const BG_COLOR = "#fdfbf7";



// TỪ ĐIỂN ĐA NGÔN NGỮ (TRANSLATIONS)
/* Chứa toàn bộ nội dung text hiển thị trên website hỗ trợ 2 ngôn ngữ VN/EN */
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
    heroSubtitle: "\"Bạn là nhà thiết kế - hãy để AI dựng hình cho bạn.\"",
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
    /* Payment */
    paymentTitle: "Nạp Credits",
    paymentVND: "VNĐ",
    paymentUSD: "USD",
    paymentTotal: "Tổng thanh toán:",
    paymentScan: "Quét mã để thanh toán tự động",
    paymentSuccess: "Thanh toán thành công!",
    paymentSuccessMsg: "Vui lòng gửi mã này cho Admin qua Zalo/Facebook.",
    paymentCardDesc: "Thẻ Tín dụng / Ghi nợ",
    /* Guide Menu */
    guideBreadcrumb: "Hướng dẫn sử dụng",
    guideToc: "Mục lục",
    guideItem1: "1. Cài đặt & License",
    guideItem2: "2. Giao diện",
    guideItem3: "3. Bắt đầu vẽ",
    guideItem4: "4. Chỉnh sửa model",
    guideNext: "Bước tiếp theo",
    guidePrev: "Quay lại",
    /* Guide Content */
    guideTitle1: "Hướng dẫn cài đặt",
    guideTitle2: "Tổng quan giao diện",
    guideTitle3: "Bắt đầu vẽ (Model Selection)",
    guideTitle4: "Chỉnh sửa & Quản lý (History)",
    /* Guide 1 Content */
    guideNote: "Lưu ý quan trọng:",
    guideNoteText: "Vui lòng tắt hoàn toàn SketchUp trước khi thực hiện cài đặt.",
    guideStep1: "Bước 1: Tải về và Giải nén",
    guideStep1Text: "Nhấn vào nút",
    guideStep1Text2: "ở trên. Sau khi tải về file .zip, hãy giải nén ra thư mục máy tính.",
    guideStep2: "Bước 2: Copy vào thư mục Plugin",
    guideStep2Text: "Chọn phiên bản phù hợp, copy toàn bộ file trong thư mục vừa giải nén vào đường dẫn sau:",
    guideStep3: "Bước 3: Kích hoạt License",
    guideStep3Text: "Mở SketchUp lên, bạn sẽ thấy thanh công cụ OpenSKP. Bấm vào icon Robot, Nhập key dưới đây vào ô license là hoàn tất.",
    guideYourKey: "License Key của bạn:",
    loginToView: "Vui lòng đăng nhập...",
    /* Guide 2 Content (UI Explanations) */
    uiDescLicense: "Nhập và quản lý mã bản quyền (License Key) tại đây để kích hoạt (1 Key sẽ kích hoạt cho 1 máy).",
    uiDescPrompt: "Khu vực \"Nhập mô tả...\" sản phẩm. Bạn có thể nhập chi tiết về kích thước, vật liệu, kiểu dáng (VD: 'Khoang tủ bếp dài 3m vật liệu gỗ').",
    uiDescImage: "Nút đính kèm ảnh tham khảo. Giúp AI hiểu rõ hơn về ý tưởng thiết kế của bạn thông qua hình ảnh minh họa.",
    uiDescVoice: "Nút nhập lệnh bằng giọng nói. Hỗ trợ nhận diện tiếng Việt, giúp bạn ra lệnh nhanh chóng mà không cần gõ phím (Yêu cầu Win11 và chuyển ngôn ngữ máy sang tiếng Việt).",
    /* Guide 3 Content */
    drawIntro: "KHU VỰC CHỌN MODEL AI: Lựa chọn mô hình AI phù hợp với nhu cầu: Hệ thống tính phí dựng hình theo đơn vị Credit cho mỗi tin nhắn (Lưu ý: Mỗi yêu cầu gửi đi đều tiêu tốn Credit, hãy tập trung vào lệnh thiết kế nhé ^^).",
    drawFlash: "Flash (1 Credit): Tốc độ nhanh, phù hợp dựng hình các model đơn giản và chỉnh sửa nhanh.",
    drawPro: "Pro (3 Credits): Mức độ chính xác cao hơn, phù hợp cho các model cần sự chi tiết cao.",
    drawProMax: "Pro Max (10 Credits): Tích hợp model suy nghĩ sâu (deep-reasoning model), phân tích và xử lý hình khối phức tạp và chính xác nhất.",
    guideStart: "Sau khi đã làm quen với giao diện, chúng ta hãy cùng dựng những model đầu tiên. Nguyên lý cốt lõi của OpenSKP là phân tích yêu cầu (prompt) để bóc tách vật thể thành các cấu kiện riêng biệt (Group/Component), sau đó sắp xếp chúng một cách logic. Do đó, độ chi tiết và tư duy hình khối sẽ phụ thuộc vào từng model AI bạn lựa chọn.\n\nLời khuyên: Bạn nên chia nhỏ khối lượng công việc để AI hoàn thành trọn vẹn từng phần một. AI sẽ gặp khó khăn nếu yêu cầu quá bao quát mà không kèm theo chỉ dẫn cụ thể. Đừng bắt AI dựng cả một tòa biệt thự ngay lập tức nhé, hãy đi từ từng bộ phận một ^^.",
    guideFlashDetail: "Model Flash: Tối ưu hóa cho tốc độ và phản hồi tức thì. Kết quả dựng hình thường mang tính khái quát, lý tưởng cho các yêu cầu cơ bản, hình khối đơn giản hoặc tinh chỉnh các cấu kiện nhỏ lẻ. Để thực hiện các tác vụ phức tạp với Flash, bạn cần cung cấp Prompt cực kỳ chi tiết, bao gồm thông số kích thước và số lượng cụ thể.",
    guideProDetail: "Model Pro: Sở hữu khả năng tư duy chuyên sâu, mang lại kết quả có độ chính xác và tính logic cao hơn đáng kể so với Flash. Đây là lựa chọn tối ưu cho các vật thể phức tạp, đa cấu kiện, giúp đảm bảo tính đồng bộ và chi tiết cho thiết kế của bạn.",
    guideProMaxDetail: "Model Pro Max: Model mạnh nhất tích hợp công nghệ Agentic AI. Bạn chỉ cần đưa ra các yêu cầu sơ bộ, AI sẽ chủ động phân tích và tự động bổ sung các thông tin cần thiết, sau đó lập lộ trình chia nhỏ công việc để hoàn thiện từng phần một cách tỉ mỉ. Chính quy trình này mang lại kết quả có độ chi tiết và độ chính xác vượt trội hoàn toàn so với model Flash và Pro.",
    /* Guide 4 Content */
    guideContextDetail: "Trong quá trình vẽ và chỉnh sửa model, việc thiết lập ngữ cảnh là vô cùng quan trọng. Nó giúp hệ thống lưu trữ thông tin chi tiết cho từng Group và Component mà AI đã vẽ. Việc bổ sung ngữ cảnh sẽ giúp AI hiểu rõ ý đồ của người dùng khi tạo dựng hoặc thay đổi hình khối trên từng vật thể cụ thể.",
    editIntro: "Quản lý các mẫu thiết kế đã tạo :",
    editIntro2: "LỊCH SỬ & PROMPT MẪU: Quản lý phiên làm việc và thư viện mô tả giúp AI nắm bắt chính xác ý đồ thiết kế.",  
    editHistory: "Lịch sử: Mỗi hội thoại tạo ra một nhóm đối tượng (Group) riêng biệt. Khi bạn yêu cầu chỉnh sửa, AI sẽ tự động nhận diện và cập nhật chính xác các model trong nhóm đó.",

    editSamples: "Mẫu (Samples): Thư viện prompt chuyên dụng cho kiến trúc giúp bạn tham khảo cách ra lệnh tối ưu nhất.",
    menusidebar: "Menu sidebar quản lý dữ liệu lịch sử dựng hình và Prompt mẫu",
    editFeature1Title: "Ngữ cảnh dựa trên lịch sử hội thoại",
    editFeature1Desc: "Cơ chế Đồng bộ Lịch sử: Khi bạn chọn một Group do AI kiến tạo, hệ thống sẽ tự động tải lại toàn bộ lịch sử trò chuyện của phiên làm việc đó. Điều này giúp AI tái lập ngữ cảnh thiết kế, ghi nhớ các đối tượng đã vẽ để thực hiện các bước chỉnh sửa liền mạch và đảm bảo các đối tượng mới được đưa vào đúng Group chỉ định.",
    editFeature1Caption: "Hệ thống tự động hiển thị lại Chat History khi chọn Group",
    editFeature2Title: "Nhận diện đối tượng chính xác",
    editFeature2Desc: "Để tinh chỉnh một cấu kiện cụ thể, hãy chọn đối tượng đó cùng các thành phần liên quan. Tên các Group tương ứng sẽ tự động xuất hiện trong khung chat. Khi bạn gửi yêu cầu kèm theo tên đối tượng, hệ thống sẽ ưu tiên xử lý dữ liệu của chúng trong bộ nhớ, giúp AI xác định chính xác mục tiêu cần sửa đổi với độ chính xác cao nhất.",
    editFeature2Caption: "AI tự động đọc tên Group con để chỉnh sửa chi tiết",
    guideFinal: "Vậy là chúng ta đã cùng đi qua tất cả các tính năng chính của OpenSKP. Giờ là lúc để bạn bắt đầu khám phá và thử dựng những vật thể đầu tiên phù hợp với dự án của mình.\n\nMặc dù AI đang phát triển thần tốc, nhưng nó vẫn chưa thể đạt đến sự hoàn mỹ như một Kiến trúc sư thực thụ. Sẽ có những lúc AI gặp lỗi hoặc những yêu cầu nằm ngoài khả năng xử lý. Rất mong bạn kiên nhẫn và đồng hành cùng OpenSKP. Hy vọng đây sẽ trở thành người trợ lý đắc lực hỗ trợ hiệu quả cho công việc của bạn. Xin chân thành cảm ơn!",
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
    /* Payment */
    paymentTitle: "Buy Credits",
    paymentVND: "VND",
    paymentUSD: "USD",
    paymentTotal: "Total payment:",
    paymentScan: "Scan QR to pay automatically",
    paymentSuccess: "Payment Successful!",
    paymentSuccessMsg: "Please send this code to Admin via Zalo/Facebook.",
    paymentCardDesc: "Debit or Credit Card",
    /* Guide Menu */
    guideBreadcrumb: "User Guide",
    guideToc: "Table of Contents",
    guideItem1: "1. Install & License",
    guideItem2: "2. Interface",
    guideItem3: "3. Start Drawing",
    guideItem4: "4. Edit Model",
    /* Guide Content */
    guideTitle1: "Installation Guide",
    guideTitle2: "Interface Overview",
    guideTitle3: "Start Drawing (Model Selection)",
    guideTitle4: "Edit & Manage (History)",
    /* Guide Steps */
    guideNote: "Important Note:",
    guideNoteText: "Please completely close SketchUp before installing.",
    guideStep1: "Step 1: Download and Extract",
    guideStep1Text: "Click the",
    guideStep1Text2: "button above. After downloading the .zip file, extract it to a folder on your computer.",
    guideStep2: "Step 2: Copy to Plugin folder",
    guideStep2Text: "Choose the appropriate version, then copy all files from the extracted folder to the following path:",
    guideStep3: "Step 3: Activate License",
    guideStep3Text: "Open SketchUp, you will see the OpenSKP toolbar. Click the Robot icon, Enter the key code below into the license box and you're done.",
    guideYourKey: "Your License Key:",
    loginToView: "Please login...",
    
    /* UI Descriptions */
    uiDescLicense: "Enter and manage your License Key here to activate (1 Key activates 1 device).",
    uiDescPrompt: "Product description prompt area. Enter details about dimensions, materials, style (e.g., '2m long sofa, oak legs').",
    uiDescImage: "Attach reference image button. Helps AI better understand your design ideas through visual references.",
    uiDescVoice: "Voice command button. Supports voice recognition for quick commands without typing.",
    drawIntro: "AI MODEL SELECTION: Select the AI capability that fits your needs: Credits are consumed per modeling request (Please focus on design commands to optimize your credits ^^).",
    drawFlash: "Flash (1 Credit): High speed, ideal for simple modeling and quick adjustments.",
    drawPro: "Pro (3 Credits): Enhanced precision, suitable for models requiring high detail.",
    drawProMax: "Pro Max (10 Credits): Integrated deep-reasoning model; best for analyzing and processing complex geometries with maximum accuracy.",
    guideStart: "Now that you're familiar with the interface, let's generate your first models. OpenSKP's core principle is analyzing prompts to decompose objects into individual parts (Groups/Components) and arranging them logically. Consequently, the level of detail and geometric reasoning will vary based on the AI model you select.\n\nPro-tip: Break down your workload into smaller tasks so the AI can complete each part perfectly. AI tends to struggle with overly broad requests that lack specific guidance. Don't expect it to build an entire villa in one go! Start with individual items and build from there ^^.",
    guideFlashDetail: "Flash Model: Optimized for speed and instant response. It generates generalized geometries ideal for basic requests, simple volumes, or component-level adjustments. To achieve complex results with Flash, highly detailed prompts specifying exact dimensions and quantities are required.",
    guideProDetail: "Pro Model: Features advanced reasoning capabilities, delivering significantly higher precision and logical consistency than the Flash model. It is the recommended choice for complex, multi-component objects, ensuring synchronized and high-quality 3D results.",
    guideProMaxDetail: "Pro Max Model: Our flagship model powered by Agentic AI technology. With just a high-level prompt, the AI autonomously analyzes, enriches necessary data, and develops a strategic task decomposition plan to execute each part meticulously. This approach delivers a level of detail and architectural precision that far exceeds both the Flash and Pro models.",
    guideContextDetail: "During the drawing and editing process, establishing context is crucial. It helps the system store detailed information for each Group and Component that the AI ​​has drawn. Adding context helps the AI ​​understand the user's intentions when creating or changing the shape of each specific object.",
    editIntro: "Manage your created designs:",
    editIntro2: "HISTORY & PROMPT SAMPLES: Manage design sessions and access a descriptive library to help the AI accurately capture your design intent.",
  
    editHistory: "History: Each session corresponds to a specific Model Group. When editing, the AI automatically identifies and updates the geometry within that designated group.",
  
    editSamples: "Samples: A library of professional architectural prompts to help you master effective commanding.",
    menusidebar: "The sidebar menu manages the history of rendering data and the template prompt.",
    editFeature1Title: "Context based on conversation history",
    editFeature1Desc: "Automatic History Synchronization: When you select an AI-generated Group, the system automatically reloads the entire conversation history for that session. This enables the AI to restore the design context, recall previously drawn objects for seamless editing, and ensure that new additions are accurately placed within the designated Group.",
    editFeature1Caption: "Chat history reappears automatically upon group selection",
    editFeature2Title: "Precision Object Recognition",
    editFeature2Desc: "To edit a specific component, select the target object along with any related elements. Their group names will automatically populate in the chat field. By including these names in your prompt, the system prioritizes their attributes in memory, allowing the AI to identify and modify the exact object with high precision.",
    editFeature2Caption: "Deep selection triggers automatic object naming",
    guideFinal: "We have completed our tour of the plugin's core features. Now, it's time for you to get familiar and start generating your first models that fit your project's needs.\n\nAI is evolving rapidly, but it hasn't yet reached the full spectrum of human skill and intuition. There will be occasional errors or requests that exceed current AI capabilities. We appreciate your patience as we continue to improve. Our hope is that OpenSKP becomes an indispensable tool that empowers your professional workflow and creativity. Thank you for choosing us!",
  }
};

const stepNumbers = [0, 1, 2, 3, 4]; 

// DỮ LIỆU GIẢ LẬP (MOCK DATA)
/* Thông tin session và profile giả lập dùng cho việc preview UI */
const MOCK_SESSION = {
  user: { email: 'architect@openskp.com', id: 'mock-user-id' }
};

const MOCK_PROFILE = {
  credits: 1250,
  license_key: 'OSKP-8822-1133-PRO',
  is_active: true,
  hardware_id: 'HW-8822-1133'
};

// DANH SÁCH GÓI CƯỚC VÀ CẤU HÌNH THANH TOÁN/* 
/* Các đường dẫn liên hệ và tải xuống - Định dạng cho React/JS */

const ZALO_LINK = "https:\x2f\x2fzalo.me\x2f0965585879";

const FACEBOOK_LINK = "https:\x2f\x2fweb.facebook.com\x2ftuan.936796\x2f";

const DRIVE_DOWNLOAD_LINK = "https:\x2f\x2fdrive.google.com\x2ffile\x2fd\x2f1TOwlNNs3L5C9hCiV-LX4dcpLG4y3HzPo\x2fview?usp=sharing";

/* Cấu hình tài khoản ngân hàng nhận tiền VNĐ */
const BANK_ID = "MB"; 
const BANK_ACCOUNT = "0965585879"; 
const ACCOUNT_NAME = "OPEN SKP"; 

/* Cấu hình PayPal Client ID thật */
const PAYPAL_CLIENT_ID = "ARPc_R309yq_8l2tkRJCxb6TooyNcfrF-LNN7AKv6UdlCaVSK5t6Sh8tbyS0_6hlq5lCfORUVhwXJ1Wn";

/* Danh sách các gói mua Credits (Tiền VNĐ) */
const PACKAGES_VND = [
  { id: 1, price: 50000, credits: 100, label: "Cơ bản", popular: false, currency: 'VND' },
  { id: 2, price: 100000, credits: 250, label: "Phổ biến", popular: true, currency: 'VND' },
  { id: 3, price: 200000, credits: 550, label: "Nâng cao", popular: false, currency: 'VND' },
  { id: 4, price: 500000, credits: 1500, label: "Siêu hời", popular: false, currency: 'VND' },
];

/* Danh sách các gói mua Credits (Tiền USD) */
const PACKAGES_USD = [
  { id: 'usd_1', price: 2, credits: 100, label: "Basic", popular: false, currency: 'USD' },
  { id: 'usd_2', price: 4, credits: 250, label: "Popular", popular: true, currency: 'USD' },
  { id: 'usd_3', price: 8, credits: 550, label: "Advanced", popular: false, currency: 'USD' },
  { id: 'usd_4', price: 20, credits: 1500, label: "Pro", popular: false, currency: 'USD' },
];

// COMPONENT CHÍNH: APP
export default function App() {
  
  // QUẢN LÝ TRẠNG THÁI (STATE)
  
  /* State lưu trữ thông tin người dùng (đã login hay chưa) */
  const [session, setSession] = useState(MOCK_SESSION); 
  const [profile, setProfile] = useState(MOCK_PROFILE);
  const [loading, setLoading] = useState(false);
  
  /* State điều khiển giao diện */
  const [viewMode, setViewMode] = useState('home');
  const [activeGuideStep, setActiveGuideStep] = useState(1);
  const [language, setLanguage] = useState('VN');
  
  /* State phản hồi khi copy text/key thành công */
  const [copySuccess, setCopySuccess] = useState(false);
  const [keyCopySuccess, setKeyCopySuccess] = useState(false);
  
  /* Lấy từ điển dựa trên ngôn ngữ đang chọn */
  const t = TRANSLATIONS[language];

  /* State phục vụ cho cửa sổ Thanh toán (Payment) */
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('VND');
  const [selectedPkg, setSelectedPkg] = useState(PACKAGES_VND[0]);
  const [paypalSuccess, setPaypalSuccess] = useState(null);

// KẾT NỐI: AUTHENTICATION & REALTIME
  /* Hook 1: Kiểm tra trạng thái đăng nhập và tự động lấy Profile */
  useEffect(() => {
    if (!supabaseUrl) { setLoading(false); return; }

    /* Lấy session ban đầu */
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    });

    /* TỐI ƯU HÓA: Chỉ fetch lại khi User thực sự thay đổi */
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

  /* Hook 2: Realtime - Tự động cập nhật Credits khi Database thay đổi */
  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = supabase
      .channel('realtime-credits')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${session.user.id}` },
        (payload) => {
          console.log("🔔 Data thay đổi từ Server:", payload.new);
          setProfile(payload.new);
          
          /* Nếu đang mở bảng thanh toán VNĐ mà nhận được tiền -> Tự động đóng và báo thành công */
          if (showPayment && paymentMethod === 'VND') {
             setShowPayment(false);
             setTimeout(() => alert(`✅ Đã nhận được tiền! Tài khoản đã được cộng thêm Credits.`), 500);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [session, showPayment, paymentMethod]);

  /* Hàm tải thông tin chi tiết (Credits, License Key) từ bảng 'users' */
  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (data) setProfile(data);
    } catch (error) {
      console.error("Lỗi khi tải Profile: ", error);
    } finally {
      setLoading(false);
    }
  };

  // HÀM XỬ LÝ (HANDLERS)
  
  /* Xử lý Đăng nhập bằng Google (Chuyển hướng sang trang xác thực) */
  const handleLoginGoogle = async () => {
    if (!supabaseUrl || supabaseUrl === 'https:\x2f\x2fplaceholder.supabase.co') {
        return alert("Lỗi cấu hình! Vui lòng kiểm tra file .env.local");
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
      }
    });
    if (error) {
        alert("Lỗi đăng nhập Google: " + error.message);
        setLoading(false);
    }
  };

  /* Xử lý Đăng xuất (Xóa session và reset trạng thái) */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setViewMode('home');
    setShowPayment(false);
  };

  // HÀM MỞ LINK TẢI PLUGIN
  const handleDownload = () => {
    window.open(DRIVE_DOWNLOAD_LINK, '_blank');
  };

  // HÀM MỞ POPUP NẠP THẺ
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

  // HÀM CHUYỂN ĐỔI PHƯƠNG THỨC THANH TOÁN
  const handleSwitchMethod = (method) => {
    setPaymentMethod(method);
    setPaypalSuccess(null);
    setSelectedPkg(method === 'VND' ? PACKAGES_VND[0] : PACKAGES_USD[0]);
  };

  // HÀM GIẢ LẬP THANH TOÁN PAYPAL
  const handleMockPayPalPayment = () => {
      const mockOrderId = "PAYPAL-MOCK-" + Math.random().toString(36).substr(2, 9).toUpperCase();
      setPaypalSuccess(mockOrderId);
  };

  // HÀM TẠO ĐƯỜNG LINK API GEN QR CODE
const getVietQRUrl = () => {
    /* Kiểm tra sự tồn tại của profile và gói dịch vụ trước khi tạo URL */
    if (!profile || !selectedPkg) return "";

    const key = profile.license_key || 'UNKNOWN';
    const DESCRIPTION = `OSKP ${key}`; 

    return `https:\x2f\x2fimg.vietqr.io\x2fimage\x2f${BANK_ID}-${BANK_ACCOUNT}-compact2.png?amount=${selectedPkg.price}&addInfo=${encodeURIComponent(DESCRIPTION)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;
  };

  // HÀM COPY TEXT VÀO CLIPBOARD
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

  // HÀM THAY ĐỔI NGÔN NGỮ
  const toggleLanguage = () => {
      setLanguage(prev => prev === 'VN' ? 'EN' : 'VN');
  }


  // GIAO DIỆN: LOGO SVG
  const LogoSVG = () => (
    <svg className="w-10 h-10" viewBox="0 0 24 24" style={{ color: PRIMARY_COLOR }}>
        <path d='M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-4 5h8c2.76 0 5 2.24 5 5v4c0 2.76-2.24 5-5 5H8c-2.76 0-5-2.24-5-5v-4c0-2.76 2.24-5 5-5zm1 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z' fill='currentColor'/>
        <path d='M5 23 Q 12 18, 19 23 H 5 z' fill='currentColor'/>
    </svg>
  );

  // GIAO DIỆN: BACKGROUND DECORATIONS
  const BackgroundDecorations = () => (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none h-full w-full">
         <img
            src="Sketch2.png"
            className="absolute top-[55%] -right-[5%] w-[45%] opacity-[0.15] rotate-[0deg]"
            alt="Decoration"
         />
         <img
            src="Sketch1.png"
            className="absolute top-[25%] -left-[0%] w-[50%] opacity-[0.15] rotate-[-12deg] mix-blend-multiply"
            alt="Decoration"
            onError={(e) => e.target.style.display = 'none'}
         />
         <img
            src="Sketch2.png"
            className="absolute top-[85%] -right-[5%] w-[30%] opacity-[0.04] rotate-[45deg] mix-blend-multiply"
            alt="Decoration"
            onError={(e) => e.target.style.display = 'none'}
         />
    </div>
  );

  // GIAO DIỆN: THANH ĐIỀU HƯỚNG (NAVBAR) - MOBILE ĐỒNG BỘ DESKTOP
  const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    /* Style cho text điều hướng (Serif, Màu chính, Không đậm)*/
    const navTextStyle = {
        color: PRIMARY_COLOR,
        fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
        fontSize: '16px',
        marginTop: '6px',
        fontWeight: 400
        
    };

    /*/ Component hiển thị User Info (Dùng chung cho cả Desktop và Mobile để giống hệt nhau)*/
    const UserDashboard = () => (
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
            {/* Credits Section */}
            <div className="flex items-center gap-2 pl-2">
                <div className="text-right">
                    <div className="text-[10px] uppercase text-slate-400 font-normal tracking-wider leading-none mb-0.5">{t.credits}</div>
                    <div className="text-base font-normal leading-none" style={{ color: PRIMARY_COLOR }}>
                        {profile?.credits?.toLocaleString() || 0}
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
            
            {/* License Key Section */}
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg border border-slate-200">
                    <div className="flex flex-col items-start">
                    <span className="text-[9px] font-normal text-slate-400 uppercase leading-none">{t.licenseKey}</span>
                    <code className="text-xs font-mono font-normal text-slate-700 leading-tight">{profile?.license_key || '...'}</code>
                    </div>
                    <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        if(profile?.license_key){
                            navigator.clipboard.writeText(profile.license_key);
                            setKeyCopySuccess(true);
                            setTimeout(()=>setKeyCopySuccess(false),2000);
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
              
              {/* === 1. BÊN TRÁI: LOGO + MENU DESKTOP === */}
              <div className="flex items-center gap-6 lg:gap-8">
                  {/* Logo Group */}
                  <div 
                      className="flex items-center gap-2 cursor-pointer group shrink-0" 
                      onClick={() => {
                          setViewMode('home'); 
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          setIsMobileMenuOpen(false);
                      }}
                  >
                      <div className="group-hover:scale-110 transition-transform duration-300">
                          <LogoSVG />
                      </div>
                      <span className="font-serif font-normal text-2xl tracking-tight mt-1" style={{ color: PRIMARY_COLOR }}>OpenSkp</span>
                  </div>

                  {/* Desktop Navigation Links */}
                  <div className="hidden md:flex items-center gap-5 pt-1">
                      <button onClick={() => setViewMode('guide')} className="text-sm hover:opacity-70 transition hover:scale-105" style={navTextStyle}>{t.guide}</button>
                      <button onClick={handleTopup} className="text-sm hover:opacity-70 transition hover:scale-105" style={navTextStyle}>{language === 'VN' ? 'Bảng giá' : 'Pricing'}</button>
                      <button onClick={handleDownload} className="text-sm hover:opacity-70 transition hover:scale-105" style={navTextStyle}>{t.download}</button>
                  </div>
              </div>

              {/* === 2. BÊN PHẢI: USER INFO (DESKTOP) === */}
<div className="hidden md:flex items-center gap-3 sm:gap-4">
    
    {/* Dashboard Info (Credits & Key) */}
    {session && <UserDashboard />}
    
    {/* Login/Logout Area */}
    {session ? (
        /*/ 1. Wrapper chứa sự kiện hover*/
        <div className="relative group ml-1 z-50">
            
            {/* A. Icon User (Trigger) */}
            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 cursor-pointer hover:bg-slate-200 transition shadow-sm">
                <User size={20} />
            </div>

            {/* B. Popup Menu (Gọn nhẹ) */}
            <div className="absolute right-0 top-full pt-3 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right">
                
                {/* Khung nội dung: Một hàng duy nhất */}
                <div className="bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 p-3 flex items-center gap-3">
                    
                    {/* 1. Avatar nhỏ */}
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex-shrink-0 flex items-center justify-center text-primary-brand border border-slate-100">
                        <User size={16} />
                    </div>

                    {/* 2. Email User (Thông tin duy nhất giữ lại) */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <span className="text-sm font-medium text-slate-700 truncate block" title={session.user.email}>
                            {session.user.email}
                        </span>
                    </div>

                    {/* 3. Nút Logout (Đẩy về cuối bên phải) */}
                    <button 
                        onClick={handleLogout}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition flex-shrink-0"
                        title={language === 'VN' ? 'Đăng xuất' : 'Log out'}
                    >
                        <LogOut size={18} />
                    </button>
                    
                </div>
            </div>
        </div>
    ) : (
        /*/ Nút đăng nhập (Giữ nguyên)*/
        <button onClick={handleLoginGoogle} className="px-3 py-1.5 rounded-lg text-white font-normal text-xs shadow-md hover:opacity-90 transition flex items-center gap-2" style={{ backgroundColor: PRIMARY_COLOR }}>
            <User size={14} /> <span>{t.login}</span>
        </button>
    )}
    
    {/* Language Button (Giữ nguyên) */}
    <button onClick={() => setLanguage(language === 'VN' ? 'EN' : 'VN')} className="flex items-center gap-1 text-slate-500 font-normal text-[10px] hover:text-slate-900 border border-slate-200 px-2 py-1 rounded-md bg-white">
        <Globe size={12} /><span>{language}</span>
    </button>
</div>

              {/* === 3. MOBILE MENU TOGGLE === */}
              <button 
                  className="md:hidden p-2 transition hover:bg-slate-50 rounded-lg"
                  style={{ color: PRIMARY_COLOR }}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                  {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
          </div>

          {/* === 4. MOBILE MENU (GIAO DIỆN ĐỒNG BỘ DESKTOP) === */}
          {isMobileMenuOpen && (
              <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 shadow-xl animate-in slide-in-from-top-1 duration-200 z-50">
                  <div className="flex flex-col py-4 gap-4 items-center">
                      
                      {/* Nav Links */}
                      <div className="w-full flex flex-col items-center gap-2 border-b border-gray-50 pb-4">
                        <button onClick={() => { setViewMode('guide'); setIsMobileMenuOpen(false); }} className="py-2 px-6 hover:bg-slate-50 transition w-full text-center text-base" style={navTextStyle}>{t.guide}</button>
                        <button onClick={() => { handleTopup(); setIsMobileMenuOpen(false); }} className="py-2 px-6 hover:bg-slate-50 transition w-full text-center text-base" style={navTextStyle}>{language === 'VN' ? 'Bảng giá' : 'Pricing'}</button>
                        <button onClick={() => { handleDownload(); setIsMobileMenuOpen(false); }} className="py-2 px-6 hover:bg-slate-50 transition w-full text-center text-base" style={navTextStyle}>{t.download}</button>
                      </div>

                      {/* User Info Section (Mobile) */}
                      <div className="flex flex-col items-center gap-3 w-full px-4">
                          {session ? (
                              <>
                                  {/* Hiển thị nguyên khối UserDashboard giống hệt Desktop */}
                                  <div className="scale-105 origin-center">
                                    <UserDashboard />
                                  </div>

                                  <div className="flex items-center gap-4 mt-2">
                                      <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
                                        <User size={14}/> {session.user.email}
                                      </div>
                                      <button onClick={handleLogout} className="flex items-center gap-1 text-red-500 bg-red-50 px-3 py-1 rounded-full text-xs font-bold hover:bg-red-100 transition">
                                          <LogOut size={14} /> {t.logout}
                                      </button>
                                  </div>
                              </>
                          ) : (
                              <button 
                                  onClick={() => { handleLoginGoogle(); setIsMobileMenuOpen(false); }}
                                  className="w-full max-w-xs py-3 rounded-lg text-white font-normal text-sm shadow-md flex items-center justify-center gap-2"
                                  style={{ backgroundColor: PRIMARY_COLOR }}
                              >
                                  <User size={16} /> {t.login}
                              </button>
                          )}
                          
                          <button 
                              onClick={() => setLanguage(language === 'VN' ? 'EN' : 'VN')} 
                              className="text-xs text-slate-400 mt-2 hover:text-slate-600 flex items-center gap-1 bg-white border border-slate-200 px-3 py-1 rounded-full"
                          >
                              <Globe size={12} /> Language: {language}
                          </button>
                      </div>
                  </div>
              </div>
          )}
      </nav>
    );
  };
  
  // GIAO DIỆN: LỜI CHÀO GIỚI THIỆU
const HeroSection = () => (
  <div className="flex flex-col items-center text-center mb-24 mt-6 animate-fade-in px-4 relative z-20">
      
      {/* 1. Hình ảnh Robot */}
      <div className="relative z-0 -mb-0.5 pointer-events-none select-none">
          <img 
              src="/robot-drawing.png" 
              alt="Robot Architect" 
              className="w-60 sm:w-[24rem] h-auto object-contain"
              onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https:\x2f\x2fplacehold.co/300x300/fdfbf7/0063A3?text=Robot+PNG";
              }}
          />
      </div>

      {/* 2. Tiêu đề chính */}
      <div className="relative z-10 pt-4">
          <h1 className="text-3xl font-serif sm:text-5xl mb-4 max-w-3xl leading-tight text-primary-brand">
              {t.heroTitle} <br/>
          </h1>
          <h1 className="text-lg sm:text-2xl mt-2 block text-primary-brand ">
                  {t.heroSubtitle}
              </h1>
      </div>

      {/* 3. Các nút bấm (Buttons) */}
      <div className="flex flex-col sm:flex-row gap-4 mt-6 mb-1 relative z-20">
          
          {/* Nút Download */}
          <button 
              onClick={handleDownload}
              className="px-8 py-3 rounded-xl bg-primary-brand text-white font-bold text-lg shadow-lg hover:translate-y-[-2px] transition flex items-center justify-center gap-2"
          >
              <Download size={20} /> {t.download}
          </button>

          {/* Nút Hướng dẫn */}
          <button 
              onClick={() => setViewMode(viewMode === 'home' ? 'guide' : 'home')}
              className={`px-8 py-3 rounded-xl border-2  font-bold text-lg transition flex items-center justify-center gap-2
                  ${viewMode === 'guide' 
                      ? 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-400 hover:bg-slate-50' 
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-400 hover:bg-slate-50'}`}
          >
               {viewMode === 'guide' ? t.backHome : t.guide}
          </button>
      </div>
  </div>
);

 // GIAO DIỆN: SHOWCASE CONTENT
const ShowcaseContent = () => {

  /* =========================================================================
     DANH SÁCH DỮ LIỆU: BẠN CHỈ CẦN THÊM HOẶC SỬA Ở ĐÂY
     - image: Có thể dùng link online hoặc đường dẫn file nội bộ (vd: /gifs/my-video.gif)
     - isReverse: false (Ảnh bên phải), true (Ảnh bên trái)
     ========================================================================= */
  const SHOWCASE_LIST = [
    {
      title: t.showcase1Title,
      desc: t.showcase1Desc,
      /* Thay link GIF của bạn vào đây (Link Giphy hoặc link local) */
      image: `https:\x2f\x2fmedia1.giphy.com\x2fmedia\x2fv1.Y2lkPTc5MGI3NjExcHd4eGl5dnNya3RudnJjOXluOHBteGlqYnliemxzMTBzMzkxNGQxbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw\x2fdJX6ig7de21xe\x2fgiphy.gif`,
      isReverse: false,
      rotate: "rotate-1"
    },
    {
      title: t.showcase2Title,
      desc: t.showcase2Desc,
      /* Để dùng ảnh tự tải lên: 1. Bỏ ảnh vào thư mục public/assets 2. Ghi link: /assets/ten-anh.gif */
      image: `https:\x2f\x2fmedia1.giphy.com\x2fmedia\x2fv1.Y2lkPTc5MGI3NjExcHd4eGl5dnNya3RudnJjOXluOHBteGlqYnliemxzMTBzMzkxNGQxbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw\x2fdJX6ig7de21xe\x2fgiphy.gif`,
      isReverse: true,
      rotate: "-rotate-1"
    },
    {
      title: t.showcase2Title,
      desc: t.showcase2Desc,
      /* Để dùng ảnh tự tải lên: 1. Bỏ ảnh vào thư mục public/assets 2. Ghi link: /assets/ten-anh.gif */
      image: `https:\x2f\x2fmedia1.giphy.com\x2fmedia\x2fv1.Y2lkPTc5MGI3NjExcHd4eGl5dnNya3RudnJjOXluOHBteGlqYnliemxzMTBzMzkxNGQxbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw\x2fdJX6ig7de21xe\x2fgiphy.gif`,
      isReverse: true,
      rotate: "-rotate-1"
    },
    /* BẠN MUỐN THÊM KHỐI THỨ 3? Chỉ cần copy khối này và dán xuống dưới */
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-24 animate-slide-up pb-20 px-4 relative z-10">
      {SHOWCASE_LIST.map((item, index) => (
        <ShowcaseItem 
          key={index}
          title={item.title}
          desc={item.desc}
          image={item.image}
          isReverse={item.isReverse}
          rotateClass={item.rotate}
        />
      ))}
    </div>
  );
};

/* COMPONENT CON: XỬ LÝ HIỂN THỊ TỪNG DÒNG */
const ShowcaseItem = ({ title, desc, image, isReverse, rotateClass }) => {
  return (
    <div className={`flex flex-col ${isReverse ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-10`}>
      
      {/* Khối chữ */}
      <div className="flex-1 space-y-4 text-center md:text-left">
        <h3 className="text-2xl font-normal" style={{ color: PRIMARY_COLOR }}>
          {title}
        </h3>

        <h3 className="text-slate-600 text-lg leading-normal">
          {desc}
        </h3>
      </div>

      {/* Khối hình ảnh/GIF */}
      <div className="flex-[1.5] w-full">
        <div className={`aspect-video bg-white border-2 border-slate-200 rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] p-2 overflow-hidden transform ${rotateClass} hover:rotate-0 transition duration-500`}>
          <img 
            src={image}
            alt="OpenSkp Feature Preview" 
            className="w-full h-full object-cover rounded-lg"
            /* Xử lý khi ảnh bị lỗi hoặc không tìm thấy file */
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https:\x2f\x2fplacehold.co\x2f600x400\x2fe2e8f0\x2f0063A3?text=Preview+Loading...`;
            }}
          />
        </div>
      </div>

    </div>
  );
};

   // MOCK UI COMPONENT CHO HƯỚNG DẪN GIAO DIỆN (CẬP NHẬT GIAO DIỆN CHUẨN) ---
const MockPluginUI = ({ variant = 'default' }) => {
  const [activeTab, setActiveTab] = React.useState('history');

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden flex flex-col h-[650px] text-slate-800 font-sans border border-slate-200 relative select-none">
        {/* Header */}
        <div className="h-16 border-b border-slate-200 flex items-center justify-between px-4 bg-white z-30 relative">
             <div className="flex items-center gap-2">
                 <LogoSVG /> 
                 <span className="font-serif font-medium text-lg text-[#005a9e]">OpenSkp</span>
             </div>
             <div className="p-1.5 hover:bg-slate-100 rounded text-slate-500 cursor-pointer relative" title="Lịch sử & Mẫu">
                 <Menu size={24} />
                 {variant === 'sidebar' && (
                     <span className="absolute top-1 right-1 flex h-6 w-6">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500/50"></span>
                     </span>
                 )}
             </div>
        </div>
        
        {/* Main Body */}
        <div className="flex-1 flex relative overflow-hidden">
             {/* Sidebar (Dynamic Width) */}
             <div className={`${variant === 'sidebar' ? 'w-64 border-r' : 'w-0'} bg-white border-slate-200 transition-all duration-300 overflow-hidden flex flex-col shrink-0 relative z-20`}>
                {variant === 'sidebar' && (
                    <>
                        {/* [BỔ SUNG]: Tabs chuyển đổi với logic active */}
                        <div className="flex border-b border-slate-200">
                            <div 
                                onClick={() => setActiveTab('history')}
                                className={`flex-1 py-3 text-center text-xs font-bold cursor-pointer transition-colors ${activeTab === 'history' ? 'text-[#0078d7] border-b-2 border-[#0078d7] bg-slate-50' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                History
                            </div>
                            <div 
                                onClick={() => setActiveTab('prompt')}
                                className={`flex-1 py-3 text-center text-xs font-bold cursor-pointer transition-colors ${activeTab === 'prompt' ? 'text-[#0078d7] border-b-2 border-[#0078d7] bg-slate-50' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                Prompt
                            </div>
                        </div>

                        {/* [BỔ SUNG]: Nội dung thay đổi dựa trên activeTab */}
                        <div className="flex-1 overflow-y-auto bg-white">
                            {activeTab === 'history' ? (
                                /* Nội dung Lịch sử cũ */
                                <>
                                    <div className="p-3 border-b border-slate-100 hover:bg-blue-50 cursor-pointer bg-blue-50 border-l-4 border-l-[#0078d7]">
                                        <div className="font-bold text-sm text-slate-800 mb-0.5">Tủ bếp chữ L</div>
                                        <div className="text-[11px] text-slate-500">10/06/2024</div>
                                    </div>
                                    <div className="p-3 border-b border-slate-100 hover:bg-blue-50 cursor-pointer">
                                        <div className="font-bold text-sm text-slate-700 mb-0.5">Bàn ăn 6 ghế</div>
                                        <div className="text-[11px] text-slate-500">09/06/2024</div>
                                    </div>
                                    <div className="p-3 border-b border-slate-100 hover:bg-blue-50 cursor-pointer">
                                        <div className="font-bold text-sm text-slate-700 mb-0.5">Sofa phòng khách</div>
                                        <div className="text-[11px] text-slate-500">08/06/2024</div>
                                    </div>
                                </>
                            ) : (
                                /* Nội dung Prompt Mẫu Mới */
                                <>
                                    <div className="p-3 border-b border-slate-100 hover:bg-orange-50 cursor-pointer group">
                                        <div className="font-bold text-sm text-slate-700 mb-0.5 group-hover:text-[#0078d7]">Bàn gỗ</div>
                                        <div className="text-[11px] text-slate-500 line-clamp-2">Bàn làm việc 1200×600×750. 4 chân gỗ 40×40 đặt lùi 50mm từ các mép bàn. Khung giằng dưới mặt bàn gồm 4 thanh 100×20 bao quanh liên kết với chân</div>
                                    </div>
                                    <div className="p-3 border-b border-slate-100 hover:bg-orange-50 cursor-pointer group">
                                        <div className="font-bold text-sm text-slate-700 mb-0.5 group-hover:text-[#0078d7]">Tủ bếp dưới</div>
                                        <div className="text-[11px] text-slate-500 line-clamp-2">Tủ bếp dưới dài 3000, cao 800, sâu 600. Gồm 6 khoang:Khoang 1 rộng 300.Khoang 2 rộng 1000 có 2 ngăn kéo.Khoang 3 rộng 300 3 khoang còn lại chia đều. Các khoang phủ cánh, mặt hậu kín. Ván dày 18, mặt đá 20 có khoét chậu rửa 1000x450 ở bên phải. Khung chân 100</div>
                                    </div>
                                    <div className="p-3 border-b border-slate-100 hover:bg-orange-50 cursor-pointer group">
                                        <div className="font-bold text-sm text-slate-700 mb-0.5 group-hover:text-[#0078d7]">Tủ quần áo</div>
                                        <div className="text-[11px] text-slate-500 line-clamp-2">Tủ quần áo dài 2400, cao 2600, sâu 600. Gồm 4 khoang rộng 600 mỗi khoang.Khoang 1: 1 đợt + 1 suốt treo dài.Khoang 2: 1 đợt + suốt treo + 2 ngăn kéo dưới.Khoang 3: 4 đợt chia 5 ngăn bằng nhau.Khoang 4: giống khoang 1.Cánh mở 4 cánh, mỗi cánh 600. Ván 18, hậu 9. Chân cao 100</div>
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                )}
             </div>
             
             {/* Chat Area */}
             <div className="flex-1 bg-[#f5f7fa] flex flex-col justify-end relative overflow-hidden @container">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#ccc] font-medium text-lg pointer-events-none text-center w-full px-4">
                    {variant === 'sidebar' ? 'Chọn một mục từ danh sách...' : 'Xin chào! Chúng ta sẽ vẽ gì hôm nay.'}
                </div>
                
                {/* New Chat Button (Floating) */}
                <div className="absolute bottom-36 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-[#0078d7] border border-slate-200 px-4 py-2 rounded-full shadow-sm text-sm font-semibold flex items-center gap-2 cursor-pointer hover:bg-[#f0f8ff] z-10 transition-all hidden @[300px]:flex">
                    <Plus size={16} />
                    New model
                </div>
                
                {/* Input Container */}
                <div className="overflow-hidden bg-white p-3 border-t border-slate-200 shadow-[0_-2px_5px_rgba(0,0,0,0.02)] z-5">
                    {/* Model Badges */}
                    <div className="flex flex-nowrap gap-4 mb-0.5 px-1 text-xs text-slate-500 items-center  ">
                        
                        <label className="relative flex items-center gap-1.5 cursor-pointer whitespace-nowrap flex-shrink-0 px-2 py-1">
        <input type="radio" checked readOnly className="accent-[#0078d7]"/> 
        Flash (1 Cr)
       {variant === 'model' && (
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-6 w-6 pointer-events-none">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-100"></span>
                <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500/50"></span> 
            </span>
        )}
    </label>
                        <label className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap flex-shrink-0">
                            <input type="radio" readOnly/> Pro (3 Cr)
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap flex-shrink-0">
                            <input type="radio" readOnly/> Pro Max (10 Cr)
                        </label>
                    </div>
                    
                    {/* Input Bar */}
                    <div className="overflow-hidden bg-[#f0f2f5] rounded-[24px] p-2 flex items-end gap-2 border border-transparent focus-within:bg-white focus-within:border-[#0078d7] focus-within:shadow-[0_0_0_2px_rgba(0,120,215,0.1)] transition-all">
                        <button className="w-9 h-9 rounded-full hover:bg-slate-200 text-slate-500 flex items-center justify-center flex-shrink-0 transition-colors">
                            <ImageIcon size={20} />
                        </button>
                        
                        <textarea className="flex-1 bg-transparent border-none outline-none resize-none text-[14px] py-2 max-h-32 text-slate-800" rows={1} placeholder="Nhập mô tả..."></textarea>
                        
                        <button className="w-9 h-9 rounded-full hover:bg-slate-200 text-slate-500 flex items-center justify-center flex-shrink-0 transition-colors">
                                <Mic size={20} />
                        </button>
                        
                        <button className="w-9 h-9 rounded-full text-[#0078d7] hover:bg-slate-100 flex items-center justify-center flex-shrink-0 transition-colors">
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer (License) */}
        <div className="bg-[#f9f9f9] border-t border-slate-200 p-3 text-xs relative z-30">
            <div className="relative w-full flex items-center">
                 <div className="absolute left-3 flex items-center justify-center w-5 h-5 text-slate-400">
    {/* Icon Key nằm dưới */}
    <Key size={18} className="relative z-10" />

    {/* Chấm ping nằm đè lên chính giữa */}
    {variant === 'default' && (
        <span className="absolute flex h-6 w-6">
            {/* Vòng tròn hiệu ứng ping */}
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            {/* Chấm tròn tâm */}
            <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500/40"></span>
        </span>
    )}
</div>
                 
                 <input type="password" value="OSKP-DEMO-KEY-8822" readOnly className="w-full bg-white border border-slate-300 rounded py-2 pl-9 pr-9 text-center font-mono text-[#555] focus:border-[#0078d7] focus:outline-none"/>
                 <div className="absolute right-3 text-slate-400 cursor-pointer hover:text-[#0078d7]">
                     <EyeOff size={18} />
                 </div>
            </div>
        </div>
    </div>
  );
}
// GIAO DIỆN: HƯỚNG DẪN
const GuideContent = () => {
    const contentTopRef = useRef(null);

    useEffect(() => {
        if (contentTopRef.current) {
            const elementPosition = contentTopRef.current.getBoundingClientRect().top;
            const offset = 120;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    }, [activeGuideStep]);

    const renderGuideContent = () => {
        switch (activeGuideStep) {
            case 1:
                /* Nội dung Bước 1: Cài đặt (INSTALLATION) */
                return (
                    <article className="prose prose-slate max-w-none">
                        {/* Tiêu đề dùng font-brand + text-primary-brand */}
                        <h2 className="text-3xl font-brand font-normal mb-6 pb-2 border-b border-slate-100 text-primary-brand">
                            {t.guideTitle1}
                        </h2>

                        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6 rounded-r-lg">
                            <h5 className="text-orange-800 text-sm font-medium m-0">
                                <strong>{t.guideNote}</strong> {t.guideNoteText}
                            </h5>
                        </div>

                        <h3 className="text-xl font-brand font-normal mt-8 mb-4 text-primary-brand">
                            {t.guideStep1}
                        </h3>
                        <h5 className="text-slate-600 mb-4 leading-normal">
                            {t.guideStep1Text} 
                            {/* Nút nhỏ dùng bg-primary-brand */}
                            <span className="font-bold text-white px-2 py-0.5 rounded text-sm mx-1 bg-primary-brand">
                                {t.download}
                            </span> 
                            {t.guideStep1Text2}
                        </h5>

                        <h3 className="text-xl font-brand font-normal mt-8 mb-4 text-primary-brand">
                            {t.guideStep2}
                        </h3>
                        <h5 className="text-slate-600 mb-0.5">{t.guideStep2Text}</h5>
                        
                        {/* Đường dẫn file dùng font-tech hoặc mono */}
                        <div className="bg-slate-500 text-slate-200 p-4 rounded-xl text-sm font-tech overflow-x-auto mb-6 shadow-inner">
                            C:\Users\[User_Name]\AppData\Roaming\SketchUp\SketchUp 202x\SketchUp\Plugins
                        </div>

                        <h3 className="text-xl font-brand font-normal mt-8 mb-4 text-primary-brand">
                            {t.guideStep3}
                        </h3>
                        <h5 className="text-slate-600 mb-4">{t.guideStep3Text}</h5>

                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mt-4 max-w-md">
                            <h5 className="text-sm text-blue-800 font-bold mb-0.5">{t.guideYourKey}</h5>
                            <div className="flex items-center justify-between font-tech text-lg text-slate-800 bg-white pl-4 pr-2 py-2 rounded border border-blue-200 shadow-sm">
                                <span className="truncate mr-2">
                                    {session ? profile?.license_key : t.loginToView}
                                </span>
                                {session && (
                                    <button
                                        onClick={() => copyToClipboard(profile?.license_key, true)}
                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-md transition-colors"
                                        title={t.copyKey}
                                    >
                                        {keyCopySuccess ? <CheckCircle2 size={20} className="text-green-600" /> : <Copy size={20} />}
                                    </button>
                                )}
                            </div>
                        </div>
                    </article>
                );

            case 2:
                /* Nội dung Bước 2: Giao diện (INTERFACE) */
                return (
                    <article className="prose prose-slate max-w-none">
                        <h2 className="text-3xl font-brand font-normal mb-8 pb-2 border-b border-slate-100 text-primary-brand">
                            {t.guideTitle2}
                        </h2>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                            {/* Cột trái: Mock UI */}
                            <div className="lg:col-span-1">
                                <MockPluginUI />
                            </div>

                            {/* Cột phải: Giải thích */}
                            <div className="lg:col-span-1 space-y-8 pt-4">
                                {/* Item 1 */}
                                <div className="pl-2">
                                    <h4 className="text-xl flex items-center gap-3 mb-0.5 font-brand text-primary-brand">
                                        <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm text-primary-brand">
                                            <Key size={18} />
                                        </span>
                                        License Key
                                    </h4>
                                    <h5 className="text-slate-600 leading-normal pl-11 m-0 text-justify text-justify">{t.uiDescLicense}</h5>
                                </div>

                                {/* Item 2 */}
                                <div className="pl-2">
                                    <h4 className="text-xl flex items-center gap-3 mb-0.5 font-brand text-primary-brand">
                                        <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm text-primary-brand">
                                            <MessageCircle size={18} />
                                        </span>
                                        Prompt Input
                                    </h4>
                                    <h5 className="text-slate-600 leading-normal pl-11 m-0 text-justify">{t.uiDescPrompt}</h5>
                                </div>

                                {/* Item 3 */}
                                <div className="pl-2">
                                    <h4 className="text-xl flex items-center gap-3 mb-0.5 font-brand text-primary-brand">
                                        <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm text-primary-brand">
                                            <ImageIcon size={18} />
                                        </span>
                                        Image Attachment
                                    </h4>
                                    <h5 className="text-slate-600 leading-normal pl-11 m-0 text-justify">{t.uiDescImage}</h5>
                                </div>

                                {/* Item 4 */}
                                <div className="pl-2">
                                    <h4 className="text-xl flex items-center gap-3 mb-0.5 font-brand text-primary-brand">
                                        <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm text-primary-brand">
                                            <Mic size={18} />
                                        </span>
                                        Voice Input
                                    </h4>
                                    <h5 className="text-slate-600 leading-normal pl-11 m-0 text-justify">{t.uiDescVoice}</h5>
                                </div>
                            </div>
                        </div>

                        {/* Phần Draw Intro */}
                        <h5 className="text-slate-600 mb-6 text-justify">{t.drawIntro}</h5>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                            <div className="lg:col-span-1">
                                <MockPluginUI variant="model" />
                            </div>

                            <div className="lg:col-span-1 space-y-8 pt-4">
                                <div className="pl-2">
                                    <h4 className="text-xl flex items-center gap-3 mb-0.5 font-brand text-primary-brand">
                                        <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm text-primary-brand">
                                            <CheckCircle2 size={18} />
                                        </span>
                                        Flash
                                    </h4>
                                    <h5 className="text-slate-600 leading-normal pl-11 m-0 text-justify">{t.drawFlash}</h5>
                                </div>
                                <div className="pl-2">
                                    <h4 className="text-xl flex items-center gap-3 mb-0.5 font-brand text-primary-brand">
                                        <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm text-primary-brand">
                                            <CheckCircle2 size={18} />
                                        </span>
                                        Pro
                                    </h4>
                                    <h5 className="text-slate-600 leading-normal pl-11 m-0 text-justify">{t.drawPro}</h5>
                                </div>
                                <div className="pl-2">
                                    <h4 className="text-xl flex items-center gap-3 mb-0.5 font-brand text-primary-brand">
                                        <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm text-primary-brand">
                                            <CheckCircle2 size={18} />
                                        </span>
                                        Pro max
                                    </h4>
                                    <h5 className="text-slate-600 leading-normal pl-11 m-0 text-justify">{t.drawProMax}</h5>
                                </div>
                            </div>
                        </div>

                        {/* Phần Sidebar Menu */}
                        <h5 className="text-slate-600 mb-6 text-justify">{t.editIntro2}</h5>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-8">
                            <div className="lg:col-span-1">
                                <MockPluginUI variant="sidebar" />
                            </div>
                            <div className="lg:col-span-1 space-y-8 pt-4">
                                <div className="pl-2">
                                    <h4 className="text-xl flex items-center gap-3 mb-0.5 font-brand text-primary-brand">
                                        <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm text-primary-brand">
                                            <Menu size={18} />
                                        </span>
                                        Menu Sidebar
                                    </h4>
                                    <h5 className="text-slate-600 leading-normal pl-11 m-0 text-justify">{t.menusidebar}</h5>
                                </div>
                                <div className="pl-2">
                                    <h4 className="text-xl flex items-center gap-3 mb-0.5 font-brand text-primary-brand">
                                        <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm text-primary-brand">
                                            <History size={18} />
                                        </span>
                                        History
                                    </h4>
                                    <h5 className="text-slate-600 leading-normal pl-11 m-0 text-justify">{t.editHistory}</h5>
                                </div>
                                <div className="pl-2">
                                    <h4 className="text-xl flex items-center gap-3 mb-0.5 font-brand text-primary-brand">
                                        <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm text-primary-brand">
                                            <MessageCircle size={18} />
                                        </span>
                                        Prompt
                                    </h4>
                                    <h5 className="text-slate-600 leading-normal pl-11 m-0 text-justify">{t.editSamples}</h5>
                                </div>
                            </div>
                        </div>
                    </article>
                );

            case 3:
                /* Nội dung Bước 3: Bắt đầu vẽ (START DRAWING) */
                return (
                    <article className="prose prose-slate max-w-none">
                        <h2 className="text-3xl font-brand font-normal mb-6 pb-2 border-b border-slate-100 text-primary-brand">
                            {t.guideTitle3}
                        </h2>
                        <h5 className="text-slate-600 leading-relaxed mb-6 max-w-3xl text-justify whitespace-pre-line">
                            {t.guideStart || "Lựa chọn chế độ dựng hình phù hợp để tối ưu hóa hiệu suất và chất lượng đầu ra."}
                        </h5>

                        <div className="flex flex-col space-y-16">
                            {/* --- KHỐI 1: FLASH MODE --- */}
                            <div className="group">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="flex items-center justify-center">
                                        <Zap size={24} strokeWidth={1.5} className="text-primary-brand" />
                                    </span>
                                    <h3 className="text-2xl font-brand font-normal m-0 text-primary-brand">
                                        Flash Mode
                                    </h3>
                                </div>
                                <h5 className="text-slate-600 leading-relaxed mb-6 max-w-3xl text-justify">
                                    {t.guideFlashDetail || "Chế độ tốc độ cao dành cho việc phác thảo ý tưởng nhanh..."}
                                </h5>
                                
                                {/* ĐÃ SỬA: Dùng thẻ Video với các thuộc tính để chạy lặp như ảnh GIF */}
                                <div className="w-full aspect-video rounded-xl bg-slate-50 border border-slate-200 shadow-sm relative overflow-hidden pointer-events-none">
                                    <video 
                                        autoPlay 
                                        loop 
                                        muted 
                                        playsInline
                                        className="w-full h-full object-cover"
                                    >
                                        <source src="/210226.mp4" type="video/mp4" />
                                    </video>
                                </div>

                                <h5 className="mt-3 text-center text-sm text-slate-500 italic">
                                    {t.editFeature1Caption}
                                </h5>
                            </div>

                            {/* --- KHỐI 2: PRO MODE --- */}
                            <div className="group">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="flex items-center justify-center">
                                        <Star size={24} strokeWidth={1.5} className="text-primary-brand" />
                                    </span>
                                    <h3 className="text-2xl font-brand font-normal m-0 text-primary-brand">
                                        Pro Mode
                                    </h3>
                                </div>
                                <h5 className="text-slate-600 leading-relaxed mb-6 max-w-3xl text-justify">
                                    {t.guideProDetail || "Chế độ cân bằng hoàn hảo..."}
                                </h5>
                                <div className="w-full aspect-video rounded-xl bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] opacity-50"></div>
                                    <div className="z-10 text-center">
                                        <span className="text-slate-400 text-sm font-medium italic">[ Animation: Pro Mode ]</span>
                                    </div>
                                </div>
                                <h5 className="mt-3 text-center text-sm text-slate-500 italic">
                                    {t.editFeature1Caption}
                                </h5>
                            </div>

                            {/* --- KHỐI 3: PRO MAX --- */}
                            <div className="group">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="flex items-center justify-center">
                                        <Box size={24} strokeWidth={1.5} className="text-primary-brand" />
                                    </span>
                                    <h3 className="text-2xl font-brand font-normal m-0 text-primary-brand">
                                        Pro Max
                                    </h3>
                                </div>
                                <h5 className="text-slate-600 leading-relaxed mb-6 max-w-3xl text-justify">
                                    {t.guideProMaxDetail || "Sức mạnh tối đa..."}
                                </h5>
                                <div className="w-full aspect-video rounded-xl bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] opacity-50"></div>
                                    <div className="z-10 text-center">
                                        <span className="text-slate-400 text-sm font-medium italic">[ Animation: Pro Max ]</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                );

            case 4:
                /* Nội dung Bước 4: Quản lý và chỉnh sửa (EDIT MODEL) */
                return (
                    <article className="prose prose-slate max-w-none">
                        <h2 className="text-3xl font-brand font-normal mb-6 pb-2 border-b border-slate-100 text-primary-brand">
                            {t.guideTitle4}
                        </h2>
                        <h5 className="text-slate-600 leading-relaxed mb-6 max-w-3xl text-justify">
                            {t.guideContextDetail || "Công cụ hỗ trợ chỉnh sửa thông minh..."}
                        </h5>

                        <div className="flex flex-col space-y-16">
                            {/* --- TÍNH NĂNG 1: KHÔI PHỤC NGỮ CẢNH --- */}
                            <div className="group">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="flex items-center justify-center">
                                        <History size={24} strokeWidth={1.5} className="text-primary-brand" />
                                    </span>
                                    <h3 className="text-2xl font-brand font-normal m-0 text-primary-brand">
                                        {t.editFeature1Title || "Khôi phục ngữ cảnh thông minh"}
                                    </h3>
                                </div>
                                <h5 className="text-slate-600 leading-relaxed mb-6 max-w-3xl text-justify">
                                    {t.editFeature1Desc || "Khi chọn một Group do AI tạo ra..."}
                                </h5>
                                <div className="w-full aspect-video rounded-xl bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] opacity-50"></div>
                                    <div className="z-10 text-center">
                                        <span className="text-slate-400 text-sm font-medium italic">[ Animation: Auto-Load Chat History ]</span>
                                    </div>
                                </div>
                                <h5 className="mt-3 text-center text-sm text-slate-500 italic">
                                    {t.editFeature1Caption}
                                </h5>
                            </div>

                            {/* --- TÍNH NĂNG 2: NHẬN DIỆN ĐỐI TƯỢNG --- */}
                            <div className="group">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="flex items-center justify-center">
                                        <ScanEye size={24} strokeWidth={1.5} className="text-primary-brand" />
                                    </span>
                                    <h3 className="text-2xl font-brand font-normal m-0 text-primary-brand">
                                        {t.editFeature2Title || "Nhận diện đối tượng chính xác"}
                                    </h3>
                                </div>
                                <h5 className="text-slate-600 leading-relaxed mb-6 max-w-3xl text-justify">
                                    {t.editFeature2Desc || "Khi chọn thành phần con..."}
                                </h5>
                                <div className="w-full aspect-video rounded-xl bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] opacity-50"></div>
                                    <div className="z-10 text-center">
                                        <span className="text-slate-400 text-sm font-medium italic">[ Animation: Sub-Group Identification ]</span>
                                    </div>
                                </div>
                                <h5 className="mt-3 text-center text-sm text-slate-500 italic">
                                    {t.editFeature2Caption}
                                </h5>
                            </div>
                            <h5 className="text-slate-600 leading-relaxed mb-6 max-w-3xl text-justify whitespace-pre-line">
                                    {t.guideFinal || "Khi chọn thành phần con..."}
                                </h5>
                        </div>
                    </article>
                );
            default: return null;
        }
    }

    return (
        <div className="max-w-6xl mx-auto mb-0.5 animate-fade-in min-h-[50vh] px-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Menu Sidebar */}
                <div className="md:col-span-1 hidden md:block">
                    <div className="sticky top-24 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-5 shadow-sm">
                        <h4 className="font-normal text-2xl mb-4 flex items-center gap-2 font-brand text-primary-brand">
                            <Menu size={20} /> {t.guideToc}
                        </h4>
                        <ul className="space-y-1 text-sm">
                            {[1, 2, 3, 4].map((step) => (
                                <h5 
                                    key={step}
                                    onClick={() => setActiveGuideStep(step)} 
                                    className={`cursor-pointer p-2 rounded-lg transition flex items-center gap-2 
                                        ${activeGuideStep === step 
                                            ? 'bg-blue-50 text-blue-700 font-bold' 
                                            : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {activeGuideStep === step && <ArrowRight size={14} />} 
                                    {t[`guideItem${step}`]}
                                </h5>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Main Content */}
                <div
                    ref={contentTopRef}
                    className="md:col-span-3 bg-white border border-slate-200 rounded-xl p-8 shadow-sm relative overflow-hidden min-h-[500px]"
                >
                    <div
                        className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{
                            backgroundImage: `url("https:\x2f\x2fwww.transparenttextures.com/patterns/notebook.png")`
                        }}
                    ></div>
                    <div className="relative z-10">
                        {renderGuideContent()}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center mt-12 pt-6 border-t border-slate-100">
                            {/* PREVIOUS BUTTON */}
                            <button
                                onClick={() => setActiveGuideStep(Math.max(1, activeGuideStep - 1))}
                                disabled={activeGuideStep === 1}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition
                                    ${activeGuideStep === 1
                                        ? 'text-slate-300 cursor-not-allowed'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                            >
                                <ArrowLeft size={16} />
                                {activeGuideStep > 1
                                    ? t[`guideItem${activeGuideStep - 1}`]
                                    : t.guidePrev}
                            </button>

                            {/* NEXT BUTTON */}
                            <button
                                onClick={() => setActiveGuideStep(Math.min(4, activeGuideStep + 1))}
                                disabled={activeGuideStep === 4}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition
                                    ${activeGuideStep === 4
                                        ? 'text-slate-300 cursor-not-allowed'
                                        : 'bg-primary-brand text-white hover:opacity-90 shadow-md hover:shadow-lg'
                                    }`}
                            >
                                {activeGuideStep < 4
                                    ? t[`guideItem${activeGuideStep + 1}`]
                                    : t.guideNext}
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

  // GIAO DIỆN: PAYMENT MODAL
  /* Component Modal thanh toán nội bộ */
  const PaymentModal = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 ">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
            
            {/* Cột trái: Chọn phương thức và gói cước */}
            <div className="flex-1 p-6 bg-slate-50 border-r border-slate-100 flex flex-col">
                <h3 className="text-xl font-normal mb-4 flex items-center gap-2 font-serif" style={{ color: PRIMARY_COLOR }}>
                     {t.paymentTitle}
                </h3>
                
                {/* Nút chuyển đổi VNĐ / USD */}
                <div className="flex bg-slate-200 p-1 rounded-xl mb-4 font-sans shrink-0">
                    <button onClick={() => handleSwitchMethod('VND')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${paymentMethod === 'VND' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}>
                        {t.paymentVND}
                    </button>
                    <button onClick={() => handleSwitchMethod('USD')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${paymentMethod === 'USD' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>
                        {t.paymentUSD}
                    </button>
                </div>

                {/* Danh sách các gói nạp */}
                <div className="space-y-3  flex-1 custom-scrollbar pr-1">
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

            {/* Cột phải: Khu vực thực hiện thanh toán */}
            <div className="flex-1 flex flex-col bg-white relative overflow-y-auto custom-scrollbar">
                 <button onClick={() => setShowPayment(false)} className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-full transition text-slate-500">
                    <X className="w-6 h-6"/>
                </button>

                <div className="px-8 pt-16 pb-8 flex flex-col items-center justify-start min-h-full text-center">
                    {paypalSuccess ? (
                         /* Giao diện khi thanh toán thành công */
                         <div className="animate-fade-in w-full">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle2 className="w-10 h-10" /></div>
                            <h3 className="text-xl font-bold text-slate-800">{t.paymentSuccess}</h3>
                            <div className="bg-slate-100 p-3 rounded-lg font-mono text-sm border border-slate-200 my-4 select-all text-slate-700">{paypalSuccess}</div>
                            <h5 className="text-slate-500 text-xs">{t.paymentSuccessMsg}</h5>
                        </div>
                    ) : (
                        /* Giao diện thanh toán */
                        <div className="w-full">
                            <h5 className="text-slate-500 text-sm mb-4">{t.paymentTotal} <span className="text-2xl font-bold text-slate-800 block mt-1">{selectedPkg.price.toLocaleString('vi-VN')} {paymentMethod === 'VND' ? 'đ' : '$'}</span></h5>
                            
                            {paymentMethod === 'VND' ? (
                                /* Hiện QR Code thanh toán qua VietQR */
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
                                /* Nút thanh toán PayPal Thật (Đã thay thế code Mock) */
                                <div className="w-full px-4 mt-4 relative z-0">
                                    <div className="h-4"></div>
                                    <PayPalButtons 
                                        key={selectedPkg.id}
                                        style={{ layout: "vertical", shape: "rect", label: "checkout", height: 48 }}
                                        createOrder={(data, actions) => {
                                            return actions.order.create({
                                                purchase_units: [{
                                                    amount: { value: selectedPkg.price.toString() },
                                                    description: `Buy ${selectedPkg.credits} Credits`
                                                }]
                                            });
                                        }}
                                        onApprove={async (data, actions) => {
                                            const order = await actions.order.capture();
                                            setPaypalSuccess(order.id);
                                            console.log("PayPal Success:", order);
                                        }}
                                        onError={(err) => {
                                            console.error("PayPal Error:", err);
                                            alert("Giao dịch thất bại / Payment Failed");
                                        }}
                                    />
                                    <div className="bg-blue-50 p-3 rounded-lg text-[10px] text-blue-800 mt-4 border border-blue-100">
                                        ℹ️ {t.paymentCardDesc}
                                    </div>
                                    {/* Khoảng trống đệm dưới cùng để không bị sát mép khi cuộn */}
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
        {/* Lớp trang trí nền */}
        <BackgroundDecorations />

        {/* Hiển thị Modal Thanh toán nếu biến showPayment = true */}
        {showPayment && <PaymentModal />}
        
        {/* Thanh Header/Menu */}
        <Navbar />
        
        {/* Khu vực nội dung thay đổi giữa Home và Guide */}
        <main className="flex-grow w-full relative z-10">
            <HeroSection />
            {viewMode === 'home' ? <ShowcaseContent /> : <GuideContent />}
        </main>
        
        {/* Footer của trang */}
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
        
        {/* Các nút bấm liên hệ nổi (Floating buttons: FB/Zalo) */}
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
    </PayPalScriptProvider>
  );
}