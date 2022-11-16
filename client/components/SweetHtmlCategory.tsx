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
import slugify from 'react-slugify';
import { CategoryType } from '../types';

export default function SweetHtmlCategory({
  category,
}: {
  category: CategoryType;
}) {
  const [name, setName] = useState(category.name || '');
  const [slug, setSlug] = useState(category.slug || '');

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
        <Input
          id='category-name'
          name='category-name'
          initialValue={name}
          value={name}
          labelPlaceholder='Tên'
          clearable
          onChange={(e) => {
            setName(e.target.value);
            setSlug(slugify(e.target.value));
          }}
        />

        <Spacer y={2} />
        <Input
          id='category-slug'
          name='category-slug'
          initialValue={slug}
          value={slug}
          labelPlaceholder='Slug'
          onChange={(e) => setSlug(e.target.value)}
        />

        <Spacer y={2} />
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
              defaultSelected={category.isActive}
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
