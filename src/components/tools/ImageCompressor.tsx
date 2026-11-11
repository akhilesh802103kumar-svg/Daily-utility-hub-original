import React, { useState, useRef, useEffect } from 'react';
import JSZip from 'jszip';
import { validateFileSize, triggerSafeDownload } from '../../utils/security';
import {
  Image as ImageIcon,
  Upload,
  Download,
  Sliders,
  Check,
  RefreshCw,
  Sparkles,
  Maximize2,
  Trash2,
  Layers,
  RotateCcw,
  Target,
  ArrowRight,
  Eye,
  AlertCircle
} from 'lucide-react';

export type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp';

export interface ImageQueueItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  originalDataUrl: string;

  // Processed state
  targetWidth: number;
  targetHeight: number;
  quality: number; // 10 to 100
  format: OutputFormat;
  compressedDataUrl: string | null;
  compressedSize: number;
  isProcessing: boolean;
  savingsPercent: number;
}

export const ImageCompressor: React.FC = () => {
  const [images, setImages] = useState<ImageQueueItem[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  // Global batch settings
  const [globalFormat, setGlobalFormat] = useState<OutputFormat>('image/jpeg');
  const [globalQuality, setGlobalQuality] = useState<number>(75);
  const [lockAspect, setLockAspect] = useState<boolean>(true);

  // Target file size mode
  const [useTargetSize, setUseTargetSize] = useState<boolean>(false);
  const [targetSizeKB, setTargetSizeKB] = useState<number>(150);

  // Status and Alerts
  const [isBatchProcessing, setIsBatchProcessing] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Helper: Format bytes
  const formatBytes = (bytes: number) => {
    if (bytes <= 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  // Helper to load sample image for instant testing
  useEffect(() => {
    if (images.length === 0) {
      loadSampleImage();
    }
  }, []);

  const loadSampleImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Scenic gradient background
      const grad = ctx.createLinearGradient(0, 0, 1600, 1000);
      grad.addColorStop(0, '#1456D9');
      grad.addColorStop(0.5, '#6D35D5');
      grad.addColorStop(1, '#FF9D24');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1600, 1000);

      // Artwork and shapes
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(800, 420, 180, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.beginPath();
      ctx.moveTo(100, 1000);
      ctx.lineTo(550, 480);
      ctx.lineTo(1050, 1000);
      ctx.fill();

      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.beginPath();
      ctx.moveTo(600, 1000);
      ctx.lineTo(1100, 520);
      ctx.lineTo(1600, 1000);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText('Daily Utility Hub • High-Resolution Test Image', 80, 120);

      canvas.toBlob((blob) => {
        if (blob) {
          const sampleFile = new File([blob], 'sample_scenery.jpg', { type: 'image/jpeg' });
          addFilesToQueue([sampleFile]);
        }
      }, 'image/jpeg', 0.95);
    }
  };

  // File Upload handler (Single or Batch)
  const handleFilesSelected = (fileList: FileList | File[]) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) {
      setErrorMessage('Please select valid image files (JPG, PNG, WebP, etc.).');
      return;
    }

    if (images.length + files.length > 15) {
      setErrorMessage('To ensure smooth memory performance on mobile devices, you can process up to 15 images at a time.');
      return;
    }

    const validFiles: File[] = [];
    for (const f of files) {
      const sizeValidation = validateFileSize(f, 30);
      if (!sizeValidation.valid) {
        setErrorMessage(sizeValidation.error || 'Image file exceeds size limit.');
        continue;
      }
      validFiles.push(f);
    }

    if (validFiles.length > 0) {
      addFilesToQueue(validFiles);
    }
  };

  const addFilesToQueue = (files: File[]) => {
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const id = `${Date.now()}-${Math.random()}`;
          const item: ImageQueueItem = {
            id,
            file,
            name: file.name,
            originalSize: file.size,
            originalWidth: img.width,
            originalHeight: img.height,
            originalDataUrl: dataUrl,
            targetWidth: img.width,
            targetHeight: img.height,
            quality: globalQuality,
            format: globalFormat,
            compressedDataUrl: null,
            compressedSize: 0,
            isProcessing: false,
            savingsPercent: 0,
          };

          setImages((prev) => {
            const next = [...prev, item];
            if (!selectedImageId) setSelectedImageId(id);
            return next;
          });

          // Process immediately
          processSingleImage(item);
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    });
  };

  // Process an individual image (with optional target file size binary search!)
  const processSingleImage = async (item: ImageQueueItem, overrides?: Partial<ImageQueueItem>) => {
    const current = { ...item, ...overrides };
    const w = current.targetWidth;
    const h = current.targetHeight;
    const fmt = current.format;
    let q = current.quality / 100;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise((resolve) => {
      img.onload = resolve;
      img.src = current.originalDataUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // If converting PNG to JPG, fill white background to avoid black transparency
    if (fmt === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);
    }
    ctx.drawImage(img, 0, 0, w, h);

    let compressedUrl = '';
    let approxBytes = 0;

    // TARGET FILE SIZE BINARY SEARCH ALGORITHM
    if (useTargetSize && targetSizeKB > 0 && fmt !== 'image/png') {
      const targetBytes = targetSizeKB * 1024;
      let low = 0.05;
      let high = 0.98;
      let bestUrl = canvas.toDataURL(fmt, 0.5);
      let bestBytes = Math.round((bestUrl.length - 22) * 0.75);

      for (let i = 0; i < 6; i++) {
        const mid = (low + high) / 2;
        const testUrl = canvas.toDataURL(fmt, mid);
        const testBytes = Math.round((testUrl.length - 22) * 0.75);

        bestUrl = testUrl;
        bestBytes = testBytes;

        if (testBytes > targetBytes) {
          high = mid;
        } else {
          low = mid;
        }
      }
      compressedUrl = bestUrl;
      approxBytes = bestBytes;
      q = Math.round(((low + high) / 2) * 100);
    } else {
      compressedUrl = canvas.toDataURL(fmt, q);
      approxBytes = Math.round((compressedUrl.length - 22) * 0.75);
    }

    const savings = Math.max(
      0,
      Math.round(((current.originalSize - approxBytes) / current.originalSize) * 100)
    );

    setImages((prev) =>
      prev.map((imgItem) =>
        imgItem.id === current.id
          ? {
              ...current,
              compressedDataUrl: compressedUrl,
              compressedSize: approxBytes,
              savingsPercent: savings,
              quality: Math.round(q * 100),
            }
          : imgItem
      )
    );
  };

  // Re-run processing for all images with global settings
  const handleApplyGlobalSettings = () => {
    setIsBatchProcessing(true);
    images.forEach((img) => {
      processSingleImage(img, {
        format: globalFormat,
        quality: globalQuality,
      });
    });
    setTimeout(() => {
      setIsBatchProcessing(false);
      setSuccessMessage('Updated settings applied to all images!');
    }, 400);
  };

  // Download a single processed image
  const handleDownloadSingle = (item: ImageQueueItem) => {
    if (!item.compressedDataUrl) return;
    const ext = item.format === 'image/webp' ? 'webp' : item.format === 'image/png' ? 'png' : 'jpg';
    const baseName = item.name.substring(0, item.name.lastIndexOf('.')) || item.name;
    triggerSafeDownload(item.compressedDataUrl, `${baseName}_compressed.${ext}`);
  };

  // Download all processed images as a ZIP
  const handleDownloadAllAsZip = async () => {
    if (images.length === 0) return;
    setIsZipping(true);
    try {
      const zip = new JSZip();
      for (const item of images) {
        if (item.compressedDataUrl) {
          const base64Data = item.compressedDataUrl.replace(/^data:image\/(jpeg|png|webp);base64,/, '');
          const ext = item.format === 'image/webp' ? 'webp' : item.format === 'image/png' ? 'png' : 'jpg';
          const baseName = item.name.substring(0, item.name.lastIndexOf('.')) || item.name;
          zip.file(`${baseName}_compressed.${ext}`, base64Data, { base64: true });
        }
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      triggerSafeDownload(zipBlob, `compressed_images_${Date.now()}.zip`);
      setSuccessMessage(`Exported ${images.length} images into a ZIP archive!`);
    } catch (err: any) {
      setErrorMessage(`ZIP Export failed: ${err.message}`);
    } finally {
      setIsZipping(false);
    }
  };

  // Reset entire image workspace
  const handleReset = () => {
    setImages([]);
    setSelectedImageId(null);
    setErrorMessage(null);
    setSuccessMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Currently inspected image
  const activeImage = images.find((i) => i.id === selectedImageId) || images[0] || null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden text-[#172554]">
      {/* Tool Header */}
      <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-emerald-50/50 via-white to-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#172554]">Image Compressor & Converter</h2>
            <p className="text-xs text-[#64748B]">
              JPG/PNG/WebP compression, custom dimensions, target file size & batch processing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition active:scale-[0.98]"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Images</span>
          </button>
          <button
            onClick={loadSampleImage}
            className="p-2.5 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 transition"
            title="Load Sample Image"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* DRAG & DROP UPLOAD BOX */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files) handleFilesSelected(e.dataTransfer.files);
          }}
          className="border-2 border-dashed border-slate-300 hover:border-emerald-400 bg-slate-50/70 hover:bg-emerald-50/20 rounded-3xl p-6 text-center transition flex flex-col items-center justify-center gap-2.5 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => {
              if (e.target.files) handleFilesSelected(e.target.files);
            }}
            className="hidden"
          />
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-emerald-600 flex items-center justify-center shadow-sm">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#172554]">
              Drag and drop image files here for batch or single processing
            </h3>
            <p className="text-xs text-[#64748B]">Supports JPG, PNG, and WebP · 100% Client-Side RAM</p>
          </div>
        </div>

        {/* ALERTS */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-xs font-semibold">
            <Check className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* BATCH CONTROLS & QUEUE BAR */}
        {images.length > 0 && (
          <div className="p-5 bg-slate-50 rounded-3xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#172554]">
                  Queue ({images.length} Image{images.length !== 1 ? 's' : ''})
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  Total Size: {formatBytes(images.reduce((a, b) => a + b.originalSize, 0))}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadAllAsZip}
                  disabled={isZipping || images.length === 0}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isZipping ? 'Zipping...' : 'Download All as ZIP'}</span>
                </button>
                <button
                  onClick={handleReset}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-200 hover:bg-slate-300 transition"
                >
                  Clear Queue
                </button>
              </div>
            </div>

            {/* Thumbnail Carousel */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {images.map((img) => (
                <div
                  key={img.id}
                  onClick={() => setSelectedImageId(img.id)}
                  className={`relative shrink-0 w-28 p-2 rounded-2xl border cursor-pointer transition ${
                    activeImage?.id === img.id
                      ? 'border-emerald-500 bg-white ring-2 ring-emerald-500/20 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="w-full h-16 rounded-xl bg-slate-100 overflow-hidden mb-1">
                    <img src={img.originalDataUrl} alt={img.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-bold text-[#172554] block truncate">{img.name}</span>
                  <div className="flex justify-between items-center text-[9px] text-slate-500 mt-0.5">
                    <span>{formatBytes(img.compressedSize || img.originalSize)}</span>
                    <span className="text-emerald-600 font-bold">-{img.savingsPercent}%</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setImages((prev) => prev.filter((i) => i.id !== img.id));
                    }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs shadow-sm hover:scale-110"
                    title="Remove"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACTIVE IMAGE WORKSPACE */}
        {activeImage && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Controls Column */}
            <div className="lg:col-span-5 space-y-4">
              {/* Savings Stat Card */}
              <div className="p-4 bg-emerald-50/70 rounded-3xl border border-emerald-100 grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Original</span>
                  <p className="text-sm font-extrabold text-[#172554] mt-0.5">
                    {formatBytes(activeImage.originalSize)}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Compressed</span>
                  <p className="text-sm font-extrabold text-emerald-600 mt-0.5">
                    {formatBytes(activeImage.compressedSize)}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Reduction</span>
                  <p className="text-sm font-extrabold text-[#1456D9] mt-0.5">
                    -{activeImage.savingsPercent}%
                  </p>
                </div>
              </div>

              {/* Conversion Format Options */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-[#172554]">Convert Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'image/jpeg', label: 'JPG / JPEG' },
                    { id: 'image/webp', label: 'WebP (Modern)' },
                    { id: 'image/png', label: 'PNG' },
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      onClick={() => {
                        setGlobalFormat(fmt.id as OutputFormat);
                        processSingleImage(activeImage, { format: fmt.id as OutputFormat });
                      }}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition ${
                        activeImage.format === fmt.id
                          ? 'bg-white text-emerald-700 border-emerald-500 shadow-sm'
                          : 'bg-white/70 text-slate-600 border-slate-200 hover:bg-white'
                      }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality or Target File Size Mode */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#172554]">Compression Control</span>
                  <button
                    onClick={() => {
                      setUseTargetSize(!useTargetSize);
                      processSingleImage(activeImage);
                    }}
                    className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <Target className="w-3 h-3" />
                    <span>{useTargetSize ? 'Switch to Quality Slider' : 'Set Target File Size'}</span>
                  </button>
                </div>

                {useTargetSize ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span>Target File Size</span>
                      <span className="font-mono text-emerald-700 font-bold">{targetSizeKB} KB</span>
                    </div>
                    <div className="flex gap-2">
                      {[50, 100, 200, 500].map((kb) => (
                        <button
                          key={kb}
                          onClick={() => {
                            setTargetSizeKB(kb);
                            processSingleImage(activeImage);
                          }}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold border ${
                            targetSizeKB === kb
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          {kb} KB
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span>Quality Level</span>
                      <span className="font-mono text-emerald-700 font-bold">{activeImage.quality}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={activeImage.quality}
                      onChange={(e) => {
                        const q = Number(e.target.value);
                        setGlobalQuality(q);
                        processSingleImage(activeImage, { quality: q });
                      }}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Max Compression (10%)</span>
                      <span>Balanced (75%)</span>
                      <span>High Fidelity (100%)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Resize Dimensions */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>Resize Dimensions (px)</span>
                  <label className="flex items-center gap-1 text-[11px] font-normal text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={lockAspect}
                      onChange={(e) => setLockAspect(e.target.checked)}
                      className="rounded text-emerald-600"
                    />
                    Lock Ratio
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Width</label>
                    <input
                      type="number"
                      value={activeImage.targetWidth}
                      onChange={(e) => {
                        const w = Number(e.target.value);
                        let h = activeImage.targetHeight;
                        if (lockAspect && activeImage.originalWidth > 0) {
                          h = Math.round((w / activeImage.originalWidth) * activeImage.originalHeight);
                        }
                        processSingleImage(activeImage, { targetWidth: w, targetHeight: h });
                      }}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono outline-none bg-white focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Height</label>
                    <input
                      type="number"
                      value={activeImage.targetHeight}
                      onChange={(e) => {
                        const h = Number(e.target.value);
                        let w = activeImage.targetWidth;
                        if (lockAspect && activeImage.originalHeight > 0) {
                          w = Math.round((h / activeImage.originalHeight) * activeImage.originalWidth);
                        }
                        processSingleImage(activeImage, { targetWidth: w, targetHeight: h });
                      }}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono outline-none bg-white focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleDownloadSingle(activeImage)}
                  disabled={!activeImage.compressedDataUrl}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-md shadow-emerald-600/20 active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download This Compressed Image</span>
                </button>

                {images.length > 1 && (
                  <button
                    onClick={handleApplyGlobalSettings}
                    disabled={isBatchProcessing}
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition"
                  >
                    Apply Current Settings to All {images.length} Images
                  </button>
                )}
              </div>
            </div>

            {/* Right Preview Column */}
            <div className="lg:col-span-7 flex flex-col justify-between p-5 bg-slate-50 rounded-3xl border border-slate-200">
              <div>
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-bold text-[#172554]">Interactive Live Preview</span>
                  <span className="text-[11px] text-slate-500">
                    Dimensions: {activeImage.targetWidth} × {activeImage.targetHeight} px
                  </span>
                </div>

                <div className="relative w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center min-h-[320px] max-h-[460px]">
                  {activeImage.compressedDataUrl ? (
                    <img
                      src={activeImage.compressedDataUrl}
                      alt="Compressed preview"
                      className="w-full h-auto max-h-[440px] object-contain"
                    />
                  ) : (
                    <div className="text-slate-400 text-xs">Processing preview...</div>
                  )}

                  <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md text-emerald-400 text-xs font-bold">
                    Saved {activeImage.savingsPercent}% · {formatBytes(activeImage.compressedSize)}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#64748B]">
                <span>
                  Format: {activeImage.format.replace('image/', '').toUpperCase()} · File: {activeImage.name}
                </span>
                <span>Runs securely on your device</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
