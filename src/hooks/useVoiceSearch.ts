"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseVoiceSearchProps {
  onTranscript: (transcript: string) => void;
  onError?: (error: string) => void;
}

export function useVoiceSearch({ onTranscript, onError }: UseVoiceSearchProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = 
        (window as any).SpeechRecognition || 
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setIsSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcript = event.results[current][0].transcript;
          if (transcript) {
            onTranscript(transcript);
          }
        };

        recognition.onerror = (event: any) => {
          setIsListening(false);
          if (onError) {
            onError(event.error || 'Voice recognition error');
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [onTranscript, onError]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      if (onError) onError('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error('Speech recognition error:', e);
      }
    }
  }, [isListening, onError]);

  return {
    isListening,
    isSupported,
    toggleListening
  };
}
