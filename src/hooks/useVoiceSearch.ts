"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseVoiceSearchProps {
  /** Called once with the final recognized phrase. */
  onTranscript: (transcript: string) => void;
  /** Optional: called with partial (in-progress) text while the user is speaking. */
  onInterimTranscript?: (transcript: string) => void;
  onError?: (error: string) => void;
  lang?: string;
}

export function useVoiceSearch({ onTranscript, onInterimTranscript, onError, lang = 'en-US' }: UseVoiceSearchProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);

  // Keep latest callbacks in refs so the recognizer is created only once
  // (inline callbacks from consumers would otherwise recreate & abort it on every render).
  const onTranscriptRef = useRef(onTranscript);
  const onInterimRef = useRef(onInterimTranscript);
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
    onInterimRef.current = onInterimTranscript;
    onErrorRef.current = onError;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    setIsSupported(true);
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = lang;

    const setListening = (value: boolean) => {
      isListeningRef.current = value;
      setIsListening(value);
    };

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event: any) => {
      let finalText = '';
      let interimText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interimText += result[0].transcript;
        }
      }
      if (interimText && onInterimRef.current) {
        onInterimRef.current(interimText);
      }
      if (finalText.trim()) {
        onTranscriptRef.current(finalText.trim());
      }
    };

    recognition.onerror = (event: any) => {
      setListening(false);
      const code = event?.error;
      const message =
        code === 'not-allowed' || code === 'service-not-allowed'
          ? 'Microphone access was denied. Please allow microphone permission in your browser.'
          : code === 'no-speech'
            ? 'No speech detected. Please try again.'
            : code === 'network'
              ? 'Voice recognition needs an internet connection.'
              : code || 'Voice recognition error';
      if (onErrorRef.current) onErrorRef.current(message);
      else console.warn('Voice search:', message);
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.abort();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    };
  }, [lang]);

  const toggleListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      onErrorRef.current?.('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListeningRef.current) {
      try {
        recognition.stop();
      } catch {
        // ignore
      }
      isListeningRef.current = false;
      setIsListening(false);
    } else {
      try {
        recognition.start();
        isListeningRef.current = true;
        setIsListening(true);
      } catch (e) {
        console.error('Speech recognition error:', e);
      }
    }
  }, []);

  return {
    isListening,
    isSupported,
    toggleListening
  };
}
