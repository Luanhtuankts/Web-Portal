import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, CheckCircle2, Eye, Send, Image as ImageIcon,
  Copy, Check, Folder, Download, Search,
  Settings, User, Minus, Square, X
} from 'lucide-react';

// ==============================================================================
// 1. CỤM NÚT ĐIỀU KHIỂN CỬA SỔ (―, □, ✕) - Ô VUÔNG MAXIMIZE TO BẰNG DẤU X
// ==============================================================================
const WindowControls = () => (
  <div className="flex items-center text-slate-500 h-full shrink-0 select-none">
    <span className="w-7 h-7 flex items-center justify-center hover:bg-slate-200 transition-colors" title="Minimize">
      <svg className="w-3.5 h-3.5 text-slate-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 8h10" strokeLinecap="round" />
      </svg>
    </span>
    <span className="w-7 h-7 flex items-center justify-center hover:bg-slate-200 transition-colors" title="Maximize">
      {/* Ô vuông Maximize to bằng dấu X (10x10 trong viewBox 16x16) */}
      <svg className="w-3.5 h-3.5 text-slate-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="10" height="10" />
      </svg>
    </span>
    <span className="w-7 h-7 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors group" title="Close">
      {/* Dấu X (10x10 trong viewBox 16x16) */}
      <svg className="w-3.5 h-3.5 text-slate-600 group-hover:text-white" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 3l10 10M13 3L3 13" strokeLinecap="round" />
      </svg>
    </span>
  </div>
);

// ==============================================================================
// 2. MÔ PHỎNG CÀI ĐẶT PLUGIN VÀO SKETCHUP (WIN 10 & SKETCHUP VIEWPORT)
// ==============================================================================
export const MockInstallWorkflow = ({ PRIMARY_COLOR = "#0063A3", language = "VN" }) => {
  const containerRef = useRef(null);

  const [cursorPos, setCursorPos] = useState({ x: 110, y: 150 });
  const [cursorDuration, setCursorDuration] = useState(800);
  const [isClicking, setIsClicking] = useState(false);

  // Trạng thái chu trình mô phỏng
  const [selectedFolderItem, setSelectedFolderItem] = useState(null); // 'rar' | 'rbz' | null
  const [showExtractMenu, setShowExtractMenu] = useState(false);
  const [isExtracted, setIsExtracted] = useState(false);
  const [menuExtensionsOpen, setMenuExtensionsOpen] = useState(false);
  const [extManagerOpen, setExtManagerOpen] = useState(false);
  const [winOpenDialogOpen, setWinOpenDialogOpen] = useState(false);
  const [dialogFileSelected, setDialogFileSelected] = useState(false);
  const [showRobotToolbar, setShowRobotToolbar] = useState(false);

  const getCenterCoords = (elementId) => {
    if (!containerRef.current) return null;
    const targetEl = document.getElementById(elementId);
    if (!targetEl) return null;
    const containerRect = containerRef.current.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    return {
      x: targetRect.left - containerRect.left + targetRect.width / 2,
      y: targetRect.top - containerRect.top + targetRect.height / 2
    };
  };

  useEffect(() => {
    let timer = null;
    let isCancelled = false;

    const runLoop = () => {
      if (isCancelled) return;

      // Reset toàn bộ trạng thái ban đầu
      setSelectedFolderItem(null);
      setShowExtractMenu(false);
      setIsExtracted(false);
      setMenuExtensionsOpen(false);
      setExtManagerOpen(false);
      setWinOpenDialogOpen(false);
      setDialogFileSelected(false);
      setShowRobotToolbar(false);
      setIsClicking(false);

      timer = setTimeout(() => {
        if (isCancelled) return;
        // 1. Chuột di chuyển chậm rãi đến file Openskp.rar trong thư mục Downloads
        const rarPos = getCenterCoords('win-rar-item') || { x: 95, y: 140 };
        setCursorDuration(1100);
        setCursorPos(rarPos);

        timer = setTimeout(() => {
          if (isCancelled) return;
          // Click vào file rar: hiện hộp bao vuông 1 màu xanh dương chuẩn & menu ngữ cảnh
          setIsClicking(true);
          setSelectedFolderItem('rar');
          setShowExtractMenu(true);

          timer = setTimeout(() => {
            if (isCancelled) return;
            setIsClicking(false);

            // 2. Chọn "Extract files..."
            timer = setTimeout(() => {
              if (isCancelled) return;
              const extractPos = getCenterCoords('win-extract-action') || { x: 130, y: 190 };
              setCursorDuration(750);
              setCursorPos(extractPos);

              timer = setTimeout(() => {
                if (isCancelled) return;
                setIsClicking(true);
                setShowExtractMenu(false);
                setSelectedFolderItem(null);
                setIsExtracted(true); // File Openskp.rbz xuất hiện!

                timer = setTimeout(() => {
                  if (isCancelled) return;
                  setIsClicking(false);

                  // 3. Di chuột sang khung SketchUp -> click vào menu Extensions
                  timer = setTimeout(() => {
                    if (isCancelled) return;
                    const menuExtPos = getCenterCoords('su-menu-extensions-btn') || { x: 570, y: 35 };
                    setCursorDuration(1150);
                    setCursorPos(menuExtPos);

                    timer = setTimeout(() => {
                      if (isCancelled) return;
                      setIsClicking(true);
                      setMenuExtensionsOpen(true); // Mở menu dropdown Extensions

                      timer = setTimeout(() => {
                        if (isCancelled) return;
                        setIsClicking(false);

                        // Click Extension Manager...
                        timer = setTimeout(() => {
                          if (isCancelled) return;
                          const dropdownItemPos = getCenterCoords('su-dropdown-ext-mgr') || { x: 570, y: 68 };
                          setCursorDuration(700);
                          setCursorPos(dropdownItemPos);

                          timer = setTimeout(() => {
                            if (isCancelled) return;
                            setIsClicking(true);
                            setMenuExtensionsOpen(false);
                            setExtManagerOpen(true); // Mở Extension Manager

                            timer = setTimeout(() => {
                              if (isCancelled) return;
                              setIsClicking(false);

                              // 4. Di chuột đến nút "Install Extension"
                              timer = setTimeout(() => {
                                if (isCancelled) return;
                                const installBtnPos = getCenterCoords('su-btn-install-ext') || { x: 630, y: 330 };
                                setCursorDuration(1050);
                                setCursorPos(installBtnPos);

                                timer = setTimeout(() => {
                                  if (isCancelled) return;
                                  setIsClicking(true);

                                  timer = setTimeout(() => {
                                    if (isCancelled) return;
                                    setIsClicking(false);
                                    
                                    // 5. Cửa sổ Open Dialog (dựng HTML/CSS chuẩn) hiện lên
                                    setWinOpenDialogOpen(true);

                                    // 6. Chuột di chuyển chuẩn xác đến file Openskp.rbz trong Open Dialog
                                    timer = setTimeout(() => {
                                      if (isCancelled) return;
                                      const rbzFilePos = getCenterCoords('dlg-rbz-file-item') || { x: 580, y: 190 };
                                      setCursorDuration(950);
                                      setCursorPos(rbzFilePos);

                                      timer = setTimeout(() => {
                                        if (isCancelled) return;
                                        // Click 1: chọn file rbz (hộp bao vuông xanh dương & điền File name)
                                        setIsClicking(true);
                                        setDialogFileSelected(true);

                                        setTimeout(() => {
                                          if (isCancelled) return;
                                          setIsClicking(false);

                                          // Click 2: Click đúp là xong hoàn tất cài đặt!
                                          setTimeout(() => {
                                            if (isCancelled) return;
                                            setIsClicking(true);

                                            setTimeout(() => {
                                              if (isCancelled) return;
                                              setIsClicking(false);

                                              // Đóng Open Dialog, đóng Extension Manager, hiện Floating Toolbar SVG
                                              setWinOpenDialogOpen(false);
                                              setExtManagerOpen(false);
                                              setShowRobotToolbar(true);

                                              // Giữ trạng thái hoàn tất 5 giây để người dùng quan sát rõ
                                              timer = setTimeout(() => {
                                                if (isCancelled) return;
                                                runLoop();
                                              }, 5000);

                                            }, 220);
                                          }, 200);
                                        }, 220);

                                      }, 950);
                                    }, 600);
                                  }, 280);
                                }, 1050);
                              }, 500);
                            }, 280);
                          }, 700);
                        }, 350);
                      }, 280);
                    }, 1150);
                  }, 600);
                }, 280);
              }, 750);
            }, 450);
          }, 280);
        }, 1100);
      }, 350);
    };

    runLoop();

    return () => {
      isCancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-full relative select-none pointer-events-none"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* ==================================================================== */}
        {/* CỘT 1: CỬA SỔ FOLDER DOWNLOADS WIN 10 CHUẨN */}
        {/* ==================================================================== */}
        <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm ring-1 ring-slate-900/10 overflow-hidden flex flex-col font-sans text-xs h-[540px]">
          
          {/* Win 10 Title Bar: Gióng thẳng hàng h-9 chuẩn */}
          <div className="h-9 bg-white border-b border-gray-200 px-3 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2">
              <Folder size={14} className="text-amber-500 fill-amber-500" />
              <span className="text-slate-700 font-normal text-xs">Downloads</span>
            </div>
            <WindowControls />
          </div>

          {/* Win 10 Menu Bar: Cố định h-8 gióng thẳng với SketchUp menu */}
          <div className="h-8 bg-white border-b border-gray-200 px-3 flex items-center gap-4 text-xs text-slate-700 font-normal shrink-0 select-none">
            <span className="hover:bg-gray-100 px-1.5 py-0.5 rounded cursor-pointer">File</span>
            <span className="hover:bg-gray-100 px-1.5 py-0.5 rounded cursor-pointer">Home</span>
            <span className="hover:bg-gray-100 px-1.5 py-0.5 rounded cursor-pointer">Share</span>
            <span className="hover:bg-gray-100 px-1.5 py-0.5 rounded cursor-pointer">View</span>
          </div>

          {/* Win 10 Address Bar: Cố định h-9 gióng thẳng với SketchUp toolbar strip */}
          <div className="h-9 bg-white border-b border-gray-200 px-2.5 flex items-center gap-2 shrink-0 select-none">
            {/* Cụm mũi tên điều hướng chuẩn Win 10 */}
            <div className="flex items-center gap-1 text-slate-700 shrink-0 pr-1">
              <span className="w-5 h-5 rounded flex items-center justify-center font-normal">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </span>
              <span className="w-5 h-5 rounded flex items-center justify-center text-slate-300">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
              <span className="w-5 h-5 rounded flex items-center justify-center font-normal">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                </svg>
              </span>
            </div>

            {/* Thanh địa chỉ */}
            <div className="flex-1 bg-white border border-gray-300 rounded px-2.5 h-6 text-xs text-slate-600 flex items-center gap-1 shadow-xs truncate">
              <span className="text-slate-700 font-normal text-xs truncate">This PC &gt; Downloads</span>
            </div>
          </div>

          {/* Vùng xem File: Hộp bao vuông màu xanh dương chuẩn */}
          <div className="p-4 flex-1 bg-white flex flex-col justify-start relative">
            <div className="flex flex-wrap items-start gap-2.5 pt-2">
              
              {/* File 1: Openskp.rar - Chuẩn text-xs font-normal & active giống Extensions */}
              <div 
                id="win-rar-item"
                className={`w-24 p-1.5 rounded-lg border flex flex-col items-center text-center transition-all ${
                  selectedFolderItem === 'rar' || showExtractMenu 
                    ? 'border-[#0063A3]/50 bg-blue-100/70 text-[#0063A3]' 
                    : 'border-transparent text-slate-700'
                }`}
              >
                <img 
                  src="/icon-rar-clean.png" 
                  alt="Openskp.rar" 
                  className="w-12 h-12 object-contain drop-shadow-xs" 
                />
                <span className="font-normal text-xs mt-1.5 truncate max-w-full">
                  Openskp.rar
                </span>
              </div>

              {/* File 2: Openskp.rbz - Chuẩn text-xs font-normal & active giống Extensions */}
              {isExtracted && (
                <div 
                  id="win-rbz-item"
                  className={`w-24 p-1.5 rounded-lg border flex flex-col items-center text-center animate-fade-in transition-all ${
                    selectedFolderItem === 'rbz'
                      ? 'border-[#0063A3]/50 bg-blue-100/70 text-[#0063A3]' 
                      : 'border-transparent text-slate-700'
                  }`}
                >
                  <img 
                    src="/icon-rbz-real.png" 
                    alt="Openskp.rbz" 
                    className="w-12 h-12 object-contain drop-shadow-xs" 
                  />
                  <span className="font-normal text-xs mt-1.5 truncate max-w-full">
                    Openskp.rbz
                  </span>
                </div>
              )}

            </div>

            {/* Menu ngữ cảnh khi click phải rar: Extract files... */}
            {showExtractMenu && (
              <div className="absolute left-20 top-24 bg-white border border-gray-300 shadow-xl rounded py-1 w-44 z-30 animate-fade-in text-xs font-normal">
                <div className="px-3 py-1 text-slate-400">Open</div>
                <div 
                  id="win-extract-action"
                  className="px-3 py-1.5 bg-[#0063A3] text-white font-normal flex items-center justify-between"
                >
                  <span>Extract files...</span>
                  <span className="text-[9px]">↵</span>
                </div>
                <div className="px-3 py-1 text-slate-400">Extract Here</div>
                <div className="px-3 py-1 text-slate-400 border-t border-gray-100 mt-1">Properties</div>
              </div>
            )}
          </div>

        </div>

        {/* ==================================================================== */}
        {/* CỘT 2: KHÔNG GIAN LÀM VIỆC SKETCHUP 21 - 26 */}
        {/* ==================================================================== */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm ring-1 ring-slate-900/10 overflow-hidden flex flex-col font-sans text-xs h-[540px]">
          
          {/* SketchUp Title Bar: Đồng bộ chuẩn Untitled - SketchUp Pro 2021 */}
          <div className="h-9 bg-[#dee1e6] border-b border-gray-300 px-3 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2">
              <img src="/sketchup-logo.svg" alt="SketchUp" className="w-4 h-4 object-contain shrink-0" />
              <span className="text-xs text-slate-700 font-normal">
                Untitled - SketchUp Pro 2021 - 2026
              </span>
            </div>
            <WindowControls />
          </div>

          {/* SketchUp Menu Bar: Cố định h-8 gióng thẳng hàng 2 */}
          <div className="h-8 bg-[#f8f9fa] border-b border-gray-200 px-3 flex items-center gap-4 text-xs text-slate-700 font-normal relative shrink-0 select-none">
            <span>File</span>
            <span>Edit</span>
            <span>View</span>
            <span>Camera</span>
            <span>Draw</span>
            <span>Tools</span>
            <span>Window</span>
            
            {/* Menu Extensions */}
            <div className="relative">
              <button 
                id="su-menu-extensions-btn"
                className={`px-1.5 py-0.5 rounded transition-colors ${menuExtensionsOpen ? 'bg-blue-100 text-[#0063A3] font-bold' : 'hover:bg-gray-200'}`}
              >
                Extensions
              </button>

              {/* Menu Dropdown Extensions */}
              {menuExtensionsOpen && (
                <div className="absolute left-0 top-full mt-1 w-52 bg-white border border-gray-300 shadow-xl rounded py-1 z-40 text-xs text-slate-700 animate-fade-in">
                  <div 
                    id="su-dropdown-ext-mgr"
                    className="px-4 py-2 hover:bg-[#0063A3] hover:text-white flex items-center justify-between font-medium cursor-pointer"
                  >
                    <span>Extension Manager...</span>
                    <span className="text-[10px] text-gray-400">Ctrl+E</span>
                  </div>
                  <div className="px-4 py-1.5 text-gray-400">Extension Warehouse...</div>
                  <div className="px-4 py-1.5 text-gray-400 border-t border-gray-100 mt-1">Developer</div>
                </div>
              )}
            </div>

            <span>Help</span>
          </div>

          {/* SketchUp Toolbar Strip: Phóng to tool icon lên bằng khung nền trắng đồng bộ chuẩn Bước 4 */}
          <div className="h-9 bg-white border-b border-gray-200 px-2 flex items-center gap-0.5 shrink-0 select-none overflow-x-auto">
            {/* Vạch grip kéo thả toolbar */}
            <div className="flex flex-col gap-[3px] pr-1 py-1 cursor-move select-none shrink-0" title="Grip toolbar">
              <div className="flex gap-[2px]">
                <div className="w-[2px] h-[2px] bg-slate-400 rounded-full" />
                <div className="w-[2px] h-[2px] bg-slate-400 rounded-full" />
              </div>
              <div className="flex gap-[2px]">
                <div className="w-[2px] h-[2px] bg-slate-400 rounded-full" />
                <div className="w-[2px] h-[2px] bg-slate-400 rounded-full" />
              </div>
              <div className="flex gap-[2px]">
                <div className="w-[2px] h-[2px] bg-slate-400 rounded-full" />
                <div className="w-[2px] h-[2px] bg-slate-400 rounded-full" />
              </div>
            </div>

            {/* Nhóm 1: Select Tool (Active box màu xanh nhẹ) */}
            <button 
              className="w-7 h-7 flex items-center justify-center bg-[#cce8ff] border border-[#99d1ff] rounded-xs shrink-0 cursor-pointer" 
              title="Select"
            >
              <img src="/cursor_selectsubtract-150x150.jpg" alt="Select" className="w-5 h-5 object-contain" />
            </button>

            {/* Vách ngăn */}
            <div className="h-5 w-[1px] bg-slate-300 mx-0.5 shrink-0" />

            {/* Nhóm 2: Draw & Edit Cơ bản (Eraser, Line, Arc, Rectangle) */}
            <button 
              className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-xs shrink-0 cursor-pointer transition-colors" 
              title="Eraser"
            >
              <img src="/Eraser-Tool.jpg" alt="Eraser" className="w-[22px] h-[22px] object-contain" />
            </button>

            <div 
              className="h-7 flex items-center hover:bg-gray-100 rounded-xs px-0.5 shrink-0 cursor-pointer transition-colors" 
              title="Line"
            >
              <img src="/tb_line.jpg" alt="Line" className="w-[22px] h-[22px] object-contain" />
              <span className="text-[7px] text-slate-700 ml-0.5 leading-none">▼</span>
            </div>

            <div 
              className="h-7 flex items-center hover:bg-gray-100 rounded-xs px-0.5 shrink-0 cursor-pointer transition-colors" 
              title="Arc"
            >
              <img src="/tb_arc.jpg" alt="Arc" className="w-[22px] h-[22px] object-contain" />
              <span className="text-[7px] text-slate-700 ml-0.5 leading-none">▼</span>
            </div>

            <div 
              className="h-7 flex items-center hover:bg-gray-100 rounded-xs px-0.5 shrink-0 cursor-pointer transition-colors" 
              title="Rectangle"
            >
              <img src="/tb_rectangle.jpg" alt="Rectangle" className="w-[22px] h-[22px] object-contain" />
              <span className="text-[7px] text-slate-700 ml-0.5 leading-none">▼</span>
            </div>

            {/* Vách ngăn */}
            <div className="h-5 w-[1px] bg-slate-300 mx-0.5 shrink-0" />

            {/* Nhóm 3: 3D Modeling (Push/Pull, Follow Me, Move, Rotate, Scale) */}
            <button 
              className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-xs shrink-0 cursor-pointer transition-colors" 
              title="Push/Pull"
            >
              <img src="/tb_pushpull.jpg" alt="Push/Pull" className="w-[22px] h-[22px] object-contain" />
            </button>

            <button 
              className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-xs shrink-0 cursor-pointer transition-colors" 
              title="Follow Me"
            >
              <img src="/tb_followme.jpg" alt="Follow Me" className="w-[22px] h-[22px] object-contain" />
            </button>

            <button 
              className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-xs shrink-0 cursor-pointer transition-colors" 
              title="Move"
            >
              <img src="/tb_move.jpg" alt="Move" className="w-[22px] h-[22px] object-contain" />
            </button>

            <button 
              className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-xs shrink-0 cursor-pointer transition-colors" 
              title="Rotate"
            >
              <img src="/tb_rotate.jpg" alt="Rotate" className="w-[22px] h-[22px] object-contain" />
            </button>

            <button 
              className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-xs shrink-0 cursor-pointer transition-colors" 
              title="Scale"
            >
              <img src="/tb_scale.jpg" alt="Scale" className="w-[22px] h-[22px] object-contain" />
            </button>

            {/* Vách ngăn */}
            <div className="h-5 w-[1px] bg-slate-300 mx-0.5 shrink-0" />

            {/* Nhóm 4: Tô màu (Paint Bucket) */}
            <button 
              className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-xs shrink-0 cursor-pointer transition-colors" 
              title="Paint Bucket"
            >
              <img src="/Paint-Bucket.jpg" alt="Paint Bucket" className="w-[22px] h-[22px] object-contain" />
            </button>

            {/* Vách ngăn */}
            <div className="h-5 w-[1px] bg-slate-300 mx-0.5 shrink-0" />

            {/* Logo Robot OpenSkp khi kích hoạt cài đặt thành công ở Bước 1 */}
            {showRobotToolbar && (
              <div className="flex items-center pl-1.5 shrink-0 animate-fade-in" title="OpenSkp Plugin">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#0063A3]" fill="currentColor">
                  <path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-4 5h8c2.76 0 5 2.24 5 5v4c0 2.76-2.24 5-5 5H8c-2.76 0-5-2.24-5-5v-4c0-2.76 2.24-5 5-5zm1 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                  <path d="M5 23 Q 12 18, 19 23 H 5 z"/>
                </svg>
              </div>
            )}
          </div>

          {/* Vùng làm việc chính: 3D Viewport đồng bộ không gian rộng thoáng */}
          <div className="flex-1 flex relative overflow-hidden bg-white">
            
            {/* 3D Viewport: 3 NÉT TRỤC TỌA ĐỘ            {/* 3D Viewport: 3 NÉT TRỤC TỌA ĐỘ KÉO DÀI ĐẾN SÁT MÉP VIEWPORT & GIAO NHAU TẠI GỐC */}
            <div className="flex-1 bg-white relative overflow-hidden flex items-center justify-center">
              
              {/* Nền SketchUp Viewport từ preview-0915.jpg thay 3 trục */}
              <img 
                src="/preview-0915.jpg" 
                alt="SketchUp Viewport" 
                className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
              />

              {/* ================================================================ */}
              {/* THANH CÔNG CỤ FLOATING TOOLBAR OPENSKP TRÊN VIEWPORT (DÙNG SVG THẬT) */}
              {/* ================================================================ */}
              {showRobotToolbar && (
                <div 
                  id="su-viewport-robot-icon"
                  className="absolute top-6 left-10 bg-[#f0f0f0] border border-[#a0a0a0] shadow-lg rounded-[2px] animate-fade-in z-20 overflow-hidden select-none"
                >
                  {/* Floating toolbar header */}
                  <div className="h-3.5 bg-[#8fa9be] px-1 flex items-center justify-between">
                    <span className="text-[9px] text-white font-mono leading-none tracking-tighter">...</span>
                    <span className="text-[8px] text-white font-bold leading-none">✕</span>
                  </div>
                  {/* Toolbar content button with SVG robot */}
                  <div className="p-1 bg-[#efefef] flex items-center justify-center">
                    <div className="w-8 h-8 rounded-[2px] bg-white border border-slate-300 shadow-xs flex items-center justify-center">
                      <svg 
                        viewBox="0 0 24 24" 
                        className="w-6 h-6 text-[#0063A3]" 
                        fill="currentColor"
                      >
                        <path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-4 5h8c2.76 0 5 2.24 5 5v4c0 2.76-2.24 5-5 5H8c-2.76 0-5-2.24-5-5v-4c0-2.76 2.24-5 5-5zm1 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                        <path d="M5 23 Q 12 18, 19 23 H 5 z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* ================================================================ */}
              {/* HỘP THOẠI EXTENSION MANAGER (HIỆN KHI BẤM EXTENSIONS) */}
              {/* ================================================================ */}
              {extManagerOpen && (
                <div className="absolute inset-4 bg-white/95 rounded-xl border border-slate-300 shadow-2xl z-30 flex flex-col overflow-hidden animate-fade-in">
                  <div className="p-2.5 border-b border-gray-200 bg-slate-50 flex items-center justify-between shrink-0">
                    <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <img src="/sketchup-logo.svg" className="w-3.5 h-3.5" alt="SU" /> Extension Manager
                    </span>
                    <span className="text-slate-400 text-xs">✕</span>
                  </div>

                  <div className="p-3.5 space-y-2 flex-1 overflow-y-auto text-xs text-slate-700">
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="font-normal text-slate-700">Add Location</span>
                      <button className="px-3 py-1 rounded-lg bg-[#0063A3] text-white font-medium text-xs shadow-2xs flex items-center">
                        Enable
                      </button>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="font-normal text-slate-700">Dynamic Components</span>
                      <button className="px-3 py-1 rounded-lg bg-[#0063A3] text-white font-medium text-xs shadow-2xs flex items-center">
                        Enable
                      </button>
                    </div>
                  </div>

                  {/* Nút Install Extension */}
                  <div className="p-3 bg-slate-50 border-t border-gray-200 flex justify-end shrink-0">
                    <button 
                      id="su-btn-install-ext"
                      className="px-4 py-1.5 rounded-lg bg-[#0063A3] hover:bg-blue-700 text-white font-medium text-xs shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download size={13} />
                      <span>Install Extension</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ================================================================ */}
              {/* CỬA SỔ OPEN DIALOG (DỰNG LẠI CHUẨN WINDOWS BẰNG HTML/TAILWIND) */}
              {/* ================================================================ */}
              {winOpenDialogOpen && (
                <div className="absolute inset-2 z-40 flex items-center justify-center animate-fade-in pointer-events-none select-none">
                  <div className="w-full max-w-[460px] bg-white rounded-md shadow-2xl border border-slate-400 overflow-hidden text-[11px] font-sans flex flex-col">
                    
                    {/* Title Bar: Cụm nút vuông to bằng X */}
                    <div className="h-7 bg-white px-2.5 flex items-center justify-between border-b border-slate-200 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <img src="/sketchup-logo.svg" className="w-3.5 h-3.5" alt="SketchUp" />
                        <span className="text-slate-800 font-normal text-[11px]">Open</span>
                      </div>
                      <WindowControls />
                    </div>

                    {/* Nav & Address & Search bar */}
                    <div className="p-1.5 bg-white border-b border-slate-200 flex items-center gap-1.5 shrink-0">
                      <div className="flex items-center gap-0.5 text-slate-700 shrink-0">
                        <span className="w-5 h-5 flex items-center justify-center">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                          </svg>
                        </span>
                        <span className="w-5 h-5 flex items-center justify-center text-slate-300">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </span>
                        <span className="w-5 h-5 flex items-center justify-center">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                          </svg>
                        </span>
                      </div>
                      {/* Address bar */}
                      <div className="flex-1 bg-white border border-slate-300 rounded-xs px-2 py-0.5 text-[10px] text-slate-700 flex items-center gap-1 truncate">
                        <Folder size={11} className="text-blue-500 fill-blue-500 shrink-0" />
                        <span className="truncate">This PC &gt; Downloads</span>
                      </div>
                      {/* Search */}
                      <div className="w-28 bg-white border border-slate-300 rounded-xs px-1.5 py-0.5 text-[10px] text-slate-400 flex items-center justify-between shrink-0">
                        <span className="truncate">Search</span>
                        <Search size={10} className="text-slate-400 shrink-0" />
                      </div>
                    </div>

                    {/* Organize / New folder line */}
                    <div className="px-2 py-1 bg-white border-b border-slate-200 flex items-center justify-between text-[10px] text-slate-700 shrink-0">
                      <div className="flex items-center gap-3">
                        <span>Organize ▾</span>
                        <span>New folder</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <span>▤ ▾</span>
                        <span className="w-3.5 h-3.5 rounded-full border border-slate-400 text-[8px] flex items-center justify-center font-bold">?</span>
                      </div>
                    </div>

                    {/* Middle split */}
                    <div className="flex h-40 bg-white">
                      {/* Left Tree */}
                      <div className="w-24 bg-[#fbfbfb] border-r border-slate-200 p-1.5 space-y-1 text-[10px] text-slate-700 shrink-0">
                        <div className="flex items-center gap-1 py-0.5 px-1 text-sky-700">
                          <span>★</span>
                          <span className="truncate">Quick access</span>
                        </div>
                        <div className="flex items-center gap-1 py-0.5 px-1 bg-[#e5e5e5] font-semibold text-slate-900">
                          <span>🖥</span>
                          <span className="truncate">This PC</span>
                        </div>
                        <div className="flex items-center gap-1 py-0.5 px-1 text-slate-600">
                          <span>🌐</span>
                          <span className="truncate">Network</span>
                        </div>
                      </div>

                      {/* Right Files Area */}
                      <div className="flex-1 p-3 overflow-y-auto bg-white">
                        <div className="text-[10px] text-slate-500 border-b border-slate-100 pb-0.5 mb-2 flex items-center gap-1">
                          <span>˅</span>
                          <span>Last week (1)</span>
                        </div>

                        {/* Openskp.rbz Item */}
                        <div 
                          id="dlg-rbz-file-item"
                          className={`w-24 p-1.5 border flex flex-col items-center justify-center text-center transition-all ${
                            dialogFileSelected 
                              ? 'border-[#0063A3] bg-[#0063A3]/10' 
                              : 'border-transparent'
                          }`}
                        >
                          <img 
                            src="/icon-rbz-real.png" 
                            alt="Openskp.rbz" 
                            className="w-12 h-12 object-contain" 
                          />
                          <span className="text-[10px] text-slate-800 font-medium mt-1 truncate max-w-full">
                            Openskp.rbz
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Controls */}
                    <div className="p-2 bg-[#f0f0f0] border-t border-slate-300 space-y-1.5 shrink-0">
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="w-14 text-right text-slate-600 shrink-0">File name:</span>
                        <div className="flex-1 bg-white border border-slate-300 px-2 py-0.5 text-slate-800 flex items-center justify-between">
                          <span className="truncate font-medium">{dialogFileSelected ? 'Openskp.rbz' : ''}</span>
                          <span className="text-[8px] text-slate-400">▾</span>
                        </div>
                        <div className="w-32 bg-white border border-slate-300 px-2 py-0.5 text-slate-800 flex items-center justify-between shrink-0">
                          <span className="truncate text-[10px]">Ruby Files (*.rbz)</span>
                          <span className="text-[8px] text-slate-400">▾</span>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 text-[10px] pt-0.5">
                        <button className="px-5 py-0.5 bg-white border border-slate-400 text-slate-800 shadow-xs font-medium">
                          Open
                        </button>
                        <button className="px-5 py-0.5 bg-white border border-slate-400 text-slate-800 shadow-xs">
                          Cancel
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* Con trỏ chuột thực tế */}
      <div 
        className="hidden lg:block absolute z-50 pointer-events-none select-none"
        style={{
          transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)`,
          transition: `transform ${cursorDuration}ms cubic-bezier(0.25, 1, 0.5, 1)`,
          left: 0,
          top: 0
        }}
      >
        <div className="relative">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform duration-100 ${isClicking ? 'scale-90 translate-y-0.5' : ''}`}
            style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.4))' }}
          >
            <path 
              d="M3 3L10.5 21L14 14L21 10.5L3 3Z" 
              fill="#111827" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinejoin="round" 
            />
          </svg>


        </div>
      </div>

    </div>
  );
};

// ==============================================================================
// 3. MOCK PLUGIN UI (CHUẨN XÁC TAB BAR CỦA PLUGIN & CHỈ CÓ BUBBLE THUẦN TÚY)
// ==============================================================================






export const MockPluginUI = ({
  showSidebar = false,
  onToggleSidebar,
  licenseKey = "",
  isLicenseFocused = false,
  isKeyActive = false,
  bubbleShown = false,
  showPasteMenu = false,
  language = 'VN',
  PRIMARY_COLOR = "#0063A3",
}) => {
  return (
    <div 
      className="w-full bg-[#fdfbf7] rounded-2xl shadow-lg ring-1 ring-slate-900/10 overflow-hidden font-sans text-slate-800 flex flex-col relative select-none pointer-events-none h-[540px]"
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 99, 163, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 99, 163, 0.06) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        isolation: 'isolate'
      }}
    >
      {/* Header chuẩn của Plugin OpenSkp theo index.html */}
      <header className="relative flex items-center p-3 border-b border-slate-200/60 bg-white/80 backdrop-blur-md shrink-0 h-14 rounded-t-2xl">
        <div className="flex items-center gap-1 z-10">
          <button 
            id="sim-plugin-hamburger-btn"
            onClick={onToggleSidebar}
            className="p-1.5 text-slate-500 hover:text-[#0063A3] transition-colors rounded-lg"
            title="Bật/Tắt Menu Sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Ở giữa: Logo Robot + Brand OpenSkp (Căn giữa chuẩn UI plugin) */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 text-[#0063A3] z-0">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d='M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-4 5h8c2.76 0 5 2.24 5 5v4c0 2.76-2.24 5-5 5H8c-2.76 0-5-2.24-5-5v-4c0-2.76 2.24-5 5-5zm1 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z'/>
            <path d='M5 23 Q 12 18, 19 23 H 5 z'/>
          </svg>
          <span 
            className="font-serif font-normal text-2xl tracking-tight mt-1"
            style={{ fontFamily: "'Crimson Pro', Georgia, serif", color: PRIMARY_COLOR, fontWeight: 400 }}
          >
            OpenSkp
          </span>
        </div>

        {/* Bên phải: Nút ngôn ngữ EN */}
        <div className="absolute right-[21px] top-0 bottom-0 w-6 flex items-center justify-center z-10">
          <span className="text-xs font-semibold text-slate-500 hover:text-[#0063A3] select-none cursor-pointer">
            EN
          </span>
        </div>
      </header>

      {/* Thân cửa sổ Plugin */}
      <div className="flex-1 flex relative overflow-hidden">
        
        {/* Sidebar kéo ra để nhập License Key */}
        <div 
          className={`absolute top-0 bottom-0 left-0 w-64 bg-white border-r border-gray-200 z-40 transition-transform duration-300 flex flex-col justify-between p-4 shadow-xl ${
            showSidebar ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="space-y-3">
            {/* Thanh trên của Sidebar: New Chat & Nút đóng */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <button 
                type="button"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-700 hover:text-[#0063A3] hover:bg-slate-100 text-xs font-medium transition-colors"
                title="Tạo đoạn chat mới"
              >
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>New Chat</span>
              </button>
              <span 
                id="sim-plugin-close-btn" 
                onClick={onToggleSidebar}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded hover:bg-slate-100 text-xs font-bold"
                title="Đóng sidebar"
              >✕</span>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-gray-100">
            <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-lg">
              
              {/* Tùy chọn Paste nhỏ gọn */}
              {showPasteMenu && (
                <div 
                  id="sim-plugin-paste-btn"
                  className="absolute -top-8 left-8 bg-white border border-slate-300 shadow-md rounded-md px-2.5 py-1 flex items-center gap-1.5 z-50 text-[11px] font-medium text-slate-800 animate-fade-in select-none"
                >
                  <svg className="w-3 h-3 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                  </svg>
                  <span>Paste</span>
                </div>
              )}

              <div className="absolute left-2 text-slate-400 pointer-events-none">
                <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <div 
                id="sim-plugin-license-input"
                className="w-full bg-transparent pl-8 pr-7 py-1.5 text-xs text-slate-700 font-sans flex items-center min-h-[28px] overflow-hidden select-none cursor-text"
              >
                {licenseKey ? (
                  <div className="flex items-center text-xs text-slate-800 tracking-[0.35em] font-medium">
                    <span>{'*'.repeat(licenseKey.length)}</span>
                    {isLicenseFocused && (
                      <span className="inline-block w-[1.5px] h-3.5 bg-[#0063A3] ml-1 tracking-normal animate-pulse shrink-0" />
                    )}
                  </div>
                ) : (
                  <div className="flex items-center text-xs text-slate-400">
                    {isLicenseFocused ? (
                      <span className="inline-block w-[1.5px] h-3.5 bg-[#0063A3] mr-1 animate-pulse shrink-0" />
                    ) : (
                      <span className="font-sans text-xs text-slate-400">{language === 'VN' ? 'Nhập License Key...' : 'Enter License Key...'}</span>
                    )}
                  </div>
                )}
              </div>
              <div className="absolute right-2 text-gray-400 pointer-events-none">
                <Eye size={13} />
              </div>
            </div>
          </div>
        </div>

        {showSidebar && (
          <div 
            onClick={onToggleSidebar}
            className="absolute inset-0 bg-slate-900/20 z-30 transition-opacity"
          />
        )}

        {/* KHUNG CHAT CHÍNH (CHỈ CÓ BUBBLE THUẦN TÚY, KHÔNG CẦN ICON) */}
        <div 
          id="sim-plugin-chat-area"
          className="flex-1 flex flex-col justify-between p-4 relative z-10 overflow-y-auto"
        >
          <div className="space-y-3">
            {/* Bubble 1: Chào mừng - Chỉ có Bubble thuần túy */}
            <div className="w-full flex justify-start">
              <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-slate-200 text-xs font-normal text-slate-700 max-w-sm leading-relaxed">
                {language === 'VN' ? 'Xin chào! Bạn cần vẽ gì hôm nay.' : 'Hello! What would you like to model today?'}
              </div>
            </div>

            {/* Bubble 2: Thông báo lưu key chuẩn theo plugin */}
            {bubbleShown && (
              <div className="w-full flex justify-start animate-fade-in">
                <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-slate-200 text-xs font-normal text-slate-700 max-w-sm leading-relaxed">
                  {language === 'VN' ? 'Mật mã truy cập đã được lưu.' : 'Access license key has been saved.'}
                </div>
              </div>
            )}
          </div>

          <div className="pt-2">
            <div className="relative flex items-center w-full bg-white border border-gray-200 rounded-2xl shadow-sm">
              <span className="p-2 text-gray-400">
                <ImageIcon size={16} />
              </span>
              <input 
                type="text" 
                readOnly 
                placeholder={language === "VN" ? "Nhập yêu cầu" : "Enter prompt"} 
                className="w-full bg-transparent text-xs py-2 px-1 focus:outline-none text-slate-700 placeholder-slate-400 font-sans"
              />
              <button className="m-1 p-1.5 rounded-full text-white bg-[#0063A3] shadow-sm shrink-0">
                <Send size={12} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};



// Icon Robot OpenSkp sắc nét, vẽ tách bạch 2 mắt màu trắng đảm bảo luôn hiển thị đủ 2 mắt tròn trịa
const OpenSkpRobotIcon = ({ className = "w-5 h-5 sm:w-6 sm:h-6 shrink-0", color = "#0063A3" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="3.5" r="2" fill={color} />
    <rect x="3" y="7" width="18" height="13" rx="4" fill={color} />
    <circle cx="8.5" cy="13.5" r="1.8" fill="white" />
    <circle cx="15.5" cy="13.5" r="1.8" fill="white" />
    <path d="M5 23 Q 12 18, 19 23 H 5 z" fill={color} />
  </svg>
);

// ==============================================================================
// 1. KHUNG 1 SHOWCASE: DỰNG KHÔNG GIAN 3D TỪ ẢNH MẶT BẰNG 2D
// ==============================================================================
const ShowcaseFloorplanVideoItem = ({ PRIMARY_COLOR = "#0063A3", language = "VN" }) => {
  const videoRef = useRef(null);
  const [showUserText, setShowUserText] = useState(false);
  const [showUserImg, setShowUserImg] = useState(false);
  const [showBotAnalyzing, setShowBotAnalyzing] = useState(false);
  const [showBotCompleted, setShowBotCompleted] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const sleep = (ms) => new Promise((resolve) => {
      if (isCancelled) return;
      setTimeout(() => { if (!isCancelled) resolve(); }, ms);
    });

    const runLoop = async () => {
      while (!isCancelled) {
        // 0. Chờ ở frame đầu tiên, chưa play video
        setShowUserText(false);
        setShowUserImg(false);
        setShowBotAnalyzing(false);
        setShowBotCompleted(false);

        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }

        // Chờ 700ms ở frame đầu
        await sleep(700);

        // 1. User nhắn tin 1 (Text): "Dựng cho tôi mặt bằng này"
        setShowUserText(true);
        await sleep(850);

        // 2. User nhắn tin 2 (Ảnh mặt bằng): không bubble, phóng to rõ nét
        setShowUserImg(true);
        await sleep(950);

        // 3. OpenSkp rep: "Đang phân tích và triển khai dựng hình"
        setShowBotAnalyzing(true);

        // OpenSkp rep thì đúng 1s sau mới play video
        await sleep(1000);

        // 4. Bắt đầu phát video 0915(5).mp4
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(() => {});
        }

        // 5. Đến giây thứ 11 của video thì hiện tin hoàn thành
        while (!isCancelled && videoRef.current && videoRef.current.currentTime < 11 && !videoRef.current.ended) {
          await sleep(150);
        }
        setShowBotCompleted(true);

        // 6. Play hết video là hết vòng loop (video dài 26.2s)
        while (!isCancelled && videoRef.current && !videoRef.current.ended && videoRef.current.currentTime < 26.0) {
          await sleep(150);
        }

        if (videoRef.current) {
          videoRef.current.pause();
        }

        // Dừng 2 giây để người xem quan sát không gian 3D hoàn chỉnh
        await sleep(2000);
      }
    };

    runLoop();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-md bg-slate-950 aspect-video ring-1 ring-slate-900/10">
      {/* Video nền 0915(5).mp4 (Chờ ở frame đầu) */}
      <video
        ref={videoRef}
        loop={false}
        muted
        playsInline
        preload="auto"
        poster="/sketchup-floorplan-ready.jpg"
        className="w-full h-full object-cover block border-0 m-0 p-0"
      >
        <source src="/0915(5).mp4" type="video/mp4" />
      </video>

      {/* ĐOẠN HỘI THOẠI GIẢ LẬP */}
      <div 
        className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 flex flex-col items-end space-y-2.5 sm:space-y-3 w-[300px] sm:w-[360px] md:w-[420px] pointer-events-none select-none"
      >
        {/* Tin 1: User nhắn Text "Dựng cho tôi mặt bằng này" */}
        {showUserText && (
          <div className="flex justify-end w-full">
            <div 
              className="text-white rounded-2xl rounded-br-xs px-4 py-2.5 sm:px-5 sm:py-3 shadow-lg border border-white/15 animate-bubble-in origin-bottom-right"
              style={{ backgroundColor: PRIMARY_COLOR }}
            >
              <div className="text-sm sm:text-base font-normal leading-relaxed">
                {language === 'VN' ? 'Dựng cho tôi mặt bằng này' : 'Generate this floor plan in 3D for me'}
              </div>
            </div>
          </div>
        )}

        {/* Tin 2: Ảnh mặt bằng riêng biệt, KHÔNG BUBBLE, phóng to gấp 3 để nhìn rõ nét */}
        {showUserImg && (
          <div className="flex justify-end w-full">
            <div className="rounded-xl overflow-hidden shadow-2xl border-2 border-white/95 bg-white/10 animate-bubble-in origin-bottom-right">
              <img 
                src="/floorplan-bw.jpg" 
                alt={language === "VN" ? "Mặt bằng đen trắng" : "B&W floor plan"} 
                className="w-44 sm:w-56 md:w-64 aspect-[1024/757] object-cover rounded-lg block"
              />
            </div>
          </div>
        )}

        {/* Tin 3: OpenSkp rep "Đang phân tích và triển khai dựng hình" */}
        {showBotAnalyzing && (
          <div className="flex justify-start w-full">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl rounded-bl-xs p-3 sm:p-3.5 shadow-lg border border-slate-200/90 text-slate-800 flex items-center gap-2.5 max-w-[95%] animate-bubble-in origin-bottom-left">
              <OpenSkpRobotIcon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" color={PRIMARY_COLOR} />
              <span className="font-normal text-slate-700 text-sm sm:text-base leading-relaxed">
                {language === 'VN' ? 'Đang phân tích và triển khai dựng hình' : 'Analyzing and constructing 3D geometry...'}
              </span>
            </div>
          </div>
        )}

        {/* Tin 4: OpenSkp rep tại giây thứ 11 "Đã hoàn thành công việc" */}
        {showBotCompleted && (
          <div className="flex justify-start w-full">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl rounded-bl-xs px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-lg border border-slate-200/90 text-slate-800 flex items-center gap-2.5 max-w-[95%] animate-bubble-in origin-bottom-left">
              <OpenSkpRobotIcon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" color={PRIMARY_COLOR} />
              <span className="font-normal text-slate-700 text-sm sm:text-base leading-relaxed">
                {language === 'VN' ? 'Đã hoàn thành công việc' : 'Work completed successfully'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* DÒNG CHÚ THÍCH VIẾT NGHIÊNG MÀU XANH CHỦ ĐẠO, KHÔNG BỌC BUTTON, KHÔNG LINK */}
      <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 select-none max-w-[85%] sm:max-w-none">
        <span 
          className="italic font-normal text-[13.5px] sm:text-[14.5px] tracking-tight"
          style={{ color: PRIMARY_COLOR }}
        >
          {language === 'VN' 
            ? 'Hoạt cảnh hội thoại chỉ mang tính chất minh họa, hãy xem hướng dẫn để nắm rõ quy trình sử dụng thực tế' 
            : 'Simulated conversation is for illustration purposes only; see guide for actual workflow.'}
        </span>
      </div>
    </div>
  );
};

// ==============================================================================
// 2. KHUNG 2 SHOWCASE: DỰNG HÌNH & HIỆU CHỈNH TỦ THIẾT KẾ
// ==============================================================================
const ShowcaseCabinetVideoItem = ({ PRIMARY_COLOR = "#0063A3", language = "VN" }) => {
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);

  const [isVideo2Active, setIsVideo2Active] = useState(false);
  const [showUserText1, setShowUserText1] = useState(false);
  const [showUserImg, setShowUserImg] = useState(false);
  const [showBotAnalyzing1, setShowBotAnalyzing1] = useState(false);
  const [showBotDone1, setShowBotDone1] = useState(false);
  const [showUserText2, setShowUserText2] = useState(false);
  const [showBotAnalyzing2, setShowBotAnalyzing2] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const sleep = (ms) => new Promise((resolve) => {
      if (isCancelled) return;
      setTimeout(() => { if (!isCancelled) resolve(); }, ms);
    });

    const runLoop = async () => {
      while (!isCancelled) {
        // 0. Reset về trạng thái ban đầu, chờ ở frame đầu video 1
        setShowUserText1(false);
        setShowUserImg(false);
        setShowBotAnalyzing1(false);
        setShowBotDone1(false);
        setShowUserText2(false);
        setShowBotAnalyzing2(false);
        setIsVideo2Active(false);

        if (video1Ref.current) {
          video1Ref.current.pause();
          video1Ref.current.currentTime = 0;
        }
        if (video2Ref.current) {
          video2Ref.current.pause();
          video2Ref.current.currentTime = 0;
        }

        await sleep(700);

        // 1. User gửi tin 1 (Text): "Dựng cho tôi tủ theo mẫu này"
        setShowUserText1(true);
        await sleep(850);

        // 2. User gửi tin 2 (Ảnh mẫu tủ): không bubble, phóng to rõ nét
        setShowUserImg(true);
        await sleep(950);

        // 3. OpenSkp trả lời 1: "Đang phân tích và triển khai dựng hình"
        setShowBotAnalyzing1(true);

        // Đúng 1s sau mới phát video 1 (0915.mp4 - dựng tủ 2m)
        await sleep(1000);

        if (video1Ref.current) {
          video1Ref.current.currentTime = 0;
          video1Ref.current.play().catch(() => {});
        }

        // Chờ video 1 chạy đến hết (10.47s)
        while (!isCancelled && video1Ref.current && video1Ref.current.currentTime < 10.0 && !video1Ref.current.ended) {
          await sleep(150);
        }
        if (video1Ref.current) {
          video1Ref.current.pause();
        }

        // OpenSkp thông báo dựng xong tủ ban đầu
        setShowBotDone1(true);
        await sleep(1200);

        // 4. User yêu cầu chỉnh sửa: "Cho tủ cao lên 3000mm và thêm 2 đợt ngăn"
        setShowUserText2(true);
        await sleep(950);

        // 5. OpenSkp phản hồi: "Đang cập nhật kích thước..."
        setShowBotAnalyzing2(true);
        await sleep(1000);

        // 6. Phát tiếp nối video 2 (0915(2).mp4) liền mạch tuyệt đối không nháy
        setIsVideo2Active(true);
        if (video2Ref.current) {
          video2Ref.current.currentTime = 0;
          video2Ref.current.play().catch(() => {});
        }

        // Chờ video 2 chạy đến hết (8.13s)
        while (!isCancelled && video2Ref.current && video2Ref.current.currentTime < 7.8 && !video2Ref.current.ended) {
          await sleep(150);
        }
        if (video2Ref.current) {
          video2Ref.current.pause();
        }

        // Bỏ tin đã hoàn thành theo yêu cầu! Tạm dừng 2.5 giây để người xem chiêm ngưỡng tủ 3m hoàn thiện
        await sleep(2500);
      }
    };

    runLoop();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-md bg-slate-950 aspect-video ring-1 ring-slate-900/10">
      {/* Video 1: Dựng tủ 2m ban đầu (Dừng frame đầu làm poster) */}
      <video
        ref={video1Ref}
        loop={false}
        muted
        playsInline
        preload="auto"
        poster="/preview-0915.jpg"
        className={`absolute inset-0 h-full w-full object-cover z-10 ${
          isVideo2Active ? 'invisible pointer-events-none' : 'visible'
        }`}
      >
        <source src="/0915.mp4" type="video/mp4" />
      </video>

      {/* Video 2: Nâng tủ cao 3m và thêm 2 đợt ngăn (Tiếp nối không nháy) */}
      <video
        ref={video2Ref}
        loop={false}
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 h-full w-full object-cover z-20 ${
          isVideo2Active ? 'visible' : 'invisible pointer-events-none'
        }`}
      >
        <source src="/0915(2).mp4" type="video/mp4" />
      </video>

      {/* ĐOẠN HỘI THOẠI GIẢ LẬP */}
      <div 
        className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 flex flex-col items-end space-y-2 sm:space-y-2.5 w-[280px] sm:w-[340px] md:w-[380px] pointer-events-none select-none"
      >
        {/* Tin 1: User yêu cầu dựng tủ theo mẫu */}
        {showUserText1 && (
          <div className="flex justify-end w-full">
            <div 
              className="text-white rounded-2xl rounded-br-xs px-3.5 py-2 sm:px-4 sm:py-2.5 shadow-lg border border-white/15 animate-bubble-in origin-bottom-right"
              style={{ backgroundColor: PRIMARY_COLOR }}
            >
              <div className="text-sm sm:text-base font-normal leading-relaxed">
                {language === 'VN' ? 'Dựng cho tôi tủ theo mẫu này' : 'Build a cabinet for me based on this sample'}
              </div>
            </div>
          </div>
        )}

        {/* Tin 2: Ảnh mẫu tủ riêng biệt, KHÔNG BUBBLE, phóng to rõ nét */}
        {showUserImg && (
          <div className="flex justify-end w-full">
            <div className="rounded-xl overflow-hidden shadow-2xl border-2 border-white/95 bg-white/10 animate-bubble-in origin-bottom-right">
              <img 
                src="/cabinet-sample.jpg" 
                alt={language === "VN" ? "Mẫu tủ thiết kế" : "Cabinet design sample"} 
                className="w-32 sm:w-40 md:w-48 aspect-square object-cover rounded-lg block"
              />
            </div>
          </div>
        )}

        {/* Tin 3: OpenSkp nhận lệnh dựng hình */}
        {showBotAnalyzing1 && (
          <div className="flex justify-start w-full">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl rounded-bl-xs p-2.5 sm:p-3 shadow-lg border border-slate-200/90 text-slate-700 flex items-center gap-2 max-w-[95%] animate-bubble-in origin-bottom-left">
              <OpenSkpRobotIcon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" color={PRIMARY_COLOR} />
              <span className="font-normal text-slate-700 text-sm sm:text-base leading-relaxed">
                {language === 'VN' ? 'Đang phân tích và triển khai dựng hình' : 'Analyzing and constructing 3D geometry...'}
              </span>
            </div>
          </div>
        )}

        {/* Tin 4: OpenSkp đã dựng xong tủ 2m */}
        {showBotDone1 && (
          <div className="flex justify-start w-full">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl rounded-bl-xs px-3 py-2 sm:px-3.5 sm:py-2.5 shadow-lg border border-slate-200/90 text-slate-700 flex items-center gap-2 max-w-[95%] animate-bubble-in origin-bottom-left">
              <OpenSkpRobotIcon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" color={PRIMARY_COLOR} />
              <span className="font-normal text-slate-700 text-sm sm:text-base leading-relaxed">
                {language === 'VN' ? 'Đã dựng xong tủ cao 2000mm' : 'Cabinet 2000mm built successfully'}
              </span>
            </div>
          </div>
        )}

        {/* Tin 5: User yêu cầu chỉnh sửa nâng cao 3m */}
        {showUserText2 && (
          <div className="flex justify-end w-full">
            <div 
              className="text-white rounded-2xl rounded-br-xs px-3.5 py-2 sm:px-4 sm:py-2.5 shadow-lg border border-white/15 animate-bubble-in origin-bottom-right"
              style={{ backgroundColor: PRIMARY_COLOR }}
            >
              <div className="text-sm sm:text-base font-normal leading-relaxed">
                {language === 'VN' ? 'Cho tủ cao lên 3000mm và thêm 2 đợt ngăn' : 'Make the cabinet 3000mm tall and add 2 shelves'}
              </div>
            </div>
          </div>
        )}

        {/* Tin 6: OpenSkp nhận lệnh chỉnh sửa */}
        {showBotAnalyzing2 && (
          <div className="flex justify-start w-full">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl rounded-bl-xs p-2.5 sm:p-3 shadow-lg border border-slate-200/90 text-slate-700 flex items-center gap-2 max-w-[95%] animate-bubble-in origin-bottom-left">
              <OpenSkpRobotIcon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" color={PRIMARY_COLOR} />
              <span className="font-normal text-slate-700 text-sm sm:text-base leading-relaxed">
                {language === 'VN' ? 'Đang cập nhật kích thước...' : 'Updating dimensions...'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* DÒNG CHÚ THÍCH VIẾT NGHIÊNG MÀU XANH CHỦ ĐẠO, KHÔNG BỌC BUTTON, KHÔNG LINK */}
      <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 select-none max-w-[85%] sm:max-w-none">
        <span 
          className="italic font-normal text-[12.5px] sm:text-[13px] tracking-tight"
          style={{ color: PRIMARY_COLOR }}
        >
          {language === 'VN' 
            ? 'Hoạt cảnh hội thoại chỉ mang tính chất minh họa, hãy xem hướng dẫn để nắm rõ quy trình sử dụng thực tế' 
            : 'Simulated conversation is for illustration purposes only; see guide for actual workflow.'}
        </span>
      </div>
    </div>
  );
};

// ==============================================================================
// 3. KHUNG 3 SHOWCASE: HIỆU CHỈNH KHÔNG GIAN (THIẾT KẾ TRẦN THEO ẢNH MẪU ĐÍNH KÈM)
// ==============================================================================
const ShowcaseModelEditVideoItem = ({ PRIMARY_COLOR = "#0063A3", language = "VN" }) => {
  const video6Ref = useRef(null);
  const video7Ref = useRef(null);

  const [isVideo7Active, setIsVideo7Active] = useState(false);
  const [showUserPrompt, setShowUserPrompt] = useState(false);
  const [showUserImg, setShowUserImg] = useState(false);
  const [showBotAnalyzing, setShowBotAnalyzing] = useState(false);
  const [showBotCompleted, setShowBotCompleted] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const sleep = (ms) => new Promise((resolve) => {
      if (isCancelled) return;
      setTimeout(() => { if (!isCancelled) resolve(); }, ms);
    });

    const runLoop = async () => {
      while (!isCancelled) {
        // 0. Reset về trạng thái ban đầu
        setShowUserPrompt(false);
        setShowUserImg(false);
        setShowBotAnalyzing(false);
        setShowBotCompleted(false);
        setIsVideo7Active(false);

        if (video6Ref.current) {
          video6Ref.current.pause();
          video6Ref.current.currentTime = 0;
        }
        if (video7Ref.current) {
          video7Ref.current.pause();
          video7Ref.current.currentTime = 0;
        }

        await sleep(500);

        // 1. Phát video 6 mở màn (chiếu không gian ban đầu)
        if (video6Ref.current) {
          video6Ref.current.currentTime = 0;
          video6Ref.current.play().catch(() => {});
        }

        // Video play 1s thì user nhắn tin text: "Thiết kế trần theo ảnh mẫu này"
        await sleep(1000);
        setShowUserPrompt(true);
        await sleep(800);

        // User gửi kèm ảnh mẫu trần dầm gỗ (ceiling-sample.jpg)
        setShowUserImg(true);
        await sleep(850);

        // OpenSkp phản hồi
        setShowBotAnalyzing(true);

        // Chờ video 6 chạy hết (5.83s) rồi tạm dừng ở frame cuối
        while (!isCancelled && video6Ref.current && video6Ref.current.currentTime < 5.5 && !video6Ref.current.ended) {
          await sleep(150);
        }
        if (video6Ref.current) {
          video6Ref.current.pause();
        }

        // 1s sau khi video 6 kết thúc, kích hoạt phát video 7
        await sleep(1000);
        setIsVideo7Active(true);
        if (video7Ref.current) {
          video7Ref.current.currentTime = 0;
          video7Ref.current.play().catch(() => {});
        }

        // Đến giây thứ 10 của video 7 thì báo hoàn thành
        while (!isCancelled && video7Ref.current && video7Ref.current.currentTime < 10.0 && !video7Ref.current.ended) {
          await sleep(150);
        }
        setShowBotCompleted(true);

        // Chờ video 7 chạy hết (13.53s)
        while (!isCancelled && video7Ref.current && video7Ref.current.currentTime < 13.2 && !video7Ref.current.ended) {
          await sleep(150);
        }
        if (video7Ref.current) {
          video7Ref.current.pause();
        }

        // Dừng 2.5 giây để chiêm ngưỡng không gian trần dầm gỗ hoàn thiện
        await sleep(2500);
      }
    };

    runLoop();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-md bg-slate-950 aspect-video ring-1 ring-slate-900/10">
      {/* Video 6: Mở màn quay không gian phòng (Dừng frame cuối) */}
      <video
        ref={video6Ref}
        loop={false}
        muted
        playsInline
        preload="auto"
        poster="/preview-0915-6.jpg"
        className={`absolute inset-0 h-full w-full object-cover z-10 ${
          isVideo7Active ? 'invisible pointer-events-none' : 'visible'
        }`}
      >
        <source src="/0915(6).mp4" type="video/mp4" />
      </video>

      {/* Video 7: Tiếp nối dựng trần chéo dầm gỗ liền mạch không nháy */}
      <video
        ref={video7Ref}
        loop={false}
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 h-full w-full object-cover z-20 ${
          isVideo7Active ? 'visible' : 'invisible pointer-events-none'
        }`}
      >
        <source src="/0915(7).mp4" type="video/mp4" />
      </video>

      {/* ĐOẠN HỘI THOẠI GIẢ LẬP */}
      <div 
        className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 flex flex-col items-end space-y-2.5 sm:space-y-3 w-[300px] sm:w-[360px] md:w-[420px] pointer-events-none select-none"
      >
        {/* Tin 1: User gửi câu lệnh: "Thiết kế trần theo ảnh mẫu này" */}
        {showUserPrompt && (
          <div className="flex justify-end w-full">
            <div 
              className="text-white rounded-2xl rounded-br-xs px-4 py-2.5 sm:px-5 sm:py-3 shadow-lg border border-white/15 animate-bubble-in origin-bottom-right"
              style={{ backgroundColor: PRIMARY_COLOR }}
            >
              <div className="text-sm sm:text-base font-normal leading-relaxed">
                {language === 'VN' ? 'Thiết kế trần theo ảnh mẫu này' : 'Design a ceiling based on this sample image'}
              </div>
            </div>
          </div>
        )}

        {/* Tin 2: Ảnh mẫu trần gỗ đính kèm, KHÔNG BUBBLE, BỎ VIỀN theo yêu cầu */}
        {showUserImg && (
          <div className="flex justify-end w-full">
            <div className="rounded-xl overflow-hidden shadow-2xl animate-bubble-in origin-bottom-right">
              <img 
                src="/ceiling-sample.jpg" 
                alt={language === "VN" ? "Mẫu trần dầm gỗ" : "Timber beam ceiling sample"} 
                className="w-48 sm:w-60 md:w-64 aspect-[1024/308] object-cover rounded-lg block"
              />
            </div>
          </div>
        )}

        {/* Tin 3: OpenSkp nhận lệnh phân tích và triển khai */}
        {showBotAnalyzing && (
          <div className="flex justify-start w-full">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl rounded-bl-xs p-3 sm:p-3.5 shadow-lg border border-slate-200/90 text-slate-800 flex items-center gap-2.5 max-w-[95%] animate-bubble-in origin-bottom-left">
              <OpenSkpRobotIcon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" color={PRIMARY_COLOR} />
              <span className="font-normal text-slate-700 text-sm sm:text-base leading-relaxed">
                {language === 'VN' ? 'Đang phân tích cấu trúc và triển khai tạo trần...' : 'Analyzing structure and creating ceiling...'}
              </span>
            </div>
          </div>
        )}

        {/* Tin 4: OpenSkp báo hoàn thành tại giây thứ 10 */}
        {showBotCompleted && (
          <div className="flex justify-start w-full">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl rounded-bl-xs px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-lg border border-slate-200/90 text-slate-800 flex items-center gap-2.5 max-w-[95%] animate-bubble-in origin-bottom-left">
              <OpenSkpRobotIcon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" color={PRIMARY_COLOR} />
              <span className="font-normal text-slate-700 text-sm sm:text-base leading-relaxed">
                {language === 'VN' ? 'Đã hoàn thành công việc' : 'Work completed successfully'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* DÒNG CHÚ THÍCH VIẾT NGHIÊNG MÀU XANH CHỦ ĐẠO, KHÔNG BỌC BUTTON, KHÔNG LINK */}
      <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 select-none max-w-[85%] sm:max-w-none">
        <span 
          className="italic font-normal text-[13.5px] sm:text-[14.5px] tracking-tight"
          style={{ color: PRIMARY_COLOR }}
        >
          {language === 'VN' 
            ? 'Hoạt cảnh hội thoại chỉ mang tính chất minh họa, hãy xem hướng dẫn để nắm rõ quy trình sử dụng thực tế' 
            : 'Simulated conversation is for illustration purposes only; see guide for actual workflow.'}
        </span>
      </div>
    </div>
  );
};

// ==============================================================================
export const ShowcaseSection = ({ PRIMARY_COLOR = "#0063A3", language = "VN" }) => {
  const SHOWCASE_ITEMS = [
    {
      id: 'showcase-1',
      title: language === 'VN' ? 'Dựng Không Gian 3D Từ Ảnh Mặt Bằng 2D' : 'Generate 3D Spaces from 2D Floor Plans',
      subtitle: language === 'VN' ? 'Tự động hóa toàn diện không gian kiến trúc' : 'Comprehensive architectural space automation',
      description: language === 'VN' 
        ? 'Chỉ cần một bức ảnh mặt bằng 2D, OpenSkp sẽ tự động nhận diện bố cục các phòng, dựng toàn bộ hệ tường, sàn, trần và phân chia không gian 3D hoàn chỉnh ngay trên SketchUp chỉ trong vài giây.'
        : 'With just a 2D floor plan image, OpenSkp automatically recognizes room layouts, builds walls, floors, ceilings, and partitions complete 3D architectural spaces directly in SketchUp within seconds.'
    },
    {
      id: 'showcase-2',
      title: language === 'VN' ? 'Dựng Model Cấu Kiện & Đồ Nội Thất Bằng AI' : 'Build 3D Components & Furniture with AI',
      subtitle: language === 'VN' ? 'Cầu nối điều phối thông minh trong SketchUp' : 'Intelligent coordination bridge inside SketchUp',
      description: language === 'VN'
        ? 'Gửi ảnh mẫu thiết kế nội thất vào OpenSkp để tự động tạo dựng cấu kiện 3D chuẩn xác từng chi tiết trực tiếp trên Viewport SketchUp, đồng thời dễ dàng hiệu chỉnh kích thước và công năng linh hoạt theo nhu cầu.'
        : 'Send interior design reference images to OpenSkp to automatically generate high-precision 3D components on the SketchUp Viewport, with flexible parametric dimension editing.'
    },
    {
      id: 'showcase-3',
      title: language === 'VN' ? 'Hiệu Chỉnh Không Gian & Cấu Kiện Model Bằng AI' : 'Edit Spaces & 3D Model Components with AI',
      subtitle: language === 'VN' ? 'Đồng bộ tham số mô hình 3D thông minh' : 'Intelligent 3D model parametric synchronization',
      description: language === 'VN'
        ? 'Trích xuất thông tin đối tượng 3D trực tiếp trên Viewport SketchUp chỉ với một cú nhấp chuột. Ra lệnh bằng ngôn ngữ tự nhiên để thiết kế cấu trúc mới hệ thống sẽ tự động cập nhật chính xác vị trí ngay trên mô hình 3D.'
        : 'Extract 3D object metadata directly on the SketchUp Viewport with a single click. Command in natural language to design new structures, and the system automatically updates the exact position right on the 3D model.'
    }
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-16 animate-fade-in relative z-20">
      {SHOWCASE_ITEMS.map((item) => (
        <div 
          key={item.id} 
          className="bg-white rounded-3xl shadow-lg ring-1 ring-slate-900/10 p-6 sm:p-10 space-y-6 transition-all hover:shadow-xl"
        >
          {/* 1. KHUNG VIDEO & HOẠT CẢNH MÔ PHỎNG NẰM PHÍA TRÊN */}
          {item.id === 'showcase-1' && (
            <ShowcaseFloorplanVideoItem PRIMARY_COLOR={PRIMARY_COLOR} language={language} />
          )}

          {item.id === 'showcase-2' && (
            <ShowcaseCabinetVideoItem PRIMARY_COLOR={PRIMARY_COLOR} language={language} />
          )}

          {item.id === 'showcase-3' && (
            <ShowcaseModelEditVideoItem PRIMARY_COLOR={PRIMARY_COLOR} language={language} />
          )}

          {/* 2. CÁC PHẦN TEXT (TIÊU ĐỀ & MÔ TẢ) ĐƯỢC ĐƯA XUỐNG DƯỚI VIDEO */}
          <div className="pt-2">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 
                className="text-xl sm:text-3xl font-bold leading-tight tracking-tight text-slate-800"
                style={{ color: PRIMARY_COLOR }}
              >
                {item.title}
              </h2>
            </div>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-2 max-w-4xl text-justify">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
};

// ==============================================================================
// 5. TOÀN BỘ HƯỚNG DẪN TRÊN CÙNG 1 TRANG CUỘN (TẤT CẢ TRONG KHUNG BO TRẮNG)
// ==============================================================================

// ==============================================================================
// 3. MÔ PHỎNG: CUNG CẤP KỸ NĂNG DỰNG HÌNH "SKILL" CHO AI (WIN10 & GOOGLE GEMINI)
// ==============================================================================

// Icon ngôi sao 4 cánh chuẩn màu Google Gemini (Đỏ đỉnh, Vàng trái, Xanh dương phải, Xanh lá dưới)






const GeminiColorfulLogo = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gemini-star-official-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EA4335" />
        <stop offset="30%" stopColor="#FBBC04" />
        <stop offset="70%" stopColor="#1A73E8" />
        <stop offset="100%" stopColor="#1E8E3E" />
      </linearGradient>
    </defs>
    <path 
      d="M12 2C12 7.52 7.52 12 2 12C7.52 12 12 16.48 12 22C12 16.48 16.48 12 22 12C16.48 12 12 7.52 12 2Z" 
      fill="url(#gemini-star-official-grad)" 
    />
  </svg>
);

// Logo ChatGPT chính thức (Icon xoáy OpenAI theo ảnh người dùng cung cấp)
const ChatGPTLogo = ({ className = "w-3.5 h-3.5" }) => (
  <img 
    src="/icon-chatgpt.png" 
    alt="ChatGPT" 
    className={`${className} object-contain`} 
  />
);

// Logo Claude chính thức (Biểu tượng hoa thị đa cánh màu cam đất đặc trưng của Anthropic Claude)
const ClaudeLogo = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#D97757">
    <g transform="translate(12,12)">
      <rect x="-1.1" y="-9.5" width="2.2" height="19" rx="1.1" transform="rotate(0)" />
      <rect x="-1.1" y="-9.5" width="2.2" height="19" rx="1.1" transform="rotate(30)" />
      <rect x="-1.1" y="-9.5" width="2.2" height="19" rx="1.1" transform="rotate(60)" />
      <rect x="-1.1" y="-9.5" width="2.2" height="19" rx="1.1" transform="rotate(90)" />
      <rect x="-1.1" y="-9.5" width="2.2" height="19" rx="1.1" transform="rotate(120)" />
      <rect x="-1.1" y="-9.5" width="2.2" height="19" rx="1.1" transform="rotate(150)" />
    </g>
  </svg>
);


// Cụm thanh công cụ Left Rail đồng bộ của Google Gemini chuẩn theo ảnh thật
const GeminiLeftRail = ({ width = "w-11" }) => (
  <div className={`${width} bg-white/80 border-r border-slate-200/80 flex flex-col items-center py-3 gap-3 shrink-0 select-none`}>
    {/* 1. Biểu tượng Gemini Sparkle */}
    <div className="w-6 h-6 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity" title="Gemini">
      <GeminiColorfulLogo className="w-5 h-5" />
    </div>

    {/* 3. Nút Cuộc trò chuyện mới (Bút / Edit) đơn sắc */}
    <div className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer transition-colors" title="Cuộc trò chuyện mới">
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    </div>

    {/* 4. Biểu tượng Tìm kiếm (Search) đơn sắc */}
    <div className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer transition-colors" title="Tìm kiếm">
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </div>

    {/* 5. Biểu tượng Hộp công cụ / Gems (Briefcase / Drawer) đơn sắc */}
    <div className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer transition-colors" title="Gems / Tiện ích">
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="6" width="18" height="14" rx="2.5" />
        <path d="M3 11h18" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </svg>
    </div>

    {/* 6. Biểu tượng 4 ô vuông (2x2 Apps Grid) đơn sắc */}
    <div className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer transition-colors" title="Ứng dụng">
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="6" height="6" rx="1.5" />
        <rect x="14" y="4" width="6" height="6" rx="1.5" />
        <rect x="4" y="14" width="6" height="6" rx="1.5" />
        <rect x="14" y="14" width="6" height="6" rx="1.5" />
      </svg>
    </div>
  </div>
);

// Icon tài liệu văn bản chuẩn Windows Text Document
const DocTextIcon = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Nền giấy trắng đổ bóng bo góc */}
    <rect x="7" y="3" width="34" height="42" rx="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.8" />
    <path d="M28 3V15H40" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M28 3L40 15H28V3Z" fill="#e2e8f0" />
    {/* Các dòng chữ text đơn sắc xanh thương hiệu & xám */}
    <line x1="14" y1="21" x2="34" y2="21" stroke="#0063A3" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="14" y1="27" x2="34" y2="27" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="14" y1="33" x2="30" y2="33" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="14" y1="38" x2="24" y2="38" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);







export const GeminiSkillWorkflow = ({ PRIMARY_COLOR = "#0063A3", language = "VN" }) => {
  const containerRef = useRef(null);

  // Chuột xuất phát trực tiếp từ vị trí của file Skill Openskp.txt
  const [cursorPos, setCursorPos] = useState({ x: 180, y: 180 });
  const [cursorDuration, setCursorDuration] = useState(0);
  const [isClicking, setIsClicking] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Các trạng thái workflow
  const [fileAttached, setFileAttached] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [geminiThinking, setGeminiThinking] = useState(false);
  const [geminiResponded, setGeminiResponded] = useState(false);

  const getCenterCoords = (elementId) => {
    if (!containerRef.current) return null;
    const targetEl = document.getElementById(elementId);
    if (!targetEl) return null;
    const containerRect = containerRef.current.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    return {
      x: targetRect.left - containerRect.left + targetRect.width / 2,
      y: targetRect.top - containerRect.top + targetRect.height / 2
    };
  };

  useEffect(() => {
    let isCancelled = false;

    const sleep = (ms) => new Promise(resolve => {
      if (isCancelled) return;
      setTimeout(() => {
        if (!isCancelled) resolve();
      }, ms);
    });

    const moveMouse = async (elId, duration = 800, fallback = { x: 180, y: 180 }) => {
      if (isCancelled) return false;
      const coords = getCenterCoords(elId) || fallback;
      setCursorDuration(duration);
      setCursorPos(coords);
      await sleep(duration + 50);
      return true;
    };

    const clickMouse = async () => {
      if (isCancelled) return;
      setIsClicking(true);
      await sleep(180);
      setIsClicking(false);
      await sleep(100);
    };

    const runLoop = async () => {
      while (!isCancelled) {
        // Reset các trạng thái
        setIsDragging(false);
        setIsDragOver(false);
        setFileAttached(false);
        setIsFocused(false);
        setPromptText("");
        setIsSubmitted(false);
        setGeminiThinking(false);
        setGeminiResponded(false);
        setIsClicking(false);

        // Đặt chuột xuất phát trực tiếp từ vị trí file text
        await moveMouse('gemini-step-txt-item', 0, { x: 180, y: 180 });
        await sleep(600);

        // 1. Nhấn giữ chuột để bắt đầu kéo thả
        setIsClicking(true);
        setIsDragging(true);
        await sleep(200);

        // 2. Kéo file sang ô chat của Gemini
        const dropZonePos = getCenterCoords('gemini-step-prompt-box') || { x: 620, y: 440 };
        setCursorDuration(1200);
        setCursorPos(dropZonePos);

        // Giữa hành trình: kích hoạt trạng thái hover đổi màu (không dùng nét đứt)
        await sleep(600);
        if (!isCancelled) setIsDragOver(true);

        // Đợi chuột dừng hẳn tại ô chat
        await sleep(650);
        setIsClicking(false);
        setIsDragging(false);
        setIsDragOver(false);
        setFileAttached(true); // Hiển thị file chip ở TRÊN thanh nhập liệu
        await sleep(500);

        // 3. Gõ lời nhắc "Đọc hiểu tài liệu này" đồng bộ typewriter từng ký tự
        setIsFocused(true);
        await sleep(350);
        const fullPrompt = language === "VN" ? "Đọc hiểu tài liệu này" : "Understand this document";
        for (let i = 1; i <= fullPrompt.length; i++) {
          if (isCancelled) return;
          setPromptText(fullPrompt.slice(0, i));
          await sleep(55);
        }
        await sleep(450);

        // 4. Di chuột tới nút Send tròn
        await moveMouse('gemini-step-send-btn', 550, { x: 790, y: 440 });
        await clickMouse();

        setIsFocused(false);
        setIsSubmitted(true);
        setPromptText("");
        setGeminiThinking(true);
        await sleep(1500);

        // 5. Gemini phản hồi
        setGeminiThinking(false);
        setGeminiResponded(true);

        // Giữ kết quả hiển thị 5 giây
        await sleep(5000);

        // Di chuyển chuột trở lại file txt
        await moveMouse('gemini-step-txt-item', 1000, { x: 180, y: 180 });
        await sleep(800);
      }
    };

    const initialTimer = setTimeout(() => {
      if (!isCancelled) runLoop();
    }, 200);

    return () => {
      isCancelled = true;
      clearTimeout(initialTimer);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-full relative select-none"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* ==================================================================== */}
        {/* CỘT 1: CỬA SỔ FOLDER DOWNLOADS WIN 10 (ĐỒNG BỘ 100% THEO BƯỚC 1) */}
        {/* ==================================================================== */}
        <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm ring-1 ring-slate-900/10 overflow-hidden flex flex-col font-sans text-xs h-[540px]">
          
          {/* Win 10 Title Bar: Cố định h-9 gióng thẳng hàng */}
          <div className="h-9 bg-white border-b border-gray-200 px-3 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2">
              <Folder size={14} className="text-amber-500 fill-amber-500" />
              <span className="text-slate-700 font-normal text-xs">Downloads</span>
            </div>
            <WindowControls />
          </div>

          {/* Win 10 Menu Bar: Cố định h-8 gióng thẳng hàng */}
          <div className="h-8 bg-white border-b border-gray-200 px-3 flex items-center gap-4 text-xs text-slate-700 font-normal shrink-0 select-none">
            <span className="hover:bg-gray-100 px-1.5 py-0.5 rounded cursor-pointer">File</span>
            <span className="hover:bg-gray-100 px-1.5 py-0.5 rounded cursor-pointer">Home</span>
            <span className="hover:bg-gray-100 px-1.5 py-0.5 rounded cursor-pointer">Share</span>
            <span className="hover:bg-gray-100 px-1.5 py-0.5 rounded cursor-pointer">View</span>
          </div>

          {/* Win 10 Address Bar: Cố định h-9 gióng thẳng hàng */}
          <div className="h-9 bg-white border-b border-gray-200 px-2.5 flex items-center gap-2 shrink-0 select-none">
            {/* Cụm mũi tên điều hướng chuẩn Win 10 */}
            <div className="flex items-center gap-1 text-slate-700 shrink-0 pr-1">
              <span className="w-5 h-5 rounded flex items-center justify-center font-normal">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </span>
              <span className="w-5 h-5 rounded flex items-center justify-center text-slate-300">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
              <span className="w-5 h-5 rounded flex items-center justify-center font-normal">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                </svg>
              </span>
            </div>

            {/* Thanh địa chỉ */}
            <div className="flex-1 bg-white border border-gray-300 rounded px-2.5 h-6 text-xs text-slate-600 flex items-center gap-1 shadow-xs truncate">
              <span className="text-slate-700 font-normal text-xs truncate">This PC &gt; Downloads</span>
            </div>
          </div>

          {/* Vùng xem File: Đồng bộ text-xs font-normal chuẩn Bước 1 */}
          <div className="p-4 flex-1 bg-white flex flex-col justify-start relative">
            <div className="flex flex-wrap items-start gap-2.5 pt-2">
              
              {/* File 1: Openskp.rar */}
              <div className="w-24 p-1.5 rounded-lg border border-transparent flex flex-col items-center text-center text-slate-700">
                <img 
                  src="/icon-rar-clean.png" 
                  alt="Openskp.rar" 
                  className="w-12 h-12 object-contain drop-shadow-xs" 
                />
                <span className="font-normal text-xs mt-1.5 truncate max-w-full">
                  Openskp.rar
                </span>
              </div>

              {/* File 2: Skill Openskp.md */}
              <div 
                id="gemini-step-txt-item"
                className={`w-24 p-1.5 rounded-lg border flex flex-col items-center text-center transition-all cursor-grab ${
                  isDragging 
                    ? 'border-[#0063A3]/50 bg-blue-100/70 text-[#0063A3] opacity-60' 
                    : 'border-transparent hover:border-slate-300 text-slate-700'
                }`}
              >
                <DocTextIcon className="w-12 h-12 object-contain drop-shadow-xs" />
                <span className="font-normal text-xs mt-1.5 truncate max-w-full">
                  Skill Openskp.md
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* ==================================================================== */}
        {/* CỘT 2: TRÌNH DUYỆT GOOGLE CHROME (GIỮ NGUYÊN ĐẦY ĐỦ CẢ TAB GEMINI, CHATGPT, CLAUDE) */}
        {/* ==================================================================== */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm ring-1 ring-slate-900/10 overflow-hidden flex flex-col font-sans text-xs h-[540px]">
          
          {/* Chrome Tab Bar: Giữ trọn vẹn Tab Gemini, ChatGPT, Claude & Tiêu đề h-9 chuẩn */}
          <div className="h-9 bg-[#dee1e6] border-b border-gray-300 px-2 flex items-end justify-between shrink-0 select-none pt-1">
            <div className="flex items-end h-full">
              {/* Tab 1: Google Gemini (Active) */}
              <div className="h-[30px] bg-white rounded-t-lg px-3 flex items-center gap-2 shadow-xs border-t border-x border-gray-300/50">
                <GeminiColorfulLogo className="w-3.5 h-3.5 shrink-0" />
                <span className="font-sans text-xs text-slate-700 font-normal whitespace-nowrap">Google Gemini</span>
                <span className="text-slate-500 hover:text-slate-700 ml-3 text-[10px] cursor-pointer leading-none">✕</span>
              </div>

              {/* Tab 2: ChatGPT (Inactive) */}
              <div className="h-[30px] px-3 flex items-center gap-2 text-slate-700 hover:bg-slate-200/50 rounded-t-lg cursor-pointer transition-colors">
                <ChatGPTLogo className="w-3.5 h-3.5 shrink-0" />
                <span className="font-sans text-xs text-slate-700 font-normal whitespace-nowrap">ChatGPT</span>
                <span className="text-slate-500 hover:text-slate-700 ml-2 text-[10px] cursor-pointer leading-none">✕</span>
              </div>

              {/* Dấu gạch dọc ngăn cách */}
              <div className="h-3.5 w-[1px] bg-slate-400/60 mx-1 self-center shrink-0" />

              {/* Tab 3: New chat - Claude (Inactive) */}
              <div className="h-[30px] px-3 flex items-center gap-2 text-slate-700 hover:bg-slate-200/50 rounded-t-lg cursor-pointer transition-colors">
                <ClaudeLogo className="w-3.5 h-3.5 shrink-0" />
                <span className="font-sans text-xs text-slate-700 font-normal whitespace-nowrap">New chat - Claude</span>
                <span className="text-slate-500 hover:text-slate-700 ml-2 text-[10px] cursor-pointer leading-none">✕</span>
              </div>

              {/* Dấu gạch dọc ngăn cách sau Claude */}
              <div className="h-3.5 w-[1px] bg-slate-400/60 mx-1 self-center shrink-0" />
            </div>

            <div className="self-center pb-1">
              <WindowControls />
            </div>
          </div>

          {/* Chrome URL Bar: Đồng bộ 100% theo Bước 2 (Không có icon ổ khóa) */}
          <div className="h-8 bg-white border-b border-gray-200 px-3 flex items-center gap-2.5 shrink-0">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"/></svg>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            </div>
            <div className="flex-1 bg-[#f1f3f4] rounded-full px-3 py-1 text-xs text-slate-700 font-normal flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-normal text-slate-700 text-xs">gemini.google.com/app</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <svg className="w-3.5 h-3.5 text-[#0063A3]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>
              <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-600 font-bold">A</div>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
            </div>
          </div>

          {/* Vùng giao diện ứng dụng Gemini (Gồm Left Rail và Chat Canvas nền xanh nhạt) */}
          <div className="flex-1 flex overflow-hidden">
            
<GeminiLeftRail width="w-11" />

            {/* Chat Canvas (Nền chuyển sắc xanh da trời nhạt đúng theo ảnh chụp) */}
            <div 
              className="flex-1 p-4 flex flex-col justify-between overflow-hidden relative"
              style={{
                background: 'linear-gradient(180deg, #edf4fc 0%, #e2eef9 100%)'
              }}
            >
              
              {/* Khung tin nhắn hội thoại */}
              <div className="flex-1 flex flex-col justify-center overflow-hidden">
                {!isSubmitted ? (
                  /* Trạng thái ban đầu */
                  <div className="flex flex-col items-center justify-center text-center my-auto py-2">
                    <GeminiColorfulLogo className="w-12 h-12 mb-2 opacity-95" />
                    <p className="text-xs text-slate-600 font-normal">
                      {language === 'VN' ? <span>Kéo thả file <strong>Skill Openskp.md</strong> vào ô chat bên dưới để bắt đầu.</span> : <span>Drag & drop file <strong>Skill Openskp.md</strong> into chat below to begin.</span>}
                    </p>
                  </div>
                ) : (
                  /* Cuộc hội thoại sau khi gửi prompt */
                  <div className="space-y-4 animate-fade-in w-full px-3 sm:px-6 py-1">
                    
                    {/* Tin nhắn từ User: Thumbnail file giống hệt lúc đính kèm */}
                    <div className="flex flex-col items-end gap-1.5 animate-bubble-in">
                      <div className="bg-white border border-slate-200 rounded-xl p-2 flex flex-col items-center justify-center shadow-xs w-24">
                        <DocTextIcon className="w-10 h-10 object-contain drop-shadow-2xs" />
                        <span className="text-[10px] font-medium text-slate-700 mt-1 truncate max-w-full text-center leading-tight">
                          Skill Openskp.md
                        </span>
                      </div>
                      <div className="bg-white text-slate-800 px-3.5 py-2 rounded-2xl rounded-tr-xs text-xs font-normal shadow-xs border border-slate-200/80 leading-relaxed">
                        Đọc hiểu tài liệu này
                      </div>
                    </div>

                    {/* Phản hồi từ Gemini */}
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-2xs shrink-0 mt-0.5">
                        <GeminiColorfulLogo className="w-5 h-5" />
                      </div>

                      {geminiThinking ? (
                        <div className="bg-white px-3 py-2 rounded-2xl shadow-xs border border-slate-200 text-xs font-normal text-slate-500 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0063A3] animate-pulse" />
                          <span>Đang đọc hiểu tài liệu...</span>
                        </div>
                      ) : geminiResponded ? (
                        <div className="bg-white px-3.5 py-2.5 rounded-2xl shadow-xs border border-slate-200/80 text-xs font-normal text-slate-700 leading-relaxed max-w-md animate-fade-in">
                          {language === 'VN' ? 'Tôi đã đọc hiểu tài liệu kỹ năng Skill OpenSkp và sẵn sàng dựng hình theo yêu cầu của bạn!' : 'I have fully loaded the OpenSkp modeling skills and Ruby SDK coordination methods. Ready to generate 3D geometry.'}
                        </div>
                      ) : null}
                    </div>

                  </div>
                )}
              </div>

              {/* Vùng nhập liệu Gemini - KHÓA CỐ ĐỊNH KÍCH THƯỚC */}
              <div className="shrink-0 flex flex-col justify-end">
                {/* File đính kèm bên trên: Icon to như folder, tên để hàng dưới */}
                {fileAttached && !isSubmitted && (
                  <div className="px-1 mb-2 flex items-center gap-2 animate-fade-in">
                    <div className="relative bg-white border border-slate-200 rounded-xl p-2 flex flex-col items-center justify-center shadow-xs w-24">
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-slate-700 text-white rounded-full text-[9px] flex items-center justify-center leading-none shadow-xs cursor-pointer">
                        ✕
                      </span>
                      <DocTextIcon className="w-10 h-10 object-contain drop-shadow-2xs" />
                      <span className="text-[10px] font-medium text-slate-700 mt-1 truncate max-w-full text-center leading-tight">
                        Skill Openskp.md
                      </span>
                    </div>
                  </div>
                )}

                {/* Ô Chat Gemini (Viên thuốc tròn: Khi thả file tô màu xanh mờ chủ đạo ko tô viền, bỏ chữ thả file) */}
                <div 
                  id="gemini-step-prompt-box"
                  className={`h-11 rounded-full border border-slate-200/90 transition-colors px-4 flex items-center justify-between shadow-xs relative shrink-0 ${
                    isDragOver ? 'bg-[#0063A3]/10' : 'bg-white'
                  }`}
                >
                  {/* Nút cộng + bên trái */}
                  <span className="text-xl text-slate-500 font-light pr-2.5 select-none leading-none cursor-pointer">+</span>

                  {/* Vùng gõ văn bản kèm con trỏ nháy đồng bộ */}
                  <div className="flex-1 flex items-center bg-transparent text-xs text-slate-800 font-normal min-w-0 h-full cursor-text overflow-hidden">
                    {promptText ? (
                      <div className="flex items-center truncate">
                        <span>{promptText}</span>
                        {isFocused && (
                          <span className="inline-block w-[1.5px] h-3.5 bg-[#0063A3] ml-0.5 animate-pulse shrink-0" />
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center text-slate-400">
                        {isFocused && (
                          <span className="inline-block w-[1.5px] h-3.5 bg-[#0063A3] mr-0.5 animate-pulse shrink-0" />
                        )}
                        <span>{fileAttached ? "" : (language === "VN" ? "Hỏi Gemini" : "Ask Gemini")}</span>
                      </div>
                    )}
                  </div>

                  {/* Cụm chức năng bên phải: Flash Mở rộng ⌵ và Ô nút Gửi/Mic cố định w-7 h-7 */}
                  <div className="flex items-center gap-3 shrink-0 select-none pl-2 h-full">
                    <div className="flex items-center gap-1 text-xs text-slate-700 font-medium">
                      <span>Flash</span>
                      <span className="text-slate-400 text-xs">Mở rộng</span>
                      <svg className="w-3 h-3 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                    </div>

                    {/* Ô nút Gửi / Mic: Cố định khung w-7 h-7 không co giật */}
                    <div className="w-7 h-7 flex items-center justify-center shrink-0">
                      {promptText ? (
                        <button 
                          id="gemini-step-send-btn"
                          className="w-7 h-7 rounded-full bg-[#0063A3] text-white flex items-center justify-center shadow-xs cursor-pointer hover:bg-blue-700 transition-colors shrink-0"
                          title={language === "VN" ? "Gửi" : "Send"}
                        >
                          <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" /></svg>
                        </button>
                      ) : (
                        <span className="w-7 h-7 flex items-center justify-center cursor-pointer text-slate-500 hover:text-slate-700 shrink-0">
                          <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Con trỏ chuột ảo kéo thả file mượt mà */}
      <div 
        className="hidden lg:block absolute z-50 pointer-events-none select-none"
        style={{
          transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)`,
          transition: `transform ${cursorDuration}ms cubic-bezier(0.25, 1, 0.5, 1)`,
          left: 0,
          top: 0
        }}
      >
        <div className="relative">
          {/* Mũi tên chuột */}
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform duration-100 ${isClicking ? 'scale-90 translate-y-0.5' : ''}`}
            style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.4))' }}
          >
            <path 
              d="M3 2L10.5 20.5L13.5 13L21 10L3 2Z" 
              fill="#0f172a" 
              stroke="#ffffff" 
              strokeWidth="1.8" 
              strokeLinejoin="round" 
              strokeLinecap="round" 
            />
          </svg>

          {/* Khi đang giữ kéo chuột: Icon file to bám sát ngay dưới con trỏ */}
          {isDragging && (
            <div className="absolute left-3 top-3 flex flex-col items-center gap-1 bg-white/95 border border-[#0063A3] shadow-xl rounded-xl p-1.5 text-[10px] font-medium text-slate-800 animate-fade-in pointer-events-none whitespace-nowrap">
              <DocTextIcon className="w-8 h-8 object-contain" />
              <span>Skill Openskp.md</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export const Step4AiWorkflow = ({ PRIMARY_COLOR = "#0063A3", language = "VN" }) => {
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);
  const containerRef = useRef(null);
  const geminiChatRef = useRef(null);
  const openskpChatRef = useRef(null);

  // Vị trí và trạng thái chuột
  const [cursorPos, setCursorPos] = useState({ x: 920, y: 500 });
  const [cursorDuration, setCursorDuration] = useState(0);
  const [isClicking, setIsClicking] = useState(false);

  // Trạng thái hội thoại Gemini (Lần 1: Dựng tủ theo ảnh)
  const [cabinetAttached, setCabinetAttached] = useState(false);
  const [geminiPrompt, setGeminiPrompt] = useState("");
  const [isGeminiFocused, setIsGeminiFocused] = useState(false);
  const [cabinetSent, setCabinetSent] = useState(false);
  const [geminiThinking, setGeminiThinking] = useState(false);
  const [geminiResponded, setGeminiResponded] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  // Trạng thái hội thoại Gemini (Lần 2: Cho cao lên 3m và thêm 2 đợt)
  const [geminiPrompt2Sent, setGeminiPrompt2Sent] = useState(false);
  const [gemini2Thinking, setGemini2Thinking] = useState(false);
  const [gemini2Responded, setGemini2Responded] = useState(false);
  const [code2Copied, setCode2Copied] = useState(false);

  // Trạng thái hội thoại OpenSkp trong SketchUp (bên trái)
  const [isOpenskpFocused, setIsOpenskpFocused] = useState(false);
  const [showCtrlVPopup, setShowCtrlVPopup] = useState(false);
  const [openskpInput, setOpenskpInput] = useState("");
  const [openskpSent, setOpenskpSent] = useState(false);
  const [openskpCompleted1, setOpenskpCompleted1] = useState(false);
  const [openskp2Sent, setOpenskp2Sent] = useState(false);
  const [openskpCompleted2, setOpenskpCompleted2] = useState(false);

  // Trạng thái Viewport 3D
  const [isVideo2Active, setIsVideo2Active] = useState(false);

  const getCenterCoords = (elementId) => {
    if (!containerRef.current) return null;
    const targetEl = document.getElementById(elementId);
    if (!targetEl) return null;
    const containerRect = containerRef.current.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    return {
      x: targetRect.left - containerRect.left + targetRect.width / 2,
      y: targetRect.top - containerRect.top + targetRect.height / 2
    };
  };

  // Cuộn mượt mà không nháy giật khi có tin nhắn Gemini
  useEffect(() => {
    if (!geminiChatRef.current) return;
    if (!cabinetSent && !geminiThinking && !geminiResponded && !geminiPrompt2Sent && !gemini2Thinking && !gemini2Responded) {
      geminiChatRef.current.scrollTop = 0;
      return;
    }
    const scrollTimer = setTimeout(() => {
      if (geminiChatRef.current) {
        geminiChatRef.current.scrollTo({
          top: geminiChatRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 60);
    return () => clearTimeout(scrollTimer);
  }, [cabinetSent, geminiThinking, geminiResponded, geminiPrompt2Sent, gemini2Thinking, gemini2Responded]);

  // Cuộn mượt mà cho OpenSkp
  useEffect(() => {
    if (!openskpChatRef.current) return;
    if (!openskpSent && !openskp2Sent && !openskpCompleted1 && !openskpCompleted2) {
      openskpChatRef.current.scrollTop = 0;
      return;
    }
    const scrollTimer = setTimeout(() => {
      if (openskpChatRef.current) {
        openskpChatRef.current.scrollTo({
          top: openskpChatRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 60);
    return () => clearTimeout(scrollTimer);
  }, [openskpSent, openskp2Sent, openskpCompleted1, openskpCompleted2]);

  useEffect(() => {
    let isCancelled = false;

    const sleep = (ms) => new Promise(resolve => {
      if (isCancelled) return;
      setTimeout(() => {
        if (!isCancelled) resolve();
      }, ms);
    });

    const moveMouse = async (elId, duration = 800, fallback = { x: 920, y: 500 }) => {
      if (isCancelled) return false;
      const coords = getCenterCoords(elId) || fallback;
      setCursorDuration(duration);
      setCursorPos(coords);
      await sleep(duration + 50);
      return true;
    };

    const clickMouse = async () => {
      if (isCancelled) return;
      setIsClicking(true);
      await sleep(180);
      setIsClicking(false);
      await sleep(100);
    };

    const runLoop = async () => {
      while (!isCancelled) {
        // ==========================================
        // 1. RESET TOÀN BỘ TRẠNG THÁI CHO VÒNG LẶP MỚI
        // ==========================================
        setIsVideo2Active(false);
        setCabinetAttached(false);
        setGeminiPrompt("");
        setIsGeminiFocused(false);
        setCabinetSent(false);
        setGeminiThinking(false);
        setGeminiResponded(false);
        setCodeCopied(false);
        setGeminiPrompt2Sent(false);
        setGemini2Thinking(false);
        setGemini2Responded(false);
        setCode2Copied(false);
        setIsOpenskpFocused(false);
        setShowCtrlVPopup(false);
        setOpenskpInput("");
        setOpenskpSent(false);
        setOpenskpCompleted1(false);
        setOpenskp2Sent(false);
        setOpenskpCompleted2(false);

        // Video chờ là 0915.mp4
        if (video1Ref.current) {
          video1Ref.current.pause();
          video1Ref.current.currentTime = 0;
        }
        if (video2Ref.current) {
          video2Ref.current.pause();
          video2Ref.current.currentTime = 0;
        }

        // ==========================================
        // 2. LẦN 1: GỬI ẢNH TỦ MẪU + "dựng cái tủ này"
        // ==========================================
        await moveMouse('step4-gemini-attach-btn', 0, { x: 880, y: 505 });
        await sleep(600);

        // Click thêm tệp ảnh tủ mẫu
        await clickMouse();
        setCabinetAttached(true);
        await sleep(400);

        // Di chuột vào ô nhập liệu Gemini & kích hoạt nháy |
        await moveMouse('step4-gemini-input-box', 350, { x: 920, y: 505 });
        await clickMouse();
        setIsGeminiFocused(true);
        await sleep(250);

        // Gõ lời nhắc "dựng cái tủ này" từng chữ chậm rãi
        const prompt1Target = language === "VN" ? "dựng cái tủ này" : "build this cabinet";
        for (let i = 1; i <= prompt1Target.length; i++) {
          if (isCancelled) return;
          setGeminiPrompt(prompt1Target.slice(0, i));
          await sleep(140);
        }
        await sleep(550);

        // Di chuột sang nút Send của Gemini
        await moveMouse('step4-gemini-send-btn', 400, { x: 1040, y: 505 });
        await clickMouse();
        setIsGeminiFocused(false);

        setCabinetSent(true);
        setCabinetAttached(false);
        setGeminiPrompt("");
        setGeminiThinking(true);

        // Chuột giữ tự nhiên gần ô chat
        await sleep(1500);

        // Gemini trả lời mã Ruby lần 1
        setGeminiThinking(false);
        setGeminiResponded(true);
        await sleep(700);

        // Di chuột sao chép mã Ruby 1
        await moveMouse('step4-gemini-copy-code-btn', 500, { x: 1030, y: 380 });
        await clickMouse();
        setCodeCopied(true);
        await sleep(500);

        // Di chuột sang ô nhập liệu OpenSkp trong SketchUp
        await moveMouse('step4-openskp-input', 800, { x: 620, y: 505 });
        setIsOpenskpFocused(true); // Con trỏ nháy |
        await sleep(350);

        // Hiển thị popup Ctrl + V chữ đen nền trắng ngay dưới chuột CHẬM RÃI, RÕ RÀNG
        setShowCtrlVPopup(true);
        await sleep(850);

        // Tự động hiển thị mã Ruby trong ô nhập liệu
        setOpenskpInput("cabinet = OpenSkp::Cabinet.new(width: 900, height: 2000, depth: 400)");
        await sleep(750);

        // Ẩn popup Ctrl+V
        setShowCtrlVPopup(false);
        await sleep(300);

        // Di chuột sang nút Send của OpenSkp và click gửi
        await moveMouse('step4-openskp-send-btn', 400, { x: 740, y: 505 });
        await clickMouse();

        setIsOpenskpFocused(false);
        setOpenskpSent(true);
        setOpenskpInput("");

        // Chạy video 0915.mp4 dựng hình lần 1
        if (video1Ref.current) {
          video1Ref.current.currentTime = 0;
          video1Ref.current.play().catch(() => {});
        }

        // ĐỢI ĐÚNG 1 GIÂY -> HIỆN BUBBLE "ĐÃ HOÀN THÀNH"
        await sleep(1000);
        setOpenskpCompleted1(true);

        // Chờ video 0915 chạy xong (tổng 10.47s, đã chờ 1s -> chờ tiếp 9600ms)
        await sleep(9600);

        // Video chạy xong tạm dừng ở khung hình cuối
        if (video1Ref.current) {
          video1Ref.current.pause();
        }
        await sleep(600);

        // ==========================================
        // 3. LẦN 2: CHUỘT MỚI CHUYỂN SANG GEMINI NHẮN YÊU CẦU SỬA
        // NHẮN "Cho cao lên 3m và thêm 2 đợt"
        // TỰ ĐỘNG XUỐNG DÒNG & TĂNG CHIỀU CAO Ô NHẬP LIỆU
        // ==========================================
        await moveMouse('step4-gemini-input-box', 700, { x: 920, y: 505 });
        await clickMouse();
        setIsGeminiFocused(true); // Kích hoạt nháy |
        await sleep(250);

        // Gõ từng chữ "Cho cao lên 3m và thêm 2 đợt" (tự động xuống dòng và tăng chiều cao ô)
        const prompt2Target = language === "VN" ? "Cho cao lên 3m và thêm 2 đợt" : "Make it 3m high with 2 shelves";
        for (let i = 1; i <= prompt2Target.length; i++) {
          if (isCancelled) return;
          setGeminiPrompt(prompt2Target.slice(0, i));
          await sleep(120);
        }
        await sleep(650);

        // Di chuột sang nút Send của Gemini
        await moveMouse('step4-gemini-send-btn', 400, { x: 1040, y: 515 });
        await clickMouse();
        setIsGeminiFocused(false);

        setGeminiPrompt2Sent(true);
        setGeminiPrompt("");
        setGemini2Thinking(true);

        // Chuột giữ tự nhiên tại vị trí gửi
        await sleep(1500);

        // Gemini trả lời mã Ruby cập nhật (cao 3000, 6 đợt)
        setGemini2Thinking(false);
        setGemini2Responded(true);
        await sleep(700);

        // Di chuột sao chép khối mã mới
        await moveMouse('step4-gemini-copy-code-btn-2', 500, { x: 1030, y: 440 });
        await clickMouse();
        setCode2Copied(true);
        await sleep(500);

        // Di chuột sang ô nhập liệu OpenSkp
        await moveMouse('step4-openskp-input', 800, { x: 620, y: 505 });
        setIsOpenskpFocused(true); // Con trỏ nháy |
        await sleep(350);

        // Hiển thị popup Ctrl + V chữ đen nền trắng ngay dưới chuột CHẬM RÃI, RÕ RÀNG
        setShowCtrlVPopup(true);
        await sleep(850);

        // Tự động hiển thị mã Ruby mới trong ô nhập liệu
        setOpenskpInput("cabinet = OpenSkp::Cabinet.new(width: 900, height: 3000, depth: 400)");
        await sleep(750);

        // Ẩn popup Ctrl+V
        setShowCtrlVPopup(false);
        await sleep(300);

        // Di chuột sang nút Send OpenSkp
        await moveMouse('step4-openskp-send-btn', 400, { x: 740, y: 505 });
        await clickMouse();

        setIsOpenskpFocused(false);
        setOpenskp2Sent(true);
        setOpenskpInput("");

        // Nhấn Send plugin lần 2 mới play video 0915(2)
        setIsVideo2Active(true);
        if (video2Ref.current) {
          video2Ref.current.currentTime = 0;
          video2Ref.current.play().catch(() => {});
        }

        // ĐỢI ĐÚNG 1 GIÂY -> HIỆN BUBBLE "ĐÃ HOÀN THÀNH"
        await sleep(1000);
        setOpenskpCompleted2(true);

        // Play đến cuối là hết vòng loop (video 0915(2) dài 8.13s, đã chờ 1s -> chờ tiếp 7200ms)
        await sleep(7200);
        if (video2Ref.current) {
          video2Ref.current.pause();
        }
        // Không dừng 3s cuối vì trong video đã bao gồm thời gian xem rồi
      }
    };

    const initialTimer = setTimeout(() => {
      if (!isCancelled) runLoop();
    }, 1200);

    return () => {
      isCancelled = true;
      clearTimeout(initialTimer);
    };
  }, []);

  const isGeminiMultiLine = geminiPrompt.length > 15;

  return (
    <div 
      ref={containerRef}
      className="w-full relative select-none"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch min-h-[540px]">
        
        {/* ==================================================================== */}
        {/* KHUNG TRÁI: SKETCHUP PRO 2021 - 2026 VÀ UI PLUGIN OPENSKP             */}
        {/* ==================================================================== */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm ring-1 ring-slate-900/10 overflow-hidden flex flex-col font-sans h-[540px]">
          
          {/* SketchUp Title Bar: ĐỒNG BỘ CHUẨN XÁM SÁNG GIỐNG STEP 1 */}
          <div className="h-9 bg-[#dee1e6] border-b border-gray-300 px-3 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2">
              <img src="/sketchup-logo.svg" alt="SketchUp" className="w-4 h-4 object-contain shrink-0" />
              <span className="text-xs text-slate-700 font-normal truncate">
                Untitled - SketchUp Pro 2021 - 2026
              </span>
            </div>
            <WindowControls />
          </div>

          {/* SketchUp Menu Bar: Cố định h-8 gióng thẳng hàng 2 */}
          <div className="h-8 bg-[#f8f9fa] border-b border-gray-200 px-3 flex items-center gap-4 text-xs text-slate-700 font-normal select-none shrink-0">
            <span className="hover:text-black cursor-pointer">File</span>
            <span className="hover:text-black cursor-pointer">Edit</span>
            <span className="hover:text-black cursor-pointer">View</span>
            <span className="hover:text-black cursor-pointer">Camera</span>
            <span className="hover:text-black cursor-pointer">Draw</span>
            <span className="hover:text-black cursor-pointer">Tools</span>
            <span className="hover:text-black cursor-pointer">Window</span>
            <span className="font-semibold text-[#0063A3] cursor-pointer">Extensions</span>
            <span className="hover:text-black cursor-pointer">Help</span>
          </div>

          {/* Toolbar Strip */}
          <div className="h-9 bg-white border-b border-gray-200 px-2 flex items-center gap-0.5 shrink-0 select-none overflow-x-auto">
            <div className="flex flex-col gap-[3px] pr-1 py-1 cursor-move select-none shrink-0">
              <div className="flex gap-[2px]"><div className="w-[2px] h-[2px] bg-slate-400 rounded-full" /><div className="w-[2px] h-[2px] bg-slate-400 rounded-full" /></div>
              <div className="flex gap-[2px]"><div className="w-[2px] h-[2px] bg-slate-400 rounded-full" /><div className="w-[2px] h-[2px] bg-slate-400 rounded-full" /></div>
              <div className="flex gap-[2px]"><div className="w-[2px] h-[2px] bg-slate-400 rounded-full" /><div className="w-[2px] h-[2px] bg-slate-400 rounded-full" /></div>
            </div>
            <button className="w-7 h-7 flex items-center justify-center bg-[#cce8ff] border border-[#99d1ff] rounded-xs shrink-0 cursor-pointer" title="Select">
              <img src="/cursor_selectsubtract-150x150.jpg" alt="Select" className="w-5 h-5 object-contain" />
            </button>
            <div className="h-5 w-[1px] bg-slate-300 mx-0.5 shrink-0" />
            <button className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-xs shrink-0 cursor-pointer" title="Eraser">
              <img src="/Eraser-Tool.jpg" alt="Eraser" className="w-[22px] h-[22px] object-contain" />
            </button>
            <div className="h-7 flex items-center hover:bg-gray-100 rounded-xs px-0.5 shrink-0 cursor-pointer" title="Line">
              <img src="/tb_line.jpg" alt="Line" className="w-[22px] h-[22px] object-contain" />
              <span className="text-[7px] text-slate-700 ml-0.5 leading-none">▼</span>
            </div>
            <div className="h-7 flex items-center hover:bg-gray-100 rounded-xs px-0.5 shrink-0 cursor-pointer" title="Arc">
              <img src="/tb_arc.jpg" alt="Arc" className="w-[22px] h-[22px] object-contain" />
              <span className="text-[7px] text-slate-700 ml-0.5 leading-none">▼</span>
            </div>
            <div className="h-7 flex items-center hover:bg-gray-100 rounded-xs px-0.5 shrink-0 cursor-pointer" title="Rectangle">
              <img src="/tb_rectangle.jpg" alt="Rectangle" className="w-[22px] h-[22px] object-contain" />
              <span className="text-[7px] text-slate-700 ml-0.5 leading-none">▼</span>
            </div>
            <div className="h-5 w-[1px] bg-slate-300 mx-0.5 shrink-0" />
            <button className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-xs shrink-0 cursor-pointer" title="Push/Pull">
              <img src="/tb_pushpull.jpg" alt="Push/Pull" className="w-[22px] h-[22px] object-contain" />
            </button>
            <button className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-xs shrink-0 cursor-pointer" title="Offset">
              <img src="/tb_offset.jpg" alt="Offset" className="w-[22px] h-[22px] object-contain" />
            </button>
            <button className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-xs shrink-0 cursor-pointer" title="Move">
              <img src="/tb_move.jpg" alt="Move" className="w-[22px] h-[22px] object-contain" />
            </button>
            <button className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-xs shrink-0 cursor-pointer" title="Rotate">
              <img src="/tb_rotate.jpg" alt="Rotate" className="w-[22px] h-[22px] object-contain" />
            </button>
            <button className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-xs shrink-0 cursor-pointer" title="Scale">
              <img src="/tb_scale.jpg" alt="Scale" className="w-[22px] h-[22px] object-contain" />
            </button>
            <div className="h-5 w-[1px] bg-slate-300 mx-0.5 shrink-0" />
            <button className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-xs shrink-0 cursor-pointer" title="Paint Bucket">
              <img src="/Paint-Bucket.jpg" alt="Paint Bucket" className="w-[22px] h-[22px] object-contain" />
            </button>
          </div>

          {/* Vùng Viewport 3D và UI Plugin */}
          <div className="flex-1 flex relative overflow-hidden bg-white">
            
            {/* Viewport 3D chính */}
            <div className="flex-1 bg-slate-900 relative overflow-hidden flex items-center justify-center">
              {/* Video 1: 0915.mp4 (Video chờ & Dựng hình lần 1, tạm dừng ở khung hình cuối) */}
              <video 
                ref={video1Ref}
                src="/0915.mp4" 
                muted 
                playsInline 
                preload="auto"
                className={`absolute inset-0 h-full w-full object-cover z-10 ${
                  isVideo2Active ? 'invisible pointer-events-none' : 'visible'
                }`}
              />

              {/* Video 2: 0915(2).mp4 (Dựng hình lần 2 - Liền mạch tuyệt đối, không nháy) */}
              <video 
                ref={video2Ref}
                src="/0915(2).mp4" 
                muted 
                playsInline 
                preload="auto"
                className={`absolute inset-0 h-full w-full object-cover z-20 ${
                  isVideo2Active ? 'visible' : 'invisible pointer-events-none'
                }`}
              />
            </div>

            {/* UI Plugin OpenSkp - ĐỒNG BỘ 100% THEO CHUẨN BƯỚC 2 */}
            <div 
              className="w-[260px] sm:w-[280px] border-l border-slate-300 bg-[#fdfbf7] flex flex-col justify-between shadow-lg relative shrink-0"
              style={{
                backgroundImage: 'linear-gradient(rgba(0, 99, 163, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 99, 163, 0.06) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                isolation: 'isolate'
              }}
            >
              {/* Header Plugin chuẩn Bước 2: Hamburger + Robot Brand OpenSkp (Georgia) + EN */}
              <header className="relative flex items-center p-3 border-b border-slate-200/60 bg-white/80 backdrop-blur-md shrink-0 h-14">
                <div className="flex items-center gap-1 z-10">
                  <button 
                    type="button"
                    className="p-1.5 text-slate-500 hover:text-[#0063A3] transition-colors rounded-lg"
                    title="Menu"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>

                {/* Ở giữa: Logo Robot + Brand OpenSkp chuẩn Bước 2 */}
                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 text-[#0063A3] z-0">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d='M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-4 5h8c2.76 0 5 2.24 5 5v4c0 2.76-2.24 5-5 5H8c-2.76 0-5-2.24-5-5v-4c0-2.76 2.24-5 5-5zm1 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z'/>
                    <path d='M5 23 Q 12 18, 19 23 H 5 z'/>
                  </svg>
                  <span 
                    className="font-serif font-normal text-2xl tracking-tight mt-1"
                    style={{ fontFamily: "'Crimson Pro', Georgia, serif", color: PRIMARY_COLOR, fontWeight: 400 }}
                  >
                    OpenSkp
                  </span>
                </div>

                {/* Bên phải: Nút ngôn ngữ EN */}
                <div className="absolute right-[21px] top-0 bottom-0 w-6 flex items-center justify-center z-10">
                  <span className="text-xs font-semibold text-slate-500 hover:text-[#0063A3] select-none cursor-pointer">
                    EN
                  </span>
                </div>
              </header>

              {/* Chat Area Plugin: ĐỒNG BỘ 1 KIỂU BUBBLE HOÀN THÀNH */}
              <div ref={openskpChatRef} className="flex-1 p-3 overflow-y-auto scroll-smooth space-y-3 text-xs [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm border border-slate-200 text-xs font-normal text-slate-700 max-w-sm leading-relaxed">
                    {language === 'VN' ? 'Xin chào! Bạn cần vẽ gì hôm nay.' : 'Hello! What would you like to model today?'}
                  </div>
                </div>

                {/* Tin nhắn lệnh lần 1 */}
                {openskpSent && (
                  <div className="flex justify-end animate-bubble-in">
                    <div className="bg-[#0063A3] text-white rounded-2xl rounded-br-xs px-3.5 py-2 shadow-xs font-mono text-xs font-normal leading-relaxed max-w-[95%] break-all">
                      cabinet = OpenSkp::Cabinet.new(width: 900, height: 2000, depth: 400)
                    </div>
                  </div>
                )}

                {/* Phản hồi hoàn thành lần 1 sau đúng 1s */}
                {openskpCompleted1 && (
                  <div className="flex justify-start animate-bubble-in">
                    <div className="bg-white rounded-2xl rounded-bl-sm px-3 py-1.5 shadow-sm border border-slate-200 text-xs text-slate-700 leading-relaxed flex items-center gap-2">
                      <Check size={16} className="text-emerald-600 shrink-0" />
                      <span className="font-normal text-slate-700 text-xs">{language === "VN" ? "Đã hoàn thành" : "Completed"}</span>
                    </div>
                  </div>
                )}

                {/* Tin nhắn lệnh lần 2 (Cập nhật cao 3m) */}
                {openskp2Sent && (
                  <div className="flex justify-end animate-bubble-in">
                    <div className="bg-[#0063A3] text-white rounded-2xl rounded-br-xs px-3.5 py-2 shadow-xs font-mono text-xs font-normal leading-relaxed max-w-[95%] break-all">
                      cabinet = OpenSkp::Cabinet.new(width: 900, height: 3000, depth: 400)
                    </div>
                  </div>
                )}

                {/* Phản hồi hoàn thành lần 2 sau đúng 1s */}
                {openskpCompleted2 && (
                  <div className="flex justify-start animate-bubble-in">
                    <div className="bg-white rounded-2xl rounded-bl-sm px-3 py-1.5 shadow-sm border border-slate-200 text-xs text-slate-700 leading-relaxed flex items-center gap-2">
                      <Check size={16} className="text-emerald-600 shrink-0" />
                      <span className="font-normal text-slate-700 text-xs">{language === "VN" ? "Đã hoàn thành" : "Completed"}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Bar OpenSkp */}
              <div className="p-3 border-t border-slate-200/60 bg-white/90 shrink-0 relative">
                <div className="relative flex items-center w-full bg-white border border-gray-200 rounded-2xl shadow-sm px-2 py-1">
                  <span className="p-1 text-gray-400 shrink-0">
                    <ImageIcon size={16} />
                  </span>
                  <div
                    id="step4-openskp-input"
                    className="flex-1 flex items-center bg-transparent text-xs py-1 px-1 text-slate-800 font-sans min-h-[24px] cursor-text overflow-hidden"
                  >
                    {openskpInput ? (
                      <div className="flex items-center font-mono text-[11px] text-slate-800 truncate">
                        <span>{openskpInput}</span>
                        {isOpenskpFocused && (
                          <span className="inline-block w-[1.5px] h-3.5 bg-[#0063A3] ml-0.5 animate-pulse shrink-0" />
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-400 text-xs">
                        {isOpenskpFocused ? (
                          <span className="inline-block w-[1.5px] h-3.5 bg-[#0063A3] mr-1 animate-pulse" />
                        ) : (
                          <span className="font-sans text-xs text-slate-400">{language === "VN" ? "Nhập yêu cầu" : "Enter prompt"}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    id="step4-openskp-send-btn"
                    className="m-0.5 p-1.5 rounded-full text-white bg-[#0063A3] shadow-sm shrink-0 cursor-pointer hover:bg-blue-700 transition-colors"
                    title={language === "VN" ? "Gửi" : "Send"}
                  >
                    <Send size={12} />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* ==================================================================== */}
        {/* KHUNG PHẢI: TRÌNH DUYỆT GOOGLE CHROME - GEMINI                        */}
        {/* ==================================================================== */}
        <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm ring-1 ring-slate-900/10 overflow-hidden flex flex-col font-sans text-xs h-[540px]">
          
          {/* Chrome Tab Bar: Tab khác chỉ để icon theo yêu cầu */}
          <div className="h-9 bg-[#dee1e6] border-b border-gray-300 px-2 flex items-end justify-between shrink-0 select-none pt-1">
            <div className="flex items-end h-full">
              {/* Tab 1: Google Gemini (Active) */}
              <div className="h-[30px] bg-white rounded-t-lg px-2.5 flex items-center gap-1.5 shadow-xs border-t border-x border-gray-300/50">
                <GeminiColorfulLogo className="w-3.5 h-3.5 shrink-0" />
                <span className="font-sans text-xs text-slate-700 font-normal whitespace-nowrap">Google Gemini</span>
                <span className="text-[10px] text-slate-400 hover:text-slate-700 ml-1 cursor-pointer">✕</span>
              </div>

              {/* Tab 2: ChatGPT (Inactive - CHỈ ĐỂ BIỂU TƯỢNG) */}
              <div className="h-[30px] px-2 flex items-center justify-center text-slate-700 hover:bg-slate-200/50 rounded-t-lg cursor-pointer transition-colors" title="ChatGPT">
                <ChatGPTLogo className="w-3.5 h-3.5 shrink-0" />
              </div>

              {/* Dấu gạch dọc ngăn cách */}
              <div className="h-3.5 w-[1px] bg-slate-400/60 mx-0.5 self-center shrink-0" />

              {/* Tab 3: Claude (Inactive - CHỈ ĐỂ BIỂU TƯỢNG) */}
              <div className="h-[30px] px-2 flex items-center justify-center text-slate-700 hover:bg-slate-200/50 rounded-t-lg cursor-pointer transition-colors" title="Claude">
                <ClaudeLogo className="w-3.5 h-3.5 shrink-0" />
              </div>

              {/* Dấu gạch dọc ngăn cách sau Claude */}
              <div className="h-3.5 w-[1px] bg-slate-400/60 mx-0.5 self-center shrink-0" />
            </div>

            <div className="self-center pb-1">
              <WindowControls />
            </div>
          </div>

          {/* Chrome URL Bar: ĐỒNG BỘ GỌN GÀNG (Bỏ các icon bên phải cho đỡ rối) */}
          <div className="h-8 bg-white border-b border-gray-200 px-3 flex items-center gap-2.5 shrink-0">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"/></svg>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            </div>
            <div className="flex-1 bg-[#f1f3f4] rounded-full px-2.5 py-1 text-xs text-slate-700 font-normal flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-normal text-slate-700 text-xs">gemini.google.com/app</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <svg className="w-3.5 h-3.5 text-[#0063A3]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              </div>
            </div>
          </div>

          {/* Vùng giao diện ứng dụng Gemini chuẩn */}
          <div className="flex-1 flex overflow-hidden">
            <GeminiLeftRail width="w-10" />

            {/* Chat Canvas với gradient & khoảng cách đồng bộ đều 12px (gap-3) */}
            <div 
              className="flex-1 p-3 flex flex-col justify-between overflow-hidden relative gap-3"
              style={{ background: 'linear-gradient(180deg, #edf4fc 0%, #e2eef9 100%)' }}
            >
              <div ref={geminiChatRef} className="flex-1 overflow-y-auto scroll-smooth space-y-3 font-sans text-xs px-1 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                
                {/* 1. LỜI NHẮC VÀ KẾT QUẢ TIẾP NỐI TỪ BƯỚC 3 */}
                <div className="space-y-3 opacity-90 pb-3 border-b border-slate-200/60">
                  {/* Tin nhắn từ User Bước 3 */}
                  <div className="flex flex-col items-end gap-1">
                    <div className="bg-white border border-slate-200 rounded-lg p-1.5 flex flex-col items-center justify-center shadow-2xs w-20">
                      <DocTextIcon className="w-7 h-7 object-contain" />
                      <span className="text-[8.5px] font-medium text-slate-700 mt-0.5 truncate max-w-full text-center">
                        Skill Openskp.md
                      </span>
                    </div>
                    <div className="bg-white text-slate-700 px-3 py-1.5 rounded-2xl rounded-tr-xs text-xs font-normal shadow-xs border border-slate-200/80">
                      Đọc hiểu tài liệu này
                    </div>
                  </div>

                  {/* Phản hồi từ Gemini Bước 3 */}
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-2xs shrink-0 mt-0.5">
                      <GeminiColorfulLogo className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-white rounded-2xl rounded-tl-xs p-2 text-slate-700 leading-relaxed text-xs font-normal shadow-xs border border-slate-200/80 max-w-[90%]">
                      {language === 'VN' ? 'Tôi đã đọc hiểu tài liệu kỹ năng Skill OpenSkp và sẵn sàng dựng hình theo yêu cầu của bạn!' : 'I have fully loaded the OpenSkp modeling skills and Ruby SDK coordination methods. Ready to generate 3D geometry.'}
                    </div>
                  </div>
                </div>

                {/* 2. TIN NHẮN BƯỚC 4 (LẦN 1): GỬI ẢNH TỦ MẪU VỚI THUMBNAIL TO */}
                {cabinetSent && (
                  <div className="flex flex-col items-end gap-1.5 animate-bubble-in">
                    <div className="bg-white border border-slate-200 rounded-xl p-2 flex flex-col items-center justify-center shadow-xs w-28">
                      <img src="/cabinet-sample.jpg" alt={language === "VN" ? "Tủ mẫu" : "Cabinet sample"} width={96} height={112} className="w-24 h-28 object-contain rounded-lg shrink-0" loading="eager" />
                      <span className="text-[9.5px] font-medium text-slate-700 mt-1 truncate max-w-full text-center">
                        cabinet-sample.jpg
                      </span>
                    </div>
                    <div className="bg-white text-slate-800 px-3.5 py-2 rounded-2xl rounded-tr-xs text-xs font-normal shadow-xs border border-slate-200/80 leading-relaxed">
                      {language === 'VN' ? 'dựng cái tủ này' : 'build this cabinet'}
                    </div>
                  </div>
                )}

                {/* Gemini đang suy nghĩ (Lần 1) */}
                {geminiThinking && (
                  <div className="flex items-start gap-2 animate-bubble-in">
                    <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-2xs shrink-0 mt-0.5">
                      <GeminiColorfulLogo className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-white px-3 py-2 rounded-2xl shadow-xs border border-slate-200 text-xs font-normal text-slate-500 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0063A3] animate-pulse" />
                      <span className="text-xs font-normal text-slate-500">{language === "VN" ? "Đang phân tích cấu tạo và tạo mã Ruby..." : "Analyzing structure and generating Ruby code..."}</span>
                    </div>
                  </div>
                )}

                {/* Gemini trả lời mã Ruby lần 1: text và code chung trong 1 bubble */}
                {geminiResponded && (
                  <div className="flex items-start gap-2 animate-bubble-in">
                    <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-2xs shrink-0 mt-0.5">
                      <GeminiColorfulLogo className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-white rounded-2xl rounded-tl-xs p-3 text-slate-800 text-xs font-normal leading-relaxed shadow-xs border border-slate-200/80 flex-1 max-w-[95%]">
                      <div className="text-slate-700 text-xs font-normal leading-relaxed mb-2">
                        {language === "VN" ? "Dưới đây là mã Ruby dựng hoàn chỉnh chiếc tủ theo ảnh đính kèm:" : "Here is the Ruby code to construct the cabinet according to the attached image:"}
                      </div>

                      {/* Khối code Ruby 1 trong cùng bubble */}
                      <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-2.5 font-mono text-[11px] text-slate-800 relative">
                        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-200 text-[9.5px]">
                          <span className="font-bold text-slate-500 tracking-wider">RUBY (OPENSKP)</span>
                          <button 
                            id="step4-gemini-copy-code-btn"
                            className="p-1 rounded text-slate-500 hover:text-[#0063A3] hover:bg-white transition-colors cursor-pointer flex items-center justify-center"
                            title={language === "VN" ? "Sao chép" : "Copy"}
                          >
                            {codeCopied ? (
                              <Check size={14} className="text-emerald-600" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>
                        </div>
                        <code className="text-slate-800 block whitespace-pre-wrap leading-relaxed font-semibold">
                          cabinet = OpenSkp::Cabinet.new(width: 900, height: 2000, depth: 400)
                        </code>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. TIN NHẮN BƯỚC 4 (LẦN 2): "Cho cao lên 3m và thêm 2 đợt" */}
                {geminiPrompt2Sent && (
                  <div className="flex flex-col items-end gap-1.5 animate-bubble-in">
                    <div className="bg-white text-slate-800 px-3.5 py-2 rounded-2xl rounded-tr-xs text-xs font-normal shadow-xs border border-slate-200/80 leading-relaxed">
                      {language === 'VN' ? 'Cho cao lên 3m và thêm 2 đợt' : 'Make it 3m high with 2 shelves'}
                    </div>
                  </div>
                )}

                {/* Gemini đang suy nghĩ (Lần 2) */}
                {gemini2Thinking && (
                  <div className="flex items-start gap-2 animate-bubble-in">
                    <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-2xs shrink-0 mt-0.5">
                      <GeminiColorfulLogo className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-white px-3 py-2 rounded-2xl shadow-xs border border-slate-200 text-xs font-normal text-slate-500 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0063A3] animate-pulse" />
                      <span className="text-xs font-normal text-slate-500">{language === "VN" ? "Đang cập nhật chiều cao 3000mm và thêm 2 đợt ngăn..." : "Updating height to 3000mm and adding 2 shelves..."}</span>
                    </div>
                  </div>
                )}

                {/* Gemini trả lời mã Ruby lần 2: text và code chung trong 1 bubble */}
                {gemini2Responded && (
                  <div className="flex items-start gap-2 animate-bubble-in">
                    <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-2xs shrink-0 mt-0.5">
                      <GeminiColorfulLogo className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-white rounded-2xl rounded-tl-xs p-3 text-slate-800 text-xs font-normal leading-relaxed shadow-xs border border-slate-200/80 flex-1 max-w-[95%]">
                      <div className="text-slate-700 text-xs font-normal leading-relaxed mb-2">
                        {language === 'VN' ? 'Tôi đã cập nhật tủ cao lên 3000mm và thêm 2 đợt ngăn (tổng cộng 6 đợt):' : 'Updated cabinet height to 3000mm and added 2 shelves (6 compartments total):'}
                      </div>

                      {/* Khối code Ruby 2 trong cùng bubble */}
                      <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-2.5 font-mono text-[11px] text-slate-800 relative">
                        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-200 text-[9.5px] font-sans">
                          <span className="font-bold text-slate-500 tracking-wider">RUBY (OPENSKP)</span>
                          <button 
                            id="step4-gemini-copy-code-btn-2"
                            className="p-1 rounded text-slate-500 hover:text-[#0063A3] hover:bg-white transition-colors cursor-pointer flex items-center justify-center"
                            title={language === "VN" ? "Sao chép" : "Copy"}
                          >
                            {code2Copied ? (
                              <Check size={14} className="text-emerald-600" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>
                        </div>
                        <code className="text-slate-800 block whitespace-pre-wrap leading-relaxed font-semibold">
                          cabinet = OpenSkp::Cabinet.new(width: 900, height: 3000, depth: 400)
                        </code>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Ô Chat Gemini */}
              <div className="shrink-0 flex flex-col justify-end">
                {/* Thumbnail to rõ nét bên trên thanh chat trước khi gửi (Lần 1) */}
                {cabinetAttached && !cabinetSent && (
                  <div className="px-1 mb-2 flex items-center gap-2 animate-fade-in">
                    <div className="relative bg-white border border-slate-200 rounded-xl p-2 flex flex-col items-center justify-center shadow-xs w-28">
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-slate-700 text-white rounded-full text-[9px] flex items-center justify-center leading-none shadow-xs cursor-pointer">
                        ✕
                      </span>
                      <img src="/cabinet-sample.jpg" alt="Preview tủ" className="w-24 h-28 object-contain rounded-lg" />
                      <span className="text-[9.5px] font-medium text-slate-700 mt-1 truncate max-w-full text-center leading-tight">
                        cabinet-sample.jpg
                      </span>
                    </div>
                  </div>
                )}

                {/* Thanh nhập liệu Gemini: TỰ ĐỘNG XUỐNG DÒNG VÀ TĂNG CHIỀU CAO KHI DÀI */}
                <div 
                  className={`border border-slate-200/90 bg-white shadow-xs relative shrink-0 transition-all duration-200 ${
                    isGeminiMultiLine
                      ? 'min-h-[66px] rounded-2xl p-2.5 flex flex-col justify-between gap-1.5'
                      : 'h-11 rounded-full px-4 flex items-center justify-between'
                  }`}
                >
                  {isGeminiMultiLine ? (
                    <>
                      <div className="flex items-start gap-2 w-full">
                        <span 
                          id="step4-gemini-attach-btn" 
                          className="text-xl text-slate-500 font-light select-none leading-none cursor-pointer hover:text-slate-700 transition-colors pt-0.5 shrink-0"
                          title={language === "VN" ? "Thêm tệp" : "Add files"}
                        >
                          +
                        </span>
                        <div 
                          id="step4-gemini-input-box"
                          className="flex-1 text-xs text-slate-800 font-sans cursor-text whitespace-pre-wrap break-words leading-relaxed min-h-[34px]"
                        >
                          <span>{geminiPrompt}</span>
                          {isGeminiFocused && (
                            <span className="inline-block w-[1.5px] h-3.5 bg-[#0063A3] ml-0.5 animate-pulse align-middle" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2.5 self-end shrink-0">
                        <div className="flex items-center gap-0.5 text-xs text-slate-700 font-medium">
                          <span>Flash</span>
                          <svg className="w-3 h-3 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                        </div>
                        <button 
                          id="step4-gemini-send-btn"
                          className="w-7 h-7 rounded-full bg-[#0063A3] text-white flex items-center justify-center shadow-xs cursor-pointer hover:bg-blue-700 transition-colors shrink-0"
                          title={language === "VN" ? "Gửi" : "Send"}
                        >
                          <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" /></svg>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span 
                        id="step4-gemini-attach-btn" 
                        className="text-xl text-slate-500 font-light pr-2 select-none leading-none cursor-pointer hover:text-slate-700 transition-colors"
                        title={language === "VN" ? "Thêm tệp" : "Add files"}
                      >
                        +
                      </span>
                      <div 
                        id="step4-gemini-input-box"
                        className="flex-1 flex items-center bg-transparent text-xs text-slate-800 font-sans min-w-0 h-full cursor-text overflow-hidden"
                      >
                        {geminiPrompt ? (
                          <div className="flex items-center truncate">
                            <span>{geminiPrompt}</span>
                            {isGeminiFocused && (
                              <span className="inline-block w-[1.5px] h-3.5 bg-[#0063A3] ml-0.5 animate-pulse shrink-0" />
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center text-slate-400">
                            {isGeminiFocused && (
                              <span className="inline-block w-[1.5px] h-3.5 bg-[#0063A3] mr-0.5 animate-pulse shrink-0" />
                            )}
                            <span>{cabinetAttached ? "" : (language === "VN" ? "Hỏi Gemini" : "Ask Gemini")}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 shrink-0 select-none pl-2 h-full">
                        <div className="flex items-center gap-0.5 text-xs text-slate-700 font-medium">
                          <span>Flash</span>
                          <svg className="w-3 h-3 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                        </div>
                        <div className="w-7 h-7 flex items-center justify-center shrink-0">
                          {geminiPrompt ? (
                            <button 
                              id="step4-gemini-send-btn"
                              className="w-7 h-7 rounded-full bg-[#0063A3] text-white flex items-center justify-center shadow-xs cursor-pointer hover:bg-blue-700 transition-colors shrink-0"
                              title={language === "VN" ? "Gửi" : "Send"}
                            >
                              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" /></svg>
                            </button>
                          ) : (
                            <span className="w-7 h-7 flex items-center justify-center cursor-pointer text-slate-500 hover:text-slate-700 shrink-0">
                              <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Con trỏ chuột ảo */}
      <div 
        className="hidden lg:block absolute z-50 pointer-events-none select-none"
        style={{
          transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)`,
          transition: `transform ${cursorDuration}ms cubic-bezier(0.25, 1, 0.5, 1)`,
          left: 0,
          top: 0
        }}
      >
        <div className="relative">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform duration-100 ${isClicking ? 'scale-90 translate-y-0.5' : ''}`}
            style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.4))' }}
          >
            <path 
              d="M3 2L10.5 20.5L13.5 13L21 10L3 2Z" 
              fill="#0f172a" 
              stroke="#ffffff" 
              strokeWidth="1.8" 
              strokeLinejoin="round" 
              strokeLinecap="round" 
            />
          </svg>

          {/* Popup Ctrl + V: BỎ ICON, ĐỒNG BỘ FONT */}
          {showCtrlVPopup && (
            <div className="absolute top-6 left-1 bg-white text-slate-900 border border-slate-300 shadow-xl rounded-md py-1 px-2.5 z-50 animate-bubble-in flex items-center whitespace-nowrap select-none pointer-events-none">
              <span className="font-sans text-xs font-normal tracking-wide text-slate-900">Ctrl + V</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export const Step6FloorplanWorkflow = ({ PRIMARY_COLOR = "#0063A3", language = "VN" }) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const geminiChatRef = useRef(null);
  const openskpChatRef = useRef(null);

  // Vị trí và trạng thái chuột
  const [cursorPos, setCursorPos] = useState({ x: 180, y: 180 });
  const [cursorDuration, setCursorDuration] = useState(0);
  const [isClicking, setIsClicking] = useState(false);

  // Chế độ khung trái: 'folder' hoặc 'sketchup'
  const [leftMode, setLeftMode] = useState('folder');

  // Trạng thái chọn file trong Folder (Đồng bộ ô bao bằng nhau 100%)
  const [txtSelected, setTxtSelected] = useState(false);
  const [imgSelected, setImgSelected] = useState(false);

  // Hiệu ứng kéo thả 2 tệp từ folder sang Gemini
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);

  // Trạng thái hội thoại Gemini (Khung Trình duyệt bên phải)
  const [filesAttached, setFilesAttached] = useState(false);
  const [geminiPrompt, setGeminiPrompt] = useState("");
  const [isGeminiFocused, setIsGeminiFocused] = useState(false);
  const [promptSent, setPromptSent] = useState(false);
  const [geminiThinking, setGeminiThinking] = useState(false);
  const [geminiConverted, setGeminiConverted] = useState(false);

  // Tự động tăng chiều cao ô nhập liệu khi prompt dài
  const isGeminiMultiLine = geminiPrompt.length > 22;

  // Hiệu ứng kéo mặt bằng đen trắng từ Gemini sang ô chat OpenSkp
  const [isDraggingBwImage, setIsDraggingBwImage] = useState(false);

  // Trạng thái hội thoại OpenSkp trong SketchUp
  const [showThumbnail, setShowThumbnail] = useState(false); // Thumbnail trên input: tắt khi gửi
  const [isOpenskpFocused, setIsOpenskpFocused] = useState(false);
  const [dimensionInput, setDimensionInput] = useState("");
  const [showDimensionPopup, setShowDimensionPopup] = useState(false); // Popup chữ đen nền trắng dưới chuột
  const [openskpSent, setOpenskpSent] = useState(false);
  const [openskpCompleted, setOpenskpCompleted] = useState(false); // Phản hồi hoàn thành "Đã hoàn thành"
  const [isViewportPlaying, setIsViewportPlaying] = useState(false);


  const getCenterCoords = (elementId) => {
    if (!containerRef.current) return null;
    const targetEl = document.getElementById(elementId);
    if (!targetEl) return null;
    const containerRect = containerRef.current.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    return {
      x: targetRect.left - containerRect.left + targetRect.width / 2,
      y: targetRect.top - containerRect.top + targetRect.height / 2
    };
  };

  // Cuộn mượt mà không nháy giật khi có tin nhắn Gemini
  useEffect(() => {
    if (!geminiChatRef.current) return;
    if (!promptSent && !geminiThinking && !geminiConverted) {
      geminiChatRef.current.scrollTop = 0;
      return;
    }
    const scrollTimer = setTimeout(() => {
      if (geminiChatRef.current) {
        geminiChatRef.current.scrollTo({
          top: geminiChatRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 60);
    return () => clearTimeout(scrollTimer);
  }, [promptSent, geminiThinking, geminiConverted]);

  // Cuộn mượt mà cho OpenSkp
  useEffect(() => {
    if (!openskpChatRef.current) return;
    if (!openskpSent && !openskpCompleted) {
      openskpChatRef.current.scrollTop = 0;
      return;
    }
    const scrollTimer = setTimeout(() => {
      if (openskpChatRef.current) {
        openskpChatRef.current.scrollTo({
          top: openskpChatRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 60);
    return () => clearTimeout(scrollTimer);
  }, [openskpSent, openskpCompleted]);

  useEffect(() => {
    let isCancelled = false;

    const sleep = (ms) => new Promise(resolve => {
      if (isCancelled) return;
      setTimeout(() => {
        if (!isCancelled) resolve();
      }, ms);
    });

    const moveMouse = async (elId, duration = 800, fallback = { x: 180, y: 180 }) => {
      if (isCancelled) return false;
      const coords = getCenterCoords(elId) || fallback;
      setCursorDuration(duration);
      setCursorPos(coords);
      await sleep(duration + 50);
      return true;
    };

    const clickMouse = async () => {
      if (isCancelled) return;
      setIsClicking(true);
      await sleep(180);
      setIsClicking(false);
      await sleep(100);
    };

    let isFirstRun = true;
    const runLoop = async () => {
      while (!isCancelled) {
        // ==========================================
        // 0. RESET TOÀN BỘ TRẠNG THÁI CHO VÒNG LẶP MỚI
        // ==========================================
        setLeftMode('folder');
        setTxtSelected(false);
        setImgSelected(false);
        setIsDraggingFiles(false);
        setIsDraggingBwImage(false);
        setFilesAttached(false);
        setGeminiPrompt("");
        setIsGeminiFocused(false);
        setPromptSent(false);
        setGeminiThinking(false);
        setGeminiConverted(false);
        setShowThumbnail(false);
        setDimensionInput("");
        setIsOpenskpFocused(false);
        setShowDimensionPopup(false);
        setOpenskpSent(false);
        setOpenskpCompleted(false);
        setIsViewportPlaying(false);
        setIsClicking(false);

        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }

        if (isFirstRun) {
          // Lần đầu tiên: đặt chuột tại file Prompt txt trong Folder
          await moveMouse('step6-folder-prompt-item', 0, { x: 180, y: 180 });
          await sleep(650);
          isFirstRun = false;
        }

        // 1. Dừng tại file txt rồi chuột nhấp chọn file txt
        await clickMouse();
        setTxtSelected(true);
        await sleep(400);

        // Di chuyển chuột sang chọn tiếp file ảnh mặt bằng màu
        await moveMouse('step6-folder-color-image-item', 400, { x: 290, y: 180 });
        await clickMouse();
        setImgSelected(true);
        await sleep(350);

        // 2. KÍCH HOẠT KÉO CẢ 2 FILE SANG TRÌNH DUYỆT GEMINI
        setIsDraggingFiles(true);
        await moveMouse('step6-gemini-input-box', 1000, { x: 900, y: 505 });

        // Thả chuột tại ô chat Gemini -> Hiện thumbnail to rõ nét như Bước 4
        setIsDraggingFiles(false);
        setFilesAttached(true);
        setTxtSelected(false);
        setImgSelected(false);
        await sleep(450);

        // Kích hoạt con trỏ nháy | trong ô nhập liệu Gemini
        setIsGeminiFocused(true);
        await sleep(250);

        // 3. Gõ câu lệnh: "Chuyển mặt bằng về đen trắng theo prompt đính kèm"
        // Ô nhập liệu tự động tăng chiều cao hiển thị hết prompt khi dài
        const promptTarget = language === "VN" ? "Chuyển mặt bằng về đen trắng theo prompt đính kèm" : "Convert floor plan to black and white according to attached prompt";
        for (let i = 1; i <= promptTarget.length; i++) {
          if (isCancelled) return;
          setGeminiPrompt(promptTarget.slice(0, i));
          await sleep(55);
        }
        await sleep(500);

        // Di chuyển chuột đến nút Send của Gemini
        await moveMouse('step6-gemini-send-btn', 380, { x: 980, y: 505 });
        await clickMouse();
        setIsGeminiFocused(false);

        // Gemini gửi tin nhắn & bắt đầu xử lý
        setPromptSent(true);
        setGeminiPrompt("");
        setFilesAttached(false);
        setGeminiThinking(true);

        await sleep(1800);

        // 4. Gemini convert thành mặt bằng đen trắng
        setGeminiThinking(false);
        setGeminiConverted(true);
        await sleep(800);

        // 5. Khung folder thu lại, khung SketchUp mở ra
        setLeftMode('sketchup');
        await sleep(650);

        // 6. KÉO MẶT BẰNG ĐEN TRẮNG TỪ TRÌNH DUYỆT SANG Ô NHẬP LIỆU PLUGIN
        await moveMouse('step6-gemini-bw-image', 600, { x: 920, y: 320 });
        setIsClicking(true);
        setIsDraggingBwImage(true);
        await sleep(200);

        // Chuột kéo ảnh mặt bằng đen trắng sang ô nhập liệu OpenSkp
        await moveMouse('step6-openskp-input', 1050, { x: 645, y: 505 });
        setIsClicking(false);
        setIsDraggingBwImage(false);
        setShowThumbnail(true);
        setIsOpenskpFocused(true);
        await sleep(450);

        // 7. NHẬP TEXT 9000 VÀO Ô TEXT OPENSKP
        const dimTarget = "9000";
        for (let i = 1; i <= dimTarget.length; i++) {
          if (isCancelled) return;
          setDimensionInput(dimTarget.slice(0, i));
          await sleep(95);
        }
        await sleep(350);

        // 8. POPUP CHỮ ĐEN NỀN TRẮNG HIỂN THỊ DƯỚI CHUỘT CHẬM RÃI (2.5s) CHO NGƯỜI XEM DỄ QUAN SÁT
        setShowDimensionPopup(true);
        await sleep(2500);

        // 9. Di chuột tới nút Send trên OpenSkp
        await moveMouse('step6-openskp-send-btn', 380, { x: 745, y: 505 });
        await clickMouse();

        // KHI NHẤN GỬI THÌ PHẢI TẮT THUMBNAIL, POPUP VÀ TEXT INPUT
        setShowThumbnail(false);
        setShowDimensionPopup(false);
        setIsOpenskpFocused(false);
        setOpenskpSent(true);
        setDimensionInput("");

        // 10. Video động play (video 0915(5).mp4 dựng 3D từ 2D)
        setIsViewportPlaying(true);
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(() => {});
        }

        // Sau 1s: Hiện bubble "Đã hoàn thành" đồng bộ
        await sleep(1000);
        setOpenskpCompleted(true);

        // Chuột giữ nguyên tại nút send, KHÔNG di chuyển sang Viewport
        // Video chạy tiếp tục đến khi hoàn thành (thời lượng 26.2s)
        await sleep(25500);

        if (videoRef.current) {
          videoRef.current.pause();
        }
        await sleep(400);

        // ==============================================================
        // LOOP CHUỘT KHÉP KÍN:
        // 1. Khung folder hiện lên trọn vẹn trước
        // ==============================================================
        setLeftMode('folder');
        setIsViewportPlaying(false);
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
        }

        // Chờ khung folder hiện lên trọn vẹn và ổn định
        await sleep(900);

        // 2. Khung folder đã hiện trọn vẹn, chuột mới bắt đầu di chuyển đến 2 file
        await moveMouse('step6-folder-prompt-item', 900, { x: 180, y: 180 });
        await sleep(500);
      }
    };

    runLoop();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative select-none"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* ==================================================================== */}
        {/* KHUNG TRÁI: CHUYỂN ĐỔI GIỮA FOLDER DOWNLOADS WIN10 VÀ SKETCHUP PRO */}
        {/* ==================================================================== */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm ring-1 ring-slate-900/10 overflow-hidden flex flex-col font-sans text-xs h-[540px] relative">
          
          {/* TRƯỜNG HỢP 1: CỬA SỔ FOLDER DOWNLOADS (PHASE 1 & 2 - CÁC Ô BAO BẰNG NHAU 100%) */}
          <div 
            className={`absolute inset-0 flex flex-col transition-all duration-500 bg-white ${
              leftMode === 'folder' 
                ? 'opacity-100 scale-100 pointer-events-auto z-10' 
                : 'opacity-0 scale-95 pointer-events-none z-0'
            }`}
          >
            {/* Win 10 Title Bar: Cố định h-9 gióng thẳng hàng */}
            <div className="h-9 bg-white border-b border-gray-200 px-3 flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center gap-2">
                <Folder size={14} className="text-amber-500 fill-amber-500" />
                <span className="text-slate-700 font-normal text-xs">Downloads</span>
              </div>
              <WindowControls />
            </div>

            {/* Win 10 Menu Bar: Cố định h-8 gióng thẳng hàng */}
            <div className="h-8 bg-white border-b border-gray-200 px-3 flex items-center gap-4 text-xs text-slate-700 font-normal shrink-0 select-none">
              <span className="hover:bg-gray-100 px-1.5 py-0.5 rounded cursor-pointer">File</span>
              <span className="hover:bg-gray-100 px-1.5 py-0.5 rounded cursor-pointer">Home</span>
              <span className="hover:bg-gray-100 px-1.5 py-0.5 rounded cursor-pointer">Share</span>
              <span className="hover:bg-gray-100 px-1.5 py-0.5 rounded cursor-pointer">View</span>
            </div>

            {/* Win 10 Address Bar: Cố định h-9 gióng thẳng hàng */}
            <div className="h-9 bg-white border-b border-gray-200 px-2.5 flex items-center gap-2 shrink-0 select-none">
              {/* Cụm mũi tên điều hướng chuẩn Win 10 */}
              <div className="flex items-center gap-1 text-slate-700 shrink-0 pr-1">
                <span className="w-5 h-5 rounded flex items-center justify-center font-normal">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                </span>
                <span className="w-5 h-5 rounded flex items-center justify-center text-slate-300">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
                <span className="w-5 h-5 rounded flex items-center justify-center font-normal">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                  </svg>
                </span>
              </div>

              {/* Thanh địa chỉ */}
              <div className="flex-1 bg-white border border-gray-300 rounded px-2.5 h-6 text-xs text-slate-600 flex items-center gap-1 shadow-xs truncate">
                <span className="text-slate-700 font-normal text-xs truncate">This PC &gt; Downloads</span>
              </div>
            </div>

            {/* Vùng xem File: CÁC Ô BAO BẰNG NHAU HOÀN TOÀN (w-28 h-24) */}
            <div className="p-4 flex-1 bg-white flex flex-col justify-start relative">
              <div className="flex flex-wrap items-start gap-3 pt-2">
                
                {/* File 1: OpenSkp.rar */}
                <div className="w-28 h-24 p-1.5 rounded-lg border border-transparent flex flex-col items-center justify-start text-center">
                  <img src="/icon-rar-clean.png" alt="OpenSkp.rar" className="w-12 h-12 object-contain drop-shadow-xs shrink-0" />
                  <span className="font-normal text-slate-700 text-xs mt-1.5 line-clamp-2 max-w-full leading-tight">
                    OpenSkp.rar
                  </span>
                </div>

                {/* File 2: Prompt – Generate a floor plan image.txt (Ô bao bằng nhau) */}
                <div 
                  id="step6-folder-prompt-item"
                  className={`w-28 h-24 p-1.5 rounded-lg border flex flex-col items-center justify-start text-center transition-all ${
                    isDraggingFiles
                      ? 'border-[#0063A3] bg-[#0063A3]/10 opacity-50'
                      : txtSelected
                      ? 'border-[#0063A3] bg-[#0063A3]/10'
                      : 'border-transparent hover:border-slate-300'
                  }`}
                >
                  <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 drop-shadow-xs shrink-0">
                    <DocTextIcon className="w-7 h-7" />
                  </div>
                  <span className="font-normal text-slate-700 text-xs mt-1.5 line-clamp-2 max-w-full leading-tight">
                    Prompt...plan.txt
                  </span>
                </div>

                {/* File 3: Mat_bang_mau.png (Ô bao bằng nhau 100% với File 2) */}
                <div 
                  id="step6-folder-color-image-item"
                  className={`w-28 h-24 p-1.5 rounded-lg border flex flex-col items-center justify-start text-center transition-all ${
                    isDraggingFiles
                      ? 'border-[#0063A3] bg-[#0063A3]/10 opacity-50'
                      : imgSelected
                      ? 'border-[#0063A3] bg-[#0063A3]/10'
                      : 'border-transparent hover:border-slate-300'
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shadow-xs bg-slate-100 shrink-0">
                    <img src="/floorplan-color.png" alt={language === "VN" ? "Mặt bằng màu" : "Color floor plan"} className="w-full h-full object-cover" />
                  </div>
                  <span className="font-normal text-slate-700 text-xs mt-1.5 line-clamp-2 max-w-full leading-tight">
                    Mat_bang_mau.png
                  </span>
                </div>

              </div>
            </div>

          </div>

          {/* TRƯỜNG HỢP 2: CỬA SỔ SKETCHUP PRO (MỞ RA KHI THU FOLDER LẠI) */}
          <div 
            className={`absolute inset-0 flex flex-col transition-all duration-500 bg-white ${
              leftMode === 'sketchup' 
                ? 'opacity-100 scale-100 pointer-events-auto z-10' 
                : 'opacity-0 scale-95 pointer-events-none z-0'
            }`}
          >
            {/* Title Bar SketchUp ĐỒNG BỘ 100% VỚI BƯỚC 1 */}
            <div className="h-9 bg-[#dee1e6] border-b border-gray-300 px-3 flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center gap-2">
                <img src="/sketchup-logo.svg" alt="SketchUp" className="w-4 h-4 object-contain shrink-0" />
                <span className="text-xs text-slate-700 font-normal">
                  Untitled - SketchUp Pro 2021 - 2026
                </span>
              </div>
              <WindowControls />
            </div>

            {/* SketchUp Menu Bar: Cố định h-8 gióng thẳng hàng 2 */}
            <div className="h-8 bg-[#f8f9fa] border-b border-gray-200 px-3 flex items-center gap-4 text-xs text-slate-700 font-normal select-none shrink-0">
              <span className="hover:text-black cursor-pointer">File</span>
              <span className="hover:text-black cursor-pointer">Edit</span>
              <span className="hover:text-black cursor-pointer">View</span>
              <span className="hover:text-black cursor-pointer">Camera</span>
              <span className="hover:text-black cursor-pointer">Draw</span>
              <span className="hover:text-black cursor-pointer">Tools</span>
              <span className="hover:text-black cursor-pointer">Window</span>
              <span className="font-semibold text-[#0063A3] cursor-pointer">Extensions</span>
              <span className="hover:text-black cursor-pointer">Help</span>
            </div>

            {/* Toolbar Strip Chuẩn */}
            <div className="h-9 bg-white border-b border-gray-200 px-2 flex items-center gap-0.5 shrink-0 select-none overflow-x-auto">
              <div className="flex flex-col gap-[3px] pr-1 py-1 cursor-move select-none shrink-0">
                <div className="flex gap-[2px]"><div className="w-[2px] h-[2px] bg-slate-400 rounded-full" /><div className="w-[2px] h-[2px] bg-slate-400 rounded-full" /></div>
                <div className="flex gap-[2px]"><div className="w-[2px] h-[2px] bg-slate-400 rounded-full" /><div className="w-[2px] h-[2px] bg-slate-400 rounded-full" /></div>
                <div className="flex gap-[2px]"><div className="w-[2px] h-[2px] bg-slate-400 rounded-full" /><div className="w-[2px] h-[2px] bg-slate-400 rounded-full" /></div>
              </div>
              <button className="w-7 h-7 flex items-center justify-center bg-[#cce8ff] border border-[#99d1ff] rounded-xs shrink-0 cursor-pointer" title="Select">
                <img src="/cursor_selectsubtract-150x150.jpg" alt="Select" className="w-5 h-5 object-contain" />
              </button>
              <div className="h-5 w-[1px] bg-slate-300 mx-0.5 shrink-0" />
              <button className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-xs shrink-0 cursor-pointer" title="Eraser">
                <img src="/Eraser-Tool.jpg" alt="Eraser" className="w-[22px] h-[22px] object-contain" />
              </button>
              <div className="h-7 flex items-center hover:bg-gray-100 rounded-xs px-0.5 shrink-0 cursor-pointer" title="Line">
                <img src="/tb_line.jpg" alt="Line" className="w-[22px] h-[22px] object-contain" />
                <span className="text-[7px] text-slate-700 ml-0.5 leading-none">▼</span>
              </div>
              <div className="h-7 flex items-center hover:bg-gray-100 rounded-xs px-0.5 shrink-0 cursor-pointer" title="Arc">
                <img src="/tb_arc.jpg" alt="Arc" className="w-[22px] h-[22px] object-contain" />
                <span className="text-[7px] text-slate-700 ml-0.5 leading-none">▼</span>
              </div>
              <div className="h-7 flex items-center hover:bg-gray-100 rounded-xs px-0.5 shrink-0 cursor-pointer" title="Rectangle">
                <img src="/tb_rectangle.jpg" alt="Rectangle" className="w-[22px] h-[22px] object-contain" />
                <span className="text-[7px] text-slate-700 ml-0.5 leading-none">▼</span>
              </div>
              <div className="h-5 w-[1px] bg-slate-300 mx-0.5 shrink-0" />
              <button className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-xs shrink-0 cursor-pointer" title="Push/Pull">
                <img src="/tb_pushpull.jpg" alt="Push/Pull" className="w-[22px] h-[22px] object-contain" />
              </button>
              <button className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-xs shrink-0 cursor-pointer" title="Follow Me">
                <img src="/tb_followme.jpg" alt="Follow Me" className="w-[22px] h-[22px] object-contain" />
              </button>
              <button className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-xs shrink-0 cursor-pointer" title="Move">
                <img src="/tb_move.jpg" alt="Move" className="w-[22px] h-[22px] object-contain" />
              </button>
              <button className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-xs shrink-0 cursor-pointer" title="Rotate">
                <img src="/tb_rotate.jpg" alt="Rotate" className="w-[22px] h-[22px] object-contain" />
              </button>
              <button className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-xs shrink-0 cursor-pointer" title="Scale">
                <img src="/tb_scale.jpg" alt="Scale" className="w-[22px] h-[22px] object-contain" />
              </button>
              <div className="h-5 w-[1px] bg-slate-300 mx-0.5 shrink-0" />
              <button className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-xs shrink-0 cursor-pointer" title="Paint Bucket">
                <img src="/Paint-Bucket.jpg" alt="Paint Bucket" className="w-[22px] h-[22px] object-contain" />
              </button>
              <div className="h-5 w-[1px] bg-slate-300 mx-0.5 shrink-0" />
              <div className="flex items-center pl-1.5 shrink-0" title="OpenSkp Plugin">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#0063A3]" fill="currentColor">
                  <path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-4 5h8c2.76 0 5 2.24 5 5v4c0 2.76-2.24 5-5 5H8c-2.76 0-5-2.24-5-5v-4c0-2.76 2.24-5 5-5zm1 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                  <path d="M5 23 Q 12 18, 19 23 H 5 z"/>
                </svg>
              </div>
            </div>

            {/* Thân cửa sổ SketchUp: Viewport (Trái) & Mock UI Plugin (Phải) */}
            <div className="flex-1 flex overflow-hidden relative">
              <div className="flex-1 relative overflow-hidden bg-slate-900">
                {/* Video 0915(5).mp4: khung hình đầu tiên làm poster chờ, liền mạch không nháy */}
                <video 
                  ref={videoRef}
                  src="/0915(5).mp4" 
                  poster="/sketchup-floorplan-ready.jpg"
                  muted 
                  playsInline 
                  preload="auto"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div id="step6-viewport-rest-spot" className="absolute bottom-6 left-6 w-2 h-2 opacity-0 pointer-events-none" />
              </div>

              {/* Mock UI Plugin: ĐỒNG BỘ 100% HEADER & PHONG CÁCH BƯỚC 2 & 4 */}
              <div 
                className="w-[260px] sm:w-[280px] border-l border-slate-300 bg-[#fdfbf7] flex flex-col justify-between shadow-lg relative shrink-0"
                style={{
                  backgroundImage: 'linear-gradient(rgba(0, 99, 163, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 99, 163, 0.06) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                  isolation: 'isolate'
                }}
              >
                {/* Header Plugin chuẩn Bước 2 & Bước 4 */}
                <header className="relative flex items-center justify-between p-2.5 border-b border-slate-200/60 bg-white/80 backdrop-blur-md shrink-0 h-12">
                  <div className="flex items-center gap-1 z-10">
                    <button className="text-slate-500 hover:text-slate-800 transition-colors p-1 rounded-md hover:bg-slate-100">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  </div>

                  <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 text-[#0063A3] z-0">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                      <path d='M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-4 5h8c2.76 0 5 2.24 5 5v4c0 2.76-2.24 5-5 5H8c-2.76 0-5-2.24-5-5v-4c0-2.76 2.24-5 5-5zm1 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z'/>
                      <path d='M5 23 Q 12 18, 19 23 H 5 z'/>
                    </svg>
                    <span 
                      className="font-serif font-normal text-2xl tracking-tight mt-1"
                      style={{ fontFamily: "'Crimson Pro', Georgia, serif", color: PRIMARY_COLOR, fontWeight: 400 }}
                    >
                      OpenSkp
                    </span>
                  </div>

                  <div className="absolute right-[21px] top-0 bottom-0 w-6 flex items-center justify-center z-10">
                    <span className="text-xs font-semibold text-slate-500 hover:text-[#0063A3] select-none cursor-pointer">
                      EN
                    </span>
                  </div>
                </header>

                {/* Chat Area Plugin: THUMBNAIL TO RÕ NÉT TRONG KHUNG CHAT & ĐÃ HOÀN THÀNH */}
                <div ref={openskpChatRef} className="flex-1 p-3 overflow-y-auto scroll-smooth space-y-3 font-sans text-xs [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-slate-200 text-xs text-slate-700 max-w-sm leading-relaxed">
                      {language === 'VN' ? 'Xin chào! Bạn cần vẽ gì hôm nay.' : 'Hello! What would you like to model today?'}
                    </div>
                  </div>

                  {/* Bubble gửi: THUMBNAIL TO RÕ NÉT NẰM TRONG KHUNG CHAT */}
                  {openskpSent && (
                    <div className="flex justify-end animate-bubble-in">
                      <div className="bg-[#0063A3] text-white rounded-2xl rounded-br-xs p-2.5 shadow-sm max-w-[92%] space-y-2 flex flex-col items-end">
                        <img 
                          src="/floorplan-bw.jpg" 
                          alt={language === "VN" ? "Mặt bằng đen trắng" : "B&W floor plan"} 
                          className="w-48 h-32 object-cover rounded-xl border border-white/30 shadow-xs block bg-white" 
                        />
                        <div className="flex items-center pr-1">
                          <span className="font-sans text-xs font-medium text-white tracking-wide">9000</span>
                        </div>
                      </div>
                    </div>
                  )}



                  {/* Bubble phản hồi hoàn thành: CHỈ CẦN GHI "Đã hoàn thành" */}
                  {openskpCompleted && (
                    <div className="flex justify-start animate-bubble-in">
                      <div className="bg-white rounded-2xl rounded-bl-sm px-3 py-1.5 shadow-sm border border-slate-200 text-xs text-slate-700 leading-relaxed flex items-center gap-2">
                        <Check size={16} className="text-emerald-600 shrink-0" />
                        <span className="font-normal text-slate-700 text-xs">{language === "VN" ? "Đã hoàn thành" : "Completed"}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Plugin */}
                <div className="p-3 border-t border-slate-200/60 bg-white/90 shrink-0 relative">
                  
                  {/* THUMBNAIL ẢNH MẶT BẰNG ĐEN TRẮNG TO RÕ NÉT: TẮT ĐI KHI NHẤN GỬI */}
                  {showThumbnail && (
                    <div className="mb-2 px-1 flex items-center gap-2 animate-bubble-in">
                      <div className="relative bg-white border border-slate-200 rounded-xl p-1.5 flex items-center gap-2 shadow-xs">
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-slate-700 text-white rounded-full text-[8px] flex items-center justify-center leading-none shadow-xs cursor-pointer">
                          ✕
                        </span>
                        <img src="/floorplan-bw.jpg" alt="Preview B&W" className="w-16 h-12 object-cover rounded-lg border border-slate-200 shadow-2xs" />
                        <div className="flex flex-col pr-2">
                          <span className="text-[10px] text-slate-700 font-semibold leading-tight">Mat_bang_BW.jpg</span>
                          <span className="text-[9px] text-slate-400 font-mono">{language === "VN" ? "Mặt bằng đen trắng" : "B&W floor plan"}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="relative flex items-center w-full bg-white border border-gray-200 rounded-2xl shadow-sm px-2 py-1">
                    <span className="p-1 text-gray-400 shrink-0">
                      <ImageIcon size={16} />
                    </span>
                    <div
                      id="step6-openskp-input"
                      className="flex-1 flex items-center bg-transparent text-xs py-1 px-1 text-slate-800 font-sans min-h-[24px] cursor-text overflow-hidden"
                    >
                      {dimensionInput ? (
                        <div className="flex items-center font-mono text-[11px] text-slate-800 truncate">
                          <span>{dimensionInput}</span>
                          {isOpenskpFocused && (
                            <span className="inline-block w-[1.5px] h-3.5 bg-[#0063A3] ml-0.5 animate-pulse shrink-0" />
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-400 text-xs">
                          {isOpenskpFocused ? (
                            <span className="inline-block w-[1.5px] h-3.5 bg-[#0063A3] mr-1 animate-pulse" />
                          ) : (
                            <span className="font-sans text-xs text-slate-400">{language === "VN" ? "Nhập yêu cầu" : "Enter prompt"}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <button 
                      id="step6-openskp-send-btn"
                      className="m-0.5 p-1.5 rounded-full text-white bg-[#0063A3] shadow-sm shrink-0 cursor-pointer hover:bg-blue-700 transition-colors"
                      title={language === "VN" ? "Gửi" : "Send"}
                    >
                      <Send size={12} />
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* ==================================================================== */}
        {/* KHUNG PHẢI: TRÌNH DUYỆT GOOGLE GEMINI - ĐỒNG BỘ 100% VỚI BƯỚC 4 */}
        {/* ==================================================================== */}
        <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm ring-1 ring-slate-900/10 overflow-hidden flex flex-col font-sans text-xs h-[540px]">
          
          {/* Chrome Tab Bar: Đồng bộ Bước 4 */}
          <div className="h-9 bg-[#dee1e6] border-b border-gray-300 px-2 flex items-end justify-between shrink-0 select-none pt-1">
            <div className="flex items-end h-full">
              {/* Tab 1: Google Gemini (Active) */}
              <div className="h-[30px] bg-white rounded-t-lg px-2.5 flex items-center gap-1.5 shadow-xs border-t border-x border-gray-300/50">
                <GeminiColorfulLogo className="w-3.5 h-3.5 shrink-0" />
                <span className="font-sans text-xs text-slate-700 font-normal whitespace-nowrap">Google Gemini</span>
                <span className="text-[10px] text-slate-400 hover:text-slate-700 ml-1 cursor-pointer">✕</span>
              </div>

              {/* Tab 2: ChatGPT (Inactive - CHỈ ĐỂ BIỂU TƯỢNG) */}
              <div className="h-[30px] px-2 flex items-center justify-center text-slate-700 hover:bg-slate-200/50 rounded-t-lg cursor-pointer transition-colors" title="ChatGPT">
                <ChatGPTLogo className="w-3.5 h-3.5 shrink-0" />
              </div>

              {/* Dấu gạch dọc ngăn cách */}
              <div className="h-3.5 w-[1px] bg-slate-400/60 mx-0.5 self-center shrink-0" />

              {/* Tab 3: Claude (Inactive - CHỈ ĐỂ BIỂU TƯỢNG) */}
              <div className="h-[30px] px-2 flex items-center justify-center text-slate-700 hover:bg-slate-200/50 rounded-t-lg cursor-pointer transition-colors" title="Claude">
                <ClaudeLogo className="w-3.5 h-3.5 shrink-0" />
              </div>

              {/* Dấu gạch dọc ngăn cách sau Claude */}
              <div className="h-3.5 w-[1px] bg-slate-400/60 mx-0.5 self-center shrink-0" />
            </div>

            <div className="self-center pb-1">
              <WindowControls />
            </div>
          </div>

          {/* Chrome Omnibox: Đồng bộ gọn gàng Bước 4 */}
          <div className="h-8 bg-white border-b border-gray-200 px-3 flex items-center gap-2.5 shrink-0">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"/></svg>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            </div>
            <div className="flex-1 bg-[#f1f3f4] rounded-full px-2.5 py-1 text-xs text-slate-700 font-normal flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-normal text-slate-700 text-xs">gemini.google.com/app</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <svg className="w-3.5 h-3.5 text-[#0063A3]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              </div>
            </div>
          </div>

          {/* Vùng giao diện ứng dụng Gemini chuẩn với Left Rail */}
          <div className="flex-1 flex overflow-hidden">
            <GeminiLeftRail width="w-10" />

            {/* Chat Canvas với gradient & khoảng cách đồng bộ */}
            <div 
              className="flex-1 p-3 flex flex-col justify-between overflow-hidden relative gap-3"
              style={{ background: 'linear-gradient(180deg, #edf4fc 0%, #e2eef9 100%)' }}
            >
              <div ref={geminiChatRef} className="flex-1 overflow-y-auto scroll-smooth space-y-3 font-sans text-xs px-1 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                
                {/* Tin nhắn gửi kèm cả 2 file: Prompt.txt và Mat_bang_mau.png (THUMBNAIL TO RÕ NÉT) */}
                {promptSent && (
                  <div className="flex flex-col items-end gap-1.5 animate-bubble-in">
                    <div className="flex items-center gap-2">
                      <div className="bg-white border border-slate-200 rounded-lg p-1.5 flex flex-col items-center justify-center shadow-2xs w-20">
                        <DocTextIcon className="w-7 h-7 object-contain" />
                        <span className="text-[8.5px] font-medium text-slate-700 mt-0.5 truncate max-w-full text-center">
                          Prompt.txt
                        </span>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-xl p-1.5 shadow-2xs">
                        <img src="/floorplan-color.png" alt={language === "VN" ? "Mặt bằng màu" : "Color floor plan"} className="w-32 h-20 object-cover rounded-lg border border-slate-200" />
                      </div>
                    </div>
                    <div className="bg-white text-slate-700 px-3.5 py-2 rounded-2xl rounded-tr-xs text-xs font-normal shadow-xs border border-slate-200/80 max-w-[90%] leading-relaxed">
                      {language === 'VN' ? 'Chuyển mặt bằng về đen trắng theo prompt đính kèm' : 'Convert floor plan to black and white according to attached prompt'}
                    </div>
                  </div>
                )}

                {/* Gemini đang suy nghĩ */}
                {geminiThinking && (
                  <div className="flex items-start gap-2 animate-bubble-in">
                    <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-2xs shrink-0 mt-0.5">
                      <GeminiColorfulLogo className="w-4 h-4" />
                    </div>
                    <div className="bg-white px-3 py-2 rounded-2xl shadow-xs border border-slate-200 text-xs font-normal text-slate-500 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-xs font-normal text-slate-500">{language === "VN" ? "Gemini đang xử lý và convert sang đen trắng..." : "Gemini is processing and converting to black & white..."}</span>
                    </div>
                  </div>
                )}

                {/* Gemini convert thành mặt bằng đen trắng: KÉO TRỰC TIẾP SANG SKETCHUP */}
                {geminiConverted && (
                  <div className="flex items-start gap-2 max-w-full animate-bubble-in">
                    <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-2xs shrink-0 mt-0.5">
                      <GeminiColorfulLogo className="w-4 h-4" />
                    </div>
                    
                    <div className="bg-white rounded-2xl p-2.5 shadow-md border border-slate-200/80 w-full space-y-2">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                        <span className="text-xs font-medium text-slate-700">{language === "VN" ? "Mặt bằng đen trắng chuẩn CAD" : "CAD-standard B&W floor plan"}</span>
                        
                      </div>

                      {/* VÙNG ẢNH MẶT BẰNG ĐEN TRẮNG ĐƯỢC CHUỘT KÉO TRỰC TIẾP */}
                      <div 
                        id="step6-gemini-bw-image"
                        className={`rounded-xl overflow-hidden border border-slate-200 bg-white transition-opacity ${
                          isDraggingBwImage ? 'opacity-40 ring-2 ring-[#0063A3]' : 'opacity-100'
                        }`}
                      >
                        <img src="/floorplan-bw.jpg" alt={language === "VN" ? "Mặt bằng đen trắng" : "B&W floor plan"} className="w-full h-36 object-contain bg-white" />
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Vùng nhập liệu Gemini: THUMBNAIL TO NHƯ BƯỚC 4 & TỰ ĐỘNG TĂNG CHIỀU CAO */}
              <div className="shrink-0 flex flex-col justify-end">
                {/* Thumbnail to rõ nét bên trên thanh chat trước khi gửi (ĐỒNG BỘ BƯỚC 4) */}
                {filesAttached && !promptSent && (
                  <div className="px-1 mb-2 flex items-center gap-2.5 animate-bubble-in">
                    {/* File 1: Prompt.txt */}
                    <div className="relative bg-white border border-slate-200 rounded-xl p-1.5 flex flex-col items-center justify-center shadow-xs w-20">
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-slate-700 text-white rounded-full text-[8px] flex items-center justify-center leading-none shadow-xs cursor-pointer">
                        ✕
                      </span>
                      <div className="w-12 h-14 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-slate-600">
                        <DocTextIcon className="w-7 h-7" />
                      </div>
                      <span className="text-[9px] font-medium text-slate-700 mt-1 truncate max-w-full text-center leading-tight">
                        Prompt.txt
                      </span>
                    </div>

                    {/* File 2: Mat_bang_mau.png - THUMBNAIL TO NHƯ BƯỚC 4 */}
                    <div className="relative bg-white border border-slate-200 rounded-xl p-1.5 flex flex-col items-center justify-center shadow-xs w-24">
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-slate-700 text-white rounded-full text-[8px] flex items-center justify-center leading-none shadow-xs cursor-pointer">
                        ✕
                      </span>
                      <img src="/floorplan-color.png" alt={language === "VN" ? "Mặt bằng màu" : "Color floor plan"} className="w-20 h-14 object-cover rounded-lg border border-slate-200" />
                      <span className="text-[9px] font-medium text-slate-700 mt-1 truncate max-w-full text-center leading-tight">
                        Mat_bang_mau.png
                      </span>
                    </div>
                  </div>
                )}

                {/* Thanh nhập liệu Gemini: TỰ ĐỘNG XUỐNG DÒNG VÀ TĂNG CHIỀU CAO HIỂN THỊ HẾT PROMPT */}
                <div 
                  className={`border border-slate-200/90 bg-white shadow-xs relative shrink-0 transition-all duration-200 ${
                    isGeminiMultiLine
                      ? 'min-h-[66px] rounded-2xl p-2.5 flex flex-col justify-between gap-1.5'
                      : 'h-11 rounded-full px-4 flex items-center justify-between'
                  }`}
                >
                  {isGeminiMultiLine ? (
                    <>
                      <div className="flex items-start gap-2 w-full">
                        <span 
                          id="step6-gemini-attach-btn" 
                          className="text-xl text-slate-500 font-light select-none leading-none cursor-pointer hover:text-slate-700 transition-colors pt-0.5 shrink-0"
                          title={language === "VN" ? "Thêm tệp" : "Add files"}
                        >
                          +
                        </span>
                        <div 
                          id="step6-gemini-input-box"
                          className="flex-1 text-xs text-slate-800 font-sans cursor-text whitespace-pre-wrap break-words leading-relaxed min-h-[34px]"
                        >
                          <span>{geminiPrompt}</span>
                          {isGeminiFocused && (
                            <span className="inline-block w-[1.5px] h-3.5 bg-[#0063A3] ml-0.5 animate-pulse align-middle" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2.5 self-end shrink-0">
                        <div className="flex items-center gap-0.5 text-xs text-slate-700 font-medium">
                          <span>Flash</span>
                          <svg className="w-3 h-3 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                        </div>
                        <button 
                          id="step6-gemini-send-btn"
                          className="w-7 h-7 rounded-full bg-[#0063A3] text-white flex items-center justify-center shadow-xs cursor-pointer hover:bg-blue-700 transition-colors shrink-0"
                          title={language === "VN" ? "Gửi" : "Send"}
                        >
                          <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" /></svg>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span 
                        id="step6-gemini-attach-btn" 
                        className="text-xl text-slate-500 font-light pr-2 select-none leading-none cursor-pointer hover:text-slate-700 transition-colors"
                        title={language === "VN" ? "Thêm tệp" : "Add files"}
                      >
                        +
                      </span>
                      <div 
                        id="step6-gemini-input-box"
                        className="flex-1 flex items-center bg-transparent text-xs text-slate-800 font-sans min-w-0 h-full cursor-text overflow-hidden"
                      >
                        {geminiPrompt ? (
                          <div className="flex items-center truncate">
                            <span>{geminiPrompt}</span>
                            {isGeminiFocused && (
                              <span className="inline-block w-[1.5px] h-3.5 bg-[#0063A3] ml-0.5 animate-pulse shrink-0" />
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center text-slate-400">
                            {isGeminiFocused && (
                              <span className="inline-block w-[1.5px] h-3.5 bg-[#0063A3] mr-0.5 animate-pulse shrink-0" />
                            )}
                            <span>{filesAttached ? "" : (language === "VN" ? "Hỏi Gemini" : "Ask Gemini")}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 shrink-0 select-none pl-2 h-full">
                        <div className="flex items-center gap-0.5 text-xs text-slate-700 font-medium">
                          <span>Flash</span>
                          <svg className="w-3 h-3 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                        </div>
                        <div className="w-7 h-7 flex items-center justify-center shrink-0">
                          {geminiPrompt ? (
                            <button 
                              id="step6-gemini-send-btn"
                              className="w-7 h-7 rounded-full bg-[#0063A3] text-white flex items-center justify-center shadow-xs cursor-pointer hover:bg-blue-700 transition-colors shrink-0"
                              title={language === "VN" ? "Gửi" : "Send"}
                            >
                              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" /></svg>
                            </button>
                          ) : (
                            <span className="w-7 h-7 flex items-center justify-center cursor-pointer text-slate-500 hover:text-slate-700 shrink-0">
                              <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* ====================================================================== */}
      {/* CON TRỎ CHUỘT THỰC TẾ: ĐỒNG BỘ 100% VỚI BƯỚC 3 & BƯỚC 4 */}
      {/* ====================================================================== */}
      <div 
        className="hidden lg:block absolute z-50 pointer-events-none select-none"
        style={{
          transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)`,
          transition: `transform ${cursorDuration}ms cubic-bezier(0.25, 1, 0.5, 1)`,
          left: 0,
          top: 0
        }}
      >
        <div className="relative">
          {/* Mũi tên con trỏ chuột chuẩn OS giống Bước 3 & Bước 4 */}
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform duration-100 ${isClicking ? 'scale-90 translate-y-0.5' : ''}`}
            style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.4))' }}
          >
            <path 
              d="M3 2L10.5 20.5L13.5 13L21 10L3 2Z" 
              fill="#0f172a" 
              stroke="#ffffff" 
              strokeWidth="1.8" 
              strokeLinejoin="round" 
              strokeLinecap="round" 
            />
          </svg>

          {/* 1. HIỆU ỨNG KÉO 2 FILE TỪ FOLDER SANG GEMINI */}
          {isDraggingFiles && (
            <div className="absolute left-3 top-3 flex items-center gap-1.5 bg-white border border-slate-300 shadow-xl rounded px-2 py-1 text-[11px] font-medium text-slate-800 whitespace-nowrap animate-bubble-in select-none pointer-events-none">
              <DocTextIcon className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <span>Prompt.txt, Mat_bang.png</span>
            </div>
          )}

          {/* 2. HIỆU ỨNG KÉO MẶT BẰNG ĐEN TRẮNG TỪ GEMINI SANG OPENSKP */}
          {isDraggingBwImage && (
            <div className="absolute left-3 top-3 flex items-center gap-1.5 bg-white border border-slate-300 shadow-xl rounded px-2 py-1 text-[11px] font-medium text-slate-800 whitespace-nowrap animate-bubble-in select-none pointer-events-none">
              <ImageIcon size={13} className="text-[#0063A3] shrink-0" />
              <span>Mat_bang_BW.jpg</span>
            </div>
          )}

          {/* 3. POPUP CHỮ ĐEN NỀN TRẮNG GẮN TRỰC TIẾP DƯỚI MŨI CHUỘT (ĐỒNG BỘ 100% BƯỚC 4) */}
          {showDimensionPopup && (
            <div className="absolute top-6 left-1 bg-white text-slate-900 border border-slate-300 shadow-xl rounded-md py-1 px-2.5 z-50 animate-bubble-in flex items-center gap-1.5 whitespace-nowrap select-none pointer-events-none">
              <span className="font-sans text-xs font-normal text-slate-900">
                {language === "VN" ? "Chiều rộng tổng thể mặt bằng (9000)" : "Overall floor plan width (9000)"}
              </span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};


export const Step6ModelEditWorkflow = ({ PRIMARY_COLOR = "#0063A3", language = "VN" }) => {
  const containerRef = useRef(null);
  const video6Ref = useRef(null);
  const video7Ref = useRef(null);
  const [isVideo7Active, setIsVideo7Active] = useState(false);
  const geminiChatRef = useRef(null);
  const openskpChatRef = useRef(null);

  // Vị trí và trạng thái chuột (Xuất phát tại nút send của UI Plugin)
  const [cursorPos, setCursorPos] = useState({ x: 740, y: 505 });
  const [cursorDuration, setCursorDuration] = useState(0);
  const [isClicking, setIsClicking] = useState(false);

  // Bảng tùy chọn chuột phải SketchUp
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  // Popup thông báo sao chép thông tin đối tượng 3D
  const [showCopiedPopup, setShowCopiedPopup] = useState(false);

  // Hội thoại Gemini bên phải
  const [infoPasted, setInfoPasted] = useState(false);
  const [geminiPrompt, setGeminiPrompt] = useState("");
  const [isGeminiFocused, setIsGeminiFocused] = useState(false);
  const [promptSent, setPromptSent] = useState(false);
  const [geminiThinking, setGeminiThinking] = useState(false);
  const [geminiResponded, setGeminiResponded] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  // Tự động tăng chiều cao ô nhập liệu khi prompt dài
  const isGeminiMultiLine = geminiPrompt.length > 22;

  // Hội thoại OpenSkp trong SketchUp bên trái
  const [isOpenskpFocused, setIsOpenskpFocused] = useState(false);
  const [showCtrlVPopup, setShowCtrlVPopup] = useState(false);
  const [openskpInput, setOpenskpInput] = useState("");
  const [openskpSent, setOpenskpSent] = useState(false);
  const [openskpCompleted, setOpenskpCompleted] = useState(false);

  const getCenterCoords = (elementId) => {
    if (!containerRef.current) return null;
    const targetEl = document.getElementById(elementId);
    if (!targetEl) return null;
    const containerRect = containerRef.current.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    return {
      x: targetRect.left - containerRect.left + targetRect.width / 2,
      y: targetRect.top - containerRect.top + targetRect.height / 2
    };
  };

  // Cuộn mượt mà không nháy giật khi có tin nhắn Gemini
  useEffect(() => {
    if (!geminiChatRef.current) return;
    if (!promptSent && !geminiThinking && !geminiResponded) {
      geminiChatRef.current.scrollTop = 0;
      return;
    }
    const scrollTimer = setTimeout(() => {
      if (geminiChatRef.current) {
        geminiChatRef.current.scrollTo({
          top: geminiChatRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 60);
    return () => clearTimeout(scrollTimer);
  }, [promptSent, geminiThinking, geminiResponded]);

  // Cuộn mượt mà cho OpenSkp
  useEffect(() => {
    if (!openskpChatRef.current) return;
    if (!openskpSent && !openskpCompleted) {
      openskpChatRef.current.scrollTop = 0;
      return;
    }
    const scrollTimer = setTimeout(() => {
      if (openskpChatRef.current) {
        openskpChatRef.current.scrollTo({
          top: openskpChatRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 60);
    return () => clearTimeout(scrollTimer);
  }, [openskpSent, openskpCompleted]);

  useEffect(() => {
    let isCancelled = false;

    const sleep = (ms) => new Promise((resolve) => {
      if (isCancelled) return;
      setTimeout(() => {
        if (!isCancelled) resolve();
      }, ms);
    });

    const moveMouse = async (elId, duration = 800, fallback = { x: 190, y: 150 }) => {
      if (isCancelled) return false;
      const coords = getCenterCoords(elId) || fallback;
      setCursorDuration(duration);
      setCursorPos(coords);
      await sleep(duration + 50);
      return true;
    };

    const clickMouse = async () => {
      if (isCancelled) return;
      setIsClicking(true);
      await sleep(180);
      setIsClicking(false);
      await sleep(100);
    };

    const runLoop = async () => {
      while (!isCancelled) {
        // 0. Reset về trạng thái ban đầu của Bước 6
        setShowContextMenu(false);
        setSelectedMenuItem(null);
        setShowCopiedPopup(false);
        setInfoPasted(false);
        setGeminiPrompt("");
        setIsGeminiFocused(false);
        setPromptSent(false);
        setGeminiThinking(false);
        setGeminiResponded(false);
        setCodeCopied(false);
        setIsOpenskpFocused(false);
        setShowCtrlVPopup(false);
        setOpenskpInput("");
        setOpenskpSent(false);
        setOpenskpCompleted(false);
        setIsClicking(false);
        setIsVideo7Active(false);

        if (video6Ref.current) {
          video6Ref.current.pause();
          video6Ref.current.currentTime = 0;
        }
        if (video7Ref.current) {
          video7Ref.current.pause();
          video7Ref.current.currentTime = 0;
        }

        // Chuột xuất phát từ nút Send của UI Plugin
        await moveMouse('step6-edit-openskp-send-btn', 0, { x: 740, y: 505 });
        await sleep(400);

        // Di chuyển đến vị trí góc Viewport
        await moveMouse('step6-edit-target-spot', 950, { x: 190, y: 150 });

        // Đến vị trí góc thì play video 0915(6)
        if (video6Ref.current) {
          video6Ref.current.currentTime = 0;
          video6Ref.current.play().catch(() => {});
        }

        // Đợi video 0915(6) play được 0.8s thì chuột mới click và chọn info
        await sleep(800);

        // 1. Chuột click tại đối tượng trong Viewport
        await clickMouse();

        // 350ms sau: Bảng tùy chọn hiện ra ngay vị trí click
        await sleep(350);
        setShowContextMenu(true);
        await sleep(300);

        // Chuột di chuyển chậm rãi xuống mục "OpenSkp model info"
        await moveMouse('step6-context-openskp-info', 950, { x: 250, y: 310 });
        setSelectedMenuItem('openskp_info');
        await sleep(750);

        // Click chọn mục "OpenSkp model info"
        await clickMouse();
        await sleep(200);

        // Ẩn bảng tùy chọn
        setShowContextMenu(false);

        // Hiện popup chữ đen nền trắng gắn dưới chuột: "{language === "VN" ? "Đã sao chép thông tin đối tượng 3D" : "Copied 3D object metadata"}"
        setShowCopiedPopup(true);
        await sleep(1000);

        // Di chuyển chuột sang ô nhập liệu Gemini bên phải
        await moveMouse('step6-edit-gemini-input', 1150, { x: 920, y: 505 });
        await clickMouse();
        setShowCopiedPopup(false);
        setIsGeminiFocused(true);
        await sleep(350);

        // Hiển thị popup Ctrl + V chữ đen nền trắng ngay dưới chuột khi dán thông tin vào Gemini
        setShowCtrlVPopup(true);
        await sleep(850);

        // Tag thông tin đối tượng 3D xuất hiện sau Ctrl + V
        setInfoPasted(true);
        await sleep(650);
        setShowCtrlVPopup(false);
        await sleep(250);

        // Gõ lệnh: "thiết kế cho tôi dạng trần chéo dầm gỗ"
        const fullPrompt = language === "VN" ? "thiết kế cho tôi dạng trần chéo dầm gỗ" : "design a pitched timber beamed ceiling for me";
        for (let i = 1; i <= fullPrompt.length; i++) {
          if (isCancelled) return;
          setGeminiPrompt(fullPrompt.slice(0, i));
          await sleep(45);
        }
        await sleep(450);

        // Di chuột tới nút Send của Gemini
        await moveMouse('step6-edit-gemini-send-btn', 380, { x: 1040, y: 505 });
        await clickMouse();
        setIsGeminiFocused(false);
        setPromptSent(true);
        setInfoPasted(false);
        setGeminiPrompt("");
        setGeminiThinking(true);

        // Gemini suy nghĩ rồi nhả ra khối mã trần chéo dầm gỗ
        await sleep(1500);
        setGeminiThinking(false);
        setGeminiResponded(true);
        await sleep(600);

        // Di chuột lên nút Copy code trên khối mã
        await moveMouse('step6-edit-gemini-copy-code-btn', 500, { x: 1040, y: 390 });
        await clickMouse();
        setCodeCopied(true);
        await sleep(500);

        // Di chuột sang ô nhập liệu OpenSkp (SketchUp bên trái)
        await moveMouse('step6-edit-openskp-input', 850, { x: 620, y: 505 });
        setIsOpenskpFocused(true);
        await sleep(350);

        // Hiển thị popup Ctrl + V ngay dưới chuột dán mã Ruby vào ô nhập liệu
        setShowCtrlVPopup(true);
        await sleep(850);

        // Tự động điền mã Ruby vào ô nhập liệu
        setOpenskpInput('ceiling.build_sloped_timber_beams(pitch: 15, spacing: 600)');
        await sleep(750);
        setShowCtrlVPopup(false);

        // Di chuột quay lại nút Send của UI Plugin
        await moveMouse('step6-edit-openskp-send-btn', 420, { x: 740, y: 505 });
        await sleep(250);

        // KHI CHUỘT NHẤN NÚT SEND UIPLUGIN THÌ MỚI TIẾP TỤC PLAY 0915(7)
        await clickMouse();
        setIsOpenskpFocused(false);
        setOpenskpSent(true);
        setOpenskpInput("");

        // KÍCH HOẠT PHÁT VIDEO 7 NGAY KHI NHẤN NÚT SEND
        setIsVideo7Active(true);
        if (video7Ref.current) {
          video7Ref.current.currentTime = 0;
          video7Ref.current.play().catch(() => {});
        }

        // Sau 1s: Hiển thị phản hồi "Đã hoàn thành" với icon Check
        await sleep(1000);
        setOpenskpCompleted(true);

        // Video 7 chạy đến hết (~13.5s tổng thời lượng)
        await sleep(12500);
        if (video7Ref.current) {
          video7Ref.current.pause();
        }

        // Dừng 2.5 giây để người xem chiêm ngưỡng không gian trần chéo hoàn thiện
        await sleep(2500);
      }
    };

    runLoop();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative select-none"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* ==================================================================== */}
        {/* KHUNG TRÁI: CỬA SỔ SKETCHUP PRO & VIEWPORT 3D & PLUGIN OPENSKP */}
        {/* ==================================================================== */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm ring-1 ring-slate-900/10 overflow-hidden flex flex-col font-sans text-xs h-[540px]">
          
          {/* Title Bar SketchUp ĐỒNG BỘ 100% VỚI BƯỚC 1 */}
          <div className="h-9 bg-[#dee1e6] border-b border-gray-300 px-3 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2">
              <img src="/sketchup-logo.svg" alt="SketchUp" className="w-4 h-4 object-contain shrink-0" />
              <span className="text-xs text-slate-700 font-normal">
                Untitled - SketchUp Pro 2021 - 2026
              </span>
            </div>
            <WindowControls />
          </div>

          {/* SketchUp Menu Bar: Cố định h-8 gióng thẳng hàng 2 */}
          <div className="h-8 bg-[#f8f9fa] border-b border-gray-200 px-3 flex items-center gap-4 text-xs text-slate-700 font-normal select-none shrink-0">
            <span className="hover:text-black cursor-pointer">File</span>
            <span className="hover:text-black cursor-pointer">Edit</span>
            <span className="hover:text-black cursor-pointer">View</span>
            <span className="hover:text-black cursor-pointer">Camera</span>
            <span className="hover:text-black cursor-pointer">Draw</span>
            <span className="hover:text-black cursor-pointer">Tools</span>
            <span className="hover:text-black cursor-pointer">Window</span>
            <span className="font-semibold text-[#0063A3] cursor-pointer">Extensions</span>
            <span className="hover:text-black cursor-pointer">Help</span>
          </div>

          {/* Toolbar Strip Chuẩn Đồng Bộ */}
          <div className="h-9 bg-white border-b border-gray-200 px-2 flex items-center gap-0.5 shrink-0 select-none overflow-x-auto">
            <div className="flex flex-col gap-[3px] pr-1 py-1 cursor-move select-none shrink-0">
              <div className="flex gap-[2px]"><div className="w-[2px] h-[2px] bg-slate-400 rounded-full" /><div className="w-[2px] h-[2px] bg-slate-400 rounded-full" /></div>
              <div className="flex gap-[2px]"><div className="w-[2px] h-[2px] bg-slate-400 rounded-full" /><div className="w-[2px] h-[2px] bg-slate-400 rounded-full" /></div>
              <div className="flex gap-[2px]"><div className="w-[2px] h-[2px] bg-slate-400 rounded-full" /><div className="w-[2px] h-[2px] bg-slate-400 rounded-full" /></div>
            </div>
            <button className="w-7 h-7 flex items-center justify-center bg-[#cce8ff] border border-[#99d1ff] rounded-xs shrink-0 cursor-pointer" title="Select">
              <img src="/cursor_selectsubtract-150x150.jpg" alt="Select" className="w-5 h-5 object-contain" />
            </button>
            <div className="h-5 w-[1px] bg-slate-300 mx-0.5 shrink-0" />
            <button className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-xs shrink-0 cursor-pointer" title="Eraser">
              <img src="/Eraser-Tool.jpg" alt="Eraser" className="w-[22px] h-[22px] object-contain" />
            </button>
            <div className="h-7 flex items-center hover:bg-gray-100 rounded-xs px-0.5 shrink-0 cursor-pointer" title="Line">
              <img src="/tb_line.jpg" alt="Line" className="w-[22px] h-[22px] object-contain" />
              <span className="text-[7px] text-slate-700 ml-0.5 leading-none">▼</span>
            </div>
            <div className="h-7 flex items-center hover:bg-gray-100 rounded-xs px-0.5 shrink-0 cursor-pointer" title="Arc">
              <img src="/tb_arc.jpg" alt="Arc" className="w-[22px] h-[22px] object-contain" />
              <span className="text-[7px] text-slate-700 ml-0.5 leading-none">▼</span>
            </div>
            <div className="h-7 flex items-center hover:bg-gray-100 rounded-xs px-0.5 shrink-0 cursor-pointer" title="Rectangle">
              <img src="/tb_rectangle.jpg" alt="Rectangle" className="w-[22px] h-[22px] object-contain" />
              <span className="text-[7px] text-slate-700 ml-0.5 leading-none">▼</span>
            </div>
            <div className="h-5 w-[1px] bg-slate-300 mx-0.5 shrink-0" />
            <button className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-xs shrink-0 cursor-pointer" title="Push/Pull">
              <img src="/tb_pushpull.jpg" alt="Push/Pull" className="w-[22px] h-[22px] object-contain" />
            </button>
            <button className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-xs shrink-0 cursor-pointer" title="Follow Me">
              <img src="/tb_followme.jpg" alt="Follow Me" className="w-[22px] h-[22px] object-contain" />
            </button>
            <button className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-xs shrink-0 cursor-pointer" title="Move">
              <img src="/tb_move.jpg" alt="Move" className="w-[22px] h-[22px] object-contain" />
            </button>
            <button className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-xs shrink-0 cursor-pointer" title="Rotate">
              <img src="/tb_rotate.jpg" alt="Rotate" className="w-[22px] h-[22px] object-contain" />
            </button>
            <button className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-xs shrink-0 cursor-pointer" title="Scale">
              <img src="/tb_scale.jpg" alt="Scale" className="w-[22px] h-[22px] object-contain" />
            </button>
            <div className="h-5 w-[1px] bg-slate-300 mx-0.5 shrink-0" />
            <button className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-xs shrink-0 cursor-pointer" title="Paint Bucket">
              <img src="/Paint-Bucket.jpg" alt="Paint Bucket" className="w-[22px] h-[22px] object-contain" />
            </button>
            <div className="h-5 w-[1px] bg-slate-300 mx-0.5 shrink-0" />
            <div className="flex items-center pl-1.5 shrink-0" title="OpenSkp Plugin">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#0063A3]" fill="currentColor">
                <path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-4 5h8c2.76 0 5 2.24 5 5v4c0 2.76-2.24 5-5 5H8c-2.76 0-5-2.24-5-5v-4c0-2.76 2.24-5 5-5zm1 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                <path d="M5 23 Q 12 18, 19 23 H 5 z"/>
              </svg>
            </div>
          </div>

          {/* Vùng Viewport 3D và Mock Plugin UI bên phải */}
          <div className="flex-1 flex relative overflow-hidden bg-[#e8ecf1]">
            
            {/* Viewport 3D SketchUp */}
            <div className="flex-1 relative overflow-hidden bg-cover bg-center">
              {/* Điểm click trên Viewport (Góc trên gần trái) - Đã bỏ vòng tròn xanh */}
              <div 
                id="step6-edit-target-spot"
                className="absolute left-[90px] top-[75px] w-6 h-6 pointer-events-none z-30 opacity-0" 
              />

              {/* Video 6: Mở màn và tạm dừng ở frame cuối */}
              <video 
                ref={video6Ref}
                src="/0915(6).mp4" 
                poster="/preview-0915-6.jpg"
                muted 
                playsInline 
                preload="auto"
                className={`absolute inset-0 h-full w-full object-cover z-10 ${
                  isVideo7Active ? 'invisible pointer-events-none' : 'visible'
                }`}
              />

              {/* Video 7: Tiếp nối liền mạch khi chuột Ctrl + V dán code OpenSkp */}
              <video 
                ref={video7Ref}
                src="/0915(7).mp4" 
                muted 
                playsInline 
                preload="auto"
                className={`absolute inset-0 h-full w-full object-cover z-20 ${
                  isVideo7Active ? 'visible' : 'invisible pointer-events-none'
                }`}
              />
              <div id="step6-edit-viewport-rest" className="absolute bottom-6 left-6 w-2 h-2 opacity-0 pointer-events-none" />

              {/* BẢNG TÙY CHỌN CHUỘT PHẢI SKETCHUP */}
              {showContextMenu && (
                <div 
                  className="absolute left-24 top-20 bg-white border border-gray-300 shadow-2xl rounded py-1 min-w-[170px] text-[11px] font-sans select-none z-40 animate-fade-in text-slate-800"
                >
                  <div className="px-3.5 py-0.5 hover:bg-slate-100 cursor-pointer font-medium">Entity Info</div>
                  <div className="px-3.5 py-0.5 hover:bg-slate-100 cursor-pointer flex items-center justify-between">
                    <span>Erase</span>
                    <span className="text-slate-400 text-[9.5px]">Del</span>
                  </div>
                  <div className="px-3.5 py-0.5 hover:bg-slate-100 cursor-pointer">Hide</div>
                  <div className="px-3.5 py-0.5 hover:bg-slate-100 cursor-pointer">Lock</div>
                  
                  <div className="h-px bg-gray-200 my-1 mx-1" />
                  
                  <div className="px-3.5 py-0.5 hover:bg-slate-100 cursor-pointer">Edit Group</div>
                  <div className="px-3.5 py-0.5 hover:bg-slate-100 cursor-pointer">Explode</div>
                  <div className="px-3.5 py-0.5 hover:bg-slate-100 cursor-pointer">Make Component...</div>
                  
                  <div className="h-px bg-gray-200 my-1 mx-1" />
                  
                  <div className="px-3.5 py-0.5 hover:bg-slate-100 cursor-pointer">Add Snaps</div>
                  
                  {/* MỤC QUAN TRỌNG NHẤT THEO ẢNH: OpenSkp model info */}
                  <div 
                    id="step6-context-openskp-info"
                    className={`px-3.5 py-1 cursor-pointer flex items-center gap-1.5 transition-colors ${
                      selectedMenuItem === 'openskp_info' 
                        ? 'bg-[#0063A3] text-white font-semibold' 
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-4 5h8c2.76 0 5 2.24 5 5v4c0 2.76-2.24 5-5 5H8c-2.76 0-5-2.24-5-5v-4c0-2.76 2.24-5 5-5zm1 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                    </svg>
                    <span>OpenSkp model info</span>
                  </div>
                </div>
              )}
            </div>

            {/* Mock UI Plugin: ĐỒNG BỘ 100% HEADER & PHONG CÁCH BƯỚC 2, 4, 5 */}
            <div 
              className="w-[260px] sm:w-[280px] border-l border-slate-300 bg-[#fdfbf7] flex flex-col justify-between shadow-lg relative shrink-0"
              style={{
                backgroundImage: 'linear-gradient(rgba(0, 99, 163, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 99, 163, 0.06) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                isolation: 'isolate'
              }}
            >
              {/* Header Plugin chuẩn Bước 2 & Bước 4 */}
              <header className="relative flex items-center justify-between p-2.5 border-b border-slate-200/60 bg-white/80 backdrop-blur-md shrink-0 h-12">
                <div className="flex items-center gap-1 z-10">
                  <button className="text-slate-500 hover:text-slate-800 transition-colors p-1 rounded-md hover:bg-slate-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 text-[#0063A3] z-0">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d='M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-4 5h8c2.76 0 5 2.24 5 5v4c0 2.76-2.24 5-5 5H8c-2.76 0-5-2.24-5-5v-4c0-2.76 2.24-5 5-5zm1 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z'/>
                    <path d='M5 23 Q 12 18, 19 23 H 5 z'/>
                  </svg>
                  <span 
                    className="font-serif font-normal text-2xl tracking-tight mt-1"
                    style={{ fontFamily: "'Crimson Pro', Georgia, serif", color: PRIMARY_COLOR, fontWeight: 400 }}
                  >
                    OpenSkp
                  </span>
                </div>

                <div className="absolute right-[21px] top-0 bottom-0 w-6 flex items-center justify-center z-10">
                  <span className="text-xs font-semibold text-slate-500 hover:text-[#0063A3] select-none cursor-pointer">
                    EN
                  </span>
                </div>
              </header>

              {/* Chat Area Plugin */}
              <div ref={openskpChatRef} className="flex-1 p-3 overflow-y-auto scroll-smooth space-y-3 font-normal text-xs [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-slate-200 text-xs font-normal text-slate-700 max-w-sm leading-relaxed">
                    {language === "VN" ? "Xin chào! Bạn cần hiệu chỉnh gì hôm nay." : "Hello! What would you like to edit today?"}
                  </div>
                </div>

                {/* Tin nhắn lệnh Ruby dán từ Gemini */}
                {openskpSent && (
                  <div className="flex justify-end animate-bubble-in">
                    <div className="bg-[#0063A3] text-white rounded-2xl rounded-br-xs px-3.5 py-2 shadow-xs font-mono text-xs font-normal leading-relaxed max-w-[95%] break-all">
                      ceiling.build_sloped_timber_beams(pitch: 15, spacing: 600)
                    </div>
                  </div>
                )}

                {/* Phản hồi hoàn thành: ĐỒNG BỘ 1 KIỂU "Đã hoàn thành" */}
                {openskpCompleted && (
                  <div className="flex justify-start animate-bubble-in">
                    <div className="bg-white rounded-2xl rounded-bl-sm px-3 py-1.5 shadow-sm border border-slate-200 text-xs text-slate-700 leading-relaxed flex items-center gap-2">
                      <Check size={16} className="text-emerald-600 shrink-0" />
                      <span className="font-normal text-slate-700 text-xs">{language === "VN" ? "Đã hoàn thành" : "Completed"}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Bar OpenSkp: ĐỒNG BỘ CHUẨN VỚI BƯỚC 4 & 5 */}
              <div className="p-3 border-t border-slate-200/60 bg-white/90 shrink-0 relative">
                <div className="relative flex items-center w-full bg-white border border-gray-200 rounded-2xl shadow-sm px-2 py-1">
                  <span className="p-1 text-gray-400 shrink-0">
                    <ImageIcon size={16} />
                  </span>
                  <div
                    id="step6-edit-openskp-input"
                    className="flex-1 flex items-center bg-transparent text-xs py-1 px-1 text-slate-800 min-h-[24px] cursor-text overflow-hidden"
                  >
                    {openskpInput ? (
                      <div className="flex items-center font-mono text-[11px] text-slate-800 truncate">
                        <span>{openskpInput}</span>
                        {isOpenskpFocused && (
                          <span className="inline-block w-[1.5px] h-3.5 bg-[#0063A3] ml-0.5 animate-pulse shrink-0" />
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-400 text-xs">
                        {isOpenskpFocused ? (
                          <span className="inline-block w-[1.5px] h-3.5 bg-[#0063A3] mr-1 animate-pulse" />
                        ) : (
                          <span className="font-sans text-xs text-slate-400">{language === "VN" ? "Nhập yêu cầu" : "Enter prompt"}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <button 
                    id="step6-edit-openskp-send-btn"
                    className="m-0.5 p-1.5 rounded-full text-white bg-[#0063A3] shadow-sm shrink-0 cursor-pointer hover:bg-blue-700 transition-colors"
                    title={language === "VN" ? "Gửi" : "Send"}
                  >
                    <Send size={12} />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* ==================================================================== */}
        {/* KHUNG PHẢI: TRÌNH DUYỆT GOOGLE GEMINI - ĐỒNG BỘ 100% VỚI BƯỚC 4 */}
        {/* ==================================================================== */}
        <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm ring-1 ring-slate-900/10 overflow-hidden flex flex-col text-xs h-[540px]">
          
          {/* Chrome Tab Bar: Đồng bộ Bước 4 & 5 */}
          <div className="h-9 bg-[#dee1e6] border-b border-gray-300 px-2 flex items-end justify-between shrink-0 select-none pt-1">
            <div className="flex items-end h-full">
              {/* Tab 1: Google Gemini (Active) */}
              <div className="h-[30px] bg-white rounded-t-lg px-2.5 flex items-center gap-1.5 shadow-xs border-t border-x border-gray-300/50">
                <GeminiColorfulLogo className="w-3.5 h-3.5 shrink-0" />
                <span className="font-sans text-xs text-slate-700 font-normal whitespace-nowrap">Google Gemini</span>
                <span className="text-[10px] text-slate-400 hover:text-slate-700 ml-1 cursor-pointer">✕</span>
              </div>

              {/* Tab 2: ChatGPT (Inactive - CHỈ ĐỂ BIỂU TƯỢNG) */}
              <div className="h-[30px] px-2 flex items-center justify-center text-slate-700 hover:bg-slate-200/50 rounded-t-lg cursor-pointer transition-colors" title="ChatGPT">
                <ChatGPTLogo className="w-3.5 h-3.5 shrink-0" />
              </div>

              {/* Dấu gạch dọc ngăn cách */}
              <div className="h-3.5 w-[1px] bg-slate-400/60 mx-0.5 self-center shrink-0" />

              {/* Tab 3: Claude (Inactive - CHỈ ĐỂ BIỂU TƯỢNG) */}
              <div className="h-[30px] px-2 flex items-center justify-center text-slate-700 hover:bg-slate-200/50 rounded-t-lg cursor-pointer transition-colors" title="Claude">
                <ClaudeLogo className="w-3.5 h-3.5 shrink-0" />
              </div>

              {/* Dấu gạch dọc ngăn cách sau Claude */}
              <div className="h-3.5 w-[1px] bg-slate-400/60 mx-0.5 self-center shrink-0" />
            </div>

            <div className="self-center pb-1">
              <WindowControls />
            </div>
          </div>

          {/* Chrome Omnibox: Đồng bộ gọn gàng Bước 4 & 5 */}
          <div className="h-8 bg-white border-b border-gray-200 px-3 flex items-center gap-2.5 shrink-0">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"/></svg>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            </div>
            <div className="flex-1 bg-[#f1f3f4] rounded-full px-2.5 py-1 text-xs text-slate-700 font-normal flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-normal text-slate-700 text-xs">gemini.google.com/app</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <svg className="w-3.5 h-3.5 text-[#0063A3]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              </div>
            </div>
          </div>

          {/* Vùng giao diện ứng dụng Gemini chuẩn với Left Rail */}
          <div className="flex-1 flex overflow-hidden">
            <GeminiLeftRail width="w-10" />

            {/* Chat Canvas với gradient & khoảng cách đồng bộ */}
            <div 
              className="flex-1 p-3 flex flex-col justify-between overflow-hidden relative gap-3"
              style={{ background: 'linear-gradient(180deg, #edf4fc 0%, #e2eef9 100%)' }}
            >
              <div ref={geminiChatRef} className="flex-1 overflow-y-auto scroll-smooth space-y-3 text-xs px-1 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                
                {/* Lời chào */}
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-2xs shrink-0 mt-0.5">
                    <GeminiColorfulLogo className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-xs p-2.5 text-slate-700 leading-relaxed text-xs font-normal shadow-xs border border-slate-200/80 max-w-[90%]">
                    {language === "VN" ? "Tôi có thể giúp gì cho việc dựng hình và hiệu chỉnh 3D của bạn?" : "How can I help with your 3D modeling and editing today?"}
                  </div>
                </div>

                {/* Tin nhắn gửi thông tin 3D và Prompt: cùng loại, cùng font, nằm ở dòng trên chung khung */}
                {promptSent && (
                  <div className="flex justify-end animate-bubble-in">
                    <div className="bg-white text-slate-700 px-3.5 py-2 rounded-2xl rounded-tr-xs text-xs font-normal shadow-xs border border-slate-200/80 max-w-[90%] leading-relaxed">
                      <div className="text-slate-800 font-normal">
                        #&lt;OpenSkp::ModelInfo: CeilingSpace_3D [w: 8.5m, h: 3.2m]&gt;
                      </div>
                      <div className="text-slate-800 font-normal mt-1">
                        {language === 'VN' ? 'thiết kế cho tôi dạng trần chéo dầm gỗ' : 'design a pitched timber beamed ceiling for me'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Gemini đang suy nghĩ */}
                {geminiThinking && (
                  <div className="flex items-start gap-2 animate-bubble-in">
                    <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-2xs shrink-0 mt-0.5">
                      <GeminiColorfulLogo className="w-4 h-4" />
                    </div>
                    <div className="bg-white px-3 py-2 rounded-2xl shadow-xs border border-slate-200 text-xs font-normal text-slate-500 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-xs font-normal text-slate-500">{language === "VN" ? "Đang tạo cấu trúc trần dầm gỗ..." : "Generating timber beamed ceiling structure..."}</span>
                    </div>
                  </div>
                )}

                {/* Gemini trả lời: Khối mã Ruby và text chung trong 1 bubble */}
                {geminiResponded && (
                  <div className="flex items-start gap-2 max-w-full animate-bubble-in">
                    <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-2xs shrink-0 mt-0.5">
                      <GeminiColorfulLogo className="w-4 h-4" />
                    </div>
                    <div className="bg-white rounded-2xl rounded-tl-xs p-3 text-slate-700 text-xs font-normal leading-relaxed shadow-xs border border-slate-200/80 flex-1 max-w-[90%] min-w-0">
                      <div className="text-slate-700 text-xs font-normal leading-relaxed mb-2">
                        {language === "VN" ? "Đây là khối mã tham số trần chéo dầm gỗ tương thích cho OpenSkp:" : "Here is the parametric timber beamed ceiling code compatible with OpenSkp:"}
                      </div>

                      {/* Khối code Ruby trong cùng bubble - Fix tràn khung với min-w-0, break-all */}
                      <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-2.5 font-mono text-xs text-slate-800 relative overflow-hidden min-w-0">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5 pb-1 border-b border-slate-200">
                          <span className="font-semibold text-slate-600">RUBY CODE</span>
                          <button
                            id="step6-edit-gemini-copy-code-btn"
                            className="hover:text-slate-700 flex items-center gap-1 text-slate-500 cursor-pointer transition-colors px-1.5 py-0.5 rounded hover:bg-white shrink-0"
                            title={language === "VN" ? "Sao chép mã" : "Copy code"}
                          >
                            {codeCopied ? (
                              <Check size={13} className="text-emerald-600" />
                            ) : (
                              <Copy size={13} className="text-slate-500" />
                            )}
                          </button>
                        </div>
                        <code className="text-slate-800 block whitespace-pre-wrap break-all leading-relaxed font-semibold min-w-0">
                          ceiling.build_sloped_timber_beams(pitch: 15, spacing: 600)
                        </code>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Vùng nhập liệu Gemini: chung khung, text info ở dòng trên cùng font cùng loại */}
              <div className="shrink-0 flex flex-col justify-end">
                <div 
                  className={`border border-slate-200/90 bg-white shadow-xs relative shrink-0 transition-all duration-200 ${
                    infoPasted
                      ? 'min-h-[66px] rounded-2xl p-2.5 flex flex-col justify-between gap-1.5'
                      : 'h-11 rounded-full px-4 flex items-center justify-between'
                  }`}
                >
                  {infoPasted ? (
                    <>
                      <div className="flex items-start gap-2 w-full">
                        <span 
                          className="text-xl text-slate-500 font-light select-none leading-none cursor-pointer hover:text-slate-700 transition-colors pt-0.5 shrink-0"
                          title={language === "VN" ? "Thêm tệp" : "Add files"}
                        >
                          +
                        </span>
                        <div 
                          id="step6-edit-gemini-input"
                          className="flex-1 text-xs text-slate-800 font-sans cursor-text whitespace-pre-wrap break-words leading-relaxed min-h-[34px]"
                        >
                          <div className="text-slate-800 leading-tight">
                            #&lt;OpenSkp::ModelInfo: CeilingSpace_3D [w: 8.5m, h: 3.2m]&gt;
                          </div>
                          <div className="flex items-center text-slate-800 leading-tight mt-1">
                            <span>{geminiPrompt}</span>
                            {isGeminiFocused && (
                              <span className="inline-block w-[1.5px] h-3.5 bg-[#0063A3] ml-0.5 animate-pulse align-middle" />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2.5 self-end shrink-0">
                        <div className="flex items-center gap-0.5 text-xs text-slate-700 font-medium">
                          <span>Flash</span>
                          <svg className="w-3 h-3 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                        </div>
                        <button 
                          id="step6-edit-gemini-send-btn"
                          className="w-7 h-7 rounded-full bg-[#0063A3] text-white flex items-center justify-center shadow-xs cursor-pointer hover:bg-blue-700 transition-colors shrink-0"
                          title={language === "VN" ? "Gửi" : "Send"}
                        >
                          <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" /></svg>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span 
                        className="text-xl text-slate-500 font-light pr-2 select-none leading-none cursor-pointer hover:text-slate-700 transition-colors"
                        title={language === "VN" ? "Thêm tệp" : "Add files"}
                      >
                        +
                      </span>
                      <div 
                        id="step6-edit-gemini-input"
                        className="flex-1 flex items-center bg-transparent text-xs text-slate-800 font-sans min-w-0 h-full cursor-text overflow-hidden"
                      >
                        <div className="flex items-center text-slate-400">
                          {isGeminiFocused && (
                            <span className="inline-block w-[1.5px] h-3.5 bg-[#0063A3] mr-0.5 animate-pulse shrink-0" />
                          )}
                          <span>{language === "VN" ? "Hỏi Gemini" : "Ask Gemini"}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 select-none pl-2 h-full">
                        <div className="flex items-center gap-0.5 text-xs text-slate-700 font-medium">
                          <span>Flash</span>
                          <svg className="w-3 h-3 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                        </div>
                        <span className="w-7 h-7 flex items-center justify-center cursor-pointer text-slate-500 hover:text-slate-700 shrink-0">
                          <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* ====================================================================== */}
      {/* CON TRỎ CHUỘT VÀ CÁC POPUP HƯỚNG DẪN GẮN TRỰC TIẾP DƯỚI MŨI CHUỘT */}
      {/* ====================================================================== */}
      <div 
        className="hidden lg:block absolute z-50 pointer-events-none select-none"
        style={{
          transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)`,
          transition: `transform ${cursorDuration}ms cubic-bezier(0.25, 1, 0.5, 1)`,
          left: 0,
          top: 0
        }}
      >
        <div className="relative">
          {/* Mũi tên con trỏ chuột chuẩn OS giống Bước 3, 4, 5 */}
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform duration-100 ${isClicking ? 'scale-90 translate-y-0.5' : ''}`}
            style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.4))' }}
          >
            <path 
              d="M3 2L10.5 20.5L13.5 13L21 10L3 2Z" 
              fill="#0f172a" 
              stroke="#ffffff" 
              strokeWidth="1.8" 
              strokeLinejoin="round" 
              strokeLinecap="round" 
            />
          </svg>

          {/* 1. POPUP SAO CHÉP THÔNG TIN 3D: NỀN TRẮNG CHỮ ĐEN GẮN DƯỚI CHUỘT (BỎ DOT, NÉT MẢNH) */}
          {showCopiedPopup && (
            <div className="absolute top-6 left-1 bg-white text-slate-900 border border-slate-300 shadow-xl rounded-md py-1 px-2.5 z-50 animate-bubble-in flex items-center whitespace-nowrap select-none pointer-events-none">
              <span className="font-sans text-xs font-normal text-slate-900">
                {language === "VN" ? "Đã sao chép thông tin đối tượng 3D" : "Copied 3D object metadata"}
              </span>
            </div>
          )}

          {/* 2. POPUP CTRL + V: BỎ ICON, ĐỒNG BỘ FONT */}
          {showCtrlVPopup && (
            <div className="absolute top-6 left-1 bg-white text-slate-900 border border-slate-300 shadow-xl rounded-md py-1 px-2.5 z-50 animate-bubble-in flex items-center whitespace-nowrap select-none pointer-events-none">
              <span className="font-sans text-xs font-normal tracking-wide text-slate-900">Ctrl + V</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};


export const Step2LicenseWorkflow = ({ 
  PRIMARY_COLOR = "#0063A3", 
  language = "VN", 
  profile = null,
  copyToClipboard = null,
  keyCopySuccess = false
}) => {
  const licenseContainerRef = useRef(null);

  // Vị trí và trạng thái chuột
  const [cursorPos, setCursorPos] = useState({ x: 260, y: 140 });
  const [cursorDuration, setCursorDuration] = useState(0);
  const [isClicking, setIsClicking] = useState(false);

  const [webCopied, setWebCopied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPasteMenu, setShowPasteMenu] = useState(false);
  const [showCtrlVPopup, setShowCtrlVPopup] = useState(false);
  const [pastedKey, setPastedKey] = useState("");
  const [isKeyActive, setIsKeyActive] = useState(false);
  const [isLicenseFocused, setIsLicenseFocused] = useState(false);
  const [bubbleShown, setBubbleShown] = useState(false);

  const getCenterCoords = (elementId) => {
    if (!licenseContainerRef.current) return null;
    const targetEl = document.getElementById(elementId);
    if (!targetEl) return null;
    const containerRect = licenseContainerRef.current.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    return {
      x: targetRect.left - containerRect.left + targetRect.width / 2,
      y: targetRect.top - containerRect.top + targetRect.height / 2
    };
  };

  useEffect(() => {
    let isCancelled = false;

    const sleep = (ms) => new Promise(resolve => {
      if (isCancelled) return;
      setTimeout(() => {
        if (!isCancelled) resolve();
      }, ms);
    });

    const moveMouse = async (elId, duration = 800, fallback = { x: 260, y: 140 }) => {
      if (isCancelled) return false;
      const coords = getCenterCoords(elId) || fallback;
      setCursorDuration(duration);
      setCursorPos(coords);
      await sleep(duration + 50);
      return true;
    };

    const clickMouse = async () => {
      if (isCancelled) return;
      setIsClicking(true);
      await sleep(180);
      setIsClicking(false);
      await sleep(100);
    };

    const runSimulationLoop = async () => {
      while (!isCancelled) {
        // Reset states
        setSidebarOpen(false);
        setShowPasteMenu(false);
        setPastedKey("");
        setIsKeyActive(false);
        setIsLicenseFocused(false);
        setBubbleShown(false);
        setWebCopied(false);
        setIsClicking(false);

        // 1. Dừng tại nút Copy License Key trên web openskp.io
        await moveMouse('sim-web-copy-btn', 0, { x: 340, y: 80 });
        await sleep(700);

        // Click copy
        await clickMouse();
        setWebCopied(true);
        await sleep(600);

        // 2. Di chuột sang nút Hamburger của Plugin OpenSkp
        await moveMouse('sim-plugin-hamburger-btn', 1000, { x: 620, y: 35 });
        await clickMouse();
        setSidebarOpen(true);
        await sleep(400);

        // 3. Di chuột đến ô nhập License Key
        await moveMouse('sim-plugin-license-input', 800, { x: 700, y: 310 });
        await clickMouse();
        setIsLicenseFocused(true);
        await sleep(350);

        // Hiển thị popup Ctrl + V chữ đen nền trắng ngay dưới chuột đồng bộ
        setShowCtrlVPopup(true);
        await sleep(850);

        setPastedKey("OPENSKPRKCQAUQ");
        setIsKeyActive(true);
        await sleep(650);
        setShowCtrlVPopup(false);
        await sleep(250);

        // 4. Di chuột tới nút đóng ✕ của Sidebar
        await moveMouse('sim-plugin-close-btn', 750, { x: 780, y: 65 });
        setIsLicenseFocused(false);
        await clickMouse();
        setSidebarOpen(false);
        setBubbleShown(true);

        // Giữ kết quả 4.5 giây cho người xem theo dõi
        await sleep(4500);

        // Di chuyển lại về nút copy trên web
        await moveMouse('sim-web-copy-btn', 1100, { x: 340, y: 80 });
        setBubbleShown(false);
        setPastedKey("");
        setWebCopied(false);
        setIsKeyActive(false);
        await sleep(800);
      }
    };

    // Đợi 200ms để DOM ổn định rồi chạy loop
    const initialTimer = setTimeout(() => {
      if (!isCancelled) runSimulationLoop();
    }, 200);

    return () => {
      isCancelled = true;
      clearTimeout(initialTimer);
    };
  }, [profile]);

  return (
    <div 
      ref={licenseContainerRef}
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative select-none"
    >
      {/* CỘT 1: Cửa sổ Web Portal (h-[540px] đồng bộ chuẩn openskp.io clone) */}
      <div className="lg:col-span-6 bg-white rounded-2xl shadow-sm ring-1 ring-slate-900/10 overflow-hidden flex flex-col font-sans text-xs h-[540px]">
        {/* Chrome Tab Bar */}
        <div className="h-9 bg-[#dee1e6] border-b border-gray-300 px-2 flex items-end justify-between shrink-0 select-none pt-1">
          <div className="flex items-end h-full">
            <div className="h-[30px] bg-white rounded-t-lg px-3 flex items-center gap-2 shadow-xs border-t border-x border-gray-300/50">
              <svg className="w-3.5 h-3.5 text-[#0063A3]" viewBox="0 0 24 24" fill="currentColor">
                <path d='M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-4 5h8c2.76 0 5 2.24 5 5v4c0 2.76-2.24 5-5 5H8c-2.76 0-5-2.24-5-5v-4c0-2.76 2.24-5 5-5zm1 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z'/>
                <path d='M5 23 Q 12 18, 19 23 H 5 z'/>
              </svg>
              <span className="font-sans text-xs text-slate-700 font-normal whitespace-nowrap">openskp.io</span>
              <span className="text-[10px] text-slate-400 hover:text-slate-700 ml-1 cursor-pointer">✕</span>
            </div>
            <span className="text-slate-500 hover:text-slate-800 px-2 py-1 text-xs cursor-pointer">+</span>
          </div>
          <div className="self-center pb-1">
            <WindowControls />
          </div>
        </div>

        {/* Chrome URL Bar (Đúng chuẩn yêu cầu: Không có icon ổ khóa) */}
        <div className="h-8 bg-white border-b border-gray-200 px-3 flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"/></svg>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          </div>
          <div className="flex-1 bg-[#f1f3f4] rounded-full px-3 py-1 text-xs text-slate-700 font-normal flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-normal text-slate-800">openskp.io</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <svg className="w-3.5 h-3.5 text-[#0063A3]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>
            <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-600 font-bold">A</div>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
          </div>
        </div>

        {/* Website Content (openskp.io clone chính xác theo ảnh) */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          
          {/* Header openskp.io */}
          <div className="h-12 bg-white/95 border-b border-gray-200/80 px-3 flex items-center justify-between shrink-0 select-none">
            {/* Logo bên trái (Bỏ Bảng giá, Hướng dẫn theo yêu cầu) */}
            <div className="flex items-center gap-1.5 shrink-0">
              <svg className="w-6 h-6 text-[#0063A3]" viewBox="0 0 24 24" fill="currentColor">
                <path d='M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-4 5h8c2.76 0 5 2.24 5 5v4c0 2.76-2.24 5-5 5H8c-2.76 0-5-2.24-5-5v-4c0-2.76 2.24-5 5-5zm1 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z'/>
                <path d='M5 23 Q 12 18, 19 23 H 5 z'/>
              </svg>
              <span 
                className="font-serif font-normal text-2xl tracking-tight text-[#0063A3]"
                style={{ fontFamily: "'Crimson Pro', Georgia, serif", fontWeight: 400 }}
              >
                OpenSkp
              </span>
            </div>

            {/* Cụm chức năng bên phải */}
            <div className="flex items-center gap-2">
              {/* Capsule Card */}
              <div className="flex items-center bg-white border border-slate-200/90 rounded-xl px-2.5 py-1 shadow-2xs gap-2.5">


                {/* 2. OPENSKP-LITE */}
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[7.5px] font-bold text-slate-400 uppercase tracking-tight">OPENSKP-LITE</span>
                  <span className="text-[9px] font-bold text-[#0063A3] uppercase mt-0.5 leading-none">{language === "VN" ? "ĐÃ KÍCH HOẠT" : "ACTIVATED"}</span>
                </div>

                <div className="w-px h-5 bg-slate-200 shrink-0" />

                {/* 3. LICENSE KEY & COPY BUTTON */}
                <div className="bg-slate-50 border border-slate-200/80 rounded px-1.5 py-0.5 flex items-center gap-1.5">
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[6.5px] font-bold text-slate-400 uppercase tracking-wider">LICENSE KEY</span>
                    <span className="text-[9.5px] font-mono font-bold text-slate-800 tracking-wider mt-0.5 leading-none">
                      OPENSKPRKCQAUQ
                    </span>
                  </div>
                  <button 
                    id="sim-web-copy-btn"
                    className="p-1 text-slate-400 hover:text-[#0063A3] transition-colors rounded cursor-pointer shrink-0"
                    title={language === "VN" ? "Sao chép License Key" : "Copy License Key"}
                  >
                    {webCopied ? (
                      <Check size={12} className="text-[#0063A3]" />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                </div>
              </div>

              {/* User Circle */}
              <div className="w-6 h-6 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 shrink-0">
                <User size={12} />
              </div>

              {/* Language VN */}
              <div className="h-6 px-1.5 rounded border border-slate-200 bg-white flex items-center gap-1 text-[9.5px] text-slate-600 font-medium shrink-0">
                <svg className="w-3 h-3 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <span>VN</span>
              </div>
            </div>
          </div>

          {/* Hero Body của openskp.io */}
          <div 
            className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none"
            style={{
              backgroundColor: '#fdfbf7',
              backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
              backgroundSize: '16px 16px'
            }}
          >
            {/* Ảnh Robot vẽ tranh ở giữa */}
            <div className="relative pointer-events-none select-none -mb-1">
              <img 
                src="/robot-drawing.png" 
                alt="Robot Architect" 
                className="w-40 sm:w-48 h-auto object-contain mx-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/su-top-toolbar.png";
                }}
              />
            </div>

            {/* Tiêu đề Serif màu xanh thương hiệu */}
            <h3 
              className="text-xl sm:text-2xl font-serif text-[#0063A3] text-center font-normal leading-tight mt-1"
              style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
            >
              {language === "VN" ? "Xin chào, Kiến trúc sư!" : "Hello, Architect!"}
            </h3>

            {/* Câu trích dẫn */}
            <p className="text-xs text-[#0063A3]/80 text-center font-serif italic mt-1 max-w-sm">
              {language === "VN" ? "\"Bạn là nhà thiết kế - hãy để AI dựng hình cho bạn.\"" : "\"You are the designer - let AI do the modeling for you.\""}
            </p>

            {/* Nút bấm OpenSkp-AI đơn sắc xanh */}
            <div className="mt-3">
              <button 
                type="button"
                className="px-4 py-1.5 rounded-lg text-white text-xs font-medium flex items-center gap-1.5 shadow-sm transition hover:opacity-90"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                <Download size={13} />
                <span>OpenSkp-AI</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* CỘT 2: Mock UI Plugin (h-[540px] đồng bộ chuẩn) */}
      <div className="lg:col-span-6 w-full h-[540px]">
        <MockPluginUI 
          showSidebar={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          licenseKey={pastedKey}
          isLicenseFocused={isLicenseFocused}
          language={language}
          isKeyActive={isKeyActive}
          bubbleShown={bubbleShown}
          showPasteMenu={showPasteMenu}
          PRIMARY_COLOR={PRIMARY_COLOR}
        />
      </div>

      {/* Con trỏ chuột */}
      <div 
        className="hidden lg:block absolute z-50 pointer-events-none select-none"
        style={{
          transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)`,
          transition: `transform ${cursorDuration}ms cubic-bezier(0.25, 1, 0.5, 1)`,
          left: 0,
          top: 0
        }}
      >
        <div className="relative">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform duration-100 ${isClicking ? 'scale-90 translate-y-0.5' : ''}`}
            style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.4))' }}
          >
            <path 
              d="M3 2L10.5 20.5L13.5 13L21 10L3 2Z" 
              fill="#0f172a" 
              stroke="#ffffff" 
              strokeWidth="1.8" 
              strokeLinejoin="round" 
              strokeLinecap="round" 
            />
          </svg>

          {/* POPUP CTRL + V: BỎ ICON, ĐỒNG BỘ FONT */}
          {showCtrlVPopup && (
            <div className="absolute top-6 left-1 bg-white text-slate-900 border border-slate-300 shadow-xl rounded-md py-1 px-2.5 z-50 animate-bubble-in flex items-center whitespace-nowrap select-none pointer-events-none">
              <span className="font-sans text-xs font-normal tracking-wide text-slate-900">Ctrl + V</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};






export const InteractiveGuideSection = ({ 
  PRIMARY_COLOR = "#0063A3",
  language = "VN",
  profile = null,
  onBackHome
}) => {
  const [activeStep, setActiveStep] = useState(1);

  const STEPS_NAV_ITEMS = [
    { id: 1, shortTitle: language === "VN" ? "Cài đặt" : "Installation", fullTitle: language === "VN" ? "Bước 1: Tải Về & Cài Đặt Plugin Vào SketchUp" : "Step 1: Download & Install Plugin into SketchUp" },
    { id: 2, shortTitle: language === "VN" ? "Kích hoạt License" : "Activate License", fullTitle: language === "VN" ? "Bước 2: Kích Hoạt Bản Quyền Thiết Bị" : "Step 2: Activate Device License" },
    { id: 3, shortTitle: language === "VN" ? "Nạp Kỹ năng AI" : "Feed AI Skills", fullTitle: language === "VN" ? 'Bước 3: Cung Cấp Kỹ Năng Dựng Hình "Skill" Cho AI' : 'Step 3: Feed Modeling "Skills" to AI' },
    { id: 4, shortTitle: language === "VN" ? "Dựng model" : "AI 3D Modeling", fullTitle: language === "VN" ? "Bước 4: Điều Phối Dựng Cấu Kiện & Nội Thất Bằng AI" : "Step 4: Build 3D Components & Furniture with AI" },
    { id: 5, shortTitle: language === "VN" ? "Dựng từ Mặt bằng 2D" : "From 2D Plans", fullTitle: language === "VN" ? "Bước 5: Dựng Không Gian 3D Từ Ảnh Mặt Bằng 2D" : "Step 5: Generate 3D Spaces from 2D Floor Plans" },
    { id: 6, shortTitle: language === "VN" ? "Hiệu chỉnh model" : "Edit 3D Models", fullTitle: language === "VN" ? "Bước 6: Hiệu Chỉnh Không Gian & Cấu Kiện Model Bằng AI" : "Step 6: Edit Spaces & 3D Model Components with AI" },
  ];

  const handleStepChange = (stepId, shouldScroll = false) => {
    setActiveStep(stepId);
    if (shouldScroll) {
      setTimeout(() => {
        document.getElementById('guide-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  return (
    <div id="guide-section" className="w-full max-w-7xl mx-auto px-10 sm:px-14 lg:px-16 py-4 space-y-6 animate-fade-in relative z-20">
      
      {/* THANH TABS CHỌN BƯỚC: BỐ CỤC TINH GỌN, KHÔNG TRÙNG LẶP SỐ */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1.5 overflow-x-auto select-none no-scrollbar">


        {STEPS_NAV_ITEMS.map((step) => {
          const isActive = activeStep === step.id;
          return (
            <button
              key={step.id}
              onClick={() => handleStepChange(step.id)}
              className={`flex-1 min-w-[125px] sm:min-w-[145px] py-2 px-2.5 rounded-xl text-[15px] font-normal flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#0063A3] text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span 
                className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 transition-colors ${
                  isActive 
                    ? 'bg-white text-[#0063A3]' 
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {step.id}
              </span>
              <span className="truncate">{step.shortTitle}</span>
            </button>
          );
        })}
      </div>

      {/* NỘI DUNG TỪNG TRANG: NÚT ĐIỀU HƯỚNG 2 BÊN CẠNH KHUNG BƯỚC */}
      <div className="w-full relative">
        {/* Nút lùi bước bên trái: Icon < lớn màu xanh chủ đạo nằm hẳn ra ngoài khung */}
        {activeStep > 1 && (
          <button
            onClick={() => handleStepChange(activeStep - 1, false)}
            className="absolute -left-10 sm:-left-12 lg:-left-16 top-1/2 -translate-y-1/2 z-30 p-2 text-[#0063A3] hover:opacity-80 active:opacity-60 hover:scale-125 active:scale-95 transition-all cursor-pointer select-none outline-none focus:outline-none focus:ring-0 active:outline-none focus-visible:outline-none [-webkit-tap-highlight-color:transparent]"
            title={language === "VN" ? "Bước trước" : "Previous Step"}
            aria-label={language === "VN" ? "Bước trước" : "Previous Step"}
          >
            <svg className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-md" fill="none" stroke="currentColor" strokeWidth="2.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Nút tiến bước bên phải: Icon > lớn màu xanh chủ đạo nằm hẳn ra ngoài khung */}
        {activeStep < 6 && (
          <button
            onClick={() => handleStepChange(activeStep + 1, false)}
            className="absolute -right-10 sm:-right-12 lg:-right-16 top-1/2 -translate-y-1/2 z-30 p-2 text-[#0063A3] hover:opacity-80 active:opacity-60 hover:scale-125 active:scale-95 transition-all cursor-pointer select-none outline-none focus:outline-none focus:ring-0 active:outline-none focus-visible:outline-none [-webkit-tap-highlight-color:transparent]"
            title={language === "VN" ? "Bước tiếp theo" : "Next Step"}
            aria-label={language === "VN" ? "Bước tiếp theo" : "Next Step"}
          >
            <svg className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-md" fill="none" stroke="currentColor" strokeWidth="2.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        {activeStep === 1 && (
          <div className="bg-white rounded-3xl shadow-lg ring-1 ring-slate-900/10 p-6 sm:p-8 flex flex-col justify-between animate-fade-in min-h-[740px]">
            <div>
              <div className="shrink-0 mb-3">
                <h2 
                  className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight text-slate-800"
                  style={{ color: PRIMARY_COLOR }}
                >
                  {language === 'VN' ? 'Bước 1: Tải Về & Cài Đặt Plugin Vào SketchUp' : 'Step 1: Download & Install Plugin into SketchUp'}
                </h2>
                <p className="text-slate-600 text-[15px] sm:text-[16px] leading-relaxed mt-2 max-w-4xl text-justify">
                  {language === 'VN' ? (
                    <>Tải gói cài đặt file <strong>Openskp.rar</strong> từ website, giải nén ra <strong>Openskp.rbz</strong>, sau đó mở SketchUp vào menu <strong>Extensions &gt; Extension Manager</strong> bấm <strong>Install Extension</strong> để kích hoạt thanh công cụ OpenSkp trên Viewport. Riêng phiên bản SketchUp 2021 sẽ cần phải khởi động lại.</>
                  ) : (
                    <>Download the <strong>Openskp.rar</strong> package from the website, extract it to <strong>Openskp.rbz</strong>, then open SketchUp, navigate to <strong>Extensions &gt; Extension Manager</strong>, and click <strong>Install Extension</strong> to activate the OpenSkp toolbar on your Viewport. Note that SketchUp 2021 requires a restart.</>
                  )}
                </p>
              </div>
              <div className="mt-4 h-[540px] shrink-0">
                <MockInstallWorkflow PRIMARY_COLOR={PRIMARY_COLOR} language={language} />
              </div>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="bg-white rounded-3xl shadow-lg ring-1 ring-slate-900/10 p-6 sm:p-8 flex flex-col justify-between animate-fade-in min-h-[740px]">
            <div>
              <div className="shrink-0 mb-3">
                <h2 
                  className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight text-slate-800"
                  style={{ color: PRIMARY_COLOR }}
                >
                  {language === 'VN' ? 'Bước 2: Kích Hoạt Bản Quyền Thiết Bị' : 'Step 2: Activate Device License'}
                </h2>
                <p className="text-slate-600 text-[15px] sm:text-[16px] leading-relaxed mt-2 max-w-4xl text-justify">
                  {language === 'VN' 
                    ? 'Đăng nhập bằng Gmail sau đó sao chép License Key từ tài khoản của bạn, mở thanh công cụ bên trong Plugin OpenSkp và dán mã để kích hoạt bản quyền thiết bị. 1 License key chỉ dùng được trên 1 máy, nếu muốn đổi máy sử dụng bạn click vào biểu tượng thông tin người dùng rồi nhấn "Hủy liên kết...". Plugin sẽ báo lỗi HWID nếu bạn đổi máy mà chưa hủy liên kết.'
                    : 'Log in with Gmail then copy the License Key from your account, open the toolbar inside the OpenSkp Plugin, and paste the code to activate your device license. 1 License key can only be used on 1 machine. To switch devices, click the user profile icon and select "Unlink device...". The plugin will show an HWID error if you switch devices without unlinking.'}
                </p>
              </div>
              <div className="mt-4 h-[540px] shrink-0">
                <Step2LicenseWorkflow PRIMARY_COLOR={PRIMARY_COLOR} profile={profile} language={language} />
              </div>
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="bg-white rounded-3xl shadow-lg ring-1 ring-slate-900/10 p-6 sm:p-8 flex flex-col justify-between animate-fade-in min-h-[740px]">
            <div>
              <div className="shrink-0 mb-3">
                <h2 
                  className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight text-slate-800"
                  style={{ color: PRIMARY_COLOR }}
                >
                  {language === 'VN' ? 'Bước 3: Cung Cấp Kỹ Năng Dựng Hình "Skill" Cho AI' : 'Step 3: Feed Modeling "Skills" to AI'}
                </h2>
                <p className="text-slate-600 text-[15px] sm:text-[16px] leading-relaxed mt-2 max-w-4xl text-justify">
                  {language === 'VN' ? (
                    <>Trong file nén <strong>OpenSkp.rar</strong> sẽ bao gồm file tài liệu <strong>Skill Openskp.md</strong>. Đây giống như cuốn sách giáo khoa giúp cho các AI học cách dựng hình SketchUp "cơ bản" (các kỹ năng "nâng cao" sẽ được update trong tương lai). Bạn không cần đọc hiểu tài liệu này, bạn chỉ cần kéo thả file này vào khung chat Gemini (hoặc bất kỳ AI nào khác) trên trình duyệt và gửi yêu cầu <em>"Đọc hiểu tài liệu này"</em> để trang bị toàn bộ kỹ năng vẽ 3D cho AI.</>
                  ) : (
                    <>The <strong>OpenSkp.rar</strong> archive includes the <strong>Skill Openskp.md</strong> document. It acts like a textbook teaching AI basic SketchUp modeling methods (advanced skills will be updated in the future). You do not need to read it yourself—simply drag and drop this file into Gemini (or any AI) in your browser and prompt <em>"Understand this document"</em> to equip the AI with full 3D modeling skills.</>
                  )}
                </p>
              </div>
              <div className="mt-4 h-[540px] shrink-0">
                <GeminiSkillWorkflow PRIMARY_COLOR={PRIMARY_COLOR} language={language} />
              </div>
            </div>
          </div>
        )}

        {activeStep === 4 && (
          <div className="bg-white rounded-3xl shadow-lg ring-1 ring-slate-900/10 p-6 sm:p-8 flex flex-col justify-between animate-fade-in min-h-[740px]">
            <div>
              <div className="shrink-0 mb-3">
                <h2 
                  className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight text-slate-800"
                  style={{ color: PRIMARY_COLOR }}
                >
                  {language === 'VN' ? 'Bước 4: Dựng Model Cấu Kiện & Nội Thất Bằng AI' : 'Step 4: Build 3D Components & Furniture with AI'}
                </h2>
                <p className="text-slate-600 text-[15px] sm:text-[16px] leading-relaxed mt-2 max-w-4xl text-justify">
                  {language === 'VN'
                    ? 'Nhập yêu cầu thiết kế hoặc gửi ảnh mẫu bất kỳ vào trình duyệt để AI xuất khối mã lệnh Ruby. Sau đó sao chép toàn bộ đoạn mã đó dán vào OpenSkp để hệ thống tự động dựng hình chuẩn xác từng chi tiết trực tiếp trên Viewport. Nếu muốn chỉnh sửa bạn chỉ việc tiếp tục cuộc hội thoại, miêu tả chi tiết yêu cầu và tiếp tục copy paste mã lệnh do AI tạo ra.'
                    : 'Enter design prompts or send any sample images in your browser for AI to generate Ruby code blocks. Then copy and paste the full code into OpenSkp to automatically construct precise 3D geometry directly on the Viewport. To modify, simply continue the chat, describe your refinements in detail, and keep copying and pasting the AI-generated code.'}
                </p>
              </div>
              <div className="mt-4 h-[540px] shrink-0">
                <Step4AiWorkflow PRIMARY_COLOR={PRIMARY_COLOR} language={language} />
              </div>
            </div>
          </div>
        )}

        {activeStep === 5 && (
          <div className="bg-white rounded-3xl shadow-lg ring-1 ring-slate-900/10 p-6 sm:p-8 flex flex-col justify-between animate-fade-in min-h-[740px]">
            <div>
              <div className="shrink-0 mb-3">
                <h2 
                  className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight text-slate-800"
                  style={{ color: PRIMARY_COLOR }}
                >
                  {language === 'VN' ? 'Bước 5: Dựng Không Gian 3D Từ Ảnh Mặt Bằng 2D' : 'Step 5: Generate 3D Spaces from 2D Floor Plans'}
                </h2>
                <p className="text-slate-600 text-[15px] sm:text-[16px] leading-relaxed mt-2 max-w-4xl text-justify">
                  {language === 'VN'
                    ? 'Copy text trong file "Prompt–Generate a floor plan image.txt" cùng ảnh mặt bằng vào Google Gemini để AI tự động tạo ảnh đen trắng, lọc bỏ nét rác và các mảng màu gây nhiễu. Sau đó tải ảnh mặt bằng vào OpenSkp và nhập chiều rộng ngang tổng thể mặt bằng (ví dụ: 9000) để hệ thống tự động tính toán tỷ lệ và dựng hình không gian 3D hoàn chỉnh trên SketchUp.'
                    : 'Copy the text from "Prompt–Generate a floor plan image.txt" along with your floor plan into Google Gemini so the AI generates a clean black-and-white image, removing noise and cluttered fills. Then upload the floor plan image into OpenSkp and enter the overall width (e.g. 9000) for the system to automatically compute scale and construct the complete 3D space in SketchUp.'}
                </p>
              </div>
              <div className="mt-4 h-[540px] shrink-0">
                <Step6FloorplanWorkflow PRIMARY_COLOR={PRIMARY_COLOR} language={language} />
              </div>
            </div>
          </div>
        )}

        {activeStep === 6 && (
          <div className="bg-white rounded-3xl shadow-lg ring-1 ring-slate-900/10 p-6 sm:p-8 flex flex-col justify-between animate-fade-in min-h-[740px]">
            <div>
              <div className="shrink-0 mb-3">
                <h2 
                  className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight text-slate-800"
                  style={{ color: PRIMARY_COLOR }}
                >
                  {language === 'VN' ? 'Bước 6: Hiệu Chỉnh Không Gian & Cấu Kiện Model Bằng AI' : 'Step 6: Edit Spaces & 3D Model Components with AI'}
                </h2>
                <p className="text-slate-600 text-[15px] sm:text-[16px] leading-relaxed mt-2 max-w-4xl text-justify">
                  {language === 'VN'
                    ? 'Truy cập vào group tổng chứa model, Nhấp chuột phải vào đối tượng bên trong để mở bảng tùy chọn và trích xuất thông tin đối tượng 3D ("OpenSkp model info"). Dán thông tin vào Gemini và ra lệnh ngôn ngữ tự nhiên để hiệu chỉnh theo yêu cầu mong muốn, sau đó tiếp tục copy paste mã code cập nhật trực tiếp lên mô hình 3D. (Lưu ý nên ra khỏi Group trước khi triển khai mã)'
                    : 'Enter the parent group containing the model, right-click the object inside to open the context menu and extract 3D object metadata ("OpenSkp model info"). Paste the information into Gemini and command in natural language to refine as desired, then continue to copy and paste the updated code directly onto the 3D model. (Note: It is recommended to exit the Group before executing the code)'}
                </p>
              </div>
              <div className="mt-4 h-[540px] shrink-0">
                <Step6ModelEditWorkflow PRIMARY_COLOR={PRIMARY_COLOR} language={language} />
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

