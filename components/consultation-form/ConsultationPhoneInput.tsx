'use client';

import PhoneInput from 'react-phone-input-2';
import pl from 'react-phone-input-2/lang/pl.json';

import { cn } from '@/lib/utils';

import 'react-phone-input-2/lib/style.css';

type ConsultationPhoneInputProps = {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  hasError?: boolean;
  variant?: 'drawer' | 'embedded';
  id?: string;
};

export default function ConsultationPhoneInput({
  value,
  onChange,
  onFocus,
  hasError,
  variant = 'drawer',
  id,
}: ConsultationPhoneInputProps) {
  return (
    <div
      className={cn(
        'consultation-phone-input',
        variant === 'drawer' ? 'consultation-phone-input--drawer' : 'consultation-phone-input--embedded',
        hasError && 'consultation-phone-input--error',
      )}
    >
      <PhoneInput
        country="pl"
        value={value}
        onChange={onChange}
        localization={pl}
        inputProps={{
          id,
          name: 'phone',
          required: true,
          autoComplete: 'tel',
          onFocus,
        }}
        countryCodeEditable={false}
        enableSearch
        searchPlaceholder="Szukaj kraju"
        preferredCountries={['pl', 'de', 'gb', 'ua', 'cz', 'sk']}
        placeholder="np. 512 345 678"
      />
    </div>
  );
}
