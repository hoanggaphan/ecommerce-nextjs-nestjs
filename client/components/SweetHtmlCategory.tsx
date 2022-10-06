import { Card, Spacer, Textarea, useInput } from '@nextui-org/react';
import { validateName, validateSlug, validateURL } from '../libs/validate';
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

  return (
    <Card>
      <Card.Body>
        <Spacer y={1} />
        <ValidateInput
          id='category-name'
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
        <ValidateInput
          id='category-img'
          initialValue={imgValueModal}
          value={imgValueModal}
          reset={resetImgModal}
          bindings={imgBindingsModal}
          validate={validateURL}
          labelPlaceholder='Hình ảnh'
          validText='Hình ảnh hợp lệ'
          inValidText='Đường dẫn không hợp lệ'
          type='url'
        />
        <Spacer y={3} />
        <Textarea
          id='category-des'
          initialValue={desValueModal}
          {...desBindingsModal}
          labelPlaceholder='Mô tả'
          rows={5}
        />
      </Card.Body>
    </Card>
  );
}
