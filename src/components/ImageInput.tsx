import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, 
  Upload, 
  Trash2, 
  RefreshCw, 
  X, 
  AlertCircle, 
  Loader2, 
  Check, 
  Info, 
  Sparkles, 
  ShieldAlert,
  SwitchCamera,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  validateImageFile, 
  compressAndResizeImage, 
  ProcessedImageResult 
} from '../utils/imageUtils';

export interface ImageInputProps {
  value: string | null;
  onChange: (dataUrl: string | null, meta?: ProcessedImageResult) => void;
  onAnalyze?: () => void;
  isAnalyzing?: boolean;
  currentLang?: 'en' | 'hi';
  maxSizeMB?: number;
  className?: string;
}

interface ImageDetailedError {
  type: 'UNSUPPORTED_TYPE' | 'FILE_TOO_LARGE' | 'CAMERA_PERMISSION_DENIED' | 'CAMERA_UNAVAILABLE' | 'GENERIC_ERROR';
  titleEn: string;
  titleHi: string;
  messageEn: string;
  messageHi: string;
  actionHintEn: string;
  actionHintHi: string;
}

export const ImageInput: React.FC<ImageInputProps> = ({
  value,
  onChange,
  onAnalyze,
  isAnalyzing = false,
  currentLang = 'en',
  maxSizeMB = 15,
  className = ''
}) => {
  // File inputs
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mobileCameraInputRef = useRef<HTMLInputElement | null>(null);

  // Live Camera DOM references & state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isCameraInitializing, setIsCameraInitializing] = useState(false);
  const [cameraDetailedError, setCameraDetailedError] = useState<ImageDetailedError | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  // General Component State
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detailedError, setDetailedError] = useState<ImageDetailedError | null>(null);
  const [imageMeta, setImageMeta] = useState<ProcessedImageResult | null>(null);

  // Stop camera tracks cleanly
  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.error('Error stopping track', e);
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Cleanup on unmount or when modal closes
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, [stopCameraStream]);

  // Check if camera devices exist for switching
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices()
        .then((devices) => {
          const videoDevices = devices.filter((d) => d.kind === 'videoinput');
          setHasMultipleCameras(videoDevices.length > 1);
        })
        .catch(() => {});
    }
  }, []);

  // Check HTTPS / Localhost security requirement
  const isSecureContext = typeof window !== 'undefined' && 
    (window.isSecureContext || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  // Handle opening live camera
  const startLiveCamera = async (mode: 'environment' | 'user' = facingMode) => {
    setCameraDetailedError(null);
    setIsCameraInitializing(true);
    setIsCameraModalOpen(true);

    // Ensure any previous stream is stopped
    stopCameraStream();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraDetailedError({
        type: 'CAMERA_UNAVAILABLE',
        titleEn: 'Camera Not Supported in Browser',
        titleHi: 'ब्राउज़र में कैमरा समर्थित नहीं है',
        messageEn: 'Your current browser environment does not support direct WebRTC video streaming.',
        messageHi: 'आपका वर्तमान ब्राउज़र डायरेक्ट वीडियो स्ट्रीमिंग का समर्थन नहीं करता है।',
        actionHintEn: 'Please use the "Upload Photo" button or use your mobile device camera app.',
        actionHintHi: 'कृपया "फोटो अपलोड" बटन का उपयोग करें या मोबाइल डिवाइस कैमरा ऐप का प्रयोग करें।'
      });
      setIsCameraInitializing(false);
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.error('getUserMedia error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraDetailedError({
          type: 'CAMERA_PERMISSION_DENIED',
          titleEn: 'Camera Permission Denied',
          titleHi: 'कैमरा अनुमति अस्वीकृत कर दी गई',
          messageEn: 'Camera access was blocked by your browser settings or permission prompt.',
          messageHi: 'आपके ब्राउज़र सेटिंग्स या अनुमति प्रॉम्प्ट द्वारा कैमरा एक्सेस अवरुद्ध कर दिया गया था।',
          actionHintEn: 'Click the camera/lock icon in your browser address bar to allow camera access, then click Retry.',
          actionHintHi: 'कैमरा अनुमति देने के लिए ब्राउज़र एड्रेस बार में लॉक/कैमरा आइकन पर क्लिक करें, फिर पुनः प्रयास करें।'
        });
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraDetailedError({
          type: 'CAMERA_UNAVAILABLE',
          titleEn: 'No Camera Detected',
          titleHi: 'कोई कैमरा नहीं मिला',
          messageEn: 'No video capture hardware was found on this device or the camera is in use by another app.',
          messageHi: 'इस डिवाइस पर कोई कैमरा नहीं मिला या कैमरा किसी अन्य ऐप द्वारा उपयोग में है।',
          actionHintEn: 'Connect an external camera or upload a monument photo from your local file storage.',
          actionHintHi: 'कोई बाहरी कैमरा कनेक्ट करें या अपने डिवाइस से स्मारक की फोटो अपलोड करें।'
        });
      } else if (!isSecureContext) {
        setCameraDetailedError({
          type: 'CAMERA_UNAVAILABLE',
          titleEn: 'Secure Connection Required',
          titleHi: 'सुरक्षित कनेक्शन आवश्यक है',
          messageEn: 'Browser security requires an HTTPS connection or localhost to access camera hardware.',
          messageHi: 'कैमरा एक्सेस के लिए ब्राउज़र सुरक्षा नियमों के अनुसार HTTPS या localhost आवश्यक है।',
          actionHintEn: 'Please access this app over HTTPS or use the file upload option below.',
          actionHintHi: 'कृपया HTTPS पर ऐप खोलें या फ़ाइल अपलोड विकल्प का उपयोग करें।'
        });
      } else {
        setCameraDetailedError({
          type: 'GENERIC_ERROR',
          titleEn: 'Camera Initialization Failed',
          titleHi: 'कैमरा शुरू करने में विफल',
          messageEn: 'Could not initialize video capture stream.',
          messageHi: 'वीडियो कैप्चर स्ट्रीम शुरू नहीं की जा सकी।',
          actionHintEn: 'Try refreshing the page or upload an image from your library.',
          actionHintHi: 'पृष्ठ रीफ्रेश करें या अपनी लाइब्रेरी से फ़ोटो अपलोड करें।'
        });
      }
    } finally {
      setIsCameraInitializing(false);
    }
  };

  const closeLiveCamera = () => {
    stopCameraStream();
    setIsCameraModalOpen(false);
    setCameraDetailedError(null);
  };

  const switchCameraFacing = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startLiveCamera(nextMode);
  };

  // Capture frame from live video
  const captureLiveFrame = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, width, height);
    const rawDataUrl = canvas.toDataURL('image/jpeg', 0.92);

    // Stop stream and close modal immediately
    closeLiveCamera();

    // Compress & resize
    await processImageSource(rawDataUrl);
  };

  // Process and compress image file or dataUrl
  const processImageSource = async (source: File | string) => {
    setIsProcessing(true);
    setDetailedError(null);

    try {
      if (source instanceof File) {
        // Validate
        const validation = validateImageFile(source, { maxSizeMB });
        if (!validation.isValid) {
          if (validation.errorType === 'UNSUPPORTED_TYPE') {
            setDetailedError({
              type: 'UNSUPPORTED_TYPE',
              titleEn: 'Unsupported File Format',
              titleHi: 'असमर्थित फ़ाइल प्रारूप',
              messageEn: validation.error || 'The chosen file is not a supported image format.',
              messageHi: validation.errorHi || 'चुनी गई फ़ाइल एक समर्थित छवि प्रारूप नहीं है।',
              actionHintEn: validation.actionHint || 'Please choose a standard JPEG (.jpg, .jpeg), PNG (.png), or WebP (.webp) image.',
              actionHintHi: validation.actionHintHi || 'कृपया मान्य JPG, PNG, या WebP फ़ाइल चुनें।'
            });
          } else if (validation.errorType === 'FILE_TOO_LARGE') {
            setDetailedError({
              type: 'FILE_TOO_LARGE',
              titleEn: 'Image File Too Large',
              titleHi: 'छवि फ़ाइल बहुत बड़ी है',
              messageEn: validation.error || `File exceeds the maximum limit of ${maxSizeMB} MB.`,
              messageHi: validation.errorHi || `फ़ाइल अधिकतम सीमा ${maxSizeMB} MB से अधिक है।`,
              actionHintEn: validation.actionHint || 'Please select an image smaller than 15 MB, or use the camera to take a photo directly.',
              actionHintHi: validation.actionHintHi || 'कृपया 15 MB से छोटी फोटो चुनें या सीधे कैमरे से फोटो लें।'
            });
          } else {
            setDetailedError({
              type: 'GENERIC_ERROR',
              titleEn: 'Invalid File',
              titleHi: 'अमान्य फ़ाइल',
              messageEn: validation.error || 'Please select a valid image file.',
              messageHi: validation.errorHi || 'कृपया एक मान्य छवि फ़ाइल चुनें।',
              actionHintEn: 'Try choosing another image file from your device.',
              actionHintHi: 'अपने डिवाइस से कोई दूसरी फ़ाइल चुनने का प्रयास करें।'
            });
          }
          setIsProcessing(false);
          return;
        }
      }

      // Compress and resize
      const result = await compressAndResizeImage(source, 1600, 1600, 0.85);
      setImageMeta(result);
      onChange(result.dataUrl, result);
    } catch (err: any) {
      console.error('Image processing failed:', err);
      setDetailedError({
        type: 'GENERIC_ERROR',
        titleEn: 'Image Processing Failed',
        titleHi: 'छवि प्रोसेस करने में विफल',
        messageEn: 'Could not decode or resize this image file.',
        messageHi: 'इस छवि फ़ाइल को डिकोड या आकार नहीं बदला जा सका।',
        actionHintEn: 'The file may be corrupt. Please try another JPEG or PNG photo.',
        actionHintHi: 'फ़ाइल दूषित हो सकती है। कृपया कोई अन्य JPG या PNG फोटो आज़माएँ।'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageSource(file);
    }
    // Reset file input so same file can be re-selected if replaced
    e.target.value = '';
  };

  // Drag & drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageSource(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    onChange(null);
    setImageMeta(null);
    setDetailedError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (mobileCameraInputRef.current) mobileCameraInputRef.current.value = '';
  };

  return (
    <div className={`w-full flex flex-col gap-4 ${className}`}>
      {/* Hidden HTML Inputs */}
      {/* Standard desktop/mobile file picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        id="heritagelens-file-upload"
        aria-label="Upload monument image file"
        className="sr-only"
        onChange={handleFileInputChange}
      />

      {/* Direct mobile camera capture input with capture="environment" */}
      <input
        ref={mobileCameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        id="heritagelens-mobile-camera-input"
        aria-label="Capture monument photo directly with mobile camera"
        className="sr-only"
        onChange={handleFileInputChange}
      />

      {/* Main Container */}
      <AnimatePresence mode="wait">
        {value ? (
          /* ========================================================================= */
          /* 1. SELECTED IMAGE PREVIEW STATE WITH REPLACE & REMOVE ACTIONS             */
          /* ========================================================================= */
          <motion.div
            key="image-preview"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-[#F3EEE7] border border-[#E8E2D9] rounded-3xl p-5 sm:p-7 flex flex-col items-center shadow-sm"
          >
            {/* Image Preview Box */}
            <div className="relative w-full max-w-xl aspect-16/10 rounded-2xl overflow-hidden border-2 border-[#C05E42]/70 shadow-md bg-[#1A1A1A]">
              <img
                src={value}
                alt="Selected monument for identification"
                className="w-full h-full object-cover"
              />

              {/* Top Quick Actions Floating Pill */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  type="button"
                  id="image-remove-btn"
                  onClick={handleRemove}
                  disabled={isAnalyzing || isProcessing}
                  className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-black/75 hover:bg-black/90 text-white backdrop-blur-xs transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[#C05E42]"
                  title="Remove image"
                  aria-label="Remove selected image"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>

              {/* Compressed image badge / indicator */}
              {imageMeta && (
                <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-xs text-white/90 text-[11px] font-semibold px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>
                    Optimized: {imageMeta.width}×{imageMeta.height}px (
                    {(imageMeta.compressedSize / 1024).toFixed(0)} KB)
                  </span>
                </div>
              )}
            </div>

            {/* Error banner if any */}
            {detailedError && (
              <div className="mt-4 w-full max-w-xl text-xs text-amber-900 bg-amber-50 p-4 rounded-2xl border border-amber-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className={`font-bold block ${currentLang === 'hi' ? 'font-devanagari text-sm' : ''}`}>
                    {currentLang === 'en' ? detailedError.titleEn : detailedError.titleHi}
                  </span>
                  <span className={`text-xs text-amber-800/90 block mt-1 leading-relaxed ${currentLang === 'hi' ? 'font-devanagari' : ''}`}>
                    {currentLang === 'en' ? detailedError.messageEn : detailedError.messageHi}
                  </span>
                  {detailedError.actionHintEn && (
                    <span className={`text-[11px] text-amber-900 font-semibold block mt-1.5 ${currentLang === 'hi' ? 'font-devanagari' : ''}`}>
                      {currentLang === 'en' ? 'Tip: ' + detailedError.actionHintEn : 'सुझाव: ' + detailedError.actionHintHi}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="w-full max-w-xl mt-5 flex flex-col sm:flex-row items-center gap-3">
              {/* Replace Button (opens options dropdown or file picker) */}
              <div className="w-full sm:w-auto flex-1 flex gap-2">
                <button
                  type="button"
                  id="image-replace-upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isAnalyzing || isProcessing}
                  className="flex-1 min-h-[48px] py-3 px-4 rounded-xl border border-[#E8E2D9] bg-white hover:bg-[#FDFBF7] text-[#2D2926] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[#C05E42]"
                  aria-label="Replace with photo from gallery"
                >
                  <RefreshCw className="w-4 h-4 text-[#8C8276]" />
                  <span className={currentLang === 'hi' ? 'font-devanagari text-sm' : ''}>
                    {currentLang === 'en' ? 'Upload New' : 'नई फोटो'}
                  </span>
                </button>

                <button
                  type="button"
                  id="image-replace-camera-btn"
                  onClick={() => startLiveCamera()}
                  disabled={isAnalyzing || isProcessing}
                  className="flex-1 min-h-[48px] py-3 px-4 rounded-xl border border-[#E8E2D9] bg-white hover:bg-[#FDFBF7] text-[#2D2926] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[#C05E42]"
                  aria-label="Replace with live camera capture"
                >
                  <Camera className="w-4 h-4 text-[#C05E42]" />
                  <span className={currentLang === 'hi' ? 'font-devanagari text-sm' : ''}>
                    {currentLang === 'en' ? 'Retake Live' : 'रीटेक'}
                  </span>
                </button>
              </div>

              {/* Optional Analyze CTA if onAnalyze is passed */}
              {onAnalyze && (
                <button
                  type="button"
                  id="image-analyze-submit-btn"
                  onClick={onAnalyze}
                  disabled={isAnalyzing || isProcessing}
                  className="w-full sm:w-auto flex-1 min-h-[48px] py-3.5 px-6 rounded-xl bg-[#2C4A3E] hover:bg-[#223a31] text-white font-serif-heritage text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 disabled:opacity-75 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                  aria-label="Analyze monument image with HeritageLens AI"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                      <span className={currentLang === 'hi' ? 'font-devanagari' : ''}>
                        {currentLang === 'en'
                          ? 'Analyzing Monument...'
                          : 'स्मारक का विश्लेषण...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                      <span className={currentLang === 'hi' ? 'font-devanagari' : ''}>
                        {currentLang === 'en'
                          ? 'Identify Heritage Site'
                          : 'स्मारक की पहचान करें'}
                      </span>
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          /* ========================================================================= */
          /* 2. UPLOAD & CAMERA DUAL SELECTION INTERFACE                               */
          /* ========================================================================= */
          <motion.div
            key="action-tiles"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-4"
          >
            {/* Error Message & Polished Action Box */}
            {detailedError && (
              <div 
                id="image-input-error-banner"
                className="text-xs text-[#1A1A1A] bg-amber-50/90 border-2 border-amber-300/80 p-4 sm:p-5 rounded-2xl flex flex-col gap-3 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-[#1A1A1A]">
                          {currentLang === 'en' ? detailedError.titleEn : detailedError.titleHi}
                        </h4>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-200/70 text-amber-900">
                          {detailedError.type.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-[#5C544E] leading-relaxed">
                        {currentLang === 'en' ? detailedError.messageEn : detailedError.messageHi}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setDetailedError(null)}
                    className="p-1 rounded-lg hover:bg-amber-100 text-amber-800 transition-colors cursor-pointer"
                    aria-label="Dismiss error"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Recommended Next Action Row */}
                <div className="pt-2.5 border-t border-amber-200/80 flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-950">
                    <Sparkles className="w-3.5 h-3.5 text-[#C05E42]" />
                    <span>
                      {currentLang === 'en' ? 'What to do next: ' : 'आगे क्या करें: '}
                      <span className="font-normal text-[#5C544E]">
                        {currentLang === 'en' ? detailedError.actionHintEn : detailedError.actionHintHi}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-300 text-xs font-bold text-[#2C4A3E] transition-colors cursor-pointer shadow-2xs"
                    >
                      {currentLang === 'en' ? 'Select Supported Photo' : 'समर्थित फोटो चुनें'}
                    </button>
                    <button
                      type="button"
                      onClick={() => startLiveCamera()}
                      className="px-3 py-1.5 rounded-xl bg-[#2C4A3E] hover:bg-[#223930] text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                    >
                      {currentLang === 'en' ? 'Use Live Camera' : 'कैमरा उपयोग करें'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Dual Tile Grid: Live Camera & File Upload */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Option A: Live Camera / Mobile Fast Capture */}
              <div
                id="camera-capture-tile"
                className="bg-[#2C4A3E] text-white rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-[#D4AF37] group relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs">
                    <Camera className="w-7 h-7 text-[#D4AF37]" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-white/80 font-bold px-2.5 py-1 rounded-full bg-black/25">
                    {currentLang === 'en' ? 'Live Vision' : 'लाइव कैमरा'}
                  </span>
                </div>

                <div className="mb-6">
                  <h4 className="text-xl sm:text-2xl font-bold font-serif-heritage">
                    {currentLang === 'en' ? 'Use Camera' : 'कैमरा प्रयोग करें'}
                  </h4>
                  <p className="text-xs sm:text-sm text-white/80 mt-1.5 leading-relaxed">
                    {currentLang === 'en'
                      ? 'Point your device camera directly at monument domes, arches, or stone facades for instant recognition.'
                      : 'स्मारक के गुंबदों, मेहराबों या नक्काशी की तुरंत लाइव तस्वीर खींचें।'}
                  </p>
                </div>

                {/* Camera Buttons: Live WebRTC and Direct Native Mobile input */}
                <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                  {/* WebRTC Live Stream viewfinder */}
                  <button
                    type="button"
                    id="open-live-viewfinder-btn"
                    onClick={() => startLiveCamera('environment')}
                    className="flex-1 py-3 px-4 rounded-xl bg-white text-[#2C4A3E] font-bold text-xs hover:bg-[#F3EEE7] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98"
                    aria-label="Open live camera viewfinder"
                  >
                    <Camera className="w-4 h-4 text-[#2C4A3E]" />
                    <span>{currentLang === 'en' ? 'Open Live Camera' : 'लाइव व्यूफ़ाइंडर'}</span>
                  </button>

                  {/* Direct Mobile Quick Camera (Capture Environment) */}
                  <button
                    type="button"
                    id="mobile-quick-snap-btn"
                    onClick={() => mobileCameraInputRef.current?.click()}
                    className="py-3 px-3.5 rounded-xl bg-black/25 hover:bg-black/40 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 border border-white/20 cursor-pointer"
                    title="Quick snap using device camera app"
                    aria-label="Quick snap with native device camera app"
                  >
                    <span>{currentLang === 'en' ? 'Quick Snap' : 'स्नैप'}</span>
                  </button>
                </div>
              </div>

              {/* Option B: Upload File / Drag & Drop */}
              <div
                id="file-upload-tile"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                className={`bg-[#C05E42] text-white rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-md hover:shadow-xl transition-all border-2 ${
                  dragActive ? 'border-white scale-102 ring-4 ring-white/30' : 'border-transparent hover:border-[#D4AF37]'
                } cursor-pointer group relative overflow-hidden`}
                aria-label="Upload monument photo from gallery or drag and drop"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs">
                    <Upload className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-white/80 font-bold px-2.5 py-1 rounded-full bg-black/25">
                    JPG / PNG / WebP
                  </span>
                </div>

                <div className="mb-6">
                  <h4 className="text-xl sm:text-2xl font-bold font-serif-heritage">
                    {currentLang === 'en' ? 'Upload Image' : 'फोटो अपलोड करें'}
                  </h4>
                  <p className="text-xs sm:text-sm text-white/80 mt-1.5 leading-relaxed">
                    {currentLang === 'en'
                      ? 'Select or drag & drop a travel photograph from your photo library or storage.'
                      : 'अपनी गैलरी से कोई भी यात्रा फोटो चुनें या यहाँ ड्रैग और ड्रॉप करें।'}
                  </p>
                </div>

                <div className="pt-2">
                  <div className="w-full py-3 px-4 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 group-hover:bg-white group-hover:text-[#C05E42]">
                    <Upload className="w-4 h-4" />
                    <span>{currentLang === 'en' ? 'Browse Files or Drop Here' : 'फ़ाइल चुनें या ड्रॉप करें'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* HTTPS & Browser Permissions Information Note */}
            <div className="p-4 rounded-2xl bg-[#F3EEE7] border border-[#E8E2D9] flex items-start gap-3 text-xs text-[#5C544E]">
              <Info className="w-4 h-4 text-[#C05E42] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-[#1A1A1A]">
                  {currentLang === 'en'
                    ? 'Camera Security & Privacy Notice'
                    : 'कैमरा सुरक्षा और गोपनीयता सूचना'}
                </p>
                <p className="leading-relaxed">
                  {currentLang === 'en'
                    ? 'Live camera streaming requires HTTPS or localhost and browser camera permission. Images are processed locally on your device and compressed before AI identification.'
                    : 'लाइव कैमरा के लिए HTTPS या localhost और ब्राउज़र अनुमति आवश्यक है। छवियाँ आपके डिवाइस पर सुरक्षित रूप से प्रोसेस की जाती हैं।'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 3. LIVE WEBRTC CAMERA MODAL VIEW / VIEWFINDER                             */}
      {/* ========================================================================= */}
      {isCameraModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="camera-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="bg-[#1A1A1A] text-white w-full max-w-xl rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#D4AF37]" />
                <h3 id="camera-modal-title" className="font-serif-heritage font-bold text-base">
                  {currentLang === 'en' ? 'Live Monument Camera' : 'लाइव स्मारक कैमरा'}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {hasMultipleCameras && (
                  <button
                    type="button"
                    onClick={switchCameraFacing}
                    className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                    title="Switch camera"
                    aria-label="Switch between front and back camera"
                  >
                    <SwitchCamera className="w-5 h-5" />
                  </button>
                )}
                <button
                  type="button"
                  id="close-camera-modal-btn"
                  onClick={closeLiveCamera}
                  className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                  aria-label="Close camera"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Viewfinder Area */}
            <div className="relative aspect-4/3 sm:aspect-16/10 w-full bg-black flex items-center justify-center overflow-hidden">
              {isCameraInitializing && (
                <div className="flex flex-col items-center gap-3 text-white/80">
                  <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
                  <span className={`text-xs font-semibold ${currentLang === 'hi' ? 'font-devanagari text-sm' : ''}`}>
                    {currentLang === 'en' ? 'Starting camera...' : 'कैमरा शुरू हो रहा है...'}
                  </span>
                </div>
              )}

              {cameraDetailedError ? (
                <div className="p-6 text-center max-w-md flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/30 shadow-inner">
                    <ShieldAlert className="w-7 h-7" />
                  </div>
                  <div className="flex items-center gap-2">
                    <h4 className={`font-bold text-sm text-white ${currentLang === 'hi' ? 'font-devanagari text-base' : ''}`}>
                      {currentLang === 'en' ? cameraDetailedError.titleEn : cameraDetailedError.titleHi}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                      {cameraDetailedError.type === 'CAMERA_PERMISSION_DENIED' ? 'Permission' : 'Hardware'}
                    </span>
                  </div>
                  <p className={`text-xs text-white/80 leading-relaxed ${currentLang === 'hi' ? 'font-devanagari' : ''}`}>
                    {currentLang === 'en' ? cameraDetailedError.messageEn : cameraDetailedError.messageHi}
                  </p>

                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-left w-full text-[11px] text-amber-200/90 flex items-start gap-2 mt-1">
                    <Info className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                    <span className={currentLang === 'hi' ? 'font-devanagari' : ''}>
                      {currentLang === 'en' ? cameraDetailedError.actionHintEn : cameraDetailedError.actionHintHi}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2.5 mt-2 w-full">
                    <button
                      type="button"
                      onClick={() => startLiveCamera()}
                      className="min-h-[44px] px-4 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold text-white transition-colors flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <span className={currentLang === 'hi' ? 'font-devanagari' : ''}>
                        {currentLang === 'en' ? 'Retry Camera' : 'पुनः प्रयास करें'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        closeLiveCamera();
                        mobileCameraInputRef.current?.click();
                      }}
                      className="min-h-[44px] px-4 py-2.5 bg-[#C05E42] hover:bg-[#a54a32] rounded-xl text-xs font-bold text-white transition-colors flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                    >
                      <span className={currentLang === 'hi' ? 'font-devanagari' : ''}>
                        {currentLang === 'en' ? 'Device Camera' : 'डिवाइस कैमरा'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        closeLiveCamera();
                        fileInputRef.current?.click();
                      }}
                      className="min-h-[44px] px-4 py-2.5 bg-white text-[#2C4A3E] hover:bg-[#F3EEE7] rounded-xl text-xs font-bold transition-colors flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2C4A3E]"
                    >
                      <span className={currentLang === 'hi' ? 'font-devanagari' : ''}>
                        {currentLang === 'en' ? 'Upload Photo' : 'फ़ोटो चुनें'}
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              )}

              {/* Viewfinder Reticle / Focus Guidelines */}
              {!cameraDetailedError && !isCameraInitializing && (
                <div className="absolute inset-8 sm:inset-12 border-2 border-white/40 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
                  <div className="flex justify-between">
                    <div className="w-5 h-5 border-t-2 border-l-2 border-[#D4AF37]" />
                    <div className="w-5 h-5 border-t-2 border-r-2 border-[#D4AF37]" />
                  </div>
                  <div className="text-center">
                    <span className={`px-3 py-1 bg-black/70 backdrop-blur-xs text-[10px] text-white font-bold rounded-full uppercase tracking-wider ${currentLang === 'hi' ? 'font-devanagari text-xs' : ''}`}>
                      {currentLang === 'en' ? 'Frame monument in center' : 'स्मारक को केंद्र में रखें'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-5 h-5 border-b-2 border-l-2 border-[#D4AF37]" />
                    <div className="w-5 h-5 border-b-2 border-r-2 border-[#D4AF37]" />
                  </div>
                </div>
              )}
            </div>

            {/* Camera Controls Footer */}
            <div className="p-4 sm:p-5 bg-black/70 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                type="button"
                id="cancel-camera-btn"
                onClick={closeLiveCamera}
                className="min-h-[48px] min-w-[70px] px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-white"
              >
                <span className={currentLang === 'hi' ? 'font-devanagari' : ''}>
                  {currentLang === 'en' ? 'Cancel' : 'रद्द करें'}
                </span>
              </button>

              <button
                type="button"
                id="capture-live-snapshot-btn"
                onClick={captureLiveFrame}
                disabled={isCameraInitializing || !!cameraDetailedError}
                className="min-h-[52px] px-7 py-3 rounded-2xl bg-[#C05E42] hover:bg-[#a54a32] text-white text-sm font-bold flex items-center justify-center gap-2.5 shadow-lg shadow-[#C05E42]/30 active:scale-95 transition-all disabled:opacity-50 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                aria-label="Capture snapshot of monument"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-white animate-pulse" />
                <span className={currentLang === 'hi' ? 'font-devanagari text-base' : ''}>
                  {currentLang === 'en' ? 'Capture Photo' : 'तस्वीर खींचें'}
                </span>
              </button>

              <div className="w-16 flex justify-end">
                {hasMultipleCameras && (
                  <button
                    type="button"
                    onClick={switchCameraFacing}
                    className="min-w-[48px] min-h-[48px] p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                    title="Flip camera"
                    aria-label="Flip camera direction"
                  >
                    <SwitchCamera className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
