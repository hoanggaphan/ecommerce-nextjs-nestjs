import { FormElement, Input, InputProps } from '@nextui-org/react';
import { BindingsChangeTarget } from '@nextui-org/react/types/use-input/use-input';
import React from 'react';
import { ValidateType } from '../../libs/validate';

type Props = Partial<InputProps> & {
  validate: ValidateType;
  validText: string;
  inValidText: string;
  value: string;
  reset: () => void;
  bindings: {
    value: string;
    onChange: (event: BindingsChangeTarget) => void;
  };
};

export default React.forwardRef(function ValidateInput(
  {
    validate,
    validText,
    inValidText,
    initialValue,
    value,
    reset,
    bindings,
    ...props
  }: Props,
  ref: React.Ref<FormElement> | undefined
) {
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
      ref={ref}
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
});
