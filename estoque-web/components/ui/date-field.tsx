// components/DateField.tsx
import * as React from 'react';
import TextField from '@mui/material/TextField';
import { useRifm } from 'rifm';
import { createDateFromParts, formatDateToDisplay, isValidDate, parseDateString } from '@/utils/dateFormatter';

interface DateFieldProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  format?: string;
  label?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
}

const MASK_USER_INPUT_SYMBOL = '_';
const ACCEPT_REGEX = /[\d]/gi;
const DEFAULT_FORMAT = 'DD/MM/YYYY';

export const DateField: React.FC<DateFieldProps> = ({
  value,
  onChange,
  format = DEFAULT_FORMAT,
  label = 'Data',
  error = false,
  helperText,
  disabled = false,
  required = false,
}) => {
  const [inputValue, setInputValue] = React.useState<string>(() => 
    formatDateToDisplay(value, format)
  );

  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const newDisplayValue = formatDateToDisplay(value, format);
    if (newDisplayValue !== inputValue) {
      setInputValue(newDisplayValue);
    }
  }, [value, format]);

  const handleInputValueChange = (newInputValue: string) => {
    setInputValue(newInputValue);

    // Parse da data
    const parsed = parseDateString(newInputValue);
    if (parsed) {
      const newDate = createDateFromParts(parsed);
      if (isValidDate(newDate)) {
        onChange(newDate);
        return;
      }
    }
    
    // Se não conseguiu parsear, limpa o valor
    onChange(null);
  };

  const rifmFormat = React.useMemo(() => {
    // Cria máscara baseada no formato
    const mask = format.replace(/[DMY]/g, MASK_USER_INPUT_SYMBOL);

    return function formatMaskedDate(valueToFormat: string) {
      let outputCharIndex = 0;
      return valueToFormat
        .split('')
        .map((character, characterIndex) => {
          ACCEPT_REGEX.lastIndex = 0;

          if (outputCharIndex > mask.length - 1) {
            return '';
          }

          const maskChar = mask[outputCharIndex];
          const nextMaskChar = mask[outputCharIndex + 1];

          const acceptedChar = ACCEPT_REGEX.test(character) ? character : '';
          const formattedChar =
            maskChar === MASK_USER_INPUT_SYMBOL
              ? acceptedChar
              : maskChar + acceptedChar;

          outputCharIndex += formattedChar.length;

          const isLastCharacter = characterIndex === valueToFormat.length - 1;
          if (
            isLastCharacter &&
            nextMaskChar &&
            nextMaskChar !== MASK_USER_INPUT_SYMBOL
          ) {
            return formattedChar ? formattedChar + nextMaskChar : '';
          }

          return formattedChar;
        })
        .join('');
    };
  }, [format]);

  const rifmProps = useRifm({
    value: inputValue,
    onChange: handleInputValueChange,
    format: rifmFormat,
  });

  return (
    <TextField
      label={label}
      size='small'
      inputRef={inputRef}
      placeholder={format}
      error={error}
      helperText={helperText}
      disabled={disabled}
      required={required}
      {...rifmProps}
    />
  );
};