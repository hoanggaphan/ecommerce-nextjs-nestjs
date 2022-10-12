import { Input, Tooltip } from '@nextui-org/react';
import {
  Control,
  useFieldArray,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';
import { AiOutlineDelete } from 'react-icons/ai';
import { GrAddCircle } from 'react-icons/gr';
import { IconButton } from '../pages/admin/product';
import { FormValues } from '../pages/admin/product/update/[id]';
import { OptionType } from '../types';
import NestedFieldArray from './NestedFieldArray';

type Props = {
  control: Control<FormValues, any>;
  register: UseFormRegister<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  getValues: UseFormGetValues<FormValues>;
  options: OptionType[];
  defaultOptionValues?: { name: string; checkbox: boolean; id: number }[];
  selected: boolean;
};

export default function Fields({
  control,
  register,
  setValue,
  getValues,
  options,
  defaultOptionValues,
  selected,
}: Props) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  return (
    <div>
      {selected ? (
        <>
          <div className='variant-title'>
            <h5>Biến thể:</h5>
            <Tooltip
              content='Thêm'
              onClick={() => {
                if (defaultOptionValues)
                  append({
                    price: 0,
                    quantity: 0,
                    optionValues: defaultOptionValues,
                  });
              }}
            >
              <IconButton type='button'>
                <GrAddCircle size={20} />
              </IconButton>
            </Tooltip>
          </div>

          <ul>
            {fields.map((item, index) => {
              return (
                <li key={item.id} className='variant-item'>
                  <div className='variant-top'>
                    <div className='variant-input-text'>
                      <Input
                        label='Số lượng'
                        type='number'
                        {...register(`variants.${index}.quantity`, {
                          required: true,
                          valueAsNumber: true,
                        })}
                        initialValue='0'
                        aria-label='variant-quantity'
                        min='0'
                      />
                    </div>
                    <div className='variant-input-text'>
                      <Input
                        label='Đơn giá'
                        type='number'
                        {...register(`variants.${index}.price`, {
                          required: true,
                          valueAsNumber: true,
                        })}
                        initialValue='0'
                        aria-label='variant-price'
                        min='0'
                      />
                    </div>
                    {fields.length > 1 && (
                      <Tooltip
                        content='Xóa'
                        color='error'
                        onClick={() => remove(index)}
                      >
                        <IconButton type='button'>
                          <AiOutlineDelete size={20} fill='#FF0080' />
                        </IconButton>
                      </Tooltip>
                    )}
                  </div>

                  {options && (
                    <NestedFieldArray
                      nestIndex={index}
                      {...{ control, register, options }}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <div>
          {' '}
          <div className='variant-top'>
            <div className='variant-input-text'>
              <Input
                label='Số lượng'
                type='number'
                initialValue='0'
                id={`variant.quantity`}
                {...register(`variant.quantity`, {
                  required: true,
                  valueAsNumber: true,
                })}
                min='0'
              />
            </div>
            <div className='variant-input-text'>
              <Input
                label='Đơn giá'
                type='number'
                initialValue='0'
                id={`variant.price`}
                {...register(`variant.price`, {
                  required: true,
                  valueAsNumber: true,
                })}
                min='0'
              />
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        .variant-top {
          display: flex;
          align-items: center;
          column-gap: 15px;
          margin-bottom: 5px;
        }
        .variant-input-text {
          display: flex;
          align-items: center;
        }
        .variant-item {
          padding-top: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid;
          margin-bottom: 0;
        }
        .variant-title {
          display: flex;
          align-items: center;
          column-gap: 10px;
          margin-bottom: 10px;
        }
        .variant-title h5 {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
}
