import { Input, InputProps, useInput } from '@nextui-org/react';
import React from 'react';
import { ValidateType } from '../lib/validate';

type Props = Partial<InputProps> & {
  validate: ValidateType;
  validText: string;
  inValidText: string;
};

export default function ValidateInput({
  validate,
  validText,
  inValidText,
  initialValue,
  ...props
}: Props) {
  const { value, reset, bindings } = useInput(initialValue || '');

  const helper = React.useMemo(() => {
    if (!value)
      return {
        text: '',
        color: '',
      };
    const isValid = validate(value);
    return {
      text: isValid ? validText : inValidText,
      color: isValid ? 'success' : 'error',
    };
  }, [value]);

  return (
    <Input
      {...props}
      {...bindings}
      onClearClick={reset}
      status={helper.color as 'success' | 'error'}
      color={helper.color as 'success' | 'error'}
      helperColor={helper.color as 'success' | 'error'}
      helperText={helper.text as 'success' | 'error'}
      clearable
    />
  );
}
