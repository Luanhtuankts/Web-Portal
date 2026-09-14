import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, CheckCircle2, Eye, Send, Image as ImageIcon,
  Copy, Check, Folder, Download, Search,
  Settings, User
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
    <span className="w-7 h-7 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors group" title="Close">
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
export const MockInstallWorkflow = ({ PRIMARY_COLOR = "#0063A3" }) => {
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
          
          {/* Win 10 Title Bar: Cụm nút vuông to bằng X */}
          <div className="h-9 bg-white border-b border-gray-200 px-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Folder size={14} className="text-amber-500 fill-amber-500" />
              <span className="text-slate-700 font-medium text-[11px]">Downloads</span>
            </div>
            <WindowControls />
          </div>

          {/* Win 10 Menu Bar: Bao 1 nền xanh đậm ở chữ File thôi */}
          <div className="bg-white border-b border-gray-200 px-2 flex items-center gap-3 text-[11px] font-medium shrink-0">
            <span className="bg-[#0063A3] text-white px-3 py-1 font-semibold">File</span>
            <span className="text-slate-700 px-1">Home</span>
            <span className="text-slate-700 px-1">Share</span>
            <span className="text-slate-700 px-1">View</span>
          </div>

          {/* Win 10 Address Bar: MŨI TÊN ĐIỀU HƯỚNG BÊN TRÁI RÕ NÉT CHUẨN WIN10 */}
          <div className="bg-white border-b border-gray-200 p-2 flex items-center gap-2 shrink-0">
            {/* Cụm mũi tên điều hướng chuẩn Win 10 */}
            <div className="flex items-center gap-1 text-slate-700 shrink-0 pr-1">
              <span className="w-6 h-6 rounded flex items-center justify-center font-bold">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </span>
              <span className="w-6 h-6 rounded flex items-center justify-center text-slate-300">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
              <span className="w-6 h-6 rounded flex items-center justify-center font-bold">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                </svg>
              </span>
            </div>

            {/* Thanh địa chỉ */}
            <div className="flex-1 bg-white border border-gray-300 rounded px-2.5 py-0.5 text-[10px] text-slate-600 flex items-center gap-1 shadow-xs truncate">
              <span className="text-slate-400">📁 This PC &gt;</span>
              <span className="font-semibold text-slate-800">Downloads</span>
            </div>
          </div>

          {/* Vùng xem File: Hộp bao vuông màu xanh dương chuẩn */}
          <div className="p-4 flex-1 bg-white flex flex-col justify-start relative">
            <div className="flex flex-wrap items-start gap-2.5 pt-2">
              
              {/* File 1: Openskp.rar */}
              <div 
                id="win-rar-item"
                className={`w-24 p-1.5 border flex flex-col items-center text-center transition-all ${
                  selectedFolderItem === 'rar' || showExtractMenu 
                    ? 'border-[#0063A3] bg-[#0063A3]/10' 
                    : 'border-transparent'
                }`}
              >
                <img 
                  src="/icon-rar-clean.png" 
                  alt="Openskp.rar" 
                  className="w-12 h-12 object-contain drop-shadow-xs" 
                />
                <span className="font-medium text-slate-800 text-[11px] mt-1.5 truncate max-w-full">
                  Openskp.rar
                </span>
              </div>

              {/* File 2: Openskp.rbz (Đặt gần rar chuẩn khoảng cách folder thật) */}
              {isExtracted && (
                <div 
                  id="win-rbz-item"
                  className={`w-24 p-1.5 border flex flex-col items-center text-center animate-fade-in transition-all ${
                    selectedFolderItem === 'rbz'
                      ? 'border-[#0063A3] bg-[#0063A3]/10' 
                      : 'border-transparent'
                  }`}
                >
                  <img 
                    src="/icon-rbz-real.png" 
                    alt="Openskp.rbz" 
                    className="w-12 h-12 object-contain drop-shadow-xs" 
                  />
                  <span className="font-medium text-slate-800 text-[11px] mt-1.5 truncate max-w-full">
                    Openskp.rbz
                  </span>
                </div>
              )}

            </div>

            {/* Menu ngữ cảnh khi click phải rar: Extract files... */}
            {showExtractMenu && (
              <div className="absolute left-20 top-24 bg-white border border-gray-300 shadow-xl rounded py-1 w-44 z-30 animate-fade-in text-[11px] font-sans">
                <div className="px-3 py-1 text-slate-400">Open</div>
                <div 
                  id="win-extract-action"
                  className="px-3 py-1.5 bg-[#0063A3] text-white font-semibold flex items-center justify-between"
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
          <div className="h-9 bg-[#dee1e6] border-b border-gray-300 px-3 flex items-center justify-between text-xs select-none shrink-0">
            <div className="flex items-center gap-2">
              <img src="/sketchup-logo.svg" alt="SketchUp" className="w-4 h-4 object-contain shrink-0" />
              <span className="font-sans text-[11px] text-slate-700 font-medium">
                Untitled - SketchUp Pro 2021
              </span>
            </div>
            <WindowControls />
          </div>

          {/* SketchUp Menu Bar */}
          <div className="bg-[#f8f9fa] border-b border-gray-200 px-3 py-1 flex items-center gap-4 text-xs text-slate-700 relative shrink-0">
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
              
              {/* Hệ trục 3D giao nhau tại (200, 210) và kéo dài chạm sát các mép viewport */}
              <svg 
                className="absolute inset-0 w-full h-full pointer-events-none" 
                viewBox="0 0 500 360" 
                preserveAspectRatio="none"
              >
                {/* Trục Xanh Dương (Z-axis đứng): Từ gốc (200, 210) lên thẳng đỉnh mép y=0 */}
                <line x1="200" y1="210" x2="200" y2="0" stroke="#0063A3" strokeWidth="1.5" />
                <line x1="200" y1="210" x2="200" y2="360" stroke="#0063A3" strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />
                
                {/* Trục Đỏ (X-axis): Từ gốc (200, 210) xéo xuống sát mép phải-dưới */}
                <line x1="200" y1="210" x2="500" y2="310" stroke="#dc2626" strokeWidth="1.5" />
                <line x1="200" y1="210" x2="0" y2="143" stroke="#dc2626" strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />
                
                {/* Trục Xanh Lá (Y-axis chiều sâu): Từ gốc (200, 210) xéo lên sát mép phải-trên */}
                <line x1="200" y1="210" x2="500" y2="35" stroke="#16a34a" strokeWidth="1.5" />
                <line x1="200" y1="210" x2="0" y2="327" stroke="#16a34a" strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />
              </svg>

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

                  <div className="p-3 space-y-2 flex-1 overflow-y-auto text-xs text-slate-600">
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span>Add Location</span>
                      <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-[9px]">Enabled</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span>Dynamic Components</span>
                      <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-[9px]">Enabled</span>
                    </div>
                  </div>

                  {/* Nút Install Extension */}
                  <div className="p-3 bg-slate-50 border-t border-gray-200 flex justify-end shrink-0">
                    <button 
                      id="su-btn-install-ext"
                      className="px-5 py-1.5 rounded bg-[#005a9e] text-white font-bold text-xs shadow flex items-center gap-1.5"
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
                    <div className="h-9 bg-white px-3 flex items-center justify-between border-b border-slate-200 shrink-0">
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
                        <div className="flex items-center gap-1 py-0.5 px-1 text-blue-700">
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
  isKeyActive = false, 
  bubbleShown = false,
  showPasteMenu = false,
  PRIMARY_COLOR = "#0063A3"
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
            className="font-serif font-normal text-xl tracking-tight mt-1"
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
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="font-bold text-xs text-gray-700">Cài đặt tài khoản</span>
              <span 
                id="sim-plugin-close-btn" 
                onClick={onToggleSidebar}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-0.5 rounded hover:bg-slate-100 text-xs font-bold"
                title="Đóng cài đặt"
              >✕</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Trạng thái License:</span>
                <span className="font-bold px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-500">
                  {licenseKey ? 'Đã lưu key' : 'Inactive'}
                </span>
              </div>
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

              <div className="absolute left-2 text-gray-400">
                <Settings size={13} />
              </div>
              <input 
                id="sim-plugin-license-input"
                type="password" 
                readOnly
                value={licenseKey} 
                placeholder="Nhập License Key..." 
                className="w-full bg-transparent pl-8 pr-7 py-1.5 text-xs text-gray-800 font-mono focus:outline-none placeholder-gray-400"
              />
              <div className="absolute right-2 text-gray-400">
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
              <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-slate-200 text-xs text-slate-700 max-w-sm leading-relaxed">
                Xin chào! Bạn cần vẽ gì hôm nay.
              </div>
            </div>

            {/* Bubble 2: Thông báo lưu key chuẩn theo plugin */}
            {bubbleShown && (
              <div className="w-full flex justify-start animate-fade-in">
                <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-slate-200 text-xs text-slate-800 max-w-sm leading-relaxed">
                  Mật mã truy cập đã được lưu.
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
                placeholder="nhập yêu cầu" 
                className="w-full bg-transparent text-xs py-2 px-1 focus:outline-none text-slate-800 placeholder-gray-400 font-sans"
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



export const ShowcaseSection = ({ PRIMARY_COLOR = "#0063A3", onOpenGuide }) => {
  const SHOWCASE_ITEMS = [
    {
      id: 'showcase-1',
      title: 'Dựng Không Gian 3D Từ Ảnh Mặt Bằng 2D',
      subtitle: 'Tự động hóa toàn diện không gian kiến trúc',
      description: 'Chỉ cần một bức ảnh mặt bằng 2D, OpenSkp sẽ tự động nhận diện bố cục các phòng, dựng toàn bộ hệ tường, sàn, trần và phân chia không gian 3D hoàn chỉnh ngay trên SketchUp chỉ trong vài giây.',
      videoUrl: '/210226.mp4',
      badge: 'Không gian 3D',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      id: 'showcase-2',
      title: 'Điều Phối Dựng Cấu Kiện & Đồ Nội Thất Với AI Ngoài',
      subtitle: 'Cầu nối điều phối thông minh trong SketchUp',
      description: 'OpenSkp đóng vai trò cầu nối điều phối trực tiếp trong SketchUp, liên kết linh hoạt với các mô hình AI bên ngoài để tính toán kích thước, dựng chi tiết tủ kệ, đồ nội thất và cấu kiện 3D hoàn chỉnh theo yêu cầu.',
      videoUrl: '/210226.2.mp4',
      badge: 'Điều phối AI',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
    }
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-16 animate-fade-in relative z-20">
      {SHOWCASE_ITEMS.map((item) => (
        <div 
          key={item.id} 
          className="bg-white rounded-3xl shadow-lg ring-1 ring-slate-900/10 p-6 sm:p-10 space-y-6 transition-all hover:shadow-xl"
        >
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 
                className="text-2xl sm:text-4xl font-serif font-normal leading-tight tracking-tight text-slate-800"
                style={{ fontFamily: "'Crimson Pro', Georgia, serif", color: PRIMARY_COLOR, fontWeight: 400 }}
              >
                {item.title}
              </h2>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${item.badgeColor}`}>
                {item.badge}
              </span>
            </div>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-2 max-w-4xl">
              {item.description}
            </p>
          </div>

          <div className="relative w-full rounded-2xl overflow-hidden shadow-md bg-slate-950 aspect-video ring-1 ring-slate-900/10">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              preload="auto"
              className="w-full h-full object-cover block border-0 m-0 p-0"
            >
              <source src={item.videoUrl} type="video/mp4" />
            </video>
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


// Icon tài liệu văn bản
const DocTextIcon = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);







export const GeminiSkillWorkflow = ({ PRIMARY_COLOR = "#0063A3" }) => {
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
    let timer = null;
    let isCancelled = false;

    const runLoop = () => {
      if (isCancelled) return;

      // Reset các trạng thái
      setIsDragging(false);
      setIsDragOver(false);
      setFileAttached(false);
      setPromptText("");
      setIsSubmitted(false);
      setGeminiThinking(false);
      setGeminiResponded(false);
      setIsClicking(false);

      // Đặt chuột xuất phát trực tiếp từ vị trí file text
      const txtPos = getCenterCoords('gemini-step-txt-item') || { x: 180, y: 180 };
      setCursorDuration(0);
      setCursorPos(txtPos);

      // 1. Dừng 600ms tại file text rồi nhấn giữ chuột để bắt đầu kéo thả
      timer = setTimeout(() => {
        if (isCancelled) return;
        setIsClicking(true);
        setIsDragging(true); // Nhấn giữ chuột, icon file bám chặt theo chuột

        // 2. Kéo file sang ô chat của Gemini
        timer = setTimeout(() => {
          if (isCancelled) return;
          const dropZonePos = getCenterCoords('gemini-step-prompt-box') || { x: 620, y: 410 };
          setCursorDuration(1200);
          setCursorPos(dropZonePos);

          // Giữa hành trình: kích hoạt trạng thái drag over
          timer = setTimeout(() => {
            if (isCancelled) return;
            setIsDragOver(true);
          }, 600);

          // Khi chuột đã dừng hẳn tại ô chat Gemini
          timer = setTimeout(() => {
            if (isCancelled) return;
            setIsClicking(false);
            setIsDragging(false); // Thả chuột
            setIsDragOver(false);
            setFileAttached(true); // File đính kèm vào khung chat

            // 3. Gõ lời nhắc "Đọc hiểu tài liệu này"
            timer = setTimeout(() => {
              if (isCancelled) return;
              setPromptText("Đọc ");
              
              timer = setTimeout(() => {
                if (isCancelled) return;
                setPromptText("Đọc hiểu ");

                timer = setTimeout(() => {
                  if (isCancelled) return;
                  setPromptText("Đọc hiểu tài liệu ");

                  timer = setTimeout(() => {
                    if (isCancelled) return;
                    setPromptText("Đọc hiểu tài liệu này");

                    // 4. Di chuột tới nút Send tròn
                    timer = setTimeout(() => {
                      if (isCancelled) return;
                      const sendBtnPos = getCenterCoords('gemini-step-send-btn') || { x: 790, y: 410 };
                      setCursorDuration(550);
                      setCursorPos(sendBtnPos);

                      // Khi chuột đến đúng nút Send
                      timer = setTimeout(() => {
                        if (isCancelled) return;
                        setIsClicking(true); // Bấm gửi

                        timer = setTimeout(() => {
                          if (isCancelled) return;
                          setIsClicking(false);
                          setIsSubmitted(true);
                          setPromptText("");
                          setGeminiThinking(true);

                          // 5. Gemini phản hồi sau 800ms
                          timer = setTimeout(() => {
                            if (isCancelled) return;
                            setGeminiThinking(false);
                            setGeminiResponded(true);

                            // Giữ kết quả hiển thị 5 giây
                            timer = setTimeout(() => {
                              if (isCancelled) return;
                              // Di chuyển chuột mượt mà trở lại file txt để lặp lại không bị giật
                              const returnPos = getCenterCoords('gemini-step-txt-item') || { x: 180, y: 180 };
                              setCursorDuration(1000);
                              setCursorPos(returnPos);

                              timer = setTimeout(() => {
                                if (isCancelled) return;
                                runLoop();
                              }, 1100);

                            }, 5000);
                          }, 800);
                        }, 180);
                      }, 650);
                    }, 400);

                  }, 120);
                }, 120);
              }, 120);

            }, 450);
          }, 1300);
        }, 200);
      }, 600);
    };

    // Chạy loop
    runLoop();

    return () => {
      isCancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-full relative select-none"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* ==================================================================== */}
        {/* CỘT 1: CỬA SỔ FOLDER DOWNLOADS WIN 10 (ĐỒNG BỘ 100% VỚI KHUNG 1) */}
        {/* ==================================================================== */}
        <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm ring-1 ring-slate-900/10 overflow-hidden flex flex-col font-sans text-xs h-[540px]">
          
          {/* Win 10 Title Bar */}
          <div className="h-9 bg-white border-b border-gray-200 px-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Folder size={14} className="text-amber-500 fill-amber-500" />
              <span className="text-slate-700 font-medium text-[11px]">Downloads</span>
            </div>
            <WindowControls />
          </div>

          {/* Win 10 Menu Bar: Bao 1 nền xanh đậm ở chữ File */}
          <div className="bg-white border-b border-gray-200 px-2 flex items-center gap-3 text-[11px] font-medium shrink-0">
            <span className="bg-[#0063A3] text-white px-3 py-1 font-semibold">File</span>
            <span className="text-slate-700 px-1">Home</span>
            <span className="text-slate-700 px-1">Share</span>
            <span className="text-slate-700 px-1">View</span>
          </div>

          {/* Win 10 Address Bar */}
          <div className="bg-white border-b border-gray-200 p-2 flex items-center gap-2 shrink-0">
            {/* Cụm mũi tên điều hướng chuẩn Win 10 nét đậm */}
            <div className="flex items-center gap-1 text-slate-700 shrink-0 pr-1">
              <span className="w-6 h-6 rounded flex items-center justify-center font-bold">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </span>
              <span className="w-6 h-6 rounded flex items-center justify-center text-slate-300">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
              <span className="w-6 h-6 rounded flex items-center justify-center font-bold">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                </svg>
              </span>
            </div>

            {/* Thanh địa chỉ */}
            <div className="flex-1 bg-white border border-gray-300 rounded px-2.5 py-0.5 text-[10px] text-slate-600 flex items-center gap-1 shadow-xs truncate">
              <span className="text-slate-400">📁 This PC &gt;</span>
              <span className="font-semibold text-slate-800">Downloads</span>
            </div>
          </div>

          {/* Vùng xem File: Có sẵn cả Openskp.rar và Skill Openskp.txt (Đặt gần nhau chuẩn khoảng cách thật) */}
          <div className="p-4 flex-1 bg-white flex flex-col justify-start relative">
            <div className="flex flex-wrap items-start gap-2.5 pt-2">
              
              {/* File 1: Openskp.rar */}
              <div className="w-24 p-1.5 border border-transparent flex flex-col items-center text-center">
                <img 
                  src="/icon-rar-clean.png" 
                  alt="Openskp.rar" 
                  className="w-12 h-12 object-contain drop-shadow-xs" 
                />
                <span className="font-medium text-slate-800 text-[11px] mt-1.5 truncate max-w-full">
                  Openskp.rar
                </span>
              </div>

              {/* File 2: Skill Openskp.txt (Gần rar chuẩn khoảng cách folder thật) */}
              <div 
                id="gemini-step-txt-item"
                className={`w-24 p-1.5 border flex flex-col items-center text-center transition-all cursor-grab ${
                  isDragging 
                    ? 'border-[#0063A3] bg-[#0063A3]/10 opacity-50' 
                    : 'border-transparent hover:border-slate-300'
                }`}
              >
                <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 drop-shadow-xs">
                  <DocTextIcon className="w-7 h-7" />
                </div>
                <span className="font-medium text-slate-800 text-[11px] mt-1.5 truncate max-w-full">
                  Skill Openskp.txt
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* ==================================================================== */}
        {/* CỘT 2: TRÌNH DUYỆT GOOGLE CHROME - GEMINI (CHUẨN THEO ẢNH MẪU) */}
        {/* ==================================================================== */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm ring-1 ring-slate-900/10 overflow-hidden flex flex-col font-sans text-xs h-[540px]">
          
          {/* Chrome Tab Bar: Chuẩn xác 100% theo ảnh mẫu thật (Google Gemini active, ChatGPT, Claude) */}
          <div className="h-9 bg-[#dee1e6] border-b border-gray-300 px-2 flex items-end justify-between shrink-0 select-none pt-1">
            <div className="flex items-end h-full">
              
              {/* Tab 1: Google Gemini (Active - nền trắng bo cong nối liền toolbar bên dưới) */}
              <div className="h-[30px] bg-white rounded-t-lg px-3 flex items-center gap-2 shadow-xs">
                <GeminiColorfulLogo className="w-3.5 h-3.5 shrink-0" />
                <span className="font-sans text-[11px] text-slate-800 font-medium whitespace-nowrap">Google Gemini</span>
                <span className="text-slate-500 hover:text-slate-700 ml-4 text-[10px] cursor-pointer leading-none">✕</span>
              </div>

              {/* Tab 2: ChatGPT (Inactive) */}
              <div className="h-[30px] px-3 flex items-center gap-2 text-slate-700 hover:bg-slate-200/50 rounded-t-lg cursor-pointer transition-colors">
                <ChatGPTLogo className="w-3.5 h-3.5 shrink-0" />
                <span className="font-sans text-[11px] text-slate-700 font-normal whitespace-nowrap">ChatGPT</span>
                <span className="text-slate-500 hover:text-slate-700 ml-3 text-[10px] cursor-pointer leading-none">✕</span>
              </div>

              {/* Dấu gạch dọc ngăn cách */}
              <div className="h-3.5 w-[1px] bg-slate-400/60 mx-1 self-center shrink-0" />

              {/* Tab 3: New chat - Claude (Inactive) */}
              <div className="h-[30px] px-3 flex items-center gap-2 text-slate-700 hover:bg-slate-200/50 rounded-t-lg cursor-pointer transition-colors">
                <ClaudeLogo className="w-3.5 h-3.5 shrink-0" />
                <span className="font-sans text-[11px] text-slate-700 font-normal whitespace-nowrap">New chat - Claude</span>
                <span className="text-slate-500 hover:text-slate-700 ml-3 text-[10px] cursor-pointer leading-none">✕</span>
              </div>

              {/* Dấu gạch dọc ngăn cách sau Claude */}
              <div className="h-3.5 w-[1px] bg-slate-400/60 mx-1 self-center shrink-0" />

            </div>
            
            <div className="self-center pb-1">
              <WindowControls />
            </div>
          </div>

          {/* Chrome Omnibox / URL Bar: Mũi tên chuẩn đậm Chrome */}
          <div className="h-9 bg-white border-b border-gray-200 px-3 flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-3 text-slate-700 text-xs">
              {/* Mũi tên quay lại đậm */}
              <svg className="w-4 h-4 text-slate-700 hover:text-black cursor-pointer" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
              {/* Mũi tên tiến đậm */}
              <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
              </svg>
              {/* Icon tải lại */}
              <svg className="w-3.5 h-3.5 text-slate-700 hover:text-black cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l6.11-6.11"/>
              </svg>
            </div>

            {/* Thanh địa chỉ Omnibox bo tròn viền nhẹ */}
            <div className="flex-1 bg-slate-100 rounded-full px-3.5 py-1 text-xs text-slate-800 flex items-center gap-2 truncate">
              {/* Icon tune / settings chuẩn Chrome */}
              <svg className="w-3.5 h-3.5 text-slate-700 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="8" cy="8" r="2.5"/><line x1="2" y1="8" x2="5.5" y2="8"/><line x1="10.5" y1="8" x2="22" y2="8"/>
                <circle cx="16" cy="16" r="2.5"/><line x1="2" y1="16" x2="13.5" y2="16"/><line x1="18.5" y1="16" x2="22" y2="16"/>
              </svg>
              <span className="font-sans text-[11px] text-slate-800 font-normal select-text">
                gemini.google.com/app?hl=vi
              </span>
            </div>
          </div>

          {/* Vùng giao diện ứng dụng Gemini (Gồm Left Rail và Chat Canvas nền xanh nhạt) */}
          <div className="flex-1 flex overflow-hidden">
            
            {/* Left Rail Gemini: Logo to hơn (w-7 h-7) */}
            <div className="w-12 bg-white/70 border-r border-slate-200/70 flex flex-col items-center py-3 gap-3.5 shrink-0 select-none">
              {/* Logo Gemini đa sắc to rõ nét */}
              <GeminiColorfulLogo className="w-7 h-7" />
              
              {/* Công tắc chế độ */}
              <div className="w-6 h-3.5 rounded-full border border-slate-700 flex items-center px-0.5 mt-1 cursor-pointer">
                <div className="w-2 h-2 rounded-full bg-slate-700" />
              </div>

              {/* Nút Cuộc trò chuyện mới (bút chì tròn) */}
              <div className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer mt-1" title="Cuộc trò chuyện mới">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
            </div>

            {/* Chat Canvas (Nền chuyển sắc xanh da trời nhạt đúng theo ảnh chụp 1 & 2) */}
            <div 
              className="flex-1 p-4 flex flex-col justify-between overflow-hidden relative"
              style={{
                background: 'linear-gradient(180deg, #edf4fc 0%, #e2eef9 100%)'
              }}
            >
              
              {/* Khung tin nhắn hội thoại (Chiều cao ổn định, không bị nhảy) */}
              <div className="flex-1 flex flex-col justify-center overflow-hidden">
                {!isSubmitted ? (
                  /* Trạng thái ban đầu */
                  <div className="flex flex-col items-center justify-center text-center my-auto py-2">
                    <GeminiColorfulLogo className="w-12 h-12 mb-2 opacity-95" />
                    <p className="text-xs text-slate-600 font-sans">
                      Kéo thả file <code>Skill Openskp.txt</code> vào ô chat bên dưới để bắt đầu.
                    </p>
                  </div>
                ) : (
                  /* Cuộc hội thoại sau khi gửi prompt */
                  <div className="space-y-3 animate-fade-in w-full max-w-lg mx-auto py-1">
                    
                    {/* Tin nhắn từ User */}
                    <div className="flex flex-col items-end gap-1">
                      <div className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 flex items-center gap-1.5 text-[11px] shadow-2xs">
                        <DocTextIcon className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                        <span className="font-medium text-slate-700">Skill Openskp.txt</span>
                        <span className="text-blue-600 text-[10px] ml-1">✓</span>
                      </div>
                      <div className="bg-white text-slate-800 px-4 py-2 rounded-2xl rounded-tr-xs text-xs font-medium shadow-xs border border-slate-200/80">
                        Đọc hiểu tài liệu này
                      </div>
                    </div>

                    {/* Phản hồi từ Gemini (CHỈ ĐỂ 1 LOẠI TEXT DUY NHẤT, KHÔNG CHIA NHIỀU MỤC) */}
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-2xs shrink-0 mt-0.5">
                        <GeminiColorfulLogo className="w-5 h-5" />
                      </div>

                      {geminiThinking ? (
                        <div className="bg-white px-3.5 py-2.5 rounded-2xl shadow-xs border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                          <span>Đang đọc hiểu tài liệu...</span>
                        </div>
                      ) : geminiResponded ? (
                        <div className="bg-white px-4 py-3 rounded-2xl shadow-xs border border-slate-200/80 text-xs sm:text-[13px] text-slate-800 leading-relaxed max-w-md animate-fade-in">
                          Tôi đã đọc hiểu tài liệu kỹ năng Skill OpenSkp và sẵn sàng dựng hình theo yêu cầu của bạn!
                        </div>
                      ) : null}
                    </div>

                  </div>
                )}
              </div>

              {/* Ô Chat Gemini (Theo chuẩn ảnh chụp 2: hình viên thuốc tròn, nút +, text Flash Mở rộng ⌵, mic) */}
              <div 
                id="gemini-step-prompt-box"
                className={`rounded-full border transition-all px-4 py-2 bg-white flex items-center justify-between shadow-sm relative ${
                  isDragOver 
                    ? 'border-2 border-dashed border-[#1a73e8] bg-blue-50/70' 
                    : 'border-slate-200/80'
                }`}
              >
                {isDragOver ? (
                  <div className="w-full py-1 text-center text-xs font-semibold text-[#1a73e8]">
                    Thả file Skill Openskp.txt vào đây
                  </div>
                ) : (
                  <>
                    {/* Nút cộng + bên trái theo ảnh 2 */}
                    <span className="text-xl text-slate-500 font-light pr-2.5 select-none leading-none cursor-pointer">+</span>

                    {/* File chip đã gắn sau khi kéo thả */}
                    {fileAttached && !isSubmitted && (
                      <div className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-full px-2.5 py-0.5 text-[11px] text-slate-700 shrink-0 mr-2">
                        <DocTextIcon className="w-3 h-3 text-slate-600 shrink-0" />
                        <span>Skill Openskp.txt</span>
                        <span className="text-slate-400 text-[9px] ml-0.5">✕</span>
                      </div>
                    )}

                    {/* Input gõ lời nhắc */}
                    <input 
                      type="text"
                      readOnly
                      value={promptText}
                      placeholder={fileAttached ? "" : "Hỏi Gemini"}
                      className="flex-1 bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-500 outline-none border-none cursor-default font-sans"
                    />

                    {/* Cụm chức năng bên phải theo ảnh 2: Flash Mở rộng ⌵ và Mic/Gửi */}
                    <div className="flex items-center gap-3 shrink-0 select-none pl-2">
                      <div className="flex items-center gap-1 text-xs text-slate-700 font-medium">
                        <span>Flash</span>
                        <span className="text-slate-400 text-[11px]">Mở rộng</span>
                        <svg className="w-3 h-3 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                      </div>

                      {/* Nút gửi mũi tên đậm đặc trưng */}
                      {promptText ? (
                        <button 
                          id="gemini-step-send-btn"
                          className="w-7 h-7 rounded-full bg-[#1a73e8] text-white flex items-center justify-center shadow-xs shrink-0"
                          title="Gửi"
                        >
                          <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
                          </svg>
                        </button>
                      ) : (
                        <svg className="w-4 h-4 text-slate-700 shrink-0 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                          <line x1="12" y1="19" x2="12" y2="23"/>
                          <line x1="8" y1="23" x2="16" y2="23"/>
                        </svg>
                      )}
                    </div>
                  </>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Con trỏ chuột với text icon bám theo chuột khi kéo thả (mũi tên chuột đậm chuẩn OS) */}
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
              fill="#111827" 
              stroke="#ffffff" 
              strokeWidth="2.2" 
              strokeLinejoin="round" 
              strokeLinecap="round" 
            />
          </svg>

          {/* Text icon bám sát tuyệt đối theo chuột khi kéo thả */}
          {isDragging && (
            <div className="absolute left-3 top-3 flex items-center gap-1.5 bg-white border border-slate-300 shadow-xl rounded px-2 py-1 text-[11px] font-medium text-slate-800 whitespace-nowrap animate-fade-in">
              <DocTextIcon className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <span>Skill Openskp.txt</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};



// ==============================================================================
// 4. MÔ PHỎNG BƯỚC 4: DỰNG MODEL (CẤU KIỆN & NỘI THẤT VỚI AI NGOÀI)
// ==============================================================================






export 
const Step4AiWorkflow = ({ PRIMARY_COLOR = "#0063A3" }) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const geminiChatRef = useRef(null);
  const openskpChatRef = useRef(null);

  const [cursorPos, setCursorPos] = useState({ x: 900, y: 505 });
  const [cursorDuration, setCursorDuration] = useState(0);
  const [isClicking, setIsClicking] = useState(false);

  // Phase 1
  const [cabinetAttached, setCabinetAttached] = useState(false);
  const [geminiPrompt, setGeminiPrompt] = useState("");
  const [cabinetSent, setCabinetSent] = useState(false);
  const [geminiThinking, setGeminiThinking] = useState(false);
  const [geminiResponded, setGeminiResponded] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [showOpenSkpPasteMenu, setShowOpenSkpPasteMenu] = useState(false);
  const [openskpInput, setOpenskpInput] = useState("");
  const [openskpSent, setOpenskpSent] = useState(false);
  const [isViewportPlaying, setIsViewportPlaying] = useState(false);

  // Phase 2
  const [phase, setPhase] = useState(1);
  const [geminiPrompt2, setGeminiPrompt2] = useState("");
  const [geminiSent2, setGeminiSent2] = useState(false);
  const [geminiThinking2, setGeminiThinking2] = useState(false);
  const [geminiResponded2, setGeminiResponded2] = useState(false);
  const [codeCopied2, setCodeCopied2] = useState(false);
  const [openskpInput2, setOpenskpInput2] = useState("");
  const [openskpSent2, setOpenskpSent2] = useState(false);

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
    if (geminiChatRef.current) {
      geminiChatRef.current.scrollTop = geminiChatRef.current.scrollHeight;
    }
  }, [cabinetSent, geminiThinking, geminiResponded, geminiSent2, geminiThinking2, geminiResponded2]);

  useEffect(() => {
    if (openskpChatRef.current) {
      openskpChatRef.current.scrollTop = openskpChatRef.current.scrollHeight;
    }
  }, [openskpSent, openskpSent2]);

  useEffect(() => {
    let isCancelled = false;

    const sleep = (ms) => new Promise(resolve => {
      if (isCancelled) return;
      setTimeout(() => {
        if (!isCancelled) resolve();
      }, ms);
    });

    const moveMouse = async (elId, duration = 800, offsetX = 0, offsetY = 0) => {
      if (isCancelled) return false;
      const coords = getCenterCoords(elId);
      if (coords) {
        setCursorDuration(duration);
        setCursorPos({ x: coords.x + offsetX, y: coords.y + offsetY });
        await sleep(duration + 50);
        return true;
      }
      return false;
    };

    const clickMouse = async () => {
      if (isCancelled) return;
      setIsClicking(true);
      await sleep(180);
      setIsClicking(false);
      await sleep(100);
    };

    const waitVideo = () => new Promise(resolve => {
      if (isCancelled) return;
      if (videoRef.current) {
        videoRef.current.onended = () => {
          if (!isCancelled) resolve();
        };
      } else {
        resolve();
      }
    });

    const runSimulationLoop = async () => {
      while (!isCancelled) {
        // Reset Phase 1
        setCursorDuration(0);
        setCursorPos({ x: 900, y: 505 });
        setPhase(1);
        setCabinetAttached(false);
        setGeminiPrompt("");
        setCabinetSent(false);
        setGeminiThinking(false);
        setGeminiResponded(false);
        setCodeCopied(false);
        setShowOpenSkpPasteMenu(false);
        setOpenskpInput("");
        setOpenskpSent(false);
        setIsViewportPlaying(false);

        // Reset Phase 2
        setGeminiPrompt2("");
        setGeminiSent2(false);
        setGeminiThinking2(false);
        setGeminiResponded2(false);
        setCodeCopied2(false);
        setOpenskpInput2("");
        setOpenskpSent2(false);

        if (videoRef.current) {
          videoRef.current.src = "/210226.mp4";
        }

        await sleep(800);

        // Phase 1: Attach Image
        await moveMouse("step4-image-source");
        await sleep(200);
        setIsClicking(true);
        await sleep(400); // Kéo lê
        
        const attachBtnCoords = getCenterCoords("step4-gemini-attach-btn");
        if (attachBtnCoords) {
            setCursorPos(attachBtnCoords);
            await sleep(800);
            setIsClicking(false);
            setCabinetAttached(true);
            await sleep(500);
        }

        // Phase 1: Chat Prompt
        await moveMouse("step4-gemini-input-box", 600);
        await clickMouse();
        setGeminiPrompt("vẽ cho tôi cái tủ này");
        await sleep(600);
        
        await moveMouse("step4-gemini-send-btn", 500);
        await clickMouse();
        setGeminiPrompt("");
        setCabinetSent(true);
        setGeminiThinking(true);
        await sleep(1800);
        
        setGeminiThinking(false);
        setGeminiResponded(true);
        await sleep(1000);

        // Phase 1: Copy Code
        await moveMouse("step4-gemini-copy-code-btn", 800);
        await clickMouse();
        setCodeCopied(true);
        await sleep(600);

        // Phase 1: Paste Code
        await moveMouse("step4-openskp-input-box", 1000);
        setIsClicking(true);
        await sleep(400);
        setIsClicking(false);
        setShowOpenSkpPasteMenu(true);
        await sleep(400);
        
        const skpInputCoords = getCenterCoords("step4-openskp-input-box");
        if (skpInputCoords) {
            setCursorDuration(300);
            setCursorPos({ x: skpInputCoords.x + 10, y: skpInputCoords.y - 30 });
            await sleep(350);
            await clickMouse();
            setShowOpenSkpPasteMenu(false);
            setOpenskpInput("```ruby\ncabinet = OpenSkp::Cabinet.new(...)```");
            await sleep(400);
        }

        // Phase 1: Send
        await moveMouse("step4-openskp-send-btn", 400);
        await clickMouse();
        setOpenskpInput("");
        setOpenskpSent(true);
        
        setIsViewportPlaying(true);
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(e => console.log(e));
        }
        await waitVideo();
        setIsViewportPlaying(false);

        // ---- BẮT ĐẦU KỊCH BẢN SỬA (PHASE 2) ----
        await sleep(800);
        setPhase(2);

        // Phase 2: Chat Prompt 2
        await moveMouse("step4-gemini-input-box", 1000);
        await clickMouse();
        setGeminiPrompt2("sửa thành 4 cánh mở và 3 ngăn kéo");
        await sleep(800);

        await moveMouse("step4-gemini-send-btn", 500);
        await clickMouse();
        setGeminiPrompt2("");
        setGeminiSent2(true);
        setGeminiThinking2(true);
        await sleep(1800);

        setGeminiThinking2(false);
        setGeminiResponded2(true);
        await sleep(1000);

        // Phase 2: Copy Code
        await moveMouse("step4-gemini-copy-code-btn-2", 800);
        await clickMouse();
        setCodeCopied2(true);
        await sleep(600);

        // Phase 2: Paste Code
        await moveMouse("step4-openskp-input-box", 1000);
        setIsClicking(true);
        await sleep(400);
        setIsClicking(false);
        setShowOpenSkpPasteMenu(true);
        await sleep(400);

        const skpInputCoords2 = getCenterCoords("step4-openskp-input-box");
        if (skpInputCoords2) {
            setCursorDuration(300);
            setCursorPos({ x: skpInputCoords2.x + 10, y: skpInputCoords2.y - 30 });
            await sleep(350);
            await clickMouse();
            setShowOpenSkpPasteMenu(false);
            setOpenskpInput2("```ruby\ncabinet.update(doors: 4, drawers: 3)```");
            await sleep(400);
        }

        // Phase 2: Send
        await moveMouse("step4-openskp-send-btn", 400);
        await clickMouse();
        setOpenskpInput2("");
        setOpenskpSent2(true);
        
        setIsViewportPlaying(true);
        if (videoRef.current) {
            videoRef.current.src = "/210226.2.mp4";
            videoRef.current.play().catch(e => console.log(e));
        }
        await waitVideo();
        setIsViewportPlaying(false);

        await sleep(1500); // Loop delay
      }
    };

    runSimulationLoop();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative select-none"
    >
      {/* CỘT 1: Cửa sổ SketchUp & Plugin UI */}
      <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm ring-1 ring-slate-900/10 overflow-hidden flex flex-col font-sans h-[540px]">
        {/* Title Bar */}
        <div className="h-9 bg-white border-b border-gray-200 px-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
            <span className="text-[11px] font-semibold text-slate-700 font-sans tracking-wide">SketchUp Pro 2024 - Dựng model</span>
          </div>
          <WindowControls />
        </div>
        
        {/* SketchUp Viewport */}
        <div className="flex-1 relative bg-white overflow-hidden flex">
          <video 
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isViewportPlaying ? 'opacity-100' : 'opacity-0'}`}
            muted
            playsInline
          />
          {!isViewportPlaying && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                {phase === 1 ? (
                    <>
                    <img id="step4-image-source" src="/tu-quan-ao.jpg" alt="Source" className="w-32 h-32 object-cover rounded-xl shadow-lg border-2 border-white rotate-2 hover:rotate-0 transition-transform cursor-pointer" style={{ pointerEvents: 'auto' }} />
                    <div className="mt-4 text-xs font-medium text-slate-400">Kéo ảnh vào ô nhập liệu Gemini</div>
                    </>
                ) : (
                    <div className="text-xs font-medium text-slate-400">Chờ lệnh hiệu chỉnh...</div>
                )}
            </div>
          )}

          {/* Plugin UI Overlay */}
          <div className="absolute bottom-4 right-4 w-72 h-[340px] bg-slate-50 rounded-xl shadow-xl border border-slate-200/60 flex flex-col overflow-hidden font-sans">
            <div className="h-9 bg-white border-b border-slate-200 px-3 flex items-center justify-between shrink-0 shadow-xs z-10">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">OS</div>
                <span className="text-[11px] font-semibold text-slate-800 tracking-wide">OpenSkp Copilot</span>
              </div>
              <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6"/></svg>
            </div>

            <div ref={openskpChatRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50 relative scroll-smooth">
              {/* Tin nhắn mặc định */}
              <div className="flex items-start gap-2 animate-fade-in">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">OS</div>
                <div className="bg-white text-slate-600 px-3 py-2 rounded-2xl rounded-tl-xs text-[11px] shadow-xs border border-slate-200">
                  Xin chào, hệ thống đã nạp mã cấu trúc chuẩn của Plugin.
                </div>
              </div>

              {/* Phase 1 Sent */}
              {openskpSent && (
                <>
                  <div className="flex items-start gap-2 justify-end animate-fade-in">
                    <div className="bg-blue-600 text-white px-3 py-2 rounded-2xl rounded-tr-xs text-[11px] font-mono shadow-xs">
                      [Mã lệnh Ruby đã chèn]
                    </div>
                  </div>
                  <div className="flex items-start gap-2 animate-fade-in">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-1">OS</div>
                    <div className="bg-white text-slate-700 px-3 py-2 rounded-2xl rounded-tl-xs text-[11px] shadow-xs border border-slate-200">
                      Đã dựng thành công model tủ quần áo.
                    </div>
                  </div>
                </>
              )}

              {/* Phase 2 Sent */}
              {openskpSent2 && (
                <>
                  <div className="flex items-start gap-2 justify-end animate-fade-in">
                    <div className="bg-blue-600 text-white px-3 py-2 rounded-2xl rounded-tr-xs text-[11px] font-mono shadow-xs">
                      [Mã lệnh hiệu chỉnh đã chèn]
                    </div>
                  </div>
                  <div className="flex items-start gap-2 animate-fade-in">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-1">OS</div>
                    <div className="bg-white text-slate-700 px-3 py-2 rounded-2xl rounded-tl-xs text-[11px] shadow-xs border border-slate-200">
                      Đã cập nhật cấu hình tủ thành 4 cánh mở và 3 ngăn kéo.
                    </div>
                  </div>
                </>
              )}

              {showOpenSkpPasteMenu && (
                <div 
                  className="absolute z-20 bg-white border border-slate-200 shadow-md rounded text-[11px] py-1 text-slate-700 w-24 text-center cursor-pointer hover:bg-blue-50"
                  style={{ top: '60%', left: '20%' }}
                >
                  Dán (Paste)
                </div>
              )}
            </div>

            <div className="p-2 bg-white border-t border-slate-200">
              <div className="flex items-center bg-slate-100 rounded-full px-3 py-1.5 border border-slate-200 relative">
                <input 
                  id="step4-openskp-input-box"
                  type="text" 
                  readOnly 
                  value={phase === 1 ? openskpInput : openskpInput2} 
                  placeholder="nhập yêu cầu" 
                  className="flex-1 bg-transparent text-[11px] text-slate-700 placeholder-slate-400 outline-none border-none font-sans"
                />
                {(phase === 1 ? openskpInput : openskpInput2) && (
                  <button 
                    id="step4-openskp-send-btn"
                    className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 ml-1 hover:bg-blue-700"
                  >
                    <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" /></svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CỘT 2: Trình duyệt Gemini */}
      <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm ring-1 ring-slate-900/10 overflow-hidden flex flex-col font-sans h-[540px]">
        {/* Chrome Tab Bar */}
        <div className="h-9 bg-[#dee1e6] border-b border-gray-300 px-2 flex items-end justify-between shrink-0 select-none pt-1">
          <div className="flex items-end h-full">
            <div className="h-[30px] bg-white rounded-t-lg px-3 flex items-center gap-2 shadow-xs">
              <GeminiColorfulLogo className="w-3.5 h-3.5" />
              <span className="font-sans text-[11px] text-slate-800 font-medium whitespace-nowrap">Gemini</span>
            </div>
          </div>
          <div className="self-center pb-1">
            <WindowControls />
          </div>
        </div>

        {/* URL Bar */}
        <div className="h-9 bg-white border-b border-gray-200 px-3 flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
          </div>
          <div className="flex-1 bg-slate-100 rounded-full px-3 py-0.5 text-[11px] text-slate-700 flex items-center gap-1.5">
            <span className="text-slate-400">🔒</span>
            <span>gemini.google.com/app</span>
          </div>
        </div>

        <div className="flex-1 flex bg-white overflow-hidden">
          {/* Gemini Left Rail */}
          <div className="w-12 border-r border-slate-200 bg-slate-50 flex flex-col items-center py-3 gap-4 shrink-0">
            <div className="w-7 h-7 flex items-center justify-center hover:bg-slate-200 rounded cursor-pointer transition-colors text-slate-600">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </div>
            <div className="w-7 h-7 flex items-center justify-center hover:bg-slate-200 rounded cursor-pointer transition-colors text-slate-600">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </div>
          </div>

          <div className="flex-1 flex flex-col relative bg-slate-50/50">
            {/* Header Gemini */}
            <div className="h-10 border-b border-slate-200/50 flex items-center px-4 bg-white/50 backdrop-blur-sm sticky top-0 z-10 shrink-0">
              <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                Gemini <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Advanced</span>
              </span>
            </div>

            <div className="flex-1 flex flex-col p-4">
              <div ref={geminiChatRef} className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4 scroll-smooth">
                {/* Phase 1 Chat */}
                {cabinetSent && (
                  <div className="flex flex-col items-end gap-1.5 animate-fade-in">
                    <div className="bg-white p-1 rounded-xl shadow-xs border border-slate-200 flex items-center gap-2">
                      <img src="/tu-quan-ao.jpg" alt="Tủ mẫu" className="w-8 h-8 object-cover rounded" />
                      <span className="text-[10px] text-slate-700 font-medium pr-1">tu-quan-ao.jpg</span>
                    </div>
                    <div className="bg-white text-slate-800 px-3.5 py-1.5 rounded-2xl rounded-tr-xs text-xs font-medium shadow-xs border border-slate-200/80">
                      vẽ cho tôi cái tủ này
                    </div>
                  </div>
                )}

                {geminiThinking && (
                  <div className="flex items-start gap-2 animate-fade-in">
                    <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-2xs shrink-0 mt-0.5">
                      <GeminiColorfulLogo className="w-4 h-4" />
                    </div>
                    <div className="bg-white px-3 py-2 rounded-2xl shadow-xs border border-slate-200 text-xs text-slate-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-[11px]">Đang tạo cấu trúc mã 3D...</span>
                    </div>
                  </div>
                )}

                {geminiResponded && (
                  <div className="flex items-start gap-2 animate-fade-in">
                    <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-2xs shrink-0 mt-0.5">
                      <GeminiColorfulLogo className="w-4 h-4" />
                    </div>
                    <div className="space-y-1.5 flex-1 max-w-[90%]">
                      <div className="bg-white rounded-2xl rounded-tl-xs p-2.5 text-slate-700 text-[11px] leading-relaxed shadow-xs border border-slate-200/80">
                        Đây là mã Ruby dựng tủ tương ứng cho OpenSkp:
                      </div>
                      <div className="bg-slate-900 text-slate-100 rounded-xl p-2.5 text-[10px] font-mono shadow-md relative border border-slate-800">
                        <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-700 text-[9px] text-slate-400">
                          <span>RUBY (OPENSKP)</span>
                          <button 
                            id="step4-gemini-copy-code-btn"
                            className="hover:text-white flex items-center gap-1 transition-colors px-1 py-0.5 rounded cursor-pointer"
                          >
                            {codeCopied ? (
                              <span className="text-blue-400 font-sans font-semibold">✓ Đã chép</span>
                            ) : (
                              <span className="text-blue-300 font-sans">Sao chép mã</span>
                            )}
                          </button>
                        </div>
                        <code className="text-blue-400 block whitespace-pre-wrap leading-relaxed">
                          cabinet = OpenSkp::Cabinet.new(width: 1800, height: 2200, depth: 600)
                        </code>
                      </div>
                    </div>
                  </div>
                )}

                {/* Phase 2 Chat */}
                {geminiSent2 && (
                  <div className="flex flex-col items-end gap-1.5 animate-fade-in">
                    <div className="bg-white text-slate-800 px-3.5 py-1.5 rounded-2xl rounded-tr-xs text-xs font-medium shadow-xs border border-slate-200/80">
                      sửa thành 4 cánh mở và 3 ngăn kéo
                    </div>
                  </div>
                )}

                {geminiThinking2 && (
                  <div className="flex items-start gap-2 animate-fade-in">
                    <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-2xs shrink-0 mt-0.5">
                      <GeminiColorfulLogo className="w-4 h-4" />
                    </div>
                    <div className="bg-white px-3 py-2 rounded-2xl shadow-xs border border-slate-200 text-xs text-slate-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-[11px]">Đang cập nhật cấu trúc...</span>
                    </div>
                  </div>
                )}

                {geminiResponded2 && (
                  <div className="flex items-start gap-2 animate-fade-in">
                    <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-2xs shrink-0 mt-0.5">
                      <GeminiColorfulLogo className="w-4 h-4" />
                    </div>
                    <div className="space-y-1.5 flex-1 max-w-[90%]">
                      <div className="bg-white rounded-2xl rounded-tl-xs p-2.5 text-slate-700 text-[11px] leading-relaxed shadow-xs border border-slate-200/80">
                        Đã cập nhật mã thành 4 cánh mở và 3 ngăn kéo:
                      </div>
                      <div className="bg-slate-900 text-slate-100 rounded-xl p-2.5 text-[10px] font-mono shadow-md relative border border-slate-800">
                        <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-700 text-[9px] text-slate-400">
                          <span>RUBY (OPENSKP)</span>
                          <button 
                            id="step4-gemini-copy-code-btn-2"
                            className="hover:text-white flex items-center gap-1 transition-colors px-1 py-0.5 rounded cursor-pointer"
                          >
                            {codeCopied2 ? (
                              <span className="text-blue-400 font-sans font-semibold">✓ Đã chép</span>
                            ) : (
                              <span className="text-blue-300 font-sans">Sao chép mã</span>
                            )}
                          </button>
                        </div>
                        <code className="text-blue-400 block whitespace-pre-wrap leading-relaxed">
                          cabinet.update(doors: 4, drawers: 3)
                        </code>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Ô Chat Gemini */}
              <div className="p-1 shrink-0">
                {cabinetAttached && !cabinetSent && phase === 1 && (
                  <div className="px-2 pb-1.5 flex items-center gap-2 animate-fade-in">
                    <div className="relative">
                      <img src="/tu-quan-ao.jpg" alt="Preview" className="w-9 h-9 object-cover rounded-lg border border-slate-300 shadow-xs" />
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-slate-700 text-white rounded-full text-[8px] flex items-center justify-center">✕</span>
                    </div>
                  </div>
                )}

                <div className="rounded-full border border-slate-200/90 px-3 py-1.5 bg-white flex items-center justify-between shadow-xs relative">
                  <span 
                    id="step4-gemini-attach-btn" 
                    className="text-xl text-slate-500 font-light pr-2 select-none leading-none cursor-pointer hover:text-slate-700"
                  >
                    +
                  </span>
                  <input 
                    id="step4-gemini-input-box"
                    type="text" 
                    readOnly 
                    value={phase === 1 ? geminiPrompt : geminiPrompt2} 
                    placeholder={cabinetAttached || phase === 2 ? "" : "Hỏi Gemini"} 
                    className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-500 outline-none border-none font-sans min-w-0"
                  />
                  <div className="flex items-center gap-2 shrink-0 select-none pl-1.5">
                    <div className="flex items-center gap-0.5 text-[11px] text-slate-700 font-medium">
                      <span>Flash</span>
                      <svg className="w-3 h-3 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                    </div>
                    {(phase === 1 ? geminiPrompt : geminiPrompt2) ? (
                      <button 
                        id="step4-gemini-send-btn"
                        className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" /></svg>
                      </button>
                    ) : (
                      <svg className="w-4 h-4 text-slate-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
        </div>
      </div>
    </div>
  );
};


const Step6FloorplanWorkflow = ({ PRIMARY_COLOR = "#0063A3" }) => {
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

  // Trạng thái chọn file trong Folder (Đồng bộ 100% style Bước 3)
  const [txtSelected, setTxtSelected] = useState(false);
  const [imgSelected, setImgSelected] = useState(false);

  // Hiệu ứng kéo thả 2 tệp từ folder sang Gemini
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);

  // Trạng thái hội thoại Gemini (Khung Trình duyệt bên phải)
  const [filesAttached, setFilesAttached] = useState(false);
  const [geminiPrompt, setGeminiPrompt] = useState("");
  const [promptSent, setPromptSent] = useState(false);
  const [geminiThinking, setGeminiThinking] = useState(false);
  const [geminiConverted, setGeminiConverted] = useState(false);

  // Hiệu ứng kéo mặt bằng đen trắng từ Gemini sang ô chat OpenSkp
  const [isDraggingBwImage, setIsDraggingBwImage] = useState(false);

  // Trạng thái hội thoại OpenSkp trong SketchUp
  const [showThumbnail, setShowThumbnail] = useState(false); // Thumbnail trên input: tắt khi gửi
  const [dimensionInput, setDimensionInput] = useState("");
  const [showDimensionPopup, setShowDimensionPopup] = useState(false); // Popup 1 dòng text đơn giản màu trắng dưới chuột
  const [openskpSent, setOpenskpSent] = useState(false);
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

  useEffect(() => {
    if (geminiChatRef.current) {
      geminiChatRef.current.scrollTop = geminiChatRef.current.scrollHeight;
    }
  }, [promptSent, geminiThinking, geminiConverted]);

  useEffect(() => {
    if (openskpChatRef.current) {
      openskpChatRef.current.scrollTop = openskpChatRef.current.scrollHeight;
    }
  }, [openskpSent, showThumbnail]);

  useEffect(() => {
    let timer = null;
    let typeTimer = null;
    let isCancelled = false;

    const runLoop = (isLooping = false) => {
      if (isCancelled) return;

      // 0. Reset về trạng thái ban đầu của Bước 6
      setLeftMode('folder');
      setTxtSelected(false);
      setImgSelected(false);
      setIsDraggingFiles(false);
      setIsDraggingBwImage(false);
      setFilesAttached(false);
      setGeminiPrompt("");
      setPromptSent(false);
      setGeminiThinking(false);
      setGeminiConverted(false);
      setShowThumbnail(false);
      setDimensionInput("");
      setShowDimensionPopup(false);
      setOpenskpSent(false);
      setIsViewportPlaying(false);
      setIsClicking(false);

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }

      // Điểm xuất phát của chuột: Nằm tại file Prompt txt trong Folder Downloads
      const txtFilePos = getCenterCoords('step6-folder-prompt-item') || { x: 180, y: 180 };
      if (!isLooping) {
        setCursorDuration(0);
        setCursorPos(txtFilePos);
      }

      // 1. Dừng 600ms tại file txt rồi chuột nhấp chọn file txt (đồng bộ Bước 3)
      timer = setTimeout(() => {
        if (isCancelled) return;
        setIsClicking(true);
        setTxtSelected(true); // Đã chọn file txt (border-[#0063A3] bg-[#0063A3]/10)

        timer = setTimeout(() => {
          if (isCancelled) return;
          setIsClicking(false);

          // Di chuyển chuột sang chọn tiếp file ảnh mặt bằng màu
          const imgFilePos = getCenterCoords('step6-folder-color-image-item') || { x: 290, y: 180 };
          setCursorDuration(400);
          setCursorPos(imgFilePos);

          timer = setTimeout(() => {
            if (isCancelled) return;
            setIsClicking(true);
            setImgSelected(true); // Đã chọn cả 2 file

            timer = setTimeout(() => {
              if (isCancelled) return;

              // 2. KÍCH HOẠT KÉO CẢ 2 FILE SANG TRÌNH DUYỆT GEMINI
              setIsDraggingFiles(true);

              const geminiInputPos = getCenterCoords('step6-gemini-input-box') || { x: 900, y: 505 };
              setCursorDuration(1000);
              setCursorPos(geminiInputPos);

              timer = setTimeout(() => {
                if (isCancelled) return;

                // Thả chuột tại ô chat Gemini -> Hiện đính kèm
                setIsDraggingFiles(false);
                setFilesAttached(true);
                setTxtSelected(false);
                setImgSelected(false);
                setIsClicking(false);

                timer = setTimeout(() => {
                  if (isCancelled) return;

                  // 3. Gõ câu lệnh: "Chuyển mặt bằng về đen trắng theo promt đính kèm"
                  const fullText = "Chuyển mặt bằng về đen trắng theo promt đính kèm";
                  let charIndex = 0;

                  typeTimer = setInterval(() => {
                    if (isCancelled) {
                      clearInterval(typeTimer);
                      return;
                    }
                    charIndex++;
                    setGeminiPrompt(fullText.slice(0, charIndex));

                    if (charIndex >= fullText.length) {
                      clearInterval(typeTimer);

                      // Di chuyển chuột đến nút Send của Gemini
                      timer = setTimeout(() => {
                        if (isCancelled) return;
                        const sendBtnPos = getCenterCoords('step6-gemini-send-btn') || { x: 980, y: 505 };
                        setCursorDuration(350);
                        setCursorPos(sendBtnPos);

                        // Nhấn Send trên Gemini
                        timer = setTimeout(() => {
                          if (isCancelled) return;
                          setIsClicking(true);

                          timer = setTimeout(() => {
                            if (isCancelled) return;
                            setIsClicking(false);
                            setPromptSent(true);
                            setGeminiPrompt("");
                            setFilesAttached(false);
                            setGeminiThinking(true);

                            // 4. Gemini suy nghĩ và convert thành mặt bằng đen trắng
                            timer = setTimeout(() => {
                              if (isCancelled) return;
                              setGeminiThinking(false);
                              setGeminiConverted(true);

                              // 5. Khung folder thu lại, khung SketchUp mở ra
                              timer = setTimeout(() => {
                                if (isCancelled) return;
                                setLeftMode('sketchup');

                                // 6. KÉO MẶT BẰNG ĐEN TRẮNG TỪ TRÌNH DUYỆT SANG Ô NHẬP LIỆU PLUGIN (KHÔNG CẦN NHẤN TẢI ẢNH)
                                timer = setTimeout(() => {
                                  if (isCancelled) return;
                                  const bwImagePos = getCenterCoords('step6-gemini-bw-image') || { x: 920, y: 320 };
                                  setCursorDuration(600);
                                  setCursorPos(bwImagePos);

                                  timer = setTimeout(() => {
                                    if (isCancelled) return;
                                    // Chuột nhấn vào ảnh mặt bằng đen trắng và bắt đầu kéo
                                    setIsClicking(true);
                                    setIsDraggingBwImage(true);

                                    // Chuột kéo ảnh mặt bằng đen trắng sang ô nhập liệu OpenSkp
                                    timer = setTimeout(() => {
                                      if (isCancelled) return;
                                      const openskpInputPos = getCenterCoords('step6-openskp-input') || { x: 645, y: 505 };
                                      setCursorDuration(1100);
                                      setCursorPos(openskpInputPos);

                                      timer = setTimeout(() => {
                                        if (isCancelled) return;
                                        // Thả ảnh vào ô nhập liệu OpenSkp -> Hiện thumbnail ảnh
                                        setIsClicking(false);
                                        setIsDraggingBwImage(false);
                                        setShowThumbnail(true);

                                        // 7. NHẬP TEXT 9000
                                        timer = setTimeout(() => {
                                          if (isCancelled) return;
                                          setIsClicking(true); // Click vào ô text

                                          timer = setTimeout(() => {
                                            if (isCancelled) return;
                                            setIsClicking(false);

                                            // Gõ số 9000
                                            const dimText = "9000";
                                            let dIdx = 0;
                                            const dTimer = setInterval(() => {
                                              if (isCancelled) {
                                                clearInterval(dTimer);
                                                return;
                                              }
                                              dIdx++;
                                              setDimensionInput(dimText.slice(0, dIdx));

                                              if (dIdx >= dimText.length) {
                                                clearInterval(dTimer);

                                                // 8. POPUP VIẾT ĐƠN GIẢN 1 DÒNG TEXT, MÀU TRẮNG HIỆN BÊN DƯỚI CHUỘT
                                                // HIỂN THỊ CHẬM RÃI (2.8 giây) CHO NGƯỜI XEM DỄ QUAN SÁT
                                                timer = setTimeout(() => {
                                                  if (isCancelled) return;
                                                  setShowDimensionPopup(true);

                                                  timer = setTimeout(() => {
                                                    if (isCancelled) return;

                                                    // 9. Di chuột tới nút Send trên OpenSkp
                                                    const openskpSendPos = getCenterCoords('step6-openskp-send-btn') || { x: 745, y: 505 };
                                                    setCursorDuration(380);
                                                    setCursorPos(openskpSendPos);

                                                    // Nhấn Send trên OpenSkp
                                                    timer = setTimeout(() => {
                                                      if (isCancelled) return;
                                                      setIsClicking(true);

                                                      timer = setTimeout(() => {
                                                        if (isCancelled) return;
                                                        setIsClicking(false);
                                                        
                                                        // KHI NHẤN GỬI THÌ PHẢI TẮT THUMBNAIL ĐI
                                                        setShowThumbnail(false);
                                                        setShowDimensionPopup(false);
                                                        setOpenskpSent(true);
                                                        setDimensionInput("");

                                                        // 10. Video động play (video 210226.3.mp4 dựng 3D từ 2D)
                                                        setIsViewportPlaying(true);
                                                        if (videoRef.current) {
                                                          videoRef.current.currentTime = 0;
                                                          videoRef.current.play().catch(() => {});
                                                        }

                                                        // Chuột sang vị trí quan sát trên Viewport
                                                        timer = setTimeout(() => {
                                                          if (isCancelled) return;
                                                          const restPos = getCenterCoords('step6-viewport-rest-spot') || { x: 380, y: 460 };
                                                          setCursorDuration(750);
                                                          setCursorPos(restPos);

                                                          // Video chạy trong ~11 giây
                                                          timer = setTimeout(() => {
                                                            if (isCancelled) return;

                                                            // Dừng 2.2 giây để người xem chiêm ngưỡng không gian 3D hoàn chỉnh
                                                            timer = setTimeout(() => {
                                                              if (isCancelled) return;

                                                              // ==============================================================
                                                              // LOOP CHUỘT KHÉP KÍN:
                                                              // Chuột lướt mượt mà từ Viewport quay về file trong Folder ban đầu
                                                              // ==============================================================
                                                              const nextStartPos = getCenterCoords('step6-folder-prompt-item') || { x: 180, y: 180 };
                                                              setCursorDuration(1200);
                                                              setCursorPos(nextStartPos);

                                                              timer = setTimeout(() => {
                                                                if (isCancelled) return;

                                                                // Thu khung SketchUp, mở lại khung Folder ban đầu
                                                                setLeftMode('folder');
                                                                setIsViewportPlaying(false);
                                                                setOpenskpSent(false);
                                                                setShowThumbnail(false);
                                                                setDimensionInput("");
                                                                setGeminiConverted(false);
                                                                setGeminiThinking(false);
                                                                setPromptSent(false);
                                                                setFilesAttached(false);
                                                                setGeminiPrompt("");
                                                                setTxtSelected(false);
                                                                setImgSelected(false);
                                                                setIsDraggingFiles(false);
                                                                setIsDraggingBwImage(false);

                                                                if (videoRef.current) {
                                                                  videoRef.current.pause();
                                                                  videoRef.current.currentTime = 0;
                                                                }

                                                                // Dừng 600ms tại folder rồi chạy chu trình tiếp theo
                                                                timer = setTimeout(() => {
                                                                  if (isCancelled) return;
                                                                  runLoop(true);
                                                                }, 600);

                                                              }, 1300);

                                                            }, 2200);

                                                          }, 11000);
                                                        }, 500);

                                                      }, 180);
                                                    }, 380);
                                                  }, 2800); // POPUP CHẬM RÃI: Giữ 2.8s cho người dùng quan sát
                                                }, 250);
                                              }
                                            }, 75);
                                          }, 180);
                                        }, 220);
                                      }, 1100);
                                    }, 200);
                                  }, 600);
                                }, 450);
                              }, 450);
                            }, 1200);
                          }, 180);
                        }, 380);
                      }, 350);
                    }
                  }, 40);
                }, 180);
              }, 1000);
            }, 180);
          }, 400);
        }, 180);
      }, 600);
    };

    runLoop(false);

    return () => {
      isCancelled = true;
      if (timer) clearTimeout(timer);
      if (typeTimer) clearInterval(typeTimer);
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
          
          {/* TRƯỜNG HỢP 1: CỬA SỔ FOLDER DOWNLOADS (PHASE 1 & 2 - ĐỒNG BỘ 100% BƯỚC 3) */}
          <div 
            className={`absolute inset-0 flex flex-col transition-all duration-500 bg-white ${
              leftMode === 'folder' 
                ? 'opacity-100 scale-100 pointer-events-auto z-10' 
                : 'opacity-0 scale-95 pointer-events-none z-0'
            }`}
          >
            {/* Win 10 Title Bar */}
            <div className="h-9 bg-white border-b border-gray-200 px-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Folder size={14} className="text-amber-500 fill-amber-500" />
                <span className="text-slate-700 font-medium text-[11px]">Downloads</span>
              </div>
              <WindowControls />
            </div>

            {/* Win 10 Menu Bar */}
            <div className="bg-white border-b border-gray-200 px-2 flex items-center gap-3 text-[11px] font-medium shrink-0">
              <span className="bg-[#0063A3] text-white px-3 py-1 font-semibold">File</span>
              <span className="text-slate-700 px-1">Home</span>
              <span className="text-slate-700 px-1">Share</span>
              <span className="text-slate-700 px-1">View</span>
            </div>

            {/* Win 10 Address Bar */}
            <div className="bg-white border-b border-gray-200 p-2 flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1 text-slate-700 shrink-0 pr-1">
                <span className="w-6 h-6 rounded flex items-center justify-center font-bold">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                </span>
                <span className="w-6 h-6 rounded flex items-center justify-center text-slate-300">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </span>
                <span className="w-6 h-6 rounded flex items-center justify-center font-bold">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" /></svg>
                </span>
              </div>
              <div className="flex-1 bg-white border border-gray-300 rounded px-2.5 py-0.5 text-[10px] text-slate-600 flex items-center gap-1 shadow-xs truncate">
                <span className="text-slate-400">📁 This PC &gt;</span>
                <span className="font-semibold text-slate-800">Downloads</span>
              </div>
            </div>

            {/* Vùng xem File: ĐỒNG BỘ 100% STYLE VỚI BƯỚC 1 & BƯỚC 3 */}
            <div className="p-4 flex-1 bg-white flex flex-col justify-start relative">
              <div className="flex flex-wrap items-start gap-2.5 pt-2">
                
                {/* File 1: OpenSkp.rar */}
                <div className="w-24 p-1.5 border border-transparent flex flex-col items-center text-center">
                  <img src="/icon-rar-clean.png" alt="OpenSkp.rar" className="w-12 h-12 object-contain drop-shadow-xs" />
                  <span className="font-medium text-slate-800 text-[11px] mt-1.5 truncate max-w-full">
                    OpenSkp.rar
                  </span>
                </div>

                {/* File 2: Prompt – Generate a floor plan image.txt (Select giống Bước 3) */}
                <div 
                  id="step6-folder-prompt-item"
                  className={`w-28 p-1.5 border flex flex-col items-center text-center transition-all ${
                    isDraggingFiles
                      ? 'border-[#0063A3] bg-[#0063A3]/10 opacity-50'
                      : txtSelected
                      ? 'border-[#0063A3] bg-[#0063A3]/10'
                      : 'border-transparent hover:border-slate-300'
                  }`}
                >
                  <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 drop-shadow-xs">
                    <DocTextIcon className="w-7 h-7" />
                  </div>
                  <span className="font-medium text-slate-800 text-[11px] mt-1.5 line-clamp-2 max-w-full leading-tight">
                    Prompt – Generate a floor plan image.txt
                  </span>
                </div>

                {/* File 3: Mat_bang_mau.png (Select giống Bước 3) */}
                <div 
                  id="step6-folder-color-image-item"
                  className={`w-24 p-1.5 border flex flex-col items-center text-center transition-all ${
                    isDraggingFiles
                      ? 'border-[#0063A3] bg-[#0063A3]/10 opacity-50'
                      : imgSelected
                      ? 'border-[#0063A3] bg-[#0063A3]/10'
                      : 'border-transparent hover:border-slate-300'
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shadow-xs bg-slate-100">
                    <img src="/floorplan-color.png" alt="Mặt bằng màu" className="w-full h-full object-cover" />
                  </div>
                  <span className="font-medium text-slate-800 text-[11px] mt-1.5 truncate max-w-full">
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
            {/* Title Bar SketchUp */}
            <div className="h-9 bg-[#dee1e6] border-b border-gray-300 px-3 flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center gap-2">
                <img src="/sketchup-logo.svg" alt="SketchUp" className="w-4 h-4 object-contain shrink-0" />
                <span className="font-sans text-[11px] text-slate-700 font-medium">
                  Untitled - SketchUp Pro 2021
                </span>
              </div>
              <WindowControls />
            </div>

            {/* Menu Bar */}
            <div className="h-9 bg-white border-b border-gray-200 px-2 flex items-center gap-3 text-[11px] text-slate-700 font-sans select-none shrink-0">
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
              <div className="flex-1 relative overflow-hidden bg-[#e8e8e8]">
                <img 
                  src="/sketchup-floorplan-ready.jpg" 
                  alt="SketchUp Viewport Ready" 
                  className={`absolute inset-0 w-full h-full object-cover object-left transition-opacity duration-300 ${
                    isViewportPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
                />
                <video 
                  ref={videoRef}
                  src="/210226.3.mp4" 
                  muted 
                  playsInline 
                  className={`absolute top-0 left-0 h-full w-full object-cover transition-opacity duration-300 ${
                    isViewportPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                />
                <div id="step6-viewport-rest-spot" className="absolute bottom-6 left-6 w-2 h-2 opacity-0 pointer-events-none" />
              </div>

              {/* Mock UI Plugin */}
              <div 
                className="w-[260px] sm:w-[280px] border-l border-slate-300 bg-[#fdfbf7] flex flex-col justify-between shadow-lg relative shrink-0"
                style={{
                  backgroundImage: 'linear-gradient(rgba(0, 99, 163, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 99, 163, 0.06) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                  isolation: 'isolate'
                }}
              >
                <div className="relative flex items-center p-2.5 border-b border-slate-200/60 bg-white/80 backdrop-blur-md shrink-0 h-12">
                  <div className="flex items-center gap-1 z-10 text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-1 text-[#0063A3]">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-4 5h8c2.76 0 5 2.24 5 5v4c0 2.76-2.24 5-5 5H8c-2.76 0-5-2.24-5-5v-4c0-2.76 2.24-5 5-5zm1 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                      <path d="M5 23 Q 12 18, 19 23 H 5 z"/>
                    </svg>
                    <span className="font-serif font-normal text-base text-[#0063A3]">OpenSkp</span>
                  </div>
                  <div className="absolute right-[19px] top-0 bottom-0 w-6 flex items-center justify-center z-10">
                    <span className="text-[11px] font-semibold text-slate-500">EN</span>
                  </div>
                </div>

                {/* Chat Area Plugin */}
                <div ref={openskpChatRef} className="flex-1 p-3 overflow-y-auto space-y-2.5 font-sans text-xs">
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl rounded-bl-xs p-3 shadow-xs border border-slate-200/80 text-slate-800 text-xs leading-relaxed max-w-[90%]">
                      Xin chào! Bạn cần vẽ gì hôm nay.
                    </div>
                  </div>

                  {/* Bubble gửi: CHỈ HIỂN THỊ ẢNH VÀ 9000 */}
                  {openskpSent && (
                    <div className="flex justify-end animate-fade-in">
                      <div className="bg-[#0063A3] text-white rounded-2xl rounded-br-xs p-2 shadow-xs max-w-[90%] space-y-1 flex flex-col items-end">
                        <img src="/floorplan-bw.jpg" alt="Mặt bằng" className="w-28 h-20 object-cover rounded-lg border border-white/20 block" />
                        <span className="font-mono text-xs font-semibold pr-1">9000</span>
                      </div>
                    </div>
                  )}

                  {openskpSent && (
                    <div className="flex justify-start animate-fade-in">
                      <div className="bg-white rounded-2xl rounded-bl-xs px-3 py-2 shadow-xs border border-slate-200/80 text-slate-800 text-xs leading-relaxed flex items-center gap-2 max-w-[90%]">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
                        <span className="font-medium text-blue-700">Đang phân tích mặt bằng & dựng không gian 3D...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Plugin */}
                <div className="p-3 border-t border-slate-200/60 bg-white/90 backdrop-blur-xs shrink-0 relative">
                  
                  {/* THUMBNAIL ẢNH MẶT BẰNG ĐEN TRẮNG: TẮT ĐI KHI NHẤN GỬI */}
                  {showThumbnail && (
                    <div className="mb-2 px-1 flex items-center gap-2 animate-fade-in">
                      <div className="relative">
                        <img src="/floorplan-bw.jpg" alt="Preview B&W" className="w-10 h-7 object-cover rounded border border-slate-300 shadow-xs" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-slate-700 text-white rounded-full text-[7px] flex items-center justify-center">✕</span>
                      </div>
                      <span className="text-[10px] text-slate-600 font-medium">Mat_bang_BW.jpg</span>
                    </div>
                  )}

                  <div className="relative flex items-center w-full bg-white border border-gray-200 rounded-2xl shadow-xs px-2 py-1">
                    <span className="p-1 text-gray-400 shrink-0">
                      <ImageIcon size={15} />
                    </span>
                    <input 
                      id="step6-openskp-input"
                      type="text" 
                      readOnly 
                      value={dimensionInput}
                      placeholder="nhập yêu cầu" 
                      className="w-full bg-transparent text-xs font-mono text-slate-800 focus:outline-none placeholder-gray-400 select-none truncate px-1"
                    />
                    <button 
                      id="step6-openskp-send-btn"
                      className="m-0.5 w-6 h-6 rounded-full text-white bg-[#0063A3] flex items-center justify-center shrink-0 shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
                      title="Gửi"
                    >
                      <Send size={11} />
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* ==================================================================== */}
        {/* KHUNG PHẢI: TRÌNH DUYỆT GOOGLE GEMINI */}
        {/* ==================================================================== */}
        <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm ring-1 ring-slate-900/10 overflow-hidden flex flex-col font-sans text-xs h-[540px]">
          
          {/* Chrome Tab Bar */}
          <div className="h-9 bg-[#dee1e6] border-b border-gray-300 px-2 flex items-end justify-between shrink-0 select-none pt-1">
            <div className="flex items-end h-full">
              <div className="h-[30px] bg-white rounded-t-lg px-2.5 flex items-center gap-1.5 shadow-xs">
                <GeminiColorfulLogo className="w-3.5 h-3.5 shrink-0" />
                <span className="font-sans text-[11px] text-slate-800 font-medium whitespace-nowrap">Google Gemini</span>
                <span className="text-slate-500 hover:text-slate-700 ml-2 text-[10px] cursor-pointer leading-none">✕</span>
              </div>
              <div className="h-[30px] px-2 flex items-center justify-center text-slate-700 hover:bg-slate-200/50 rounded-t-lg cursor-pointer transition-colors" title="ChatGPT">
                <ChatGPTLogo className="w-3.5 h-3.5 shrink-0" />
              </div>
              <div className="h-3.5 w-[1px] bg-slate-400/60 mx-0.5 self-center shrink-0" />
              <div className="h-[30px] px-2 flex items-center justify-center text-slate-700 hover:bg-slate-200/50 rounded-t-lg cursor-pointer transition-colors" title="Claude">
                <ClaudeLogo className="w-3.5 h-3.5 shrink-0" />
              </div>
              <div className="h-3.5 w-[1px] bg-slate-400/60 mx-0.5 self-center shrink-0" />
            </div>
            <div className="self-center pb-1">
              <WindowControls />
            </div>
          </div>

          {/* Chrome Omnibox */}
          <div className="h-9 bg-white border-b border-gray-200 px-3 flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-3 text-slate-700 text-xs">
              <svg className="w-4 h-4 text-slate-700 hover:text-black cursor-pointer" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
              <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
              <svg className="w-3.5 h-3.5 text-slate-700 hover:text-black cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l6.11-6.11"/></svg>
            </div>
            <div className="flex-1 bg-slate-100 rounded-full px-3 py-1 text-xs text-slate-800 flex items-center gap-2 truncate">
              <svg className="w-3.5 h-3.5 text-slate-700 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="8" cy="8" r="2.5"/><line x1="2" y1="8" x2="5.5" y2="8"/><line x1="10.5" y1="8" x2="22" y2="8"/><circle cx="16" cy="16" r="2.5"/><line x1="2" y1="16" x2="13.5" y2="16"/><line x1="18.5" y1="16" x2="22" y2="16"/></svg>
              <span className="font-sans text-[11px] text-slate-800 font-normal select-text">gemini.google.com/app?hl=vi</span>
            </div>
          </div>

          {/* Gemini Chat Body */}
          <div 
            className="flex-1 flex flex-col justify-between overflow-hidden relative"
            style={{ background: 'linear-gradient(180deg, #edf4fc 0%, #e2eef9 100%)' }}
          >
            <div ref={geminiChatRef} className="flex-1 p-3 overflow-y-auto space-y-3 font-sans">
              
              {/* Tin nhắn gửi kèm cả 2 file: Prompt.txt và Mat_bang_mau.png */}
              {promptSent && (
                <div className="flex flex-col items-end gap-1.5 animate-fade-in">
                  <div className="flex items-center gap-1.5">
                    <div className="bg-white border border-slate-200 rounded px-2 py-1 flex items-center gap-1 text-[10.5px] shadow-2xs">
                      <DocTextIcon className="w-3 h-3 text-slate-600" />
                      <span className="font-medium text-slate-700 truncate max-w-[100px]">Prompt...plan.txt</span>
                    </div>
                    <img src="/floorplan-color.png" alt="Mặt bằng màu" className="w-16 h-12 object-cover rounded border border-slate-300 shadow-xs" />
                  </div>
                  <div className="bg-white text-slate-800 px-3.5 py-2 rounded-2xl rounded-tr-xs text-xs font-medium shadow-xs border border-slate-200/80 max-w-[90%] leading-relaxed">
                    Chuyển mặt bằng về đen trắng theo promt đính kèm
                  </div>
                </div>
              )}

              {/* Gemini đang suy nghĩ */}
              {geminiThinking && (
                <div className="flex items-start gap-2 animate-fade-in">
                  <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-2xs shrink-0 mt-0.5">
                    <GeminiColorfulLogo className="w-4 h-4" />
                  </div>
                  <div className="bg-white px-3.5 py-2 rounded-2xl shadow-xs border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span>Gemini đang xử lý và convert sang đen trắng...</span>
                  </div>
                </div>
              )}

              {/* Gemini convert thành mặt bằng đen trắng: KÉO TRỰC TIẾP SANG SKETCHUP */}
              {geminiConverted && (
                <div className="flex items-start gap-2 max-w-full animate-fade-in">
                  <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-2xs shrink-0 mt-0.5">
                    <GeminiColorfulLogo className="w-4 h-4" />
                  </div>
                  
                  <div className="bg-white rounded-2xl p-2.5 shadow-md border border-slate-200/80 w-full space-y-2">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                      <span className="text-[11px] font-semibold text-slate-700">Mặt bằng đen trắng chuẩn CAD</span>
                      <span className="text-[9.5px] text-slate-400 font-mono">CAD 2D • 9000mm</span>
                    </div>

                    {/* VÙNG ẢNH MẶT BẰNG ĐEN TRẮNG ĐƯỢC CHUỘT KÉO TRỰC TIẾP */}
                    <div 
                      id="step6-gemini-bw-image"
                      className={`rounded-xl overflow-hidden border border-slate-200 bg-white transition-opacity ${
                        isDraggingBwImage ? 'opacity-40 ring-2 ring-[#0063A3]' : 'opacity-100'
                      }`}
                    >
                      <img src="/floorplan-bw.jpg" alt="Mặt bằng đen trắng" className="w-full h-36 object-contain bg-white" />
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Vùng nhập liệu Gemini */}
            <div className="p-1 shrink-0">
              {filesAttached && (
                <div className="px-2 pb-2 flex items-center gap-2 animate-fade-in">
                  <div className="bg-white border border-slate-200 rounded px-2 py-1 flex items-center gap-1.5 text-[10.5px] shadow-2xs">
                    <DocTextIcon className="w-3 h-3 text-slate-600" />
                    <span className="font-medium text-slate-700 truncate max-w-[90px]">Prompt...image.txt</span>
                  </div>
                  <div className="flex items-center gap-1 bg-white border border-slate-200 rounded p-1 text-[10.5px] shadow-2xs">
                    <img src="/floorplan-color.png" alt="preview" className="w-5 h-4 object-cover rounded" />
                    <span className="font-medium text-slate-700 truncate max-w-[80px]">Mat_bang_mau.png</span>
                  </div>
                </div>
              )}

              <div className="rounded-full border border-slate-200/90 px-3 py-1.5 bg-white flex items-center justify-between shadow-xs relative">
                <span className="text-xl text-slate-500 font-light pr-2 pl-0.5 select-none leading-none cursor-pointer hover:text-slate-700 transition-colors" title="Thêm tệp">+</span>
                <input 
                  id="step6-gemini-input-box"
                  type="text" 
                  readOnly 
                  value={geminiPrompt} 
                  placeholder={filesAttached ? "" : "Hỏi Gemini"} 
                  className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-500 outline-none border-none cursor-default font-sans min-w-0"
                />
                <div className="flex items-center gap-2 shrink-0 select-none pl-1.5">
                  <div className="flex items-center gap-0.5 text-[11px] text-slate-700 font-medium">
                    <span>Flash</span>
                    <svg className="w-3 h-3 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                  {geminiPrompt ? (
                    <button 
                      id="step6-gemini-send-btn"
                      className="w-6 h-6 rounded-full bg-[#1a73e8] text-white flex items-center justify-center shadow-xs shrink-0 hover:bg-blue-600 transition-colors"
                      title="Gửi"
                    >
                      <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
                      </svg>
                    </button>
                  ) : (
                    <svg className="w-4 h-4 text-slate-600 shrink-0 cursor-pointer hover:text-black transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
                    </svg>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ====================================================================== */}
      {/* CON TRỎ CHUỘT THỰC TẾ: ĐỒNG BỘ 100% VỚI BƯỚC 3 & BƯỚC 4 (BỎ HIỆU ỨNG TỎA) */}
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

          {/* 1. HIỆU ỨNG KÉO 2 FILE TỪ FOLDER SANG GEMINI (GIỐNG BƯỚC 3) */}
          {isDraggingFiles && (
            <div className="absolute left-3 top-3 flex items-center gap-1.5 bg-white border border-slate-300 shadow-xl rounded px-2 py-1 text-[11px] font-medium text-slate-800 whitespace-nowrap animate-fade-in">
              <DocTextIcon className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <span>Prompt.txt, Mat_bang.png</span>
            </div>
          )}

          {/* 2. HIỆU ỨNG KÉO MẶT BẰNG ĐEN TRẮNG TỪ GEMINI SANG OPENSKP */}
          {isDraggingBwImage && (
            <div className="absolute left-3 top-3 flex items-center gap-1.5 bg-white border border-slate-300 shadow-xl rounded px-2 py-1 text-[11px] font-medium text-slate-800 whitespace-nowrap animate-fade-in">
              <ImageIcon size={13} className="text-[#0063A3] shrink-0" />
              <span>Mat_bang_BW.jpg</span>
            </div>
          )}

          {/* 3. POPUP MÀU TRẮNG ĐƠN GIẢN 1 DÒNG TEXT HIỆN BÊN DƯỚI CHUỘT */}
          {showDimensionPopup && (
            <div className="absolute top-7 left-2 bg-white text-slate-800 text-[11px] font-medium px-2.5 py-1 rounded shadow-lg border border-slate-200 flex items-center gap-1.5 whitespace-nowrap z-50 animate-fade-in pointer-events-none select-none">
              <span>Chiều rộng tổng thể mặt bằng (9000mm)</span>
              <div className="absolute -top-1 left-3.5 w-2 h-2 bg-white border-t border-l border-slate-200 transform rotate-45" />
            </div>
          )}
        </div>
      </div>

    </div>
  );
};


// ==============================================================================
// 7. MÔ PHỎNG BƯỚC 6: HIỆU CHỈNH MODEL (BẢNG TÙY CHỌN OPENSKP MODEL INFO & TRẦN DẦM GỖ)
// ==============================================================================
export const Step6ModelEditWorkflow = ({ PRIMARY_COLOR = "#0063A3" }) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const geminiChatRef = useRef(null);
  const openskpChatRef = useRef(null);

  // Vị trí và trạng thái chuột (Xuất phát tại góc trên gần trái Viewport)
  const [cursorPos, setCursorPos] = useState({ x: 200, y: 160 });
  const [cursorDuration, setCursorDuration] = useState(0);
  const [isClicking, setIsClicking] = useState(false);

  // Bảng tùy chọn chuột phải SketchUp
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  // Popup thông báo "sao chép thông tin đối tượng trong không gian 3d"
  const [showCopiedPopup, setShowCopiedPopup] = useState(false);

  // Hội thoại Gemini bên phải
  const [infoPasted, setInfoPasted] = useState(false);
  const [geminiPrompt, setGeminiPrompt] = useState("");
  const [promptSent, setPromptSent] = useState(false);
  const [geminiThinking, setGeminiThinking] = useState(false);
  const [geminiResponded, setGeminiResponded] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  // Hội thoại OpenSkp trong SketchUp bên trái
  const [showPasteMenu, setShowPasteMenu] = useState(false);
  const [openskpInput, setOpenskpInput] = useState("");
  const [openskpSent, setOpenskpSent] = useState(false);
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

  useEffect(() => {
    if (geminiChatRef.current) {
      geminiChatRef.current.scrollTop = geminiChatRef.current.scrollHeight;
    }
  }, [promptSent, geminiThinking, geminiResponded]);

  useEffect(() => {
    if (openskpChatRef.current) {
      openskpChatRef.current.scrollTop = openskpChatRef.current.scrollHeight;
    }
  }, [openskpSent]);

  useEffect(() => {
    let timer = null;
    let isCancelled = false;

    const sleep = (ms) => new Promise((resolve) => {
      timer = setTimeout(resolve, ms);
    });

    const runLoop = async (isLooping = false) => {
      if (isCancelled) return;

      // 0. Reset về trạng thái ban đầu của Bước 6
      setShowContextMenu(false);
      setSelectedMenuItem(null);
      setShowCopiedPopup(false);
      setInfoPasted(false);
      setGeminiPrompt("");
      setPromptSent(false);
      setGeminiThinking(false);
      setGeminiResponded(false);
      setCodeCopied(false);
      setShowPasteMenu(false);
      setOpenskpInput("");
      setOpenskpSent(false);
      setIsViewportPlaying(false);
      setIsClicking(false);

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }

      // Điểm xuất phát của chuột: Góc trên gần trái Viewport
      const startSpotPos = getCenterCoords('step6-edit-target-spot') || { x: 200, y: 160 };
      if (!isLooping) {
        setCursorDuration(0);
        setCursorPos(startSpotPos);
      }

      // 1. Chuột dừng 600ms tại góc trên gần trái Viewport rồi click chuột (play video)
      await sleep(600);
      if (isCancelled) return;

      setIsClicking(true);
      await sleep(180);
      if (isCancelled) return;
      setIsClicking(false);

      // Play video ngắn & hiển thị bảng tùy chọn context menu SketchUp
      setIsViewportPlaying(true);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }

      // 350ms sau: Bảng tùy chọn hiện ra ngay vị trí click
      await sleep(350);
      if (isCancelled) return;
      setShowContextMenu(true);

      // Cho bảng hiện 300ms rồi chuột mới di chuyển chậm xuống "OpenSkp model info"
      await sleep(300);
      if (isCancelled) return;

      const menuInfoPos = getCenterCoords('step6-context-openskp-info') || { x: 250, y: 310 };
      // Chuột di xuống "OpenSkp model info" chậm thôi (1100ms)
      setCursorDuration(1100);
      setCursorPos(menuInfoPos);

      // Khi chuột đến nơi (1100ms)
      await sleep(1100);
      if (isCancelled) return;
      // Highlight khi hover vào mục
      setSelectedMenuItem('openskp_info');

      // Ngừng 1 lúc (800ms) rồi mới click
      await sleep(800);
      if (isCancelled) return;
      setIsClicking(true);
      await sleep(180);
      if (isCancelled) return;
      setIsClicking(false);

      // Click xong: Ngừng 250ms rồi MỚI ẨN BẢNG tùy chọn
      await sleep(250);
      if (isCancelled) return;
      
      // Ẩn bảng & pause video
      setShowContextMenu(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }

      // Hiện popup màu trắng ngay dưới chuột: "sao chép thông tin đối tượng trong không gian 3d"
      setShowCopiedPopup(true);

      // Dừng tại chỗ 1.0 giây để người xem thấy rõ bảng đã ẩn và popup hiện lên
      await sleep(1000);
      if (isCancelled) return;

      // RỒI MỚI DI CHUỘT SANG GEMINI (1200ms)
      const geminiInputPos = getCenterCoords('step6-edit-gemini-input') || { x: 920, y: 505 };
      setCursorDuration(1200);
      setCursorPos(geminiInputPos);

      // Khi chuột sang tới ô nhập liệu Gemini (1200ms)
      await sleep(1200);
      if (isCancelled) return;

      // Chuột nhấp vào ô nhập Gemini -> Ẩn popup và Dán thông tin đối tượng 3D
      setIsClicking(true);
      await sleep(180);
      if (isCancelled) return;
      setIsClicking(false);
      setShowCopiedPopup(false);
      setInfoPasted(true); // Đã dán thông tin đối tượng

      // Gõ lệnh: "thiết kế cho tôi dạng trần chéo dầm gỗ"
      await sleep(350);
      if (isCancelled) return;

      const fullPrompt = "thiết kế cho tôi dạng trần chéo dầm gỗ";
      for (let i = 1; i <= fullPrompt.length; i++) {
        if (isCancelled) return;
        setGeminiPrompt(fullPrompt.slice(0, i));
        await sleep(40);
      }

      // Di chuột tới nút Send của Gemini
      await sleep(300);
      if (isCancelled) return;
      const sendBtnPos = getCenterCoords('step6-edit-gemini-send-btn') || { x: 1040, y: 505 };
      setCursorDuration(380);
      setCursorPos(sendBtnPos);

      await sleep(380);
      if (isCancelled) return;
      setIsClicking(true);
      await sleep(180);
      if (isCancelled) return;
      setIsClicking(false);
      setPromptSent(true);
      setGeminiPrompt("");
      setGeminiThinking(true);

      // Gemini suy nghĩ rồi nhả ra khối mã trần chéo dầm gỗ
      await sleep(1300);
      if (isCancelled) return;
      setGeminiThinking(false);
      setGeminiResponded(true);

      // Di chuột lên nút Copy code trên khối mã
      await sleep(400);
      if (isCancelled) return;
      const copyCodePos = getCenterCoords('step6-edit-gemini-copy-code-btn') || { x: 1040, y: 400 };
      setCursorDuration(600);
      setCursorPos(copyCodePos);

      await sleep(600);
      if (isCancelled) return;
      setIsClicking(true);
      await sleep(180);
      if (isCancelled) return;
      setIsClicking(false);
      setCodeCopied(true);

      // Di chuột sang ô nhập liệu OpenSkp (SketchUp bên trái)
      await sleep(450);
      if (isCancelled) return;
      const openskpInputPos = getCenterCoords('step6-edit-openskp-input') || { x: 620, y: 505 };
      setCursorDuration(1050);
      setCursorPos(openskpInputPos);

      await sleep(1050);
      if (isCancelled) return;
      setIsClicking(true);
      await sleep(180);
      if (isCancelled) return;
      setIsClicking(false);
      setShowPasteMenu(true);

      // Di chuột lên nút Dán
      await sleep(300);
      if (isCancelled) return;
      const pasteBtnPos = getCenterCoords('step6-edit-openskp-paste-btn') || { x: openskpInputPos.x - 20, y: openskpInputPos.y - 28 };
      setCursorDuration(300);
      setCursorPos(pasteBtnPos);

      await sleep(320);
      if (isCancelled) return;
      setIsClicking(true);
      await sleep(180);
      if (isCancelled) return;
      setIsClicking(false);
      setShowPasteMenu(false);
      setOpenskpInput('ceiling.build_sloped_timber_beams(pitch: 15, spacing: 600)');

      // Di chuột sang nút Send của OpenSkp
      await sleep(400);
      if (isCancelled) return;
      const openskpSendPos = getCenterCoords('step6-edit-openskp-send-btn') || { x: 740, y: 505 };
      setCursorDuration(350);
      setCursorPos(openskpSendPos);

      await sleep(380);
      if (isCancelled) return;
      setIsClicking(true);
      await sleep(180);
      if (isCancelled) return;
      setIsClicking(false);
      setOpenskpSent(true);
      setOpenskpInput("");

      // PLAY VIDEO ĐẾN HẾT (RESUME PLAYING)
      setIsViewportPlaying(true);
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }

      // Chuột sang vị trí quan sát trên Viewport
      await sleep(500);
      if (isCancelled) return;
      const restPos = getCenterCoords('step6-edit-viewport-rest') || { x: 380, y: 460 };
      setCursorDuration(750);
      setCursorPos(restPos);

      // Video chạy đến hết (~12 giây)
      await sleep(12000);
      if (isCancelled) return;

      // Dừng 2.2 giây để người xem chiêm ngưỡng không gian trần chéo hoàn thiện
      await sleep(2200);
      if (isCancelled) return;

      // LOOP END & QUAY LẠI ĐIỂM XUẤT PHÁT
      const nextStartPos = getCenterCoords('step6-edit-target-spot') || { x: 200, y: 160 };
      setCursorDuration(1200);
      setCursorPos(nextStartPos);

      await sleep(1300);
      if (isCancelled) return;

      setIsViewportPlaying(false);
      setShowContextMenu(false);
      setSelectedMenuItem(null);
      setShowCopiedPopup(false);
      setInfoPasted(false);
      setGeminiPrompt("");
      setPromptSent(false);
      setGeminiThinking(false);
      setGeminiResponded(false);
      setCodeCopied(false);
      setShowPasteMenu(false);
      setOpenskpInput("");
      setOpenskpSent(false);

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }

      await sleep(600);
      if (isCancelled) return;
      runLoop(true);
    };

    runLoop(false);

    return () => {
      isCancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative select-none"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* KHUNG TRÁI: SKETCHUP PRO VỚI VIEWPORT (2/3) & MOCK UI PLUGIN (CẠNH PHẢI) */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm ring-1 ring-slate-900/10 overflow-hidden flex flex-col font-sans text-xs h-[540px]">
          
          {/* Title Bar SketchUp */}
          <div className="h-9 bg-[#dee1e6] border-b border-gray-300 px-3 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2">
              <img src="/sketchup-logo.svg" alt="SketchUp" className="w-4 h-4 object-contain shrink-0" />
              <span className="font-sans text-[11px] text-slate-700 font-medium">
                Untitled - SketchUp Pro 2021
              </span>
            </div>
            <WindowControls />
          </div>

          {/* Menu Bar */}
          <div className="h-9 bg-white border-b border-gray-200 px-2 flex items-center gap-3 text-[11px] text-slate-700 font-sans select-none shrink-0">
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
            <button className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-xs shrink-0 cursor-pointer" title="Offset">
              <img src="/tb_offset.jpg" alt="Offset" className="w-[22px] h-[22px] object-contain" />
            </button>
            <div className="h-5 w-[1px] bg-slate-300 mx-0.5 shrink-0" />
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
            <button className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-xs shrink-0 cursor-pointer" title="Tape Measure">
              <img src="/tb_tape.png" alt="Tape Measure" className="w-[22px] h-[22px] object-contain" />
            </button>
            <button className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-xs shrink-0 cursor-pointer" title="Paint">
              <img src="/Paint-Bucket.jpg" alt="Paint" className="w-[22px] h-[22px] object-contain" />
            </button>
            <div className="h-5 w-[1px] bg-slate-300 mx-0.5 shrink-0" />
            
            {/* Tool Icon OpenSkp */}
            <div className="p-0.5 bg-white rounded border border-[#0063A3]/40 shadow-xs flex items-center justify-center">
              <img src="/openskp_toolbar_icon.svg" alt="OpenSkp Tool" className="w-[24px] h-[24px] object-contain shrink-0" />
            </div>
          </div>

          {/* Vùng Viewport 3D và Mock Plugin UI bên phải */}
          <div className="flex-1 flex relative overflow-hidden bg-[#e8ecf1]">
            
            {/* Viewport 3D SketchUp */}
            <div className="flex-1 relative overflow-hidden bg-cover bg-center">
              {/* Ảnh placeholder trước khi chạy video */}
              <img 
                src="/preview-210226-6.jpg" 
                alt="3D Space Preview" 
                className="absolute inset-0 w-full h-full object-cover select-none"
              />

              {/* Điểm click trên Viewport (Góc trên gần trái) */}
              <div 
                id="step6-edit-target-spot"
                className="absolute left-[90px] top-[75px] w-6 h-6 rounded-full border border-blue-400/40 bg-blue-400/10 pointer-events-none" 
              />

              {/* Video phát động khi thực hiện */}
              <video 
                ref={videoRef}
                src="/210226.6.mp4" 
                muted 
                playsInline 
                className={`absolute top-0 left-0 h-full w-full object-cover transition-opacity duration-300 ${
                  isViewportPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              />
              <div id="step6-edit-viewport-rest" className="absolute bottom-6 left-6 w-2 h-2 opacity-0 pointer-events-none" />

              {/* BẢNG TÙY CHỌN CHUỘT PHẢI SKETCHUP (ĐÃ CẮT BỚT 7 DÒNG THEO YÊU CẦU) */}
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
                    className={`px-3.5 py-1 cursor-pointer font-medium transition-colors ${
                      selectedMenuItem === 'openskp_info' 
                        ? 'bg-[#0063A3] text-white' 
                        : 'bg-blue-50/70 text-[#0063A3] hover:bg-[#0063A3] hover:text-white'
                    }`}
                  >
                    OpenSkp model info
                  </div>
                </div>
              )}
            </div>

            {/* Mock UI Plugin OpenSkp */}
            <div 
              className="w-[260px] sm:w-[280px] border-l border-slate-300 bg-[#fdfbf7] flex flex-col justify-between shadow-lg relative shrink-0"
              style={{
                backgroundImage: 'linear-gradient(rgba(0, 99, 163, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 99, 163, 0.06) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                isolation: 'isolate'
              }}
            >
              <div className="relative flex items-center p-2.5 border-b border-slate-200/60 bg-white/80 backdrop-blur-md shrink-0 h-12">
                <div className="flex items-center gap-1 z-10 text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-1 text-[#0063A3]">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-4 5h8c2.76 0 5 2.24 5 5v4c0 2.76-2.24 5-5 5H8c-2.76 0-5-2.24-5-5v-4c0-2.76 2.24-5 5-5zm1 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                    <path d="M5 23 Q 12 18, 19 23 H 5 z"/>
                  </svg>
                  <span className="font-serif font-normal text-base text-[#0063A3]">OpenSkp</span>
                </div>
                <div className="absolute right-[19px] top-0 bottom-0 w-6 flex items-center justify-center z-10">
                  <span className="text-[11px] font-semibold text-slate-500">EN</span>
                </div>
              </div>

              {/* Chat Area Plugin */}
              <div ref={openskpChatRef} className="flex-1 p-3 overflow-y-auto space-y-2.5 font-sans text-xs">
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl rounded-bl-xs p-3 shadow-xs border border-slate-200/80 text-slate-800 text-xs leading-relaxed max-w-[90%]">
                    Xin chào! Bạn cần hiệu chỉnh gì hôm nay.
                  </div>
                </div>

                {openskpSent && (
                  <div className="flex justify-end animate-fade-in">
                    <div className="bg-[#0063A3] text-white rounded-2xl rounded-br-xs px-3.5 py-2 shadow-xs font-mono text-[11px] leading-relaxed max-w-[90%] break-all">
                      ceiling.build_sloped_timber_beams(pitch: 15, spacing: 600)
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Bar OpenSkp */}
              <div className="p-2.5 border-t border-slate-200/60 bg-white/90 shrink-0 relative">
                
                {/* Menu Chuột phải: Dán */}
                {showPasteMenu && (
                  <div className="absolute bottom-12 left-6 bg-white border border-slate-200 rounded-lg shadow-xl py-1 px-1 z-30 animate-fade-in">
                    <button
                      id="step6-edit-openskp-paste-btn"
                      className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded w-full text-left font-sans font-medium"
                    >
                      <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                      <span>Dán</span>
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-1.5 bg-[#f8fafc] border border-slate-300 rounded-xl px-2.5 py-1.5 focus-within:border-[#0063A3] focus-within:ring-1 focus-within:ring-[#0063A3]/20 transition-all">
                  <input
                    id="step6-edit-openskp-input"
                    type="text"
                    readOnly
                    placeholder="nhập yêu cầu"
                    value={openskpInput}
                    className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none border-none cursor-default font-mono"
                  />
                  <button
                    id="step6-edit-openskp-send-btn"
                    className="p-1.5 rounded-lg text-white bg-[#0063A3] hover:bg-blue-700 transition shrink-0 cursor-pointer"
                    title="Gửi yêu cầu"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* KHUNG PHẢI: TRÌNH DUYỆT GOOGLE GEMINI (1/3) */}
        <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm ring-1 ring-slate-900/10 overflow-hidden flex flex-col font-sans text-xs h-[540px]">
          
          {/* Chrome Tab Bar chuẩn Step 3 */}
          <div className="h-9 bg-[#dee1e6] border-b border-gray-300 px-2 flex items-end justify-between shrink-0 select-none pt-1">
            <div className="flex items-end h-full">
              <div className="h-[30px] bg-white rounded-t-lg px-2.5 flex items-center gap-1.5 shadow-xs">
                <GeminiColorfulLogo className="w-3.5 h-3.5 shrink-0" />
                <span className="font-sans text-[11px] text-slate-800 font-medium whitespace-nowrap">Google Gemini</span>
                <span className="text-slate-500 hover:text-slate-700 ml-2 text-[10px] cursor-pointer leading-none">✕</span>
              </div>
              <div className="h-[30px] px-2 flex items-center gap-1 text-slate-700 hover:bg-slate-200/50 rounded-t-lg cursor-pointer">
                <ChatGPTLogo className="w-3 h-3 shrink-0" />
                <span className="font-sans text-[10.5px] text-slate-700 whitespace-nowrap">ChatGPT</span>
              </div>
              <div className="h-3.5 w-[1px] bg-slate-400/60 mx-1 self-center shrink-0" />
              <div className="h-[30px] px-2 flex items-center gap-1 text-slate-700 hover:bg-slate-200/50 rounded-t-lg cursor-pointer">
                <ClaudeLogo className="w-3 h-3 shrink-0" />
                <span className="font-sans text-[10.5px] text-slate-700 whitespace-nowrap">Claude</span>
              </div>
            </div>
            <div className="self-center pb-1">
              <WindowControls />
            </div>
          </div>

          {/* Chrome Omnibox / URL Bar chuẩn Step 3 */}
          <div className="h-9 bg-white border-b border-gray-200 px-3 flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 text-slate-700 text-xs">
              <svg className="w-3.5 h-3.5 text-slate-700" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
              <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
            </div>
            <div className="flex-1 bg-slate-100 rounded-full px-2.5 py-0.5 text-[10px] text-slate-800 flex items-center gap-1.5 truncate">
              <svg className="w-3 h-3 text-slate-700 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="8" r="2.5"/><line x1="2" y1="8" x2="5.5" y2="8"/><line x1="10.5" y1="8" x2="22" y2="8"/></svg>
              <span className="font-sans text-[10.5px] text-slate-800 font-normal">gemini.google.com/app?hl=vi</span>
            </div>
          </div>

          {/* Vùng Chat Gemini */}
          <div className="flex-1 flex overflow-hidden">
            <div className="w-10 bg-white/70 border-r border-slate-200/70 flex flex-col items-center py-2.5 gap-2.5 shrink-0 select-none">
              <GeminiColorfulLogo className="w-5 h-5" />
              <div className="w-5 h-3 rounded-full border border-slate-700 flex items-center px-0.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              </div>
              <div className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer mt-0.5">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
              </div>
            </div>
            <div 
              className="flex-1 p-3 flex flex-col justify-between overflow-hidden relative"
              style={{ background: 'linear-gradient(180deg, #edf4fc 0%, #e2eef9 100%)' }}
            >
            
            <div ref={geminiChatRef} className="flex-1 p-3 overflow-y-auto space-y-3 font-sans text-xs">
              
              {/* Lời chào */}
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                  G
                </div>
                <div className="bg-slate-100 rounded-2xl rounded-tl-xs p-2.5 text-slate-700 leading-relaxed text-[11px]">
                  Tôi có thể giúp gì cho việc dựng hình và hiệu chỉnh 3D của bạn?
                </div>
              </div>

              {/* Tin nhắn gửi thông tin 3D và Prompt yêu cầu thiết kế trần dầm gỗ */}
              {promptSent && (
                <div className="flex flex-col items-end gap-1.5 animate-fade-in">
                  {/* Khối thông tin model 3D đã trích xuất */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl px-2.5 py-1.5 text-[10.5px] text-blue-900 font-mono flex items-center gap-1.5 max-w-[90%] shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    <span>#&lt;OpenSkp::ModelInfo: CeilingSpace_3D [w: 8.5m, h: 3.2m]&gt;</span>
                  </div>
                  {/* Tin nhắn text lệnh */}
                  <div className="bg-[#0063A3] text-white rounded-2xl rounded-tr-xs px-3 py-1.5 text-xs shadow-xs max-w-[85%] font-sans">
                    thiết kế cho tôi dạng trần chéo dầm gỗ
                  </div>
                </div>
              )}

              {/* Gemini đang suy nghĩ */}
              {geminiThinking && (
                <div className="flex items-start gap-2 animate-fade-in">
                  <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-2xs shrink-0 mt-0.5">
                    <GeminiColorfulLogo className="w-4 h-4" />
                  </div>
                  <div className="bg-slate-100 rounded-2xl rounded-tl-xs p-2.5 text-slate-700 flex items-center gap-2 text-xs">
                    <span className="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" />
                    <span className="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[11px] text-slate-500 ml-1 font-sans">Đang tạo cấu trúc trần dầm gỗ...</span>
                  </div>
                </div>
              )}

              {/* Gemini trả lời: Mã Ruby dựng trần chéo dầm gỗ */}
              {geminiResponded && (
                <div className="flex items-start gap-2 animate-fade-in">
                  <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-2xs shrink-0 mt-0.5">
                    <GeminiColorfulLogo className="w-4 h-4" />
                  </div>
                  <div className="space-y-1.5 flex-1 max-w-[90%]">
                    <div className="bg-slate-100 rounded-2xl rounded-tl-xs p-2.5 text-slate-700 text-[11px] leading-relaxed font-sans">
                      Đây là khối mã tham số trần chéo dầm gỗ tương thích cho OpenSkp:
                    </div>
                    {/* Khối code */}
                    <div className="bg-slate-900 text-slate-100 rounded-xl p-2.5 text-[10px] font-mono shadow-md relative border border-slate-800">
                      <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-700 text-[9px] text-slate-400">
                        <span>RUBY (OPENSKP API)</span>
                        <button 
                          id="step6-edit-gemini-copy-code-btn"
                          className="hover:text-white flex items-center gap-1 transition-colors px-1 py-0.5 rounded cursor-pointer"
                        >
                          {codeCopied ? (
                            <span className="text-blue-400 font-sans font-semibold">✓ Đã chép</span>
                          ) : (
                            <span className="text-blue-300 font-sans">Sao chép mã</span>
                          )}
                        </button>
                      </div>
                      <code className="text-blue-400 block whitespace-pre-wrap leading-relaxed">
                        ceiling.build_sloped_timber_beams(pitch: 15, spacing: 600)
                      </code>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Vùng nhập liệu Gemini */}
            <div className="p-3 shrink-0">
              
              {/* Hiển thị tag thông tin model 3D sau khi dán */}
              {infoPasted && !promptSent && (
                <div className="px-2 pb-1.5 flex items-center gap-2 animate-fade-in">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-2 py-1 text-[10px] text-blue-900 font-mono flex items-center gap-1 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    <span>#&lt;OpenSkp::ModelInfo: CeilingSpace_3D&gt;</span>
                  </div>
                </div>
              )}

              <div className="rounded-full border border-slate-200/90 px-3 py-1.5 bg-white flex items-center justify-between shadow-xs relative">
                <input 
                  id="step6-edit-gemini-input"
                  type="text" 
                  readOnly 
                  value={geminiPrompt} 
                  placeholder={infoPasted ? "" : "Hỏi Gemini"} 
                  className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-500 outline-none border-none cursor-default font-sans min-w-0"
                />
                <div className="flex items-center gap-2 shrink-0 select-none pl-1.5">
                  <div className="flex items-center gap-0.5 text-[11px] text-slate-700 font-medium">
                    <span>Flash</span>
                    <svg className="w-3 h-3 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                  {geminiPrompt ? (
                    <button 
                      id="step6-edit-gemini-send-btn"
                      className="w-6 h-6 rounded-full bg-[#1a73e8] text-white flex items-center justify-center shadow-xs shrink-0 hover:bg-blue-600 transition-colors"
                      title="Gửi"
                    >
                      <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
                      </svg>
                    </button>
                  ) : (
                    <svg className="w-4 h-4 text-slate-600 shrink-0 cursor-pointer hover:text-black transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
                    </svg>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>

        </div>

      </div>

      {/* CON TRỎ CHUỘT VÀ POPUP MÀU TRẮNG HIỆN DƯỚI CHUỘT */}
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

          {/* POPUP MÀU TRẮNG ĐƠN GIẢN: "sao chép thông tin đối tượng trong không gian 3d" */}
          {showCopiedPopup && (
            <div className="absolute top-7 left-2 bg-white text-slate-800 text-[11px] font-medium px-3 py-1.5 rounded shadow-xl border border-slate-200 flex items-center gap-1.5 whitespace-nowrap z-50 animate-fade-in pointer-events-none select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
              <span>sao chép thông tin đối tượng trong không gian 3d</span>
              <div className="absolute -top-1 left-3.5 w-2 h-2 bg-white border-t border-l border-slate-200 transform rotate-45" />
            </div>
          )}
        </div>
      </div>

    </div>
  );
};


export const Step2LicenseWorkflow = ({ PRIMARY_COLOR = "#0063A3", profile = null }) => {
  const licenseContainerRef = useRef(null);

  const [cursorPos, setCursorPos] = useState({ x: 260, y: 140 });
  const [cursorDuration, setCursorDuration] = useState(0);
  const [isClicking, setIsClicking] = useState(false);

  const [webCopied, setWebCopied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPasteMenu, setShowPasteMenu] = useState(false);
  const [pastedKey, setPastedKey] = useState("");
  const [isKeyActive, setIsKeyActive] = useState(false);
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
    let timer = null;
    let isCancelled = false;

    const runSimulationLoop = () => {
      if (isCancelled) return;

      const copyPos = getCenterCoords('sim-web-copy-btn') || { x: 260, y: 140 };
      setCursorDuration(0);
      setCursorPos(copyPos);
      setWebCopied(false);
      setSidebarOpen(false);
      setShowPasteMenu(false);
      setPastedKey("");
      setIsKeyActive(false);
      setBubbleShown(false);
      setIsClicking(false);

      // 1. Dừng 600ms tại nút Copy rồi click
      timer = setTimeout(() => {
        if (isCancelled) return;
        setIsClicking(true);

        timer = setTimeout(() => {
          if (isCancelled) return;
          setIsClicking(false);
          setWebCopied(true);

          timer = setTimeout(() => {
            if (isCancelled) return;
            // 2. Di chuột sang nút Hamburger của Plugin
            const hamburgerPos = getCenterCoords('sim-plugin-hamburger-btn') || { x: 550, y: 35 };
            setCursorDuration(1000);
            setCursorPos(hamburgerPos);

            timer = setTimeout(() => {
              if (isCancelled) return;
              setIsClicking(true);

              timer = setTimeout(() => {
                if (isCancelled) return;
                setIsClicking(false);
                setSidebarOpen(true);

                timer = setTimeout(() => {
                  if (isCancelled) return;
                  // 3. Di chuột đến ô nhập License Key
                  const inputPos = getCenterCoords('sim-plugin-license-input') || { x: 620, y: 310 };
                  setCursorDuration(800);
                  setCursorPos(inputPos);

                  timer = setTimeout(() => {
                    if (isCancelled) return;
                    setIsClicking(true);

                    timer = setTimeout(() => {
                      if (isCancelled) return;
                      setIsClicking(false);
                      setShowPasteMenu(true);

                      timer = setTimeout(() => {
                        if (isCancelled) return;
                        const pastePos = getCenterCoords('sim-plugin-paste-btn') || { x: inputPos.x - 20, y: inputPos.y - 30 };
                        setCursorDuration(350);
                        setCursorPos(pastePos);

                        timer = setTimeout(() => {
                          if (isCancelled) return;
                          setIsClicking(true);

                          timer = setTimeout(() => {
                            if (isCancelled) return;
                            setIsClicking(false);
                            setShowPasteMenu(false);
                            setPastedKey("SKP-8829-X");
                            setIsKeyActive(true);

                            timer = setTimeout(() => {
                              if (isCancelled) return;
                              // 4. Di chuột tới nút đóng ✕
                              const closePos = getCenterCoords('sim-plugin-close-btn') || { x: 740, y: 65 };
                              setCursorDuration(750);
                              setCursorPos(closePos);

                              timer = setTimeout(() => {
                                if (isCancelled) return;
                                setIsClicking(true);

                                timer = setTimeout(() => {
                                  if (isCancelled) return;
                                  setIsClicking(false);
                                  setSidebarOpen(false);
                                  setBubbleShown(true);

                                  // Giữ kết quả 4.5 giây cho người xem theo dõi
                                  timer = setTimeout(() => {
                                    if (isCancelled) return;
                                    
                                    const nextCopyPos = getCenterCoords('sim-web-copy-btn') || { x: 260, y: 140 };
                                    setCursorDuration(1200);
                                    setCursorPos(nextCopyPos);

                                    timer = setTimeout(() => {
                                      if (isCancelled) return;

                                      setBubbleShown(false);
                                      setPastedKey("");
                                      setWebCopied(false);
                                      setIsKeyActive(false);

                                      timer = setTimeout(() => {
                                        if (isCancelled) return;
                                        runSimulationLoop();
                                      }, 600);

                                    }, 1300);
                                  }, 4500);
                                }, 180);
                              }, 850);
                            }, 700);
                          }, 180);
                        }, 450);
                      }, 350);
                    }, 180);
                  }, 900);
                }, 400);
              }, 180);
            }, 1100);
          }, 600);
        }, 180);
      }, 600);
    };

    runSimulationLoop();

    return () => {
      isCancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [profile]);

  return (
    <div 
      ref={licenseContainerRef}
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative select-none"
    >
      {/* CỘT 1: Cửa sổ Web Portal (h-[540px] đồng bộ chuẩn) */}
      <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm ring-1 ring-slate-900/10 overflow-hidden flex flex-col font-sans text-xs h-[540px]">
        {/* Chrome Tab Bar */}
        <div className="h-9 bg-[#dee1e6] border-b border-gray-300 px-2 flex items-end justify-between shrink-0 select-none pt-1">
          <div className="flex items-end h-full">
            <div className="h-[30px] bg-white rounded-t-lg px-3 flex items-center gap-2 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#0063A3]" />
              <span className="font-sans text-[11px] text-slate-800 font-medium whitespace-nowrap">OpenSkp Portal - License</span>
            </div>
          </div>
          <div className="self-center pb-1">
            <WindowControls />
          </div>
        </div>

        {/* URL Bar */}
        <div className="h-9 bg-white border-b border-gray-200 px-3 flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
          </div>
          <div className="flex-1 bg-slate-100 rounded-full px-3 py-0.5 text-[11px] text-slate-700 flex items-center gap-1.5">
            <span className="text-slate-400">🔒</span>
            <span>openskp.com/portal/license</span>
          </div>
        </div>

        {/* Portal Content */}
        <div className="flex-1 p-6 bg-slate-50 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-800">Quản lý bản quyền thiết bị</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Sao chép License Key từ tài khoản Web Portal của bạn để kích hoạt bản quyền thiết bị trong Plugin OpenSkp.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Trạng thái:</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200">
                  Đã kích hoạt
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Thiết bị đăng ký:</span>
                <span className="font-mono text-slate-700 font-medium">PC-Workstation-01</span>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">LICENSE KEY</span>
                <div className="mt-1 flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                  <span className="font-mono font-bold text-xs text-slate-800 tracking-wider">SKP-8829-X</span>
                  <button 
                    id="sim-web-copy-btn"
                    className="text-[#0063A3] hover:text-blue-700 transition p-1 rounded hover:bg-blue-50 shrink-0 cursor-pointer flex items-center gap-1 text-[11px] font-medium"
                    title="Sao chép License Key"
                  >
                    {webCopied ? (
                      <>
                        <CheckCircle2 size={13} className="text-blue-600" />
                        <span className="text-blue-600">Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Sao chép</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 text-center">
            Bản quyền cấp phép chính hãng bởi OpenSkp System
          </div>
        </div>
      </div>

      {/* CỘT 2: Mock UI Plugin (h-[540px] đồng bộ chuẩn) */}
      <div className="lg:col-span-7 w-full h-[540px]">
        <MockPluginUI 
          showSidebar={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          licenseKey={pastedKey}
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
        </div>
      </div>

    </div>
  );
};



const STEPS_NAV_ITEMS = [
  { id: 1, shortTitle: "Cài đặt Plugin", fullTitle: "Bước 1: Tải Về & Cài Đặt Plugin Vào SketchUp" },
  { id: 2, shortTitle: "Kích hoạt License", fullTitle: "Bước 2: Kích Hoạt Bản Quyền Thiết Bị" },
  { id: 3, shortTitle: "Nạp Kỹ năng AI", fullTitle: 'Bước 3: Cung Cấp Kỹ Năng Dựng Hình "Skill" Cho AI' },
  { id: 4, shortTitle: "Dựng model", fullTitle: "Bước 4: Điều Phối Dựng Cấu Kiện & Nội Thất Bằng AI" },
  { id: 5, shortTitle: "Dựng từ Mặt bằng 2D", fullTitle: "Bước 5: Dựng Không Gian 3D Từ Ảnh Mặt Bằng 2D" },
  { id: 6, shortTitle: "Hiệu chỉnh model", fullTitle: "Bước 6: Hiệu Chỉnh Không Gian & Cấu Kiện Model Bằng AI" },
];


export const InteractiveGuideSection = ({ 
  PRIMARY_COLOR = "#0063A3",
  profile = null,
  onBackHome
}) => {
  const [activeStep, setActiveStep] = useState(1);

  const handleStepChange = (stepId) => {
    setActiveStep(stepId);
    setTimeout(() => {
      document.getElementById('guide-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return (
    <div id="guide-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-6 animate-fade-in relative z-20">
      
      {/* THANH TABS CHỌN BƯỚC: BỐ CỤC TINH GỌN, KHÔNG TRÙNG LẶP SỐ */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1.5 overflow-x-auto select-none no-scrollbar">
        {onBackHome && (
          <button
            onClick={onBackHome}
            className="py-2 px-3 rounded-xl text-xs font-semibold text-slate-500 hover:text-[#0063A3] hover:bg-slate-100 flex items-center gap-1 shrink-0 transition-colors cursor-pointer mr-1"
            title="Quay về trang chủ"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
            <span>Trang chủ</span>
          </button>
        )}

        {STEPS_NAV_ITEMS.map((step) => {
          const isActive = activeStep === step.id;
          return (
            <button
              key={step.id}
              onClick={() => handleStepChange(step.id)}
              className={`flex-1 min-w-[125px] sm:min-w-[145px] py-2 px-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
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

      {/* NỘI DUNG TỪNG TRANG: CÙNG 1 CHIỀU DÀI CỐ ĐỊNH (h-[730px] min-h-[730px]) KHÔNG BỊ NHẢY HÌNH */}
      <div className="w-full">
        {activeStep === 1 && (
          <div className="bg-white rounded-3xl shadow-lg ring-1 ring-slate-900/10 p-6 sm:p-10 flex flex-col justify-between animate-fade-in h-[730px] min-h-[730px] overflow-hidden">
            <div>
              <div className="h-[90px] shrink-0 overflow-hidden">
                <h2 
                  className="text-2xl sm:text-3xl font-serif font-normal leading-tight tracking-tight text-slate-800"
                  style={{ fontFamily: "'Crimson Pro', Georgia, serif", color: PRIMARY_COLOR, fontWeight: 400 }}
                >
                  Bước 1: Tải Về & Cài Đặt Plugin Vào SketchUp
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-2 max-w-4xl text-justify">
                  Tải gói cài đặt file <code>Openskp.rar</code> từ website, giải nén ra <code>Openskp.rbz</code>, sau đó mở SketchUp vào menu <strong>Extensions &gt; Extension Manager</strong> bấm <strong>Install Extension</strong> để kích hoạt thanh công cụ OpenSkp trên Viewport.
                </p>
              </div>
              <div className="mt-4 h-[540px] shrink-0">
                <MockInstallWorkflow PRIMARY_COLOR={PRIMARY_COLOR} />
              </div>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="bg-white rounded-3xl shadow-lg ring-1 ring-slate-900/10 p-6 sm:p-10 flex flex-col justify-between animate-fade-in h-[730px] min-h-[730px] overflow-hidden">
            <div>
              <div className="h-[90px] shrink-0 overflow-hidden">
                <h2 
                  className="text-2xl sm:text-3xl font-serif font-normal leading-tight tracking-tight text-slate-800"
                  style={{ fontFamily: "'Crimson Pro', Georgia, serif", color: PRIMARY_COLOR, fontWeight: 400 }}
                >
                  Bước 2: Kích Hoạt Bản Quyền Thiết Bị
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-2 max-w-4xl text-justify">
                  Sao chép License Key từ tài khoản Web Portal của bạn, mở thanh công cụ bên trong Plugin OpenSkp và dán mã để kích hoạt bản quyền thiết bị.
                </p>
              </div>
              <div className="mt-4 h-[540px] shrink-0">
                <Step2LicenseWorkflow PRIMARY_COLOR={PRIMARY_COLOR} profile={profile} />
              </div>
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="bg-white rounded-3xl shadow-lg ring-1 ring-slate-900/10 p-6 sm:p-10 flex flex-col justify-between animate-fade-in h-[730px] min-h-[730px] overflow-hidden">
            <div>
              <div className="h-[90px] shrink-0 overflow-hidden">
                <h2 
                  className="text-2xl sm:text-3xl font-serif font-normal leading-tight tracking-tight text-slate-800"
                  style={{ fontFamily: "'Crimson Pro', Georgia, serif", color: PRIMARY_COLOR, fontWeight: 400 }}
                >
                  Bước 3: Cung Cấp Kỹ Năng Dựng Hình "Skill" Cho AI
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-2 max-w-4xl text-justify">
                  Giải nén gói <code>OpenSkp.rar</code> để nhận file tài liệu kỹ năng <code>Skill Openskp.txt</code>. Kéo thả file này vào khung chat Gemini trên trình duyệt và gửi yêu cầu <em>"Đọc hiểu tài liệu này"</em> để trang bị toàn bộ năng lực đọc hiểu bản vẽ và phương pháp xuất lệnh 3D cho AI.
                </p>
              </div>
              <div className="mt-4 h-[540px] shrink-0">
                <GeminiSkillWorkflow PRIMARY_COLOR={PRIMARY_COLOR} />
              </div>
            </div>
          </div>
        )}

        {activeStep === 4 && (
          <div className="bg-white rounded-3xl shadow-lg ring-1 ring-slate-900/10 p-6 sm:p-10 flex flex-col justify-between animate-fade-in h-[730px] min-h-[730px] overflow-hidden">
            <div>
              <div className="h-[90px] shrink-0 overflow-hidden">
                <h2 
                  className="text-2xl sm:text-3xl font-serif font-normal leading-tight tracking-tight text-slate-800"
                  style={{ fontFamily: "'Crimson Pro', Georgia, serif", color: PRIMARY_COLOR, fontWeight: 400 }}
                >
                  Bước 4: Dựng Model Cấu Kiện & Nội Thất Bằng AI
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-2 max-w-4xl text-justify">
                  Gửi ảnh mẫu thiết kế vào Google Gemini để AI xuất khối mã tham số Ruby dựng cấu kiện ban đầu trên Viewport SketchUp. Sau đó sao chép đoạn mã dán vào OpenSkp để hệ thống tự động dựng hình chuẩn xác từng chi tiết trực tiếp trên Viewport.
                </p>
              </div>
              <div className="mt-4 h-[540px] shrink-0">
                <Step4AiWorkflow PRIMARY_COLOR={PRIMARY_COLOR} />
              </div>
            </div>
          </div>
        )}

        {activeStep === 5 && (
          <div className="bg-white rounded-3xl shadow-lg ring-1 ring-slate-900/10 p-6 sm:p-10 flex flex-col justify-between animate-fade-in h-[730px] min-h-[730px] overflow-hidden">
            <div>
              <div className="h-[90px] shrink-0 overflow-hidden">
                <h2 
                  className="text-2xl sm:text-3xl font-serif font-normal leading-tight tracking-tight text-slate-800"
                  style={{ fontFamily: "'Crimson Pro', Georgia, serif", color: PRIMARY_COLOR, fontWeight: 400 }}
                >
                  Bước 5: Dựng Không Gian 3D Từ Ảnh Mặt Bằng 2D
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-2 max-w-4xl text-justify">
                  Chuyển đổi ảnh mặt bằng có màu sang đen trắng chuẩn nét bằng Google Gemini. Sau đó kéo thả ảnh đen trắng trực tiếp sang ô nhập liệu OpenSkp và nhập chiều rộng tổng thể mặt bằng (9000mm) để hệ thống tự động trích xuất tường, cột, sàn, cửa và dựng hình không gian 3D hoàn chỉnh trên SketchUp.
                </p>
              </div>
              <div className="mt-4 h-[540px] shrink-0">
                <Step6FloorplanWorkflow PRIMARY_COLOR={PRIMARY_COLOR} />
              </div>
            </div>
          </div>
        )}

        {activeStep === 6 && (
          <div className="bg-white rounded-3xl shadow-lg ring-1 ring-slate-900/10 p-6 sm:p-10 flex flex-col justify-between animate-fade-in h-[730px] min-h-[730px] overflow-hidden">
            <div>
              <div className="h-[90px] shrink-0 overflow-hidden">
                <h2 
                  className="text-2xl sm:text-3xl font-serif font-normal leading-tight tracking-tight text-slate-800"
                  style={{ fontFamily: "'Crimson Pro', Georgia, serif", color: PRIMARY_COLOR, fontWeight: 400 }}
                >
                  Bước 6: Hiệu Chỉnh Không Gian & Cấu Kiện Model Bằng AI
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-2 max-w-4xl text-justify">
                  Nhấp chuột vào đối tượng trong Viewport SketchUp để mở bảng tùy chọn và trích xuất thông tin đối tượng 3D ("OpenSkp model info"). Dán thông tin vào Gemini và ra lệnh ngôn ngữ tự nhiên để thiết kế trần chéo dầm gỗ, sau đó đồng bộ mã cập nhật trực tiếp lên mô hình 3D.
                </p>
              </div>
              <div className="mt-4 h-[540px] shrink-0">
                <Step6ModelEditWorkflow PRIMARY_COLOR={PRIMARY_COLOR} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* THANH ĐIỀU HƯỚNG CHUYỂN BƯỚC DƯỚI ĐÁY TRANG (BOTTOM NAV) */}
      {/* NÚT TỐI GIẢN, 2 MÀU CHỦ ĐẠO, ÍT CHỮ THEO ĐÚNG YÊU CẦU */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <div>
          {activeStep > 1 ? (
            <button
              onClick={() => handleStepChange(activeStep - 1)}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#0063A3] bg-white border border-slate-300 hover:border-[#0063A3] px-4 py-2 rounded-xl shadow-xs hover:bg-slate-50 transition cursor-pointer select-none"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
              <span>Trước</span>
            </button>
          ) : <div />}
        </div>

        {/* Các chấm tiến trình (6 bước) */}
        <div className="flex items-center gap-1.5">
          {STEPS_NAV_ITEMS.map((s) => (
            <button
              key={s.id}
              onClick={() => handleStepChange(s.id)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                activeStep === s.id ? 'w-6 bg-[#0063A3]' : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
              title={s.shortTitle}
            />
          ))}
        </div>

        <div>
          {activeStep < 6 ? (
            <button
              onClick={() => handleStepChange(activeStep + 1)}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white bg-[#0063A3] hover:bg-blue-700 px-5 py-2 rounded-xl shadow-xs transition cursor-pointer select-none"
            >
              <span>Tiếp theo</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
            </button>
          ) : (
            <button
              onClick={() => onBackHome?.()}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white bg-[#0063A3] hover:bg-blue-700 px-5 py-2 rounded-xl shadow-xs transition cursor-pointer select-none"
            >
              <span>Hoàn tất</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
            </button>
          )}
        </div>
      </div>

    </div>
  );
};

