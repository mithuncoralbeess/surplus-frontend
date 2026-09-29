"use client";

import React, { useEffect, useRef, memo } from 'react';
import intlTelInput from 'intl-tel-input';
import 'intl-tel-input/styles';

interface IntlPhoneInputProps {
  value?: string;
  onChange: (value: string) => void;
  defaultCountry?: string;
  className?: string;
  placeholder?: string;
}

const IntlPhoneInput = memo(function IntlPhoneInput({
  value = '',
  onChange,
  defaultCountry = 'us',
  className = '',
  placeholder = '',
}: IntlPhoneInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const itiRef = useRef<any>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!inputRef.current) return;

    const options: any = {
      initialCountry: defaultCountry.toLowerCase() || 'us',
      strictMode: false,
      separateDialCode: true,
      container: typeof document !== 'undefined' ? document.body : undefined,
      loadUtils: () => import('intl-tel-input/utils'),
    };

    itiRef.current = intlTelInput(inputRef.current, options);

    const updateValue = () => {
      if (itiRef.current && onChangeRef.current) {
        const fullNumber = itiRef.current.getNumber();
        onChangeRef.current(fullNumber);
      }
    };

    const inputEl = inputRef.current;
    inputEl.addEventListener('countrychange', updateValue);
    inputEl.addEventListener('input', updateValue);

    if (value && itiRef.current) {
      try {
        itiRef.current.setNumber(value);
      } catch {
        // Ignore setNumber error on partial string
      }
    }

    return () => {
      inputEl.removeEventListener('countrychange', updateValue);
      inputEl.removeEventListener('input', updateValue);
      if (itiRef.current) {
        itiRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="w-full intl-phone-container">
      <input
        ref={inputRef}
        type="tel"
        className={className}
        placeholder={placeholder}
      />
    </div>
  );
});

export default IntlPhoneInput;
