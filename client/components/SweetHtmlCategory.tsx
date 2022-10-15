import {
  Card,
  Checkbox,
  Col,
  Input,
  Row,
  Spacer,
  Textarea,
  useInput,
} from '@nextui-org/react';
import { useState } from 'react';
import { validateName, validateSlug } from '../libs/validate';
import { CategoryType } from '../types';
import ValidateInput from './common/ValidateInput';

export default function SweetHtmlCategory({
  category,
}: {
  category: CategoryType;
}) {
  const {
    value: nameValueModal,
    reset: resetNameModal,
    bindings: nameBindingsModal,
  } = useInput(category.name || '');
  const {
    value: slugValueModal,
    reset: resetSlugModal,
    bindings: slugBindingsModal,
  } = useInput(category.slug || '');
  const {
    value: imgValueModal,
    reset: resetImgModal,
    bindings: imgBindingsModal,
  } = useInput(category.image || '');
  const {
    value: desValueModal,
    reset: resetDesModal,
    bindings: desBindingsModal,
  } = useInput(category.description || '');
  const [checkbox, setCheckbox] = useState(false);

  return (
    <Card>
      <Card.Body>
        <Spacer y={1} />
        <ValidateInput
          id='category-name'
          name='category-name'
          initialValue={nameValueModal}
          value={nameValueModal}
          reset={resetNameModal}
          bindings={nameBindingsModal}
          validate={validateName}
          labelPlaceholder='Tên'
          validText='Tên hợp lệ'
          inValidText='Tên không hợp lệ'
        />

        <Spacer y={3} />
        <ValidateInput
          id='category-slug'
          name='category-slug'
          initialValue={slugValueModal}
          value={slugValueModal}
          reset={resetSlugModal}
          bindings={slugBindingsModal}
          validate={validateSlug}
          labelPlaceholder='Slug'
          validText='Slug hợp lệ'
          inValidText='Slug không hợp lệ'
        />
        <Spacer y={3} />
        <Input
          id='category-img'
          name='category-img'
          initialValue={imgValueModal}
          {...imgBindingsModal}
          labelPlaceholder='Hình ảnh'
          type='url'
        />
        <Spacer y={3} />
        <Textarea
          id='category-des'
          name='category-des'
          initialValue={desValueModal}
          {...desBindingsModal}
          labelPlaceholder='Mô tả'
          rows={5}
        />
        <Spacer y={1} />
        <Row>
          <Col>
            <Checkbox
              id='category-active'
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
      </Card.Body>
    </Card>
  );
}
