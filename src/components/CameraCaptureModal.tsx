import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, AlertCircle, Check } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
  currentLang: 'en' | 'hi';
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  currentLang
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setCapturedImage(null);
      setError(null);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    setIsInitializing(true);
    setError(null);
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setError(
        currentLang === 'en'
          ? 'Unable to access device camera. Please check camera permissions in your browser.'
          : 'डिवाइस कैमरा एक्सेस करने में असमर्थ। कृपया ब्राउज़र कैमरा अनुमतियाँ जांचें।'
      );
    } finally {
      setIsInitializing(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      setCapturedImage(dataUrl);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      stopCamera();
      onClose();
    }
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-[#FDFBF7] w-full max-w-xl rounded-3xl overflow-hidden border border-[#E8E2D9] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8E2D9] flex items-center justify-between bg-[#F3EEE7]">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#C05E42]" />
            <h3 className="font-serif-heritage font-bold text-base text-[#1A1A1A]">
              {currentLang === 'en' ? 'Scan Monument' : 'स्मारक स्कैन करें'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#5C544E] hover:bg-[#E8E2D9] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport / Preview */}
        <div className="relative aspect-4/3 bg-black flex items-center justify-center overflow-hidden">
          {error ? (
            <div className="p-6 text-center text-white max-w-sm">
              <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
              <p className="text-sm font-medium">{error}</p>
              <button
                onClick={startCamera}
                className="mt-4 px-4 py-2 bg-[#C05E42] text-white text-xs font-semibold rounded-xl"
              >
                {currentLang === 'en' ? 'Retry Camera' : 'पुनः प्रयास करें'}
              </button>
            </div>
          ) : capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured monument preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Overlay crosshair viewfinder */}
              <div className="absolute inset-8 border-2 border-white/40 rounded-2xl pointer-events-none flex flex-col justify-between p-4">
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-t-2 border-l-2 border-[#D4AF37]"></div>
                  <div className="w-4 h-4 border-t-2 border-r-2 border-[#D4AF37]"></div>
                </div>
                <div className="text-center">
                  <span className="text-[11px] bg-black/60 text-white/90 px-3 py-1 rounded-full font-medium backdrop-blur-xs">
                    {currentLang === 'en' ? 'Align monument within frame' : 'स्मारक को फ्रेम में रखें'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-b-2 border-l-2 border-[#D4AF37]"></div>
                  <div className="w-4 h-4 border-b-2 border-r-2 border-[#D4AF37]"></div>
                </div>
              </div>
            </>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Action Controls */}
        <div className="p-5 bg-[#FDFBF7] flex items-center justify-between gap-4">
          {capturedImage ? (
            <>
              <button
                onClick={retakePhoto}
                className="flex-1 py-3 px-4 rounded-xl border border-[#E8E2D9] text-[#5C544E] hover:bg-[#F3EEE7] text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{currentLang === 'en' ? 'Retake Photo' : 'फिर से खींचें'}</span>
              </button>
              <button
                onClick={confirmPhoto}
                className="flex-1 py-3 px-4 rounded-xl bg-[#2C4A3E] hover:bg-[#233a31] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>{currentLang === 'en' ? 'Analyze Image' : 'विश्लेषण करें'}</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={toggleFacingMode}
                className="p-3 rounded-xl border border-[#E8E2D9] hover:bg-[#F3EEE7] text-[#5C544E] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Switch Camera"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Flip</span>
              </button>

              <button
                onClick={capturePhoto}
                disabled={isInitializing || !!error}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-[#C05E42] hover:bg-[#a84d34] disabled:opacity-50 text-white font-serif-heritage text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <Camera className="w-5 h-5" />
                <span>{currentLang === 'en' ? 'Snap Photo' : 'फोटो लें'}</span>
              </button>

              <button
                onClick={onClose}
                className="p-3 rounded-xl border border-[#E8E2D9] hover:bg-[#F3EEE7] text-[#5C544E] text-xs font-semibold"
              >
                {currentLang === 'en' ? 'Cancel' : 'रद्द करें'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
