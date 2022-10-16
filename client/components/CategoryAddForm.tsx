import {
  Button,
  Card,
  Checkbox,
  Col,
  Input,
  Row,
  Spacer,
  Textarea,
  useInput
} from '@nextui-org/react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import api from '../libs/api';
import { useAdminCategory } from '../libs/swr/useAdminCategory';
import { validateName, validateSlug } from '../libs/validate';
import ValidateInput from './common/ValidateInput';

export default function CategoryAddForm() {
  const { mutate } = useAdminCategory();

  const {
    value: nameValue,
    reset: resetName,
    bindings: nameBindings,
  } = useInput('');
  const {
    value: slugValue,
    reset: resetSlug,
    bindings: slugBindings,
  } = useInput('');
  const {
    value: imgValue,
    reset: resetImg,
    bindings: imgBindings,
  } = useInput('');
  const {
    value: desValue,
    reset: resetDes,
    bindings: desBindings,
  } = useInput('');
  const [checkbox, setCheckbox] = useState(false);

  const handleCreateCategory = async () => {
    if (!nameValue || !slugValue) return;

    if (!validateName(nameValue) || !validateSlug(slugValue)) return;

    try {
      const newItem = {
        name: nameValue,
        slug: slugValue,
        image: imgValue,
        description: desValue,
        isActive: checkbox,
      };
      const res = await api.post('http://localhost:4000/category', newItem);
      Swal.fire({
        title: 'Tạo thành công!',
        icon: 'success',
      });
      resetName();
      resetSlug();
      resetImg();
      resetDes();
      mutate();
    } catch (error: any) {
      Swal.fire({
        title: 'Tạo danh mục thất bại!',
        text: error.response.data.message,
        icon: 'error',
      });
    }
  };

  return (
    <Card>
      <Card.Body>
        <Spacer y={1} />
        <ValidateInput
          value={nameValue}
          reset={resetName}
          bindings={nameBindings}
          validate={validateName}
          labelPlaceholder='Tên'
          validText='Tên hợp lệ'
          inValidText='Tên không hợp lệ'
        />
        <Spacer y={3} />
        <ValidateInput
          value={slugValue}
          reset={resetSlug}
          bindings={slugBindings}
          validate={validateSlug}
          labelPlaceholder='Slug'
          validText='Slug hợp lệ'
          inValidText='Slug không hợp lệ'
        />
        <Spacer y={3} />
        <Input {...imgBindings} labelPlaceholder='Hình ảnh' type='url' />
        <Spacer y={3} />
        <Textarea {...desBindings} labelPlaceholder='Mô tả' rows={4} />
        <Spacer y={1} />
        <Row>
          <Col>
            <Checkbox
              size='sm'
              color='secondary'
              onChange={(isSelected) => {
                setCheckbox(isSelected);
              }}
            >
              Hiển thị
            </Checkbox>
          </Col>
        </Row>
        <Spacer y={1} />
        <Button onPress={handleCreateCategory} shadow color='secondary' auto>
          Tạo danh mục
        </Button>
      </Card.Body>
    </Card>
  );
}
