import { Card, Spacer, Textarea, useInput } from '@nextui-org/react';
import { validateName, validateSlug, validateURL } from '../libs/validate';
import ValidateInput from './common/ValidateInput';

export default function SweetHtmlProductAdd() {
  const {
    value: nameValueModal,
    reset: resetNameModal,
    bindings: nameBindingsModal,
  } = useInput('');
  const {
    value: slugValueModal,
    reset: resetSlugModal,
    bindings: slugBindingsModal,
  } = useInput('');
  const {
    value: imgValueModal,
    reset: resetImgModal,
    bindings: imgBindingsModal,
  } = useInput('');
  const {
    value: desValueModal,
    reset: resetDesModal,
    bindings: desBindingsModal,
  } = useInput('');

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
