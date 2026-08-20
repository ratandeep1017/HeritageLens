export interface SpeechOptions {
  text: string;
  lang: 'en' | 'hi';
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

class SpeechNarrator {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public isAvailable(): boolean {
    return !!this.synth;
  }

  public speak(options: SpeechOptions): void {
    if (!this.synth) {
      console.warn('Speech synthesis is not supported in this browser.');
      options.onError?.('Speech synthesis not supported');
      return;
    }

    // Stop any existing speech
    this.stop();

    const utterance = new SpeechSynthesisUtterance(options.text);
    this.currentUtterance = utterance;

    utterance.lang = options.lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = options.rate || 0.95;
    utterance.pitch = options.pitch || 1.0;

    // Try to find matching voice
    const voices = this.synth.getVoices();
    if (voices && voices.length > 0) {
      const preferredVoice = voices.find((v) =>
        options.lang === 'hi'
          ? v.lang.startsWith('hi')
          : v.lang === 'en-IN' || (v.lang.startsWith('en') && v.name.includes('India'))
      ) || voices.find((v) => options.lang === 'hi' ? v.lang.includes('hi') : v.lang.startsWith('en'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    }

    utterance.onstart = () => {
      this.isSpeakingState = true;
      options.onStart?.();
    };

    utterance.onend = () => {
      this.isSpeakingState = false;
      this.currentUtterance = null;
      options.onEnd?.();
    };

    utterance.onerror = (event) => {
      this.isSpeakingState = false;
      this.currentUtterance = null;
      options.onError?.(event);
    };

    this.synth.speak(utterance);
  }

  public pause(): void {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  public resume(): void {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeakingState = false;
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }
}

export const speechNarrator = new SpeechNarrator();
