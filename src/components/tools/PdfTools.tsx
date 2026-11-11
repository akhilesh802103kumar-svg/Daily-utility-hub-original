import React, { useState, useRef, useEffect } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import JSZip from 'jszip';
import { validateFileSize, triggerSafeDownload } from '../../utils/security';
import {
  FileText,
  Upload,
  Plus,
  Trash2,
  Download,
  FileCheck,
  Search,
  Check,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Layers,
  Scissors,
  Minimize2,
  Image as ImageIcon,
  Eye,
  RotateCcw,
  Sparkles,
  Loader2,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

type PdfToolMode =
  | 'merge'
  | 'split'
  | 'compress'
  | 'jpg-to-pdf'
  | 'png-to-pdf'
  | 'pdf-to-jpg'
  | 'preview';

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  pages?: number;
  previewUrl?: string;
  dataUrl?: string;
}

interface ConvertedPage {
  pageNumber: number;
  dataUrl: string;
  width: number;
  height: number;
}

export const PdfTools: React.FC = () => {
  const [activeMode, setActiveMode] = useState<PdfToolMode>('merge');

  // Shared status states
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Downloadable result state
  const [resultBlobUrl, setResultBlobUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState<string>('');
  const [resultFileSize, setResultFileSize] = useState<number>(0);

  // File lists per mode
  const [mergeFiles, setMergeFiles] = useState<UploadedFile[]>([]);
  const [singlePdfFile, setSinglePdfFile] = useState<UploadedFile | null>(null);
  const [imageFiles, setImageFiles] = useState<UploadedFile[]>([]);

  // Split options
  const [splitMode, setSplitMode] = useState<'range' | 'all'>('range');
  const [splitRange, setSplitRange] = useState('1-2');
  const [pdfTotalPages, setPdfTotalPages] = useState(1);

  // Compress options
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [originalPdfSize, setOriginalPdfSize] = useState(0);

  // PDF to JPG options & results
  const [jpgQuality, setJpgQuality] = useState(85);
  const [convertedPages, setConvertedPages] = useState<ConvertedPage[]>([]);

  // Preview options
  const [previewScale, setPreviewScale] = useState(1.2);
  const [previewCurrentPage, setPreviewCurrentPage] = useState(1);
  const [previewTotalPages, setPreviewTotalPages] = useState(1);
  const [previewCanvasUrl, setPreviewCanvasUrl] = useState<string | null>(null);

  // Hidden file input refs
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Clear messages on mode switch
  useEffect(() => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setProgress(0);
  }, [activeMode]);

  // Clean up blob URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (resultBlobUrl) URL.revokeObjectURL(resultBlobUrl);
    };
  }, [resultBlobUrl]);

  // Format bytes helper
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  // Helper to read PDF page count with pdf-lib
  const inspectPdf = async (file: File): Promise<number> => {
    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      return pdfDoc.getPageCount();
    } catch {
      return 1;
    }
  };

  // 1. FILE UPLOAD HANDLER
  const handleFilesSelected = async (files: FileList | File[]) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    try {
      if (activeMode === 'merge') {
        if (mergeFiles.length + fileArray.length > 10) {
          setErrorMessage('To ensure smooth performance on mobile devices, you can merge up to 10 files at a time.');
          return;
        }

        const newUploads: UploadedFile[] = [];
        for (const f of fileArray) {
          if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
            setErrorMessage('Only PDF documents (.pdf) can be added to merge.');
            continue;
          }

          const sizeValidation = validateFileSize(f, 50);
          if (!sizeValidation.valid) {
            setErrorMessage(sizeValidation.error || 'File too large.');
            continue;
          }

          const pages = await inspectPdf(f);
          newUploads.push({
            id: `${Date.now()}-${Math.random()}`,
            file: f,
            name: f.name,
            size: f.size,
            pages,
          });
        }
        setMergeFiles((prev) => [...prev, ...newUploads]);
      } else if (activeMode === 'jpg-to-pdf' || activeMode === 'png-to-pdf') {
        if (imageFiles.length + fileArray.length > 20) {
          setErrorMessage('Maximum 20 images can be converted in one batch on mobile devices.');
          return;
        }

        const newImgs: UploadedFile[] = [];
        for (const f of fileArray) {
          const isJpg = f.type.includes('jpeg') || f.name.toLowerCase().endsWith('.jpg') || f.name.toLowerCase().endsWith('.jpeg');
          const isPng = f.type.includes('png') || f.name.toLowerCase().endsWith('.png');

          if (activeMode === 'jpg-to-pdf' && !isJpg) {
            setErrorMessage('Please upload JPG/JPEG format images.');
            continue;
          }
          if (activeMode === 'png-to-pdf' && !isPng) {
            setErrorMessage('Please upload PNG format images.');
            continue;
          }

          const sizeValidation = validateFileSize(f, 25);
          if (!sizeValidation.valid) {
            setErrorMessage(sizeValidation.error || 'Image file too large.');
            continue;
          }

          const previewUrl = URL.createObjectURL(f);
          newImgs.push({
            id: `${Date.now()}-${Math.random()}`,
            file: f,
            name: f.name,
            size: f.size,
            previewUrl,
          });
        }
        setImageFiles((prev) => [...prev, ...newImgs]);
      } else {
        // Single PDF tools: split, compress, pdf-to-jpg, preview
        const f = fileArray[0];
        if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
          setErrorMessage('Please select a valid PDF file (.pdf).');
          return;
        }

        const sizeValidation = validateFileSize(f, 50);
        if (!sizeValidation.valid) {
          setErrorMessage(sizeValidation.error || 'PDF file exceeds size limit.');
          return;
        }

        const pages = await inspectPdf(f);
        setPdfTotalPages(pages);
        setPreviewTotalPages(pages);
        setPreviewCurrentPage(1);
        setSplitRange(pages > 1 ? `1-${Math.min(pages, 2)}` : '1');
        setOriginalPdfSize(f.size);

        if (singlePdfFile?.previewUrl) {
          URL.revokeObjectURL(singlePdfFile.previewUrl);
        }

        const uploaded: UploadedFile = {
          id: `${Date.now()}-${Math.random()}`,
          file: f,
          name: f.name,
          size: f.size,
          pages,
          previewUrl: URL.createObjectURL(f),
        };
        setSinglePdfFile(uploaded);

        if (activeMode === 'preview') {
          renderPdfPreviewPage(f, 1, previewScale);
        }
      }
    } catch (err: any) {
      setErrorMessage(`Failed to parse file: ${err.message || 'Unknown error'}`);
    }
  };

  // Render a PDF page onto canvas for Preview or PDF to JPG using PDF.js
  const renderPdfPageToCanvas = async (
    file: File | ArrayBuffer,
    pageNumber: number,
    scale: number = 1.5
  ): Promise<{ dataUrl: string; width: number; height: number }> => {
    const pdfjs = (window as any).pdfjsLib;
    if (!pdfjs) {
      throw new Error('PDF.js rendering engine is initializing. Please wait a moment.');
    }
    pdfjs.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    const arrayBuffer = file instanceof File ? await file.arrayBuffer() : file;
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas 2D context unavailable');

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport }).promise;
    const dataUrl = canvas.toDataURL('image/jpeg', jpgQuality / 100);

    return {
      dataUrl,
      width: viewport.width,
      height: viewport.height,
    };
  };

  const renderPdfPreviewPage = async (file: File, pageNum: number, scale: number) => {
    try {
      const res = await renderPdfPageToCanvas(file, pageNum, scale);
      setPreviewCanvasUrl(res.dataUrl);
    } catch (err: any) {
      console.warn('PDF preview fallback:', err);
    }
  };

  // 2. MERGE PDF EXECUTION
  const handleMergePdfs = async () => {
    if (mergeFiles.length < 2) {
      setErrorMessage('Please select at least 2 PDF files to merge.');
      return;
    }
    setIsProcessing(true);
    setProgress(10);
    setProgressStatus('Initializing merged document...');
    setErrorMessage(null);

    try {
      const mergedPdf = await PDFDocument.create();

      for (let i = 0; i < mergeFiles.length; i++) {
        const item = mergeFiles[i];
        setProgress(Math.round(15 + (i / mergeFiles.length) * 70));
        setProgressStatus(`Merging ${item.name} (${i + 1}/${mergeFiles.length})...`);

        const fileBuffer = await item.file.arrayBuffer();
        const srcDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
        const indices = srcDoc.getPageIndices();
        const copiedPages = await mergedPdf.copyPages(srcDoc, indices);
        copiedPages.forEach((p) => mergedPdf.addPage(p));
      }

      setProgress(90);
      setProgressStatus('Finalizing merged PDF file...');
      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setResultBlobUrl(url);
      setResultFileName(`merged_document_${Date.now()}.pdf`);
      setResultFileSize(blob.size);
      setProgress(100);
      setSuccessMessage(`Successfully merged ${mergeFiles.length} PDF files into a single document!`);
    } catch (err: any) {
      setErrorMessage(`Merge failed: ${err.message || 'Please check that files are not encrypted.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. SPLIT PDF EXECUTION
  const handleSplitPdf = async () => {
    if (!singlePdfFile) {
      setErrorMessage('Please upload a PDF file to split.');
      return;
    }
    setIsProcessing(true);
    setProgress(15);
    setProgressStatus('Reading PDF document structure...');
    setErrorMessage(null);

    try {
      const buffer = await singlePdfFile.file.arrayBuffer();
      const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const total = srcDoc.getPageCount();

      if (splitMode === 'range') {
        // Parse range: e.g. "1-3, 5"
        const pageIndicesToKeep = new Set<number>();
        const parts = splitRange.split(',');
        for (const part of parts) {
          const trimmed = part.trim();
          if (trimmed.includes('-')) {
            const [startStr, endStr] = trimmed.split('-');
            const start = Math.max(1, parseInt(startStr, 10));
            const end = Math.min(total, parseInt(endStr, 10));
            for (let p = start; p <= end; p++) {
              pageIndicesToKeep.add(p - 1);
            }
          } else {
            const pageNum = parseInt(trimmed, 10);
            if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= total) {
              pageIndicesToKeep.add(pageNum - 1);
            }
          }
        }

        const indicesArray = Array.from(pageIndicesToKeep).sort((a, b) => a - b);
        if (indicesArray.length === 0) {
          throw new Error(`Invalid page range. Please choose pages between 1 and ${total}.`);
        }

        setProgress(60);
        setProgressStatus(`Extracting ${indicesArray.length} pages...`);

        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(srcDoc, indicesArray);
        copiedPages.forEach((p) => newPdf.addPage(p));

        const newPdfBytes = await newPdf.save();
        const blob = new Blob([newPdfBytes as unknown as BlobPart], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        setResultBlobUrl(url);
        setResultFileName(`${singlePdfFile.name.replace(/\.pdf$/i, '')}_split_pages.pdf`);
        setResultFileSize(blob.size);
        setSuccessMessage(`Extracted ${indicesArray.length} pages into a new PDF!`);
      } else {
        // Split each page into separate PDFs packaged in ZIP
        setProgressStatus('Splitting all pages into individual files...');
        const zip = new JSZip();

        for (let i = 0; i < total; i++) {
          setProgress(Math.round(20 + (i / total) * 70));
          const singlePageDoc = await PDFDocument.create();
          const [copied] = await singlePageDoc.copyPages(srcDoc, [i]);
          singlePageDoc.addPage(copied);
          const pageBytes = await singlePageDoc.save();
          zip.file(`page_${i + 1}.pdf`, pageBytes);
        }

        setProgress(92);
        setProgressStatus('Compiling ZIP archive...');
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);

        setResultBlobUrl(url);
        setResultFileName(`${singlePdfFile.name.replace(/\.pdf$/i, '')}_all_pages.zip`);
        setResultFileSize(zipBlob.size);
        setSuccessMessage(`Separated ${total} pages into a ZIP archive!`);
      }
      setProgress(100);
    } catch (err: any) {
      setErrorMessage(`Split failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // 4. COMPRESS PDF EXECUTION
  const handleCompressPdf = async () => {
    if (!singlePdfFile) {
      setErrorMessage('Please upload a PDF file to compress.');
      return;
    }
    setIsProcessing(true);
    setProgress(20);
    setProgressStatus('Analyzing PDF streams and structure...');
    setErrorMessage(null);

    try {
      const buffer = await singlePdfFile.file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pageCount = pdfDoc.getPageCount();

      setProgress(40);
      setProgressStatus('Applying stream compression & object deduplication...');

      if (compressionLevel === 'high' && (window as any).pdfjsLib) {
        // High compression: rasterize pages at optimized DPI and rebuild clean PDF
        setProgressStatus('Optimizing image assets and raster streams...');
        const compressedPdf = await PDFDocument.create();

        for (let i = 1; i <= pageCount; i++) {
          setProgress(Math.round(40 + (i / pageCount) * 45));
          const rendered = await renderPdfPageToCanvas(singlePdfFile.file, i, 1.0);
          const jpgBytes = await fetch(rendered.dataUrl).then((r) => r.arrayBuffer());
          const embeddedJpg = await compressedPdf.embedJpg(jpgBytes);
          const page = compressedPdf.addPage([rendered.width, rendered.height]);
          page.drawImage(embeddedJpg, {
            x: 0,
            y: 0,
            width: rendered.width,
            height: rendered.height,
          });
        }
        const compressedBytes = await compressedPdf.save({ useObjectStreams: true });
        const blob = new Blob([compressedBytes as unknown as BlobPart], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setResultBlobUrl(url);
        setResultFileName(`${singlePdfFile.name.replace(/\.pdf$/i, '')}_compressed.pdf`);
        setResultFileSize(blob.size);
      } else {
        // Balanced / Low: object streams + font deduplication
        const compressedBytes = await pdfDoc.save({
          useObjectStreams: true,
          addDefaultPage: false,
        });
        const blob = new Blob([compressedBytes as unknown as BlobPart], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setResultBlobUrl(url);
        setResultFileName(`${singlePdfFile.name.replace(/\.pdf$/i, '')}_compressed.pdf`);
        setResultFileSize(blob.size);
      }

      setProgress(100);
      setSuccessMessage('PDF compressed successfully!');
    } catch (err: any) {
      setErrorMessage(`Compression failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // 5. JPG / PNG TO PDF EXECUTION
  const handleImagesToPdf = async () => {
    if (imageFiles.length === 0) {
      setErrorMessage('Please upload at least one image file.');
      return;
    }
    setIsProcessing(true);
    setProgress(15);
    setProgressStatus('Creating new PDF document...');
    setErrorMessage(null);

    try {
      const pdfDoc = await PDFDocument.create();

      for (let i = 0; i < imageFiles.length; i++) {
        const item = imageFiles[i];
        setProgress(Math.round(20 + (i / imageFiles.length) * 70));
        setProgressStatus(`Embedding image ${i + 1} of ${imageFiles.length}...`);

        const imgBytes = await item.file.arrayBuffer();
        let embeddedImage;

        if (activeMode === 'png-to-pdf') {
          try {
            embeddedImage = await pdfDoc.embedPng(imgBytes);
          } catch {
            // If PNG had custom color space or corrupted chunk, convert via canvas to clean PNG bytes
            const canvas = document.createElement('canvas');
            const img = new Image();
            await new Promise((res) => {
              img.onload = res;
              img.src = item.previewUrl || '';
            });
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL('image/png');
            const cleanBytes = await fetch(dataUrl).then((r) => r.arrayBuffer());
            embeddedImage = await pdfDoc.embedPng(cleanBytes);
          }
        } else {
          embeddedImage = await pdfDoc.embedJpg(imgBytes);
        }

        const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
        page.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width: embeddedImage.width,
          height: embeddedImage.height,
        });
      }

      setProgress(95);
      setProgressStatus('Generating PDF document...');
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setResultBlobUrl(url);
      setResultFileName(`converted_images_${Date.now()}.pdf`);
      setResultFileSize(blob.size);
      setProgress(100);
      setSuccessMessage(`Converted ${imageFiles.length} images into a PDF document!`);
    } catch (err: any) {
      setErrorMessage(`Conversion failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // 6. PDF TO JPG EXECUTION
  const handlePdfToJpg = async () => {
    if (!singlePdfFile) {
      setErrorMessage('Please upload a PDF file to convert into JPG.');
      return;
    }
    setIsProcessing(true);
    setProgress(10);
    setProgressStatus('Loading PDF pages...');
    setErrorMessage(null);
    setConvertedPages([]);

    try {
      const buffer = await singlePdfFile.file.arrayBuffer();
      const total = pdfTotalPages;
      const results: ConvertedPage[] = [];

      for (let p = 1; p <= total; p++) {
        setProgress(Math.round(15 + (p / total) * 75));
        setProgressStatus(`Rendering page ${p} of ${total} into HD JPG...`);

        const res = await renderPdfPageToCanvas(buffer, p, 1.5);
        results.push({
          pageNumber: p,
          dataUrl: res.dataUrl,
          width: res.width,
          height: res.height,
        });
      }

      setConvertedPages(results);

      // Package into ZIP for 1-click batch download
      const zip = new JSZip();
      for (const res of results) {
        const base64Data = res.dataUrl.replace(/^data:image\/jpeg;base64,/, '');
        zip.file(`page_${res.pageNumber}.jpg`, base64Data, { base64: true });
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);

      setResultBlobUrl(url);
      setResultFileName(`${singlePdfFile.name.replace(/\.pdf$/i, '')}_jpg_pages.zip`);
      setResultFileSize(zipBlob.size);
      setProgress(100);
      setSuccessMessage(`Converted ${results.length} pages into JPG images!`);
    } catch (err: any) {
      setErrorMessage(`PDF to JPG conversion failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // RESET FUNCTION
  const handleReset = () => {
    setMergeFiles([]);
    setSinglePdfFile(null);
    setImageFiles([]);
    setConvertedPages([]);
    setResultBlobUrl(null);
    setResultFileName('');
    setResultFileSize(0);
    setProgress(0);
    setProgressStatus('');
    setErrorMessage(null);
    setSuccessMessage(null);
    setPreviewCanvasUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Trigger download helper
  const handleDownloadResult = () => {
    if (!resultBlobUrl) return;
    triggerSafeDownload(resultBlobUrl, resultFileName);
  };

  // Move files up/down in merge/image queues
  const moveItem = (index: number, direction: 'up' | 'down', listType: 'merge' | 'image') => {
    const list = listType === 'merge' ? [...mergeFiles] : [...imageFiles];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= list.length) return;
    const temp = list[index];
    list[index] = list[target];
    list[target] = temp;
    if (listType === 'merge') setMergeFiles(list);
    else setImageFiles(list);
  };

  // Calculate savings for compression
  const compressSavings =
    originalPdfSize > 0 && resultFileSize > 0
      ? Math.max(0, Math.round(((originalPdfSize - resultFileSize) / originalPdfSize) * 100))
      : 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden text-[#172554]">
      {/* Header and Tool Mode Bar */}
      <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-red-50/50 via-white to-slate-50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#172554]">All-in-One PDF Tools</h2>
              <p className="text-xs text-[#64748B]">
                Merge, split, compress, convert images, extract JPGs & preview PDFs in-browser
              </p>
            </div>
          </div>

          {/* Mode Selector Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-2xl overflow-x-auto text-xs font-bold scrollbar-none">
            {[
              { id: 'merge', label: 'Merge PDF', icon: Layers },
              { id: 'split', label: 'Split PDF', icon: Scissors },
              { id: 'compress', label: 'Compress PDF', icon: Minimize2 },
              { id: 'jpg-to-pdf', label: 'JPG to PDF', icon: ImageIcon },
              { id: 'png-to-pdf', label: 'PNG to PDF', icon: ImageIcon },
              { id: 'pdf-to-jpg', label: 'PDF to JPG', icon: ImageIcon },
              { id: 'preview', label: 'PDF Preview', icon: Eye },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeMode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveMode(tab.id as PdfToolMode);
                    handleReset();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition ${
                    isActive
                      ? 'bg-white text-red-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="p-6 space-y-6">
        {/* DRAG AND DROP UPLOAD ZONE */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files) handleFilesSelected(e.dataTransfer.files);
          }}
          className="relative border-2 border-dashed border-slate-300 hover:border-red-400 bg-slate-50/70 hover:bg-red-50/20 rounded-3xl p-8 text-center transition flex flex-col items-center justify-center gap-3 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple={activeMode === 'merge' || activeMode === 'jpg-to-pdf' || activeMode === 'png-to-pdf'}
            accept={
              activeMode === 'jpg-to-pdf'
                ? '.jpg,.jpeg,image/jpeg'
                : activeMode === 'png-to-pdf'
                ? '.png,image/png'
                : '.pdf,application/pdf'
            }
            onChange={(e) => {
              if (e.target.files) handleFilesSelected(e.target.files);
            }}
            className="hidden"
          />

          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 text-red-600 flex items-center justify-center shadow-sm">
            <Upload className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#172554]">
              Drag and drop your{' '}
              {activeMode === 'jpg-to-pdf'
                ? 'JPG image(s)'
                : activeMode === 'png-to-pdf'
                ? 'PNG image(s)'
                : 'PDF file(s)'}{' '}
              here
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              or click to browse from device memory (zero permanent storage)
            </p>
          </div>

          <button
            type="button"
            className="mt-1 px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-sm transition"
          >
            Choose Files
          </button>
        </div>

        {/* ERROR MESSAGE ALERT */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-xs font-semibold animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* PROGRESS INDICATOR */}
        {isProcessing && (
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 animate-fade-in">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="flex items-center gap-2 text-[#172554]">
                <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                {progressStatus || 'Processing PDF files locally...'}
              </span>
              <span className="font-mono text-red-600">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-600 transition-all duration-150 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* SUCCESS & DOWNLOAD READY BANNER */}
        {resultBlobUrl && (
          <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-950">
                  {successMessage || 'File Processed Successfully!'}
                </h4>
                <p className="text-xs text-emerald-800">
                  {resultFileName} · {formatBytes(resultFileSize)}
                  {compressSavings > 0 && ` · Saved ${compressSavings}%`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadResult}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                <span>Download Result</span>
              </button>
              <button
                onClick={handleReset}
                className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-emerald-100/60 border border-emerald-200 transition"
                title="Reset Workspace"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* MODE SPECIFIC CONTROLS & QUEUES */}

        {/* 1. MERGE PDF QUEUE */}
        {activeMode === 'merge' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#172554]">
                Selected PDFs to Merge ({mergeFiles.length})
              </span>
              {mergeFiles.length > 0 && (
                <button onClick={() => setMergeFiles([])} className="text-xs text-red-600 hover:underline">
                  Clear All
                </button>
              )}
            </div>

            {mergeFiles.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                No PDF documents added yet. Select 2 or more files above to merge them in sequence.
              </div>
            ) : (
              <div className="space-y-2">
                {mergeFiles.map((file, idx) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-slate-300 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">
                        {idx + 1}
                      </span>
                      <div>
                        <h5 className="text-xs font-bold text-[#172554] max-w-xs sm:max-w-md truncate">
                          {file.name}
                        </h5>
                        <p className="text-[10px] text-slate-500">
                          {formatBytes(file.size)} · {file.pages} page{file.pages !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        disabled={idx === 0}
                        onClick={() => moveItem(idx, 'up', 'merge')}
                        className="p-1.5 text-slate-400 hover:text-slate-800 disabled:opacity-20"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        disabled={idx === mergeFiles.length - 1}
                        onClick={() => moveItem(idx, 'down', 'merge')}
                        className="p-1.5 text-slate-400 hover:text-slate-800 disabled:opacity-20"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setMergeFiles((prev) => prev.filter((_, i) => i !== idx))}
                        className="p-1.5 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-lg"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">
                    Total Pages:{' '}
                    <strong className="text-[#172554]">
                      {mergeFiles.reduce((acc, f) => acc + (f.pages || 0), 0)}
                    </strong>
                  </span>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleReset}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
                    >
                      Reset
                    </button>
                    <button
                      onClick={handleMergePdfs}
                      disabled={isProcessing || mergeFiles.length < 2}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition shadow-sm"
                    >
                      <Layers className="w-4 h-4" />
                      <span>Merge {mergeFiles.length} PDFs</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. SPLIT PDF CONTROLS */}
        {activeMode === 'split' && singlePdfFile && (
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#172554]">{singlePdfFile.name}</h4>
                <p className="text-xs text-slate-500">
                  {formatBytes(singlePdfFile.size)} · {pdfTotalPages} Total Pages
                </p>
              </div>
              <button onClick={handleReset} className="text-xs text-red-600 hover:underline">
                Change File
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setSplitMode('range')}
                className={`p-4 rounded-2xl border text-left text-xs font-bold transition ${
                  splitMode === 'range'
                    ? 'border-red-500 bg-white ring-1 ring-red-500 text-red-600'
                    : 'border-slate-200 bg-white/70 text-slate-600'
                }`}
              >
                Extract Specific Page Range
                <span className="block text-[11px] font-normal text-slate-500 mt-1">
                  Extract custom pages into a single PDF (e.g. 1-3, 5)
                </span>
              </button>

              <button
                onClick={() => setSplitMode('all')}
                className={`p-4 rounded-2xl border text-left text-xs font-bold transition ${
                  splitMode === 'all'
                    ? 'border-red-500 bg-white ring-1 ring-red-500 text-red-600'
                    : 'border-slate-200 bg-white/70 text-slate-600'
                }`}
              >
                Separate Every Page
                <span className="block text-[11px] font-normal text-slate-500 mt-1">
                  Split into individual 1-page PDF files bundled in a ZIP
                </span>
              </button>
            </div>

            {splitMode === 'range' && (
              <div>
                <label className="block text-xs font-bold text-[#172554] mb-1">
                  Enter Page Range to Extract (1 to {pdfTotalPages})
                </label>
                <input
                  type="text"
                  value={splitRange}
                  onChange={(e) => setSplitRange(e.target.value)}
                  placeholder="e.g. 1-2 or 1, 3, 5"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:border-red-500 outline-none bg-white"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-200 hover:bg-slate-300 transition"
              >
                Reset
              </button>
              <button
                onClick={handleSplitPdf}
                disabled={isProcessing}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition shadow-sm"
              >
                <Scissors className="w-4 h-4" />
                <span>Execute Split</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. COMPRESS PDF CONTROLS */}
        {activeMode === 'compress' && singlePdfFile && (
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#172554]">{singlePdfFile.name}</h4>
                <p className="text-xs text-slate-500">Original Size: {formatBytes(singlePdfFile.size)}</p>
              </div>
              <button onClick={handleReset} className="text-xs text-red-600 hover:underline">
                Change File
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172554] mb-2">Compression Level</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'low', title: 'Low Compression', desc: 'Preserves maximum vector quality' },
                  { id: 'medium', title: 'Medium (Recommended)', desc: 'Balanced file size & clarity' },
                  { id: 'high', title: 'High Compression', desc: 'Maximum reduction for email/upload' },
                ].map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setCompressionLevel(level.id as any)}
                    className={`p-3.5 rounded-2xl border text-left text-xs font-bold transition ${
                      compressionLevel === level.id
                        ? 'border-red-500 bg-white ring-1 ring-red-500 text-red-600 shadow-sm'
                        : 'border-slate-200 bg-white/70 text-slate-600'
                    }`}
                  >
                    <span>{level.title}</span>
                    <span className="block text-[10px] font-normal text-slate-500 mt-1">
                      {level.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-200 hover:bg-slate-300 transition"
              >
                Reset
              </button>
              <button
                onClick={handleCompressPdf}
                disabled={isProcessing}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition shadow-sm"
              >
                <Minimize2 className="w-4 h-4" />
                <span>Compress PDF</span>
              </button>
            </div>
          </div>
        )}

        {/* 4 & 5. JPG / PNG TO PDF QUEUE */}
        {(activeMode === 'jpg-to-pdf' || activeMode === 'png-to-pdf') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#172554]">
                Images Queue ({imageFiles.length})
              </span>
              {imageFiles.length > 0 && (
                <button onClick={() => setImageFiles([])} className="text-xs text-red-600 hover:underline">
                  Clear All
                </button>
              )}
            </div>

            {imageFiles.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                No images added yet. Upload one or more {activeMode === 'jpg-to-pdf' ? 'JPG' : 'PNG'} images to generate your PDF document.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {imageFiles.map((img, idx) => (
                  <div
                    key={img.id}
                    className="relative group p-2 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between"
                  >
                    <div className="w-full aspect-square rounded-xl bg-slate-200 overflow-hidden mb-2">
                      <img src={img.previewUrl} alt={img.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] font-bold text-[#172554] truncate">{img.name}</span>
                    <span className="text-[9px] text-slate-400">{formatBytes(img.size)}</span>

                    <button
                      onClick={() => setImageFiles((prev) => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white shadow-sm hover:scale-110 transition"
                      title="Remove"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {imageFiles.length > 0 && (
              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Reset
                </button>
                <button
                  onClick={handleImagesToPdf}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-700 transition shadow-sm"
                >
                  <FileText className="w-4 h-4" />
                  <span>Convert {imageFiles.length} Image(s) to PDF</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* 6. PDF TO JPG RESULTS GRID */}
        {activeMode === 'pdf-to-jpg' && (
          <div className="space-y-4">
            {singlePdfFile && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#172554]">{singlePdfFile.name}</h4>
                  <p className="text-xs text-slate-500">
                    {formatBytes(singlePdfFile.size)} · {pdfTotalPages} Pages Available
                  </p>
                </div>
                <button
                  onClick={handlePdfToJpg}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-700 transition shadow-sm"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Render to JPG</span>
                </button>
              </div>
            )}

            {convertedPages.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#172554]">
                    Converted JPG Pages ({convertedPages.length})
                  </span>
                  <button
                    onClick={handleDownloadResult}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-700 transition shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download All as ZIP</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {convertedPages.map((page) => (
                    <div
                      key={page.pageNumber}
                      className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between gap-2"
                    >
                      <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                        <img
                          src={page.dataUrl}
                          alt={`Page ${page.pageNumber}`}
                          className="w-full h-auto object-contain max-h-64"
                        />
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-bold text-[#172554]">Page {page.pageNumber}</span>
                        <a
                          href={page.dataUrl}
                          download={`page_${page.pageNumber}.jpg`}
                          className="flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 transition"
                        >
                          <Download className="w-3 h-3" />
                          <span>JPG</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 7. PDF PREVIEW MODE */}
        {activeMode === 'preview' && (
          <div className="space-y-4">
            {singlePdfFile && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-[#172554]">{singlePdfFile.name}</h4>
                  <p className="text-xs text-slate-500">
                    Page {previewCurrentPage} of {previewTotalPages}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={previewCurrentPage <= 1}
                    onClick={() => {
                      const next = previewCurrentPage - 1;
                      setPreviewCurrentPage(next);
                      renderPdfPreviewPage(singlePdfFile.file, next, previewScale);
                    }}
                    className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold px-2">
                    {previewCurrentPage} / {previewTotalPages}
                  </span>
                  <button
                    disabled={previewCurrentPage >= previewTotalPages}
                    onClick={() => {
                      const next = previewCurrentPage + 1;
                      setPreviewCurrentPage(next);
                      renderPdfPreviewPage(singlePdfFile.file, next, previewScale);
                    }}
                    className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <div className="h-6 w-px bg-slate-200 mx-1" />

                  <button
                    onClick={() => {
                      const s = Math.max(0.6, previewScale - 0.2);
                      setPreviewScale(s);
                      renderPdfPreviewPage(singlePdfFile.file, previewCurrentPage, s);
                    }}
                    className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      const s = Math.min(2.5, previewScale + 0.2);
                      setPreviewScale(s);
                      renderPdfPreviewPage(singlePdfFile.file, previewCurrentPage, s);
                    }}
                    className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {previewCanvasUrl ? (
              <div className="p-6 bg-slate-100 rounded-3xl border border-slate-200 flex items-center justify-center overflow-auto max-h-[600px]">
                <img
                  src={previewCanvasUrl}
                  alt={`Preview Page ${previewCurrentPage}`}
                  className="rounded-xl shadow-lg border border-slate-200 max-w-full"
                />
              </div>
            ) : singlePdfFile ? (
              <div className="p-12 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                Rendering preview page...
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
