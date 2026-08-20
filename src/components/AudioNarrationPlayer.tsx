import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  Sparkles, 
  RotateCcw,
  VolumeX
} from 'lucide-react';
import { speechNarrator } from '../utils/speech';

interface AudioNarrationPlayerProps {
  textToNarrate: string;
  lang: 'en' | 'hi';
  monumentTitle: string;
}

export const AudioNarrationPlayer: React.FC<AudioNarrationPlayerProps> = ({
  textToNarrate,
  lang,
  monumentTitle
}) => {
  const [playbackState, setPlaybackState] = useState<'stopped' | 'playing' | 'paused'>('stopped');
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    setIsSupported(speechNarrator.isAvailable());
    return () => {
      speechNarrator.stop();
    };
  }, []);

  useEffect(() => {
    // If language or text changes while active, stop speech cleanly
    if (playbackState !== 'stopped') {
      speechNarrator.stop();
      setPlaybackState('stopped');
    }
  }, [textToNarrate, lang]);

  const handlePlay = () => {
    speechNarrator.speak({
      text: textToNarrate,
      lang: lang,
      rate: 0.92,
      onStart: () => setPlaybackState('playing'),
      onEnd: () => setPlaybackState('stopped'),
      onError: () => setPlaybackState('stopped')
    });
  };

  const handlePause = () => {
    speechNarrator.pause();
    setPlaybackState('paused');
  };

  const handleResume = () => {
    speechNarrator.resume();
    setPlaybackState('playing');
  };

  const handleStop = () => {
    speechNarrator.stop();
    setPlaybackState('stopped');
  };

  if (!isSupported) {
    return (
      <div 
        id="audio-narration-unsupported"
        className="bg-[#F3EEE7] border border-[#E8E2D9] rounded-3xl p-5 sm:p-6 flex flex-col gap-3 text-xs shadow-2xs"
      >
        <div className="flex items-center gap-2.5 text-[#C05E42] font-bold">
          <VolumeX className="w-5 h-5 shrink-0" />
          <span className="font-serif-heritage text-sm text-[#1A1A1A]">
            {lang === 'en' ? 'Speech Synthesis Unavailable' : 'ध्वनि वाचन उपलब्ध नहीं है'}
          </span>
        </div>
        <p className="text-[#5C544E] leading-relaxed">
          {lang === 'en'
            ? 'Web Speech voice synthesis is not supported or was blocked by your browser settings.'
            : 'वेब स्पीच वॉइस सिंथेसिस इस ब्राउज़र में समर्थित नहीं है या सेटिंग्स द्वारा अवरोधित है।'}
        </p>
        <div className="pt-2 border-t border-[#E8E2D9] text-[11px] text-[#8C8276] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
          <span>
            {lang === 'en'
              ? 'What to do: You can read the complete verified history and architecture breakdown text directly below.'
              : 'सुझाव: आप नीचे दिए गए अनुभागों में पूर्ण प्रमाणित इतिहास और स्थापत्य विवरण पढ़ सकते हैं।'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div 
      id="audio-narration-panel"
      className="bg-[#FDFBF7] border border-[#E8E2D9] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col gap-4 relative overflow-hidden"
    >
      {/* Subtle top decoration bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors shadow-2xs ${
            playbackState === 'playing'
              ? 'bg-[#C05E42] text-white animate-pulse'
              : 'bg-[#2C4A3E] text-[#D4AF37]'
          }`}>
            <Volume2 className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-[#1A1A1A] font-serif-heritage">
                {lang === 'en' ? 'Audio Story & Narration' : 'ऑडियो कहानी व विवरण'}
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C05E42]/10 text-[#C05E42] font-bold uppercase tracking-wider">
                {lang === 'en' ? 'English Guide' : 'हिन्दी स्वर'}
              </span>
            </div>
            <p className="text-xs text-[#5C544E] mt-0.5">
              {playbackState === 'playing'
                ? lang === 'en' ? `Playing verified story for ${monumentTitle}...` : `${monumentTitle} का विवरण सुनाया जा रहा है...`
                : playbackState === 'paused'
                ? lang === 'en' ? 'Narration paused.' : 'ऑडियो विवरण रोका गया है।'
                : lang === 'en' ? 'Listen to verified historical context, architecture & stories.' : 'प्रमाणित इतिहास, वास्तुकला और कहानियाँ सुनें।'}
            </p>
          </div>
        </div>

        {/* Animated equalizer waves when playing */}
        {playbackState === 'playing' && (
          <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-[#F3EEE7] rounded-xl border border-[#E8E2D9]">
            <span className="w-1 h-3 bg-[#C05E42] animate-bounce" />
            <span className="w-1 h-5 bg-[#D4AF37] animate-bounce [animation-delay:0.15s]" />
            <span className="w-1 h-2 bg-[#2C4A3E] animate-bounce [animation-delay:0.3s]" />
            <span className="w-1 h-4 bg-[#C05E42] animate-bounce [animation-delay:0.45s]" />
          </div>
        )}
      </div>

      {/* Audio Action Buttons: Listen, Pause, Resume, Stop */}
      <div 
        id="audio-controls-row"
        className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-[#E8E2D9]"
      >
        {/* Play / Listen Button */}
        {playbackState === 'stopped' && (
          <button
            type="button"
            id="audio-btn-listen"
            onClick={handlePlay}
            className="min-h-[44px] flex-1 sm:flex-initial py-2.5 px-6 rounded-xl bg-[#2C4A3E] hover:bg-[#223930] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-98 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
          >
            <Play className="w-4 h-4 fill-current text-[#D4AF37]" />
            <span className={lang === 'hi' ? 'font-devanagari text-sm' : ''}>
              {lang === 'en' ? 'Listen' : 'ऑडियो सुनें'}
            </span>
          </button>
        )}

        {/* Pause Button */}
        {playbackState === 'playing' && (
          <button
            type="button"
            id="audio-btn-pause"
            onClick={handlePause}
            className="min-h-[44px] flex-1 sm:flex-initial py-2.5 px-6 rounded-xl bg-[#8C6B14] hover:bg-[#73570f] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-98 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
          >
            <Pause className="w-4 h-4 fill-current" />
            <span className={lang === 'hi' ? 'font-devanagari text-sm' : ''}>
              {lang === 'en' ? 'Pause' : 'रोकें (Pause)'}
            </span>
          </button>
        )}

        {/* Resume Button */}
        {playbackState === 'paused' && (
          <button
            type="button"
            id="audio-btn-resume"
            onClick={handleResume}
            className="min-h-[44px] flex-1 sm:flex-initial py-2.5 px-6 rounded-xl bg-[#2C4A3E] hover:bg-[#223930] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-98 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
          >
            <Play className="w-4 h-4 fill-current text-[#D4AF37]" />
            <span className={lang === 'hi' ? 'font-devanagari text-sm' : ''}>
              {lang === 'en' ? 'Resume' : 'फिर से चलाएं (Resume)'}
            </span>
          </button>
        )}

        {/* Stop Button */}
        <button
          type="button"
          id="audio-btn-stop"
          onClick={handleStop}
          disabled={playbackState === 'stopped'}
          className={`min-h-[44px] py-2.5 px-5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all focus-visible:ring-2 focus-visible:ring-[#C05E42] ${
            playbackState !== 'stopped'
              ? 'bg-white hover:bg-[#F3EEE7] border-[#E8E2D9] text-[#C05E42] cursor-pointer'
              : 'bg-[#F3EEE7]/50 border-transparent text-[#8C8276] opacity-60 cursor-not-allowed'
          }`}
        >
          <Square className="w-3.5 h-3.5 fill-current" />
          <span className={lang === 'hi' ? 'font-devanagari' : ''}>
            {lang === 'en' ? 'Stop' : 'बंद करें'}
          </span>
        </button>

        {/* Status Indicator */}
        <div className="ml-auto text-[11px] font-semibold text-[#8C8276] flex items-center gap-2 py-1">
          <span className={`w-2.5 h-2.5 rounded-full ${
            playbackState === 'playing' ? 'bg-emerald-500 animate-ping' :
            playbackState === 'paused' ? 'bg-amber-500' : 'bg-gray-400'
          }`} />
          <span className={lang === 'hi' ? 'font-devanagari' : ''}>
            {playbackState === 'playing'
              ? (lang === 'en' ? 'Speaking' : 'चल रहा है')
              : playbackState === 'paused'
              ? (lang === 'en' ? 'Paused' : 'रुका हुआ')
              : (lang === 'en' ? 'Ready' : 'तैयार')}
          </span>
        </div>
      </div>
    </div>
  );
};
